# *** Admin router: Brain/jobs/*.md CRUD with archive-on-delete + WS broadcast ***

from __future__ import annotations

import asyncio
import logging
import time
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import require_admin_token
from app.config import Settings
from app.deps import get_settings, get_ws_manager
from app.services import audit, brain_jobs
from app.services.atomic_io import (
    archive_then_remove,
    is_safe_name,
    write_text_atomic,
)
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/admin/jobs",
    tags=["admin", "jobs"],
    dependencies=[Depends(require_admin_token)],
)


class JobCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=200)
    statusLine: str = Field(default="UNKNOWN", min_length=1, max_length=80)
    body: str = Field(default="")


class JobUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    statusLine: Optional[str] = Field(default=None, max_length=80)
    body: Optional[str] = Field(default=None)


# *** Helpers ***

def _job_path(settings: Settings, slug: str) -> Path:
    return settings.jobs_dir / f"{slug}.md"


def _archive_dir(settings: Settings) -> Path:
    return settings.jobs_dir / "_archive"


def _render_template(slug: str, title: str, status_line: str, body: str) -> str:
    body = body or f"_(no body provided)_\n"
    return (
        f"# {title}\n\n"
        f"*** {title} ***\n"
        f"*** Slug: {slug} ***\n"
        f"*** Triggered by: manual ***\n\n"
        f"## Status\n\n"
        f"{status_line}\n\n"
        f"## Body\n\n"
        f"{body}\n"
    )


def _replace_status(text: str, new_status: str) -> str:
    """Replace the first non-empty line under '## Status'."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip().lower().startswith("## status"):
            for j in range(i + 1, len(lines)):
                if lines[j].strip():
                    lines[j] = new_status
                    return "\n".join(lines) + ("\n" if text.endswith("\n") else "")
            # no body — append
            lines.insert(i + 1, "")
            lines.insert(i + 2, new_status)
            return "\n".join(lines) + "\n"
    # no Status heading — append
    return text.rstrip("\n") + f"\n\n## Status\n\n{new_status}\n"


def _replace_title(text: str, new_title: str) -> str:
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("# "):
            lines[i] = f"# {new_title}"
            return "\n".join(lines) + ("\n" if text.endswith("\n") else "")
    return f"# {new_title}\n\n" + text


def _replace_body(text: str, new_body: str) -> str:
    """Replace everything under '## Body' header (or append it)."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip().lower().startswith("## body"):
            keep = lines[: i + 1]
            return "\n".join(keep) + "\n\n" + new_body + ("\n" if not new_body.endswith("\n") else "")
    return text.rstrip("\n") + f"\n\n## Body\n\n{new_body}\n"


async def _broadcast(manager: ConnectionManager, action: str, slug: str) -> None:
    await manager.broadcast(
        {
            "type": "job.crud.changed",
            "source": "admin",
            "payload": {"slug": slug, "action": action},
            "timestamp": time.time(),
        }
    )


# *** Routes ***

@router.get("")
async def list_admin_jobs(settings: Settings = Depends(get_settings)):
    return brain_jobs.list_jobs(settings)


@router.post("", status_code=201)
async def create_job(
    body: JobCreate,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(body.slug, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid slug")
    target = _job_path(settings, body.slug)
    if target.exists():
        raise HTTPException(status_code=409, detail="job already exists")

    text = _render_template(body.slug, body.title, body.statusLine, body.body)
    write_text_atomic(target, text)
    audit.record(settings, actor="admin", action="job.create", target=str(target), after=text[:400])
    await _broadcast(manager, "created", body.slug)
    return {"ok": True, "slug": body.slug, "path": str(target)}


@router.put("/{slug}")
async def update_job(
    slug: str,
    body: JobUpdate,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(slug, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid slug")
    target = _job_path(settings, slug)
    if not target.exists():
        raise HTTPException(status_code=404, detail="job not found")

    before = target.read_text(encoding="utf-8")
    text = before
    if body.title is not None:
        text = _replace_title(text, body.title)
    if body.statusLine is not None:
        text = _replace_status(text, body.statusLine)
    if body.body is not None:
        text = _replace_body(text, body.body)

    if text == before:
        return {"ok": True, "slug": slug, "noop": True}

    write_text_atomic(target, text)
    audit.record(settings, actor="admin", action="job.update", target=str(target), before=before[:400], after=text[:400])
    await _broadcast(manager, "updated", slug)
    return {"ok": True, "slug": slug, "path": str(target)}


@router.delete("/{slug}")
async def delete_job(
    slug: str,
    settings: Settings = Depends(get_settings),
    manager: ConnectionManager = Depends(get_ws_manager),
):
    if not is_safe_name(slug, allow_dot=False):
        raise HTTPException(status_code=400, detail="invalid slug")
    target = _job_path(settings, slug)
    if not target.exists():
        raise HTTPException(status_code=404, detail="job not found")

    before = target.read_text(encoding="utf-8")
    archived = archive_then_remove(target, _archive_dir(settings))
    audit.record(
        settings,
        actor="admin",
        action="job.delete",
        target=str(target),
        before=before[:400],
        extra={"archived": str(archived)} if archived else None,
    )
    await _broadcast(manager, "deleted", slug)
    return {"ok": True, "slug": slug, "archived": str(archived) if archived else None}
