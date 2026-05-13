# *** Admin router: feedback memory editor (memory dir CRUD) ***

from __future__ import annotations

import logging
import re
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import (
    archive_then_remove,
    is_safe_name,
    write_text_atomic,
)
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/memory",
    tags=["admin", "memory"],
    dependencies=[Depends(require_admin_token)],
)


class MemoryPut(BaseModel):
    content: str = Field(min_length=0)


class MemoryCreate(BaseModel):
    filename: str = Field(min_length=1, max_length=200)
    frontmatter: Dict[str, Any] = Field(default_factory=dict)
    content: str = Field(default="")


class MemoryIndexPut(BaseModel):
    content: str = Field(min_length=0)


_FRONT_RX = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def _safe_md_filename(name: str) -> bool:
    return is_safe_name(name) and name.endswith(".md") and not name.startswith("_")


def _memory_path(settings: Settings, name: str) -> Path:
    return settings.memory_dir / name


def _archive_dir(settings: Settings) -> Path:
    return settings.memory_dir / "_archive"


def _parse_frontmatter(text: str) -> Dict[str, Any]:
    m = _FRONT_RX.match(text)
    if not m:
        return {}
    out: Dict[str, Any] = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def _render_frontmatter(fm: Dict[str, Any]) -> str:
    if not fm:
        return ""
    lines = ["---"]
    for k, v in fm.items():
        lines.append(f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


# *** Routes ***

@router.get("")
async def list_memory(settings: Settings = Depends(get_settings)):
    base = settings.memory_dir
    if not base.exists():
        return []
    out: List[Dict[str, Any]] = []
    for f in sorted(base.glob("*.md")):
        try:
            text = f.read_text(encoding="utf-8", errors="replace")
            fm = _parse_frontmatter(text)
        except Exception:
            fm = {}
        out.append(
            {
                "filename": f.name,
                "name": fm.get("name", f.stem),
                "description": fm.get("description"),
                "type": fm.get("type"),
                "originSessionId": fm.get("originSessionId"),
                "size": f.stat().st_size if f.exists() else 0,
            }
        )
    return out


@router.get("/{filename}")
async def get_memory(filename: str, settings: Settings = Depends(get_settings)):
    if not _safe_md_filename(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    p = _memory_path(settings, filename)
    if not p.exists():
        raise HTTPException(status_code=404, detail="memory file not found")
    text = p.read_text(encoding="utf-8", errors="replace")
    return {"filename": filename, "frontmatter": _parse_frontmatter(text), "content": text}


@router.put("/_index")
async def update_index(
    body: MemoryIndexPut,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    p = settings.memory_dir / "MEMORY.md"
    before = p.read_text(encoding="utf-8") if p.exists() else ""
    write_text_atomic(p, body.content)
    audit.record(
        settings,
        actor="admin",
        action="memory.index.put",
        target=str(p),
        before=before[:400],
        after=body.content[:400],
    )
    await manager.broadcast(
        {
            "type": "memory.changed",
            "source": "admin",
            "payload": {"filename": "MEMORY.md", "action": "updated"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "path": str(p)}


@router.put("/{filename}")
async def put_memory(
    filename: str,
    body: MemoryPut,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not _safe_md_filename(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    p = _memory_path(settings, filename)
    if not p.exists():
        raise HTTPException(status_code=404, detail="memory file not found")
    before = p.read_text(encoding="utf-8")
    write_text_atomic(p, body.content)
    audit.record(
        settings,
        actor="admin",
        action="memory.put",
        target=str(p),
        before=before[:400],
        after=body.content[:400],
    )
    await manager.broadcast(
        {
            "type": "memory.changed",
            "source": "admin",
            "payload": {"filename": filename, "action": "updated"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "filename": filename}


@router.post("", status_code=201)
async def post_memory(
    body: MemoryCreate,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not _safe_md_filename(body.filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    p = _memory_path(settings, body.filename)
    if p.exists():
        raise HTTPException(status_code=409, detail="memory file already exists")
    full = _render_frontmatter(body.frontmatter) + body.content
    write_text_atomic(p, full)
    audit.record(
        settings, actor="admin", action="memory.create", target=str(p), after=full[:400]
    )
    await manager.broadcast(
        {
            "type": "memory.changed",
            "source": "admin",
            "payload": {"filename": body.filename, "action": "created"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "filename": body.filename, "path": str(p)}


@router.delete("/{filename}")
async def delete_memory(
    filename: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not _safe_md_filename(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    p = _memory_path(settings, filename)
    if not p.exists():
        raise HTTPException(status_code=404, detail="memory file not found")
    archived = archive_then_remove(p, _archive_dir(settings))
    audit.record(
        settings,
        actor="admin",
        action="memory.delete",
        target=str(p),
        extra={"archived": str(archived)} if archived else None,
    )
    await manager.broadcast(
        {
            "type": "memory.changed",
            "source": "admin",
            "payload": {"filename": filename, "action": "deleted"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "filename": filename, "archived": str(archived) if archived else None}
