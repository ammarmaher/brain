# *** Wave 1.6: smoke shape tests for the 6 new endpoints ***

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    # *** Mirror the real layout closely enough for the endpoints under test ***
    (brain / "scripts").mkdir(parents=True)
    (brain / "settings" / "sound" / "scripts").mkdir(parents=True)
    (brain / "settings" / "sound" / "voice-samples" / "alerts" / "chatgpt" / "processing").mkdir(parents=True)
    (brain / "assets").mkdir(parents=True)
    (brain / "analysis" / "L2-business").mkdir(parents=True)
    (brain / "analysis" / "L0-summary" / "per-module").mkdir(parents=True)

    # *** brain-skills/<category>/<name>/Skill.md ***
    skills_root = brain.parent / "brain-skills"
    (skills_root / "business-skills" / "domain-glossary").mkdir(parents=True)
    (skills_root / "business-skills" / "domain-glossary" / "Skill.md").write_text(
        "# Domain Glossary Skill\n\nTrigger: domain term\n\nFalcon vocabulary lock.\n",
        encoding="utf-8",
    )

    # *** voice-alerts.json + claims (small flat-array fixture) ***
    (brain / "assets" / "voice-alerts.json").write_text(
        json.dumps(
            {
                "chatgpt": {
                    "processing": ["one", "two"],
                    "finished": ["done one"],
                }
            }
        ),
        encoding="utf-8",
    )
    (brain / "assets" / "voice-alerts-claims.json").write_text(
        json.dumps(
            {
                "_meta": {"phraseCount": 3},
                "chatgpt": {
                    "processing": {"01": {"claims": []}, "02": {"claims": ["tested"]}},
                    "finished": {"01": {"claims": []}},
                },
            }
        ),
        encoding="utf-8",
    )

    # *** apply-settings.ps1 in the new location (just an empty file is fine for resolve check) ***
    (brain / "settings" / "sound" / "scripts" / "apply-settings.ps1").write_text(
        "# stub\n", encoding="utf-8"
    )
    # *** Wave 1.6 helper for daemon restart ***
    backend_scripts = Path(__file__).resolve().parent.parent / "scripts"
    backend_scripts.mkdir(parents=True, exist_ok=True)
    # *** Real script lives there in source; resolve_script only checks path exists ***

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)
    # *** Audit log goes into per-test tmp so we don't leak across tests ***
    audit_log = tmp_path / "audit.log"
    monkeypatch.setenv("BRAIN_UI_AUDIT_LOG", str(audit_log))

    import app.config as cfg
    cfg._settings = None
    return brain


# *** Endpoint 1: GET /api/skills/{name}/md ***

