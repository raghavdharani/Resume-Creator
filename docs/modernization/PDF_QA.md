# PDF Artifact QA

The PDF QA command checks the final exported resume artifact after HTML rendering or any other PDF
generation path.

```powershell
python scripts/qa_pdf_artifact.py --input path\to\resume.pdf
python scripts/qa_pdf_artifact.py --input path\to\resume.pdf --json path\to\pdf-qa-report.json
python scripts/qa_pdf_artifact.py --input path\to\resume.pdf --png-dir path\to\rendered-pages
```

The command exits with status `0` when no blocking errors are found and `1` when PDF QA fails.
Argument and file errors return a nonzero status. Warnings are reported for human review but do not
fail the artifact.

## Checks

- PDF opens successfully and contains at least one page
- Extractable text exists, so the resume is not an image-only artifact
- Page count and extractable-character count are recorded in the report
- Experience and education section headings are present
- Summary/profile and strengths/skills section headings are reviewed as recommended resume sections
- Unicode replacement characters, empty-box glyphs, mojibake bullets, and question-mark bullet
  patterns are rejected
- Optional page rendering produces PNG files for visual inspection

## Tests

```powershell
python -m unittest tests.qa.test_qa_pdf_artifact
npm.cmd run test:pdf-qa
```

The unit tests generate temporary PDFs directly with PyMuPDF and do not depend on frontend or
browser tooling.
