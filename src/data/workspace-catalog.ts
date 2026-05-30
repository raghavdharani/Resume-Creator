import type { ResumeDocument } from "../domain";

export interface WorkspaceSourceResume {
  name: string;
  path: string;
  extension: string;
  sizeBytes: number;
}

export interface WorkspaceJobDescription {
  name: string;
  path: string;
  content: string;
  extension: string;
}

export interface WorkspaceCollateral {
  name: string;
  path: string;
  packageName: string;
  category: string;
  extension: string;
  sizeBytes: number;
}

export type EvidenceKind = "confirmed_claim" | "approved_metric" | "approved_extrapolation";

export interface WorkspaceEvidence {
  id: string;
  kind: EvidenceKind;
  text: string;
  source: string;
  status: string;
  usableForRoles: string[];
  interviewDefense?: string;
}

export interface WorkspaceClaimCandidate {
  id: string;
  proposed: string;
  safer: string;
  risk: "moderate" | "high" | "very_high";
  reason: string;
  question: string;
}

export interface WorkspaceProfile {
  slug: string;
  name: string;
  positioning: string;
  targetRoles: string[];
  sourceResumes: WorkspaceSourceResume[];
  jobDescriptions: WorkspaceJobDescription[];
  collaterals: WorkspaceCollateral[];
  evidence: WorkspaceEvidence[];
  claimCandidates: WorkspaceClaimCandidate[];
  forbiddenClaims: string[];
  rejectedClaims: string[];
  resume: ResumeDocument;
}

export interface WorkspaceCatalog {
  generatedAt: string;
  profiles: WorkspaceProfile[];
}
