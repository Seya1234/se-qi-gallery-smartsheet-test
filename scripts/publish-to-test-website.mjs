import { existsSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import {
  COMMON_COLUMN_TITLES,
  DEFAULT_IMAGES_DIRECTORY,
  PUBLISHED_STATUS,
  READY_TO_PUBLISH_STATUS,
  SMARTSHEET_API_BASE,
  ValidationError,
  buildCaseSensitiveImageFilenameSet,
  buildColumnLookup,
  formatDateForWebsite,
  generatePreviewRecords,
  getCellText,
  getDateCellValue,
  requireEnv,
  rowIdentifier,
  trimText
} from "./generate-projects-preview.mjs";

export const TEST_REPOSITORY = "Seya1234/se-qi-gallery-smartsheet-test";
export const MAIN_BRANCH = "main";
export const CONFIRMATION_PHRASE = "PUBLISH TEST";
export const PROJECTS_OUTPUT_PATH = "data/projects.json";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const SUPPORTED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const JPEG_EXTENSIONS = new Set([".jpg", ".jpeg"]);

export class PublishValidationError extends Error {
  constructor(errors) {
    super("Publishing validation failed.");
    this.name = "PublishValidationError";
    this.errors = errors;
  }
}

function getGitHubRefName(env = process.env) {
  return env.GITHUB_REF_NAME || trimText(env.GITHUB_REF).replace(/^refs\/heads\//, "");
}

export function assertManualPublishGuards({
  confirmation = process.env.INPUT_CONFIRMATION || process.env.CONFIRMATION,
  repository = process.env.GITHUB_REPOSITORY,
  refName = getGitHubRefName()
} = {}) {
  const errors = [];

  if (confirmation !== CONFIRMATION_PHRASE) {
    errors.push(`confirmation must be exactly ${CONFIRMATION_PHRASE}`);
  }

  if (repository !== TEST_REPOSITORY) {
    errors.push(`repository must be ${TEST_REPOSITORY}`);
  }

  if (refName !== MAIN_BRANCH) {
    errors.push(`branch must be ${MAIN_BRANCH}`);
  }

  if (errors.length > 0) {
    throw new Error(`Publish guard failed: ${errors.join("; ")}.`);
  }
}

export function getVancouverIsoDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function toWebsiteDateFromIso(isoDate) {
  return formatDateForWebsite(isoDate);
}

export function parseWebsiteDateToIso(value) {
  const text = trimText(value);
  const match = text.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!match) return "";

  const monthLookup = new Map(
    Array.from({ length: 12 }, (_, index) => {
      const monthName = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        timeZone: "UTC"
      }).format(new Date(Date.UTC(2026, index, 1)));
      return [monthName.toLowerCase(), String(index + 1).padStart(2, "0")];
    })
  );

  const [, day, monthName, year] = match;
  const month = monthLookup.get(monthName.toLowerCase());
  if (!month) return "";

  return `${year}-${month}-${String(Number(day)).padStart(2, "0")}`;
}

function normalizeDateCellToIso(value) {
  const text = trimText(value);
  if (!text) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
}

function extractImageFilename(record) {
  const photo = trimText(record?.photo);
  if (!photo.startsWith(`${DEFAULT_IMAGES_DIRECTORY}/`)) return "";

  const filename = photo.slice(`${DEFAULT_IMAGES_DIRECTORY}/`.length);
  if (!filename || filename.includes("/") || filename.includes("\\")) return "";

  return filename;
}

export function buildExistingRecordLookups(records) {
  const byId = new Map();
  const imageOwnerByFilename = new Map();

  for (const record of records || []) {
    const id = trimText(record?.id);
    if (!id) continue;

    byId.set(id, record);
    const filename = extractImageFilename(record);
    if (filename) imageOwnerByFilename.set(filename, id);
  }

  return { byId, imageOwnerByFilename };
}

