---
name: Build must be green — fix build errors immediately, no phase ships red
description: User instruction 2026-05-08. If `nx build` errors at any point during a wave, fix them BEFORE progressing to the next phase. The orchestrator dispatches a focused fix agent on every red build. No phase is marked ✅ done until both `nx build falcon-ui-core` and `nx build host-shell` pass with zero errors.
type: feedback
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Rule (locked 2026-05-08):** Every phase ends with both builds green. If `nx build falcon-ui-core` or `nx build host-shell` fail at any point — during implementation, after a token-contract change, after wiring updates, anywhere — the orchestrator MUST dispatch a focused fix agent BEFORE progressing to the next phase. No phase is marked ✅ in WAVE-2-PLAN.md until both builds pass.

**Why:** the user runtime-tests every component on `/playground` after a phase lands. A red build means the dev server may serve stale bundles (proven by Wave 1's textarea HMR-stuck issue) or fail to recompile entirely. Build success is the gate that makes the test phase possible.

**How to apply:**

1. After every Wave 2 phase lands, the orchestrator runs (or asks the agent's report to confirm) `npx nx build falcon-ui-core` AND `npx nx build host-shell` with `UV_THREADPOOL_SIZE=128` (Windows EMFILE workaround established in Wave 1 logs).
2. If either build fails, dispatch a tight fix-only agent immediately. Brief: "Build is red. Read the error in the most recent `nx build` output. Fix the cause. Run both builds again. Report success." Do NOT bundle the fix with a new phase's deliverables.
3. Never mark a WAVE-2-PLAN.md row ✅ when the build is red. Mark it ❌ blocked or 🔵 in-flight until the fix lands.
4. If a build error is caused by an existing pre-existing pattern (e.g., the `length:` typehint advisories logged in Wave 1's drift list), it's not a build BLOCKER — those are warnings, not errors. Only fix actual `error TS####` or `Cannot find module` or `Errors while compiling` messages.

**Standing exemptions (still warnings, not blockers):**
- `length:` typehint advisories (Tailwind v4) — already in cleanup queue
- `google-libphonenumber` CommonJS notice — pre-existing, unrelated
- `change-password.models.ts` unused-include — pre-existing, unrelated
- Stencil `@Prop title is reserved` advisory — kept for API ergonomics, logged in Wave 1

These are warnings the build prints but does NOT fail on. They are explicitly OK.

**The blocker pattern (must fix immediately):**
- `error TS####` from any `.ts` / `.tsx` file
- `Cannot find module` from any `import` statement
- `[webpack-dev-server] ERROR` ... `Errors while compiling. Reload prevented.`
- Any non-zero exit code from `nx build`

This rule supersedes nothing — it adds to the existing guardrails.
