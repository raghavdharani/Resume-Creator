# Legacy Migration Path

## Current State

The legacy prototype stores candidate seed data, application state, generated Markdown, and
preview rendering logic inside `app.js`. Filesystem records under `users/{user_slug}/` and
Firebase records can diverge from that seed state.

## Target State

The canonical resume payload is the versioned schema under `src/domain/`. New UI code should:

1. Load a candidate and application record.
2. Parse the structured resume payload with `resumeDocumentSchema`.
3. Surface validation failures before export.
4. Adapt validated records with `toRenderResumeDocument`.
5. Render ATS-safe HTML with `renderResumeHtml`.
6. Submit the HTML to the authenticated PDF backend when it is implemented.
7. Save generated artifacts and QA results under the application version.

## Incremental Migration

### Phase 1: Preserve Legacy

- Keep `index.html`, `index.css`, and `app.js` available as a reference prototype.
- Run the new Vite shell through `index.vite.html`.
- Use typed fixtures while the import pipeline is being built.

### Phase 2: Import Existing Candidate Records

- Add a script that reads `users/{user_slug}/profile.md`, context JSON files, and selected
  resume Markdown.
- Map confirmed evidence to evidence-linked bullets.
- Mark unmatched bullets for manual review rather than inventing evidence links.
- Save the structured payload as a new resume version.

### Phase 3: Firestore Canonicalization

- Store structured candidate records below `users/{uid}`.
- Keep filesystem export as an explicit backup and Codex-readable package.
- Remove frontend seed records only after imported records have been verified.

### Phase 4: Retire Legacy Preview

- Replace browser `window.print()` with the authenticated PDF callable.
- Add PDF extraction and screenshot QA.
- Keep legacy files archived until final package parity is confirmed.