export function sanitizeRecordIdForFilename(recordId) {
  return trimText(recordId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSupportedImageExtension(attachment) {
  const extension = extname(trimText(attachment?.name)).toLowerCase();
  if (!SUPPORTED_IMAGE_EXTENSIONS.has(extension)) return "";
  return JPEG_EXTENSIONS.has(extension) ? ".jpg" : extension;
}

function getAttachmentSizeBytes(attachment) {
  if (Number.isFinite(attachment?.sizeInBytes)) return Number(attachment.sizeInBytes);
  if (Number.isFinite(attachment?.size)) return Number(attachment.size);
  if (Number.isFinite(attachment?.sizeInKb)) return Number(attachment.sizeInKb) * 1024;
  return undefined;
}

export function selectSingleSupportedImageAttachment(recordId, attachments) {
  const supported = (attachments || []).filter(attachment => getSupportedImageExtension(attachment));

  if (supported.length === 0) {
    throw new PublishValidationError([
      {
        recordId,
        issue: "Expected exactly one supported image attachment; found 0"
      }
    ]);
  }

  if (supported.length > 1) {
    throw new PublishValidationError([
      {
        recordId,
        issue: `Expected exactly one supported image attachment; found ${supported.length}`
      }
    ]);
  }

  const [attachment] = supported;
  const sizeBytes = getAttachmentSizeBytes(attachment);
  if (sizeBytes !== undefined && sizeBytes > MAX_IMAGE_BYTES) {
    throw new PublishValidationError([
      {
        recordId,
        issue: "Image attachment exceeds 10 MB"
      }
    ]);
  }

  return attachment;
}

export function generatedImageFilename(recordId, attachment) {
  const stem = sanitizeRecordIdForFilename(recordId);
  const extension = getSupportedImageExtension(attachment);

  if (!stem) {
    throw new PublishValidationError([
      {
        recordId: recordId || "<missing>",
        issue: "Website record ID cannot be converted into an image filename"
      }
    ]);
  }

  if (!extension) {
    throw new PublishValidationError([
      {
        recordId,
        issue: "Unsupported image attachment type"
      }
    ]);
  }

  return `${stem}${extension}`;
}

function buildPublicationDateForRow(row, columnLookup, existingRecord, fallbackDate) {
  const sheetDate = getDateCellValue(row, columnLookup.get(COMMON_COLUMN_TITLES.publicationDate));
  const sheetIso = normalizeDateCellToIso(sheetDate);

  if (sheetDate && !sheetIso) {
    throw new Error("Website publication date is not a recognized date.");
  }

  if (sheetIso) {
    return {
      publishedOn: toWebsiteDateFromIso(sheetIso),
      isoDate: sheetIso,
      source: "smartsheet",
      wasBlankInSmartsheet: false
    };
  }

  const existingPublishedOn = trimText(existingRecord?.publishedOn);
  if (existingPublishedOn) {
    const existingIso = parseWebsiteDateToIso(existingPublishedOn);
    if (!existingIso) {
      throw new Error("Existing website publication date is not a recognized date.");
    }

    return {
      publishedOn: existingPublishedOn,
      isoDate: existingIso,
      source: "existing",
      wasBlankInSmartsheet: true
    };
  }

  const isoDate = getVancouverIsoDate(fallbackDate);
  return {
    publishedOn: toWebsiteDateFromIso(isoDate),
    isoDate,
    source: "vancouver-now",
    wasBlankInSmartsheet: true
  };
}

async function smartsheetJson(path, accessToken, { method = "GET", body, operation } = {}) {
  const response = await fetch(`${SMARTSHEET_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(
      `${operation || "Smartsheet API request"} failed with HTTP ${response.status} ${response.statusText}.`
    );
  }

  return response.json();
}

async function fetchSheet(sheetId, accessToken) {
  return smartsheetJson(`/sheets/${encodeURIComponent(sheetId)}`, accessToken, {
    operation: "Fetch Smartsheet sheet"
  });
}

async function fetchRowAttachments(sheetId, accessToken, rowId) {
  const row = await smartsheetJson(
    `/sheets/${encodeURIComponent(sheetId)}/rows/${encodeURIComponent(rowId)}?include=attachments`,
    accessToken,
    {
      operation: "Fetch row attachments"
    }
  );

  return row.attachments || [];
}

async function fetchAttachmentMetadata(sheetId, accessToken, attachmentId) {
  return smartsheetJson(
    `/sheets/${encodeURIComponent(sheetId)}/attachments/${encodeURIComponent(attachmentId)}`,
    accessToken,
    {
      operation: "Fetch attachment metadata"
    }
  );
}

async function downloadAttachmentBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Attachment download failed with HTTP ${response.status} ${response.statusText}.`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function makeDefaultAttachmentClient(sheetId, accessToken) {
  return {
    async listRowAttachments(row) {
      return fetchRowAttachments(sheetId, accessToken, row.id);
    },
    async getAttachmentMetadata(attachment) {
      return fetchAttachmentMetadata(sheetId, accessToken, attachment.id);
    },
    async downloadAttachment(metadata) {
      if (!metadata?.url) {
        throw new Error("Smartsheet attachment metadata did not include a download URL.");
      }
      return downloadAttachmentBytes(metadata.url);
    }
  };
}

function makeRecordError(recordId, issue) {
  return {
    recordId: recordId || "<missing>",
    issue
  };
}

function toValidationErrors(error, fallbackRecordId) {
  if (error instanceof PublishValidationError || error instanceof ValidationError) {
    return error.errors;
  }

  return [makeRecordError(fallbackRecordId, error.message)];
}

async function resolvePhotoFilename({
  row,
  recordId,
  columnLookup,
  existingRecord,
  existingImageFilenames,
  imageOwnerByFilename,
  plannedImageOwners,
  tempDirectory,
  attachmentClient
}) {
  const sourceFilename = getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.photoFilename));

  if (
    sourceFilename &&
    !sourceFilename.includes("/") &&
    !sourceFilename.includes("\\") &&
    existingImageFilenames.has(sourceFilename)
  ) {
    return {
      filename: sourceFilename,
      mode: "reused-existing-smartsheet"
    };
  }

  const existingRecordFilename = extractImageFilename(existingRecord);
  if (!sourceFilename && existingRecordFilename && existingImageFilenames.has(existingRecordFilename)) {
    return {
      filename: existingRecordFilename,
      mode: "reused-existing-record"
    };
  }

  const attachments = await attachmentClient.listRowAttachments(row, recordId);
  const selectedAttachment = selectSingleSupportedImageAttachment(recordId, attachments);
  const filename = generatedImageFilename(recordId, selectedAttachment);
  const existingOwner = imageOwnerByFilename.get(filename);
  const plannedOwner = plannedImageOwners.get(filename);

  if (plannedOwner && plannedOwner !== recordId) {
    throw new PublishValidationError([
      makeRecordError(recordId, `Generated image path already planned for ${plannedOwner}`)
    ]);
  }

  if (existingImageFilenames.has(filename)) {
    if (existingOwner && existingOwner !== recordId) {
      throw new PublishValidationError([
        makeRecordError(recordId, "Generated image path already belongs to another record")
      ]);
    }

    return {
      filename,
      mode: "reused-generated-existing"
    };
  }

  const metadata = await attachmentClient.getAttachmentMetadata(selectedAttachment, recordId);
  const bytes = await attachmentClient.downloadAttachment(metadata, recordId);
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new PublishValidationError([makeRecordError(recordId, "Downloaded image exceeds 10 MB")]);
  }

  const tempPath = join(tempDirectory, filename);
  await writeFile(tempPath, bytes);
  plannedImageOwners.set(filename, recordId);

  return {
    filename,
    mode: "downloaded",
    tempPath,
    bytes: bytes.length
  };
}

export async function buildPublishPlan({
  sheet,
  currentRecords = [],
  imagesDirectory = DEFAULT_IMAGES_DIRECTORY,
  fallbackDate = new Date(),
  tempDirectory,
  attachmentClient
}) {
  const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
  const columnLookup = buildColumnLookup(sheet.columns || []);
  const eligibleStatuses = [READY_TO_PUBLISH_STATUS, PUBLISHED_STATUS];
  const eligibleRows = rows.filter(row =>
    eligibleStatuses.includes(
      getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.publicationStatus))
    )
  );
  const readyRows = rows.filter(
    row =>
      getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.publicationStatus)) ===
      READY_TO_PUBLISH_STATUS
  );
  const errors = [];

  const seenRecordIds = new Set();
  for (const row of eligibleRows) {
    const recordId = getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.recordId));
    if (!recordId) {
      errors.push(makeRecordError("<missing>", "Missing required field: Website record ID"));
      continue;
    }
    if (seenRecordIds.has(recordId)) {
      errors.push(makeRecordError(recordId, "Duplicate Website record ID"));
    }
    seenRecordIds.add(recordId);
  }

  if (errors.length > 0) {
    throw new PublishValidationError(errors);
  }

  const { byId: existingRecordsById, imageOwnerByFilename } =
    buildExistingRecordLookups(currentRecords);
  const existingImageFilenames = buildCaseSensitiveImageFilenameSet(imagesDirectory);
  const plannedImageOwners = new Map();
  const photoFilenameByRecordId = new Map();
  const publishedOnByRecordId = new Map();
  const publicationIsoByRecordId = new Map();
  const publicationDateBlankByRecordId = new Map();
  const downloadedImages = [];
  const reusedImageRecordIds = [];

  for (const row of eligibleRows) {
    const recordId = rowIdentifier(row, columnLookup);
    const existingRecord = existingRecordsById.get(recordId);

    try {
      const publicationDate = buildPublicationDateForRow(
        row,
        columnLookup,
        existingRecord,
        fallbackDate
      );
      publishedOnByRecordId.set(recordId, publicationDate.publishedOn);
      publicationIsoByRecordId.set(recordId, publicationDate.isoDate);
      publicationDateBlankByRecordId.set(recordId, publicationDate.wasBlankInSmartsheet);

      const photo = await resolvePhotoFilename({
        row,
        recordId,
        columnLookup,
        existingRecord,
        existingImageFilenames,
        imageOwnerByFilename,
        plannedImageOwners,
        tempDirectory,
        attachmentClient
      });

      photoFilenameByRecordId.set(recordId, photo.filename);

      if (photo.mode === "downloaded") {
        downloadedImages.push({
          recordId,
          filename: photo.filename,
          tempPath: photo.tempPath,
          bytes: photo.bytes
        });
      } else {
        reusedImageRecordIds.push(recordId);
      }
    } catch (error) {
      errors.push(...toValidationErrors(error, recordId));
    }
  }

  if (errors.length > 0) {
    throw new PublishValidationError(errors);
  }

  const finalImageFilenames = new Set([
    ...existingImageFilenames,
    ...downloadedImages.map(image => image.filename)
  ]);

  let generated;
  try {
    generated = generatePreviewRecords(sheet, {
      eligiblePublicationStatuses: eligibleStatuses,
      photoFilenameByRecordId,
      publishedOnByRecordId,
      availableImageFilenames: finalImageFilenames,
      fallbackDate
    });
  } catch (error) {
    throw new PublishValidationError(toValidationErrors(error));
  }

  const serialized = `${JSON.stringify(generated.records, null, 2)}\n`;
  JSON.parse(serialized);

  const imagePathErrors = [];
  for (const record of generated.records) {
    const filename = extractImageFilename(record);
    if (!filename || !finalImageFilenames.has(filename)) {
      imagePathErrors.push(makeRecordError(record.id, `Missing image file: ${record.photo}`));
    }
  }

  if (imagePathErrors.length > 0) {
    throw new PublishValidationError(imagePathErrors);
  }

  const statusColumn = columnLookup.get(COMMON_COLUMN_TITLES.publicationStatus);
  const publicationDateColumn = columnLookup.get(COMMON_COLUMN_TITLES.publicationDate);
  const photoFilenameColumn = columnLookup.get(COMMON_COLUMN_TITLES.photoFilename);
  const writeBackRows = readyRows
    .map(row => {
      const recordId = rowIdentifier(row, columnLookup);
      if (!photoFilenameByRecordId.has(recordId)) return undefined;

      return {
        recordId,
        rowId: row.id,
        statusColumnId: statusColumn.id,
        publicationDateColumnId: publicationDateColumn.id,
        photoFilenameColumnId: photoFilenameColumn.id,
        finalPhotoFilename: photoFilenameByRecordId.get(recordId),
        finalPublicationIsoDate: publicationIsoByRecordId.get(recordId),
        publicationDateWasBlank: publicationDateBlankByRecordId.get(recordId) === true
      };
    })
    .filter(Boolean);

  return {
    records: generated.records,
    serialized,
    downloadedImages,
    reusedImageRecordIds,
    writeBackRows,
    summary: {
      totalRowsRead: rows.length,
      eligibleRecordCount: eligibleRows.length,
      readyToPublishCount: readyRows.length,
      publishedCount: eligibleRows.length - readyRows.length,
      projectCount: generated.records.filter(record => record.type === "project").length,
      initiativeCount: generated.records.filter(record => record.type === "initiative").length,
      websiteRecordIds: generated.records.map(record => record.id),
      downloadedImageCount: downloadedImages.length,
      reusedImageCount: reusedImageRecordIds.length
    }
  };
}

