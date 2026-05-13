*** Job: prompt-1-brain-structure ***
*** Universal session-state Brain skill at .claude\skills\brain\ + brain\ (project-relative) ***
*** Triggered by: "night mode: prompt 1" / "build the brain skill" / "run prompt 1" ***

# Job: Prompt 1 — Brain Structure + Skill (Universal, Session-State)

## Status

DONE (2026-05-01).

## Pre-approved design (verbatim user requirements)

### Goal
Every Claude session has a persistent brain that stores task state, progress, decisions, restore points, and session rules. Claude does NOT depend only on chat context — important info is saved to files so a new session can continue safely.

### Environment
- OS: Windows
- Tool: Claude Code
- Uses Claude Skills (progressive disclosure: SKILL.md is index, not a giant file)
- Supports coding, planning, QA, prompt polishing, business analysis, project continuation
- Safe, clean, no app-source-code modification unless explicitly needed

### Hard rules
- Do not rewrite the app.
- Do not modify unrelated files.
- Do not hardcode secrets.
- Do not assume Claude remembers after reset.
- Store persistent state in files.
- Keep SKILL.md short — use references/assets/templates for details.
- Follow Claude Code skill best practices and project memory.

## Folder structure to create

```
.claude/
  CLAUDE.md
  skills/
    brain/
      SKILL.md
      README.md
      references/
        brain-rules.md
        session-health-rules.md
        task-lifecycle.md
        restore-rules.md
        coding-rules.md
        qa-rules.md
        prompt-polishing-rules.md
      templates/
        task-state-template.json
        restore-packet-template.md
        task-start-template.md
        task-finish-template.md
        qa-review-template.md
        implementation-prompt-template.md
      assets/
        voice-alerts.md

brain/
  state/
    current-task.json
    session-state.json
    session-health.json
    progress-log.md
    last-safe-checkpoint.md
    task-history/
  backups/
    latest-restore-packet.md
  logs/
    brain-daemon.log
  README.md
```

## Required content per file

### 1. `.claude/CLAUDE.md`
Short global instructions:
- Always check the brain before starting a task.
- If `brain/state/current-task.json` has an active task, read the latest restore packet.
- Create a new task state when starting a new task.
- Update progress after each major phase.
- Before risky changes, create a checkpoint.
- At the end of a task, update task history and create a final summary.

### 2. `.claude/skills/brain/SKILL.md`
Frontmatter (`name`, `description`) + sections:
- when to use this skill
- core rules
- task lifecycle
- required outputs
- references to files under `references/`, `templates/`, `assets/`

### 3. `brain/state/current-task.json`
Default JSON structure with fields:
`taskId, title, status, startedAt, updatedAt, goal, taskType, affectedAreas, plan, completedSteps, currentStep, nextStep, risks, blockers, commandsRun, verificationStatus, filesChanged, lastCheckpointPath`

### 4. `brain/state/progress-log.md`
Sections: Current Task, Timeline, Decisions, Risks, Next Step, Verification.

### 5. `brain/backups/latest-restore-packet.md`
Template with:
- Current task summary
- What was completed
- What is in progress
- Files touched
- Commands run
- Risks
- Blockers
- Exact next step
- What not to change
- Instructions for the next Claude session

### 6. `assets/voice-alerts.md`
Categorized RTS-commander alert text for:
`taskReceived, deepAnalysis, processing, deployment, testing, finished, blocked, waitingForInput, sessionHealthWarning, sessionBackupCreated, sessionResetNeeded, sessionRestored`

NO real audio configured yet. Text/context only.

### 7. `brain/README.md`
Documents: what the brain is, how Claude uses it, how to start/continue/checkpoint/restore/finish a task, best practices.

## Acceptance criteria
- Folder structure exists.
- Skill is clean, not overloaded.
- Brain state files are valid JSON / valid markdown.
- A new Claude session can continue from saved files.
- System does not rely only on chat memory.

## Boundaries (out of scope for this job)
- Do NOT touch any Falcon service / app source code.
- Do NOT touch `C:\falcon\Brain\` (Falcon-specific tri-mindset Brain — different scope).
- Do NOT install Python dependencies, write daemons, or implement Windows startup (those are Prompt 2/3).
- Do NOT commit or push.
