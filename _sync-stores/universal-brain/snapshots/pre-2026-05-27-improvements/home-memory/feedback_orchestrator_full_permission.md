---
name: feedback_orchestrator_full_permission
description: User grants Adnan full orchestrator authority for the Brain pipeline buildout — autonomous execution of pre-approved job specs, parallel agent spawning, file moves, structure changes; standing guardrails (no commit/push without explicit "yes", no UI testing during impl, strict task scope outside Brain) still apply
type: feedback
originSessionId: d3af8013-16e8-4cfc-8f3e-ebdbdb861247
---
The user has granted Adnan **full orchestrator permission** to manage and execute the Brain pipeline buildout autonomously, including:

- Spawning multiple parallel sub-agents (`Task` calls with `run_in_background:true`) for independent phases
- Moving folders and rewriting cross-file path references
- Creating new files/folders inside `C:\falcon\brain-skills\Brain\`, `C:\falcon\Brain\`, `.claude\skills\brain\`, and `brain\` (project-relative)
- Updating `CLAUDE.md`, memory notes, and skill specs
- Editing PowerShell scripts that drive the voice/render system
- Composing pre-approved job specs in `Brain\jobs\` and executing them under night-mode triggers

**Why:** The user wants forward motion without per-step approval pings. They want this big buildout shipped in waves, not blocked on micro-questions.

**How to apply:**

1. **Standing guardrails still apply** (these override the grant):
   - Never `git commit` without explicit "commit" from user.
   - Never `git push` without explicit "push" from user.
   - Never run dev-serve / browser preview / UI tests during implementation.
   - Stay strictly inside `Brain\`, `brain-skills\Brain\`, `.claude\skills\brain\`, `brain\`, and the memory folder. Do NOT edit Falcon service code, gateways, frontend apps, or infra unless a job spec explicitly authorizes it.
   - No secrets in chat. No new auth flows. No deletion of files outside the explicit move targets.
   - When a job is destructive (folder move, rename), do COPY-then-verify-then-delete, not raw move. Have rollback ready.
2. **Parallelism rule**: phases that do not share files run in parallel via background agents. Phases that share files run sequentially.
3. **Voice prompt for push**: when a job reaches push-state, emit a voice + 880Hz beep prompt: "Boss, I want to push the code. Confirm?" and wait for explicit "yes". On yes: write a curated commit message + test-comment block crediting Claude/Gemini/ChatGPT contributions.
4. **Status truthfulness** (links to [feedback_brain_skill.md](feedback_brain_skill.md) and the deferred [context-aware-alerts](C:\falcon\brain-skills\Brain\jobs\context-aware-alerts.md) job): never play a voice phrase that claims "tests passed" / "validated" / "reviewed" when those states are not actually true.
5. **Progress streaming**: while long jobs run, surface 60-second progress updates via Monitor. Do not silently grind.
6. **Granted on**: 2026-04-30 by user. Permission is durable across sessions but can be revoked by user at any time with a phrase like "stop being orchestrator" / "drop the orchestrator hat".
