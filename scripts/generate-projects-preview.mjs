import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

const SMARTSHEET_API_BASE = "https://api.smartsheet.com/2.0";
const PREVIEW_OUTPUT_PATH = "data/projects.preview.json";
const READY_TO_PUBLISH_STATUS = "Ready to publish";
const PROJECT_TOOLKIT_USE = "For a specific project";
const INITIATIVE_TOOLKIT_USE = "As a training or capacity building tool";

const EXPECTED_COLUMN_TITLES = [
  "Respondent name",
  "Organization",
  "Department",
  "Contact email",
  "Province/ Territory",
  "Intended toolkit use",
  "Project title",
  "Project description",
  "Project stage",
  "Healthcare setting",
  "Sustainability considered prior to toolkit",
  "Sustainability position after toolkit",
  "Sustainability principles aligned",
  "Prevention",
  "Prevention - Comments",
  "Stewardship / Appropriateness",
  "Stewardship Comments",
  "Care coordination",
  "Care coordination - Comments",
  "Consumables",
  "Consumables - Comments",
  "Waste management",
  "Waste management - Comments",
  "Procurement",
  "Procurement - Comments",
  "Energy",
  "Energy - Comments",
  "Food",
  "Food - Comments",
  "Travel and transportation",
  "Travel and transportation - Comments",
  "Water",
  "Water - Comments",
  "Climate resilience and adaptation",
  "Climate resilience and adaptation - Comments",
  "Clinical specialty or treatment modality",
  "Clinical specialty or treatment modality - Comment",
  "Activity data",
  "Environmental data",
  "Efficiency",
  "Efficiency - Comments",
  "Safety",
  "Safety - Comments",
  "Timeliness",
  "Timeliness- Comments",
  "Equity",
  "Equity - Comments",
  "Patient-Centredness / Respect",
  "Patient-Centeredness - Comments",
  "Effectiveness",
  "Effectiveness- Comments",
  "Appropriateness",
  "Appropriateness - Comments",
  "Accessibility",
  "Accessibility - Comments",
  "Other",
  "Other - Comments",
  "Initiative title",
  "Initiative description",
  "Initiative Stage",
  "Toolkit application",
  "Toolkit audience & uptake",
  "Most valuable toolkit elements",
  "Potential for formal QI integration?",
  "QI integration comments",
  "Participant voice",
  "Website record ID",
  "Website publication status",
  "Website publication date",
  "Website photo filename"
];

const COMMON_COLUMN_TITLES = {
  recordId: "Website record ID",
  publicationStatus: "Website publication status",
  publicationDate: "Website publication date",
  photoFilename: "Website photo filename",
  toolkitUse: "Intended toolkit use",
  respondentName: "Respondent name",
  contactEmail: "Contact email",
  organization: "Organization",
  department: "Department",
  province: "Province/ Territory"
};

const PROJECT_COLUMN_TITLES = {
  title: "Project title",
  description: "Project description",
  stage: "Project stage",
  healthcareSetting: "Healthcare setting",
  mostValuableElements: "Most valuable toolkit elements",
  sustainabilityPrinciples: "Sustainability principles aligned",
  activityData: "Activity data",
  environmentalData: "Environmental data"
};

const INITIATIVE_COLUMN_TITLES = {
  title: "Initiative title",
  description: "Initiative description",
  stage: "Initiative Stage",
  toolkitApplication: "Toolkit application",
  toolkitAudienceUptake: "Toolkit audience & uptake",
  mostValuableElements: "Most valuable toolkit elements",
  qiIntegration: "Potential for formal QI integration?",
  qiIntegrationComments: "QI integration comments"
};

const OPPORTUNITY_PAIRS = [
  ["Prevention", "Prevention - Comments"],
  ["Stewardship / Appropriateness", "Stewardship Comments"],
  ["Care coordination", "Care coordination - Comments"],
  ["Consumables", "Consumables - Comments"],
  ["Waste management", "Waste management - Comments"],
  ["Procurement", "Procurement - Comments"],
  ["Energy", "Energy - Comments"],
  ["Food", "Food - Comments"],
  ["Travel and transportation", "Travel and transportation - Comments"],
  ["Water", "Water - Comments"],
  ["Climate resilience and adaptation", "Climate resilience and adaptation - Comments"],
  [
    "Clinical specialty or treatment modality",
    "Clinical specialty or treatment modality - Comment"
  ]
];

const DOMAIN_PAIRS = [
  ["Efficiency", "Efficiency - Comments"],
  ["Safety", "Safety - Comments"],
  ["Timeliness", "Timeliness- Comments"],
  ["Equity", "Equity - Comments"],
  ["Patient-Centredness / Respect", "Patient-Centeredness - Comments"],
  ["Effectiveness", "Effectiveness- Comments"],
  ["Appropriateness", "Appropriateness - Comments"],
  ["Accessibility", "Accessibility - Comments"],
  ["Other", "Other - Comments"]
];

