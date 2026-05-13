# *** Read Brain/jobs/*.md headers + Status section ***

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import List

from app.config import Settings
from app.models.job import Job

logger = logging.getLogger(__name__)


_BANNER = re.compile(r"^\*\*\*\s*(.*?)\s*\*\*\*\s*$")
_TRIGGER = re.compile(r"Triggered by:\s*(.+)$", re.IGNORECASE)
_STATUS_HEADING = re.compile(r"^##\s+Status\b", re.IGNORECASE)


def _parse_one(path: Path) -> Job:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        logger.warning("cannot read job %s: %s", path, exc)
        return Job(name=path.stem, path=str(path), status="error")

    lines = text.splitlines()
    description = None
    triggers: List[str] = []
    status = "unknown"

    # *** banner triplet at top: title / description / triggers ***
    banner_idx = 0
    for i, line in enumerate(lines[:8]):
        m = _BANNER.match(line.strip())
        if not m:
            continue
        body = m.group(1)
        if banner_idx == 0:
            pass  # *** title banner ***
        elif banner_idx == 1:
            description = body
        elif banner_idx == 2:
            tm = _TRIGGER.search(body)
            if tm:
                raw = tm.group(1).strip().strip('"').strip("'")
                triggers = [t.strip().strip('"').strip("'") for t in re.split(r"[/,]", raw) if t.strip()]
        banner_idx += 1
        if banner_idx >= 3:
            break
        _ = i

    # *** find "## Status" then take next non-empty line ***
    for i, line in enumerate(lines):
        if _STATUS_HEADING.match(line.strip()):
            for j in range(i + 1, min(i + 10, len(lines))):
                cand = lines[j].strip()
                if cand:
                    cand = cand.rstrip(".").strip()
                    status = cand.split(" ")[0].upper()
                    break
            break

    return Job(
        name=path.stem,
        path=str(path),
        status=status,
        triggers=triggers,
        description=description,
    )


def list_jobs(settings: Settings) -> List[Job]:
    jobs_dir = settings.jobs_dir
    if not jobs_dir.exists():
        return []
    return [_parse_one(p) for p in sorted(jobs_dir.glob("*.md"))]


def read_job(settings: Settings, name: str) -> Job | None:
    safe = "".join(c for c in name if c.isalnum() or c in ("-", "_"))
    if safe != name:
        raise ValueError("invalid job name")
    p = settings.jobs_dir / f"{safe}.md"
    if not p.exists():
        return None
    return _parse_one(p)
