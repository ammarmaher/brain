---
name: Don't push for ChatGPT/Gemini API keys — Claude + local files is enough for business deep-diving
description: User explicitly corrected the night-shift framing 2026-05-18. External AI APIs are not needed; the aim is continuous deeper mining of business knowledge using existing tools.
type: feedback
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
**Don't frame anything as "blocked on keys.env" or push the user to provide ChatGPT/Gemini API keys.**

**Why:** User said 2026-05-18: *"Don't drop keys. Always keep the keys, and your aim just to deep dive more and more in business. Don't drop keys. And why do we need to drop keys to deep dive into the business?"*

The user's goal is continuous business deep-diving — pricing, business rules, edge cases, cross-module scenarios, regulatory context, customer journeys, risk analysis. None of that requires external AI APIs. Claude + the local PRD modules + backend dossiers + the authority dataset are sufficient.

**How to apply:**
- Never present Wave 1 (Drive sync) or Wave 10 (ChatGPT/Gemini strategy) as priority unlocks.
- Treat ChatGPT/Gemini integration as a "nice-to-have" optional path, not the dependency that gates business knowledge.
- The forever-wave mining loop should be self-sufficient: Claude as the analyst, the vault as the source.
- When generating morning briefs / priority lists, lead with what to do in business meetings, not what to provision in infrastructure.
- When proposing new waves, default to "deeper business analysis" rather than "external strategy pass."

**Concrete re-orientation for the existing run:**
- Wave 1 PRD Drive sync: deferred — only run when user explicitly asks for a re-sync.
- Wave 10 ChatGPT/Gemini strategy: deferred — only run when user explicitly asks.
- Replace those with continuous deep-dives: cross-module scenarios, customer journeys, risk catalog, pricing models, SAMA/CITC compliance mapping, etc.
