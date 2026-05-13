# *** Index voice samples + parse settings.json ***

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.config import Settings
from app.models.voice import MindsetVoice, VoiceAlert

logger = logging.getLogger(__name__)


def list_alerts(settings: Settings) -> List[VoiceAlert]:
    alerts_dir = settings.alerts_dir
    if not alerts_dir.exists():
        return []
    out: List[VoiceAlert] = []
    for mindset_dir in sorted(p for p in alerts_dir.iterdir() if p.is_dir()):
        for cat_dir in sorted(p for p in mindset_dir.iterdir() if p.is_dir()):
            for f in sorted(cat_dir.glob("*.mp3")):
                out.append(
                    VoiceAlert(
                        mindset=mindset_dir.name,
                        category=cat_dir.name,
                        index=f.stem,
                        path=str(f),
                        relUrl=f"/api/voice/alerts/{mindset_dir.name}/{cat_dir.name}/{f.stem}",
                    )
                )
    return out


def _read_assets_alerts_text(settings: Settings) -> Dict[str, Any]:
    p = settings.assets_dir / "voice-alerts.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("voice-alerts.json parse failed: %s", exc)
        return {}


def _read_assets_alerts_claims(settings: Settings) -> Dict[str, Any]:
    p = settings.assets_dir / "voice-alerts-claims.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("voice-alerts-claims.json parse failed: %s", exc)
        return {}


# *** Wave 1.6: pinned flat array iterator. One entry per (mindset, category, idx) ***
# *** Yields {mindset, category, index, text, claims, mp3Url}. ***
def list_alerts_flat(settings: Settings) -> List[Dict[str, Any]]:
    text_map = _read_assets_alerts_text(settings)
    claims_map = _read_assets_alerts_claims(settings)
    out: List[Dict[str, Any]] = []
    if not isinstance(text_map, dict):
        return out
    for mindset in sorted(k for k in text_map.keys() if isinstance(text_map[k], dict)):
        cat_block = text_map[mindset]
        for category in sorted(k for k in cat_block.keys() if isinstance(cat_block[k], list)):
            phrases = cat_block[category]
            for i, text in enumerate(phrases, start=1):
                idx = f"{i:02d}"
                claims_node = (
                    claims_map.get(mindset, {})
                    .get(category, {})
                    .get(idx, {})
                    if isinstance(claims_map, dict)
                    else {}
                )
                claims = list(claims_node.get("claims", [])) if isinstance(claims_node, dict) else []
                out.append(
                    {
                        "mindset": mindset,
                        "category": category,
                        "index": idx,
                        "text": str(text),
                        "claims": claims,
                        "mp3Url": f"/api/voice/alerts/{mindset}/{category}/{idx}",
                    }
                )
    return out


def list_mindsets(settings: Settings) -> List[MindsetVoice]:
    alerts_dir = settings.alerts_dir
    if not alerts_dir.exists():
        return []
    out: List[MindsetVoice] = []
    for mindset_dir in sorted(p for p in alerts_dir.iterdir() if p.is_dir()):
        cats = [c.name for c in mindset_dir.iterdir() if c.is_dir()]
        out.append(MindsetVoice(mindset=mindset_dir.name, categories=sorted(cats)))
    return out


def resolve_alert_path(settings: Settings, mindset: str, category: str, idx: str) -> Optional[Path]:
    """Resolve alert path with strict sanitization (no .. / no separators)."""

    def safe(s: str) -> bool:
        return bool(s) and all(ch.isalnum() or ch in ("-", "_") for ch in s)

    if not (safe(mindset) and safe(category) and safe(idx)):
        return None

    p = settings.alerts_dir / mindset / category / f"{idx}.mp3"
    try:
        p_resolved = p.resolve()
        base = settings.alerts_dir.resolve()
        if base not in p_resolved.parents:
            return None
    except OSError:
        return None
    if not p.exists():
        return None
    return p


def read_settings_json(settings: Settings) -> Dict[str, Any]:
    p = settings.sound_dir / "settings.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("sound settings.json parse failed: %s", exc)
        return {}


def read_claims(settings: Settings) -> Dict[str, Any]:
    p = settings.sound_dir / "voice-alerts-claims.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("voice-alerts-claims.json parse failed: %s", exc)
        return {}
