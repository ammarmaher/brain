---
name: session-backup-phase-c-top-layer-popover-migration
description: "Wave 6 — additive native Top Layer migration for 8 floating popovers (tooltip, menu, dropdown, multi-select, combobox, date-picker, calendar, phone-field)"
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-21
  status: completed
  originSessionId: e96ac775-1ad2-4944-a3a6-1a4528abe4cf
---

## What Was Done

Phase C of the Top Layer migration is GREEN. Wave 6 added native Popover API
promotion (`showPopover()` / `hidePopover()`) to 7 of the 8 Falcon floating
popovers, with `FalconStackingService` registration so Phase D Wave 7 toast
migration can re-assert toasts above any popover.

Strategy: ADDITIVE. The existing `FalconOverlayService.getContainer()`
body-portal at z:100000 and `popover-portal.ts` positioning are PRESERVED as
fallback for browsers without Popover API support. The Stencil `.tsx` cores
were NOT touched — every migration lives in the Angular wrapper.

Per-popover families (discovered via Stencil core reads):
- **Family A — body-portaled**: dropdown / multi-select / date-picker /
  phone-field. Wrapper listens to `falcon-open`, defers one rAF (Stencil's
  `componentDidRender` portals AFTER `falcon-open` emits), queries
  `.falcon-overlay-container [data-falcon-popover-instance="<resolvedId>"]`,
  sets `popover="auto"`, calls `showPopover()`. No defensive CSS needed
  (positionPopoverFixed already writes all 4 corners `!important`).
- **Family B — inline + event-emitting**: tooltip / menu. Wrapper listens to
  `falcon-show` / `falcon-menu-open`, defers one rAF, queries
  `host.querySelector('[data-component="falcon-<X>-panel"]')` then
  shadow root fallback. Sets `popover="manual"` (tooltip — dismisses on
  pointer-leave NOT outside click) or `popover="auto"` (menu). Writes
  defensive `right: auto; bottom: auto; margin: 0 !important` to neutralize
  UA popover stylesheet's `inset: 0; margin: auto` (would otherwise stretch
  the panel and centre it).
- **Family C — inline + NO events**: combobox. No `falcon-open` available
  → MutationObserver on Stencil host subtree (`childList + subtree`).
  Direction-aware defensive overrides (combobox uses logical `start-0`).
  Preserves author `mt-1` (margin-top) via longhand `margin-right/bottom/
  left: 0 !important`.

`falcon-calendar` was intentionally NOT migrated — it's an inline always-
visible date-grid, not a popover. The date-picker (Wave 6.5) wraps a
calendar inside a popover; calendars rendered inside a date-picker
transitively gain Top Layer. Documentation header added explaining the
rationale.

## What Remains

Phase D (Wave 7 + Wave 8):
- **Wave 7 — Toast migration**: convert `falcon-notification-stack.
  component.ts` to use the `[falconOverlay]` directive with `kind='toast'`.
  This activates `FalconStackingService.reassertToasts()` so every
  modal/drawer/popover open triggers a toast reassert pass.
- **Wave 8 — Cleanup**: delete `--falcon-dialog-z-index: 99999` +
  `--falcon-overlay-z-index: 100000` tokens. Consider removing
  `popover-portal.ts` + `FalconOverlayService` body-portal (or keep as
  positioning fallback until Anchor Positioning is universally supported).

## Key Decisions

- **No Stencil `.tsx` edits** (hard limit). All migration in Angular
  wrappers.
- **No removal of body-portal logic** — additive only. Wave 8 cleanup.
- **No `popover-portal.ts` modifications** — outside the 8 popover wrapper
  folders.
- **Tooltip uses `popover="manual"`** — its existing pointer-leave/blur
  dismiss UX would conflict with `auto` light-dismiss on outside click.
- **Combobox uses MutationObserver** — no Stencil event for listbox
  open/close, and adding one would require a `.tsx` edit.
- **Calendar halt-and-flag** — not a popover; transitively gets Top Layer
  via date-picker.
- **Defensive inline `!important` overrides for inline-rendered panels**
  (tooltip, menu, combobox) to neutralize UA popover stylesheet centring.
  Body-portaled cases don't need these (positionPopoverFixed writes
  `!important`).

## Files Changed (10 total)

All inside `libs/falcon-ui-core/src/angular-wrapper/components/<popover>/`:

