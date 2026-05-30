# Local Resume Processing Pipeline

## Purpose

The local pipeline converts a selected Markdown resume into canonical JSON, validates it through
the structured renderer, produces ATS-safe HTML, and writes an artifact-QA JSON report.

## Command

```powershell
npm.cmd run process:resume -- `
  --input users/raghav_dharani/outputs/example/resume/resume.md `
  --candidate raghav_dharani `
  --outputDir docs/modernization/artifacts/raghav_pipeline
```

## Outputs

```text
{candidate}.canonical.json
{candidate}.rendered.html
{candidate}.qa.json
```

Imported bullets remain staging records. Their evidence links state that the Markdown source must
be reviewed and connected to the candidate evidence bank before publishing.

## Frontend Preview

The modernization shell includes `Load JSON`. Use it to preview an imported canonical JSON file
without hardcoding candidate-specific records into frontend source code.

