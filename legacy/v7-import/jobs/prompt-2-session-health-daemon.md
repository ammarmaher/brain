*** Job: prompt-2-session-health-daemon ***
*** Async Python daemon that watches session usage, creates checkpoints/backups/restore-packets ***
*** Depends on: prompt-1-brain-structure (run that first) ***
*** Triggered by: "night mode: prompt 2" / "build the brain daemon" / "run prompt 2" ***

# Job: Prompt 2 — Session Health Monitor (Python async daemon)

## Status

DONE (2026-05-01). Depends on Prompt 1's folder structure.

## Pre-approved design (verbatim user requirements)

### Goal
Async Python background process that monitors session health, watches context usage if available, creates checkpoints, creates restore packets, and protects work before Claude session becomes too full.

Name: **check-session-health**

### Environment
- OS: Windows
- Language: Python
- Async (asyncio)
- Must NOT block Claude Code
- Must NOT slow main system
- Clear logs
- Fail safely if session usage data is unavailable

### Files to create

```
brain/scripts/session_health_daemon.py
brain/scripts/backup_state.py
brain/scripts/restore_state.py
brain/scripts/start_brain.ps1
```

## Behavior requirements

### `session_health_daemon.py`
- asyncio loop
- Check every 60s
- Read `brain/state/session-health.json`
- Document where to wire official Claude Code statusline data
- If usage data missing: log warning, continue
- Never crash on missing files
- Create missing folders/files if safe
- Logs → `brain/logs/brain-daemon.log`

### Threshold rules

| Usage | Action |
|---|---|
| < 80% | Log normal status |
| ≥ 80% | Warning checkpoint + `sessionHealthWarning` alert text |
| ≥ 90% | Safety backup + update `last-safe-checkpoint.md` + `sessionBackupCreated` alert text |
| ≥ 95% | Create/update `latest-restore-packet.md` + mark `session-state.json` `resetRecommended: true` + `sessionResetNeeded` alert text. Do NOT force-close Claude. |

### `backup_state.py`
Callable manually OR by daemon. Reads `current-task.json`, `progress-log.md`, `session-state.json`. Writes timestamped checkpoint under `brain/backups/` as `YYYYMMDD_HHMMSS_checkpoint.md`. Updates `latest-restore-packet.md`.

### `restore_state.py`
Reads `latest-restore-packet.md`. Prints clean continuation summary. Does NOT modify source code.

### `start_brain.ps1`
- Check Python is available
- Check required folders exist
- Create missing brain files if needed
- Start `session_health_daemon.py` in background
- Avoid duplicate daemon processes
- Write startup log

### Logging format
`[2026-04-30 10:30:00] [INFO] [session-health] Context usage: 82%. Warning checkpoint created.`

### Config block at top of Python
```python
CHECK_INTERVAL_SECONDS = 60
WARNING_THRESHOLD = 80
BACKUP_THRESHOLD = 90
RESET_THRESHOLD = 95
```

### Safety
- No file deletion
- No app source-code modification
- No commits
- No admin privileges unless necessary
- If something cannot be detected, log it and continue safely

### Documentation
Update `brain/README.md` with:
- How to run the daemon manually
- How to stop it
- How to check logs
- How to simulate high context usage (`session-health.json` example below)
- How to test backup creation
- How to restore from latest restore packet

Example `session-health.json`:
```json
{ "contextUsagePercent": 85, "source": "manual-test", "updatedAt": "2026-04-30T10:30:00" }
```

## Acceptance criteria
- Daemon runs without blocking
- Missing files do not crash
- 80% → warning checkpoint
- 90% → safety backup
- 95% → restore packet + reset flag
- Logs are clear
- Works on Windows

## Boundaries
- Do NOT touch Falcon services or `C:\falcon\Brain\` voice system.
- Do NOT install Python dependencies the user hasn't approved (use stdlib only — `asyncio`, `json`, `pathlib`, `logging`, `datetime`, `os`, `sys`).
- Do NOT auto-start; require explicit user activation via `start_brain.ps1` or Task Scheduler.
- Do NOT commit or push.
