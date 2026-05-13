# *** Admin router: Gherkin test scenario CRUD with CSV mirror + index.json bookkeeping ***

from __future__ import annotations

import csv
import json
import logging
import re
import time
from io import StringIO
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit
from app.services.atomic_io import is_safe_name, write_text_atomic
from app.services.schema_validator import validate as schema_validate
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/tests",
    tags=["admin", "tests"],
    dependencies=[Depends(require_admin_token)],
)


_TC_RX = re.compile(r"^TC-[A-Z]{2,4}-\d{3}$")


class TestCaseIn(BaseModel):
    tcId: str = Field(min_length=1)
    title: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1)
    priority: str = Field(default="P2")
    given: str = Field(default="")
    when: str = Field(default="")
    then: str = Field(default="")
    tracesTo: List[str] = Field(default_factory=list)
    claims: List[str] = Field(default_factory=list)


def _module_dir(settings: Settings, module: str) -> Path:
    return settings.analysis_dir / "L2-business" / module


def _md_path(settings: Settings, module: str) -> Path:
    return _module_dir(settings, module) / "test-cases.md"


def _csv_path(settings: Settings, module: str) -> Path:
    return _module_dir(settings, module) / f"{module}-test-matrix.csv"


def _index_path(settings: Settings) -> Path:
    return settings.analysis_dir / "index.json"


def _check_tc_id(tc_id: str) -> None:
    if not _TC_RX.match(tc_id):
        raise HTTPException(
            status_code=400,
            detail=f"invalid tcId, must match {_TC_RX.pattern}",
        )


def _scenario_block(tc: TestCaseIn) -> str:
    traces = ", ".join(tc.tracesTo) if tc.tracesTo else "(none)"
    claims = ", ".join(tc.claims) if tc.claims else "(none)"
    return (
        f"\n## {tc.tcId} — {tc.title}\n\n"
        f"- Category: {tc.category}\n"
        f"- Priority: {tc.priority}\n"
        f"- Traces to: {traces}\n"
        f"- Claims: {claims}\n\n"
        f"```gherkin\n"
        f"Scenario: {tc.title}\n"
        f"  Given {tc.given}\n"
        f"  When {tc.when}\n"
        f"  Then {tc.then}\n"
        f"```\n"
    )


def _csv_row(tc: TestCaseIn, module: str) -> List[str]:
    return [
        tc.tcId,
        module,
        tc.title,
        tc.category,
        tc.priority,
        tc.given,
        tc.when,
        tc.then,
        "|".join(tc.tracesTo),
        "|".join(tc.claims),
    ]


_CSV_HEADER = ["tcId", "module", "title", "category", "priority", "given", "when", "then", "tracesTo", "claims"]


def _ensure_csv_header(p: Path) -> None:
    if p.exists():
        return
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(_CSV_HEADER)


