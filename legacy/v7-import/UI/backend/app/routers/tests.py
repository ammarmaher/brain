# *** Tests router — consolidates test-matrix CSVs + per-tc lookup ***

from __future__ import annotations

import csv
import logging
from pathlib import Path
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.models.test_case import TestCase

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tests", tags=["tests"], dependencies=[Depends(require_token)])


def _coerce_tc(row: Dict[str, str], module_hint: str = "") -> TestCase | None:
    tc_id = row.get("tcId") or row.get("TCID") or row.get("id") or row.get("TC ID")
    if not tc_id:
        return None
    module = row.get("module") or module_hint or None
    return TestCase(
        tcId=str(tc_id),
        module=module,
        title=row.get("title") or row.get("Title"),
        priority=row.get("priority") or row.get("Priority"),
        type=row.get("type") or row.get("Type"),
        preconditions=[s for s in (row.get("preconditions") or "").split("|") if s],
        steps=[s for s in (row.get("steps") or "").split("|") if s],
        expected=[s for s in (row.get("expected") or "").split("|") if s],
        requirements=[s for s in (row.get("requirements") or "").split("|") if s],
        extra=row,
    )


def _scan_tests(settings: Settings) -> List[TestCase]:
    out: List[TestCase] = []
    base = settings.analysis_dir
    if not base.exists():
        return out
    candidates = list(base.rglob("test-matrix*.csv")) + list(base.rglob("tests*.csv"))
    for f in candidates:
        module_hint = f.parent.name
        try:
            with f.open("r", encoding="utf-8", newline="") as fh:
                reader = csv.DictReader(fh)
                for row in reader:
                    tc = _coerce_tc(row, module_hint)
                    if tc:
                        out.append(tc)
        except Exception as exc:
            logger.debug("test csv parse fail %s: %s", f, exc)
    return out


@router.get("")
async def list_tests(settings: Settings = Depends(get_settings)):
    return _scan_tests(settings)


@router.get("/{module}/{tc_id}")
async def get_test(module: str, tc_id: str, settings: Settings = Depends(get_settings)):
    for s in (module, tc_id):
        cleaned = "".join(c for c in s if c.isalnum() or c in ("-", "_", "."))
        if cleaned != s:
            raise HTTPException(status_code=400, detail="invalid identifier")
    for t in _scan_tests(settings):
        if (t.module == module or t.module == module.replace("_", "-")) and t.tcId == tc_id:
            return t
    raise HTTPException(status_code=404, detail="test case not found")