1. `falcon-tooltip/falcon-tooltip.component.ts` (+130 LOC) — Family B.
2. `falcon-menu/falcon-menu.component.ts` (+95 LOC) — Family B.
3. `falcon-dropdown/falcon-dropdown.component.ts` (+110 LOC) — Family A.
4. `falcon-multi-select/falcon-multi-select.component.ts` (+90 LOC) —
   Family A (mirror of dropdown).
5. `falcon-combobox/falcon-combobox.component.ts` (+130 LOC) — Family C.
6. `falcon-combobox/falcon-combobox.component.html` (+1 LOC) — added
   `#stencilEl` template ref on both `@if` branches.
7. `falcon-date-picker/falcon-date-picker.component.ts` (+95 LOC) —
   Family A (mirror of dropdown).
8. `falcon-calendar/falcon-calendar.component.ts` (+14 LOC) —
   documentation header only; no behavioral change.
9. `falcon-phone-field/falcon-phone-field.component.ts` (+100 LOC) —
   Family A. Replaced no-op `handlePopoverOpen/Close` with active calls.
10. `falcon-phone-field/falcon-phone-field.component.html` (+1 LOC) — added
    `#phoneFieldEl` template ref on both `@if` branches.

Files NOT touched:
- `libs/falcon-ui-core/src/utils/popover-portal.ts` — preserved verbatim.
- `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.
  service.ts` — preserved verbatim.
- `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.
  service.ts` — preserved verbatim (Phase A foundation).
- All Stencil `.tsx` files — preserved verbatim.

## Build matrix

- `falcon-ui-tokens`: GREEN (cache hit, 52 components/3624 tokens).
- `falcon-ui-core`: GREEN, 103 components proxied (~48s).
- `host-shell`: GREEN, hash `57fa890c94df82bb` (~14s).
- `admin-console`: GREEN, hash `81bbf5b637b98e0e` (~26s).
- `management-console`: GREEN, hash `f122aa0cc8141296` (~25s).

## Test matrix

`host-shell`: 67/67 GREEN in 2.0s.
- `tests/falcon-http-ui-routing.spec.ts` — 40 tests.
- `tests/falcon-notification-stack-position.spec.ts` — 7 tests.
- `tests/falcon-completion-success-dialog.spec.ts` — 9 tests (Phase B).
- `tests/falcon-sending-credentials-dialog.spec.ts` — 11 tests (Phase B).

Note: No spec touches any of the 8 popovers covered by Phase C — Phase B's
existing dialog suites continue to pass unchanged. Adding popover specs is
Phase D follow-up.

## Context for Next Agent

Phase A built `FalconStackingService` + `[falconOverlay]` directive (Wave 2)
and migrated host dialogs (Wave 3). Phase B wrapped 4 Stencil-core modal
families in native `<dialog>` (Waves 4 + 5). Phase C now has:
- `FalconStackingService.openPopoverCount` is now > 0 for any open popover.
- The popover bucket tracks all 7 promoted popovers.
- Toast reassert (`reassertToasts()`) is still dormant — `openToastCount` is
  0 because no toast registers (Wave 7).

Risk catalog for Phase D (see PHASE-C-REPORT.md §D1-D8 for details):
- D1: `getComputedStyle.direction` reads during combobox acquire may
  return empty string under SSR / freshly-mounted routes.
- D2: Stencil vdom orphans during the rAF defer — Stencil's own
  `ensurePortaled` cleans these up but a race could leave a detached panel.
- D3: Tests don't exercise the popover API path (jsdom 24 supports it but
  no spec asserts against `showPopover`).
- D4: 1-frame flash possible on tooltip — masked by Phase A
  `falcon-overlay-popover-in` 220ms fade-in.
- D5: Menu's `appendTo='body'` legacy prop — no actual portal today; query
  fallback documented for future Stencil revisions.
- D6: Future calendar-as-popup consumers should wrap in dialog/date-picker.
- D7: Phase A's `[popover]:popover-open` global animation may conflict
  with tooltip's transform-based positioning during the 220ms enter.
- D8: Popover bucket counter now active — Wave 7 toasts can correctly
  count popovers when ordering.

Runtime verification of the popover Top Layer behavior is blocked by
[VAULT] `VERIFICATION-STATUS.md` FE blocker (40+ pre-existing Stencil
errors). Build + test verification GREEN. Visual parity should be confirmed
in browser once the FE blocker clears.

Report: `Brain Outputs/_investigations/2026-05-21-top-layer-migration/
phase-c/PHASE-C-REPORT.md`.
