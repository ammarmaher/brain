---
name: project-brain-github-revert-to-26th-2026-05-30
description: The GitHub Brain repo (ammarmaher/brain) was intentionally force-rewound to its 26th state on 2026-05-30; May 29 snapshot preserved on a backup branch.
metadata: 
  node_type: memory
  type: project
  originSessionId: 6a9975e2-08c1-466d-8a9d-92c8176ebe83
---

On **2026-05-30** the user asked to revert "the Brain that is used by GitHub" back to **the 26th**. Done.

**Target repo:** `C:\Falcon\Brain SK` → GitHub `https://github.com/ammarmaher/brain`, branch `main`. This ONE repo contains `outputs/` (brain outcome), `skills/`, `_obsidian/` (the vault), `tools/`, `domains/`, etc. — so reverting it covered "brain outcome, brain skills, the brain, and all vaults" in one shot. (The `falcon-wiki` repo is Azure DevOps, NOT GitHub — excluded. Backend/frontend apps excluded.)

**What "the 26th" resolved to:** No commit was dated the 26th — history jumped **May 24 (`666afa0`) → May 29 (`5a16e9b`)**. So the 26th state = `666afa0` (Wave G V-rule commit). Exactly ONE commit was undone: `5a16e9b` (the 2026-05-29 "snapshot — outputs + obsidian vault + tool source" commit, **2,131 files**).

**How:** hard reset + force-push (user-chosen). Method:
1. Backup first: `git branch backup/pre-revert-2026-05-29 5a16e9b` + tag `pre-revert-snapshot-2026-05-29`, **pushed to GitHub** → snapshot fully recoverable.
2. `git reset --hard 666afa0`.
3. `git push --force-with-lease origin main` → GitHub `main` rewound.

**Verified:** tracked-tree diff vs `666afa0` = EMPTY; local main == origin main == `666afa0`; `origin/backup/pre-revert-2026-05-29` == `5a16e9b`.

**To recover the snapshot if ever needed:** `git -C "C:/Falcon/Brain SK" reset --hard 5a16e9b` (or `origin/backup/pre-revert-2026-05-29`) then force-push.

**NOT cleaned (left as-is):** untracked local artifacts that survived the reset and are NOT brain content / mostly predate the 26th — `.idea/`, `_obsidian.zip`, two nested git worktrees under `outputs/worktrees/` (`falcon-old-ui-main`, `night-shift-token-migration`), and Python venvs/caches under `tools/brain-cognee/.venv/` + `tools/brain-boost/.cache/`. Removing these is destructive (venv rebuild, separate checkouts) — left for explicit user go-ahead.

The discarded uncommitted change was only `_obsidian/.obsidian/graph.json` (Obsidian UI state).
