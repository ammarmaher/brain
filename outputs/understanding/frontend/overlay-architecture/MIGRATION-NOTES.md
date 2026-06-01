---
type: migration-changelog
domain: frontend / overlays
last-updated: 2026-05-21
applies-to: Falcon Web Platform UI · Top-Layer migration · 8 waves
---

# Top Layer Migration — Wave-by-Wave Changelog

The 8-wave migration converted Falcon's overlay stack from a portal-to-body +
z-index ladder model to the browser-native Top Layer. This document is the
wave-level changelog. For per-phase details see the linked phase reports.

## Wave 0 — Baseline (2026-05-21)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/baseline/BASELINE.md`

Identified the root cause: Tailwind arbitrary value `z-[var(--falcon-dialog-z-index)]`
was compiling to `z-index: var(--falcon-dialog-z-index)` but the token resolved
to `auto` because it wasn't defined in the cascade for every consumer.

## Wave 1 — Sending-credentials + Completion-success dialogs (Phase A)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/wave-1/IMPLEMENTATION-REPORT.md`

Converted two pure-Angular dialogs (no Stencil core) to native `<dialog>` +
`showModal()`. Established the Wave-1 pattern: `@if (open())` wrapper +
`role="dialog"` on the native element, `dialog::backdrop` for the dim layer,
`afterNextRender()` wrapped in `runInInjectionContext` to satisfy NG0203.

## Wave 2 — Foundation (Phase A)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-a/PHASE-A-REPORT.md`

Created the three foundation pieces:
1. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts` — singleton tracker + reassert-on-modal/drawer-open.
2. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` — `[falconOverlay]` directive routing modal/drawer/popover/toast.
3. [CODE] `libs/falcon-ui-tokens/src/components/overlay-layer.tokens.css` — `@layer falcon-overlay { ... }` block with default `::backdrop` + `[popover]:popover-open` animations.

## Wave 2.5 + Wave 3 — Pure-Angular host migration (Phase A)

Refactored 4 Wave 1 dialogs to use the new `[falconOverlay]` directive. Also
migrated three pure-Angular host components (`falcon-popup`, `otp-dialog`,
http-error/unsaved-changes hosts) to native `<dialog>` via the directive.

Two host components deferred to Phase B because they delegated to
`<falcon-angular-alert-dialog>` (Stencil core, out-of-Phase-A scope).

## Wave 4 — Stencil modal cores (Phase B)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-b/PHASE-B-REPORT.md`

Wrap-not-rewrite strategy: 3 Angular wrappers gained an outer `<dialog>`:
- `falcon-angular-dialog` ([CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.html`).
- `falcon-angular-insufficient-balance-dialog`.
- `falcon-angular-alert-dialog` (transitively unblocks Phase A's deferred 3.1/3.2 hosts).

The Stencil `.tsx` cores were NOT touched. The native `<dialog>` outer
element promotes the entire Stencil subtree into Top Layer; CSS-variable
overrides at the wrapper level neutralize the Stencil's inner backdrop paint.

## Wave 5 — Drawer (Phase B)

`falcon-angular-drawer` wrapped in native `<dialog>` (modal=true) with
`falconOverlay="drawer"`. RTL behavior preserved (Stencil's `data-position`
physical-axis selectors are unaffected by `dir=rtl`).

## Wave 6 — Floating popovers (Phase C)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-c/PHASE-C-REPORT.md`

8 popover wrappers migrated to native Popover API with feature-detected
acquire/release. Three Stencil-side families discovered:
- **A. Body-portaled** (dropdown, multi-select, date-picker, phone-field) — query via `data-falcon-popover-instance` ID after one rAF.
- **B. Inline event-emitting** (tooltip, menu) — query inside Stencil host + shadow root.
- **C. Inline no-event** (combobox) — MutationObserver on Stencil host subtree.

`falcon-calendar` halt-and-flagged as not-a-popover — it's an inline always-
visible date-grid; the date-picker wraps it transitively.

## Wave 7 — Toast Top Layer migration (Phase D)

[BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-d/PHASE-D-REPORT.md`

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts`

The notification stack container now applies `[falconOverlay]="'toast'" [falconOpen]="true"`
when `@if (hasActiveToasts())` mounts it. The directive registers with
`FalconStackingService` under kind='toast'.

The `reassertToasts()` rAF pass — wired in Phase A but dormant — is now
effective. Every modal/drawer open triggers a reassert that hides+shows the
toast stack, re-popping it to the top of the Top Layer LIFO.

The `z-[100001]` Tailwind class on the container is preserved as defence-
in-depth fallback for browsers without Popover API. Top Layer paints above
z-index regardless.

## Wave 8 — Cleanup (Phase D)

### 8.1 Token deprecation (deletion blocked — consumers remain)

Pre-deletion audit found ALL 5 tokens still have live consumers (Stencil
shadow-DOM cores, Tailwind class helper modules, app-level `tailwind.css`
@source inline directives). Per the hard rule "DO NOT delete if any consumer
remains", all 5 tokens are **kept** with deprecation comments. See
[`DEAD-TOKENS.md`](./DEAD-TOKENS.md).

### 8.2 + 8.3 — Body-portal deprecation comments

- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts` — `@deprecated` JSDoc on class + method.
- [CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts` — `@deprecated` header block.

Both kept as feature-detected fallback. See
[`BROWSER-FALLBACKS.md`](./BROWSER-FALLBACKS.md).

### 8.4 — ESLint rule

[CODE] `eslint.config.mjs` — new `no-restricted-syntax` flat-config block
warns on hard-coded `z-[N]` where N ≥ 1000 in TS/TSX/HTML, with file
ignores for the grandfathered token + tailwind-class files.

### 8.5 — Brain docs

Created:
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — top-layer primer.
- [`MIGRATION-NOTES.md`](./MIGRATION-NOTES.md) — this file.
- [`DEAD-TOKENS.md`](./DEAD-TOKENS.md) — what was kept and why.
- [`BROWSER-FALLBACKS.md`](./BROWSER-FALLBACKS.md) — feature-detection map.

## Total touch surface (across all 8 waves)

Approximate file count:
- **Phase A:** 13 files (10 hand-edited + 3 auto-regenerated).
- **Phase B:** 12 files (10 components × ~1.2 files avg).
- **Phase C:** 10 files (8 popover wrappers, 2 of which touched .html for `#stencilEl` refs).
- **Phase D:** 10 files (1 toast component + 5 token files + 2 deprecation targets + 1 ESLint config + 4 brain docs).

Total: ~45 files touched + 4 new brain docs.

Public API: ZERO breaking changes. Every component selector / @Input / @Output
preserved verbatim across all 8 waves.

## See also

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — canonical pattern reference.
- [BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/` — full investigation chain (baseline → Wave 1 → phase-a → phase-b → phase-c → phase-d).
- [MEMORY] `project_service_pricing_per_row_loader_wave_12_2026_05_21` — adjacent service-pricing work that shares the period.
