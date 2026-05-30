import tempfile
import unittest
from pathlib import Path

import fitz

from scripts.render_html_pdf import render_html_pdf


class RenderHtmlPdfTest(unittest.TestCase):
    def test_renders_extractable_letter_pdf(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            html_path = root / "resume.html"
            pdf_path = root / "resume.pdf"
            html_path.write_text(
                """
                <html><body>
                  <h1>Jordan Lee</h1>
                  <h2>Professional Summary</h2>
                  <p>Product leader focused on workflow modernization.</p>
                  <h2>Professional Experience</h2>
                  <p>Northstar Platforms</p>
                </body></html>
                """,
                encoding="utf-8",
            )

            pages = render_html_pdf(html_path, pdf_path)
            document = fitz.open(pdf_path)
            try:
                self.assertEqual(pages, 1)
                self.assertEqual(document.page_count, 1)
                self.assertIn("Jordan Lee", document[0].get_text())
                self.assertEqual(
                    tuple(round(value) for value in document[0].rect),
                    (0, 0, 612, 792),
                )
            finally:
                document.close()

            with self.assertRaises(FileExistsError):
                render_html_pdf(html_path, pdf_path)


if __name__ == "__main__":
    unittest.main()
