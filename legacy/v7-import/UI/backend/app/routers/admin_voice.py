# *** Admin router: voice phrase editor + Kokoro regenerate ***

from __future__ import annotations

import asyncio
import json
import logging
import time
import urllib.error
import urllib.request
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit, voice_index
from app.services.atomic_io import is_safe_name, write_json_atomic
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/voice",
    tags=["admin", "voice"],
    dependencies=[Depends(require_admin_token)],
)


class PhrasePut(BaseModel):
    text: Optional[str] = None
    claims: Optional[List[str]] = None


# *** Path helpers ***

def _alerts_path(settings: Settings) -> Path:
    return settings.assets_dir / "voice-alerts.json"


def _claims_path(settings: Settings) -> Path:
    return settings.assets_dir / "voice-alerts-claims.json"


def _load_json(p: Path) -> Dict[str, Any]:
    if not p.exists():
        raise HTTPException(status_code=404, detail=f"missing file: {p.name}")
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"parse error in {p.name}: {exc}")


def _idx_to_arr_pos(idx: str) -> int:
    """voice-alerts.json arrays are 0-based; UI uses 1-based '01','02',... strings."""
    if not idx.isdigit():
        raise HTTPException(status_code=400, detail="idx must be numeric (e.g. '01','02')")
    return int(idx) - 1


# *** Routes ***

@router.get("/phrases")
async def get_phrases(settings: Settings = Depends(get_settings)):
    alerts = _load_json(_alerts_path(settings))
    claims = _load_json(_claims_path(settings))
    return {"alerts": alerts, "claims": claims}


