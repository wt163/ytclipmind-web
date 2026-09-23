"""Resize screenshots and emit WebP + optimized PNG for the marketing site."""
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "assets"
MAX_W, MAX_H = 1500, 740


def main() -> None:
    for path in sorted(ASSETS.glob("*screenshot*.png")):
        im = Image.open(path)
        if im.mode in ("P", "LA", "RGBA"):
            im = im.convert("RGBA")
        elif im.mode != "RGB":
            im = im.convert("RGB")

        out = im.copy()
        out.thumbnail((MAX_W, MAX_H), Image.Resampling.LANCZOS)
        webp = path.with_suffix(".webp")
        out.save(webp, "WEBP", quality=82, method=6)
        out.save(path, "PNG", optimize=True)
        print(f"{path.name}: png={path.stat().st_size // 1024}KB webp={webp.stat().st_size // 1024}KB {out.size}")


if __name__ == "__main__":
    main()
