# *** Walk Brain/analysis tree + read index.json ***

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.config import Settings

logger = logging.getLogger(__name__)


_ALLOWED_LAYERS = {"L0-summary", "L1-abstraction", "L2-business", "L3-technical", "raw", "tables", "schemas"}


def read_index(settings: Settings) -> Optional[Dict[str, Any]]:
    p = settings.analysis_dir / "index.json"
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("analysis/index.json parse failed: %s", exc)
        return None


def list_modules(settings: Settings) -> List[Dict[str, Any]]:
    """Best-effort: each top-level dir under L2-business or L3-technical is a 'module slug'."""
    out: List[Dict[str, Any]] = []
    seen: set[str] = set()
    for layer in ("L2-business", "L3-technical"):
        d = settings.analysis_dir / layer
        if not d.exists():
            continue
        for sub in d.rglob("*"):
            if sub.is_file() and sub.suffix.lower() in (".md", ".json"):
                slug = sub.parent.name
                if slug.startswith("L") or slug in {"L2-business", "L3-technical"}:
                    continue
                if slug in seen:
                    continue
                seen.add(slug)
                out.append({"slug": slug, "layer": layer, "path": str(sub.parent)})
    return out


def read_module(settings: Settings, slug: str) -> Optional[Dict[str, Any]]:
    safe = "".join(c for c in slug if c.isalnum() or c in ("-", "_", "."))
    if safe != slug:
        raise ValueError("invalid module slug")
    files: List[Dict[str, str]] = []
    for layer in ("L0-summary", "L1-abstraction", "L2-business", "L3-technical"):
        layer_dir = settings.analysis_dir / layer
        if not layer_dir.exists():
            continue
        for f in layer_dir.rglob("*"):
            if f.is_file() and (slug in f.parts or slug in f.name):
                files.append({"layer": layer, "path": str(f), "name": f.name})
    if not files:
        return None
    return {"slug": slug, "files": files}


def browse_files(settings: Settings, layer: Optional[str] = None) -> List[Dict[str, str]]:
    out: List[Dict[str, str]] = []
    base = settings.analysis_dir
    if not base.exists():
        return out
    if layer:
        if layer not in _ALLOWED_LAYERS:
            raise ValueError("invalid layer")
        roots = [base / layer]
    else:
        roots = [base / x for x in _ALLOWED_LAYERS if (base / x).exists()]
    for r in roots:
        if not r.exists():
            continue
        for f in r.rglob("*"):
            if f.is_file():
                out.append(
                    {
                        "layer": r.name,
                        "path": str(f),
                        "name": f.name,
                        "rel": str(f.relative_to(base)).replace("\\", "/"),
                    }
                )
    return out
