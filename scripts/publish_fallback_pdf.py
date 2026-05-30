#!/usr/bin/env python3
"""Render a versioned structural PDF and run PDF QA in one command."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from scripts.qa_pdf_artifact import analyze_pdf_artifact, render_pages
    from scripts.render_html_pdf import render_html_pdf
except ModuleNotFoundError:
    from qa_pdf_artifact import analyze_pdf_artifact, render_pages
    from render_html_pdf import render_html_pdf


def publish_fallback_pdf(
    input_html: Path,
    output_pdf: Path,
    report_json: Path,
    png_dir: Path | None = None,
) -> dict:
    render_html_pdf(input_html, output_pdf)
    report = analyze_pdf_artifact(output_pdf)
    if png_dir is not None:
        report["renderedPngs"] = [
            str(path) for path in render_pages(output_pdf, png_dir)
        ]
    report_json.parent.mkdir(parents=True, exist_ok=True)
    report_json.write_text(f"{json.dumps(report, indent=2)}\n", encoding="utf-8")
    if not report["passed"]:
        raise RuntimeError(f"PDF QA failed for {output_pdf}")
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render a versioned structural PDF and run PDF QA."
    )
    parser.add_argument("--input", required=True, type=Path, help="Rendered resume HTML")
    parser.add_argument("--output", required=True, type=Path, help="Versioned PDF destination")
    parser.add_argument("--json", required=True, type=Path, help="PDF QA JSON report")
    parser.add_argument("--png-dir", type=Path, help="Optional rendered page PNG directory")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report = publish_fallback_pdf(
        args.input.resolve(),
        args.output.resolve(),
        args.json.resolve(),
        args.png_dir.resolve() if args.png_dir else None,
    )
    print(f"Published fallback PDF: {args.output.resolve()}")
    print(
        f"PDF QA passed: {report['checks']['pageCount']} page(s), "
        f"{report['summary']['errors']} error(s), {report['summary']['warnings']} warning(s)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
