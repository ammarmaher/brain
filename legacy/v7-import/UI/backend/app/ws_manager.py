# *** WebSocket connection manager + broadcast with optional filters ***

from __future__ import annotations

import asyncio
import fnmatch
from dataclasses import dataclass, field
from typing import Any, Dict, List, Set

from fastapi import WebSocket


@dataclass
class _Client:
    ws: WebSocket
    filters: Set[str] = field(default_factory=set)


class ConnectionManager:
    def __init__(self) -> None:
        self._clients: List[_Client] = []
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket) -> _Client:
        await ws.accept()
        client = _Client(ws=ws)
        async with self._lock:
            self._clients.append(client)
        return client

    async def disconnect(self, client: _Client) -> None:
        async with self._lock:
            if client in self._clients:
                self._clients.remove(client)

    def set_filters(self, client: _Client, patterns: List[str]) -> None:
        client.filters = set(p for p in patterns if isinstance(p, str))

    def _matches(self, client: _Client, event_type: str) -> bool:
        if not client.filters:
            return True
        return any(fnmatch.fnmatch(event_type, p) for p in client.filters)

    async def broadcast(self, event: Dict[str, Any]) -> None:
        event_type = str(event.get("type", ""))
        async with self._lock:
            targets = list(self._clients)

        dead: List[_Client] = []
        for client in targets:
            if not self._matches(client, event_type):
                continue
            try:
                await client.ws.send_json(event)
            except Exception:
                dead.append(client)

        if dead:
            async with self._lock:
                for c in dead:
                    if c in self._clients:
                        self._clients.remove(c)

    @property
    def count(self) -> int:
        return len(self._clients)
