# Brain enhancement — report (2026-05-28)

What each library was used for, its benefit, and the measured before/after for
**brain understanding** and **brain mapping**.

## Per-library report

### Tier 1 + 2 — LIVE and verified (Node, local, no API keys)

| Library | Used for | Benefit (what you got) |
|---|---|---|
| **@xenova/transformers** (transformers.js) | Local sentence embeddings of all nodes + 666 dossiers — model `all-MiniLM-L6-v2`, 384-dim | Meaning-based retrieval with **no API, no cost, no data egress**. The engine behind the understanding lift (6.7% → 73.3%). |
| **@orama/orama** | BM25 full-text index inside the hybrid query | Lexical precision fused with semantic recall — exact terms + meaning in one ranked list. |
| **better-sqlite3** | Embedded SQLite engine hosting the vector store | A durable, server-less local DB — no infra to run. |
| **sqlite-vec** | On-disk KNN over the persisted 533-vector store | Index **survives between runs**; query without re-embedding the corpus; fast KNN. |
| **graphology** | In-memory graph: degree, orphans, connectedness | Quantifies **brain mapping**; surfaced 238 dangling edges + the orphan breakdown; measured 45.6% → 60.0%. |
| **graphology-communities-louvain** | Community detection over the graph | Auto-clusters the brain (320 communities, e.g. the org-hierarchy cluster of 41) — natural groupings with zero hand-curation. |
| **gray-matter** | Parse YAML frontmatter of skills + dossiers | Machine-readable metadata — found **30 of 64 skills** with missing/invalid frontmatter. |
| **remark + remark-frontmatter + unified** | Markdown AST structural lint | Enforces organization (headings present, dossier completeness): 62/62 dossiers complete, 0 headless. |
| **zod** | Schema-validate skill frontmatter (name+description) | Guarantees well-formed skills before they enter the brain. |

### Tier 3 — scaffolded, BLOCKED on Python (not run)

| Library | Intended use | Benefit (when unblocked) | Status |
|---|---|---|---|
| **cognee** | Auto-build a knowledge graph from docs | Less hand-curation of the graph | ⛔ needs Python 3.10+ + LLM key. ⚠️ competing-graph drift risk |
| **graphiti-core** (+ Neo4j) | Temporal knowledge graph (facts over time) | Time-aware memory for the wave/SoT history | ⛔ needs Python; Docker/Neo4j ready. Heaviest option |
| **GitNexus** (MCP) | Code-structure graph for Claude Code | Understands the actual Falcon *source*, not just docs | ⛔ needs Python; install command unverified |

## Before / after — measured, reproducible

### Brain understanding  →  **6.7% → 73.3%**  (+66.6 pts)
- **Metric:** hit-rate over 15 fixed *detail* concept-questions; a hit = the retrieved text actually contains the answer (`npm run measure`).
- **BEFORE (533 nodes only):** 1/15 — node text (id+name+purpose) is too thin to answer "what did the phone field replace?", "can the calendar do ranges?", etc.
- **AFTER (533 nodes + 666 dossiers):** 11/15 — the dossier carrying the answer is retrieved.
- **Honest caveat:** the 4 remaining misses are facts that live only in the long registry/token-map files (truncated at 4 KB). Chunking those would push it higher.

### Brain mapping  →  **45.6% → 60.0%**  (+14.4 pts)
- **Metric:** connectedness = nodes with ≥1 real edge / 533 total (`npm run repair-edges`, confirmed live via `npm run health`).
- **BEFORE:** 243/533 connected (290 orphans).
- **AFTER:** 320/533 connected (213 orphans) — via **122 dangling edges remapped** + **34 orphans wired to their component**, all deterministic (id-parse), written as a reversible wave-delta.
- **Honest caveat:** the 238 dangling edges still exist in the *generated* base `edges.json`; I added corrected edges (additive, governance-safe) rather than hand-editing the SoT. The deeper fix is in the generator `graph/rebuild-brain.js` — flagged as follow-up. Remaining 213 orphans (ValidationRules/PES/DTOs/global tokens) have no deterministic id match — left unwired rather than guessed.

## How to reproduce
```powershell
cd "C:\Falcon\Brain SK\tools\brain-boost"
npm run measure                      # understanding hit-rate (current index)
npm run index -- --dossiers          # rebuild with dossiers
npm run repair-edges                 # mapping before/after + writes the delta
npm run health                       # live orphan/community report
```
Revert the mapping change: delete `falcon-wiki/200-Graph/graph/wave-deltas/edge-repair-2026-05-28.json`.

## Round 2 (2026-05-28) — chunking experiment + generator finding

**Chunking (understanding):** tested splitting dossiers into chunks.
- 1200-char chunks (4086 docs) → **60.0%** (WORSE — precision@5 diluted; the answer chunk competes with many similar fragments).
- 3000-char chunks (1700 chunks, 2233 docs) → **73.3%** (TIES whole-file).
- **Conclusion:** chunking does not beat 73.3% — that is the **ceiling of the all-MiniLM-L6-v2 model + strict probe**, not a corpus gap. Kept 3000-char chunks (equal accuracy, but returns the *specific section* — better real-use granularity). To break 73%, swap to a stronger embedding model (e.g. `bge-base`, or an API model), not more chunking.

**Generator finding (mapping):** the 238 dangling edges originate in `consolidate-graph.js`, which only expands `.nodes`/`.nodes_added` arrays — it does NOT expand the special shapes (ValidationRule/PESRule/etc.) that `query.js` derives. Result: its master is **233 nodes vs query.js's 533** (a split-brain), so edges to the 300 derived nodes look "dangling." A naive prune in the generator would **delete valid edges**. The correct fix = teach `consolidate-graph.js` to expand the special shapes (→ 533-node master), then normalize/prune the genuine remainder. This rewrites the canonical `nodes.json`/`edges.json`, so it is **flagged for explicit approval**, not auto-run. The additive wave-delta (45.6%→60%) already captures the safe win.
