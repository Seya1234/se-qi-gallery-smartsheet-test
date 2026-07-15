/* =========================================
  SE-QI Toolkit Project Gallery
  script.js â€” Project Data + Filter Logic

  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  HOW TO EDIT PROJECTS
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  Find project records in data/projects.json.
  Each object is one project or initiative card.

  For sustainabilityPrinciples â€” pick ONE OR MORE
  from this exact list (copy-paste the text):
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    "Prevention"
    "Stewardship/ Appropriateness"
    "Decarbonization / Depollution"
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  For sustainabilityOpportunities â€” each entry needs
  a "name" (from the list below) and an "explanation".
  Pick ONE OR MORE names from this exact list:
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    "Prevention"
    "Stewardship/ Appropriateness"
    "Care coordination"
    "Consumables"
    "Waste management"
    "Procurement"
    "Energy"
    "Food"
    "Travel and transportation"
    "Water"
    "Climate resilience and adaptation"
    "Clinical specialty or treatment modality"
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  âš  IMPORTANT: The filter works by matching the
  text exactly. Copy-paste from the lists above
  â€” do not retype or the filter won't match.

  For domainsOfQuality â€” write any name and
  explanation you like. These are display-only
  and do not affect filtering.
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* ---- PROJECT DATA ---- */
/* Project records are loaded from data/projects.json at startup. */
let PROJECTS = [];

/* ---- FILTER TAXONOMY ---- */
/* These define the sidebar checkbox groups.
   Filters apply only to regular Projects, not Training & Capacity-Building Initiatives. */
const FILTER_GROUPS = [
    {
        label: "Province / Territory",
        field: "province",
        values: [
            "Alberta",
            "British Columbia",
            "Manitoba",
            "New Brunswick",
            "Newfoundland and Labrador",
            "Nova Scotia",
            "Ontario",
            "Prince Edward Island",
            "Quebec",
            "Saskatchewan"
        ]
    },
    {
        label: "Sustainability Principles",
        field: "sustainabilityPrinciples",
        values: [
            "Prevention",
            "Stewardship/ Appropriateness",
            "Decarbonization / Depollution"
        ]
    },
    {
        label: "Sustainability Opportunities",
        field: "sustainabilityOpportunities",
        values: [
            "Prevention",
            "Stewardship/ Appropriateness",
            "Care coordination",
            "Consumables",
            "Waste management",
            "Procurement",
            "Energy",
            "Food",
            "Travel and transportation",
            "Water",
            "Climate resilience and adaptation",
            "Clinical specialty or treatment modality"
        ]
    }
];

let REGULAR_PROJECTS = [];
let INITIATIVES = [];

let activeFilters = {
    province: new Set(),
    sustainabilityPrinciples: new Set(),
    sustainabilityOpportunities: new Set()
};

function setProjectData(projects) {
    PROJECTS = projects;
    REGULAR_PROJECTS = PROJECTS.filter(project => project.type !== "initiative");
    INITIATIVES = PROJECTS.filter(project => project.type === "initiative");
}

async function loadProjectData() {
    const response = await fetch("data/projects.json", { cache: "no-cache" });

    if (!response.ok) {
        throw new Error(`projects.json request failed with status ${response.status}`);
    }

    const projects = await response.json();

    if (!Array.isArray(projects)) {
        throw new Error("projects.json must contain an array of project records");
    }

    return projects;
}

function showProjectLoadError(error) {
    console.error("Could not load project data:", error);

    const grid = document.getElementById("projectGrid");
    const initiativeGrid = document.getElementById("initiativeGrid");
    const emptyState = document.getElementById("emptyState");
    const countEl = document.getElementById("projectCount");

    if (grid) grid.innerHTML = "";
    if (initiativeGrid) initiativeGrid.innerHTML = "";
    if (countEl) countEl.textContent = "Content unavailable";

    if (!emptyState) return;

    emptyState.style.display = "flex";
    emptyState.replaceChildren();

    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "!";

    const heading = document.createElement("h3");
    heading.textContent = "Project content could not be loaded";

    const message = document.createElement("p");
    message.textContent = "Please refresh the page or check that data/projects.json is available.";

    emptyState.append(icon, heading, message);
}

