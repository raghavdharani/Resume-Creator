# Resume OS Modernization Program

## Objective

Turn the current Resume OS prototype into a maintainable resume-production system with:

- one canonical structured resume model
- evidence-linked and approval-aware claims
- ATS-safe HTML/CSS themes
- reliable PDF generation and QA
- secure server-side AI calls
- version-controlled Firebase security rules
- a modular frontend foundation

## Current Assessment

Resume OS currently has two overlapping implementations:

1. A mature filesystem workflow under `users/{user_slug}/` driven by `AGENTS.md`.
2. A newer browser application in `index.html`, `index.css`, and `app.js`.

The filesystem workflow is strong at candidate isolation, reusable evidence, truth controls,
approval trails, and application-package structure. The browser UI is a useful prototype,
but it duplicates candidate data inside `app.js`, relies on a handwritten Markdown preview
parser, calls Gemini directly from the browser, and exports PDFs through `window.print()`.

The core product risk is divergence: filesystem records, browser seed data, and Firebase can
become competing sources of truth.

## UX Audit Critique

The existing `UI-UX/ux_ui_audit_report.md` contains useful ideas:

- replace raw context tables with evidence cards
- add inline approval and rejection controls
- add a draggable editor-preview split pane
- offer a rich-text mode for non-technical users
- add selectable package exports
- replace browser printing with direct PDF rendering

The audit is too generous in several places:

- It describes the prototype as a finished premium application without a test method.
- It praises resume spacing despite the known cramped-bullet problem.
- It treats OAuth as frictionless without security-rule or authentication tests.
- It focuses on visual gauges before data integrity, ATS validation, and rendering reliability.
- It does not address accessibility, schema validation, migration strategy, or test coverage.
- It does not identify the duplicated candidate-data stores as the highest architectural risk.

## Target Architecture

```text
Candidate profile + evidence + JD
              |
              v
      Structured resume JSON
              |
              v
 Evidence validation and approvals
              |
              v
       HTML/CSS resume theme
              |
      +-------+-------+
      |               |
      v               v
 Puppeteer PDF     DOCX template
      |
      v
 PDF extraction + density + screenshot QA
      |
      v
 Versioned application package
```

## Recommended Stack

### Frontend

- Vite
- React
- TypeScript
- Firebase modular SDK
- Zod for schema validation
- Tiptap later, when rich-text editing is introduced

### Backend

- Firebase Cloud Functions for authenticated orchestration
- Cloud Secret Manager-backed function secrets for AI credentials
- Cloud Run later if PDF rendering needs a longer-running container

### Data

- Firestore as the cloud product source of truth
- Cloud Storage for source files and generated artifacts
- Filesystem export/import for portability, backup, and Codex workflows

### Documents

- Structured resume JSON as the canonical content format
- HTML/CSS themes for PDF layout
- Puppeteer for direct PDF generation
- DOCX templates through `docxtemplater` or `docxtpl`
- PDF text extraction and PNG screenshots for QA

### Testing

- Vitest for unit and integration tests
- Firebase Emulator Suite for rules tests
- Renderer snapshot and density tests
- PDF text-order checks after direct rendering is enabled

## Prioritized Recommendations

### Data Integrity

- Define one canonical resume schema.
- Link every resume bullet to evidence and approval metadata.
- Make Firestore the cloud product source of truth.
- Keep filesystem records as explicit import/export artifacts.
- Remove hardcoded candidate records from the frontend after migration tools exist.
- Add schema validation and versioned migrations.

### Resume Presentation

- Build reusable ATS-safe HTML/CSS themes.
- Implement controlled bullet spacing, line height, indentation, and line length.
- Prevent orphaned company headers with print page-break rules.
- Add density warnings before export.
- Support two-page and three-page presets without shrinking typography aggressively.
- Implement the existing pale-blue-header and master-gutter presentation rules.

### Editing

- Add editor-only, preview-only, and split modes.
- Add a draggable split pane.
- Add evidence-linked bullet controls: shorten, rewrite, soften, approve, remove, reorder.
- Add revision comparison and primary-artifact selection.
- Introduce rich-text editing only after structured blocks are stable.

### Claims Workflow

- Replace raw evidence tables with readable evidence cards.
- Add inline approve, reject, revise, and forbid actions.
- Block final export if unresolved risky claims remain in the selected resume.
- Reuse approved decisions across applications.
- Surface interview-defensibility prompts alongside approved risky claims.

### Security

- Move Gemini calls behind authenticated server-side functions.
- Remove AI keys from browser `localStorage`.
- Add Firestore and Storage rules under version control.
- Add tenant-isolation rules tests.
- Add Firebase App Check when deploying beyond private prototype use.

### Maintainability

- Split the monolithic `app.js` into modules.
- Use TypeScript and schema validation.
- Add a package manager, build commands, and tests.
- Preserve the existing static prototype until the replacement path is verified.

## Execution Slices

| Slice | Scope | Independent Verification |
| --- | --- | --- |
| 0 | Save assessment, roadmap, and progress log | Docs exist and are readable |
| 1 | Add Vite, TypeScript, Vitest, and scripts | `npm test`, `npm run typecheck` |
| 2 | Add canonical resume schema and fixtures | Schema unit tests |
| 3 | Add HTML/CSS theme renderer and density checks | Renderer unit tests and generated HTML |
| 4 | Add modular React workspace shell using the schema | Frontend build |
| 5 | Add Firebase rules and Cloud Functions scaffolding | Rules inspection and function typecheck |
| 6 | Add renderer integration and export adapter | Integration tests |
| 7 | Run complete build, tests, and manual artifact review | Integration report |

## Out Of Scope For The First Pass

- Migrating every existing resume artifact automatically
- Production deployment
- Full rich-text editor integration
- Paid editor extensions
- Cloud Run deployment
- Final DOCX template engine implementation

These remain planned follow-up slices after the new foundation is verified.

