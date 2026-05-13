# *** Test case models — best-effort mapping of test-case.schema.json ***

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class TestCase(BaseModel):
    tcId: str
    module: Optional[str] = None
    title: Optional[str] = None
    priority: Optional[str] = None
    type: Optional[str] = None
    preconditions: List[str] = Field(default_factory=list)
    steps: List[str] = Field(default_factory=list)
    expected: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    extra: Dict[str, Any] = Field(default_factory=dict)