function buildFilters() {
    const sidebar = document.getElementById("filterSidebar");
    if (!sidebar) return;

    sidebar.innerHTML = "";

    FILTER_GROUPS.forEach(group => {
        const section = document.createElement("div");
        section.className = "filter-group";

        const heading = document.createElement("h3");
        heading.className = "filter-group-heading";
        heading.textContent = group.label;
        section.appendChild(heading);

        group.values.forEach(value => {
            const label = document.createElement("label");
            label.className = "filter-checkbox-label";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "filter-checkbox";
            input.value = value;
            input.dataset.field = group.field;
            input.addEventListener("change", onFilterChange);

            label.appendChild(input);
            label.appendChild(document.createTextNode(" " + value));
            section.appendChild(label);
        });

        sidebar.appendChild(section);
    });
}

function onFilterChange(e) {
    const field = e.target.dataset.field;
    const value = e.target.value;

    if (!activeFilters[field]) return;

    if (e.target.checked) {
        activeFilters[field].add(value);
    } else {
        activeFilters[field].delete(value);
    }

    renderProjects();
    renderInitiatives();
    updateActiveCount();
}

function projectMatchesFilters(project) {
    const provinceFilters = activeFilters.province;
    const principleFilters = activeFilters.sustainabilityPrinciples;
    const opportunityFilters = activeFilters.sustainabilityOpportunities;

    if (provinceFilters.size > 0) {
        if (!provinceFilters.has(project.province)) return false;
    }

    if (principleFilters.size > 0) {
        const projectPrinciples = project.sustainabilityPrinciples || [];
        const match = [...principleFilters].some(f => projectPrinciples.includes(f));
        if (!match) return false;
    }

    if (opportunityFilters.size > 0) {
        const projectOpportunities = project.sustainabilityOpportunities || [];
        const opportunityNames = projectOpportunities.map(o => o.name);
        const match = [...opportunityFilters].some(f => opportunityNames.includes(f));
        if (!match) return false;
    }

    return true;
}

function renderProjects() {
    const grid = document.getElementById("projectGrid");
    const emptyState = document.getElementById("emptyState");
    const countEl = document.getElementById("projectCount");
    if (!grid) return;

    const visibleProjects = REGULAR_PROJECTS.filter(projectMatchesFilters);

    grid.innerHTML = "";

    if (visibleProjects.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
    } else {
        if (emptyState) emptyState.style.display = "none";
        visibleProjects.forEach((project, index) => {
            grid.appendChild(buildTile(project, index));
        });
    }

    if (countEl) {
        countEl.textContent = `${visibleProjects.length} of ${REGULAR_PROJECTS.length}`;
    }
}

function renderInitiatives() {
    const grid = document.getElementById("initiativeGrid");
    const section = document.getElementById("initiativesSection");
    if (!grid) return;

    const visibleInitiatives = INITIATIVES.filter(projectMatchesFilters);

    grid.innerHTML = "";

    if (section) {
        section.style.display = visibleInitiatives.length === 0 ? "none" : "";
    }

    visibleInitiatives.forEach((initiative, index) => {
        grid.appendChild(buildTile(initiative, index));
    });
}
function getStageClass(stage) {
    if (!stage) return "stage-unknown";

    const normalized = stage.toLowerCase();

    if (normalized.includes("not started")) {
        return "stage-not-started";
    }

    if (normalized.includes("work in progress")) {
        return "stage-progress";
    }

    if (normalized.includes("complete")) {
        return "stage-complete";
    }

    return "stage-unknown";
}

function buildStageBadge(stage) {
    if (!stage) return "";

    return `
    <span class="stage-badge ${getStageClass(stage)}">
      ${stage}
    </span>
  `;
}

function buildMailLink(project) {
    if (!project.email || !project.contactName) return "";

    return `
      <a href="mailto:${project.email}" class="contact-button">
        Email ${project.contactName}
      </a>
    `;
}

const RESOURCE_SECTION_LABEL_RE =
    /(Valuable Resources:|Resources identified as particularly valuable:)/i;
