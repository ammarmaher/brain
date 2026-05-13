# *** Admin router: agent spawn request queue (records request files; orchestrator picks them up) ***

from __future__ import annotations

import json
import logging
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import is_safe_name, write_json_atomic
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/agents",
    tags=["admin", "agents"],
    dependencies=[Depends(require_admin_token)],
)


_ALLOWED_TYPE_RX = __import__("re").compile(r"^[A-Za-z0-9][A-Za-z0-9\-_.]{0,80}$")


class SpawnRequest(BaseModel):
    type: str = Field(min_length=1, max_length=80)
    description: str = Field(min_length=1, max_length=200)
    prompt: str = Field(min_length=1)
    runInBackground: bool = Field(default=False)


def _queue_dir(settings: Settings) -> Path:
    return settings.brain_root / "state" / "_agent_requests"


@router.post("/spawn", status_code=201)
async def spawn_agent(
    body: SpawnRequest,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not _ALLOWED_TYPE_RX.match(body.type):
        raise HTTPException(status_code=400, detail="invalid agent type")

    rid = uuid.uuid4().hex[:16]
    record = {
        "id": rid,
        "type": body.type,
        "description": body.description,
        "prompt": body.prompt,
        "runInBackground": body.runInBackground,
        "status": "queued",
        "createdAt": time.time(),
    }
    qdir = _queue_dir(settings)
    qdir.mkdir(parents=True, exist_ok=True)
    write_json_atomic(qdir / f"{rid}.json", record)

    audit.record(
        settings,
        actor="admin",
        action="agent.spawn.request",
        target=rid,
        after={k: v for k, v in record.items() if k != "prompt"},
    )
    await manager.broadcast(
        {
            "type": "agent.spawn.requested",
            "source": "admin",
            "payload": {"id": rid, "type": body.type, "description": body.description},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "id": rid, "status": "queued"}


@router.get("/spawn/{request_id}")
async def get_spawn_status(
    request_id: str,
    settings: Settings = Depends(get_settings),
):
    if not is_safe_name(request_id):
        raise HTTPException(status_code=400, detail="invalid request id")
    p = _queue_dir(settings) / f"{request_id}.json"
    if not p.exists():
        raise HTTPException(status_code=404, detail="spawn request not found")
    try:
        rec = json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"parse error: {exc}")
    return rec


# *** Wave 1.6: tail of audit.log filtered to agent.* actions ***

@router.get("/audit")
async def list_agent_audit(
    limit: int = 20,
    settings: Settings = Depends(get_settings),
):
    if limit < 1:
        raise HTTPException(status_code=400, detail="limit must be >= 1")
    if limit > 100:
        limit = 100
    # *** import here to avoid circular ref + reuse the same _audit_path resolution ***
    from app.services.audit import _audit_path
    p = _audit_path(settings)
    if not p.exists():
        return []
    out: List[Dict[str, Any]] = []
    try:
        # *** Read the whole file then walk in reverse for last-N filtering ***
        lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"audit log read error: {exc}")
    for ln in reversed(lines):
        if not ln.strip():
            continue
        try:
            rec = json.loads(ln)
        except Exception:
            continue
        action = str(rec.get("action") or "")
        if not action.startswith("agent."):
            continue
        out.append(
            {
                "timestamp": rec.get("ts"),
                "actor": rec.get("actor"),
                "action": action,
                "target": rec.get("target"),
                "before": rec.get("before"),
                "after": rec.get("after"),
            }
        )
        if len(out) >= limit:
            break
    return out
