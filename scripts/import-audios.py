"""Import the 11 supplied chapter recordings without transcoding.

Usage:
    python scripts/import-audios.py --source PATH/TO/RECORDINGS

Uses only the Python standard library. Source files remain untouched. MP4 box
metadata is inspected before copying; no claim of semantic transcription or
full codec decoding is made by this script.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import struct
from datetime import date
from pathlib import Path


def boxes(data: bytes, start: int = 0, end: int | None = None):
    end = len(data) if end is None else end
    offset = start
    while offset + 8 <= end:
        size, raw_kind = struct.unpack_from(">I4s", data, offset)
        header = 8
        if size == 1:
            if offset + 16 > end:
                raise ValueError("Incomplete extended MP4 box header")
            size = struct.unpack_from(">Q", data, offset + 8)[0]
            header = 16
        if size == 0:
            size = end - offset
        if size < header or offset + size > end:
            raise ValueError(f"Invalid MP4 box at byte {offset}")
        yield raw_kind.decode("latin1"), offset + header, offset + size
        offset += size
    if offset != end:
        raise ValueError(f"Incomplete MP4 box at byte {offset}")


def child(data: bytes, kind: str, bounds: tuple[int, int]):
    found = [
        (start, end)
        for candidate, start, end in boxes(data, *bounds)
        if candidate == kind
    ]
    if len(found) != 1:
        raise ValueError(f"Expected one {kind} box, found {len(found)}")
    return found[0]


def duration(data: bytes, bounds: tuple[int, int]):
    start, end = bounds
    version = data[start]
    if version not in (0, 1):
        raise ValueError(f"Unsupported duration box version {version}")
    position = start + (20 if version == 1 else 12)
    width = 8 if version == 1 else 4
    if position + 4 + width > end:
        raise ValueError("Incomplete duration box")
    timescale = struct.unpack_from(">I", data, position)[0]
    units = struct.unpack_from(">Q" if version == 1 else ">I", data, position + 4)[0]
    if not timescale or not units:
        raise ValueError("Recording has an invalid or zero duration")
    return round(units / timescale, 3)


def inspect_mp4(path: Path):
    data = path.read_bytes()
    top = list(boxes(data))
    if not any(kind == "ftyp" for kind, _, _ in top):
        raise ValueError(f"{path.name}: missing MP4 file type box")
    if not any(kind == "mdat" for kind, _, _ in top):
        raise ValueError(f"{path.name}: missing media payload")
    movie = child(data, "moov", (0, len(data)))
    movie_duration = duration(data, child(data, "mvhd", movie))
    audio_tracks = []
    video_tracks = []
    for kind, start, end in boxes(data, *movie):
        if kind != "trak":
            continue
        media = child(data, "mdia", (start, end))
        handler = child(data, "hdlr", media)
        handler_kind = data[handler[0] + 8 : handler[0] + 12]
        track_duration = duration(data, child(data, "mdhd", media))
        media_info = child(data, "minf", media)
        sample_table = child(data, "stbl", media_info)
        sample_description = child(data, "stsd", sample_table)
        entries = list(boxes(data, sample_description[0] + 8, sample_description[1]))
        if len(entries) != 1:
            raise ValueError(f"{path.name}: expected one codec entry per track")
        codec, entry_start, entry_end = entries[0]
        track = {"codec": codec, "durationSeconds": track_duration}
        if handler_kind == b"soun":
            if entry_start + 28 > entry_end:
                raise ValueError(f"{path.name}: incomplete audio sample entry")
            track.update(
                channels=struct.unpack_from(">H", data, entry_start + 16)[0],
                sampleSize=struct.unpack_from(">H", data, entry_start + 18)[0],
                sampleRate=struct.unpack_from(">I", data, entry_start + 24)[0] >> 16,
            )
            audio_tracks.append(track)
        elif handler_kind == b"vide":
            if entry_start + 28 > entry_end:
                raise ValueError(f"{path.name}: incomplete video sample entry")
            track.update(
                width=struct.unpack_from(">H", data, entry_start + 24)[0],
                height=struct.unpack_from(">H", data, entry_start + 26)[0],
            )
            video_tracks.append(track)
    if len(audio_tracks) != 1:
        raise ValueError(f"{path.name}: expected one audio track, found {len(audio_tracks)}")
    if len(video_tracks) > 1:
        raise ValueError(f"{path.name}: multiple video tracks require review")
    audio = audio_tracks[0]
    if audio["codec"] != "mp4a":
        raise ValueError(f"{path.name}: unsupported audio codec {audio['codec']}")
    result = {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "durationSeconds": movie_duration,
        "audioCodec": audio["codec"],
        "audioTrackCount": len(audio_tracks),
        "audioDurationSeconds": audio["durationSeconds"],
        "channels": audio["channels"],
        "sampleRate": audio["sampleRate"],
        "sampleSize": audio["sampleSize"],
        "videoTrackCount": len(video_tracks),
    }
    if video_tracks:
        video = video_tracks[0]
        result.update(videoCodec=video["codec"], videoWidth=video["width"], videoHeight=video["height"])
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "assets" / "audio")
    parser.add_argument("--imported-on", default=date.today().isoformat())
    args = parser.parse_args()
    date.fromisoformat(args.imported_on)
    source = args.source.resolve(strict=True)
    output = args.output.resolve()
    if not source.is_dir():
        raise ValueError("The source must be a directory")
    mapping = {}
    for path in source.iterdir():
        if not path.is_file() or path.suffix.lower() != ".mp4":
            continue
        match = re.fullmatch(r"Cap(\d+)_(?:edit|editada)\.mp4", path.name, re.IGNORECASE)
        if not match:
            raise ValueError(f"Unrecognized recording filename: {path.name}")
        chapter = int(match.group(1))
        if chapter not in range(1, 12) or chapter in mapping:
            raise ValueError(f"Unexpected or duplicate chapter number: {chapter}")
        mapping[chapter] = path
    if sorted(mapping) != list(range(1, 12)):
        raise ValueError(f"Expected exactly chapters 1–11, found {sorted(mapping)}")
    files = []
    for chapter, path in sorted(mapping.items()):
        metadata = inspect_mp4(path)
        files.append({"chapter": chapter, "sourceFile": path.name, "file": f"cap{chapter}.mp4", **metadata})
    if len({item["sha256"] for item in files}) != 11:
        raise ValueError("Exact duplicate recordings found; review their chapter assignment")
    output.mkdir(parents=True, exist_ok=True)
    for item in files:
        original = mapping[item["chapter"]]
        target = output / item["file"]
        if original.resolve() != target.resolve():
            shutil.copy2(original, target)
        if hashlib.sha256(target.read_bytes()).hexdigest() != item["sha256"]:
            raise ValueError(f"Copy verification failed for chapter {item['chapter']}")
    manifest = {"importedOn": args.imported_on, "files": files}
    (output / "gravacoes-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"imported": len(files), "totalBytes": sum(item["bytes"] for item in files), "files": [{"chapter": item["chapter"], "file": item["file"], "durationSeconds": item["durationSeconds"]} for item in files]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