const URL_RE = /https?:\/\/[^\s<>"']+/gi;
const HAS_URL_RE = /https?:\/\/[^\s<>"']+/i;

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function decodeHTMLEntities(value) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
}

function stripHTMLTags(value) {
    return value.replace(/<[^>]*>/g, "");
}

function normalizeToolkitText(value) {
    return decodeHTMLEntities(
        String(value ?? "")
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(
                /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
                (_match, _quote, href, label) => `${stripHTMLTags(label)} ${href}`
            )
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/(p|div|li|ul|ol|strong|b)>/gi, "\n")
            .replace(/<(p|div|li|ul|ol|strong|b)\b[^>]*>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .replace(/\r\n?/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim()
    );
}

function cleanResourceTitle(value) {
    return String(value ?? "")
        .replace(/^[\s;:,\-–—•*]+/, "")
        .replace(/^\d+[\).]\s*/, "")
        .replace(/[\s:：\-–—]+$/, "")
        .trim();
}

function normalizeURL(value) {
    let url = String(value ?? "").trim();
    while (/[.,;:!?]$/.test(url)) {
        url = url.slice(0, -1);
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
    } catch (_error) {
        return "";
    }
}

function buildResourceLink(url, title) {
    const safeURL = normalizeURL(url);
    if (!safeURL) {
        return escapeHTML(`${title ? `${title} ` : ""}${url}`.trim());
    }

    const linkText = cleanResourceTitle(title) || safeURL;
    return `<a class="toolkit-resource-link" href="${escapeHTML(safeURL)}" target="_blank" rel="noopener noreferrer">${escapeHTML(linkText)}</a>`;
}

function splitPlainResourceItems(value) {
    return String(value ?? "")
        .split(/\s*;\s*|\n+/)
        .map(item => cleanResourceTitle(item))
        .filter(Boolean);
}

function parseLinkedResources(value) {
    const text = String(value ?? "");
    const matches = [...text.matchAll(URL_RE)];

    if (matches.length === 0) {
        return splitPlainResourceItems(text).map(item => ({
            title: item,
            url: ""
        }));
    }

    const resources = [];
    let previousEnd = 0;

    for (const match of matches) {
        const rawURL = match[0];
        const title = cleanResourceTitle(text.slice(previousEnd, match.index));
        resources.push({
            title: title || normalizeURL(rawURL) || rawURL,
            url: rawURL
        });
        previousEnd = match.index + rawURL.length;
    }

    const trailingText = cleanResourceTitle(text.slice(previousEnd));
    if (trailingText) {
        resources.push({
            title: trailingText,
            url: ""
        });
    }

    return resources;
}

function formatPlainParagraphs(value) {
    const text = String(value ?? "").trim();
    if (!text) return "";

    return text
        .split(/\n{2,}/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean)
        .map(paragraph => `<p>${paragraph.split(/\n/).map(escapeHTML).join("<br>")}</p>`)
        .join("");
}

function autoLinkText(value) {
    const text = String(value ?? "").trim();
    if (!text) return "";

    return text
        .split(/\n{2,}/)
        .map(paragraph => {
            let html = "";
            let previousEnd = 0;

            for (const match of paragraph.matchAll(URL_RE)) {
                html += escapeHTML(paragraph.slice(previousEnd, match.index));
                html += buildResourceLink(match[0], "");
                previousEnd = match.index + match[0].length;
            }

            html += escapeHTML(paragraph.slice(previousEnd));
            return `<p>${html.replace(/\n/g, "<br>")}</p>`;
        })
        .join("");
}

function formatToolkitResources(value) {
    const normalizedText = normalizeToolkitText(value);
    if (!normalizedText) return "";

    const labelMatch = normalizedText.match(RESOURCE_SECTION_LABEL_RE);
    if (!labelMatch) {
        return HAS_URL_RE.test(normalizedText) ? autoLinkText(normalizedText) : formatPlainParagraphs(normalizedText);
    }

    URL_RE.lastIndex = 0;
    const labelStart = labelMatch.index;
    const labelEnd = labelStart + labelMatch[0].length;
    const introText = normalizedText.slice(0, labelStart).trim();
    const resourceText = normalizedText.slice(labelEnd).trim();
    const resources = parseLinkedResources(resourceText);

    if (resources.length === 0) {
        return autoLinkText(normalizedText);
    }

    const introHTML = formatPlainParagraphs(introText);
    const resourceItemsHTML = resources
        .map(resource => {
            const content = resource.url
                ? buildResourceLink(resource.url, resource.title)
                : escapeHTML(resource.title);
            return `<li>${content}</li>`;
        })
        .join("");

    return `
        ${introHTML}
        <p class="toolkit-resource-heading"><strong>Resources identified as particularly valuable:</strong></p>
        <ul class="toolkit-resource-list">${resourceItemsHTML}</ul>
    `;
}



/* =========================================
 TILE BEAUTIFY — replace your existing buildTile()
 function in script.js with this one.
 Everything else in script.js stays the same.
 ========================================= */

function buildTile(project, index) {
    const article = document.createElement("article");
    const isInitiative = project.type === "initiative";

    article.className = isInitiative ? "project-tile initiative-tile" : "project-tile";
    article.setAttribute("tabindex", "0");
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", "View details for " + project.title);
    article.style.animationDelay = index * 0.07 + "s";

    if (isInitiative) {
        article.dataset.type = "initiative";
    } else if (project.sustainabilityPrinciples && project.sustainabilityPrinciples[0]) {
        article.dataset.principle = project.sustainabilityPrinciples[0];
    }

    const imgWrap = document.createElement("div");
    imgWrap.className = "tile-image";

    if (project.photo) {
        const img = document.createElement("img");
        img.src = project.photo;
        img.alt = project.photoAlt || project.title;
        img.loading = "lazy";
        imgWrap.appendChild(img);
    } else {
        imgWrap.classList.add("tile-image--placeholder");
        imgWrap.innerHTML = placeholderSVG(project.id);
    }

    const footer = document.createElement("div");
    footer.className = "tile-footer";

    if (isInitiative) {
        const label = document.createElement("span");
        label.className = "tile-type-label";
        label.textContent = "Training & Capacity-Building";
        footer.appendChild(label);
    }

    const titleEl = document.createElement("h2");
    titleEl.className = "tile-title";
    titleEl.textContent = project.title;
    footer.appendChild(titleEl);

    article.appendChild(imgWrap);
    article.appendChild(footer);

    article.addEventListener("click", () => openModal(project));
    article.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(project);
        }
    });

    return article;
}

