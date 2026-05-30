import { describe, expect, it } from "vitest";

import {
  SCHEMA_VERSION,
  evidenceLinkSchema,
  resumeDocumentSchema,
} from "../../src/domain";
import {
  productManagerResumeFixture,
  technicalSpecialistResumeFixture,
} from "../../src/fixtures";

describe("resumeDocumentSchema", () => {
  it.each([
    ["product manager", productManagerResumeFixture],
    ["technical specialist", technicalSpecialistResumeFixture],
  ])("accepts the %s fixture", (_name, fixture) => {
    expect(resumeDocumentSchema.parse(fixture)).toEqual(fixture);
  });

  it("rejects unsupported schema versions", () => {
    const result = resumeDocumentSchema.safeParse({
      ...productManagerResumeFixture,
      schemaVersion: "2.0.0",
    });

    expect(result.success).toBe(false);
    expect(SCHEMA_VERSION).toBe("1.0.0");
  });

  it("requires each bullet to reference evidence", () => {
    const [firstExperience] = productManagerResumeFixture.experience;
    const [firstBullet] = firstExperience.bullets;
    const result = resumeDocumentSchema.safeParse({
      ...productManagerResumeFixture,
      experience: [
        {
          ...firstExperience,
          bullets: [{ ...firstBullet, evidenceLinks: [] }],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});

describe("evidenceLinkSchema", () => {
  it("requires an approval decision for strategic extrapolation", () => {
    const result = evidenceLinkSchema.safeParse({
      evidenceId: "evidence-approval-required",
      classification: "strategic_extrapolation",
      approvalState: "not_required",
      source: "fixture source resume",
    });

    expect(result.success).toBe(false);
  });

  it("accepts approved strategic extrapolation", () => {
    const result = evidenceLinkSchema.safeParse({
      evidenceId: "evidence-approved",
      classification: "strategic_extrapolation",
      approvalState: "approved",
      source: "approval audit trail",
    });

    expect(result.success).toBe(true);
  });

  it("only permits do-not-use evidence when it is rejected", () => {
    const result = evidenceLinkSchema.safeParse({
      evidenceId: "evidence-rejected",
      classification: "do_not_use",
      approvalState: "pending",
      source: "truth audit",
    });

    expect(result.success).toBe(false);
  });
});
