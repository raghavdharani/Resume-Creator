# Visual QA Findings

## PyMuPDF Structural Fallback

The local PyMuPDF renderer successfully produces readable, extractable Letter PDFs and is useful
for ATS structure verification.

Visual review found that it does not preserve the full intended browser CSS:

- pale-blue header band is flattened
- blue accent treatment is flattened
- company, title, and date distribution is flattened
- pseudo-element hyphen bullets are not visually preserved

Decision:

- keep PyMuPDF as a structural fallback and ATS extraction tool
- use Chromium PDF rendering as the preferred polished publishing path
- do not mark a PyMuPDF PDF as the primary recruiter-submission artifact without visual review

## Density Calibration

Real candidate renders exposed optimistic page estimates. The density estimator was recalibrated
from approximately `4200` to `3000` characters per page.

Current estimates:

```text
Raghav: 2 pages after importer boundary correction
Aatmika: 4 pages after importer boundary correction
```

