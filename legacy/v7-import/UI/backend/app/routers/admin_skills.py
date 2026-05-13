# *** Admin router: settings.json skills + mindsets CRUD with apply-settings post-hook ***

from __future__ import annotations

import json
import logging
import time
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import is_safe_name, write_json_atomic
from app.services.ps_runner import run_script
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin",
    tags=["admin", "skills"],
    dependencies=[Depends(require_admin_token)],
)


# *** Pydantic shapes — fields are loose dict-tolerant for forward compat ***

class SkillBlock(BaseModel):
    voice: str = Field(min_length=1, max_length=64)
    speed: float = Field(default=1.0, ge=0.1, le=4.0)
    volumeMultiplier: float = Field(default=1.0, ge=0.1, le=20.0)
    phrases: Dict[str, str] = Field(default_factory=dict)
    triggers: list[str] = Field(default_factory=list)
    beep: list[Any] = Field(default_factory=list)
    beepGapMs: int | None = Field(default=None)


def _settings_path(settings: Settings) -> Path:
    return settings.sound_dir / "settings.json"


def _load_settings_json(settings: Settings) -> Dict[str, Any]:
    p = _settings_path(settings)
    if not p.exists():
        raise HTTPException(status_code=404, detail="settings.json not found")
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"settings.json parse error: {exc}")


async def _apply_and_broadcast(
    settings: Settings,
    manager: ConnectionManager,
    section: str,
    name: str,
    action: str,
) -> Dict[str, Any]:
    res = await run_script(settings, "apply-settings", [], timeout=30.0, optional=True)
    await manager.broadcast(
        {
            "type": f"{section[:-1] if section.endswith('s') else section}.crud.changed",
            "source": "admin",
            "payload": {"section": section, "name": name, "action": action},
            "timestamp": time.time(),
        }
    )
    return {"applied": res.returncode == 0, "rc": res.returncode}


def _check_section(section: str) -> None:
    if section not in ("skills", "mindsets"):
        raise HTTPException(status_code=400, detail="invalid section")


def _section_routes(section: str) -> str:
    return section


# *** Generic handlers reused for /skills and /mindsets ***

async def _list(section: str, settings: Settings) -> Dict[str, Any]:
    cfg = _load_settings_json(settings)
    block = cfg.get(section, {}) or {}
    return block


async def _put(
    section: str,
    name: str,
    body: Dict[str, Any],
    settings: Settings,
    manager: ConnectionManager,
):
    if not is_safe_name(name, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid name")
    cfg = _load_settings_json(settings)
    cfg.setdefault(section, {})
    before = deepcopy(cfg[section].get(name))
    cfg[section][name] = body
    write_json_atomic(_settings_path(settings), cfg)
    audit.record(
        settings,
        actor="admin",
        action=f"{section}.put",
        target=f"{section}/{name}",
        before=before,
        after=body,
    )
    apply_info = await _apply_and_broadcast(settings, manager, section, name, "updated")
    return {"ok": True, "section": section, "name": name, **apply_info}


async def _post(
    section: str,
    name: str,
    body: Dict[str, Any],
    settings: Settings,
    manager: ConnectionManager,
):
    if not is_safe_name(name, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid name")
    cfg = _load_settings_json(settings)
    cfg.setdefault(section, {})
    if name in cfg[section]:
        raise HTTPException(status_code=409, detail=f"{section}.{name} already exists")
    cfg[section][name] = body
    write_json_atomic(_settings_path(settings), cfg)
    audit.record(
        settings, actor="admin", action=f"{section}.create", target=f"{section}/{name}", after=body
    )
    apply_info = await _apply_and_broadcast(settings, manager, section, name, "created")
    return {"ok": True, "section": section, "name": name, **apply_info}


async def _delete(
    section: str,
    name: str,
    settings: Settings,
    manager: ConnectionManager,
):
    if not is_safe_name(name, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid name")
    cfg = _load_settings_json(settings)
    cfg.setdefault(section, {})
    if name not in cfg[section]:
        raise HTTPException(status_code=404, detail=f"{section}.{name} not found")
    before = deepcopy(cfg[section][name])
    del cfg[section][name]
    write_json_atomic(_settings_path(settings), cfg)
    audit.record(
        settings, actor="admin", action=f"{section}.delete", target=f"{section}/{name}", before=before
    )
    apply_info = await _apply_and_broadcast(settings, manager, section, name, "deleted")
    return {"ok": True, "section": section, "name": name, **apply_info}


# *** Skills routes ***

@router.get("/skills")
async def list_skills_block(settings: Settings = Depends(get_settings)):
    return await _list("skills", settings)


@router.put("/skills/{name}")
async def put_skill(
    name: str,
    body: Dict[str, Any],
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    return await _put("skills", name, body, settings, manager)


@router.post("/skills", status_code=201)
async def post_skill(
    body: Dict[str, Any],
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    name = body.get("name") or body.get("skill") or ""
    if not name:
        raise HTTPException(status_code=400, detail="missing 'name' field in body")
    payload = {k: v for k, v in body.items() if k not in ("name", "skill")}
    return await _post("skills", str(name), payload, settings, manager)


@router.delete("/skills/{name}")
async def delete_skill(
    name: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    return await _delete("skills", name, settings, manager)


# *** Mindsets routes ***

@router.get("/mindsets")
async def list_mindsets_block(settings: Settings = Depends(get_settings)):
    return await _list("mindsets", settings)


@router.put("/mindsets/{name}")
async def put_mindset(
    name: str,
    body: Dict[str, Any],
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    return await _put("mindsets", name, body, settings, manager)


@router.post("/mindsets", status_code=201)
async def post_mindset(
    body: Dict[str, Any],
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    name = body.get("name") or body.get("mindset") or ""
    if not name:
        raise HTTPException(status_code=400, detail="missing 'name' field in body")
    payload = {k: v for k, v in body.items() if k not in ("name", "mindset")}
    return await _post("mindsets", str(name), payload, settings, manager)


@router.delete("/mindsets/{name}")
async def delete_mindset(
    name: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    return await _delete("mindsets", name, settings, manager)
