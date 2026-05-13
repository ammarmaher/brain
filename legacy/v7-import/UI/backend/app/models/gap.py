# *** Gap report models — mirrors gap-report.schema.json best-effort ***

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Gap(BaseModel):
    id: str
    module: Optional[str] = None
    severity: Optional[str] = None
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    affectedServices: List[str] = Field(default_factory=list)
    sourcePath: Optional[str] = None
    extra: Dict[str, Any] = Field(default_factory=dict)
