# *** Read/parse Brain/state/<task-id>/ task files (read-only) ***

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Iterable, List, Optional

from app.config import Settings
from app.models.task import PlanLayer, ProgressSnapshot, Task, TaskState

logger = logging.getLogger(__name__)


def _safe_task_id(task_id: str) -> str:
    """Reject any path traversal in task ids; allow alnum, dashes, underscore, dot."""
    if not task_id:
        raise ValueError("task id is required")
    cleaned = "".join(ch for ch in task_id if ch.isalnum() or ch in ("-", "_", "."))
    if cleaned != task_id or ".." in task_id or "/" in task_id or "\\" in task_id:
        raise ValueError("invalid task id")
    return cleaned


def list_task_dirs(settings: Settings) -> Iterable[Path]:
    state = settings.state_dir
    if not state.exists():
        return []
    return [p for p in state.iterdir() if p.is_dir() and p.name not in ("templates", "task-history")]


def list_tasks(settings: Settings) -> List[Task]:
    out: List[Task] = []
    for d in list_task_dirs(settings):
        ts = read_task_state(settings, d.name)
        prog = read_progress(settings, d.name)
        out.append(
            Task(
                taskId=d.name,
                title=ts.title if ts else "",
                currentState=ts.currentState if ts else "received",
                progressPercent=prog.percent if prog else 0,
                progressLabel=prog.label if prog else "",
                cardPath=str(d / "task-card.md") if (d / "task-card.md").exists() else None,
            )
        )
    return out


def read_task_state(settings: Settings, task_id: str) -> Optional[TaskState]:
    tid = _safe_task_id(task_id)
    p = settings.state_dir / tid / "task-state.json"
    if not p.exists():
        return None
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
        # *** ensure task id present ***
        data.setdefault("taskId", tid)
        return TaskState.model_validate(data)
    except Exception as exc:
        logger.warning("failed to parse task-state for %s: %s", tid, exc)
        return None


def read_progress(settings: Settings, task_id: str) -> Optional[ProgressSnapshot]:
    tid = _safe_task_id(task_id)
    p = settings.state_dir / tid / "progress.json"
    if not p.exists():
        return None
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("taskId", tid)
        return ProgressSnapshot.model_validate(data)
    except Exception as exc:
        logger.warning("failed to parse progress for %s: %s", tid, exc)
        return None


def read_plan_layer(settings: Settings, task_id: str, layer: str) -> Optional[PlanLayer]:
    tid = _safe_task_id(task_id)
    layer_clean = layer.upper().lstrip("L")
    if layer_clean not in {"1", "2", "3"}:
        raise ValueError("layer must be L1, L2 or L3")
    p = settings.state_dir / tid / f"plan-l{layer_clean}.md"
    if not p.exists():
        return None
    return PlanLayer(
        taskId=tid,
        layer=f"L{layer_clean}",
        path=str(p),
        content=p.read_text(encoding="utf-8", errors="replace"),
    )
