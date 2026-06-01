*** latest restore packet — refreshed 2026-05-27 ***

## Active task
- ID: `brain-setup-trust-assessment-2026-05-27`
- Status: `in_progress`
- Owner: Claude

## Where we are
User asked for an evidence-based description of the brain setup + trust assessment. I walked all 10 brain stores on disk, read the Master Index + VERIFICATION-STATUS.md + CLAUDE.md (project + global), and emitted to the user:
- 10-store inventory table (files + MB).
- 10 advantages and 12 disadvantages, all source-prefixed.
- Per-store trust matrix.
- Overall trust ~7/10.

## What I should NOT do on resume
- Do NOT clobber the existing 5 task-history entries.
- Do NOT modify any Falcon source code (this task is brain-meta only).
- Do NOT git commit anything without explicit user "commit" instruction.

## What I should do on resume
- Wait for user's reaction.
- If user approves: archive `current-task.json` to `task-history/20260527_<HHMMSS>_brain-setup-trust-assessment.md` + clear current-task.
- If user pushes back on any claim: drill into the specific store with more evidence rather than restate.

## Hard standing truths (from session-start hook)
- PES backend gate: 21/21 runtime-verified.
- FE-level UI: blocked on 40+ Stencil/Angular compile errors.
- Q-UM-07 (PRD Sheet Tab 2): blocked on Drive re-export.
- Scanner watches 67 canonical source files.

## Sync repo state
- `C:\falcon-brain-sync\` last commit `1f57664 2026-05-24 Wave G input-layer digit caps`.
- Push at end of session via `sync-from-canonical.ps1 -Push` + `git push`.
