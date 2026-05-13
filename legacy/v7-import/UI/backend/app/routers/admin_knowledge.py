# *** Admin router: Knowledge dossier editor (Brain/analysis) with append-only history ***

from __future__ import annotations

import json
import logging
import time
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import (
    backup_for_history,
    is_safe_name,
    write_text_atomic,
)
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/knowledge",
    tags=["admin", "knowledge"],
    dependencies=[Depends(require_admin_token)],
)

_ALLOWED_LAYERS = {"L0-summary", "L1-abstraction", "L2-business", "L3-technical", "raw", "tables"}


class KnowledgePut(BaseModel):
    content: str = Field(min_length=0)


def _resolve_path(settings: Settings, module: str, layer: str, filename: str) -> Path:
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    if layer not in _ALLOWED_LAYERS:
        raise HTTPException(status_code=400, detail=f"invalid layer (allowed: {sorted(_ALLOWED_LAYERS)})")
    if not is_safe_name(filename):
        raise HTTPException(status_code=400, detail="invalid filename")

    base = settings.analysis_dir.resolve()
    target = (settings.analysis_dir / layer / module / filename).resolve()
    if base not in target.parents:
        raise HTTPException(status_code=400, detail="path escapes analysis dir")
    return target


def _history_dir(settings: Settings) -> Path:
    return settings.analysis_dir / "_history"


def _index_path(settings: Settings) -> Path:
    return settings.analysis_dir / "index.json"


def _append_index_run(settings: Settings, entry: dict) -> None:
    p = _index_path(settings)
    if p.exists():
        try:
            idx = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            idx = {}
    else:
        idx = {}
    runs = idx.setdefault("runs", [])
    if not isinstance(runs, list):
        runs = []
        idx["runs"] = runs
    runs.append(entry)
    write_text_atomic(p, json.dumps(idx, ensure_ascii=False, indent=2))


# *** Wave 1.6: per-layer history listing + detail (must be declared BEFORE the ***
# *** generic /{module}/{layer}/{filename} route so FastAPI matches "history" as a literal). ***

def _layer_history_dir(settings: Settings, layer: str) -> Path:
    if layer not in _ALLOWED_LAYERS:
        raise HTTPException(status_code=400, detail=f"invalid layer (allowed: {sorted(_ALLOWED_LAYERS)})")
    return settings.analysis_dir / layer / "_history"


@router.get("/{module}/{layer}/history")
async def list_history(
    module: str,
    layer: str,
    settings: Settings = Depends(get_settings),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    hist_dir = _layer_history_dir(settings, layer)
    if not hist_dir.exists() or not hist_dir.is_dir():
        return []
    prefix = f"{module}-"
    out = []
    for f in sorted(hist_dir.iterdir()):
        if not f.is_file():
            continue
        if not f.name.startswith(prefix):
            continue
        try:
            st = f.stat()
        except OSError:
            continue
        out.append(
            {
                "filename": f.name,
                "sizeBytes": st.st_size,
                "mtime": st.st_mtime,
            }
        )
    return out


@router.get("/{module}/{layer}/history/{filename}")
async def get_history_file(
    module: str,
    layer: str,
    filename: str,
    settings: Settings = Depends(get_settings),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    if not is_safe_name(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    hist_dir = _layer_history_dir(settings, layer)
    target = (hist_dir / filename).resolve()
    base = hist_dir.resolve()
    if base not in target.parents:
        raise HTTPException(status_code=400, detail="path escapes history dir")
    if not filename.startswith(f"{module}-"):
        raise HTTPException(status_code=404, detail="history file not found for module")
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="history file not found")
    body = target.read_text(encoding="utf-8", errors="replace")
    return PlainTextResponse(content=body, media_type="text/markdown; charset=utf-8")


@router.get("/{module}/{layer}/{filename}")
async def get_knowledge(
    module: str,
    layer: str,
    filename: str,
    settings: Settings = Depends(get_settings),
):
    target = _resolve_path(settings, module, layer, filename)
    if not target.exists():
        raise HTTPException(status_code=404, detail="knowledge file not found")
    return {
        "module": module,
        "layer": layer,
        "filename": filename,
        "path": str(target),
        "content": target.read_text(encoding="utf-8", errors="replace"),
    }


@router.put("/{module}/{layer}/{filename}")
async def put_knowledge(
    module: str,
    layer: str,
    filename: str,
    body: KnowledgePut,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    target = _resolve_path(settings, module, layer, filename)
    before = target.read_text(encoding="utf-8") if target.exists() else None

    # *** backup-before-overwrite ***
    if target.exists():
        backup_for_history(target, _history_dir(settings))

    write_text_atomic(target, body.content)
    audit.record(
        settings,
        actor="admin",
        action="knowledge.put",
        target=str(target),
        before=(before or "")[:400],
        after=body.content[:400],
    )
    _append_index_run(
        settings,
        {
            "type": "manual-edit",
            "ts": time.time(),
            "module": module,
            "layer": layer,
            "filename": filename,
            "actor": "admin",
        },
    )
    await manager.broadcast(
        {
            "type": "knowledge.edited",
            "source": "admin",
            "payload": {"module": module, "layer": layer, "filename": filename},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "path": str(target)}
