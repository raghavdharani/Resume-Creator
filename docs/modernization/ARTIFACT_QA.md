# Resume Artifact QA

The artifact QA command checks a rendered resume HTML file without loading the frontend or installing
additional packages.

```powershell
npm.cmd run qa:artifact -- path\to\rendered-resume.html
npm.cmd run qa:artifact -- path\to\rendered-resume.html --json path\to\artifact-qa-report.json
```

The command exits with status `0` when no blocking errors are found, `1` when the artifact fails QA,
and `2` for command usage or file-read errors. Warnings are reported but do not fail the artifact.

## Checks

- Required recruiter-facing sections: Professional Summary, Core Strengths, Professional Experience,
  and Education
- ATS-safe single-column markers: `.resume-body` and `.resume-section`
- ATS-risk CSS such as multi-column layout and explicit grid columns
- Letter print sizing through `@page`
- Safe hyphen bullets through `.bullet-list`, `list-style: none`, and `li::before { content: "-" }`
- Suspicious glyph corruption such as the Unicode replacement character, mojibake punctuation, and
  empty box glyphs
- Density heuristics for long inline HTML lines, long list items, and excessive list item counts

The JSON report includes the pass state, error and warning totals, check results, density metrics, and
individual findings.

## Tests

```powershell
npm.cmd run test:artifact-qa
```

These tests use Node's built-in `node:test` module and temporary HTML files, so they remain independent
of Vitest, Vite, browser automation, and test-runner worker processes that restricted sandboxes may
block.
