# brain-cognee (Tier 3 — auto knowledge-graph from docs)

Cognee ingests the Falcon brain dossiers and **auto-extracts** an entity/relationship
graph + vector memory (GraphRAG-style), reducing hand-curation of the graph.

## Status: ⛔ BLOCKED — needs Python (not installed on this host, 2026-05-28)

| Requirement | State |
|---|---|
| Python 3.10+ | ❌ absent (`winget install Python.Python.3.11`) |
| LLM + embedding API key | ⚠️ required (OpenAI etc.) — Cognee calls an LLM to extract relations |
| This tool's code | ✅ scaffolded (install.ps1 + ingest-brain.py) |

## To make it green
```powershell
winget install Python.Python.3.11
powershell -ExecutionPolicy Bypass -File install.ps1   # creates .venv, pip installs cognee
# edit .env → set LLM_API_KEY
.venv\Scripts\python ingest-brain.py
```

## ⚠️ Honest caveat (from the prior analysis)
Cognee builds a **second, auto-generated** knowledge graph that **competes** with the
hand-curated Falcon graph in `falcon-wiki/200-Graph/`. That is the *two-brain drift*
risk flagged earlier and warned against in `Brain SK/CLAUDE.md` ("Obsidian must never
become a competing source of truth"). Use it as an *exploration/augmentation* layer,
not a replacement — and reconcile its output back into the curated graph deliberately.
