# *** Test: every admin mutation appends one line to audit.log ***

from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    (brain / "jobs").mkdir(parents=True)
    (brain / "settings" / "sound").mkdir(parents=True)
    (brain / "scripts").mkdir(parents=True)

    (brain / "settings" / "sound" / "settings.json").write_text(
        json.dumps({
            "global": {"speed": 1.0, "volumeMultiplier": 1.0},
            "skills": {"existing-skill": {"voice": "bm_george", "speed": 1.0, "volumeMultiplier": 1.0, "phrases": {}, "triggers": [], "beep": []}},
            "mindsets": {"chatgpt": {"voice": "bm_george", "speed": 1.0, "volumeMultiplier": 1.0}},
        }),
        encoding="utf-8",
    )

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)

    import app.config as cfg
    cfg._settings = None

    # *** clear audit log so the line count is precise ***
    audit_log = Path(__file__).resolve().parent.parent / "audit.log"
    if audit_log.exists():
        audit_log.unlink()

    return brain


def _audit_lines() -> list[dict]:
    p = Path(__file__).resolve().parent.parent / "audit.log"
    if not p.exists():
        return []
    out = []
    for ln in p.read_text(encoding="utf-8").splitlines():
        if not ln.strip():
            continue
        out.append(json.loads(ln))
    return out


def test_each_mutation_appends_one_line(stub_brain):
    from app.main import app
    client = TestClient(app)

    base_lines = len(_audit_lines())

    # *** 1) job create ***
    r = client.post("/api/admin/jobs", json={
        "slug": "audit-demo",
        "title": "demo",
        "statusLine": "OPEN",
        "body": "x",
    })
    assert r.status_code == 201
    assert len(_audit_lines()) == base_lines + 1

    # *** 2) skill update (full settings.json round-trip) ***
    r2 = client.put(
        "/api/admin/skills/existing-skill",
        json={"voice": "bm_lewis", "speed": 1.0, "volumeMultiplier": 1.0,
              "phrases": {}, "triggers": [], "beep": []},
    )
    assert r2.status_code == 200
    assert len(_audit_lines()) == base_lines + 2

    # *** 3) job delete ***
    r3 = client.delete("/api/admin/jobs/audit-demo")
    assert r3.status_code == 200
    lines = _audit_lines()
    assert len(lines) == base_lines + 3

    actions = {ln["action"] for ln in lines[base_lines:]}
    assert "job.create" in actions
    assert "skills.put" in actions
    assert "job.delete" in actions
    for ln in lines[base_lines:]:
        assert "ts" in ln
        assert "actor" in ln
        assert "target" in ln
