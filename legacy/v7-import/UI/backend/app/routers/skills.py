# *** Skills router — list brain-skills + Brain/Skill.md + jobs as skill-cards ***

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.models.skill import SkillInfo
from app.services.brain_jobs import list_jobs

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/skills", tags=["skills"], dependencies=[Depends(require_token)])


_TRIGGER_RX = re.compile(r"\bTrigger[s]?:\s*(.+)$", re.IGNORECASE)


def _scan_brain_skills(root: Path) -> List[SkillInfo]:
    out: List[SkillInfo] = []
    if not root.exists():
        return out
    for skill_md in root.rglob("Skill.md"):
        rel = skill_md.relative_to(root)
        parts = rel.parts
        category = parts[0] if len(parts) > 1 else ""
        name = skill_md.parent.name
        triggers: List[str] = []
        description = None
        try:
            text = skill_md.read_text(encoding="utf-8", errors="replace")
            for line in text.splitlines()[:80]:
                m = _TRIGGER_RX.search(line)
                if m:
                    raw = m.group(1).strip()
                    triggers = [t.strip(" `'\"") for t in re.split(r"[,/]| or ", raw) if t.strip()]
                    break
            for line in text.splitlines()[:40]:
                stripped = line.strip()
                if stripped and not stripped.startswith("#") and not stripped.startswith("---"):
                    description = stripped[:200]
                    break
        except Exception as exc:
            logger.debug("skill md parse fail %s: %s", skill_md, exc)
        out.append(
            SkillInfo(
                name=name,
                category=str(category),
                path=str(skill_md),
                triggers=triggers,
                description=description,
            )
        )
    return out


@router.get("")
async def list_skills(settings: Settings = Depends(get_settings)):
    skills_root = settings.brain_skills_root
    skills = _scan_brain_skills(skills_root)

    brain_skill_md = settings.brain_root / "Skill.md"
    if brain_skill_md.exists():
        skills.append(
            SkillInfo(
                name="brain",
                category="orchestrator",
                path=str(brain_skill_md),
                triggers=[],
                description="Top-level Brain orchestrator skill.",
            )
        )

    jobs = list_jobs(settings)
    job_cards = [
        SkillInfo(
            name=j.name,
            category="job",
            path=j.path,
            triggers=j.triggers,
            description=j.description,
        )
        for j in jobs
    ]

    return {"skills": skills, "jobs": job_cards}


# *** Wave 1.6: raw Skill.md body for the named skill ***

def _safe_skill_name(name: str) -> bool:
    return bool(name) and all(ch.isalnum() or ch in ("-", "_", ".") for ch in name)


@router.get("/{name}/md")
async def get_skill_md(name: str, settings: Settings = Depends(get_settings)):
    if not _safe_skill_name(name):
        raise HTTPException(status_code=400, detail="invalid skill name")

    body: str | None = None
    skills = _scan_brain_skills(settings.brain_skills_root)
    match = next((s for s in skills if s.name == name), None)
    if match is None:
        # *** also check the top-level Brain orchestrator skill ***
        if name == "brain":
            top = settings.brain_root / "Skill.md"
            if top.exists():
                body = top.read_text(encoding="utf-8", errors="replace")
    else:
        p = Path(match.path).resolve()
        base = settings.brain_skills_root.resolve()
        if base not in p.parents:
            raise HTTPException(status_code=400, detail="skill path escapes brain-skills root")
        if p.exists():
            body = p.read_text(encoding="utf-8", errors="replace")

    if body is None:
        raise HTTPException(status_code=404, detail="skill md not found")
    return PlainTextResponse(content=body, media_type="text/markdown; charset=utf-8")
