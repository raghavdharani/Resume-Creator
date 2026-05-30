import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { processMarkdownResume } from "../../scripts/process-markdown-resume.mjs";

test("processes Markdown through import, render, and artifact QA", async () => {
  const directory = await mkdtemp(join(tmpdir(), "resume-os-pipeline-"));
  const input = join(directory, "resume.md");
  const outputDir = join(directory, "artifacts");

  await writeFile(input, `# Jordan Lee

Senior Product Manager | Workflow Automation

Toronto, ON | jordan.lee@example.com | https://www.linkedin.com/in/jordan-lee

## Professional Summary

Product manager focused on workflow modernization and measurable operational improvements.

## Core Strengths

Product: Product strategy | Discovery | Roadmaps

## Professional Experience

### Northstar Platforms | Senior Product Manager | 2023 - Present | Toronto, ON

- Lead discovery and delivery for operations workflow improvements.

## Education

Example University | Bachelor of Commerce
`, "utf8");

  const result = await processMarkdownResume([
    "--input", input,
    "--candidate", "jordan_lee",
    "--outputDir", outputDir
  ]);

  const canonical = JSON.parse(await readFile(result.json, "utf8"));
  const html = await readFile(result.html, "utf8");
  const qa = JSON.parse(await readFile(result.qa, "utf8"));

  assert.equal(canonical.header.name, "Jordan Lee");
  assert.equal(canonical.experience.length, 1);
  assert.match(html, /Northstar Platforms/);
  assert.equal(qa.passed, true);
  assert.equal(result.density.bulletCount, 1);
});
