# *** Voice alert models ***

from __future__ import annotations

from typing import List

from pydantic import BaseModel


class VoiceAlert(BaseModel):
    mindset: str
    category: str
    index: str  # *** "01".."10" ***
    path: str
    relUrl: str


class MindsetVoice(BaseModel):
    mindset: str
    categories: List[str] = []
