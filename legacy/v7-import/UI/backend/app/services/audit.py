# *** Audit log service: every admin mutation appends one JSON line ***

from __future__ import annotations

import json
import logging
import threading
import time
from pathlib import Path
from typing import Any, Dict, Optional

from app.config import Settings

logger = logging.getLogger(__name__)

_lock = threading.Lock()


def _audit_path(settings: Settings) -> Path:
    # *** Env override BRAIN_UI_AUDIT_LOG; default = backend/audit.log next to app/ ***
    if settings.brain_ui_audit_log is not None:
        return Path(settings.brain_ui_audit_log)
    return Path(__file__).resolve().parent.parent.parent / "audit.log"


def record(
    settings: Settings,
    actor: str,
    action: str,
    target: str,
    before: Optional[Any] = None,
    after: Optional[Any] = None,
    extra: Optional[Dict[str, Any]] = None,
) -> Path:
    """Append a single JSON line to audit.log. Best-effort, never raises."""
    line: Dict[str, Any] = {
        "ts": time.time(),
        "actor": actor,
        "action": action,
        "target": target,
    }
    if before is not None:
        line["before"] = _truncate(before)
    if after is not None:
        line["after"] = _truncate(after)
    if extra:
        line["extra"] = extra

    p = _audit_path(settings)
    try:
        with _lock:
            p.parent.mkdir(parents=True, exist_ok=True)
            with p.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(line, ensure_ascii=False, default=str) + "\n")
    except Exception as exc:  # pragma: no cover
        logger.warning("audit.record failed: %s", exc)
    return p


def _truncate(value: Any, max_len: int = 4000) -> Any:
    """Stringify and clip large payloads so audit.log stays bounded."""
    try:
        s = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, default=str)
    except Exception:
        s = str(value)
    if len(s) > max_len:
        return s[:max_len] + f"...[truncated {len(s) - max_len} chars]"
    return s