def test_skill_md_returns_markdown(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/skills/domain-glossary/md")
    assert r.status_code == 200, r.text
    assert "Domain Glossary Skill" in r.text
    ct = r.headers.get("content-type", "")
    assert "text/markdown" in ct


def test_skill_md_404_when_missing(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/skills/no-such-skill/md")
    assert r.status_code == 404


def test_skill_md_400_on_bad_name(stub_brain):
    from app.main import app
    client = TestClient(app)
    # *** Path traversal forbidden by safe-name validator ***
    r = client.get("/api/skills/.%2E/md")
    assert r.status_code in (400, 404)


# *** Endpoint 2: GET /api/admin/agents/audit ***

def test_agents_audit_filters_to_agent_actions(stub_brain, tmp_path: Path):
    audit_log = Path(__import__("os").environ["BRAIN_UI_AUDIT_LOG"])
    audit_log.write_text(
        "\n".join(
            [
                json.dumps({"ts": 1.0, "actor": "x", "action": "job.create", "target": "a"}),
                json.dumps({"ts": 2.0, "actor": "admin", "action": "agent.spawn.request", "target": "abc"}),
                json.dumps({"ts": 3.0, "actor": "admin", "action": "agent.stop", "target": "abc"}),
                json.dumps({"ts": 4.0, "actor": "x", "action": "voice.regenerate", "target": "y"}),
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/admin/agents/audit?limit=20")
    assert r.status_code == 200, r.text
    rows = r.json()
    assert isinstance(rows, list)
    assert len(rows) == 2
    actions = {row["action"] for row in rows}
    assert actions == {"agent.spawn.request", "agent.stop"}
    # *** Reverse-chronological: newest first ***
    assert rows[0]["timestamp"] >= rows[-1]["timestamp"]


# *** Endpoint 3: POST /api/admin/voice/restart-daemon ***

def test_restart_daemon_runs_helper_script(stub_brain):
    """Endpoint should resolve + invoke the whitelisted helper script.

    We mock run_script so the real PS1 never fires; we only validate the route
    contract returns the expected shape.
    """
    from app.main import app
    from app.services import ps_runner

    class _FakeRes:
        returncode = 0
        stdout = json.dumps({"stopped": [12345], "started": 67890, "logPath": "x.log", "errPath": "x.err"})
        stderr = ""

        def to_dict(self):
            return {"returncode": self.returncode, "stdout": self.stdout, "stderr": self.stderr}

    async def fake_run_script(settings, key, args=None, timeout=60.0, optional=False):
        assert key == "restart-agent-tts"
        return _FakeRes()

    with patch.object(ps_runner, "run_script", side_effect=fake_run_script):
        # *** Patch the symbol imported into admin_voice via module attribute ***
        with patch("app.routers.admin_voice.run_script", side_effect=fake_run_script, create=True):
            client = TestClient(app)
            r = client.post("/api/admin/voice/restart-daemon")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["stopped"] == [12345]
    assert body["started"] == 67890
    assert body["logPath"] == "x.log"
    assert body["errPath"] == "x.err"
    assert body["rc"] == 0


# *** Endpoint 4: GET /api/admin/knowledge/{module}/{layer}/history(/{filename}) ***

def test_knowledge_history_list_and_detail(stub_brain):
    layer_hist = stub_brain / "analysis" / "L2-business" / "_history"
    layer_hist.mkdir(parents=True)
    (layer_hist / "demo-module-l2-20260501.md").write_text("# old version\n", encoding="utf-8")
    (layer_hist / "other-module-l2-20260430.md").write_text("# unrelated\n", encoding="utf-8")

    from app.main import app
    client = TestClient(app)

    # *** list ***
    r = client.get("/api/admin/knowledge/demo-module/L2-business/history")
    assert r.status_code == 200, r.text
    rows = r.json()
    assert isinstance(rows, list)
    assert len(rows) == 1
    assert rows[0]["filename"] == "demo-module-l2-20260501.md"
    assert rows[0]["sizeBytes"] > 0
    assert "mtime" in rows[0]

    # *** detail ***
    r2 = client.get("/api/admin/knowledge/demo-module/L2-business/history/demo-module-l2-20260501.md")
    assert r2.status_code == 200
    assert "old version" in r2.text
    assert "text/markdown" in r2.headers.get("content-type", "")

    # *** wrong module prefix -> 404 ***
    r3 = client.get("/api/admin/knowledge/demo-module/L2-business/history/other-module-l2-20260430.md")
    assert r3.status_code == 404


# *** Endpoint 5: GET /api/reports/{slug}.xlsx (and .docx) ***

def test_report_per_module_404_with_expected_path(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/reports/contact-group.xlsx")
    assert r.status_code == 404
    body = r.json()
    assert body["error"] == "report not generated"
    assert body["expectedAt"].endswith(
        str(Path("L0-summary/per-module/contact-group-rollup-20260501.xlsx"))
    )


def test_report_per_module_streams_when_present(stub_brain):
    target = stub_brain / "analysis" / "L0-summary" / "per-module" / "contact-group-rollup-20260501.xlsx"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(b"PK\x03\x04stub-xlsx-bytes")

    from app.main import app
    client = TestClient(app)
    r = client.get("/api/reports/contact-group.xlsx")
    assert r.status_code == 200
    assert "spreadsheetml" in r.headers.get("content-type", "")
    assert b"stub-xlsx-bytes" in r.content


def test_report_unknown_slug_404(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/reports/not-a-real-slug.xlsx")
    assert r.status_code == 404


# *** Endpoint 6: GET /api/voice/alerts (flat array shape) ***

def test_voice_alerts_flat_array_shape(stub_brain):
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/voice/alerts")
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body, list), "voice alerts must be a flat array"
    assert len(body) == 3  # *** 2 processing + 1 finished ***
    keys = {"mindset", "category", "index", "text", "claims", "mp3Url"}
    for entry in body:
        assert keys.issubset(entry.keys()), f"missing keys in {entry}"
    # *** Spot-check one phrase ***
    proc02 = next(e for e in body if e["category"] == "processing" and e["index"] == "02")
    assert proc02["text"] == "two"
    assert proc02["claims"] == ["tested"]
    assert proc02["mp3Url"] == "/api/voice/alerts/chatgpt/processing/02"
