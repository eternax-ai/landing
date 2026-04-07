#!/usr/bin/env python3
import argparse
import pathlib
import re
import subprocess
import sys
import tempfile
import textwrap


FIXED_NAV_PATTERN = re.compile(
    r'<nav\b[^>]*\bclass="[^"]*\bfixed\b[^"]*"[^>]*>[\s\S]*?<\/nav>\s*',
    re.IGNORECASE,
)

PADDING_TOP_PATTERN = re.compile(
    r"padding-top:\s*calc\(\s*2\.5rem\s*\+\s*64px\s*\);",
    re.IGNORECASE,
)

ANY_PADDING_TOP_CALC_PATTERN = re.compile(
    r"padding-top:\s*calc\([^;]*\);",
    re.IGNORECASE,
)


def prepare_html(input_path: pathlib.Path, remove_fixed_nav: bool) -> str:
    html = input_path.read_text(encoding="utf-8")

    if remove_fixed_nav:
        html, removed_count = FIXED_NAV_PATTERN.subn("", html, count=1)
        if removed_count != 1:
            raise RuntimeError(
                f"Expected to remove 1 fixed nav block, removed {removed_count}"
            )

        html, n = PADDING_TOP_PATTERN.subn("padding-top: 2.5rem;", html, count=1)
        if n != 1:
            html = ANY_PADDING_TOP_CALC_PATTERN.sub(
                "padding-top: 2.5rem;", html, count=1
            )

    return html


def build_node_script(chrome_path: str, html_path: pathlib.Path, out_pdf: pathlib.Path) -> str:
    return textwrap.dedent(
        f"""
        import {{ chromium }} from 'playwright';

        const chromePath = {chrome_path!r};
        const htmlPath = {str(html_path)!r};
        const outPdf = {str(out_pdf)!r};

        const browser = await chromium.launch({{
          executablePath: chromePath,
          headless: true,
          args: ['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage'],
        }});

        const page = await browser.newPage({{ viewport: {{ width: 1280, height: 720 }} }});
        page.setDefaultNavigationTimeout(30000);
        page.setDefaultTimeout(30000);
        // Same as Q1 production: networkidle + Letter + these margins (see already-broken PDF pipeline).
        await page.goto('file://' + htmlPath, {{ waitUntil: 'networkidle', timeout: 30000 }});

        await page.evaluate(async () => {{
          document.querySelectorAll('details.faq-item').forEach((d) => d.setAttribute('open', ''));
          if (document.fonts && document.fonts.ready) await document.fonts.ready;
          const imgs = Array.from(document.images);
          const waitForImage = (img) =>
            new Promise((resolve) => {{
              if (img.complete) return resolve();
              const done = () => resolve();
              img.addEventListener('load', done, {{ once: true }});
              img.addEventListener('error', done, {{ once: true }});
              setTimeout(done, 8000);
            }});
          await Promise.all(imgs.map(waitForImage));
        }});

        await page.pdf({{
          path: outPdf,
          format: 'Letter',
          printBackground: true,
          margin: {{ top: '0.35in', bottom: '0.35in', left: '0.3in', right: '0.3in' }},
        }});

        await browser.close();
        console.log('Wrote', outPdf);
        """
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate report PDF via Playwright/Chrome.")
    parser.add_argument("input_html", help="Path to source HTML report.")
    parser.add_argument("output_pdf", help="Path to output PDF.")
    parser.add_argument(
        "--chrome-path",
        default="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        help="Path to Chrome executable for Playwright.",
    )
    parser.add_argument(
        "--keep-fixed-navbar",
        action="store_true",
        help="Do not remove fixed navbar before rendering.",
    )
    args = parser.parse_args()

    input_path = pathlib.Path(args.input_html).resolve()
    output_path = pathlib.Path(args.output_pdf).resolve()

    if not input_path.exists():
        raise FileNotFoundError(f"Input HTML not found: {input_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    transformed_html = prepare_html(input_path, remove_fixed_nav=not args.keep_fixed_navbar)

    with tempfile.TemporaryDirectory(prefix="report-pdf-") as tmp_dir:
        tmp_dir_path = pathlib.Path(tmp_dir)
        tmp_html = tmp_dir_path / f"{input_path.stem}.tmp-no-navbar.html"
        tmp_html.write_text(transformed_html, encoding="utf-8")

        assets_src = input_path.parent / "assets"
        if assets_src.exists():
            (tmp_dir_path / "assets").symlink_to(assets_src)

        node_script = build_node_script(args.chrome_path, tmp_html, output_path)
        subprocess.run(
            ["node", "--input-type=module", "-e", node_script],
            check=True,
            timeout=180,
        )

    print(f"PDF generated: {output_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as exc:
        print(f"Playwright render failed with exit code {exc.returncode}", file=sys.stderr)
        raise
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise
