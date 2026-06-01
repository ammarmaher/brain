---
name: Falcon Studio — Wave 8 (Tailwind-only Component Customizer)
description: COMPLETE 2026-05-08 — Studio re-pivoted from page editor to component customizer. Tailwind variants only. Per-component + container drop zones. Glossify class wires to popup. Iconify (Solar Linear). Token SSOT enforced. Awaiting user sign-off.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ALL WAVES COMPLETE (8A audit + 8B–8F implementation). Both builds green throughout, zero retries used. AWAITING FINAL USER SIGN-OFF.

## Goal

Re-frame the Studio as a **component customizer** that targets the Tailwind variants of Falcon UI components. Tabs by category. Per-instance + per-container drop zones. Glossify class opens a customization popup near the component. Effect propagation through tokens with scope (instance/type/global). Iconify icons.

## Live spec in-repo

`libs/falcon-studio/WAVE-8-SCOPE.md` — full directive list, sub-wave decomposition, drag-drop precision rule, hard guardrails.

## Headline directives (10)

1. **Tailwind-only target** (don't touch Stencil Shadow variants unless required for compatibility)
2. **Studio = component customizer**, not page editor
3. **Tabs by category:** Form Components, Buttons & Actions, Cards & Containers, Navigation, Data Display, Feedback, Overlays, Glass Effects
4. **Effect propagation scopes:** instance / type / token-source-shared / global
5. **Glossify class wiring (currently broken):** apply class → effect renders + popup auto-opens near component + lives in token system
6. **Per-component customization popup:** anchored near component, component-specific controls only
7. **Drag-drop precision** (locked 2026-05-08):
   - Each component instance is its OWN drop target
   - Container is ALSO a drop target (only when hovering at container level, not on a child)
   - Use `event.target === event.currentTarget` or `relatedTarget` checks to disambiguate
8. **Token SSOT** = `falcon-tailwind-tokens.css`. No new names invented in prompt — follow existing naming.
9. **Iconify icons** — one consistent outline set, SVG-based, minimal, Apple-like, token-driven
10. **Non-technical UX preserved** — buttons / toggles / 1-5 sliders / icon controls / state tabs. No Tailwind class names exposed.

## Sub-waves shipped

- 8A audit ✓ — `WAVE-8A-AUDIT-REPORT.md`
- 8B ✓ — canvas Tailwind flip (107 wrapper instances, 28 components), 8-tab reorg, Iconify (Solar Linear) install
- 8C ✓ — Glossify class wiring (MutationObserver + `falcon-glass-tile-{id}` convention), drag-drop precision (instance + container modes with `isOwnBoundary` ancestor walk), stub popup, `applyEffect({scope, family, presetId, targetId, componentType, tileId})` unified entry, `recordGlossify` localStorage persistence
- 8D ✓ — per-component popup: anchored + collision-aware flip, live preview strip, `popup-control-matrix.ts` (18 explicit component×family entries + BASE fallback), 8 state tabs, action footer (Reset / Apply Type / Apply Global / Remove), 80ms debounced live update through TokenMutationService
- 8E ✓ — 2 inline SVGs migrated (chevron + stat-card glyph), sparkline data-viz left inline, `--falcon-icon-{sm,md,lg}` semantic-alias tokens added, ICONIFY.md updated
- 8F ✓ — final regression: all 10 directives PASS, all Wave 3-7 features intact, both builds green, zero static-color violations introduced, zero new SCSS files, sign-off recommended

## Hard guardrails (every sub-wave)

- Tailwind-first, token-first, SSOT enforced
- Angular only (React/Vue parked)
- NO new SCSS
- Build green-gated (2-retry max, no infinite loops)
- Reuse Wave 3-7 engines (TokenMutationService, GlassEngine, GlassApplicationService, StudioStateService)
- Don't break Wave 3-7 features
- DO NOT dispatch implementation waves until user signs off on the audit + decomposition

## Cross-session resume

1. Read `libs/falcon-studio/WAVE-8-SCOPE.md` (full spec)
2. Read `libs/falcon-studio/WAVE-8A-AUDIT-REPORT.md` (when produced)
3. Read `STUDIO-WAVES-PLAN.md` (Waves 3-7 history)
4. Read related memory entries (feedback_angular_only_scope, feedback_shadow_is_token_ssot, feedback_build_must_be_green)
5. **WAIT FOR USER APPROVAL** before dispatching 8B-8G
