# *** Whitelisted PowerShell runner — only scripts under Brain/scripts allowed ***

from __future__ import annotations

import asyncio
import logging
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

from app.config import Settings

logger = logging.getLogger(__name__)


# *** Allowed script names (stems). NEVER add unknown scripts here. ***
# *** Each value is either a relative filename (resolved under Brain/scripts/) ***
# *** or a tuple (subdir, filename) where subdir is relative to brain_root. ***
ALLOWED_SCRIPTS: Dict[str, Any] = {
    "orchestrator": "orchestrator.ps1",
    "plan-gate": "plan-gate.ps1",
    "progress-set": "progress-set.ps1",
    "progress-show": "progress-show.ps1",
    "ask-chatgpt": "ask-chatgpt.ps1",
    "ask-gemini": "ask-gemini.ps1",
    "play-alert": "play-alert.ps1",
    "play-alert-context": "play-alert-context.ps1",
    "flip-job-status": "flip-job-status.ps1",
    "get-the-task": "get-the-task.ps1",
    "push-approval": "push-approval.ps1",
    # *** apply-settings lives under settings/sound/scripts/, not Brain/scripts/ ***
    "apply-settings": ("settings/sound/scripts", "apply-settings.ps1"),
    # *** Wave 1.6: agent-tts daemon restart helper (lives in Brain/UI/backend/scripts/) ***
    "restart-agent-tts": ("UI/backend/scripts", "restart_agent_tts.ps1"),
}


class PsRunResult:
    def __init__(self, returncode: int, stdout: str, stderr: str):
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr

    def to_dict(self) -> Dict[str, object]:
        return {"returncode": self.returncode, "stdout": self.stdout, "stderr": self.stderr}


def _resolve_powershell() -> Optional[str]:
    for name in ("pwsh", "powershell"):
        p = shutil.which(name)
        if p:
            return p
    return None


def resolve_script(settings: Settings, key: str) -> Path:
    if key not in ALLOWED_SCRIPTS:
        raise ValueError(f"script '{key}' is not on the whitelist")
    entry = ALLOWED_SCRIPTS[key]
    # *** Two whitelist shapes: bare filename -> Brain/scripts/, or (subdir, filename) -> brain_root/<subdir>/ ***
    if isinstance(entry, tuple):
        subdir, filename = entry
        base = (settings.brain_root / subdir).resolve()
        p = (base / filename).resolve()
    else:
        base = settings.scripts_dir.resolve()
        p = (settings.scripts_dir / entry).resolve()
    if base not in p.parents:
        raise ValueError("script path outside whitelisted base")
    if not p.exists():
        raise FileNotFoundError(f"script '{key}' not present at {p}")
    return p


async def run_script(
    settings: Settings,
    key: str,
    args: Optional[List[str]] = None,
    timeout: float = 60.0,
    optional: bool = False,
) -> PsRunResult:
    """Execute a whitelisted PS script. Args are passed verbatim — caller must validate.
    If optional=True and the script file is missing, return rc=126 instead of raising.
    """
    try:
        script = resolve_script(settings, key)
    except FileNotFoundError as exc:
        if optional:
            return PsRunResult(126, "", f"optional script missing: {exc}")
        raise
    pwsh = _resolve_powershell()
    if not pwsh:
        return PsRunResult(127, "", "powershell/pwsh not found on PATH")

    cmd: List[str] = [
        pwsh,
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(script),
    ]
    if args:
        cmd.extend(args)

    logger.info("ps_runner.execute: %s args=%s", script.name, args or [])

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
    except FileNotFoundError as exc:  # pragma: no cover
        return PsRunResult(127, "", f"spawn failed: {exc}")

    try:
        stdout_b, stderr_b = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        try:
            proc.kill()
        except ProcessLookupError:
            pass
        return PsRunResult(124, "", f"timeout after {timeout}s")

    return PsRunResult(
        returncode=proc.returncode if proc.returncode is not None else -1,
        stdout=stdout_b.decode("utf-8", errors="replace"),
        stderr=stderr_b.decode("utf-8", errors="replace"),
    )


def is_safe_arg(value: str) -> Tuple[bool, str]:
    """Reject anything with shell-meta characters or path traversal."""
    if not isinstance(value, str):
        return False, "must be string"
    bad = set("`;|&<>$\n\r\t\"'")
    if any(ch in bad for ch in value):
        return False, "contains shell metacharacters"
    if ".." in value:
        return False, "path traversal"
    return True, ""
