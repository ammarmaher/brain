# *** Admin router: gap CRUD with schema validation + soft-delete + WS broadcast ***

from __future__ import annotations

import json
import logging
import time
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import (
    is_safe_name,
    write_json_atomic,
    write_text_atomic,
)
from app.services.schema_validator import validate as schema_validate
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/gaps",
    tags=["admin", "gaps"],
    dependencies=[Depends(require_admin_token)],
)


# *** Path helpers ***

def _module_dir(settings: Settings, module: str) -> Path:
    return settings.analysis_dir / "L2-business" / module


def _gaps_json(settings: Settings, module: str) -> Path:
    return _module_dir(settings, module) / f"{module}-gaps.json"


def _gaps_md(settings: Settings, module: str) -> Path:
    return _module_dir(settings, module) / f"{module}-gaps.md"


def _index_path(settings: Settings) -> Path:
    return settings.analysis_dir / "index.json"


def _load_module_gaps(settings: Settings, module: str) -> Dict[str, Any]:
    p = _gaps_json(settings, module)
    if not p.exists():
        return {"module": module, "generatedAt": _now_iso(), "gaps": []}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"gaps.json parse error: {exc}")


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def _regenerate_md(doc: Dict[str, Any]) -> str:
    gaps = doc.get("gaps", [])
    lines = [
        f"# {doc.get('module', 'unknown')} — Gaps",
        "",
        f"Generated: {doc.get('generatedAt', '')}",
        "",
        "| ID | Severity | Category | Title | Status |",
        "| --- | --- | --- | --- | --- |",
    ]
    for g in gaps:
        if not isinstance(g, dict):
            continue
        gid = str(g.get("id", "")).replace("|", "-")
        sev = str(g.get("severity", "")).replace("|", "-")
        cat = str(g.get("category", g.get("type", ""))).replace("|", "-")
        title = str(g.get("title", g.get("description", "")))[:80].replace("|", "-")
        st = str(g.get("status", "open")).replace("|", "-")
        lines.append(f"| {gid} | {sev} | {cat} | {title} | {st} |")
    return "\n".join(lines) + "\n"


def _append_index(settings: Settings, entry: Dict[str, Any]) -> None:
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


def _save(settings: Settings, module: str, doc: Dict[str, Any]) -> None:
    write_json_atomic(_gaps_json(settings, module), doc)
    write_text_atomic(_gaps_md(settings, module), _regenerate_md(doc))


# *** Routes ***

class GapPatch(BaseModel):
    severity: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    title: Optional[str] = None
    evidence: Optional[str] = None
    suggestedFix: Optional[str] = None
    tracesTo: Optional[List[str]] = None
    status: Optional[str] = None


@router.post("/{module}", status_code=201)
async def create_gap(
    module: str,
    body: Dict[str, Any],
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")

    doc = _load_module_gaps(settings, module)
    doc.setdefault("module", module)
    doc.setdefault("generatedAt", _now_iso())
    gaps = doc.setdefault("gaps", [])

    # *** ensure id, default status=open ***
    if not body.get("id"):
        raise HTTPException(status_code=400, detail="missing 'id' field")
    if any(isinstance(g, dict) and g.get("id") == body["id"] for g in gaps):
        raise HTTPException(status_code=409, detail=f"gap {body['id']} already exists")
    body.setdefault("status", "open")

    # *** validate the whole doc against gap-report schema ***
    candidate = deepcopy(doc)
    candidate.setdefault("gaps", []).append(body)
    ok, err = schema_validate(settings, "gap-report.schema.json", candidate)
    if not ok:
        raise HTTPException(status_code=400, detail=f"schema validation failed: {err}")

    gaps.append(body)
    doc["generatedAt"] = _now_iso()
    _save(settings, module, doc)

    audit.record(
        settings, actor="admin", action="gap.create", target=f"{module}/{body['id']}", after=body
    )
    _append_index(
        settings,
        {"type": "gap-add", "ts": time.time(), "module": module, "id": body["id"], "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "gap.added",
            "source": "admin",
            "payload": {"module": module, "id": body["id"]},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "id": body["id"]}


@router.put("/{module}/{gap_id}")
async def update_gap(
    module: str,
    gap_id: str,
    body: GapPatch,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    if not is_safe_name(gap_id):
        raise HTTPException(status_code=400, detail="invalid gap id")

    doc = _load_module_gaps(settings, module)
    gaps = doc.setdefault("gaps", [])
    target = next((g for g in gaps if isinstance(g, dict) and g.get("id") == gap_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail="gap not found")

    before = deepcopy(target)
    patch = body.model_dump(exclude_none=True)
    target.update(patch)

    ok, err = schema_validate(settings, "gap-report.schema.json", doc)
    if not ok:
        # *** revert in-memory change so file isn't written ***
        target.clear()
        target.update(before)
        raise HTTPException(status_code=400, detail=f"schema validation failed: {err}")

    doc["generatedAt"] = _now_iso()
    _save(settings, module, doc)

    audit.record(
        settings,
        actor="admin",
        action="gap.update",
        target=f"{module}/{gap_id}",
        before=before,
        after=target,
    )
    _append_index(
        settings,
        {"type": "gap-update", "ts": time.time(), "module": module, "id": gap_id, "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "gap.updated",
            "source": "admin",
            "payload": {"module": module, "id": gap_id},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "id": gap_id}


@router.delete("/{module}/{gap_id}")
async def archive_gap(
    module: str,
    gap_id: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    if not is_safe_name(gap_id):
        raise HTTPException(status_code=400, detail="invalid gap id")

    doc = _load_module_gaps(settings, module)
    gaps = doc.setdefault("gaps", [])
    target = next((g for g in gaps if isinstance(g, dict) and g.get("id") == gap_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail="gap not found")

    before = deepcopy(target)
    target["status"] = "archived"
    target["archivedAt"] = _now_iso()
    doc["generatedAt"] = _now_iso()
    _save(settings, module, doc)

    audit.record(
        settings,
        actor="admin",
        action="gap.archive",
        target=f"{module}/{gap_id}",
        before=before,
        after=target,
    )
    _append_index(
        settings,
        {"type": "gap-archive", "ts": time.time(), "module": module, "id": gap_id, "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "gap.archived",
            "source": "admin",
            "payload": {"module": module, "id": gap_id},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "id": gap_id, "status": "archived"}
