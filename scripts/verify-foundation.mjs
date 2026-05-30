import { readFile } from "node:fs/promises";

import { analyzeResumeDensity } from "../src/render/density.ts";
import { renderResumeHtml } from "../src/render/renderer.ts";
import { resumeDocumentSchema } from "../src/domain/resume.ts";

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const fixture = {
  name: "Foundation Check",
  targetTitle: "Senior Product Manager | Workflow Automation",
  contact: {
    location: "Toronto, ON",
    email: "foundation@example.com"
  },
  summary: "Product leader focused on operational workflow modernization.",
  strengths: [
    {
      category: "Product & Delivery",
      skills: ["Discovery", "Platform modernization", "Launch planning"]
    }
  ],
  experience: [
    {
      company: "Example Corp",
      title: "Senior Product Manager",
      dates: "2024 - Present",
      bullets: [
        "Led workflow modernization across customer onboarding and operations.",
        "Improved delivery clarity through structured discovery and specification reviews."
      ]
    }
  ],
  education: [
    {
      institution: "Example University",
      credential: "Bachelor of Commerce"
    }
  ]
};

const html = renderResumeHtml(fixture);
const density = analyzeResumeDensity(fixture);

const canonicalFixture = {
  schemaVersion: "1.0.0",
  id: "foundation-check",
  header: {
    name: "Foundation Check",
    targetTitle: "Senior Product Manager"
  },
  summary: "Product leader focused on workflow modernization.",
  groupedStrengths: [
    {
      category: "Product",
      strengths: ["Discovery", "Platform modernization"]
    }
  ],
  experience: [
    {
      id: "experience-1",
      company: "Example Corp",
      title: "Senior Product Manager",
      dateRange: {
        start: "2024",
        isCurrent: true
      },
      bullets: [
        {
          id: "bullet-1",
          text: "Led workflow modernization across customer onboarding and operations.",
          evidenceLinks: [
            {
              evidenceId: "evidence-1",
              classification: "confirmed",
              approvalState: "not_required",
              source: "foundation fixture"
            }
          ]
        }
      ]
    }
  ],
  education: [
    {
      institution: "Example University",
      credential: "Bachelor of Commerce"
    }
  ]
};

check(html.includes("<!doctype html>"), "renderer did not produce a complete HTML document");
check(html.includes("@page"), "renderer is missing print page CSS");
check(html.includes("size: Letter"), "renderer is missing Letter page sizing");
check(html.includes("Foundation Check"), "renderer omitted candidate name");
check(html.includes("Example Corp"), "renderer omitted experience");
check(html.includes('content: "-"'), "renderer is missing safe hyphen bullets");
check(density.bulletCount === 2, "density analyzer returned an unexpected bullet count");
check(density.warnings.length === 0, "concise fixture unexpectedly triggered density warnings");

const parsedCanonicalFixture = resumeDocumentSchema.safeParse(canonicalFixture);
check(parsedCanonicalFixture.success, "canonical resume schema rejected a valid fixture");

const riskyFixture = structuredClone(canonicalFixture);
riskyFixture.experience[0].bullets[0].evidenceLinks[0].classification =
  "high_risk_stretch";
const parsedRiskyFixture = resumeDocumentSchema.safeParse(riskyFixture);
check(
  !parsedRiskyFixture.success,
  "canonical resume schema accepted an unapproved high-risk stretch"
);

const [
  schemaSource,
  adapterSource,
  appSource,
  firestoreRules,
  storageRules,
  functionsSource,
  migrationGuide,
  viteEntry
] = await Promise.all([
  readFile(new URL("../src/domain/resume.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/integration/resume-render-adapter.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/app/ModernizationApp.tsx", import.meta.url), "utf8"),
  readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
  readFile(new URL("../storage.rules", import.meta.url), "utf8"),
  readFile(new URL("../functions/src/index.ts", import.meta.url), "utf8"),
  readFile(new URL("../docs/modernization/MIGRATION.md", import.meta.url), "utf8"),
  readFile(new URL("../index.vite.html", import.meta.url), "utf8")
]);

check(schemaSource.includes("resumeDocumentSchema"), "canonical resume schema is missing");
check(schemaSource.includes("evidenceLinkedBulletSchema"), "evidence-linked bullet schema is missing");
check(adapterSource.includes("toRenderResumeDocument"), "schema-to-renderer adapter is missing");
check(
  appSource.includes("resumeDocumentSchema.safeParse") || appSource.includes("resumeDocumentSchema.parse"),
  "frontend does not validate structured resume data"
);
check(appSource.includes("renderResumeHtml"), "frontend does not call the ATS-safe renderer");
check(firestoreRules.includes("request.auth.uid == userId"), "Firestore owner isolation is missing");
check(firestoreRules.includes("allow read, write: if false"), "Firestore deny default is missing");
check(firestoreRules.includes("function isAdmin()"), "Firestore admin support is missing");
check(storageRules.includes("request.auth.uid == userId"), "Storage owner isolation is missing");
check(functionsSource.includes("requireAuthenticatedUser"), "backend auth guard is missing");
check(functionsSource.includes("defineSecret"), "backend secret declaration is missing");
check(migrationGuide.includes("Incremental Migration"), "legacy migration plan is missing");
check(viteEntry.includes("/src/app/main.tsx"), "Vite application entry is missing");

if (failures.length) {
  console.error("Foundation verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Foundation verification passed.");
  console.log(`Rendered HTML characters: ${html.length}`);
  console.log(`Density analysis: ${density.bulletCount} bullets, ${density.estimatedPages} estimated page(s)`);
  console.log("Schema validation: valid fixture accepted, unapproved high-risk stretch rejected");
}
