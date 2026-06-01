---
name: No autopilot browser tests
description: Standing rule — never spawn ammar-qa-web or drive Chrome MCP to "test for the user". The user does the testing; agents only deliver finished code + a tight list of test areas
type: feedback
date: 2026-05-17
originSessionId: 8f62252f-2f04-4b46-9b7f-104a7db6b788
---
# Never run autopilot browser tests

The user has explicitly forbidden autopilot E2E browser testing.

**Why:** the user prefers to run the tests themselves — both because cloud QA credentials are theirs, and because their judgment on visual correctness / business logic is the authority. Autopilot tests waste tokens, can mislead (false greens), and step on the user's verification authority.

**How to apply:**

- Never spawn `ammar-qa-web` to drive Chrome unprompted, even when the user asks "can you test this?" — interpret that as a request for a finished build + a test checklist.
- Never launch `nx serve` to spin up a frontend just to verify.
- Never call any `mcp__Claude_in_Chrome__*` / `mcp__computer-use__*` tool to "verify a fix" without explicit user instruction.
- When the user asks "is it working?", produce:
  1. A statement that the code is in place and compiled
  2. The list of test areas / files they should exercise
  3. The expected wire/UI behaviour for each area
  4. STOP and wait for their result
- Building (`nx build` / `tsc --noEmit`) for compile-correctness verification is OK — that's a code check, not a runtime test.
- If the user explicitly says "run ammar-qa-web" / "drive the browser" / "test in Chrome", that is the only override that allows autopilot.

Recorded 2026-05-17 after I dispatched ammar-qa-web to test the Add User wizard fixes without being asked.
