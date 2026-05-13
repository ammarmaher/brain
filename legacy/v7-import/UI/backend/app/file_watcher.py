# *** Filesystem watcher: maps Brain/state, /analysis, /jobs changes -> WS events ***
# *** Falls back to a 3s poller if watchdog isn't installed ***

from __future__ import annotations

import asyncio
import logging
import threading
import time
from pathlib import Path
from typing import Optional

from app.config import Settings
from app.ws_manager import ConnectionManager

logger = logging.getLogger(__name__)

try:
    from watchdog.events import FileSystemEventHandler
    from watchdog.observers import Observer

    _HAS_WATCHDOG = True
except Exception:  # pragma: no cover
    _HAS_WATCHDOG = False
    FileSystemEventHandler = object  # type: ignore[assignment]
    Observer = None  # type: ignore[assignment]


def _classify(path: Path, root: Settings) -> Optional[str]:
    """Return a WS event type for a given changed path, or None to ignore."""
    p = path.as_posix().lower()
    state = root.state_dir.as_posix().lower()
    analysis = root.analysis_dir.as_posix().lower()
    jobs = root.jobs_dir.as_posix().lower()

    if p.startswith(state):
        name = path.name.lower()
        if name == "task-state.json":
            return "task.state.changed"
        if name == "progress.json":
            return "task.progress.changed"
        if name.startswith("plan-l"):
            return "task.plan.changed"
        if name.startswith("agent-"):
            return "agent.completed"
        return "task.state.changed"

    if p.startswith(analysis):
        return "analysis.run.appended"

    if p.startswith(jobs):
        return "job.status.changed"

    return None


class _Bridge(FileSystemEventHandler):
    def __init__(self, manager: ConnectionManager, settings: Settings, loop: asyncio.AbstractEventLoop) -> None:
        super().__init__()
        self._manager = manager
        self._settings = settings
        self._loop = loop

    def _emit(self, src_path: str) -> None:
        try:
            p = Path(src_path)
            etype = _classify(p, self._settings)
            if not etype:
                return
            event = {
                "type": etype,
                "source": str(p),
                "payload": {"path": str(p)},
                "timestamp": time.time(),
            }
            asyncio.run_coroutine_threadsafe(self._manager.broadcast(event), self._loop)
        except Exception as exc:  # pragma: no cover
            logger.debug("watcher emit failed: %s", exc)

    def on_modified(self, event):  # type: ignore[no-untyped-def]
        if not getattr(event, "is_directory", False):
            self._emit(event.src_path)

    def on_created(self, event):  # type: ignore[no-untyped-def]
        if not getattr(event, "is_directory", False):
            self._emit(event.src_path)

    def on_moved(self, event):  # type: ignore[no-untyped-def]
        if not getattr(event, "is_directory", False):
            self._emit(getattr(event, "dest_path", event.src_path))


class BrainFileWatcher:
    """Starts/stops watcher across the three Brain dirs."""

    def __init__(self, settings: Settings, manager: ConnectionManager) -> None:
        self._settings = settings
        self._manager = manager
        self._observer = None
        self._poll_thread: Optional[threading.Thread] = None
        self._poll_stop = threading.Event()

    def start(self, loop: asyncio.AbstractEventLoop) -> None:
        targets = [self._settings.state_dir, self._settings.analysis_dir, self._settings.jobs_dir]
        targets = [t for t in targets if t.exists()]
        if not targets:
            logger.warning("Brain dirs not found; watcher idle")
            return

        if _HAS_WATCHDOG and Observer is not None:
            self._observer = Observer()
            handler = _Bridge(self._manager, self._settings, loop)
            for t in targets:
                self._observer.schedule(handler, str(t), recursive=True)
            self._observer.daemon = True
            self._observer.start()
            logger.info("watchdog observer started for %d paths", len(targets))
        else:
            self._poll_thread = threading.Thread(
                target=self._poll_loop, args=(loop, targets), daemon=True, name="brain-poller"
            )
            self._poll_thread.start()
            logger.info("polling fallback started for %d paths", len(targets))

    def stop(self) -> None:
        if self._observer is not None:
            try:
                self._observer.stop()
                self._observer.join(timeout=2)
            except Exception:
                pass
            self._observer = None
        if self._poll_thread is not None:
            self._poll_stop.set()
            self._poll_thread = None

    def _poll_loop(self, loop: asyncio.AbstractEventLoop, targets) -> None:
        seen: dict[str, float] = {}
        # *** prime baseline ***
        for t in targets:
            for f in t.rglob("*"):
                if f.is_file():
                    try:
                        seen[str(f)] = f.stat().st_mtime
                    except OSError:
                        pass
        while not self._poll_stop.is_set():
            time.sleep(3)
            for t in targets:
                if not t.exists():
                    continue
                for f in t.rglob("*"):
                    if not f.is_file():
                        continue
                    try:
                        m = f.stat().st_mtime
                    except OSError:
                        continue
                    prev = seen.get(str(f))
                    if prev is None or m > prev:
                        seen[str(f)] = m
                        etype = _classify(f, self._settings)
                        if etype:
                            event = {
                                "type": etype,
                                "source": str(f),
                                "payload": {"path": str(f)},
                                "timestamp": time.time(),
                            }
                            asyncio.run_coroutine_threadsafe(self._manager.broadcast(event), loop)
