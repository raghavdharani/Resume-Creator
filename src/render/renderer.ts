export interface ResumeContact {
  location?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  website?: string;
}

export interface ResumeStrengthGroup {
  category: string;
  skills: string[];
}

export interface ResumeBullet {
  text: string;
}

export interface ResumeExperience {
  company: string;
  title: string;
  dates: string;
  location?: string;
  summary?: string;
  bullets?: Array<string | ResumeBullet>;
}

export interface ResumeEducation {
  institution: string;
  credential: string;
  dates?: string;
  location?: string;
}

export interface ResumeDocument {
  name: string;
  targetTitle?: string;
  contact?: ResumeContact;
  summary?: string;
  strengths?: ResumeStrengthGroup[];
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  certifications?: string[];
  tools?: string[];
}

const themeCss = `
  :root {
    --accent: #245f8f;
    --accent-soft: #e7f2fa;
    --ink: #1f2933;
    --muted: #52616f;
    --rule: #8bb9d8;
    --gutter: 0.56in;
  }

  * { box-sizing: border-box; }

  html, body { margin: 0; padding: 0; }

  body {
    color: var(--ink);
    background: #ffffff;
    font-family: Calibri, Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.32;
  }

  .resume-document { width: 100%; }

  .top-rule {
    height: 4px;
    background: var(--accent);
  }

  .resume-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: 18px var(--gutter) 16px;
    background: var(--accent-soft);
  }

  .resume-name {
    margin: 0;
    color: var(--accent);
    font-size: 25pt;
    font-weight: 700;
    line-height: 1.05;
  }

  .resume-title {
    margin: 5px 0 0;
    color: var(--ink);
    font-size: 12pt;
    font-weight: 700;
  }

  .contact-list {
    margin: 0;
    padding: 0;
    color: var(--muted);
    font-size: 9.5pt;
    line-height: 1.38;
    list-style: none;
    text-align: right;
  }

  .resume-body {
    padding: 14px var(--gutter) 20px;
  }

  .resume-section {
    margin: 0 0 13px;
  }

  .section-title {
    margin: 0 0 6px;
    padding-bottom: 3px;
    border-bottom: 1px solid var(--rule);
    break-after: avoid;
    page-break-after: avoid;
    color: var(--accent);
    font-size: 10.5pt;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  p { margin: 0; }

  .strength-row {
    margin: 0 0 3px;
  }

  .strength-category { color: var(--accent); }

  .experience-item,
  .education-item {
    margin-top: 11px;
  }

  .education-item {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .experience-item:first-of-type,
  .education-item:first-of-type {
    margin-top: 0;
  }

  .experience-heading,
  .education-heading {
    display: flex;
    align-items: baseline;
    gap: 12px;
    color: var(--accent);
    font-size: 10.5pt;
    font-weight: 700;
  }

  .experience-heading {
    break-after: avoid;
    page-break-after: avoid;
  }

  .experience-company,
  .education-institution {
    flex: 1 1 34%;
  }

  .experience-title,
  .education-credential {
    flex: 1 1 40%;
    color: var(--ink);
    text-align: center;
  }

  .experience-dates,
  .education-dates {
    flex: 1 1 26%;
    text-align: right;
    white-space: nowrap;
  }

  .experience-meta {
    margin-top: 1px;
    color: var(--muted);
    font-size: 9.5pt;
  }

  .experience-summary { margin-top: 4px; }

  .bullet-list {
    margin: 5px 0 0;
    padding: 0;
    list-style: none;
  }

  .bullet-list li {
    position: relative;
    margin: 0 0 3px;
    padding-left: 13px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .bullet-list li::before {
    position: absolute;
    left: 0;
    content: "-";
  }

  .inline-list { margin: 0; }

  @page {
    size: Letter;
    margin: 0.42in 0;
  }

  @media print {
    body {
      color: #000000;
      background: #ffffff;
      font-size: 10.25pt;
      line-height: 1.3;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    .bullet-list li {
      margin-bottom: 2px;
    }

    .resume-header,
    .education-item,
    .bullet-list li {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function compact(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value?.trim()));
}

function renderSection(title: string, content: string): string {
  return `<section class="resume-section">
        <h2 class="section-title">${escapeHtml(title)}</h2>
        ${content}
      </section>`;
}

function bulletText(bullet: string | ResumeBullet): string {
  return typeof bullet === "string" ? bullet : bullet.text;
}

function renderExperience(experience: ResumeExperience): string {
  const meta = compact([experience.location]).join(" | ");
  const summary = experience.summary
    ? `<p class="experience-summary">${escapeHtml(experience.summary)}</p>`
    : "";
  const bullets = (experience.bullets ?? []).length
    ? `<ul class="bullet-list">
          ${(experience.bullets ?? [])
            .map((bullet) => `<li>${escapeHtml(bulletText(bullet))}</li>`)
            .join("\n          ")}
        </ul>`
    : "";

  return `<article class="experience-item">
          <div class="experience-heading">
            <span class="experience-company">${escapeHtml(experience.company)}</span>
            <span class="experience-title">${escapeHtml(experience.title)}</span>
            <span class="experience-dates">${escapeHtml(experience.dates)}</span>
          </div>
          ${meta ? `<p class="experience-meta">${escapeHtml(meta)}</p>` : ""}
          ${summary}
          ${bullets}
        </article>`;
}

function renderEducation(education: ResumeEducation): string {
  return `<article class="education-item">
          <div class="education-heading">
            <span class="education-institution">${escapeHtml(education.institution)}</span>
            <span class="education-credential">${escapeHtml(education.credential)}</span>
            <span class="education-dates">${escapeHtml(education.dates ?? "")}</span>
          </div>
          ${education.location ? `<p class="experience-meta">${escapeHtml(education.location)}</p>` : ""}
        </article>`;
}

export function renderResumeHtml(document: ResumeDocument): string {
  const contact = compact([
    document.contact?.location,
    document.contact?.phone,
    document.contact?.email,
    document.contact?.linkedIn,
    document.contact?.website,
  ]);
  const sections: string[] = [];

  if (document.summary) {
    sections.push(renderSection("Professional Summary", `<p>${escapeHtml(document.summary)}</p>`));
  }

  if (document.strengths?.length) {
    sections.push(
      renderSection(
        "Core Strengths",
        document.strengths
          .map(
            (group) =>
              `<p class="strength-row"><strong class="strength-category">${escapeHtml(group.category)}:</strong> ${group.skills.map(escapeHtml).join(" | ")}</p>`,
          )
          .join("\n        "),
      ),
    );
  }

  if (document.experience?.length) {
    sections.push(
      renderSection("Professional Experience", document.experience.map(renderExperience).join("\n        ")),
    );
  }

  if (document.education?.length) {
    sections.push(renderSection("Education", document.education.map(renderEducation).join("\n        ")));
  }

  if (document.certifications?.length) {
    sections.push(renderSection("Certifications", `<p class="inline-list">${document.certifications.map(escapeHtml).join(" | ")}</p>`));
  }

  if (document.tools?.length) {
    sections.push(renderSection("Tools", `<p class="inline-list">${document.tools.map(escapeHtml).join(" | ")}</p>`));
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(document.name)} Resume</title>
  <style>${themeCss}</style>
</head>
<body>
  <main class="resume-document">
    <div class="top-rule"></div>
    <header class="resume-header">
      <div>
        <h1 class="resume-name">${escapeHtml(document.name)}</h1>
        ${document.targetTitle ? `<p class="resume-title">${escapeHtml(document.targetTitle)}</p>` : ""}
      </div>
      ${contact.length ? `<ul class="contact-list">${contact.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
    </header>
    <div class="resume-body">
      ${sections.join("\n      ")}
    </div>
  </main>
</body>
</html>`;
}
