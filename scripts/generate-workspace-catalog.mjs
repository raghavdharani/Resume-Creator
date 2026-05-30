import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const workspaceRoot = resolve(".");
const outputPath = resolve("src/data/workspace-catalog.generated.ts");

const profileConfigs = [
  {
    slug: "raghav_dharani",
    name: "Raghav Dharani",
    positioning: "Senior product leader focused on AI-enabled workflow platforms and B2B SaaS.",
    targetRoles: [
      "Senior Product Manager",
      "Lead Product Manager",
      "Principal Product Manager",
      "Senior AI Technical Product Manager",
      "AI Product Manager"
    ],
    canonicalResume:
      "docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani.canonical.json",
    claimCandidates: [
      {
        id: "raghav-ml-architecture",
        proposed: "Architected deep-learning models to automate store-level replenishment decisions.",
        safer: "Launched ML-powered replenishment workflows using demand signals to guide stocking recommendations, reducing overproduction by 18%.",
        risk: "very_high",
        reason: "The source evidence supports product ownership of ML-enabled workflows, not hands-on ML model architecture.",
        question: "Did you personally design or implement ML models, or did you own product requirements and workflow integration?"
      },
      {
        id: "raghav-compliance-domain",
        proposed: "Owned regulated insurance-compliance workflow products across enterprise claims environments.",
        safer: "Led compliance-adjacent operational workflow products and a claims-platform rebuild without overstating direct insurance-compliance ownership.",
        risk: "high",
        reason: "The evidence supports claims workflows and compliance-adjacent store operations, but not direct insurance-compliance ownership.",
        question: "Should this remain compliance-adjacent framing, or can you document direct regulated-domain ownership?"
      }
    ]
  },
  {
    slug: "aatmika_natarajan",
    name: "Aatmika Natarajan",
    positioning: "SAP technical consultant and ABAP specialist with S/4HANA delivery depth.",
    targetRoles: [
      "SAP Technical Consultant",
      "SAP ABAP Developer",
      "SAP S/4HANA Technical Consultant",
      "SAP Integration Consultant",
      "SAP BTP / CPI Technical Consultant"
    ],
    canonicalResume:
      "docs/modernization/artifacts/aatmika_pipeline_v3/aatmika_natarajan.canonical.json",
    claimCandidates: [
      {
        id: "aatmika-migration-ownership",
        proposed: "Owned the enterprise S/4HANA brownfield migration strategy and implementation roadmap.",
        safer: "Served as a core ABAP developer supporting ECC to S/4HANA brownfield migration and subsequent upgrades.",
        risk: "high",
        reason: "The source material supports hands-on migration delivery, remediation, and upgrade support, not enterprise program ownership.",
        question: "Did you own migration strategy, or should the wording remain focused on core ABAP delivery?"
      },
      {
        id: "aatmika-btp-architecture",
        proposed: "Led SAP BTP and CPI integration architecture for global supply-chain transformation.",
        safer: "Supported BTP/CPI extension work while keeping the S/4HANA core cleaner and enabling required business functionality.",
        risk: "very_high",
        reason: "The available profile guardrails prohibit inventing BTP, CPI, integration, or leadership depth beyond the source evidence.",
        question: "Which BTP or CPI components did you personally design, configure, or support?"
      }
    ]
  }
];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(entryPath)));
    else files.push(entryPath);
  }
  return files;
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

async function readGuardrails(path) {
  const content = await readFile(resolve(path), "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) =>
      line &&
      !line.startsWith("#") &&
      !line.startsWith("|") &&
      !line.startsWith("Do not use these") &&
      !line.startsWith("Add claims here") &&
      line !== "Do not invent:" &&
      line !== "No rejected claims recorded yet."
    )
    .map((line) => line.replace(/^-\s*/, ""));
}