def _csv_append(p: Path, row: List[str]) -> None:
    _ensure_csv_header(p)
    with p.open("a", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(row)


def _csv_replace_or_append(p: Path, tc_id: str, row: List[str]) -> None:
    _ensure_csv_header(p)
    rows: List[List[str]] = []
    found = False
    with p.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.reader(fh)
        for r in reader:
            if r and r[0] == tc_id and r != _CSV_HEADER:
                rows.append(row)
                found = True
            else:
                rows.append(r)
    if not found:
        rows.append(row)
    out = StringIO()
    writer = csv.writer(out)
    for r in rows:
        writer.writerow(r)
    write_text_atomic(p, out.getvalue())


def _md_append_block(p: Path, block: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    if p.exists():
        existing = p.read_text(encoding="utf-8")
    else:
        existing = "# Test Cases\n\n_(authored via admin API)_\n"
    write_text_atomic(p, existing + block)


def _md_replace_block(p: Path, tc_id: str, new_block: str) -> bool:
    if not p.exists():
        return False
    text = p.read_text(encoding="utf-8")
    # *** match from "## <tcId>" up to next "## " heading or EOF ***
    pattern = re.compile(
        rf"\n## {re.escape(tc_id)}[^\n]*\n.*?(?=\n## |\Z)",
        re.DOTALL,
    )
    if not pattern.search(text):
        return False
    new_text = pattern.sub(new_block, text, count=1)
    write_text_atomic(p, new_text)
    return True


def _md_archive_block(p: Path, tc_id: str) -> bool:
    if not p.exists():
        return False
    text = p.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"(\n## {re.escape(tc_id)}[^\n]*\n.*?)(?=\n## |\Z)",
        re.DOTALL,
    )
    m = pattern.search(text)
    if not m:
        return False
    today = time.strftime("%Y-%m-%d")
    archived = m.group(1) + f"\n<!-- # Archived: {today} -->\n"
    new_text = pattern.sub(archived, text, count=1)
    write_text_atomic(p, new_text)
    return True


def _index_append(settings: Settings, entry: Dict[str, Any]) -> None:
    p = _index_path(settings)
    if p.exists():
        try:
            idx = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            idx = {}
    else:
        idx = {}
    runs = idx.setdefault("runs", [])
    if not isinstance(runs, list):
        runs = []
        idx["runs"] = runs
    runs.append(entry)
    write_text_atomic(p, json.dumps(idx, ensure_ascii=False, indent=2))


@router.post("/{module}", status_code=201)
async def create_test(
    module: str,
    body: TestCaseIn,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    _check_tc_id(body.tcId)

    # *** schema-validate as a test-case instance ***
    instance = {
        "id": body.tcId,
        "module": module,
        "title": body.title,
        "category": body.category,
        "priority": body.priority,
        "given": body.given,
        "when": body.when,
        "then": body.then,
        "tracesTo": body.tracesTo,
        "claims": body.claims,
    }
    ok, err = schema_validate(settings, "test-case.schema.json", instance)
    if not ok:
        raise HTTPException(status_code=400, detail=f"schema validation failed: {err}")

    md_p = _md_path(settings, module)
    csv_p = _csv_path(settings, module)

    if md_p.exists() and re.search(rf"^## {re.escape(body.tcId)}\b", md_p.read_text(encoding="utf-8"), re.MULTILINE):
        raise HTTPException(status_code=409, detail=f"test case {body.tcId} already exists")

    _md_append_block(md_p, _scenario_block(body))
    _csv_append(csv_p, _csv_row(body, module))

    audit.record(
        settings,
        actor="admin",
        action="test.create",
        target=f"{module}/{body.tcId}",
        after=instance,
    )
    _index_append(
        settings,
        {"type": "test-add", "ts": time.time(), "module": module, "tcId": body.tcId, "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "test.crud.changed",
            "source": "admin",
            "payload": {"module": module, "tcId": body.tcId, "action": "created"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "tcId": body.tcId}


@router.put("/{module}/{tc_id}")
async def update_test(
    module: str,
    tc_id: str,
    body: TestCaseIn,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    _check_tc_id(tc_id)
    if body.tcId != tc_id:
        raise HTTPException(status_code=400, detail="tcId in body does not match URL")

    instance = {
        "id": body.tcId,
        "module": module,
        "title": body.title,
        "category": body.category,
        "priority": body.priority,
        "given": body.given,
        "when": body.when,
        "then": body.then,
        "tracesTo": body.tracesTo,
        "claims": body.claims,
    }
    ok, err = schema_validate(settings, "test-case.schema.json", instance)
    if not ok:
        raise HTTPException(status_code=400, detail=f"schema validation failed: {err}")

    md_p = _md_path(settings, module)
    csv_p = _csv_path(settings, module)

    if not _md_replace_block(md_p, tc_id, _scenario_block(body)):
        raise HTTPException(status_code=404, detail="test case not found in test-cases.md")
    _csv_replace_or_append(csv_p, tc_id, _csv_row(body, module))

    audit.record(
        settings,
        actor="admin",
        action="test.update",
        target=f"{module}/{tc_id}",
        after=instance,
    )
    _index_append(
        settings,
        {"type": "test-update", "ts": time.time(), "module": module, "tcId": tc_id, "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "test.crud.changed",
            "source": "admin",
            "payload": {"module": module, "tcId": tc_id, "action": "updated"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "tcId": tc_id}


@router.delete("/{module}/{tc_id}")
async def archive_test(
    module: str,
    tc_id: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(module, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid module")
    _check_tc_id(tc_id)

    md_p = _md_path(settings, module)
    if not _md_archive_block(md_p, tc_id):
        raise HTTPException(status_code=404, detail="test case not found")

    audit.record(
        settings,
        actor="admin",
        action="test.archive",
        target=f"{module}/{tc_id}",
    )
    _index_append(
        settings,
        {"type": "test-archive", "ts": time.time(), "module": module, "tcId": tc_id, "actor": "admin"},
    )
    await manager.broadcast(
        {
            "type": "test.crud.changed",
            "source": "admin",
            "payload": {"module": module, "tcId": tc_id, "action": "archived"},
            "timestamp": time.time(),
        }
    )
    return {"ok": True, "module": module, "tcId": tc_id, "status": "archived"}
