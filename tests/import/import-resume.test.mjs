import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { parseResumeMarkdown, runCli } from "../../scripts/import-resume.mjs";

const fixture = `# Jordan Lee
Senior Product Manager | Workflow Automation
Toronto, ON | 416-555-0100 | jordan.lee@example.com | https://www.linkedin.com/in/jordan-lee

## Professional Summary
Product manager focused on workflow modernization and measurable operational improvements.

## Core Strengths
Product: Product strategy | Discovery | Roadmaps
Delivery: Cross-functional leadership | Workflow automation

## Professional Experience
### Northstar Platforms | Senior Product Manager | 2023 - Present | Toronto, ON
- Lead discovery and delivery for operations workflow improvements.
- Define launch plans with engineering and business stakeholders.

### Beacon Commerce | Product Manager | 2020 - 2023
- Prioritized platform enhancements for internal teams.

### Cedar Systems
**Product Analyst** | Toronto, ON | 2018 - 2020
- Gathered requirements for internal workflow tools.

## Education
- Example University | Bachelor of Commerce | 2020 | Toronto, ON

## Certifications
- Certified Scrum Product Owner | Scrum Alliance

## Tools
Product delivery: Jira | Confluence | Figma
`;

test("parses common Markdown resume sections into canonical schema-shaped JSON", () => {
  const sourcePath = resolve("users/jordan_lee/source_resumes/jordan.md");
  const resume = parseResumeMarkdown(fixture, { candidateSlug: "jordan_lee", sourcePath });

  assert.equal(resume.schemaVersion, "1.0.0");
  assert.equal(resume.header.name, "Jordan Lee");
  assert.equal(resume.header.targetTitle, "Senior Product Manager | Workflow Automation");
  assert.equal(resume.header.email, "jordan.lee@example.com");
  assert.equal(resume.header.links[0].label, "LinkedIn");
  assert.deepEqual(resume.groupedStrengths[0], {
    category: "Product",
    strengths: ["Product strategy", "Discovery", "Roadmaps"],
  });
  assert.equal(resume.experience[0].dateRange.isCurrent, true);
  assert.equal(resume.experience[1].dateRange.end, "2023");
  assert.equal(resume.experience[2].company, "Cedar Systems");
  assert.equal(resume.experience[2].title, "Product Analyst");
  assert.equal(resume.experience[2].location, "Toronto, ON");
  assert.equal(resume.experience[0].bullets[0].evidenceLinks[0].source, sourcePath);
  assert.equal(resume.experience[0].bullets[0].evidenceLinks[0].classification, "confirmed");
  assert.equal(resume.experience[0].bullets[0].evidenceLinks[0].approvalState, "not_required");
  assert.match(resume.experience[0].bullets[0].evidenceLinks[0].note, /Manually review/);
  assert.equal(resume.education[0].credential, "Bachelor of Commerce");
  assert.equal(resume.certifications[0].issuer, "Scrum Alliance");
  assert.deepEqual(resume.tools[0].tools, ["Jira", "Confluence", "Figma"]);
});

test("writes imported JSON through the CLI argument contract", async () => {
  const directory = await mkdtemp(join(tmpdir(), "resume-import-"));
  const input = join(directory, "resume.md");
  const output = join(directory, "nested", "resume.json");
  try {
    await writeFile(input, fixture, "utf8");
    await runCli(["--input", input, "--candidate", "jordan_lee", "--output", output]);
    const imported = JSON.parse(await readFile(output, "utf8"));
    assert.equal(imported.id, "jordan_lee-imported-resume");
    assert.equal(imported.experience.length, 3);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects incomplete source resumes instead of inventing missing content", () => {
  assert.throws(
    () =>
      parseResumeMarkdown("# Jordan Lee\nSenior Product Manager\n", {
        candidateSlug: "jordan_lee",
        sourcePath: "resume.md",
      }),
    /Missing: summary, grouped strengths, experience, education institution and credential/,
  );
});
