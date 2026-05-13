# *** Agents router — list known agent runs from Brain/state/<task>/tasks dirs ***

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.models.agent import AgentRun, AgentStatus

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agents", tags=["agents"], dependencies=[Depends(require_token)])


def _safe_id(value: str) -> str:
    cleaned = "".join(c for c in value if c.isalnum() or c in ("-", "_", "."))
    if cleaned != value:
        raise ValueError("invalid id")
    return cleaned


def _scan_task_agents(task_dir: Path) -> List[AgentRun]:
    out: List[AgentRun] = []
    tasks_dir = task_dir / "tasks"
    if not tasks_dir.exists() or not tasks_dir.is_dir():
        return out
    for agent_dir in sorted(p for p in tasks_dir.iterdir() if p.is_dir()):
        status_file = agent_dir / "status.json"
        status = "unknown"
        started_at = None
        finished_at = None
        if status_file.exists():
            try:
                data = json.loads(status_file.read_text(encoding="utf-8"))
                status = str(data.get("status", "unknown"))
                started_at = data.get("startedAt")
                finished_at = data.get("finishedAt")
            except Exception as exc:
                logger.debug("status.json parse failed for %s: %s", agent_dir, exc)
        out.append(
            AgentRun(
                id=f"{task_dir.name}:{agent_dir.name}",
                name=agent_dir.name,
                taskId=task_dir.name,
                status=status,
                outputDir=str(agent_dir),
                startedAt=started_at,
                finishedAt=finished_at,
            )
        )
    return out


@router.get("")
async def list_agents(settings: Settings = Depends(get_settings)):
    if not settings.state_dir.exists():
        return []
    out: List[AgentRun] = []
    for d in sorted(p for p in settings.state_dir.iterdir() if p.is_dir()):
        out.extend(_scan_task_agents(d))
    return out


@router.post("/{agent_id}/stop")
async def stop_agent(agent_id: str):
    try:
        _safe_id(agent_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    # *** Stop is advisory: Wave 1 cannot kill external processes safely. ***
    # *** Wave 2 will integrate with Brain process registry. ***
    return AgentStatus(id=agent_id, status="stop-requested", pid=None)
