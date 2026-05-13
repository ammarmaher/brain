# *** Agent run models ***

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class AgentRun(BaseModel):
    id: str
    name: str
    taskId: Optional[str] = None
    status: str = "unknown"
    outputDir: Optional[str] = None
    startedAt: Optional[str] = None
    finishedAt: Optional[str] = None


class AgentStatus(BaseModel):
    id: str
    status: str
    pid: Optional[int] = None
