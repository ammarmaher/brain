# *** Test: parse a stub task-state.json and read it via /api/tasks/{id}/state ***

import json
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    state_dir = brain / "state" / "TASK-TEST-001"
    state_dir.mkdir(parents=True)

    state_payload = {
        "taskId": "TASK-TEST-001",
        "title": "Stub task",
        "currentState": "received",
        "history": [],
        "gates": {
            "l1Approved": True,
            "l2Approved": False,
            "l3Approved": False,
            "scenariosBuilt": False,
            "codeWritten": False,
            "qaPassed": False,
            "pushRequested": False,
            "pushApproved": False,
        },
        "artifacts": {},
        "timestamps": {},
        "blockers": [],
        "notes": ["test stub"],
    }
    (state_dir / "task-state.json").write_text(json.dumps(state_payload), encoding="utf-8")

    progress_payload = {
        "taskId": "TASK-TEST-001",
        "label": "stubbed",
        "percent": 25,
        "step": "stub",
        "totalSteps": 4,
        "etaSeconds": None,
        "updatedAt": "2026-04-30T12:00:00Z",
    }
    (state_dir / "progress.json").write_text(json.dumps(progress_payload), encoding="utf-8")

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)

    # *** Reset cached settings so the patched env is picked up ***
    import app.config as cfg
    cfg._settings = None

    return brain


def test_list_tasks(stub_brain):
    from app.main import app  # *** late import so settings cache is fresh ***
    client = TestClient(app)
    r = client.get("/api/tasks")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    ids = [t["taskId"] for t in items]
    assert "TASK-TEST-001" in ids


def test_get_task_state(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/tasks/TASK-TEST-001/state")
    assert r.status_code == 200
    data = r.json()
    assert data["taskId"] == "TASK-TEST-001"
    assert data["title"] == "Stub task"
    assert data["gates"]["l1Approved"] is True


def test_path_traversal_rejected(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/tasks/..%2F..%2Fetc/state")
    assert r.status_code in (400, 404)
