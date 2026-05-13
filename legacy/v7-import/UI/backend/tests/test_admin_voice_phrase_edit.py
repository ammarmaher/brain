# *** Test: admin voice phrase editor (text + claims update) + Kokoro mock ***

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def stub_brain(tmp_path: Path, monkeypatch):
    brain = tmp_path / "Brain"
    (brain / "assets").mkdir(parents=True)
    (brain / "settings" / "sound" / "voice-samples" / "alerts" / "chatgpt" / "processing").mkdir(parents=True)
    (brain / "scripts").mkdir(parents=True)

    alerts = {
        "chatgpt": {"processing": ["old phrase one", "old phrase two", "old phrase three"]},
    }
    claims = {
        "_meta": {"phraseCount": 3},
        "chatgpt": {"processing": {"01": {"claims": []}, "02": {"claims": []}, "03": {"claims": []}}},
    }
    (brain / "assets" / "voice-alerts.json").write_text(json.dumps(alerts), encoding="utf-8")
    (brain / "assets" / "voice-alerts-claims.json").write_text(json.dumps(claims), encoding="utf-8")
    (brain / "settings" / "sound" / "settings.json").write_text(
        json.dumps({
            "global": {"speed": 1.0, "volumeMultiplier": 1.0, "model": "kokoro"},
            "agentTts": {"fallbackVoice": "bm_george"},
            "mindsets": {"chatgpt": {"voice": "bm_george", "speed": 1.0, "volumeMultiplier": 1.0}},
        }),
        encoding="utf-8",
    )

    monkeypatch.setenv("BRAIN_ROOT", str(brain))
    monkeypatch.delenv("BRAIN_UI_TOKEN", raising=False)
    monkeypatch.delenv("BRAIN_UI_ADMIN_TOKEN", raising=False)

    import app.config as cfg
    cfg._settings = None
    return brain


def test_phrase_text_and_claims_update(stub_brain):
    from app.main import app
    client = TestClient(app)

    r = client.put(
        "/api/admin/voice/phrases/chatgpt/processing/02",
        json={"text": "the new phrase", "claims": ["tested", "approved"]},
    )
    assert r.status_code == 200, r.text

    alerts_p = stub_brain / "assets" / "voice-alerts.json"
    claims_p = stub_brain / "assets" / "voice-alerts-claims.json"
    alerts = json.loads(alerts_p.read_text(encoding="utf-8"))
    claims = json.loads(claims_p.read_text(encoding="utf-8"))

    assert alerts["chatgpt"]["processing"][1] == "the new phrase"
    assert alerts["chatgpt"]["processing"][0] == "old phrase one"
    assert claims["chatgpt"]["processing"]["02"]["claims"] == ["tested", "approved"]


def test_phrase_index_out_of_range(stub_brain):
    from app.main import app
    client = TestClient(app)

    r = client.put(
        "/api/admin/voice/phrases/chatgpt/processing/99",
        json={"text": "boom"},
    )
    assert r.status_code == 400


def test_regenerate_calls_kokoro(stub_brain):
    from app.main import app

    captured = {}

    def fake_post(url, payload, timeout):
        captured["url"] = url
        captured["payload"] = payload
        return b"\xff\xfb\x90\x00fake-mp3-bytes"

    with patch("app.routers.admin_voice._post_kokoro", side_effect=fake_post):
        client = TestClient(app)
        r = client.post("/api/admin/voice/regenerate/chatgpt/processing/01")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["bytes"] > 0

    assert "/audio/speech" in captured["url"]
    assert captured["payload"]["voice"] == "bm_george"
    assert captured["payload"]["input"] == "old phrase one"
    out = stub_brain / "settings" / "sound" / "voice-samples" / "alerts" / "chatgpt" / "processing" / "01.mp3"
    assert out.exists()
