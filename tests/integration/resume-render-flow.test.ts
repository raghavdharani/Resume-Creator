import { describe, expect, it } from "vitest";

import { resumeDocumentSchema } from "../../src/domain";
import { productManagerResumeFixture } from "../../src/fixtures";
import { toRenderResumeDocument } from "../../src/integration/resume-render-adapter";
import { analyzeResumeDensity, renderResumeHtml } from "../../src/render";

describe("canonical resume to ATS-safe HTML flow", () => {
  it("validates, adapts, renders, and analyzes a structured resume fixture", () => {
    const resume = resumeDocumentSchema.parse(productManagerResumeFixture);
    const renderDocument = toRenderResumeDocument(resume);
    const html = renderResumeHtml(renderDocument);
    const density = analyzeResumeDensity(renderDocument);

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Jordan Lee");
    expect(html).toContain("Northstar Platforms");
    expect(html).toContain("Professional Experience");
    expect(html).toContain("@page");
    expect(density.bulletCount).toBe(2);
    expect(density.estimatedPages).toBeGreaterThanOrEqual(1);
  });
});
