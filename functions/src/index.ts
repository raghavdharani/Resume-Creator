import { initializeApp } from "firebase-admin/app";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const aiProviderApiKey = defineSecret("AI_PROVIDER_API_KEY");
const aiProviderBaseUrl = defineSecret("AI_PROVIDER_BASE_URL");

const MAX_TEXT_LENGTH = 100_000;
const MAX_RESUME_ID_LENGTH = 128;
const MAX_PDF_HTML_LENGTH = 500_000;

type UnknownRecord = Record<string, unknown>;

function requireAuthenticatedUser(auth: { uid: string } | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Authentication is required.");
  }

  return auth.uid;
}

function requireObject(value: unknown, fieldName: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HttpsError("invalid-argument", `${fieldName} must be an object.`);
  }

  return value as UnknownRecord;
}

function requireNonEmptyString(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > maxLength
  ) {
    throw new HttpsError(
      "invalid-argument",
      `${fieldName} must be a non-empty string no longer than ${maxLength} characters.`,
    );
  }

  return value;
}

function rejectUnknownFields(
  payload: UnknownRecord,
  allowedFields: readonly string[],
): void {
  const unknownFields = Object.keys(payload).filter(
    (key) => !allowedFields.includes(key),
  );

  if (unknownFields.length > 0) {
    throw new HttpsError(
      "invalid-argument",
      `Unsupported fields: ${unknownFields.join(", ")}.`,
    );
  }
}

export const tailorResumeWithAi = onCall(
  {
    secrets: [aiProviderApiKey, aiProviderBaseUrl],
    timeoutSeconds: 120,
  },
  async (request) => {
    const userId = requireAuthenticatedUser(request.auth);
    const payload = requireObject(request.data, "data");
    rejectUnknownFields(payload, ["resumeId", "resumeText", "jobDescription"]);

    const resumeId = requireNonEmptyString(
      payload.resumeId,
      "resumeId",
      MAX_RESUME_ID_LENGTH,
    );
    const resumeText = requireNonEmptyString(
      payload.resumeText,
      "resumeText",
      MAX_TEXT_LENGTH,
    );
    const jobDescription = requireNonEmptyString(
      payload.jobDescription,
      "jobDescription",
      MAX_TEXT_LENGTH,
    );

    // TODO: Call the selected AI provider, persist an owner-scoped tailoring
    // result under users/{userId}, and return a durable job or result ID.
    void aiProviderApiKey.value();
    void aiProviderBaseUrl.value();
    void userId;
    void resumeId;
    void resumeText;
    void jobDescription;

    throw new HttpsError(
      "failed-precondition",
      "AI tailoring provider integration is not configured.",
    );
  },
);

export const generateResumePdf = onCall(
  {
    timeoutSeconds: 120,
    memory: "1GiB",
  },
  async (request) => {
    const userId = requireAuthenticatedUser(request.auth);
    const payload = requireObject(request.data, "data");
    rejectUnknownFields(payload, ["resumeId", "html"]);

    const resumeId = requireNonEmptyString(
      payload.resumeId,
      "resumeId",
      MAX_RESUME_ID_LENGTH,
    );
    const html = requireNonEmptyString(
      payload.html,
      "html",
      MAX_PDF_HTML_LENGTH,
    );

    // TODO: Render sanitized HTML with the server-side PDF renderer, write the
    // PDF to users/{userId}/generated-pdfs/{resumeId}.pdf, and return metadata.
    void userId;
    void resumeId;
    void html;

    throw new HttpsError(
      "failed-precondition",
      "Server-side PDF renderer integration is not configured.",
    );
  },
);
