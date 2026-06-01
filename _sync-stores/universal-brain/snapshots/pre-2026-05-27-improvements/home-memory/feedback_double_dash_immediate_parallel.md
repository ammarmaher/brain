---
name: "`--` prefix = spawn an agent immediately in parallel"
description: When the user prefixes a message with `--`, spawn a sub-agent to handle that prompt immediately in parallel with any in-flight work, don't queue it
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** When a user message starts with `--` (two leading hyphens), treat it as an urgent side-task. Immediately spawn a sub-agent with that prompt as the brief and keep it running in the background. Do NOT block on whatever else is in flight — `--` means "serve this now, in parallel."

**Why:** The user explicitly stated on 2026-04-19: "if i add -- message you need to create agent to take the prompt and run it directly in parallel if you have tasks and you work on it so serve it immediately if you see -- before the prompt."

**How to apply:**
- Detect any message whose first non-whitespace characters are `--`. Strip the `--` from the actual prompt before passing to the agent.
- Spawn the agent via `Agent` tool with `run_in_background: true`. Use the most relevant specialist agent type; fall back to `general-purpose` if unclear.
- Briefly acknowledge to the user ("Spawned parallel agent for <summary>") — don't narrate the brief contents.
- Continue working on whatever else was in progress. Report both streams when they land.
- Standard rules still apply (no push without permission, orchestrator voice, no UI testing during implementation, etc.) — include them in the spawn brief.
- If multiple `--` messages arrive in quick succession, each gets its own parallel agent.
- The `--` prefix is a trigger, not part of the agent's brief — the agent sees the cleaned prompt only.
