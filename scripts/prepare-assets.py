"""Create lightweight WebP copies of the original Calendário Consciente cards.

Requires Pillow. Originals are opened read-only; no cropping or semantic edits
are performed. Example:

    python scripts/prepare-assets.py --source "PATH/TO/final" \
        --invitation "PATH/TO/current-invitation.png"
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps


def write_webp(source: Path, destination: Path, width: int, quality: int) -> dict:
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        target_width = min(width, image.width)
        target_height = round(image.height * target_width / image.width)
        image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)
    return {
        "file": destination.name,
        "width": target_width,
        "height": target_height,
        "bytes": destination.stat().st_size,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--invitation", type=Path)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "assets" / "imagens",
    )
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    invitation = (args.invitation or source / "poster-participe-acao.png").resolve(
        strict=True
    )
    originals = [(source / f"cap{number}.png").resolve(strict=True) for number in range(1, 12)]
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)

    files = []
    for number, original in enumerate(originals, start=1):
        files.append(write_webp(original, output / f"cap{number}.webp", 1200, 82))
        files.append(write_webp(original, output / f"cap{number}-thumb.webp", 420, 78))
    files.append(write_webp(invitation, output / "convite.webp", 1200, 82))
    print(
        json.dumps(
            {"count": len(files), "totalBytes": sum(item["bytes"] for item in files), "files": files},
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
