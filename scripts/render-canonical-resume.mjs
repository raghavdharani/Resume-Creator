import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resumeDocumentSchema } from "../src/domain/resume.ts";
import { toRenderResumeDocument } from "../src/integration/resume-render-adapter.ts";
import { analyzeResumeDensity } from "../src/render/density.ts";
import { renderResumeHtml } from "../src/render/renderer.ts";

export async function renderCanonicalResume({ inputPath, outputPath }) {
  const canonicalResume = resumeDocumentSchema.parse(
    JSON.parse(await readFile(inputPath, "utf8"))
  );
  const renderDocument = toRenderResumeDocument(canonicalResume);
  const density = analyzeResumeDensity(renderDocument);
  const html = renderResumeHtml(renderDocument);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");

  return { density, html, inputPath, outputPath, resumeId: canonicalResume.id };
}

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--input") parsed.inputPath = args[index += 1];
    else if (arg === "--output") parsed.outputPath = args[index += 1];
  }
  if (!parsed.inputPath || !parsed.outputPath) {
    throw new Error(
      "Usage: npm.cmd run render:resume -- --input <resume.json> --output <resume.html>"
    );
  }
  return {
    inputPath: resolve(parsed.inputPath),
    outputPath: resolve(parsed.outputPath)
  };
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (entryPath === fileURLToPath(import.meta.url)) {
  try {
    const result = await renderCanonicalResume(parseArgs(process.argv.slice(2)));
    console.log(`Rendered ${result.resumeId} to ${result.outputPath}`);
    console.log(
      `Density: ${result.density.bulletCount} bullets, ${result.density.estimatedPages} estimated page(s), ${result.density.warnings.length} warning(s)`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
