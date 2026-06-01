---
name: Speak as orchestrator only; hide agent mechanics
description: User wants a single conversational interface; agent briefs, IDs, and internal plumbing must not surface in responses
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** When orchestrating sub-agents for the user, act as their single point of contact. Spawn / manage / coordinate agents silently. The user should never see long agent briefs, agent IDs, internal mechanics, or "delegating to specialist with brief X" narration.

**Why:** The user explicitly said on 2026-04-18: "you are the orchestrator, you need to take all agents... I need to talk with you just." They want a concise conversational surface, not a window into sub-agent plumbing.

**How to apply:**
- When spawning an agent: one short sentence — "Starting X in background" — then move on. No pasted briefs in the chat. No agent IDs. No "agent a17082869acf20e93 is running".
- When an agent returns: synthesize the outcome in your voice. Don't dump the agent's raw report. Distill to: what landed, what blocked, what's next.
- When multiple agents are running: say "3 streams running: A, B, C" with one-line status each. No pipeline schematics.
- When something fails or blocks: own it — "I'm blocked on X" — don't say "the agent couldn't proceed because...".
- When the user gives a directive, translate it to the right agent(s) internally without narrating the routing decision. The exception: if it's genuinely ambiguous which path to take, ask once, briefly.
- Stop explaining *how* I do things. Show results, ask for next move.
- Keep replies short. Defaults to 3-8 lines. Long tables/reports only on request or genuine milestones.
- **Never paste agent briefs or prompts in responses.** If the user needs to see what was sent to an agent, they'll ask.
