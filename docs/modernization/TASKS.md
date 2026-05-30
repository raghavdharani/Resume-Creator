# Modernization Task Board

## Slice 0: Program Baseline

- [x] Save consolidated assessment and UX critique.
- [x] Save target architecture and stack recommendation.
- [x] Create durable progress log.

## Slice 1: Tooling Foundation

- [x] Add `package.json`.
- [x] Add TypeScript configuration.
- [x] Add Vitest configuration.
- [x] Add a Vite application entry point without removing the existing prototype.

## Slice 2: Canonical Resume Model

- [x] Define resume, experience, bullet, evidence-link, and approval schemas.
- [x] Add product-manager and technical-specialist fixtures.
- [x] Add schema validation tests.

## Slice 3: ATS-Safe Renderer

- [x] Create HTML/CSS theme renderer.
- [x] Apply master-gutter, header-band, grouped-strengths, and bullet-spacing rules.
- [x] Add page-density heuristics.
- [x] Add renderer tests and generated preview fixture.

## Slice 4: Modular Frontend

- [x] Create React application shell.
- [x] Add structured resume preview.
- [x] Add split, preview-only, and editor-only modes.
- [x] Keep legacy prototype available during migration.

## Slice 5: Backend And Security

- [x] Add `firebase.json`.
- [x] Add Firestore tenant-isolation rules.
- [x] Add Storage rules.
- [x] Scaffold authenticated Cloud Function for AI tailoring.
- [x] Scaffold server-side PDF render endpoint.

## Slice 6: Integration

- [x] Connect schema fixture to renderer and frontend preview.
- [x] Add integration tests.
- [x] Document migration path from legacy Markdown and hardcoded seed data.

## Slice 7: Final QA

- [x] Run Vitest suite. User reported successful execution outside the restricted Codex sandbox.
- [x] Run typecheck.
- [x] Run production build. Confirmed by generated `dist/` artifacts from user-run command.
- [x] Run Functions build.
- [x] Run dependency-free foundation integration verification.
- [x] Review generated HTML preview artifact.
- [x] Run browser integration QA against generated `dist/` output.
- [x] Save final implementation report.

## Slice 8: Filesystem Markdown Import

- [x] Add a dependency-light Markdown resume importer.
- [x] Emit canonical JSON-shaped staging records with conservative source links.
- [x] Add CLI input, candidate-slug, and output arguments.
- [x] Add built-in Node test coverage with a temporary Markdown fixture.
- [x] Document importer usage and evidence review requirements.

## Slice 9: Rendered Artifact QA

- [x] Add dependency-light rendered HTML artifact QA CLI.
- [x] Check required resume sections and ATS-safe single-column markers.
- [x] Check Letter sizing, safe hyphen bullet CSS, suspicious glyphs, and density heuristics.
- [x] Support optional JSON report output.
- [x] Add Node built-in tests with temporary HTML files.
- [x] Document artifact QA usage.

## Slice 10: Real Candidate Pipeline

- [x] Add canonical JSON to HTML renderer CLI.
- [x] Add one-command Markdown import, canonical validation, HTML render, and artifact-QA pipeline.
- [x] Process a real product-manager Markdown resume.
- [x] Process a real technical-specialist Markdown resume.
- [x] Save canonical JSON, HTML, and QA reports locally.
- [x] Add frontend JSON upload control without hardcoding candidate-specific data.
- [x] Add dependency-light end-to-end integration test for import, render, and artifact QA.
- [x] Rebuild Vite bundle and browser-test the updated shell. Host build succeeded; upload-picker presence and accepted JSON types verified. Browser automation cannot assign a local file through the operating-system picker, so selecting a real JSON file remains a manual smoke test.

## Slice 11: Exported PDF Artifact QA

- [x] Add Python CLI for exported PDF artifact checks.
- [x] Check readable page count and extractable text.
- [x] Check required resume sections and suspicious bullet-rendering glyphs.
- [x] Support optional JSON report output and page rendering to PNG.
- [x] Add unittest coverage using temporary PyMuPDF-generated PDFs.
- [x] Document PDF QA usage.

## Slice 12: Local PDF Rendering And Visual QA

- [x] Add PyMuPDF structural fallback renderer.
- [x] Add immutable versioned PDF artifact behavior.
- [x] Add fallback renderer unittest.
- [x] Render corrected real candidate PDFs.
- [x] Run PDF extraction QA and PNG rendering QA.
- [x] Record fallback CSS-fidelity limitations honestly.
- [x] Add preferred Chromium PDF renderer script for host-side execution.
- [x] Add one-command structural fallback publish wrapper with PDF QA and PNG rendering.
- [x] Run Chromium PDF rendering and visually verify polished output.
- [x] Add a stabilization wait because Edge can return before its background renderer flushes the PDF.
