# *** Voice router — list/stream alerts + trigger context play ***

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services import voice_index
from app.services.ps_runner import is_safe_arg, run_script

router = APIRouter(prefix="/api/voice", tags=["voice"], dependencies=[Depends(require_token)])


class PlayRequest(BaseModel):
    mindset: str = Field(min_length=1, max_length=64)
    category: str = Field(min_length=1, max_length=64)
    state: str = Field(min_length=1, max_length=64)


@router.get("/alerts")
async def list_alerts(settings: Settings = Depends(get_settings)):
    # *** Wave 1.6: pinned flat-array shape; iterates voice-alerts.json once ***
    # *** Each entry: {mindset, category, index, text, claims, mp3Url} ***
    return voice_index.list_alerts_flat(settings)


@router.get("/mindsets")
async def list_mindsets_route(settings: Settings = Depends(get_settings)):
    return voice_index.list_mindsets(settings)


@router.get("/alerts/{mindset}/{category}/{idx}")
async def stream_alert(mindset: str, category: str, idx: str, settings: Settings = Depends(get_settings)):
    p = voice_index.resolve_alert_path(settings, mindset, category, idx)
    if p is None:
        raise HTTPException(status_code=404, detail="alert not found")
    return FileResponse(str(p), media_type="audio/mpeg", filename=f"{mindset}-{category}-{idx}.mp3")


@router.get("/settings")
async def get_voice_settings(settings: Settings = Depends(get_settings)):
    cfg = voice_index.read_settings_json(settings)
    # *** Strip any stray credential-like fields defensively ***
    if isinstance(cfg, dict):
        cfg.pop("apiKey", None)
        cfg.pop("token", None)
    return cfg


@router.get("/claims")
async def get_claims(settings: Settings = Depends(get_settings)):
    return voice_index.read_claims(settings)


@router.post("/play")
async def play(body: PlayRequest, settings: Settings = Depends(get_settings)):
    for v in (body.mindset, body.category, body.state):
        ok, why = is_safe_arg(v)
        if not ok:
            raise HTTPException(status_code=400, detail=f"unsafe argument: {why}")

    res = await run_script(
        settings,
        "play-alert-context",
        ["-Mindset", body.mindset, "-Category", body.category, "-State", body.state],
        timeout=30.0,
    )
    if res.returncode not in (0, None):
        raise HTTPException(status_code=502, detail={"stderr": res.stderr, "stdout": res.stdout})
    return {"ok": True, "result": res.to_dict()}
