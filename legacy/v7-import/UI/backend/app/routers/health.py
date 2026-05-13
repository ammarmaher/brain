# *** Health router — surfaces availability of orchestrator scripts, voice, kokoro, keys ***

from __future__ import annotations

import asyncio
import os
import socket
from typing import Any, Dict
from urllib.parse import urlparse

from fastapi import APIRouter, Depends

from app.config import Settings
from app.deps import get_settings
from app.services.ps_runner import ALLOWED_SCRIPTS

router = APIRouter(prefix="/api/health", tags=["health"])


def _check_kokoro(url: str, timeout: float = 0.6) -> bool:
    try:
        u = urlparse(url)
        host = u.hostname or "localhost"
        port = u.port or (443 if u.scheme == "https" else 80)
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def _voice_settings_present(settings: Settings) -> bool:
    return (settings.sound_dir / "settings.json").exists()


def _scripts_present(settings: Settings) -> Dict[str, bool]:
    # *** Whitelist entries can be a bare filename (under Brain/scripts) or (subdir, filename) tuple ***
    out: Dict[str, bool] = {}
    for key, entry in ALLOWED_SCRIPTS.items():
        if isinstance(entry, tuple):
            subdir, filename = entry
            out[key] = (settings.brain_root / subdir / filename).exists()
        else:
            out[key] = (settings.scripts_dir / entry).exists()
    return out


def _has_keys(settings: Settings) -> Dict[str, bool]:
    keys_env = settings.keys_env
    flags = {"chatgpt": False, "gemini": False}
    if keys_env.exists():
        try:
            text = keys_env.read_text(encoding="utf-8", errors="replace")
            flags["chatgpt"] = "OPENAI_API_KEY" in text or "CHATGPT_API_KEY" in text
            flags["gemini"] = "GEMINI_API_KEY" in text or "GOOGLE_API_KEY" in text
        except Exception:
            pass
    # *** env vars also count ***
    flags["chatgpt"] = flags["chatgpt"] or bool(os.getenv("OPENAI_API_KEY") or os.getenv("CHATGPT_API_KEY"))
    flags["gemini"] = flags["gemini"] or bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))
    return flags


@router.get("")
async def health(settings: Settings = Depends(get_settings)) -> Dict[str, Any]:
    scripts = _scripts_present(settings)
    voice_ok = _voice_settings_present(settings)
    kokoro_ok = await asyncio.to_thread(_check_kokoro, settings.kokoro_base_url)
    keys = _has_keys(settings)

    overall = "ok"
    if not scripts.get("orchestrator", False):
        overall = "degraded"
    if not voice_ok:
        overall = "degraded"

    return {
        "status": overall,
        "brainRoot": str(settings.brain_root),
        "scripts": scripts,
        "voiceSettingsPresent": voice_ok,
        "kokoroReachable": kokoro_ok,
        "kokoroBaseUrl": settings.kokoro_base_url,
        "keys": keys,
        "authMode": "bearer" if settings.brain_ui_token else "open-dev",
    }
