---
name: Falcon Studio — Wave 10 (Non-Technical UX Completeness, Theme Fidelity, Intelligent Class Application)
description: ACTIVE 2026-05-08 — Wave 10 dispatching after Wave 9 sign-off. Theme-fidelity toggles + slider polish (10A); Tailwind tab underline + alignment icons (10B); smart targeting + 4-option scope chooser + glass-on-background rule (10C); stepper deep customization + step-label positioning + right-rail removal + per-internal-element controls (10D); regression + 35-row audit (10E).
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ACTIVE — dispatching 10A → 10B → 10C → 10D → 10E sequentially.

## Goal

Wave 9 made Studio per-component addressable. Wave 10 makes the customization surface itself non-technical, theme-faithful, and intelligent: every control feels Apple-clean, the toggle/slider primitives use the Falcon library directly, applying a class auto-targets the right internal parts, glass effects always paint the background (never the text), and engineering rails get consolidated to one side.

## Plan file

`libs/falcon-studio/WAVE-10-PLAN.md` — full sub-wave decomposition + 35-row audit + 10 self-verify flow checklist.

## 12 new asks (rows 24-35 in audit)

24. Every 1-5 slider has +/- buttons | 10A
25. +/- buttons use Iconify SVGs + interactive (hover/active animation) | 10A
26. Toggles must use `<falcon-angular-switch>` not hand-rolled | 10A
27. 4-option scope chooser on class apply | 10C
28. Smart targeting — class applies to ALL related internal parts | 10C
29. Glass-effect-on-background-only rule | 10C
30. Tailwind tab variant border-bottom underline parity | 10B
31. Alignment icons (Iconify) | 10B
32. Stepper internal customization (icon shape, size, animation, label position) | 10D
33. Step label middle-bottom positioning | 10D
34. Remove right-side "Fine tuning" rail | 10D
35. Left rail shows internal-element controls when selection active | 10D

## Backend save/load (deferred design constraint)

Every customization must flow through `TokenMutationService`. Full state = `Map<tokenName, value>` + custom-class-registry + glossify slice. Serialisation = `JSON.stringify()` over those signals. Don't build backend now — just don't introduce inline literal styles that bypass the token layer.

## Hard guardrails

- Tailwind-first, token-first, SSOT (`falcon-tailwind-tokens.css`)
- Reuse engines + Falcon UI library wrappers
- Angular only — no React/Vue, no new SCSS
- Build green-gated, 2-retry max
- Don't break Wave 3-9
- No dev-serve, kill ports
- Self-verify before claiming GREEN

## Cross-session resume

1. `libs/falcon-studio/WAVE-10-PLAN.md`
2. `libs/falcon-studio/WAVE-9-PLAN.md` + `WAVE-8-SCOPE.md` + `WAVE-8A-AUDIT-REPORT.md`
3. Memory: `project_falcon_studio_wave_9_per_component.md`, `feedback_studio_class_apply_gap.md`, `project_falcon_studio_wave_8_component_customizer.md`
