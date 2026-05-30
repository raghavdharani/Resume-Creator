# Local PDF Rendering

## Purpose

The preferred publishing renderer is Chromium through `scripts/render_chromium_pdf.ps1`. It
preserves browser CSS such as header bands, accent colors, flex alignment, and print rules.

`scripts/render_html_pdf.py` is a PyMuPDF structural fallback. It produces extractable Letter-sized
PDFs without a browser dependency, but its CSS support is limited and it should not be treated as
the polished submission renderer.

## Usage

```powershell
npm.cmd run render:pdf -- `
  --input docs/modernization/artifacts/raghav_pipeline/raghav_dharani.rendered.html `
  --output docs/modernization/artifacts/raghav_pipeline/raghav_dharani.pdf
```

Preferred Chromium render:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/render_chromium_pdf.ps1 `
  -InputHtml docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani.rendered.html `
  -OutputPdf docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani_chromium_v1.pdf
```

Structural fallback publish with PDF QA and PNG pages:

```powershell
npm.cmd run publish:fallback -- `
  --input docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani.rendered.html `
  --output docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani_structural_v1.pdf `
  --json docs/modernization/artifacts/raghav_pipeline_v3/raghav_dharani_structural_v1.qa.json `
  --png-dir docs/modernization/artifacts/raghav_pipeline_v3/structural_png_v1
```

## Notes

- The fallback renderer uses Letter dimensions and a stable half-inch content margin.
- Existing PDF artifacts are immutable. Use a new versioned filename for each render.
- Run PDF QA after rendering.
- The cloud PDF callable remains a deployment adapter: it should invoke an equivalent renderer in
  Functions or Cloud Run and write the generated file to tenant-scoped storage.
- The Codex sandbox may block local Chromium process launch. Run the PowerShell renderer in the host
  terminal when that occurs.
