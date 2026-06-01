# Restore the Falcon Brain on another machine

This repo (`https://github.com/ammarmaher/brain`) is the **single GitHub home for the whole Falcon
brain**. It carries the Brain SK skill repo at the root **plus** snapshots of the other brain stores
that normally live elsewhere on disk, under [`_sync-stores/`](_sync-stores/).

> **Snapshot model.** The `_sync-stores/` folders and the `outputs/` mirror are point-in-time copies
> pushed from the primary laptop. They are *additive* — re-running the sync refreshes them, never
> deletes. After cloning, you copy each store back to the path the brain expects (below).
>
> **Public repo.** This repository is public. It contains internal Falcon knowledge plus local-dev
> credentials only (`Admin@1234` seed user, the docker-compose `root:example` Mongo default). No live
> API keys, OAuth/Zitadel client secrets, private keys, or production connection strings are committed
> (`.gitignore` blocks `.env`, `*.key`, `*.pem`, `*.pfx`, `*token*`, `*secret*`, `*password*` non-`.md`).

## What is in this repo

| Repo path | What it is | Restore target on a new machine |
|---|---|---|
| *(repo root)* | Brain SK skill repo (`skills/`, `domains/`, `protocols/`, `_obsidian/`, `CLAUDE.md`, …) | `C:\Falcon\Brain SK\` (the clone itself) |
| `outputs/` | Mirror of **Brain Outputs** (authority datasets, understanding, component-registry, prd, …). Excludes `worktrees/` and the heavy `reports/` asset tree. | `C:\Falcon\Brain Outputs\` |
| `_sync-stores/Brain/` | The Falcon tri-mindset **Brain** (`brain-index/`, `obsidian/`, `Brain Generated/`) | `C:\Falcon\Brain\` |
| `_sync-stores/universal-brain/` | Universal session-state brain (`state/`, `backups/`, `snapshots/`, `hooks/`) | `C:\Falcon\universal-brain\` |
| `_sync-stores/agent-memory/` | Claude Code persistent agent memory (`MEMORY.md` + topic files + `backups/`) | `%USERPROFILE%\.claude\projects\C--Falcon\memory\` |
| `_sync-stores/brain-skills/` | `brain-skills/code-skills/` | `C:\Falcon\brain-skills\` |

### Deliberately NOT in this repo (regenerable / machine-specific / large)
`tools/brain-boost` (~385M), `tools/brain-cognee`, `tools/brain-graphiti`, `tools/web-scrub`,
`outputs/worktrees/` (~135M) and `Brain Outputs/worktrees/` (~188M git checkouts),
`Brain Outputs/reports/` (~280M generated dashboards), `.venv/`, `node_modules/`, `.cache/`, `.idea/`,
`_obsidian.zip`, and the `brain-sk-portal` publishing app (it holds a deploy token — sync it separately
if you need it).

## One-shot restore on the new machine

```powershell
# 1. Get the repo
$root = "C:\Falcon\Brain SK"
if (Test-Path "$root\.git") { git -C $root pull } else { git clone https://github.com/ammarmaher/brain $root }

# 2. Run the bundled restore helper (additive only — never deletes local files)
& "$root\_sync-stores\pull-brain.ps1"
```

`pull-brain.ps1` copies each store from the clone back to its canonical path with `robocopy /E /XO`
(additive, only-newer). Re-run any time after `git pull` to refresh.

## Re-sync FROM the primary laptop (push the latest up)

```powershell
& "C:\Falcon\Brain SK\_sync-stores\push-brain.ps1"
```

This re-runs the additive robocopy from the live stores into the repo, then stages, commits, and pushes.
It never uses `/MIR` or `/PURGE` and never force-pushes.

---
*Generated 2026-06-01. Update `_sync-stores/` and `outputs/` by running `push-brain.ps1`.*
