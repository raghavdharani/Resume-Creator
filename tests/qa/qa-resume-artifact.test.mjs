import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { analyzeResumeArtifact, runCli } from "../../scripts/qa-resume-artifact.mjs";

function html(overrides = "") {
  return `<!doctype html>
<html>
<head>
  <style>
    .resume-body { display: block; }
    .resume-section { margin-bottom: 12px; }
    .bullet-list { list-style: none; }
    .bullet-list li::before { content: "-"; }
    @page { size: Letter; margin: 0.42in 0; }
    ${overrides}
  </style>
</head>
<body>
  <main class="resume-body">
    <section class="resume-section"><h2 class="section-title">Professional Summary</h2><p>Summary</p></section>
    <section class="resume-section"><h2 class="section-title">Core Strengths</h2><p>Skills</p></section>
    <section class="resume-section"><h2 class="section-title">Professional Experience</h2><ul class="bullet-list"><li>Delivered a clear product outcome.</li></ul></section>
    <section class="resume-section"><h2 class="section-title">Education</h2><p>University</p></section>
  </main>
</body>
</html>`;
}

test("accepts an ATS-safe Letter-sized rendered resume", () => {
  const report = analyzeResumeArtifact(html());

  assert.equal(report.passed, true);
  assert.equal(report.summary.errors, 0);
  assert.equal(report.checks.singleColumnMarkers, true);
  assert.equal(report.checks.safeHyphenBulletCss, true);
});

test("reports required-section, layout, page-size, and bullet CSS failures", () => {
  const unsafe = html("main { grid-template-columns: 1fr 1fr; }")
    .replace("Professional Summary", "Profile")
    .replace('class="resume-body"', 'class="document"')
    .replace("@page { size: Letter; margin: 0.42in 0; }", "@page { size: A4; }")
    .replace('content: "-";', 'content: "\\2022";');
  const report = analyzeResumeArtifact(unsafe);
  const codes = report.issues.map(({ code }) => code);

  assert.equal(report.passed, false);
  assert.ok(codes.includes("missing_required_section"));
  assert.ok(codes.includes("missing_single_column_markers"));
  assert.ok(codes.includes("unsafe_multi_column_css"));
  assert.ok(codes.includes("missing_letter_page_size"));
  assert.ok(codes.includes("unsafe_bullet_css"));
});

test("flags suspicious replacement glyphs and dense inline content", () => {
  const longText = `Outcome ${"detail ".repeat(45)}`;
  const denseLines = Array.from({ length: 6 }, () => `<p>${longText}</p>`).join("\n");
  const risky = html().replace("</main>", `${denseLines}<p>Broken ${"\uFFFD"} glyph</p></main>`);
  const report = analyzeResumeArtifact(risky);
  const codes = report.issues.map(({ code }) => code);

  assert.equal(report.passed, false);
  assert.ok(codes.includes("suspicious_glyph"));
  assert.ok(codes.includes("excessive_inline_html_density"));
});

test("CLI writes a JSON report and returns a failing status for invalid HTML", async () => {
  const tempDirectory = await mkdtemp(join(tmpdir(), "resume-artifact-qa-"));
  const artifactPath = join(tempDirectory, "resume.html");
  const reportPath = join(tempDirectory, "report.json");

  try {
    await writeFile(artifactPath, html().replace("Education", "Training"), "utf8");
    const status = await runCli([artifactPath, "--json", reportPath], { log() {} });
    const report = JSON.parse(await readFile(reportPath, "utf8"));

    assert.equal(status, 1);
    assert.equal(report.passed, false);
    assert.ok(report.issues.some(({ code }) => code === "missing_required_section"));
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
});
