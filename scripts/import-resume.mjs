#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = "1.0.0";
const REVIEW_NOTE =
  "Import staging default only: confirmed/not_required records that this bullet was copied from the selected Markdown resume. Manually review the claim and connect it to the candidate evidence bank before publishing.";

const SECTION_ALIASES = new Map([
  ["summary", "summary"],
  ["professional summary", "summary"],
  ["profile", "summary"],
  ["core strengths", "strengths"],
  ["strengths", "strengths"],
  ["skills", "strengths"],
  ["professional experience", "experience"],
  ["experience", "experience"],
  ["work experience", "experience"],
  ["education", "education"],
  ["education and certifications", "education"],
  ["certifications", "certifications"],
  ["certification", "certifications"],
  ["education and certifications", "education"],
  ["tools", "tools"],
  ["technical skills", "tools"],
]);

function cleanMarkdown(value) {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/\*\*|__|`/g, "")
    .trim();
}

function compact(values) {
  return values.map((value) => value?.trim()).filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function normalizedSection(line) {
  const cleaned = cleanMarkdown(line).replace(/:$/, "").toLowerCase();
  const isHeading = /^#{1,6}\s+/.test(line) || /^[A-Z][A-Z &/-]+:?$/.test(line.trim());
  return isHeading ? SECTION_ALIASES.get(cleaned) : undefined;
}

function isMarkdownHeading(line) {
  return /^##\s+/.test(line);
}

function splitParts(line) {
  return compact(cleanMarkdown(line).split(/\s*\|\s*/));
}

function isDateRange(value) {
  return /(?:19|20)\d{2}|present|current/i.test(value);
}

function parseDateRange(value) {
  const normalized = value.replace(/\u2013|\u2014/g, "-").trim();
  const match = normalized.match(
    /^(.*?)\s*(?:-|to)\s*(present|current|.*?)$/i,
  );
  const start = (match?.[1] ?? normalized).trim();
  const rawEnd = match?.[2]?.trim();
  const isCurrent = /^(present|current)$/i.test(rawEnd ?? "");

  return {
    start,
    ...(rawEnd && !isCurrent ? { end: rawEnd } : {}),
    isCurrent,
  };
}

function parseHeader(lines) {
  const content = lines.map(cleanMarkdown).filter(Boolean);
  const name = content[0];
  const rolePattern =
    /\b(manager|developer|consultant|specialist|architect|engineer|lead|director|product|sap|abap)\b/i;
  const titleCandidates = content.filter(
    (line, index) =>
      index > 0 &&
      !line.includes("@") &&
      !/^https?:\/\//i.test(line) &&
      !/\+?\d[\d\s().-]{6,}/.test(line),
  );
  const targetTitle =
    titleCandidates.find((line) => rolePattern.test(line)) ??
    titleCandidates[0];
  const contactText = content.filter((line) => line !== name && line !== targetTitle).join(" | ");
  const contactParts = compact(contactText.split(/\s*[|]\s*/));
  const email = contactText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0];
  const phone = contactText.match(/(?:\+?\d[\d\s().-]{6,}\d)/)?.[0];
  const urls = [...contactText.matchAll(/https?:\/\/[^\s|]+/gi)].map(([url]) => url);
  const location = contactParts.find(
    (part) =>
      part !== email &&
      part !== phone &&
      !part.includes("@") &&
      !/^https?:\/\//i.test(part),
  );

  return {
    name,
    targetTitle,
    ...(location ? { location } : {}),
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
    links: urls.map((url) => ({
      label: /linkedin\.com/i.test(url) ? "LinkedIn" : "Website",
      url,
    })),
  };
}

function parseGroupedRows(lines, valueKey) {
  return lines
    .map(cleanMarkdown)
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return undefined;
      const category = line.slice(0, separator).trim();
      const values = compact(line.slice(separator + 1).split(/\s*[|,]\s*/));
      return category && values.length ? { category, [valueKey]: values } : undefined;
    })
    .filter(Boolean);
}

function parseExperience(lines, candidateSlug, sourcePath) {
  const blocks = [];
  let current;
  let pendingCompany;

  function startBlock(line) {
    const parts = splitParts(line);
    const dateIndex = parts.findIndex(isDateRange);
    const hasSplitCompanyHeading = pendingCompany && dateIndex >= 1;
    if (!hasSplitCompanyHeading && dateIndex < 2) return false;
    const sequence = blocks.length + 1;
    const rolePattern =
      /\b(manager|developer|consultant|specialist|architect|engineer|lead|director|analyst)\b/i;
    const titleFirst =
      !hasSplitCompanyHeading &&
      rolePattern.test(parts[0]) &&
      !rolePattern.test(parts[1]);
    const company = hasSplitCompanyHeading
      ? pendingCompany
      : titleFirst
        ? parts[1]
        : parts[0];
    const title = hasSplitCompanyHeading
      ? parts[0]
      : titleFirst
        ? parts[0]
        : parts[1];
    const metadataStart = hasSplitCompanyHeading ? 1 : 2;
    const location = parts
      .slice(metadataStart)
      .find((part, index) => metadataStart + index !== dateIndex);
    current = {
      id: `${candidateSlug}-experience-${sequence}-${slugify(company)}`,
      company,
      title,
      ...(location ? { location } : {}),
      dateRange: parseDateRange(parts[dateIndex]),
      bullets: [],
    };
    pendingCompany = undefined;
    blocks.push(current);
    return true;
  }

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;
    if (/^#{3,6}\s+/.test(rawLine) || /^\*\*.+\*\*(?:\s*\|.*)?$/.test(rawLine)) {
      if (startBlock(rawLine)) continue;
      if (/^#{3,6}\s+/.test(rawLine)) {
        pendingCompany = cleanMarkdown(rawLine);
        continue;
      }
    }
    if ((!current || pendingCompany) && startBlock(rawLine)) continue;
    if (!current) continue;

    if (/^\s*[-*+]\s+/.test(rawLine)) {
      const text = cleanMarkdown(rawLine);
      const bulletNumber = current.bullets.length + 1;
      const bulletId = `${current.id}-bullet-${bulletNumber}`;
      current.bullets.push({
        id: bulletId,
        text,
        evidenceLinks: [
          {
            evidenceId: `${bulletId}-import-evidence`,
            classification: "confirmed",
            approvalState: "not_required",
            source: sourcePath,
            note: REVIEW_NOTE,
          },
        ],
      });
    } else if (!current.summary) {
      current.summary = cleanMarkdown(rawLine);
    }
  }

  return blocks;
}

function parseEducation(lines) {
  return lines
    .map(cleanMarkdown)
    .filter(Boolean)
    .map((line) => {
      if (/\b(certified|certification|cspo|scrum alliance|pragmatic marketing)\b/i.test(line)) {
        return undefined;
      }
      const parts = compact(line.split(/\s*\|\s*/));
      if (parts.length === 1) {
        const commaParts = compact(line.split(/\s*,\s*/));
        return {
          credential: commaParts[0],
          institution: commaParts.slice(1).join(", ") || "Institution requires manual review",
        };
      }
      const dateIndex = parts.findIndex(isDateRange);
      const institution = parts[0];
      const credential = parts[1];
      return {
        institution,
        credential,
        ...(dateIndex >= 2 ? { graduationDate: parts[dateIndex] } : {}),
        ...(dateIndex >= 2 && parts[dateIndex + 1] ? { location: parts[dateIndex + 1] } : {}),
      };
    })
    .filter(Boolean);
}

function parseCertifications(lines) {
  return lines
    .map(cleanMarkdown)
    .filter(Boolean)
    .map((line) => {
      const [name, issuer, issuedDate] = compact(line.split(/\s*\|\s*/));
      return { name, ...(issuer ? { issuer } : {}), ...(issuedDate ? { issuedDate } : {}) };
    });
}

function assertRequired(document) {
  const missing = [];
  if (!document.header.name) missing.push("header name");
  if (!document.header.targetTitle) missing.push("header target title");
  if (!document.summary) missing.push("summary");
  if (!document.groupedStrengths.length) missing.push("grouped strengths");
  if (!document.experience.length) missing.push("experience");
  if (document.experience.some((block) => !block.bullets.length)) {
    missing.push("at least one bullet for each experience");
  }
  if (!document.education.length || document.education.some((item) => !item.credential)) {
    missing.push("education institution and credential");
  }
  if (missing.length) {
    throw new Error(`Cannot create canonical resume JSON. Missing: ${missing.join(", ")}.`);
  }
}

export function parseResumeMarkdown(markdown, { candidateSlug, sourcePath }) {
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(candidateSlug)) {
    throw new Error("Candidate slug must use lowercase letters, numbers, and underscores.");
  }

  const sections = { header: [] };
  let activeSection = "header";
  for (const line of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const section = normalizedSection(line);
    if (section) {
      activeSection = section;
      sections[section] ??= [];
    } else if (isMarkdownHeading(line)) {
      activeSection = `extra:${slugify(cleanMarkdown(line))}`;
      sections[activeSection] ??= [];
    } else {
      sections[activeSection] ??= [];
      sections[activeSection].push(line);
    }
  }

  const document = {
    schemaVersion: SCHEMA_VERSION,
    id: `${candidateSlug}-imported-resume`,
    header: parseHeader(sections.header),
    summary: compact((sections.summary ?? []).map(cleanMarkdown)).join(" "),
    groupedStrengths: parseGroupedRows(sections.strengths ?? [], "strengths"),
    experience: parseExperience(sections.experience ?? [], candidateSlug, sourcePath),
    education: parseEducation(sections.education ?? []),
  };

  const certifications = parseCertifications(sections.certifications ?? []);
  const combinedEducationCertifications = compact(
    (sections.education ?? []).map(cleanMarkdown)
  ).filter((line) =>
    /\b(certified|certification|cspo|scrum alliance|pragmatic marketing)\b/i.test(line)
  );
  certifications.push(...parseCertifications(combinedEducationCertifications));
  const tools = parseGroupedRows(sections.tools ?? [], "tools");
  if (certifications.length) document.certifications = certifications;
  if (tools.length) document.tools = tools;

  assertRequired(document);
  return document;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    args[key.slice(2)] = value;
    index += 1;
  }
  return args;
}

export async function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.input || !args.output || !args.candidate) {
    throw new Error(
      "Usage: node scripts/import-resume.mjs --input <resume.md> --candidate <candidate_slug> --output <resume.json>",
    );
  }
  const sourcePath = resolve(args.input);
  const outputPath = resolve(args.output);
  const markdown = await readFile(sourcePath, "utf8");
  const document = parseResumeMarkdown(markdown, {
    candidateSlug: args.candidate,
    sourcePath,
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  return outputPath;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCli()
    .then((outputPath) => console.log(`Imported canonical resume JSON: ${outputPath}`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
