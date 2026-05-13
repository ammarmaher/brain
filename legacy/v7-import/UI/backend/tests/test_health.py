# *** Test: GET /api/health returns 200 with the expected keys ***

from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint():
    client = TestClient(app)
    r = client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert "status" in data
    assert "scripts" in data
    assert "kokoroReachable" in data
    assert "voiceSettingsPresent" in data
    assert "keys" in data


def test_root_endpoint():
    client = TestClient(app)
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body.get("app") == "Falcon Brain UI"
