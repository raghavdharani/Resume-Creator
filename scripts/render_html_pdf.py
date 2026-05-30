#!/usr/bin/env python3
"""Render ATS-safe resume HTML to a Letter-sized PDF with PyMuPDF."""

from __future__ import annotations

import argparse
from pathlib import Path

import fitz


def render_html_pdf(input_path: Path, output_path: Path) -> int:
    if output_path.exists():
        raise FileExistsError(
            f"Refusing to overwrite existing PDF artifact: {output_path}. "
            "Use a versioned output filename."
        )
    html = input_path.read_text(encoding="utf-8")
    story = fitz.Story(html=html)
    media_box = fitz.paper_rect("letter")
    content_box = media_box + (36, 36, -36, -36)

    document = story.write_with_links(
        lambda _rect_number, _filled: (media_box, content_box, fitz.Identity)
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.save(output_path)
    page_count = document.page_count
    document.close()
    return page_count


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render ATS-safe resume HTML to a Letter-sized PDF."
    )
    parser.add_argument("--input", required=True, type=Path, help="Rendered resume HTML")
    parser.add_argument("--output", required=True, type=Path, help="Destination PDF")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    pages = render_html_pdf(args.input.resolve(), args.output.resolve())
    print(f"Rendered PDF: {args.output.resolve()}")
    print(f"Pages: {pages}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
