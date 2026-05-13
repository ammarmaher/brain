*** Job: prompt-3-brain-integration ***
*** Integrate Brain startup, task lifecycle, and auto-continuation into the Claude Code workflow ***
*** Depends on: prompt-1-brain-structure + prompt-2-session-health-daemon ***
*** Triggered by: "night mode: prompt 3" / "wire up the brain" / "run prompt 3" ***

# Job: Prompt 3 — Brain Integration (Startup + Task Lifecycle + Auto-Continuation)

## Status

DONE (2026-05-01). Depends on Prompts 1 and 2.

## Pre-approved design (verbatim user requirements)

### Goal
Every Claude Code session has the Brain active. Every task has saved state. After session reset, Claude continues from latest restore packet. After each task, the system updates and prepares for the next task.

### Environment
- OS: Windows
- Existing Brain structure (Prompt 1) and Python daemon (Prompt 2) already created
- Reliable, not noisy, not harmful to project

### Hard rules
- Do not depend only on conversation memory.
- Do not force a new session for every tiny task.
- Do not modify unrelated source code.
- Do not slow the workflow.
- Use files as source of truth.
- If hooks supported: use them carefully. Else: document manual commands.

## Tasks to implement

### 1. Update `.claude/CLAUDE.md` with Brain Lifecycle section

**Before any task:**
- Check `brain/state/current-task.json`
- If status is `in_progress`: read `brain/backups/latest-restore-packet.md`
- Ask whether to continue ONLY if there is a real conflict
- If no active task: create a new task state
- Add `taskReceived` voice alert context
- Create a short plan before implementation

**During task:**
- Update `progress-log.md` after each major phase
- Update `current-task.json` `currentStep` and `nextStep`
- Create checkpoint before risky edits
- Create checkpoint before major commands
- Use session health rules

**Before testing:**
- Add `testing` voice alert context
- Record test plan
- Run tests/lint/build when safe

**After finishing:**
- Update status to `completed`
- Save final summary
- Move/copy task info to `brain/state/task-history/`
- Create final checkpoint
- Add `finished` voice alert context
- Clear or archive `current-task.json` only after history saved

**If blocked:**
- Update status to `blocked`
- Write the blocker clearly
- Add `blocked` voice alert context
- Write the exact user input needed

### 2. Slash command docs under `.claude/commands/`

Create:
- `.claude/commands/start-brain.md`
- `.claude/commands/new-task.md`
- `.claude/commands/check-session-health.md`
- `.claude/commands/save-session-state.md`
- `.claude/commands/restore-session-state.md`
- `.claude/commands/finish-task.md`

Each command file: purpose, when to use, files to read, files to update, expected output.

### 3. New task strategy
- New major task = new task state.
- Small follow-up = continue same task.
- Unrelated topic = archive current and start new.
- 90% usage = prepare backup.
- 95% usage = create restore packet, recommend reset.
- After reset = read latest restore packet and continue from exact next step.

### 4. Windows startup instructions in `brain/README.md`

How to:
- Open Task Scheduler
- Create a basic task
- Trigger at logon
- Run PowerShell pointing to `brain/scripts/start_brain.ps1`
- Confirm daemon started
- Check `brain/logs/brain-daemon.log`

Do not require admin unless needed.

### 5. Session restore workflow

In `brain/backups/latest-restore-packet.md` add:

> # New Session Continuation Prompt
>
> When a new Claude session starts, use:
>
> "Load the AI Brain. Read `brain/backups/latest-restore-packet.md`, `brain/state/current-task.json`, and `brain/state/progress-log.md`. Continue from the exact next step. Do not restart from scratch unless task state is invalid."

### 6. Voice alert integration text

Update `assets/voice-alerts.md`:
- Voice alerts are text-only by default.
- If TTS is configured later, lines pass to TTS engine.
- Use short alerts, not long paragraphs.
- Do not interrupt critical workflow.
- Use `processing` only if task active several minutes.
- Use `finished` only after checkpoint and verification summary.

### 7. Task history format

`brain/state/task-history/` filename: `YYYYMMDD_HHMMSS_task-title.md`

Each completed task history: Title, Task ID, Goal, Started, Finished, Summary, Files changed, Commands run, Tests/verification, Risks, Follow-ups, Final restore note.

### 8. Best-practice safeguards
- Never run destructive commands without checkpoint.
- Never delete brain backups automatically.
- Never hide blockers.
- Never claim tests passed if not run.
- Never continue from memory when saved state exists.
- Never create huge logs.
- Keep restore packets concise.
- Keep `current-task.json` valid JSON.

### 9. Final documentation

Update `brain/README.md` with full workflow:
A. First-time setup
B. Starting the brain
C. Starting a new task
D. Continuing an existing task
E. Monitoring session health
F. Creating a checkpoint
G. Restoring after reset
H. Finishing a task
I. Troubleshooting

## Acceptance criteria
- Every new task has state.
- Every major phase updates progress.
- Reset can continue from saved restore packet.
- Windows startup is documented.
- Voice alert contexts are categorized and ready for TTS.
- Workflow is not noisy or slow.
- Claude follows brain rules without touching unrelated app code.

## Boundaries
- Do NOT touch Falcon source code.
- Do NOT modify `C:\falcon\Brain\` voice system.
- Do NOT auto-commit/push.
- Do NOT install global hooks without explicit user approval.
