# *** Test: admin jobs CRUD (create / update / archive-on-delete) ***

from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    (brain / "jobs").mkdir(parents=True)
    (brain / "scripts").mkdir(parents=True)

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)

    import app.config as cfg
    cfg._settings = None
    return brain


def test_create_update_archive_job(stub_brain):
    from app.main import app
    client = TestClient(app)

    slug = "demo-job"

    # *** create ***
    r = client.post("/api/admin/jobs", json={
        "slug": slug,
        "title": "Demo Job",
        "statusLine": "PENDING",
        "body": "## Section\n\nfirst version",
    })
    assert r.status_code == 201, r.text
    jobs_dir = stub_brain / "jobs"
    assert (jobs_dir / f"{slug}.md").exists()

    text1 = (jobs_dir / f"{slug}.md").read_text(encoding="utf-8")
    assert "PENDING" in text1
    assert "Demo Job" in text1

    # *** duplicate create -> 409 ***
    r2 = client.post("/api/admin/jobs", json={
        "slug": slug, "title": "X", "statusLine": "Y", "body": "z",
    })
    assert r2.status_code == 409

    # *** path traversal in slug -> 400 ***
    r3 = client.post("/api/admin/jobs", json={
        "slug": "../escape", "title": "X", "statusLine": "Y", "body": "z",
    })
    assert r3.status_code == 400

    # *** update: change status line ***
    r4 = client.put(f"/api/admin/jobs/{slug}", json={"statusLine": "DONE"})
    assert r4.status_code == 200
    text2 = (jobs_dir / f"{slug}.md").read_text(encoding="utf-8")
    assert "DONE" in text2
    assert "PENDING" not in text2.split("## Status", 1)[1].split("\n\n", 1)[1].split("##", 1)[0]

    # *** delete -> archived ***
    r5 = client.delete(f"/api/admin/jobs/{slug}")
    assert r5.status_code == 200
    assert not (jobs_dir / f"{slug}.md").exists()
    archive_dir = jobs_dir / "_archive"
    archived = list(archive_dir.glob(f"{slug}-*.md"))
    assert len(archived) == 1, "archive copy should be present"
    archived_text = archived[0].read_text(encoding="utf-8")
    assert "Demo Job" in archived_text


def test_audit_log_written_on_create(stub_brain):
    from app.main import app
    client = TestClient(app)

    r = client.post("/api/admin/jobs", json={
        "slug": "audit-job",
        "title": "Audit",
        "statusLine": "OPEN",
        "body": "x",
    })
    assert r.status_code == 201

    # *** audit.log lives next to app/ ***
    audit_log = Path(__file__).resolve().parent.parent / "audit.log"
    assert audit_log.exists()
    lines = [ln for ln in audit_log.read_text(encoding="utf-8").splitlines() if ln.strip()]
    last = json.loads(lines[-1])
    assert last["action"] == "job.create"
    assert "audit-job" in last["target"]
