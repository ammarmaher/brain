# *** WebSocket event envelope ***

from __future__ import annotations

import time
from typing import Any, Dict, Literal

from pydantic import BaseModel, Field

WsEventType = Literal[
    "task.state.changed",
    "task.progress.changed",
    "task.plan.changed",
    "agent.started",
    "agent.completed",
    "agent.failed",
    "voice.played",
    "job.status.changed",
    "gap.added",
    "analysis.run.appended",
]


class WsEvent(BaseModel):
    type: str
    source: str = ""
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: float = Field(default_factory=lambda: time.time())
