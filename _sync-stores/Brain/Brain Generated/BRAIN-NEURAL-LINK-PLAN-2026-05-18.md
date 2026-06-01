# Falcon Brain — Neural-Link Architecture Plan

> Goal (user, 2026-05-18): make the Brain *faster*, have *all knowledge*, and have *all neural networks linked with each other*.
> Status: PLAN — nothing implemented yet. Awaiting "go".
> Author: Adnan orchestrator. Source-prefixed per Brain-First protocol.

---

## 1. Problem statement (measured, not assumed)

`[CODE]` Disk scan 2026-05-18 — the Brain spans 7 stores plus a mirror:

| Store | Path | Files |
|---|---|---|
| Authority Dataset | `Brain Outputs/datasets/authority-dataset` | 3,182 |
| Brain Outputs / Understanding | `Brain Outputs/understanding` | 1,499 |
| Brain Skills | `brain-skills/` | (rule books) |
| Falcon Wiki | `falcon-wiki` | 8,271 |
| Brain SK Obsidian | `Brain SK/_obsidian` | 420 |
| PRD Modules | `PRD/` | 141 |
| Old-UI Dataset | `Brain Outputs/datasets/old-ui-dataset` | 158 |
| **Mirror (not a store)** | `Brain SK/outputs` | **4,777** ← robocopy copy of `Brain Outputs` |

**Three concrete problems:**
1. **Slow / unlinked retrieval.** Every lookup is grep/glob across folders. Nothing is semantically connected — an agent asking "rules about wallet pricing" must already know which of 7 folders to grep. This is the "neural networks not linked" symptom.
2. **Duplication.** `Brain SK/outputs` (4,777 files) is a robocopy mirror of `Brain Outputs`. Any index built today would embed the same fact twice and return both.
3. **Index didn't load.** `MEMORY.md` was 100 KB against a 24 KB limit — the Brain's own table of contents truncated every session. **FIXED 2026-05-18** (now 23 KB) — this plan is lever 0 already done.

`[CODE]` **Asset we can build on:** `Brain SK/scripts/vault-search/vault-search.mjs` already exists — semantic search using `@xenova/transformers` + `bge-micro-v2` embeddings. **Limits:** it only covers `Brain SK/_obsidian`, and it *reads* an embeddings index produced by Obsidian's Smart Connections plugin — it has no indexer of its own. So we *extend*, not rebuild.

---

## 2. The three levers (priority order)

| # | Lever | Solves | Effort |
|---|---|---|---|
| 1 | Unified embeddings index over all 7 stores + query tool | "linked + faster" | ~2-3 days |
| 2 | Collapse the `Brain SK/outputs` robocopy mirror | "all knowledge" without double-counting | ~0.5 day |
| 3 | Make the Obsidian typed graph the retrieval layer | semantic *relations*, not just text similarity | ~1-2 days |

---

## 3. Lever 1 — Unified embeddings index

**Build an indexer + extend the existing query tool. Do NOT rebuild from scratch.**

### 3.1 New: `brain-index.mjs` (the indexer)
- Walks a configured list of store roots (the 7 above, **minus the mirror** — see Lever 2).
- For each `.md` file: split into ~512-token chunks on heading boundaries; embed each chunk with `bge-micro-v2` (same model `vault-search.mjs` already uses — zero new dependency).
- Writes one consolidated index: `Brain/brain-index/index.json` — `{chunkId, storeId, relPath, heading, sourcePrefix, vector}`.
- Records each chunk's **source prefix** (`[CODE]`/`[BRAIN-OUT]`/`[VAULT]`/`[BRAIN-SK]`) so query results stay protocol-compliant.

### 3.2 Extend: `vault-search.mjs` → `brain-search.mjs`
- Point it at `Brain/brain-index/index.json` instead of `.smart-env/multi`.
- Drop the Obsidian Smart-Connections dependency — the new indexer owns the embeddings.
- Output: top-N chunks with `storeId`, `relPath:heading`, cosine score, **and the source prefix** ready to paste.

### 3.3 Re-index hook (keeps it from going stale — the tradeoff fix)
- The Brain already has `brain-audit.ps1` at `authority-dataset/20-brain-maintenance/` and a 67-file scanner.
- Add an **incremental re-index**: on `brain-audit` run (and optionally a `PostToolUse` Write hook), re-embed only files whose mtime changed since `index.json` was written. Incremental keeps it near-instant.
- This is the answer to "embeddings go stale": the existing scanner cadence becomes the re-index cadence.