class ValidationError extends Error {
  constructor(errors) {
    super("Preview generation validation failed.");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable ${name}.`);
  }

  return value.trim();
}

function trimText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function rowIdentifier(row, columnLookup) {
  return getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.recordId)) || "<missing>";
}

function buildColumnLookup(columns) {
  const lookup = new Map();
  const duplicateTitles = new Set();

  for (const column of columns || []) {
    const title = trimText(column.title);
    if (!title) continue;

    if (lookup.has(title)) duplicateTitles.add(title);
    lookup.set(title, column);
  }

  if (duplicateTitles.size > 0) {
    throw new Error(
      `Duplicate Smartsheet column title(s) detected: ${[...duplicateTitles].join(", ")}.`
    );
  }

  const missingColumns = EXPECTED_COLUMN_TITLES.filter(title => !lookup.has(title));
  if (missingColumns.length > 0) {
    throw new Error(`Missing expected Smartsheet column(s): ${missingColumns.join(", ")}.`);
  }

  return lookup;
}

function getCellByColumnId(row, columnId) {
  return (row.cells || []).find(cell => cell.columnId === columnId);
}

function getCell(row, column) {
  if (!column) return undefined;
  return getCellByColumnId(row, column.id);
}

function getCellText(row, column) {
  const cell = getCell(row, column);
  if (!cell) return "";

  if (cell.displayValue !== undefined) return trimText(cell.displayValue);
  if (cell.value !== undefined) return trimText(cell.value);
  if (cell.objectValue !== undefined) return trimText(JSON.stringify(cell.objectValue));

  return "";
}

function getDateCellValue(row, column) {
  const cell = getCell(row, column);
  if (!cell) return "";

  if (cell.value !== undefined) return trimText(cell.value);
  if (cell.displayValue !== undefined) return trimText(cell.displayValue);

  return "";
}

function isClearlyAffirmative(row, column) {
  const cell = getCell(row, column);
  if (!cell) return false;

  if (cell.value === true || cell.checked === true) return true;

  const textCandidates = [cell.displayValue, cell.value, cell.objectValue?.value]
    .map(trimText)
    .filter(Boolean);

  return textCandidates.some(value => {
    const normalized = value.toLowerCase();
    return (
      normalized.startsWith("yes") ||
      normalized === "true" ||
      normalized === "checked" ||
      normalized === "selected" ||
      normalized === "1"
    );
  });
}

function uniqueTrimmed(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const trimmed = trimText(value);
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}

function parseDelimitedValues(value) {
  const text = trimText(value);
  if (!text) return [];

  return uniqueTrimmed(text.split(/\r?\n|[;,|]/));
}

function getMultiSelectValues(row, column) {
  const cell = getCell(row, column);
  if (!cell) return [];

  if (Array.isArray(cell.objectValue?.values)) {
    return uniqueTrimmed(cell.objectValue.values);
  }

  if (Array.isArray(cell.value)) {
    return uniqueTrimmed(cell.value);
  }

  if (Array.isArray(cell.displayValue)) {
    return uniqueTrimmed(cell.displayValue);
  }

  return parseDelimitedValues(cell.displayValue ?? cell.value ?? cell.objectValue?.value);
}

function stripBulletPrefix(value) {
  return trimText(value).replace(/^(\s*[-*•‣◦▪●]|\s*\d+[\.)])\s+/, "").trim();
}

function splitListField(value) {
  const text = trimText(value);
  if (!text) return [];

  if (/\r?\n/.test(text)) {
    return text
      .split(/\r?\n/)
      .map(stripBulletPrefix)
      .filter(Boolean);
  }

  return [stripBulletPrefix(text)].filter(Boolean);
}

function formatDateForWebsite(value, fallbackDate = new Date()) {
  const text = trimText(value);
  const source = text || fallbackDate;
  let date;

  if (source instanceof Date) {
    date = source;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(source)) {
    date = new Date(`${source}T00:00:00Z`);
  } else {
    date = new Date(source);
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Website publication date is not a recognized date.");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function getRecordType(value) {
  const toolkitUse = trimText(value);

  if (toolkitUse === PROJECT_TOOLKIT_USE) return "project";
  if (toolkitUse === INITIATIVE_TOOLKIT_USE) return "initiative";

  return undefined;
}

function pushMissingError(errors, recordId, fieldName) {
  errors.push({
    recordId,
    issue: `Missing required field: ${fieldName}`
  });
}

function buildDetailPairs(row, columnLookup, pairs) {
  return pairs
    .filter(([checkboxTitle]) => isClearlyAffirmative(row, columnLookup.get(checkboxTitle)))
    .map(([checkboxTitle, commentsTitle]) => ({
      name: checkboxTitle,
      explanation: getCellText(row, columnLookup.get(commentsTitle))
    }));
}

function buildCommonRecord(row, columnLookup, recordType, title, fallbackDate) {
  const filename = getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.photoFilename));

  return {
    id: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.recordId)),
    type: recordType,
    title,
    photo: `images/${filename}`,
    photoAlt: title,
    province: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.province)),
    publishedOn: formatDateForWebsite(
      getDateCellValue(row, columnLookup.get(COMMON_COLUMN_TITLES.publicationDate)),
      fallbackDate
    ),
    contactName: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.respondentName)),
    email: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.contactEmail)),
    organization: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.organization)),
    department: getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.department))
  };
}

function mapProjectRow(row, columnLookup, fallbackDate) {
  const title = getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.title));
  const common = buildCommonRecord(row, columnLookup, "project", title, fallbackDate);

  return {
    ...common,
    stage: getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.stage)),
    healthcareSetting: getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.healthcareSetting)),
    description: getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.description)),
    cobenefit: getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.mostValuableElements)),
    sustainabilityPrinciples: getMultiSelectValues(
      row,
      columnLookup.get(PROJECT_COLUMN_TITLES.sustainabilityPrinciples)
    ),
    sustainabilityOpportunities: buildDetailPairs(row, columnLookup, OPPORTUNITY_PAIRS),
    metrics: {
      environmental: splitListField(
        getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.environmentalData))
      ),
      activity: splitListField(getCellText(row, columnLookup.get(PROJECT_COLUMN_TITLES.activityData)))
    },
    domainsOfQuality: buildDetailPairs(row, columnLookup, DOMAIN_PAIRS)
  };
}

function mapInitiativeRow(row, columnLookup, fallbackDate) {
  const title = getCellText(row, columnLookup.get(INITIATIVE_COLUMN_TITLES.title));
  const common = buildCommonRecord(row, columnLookup, "initiative", title, fallbackDate);
  const stage = getCellText(row, columnLookup.get(INITIATIVE_COLUMN_TITLES.stage));

  return {
    ...common,
    stage,
    healthcareSetting: "",
    description: getCellText(row, columnLookup.get(INITIATIVE_COLUMN_TITLES.description)),
    sustainabilityPrinciples: [],
    sustainabilityOpportunities: [],
    metrics: {
      environmental: [],
      activity: []
    },
    domainsOfQuality: [],
    cobenefit: "",
    initiativeStage: stage,
    toolkitApplication: getCellText(row, columnLookup.get(INITIATIVE_COLUMN_TITLES.toolkitApplication)),
    toolkitAudienceUptake: getCellText(
      row,
      columnLookup.get(INITIATIVE_COLUMN_TITLES.toolkitAudienceUptake)
    ),
    mostValuableElements: getCellText(
      row,
      columnLookup.get(INITIATIVE_COLUMN_TITLES.mostValuableElements)
    ),
    qiIntegration: getCellText(row, columnLookup.get(INITIATIVE_COLUMN_TITLES.qiIntegration)),
    qiIntegrationComments: getCellText(
      row,
      columnLookup.get(INITIATIVE_COLUMN_TITLES.qiIntegrationComments)
    )
  };
}

function validateCommonRequiredFields(row, columnLookup, errors) {
  const recordId = rowIdentifier(row, columnLookup);
  const missingChecks = [
    [COMMON_COLUMN_TITLES.recordId, "Website record ID"],
    [COMMON_COLUMN_TITLES.photoFilename, "Website photo filename"],
    [COMMON_COLUMN_TITLES.toolkitUse, "Intended toolkit use"],
    [COMMON_COLUMN_TITLES.organization, "Organization"]
  ];

  for (const [columnTitle, fieldName] of missingChecks) {
    if (!getCellText(row, columnLookup.get(columnTitle))) {
      pushMissingError(errors, recordId, fieldName);
    }
  }
}

function validateTypeRequiredFields(row, columnLookup, recordType, errors) {
  const recordId = rowIdentifier(row, columnLookup);
  const missingChecks = [];

  if (recordType === "project") {
    missingChecks.push(
      [PROJECT_COLUMN_TITLES.title, "Project title"],
      [PROJECT_COLUMN_TITLES.description, "Project description"],
      [PROJECT_COLUMN_TITLES.stage, "Project stage"]
    );
  } else if (recordType === "initiative") {
    missingChecks.push(
      [INITIATIVE_COLUMN_TITLES.title, "Initiative title"],
      [INITIATIVE_COLUMN_TITLES.description, "Initiative description"],
      [INITIATIVE_COLUMN_TITLES.stage, "Initiative Stage"]
    );
  }

  for (const [columnTitle, fieldName] of missingChecks) {
    if (!getCellText(row, columnLookup.get(columnTitle))) {
      pushMissingError(errors, recordId, fieldName);
    }
  }
}

function findDuplicateRecordIds(rows, columnLookup) {
  const seen = new Set();
  const duplicates = new Set();

  for (const row of rows) {
    const recordId = getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.recordId));
    if (!recordId) continue;
    if (seen.has(recordId)) duplicates.add(recordId);
    seen.add(recordId);
  }

  return [...duplicates].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function generatePreviewRecords(sheet, options = {}) {
  const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
  const columnLookup = buildColumnLookup(sheet.columns || []);
  const fallbackDate = options.fallbackDate || new Date();
  const errors = [];

  const readyRows = rows.filter(
    row =>
      getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.publicationStatus)) ===
      READY_TO_PUBLISH_STATUS
  );

  const approvedRows = readyRows;

  const duplicateRecordIds = findDuplicateRecordIds(approvedRows, columnLookup);
  for (const recordId of duplicateRecordIds) {
    errors.push({
      recordId,
      issue: "Duplicate Website record ID"
    });
  }

  const records = [];
  for (const row of approvedRows) {
    const recordId = rowIdentifier(row, columnLookup);
    const toolkitUse = getCellText(row, columnLookup.get(COMMON_COLUMN_TITLES.toolkitUse));
    const recordType = getRecordType(toolkitUse);

    validateCommonRequiredFields(row, columnLookup, errors);

    if (!recordType) {
      errors.push({
        recordId,
        issue: "Unknown Intended toolkit use"
      });
      continue;
    }

    validateTypeRequiredFields(row, columnLookup, recordType, errors);

    try {
      records.push(
        recordType === "project"
          ? mapProjectRow(row, columnLookup, fallbackDate)
          : mapInitiativeRow(row, columnLookup, fallbackDate)
      );
    } catch (error) {
      errors.push({
        recordId,
        issue: error.message
      });
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  records.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, {
      numeric: true,
      sensitivity: "base"
    })
  );

  return {
    records,
    summary: {
      totalRowsRead: rows.length,
      readyToPublishRowCount: readyRows.length,
      publicPermissionApprovedRowCount: approvedRows.length,
      generatedProjectCount: records.filter(record => record.type === "project").length,
      generatedInitiativeCount: records.filter(record => record.type === "initiative").length,
      generatedWebsiteRecordIds: records.map(record => record.id)
    }
  };
}

async function fetchSheet(sheetId, accessToken) {
  const response = await fetch(
    `${SMARTSHEET_API_BASE}/sheets/${encodeURIComponent(sheetId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Smartsheet API request failed with HTTP ${response.status} ${response.statusText}.`
    );
  }

  return response.json();
}

function logSafeSummary(summary) {
  console.log("Smartsheet API connection succeeded.");
  console.log(`Total Smartsheet rows read: ${summary.totalRowsRead}`);
  console.log(`Ready-to-publish row count: ${summary.readyToPublishRowCount}`);
  console.log(`Public-permission-approved row count: ${summary.publicPermissionApprovedRowCount}`);
  console.log(`Generated project count: ${summary.generatedProjectCount}`);
  console.log(`Generated initiative count: ${summary.generatedInitiativeCount}`);
  console.log(
    `Generated Website record IDs: ${summary.generatedWebsiteRecordIds.join(", ") || "(none)"}`
  );
  console.log(`Preview file location: ${PREVIEW_OUTPUT_PATH}`);
}

function logValidationErrors(errors) {
  console.error("Validation errors:");
  for (const error of errors) {
    console.error(`- ${error.recordId}: ${error.issue}`);
  }
}

async function main() {
  const accessToken = requireEnv("SMARTSHEET_ACCESS_TOKEN");
  const sheetId = requireEnv("SMARTSHEET_SHEET_ID");
  const sheet = await fetchSheet(sheetId, accessToken);
  const { records, summary } = generatePreviewRecords(sheet);
  const serialized = `${JSON.stringify(records, null, 2)}\n`;

  JSON.parse(serialized);

  await mkdir(dirname(PREVIEW_OUTPUT_PATH), { recursive: true });
  await writeFile(PREVIEW_OUTPUT_PATH, serialized, "utf8");
  logSafeSummary(summary);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch(error => {
    if (error instanceof ValidationError) {
      logValidationErrors(error.errors);
    } else {
      console.error(`Preview generation failed: ${error.message}`);
    }

    process.exitCode = 1;
  });
}