export function buildSmartsheetWriteBackPayload(writeBackRows) {
  return (writeBackRows || []).map(row => {
    const cells = [
      {
        columnId: row.statusColumnId,
        value: PUBLISHED_STATUS,
        strict: false
      },
      {
        columnId: row.photoFilenameColumnId,
        value: row.finalPhotoFilename,
        strict: false
      }
    ];

    if (row.publicationDateWasBlank) {
      cells.push({
        columnId: row.publicationDateColumnId,
        value: row.finalPublicationIsoDate
      });
    }

    return {
      id: row.rowId,
      cells
    };
  });
}

export function detectNoChange(currentSerialized, plan) {
  return currentSerialized === plan.serialized && plan.downloadedImages.length === 0;
}

async function applyPublishPlan(plan, metadataPath) {
  const tempJsonPath = join(await mkdtemp(join(tmpdir(), "seqi-publish-json-")), "projects.json");
  await writeFile(tempJsonPath, plan.serialized, "utf8");
  JSON.parse(await readFile(tempJsonPath, "utf8"));

  await mkdir(DEFAULT_IMAGES_DIRECTORY, { recursive: true });
  for (const image of plan.downloadedImages) {
    const targetPath = join(DEFAULT_IMAGES_DIRECTORY, image.filename);
    if (existsSync(targetPath)) {
      throw new Error(`Refusing to overwrite existing image path for ${image.recordId}.`);
    }
    await copyFile(image.tempPath, targetPath);
  }

  await mkdir(dirname(PROJECTS_OUTPUT_PATH), { recursive: true });
  await copyFile(tempJsonPath, PROJECTS_OUTPUT_PATH);

  await mkdir(dirname(metadataPath), { recursive: true });
  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        writeBackRows: plan.writeBackRows,
        summary: plan.summary
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

export async function updateSmartsheetRows(sheetId, accessToken, writeBackRows) {
  if (writeBackRows.length === 0) {
    return {
      updatedCount: 0
    };
  }

  const payload = buildSmartsheetWriteBackPayload(writeBackRows);
  const response = await smartsheetJson(`/sheets/${encodeURIComponent(sheetId)}/rows`, accessToken, {
    method: "PUT",
    body: payload,
    operation: "Smartsheet publication write-back"
  });

  const failedItems = response.failedItems || response.result?.failedItems || [];
  const successMessage = !response.message || response.message === "SUCCESS";
  const successCode = response.resultCode === undefined || response.resultCode === 0;
  if (failedItems.length > 0 || !successCode || !successMessage) {
    throw new PublishValidationError(
      writeBackRows.map(row =>
        makeRecordError(row.recordId, "Smartsheet write-back did not fully succeed")
      )
    );
  }

  return {
    updatedCount: writeBackRows.length
  };
}

function logSafeSummary(summary) {
  console.log(`Total Smartsheet rows read: ${summary.totalRowsRead}`);
  console.log(`Eligible record count: ${summary.eligibleRecordCount}`);
  console.log(`Ready-to-publish count: ${summary.readyToPublishCount}`);
  console.log(`Already-published count: ${summary.publishedCount}`);
  console.log(`Project count: ${summary.projectCount}`);
  console.log(`Initiative count: ${summary.initiativeCount}`);
  console.log(`Website record IDs: ${summary.websiteRecordIds.join(", ") || "(none)"}`);
  console.log(`Downloaded-image count: ${summary.downloadedImageCount}`);
  console.log(`Reused-image count: ${summary.reusedImageCount}`);
}

function logValidationErrors(errors) {
  console.error("Publishing validation errors:");
  for (const error of errors) {
    console.error(`- ${error.recordId}: ${error.issue}`);
  }
}

async function runPrepare() {
  assertManualPublishGuards();

  const accessToken = requireEnv("SMARTSHEET_ACCESS_TOKEN");
  const sheetId = requireEnv("SMARTSHEET_SHEET_ID");
  const metadataPath = process.env.PUBLISH_METADATA_PATH || join(tmpdir(), "seqi-publish-metadata.json");
  const tempDirectory = await mkdtemp(join(tmpdir(), "seqi-publish-images-"));
  const sheet = await fetchSheet(sheetId, accessToken);
  const currentSerialized = existsSync(PROJECTS_OUTPUT_PATH)
    ? await readFile(PROJECTS_OUTPUT_PATH, "utf8")
    : "[]\n";
  const currentRecords = JSON.parse(currentSerialized);
  const plan = await buildPublishPlan({
    sheet,
    currentRecords,
    tempDirectory,
    attachmentClient: makeDefaultAttachmentClient(sheetId, accessToken)
  });

  await applyPublishPlan(plan, metadataPath);
  logSafeSummary(plan.summary);
  console.log(`JSON changed: ${detectNoChange(currentSerialized, plan) ? "no" : "yes"}`);
  console.log(`Prepared Smartsheet write-back count: ${plan.writeBackRows.length}`);
}

async function runWriteBack() {
  const accessToken = requireEnv("SMARTSHEET_ACCESS_TOKEN");
  const sheetId = requireEnv("SMARTSHEET_SHEET_ID");
  const metadataPath = process.env.PUBLISH_METADATA_PATH || join(tmpdir(), "seqi-publish-metadata.json");
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  const result = await updateSmartsheetRows(sheetId, accessToken, metadata.writeBackRows || []);
  console.log(`Smartsheet update count: ${result.updatedCount}`);
}

async function main() {
  const command = process.argv[2] || "prepare";

  if (command === "prepare") {
    await runPrepare();
    return;
  }

  if (command === "writeback") {
    await runWriteBack();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch(error => {
    if (error instanceof PublishValidationError || error instanceof ValidationError) {
      logValidationErrors(error.errors);
    } else {
      console.error(`Publishing failed: ${error.message}`);
    }

    process.exitCode = 1;
  });
}
