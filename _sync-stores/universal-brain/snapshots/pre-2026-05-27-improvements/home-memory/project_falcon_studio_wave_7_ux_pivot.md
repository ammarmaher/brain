---
name: Falcon Studio — Wave 7 (Non-Technical UX pivot)
description: ACTIVE 2026-05-08, awaiting user confirmation. Replace technical Studio UI with abstract controller using only buttons, toggles, 1-5 sliders. NO token names visible. Components ARE the canvas.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** Polished + persisted, AWAITING USER CONFIRMATION before dispatch.

## Goal

Studio Waves 3-6 shipped a technical theme editor (token names, raw inputs, separate preview pane). Wave 7 pivots the UI to non-technical: business-language labels, three input types only (buttons / toggles / 1-5 sliders), components themselves are the canvas (no separate preview).

## Live plan in-repo

`libs/falcon-studio/WAVE-7-PLAN.md` — full deliverables, abstraction-map example, verification criteria, hard guardrails.

## Three input types only — NO raw text/number inputs

1. **Mood preset buttons** (top toolbar): Bright, Calm, Bold, Premium, Glass, Dark
2. **Toggles** (left rail): Round corners, Soft shadows, Compact, Big text, Animated, Bold accent
3. **1-5 step sliders** (right rail): Roundness, Shadow depth, Density, Text size, Brightness, Vibrancy

## Two views

- Basic: 6 mood + 6 toggles + 6 sliders
- Advanced: more abstract knobs revealed, still no raw inputs / no token names

## Abstraction engine

Centralized at `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts`. Each abstract control writes 4-8 tokens via `TokenMutationService`. User sees `Roundness ●●●○○`, internal engine writes `--falcon-radius-sm/md/lg/xl`.

## Glass tiles drag-drop

7 glass-effect tiles in the left rail strip. Drag onto ANY component on the center canvas → applies system-wide. Existing GlassEngine + GlassApplicationService from Waves 4A-4C reused.

## Center canvas

Real `<falcon-x>` instances rendered inline. All states visible (e.g., stepper shows step 1, 2, 3, 4 simultaneously). NO separate preview pane. Categories: buttons / inputs / selectors / stepper / tabs / cards / stat cards / tables / modals / calendar / OTP / phone / email / toolbar.

## What gets deleted from UI (engines stay)

- Tokens sidebar tab
- Components tab gallery+detail
- Component-detail-panel (file kept, not rendered)
- Technical token names visible anywhere
- Separate preview pane

## What stays

- All Waves 4A-6D engines (GlassEngine, TokenMutationService, GlassApplicationService, ComponentTokensManifest)
- All 27 Falcon UI components rendered as real instances
- Token mutation invariant (<150ms)
- Glass effects + drag-drop wiring
- Light + dark mode (driven by Bright/Dark mood presets)
- Reset all + Export (top toolbar)
- Accessibility warnings (in plain language)

## Hard guardrails

- ZERO token names in UI
- ZERO raw text/number inputs
- DO NOT delete the engineering panels (`glass-customization-panel.component.ts`, `glassmorphism-customization-panel.component.ts`) — keep as hidden "engineering view"
- Tailwind only, no SCSS
- Angular only (per `feedback_angular_only_scope.md`)
- Build-green-gated (per `feedback_build_must_be_green.md`)
- ONE abstraction-map registry file — adding/removing knobs is a single-file edit

## Cross-session resume

If a fresh session opens:
1. Read `libs/falcon-studio/WAVE-7-PLAN.md` (full spec)
2. Read this memory entry
3. Read `STUDIO-WAVES-PLAN.md` (context — Waves 3-6 ✅)
4. **CONFIRM WITH USER BEFORE DISPATCHING** — user explicitly requested polish-and-confirm before any Wave 7 work
