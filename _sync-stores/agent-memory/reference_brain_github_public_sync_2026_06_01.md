---
name: reference-brain-github-public-sync
description: "Whole Falcon brain syncs to PUBLIC github.com/ammarmaher/brain; how to push/pull; what's excluded (live secrets + bulk)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8d4d4a0d-f028-4347-90ab-4c439bf415d7
---

The entire Falcon brain is published to the **PUBLIC** repo `https://github.com/ammarmaher/brain`
(= local `C:\Falcon\Brain SK`, the canonical brain repo per its README/CLAUDE.md). Set up 2026-06-01, commit `13ba1a1`.

**Aggregated INTO the repo:**
- `outputs/` = additive mirror of `C:\Falcon\Brain Outputs` (excl `worktrees/` + heavy `reports/`)
- `_sync-stores/Brain` ← `C:\Falcon\Brain`; `_sync-stores/universal-brain` ← `C:\Falcon\universal-brain`;
  `_sync-stores/agent-memory` ← `~/.claude/projects/C--Falcon/memory`; `_sync-stores/brain-skills` ← `C:\Falcon\brain-skills`

**Re-sync FROM primary**: run `Brain SK\_sync-stores\push-brain.ps1` (additive robocopy /E /XO + commit + push; never /MIR, never force).
**Restore on ANOTHER machine**: `git clone/pull` then `Brain SK\_sync-stores\pull-brain.ps1` (additive; copies each store back to its canonical path).

**EXCLUDED from the public repo (gitignored) — keep LOCAL only:**
- **Live secrets** (NEVER publish): `**/reference_stitch_api_key.md` (a real GCP/Stitch key `AQ.Ab8…`) +
  `outputs/datasets/Facebook documents/` (scraped Meta API-doc example tokens `CAA…`). GitHub push-protection
  **blocked the first push** on the Stitch key (`GH013`); both are now gitignored. The `brain-sk-portal` publish
  app is also out (holds a Cloudflare deploy token) — carry it over by hand if needed.
- **Bulk/regenerable**: `tools/brain-boost` (~385M), all `**/worktrees/`, `Brain Outputs/reports` (~280M),
  `.venv`, `node_modules`, `.cache`, `.idea`, `_obsidian.zip`, `*.gz`.

**HARD RULE**: repo is PUBLIC → never commit live API keys/tokens/connection strings/private keys. Only local-dev
creds allowed (seed `Admin@1234`, docker `root:example`). `.gitignore` enforces `.env/*.key/*.pem/*.pfx/*token*/
*secret*/*password*` (non-`.md`) + the specific key-store files above. The agent-memory folder name `C--Falcon`
assumes the project is at `C:\Falcon`; adjust the path on a machine where it lives elsewhere.
Related [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].
