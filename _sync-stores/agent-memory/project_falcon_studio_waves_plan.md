---
name: Falcon Studio — Waves 3 / 4 / 5 unified plan
description: ACTIVE 2026-05-08. Three sequential studio enhancement waves: Liquid Glass deep customization (Wave 3) → Glassmorphism drag-drop effect system (Wave 4) → Unified Component Gallery + Per-Token Customization (Wave 5). Build-green-gated, no infinite loops. Live plan in `libs/falcon-studio/STUDIO-WAVES-PLAN.md`.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Active 2026-05-08.** Three Studio enhancement waves run sequentially in autopilot. Each wave gates the next via build-green verification.

## Sequence

```
Wave 3 (Liquid Glass deep customization)
   ↓ build green
Wave 4 (Glassmorphism drag-drop effect system)
   ↓ build green
Wave 5 (Unified Component Gallery + Per-Token Customization)
   ↓ build green
Final regression on /studio + /playground
```

## Live plan in-repo

`C:\falcon\falcon-web-platform-ui\libs\falcon-studio\STUDIO-WAVES-PLAN.md` — full deliverables, acceptance criteria, hard guardrails per wave.

## Build-green protocol (NO INFINITE LOOPS)

After every wave:
1. Run `UV_THREADPOOL_SIZE=128 npx nx build falcon-studio --verbose`
2. Run `UV_THREADPOOL_SIZE=128 npx nx build host-shell --verbose`
3. Both green → mark ✅, dispatch next wave
4. Either red → dispatch focused fix-only agent. **Cap: 2 retry attempts max.**
5. After 2 retries still red → mark ❌ blocked, SKIP to next wave, surface in final report

**Stall guard:** agent stalled >10min = treat as failed; respawn ONCE with tighter brief; mark ❌ if it stalls again.

## Wave 3 — Liquid Glass deep customization (in flight as of 2026-05-08)

Customization panel + 5-stop strength slider + 7 presets + live preview + 6 stat-card variants + 6-way scope + background switcher + export/reset/copy + accessibility warnings + ~28 new `--falcon-glass-*` tokens.

Existing Glassmorphism preset button stays — it now opens the new customization panel.

## Wave 4 — Glassmorphism drag-drop effect system

Glass Effects panel with 7 draggable tiles (Liquid Glass / Glassmorphism / Frosted Card / Soft Blur Panel / Premium Dashboard Glass / Dark Glass Panel / Minimal Transparent Panel). Drop zones on every preview component. New `--falcon-glassmorphism-*` token family (separate namespace from Liquid Glass's `--falcon-glass-*`). 8 presets. Stat card support. 7-way scope. Export/reset. Accessibility warnings. **Liquid Glass remains as the premium glossy effect.**

Shared `GlassEngine` service avoids duplicate logic between Liquid Glass + Glassmorphism.

## Wave 5 — Unified Component Gallery + Per-Token

Component Gallery shows REAL `<falcon-x>` instances from `@falcon/ui-core` (27 components from Wave 1+2). Selecting any component reveals its real tokens for customization. Per-component token editor reads token contracts from `libs/falcon-ui-tokens/src/components/*.tokens.css` via a generated manifest (`component-tokens.generated.ts`).

**Unification step:** one `StudioStateService` holds all state, one `TokenMutationService` writes all CSS-var changes, one preview pane shows everything. Wave 3 + Wave 4 + Wave 5 are NOT three disconnected systems — they share the same engine.

## Source-of-truth rules (carry over)

- Theme SSOT: `libs/falcon/src/theme/falcon-tailwind-tokens.css`
- Skill SSOT: Stencil Shadow + tokens.css canonical, Tailwind variant mirrors
- Skill guidance: liquid-glass-skill (Tontoon Tailwind plugin) + ui-ux-pro-max
- Tailwind only, NO SCSS
- Token-mutation invariant: verified end-to-end Wave 2 Phase D, <150ms latency

## How to resume after context reset

1. Read this memory entry
2. Read `libs/falcon-studio/STUDIO-WAVES-PLAN.md` (live status)
3. Read `libs/falcon-ui-core/WAVE-2-PLAN.md` (Wave 2 context)
4. Read `libs/falcon-ui-core/NIGHT-SHIFT-LOG.md` (Wave 1 context)
5. Read related memory entries (feedback_shadow_is_token_ssot, feedback_build_must_be_green, reference_liquid_glass_skill)
6. Pick the first 🔵 / ⏸ wave in STUDIO-WAVES-PLAN sequence and continue

## Hard guardrails (apply to every wave)

- No commits, no pushes
- Tokens-only, no inline styles (documented escape hatches preserved)
- Tailwind only — NO SCSS in Studio lib
- DO NOT remove the existing Liquid Glass button
- DO NOT duplicate glass logic between waves — shared `GlassEngine` service
- DO NOT create a second theme system
- DO NOT hardcode component token lists in Wave 5 — generate from contract files
- Reuse existing Falcon UI components in Wave 5 — render real `<falcon-x>` instances
- Build-green-gated — no wave ships red
- 2-retry-max on fixes, no infinite loops
