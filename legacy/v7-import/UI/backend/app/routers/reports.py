# *** Reports router — stream master + per-module rollups (xlsx / docx) ***

from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, JSONResponse

from app.auth import require_token
from app.config import Settings
from app.deps import get_settings

router = APIRouter(prefix="/api/reports", tags=["reports"], dependencies=[Depends(require_token)])


# *** Whitelist: only these slugs are addressable. "master" lives in tables/, ***
# *** the 5 module slugs live in L0-summary/per-module/<slug>-rollup-20260501.<ext>. ***
_MODULE_SLUGS = {
    "contact-group",
    "account-management",
    "permissions-authorization",
    "service-subscription",
    "wallet-charging",
}
_ALLOWED_SLUGS = _MODULE_SLUGS | {"master"}

_XLSX_MEDIA = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _resolve(settings: Settings, candidates: list[str]) -> Path | None:
    base = settings.analysis_dir
    for rel in candidates:
        p = (base / rel).resolve()
        try:
            base_resolved = base.resolve()
            if base_resolved not in p.parents and p != base_resolved:
                continue
        except OSError:
            continue
        if p.exists() and p.is_file():
            return p
    return None


def _module_candidates(slug: str, ext: str) -> list[str]:
    # *** Per-module rollups: L0-summary/per-module/<slug>-rollup-20260501.<ext> ***
    return [f"L0-summary/per-module/{slug}-rollup-20260501.{ext}"]


def _master_candidates(ext: str) -> list[str]:
    if ext == "xlsx":
        return ["tables/master.xlsx", "master.xlsx", "tables/Master.xlsx"]
    return ["tables/master.docx", "master.docx", "tables/Master.docx"]


def _expected_path(settings: Settings, slug: str, ext: str) -> Path:
    if slug == "master":
        return settings.analysis_dir / _master_candidates(ext)[0]
    return settings.analysis_dir / _module_candidates(slug, ext)[0]


def _stream(settings: Settings, slug: str, ext: str, media: str) -> FileResponse:
    if slug not in _ALLOWED_SLUGS:
        raise HTTPException(status_code=404, detail="slug not whitelisted")
    candidates = _master_candidates(ext) if slug == "master" else _module_candidates(slug, ext)
    p = _resolve(settings, candidates)
    if p is None:
        return JSONResponse(  # type: ignore[return-value]
            status_code=404,
            content={
                "error": "report not generated",
                "expectedAt": str(_expected_path(settings, slug, ext)),
            },
        )
    return FileResponse(str(p), media_type=media, filename=f"{slug}.{ext}")


# *** Master shortcuts retained for back-compat ***

@router.get("/master.xlsx")
async def master_xlsx(settings: Settings = Depends(get_settings)):
    return _stream(settings, "master", "xlsx", _XLSX_MEDIA)


@router.get("/master.docx")
async def master_docx(settings: Settings = Depends(get_settings)):
    return _stream(settings, "master", "docx", _DOCX_MEDIA)


# *** Wave 1.6: per-module reports (xlsx + docx) ***

@router.get("/{slug}.xlsx")
async def slug_xlsx(slug: str, settings: Settings = Depends(get_settings)):
    if slug == "master":
        return await master_xlsx(settings)
    return _stream(settings, slug, "xlsx", _XLSX_MEDIA)


@router.get("/{slug}.docx")
async def slug_docx(slug: str, settings: Settings = Depends(get_settings)):
    if slug == "master":
        return await master_docx(settings)
    return _stream(settings, slug, "docx", _DOCX_MEDIA)
