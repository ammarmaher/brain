# Brain libraries — install status (2026-05-28)

Built per request to add libraries that improve brain understanding, organization, and skills.
Everything is isolated under `Brain SK/tools/<tool>/` (own deps; Angular workspace untouched).

## Summary

| Tier | Tool | Libraries | Status | Verified |
|---|---|---|---|---|
| 1A | `brain-boost` semantic | @xenova/transformers + @orama/orama | 🟢 WORKING | 0→6 hits incl. `adr:005` |
| 1B | `brain-boost` health | graphology + communities-louvain | 🟢 WORKING | 290 orphans, 238 dangling edges, 320 communities |
| 1C | `brain-boost` lint | gray-matter + remark + zod | 🟢 WORKING | 30/64 skills flagged, 62/62 dossiers complete |
| 2 | `brain-boost` persistence | better-sqlite3 + sqlite-vec | 🟢 WORKING | 533 vectors on disk (1.6 MB), KNN OK |
| 2 | LadybugDB (Kùzu fork) | — | ⚪ DEFERRED | sqlite-vec already covers persistence; Node binding unverified, optional |
| 3 | `brain-cognee` | cognee | ⛔ BLOCKED | needs Python 3.10+ (absent) + LLM key |
| 3 | `brain-graphiti` | graphiti-core + Neo4j | ⛔ BLOCKED | needs Python 3.10+ (absent); Docker present, OpenAI key |
| 3 | `brain-gitnexus` | GitNexus (MCP) | ⛔ BLOCKED + ⚠️ UNVERIFIED | needs Python; exact install command not confirmed from repo |

## What works right now (Node, local, no keys)
```powershell
cd "C:\Falcon\Brain SK\tools\brain-boost"
npm run query -- "how do components and tailwind relate"
npm run health
npm run lint
```

## To unblock Tier 3 (your "everything" choice)
1. `winget install Python.Python.3.11` (one prerequisite unblocks Cognee + Graphiti).
2. `brain-cognee\install.ps1` → set `LLM_API_KEY` → `ingest-brain.py`.
3. `brain-graphiti\install.ps1` (brings up Neo4j via Docker) → set `OPENAI_API_KEY` → `ingest-brain.py`.
4. `brain-gitnexus` — confirm the install command from the GitNexus repo, then register it as an MCP server in Claude Code.

## ⚠️ Standing caveat
Tier 3 (Cognee/Graphiti) build **second, auto-generated graphs** that compete with the
hand-curated `falcon-wiki/200-Graph/`. Per `Brain SK/CLAUDE.md`, do not let them become a
competing source of truth — use them as exploration/augmentation, reconcile back deliberately.
The genuinely-recommended, zero-risk win is Tier 1 (`brain-boost`), which is live now.