const profiles = [];
for (const profile of profileConfigs) {
  const sourceRoot = resolve("users", profile.slug, "source_resumes");
  const sourceResumes = (await listFiles(sourceRoot))
    .filter((filePath) => [".md", ".txt", ".pdf", ".docx"].includes(extname(filePath).toLowerCase()))
    .map(async (filePath) => ({
      name: relative(sourceRoot, filePath).replaceAll("\\", "/"),
      path: relative(workspaceRoot, filePath).replaceAll("\\", "/"),
      extension: extname(filePath).slice(1).toLowerCase(),
      sizeBytes: (await stat(filePath)).size
    }));
  const resolvedSourceResumes = (await Promise.all(sourceResumes))
    .sort((left, right) => left.name.localeCompare(right.name));
  const jdRoot = resolve("users", profile.slug, "job_descriptions");
  const jobDescriptions = (
    await Promise.all(
      (await listFiles(jdRoot))
        .filter((filePath) => [".md", ".txt"].includes(extname(filePath).toLowerCase()))
        .map(async (filePath) => ({
          name: relative(jdRoot, filePath).replaceAll("\\", "/"),
          path: relative(workspaceRoot, filePath).replaceAll("\\", "/"),
          content: await readFile(filePath, "utf8"),
          extension: extname(filePath).slice(1).toLowerCase()
        }))
    )
  ).sort((left, right) => left.name.localeCompare(right.name));
  const outputRoot = resolve("users", profile.slug, "outputs");
  const collaterals = (
    await Promise.all(
      (await listFiles(outputRoot))
        .filter((filePath) => filePath.split(/[\\/]/).at(-1) !== ".gitkeep")
        .map(async (filePath) => {
          const outputRelativePath = relative(outputRoot, filePath).replaceAll("\\", "/");
          const [packageName, category = "other"] = outputRelativePath.split("/");
          return {
            name: outputRelativePath.split("/").at(-1),
            path: relative(workspaceRoot, filePath).replaceAll("\\", "/"),
            packageName,
            category,
            extension: extname(filePath).slice(1).toLowerCase() || "file",
            sizeBytes: (await stat(filePath)).size
          };
        })
    )
  ).sort((left, right) => left.path.localeCompare(right.path));
  const contextRoot = resolve("users", profile.slug, "context");
  const confirmedClaims = await readJson(join(contextRoot, "evidence_bank.json"));
  const approvedMetrics = await readJson(join(contextRoot, "approved_metrics.json"));
  const approvedExtrapolations = await readJson(join(contextRoot, "approved_extrapolations.json"));
  const resume = await readJson(profile.canonicalResume);
  const evidence = [
    ...confirmedClaims.map((item, index) => ({
      id: `${profile.slug}-claim-${index + 1}`,
      kind: "confirmed_claim",
      text: item.claim,
      source: item.source,
      status: item.status,
      usableForRoles: item.usable_for_roles ?? [],
      interviewDefense: item.interview_defense
    })),
    ...approvedMetrics.map((item, index) => ({
      id: `${profile.slug}-metric-${index + 1}`,
      kind: "approved_metric",
      text: item.metric,
      source: item.source,
      status: item.status,
      usableForRoles: item.usable_for_roles ?? []
    })),
    ...approvedExtrapolations.map((item, index) => ({
      id: `${profile.slug}-extrapolation-${index + 1}`,
      kind: "approved_extrapolation",
      text: item.claim,
      source: item.source,
      status: item.status,
      usableForRoles: item.usable_for_roles ?? [],
      interviewDefense: item.interview_defense
    }))
  ];

  profiles.push({
    slug: profile.slug,
    name: profile.name,
    positioning: profile.positioning,
    targetRoles: profile.targetRoles,
    sourceResumes: resolvedSourceResumes,
    jobDescriptions,
    collaterals,
    evidence,
    claimCandidates: profile.claimCandidates,
    forbiddenClaims: await readGuardrails(join(contextRoot, "forbidden_claims.md")),
    rejectedClaims: await readGuardrails(join(contextRoot, "rejected_claims.md")),
    resume
  });
}

const generated = `// Generated by scripts/generate-workspace-catalog.mjs. Do not edit manually.
import type { WorkspaceCatalog } from "./workspace-catalog";

export const workspaceCatalog: WorkspaceCatalog = ${JSON.stringify(
  {
    generatedAt: new Date().toISOString(),
    profiles
  },
  null,
  2
)};
`;

await writeFile(outputPath, generated, "utf8");
console.log(`Generated ${relative(workspaceRoot, outputPath)} with ${profiles.length} profiles.`);
