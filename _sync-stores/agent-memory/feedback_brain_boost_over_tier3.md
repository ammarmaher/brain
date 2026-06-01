---
name: feedback-brain-boost-over-tier3
description: "User wants the lightweight local brain-boost tool; explicitly does NOT want the heavy Ollama + Cognee local-LLM path. Default to no-key, standalone tooling for this project."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a13ab809-f2ca-45b9-846b-6c6b827e92ea
---

# Prefer brain-boost (Tier 1+2); drop Ollama + Cognee

After a long activation push, the user said plainly: **"I need just to make a brain boost. I don't want to use Ollama and Cognee."**

**Rule:** For Falcon brain tooling, default to the **lightweight, local, no-key** path — `brain-boost` (transformers.js semantic search + Orama + graphology + sqlite-vec, all in-process Node). Do NOT push the heavy Tier-3 local-LLM stack (Ollama models + Cognee/Graphiti) unless the user explicitly asks for it again.

**Why:** Tier 3 needs a running model server (Ollama) or an API key, is slow/impractical on this CPU-only host (1B fails Cognee's strict schema; 3B times out / is very slow), and builds a *competing* knowledge graph (drift risk vs the curated `falcon-wiki/200-Graph/`). This confirms the original recommendation across the session — Tier 1 `brain-boost` was always the genuinely-useful, zero-risk win. See [[project_brain_boost_libraries_2026_05_28]].

**How to apply:** brain-boost is the wanted deliverable and is **standalone** — it uses its OWN bundled embedder (transformers.js, `Xenova/all-MiniLM-L6-v2`), NOT Ollama — so dropping Ollama/Cognee does not affect it at all. GitNexus (local, npm/MCP) is also fine; Graphiti only mattered with Ollama. Installed-but-unwanted: Ollama + models (~3.5 GB) + the brain-cognee venv — offer to uninstall to reclaim disk, but only on user say-so (destructive).
