# *** FastAPI app factory: routers + WebSocket + CORS + lifespan-managed file watcher ***

from __future__ import annotations

import asyncio
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.deps import get_ws_manager
from app.file_watcher import BrainFileWatcher
from app.routers import (
    admin_agents,
    admin_gaps,
    admin_jobs,
    admin_knowledge,
    admin_memory,
    admin_settings,
    admin_skills,
    admin_tests,
    admin_voice,
    agents,
    chat,
    gaps,
    health,
    jobs,
    knowledge,
    orchestrator,
    plan_gate,
    reports,
    skills,
    tasks,
    tests,
    voice,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("brain-ui")


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    settings = get_settings()
    manager = get_ws_manager()
    watcher = BrainFileWatcher(settings, manager)
    loop = asyncio.get_running_loop()
    watcher.start(loop)
    logger.info(
        "Brain UI backend started: brainRoot=%s authMode=%s",
        settings.brain_root,
        "bearer" if settings.brain_ui_token else "open-dev",
    )
    try:
        yield
    finally:
        watcher.stop()
        logger.info("Brain UI backend stopped")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Falcon Brain UI Backend",
        version="0.1.0",
        description="Wave 1 — read-only views + whitelisted control endpoints over the Falcon Brain.",
        lifespan=_lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:8000"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    app.include_router(health.router)
    app.include_router(tasks.router)
    app.include_router(orchestrator.router)
    app.include_router(plan_gate.router)
    app.include_router(agents.router)
    app.include_router(skills.router)
    app.include_router(jobs.router)
    app.include_router(voice.router)
    app.include_router(chat.router)
    app.include_router(knowledge.router)
    app.include_router(gaps.router)
    app.include_router(tests.router)
    app.include_router(reports.router)
    # *** Wave 1.5 admin routers (CRUD) ***
    app.include_router(admin_jobs.router)
    app.include_router(admin_skills.router)
    app.include_router(admin_voice.router)
    app.include_router(admin_memory.router)
    app.include_router(admin_knowledge.router)
    app.include_router(admin_gaps.router)
    app.include_router(admin_tests.router)
    app.include_router(admin_agents.router)
    app.include_router(admin_settings.router)

    manager = get_ws_manager()

    @app.websocket("/ws")
    async def ws_endpoint(websocket: WebSocket) -> None:
        client = await manager.connect(websocket)
        await websocket.send_json({
            "type": "system.connected",
            "source": "server",
            "payload": {"hint": "send {action:'subscribe', filters:['task.*']} to filter"},
            "timestamp": 0,
        })
        try:
            while True:
                msg = await websocket.receive_text()
                try:
                    data = json.loads(msg)
                except json.JSONDecodeError:
                    await websocket.send_json({"type": "error", "source": "client", "payload": {"reason": "invalid-json"}, "timestamp": 0})
                    continue
                if isinstance(data, dict) and data.get("action") == "subscribe":
                    filters = data.get("filters") or []
                    if isinstance(filters, list):
                        manager.set_filters(client, [str(x) for x in filters])
                        await websocket.send_json({"type": "system.subscribed", "source": "server", "payload": {"filters": filters}, "timestamp": 0})
                elif isinstance(data, dict) and data.get("action") == "ping":
                    await websocket.send_json({"type": "system.pong", "source": "server", "payload": {}, "timestamp": 0})
        except WebSocketDisconnect:
            await manager.disconnect(client)
        except Exception as exc:  # pragma: no cover
            logger.warning("ws error: %s", exc)
            await manager.disconnect(client)

    @app.get("/")
    async def root():
        return {"app": "Falcon Brain UI", "version": app.version}

    return app


app = create_app()
