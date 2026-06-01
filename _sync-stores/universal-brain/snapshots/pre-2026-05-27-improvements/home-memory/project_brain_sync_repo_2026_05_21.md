---
name: project-brain-sync-repo-2026-05-21
description: Portable agent-brain sync repo at C:\falcon-brain-sync + GitHub private remote falcon-brain-sync. Mirrors 4 brain dirs across devices via robocopy.
metadata: 
  node_type: memory
  type: project
  originSessionId: ff92bcd8-5433-4ad2-ad91-4fcf51b69152
---

# Brain Sync Repo — Portable "Mind" Across Devices

## What

A dedicated git repo that snapshots the **agent brain** so the same "mind"
can be cloned to a second device and resumed. Created 2026-05-21 when user
asked: *"Push yourself in Git so I can sync from another device."*

**Local path:** `C:\falcon-brain-sync\`
**Remote:** `https://github.com/ammarmaher/falcon-brain-sync` (PRIVATE)
**Initial commit:** `64df5e1` (4,756 files / 840,845 lines / ~85 MB packed)
**Branch:** `main`

## Why a separate repo (not `git init` in C:\Falcon)?

`C:\Falcon\` contains many unrelated product repos (`falcon-web-platform-ui`,
`falcon-core-commerce-svc`, etc.) — each has its own remote. Initializing git
at the parent would entangle the brain with code, blow past push limits, and
fight `.gitignore` conflicts. Dedicated sync repo isolates brain state from
product code.

## What's mirrored

| Repo subfolder    | Canonical location                                          |
| ----------------- | ----------------------------------------------------------- |
| `home-memory/`    | `C:\Users\User\.claude\projects\C--Falcon\memory\`          |
| `universal-brain/`| `C:\Falcon\universal-brain\`                                |
| `Brain/`          | `C:\Falcon\Brain\`                                          |
| `Brain-Outputs/`  | `C:\Falcon\Brain Outputs\`                                  |

## What's NOT mirrored (`.gitignore`)

- Secrets — `*.credentials.json`, `*.env`, `*.pem`, `*.key`, `*.pfx`, `*.pat`
- Git worktrees — `Brain-Outputs/worktrees/` (188 MB of embedded git repos —
  `falcon-old-ui-main`, `night-shift-token-migration`)
- Build artifacts — `node_modules/`, `bin/`, `obj/`, `*.dll`, `*.pdb`, `*.exe`
- Runtime locks — `daemon.lock`, `*.lock`, `*.pid`
- OS junk — `Thumbs.db`, `.DS_Store`, `Desktop.ini`

Dev seed passwords (`Admin@1234`, `Falcon@2026!`) intentionally kept —
local-backend-only test credentials, documented in MEMORY.md.

## Bidirectional sync — `sync-from-canonical.ps1`

Located at repo root. Uses `robocopy /MIR` (mirror, not merge).

- `.\sync-from-canonical.ps1 -Push` → canonical → repo subfolders
  (run **before** `git add` to capture latest live brain state)
- `.\sync-from-canonical.ps1 -Pull` → repo subfolders → canonical
  (run **after** `git pull` on a new device to spread the brain)
- `.\sync-from-canonical.ps1 -Push -DryRun` → preview without writing

**Important:** the script hardcodes `C:\Users\User\.claude\...` for home-memory.
If onboarding a device with a different Windows username, edit the first entry
of `$Pairs` in the script to match the actual home path.

## Daily rhythm

| When                  | Command                                                              |
| --------------------- | -------------------------------------------------------------------- |
| End of session (PC A) | `cd C:\falcon-brain-sync; .\sync-from-canonical.ps1 -Push`           |
|                       | `git add -A; git commit -m "Brain snapshot YYYY-MM-DD"; git push`    |
| Start of session (PC B)| `cd C:\falcon-brain-sync; git pull`                                 |
|                       | `.\sync-from-canonical.ps1 -Pull`                                    |

## Onboarding a brand-new device

```powershell
# Prerequisites: Git for Windows, Claude Code
git clone https://github.com/ammarmaher/falcon-brain-sync.git C:\falcon-brain-sync
cd C:\falcon-brain-sync
.\sync-from-canonical.ps1 -Pull
# Open Claude Code in C:\Falcon — brain skill auto-loads
```

## Conflict policy

`robocopy /MIR` mirrors, doesn't merge. If two devices edit memory in parallel:

1. `git pull` reports merge conflicts in `.md` files.
2. Resolve in the repo subfolder (plain text).
3. `.\sync-from-canonical.ps1 -Pull` to spread the resolved version to canonical.

The README at repo root documents this — ships with the clone.

## Why this matters

Without this, "the brain" lives only on one Windows host. With it, the agent's
memory, task state, and knowledge bases are version-controlled and portable
across machines. A fresh PC + `git clone` + `-Pull` reproduces the same mind.

## Git config baked into the repo

- `user.email = ammarMaher_jo@hotmail.com`
- `user.name = Ammar Maher`
- `core.autocrlf = false` (Windows line-ending preservation)
- `core.longpaths = true` (Windows MAX_PATH workaround for deep brain paths)

## Source-prefix

[CODE] `C:\falcon-brain-sync\sync-from-canonical.ps1` — sync script
[CODE] `C:\falcon-brain-sync\.gitignore` — exclusion list
[CODE] `C:\falcon-brain-sync\README.md` — onboarding doc shipped with repo
