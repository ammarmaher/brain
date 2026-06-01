---
name: Brain Neural-Link — unified search index
description: Phase 1+2 of the Brain neural-link plan — a model-free BM25 search index over all 7 Brain stores
type: project
originSessionId: 67902d27-112b-46a5-ac1e-d7db47e9edfc
---
Falcon Brain "neural-link" upgrade — making the Brain faster + linked. Plan at `Brain/Brain Generated/BRAIN-NEURAL-LINK-PLAN-2026-05-18.md`.

**Why:** The Brain spans 7 stores retrieved by grep/glob — slow and unconnected. Goal: one ranked index any agent can query.

**How to apply:** To search the Brain, run `node brain-search.mjs "<query>"` from `C:/Falcon/Brain SK/scripts/vault-search/`. Rebuild the index after content changes with `node brain-index.mjs`.

**Landed 2026-05-18 (Phase 1+2):**
- `brain-index.mjs` — walks the 7 stores, chunks .md/.txt on headings, writes `Brain/brain-index/index.ndjson`. Skips the `_mounts` junction folder + `.git`/`.obsidian`/`.smart-env` to avoid double-indexing. Excludes the `Brain SK/outputs` robocopy mirror.
- `brain-search.mjs` — BM25 ranked search, identifier-aware tokenizer, source-prefixed results. No model, no network.
- Index: 2,021 files → 25,615 chunks, 17 MB, builds in ~1s. Search is sub-second.
- Both tools live in `C:/Falcon/Brain SK/scripts/vault-search/` (reuse that folder; lexical mode needs no deps).

**BLOCKED — embeddings upgrade:** the original plan used `bge-micro-v2` semantic embeddings. `huggingface.co` is unreachable on this network (HTTP 000) and no ONNX model is cached on disk, so embeddings were dropped for a lexical BM25 index instead. The `index.ndjson` format is forward-compatible — a `vec` field can be added per line once the model is obtainable (download 4 files from huggingface.co/Xenova/bge-micro-v2 into `vault-search/model-cache/Xenova/bge-micro-v2/`, or run the indexer once on an unblocked network).

**Deferred (need user OK):** Phase 3 = collapse the `Brain SK/outputs` robocopy mirror (4,777 files) to a junction — deferred because it deletes a directory; CLAUDE.md's "Additive Output Sync Only" rule means this needs explicit confirmation. Phase 4 = incremental re-index hook on `brain-audit`. Phase 5 = Obsidian graph expansion.
