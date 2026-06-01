---
name: Falcon Studio — Wave 9 (Per-Component Customization & Selection Model)
description: ACTIVE 2026-05-08 — Wave 9 dispatching after Wave 8 sign-off. Per-component drop zones (9A) + Custom Class Composer (9B) + selection model + right-click context menu + sidebar targeting (9C) + final regression (9D).
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ACTIVE — dispatching 9A → 9B → 9C → 9D sequentially. User approved A+B+context-menu in single instruction.

## Goal

Wave 8 wired Studio as a "component customizer" but only at SECTION granularity. Wave 9 makes it work at COMPONENT granularity: every individual instance is independently addressable via drag-drop, class application, click selection, right-click menu, and sidebar targeting.

## Plan file

`libs/falcon-studio/WAVE-9-PLAN.md` — full sub-wave decomposition + audit table covering every prior user ask.

## Sub-waves

- **9A** — Per-component drop zones. Refactor `component-canvas.component.ts` so each `<falcon-angular-*>` instance is wrapped with its own `falconGlassDropZone [targetId]="<unique>" targetType="<componentType>"`. `@for` loops + targetId scheme `canvas-<section>-<componentType>-<index>`.
- **9B** — Custom Class Composer + extended observer. New `FalconStudioCustomClassRegistry` service writing `.{className} { tokens + surfacePaint }` runtime rules. New panel for free-text class names + tile picker + override sliders + persistence to localStorage. Observer extended to recognize user-saved classes alongside `falcon-glass-tile-*`.
- **9C** — Selection model + right-click context menu + sidebar targeting. New `FalconStudioSelectionService` with `selectedTargetId`/`selectedComponentType` signals. New `falcon-studio-context-menu` anchored to right-click. Sidebar panels (mood / toggles / sliders / glass tiles) read selection and apply at scope `instance` to it; default to global when nothing selected.
- **9D** — Final regression + audit of all 22 prior user asks (table in WAVE-9-PLAN.md).

## Standing protocol additions (locked this session)

- **Self-verify directive** (Audit row 22): when an agent reports GREEN but the user can't see the change, agent must root-cause visibility (stale build / cache / wrong scope / DOM mismatch) and FIX inside the same wave. Build green ≠ user-visible.
- **No dev-serve EVER**: kill any opened ports before reporting back. Testing is user's domain.

## Hard guardrails

- Tailwind-first, token-first, SSOT (`falcon-tailwind-tokens.css`)
- Reuse engines (TokenMutationService, GlassEngine, GlassApplicationService, StudioStateService, GlossifyObserverService, ComponentPopupService)
- Angular only — no React/Vue, no new SCSS files
- Build green-gated, 2-retry max
- Don't break Wave 3-8 features
- Right-click menu keyboard-accessible (Esc to dismiss)
- Solar Linear Iconify only

## Cross-session resume

1. `libs/falcon-studio/WAVE-9-PLAN.md`
2. `libs/falcon-studio/WAVE-8-SCOPE.md` + `WAVE-8A-AUDIT-REPORT.md`
3. Memory: `feedback_studio_class_apply_gap.md`, `project_falcon_studio_wave_8_component_customizer.md`
