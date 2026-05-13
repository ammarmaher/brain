# *** Gaps router — consolidates per-module gaps.json files ***

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.models.gap import Gap

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/gaps", tags=["gaps"], dependencies=[Depends(require_token)])


def _coerce_gap(raw: Dict[str, Any], source: Path) -> Gap | None:
    if not isinstance(raw, dict):
        return None
    gid = raw.get("id") or raw.get("gapId") or raw.get("ID")
    if not gid:
        return None
    return Gap(
        id=str(gid),
        module=raw.get("module"),
        severity=raw.get("severity"),
        type=raw.get("type"),
        title=raw.get("title"),
        description=raw.get("description"),
        affectedServices=list(raw.get("affectedServices", []) or []),
        sourcePath=str(source),
        extra={k: v for k, v in raw.items() if k not in {
            "id", "gapId", "ID", "module", "severity", "type",
            "title", "description", "affectedServices",
        }},
    )


def _scan_gaps(settings: Settings) -> List[Gap]:
    base = settings.analysis_dir
    if not base.exists():
        return []
    out: List[Gap] = []
    for f in base.rglob("gaps.json"):
        try:
            raw = json.loads(f.read_text(encoding="utf-8"))
        except Exception as exc:
            logger.debug("gaps.json parse fail %s: %s", f, exc)
            continue
        items = raw if isinstance(raw, list) else raw.get("gaps", [])
        for item in items if isinstance(items, list) else []:
            g = _coerce_gap(item, f)
            if g:
                out.append(g)
    # *** also harvest any json under L2/L3 named *-gaps.json ***
    for f in base.rglob("*-gaps.json"):
        try:
            raw = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        items = raw if isinstance(raw, list) else raw.get("gaps", [])
        for item in items if isinstance(items, list) else []:
            g = _coerce_gap(item, f)
            if g:
                out.append(g)
    return out


@router.get("")
async def list_gaps(settings: Settings = Depends(get_settings)):
    return _scan_gaps(settings)


@router.get("/{gap_id}")
async def get_gap(gap_id: str, settings: Settings = Depends(get_settings)):
    safe = "".join(c for c in gap_id if c.isalnum() or c in ("-", "_", "."))
    if safe != gap_id:
        raise HTTPException(status_code=400, detail="invalid gap id")
    for g in _scan_gaps(settings):
        if g.id == gap_id:
            return g
    raise HTTPException(status_code=404, detail="gap not found")
