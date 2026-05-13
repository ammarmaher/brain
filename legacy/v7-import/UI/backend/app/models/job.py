# *** Job (Brain/jobs/*.md) models ***

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class Job(BaseModel):
    name: str
    path: str
    status: str = "unknown"  # *** parsed from "## Status" or frontmatter ***
    triggers: List[str] = []
    description: Optional[str] = None


class JobStatus(BaseModel):
    name: str
    status: str
    runId: Optional[str] = None
