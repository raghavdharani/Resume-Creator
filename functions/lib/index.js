"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumePdf = exports.tailorResumeWithAi = void 0;
const app_1 = require("firebase-admin/app");
const params_1 = require("firebase-functions/params");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
const aiProviderApiKey = (0, params_1.defineSecret)("AI_PROVIDER_API_KEY");
const aiProviderBaseUrl = (0, params_1.defineSecret)("AI_PROVIDER_BASE_URL");
const MAX_TEXT_LENGTH = 100_000;
const MAX_RESUME_ID_LENGTH = 128;
const MAX_PDF_HTML_LENGTH = 500_000;
function requireAuthenticatedUser(auth) {
    if (!auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "Authentication is required.");
    }
    return auth.uid;
}
function requireObject(value, fieldName) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new https_1.HttpsError("invalid-argument", `${fieldName} must be an object.`);
    }
    return value;
}
function requireNonEmptyString(value, fieldName, maxLength) {
    if (typeof value !== "string" ||
        value.trim().length === 0 ||
        value.length > maxLength) {
        throw new https_1.HttpsError("invalid-argument", `${fieldName} must be a non-empty string no longer than ${maxLength} characters.`);
    }
    return value;
}
function rejectUnknownFields(payload, allowedFields) {
    const unknownFields = Object.keys(payload).filter((key) => !allowedFields.includes(key));
    if (unknownFields.length > 0) {
        throw new https_1.HttpsError("invalid-argument", `Unsupported fields: ${unknownFields.join(", ")}.`);
    }
}
exports.tailorResumeWithAi = (0, https_1.onCall)({
    secrets: [aiProviderApiKey, aiProviderBaseUrl],
    timeoutSeconds: 120,
}, async (request) => {
    const userId = requireAuthenticatedUser(request.auth);
    const payload = requireObject(request.data, "data");
    rejectUnknownFields(payload, ["resumeId", "resumeText", "jobDescription"]);
    const resumeId = requireNonEmptyString(payload.resumeId, "resumeId", MAX_RESUME_ID_LENGTH);
    const resumeText = requireNonEmptyString(payload.resumeText, "resumeText", MAX_TEXT_LENGTH);
    const jobDescription = requireNonEmptyString(payload.jobDescription, "jobDescription", MAX_TEXT_LENGTH);
    // TODO: Call the selected AI provider, persist an owner-scoped tailoring
    // result under users/{userId}, and return a durable job or result ID.
    void aiProviderApiKey.value();
    void aiProviderBaseUrl.value();
    void userId;
    void resumeId;
    void resumeText;
    void jobDescription;
    throw new https_1.HttpsError("failed-precondition", "AI tailoring provider integration is not configured.");
});
exports.generateResumePdf = (0, https_1.onCall)({
    timeoutSeconds: 120,
    memory: "1GiB",
}, async (request) => {
    const userId = requireAuthenticatedUser(request.auth);
    const payload = requireObject(request.data, "data");
    rejectUnknownFields(payload, ["resumeId", "html"]);
    const resumeId = requireNonEmptyString(payload.resumeId, "resumeId", MAX_RESUME_ID_LENGTH);
    const html = requireNonEmptyString(payload.html, "html", MAX_PDF_HTML_LENGTH);
    // TODO: Render sanitized HTML with the server-side PDF renderer, write the
    // PDF to users/{userId}/generated-pdfs/{resumeId}.pdf, and return metadata.
    void userId;
    void resumeId;
    void html;
    throw new https_1.HttpsError("failed-precondition", "Server-side PDF renderer integration is not configured.");
});
