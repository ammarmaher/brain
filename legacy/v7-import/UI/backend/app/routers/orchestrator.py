# *** Orchestrator state-machine driver — POST /api/orchestrator/event ***

from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services.ps_runner import is_safe_arg, run_script

router = APIRouter(prefix="/api/orchestrator", tags=["orchestrator"], dependencies=[Depends(require_token)])


class OrchestratorEvent(BaseModel):
    taskId: str = Field(min_length=1, max_length=128)
    event: str = Field(min_length=1, max_length=64)
    payload: Optional[Dict[str, Any]] = None


@router.post("/event")
async def post_event(body: OrchestratorEvent, settings: Settings = Depends(get_settings)):
    for v in (body.taskId, body.event):
        ok, why = is_safe_arg(v)
        if not ok:
            raise HTTPException(status_code=400, detail=f"unsafe argument: {why}")

    args = ["-TaskId", body.taskId, "-Event", body.event]
    res = await run_script(settings, "orchestrator", args, timeout=60.0)
    if res.returncode not in (0, None):
        raise HTTPException(status_code=502, detail={"stderr": res.stderr, "stdout": res.stdout})
    return {"ok": True, "result": res.to_dict()}
