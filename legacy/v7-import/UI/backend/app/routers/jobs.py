# *** Jobs router — list parsed jobs and trigger flip-job-status.ps1 ***

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services import brain_jobs
from app.services.ps_runner import is_safe_arg, run_script

router = APIRouter(prefix="/api/jobs", tags=["jobs"], dependencies=[Depends(require_token)])


class RunJobRequest(BaseModel):
    target: str = Field(default="DONE", min_length=1, max_length=32)


@router.get("")
async def get_jobs(settings: Settings = Depends(get_settings)):
    return brain_jobs.list_jobs(settings)


@router.get("/{name}")
async def get_job(name: str, settings: Settings = Depends(get_settings)):
    try:
        job = brain_jobs.read_job(settings, name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return job


@router.post("/{name}/run")
async def run_job(name: str, body: RunJobRequest, settings: Settings = Depends(get_settings)):
    try:
        job = brain_jobs.read_job(settings, name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if not job:
        raise HTTPException(status_code=404, detail="job not found")

    ok, why = is_safe_arg(body.target)
    if not ok:
        raise HTTPException(status_code=400, detail=f"unsafe target: {why}")

    res = await run_script(
        settings,
        "flip-job-status",
        ["-JobName", name, "-Status", body.target],
        timeout=30.0,
    )
    if res.returncode not in (0, None):
        raise HTTPException(status_code=502, detail={"stderr": res.stderr, "stdout": res.stdout})
    return {"ok": True, "name": name, "result": res.to_dict()}
