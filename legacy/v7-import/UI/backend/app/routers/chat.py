# *** Chat router — proxies to ask-chatgpt.ps1 / ask-gemini.ps1; claude=501 ***

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services.ps_runner import is_safe_arg, run_script

router = APIRouter(prefix="/api/chat", tags=["chat"], dependencies=[Depends(require_token)])


class ChatRequest(BaseModel):
    mindset: Literal["chatgpt", "claude", "gemini"]
    prompt: str = Field(min_length=1, max_length=20000)


@router.post("")
async def chat(body: ChatRequest, settings: Settings = Depends(get_settings)):
    if body.mindset == "claude":
        raise HTTPException(
            status_code=501,
            detail="claude mindset is handled by the user's interactive Claude session, not the Brain UI",
        )

    ok, why = is_safe_arg(body.prompt)
    if not ok:
        raise HTTPException(status_code=400, detail=f"unsafe prompt: {why}")

    script_key = "ask-chatgpt" if body.mindset == "chatgpt" else "ask-gemini"
    res = await run_script(settings, script_key, ["-Prompt", body.prompt], timeout=120.0)
    if res.returncode not in (0, None):
        raise HTTPException(status_code=502, detail={"stderr": res.stderr, "stdout": res.stdout})
    return {"mindset": body.mindset, "ok": True, "response": res.stdout, "stderr": res.stderr}