### 3.4 Agent contract
- One trigger phrase — `brain search <query>` — every Adnan/Ammar agent uses instead of grepping.
- Returns ≤3-hop-compliant results with source prefixes (matches the existing Brain protocol).

---

## 4. Lever 2 — Collapse the robocopy mirror

`[BRAIN-OUT]` `Brain SK/outputs` is an *additive* robocopy (`/E /XO`) of `Brain Outputs` — kept so the Obsidian vault could mount it as `_mounts/brain-outputs`.

- **Decision:** `Brain Outputs` is the canonical SoT. `Brain SK/outputs` becomes a **junction/symlink** to it (or the vault `_mounts/brain-outputs` junction is repointed), so there is exactly one physical copy.
- The indexer (Lever 1) then walks `Brain Outputs` once — no double-embedding of 4,777 files.
- **Risk:** if anything writes to `Brain SK/outputs` directly (not via the robocopy), that content must be reconciled into `Brain Outputs` first. Audit before switching — `HALT-AND-FLAG` if a divergence is found.

---

## 5. Lever 3 — Obsidian graph as the retrieval layer

The `falcon-wiki` vault already has **typed nodes + Dataview knowledge scores** (Pages, Components, Endpoints, Gaps, Questions, Tests). Today agents treat it as flat docs.

- Export the vault's wikilink graph to `Brain/brain-index/graph.json` — `{nodeId, type, edges[], knowledgeScore}`.
- `brain-search.mjs` gains a `--expand` flag: after the embeddings hit, walk 1-2 graph hops to pull *related* typed nodes (a wallet-pricing hit also surfaces the linked Gap + Question + Test).
- This is what turns "text similarity" into "linked neural networks" — embeddings find the entry point, the graph supplies the connections.

---

## 6. Phasing

| Phase | Deliverable | Gate |
|---|---|---|
| **P1** | `brain-index.mjs` indexer + `Brain/brain-index/index.json` (6 stores, mirror excluded) | index builds, spot-check 5 queries |
| **P2** | `brain-search.mjs` query tool + `brain search` trigger wired into agent contract | 10 known-answer queries return correct chunk |
| **P3** | Lever 2 — mirror collapsed to a junction; indexer re-walks clean | no duplicate hits in results |
| **P4** | Re-index hook on `brain-audit` (incremental, mtime-based) | edit a file → next audit re-embeds only it |
| **P5** | Lever 3 — `graph.json` + `--expand` graph-hop | wallet query also surfaces linked Gap/Question |

P1+P2 deliver the headline win (fast semantic retrieval). P3-P5 harden it.

---

## 7. Risks & tradeoffs

- **Staleness** — embeddings drift when files change. *Mitigation:* incremental re-index on the existing audit cadence (P4). Tradeoff accepted: "always fresh" (grep) → "fast + semantic, refreshed on audit".
- **Index size** — ~9,700 unique `.md` files × ~chunks. `bge-micro-v2` is 384-dim; index.json stays well under ~100 MB. Acceptable.
- **Mirror divergence** — Lever 2 must audit `Brain SK/outputs` for direct writes before symlinking. HALT-AND-FLAG on divergence.
- **No new heavy deps** — reuses `@xenova/transformers` + `bge-micro-v2` already vendored in `vault-search/node_modules`. No Python, no cloud API (honors `feedback_no_external_api_dependency`).
- **Scope discipline** — this touches only `Brain/` tooling + the vault mount junction. No app source code. Honors `feedback_strict_task_scope`.

---

## 8. The one-paragraph answer to the user's question

The Brain is already *complete-ish* but *fragmented*. Adding more Atlas volumes makes it bigger, not faster or more linked. The fix is a single embeddings index over the 6 real stores (the 7th is a duplicate mirror — collapse it), queried by extending the `vault-search.mjs` tool that already exists, kept fresh by the `brain-audit` scanner that already exists, and expanded through the Obsidian typed graph that already exists. Every piece is an *extension of something present* — that is why this is ~3-5 days, not a rewrite. Lever 0 (the MEMORY.md index) is already done.

---

*Falcon Brain Neural-Link Plan · 2026-05-18 · Adnan orchestrator · awaiting "go" to start Phase 1.*