@router.put("/phrases/{mindset}/{category}/{nn}")
async def put_phrase(
    mindset: str,
    category: str,
    nn: str,
    body: PhrasePut,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    for v in (mindset, category, nn):
        if not is_safe_name(v, allow_dot=False):
            raise HTTPException(status_code=400, detail="invalid id segment")

    alerts_p = _alerts_path(settings)
    claims_p = _claims_path(settings)
    alerts = _load_json(alerts_p)
    claims = _load_json(claims_p)

    # *** alerts mutation ***
    if body.text is not None:
        if mindset not in alerts or category not in alerts.get(mindset, {}):
            raise HTTPException(status_code=404, detail=f"path {mindset}/{category} not found in alerts")
        arr = alerts[mindset][category]
        if not isinstance(arr, list):
            raise HTTPException(status_code=500, detail="alerts node is not an array")
        pos = _idx_to_arr_pos(nn)
        if pos < 0 or pos >= len(arr):
            raise HTTPException(status_code=400, detail=f"index {nn} out of range (len={len(arr)})")
        before_text = arr[pos]
        arr[pos] = body.text
        write_json_atomic(alerts_p, alerts)
        audit.record(
            settings,
            actor="admin",
            action="voice.phrase.text",
            target=f"{mindset}/{category}/{nn}",
            before=before_text,
            after=body.text,
        )

    # *** claims mutation ***
    if body.claims is not None:
        node = claims.setdefault(mindset, {}).setdefault(category, {})
        before_claims = deepcopy(node.get(nn))
        node[nn] = {"claims": list(body.claims)}
        write_json_atomic(claims_p, claims)
        audit.record(
            settings,
            actor="admin",
            action="voice.phrase.claims",
            target=f"{mindset}/{category}/{nn}",
            before=before_claims,
            after=node[nn],
        )

    await manager.broadcast(
        {
            "type": "voice.phrase.updated",
            "source": "admin",
            "payload": {"mindset": mindset, "category": category, "idx": nn},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "mindset": mindset, "category": category, "idx": nn}


@router.post("/regenerate/{mindset}/{category}/{nn}")
async def regenerate(
    mindset: str,
    category: str,
    nn: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    for v in (mindset, category, nn):
        if not is_safe_name(v, allow_dot=False):
            raise HTTPException(status_code=400, detail="invalid id segment")

    alerts = _load_json(_alerts_path(settings))
    if mindset not in alerts or category not in alerts.get(mindset, {}):
        raise HTTPException(status_code=404, detail="phrase not found in voice-alerts.json")
    arr = alerts[mindset][category]
    pos = _idx_to_arr_pos(nn)
    if pos < 0 or pos >= len(arr):
        raise HTTPException(status_code=400, detail="index out of range")
    text = arr[pos]

    # *** voice/speed/volume from settings.json mindsets/skills (best-effort lookup) ***
    cfg = voice_index.read_settings_json(settings)
    mindsets_block = cfg.get("mindsets", {}) if isinstance(cfg, dict) else {}
    block = mindsets_block.get(mindset, {}) if isinstance(mindsets_block, dict) else {}
    voice = block.get("voice") or cfg.get("agentTts", {}).get("fallbackVoice", "bm_george")
    speed = float(block.get("speed", cfg.get("global", {}).get("speed", 1.0)))
    volume = float(block.get("volumeMultiplier", cfg.get("global", {}).get("volumeMultiplier", 1.0)))

    out_dir = settings.alerts_dir / mindset / category
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{nn}.mp3"

    # *** Call Kokoro synchronously in thread; write atomically ***
    payload = {
        "model": cfg.get("global", {}).get("model", "kokoro"),
        "input": text,
        "voice": voice,
        "speed": speed,
        "response_format": cfg.get("global", {}).get("responseFormat", "mp3"),
    }
    url = settings.kokoro_base_url.rstrip("/") + "/audio/speech"

    try:
        data = await asyncio.to_thread(_post_kokoro, url, payload, timeout=60.0)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Kokoro call failed: {exc}")

    # *** Apply volume multiplier (best-effort): if Kokoro returns raw mp3, write as-is. ***
    # *** Volume scaling normally happens via ffmpeg in render-* scripts; we leave that to apply-settings. ***
    tmp = out_path.with_suffix(out_path.suffix + ".tmp")
    tmp.write_bytes(data)
    import os as _os
    _os.replace(tmp, out_path)

    size = out_path.stat().st_size
    audit.record(
        settings,
        actor="admin",
        action="voice.regenerate",
        target=str(out_path),
        extra={"voice": voice, "speed": speed, "volume": volume, "bytes": size},
    )
    await manager.broadcast(
        {
            "type": "voice.regenerated",
            "source": "admin",
            "payload": {"mindset": mindset, "category": category, "idx": nn, "bytes": size},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "path": str(out_path), "bytes": size}


def _post_kokoro(url: str, payload: Dict[str, Any], timeout: float) -> bytes:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:  # nosec - localhost service
        return resp.read()


# *** Wave 1.6: restart agent-tts node daemon via whitelisted helper script ***

@router.post("/restart-daemon")
async def restart_agent_tts_daemon(
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    from app.services.ps_runner import run_script
    res = await run_script(settings, "restart-agent-tts", [], timeout=30.0, optional=False)
    parsed: Dict[str, Any] = {}
    stdout = (res.stdout or "").strip()
    if stdout:
        try:
            parsed = json.loads(stdout)
        except Exception:
            parsed = {}

    payload = {
        "stopped": parsed.get("stopped", []),
        "started": parsed.get("started"),
        "logPath": parsed.get("logPath"),
        "errPath": parsed.get("errPath"),
        "rc": res.returncode,
    }
    audit.record(
        settings,
        actor="admin",
        action="voice.restart-daemon",
        target="agent-tts",
        extra={
            "stopped": payload["stopped"],
            "started": payload["started"],
            "rc": res.returncode,
        },
    )
    await manager.broadcast(
        {
            "type": "voice.daemon.restarted",
            "source": "admin",
            "payload": {"started": payload["started"], "stopped": payload["stopped"]},
            "timestamp": time.time(),
        }
    )
    return payload
