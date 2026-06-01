---
name: project-brain-boost-libraries-2026-05-28
description: brain-boost isolated Node tool (Tier 1+2 LIVE) adds semantic search + graph-health + lint + sqlite-vec persistence to the Falcon brain; Tier 3 (cognee/graphiti/gitnexus) scaffolded but BLOCKED on Python. Includes the IPv4 model-download fix and sqlite-vec binding gotchas.
metadata: 
  node_type: memory
  type: project
  originSessionId: a13ab809-f2ca-45b9-846b-6c6b827e92ea
---

# brain-boost + Tier-3 brain libraries (2026-05-28)

Built on user request ("add libraries to improve brain understanding, organization, skills" → chose "everything incl. Tier 3").

**Why:** the brain's BQL search is keyword-only (fuse.js); it missed concepts phrased differently, and the graph had unwired tokens/CSS-vars (orphans). These libraries close those gaps.

**How to apply:** for "what does the brain know about <concept>" or when BQL/`/brain-context` returns 0/weak hits, use the `brain-semantic` skill / `brain-boost` tool below before assuming the brain lacks the knowledge.

## What's LIVE (Tier 1+2) — `C:\Falcon\Brain SK\tools\brain-boost\` (isolated Node, own node_modules)
- **Semantic search** — `@xenova/transformers` (Xenova/all-MiniLM-L6-v2, 384d, local, no API) + `@orama/orama` 3.1.18 (BM25) + own cosine. `npm run index` (533 nodes → `.cache/brain-index.json`, ~3s), `npm run query -- "<text>"` (LEXICAL vs SEMANTIC vs HYBRID). VERIFIED: "how do components and tailwind and shadow dom relate" = LEXICAL 0 hits → SEMANTIC 6 hits incl. `adr:005 Dual-render path (Shadow + Tailwind variants)`.
- **Persistence** — `better-sqlite3` 11.10 + `sqlite-vec` 0.1.9 → `.cache/brain.db` (533 vecs, 1.6 MB). `npm run build-sqlite`, `npm run query-sqlite`.
- **graph-health** — `graphology` + `graphology-communities-louvain`. `npm run health`. Found **290 orphans (54%)** + **238 DANGLING edges** (edges→nonexistent node ids) — stricter than query.js's 213 because query.js auto-creates missing endpoints; mine counts real-node-to-real-node only. Most-connected = `page:organization-hierarchy` deg 42.
- **lint** — `gray-matter` + `remark` + `zod`. `npm run lint`. Found **30 of 64 SKILL.md missing valid name+description frontmatter** (1 invalid YAML: `initial-bootstrap-discovery`); 62/62 component dossiers complete (9 files).
- Skill: `Brain SK/skills/brain-semantic/SKILL.md`. Cross-tool status: `Brain SK/tools/BRAIN-LIBRARIES-STATUS.md`.

## Gotchas (non-obvious, cost real iterations)
- **transformers.js model download fails with ECONNRESET** on this host (IPv6 TLS reset to huggingface.co). FIX = `node --dns-result-order=ipv4first` — baked into all npm scripts + install.ps1. Same root cause as [[infra_ado_ipv6_blocked_use_ipv4]].
- **sqlite-vec inserts**: rowid must be `BigInt(rowid)`, vector must be `Buffer.from(new Float32Array(vec).buffer)` (NOT a JS int + JSON string → "Only integers allowed for primary key"). KNN needs `WHERE embedding MATCH ? AND k = ?` in a CTE (NOT parameterized `LIMIT ?` → "LIMIT or 'k = ?' constraint required").
- Orama 3.x create/insert/search: `await` them (await-safe whether sync or async). Tool uses Orama for BM25 + own cosine for vectors to avoid vector-API drift.
- Windows `python` resolves to the Store-alias stub → install scripts skip `*WindowsApps*` sources when detecting Python.

## Tier 3 — SCAFFOLDED but BLOCKED (honest, not "working")
- `brain-cognee` (cognee) + `brain-graphiti` (graphiti-core + Neo4j via docker-compose) — **BLOCKED: Python 3.10+ not installed** on this host (`winget install Python.Python.3.11`); also need LLM/OpenAI keys. Install scripts gate cleanly + print next steps.
- `brain-gitnexus` (MCP code-graph for Claude Code) — BLOCKED + install command **UNVERIFIED** from repo; README gives the MCP `.mcp.json` integration pattern.
- ⚠️ Cognee/Graphiti build competing auto-graphs → two-brain drift risk vs curated `falcon-wiki/200-Graph/`; use as augmentation, reconcile deliberately (per `Brain SK/CLAUDE.md`).

