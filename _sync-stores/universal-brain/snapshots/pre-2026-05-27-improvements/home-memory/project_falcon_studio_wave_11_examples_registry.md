---
name: Falcon Studio — Wave 11 (Examples Registry, 4-Region Layout, Tailwind Parity, Glass-Paused)
description: ACTIVE 2026-05-08 — Wave 11 dispatching audit (11A) first. Glass/Glossify/Liquid Glass UI paused. New 4-region layout (left component-specific + nested / middle preview with example tabs / right common actions / bottom color panel) + Animations 9th tab. 4-5 real Tailwind examples per component using actual props.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ACTIVE — 11A audit dispatched first. 11B-11G implementation gated on user sign-off after audit.

## Goal

Pivot Studio from per-component canvas (Wave 9-10) to a true component customizer with 4-5 real Tailwind example tabs per component, 4-region layout, color panel, animation section, and full Tailwind variant parity with Shadow.

## Plan file

`libs/falcon-studio/WAVE-11-PLAN.md` — full sub-wave decomposition + audit fields + acceptance criteria.

## Sub-waves

- **11A** — Audit (read-only). Inventory every component, mark Tailwind status / Studio connection / nested-parts support / color support / animation support / 4-5 example list per component (real props only). Produces `WAVE-11A-AUDIT-REPORT.md`. **PAUSE for user sign-off.**
- **11B** — Hide glass UI surfaces (don't delete code). New 4-region layout skeleton (left/middle/right/bottom + Animations 9th tab). Define `FalconStudioComponentRegistryEntry` + `FalconStudioComponentExample` types.
- **11C** — Populate Examples Registry per audit. New `<falcon-studio-component-preview>` with example-tab switcher (uses falcon-tabs-tw). Live token cascade verified.
- **11D** — Right rail (universal common actions: Size/Spacing/Alignment/Shape/Border/Shadow/Text/States/Reset/Apply-to-all with friendly labels). Left rail per-component detail matrix (Table / Multi-Select / Tree / Stepper / etc.) + nested-part picker.
- **11E** — Bottom collapsible color panel (primary L / secondary R, click-to-apply). Animation tab with presets (None/Fade/Scale/Slide/Soft Lift/Pulse/Smooth Hover/Press Effect/Loading) + speed (Slow/Normal/Fast/Very Fast).
- **11F** — Tailwind Tabs border-button variant fix (Shadow variant has it, Tailwind variant missing). All states (active/hover/focus/disabled) using existing tokens.
- **11G** — Final regression + 40+ row audit + 12 self-verify flow traces + clean build sweep.

## What's preserved from Wave 9-10

- Per-component drop zones / data-glass-target-id (Wave 9A) — re-purposed for selection + token cascading
- Selection model + right-click context menu (Wave 9C)
- Custom Class Composer (Wave 9B) — engineering escape hatch
- Theme-fidelity toggle + segmented inline slider (Wave 10A) — universal control primitives
- Iconify Solar Linear (Wave 8B + 8E)
- TokenMutationService — universal token write path (every Wave 11 customization flows through it)
- EMFILE root-cause fix (Wave 10E) — narrowed Tailwind content glob + graceful-fs boot

## What's hidden / paused

- Glass effects panel UI mount
- Glossify class auto-popup chain
- Liquid Glass / Glassmorphism customization panels
- (code preserved; engineering-view toggle re-enables)

## Hard guardrails

- Glass paused — no new glass code
- Tailwind variants only
- No invented props (all examples from real `.tsx`)
- Token SSOT, no static visual values, no second design system
- No exposed token names in non-technical UI
- Build green-gated, 2-retry max
- No dev-serve
- Self-verify before claiming GREEN

## Cross-session resume

1. `libs/falcon-studio/WAVE-11-PLAN.md`
2. `libs/falcon-studio/WAVE-11A-AUDIT-REPORT.md` (after 11A)
3. `libs/falcon-studio/WAVE-10-PLAN.md` + `WAVE-9-PLAN.md`
4. Memory: `project_falcon_studio_wave_10_ux_completeness.md`, `project_falcon_studio_wave_9_per_component.md`
