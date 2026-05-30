import { z } from "zod";

export const SCHEMA_VERSION = "1.0.0" as const;

export const schemaVersionSchema = z.literal(SCHEMA_VERSION);

export const evidenceClassificationSchema = z.enum([
  "confirmed",
  "reasonable_reframe",
  "strategic_extrapolation",
  "high_risk_stretch",
  "do_not_use",
]);

export const approvalStateSchema = z.enum([
  "not_required",
  "pending",
  "approved",
  "rejected",
  "revised",
]);

export const evidenceLinkSchema = z
  .object({
    evidenceId: z.string().min(1),
    classification: evidenceClassificationSchema,
    approvalState: approvalStateSchema,
    source: z.string().min(1),
    note: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((evidence, context) => {
    const requiresApproval =
      evidence.classification === "strategic_extrapolation" ||
      evidence.classification === "high_risk_stretch";

    if (requiresApproval && evidence.approvalState === "not_required") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${evidence.classification} evidence must record an approval decision`,
        path: ["approvalState"],
      });
    }

    if (
      evidence.classification === "do_not_use" &&
      evidence.approvalState !== "rejected"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "do_not_use evidence must be rejected",
        path: ["approvalState"],
      });
    }
  });

export const evidenceLinkedBulletSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    evidenceLinks: z.array(evidenceLinkSchema).min(1),
  })
  .strict();

export const contactLinkSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().url(),
  })
  .strict();

export const resumeHeaderSchema = z
  .object({
    name: z.string().min(1),
    targetTitle: z.string().min(1),
    location: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().email().optional(),
    links: z.array(contactLinkSchema).default([]),
  })
  .strict();

export const groupedStrengthSchema = z
  .object({
    category: z.string().min(1),
    strengths: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const dateRangeSchema = z
  .object({
    start: z.string().min(1),
    end: z.string().min(1).optional(),
    isCurrent: z.boolean().default(false),
  })
  .strict()
  .superRefine((dateRange, context) => {
    if (dateRange.isCurrent && dateRange.end) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current experience must not define an end date",
        path: ["end"],
      });
    }

    if (!dateRange.isCurrent && !dateRange.end) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Past experience must define an end date",
        path: ["end"],
      });
    }
  });

export const experienceBlockSchema = z
  .object({
    id: z.string().min(1),
    company: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1).optional(),
    dateRange: dateRangeSchema,
    summary: z.string().min(1).optional(),
    bullets: z.array(evidenceLinkedBulletSchema).min(1),
  })
  .strict();

export const educationSchema = z
  .object({
    institution: z.string().min(1),
    credential: z.string().min(1),
    fieldOfStudy: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    graduationDate: z.string().min(1).optional(),
  })
  .strict();

export const certificationSchema = z
  .object({
    name: z.string().min(1),
    issuer: z.string().min(1).optional(),
    issuedDate: z.string().min(1).optional(),
    credentialUrl: z.string().url().optional(),
  })
  .strict();

export const toolGroupSchema = z
  .object({
    category: z.string().min(1),
    tools: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const resumeDocumentSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    id: z.string().min(1),
    header: resumeHeaderSchema,
    summary: z.string().min(1),
    groupedStrengths: z.array(groupedStrengthSchema).min(1),
    experience: z.array(experienceBlockSchema).min(1),
    education: z.array(educationSchema).min(1),
    certifications: z.array(certificationSchema).optional(),
    tools: z.array(toolGroupSchema).optional(),
  })
  .strict();

export type SchemaVersion = z.infer<typeof schemaVersionSchema>;
export type EvidenceClassification = z.infer<
  typeof evidenceClassificationSchema
>;
export type ApprovalState = z.infer<typeof approvalStateSchema>;
export type EvidenceLink = z.infer<typeof evidenceLinkSchema>;
export type EvidenceLinkedBullet = z.infer<typeof evidenceLinkedBulletSchema>;
export type ContactLink = z.infer<typeof contactLinkSchema>;
export type ResumeHeader = z.infer<typeof resumeHeaderSchema>;
export type GroupedStrength = z.infer<typeof groupedStrengthSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type ExperienceBlock = z.infer<typeof experienceBlockSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type ToolGroup = z.infer<typeof toolGroupSchema>;
export type ResumeDocument = z.infer<typeof resumeDocumentSchema>;
