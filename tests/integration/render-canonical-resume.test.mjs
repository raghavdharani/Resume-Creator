import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { renderCanonicalResume } from "../../scripts/render-canonical-resume.mjs";

test("renders validated canonical JSON to ATS-safe HTML", async () => {
  const directory = await mkdtemp(join(tmpdir(), "resume-os-render-"));
  const inputPath = join(directory, "resume.json");
  const outputPath = join(directory, "resume.html");

  await writeFile(inputPath, JSON.stringify({
    schemaVersion: "1.0.0",
    id: "render-test",
    header: { name: "Render Test", targetTitle: "Senior Product Manager" },
    summary: "Product leader focused on workflow modernization.",
    groupedStrengths: [{ category: "Product", strengths: ["Discovery"] }],
    experience: [{
      id: "experience-1",
      company: "Example Corp",
      title: "Senior Product Manager",
      dateRange: { start: "2024", isCurrent: true },
      bullets: [{
        id: "bullet-1",
        text: "Led workflow modernization.",
        evidenceLinks: [{
          evidenceId: "evidence-1",
          classification: "confirmed",
          approvalState: "not_required",
          source: "test fixture"
        }]
      }]
    }],
    education: [{ institution: "Example University", credential: "Bachelor of Commerce" }]
  }), "utf8");

  const result = await renderCanonicalResume({ inputPath, outputPath });
  const html = await readFile(outputPath, "utf8");

  assert.equal(result.resumeId, "render-test");
  assert.equal(result.density.bulletCount, 1);
  assert.match(html, /Render Test/);
  assert.match(html, /Example Corp/);
  assert.match(html, /@page/);
});
