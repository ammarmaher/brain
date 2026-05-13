# *** Test: admin memory CRUD (create/edit/delete + path traversal + MEMORY.md index) ***

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    (brain / "scripts").mkdir(parents=True)
    mem = tmp_path / "memory"
    mem.mkdir()

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.setenv("BRAIN_MEMORY_DIR", str(mem))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)

    import app.config as cfg
    cfg._settings = None
    return brain, mem


def test_create_edit_delete_memory(stub_brain):
    brain, mem = stub_brain
    from app.main import app
    client = TestClient(app)

    # *** create ***
    r = client.post(
        "/api/admin/memory",
        json={
            "filename": "feedback_demo.md",
            "frontmatter": {"name": "demo", "type": "feedback"},
            "content": "This is the first version.\n",
        },
    )
    assert r.status_code == 201, r.text
    p = mem / "feedback_demo.md"
    assert p.exists()
    text = p.read_text(encoding="utf-8")
    assert "name: demo" in text
    assert "first version" in text

    # *** list contains it ***
    r2 = client.get("/api/admin/memory")
    assert r2.status_code == 200
    files = r2.json()
    assert any(f["filename"] == "feedback_demo.md" for f in files)

    # *** edit ***
    r3 = client.put(
        "/api/admin/memory/feedback_demo.md",
        json={"content": "second version content\n"},
    )
    assert r3.status_code == 200
    assert "second version" in p.read_text(encoding="utf-8")

    # *** delete -> archived ***
    r4 = client.delete("/api/admin/memory/feedback_demo.md")
    assert r4.status_code == 200
    assert not p.exists()
    archived = list((mem / "_archive").glob("feedback_demo-*.md"))
    assert len(archived) == 1


def test_path_traversal_rejected(stub_brain):
    brain, mem = stub_brain
    from app.main import app
    client = TestClient(app)

    r = client.put("/api/admin/memory/..%2Fescape.md", json={"content": "x"})
    assert r.status_code in (400, 404)

    r2 = client.post(
        "/api/admin/memory",
        json={"filename": "../escape.md", "frontmatter": {}, "content": "x"},
    )
    assert r2.status_code == 400

    r3 = client.put("/api/admin/memory/no-extension", json={"content": "x"})
    assert r3.status_code == 400


def test_memory_index_update(stub_brain):
    brain, mem = stub_brain
    from app.main import app
    client = TestClient(app)

    r = client.put(
        "/api/admin/memory/_index",
        json={"content": "# Index\n\n- [demo](demo.md)\n"},
    )
    assert r.status_code == 200
    p = mem / "MEMORY.md"
    assert p.exists()
    assert "[demo]" in p.read_text(encoding="utf-8")
