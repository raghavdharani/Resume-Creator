import tempfile
import unittest
from pathlib import Path

from scripts.publish_fallback_pdf import publish_fallback_pdf


class PublishFallbackPdfTest(unittest.TestCase):
    def test_renders_pdf_runs_qa_and_outputs_png(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            html_path = root / "resume.html"
            pdf_path = root / "resume-v1.pdf"
            report_path = root / "resume-v1.qa.json"
            png_dir = root / "png"
            html_path.write_text(
                """
                <html><body>
                  <h1>Jordan Lee</h1>
                  <h2>Professional Summary</h2>
                  <p>Product leader focused on workflow modernization.</p>
                  <h2>Core Strengths</h2>
                  <p>Product strategy | Discovery</p>
                  <h2>Professional Experience</h2>
                  <p>Northstar Platforms</p>
                  <h2>Education</h2>
                  <p>Example University</p>
                </body></html>
                """,
                encoding="utf-8",
            )

            report = publish_fallback_pdf(html_path, pdf_path, report_path, png_dir)

            self.assertTrue(report["passed"])
            self.assertTrue(pdf_path.exists())
            self.assertTrue(report_path.exists())
            self.assertEqual(len(report["renderedPngs"]), 1)


if __name__ == "__main__":
    unittest.main()
