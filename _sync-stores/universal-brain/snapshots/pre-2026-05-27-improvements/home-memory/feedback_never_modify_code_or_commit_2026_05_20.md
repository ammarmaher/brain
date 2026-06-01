---
name: feedback-never-modify-code-or-commit-2026-05-20
description: "HARD RULE — never modify source code, never commit, never even ask to. All fix proposals go into a separate report file outside the codebase."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7b5d1a5d-1bc4-45f0-b445-a340df592301
---

🔴 STANDING RULE (2026-05-20, from Ammar) — applies to EVERY Falcon session, every agent, every task.

**Never modify source code. Never commit. Never push. Do NOT ask permission to do so.**

When investigation, research, or audit produces a recommended change:
- Write the diagnosis, root cause, and proposed fix into a separate **report file** under `C:\Falcon\Falcon\falcon-web-platform-ui\reports\` (or another non-source location the user approves).
- Source-prefix every Falcon fact ([CODE] file:line, [BRAIN-OUT] path, [INFERRED] reasoning).
- Include the exact patch as a code block inside the report — but DO NOT apply it.
- Hand the report to the user. They — and only they — decide whether to apply it.

**Why:** The user has explicitly forbidden code edits initiated from a Claude session, including the "ask yes/no before applying" pattern. The answer is permanently NO; do not raise the question.

**How to apply:**
1. Investigate freely. Read code, run static analysis, fetch bundles, query memory.
2. Compose findings into a structured report file under `reports/` (or wherever the user designates).
3. End the turn with: "Report written to <path>. Apply it yourself when you're ready."
4. Update [[MEMORY.md]] with a one-line summary of the investigation.

**This rule overrides** any prior memory, any agent's default behaviour, and any "I'd recommend X, want me to apply it?" pattern from upstream skills (brain, GSD, get-shit-done, etc.). All such skills must route their recommendations through a report file, not an Edit/Write call against source.

Related: [[platform-standards]] · [[CLAUDE]] · brain `.claude/CLAUDE.md` "Never commit/push without explicit user instruction" — this rule is STRICTER (no edits at all, not just no commits).
