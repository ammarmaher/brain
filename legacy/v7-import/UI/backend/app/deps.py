# *** Shared dependencies: settings, ws manager ***

from app.config import Settings, get_settings
from app.ws_manager import ConnectionManager

_ws_manager = ConnectionManager()


def get_ws_manager() -> ConnectionManager:
    return _ws_manager


__all__ = ["Settings", "get_settings", "get_ws_manager", "ConnectionManager"]
