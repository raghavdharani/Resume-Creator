#!/usr/bin/env python3
"""QA checks for exported resume PDF artifacts."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import fitz
from pypdf import PdfReader


SECTION_GROUPS = (
    ("summary", ("professional summary", "summary", "profile"), "warning"),
    ("strengths", ("core strengths", "skills", "technical skills", "core competencies"), "warning"),
    ("experience", ("professional experience", "experience", "work experience", "employment history"), "error"),
    ("education", ("education", "academic background"), "error"),
)

SUSPICIOUS_GLYPHS = (
    ("\ufffd", "Unicode replacement character"),
    ("\u25a1", "empty box glyph"),
    ("\u00e2\u20ac\u00a2", "mojibake bullet"),
)

QUESTION_MARK_BULLET = re.compile(r"(?m)^\s*\?\s+\S")


def issue(code: str, severity: str, message: str, **details: Any) -> dict[str, Any]:
    return {"code": code, "severity": severity, "message": message, **details}


def _extract_text(reader: PdfReader) -> tuple[list[str], list[dict[str, Any]]]:
    texts: list[str] = []
    issues: list[dict[str, Any]] = []
    for index, page in enumerate(reader.pages, start=1):
        try:
            texts.append(page.extract_text() or "")
        except Exception as error:  # pypdf exposes parser-specific exceptions.
            texts.append("")
            issues.append(
                issue(
                    "page_text_extraction_failed",
                    "error",
                    f"Could not extract text from page {index}.",
                    page=index,
                    detail=str(error),
                )
            )
    return texts, issues


def _find_section_alias(text: str, aliases: tuple[str, ...]) -> str | None:
    normalized_lines = [
        re.sub(r"[^a-z0-9& /-]+$", "", line.strip().lower())
        for line in text.splitlines()
        if line.strip()
    ]
    return next((alias for alias in aliases if alias in normalized_lines), None)


def analyze_pdf_artifact(input_path: str | Path) -> dict[str, Any]:
    artifact = Path(input_path).resolve()
    issues: list[dict[str, Any]] = []

    try:
        reader = PdfReader(str(artifact))
        page_count = len(reader.pages)
    except Exception as error:
        return _report(
            artifact,
            page_count=0,
            extractable_characters=0,
            sections=[],
            issues=[
                issue(
                    "invalid_pdf",
                    "error",
                    "Could not open the input as a PDF.",
                    detail=str(error),
                )
            ],
        )

    if page_count == 0:
        issues.append(issue("empty_pdf", "error", "PDF contains no pages."))

    page_texts, extraction_issues = _extract_text(reader)
    issues.extend(extraction_issues)
    combined_text = "\n".join(page_texts)
    extractable_characters = len(re.sub(r"\s+", "", combined_text))

    if not extractable_characters:
        issues.append(
            issue(
                "missing_extractable_text",
                "error",
                "PDF contains no extractable text. It may be image-only or incorrectly exported.",
            )
        )

    blank_pages = [index for index, text in enumerate(page_texts, start=1) if not text.strip()]
    if blank_pages and extractable_characters:
        issues.append(
            issue(
                "pages_without_extractable_text",
                "warning",
                "Some pages contain no extractable text.",
                pages=blank_pages,
            )
        )

    section_results: list[dict[str, Any]] = []
    for name, aliases, severity in SECTION_GROUPS:
        matched_alias = _find_section_alias(combined_text, aliases)
        section_results.append({"section": name, "present": bool(matched_alias), "matchedAlias": matched_alias})
        if not matched_alias and extractable_characters:
            issues.append(
                issue(
                    "missing_resume_section",
                    severity,
                    f"Could not find a recognizable {name} section.",
                    section=name,
                    acceptedAliases=list(aliases),
                )
            )

    for glyph, label in SUSPICIOUS_GLYPHS:
        count = combined_text.count(glyph)
        if count:
            issues.append(
                issue(
                    "suspicious_glyph",
                    "error",
                    f"Detected {label}.",
                    glyph=glyph,
                    count=count,
                )
            )

    question_mark_bullets = len(QUESTION_MARK_BULLET.findall(combined_text))
    if question_mark_bullets:
        issues.append(
            issue(
                "question_mark_bullet_pattern",
                "error",
                "Detected question-mark bullet pattern. Verify bullet glyph rendering.",
                count=question_mark_bullets,
            )
        )

    return _report(artifact, page_count, extractable_characters, section_results, issues)


def _report(
    artifact: Path,
    page_count: int,
    extractable_characters: int,
    sections: list[dict[str, Any]],
    issues: list[dict[str, Any]],
) -> dict[str, Any]:
    error_count = sum(finding["severity"] == "error" for finding in issues)
    warning_count = sum(finding["severity"] == "warning" for finding in issues)
    return {
        "artifact": str(artifact),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "passed": error_count == 0,
        "summary": {"errors": error_count, "warnings": warning_count},
        "checks": {
            "pageCount": page_count,
            "extractableCharacters": extractable_characters,
            "requiredSections": sections,
        },
        "issues": issues,
    }


def render_pages(input_path: str | Path, png_dir: str | Path) -> list[str]:
    artifact = Path(input_path).resolve()
    output_dir = Path(png_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    rendered: list[str] = []
    with fitz.open(artifact) as document:
        for page_number, page in enumerate(document, start=1):
            output_path = output_dir / f"{artifact.stem}-page-{page_number}.png"
            page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(output_path)
            rendered.append(str(output_path))
    return rendered


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run QA checks against an exported resume PDF.")
    parser.add_argument("--input", required=True, help="Path to the PDF artifact.")
    parser.add_argument("--json", dest="json_path", help="Optional path for a JSON report.")
    parser.add_argument("--png-dir", help="Optional directory for rendered page PNGs.")
    return parser


def run(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    report = analyze_pdf_artifact(args.input)

    if args.png_dir and report["checks"]["pageCount"]:
        try:
            report["renderedPngs"] = render_pages(args.input, args.png_dir)
        except Exception as error:
            report["issues"].append(
                issue("png_render_failed", "error", "Could not render PDF pages to PNG.", detail=str(error))
            )
            report["passed"] = False
            report["summary"]["errors"] += 1

    if args.json_path:
        json_path = Path(args.json_path).resolve()
        json_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.write_text(f"{json.dumps(report, indent=2)}\n", encoding="utf-8")

    print(f"PDF QA {'passed' if report['passed'] else 'failed'}: {report['artifact']}")
    print(f"Pages: {report['checks']['pageCount']}; errors: {report['summary']['errors']}; warnings: {report['summary']['warnings']}")
    for finding in report["issues"]:
        print(f"- [{finding['severity']}] {finding['code']}: {finding['message']}")
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    try:
        raise SystemExit(run())
    except (OSError, ValueError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(2)
