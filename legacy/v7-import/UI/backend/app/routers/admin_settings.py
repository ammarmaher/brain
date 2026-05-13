# *** Admin router: full settings.json get/put + manual apply trigger ***

from __future__ import annotations

import json
import logging
import time
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import write_json_atomic
from app.services.ps_runner import run_script
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/settings",
    tags=["admin", "settings"],
    dependencies=[Depends(require_admin_token)],
)


_SENSITIVE_KEYS = {"apiKey", "api_key", "token", "secret", "password", "openaiKey", "geminiKey"}


class SettingsPut(BaseModel):
    settingsJson: Dict[str, Any]


def _settings_path(settings: Settings) -> Path:
    return settings.sound_dir / "settings.json"


def _sanitize(node: Any) -> Any:
    if isinstance(node, dict):
        return {k: _sanitize(v) for k, v in node.items() if k not in _SENSITIVE_KEYS}
    if isinstance(node, list):
        return [_sanitize(x) for x in node]
    return node


@router.get("/full")
async def get_full(settings: Settings = Depends(get_settings)):
    p = _settings_path(settings)
    if not p.exists():
        raise HTTPException(status_code=404, detail="settings.json not found")
    try:
        cfg = json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"parse error: {exc}")
    return _sanitize(cfg)


@router.put("/full")
async def put_full(
    body: SettingsPut,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    cfg = body.settingsJson
    # *** validate shape: must be a dict with at least one of the known top-level keys ***
    if not isinstance(cfg, dict):
        raise HTTPException(status_code=400, detail="settingsJson must be an object")
    expected_keys = {"global", "skills", "mindsets", "agentTts"}
    if not (set(cfg.keys()) & expected_keys):
        raise HTTPException(
            status_code=400,
            detail=f"settingsJson must contain at least one of: {sorted(expected_keys)}",
        )

    p = _settings_path(settings)
    before = json.loads(p.read_text(encoding="utf-8")) if p.exists() else None
    write_json_atomic(p, cfg)
    audit.record(
        settings,
        actor="admin",
        action="settings.put.full",
        target=str(p),
        before={"keys": sorted(list(before.keys()))} if before else None,
        after={"keys": sorted(list(cfg.keys()))},
    )

    res = await run_script(settings, "apply-settings", [], timeout=30.0, optional=True)
    await manager.broadcast(
        {
            "type": "settings.changed",
            "source": "admin",
            "payload": {"action": "put"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "applied": res.returncode == 0, "rc": res.returncode}


@router.post("/apply")
async def apply_settings(
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    res = await run_script(settings, "apply-settings", [], timeout=30.0, optional=True)
    audit.record(
        settings,
        actor="admin",
        action="settings.apply",
        target="apply-settings.ps1",
        extra={"rc": res.returncode, "stdout": res.stdout[:200], "stderr": res.stderr[:200]},
    )
    await manager.broadcast(
        {
            "type": "settings.applied",
            "source": "admin",
            "payload": {"rc": res.returncode},
            "timestamp": time.time(),
        }
    )
    return {"ok": res.returncode in (0, 126), "rc": res.returncode, "result": res.to_dict()}
