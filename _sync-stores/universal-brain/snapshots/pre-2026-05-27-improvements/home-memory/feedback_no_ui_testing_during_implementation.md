---
name: No UI/browser testing during implementation phase
description: Agents must not run dev-serve, preview tools, or browser verification during implementation; testing is a separate phase initiated by the user
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** When an agent is dispatched to create, redesign, or modify a page/component, it must stop at "implementation + lint + build passes" and NOT proceed to browser verification, screenshots, responsive checks, or console-log inspection. Testing is a separate phase initiated by the user with an explicit "now test" instruction.

**Why:** The user explicitly confirmed on 2026-04-18 that browser/UI testing should happen after all design pages are created, not per-page during implementation. Running dev-serve + preview tools mid-implementation wastes time, may surface cosmetic issues the user hasn't signed off on yet, and delays the primary deliverable (the code). Testing has its own dedicated phase.

**How to apply:**
- Implementation-phase agent briefs should include: "build + lint must pass; do NOT run `nx serve`, do NOT launch preview tools, do NOT take screenshots, do NOT verify in browser — that is a separate later phase."
- Acceptable verification at implementation time: `npx nx lint`, `npx nx build`, `npx nx test` (unit tests — not E2E), type-check, and structural sanity (files in right location, exports correct, path aliases resolve).
- NOT acceptable at implementation time: `nx serve`, `preview_start`, `preview_screenshot`, `preview_snapshot`, `preview_click`, `preview_eval`, Playwright runs, responsive-viewport walks, console-log inspection from a live page.
- When the user later says "test this" / "verify the UI" / "screenshot all pages" / "run responsive checks" — THAT is the dedicated testing phase, and browser/preview tools are then in scope.
- If an agent is mid-implementation and the code obviously needs a runtime check (e.g. to reproduce a bug), ask the user first rather than silently starting a dev server.
