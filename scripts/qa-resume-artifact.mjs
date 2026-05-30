#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const REQUIRED_SECTIONS = [
  "Professional Summary",
  "Core Strengths",
  "Professional Experience",
  "Education"
];

const DENSITY_LIMITS = {
  longLineCharacters: 240,
  maxLongLines: 5,
  longListItemCharacters: 240,
  maxLongListItems: 0,
  maxListItems: 24
};

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function issue(code, severity, message, details = {}) {
  return { code, severity, message, ...details };
}

function hasClass(html, className) {
  return new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, "i").test(html);
}

function extractSectionTitles(html) {
  return [...html.matchAll(/<h[1-6]\b[^>]*class=["'][^"']*\bsection-title\b[^"']*["'][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) => stripTags(match[1]));
}

function collectDensityMetrics(html) {
  const lines = html.split(/\r?\n/);
  const longLines = lines
    .map((line, index) => ({ line: index + 1, characters: line.length }))
    .filter(({ characters }) => characters > DENSITY_LIMITS.longLineCharacters);
  const listItems = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match) =>
    stripTags(match[1])
  );
  const longListItems = listItems
    .map((text, index) => ({ item: index + 1, characters: text.length }))
    .filter(({ characters }) => characters > DENSITY_LIMITS.longListItemCharacters);

  return {
    lineCount: lines.length,
    longLines,
    listItemCount: listItems.length,
    longListItems
  };
}

export function analyzeResumeArtifact(html, options = {}) {
  const source = String(html);
  const issues = [];
  const sectionTitles = extractSectionTitles(source);
  const density = collectDensityMetrics(source);
  const requiredSectionResults = REQUIRED_SECTIONS.map((section) => ({
    section,
    present: sectionTitles.some((title) => title.toLowerCase() === section.toLowerCase())
  }));

  for (const result of requiredSectionResults) {
    if (!result.present) {
      issues.push(issue("missing_required_section", "error", `Missing required section: ${result.section}.`, {
        section: result.section
      }));
    }
  }

  if (!hasClass(source, "resume-body") || !hasClass(source, "resume-section")) {
    issues.push(
      issue(
        "missing_single_column_markers",
        "error",
        "Expected ATS-safe resume-body and resume-section layout markers."
      )
    );
  }

  const unsafeColumnPatterns = [
    { pattern: /\bcolumn-count\s*:\s*[2-9]/i, marker: "column-count" },
    { pattern: /\bcolumns\s*:\s*(?:[2-9]\d*|\d+(?:px|em|rem|in|cm|mm|pt)\s+[2-9])/i, marker: "columns" },
    { pattern: /\bgrid-template-columns\s*:\s*(?!none\b)[^;}]+/i, marker: "grid-template-columns" }
  ];
  for (const { pattern, marker } of unsafeColumnPatterns) {
    if (pattern.test(source)) {
      issues.push(issue("unsafe_multi_column_css", "error", `Detected ATS-risk multi-column CSS: ${marker}.`, {
        marker
      }));
    }
  }

  if (!/@page\s*{[^}]*\bsize\s*:\s*letter\b[^}]*}/is.test(source)) {
    issues.push(issue("missing_letter_page_size", "error", "Expected @page CSS with Letter sizing."));
  }

  const safeHyphenBulletCss =
    /\.bullet-list\s+li::before\s*{[^}]*\bcontent\s*:\s*["']-["'][^}]*}/is.test(source) &&
    /\.bullet-list\s*{[^}]*\blist-style\s*:\s*none\b[^}]*}/is.test(source);
  if (!safeHyphenBulletCss) {
    issues.push(
      issue(
        "unsafe_bullet_css",
        "error",
        'Expected .bullet-list with list-style: none and li::before content: "-".'
      )
    );
  }

  const suspiciousGlyphs = [
    { glyph: "\uFFFD", label: "Unicode replacement character" },
    { glyph: "\u00e2\u20ac\u00a2", label: "mojibake bullet" },
    { glyph: "\u00e2\u20ac\u201c", label: "mojibake en dash" },
    { glyph: "\u00e2\u20ac\u201d", label: "mojibake em dash" },
    { glyph: "\u25a1", label: "empty box glyph" }
  ];
  for (const { glyph, label } of suspiciousGlyphs) {
    const count = source.split(glyph).length - 1;
    if (count > 0) {
      issues.push(issue("suspicious_glyph", "error", `Detected ${label}.`, { glyph, count }));
    }
  }

  if (density.longLines.length > DENSITY_LIMITS.maxLongLines) {
    issues.push(
      issue(
        "excessive_inline_html_density",
        "warning",
        `${density.longLines.length} HTML lines exceed ${DENSITY_LIMITS.longLineCharacters} characters.`,
        { count: density.longLines.length, examples: density.longLines.slice(0, 5) }
      )
    );
  }
  if (density.longListItems.length > DENSITY_LIMITS.maxLongListItems) {
    issues.push(
      issue(
        "long_list_item_density",
        "warning",
        `${density.longListItems.length} list item(s) exceed ${DENSITY_LIMITS.longListItemCharacters} characters.`,
        { count: density.longListItems.length, examples: density.longListItems.slice(0, 5) }
      )
    );
  }
  if (density.listItemCount > DENSITY_LIMITS.maxListItems) {
    issues.push(
      issue(
        "excessive_list_item_density",
        "warning",
        `${density.listItemCount} list items exceed the scan-friendly limit of ${DENSITY_LIMITS.maxListItems}.`,
        { count: density.listItemCount }
      )
    );
  }

  return {
    artifact: options.artifact ?? null,
    generatedAt: new Date().toISOString(),
    passed: !issues.some(({ severity }) => severity === "error"),
    summary: {
      errors: issues.filter(({ severity }) => severity === "error").length,
      warnings: issues.filter(({ severity }) => severity === "warning").length
    },
    checks: {
      requiredSections: requiredSectionResults,
      singleColumnMarkers:
        hasClass(source, "resume-body") && hasClass(source, "resume-section"),
      letterPageSize: /@page\s*{[^}]*\bsize\s*:\s*letter\b[^}]*}/is.test(source),
      safeHyphenBulletCss
    },
    density,
    issues
  };
}

function printUsage() {
  console.error("Usage: node scripts/qa-resume-artifact.mjs <rendered.html> [--json <report.json>]");
}

export async function runCli(argv, logger = console) {
  const args = [...argv];
  const htmlPath = args.shift();
  if (!htmlPath || htmlPath === "--help" || htmlPath === "-h") {
    printUsage();
    return htmlPath ? 0 : 2;
  }

  let jsonPath;
  while (args.length) {
    const flag = args.shift();
    if (flag === "--json" && args.length) {
      jsonPath = args.shift();
    } else {
      throw new Error(`Unknown or incomplete argument: ${flag}`);
    }
  }

  const artifactPath = resolve(htmlPath);
  const html = await readFile(artifactPath, "utf8");
  const report = analyzeResumeArtifact(html, { artifact: artifactPath });

  if (jsonPath) {
    await writeFile(resolve(jsonPath), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  logger.log(`Artifact QA ${report.passed ? "passed" : "failed"}: ${artifactPath}`);
  logger.log(`Errors: ${report.summary.errors}; warnings: ${report.summary.warnings}`);
  for (const finding of report.issues) {
    logger.log(`- [${finding.severity}] ${finding.code}: ${finding.message}`);
  }

  return report.passed ? 0 : 1;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  try {
    process.exitCode = await runCli(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
