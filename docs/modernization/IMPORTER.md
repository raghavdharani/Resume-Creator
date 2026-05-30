# Markdown Resume Importer

## Purpose

`scripts/import-resume.mjs` imports a selected candidate Markdown resume into the canonical
resume JSON shape. It is a dependency-light staging tool built with Node standard-library APIs.
It does not read other candidate files, infer missing claims, or write to Firebase.

## Usage

```powershell
node scripts/import-resume.mjs `
  --input users/jordan_lee/source_resumes/resume.md `
  --candidate jordan_lee `
  --output users/jordan_lee/outputs/imported/resume.json
```

The candidate slug must use lowercase letters, numbers, and underscores.

## Supported Markdown

The importer recognizes common headings for:

- professional summary
- grouped strengths such as `Product: Discovery | Roadmaps`
- professional experience headings such as
  `### Northstar Platforms | Senior Product Manager | 2023 - Present | Toronto, ON`
- split experience headings with `### Northstar Platforms` followed by
  `**Senior Product Manager** | Toronto, ON | 2023 - Present`
- bullet points below each experience heading
- education rows such as `Example University | Bachelor of Commerce | 2020`
- optional certifications and grouped tools

The header uses the first non-empty line as the candidate name, the next suitable line as the
target title, and extracts common email, phone, URL, and location fields from the remaining
header text.

## Evidence Safety

Each imported bullet receives one conservative staging evidence link:

- `source` is the selected Markdown resume path.
- `classification` is `confirmed`.
- `approvalState` is `not_required`.
- `note` explicitly states that this is an import staging default and manual review is required.

This means only that the bullet was copied from the selected resume. It does not prove the
underlying claim. Before publishing, review each imported bullet and connect it to the
candidate evidence bank where available.

## Validation Behavior

The importer stops instead of inventing content when required canonical sections are missing.
The required import minimum is a name, target title, summary, grouped strengths, at least one
experience with bullets, and education with an institution and credential.

## Test

```powershell
npm.cmd run test:import
```
