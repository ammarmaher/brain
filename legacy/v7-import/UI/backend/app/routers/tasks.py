# *** Tasks router — read-only views over Brain/state ***

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services import brain_state

router = APIRouter(prefix="/api/tasks", tags=["tasks"], dependencies=[Depends(require_token)])


@router.get("")
async def list_tasks(settings: Settings = Depends(get_settings)):
    return brain_state.list_tasks(settings)


@router.get("/{task_id}")
async def get_task(task_id: str, settings: Settings = Depends(get_settings)):
    try:
        ts = brain_state.read_task_state(settings, task_id)
        prog = brain_state.read_progress(settings, task_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if ts is None and prog is None:
        raise HTTPException(status_code=404, detail="task not found")
    return {"taskId": task_id, "state": ts, "progress": prog}


@router.get("/{task_id}/state")
async def get_state(task_id: str, settings: Settings = Depends(get_settings)):
    try:
        ts = brain_state.read_task_state(settings, task_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if ts is None:
        raise HTTPException(status_code=404, detail="task-state.json not found")
    return ts


@router.get("/{task_id}/progress")
async def get_progress(task_id: str, settings: Settings = Depends(get_settings)):
    try:
        prog = brain_state.read_progress(settings, task_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if prog is None:
        raise HTTPException(status_code=404, detail="progress.json not found")
    return prog


@router.get("/{task_id}/plan/{layer}")
async def get_plan_layer(task_id: str, layer: str, settings: Settings = Depends(get_settings)):
    try:
        plan = brain_state.read_plan_layer(settings, task_id, layer)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if plan is None:
        raise HTTPException(status_code=404, detail="plan layer not found")
    return plan
