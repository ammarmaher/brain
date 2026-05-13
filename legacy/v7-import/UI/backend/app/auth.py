# *** Bearer token auth. If BRAIN_UI_TOKEN unset, dev mode = allow-all ***
# *** Admin routes require BRAIN_UI_ADMIN_TOKEN; if both tokens unset, allow but log a WARNING ***

import logging
from typing import Optional

from fastapi import Header, HTTPException, status

from app.config import get_settings

logger = logging.getLogger(__name__)
_warned_open_admin = False


async def require_token(authorization: Optional[str] = Header(default=None)) -> None:
    settings = get_settings()
    expected = settings.brain_ui_token

    # *** Dev mode: no token configured -> open access ***
    if not expected:
        return

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    presented = authorization.split(" ", 1)[1].strip()
    if presented != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def require_admin_token(authorization: Optional[str] = Header(default=None)) -> None:
    """Admin mutations require Bearer token even when read-only auth is open.
    Accepts either BRAIN_UI_ADMIN_TOKEN (preferred) or BRAIN_UI_TOKEN.
    If neither configured, allow but log a WARNING once.
    """
    global _warned_open_admin
    settings = get_settings()
    admin_expected = settings.brain_ui_admin_token
    read_expected = settings.brain_ui_token

    if not admin_expected and not read_expected:
        if not _warned_open_admin:
            logger.warning(
                "Admin endpoints OPEN — neither BRAIN_UI_ADMIN_TOKEN nor BRAIN_UI_TOKEN set; mutations unauthenticated"
            )
            _warned_open_admin = True
        return

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token (admin)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    presented = authorization.split(" ", 1)[1].strip()
    accepted = {t for t in (admin_expected, read_expected) if t}
    if presented not in accepted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid bearer token (admin)",
            headers={"WWW-Authenticate": "Bearer"},
        )
