---
name: Proceed with recommendations without re-confirming
description: User wants the agent to act on its own recommendations autonomously rather than asking for step-by-step approval
type: feedback
originSessionId: 67902d27-112b-46a5-ac1e-d7db47e9edfc
---
When the agent presents a recommendation or a phased plan, proceed with it without pausing to ask "should I do this?" at each step.

**Why:** User stated 2026-05-18 "Go always with your recommendations" — after several turns of approving each step ("yes", "ok do your recommendation"). They find the per-step confirmation loop slow and want the agent to keep momentum.

**How to apply:** Once a recommendation or plan is presented and the user has signalled go, execute it end-to-end — including subsequent phases — without re-asking. Still honor the hard safety rules that require explicit per-message permission regardless: never `git commit` / `git push` without "commit"/"push" in the current message; never edit code outside task scope; HALT-AND-FLAG on security/data-integrity ambiguity. Autonomy covers *which work to do next*, not *bypassing those gates*.
