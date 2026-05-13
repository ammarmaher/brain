# *** Atomic file write helpers + safe-name validation used by all admin routers ***

from __future__ import annotations

import json
import os
import shutil
import time
from pathlib import Path
from typing import Any, Optional


def is_safe_name(name: str, allow_dot: bool = True) -> bool:
    """Reject empty, '..', separators, and shell-meta. Optionally allow '.'."""
    if not isinstance(name, str) or not name:
        return False
    if ".." in name or "/" in name or "\\" in name:
        return False
    allowed_extra = {"-", "_"}
    if allow_dot:
        allowed_extra.add(".")
    return all(ch.isalnum() or ch in allowed_extra for ch in name)


def write_text_atomic(path: Path, content: str, encoding: str = "utf-8") -> None:
    """Write to <path>.tmp then os.replace -> atomic rename."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(content, encoding=encoding)
    os.replace(tmp, path)


def write_json_atomic(path: Path, data: Any, indent: int = 2) -> None:
    write_text_atomic(path, json.dumps(data, ensure_ascii=False, indent=indent))


def archive_then_remove(path: Path, archive_dir: Path, suffix: str = "") -> Optional[Path]:
    """Copy file to archive with timestamp then remove the original. Returns archive path."""
    if not path.exists():
        return None
    archive_dir.mkdir(parents=True, exist_ok=True)
    ts = time.strftime("%Y%m%d-%H%M%S")
    stem = path.stem
    ext = path.suffix
    archive_name = f"{stem}-{ts}{suffix}{ext}"
    dest = archive_dir / archive_name
    shutil.copy2(path, dest)
    path.unlink()
    return dest


def backup_for_history(path: Path, history_dir: Path) -> Optional[Path]:
    """Copy file (no remove) to history dir before overwriting."""
    if not path.exists():
        return None
    history_dir.mkdir(parents=True, exist_ok=True)
    ts = time.strftime("%Y%m%d-%H%M%S")
    dest = history_dir / f"{path.stem}-{ts}{path.suffix}"
    shutil.copy2(path, dest)
    return dest
