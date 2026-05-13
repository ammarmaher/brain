# *** JSON Schema validator helper — loads from Brain/analysis/schemas with caching ***

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

from app.config import Settings

logger = logging.getLogger(__name__)

try:
    import jsonschema  # type: ignore
    _HAS_JSONSCHEMA = True
except Exception:  # pragma: no cover
    _HAS_JSONSCHEMA = False


def _load_schema(settings: Settings, name: str) -> Dict[str, Any]:
    p = settings.schemas_dir / name
    if not p.exists():
        raise FileNotFoundError(f"schema {name} not found at {p}")
    return json.loads(p.read_text(encoding="utf-8"))


def validate(settings: Settings, schema_name: str, instance: Any) -> tuple[bool, str]:
    """Return (ok, error_message). If jsonschema not installed, returns (True, '')."""
    if not _HAS_JSONSCHEMA:
        logger.warning("jsonschema not installed — skipping validation of %s", schema_name)
        return True, ""
    try:
        schema = _load_schema(settings, schema_name)
    except FileNotFoundError as exc:
        return False, str(exc)
    try:
        jsonschema.validate(instance=instance, schema=schema)  # type: ignore
        return True, ""
    except jsonschema.exceptions.ValidationError as exc:  # type: ignore
        return False, exc.message
