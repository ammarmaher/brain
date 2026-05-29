# brain-graphiti (Tier 3 — temporal knowledge graph for memory)

Graphiti stores facts with **validity intervals** (what was true *when*) — a natural fit
for the Falcon brain's wave history and the xlsx-vs-PRD SoT changes.

## Status: ⛔ BLOCKED — needs Python (Docker is present)

| Requirement | State |
|---|---|
| Python 3.10+ | ❌ absent (`winget install Python.Python.3.11`) |
| Docker (Neo4j backend) | ✅ present (`docker-compose.yml` ships Neo4j 5.26) |
| OpenAI API key | ⚠️ required (Graphiti calls an LLM to extract entities/edges) |
| This tool's code | ✅ scaffolded |

## To make it green
```powershell
winget install Python.Python.3.11
powershell -ExecutionPolicy Bypass -File install.ps1   # venv + pip + docker compose up -d (Neo4j)
# edit .env → OPENAI_API_KEY + NEO4J_PASSWORD
.venv\Scripts\python ingest-brain.py
# inspect graph at http://localhost:7474
```

## ⚠️ Honest caveat
Same *two-brain drift* risk as Cognee — Graphiti maintains its own Neo4j-backed store.
Treat it as a temporal **memory layer** for evolving facts, not a replacement for the
curated `falcon-wiki/200-Graph/` graph. Heaviest of the three Tier-3 tools (Python + LLM + Neo4j).