## Measured before/after (reproducible — `npm run measure` / `npm run repair-edges`)
- **Brain understanding: 6.7% → 73.3%** — depth probe (15 detail concept-Qs, hit = answer keyword in retrieved text). BEFORE = 533 nodes only (thin text). AFTER = +666 dossiers embedded (1199 docs total, index 48s). 4 residual misses = registry/token-map facts truncated at 4KB.
- **Brain mapping: 45.6% → 60.0%** — connectedness (nodes with ≥1 real edge / 533). 122 dangling edges remapped by id-normalization + 34 orphan css-var/tailwind/token wired to their component by id-parse (deterministic, NOT inferred). Emitted as reversible wave-delta `falcon-wiki/200-Graph/graph/wave-deltas/edge-repair-2026-05-28.json` (delete to revert); live loader + query.js pick it up (orphans 290→213, usable edges 253→348).
- **GENERATOR FIX DONE (user-approved):** root cause of danglers = `consolidate-graph.js` only expanded `.nodes` arrays, NOT the special shapes (ValidationRule/PESRule/Kafka/DTO/Role/ADR/BR/Conflict) that `query.js` derives → master was 233 nodes vs query.js 533 (SPLIT-BRAIN); edges to the 300 derived nodes looked dangling; a naive prune would delete VALID edges. FIX: taught `consolidate-graph.js` to expand the same special shapes + derived edges (USES_COMPONENT/PRODUCES_EVENT/CONSUMES_EVENT/REPLACES) then normalize (remap by id-variant)+prune+log. RESULT: master 233→533 nodes, 477 clean edges, 61 remapped, 113 pruned; views converged (orphans 290-vs-213 → 190-vs-187); **mapping 60.0%→64.4%**. Backups `nodes/edges/consolidate-graph.PRE-GENFIX-*`. query.js still healthy (533 nodes/1053 edges/187 orphans).
- Reports: `Brain SK/tools/brain-boost/REPORT.md` (tool) + `Brain Outputs/reports/brain-enhancement-2026-05-28/REPORT.{md,html}` (comprehensive bilingual EN+AR, KPI cards + bars). Understanding ceiling 73.3% = all-MiniLM model limit (swap to bge-base to exceed). 190 orphans remain (standalone vrules/tokens/DTOs — need domain inference, not guessed).

## TIER 3 ACTIVATION (user-approved "activate everything", 2026-05-28 eve)
- **Python 3.11.9** installed via `winget install Python.Python.3.11` (was absent). GOTCHA: winget updates registry PATH but the running shell keeps stale PATH — refresh in-session: `$env:Path=[Environment]::GetEnvironmentVariable('Path','Machine')+';'+[Environment]::GetEnvironmentVariable('Path','User')`. Also skip the WindowsApps `python` Store-stub.
- **GitNexus = FULLY ACTIVE (local, no key).** It's an **npm package** (`npm i -g gitnexus`, v1.6.5), NOT Python — my earlier "needs Python" was wrong. `gitnexus doctor`: graph+full-text available, VECTOR exact-scan (LadybugDB vector disabled on win32), **embeddings local**. `gitnexus analyze . --skip-git` indexed brain-boost (221 symbols/272 edges/11 clusters, 8.4s). Registered project-scoped MCP via `claude mcp add -s project gitnexus -- cmd /c gitnexus mcp` → wrote `C:\Falcon\.mcp.json`. NEEDS Claude Code reload to load. Undo: `claude mcp remove gitnexus`. (npx -y form failed: claude parsed `-y` as its own flag → use global bin not npx.)
- **Cognee** installed (`cognee 1.1.0` in `brain-cognee/.venv`, `import cognee` OK). ⛔ ingest/`cognify` needs `LLM_API_KEY` (or local OpenAI-compat endpoint). pip ground through ConnectionReset(10054) retries but succeeded.
- **Graphiti** installed (`graphiti-core 0.29.1` + neo4j 6.2 driver, `import graphiti_core` OK). ⛔ DOUBLY blocked: (1) `docker pull neo4j:5.26` failed 3× with CDN `EOF` (persistent host network issue, same family as HF/IPv6 resets) — Neo4j backend can't start; (2) needs `OPENAI_API_KEY`. Alt backend FalkorDB/Kuzu dodges Neo4j but key still required.
- **Irreducible blockers (need USER):** API keys for cognee/graphiti (paid + data-egress — opposite of Tier-1 local ethos) and a working Neo4j image pull. Everything installable was installed+import-verified. Activation report: `Brain Outputs/reports/brain-enhancement-2026-05-28/ACTIVATION.md`.

NO COMMITS — all in working tree awaiting user review. (Exception: `winget` installed Python system-wide; `npm i -g gitnexus` global; `C:\Falcon\.mcp.json` created — these are environment changes, not git commits.)
