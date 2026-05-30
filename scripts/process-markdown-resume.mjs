import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runCli as importResume } from "./import-resume.mjs";
import { runCli as runArtifactQa } from "./qa-resume-artifact.mjs";
import { renderCanonicalResume } from "./render-canonical-resume.mjs";

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const value = args[index += 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
    parsed[arg.slice(2)] = value;
  }
  if (!parsed.input || !parsed.candidate || !parsed.outputDir) {
    throw new Error(
      "Usage: npm.cmd run process:resume -- --input <resume.md> --candidate <candidate_slug> --outputDir <folder>"
    );
  }
  const outputDir = resolve(parsed.outputDir);
  return {
    candidate: parsed.candidate,
    input: resolve(parsed.input),
    json: resolve(outputDir, `${parsed.candidate}.canonical.json`),
    html: resolve(outputDir, `${parsed.candidate}.rendered.html`),
    qa: resolve(outputDir, `${parsed.candidate}.qa.json`)
  };
}

export async function processMarkdownResume(args) {
  const paths = parseArgs(args);
  await importResume([
    "--input", paths.input,
    "--candidate", paths.candidate,
    "--output", paths.json
  ]);
  const renderResult = await renderCanonicalResume({
    inputPath: paths.json,
    outputPath: paths.html
  });
  const qaCode = await runArtifactQa([paths.html, "--json", paths.qa]);
  if (qaCode !== 0) throw new Error(`Artifact QA failed for ${paths.html}`);
  return { ...paths, density: renderResult.density };
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (entryPath === fileURLToPath(import.meta.url)) {
  try {
    const result = await processMarkdownResume(process.argv.slice(2));
    console.log(`Processed resume JSON: ${result.json}`);
    console.log(`Rendered HTML: ${result.html}`);
    console.log(`Artifact QA report: ${result.qa}`);
    console.log(
      `Density: ${result.density.bulletCount} bullets, ${result.density.estimatedPages} estimated page(s), ${result.density.warnings.length} renderer warning(s)`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
