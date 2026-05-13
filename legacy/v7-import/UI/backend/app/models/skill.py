# *** Skill catalog models ***

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class SkillInfo(BaseModel):
    name: str
    category: str = ""  # *** business / code / design / etc ***
    path: str
    triggers: List[str] = []
    description: Optional[str] = None