function placeholderSVG(id) {
    const palettes = [
        { bg: "#d4f2ee", icon: "#1a7a6e" },
        { bg: "#dcf5e7", icon: "#2d7d4e" },
        { bg: "#dbeafe", icon: "#2563eb" },
        { bg: "#ede9fe", icon: "#7c3aed" },
        { bg: "#fef9c3", icon: "#ca8a04" },
        { bg: "#ffedd5", icon: "#ea580c" }
    ];
    const p = palettes[(id - 1) % palettes.length];

    return `
    <div class="placeholder-graphic" style="background:${p.bg}">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="${p.icon}" stroke-width="2"/>
        <circle cx="16" cy="20" r="4" stroke="${p.icon}" stroke-width="2"/>
        <path d="M6 34l10-10 8 8 6-6 12 8" stroke="${p.icon}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span style="color:${p.icon}">Photo Coming Soon</span>
    </div>`;
}

function openModal(project) {
    const overlay = document.getElementById("modalOverlay");
    const body = document.getElementById("modalBody");
    if (!overlay || !body) return;

    body.innerHTML = buildModalHTML(project);
    overlay.classList.add("modal--open");
    document.body.classList.add("modal-active");

    const closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    overlay.classList.remove("modal--open");
    document.body.classList.remove("modal-active");
}
const INFO_PANEL_ICONS = {
    building: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V7.5L12 3l8 4.5V21" />
      <path d="M9 21v-6h6v6" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 13h.01M16 13h.01" />
    </svg>
  `,
    people: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11a4 4 0 1 0-8 0" />
      <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M18 8a3 3 0 0 1 3 3" />
      <path d="M21 21v-1a5 5 0 0 0-3-4.5" />
      <path d="M6 8a3 3 0 0 0-3 3" />
      <path d="M3 21v-1a5 5 0 0 1 3-4.5" />
    </svg>
  `,
    hospital: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 21v-5h6v5" />
      <path d="M12 7v5" />
      <path d="M9.5 9.5h5" />
      <path d="M7.5 14h.01M16.5 14h.01" />
    </svg>
  `,
    mapPin: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  `,
    calendar: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  `
};

function buildInfoItem(icon, label, value) {
    return `
    <div class="info-panel-row">
      <div class="info-panel-icon" aria-hidden="true">${icon}</div>
      <div class="info-panel-copy">
        <span class="info-panel-label">${label}</span>
        <span class="info-panel-value">${value || "-"}</span>
      </div>
    </div>
  `;
}

function buildProjectInfoPanel(p) {
    const stageValue = buildStageBadge(p.stage || p.initiativeStage);

    const thirdItem = p.type === "initiative"
        ? buildInfoItem(INFO_PANEL_ICONS.hospital, "Initiative Type", "Training & Capacity-Building")
        : buildInfoItem(INFO_PANEL_ICONS.hospital, "Healthcare Setting", p.healthcareSetting || "-");

    return `
    <section class="info-panel">
      <div class="info-panel-header">
        <div class="info-panel-title-wrap">
  <h2 class="info-panel-title">${p.title}</h2>
</div>
        ${stageValue}
      </div>

      <div class="info-panel-list">
          ${buildInfoItem(INFO_PANEL_ICONS.building, "Organization", p.organization)}
          ${buildInfoItem(INFO_PANEL_ICONS.people, "Department", p.department)}
          ${thirdItem}
          ${buildInfoItem(INFO_PANEL_ICONS.mapPin, "Province / Territory", p.province)}
          ${buildInfoItem(INFO_PANEL_ICONS.calendar, "Published On", p.publishedOn || "To be added")}
      </div>
    </section>
  `;
}

function buildModalHTML(p) {
    const photoHTML = p.photo
        ? `<div class="modal-photo-wrap">
         <img class="modal-photo" src="${p.photo}" alt="${p.photoAlt || p.title}" />
         <div class="modal-photo-gradient"></div>
       </div>`
        : `<div class="modal-photo-wrap modal-photo-wrap--placeholder">
         <div class="modal-photo modal-photo--placeholder">${placeholderSVG(p.id)}</div>
       </div>`;

    if (p.type === "initiative") {
        return `
      ${photoHTML}
      <div class="modal-content-body modal-content-body--initiative">
        ${buildProjectInfoPanel(p)}

        <section class="modal-section">
          <h3 class="modal-section-heading">Initiative Description</h3>
          <p>${p.description}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Toolkit Application</h3>
          <p>${p.toolkitApplication}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Toolkit Audience & Uptake</h3>
          <p>${p.toolkitAudienceUptake}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Most Valuable Toolkit Elements</h3>
          <div class="cobenefit-text">${formatToolkitResources(p.mostValuableElements)}</div>
        </section>

        <section class="modal-section learn-more-section">
          <h3 class="modal-section-heading">Learn More</h3>
          <p>
            For questions about this initiative or to connect with the project team, use the email link below.
          </p>
          ${buildMailLink(p)}
        </section>
      </div>
    `;
    }

    const principleTagsHTML = (p.sustainabilityPrinciples || [])
        .map(tag => `<span class="tag tag--teal" data-principle="${tag}">${tag}</span>`)
        .join("");

    const opportunitiesHTML = (p.sustainabilityOpportunities || [])
        .map(opportunity => `
      <div class="detail-item">
        <span class="detail-item-name">${opportunity.name}</span>
        <p class="detail-item-desc">${opportunity.explanation}</p>
      </div>`)
        .join("");

    const envMetrics = ((p.metrics && p.metrics.environmental) || [])
        .map(metric => `<li>${metric}</li>`)
        .join("");

    const actMetrics = ((p.metrics && p.metrics.activity) || [])
        .map(metric => `<li>${metric}</li>`)
        .join("");

    const domainsHTML = (p.domainsOfQuality || [])
        .map(domain => `
      <div class="detail-item">
        <span class="detail-item-name">${domain.name}</span>
        <p class="detail-item-desc">${domain.explanation}</p>
      </div>`)
        .join("");

    return `
    ${photoHTML}
    <div class="modal-content-body">
      ${buildProjectInfoPanel(p)}

      <section class="modal-section">
        <h3 class="modal-section-heading">Project Description</h3>
        <p>${p.description}</p>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Sustainability Principles</h3>
        <div class="tag-row">${principleTagsHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Sustainability Opportunities</h3>
        <div class="detail-list">${opportunitiesHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Metrics</h3>
        <div class="metrics-grid">
          <div class="metrics-col">
            <h4 class="metrics-col-heading metrics-col-heading--env">Environmental</h4>
            <ul class="metrics-list metrics-list--env">${envMetrics}</ul>
          </div>
          <div class="metrics-col">
            <h4 class="metrics-col-heading metrics-col-heading--act">Activity</h4>
            <ul class="metrics-list metrics-list--act">${actMetrics}</ul>
          </div>
        </div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Domains of Quality</h3>
        <div class="detail-list">${domainsHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Most Valuable SE-QI Toolkit Resources</h3>
        <div class="cobenefit-text">${formatToolkitResources(p.cobenefit)}</div>
      </section>

      <section class="modal-section learn-more-section">
        <h3 class="modal-section-heading">Learn More</h3>
        <p>
          For questions about this initiative or to connect with the project team, use the email link below.
        </p>
        ${buildMailLink(p)}
      </section>
    </div>
  `;
}


    
function updateActiveCount() {
    const total =
        activeFilters.province.size +
        activeFilters.sustainabilityPrinciples.size +
        activeFilters.sustainabilityOpportunities.size;

    const badge = document.getElementById("filterBadge");
    const clearBtn = document.getElementById("clearFilters");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (badge) {
        badge.dataset.count = total;
        badge.textContent = total;
    }
    if (clearBtn) {
        clearBtn.classList.toggle("btn-clear--visible", total > 0);
    }
    if (sidebarToggle) {
        sidebarToggle.setAttribute("aria-expanded",
            document.body.classList.contains("sidebar-active") ? "true" : "false");
    }
}

function clearAllFilters() {
    activeFilters.province.clear();
    activeFilters.sustainabilityPrinciples.clear();
    activeFilters.sustainabilityOpportunities.clear();
    document.querySelectorAll(".filter-checkbox").forEach(cb => { cb.checked = false; });
    renderProjects();
    renderInitiatives();
    updateActiveCount();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle = document.getElementById("sidebarToggle");

    sidebar && sidebar.classList.toggle("sidebar--open");
    overlay && overlay.classList.toggle("sidebar-overlay--open");
    document.body.classList.toggle("sidebar-active");

    if (toggle) {
        toggle.setAttribute("aria-expanded", document.body.classList.contains("sidebar-active") ? "true" : "false");
    }
}

function bindGalleryEvents() {
    document.getElementById("modalClose")?.addEventListener("click", closeModal);
    document.getElementById("modalOverlay")?.addEventListener("click", e => {
        if (e.target === e.currentTarget) closeModal();
    });

    document.getElementById("clearFilters")?.addEventListener("click", clearAllFilters);
    document.getElementById("clearFiltersEmpty")?.addEventListener("click", clearAllFilters);

    document.getElementById("sidebarToggle")?.addEventListener("click", toggleSidebar);
    document.getElementById("sidebarOverlay")?.addEventListener("click", toggleSidebar);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });
}

async function initializeGallery() {
    try {
        const projects = await loadProjectData();
        setProjectData(projects);

        buildFilters();
        renderProjects();
        renderInitiatives();
        updateActiveCount();
        bindGalleryEvents();
    } catch (error) {
        showProjectLoadError(error);
    }
}

document.addEventListener("DOMContentLoaded", initializeGallery);

/* ---- Scroll-to-top button ---- */
(function () {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("btn-scroll-top--visible", window.scrollY > 320);
    }, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
