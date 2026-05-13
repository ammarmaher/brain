# *** Knowledge router — modules + analysis tree browser ***

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings
from app.services import brain_analysis

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"], dependencies=[Depends(require_token)])


@router.get("/modules")
async def list_modules(settings: Settings = Depends(get_settings)):
    return brain_analysis.list_modules(settings)


@router.get("/modules/{slug}")
async def get_module(slug: str, settings: Settings = Depends(get_settings)):
    try:
        m = brain_analysis.read_module(settings, slug)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if not m:
        raise HTTPException(status_code=404, detail="module not found")
    return m


@router.get("/files")
async def list_files(layer: Optional[str] = Query(default=None), settings: Settings = Depends(get_settings)):
    try:
        return brain_analysis.browse_files(settings, layer)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/index")
async def get_index(settings: Settings = Depends(get_settings)):
    idx = brain_analysis.read_index(settings)
    if idx is None:
        raise HTTPException(status_code=404, detail="analysis/index.json not present")
    return idx
