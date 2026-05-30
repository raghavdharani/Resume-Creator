from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import fitz

from scripts.qa_pdf_artifact import analyze_pdf_artifact, render_pages


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "qa_pdf_artifact.py"


def write_pdf(path: Path, pages: list[str]) -> None:
    document = fitz.open()
    for text in pages:
        page = document.new_page()
        if text:
            page.insert_text((72, 72), text, fontsize=11)
    document.save(path)
    document.close()


class QaPdfArtifactTests(unittest.TestCase):
    def test_accepts_extractable_resume_pdf_and_renders_png(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            pdf_path = Path(temp) / "resume.pdf"
            png_dir = Path(temp) / "png"
            write_pdf(
                pdf_path,
                ["Professional Summary\nCore Strengths\nProfessional Experience\nEducation\n- Delivered outcome."],
            )

            report = analyze_pdf_artifact(pdf_path)
            rendered = render_pages(pdf_path, png_dir)

            self.assertTrue(report["passed"])
            self.assertEqual(report["checks"]["pageCount"], 1)
            self.assertGreater(report["checks"]["extractableCharacters"], 0)
            self.assertEqual(len(rendered), 1)
            self.assertTrue(Path(rendered[0]).is_file())

    def test_fails_image_only_pdf(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            pdf_path = Path(temp) / "blank.pdf"
            write_pdf(pdf_path, [""])

            report = analyze_pdf_artifact(pdf_path)

            self.assertFalse(report["passed"])
            self.assertIn("missing_extractable_text", {finding["code"] for finding in report["issues"]})

    def test_flags_question_mark_bullets_and_missing_required_sections(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            pdf_path = Path(temp) / "broken.pdf"
            write_pdf(pdf_path, ["Professional Summary\nCore Strengths\n? Broken bullet"])

            report = analyze_pdf_artifact(pdf_path)
            codes = [finding["code"] for finding in report["issues"]]

            self.assertFalse(report["passed"])
            self.assertIn("question_mark_bullet_pattern", codes)
            self.assertEqual(codes.count("missing_resume_section"), 2)

    def test_flags_unicode_replacement_character(self) -> None:
        class FakePage:
            def extract_text(self) -> str:
                return "Professional Summary\nCore Strengths\nProfessional Experience\nEducation\n\ufffd Broken glyph"

        class FakeReader:
            pages = [FakePage()]

        with patch("scripts.qa_pdf_artifact.PdfReader", return_value=FakeReader()):
            report = analyze_pdf_artifact("mock.pdf")

        self.assertFalse(report["passed"])
        self.assertIn("suspicious_glyph", {finding["code"] for finding in report["issues"]})

    def test_cli_writes_json_and_returns_nonzero_for_blocking_error(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            pdf_path = Path(temp) / "broken.pdf"
            report_path = Path(temp) / "report.json"
            write_pdf(pdf_path, ["Professional Summary\nCore Strengths\n? Broken bullet"])

            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--input", str(pdf_path), "--json", str(report_path)],
                capture_output=True,
                text=True,
                check=False,
            )
            report = json.loads(report_path.read_text(encoding="utf-8"))

            self.assertEqual(result.returncode, 1)
            self.assertFalse(report["passed"])
            self.assertIn("question_mark_bullet_pattern", {finding["code"] for finding in report["issues"]})


if __name__ == "__main__":
    unittest.main()
