---
name: brain-semantic
description: Semantic + hybrid search over the Falcon knowledge graph using local embeddings (transformers.js) + Orama + sqlite-vec. Use when keyword/BQL search misses concepts phrased differently (e.g. "how do components and Tailwind relate" → dual-render ADR). Also runs graph-health (orphans/communities) and brain-lint (dossier/skill structure).
---

# brain-semantic — meaning-based brain retrieval

The BQL keyword search (`query.js`) matches tokens; it misses concepts phrased differently.
This skill adds **semantic retrieval** over the same 533-node graph using a local embedding
model (no API, data stays on-machine), plus graph-health and structure-lint.

Tool: `C:\Falcon\Brain SK\tools\brain-boost\` (isolated node_modules).

## When to use
- A `/brain-context` or BQL query returns 0 / weak hits but you know the brain has related knowledge.
- "what does the brain know about X" where X is a concept, not an exact node id.
- You want to audit graph health (orphans, dangling edges, communities) or skill/dossier organization.

## How to run
```powershell
cd "C:\Falcon\Brain SK\tools\brain-boost"
# one-time: powershell -ExecutionPolicy Bypass -File install.ps1
npm run index                                   # (re)build the semantic index after graph changes
npm run query -- "how do components and tailwind relate"   # lexical vs semantic vs hybrid
npm run query-sqlite -- "shadow dom dual render"           # KNN from the persisted store
npm run health                                  # orphans + most-connected + communities
npm run lint                                    # dossier completeness + skill frontmatter
```

## Source-prefix discipline
Results are `[BRAIN-OUT]` (graph nodes from `falcon-wiki/200-Graph/`). The semantic *ranking*
is `[INFERRED]` (embedding similarity) — cite the matched node's own evidence for facts, not the
similarity score.

## Maintenance
Re-run `npm run index` (and `npm run build-sqlite`) after the graph is rebuilt
(`graph/rebuild-brain.js`) so embeddings stay in sync with the curated nodes.
