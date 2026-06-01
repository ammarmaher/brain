# Falcon Next-Wave Brief — Tri-mindset dispatched (handover for next session)

**Date dispatched:** 2026-05-10
**Status:** 🟠 ACTIVE — awaiting Claude (next session) synthesis + user approval + execution.

## Context
After today's two pushes (8-wave PrimeNG total removal in the morning + 3-commit Tailwind/Shadow parity sweep in the afternoon), the user requested a NEXT WAVE plan covering three goals jointly:
- **Goal A:** further bundle-size reduction (mgmt-console at 7.83 MB raw is the laggard)
- **Goal B:** runtime performance (post-Zoneless smoke + TTI/FCP wins)
- **Goal C:** faster build & dev-serve (Nx daemon, Stencil incremental, esbuild builder, Nx remote cache)

The user invoked tri-mindset Brain pattern: a comprehensive brief was sent in parallel to ChatGPT (gpt-4o) and Gemini (gemini-2.5-flash; gemini-2.5-pro hit 429). Claude (next session) is to **synthesize** the best of both into a unified plan, get user approval, and execute.

## Files of record (in `C:\Falcon\Brain\Brain Generated\`)
- 📋 `NEXT-WAVE-BRIEF.md` — the comprehensive brief that was sent (state of repo, three goals, constraints, prior tier-ranked items, output format spec)
- 🤖 `NEXT-WAVE-PLAN-CHATGPT.md` (4.8 KB / 71 lines / 8 waves) — ChatGPT's plan
- 🔵 `NEXT-WAVE-PLAN-GEMINI.md` (15 KB / 93 lines / 8 waves + full playbooks) — Gemini's plan
- 🟢 `NEXT-WAVE-PLAN-SYNTHESIZED.md` — TO BE CREATED by next-session Claude

## What next-session Claude must do
1. **Read both plans** (ChatGPT + Gemini).
2. **Build a comparison matrix**: rows = waves; columns = ChatGPT-rank / Gemini-rank / Claude-rank / consensus / disagreements / source-attribution.
3. **Synthesize** — pick the best wave from each, cite which mindset contributed each, flag disagreements.
4. **Address the 3 architecturally-significant decisions in Section E** of the brief:
   - Ratchet production budgets DOWN to current actuals + 10%?
   - Adopt esbuild-based `@angular/build` application-builder?
   - Attempt the `@falcon` lib structural split (W9 / T2.7) now or defer?
5. **Save to** `NEXT-WAVE-PLAN-SYNTHESIZED.md`.
6. **Get user approval** before executing.
7. **Execute** the synthesized plan wave-by-wave with build-green-per-wave + standing rules (no commit/push without explicit instruction, skip demos, include libraries).

## Headline themes both plans agree on
- **W1 = bundle audit** (`nx build --stats-json` + webpack-bundle-analyzer) — universally first.
- **mgmt-console barrel sub-paths fix** (T2.5) — quick, low-risk, ~50–100 KB saving.
- **organization-hierarchy-falcon-menu.component.ts refactor** (T2.6) — ~200 KB, medium risk.
- **Route-level code splitting + defer** for runtime perf (Goal B).
- **Image / font loading hygiene** for FCP/LCP wins.
- **Nx remote cache** for build speed (CI + local).
- **Stencil incremental build** for dev-server speed.
- **`@falcon` lib structural split** (T2.7) is the BIG bundle win but **HIGH risk**, multi-day, federation surface — multiple agree to do it AFTER quick wins or pilot on admin-console first.

## Where they diverge (synthesizer must decide)
- **Esbuild migration**: Gemini hesitates ("Med risk", needs ecosystem testing); ChatGPT lists it as a multi-day wave.
- **Order of T2.5 (mgmt barrel sub-paths) vs T2.6 (component outlier refactor)**: Gemini does barrels first, ChatGPT does outliers first.
- **Zoneless smoke-test** (T4.13): Gemini puts it in W3 (early); ChatGPT doesn't list it explicitly. Should land EARLY (verifies a major prior change before more refactoring).

## Standing rules carried forward (do NOT break these)
- ✅ No commit / no push without explicit user "commit" / "push" in the user's CURRENT message.
- ✅ Falcon Shadow CSS files are source of truth (don't modify).
- ✅ Skip the demos (POCs only).
- ✅ Theme tokens are read-only without explicit approval.
- ✅ Module Federation must keep working: 1 host + 2 remotes.
- ✅ Build green per wave.
- ✅ Falcon library is included in scope (NOT excluded).

## Optional but recommended next-session opening
- Run `nx build admin-console host-shell management-console --stats-json` first — both plans agreed this is W1. Generates the data the synthesizer's plan will rely on.
- Run `npm audit` (T4.11) — 30-min hygiene check for free post-Angular-21 / post-PrimeNG.

## Repo state at handover
- Branch: `theme-polishment-v1`
- Origin: in sync (last commit `9a6c2a26` — full Shadow/Tailwind parity sweep)
- Working tree: clean
- 3-app prod build: GREEN
- `tailwind.config.js`: `module.exports = {}` (no important: true)
- 35 Falcon Angular wrappers + 28 Stencil dual-variant components shipped
- 0 PrimeNG packages installed, 0 PrimeIcon classes in source
