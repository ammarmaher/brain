# *** POST /api/plan-gate -> scripts/plan-gate.ps1 ***

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services.ps_runner import is_safe_arg, run_script

router = APIRouter(prefix="/api/plan-gate", tags=["plan-gate"], dependencies=[Depends(require_token)])

_ALLOWED_LAYERS = {"L1", "L2", "L3"}
_ALLOWED_ACTIONS = {"approve", "reject", "request-changes"}


class PlanGateRequest(BaseModel):
    taskId: str = Field(min_length=1, max_length=128)
    layer: str
    action: str
    reason: Optional[str] = None


@router.post("")
async def plan_gate(body: PlanGateRequest, settings: Settings = Depends(get_settings)):
    if body.layer.upper() not in _ALLOWED_LAYERS:
        raise HTTPException(status_code=400, detail=f"layer must be one of {_ALLOWED_LAYERS}")
    if body.action not in _ALLOWED_ACTIONS:
        raise HTTPException(status_code=400, detail=f"action must be one of {_ALLOWED_ACTIONS}")
    for v in (body.taskId, body.layer, body.action):
        ok, why = is_safe_arg(v)
        if not ok:
            raise HTTPException(status_code=400, detail=f"unsafe argument: {why}")

    args = ["-TaskId", body.taskId, "-Layer", body.layer.upper(), "-Action", body.action]
    if body.reason:
        ok, why = is_safe_arg(body.reason)
        if not ok:
            raise HTTPException(status_code=400, detail=f"unsafe reason: {why}")
        args.extend(["-Reason", body.reason])

    res = await run_script(settings, "plan-gate", args, timeout=60.0)
    if res.returncode not in (0, None):
        raise HTTPException(status_code=502, detail={"stderr": res.stderr, "stdout": res.stdout})
    return {"ok": True, "result": res.to_dict()}
