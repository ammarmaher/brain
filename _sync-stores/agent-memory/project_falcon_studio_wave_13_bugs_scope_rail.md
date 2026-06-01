---
name: Falcon Studio — Wave 13 (Critical Bugs + Selection Scope + Right Rail Rebuild)
description: ACTIVE 2026-05-09 — User reported 4 blocking bugs in Wave 12 build. Wave 13 fixes click-to-customize visibility + color tile family routing + token-write scope (rendered preview not Studio chrome) + right rail width/icons. Wave 14 (planned) rebuilds gallery as card-based with skeletons + Edit/Reset + color picker.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-09:** ACTIVE — Wave 13A-D dispatching. Wave 14A-D planned. Wave 15 holds deferred 6-component INTERNAL_MATRIX expansion.

## Goal

Surgical bug fixes after Wave 12 audit was green but user testing surfaced blocking issues. Then rebuild gallery as card-only entry point with skeletons + Edit/Reset + color picker.

## User-reported bugs (verbatim)

1. *"I click [a component], it does not do anything, so I cannot see any actions that are complex with that component."*
2. *"If I click on all primary color, it is in the brand. If I click success in the third value, it is always the [success?] value in the array in the first array, brand."*
3. *"I do not want to change the ID. I need just to change the inside that in the loader components that I have. All components should change, not the control for Studio."*
4. *"Increase the size of the right side that has actions and customization actions for the component. Make it much bigger."*

## Wave 13 sub-waves

- **13A** — Click-to-customize visible activation. Selection ring outline reaches dynamic ngComponentOutlet host; right rail enters active state on selection; small confirmation toast.
- **13B** — Color tile family routing fix. Each tile click resolves correct family token (success → `--falcon-{type}-success-bg`), not always brand.
- **13C** — Selection scope fix. Token writes scope to rendered preview wrapper via `[data-falcon-target-id]` selector, not `:root`. Studio chrome (`data-falcon-studio-chrome`) opt-out.
- **13D** — Right rail width 280-320 → 380-440 + Iconify Solar Linear glyphs on every section header + every option button. Bigger touch targets (h-10 px-4).

## Wave 14 sub-waves (planned)

- **14A** — Skeleton renderer per component (28 skeletons, no animation)
- **14B** — Card-based gallery as single entry point. Tabs demoted to category filter chips above grid.
- **14C** — Card click → resize/expand + Edit (`solar:pen-linear`) + Reset (`solar:refresh-linear`) action buttons
- **14D** — Color picker (hex/HSL/alpha sliders) alongside palette tiles via tab switcher inside bottom color panel

## Wave 15 (queued)

- Remaining 6 INTERNAL_MATRIX entries: radio · uploader · otp-send-dialog · tooltip · toast-host · tree-table
- Tabs focus-visible color override + font-family override (Wave 12G residual gaps)
- Layout-axis token contract for alignment/justify/width/height (Wave 12D follow-up)

## Standing protocol additions (locked)

- **User-visibility self-verify rule** further hardened: every wave must trace user-click → DOM-change. Build green ≠ user-visible.
- **Selection scope rule:** token writes target the rendered preview wrapper, NEVER `:root` (which would also affect Studio chrome).
- **Iconography density:** every customization control gets a Solar Linear icon. Non-technical users need visual cues.

## Hard guardrails

- Token SSOT enforced
- No new SCSS files
- Reuse Wave 9-12 services
- Build green-gated, 2-retry max
- No dev-serve
- Glass deletion holds
- Self-verify before claiming GREEN

## Cross-session resume

1. `libs/falcon-studio/WAVE-13-PLAN.md`
2. `libs/falcon-studio/WAVE-14-PLAN.md`
3. `libs/falcon-studio/WAVE-12-PLAN.md`
4. Memory: `project_falcon_studio_wave_12_glass_deletion.md`
