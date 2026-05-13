# *** Test: admin gap CRUD with schema validation + soft-delete (status=archived) ***

from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    (brain / "analysis" / "L2-business" / "demo-mod").mkdir(parents=True)
    (brain / "analysis" / "schemas").mkdir(parents=True)
    (brain / "scripts").mkdir(parents=True)

    # *** Copy real schema for validation ***
    real_schema = Path("C:/falcon/Brain/analysis/schemas/gap-report.schema.json")
    if real_schema.exists():
        shutil.copy2(real_schema, brain / "analysis" / "schemas" / "gap-report.schema.json")

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)

    import app.config as cfg
    cfg._settings = None
    return brain


def test_create_update_archive_gap(stub_brain):
    from app.main import app
    client = TestClient(app)

    gap = {
        "id": "GAP-DEMO-001",
        "severity": "medium",
        "category": "missing-edge-case",
        "description": "no error state when contact has no email",
    }
    r = client.post("/api/admin/gaps/demo-mod", json=gap)
    assert r.status_code == 201, r.text

    gap_json = stub_brain / "analysis" / "L2-business" / "demo-mod" / "demo-mod-gaps.json"
    gap_md = stub_brain / "analysis" / "L2-business" / "demo-mod" / "demo-mod-gaps.md"
    assert gap_json.exists()
    assert gap_md.exists()
    doc = json.loads(gap_json.read_text(encoding="utf-8"))
    assert any(g["id"] == "GAP-DEMO-001" for g in doc["gaps"])

    # *** index.json got an entry ***
    idx = json.loads((stub_brain / "analysis" / "index.json").read_text(encoding="utf-8"))
    assert any(r["type"] == "gap-add" and r["id"] == "GAP-DEMO-001" for r in idx["runs"])

    # *** update ***
    r2 = client.put(
        "/api/admin/gaps/demo-mod/GAP-DEMO-001",
        json={"severity": "high", "description": "elevated severity"},
    )
    assert r2.status_code == 200
    doc = json.loads(gap_json.read_text(encoding="utf-8"))
    g = next(g for g in doc["gaps"] if g["id"] == "GAP-DEMO-001")
    assert g["severity"] == "high"

    # *** soft delete ***
    r3 = client.delete("/api/admin/gaps/demo-mod/GAP-DEMO-001")
    assert r3.status_code == 200
    doc = json.loads(gap_json.read_text(encoding="utf-8"))
    g = next(g for g in doc["gaps"] if g["id"] == "GAP-DEMO-001")
    assert g["status"] == "archived"
    # *** record still present (soft delete leaves it) ***
    assert any(x["id"] == "GAP-DEMO-001" for x in doc["gaps"])


def test_invalid_severity_rejected_by_schema(stub_brain):
    from app.main import app
    client = TestClient(app)

    bad = {
        "id": "GAP-X-002",
        "severity": "WHATEVER",   # *** not in enum ***
        "category": "missing-edge-case",
        "description": "should fail validation",
    }
    r = client.post("/api/admin/gaps/demo-mod", json=bad)
    # *** schema validation only happens if jsonschema available; if not, request still 201 ***
    try:
        import jsonschema  # noqa: F401
        assert r.status_code == 400
    except ImportError:
        assert r.status_code in (201, 400)


def test_duplicate_id_rejected(stub_brain):
    from app.main import app
    client = TestClient(app)

    g = {
        "id": "GAP-DUP-001",
        "severity": "low",
        "category": "missing-edge-case",
        "description": "first",
    }
    r = client.post("/api/admin/gaps/demo-mod", json=g)
    assert r.status_code == 201
    r2 = client.post("/api/admin/gaps/demo-mod", json=g)
    assert r2.status_code == 409
