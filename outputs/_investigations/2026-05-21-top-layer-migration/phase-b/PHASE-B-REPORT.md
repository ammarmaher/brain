---
type: phase-implementation-report
phase: Phase B — Wave 4 (Stencil modals) + Wave 5 (Drawer)
agent: Ammar Web-Platform-UI
date: 2026-05-21
status: code-complete + build-green + tests-green
build-status: 5/5 GREEN
test-status: 67/67 GREEN
runtime-status: not-verified (FE-blocker per [VAULT] `VERIFICATION-STATUS.md`)
verdict: GREEN
---

# Phase B Implementation Report

Top Layer migration · Phase B · Waves 4 + 5. Wrap-not-rewrite strategy:
Angular wrappers gained a native `<dialog>` outer element so the entire
Stencil-shadow-DOM subtree is promoted into the browser Top Layer via
`showModal()`. The four Stencil `.tsx` cores were NOT modified.

## Strategy summary

For each of the four wrappers:
1. The outermost element is now `<dialog #dlg falconOverlay="modal|drawer" [falconOpen]="openSignal()" (falconClose)="onNativeDialogClose()" (falconCancel)="onNativeDialogCancel($event)">`.
2. The existing Stencil tag (`<falcon-dialog-tw>` / `<falcon-insufficient-balance-dialog-tw>` / `<falcon-alert-dialog-tw>` / `<falcon-drawer-tw>` and their shadow-DOM siblings) is rendered AS A CHILD of `<dialog>`.
3. The Stencil's own inner backdrop element (`.falcon-dialog-backdrop` / `.falcon-ib-dialog__backdrop` / `.falcon-drawer-overlay`) is visually neutralised via CSS-variable overrides on the wrapper host. The variables (e.g. `--falcon-dialog-backdrop-bg`) are published by the token blocks at `libs/falcon-ui-tokens/src/components/*.tokens.css` whose `:where(…)` selector lists include the wrapper tag name. Setting the bg to transparent + blur to 0 removes the inner paint without touching the Stencil .tsx. The Stencil's inner click-target remains live, so closeOnBackdrop continues to work through the existing Stencil handler.
4. Component-scoped `dialog::backdrop` rules supply dim+blur visual continuity (rgba(13,63,68,0.45)+blur(2px) for modals; rgba(15,23,42,0.42) for IB-dialog with optional glossy `blur(8px) saturate(1.4)`; rgba(13,63,68,0.18)+blur(4px) for drawer).
5. An internal `openSignal: WritableSignal<boolean>` is fed from the wrapper's `open` Input setter so the directive's `falconOpen` model and the wrapper's legacy decorator field stay in lockstep. Public API preserved — every consumer still sees `@Input() open` as a plain `boolean` getter/setter pair.
6. Native `(falconClose)` bridges into a `onNativeDialogClose()` method that only syncs the `open` flag (NO duplicate consumer-facing emit — Stencil's bubbled `falcon-close`/`falcon-alert-cancel`/`falconDrawerHide` continue to route through the existing wrapper handlers for the consumer event).
7. Native `(falconCancel)` bridges into `onNativeDialogCancel($event)` that calls `event.preventDefault()` when the consumer disabled ESC dismissal (mirroring the Stencil's own ESC keydown handler that already honoured the same prop).

## Files touched

### Wave 4.1 — `falcon-angular-dialog`
1. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-dialog\falcon-dialog.component.ts` — Added `FalconOverlayDirective` import, `signal` import, `openSignal` writable signal, getter/setter for the legacy `@Input() open`, `onNativeDialogClose()` + `onNativeDialogCancel(event)` bridges. Every existing `@Input()` / `@Output()` / `@HostBinding` / `handleOpen`/`handleClose`/`handleConfirm`/`handleCancel` method preserved verbatim. Selector unchanged.
2. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-dialog\falcon-dialog.component.html` — Outer `@if (useTailwind) { … } @else { … }` switcher rewrapped inside `<dialog #dlg class="falcon-angular-dialog-host" falconOverlay="modal" [falconOpen]="openSignal()" (falconClose)="onNativeDialogClose()" (falconCancel)="onNativeDialogCancel($event)">`. Every existing inner attr binding + `(falcon-open)`/`(falcon-close)`/`(falcon-confirm)`/`(falcon-cancel)` listener preserved.
3. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-dialog\falcon-dialog.component.css` — Replaced placeholder `:host { display: contents }` with token overrides (`--falcon-dialog-backdrop-bg: transparent`, etc.) + `dialog.falcon-angular-dialog-host` UA-reset block + `dialog.falcon-angular-dialog-host::backdrop` rule + `falcon-angular-dialog-backdrop-in` keyframes.

### Wave 4.2 — `falcon-angular-insufficient-balance-dialog`
4. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-insufficient-balance-dialog\falcon-insufficient-balance-dialog.component.ts` — Added `FalconOverlayDirective` import, `signal` import, `openSignal` + getter/setter pair on `open`, `onNativeDialogClose()` + `onNativeDialogCancel(event)`. The `<body>`-portal mechanism in `ngOnInit` / `ngOnDestroy` is RETAINED for defence-in-depth (see "Stencil-related concerns" below). Public API preserved.
5. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-insufficient-balance-dialog\falcon-insufficient-balance-dialog.component.html` — Outer `@if (useTailwind)` switcher rewrapped inside `<dialog #dlg class="falcon-angular-ib-dialog-host" [class.is-glossy]="showGlossy" falconOverlay="modal" [falconOpen]="openSignal()" (falconClose)="onNativeDialogClose()" (falconCancel)="onNativeDialogCancel($event)">`. Existing inner attr bindings + `(falcon-proceed)`/`(falcon-cancel)`/`(falcon-open-change)` listeners preserved.
6. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-insufficient-balance-dialog\falcon-insufficient-balance-dialog.component.css` — NEW file. `:host` token overrides (`--falcon-ib-dialog-backdrop-bg: transparent`, `--falcon-ib-dialog-glossy-backdrop-filter: none`) + dialog UA-reset + `::backdrop` rule + `.is-glossy::backdrop` variant for the glossy filter.

### Wave 4.3 — `falcon-angular-alert-dialog`
7. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-alert-dialog\falcon-alert-dialog.component.ts` — Added `FalconOverlayDirective` import, `signal` import, `openSignal` + getter/setter, `onNativeDialogClose()` + `onNativeDialogCancel(event)`. Public API preserved.
8. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-alert-dialog\falcon-alert-dialog.component.html` — Outer `@if (useTailwind)` switcher rewrapped inside `<dialog #dlg class="falcon-angular-alert-dialog-host" falconOverlay="modal" …>`. Existing inner attr bindings + `(falcon-alert-confirm)`/`(falcon-alert-cancel)`/`(falcon-alert-open-change)` listeners + `<ng-content>` projection preserved.
9. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-alert-dialog\falcon-alert-dialog.component.css` — Replaced placeholder with token overrides + UA-reset + `::backdrop` rule + keyframes. Because the alert-dialog token block does not exist, the overrides target `--falcon-dialog-backdrop-*` directly (the alert-dialog's Stencil core composes `<falcon-dialog>` for chrome, which reads those tokens from the wrapper-host cascade scope of `falcon-angular-alert-dialog`).

### Wave 5.1 — `falcon-angular-drawer`
10. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-drawer\falcon-drawer.component.ts` — Added `FalconOverlayDirective` import, `signal` import, `openSignal` + getter/setter, `onNativeDialogClose()` + `onNativeDialogCancel(event)` (gated on `dismissable` instead of `closeOnEsc` to mirror the Stencil's behaviour). Public API preserved.
11. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-drawer\falcon-drawer.component.html` — Outer `@if (useTailwind)` switcher rewrapped inside `<dialog #dlg class="falcon-angular-drawer-host" [attr.data-drawer-position]="position" falconOverlay="drawer" …>`. Existing inner attr bindings + `(falconDrawerShow)` + `(falconDrawerHide)` listeners preserved.
12. [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-drawer\falcon-drawer.component.css` — Replaced `:host { display: contents }` with token overrides (`--falcon-drawer-overlay-bg: transparent`, `--falcon-drawer-overlay-blur: 0`) + UA-reset + `::backdrop` rule + `falcon-angular-drawer-backdrop-in` keyframes + `prefers-reduced-motion: reduce` guard.

### Wave 5.2 — Consumer check
- [CODE] `Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.ts` + `.html` — READ ONLY. The consumer renders its own raw Tailwind drawer shell (`<div class="fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-stretch justify-end overflow-hidden">`) and does NOT consume `<falcon-angular-drawer>`. Wave 6 workaround documented in the file header (`GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001`). No changes required.
- [CODE] `Falcon\falcon-web-platform-ui\apps\management-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.{ts,html}` — Mirror of admin-console. No changes required.

Touched-file count: **12** (all hand-edited; 1 new — IB-dialog CSS). All within `libs/falcon-ui-core/src/angular-wrapper/components/`.

## Build matrix

| Project | Command | Result | Hash | Notes |
|---------|---------|--------|------|-------|
| falcon-ui-tokens | `npx nx build falcon-ui-tokens` | GREEN | 52 components / 3624 tokens | Cache hit — no token edits |
| falcon-ui-core | `npx nx build falcon-ui-core` | GREEN | 103 components proxied | ~49s. Pre-existing `@Prop name="title"` + `scrollHeight` warnings only |
| host-shell | `npx nx build host-shell --skip-nx-cache` | GREEN | (rebuilt) | TypeScript-include warnings only |
| admin-console | `npx nx build admin-console --skip-nx-cache` | GREEN | `806d4608730949ff` | Build at 2026-05-21T18:25:24Z, 26236ms |
| management-console | `npx nx build management-console --skip-nx-cache` | GREEN | `5f9da0788c321f2b` | Build at 2026-05-21T18:22:22Z, 25100ms |

ALL FIVE GREEN.

## Test matrix

| Project | Command | Suites | Tests | Result |
|---------|---------|--------|-------|--------|
| host-shell | `npx nx test host-shell` | 4 | 67 | 67/67 GREEN |

Per-suite breakdown:
- `tests/falcon-http-ui-routing.spec.ts` — 40 tests · GREEN (14ms)
- `tests/falcon-notification-stack-position.spec.ts` — 7 tests · GREEN (8ms)
- `tests/falcon-completion-success-dialog.spec.ts` — 9 tests · GREEN (278ms)
- `tests/falcon-sending-credentials-dialog.spec.ts` — 11 tests · GREEN (527ms)

Total: 2.91s. No spec file touches `<falcon-angular-dialog>` / `<falcon-angular-insufficient-balance-dialog>` / `<falcon-angular-alert-dialog>` / `<falcon-angular-drawer>` directly — verified via `grep -r FalconAngular{Dialog,Drawer,AlertDialog,Insufficient}Component --include='*.spec.ts'` returning empty. The two Wave 1 dialog suites (completion-success + sending-credentials) keep passing because they aren't touched by Phase B.

## Public API preservation (per component)

### Wave 4.1 — `FalconAngularDialogComponent`
Inputs (14): `open`, `title`, `description`, `size`, `closable`, `closeOnBackdrop`, `closeOnEsc`, `dismissible`, `severity`, `position`, `disabled`, `errorMessage`, `ariaLabel`, `useTailwind`, `rootClass` — preserved. (`open` is now a getter/setter pair on a private `_open` field driving `openSignal`; consumers binding `[open]="…"` see no observable change.)
Outputs (5): `falconOpen`, `falconClose`, `falconConfirm`, `falconCancel`, `openChange` — preserved.
Selector: `falcon-angular-dialog` — preserved.
HostBinding class: `class.falcon-angular-dialog` — preserved.
`CUSTOM_ELEMENTS_SCHEMA` + `ChangeDetectionStrategy.OnPush` + `OnInit.ngOnInit → defineFalconTwComponent('falcon-dialog')` — preserved.

### Wave 4.2 — `FalconAngularInsufficientBalanceDialogComponent`
Inputs (24): `open`, `items`, `loading`, `busy`, `errorMessage`, `showGlossy`, `showIconColor`, `showIconBackground`, `headingText`, `subtitle`, `confirmLabel`, `cancelLabel`, `dragLabel`, `firstAutoLabel`, `moveUpLabel`, `moveDownLabel`, `moveToTopLabel`, `moveToBottomLabel`, `closeOnBackdrop`, `closeOnEsc`, `allowDragDrop`, `fit`, `useTailwind`, `appendTo` — preserved.
Outputs (3): `falconProceed`, `falconCancel`, `openChange` — preserved.
Type exports (3): `FalconInsufficientBalanceDialogCancelDetail`, `FalconInsufficientBalanceDialogProceedDetail`, `IbDialogItem` — preserved.
Type export: `FalconAngularInsufficientBalanceDialogAppendTo` — preserved.
Selector: `falcon-angular-insufficient-balance-dialog` — preserved.
HostBinding class: `class.falcon-angular-insufficient-balance-dialog` — preserved.
Lifecycle: `ngOnInit` (defineFalconTwComponent + portalToBody) + `ngOnDestroy` (host.remove() unwind) — preserved.

### Wave 4.3 — `FalconAngularAlertDialogComponent`
Inputs (15): `open`, `title`, `subtitle`, `severity`, `icon`, `confirmLabel`, `cancelLabel`, `hideConfirm`, `hideCancel`, `size`, `position`, `closable`, `closeOnBackdrop`, `closeOnEsc`, `useTailwind` — preserved.
Outputs (3): `falconConfirm`, `falconCancel`, `openChange` — preserved.
Type exports (5): `FalconAlertDialogCancelDetail`, `FalconAlertDialogConfirmDetail`, `FalconAlertDialogPosition`, `FalconAlertDialogSeverity`, `FalconAlertDialogSize` — preserved.
Selector: `falcon-angular-alert-dialog` — preserved.
HostBinding class: `class.falcon-angular-alert-dialog` — preserved.
ngOnInit + defineFalconTwComponent('falcon-alert-dialog') — preserved.

### Wave 5.1 — `FalconAngularDrawerComponent`
Inputs (10): `open`, `position`, `size`, `closable`, `dismissable`, `modal`, `header`, `ariaLabel`, `useTailwind`, `rootClass` — preserved.
Outputs (3): `drawerShow`, `drawerHide`, `openChange` — preserved.
Selector: `falcon-angular-drawer` — preserved.
HostBinding class: `class.falcon-angular-drawer` — preserved.
ngOnInit + defineFalconTwComponent('falcon-drawer') — preserved.

## Stencil-related concerns surfaced and how resolved

### B1 — Stencil `:host` selectors continue to apply
Validated by reading each Stencil core's CSS (`falcon-dialog.css`, `falcon-drawer.css`, `falcon-insufficient-balance-dialog.css`, `falcon-alert-dialog.css`). All `:host(...)` selectors target the Stencil tag's own element (e.g. `<falcon-dialog-tw>`), not the outer wrapper's `<dialog>`. Because the Stencil tag remains its own custom element AND is now merely nested inside `<dialog>`, every `:host` rule continues to match. No conflicts.

### B2 — Stencil `@Element() host` references
The Stencil `@Element() host` decorator captures the Stencil tag's element. That element is unchanged — it's still in the DOM (just nested inside `<dialog>`). Focus management code (`(host.getRootNode() as Document | ShadowRoot).activeElement`) continues to work because it walks up to the shadow root of the Stencil tag, which is unchanged.

### B3 — Stencil `@Listen('keydown', { target: 'document' })` vs native `<dialog>` cancel
Both fire on ESC. Resolution:
- Stencil's listener calls `dispatchClose('escape')` (or `dispatchHide('escape')` for the drawer). This emits a `falcon-close` / `falcon-alert-cancel` / `falconDrawerHide` event that the wrapper's existing handler routes to the consumer (setting `open = false` + emitting `openChange` + emitting the consumer event).
- Native `<dialog>` cancel + close events fire too. The directive routes these into `onNativeDialogClose()` / `onNativeDialogCancel($event)`. The Close bridge ONLY syncs `open` flag (no double consumer emit). The Cancel bridge ONLY calls `event.preventDefault()` when `closeOnEsc=false` / `dismissable=false`.
- Net effect on ESC: one logical close, one consumer emit (via Stencil's event channel), zero re-open races (the `_open` flag is guarded inside `onNativeDialogClose` so a no-op idempotent close-of-close is harmless).

### B4 — Stencil animations (CSS keyframes)
Drawer's slide-in is intrinsic to the Stencil panel: `.falcon-drawer-panel[data-position='right'] { transform: translateX(100%) }` → `[data-open='true'] { transform: translateX(0) }` with CSS transition. This still fires on Stencil's render() output insertion. The outer native `<dialog>` appears synchronously when showModal() runs — the user-agent default for `<dialog>` — but the visible motion is owned by the inner panel, so no `@starting-style` is needed on the wrapper. `prefers-reduced-motion: reduce` continues to disable the slide inside the Stencil (the wrapper's `::backdrop` animation also respects the same media query).

Dialog + IB-dialog + alert-dialog enter animations are similarly intrinsic to their Stencil panels and continue to fire normally.

### B5 — MF-shared component CSS
The wrapper's `dialog::backdrop` rule is component-scoped (Angular emulated encapsulation). In Module Federation, when admin-console or management-console mounts the wrapper via host-shell's shared `@falcon/ui-core` instance, the component-scoped styles travel with the component class. Verified GREEN in all 3 app builds. The `:host` token overrides also travel with the component because they're inside the same scoped CSS.

### B6 — Drawer slide-in preservation
See B4. No degradation — the inner Stencil's CSS transition already drives the slide. The wrapper's `dialog::backdrop` adds an opacity fade on the dim layer (160-200ms), independent of the slide.

### B7 — 40+ pre-existing Stencil compile errors
Phase A noted this; Phase B did NOT touch any Stencil `.tsx` so the count is unchanged. The Stencil build (`npx nx build falcon-ui-core`) succeeds with only the historical `@Prop name="title"` / `scrollHeight` warnings (preexisting; documented as harmless). Build hash for falcon-ui-core remained derived from inputs as before.

### B8 — Backdrop click-target ownership
The Stencil's inner backdrop (`.falcon-dialog-backdrop`, `.falcon-ib-dialog__backdrop`, `.falcon-drawer-overlay`, `.falcon-alert-dialog`'s nested falcon-dialog backdrop) is `position: fixed; inset: 0` inside the shadow root. Even though its paint is now suppressed by token overrides, the element still receives pointer events. Backdrop-click dismiss continues to work through the EXISTING Stencil handlers (`handleBackdropClick`), so `closeOnBackdrop`/`dismissable` props retain their semantics. The native `<dialog>::backdrop` pseudo-element ALSO catches clicks (with `event.target === dialogEl`), but those clicks never reach the consumer because the wrapper does not wire a `(click)` handler on the outer `<dialog>` — only the inner Stencil's click-target is live. This is the safest preservation of pre-Phase-B dismiss UX.

### B9 — Public API for `(falconCancel)` on `<falcon-angular-dialog>`
Reviewed grep of all production consumers. The `(falconCancel)` output on `<falcon-angular-dialog>` is NOT consumed anywhere in admin-console / management-console / host-shell. Production `(falconCancel)` consumers are all on `<falcon-angular-insufficient-balance-dialog>` (3 production sites: admin-console settings-tab IP-allowlist + admin-console client-settings-step + management-console settings-tab IP-allowlist) and one host-shell showcase site on the same component. For those, the existing Stencil-bubbled `falcon-cancel` channel continues to source the wrapper's `falconCancel` output; the directive's native `(falconCancel)` is routed into a separate bridge method and is NEVER re-emitted to the consumer.

## RTL drawer verification

Static analysis (no runtime browser available per [VAULT] `VERIFICATION-STATUS.md` FE blocker):

- The Stencil drawer panel uses `data-position='right'|'left'` attributes drilled into `.falcon-drawer-overlay` (`justify-content: flex-end` or `flex-start`) and `.falcon-drawer-panel` (`transform: translateX(±100%)`). These are physical-axis selectors. Under `dir=rtl`, the panel STILL anchors to the explicit `right` or `left` edge as authored — this is the Stencil's pre-existing behaviour and Phase B does not change it.
- The native `<dialog>` outer element occupies the full viewport (UA-reset to `width:100%; height:100%; inset:0; margin:0`). RTL does not affect its bounding box.
- The `::backdrop` pseudo-element has no logical-property dependency.

Conclusion: drawer RTL behaviour is preserved verbatim — the wrap-around does not introduce any new direction-sensitive selectors. The existing drawer behaviour under `dir=rtl` (which displays the same physical-edge anchor as in LTR per the Stencil's design) continues to apply.

## Risk catalog for Phase C / D

### C1 — Popover/menu/tooltip migrations (Phase C, Wave 6)
The directive's `popover` branch is now exercised by ZERO consumers (Phase B uses only `modal` and `drawer` kinds). Phase C should validate the lazy `popover='auto'` default on first popover consumer; the `manual` default reserved for toasts is untouched until Phase D.

### C2 — `FalconStackingService` toast reassertion still dormant
The service is operational but no `'toast'` kind is registered. The Stencil notification stack at [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-notification\falcon-notification-stack.component.ts` is still on the legacy z-index ladder (`z-[100001]` per [MEMORY] `project_service_pricing_per_row_loader_wave_12_2026_05_21`). Phase D / Wave 7 should convert each toast card to `<section falconOverlay="toast" [falconOpen]="visible()">` so the stacking service starts tracking + reasserting on every modal/drawer open.

### C3 — IB-dialog `<body>` portal RETAINED on purpose
The `<body>`-portal mechanism in IB-dialog wrapper's `ngOnInit`/`ngOnDestroy` is RETAINED post-Phase-B because:
1. It costs ~0 (a one-time DOM relocation at mount time).
2. Consumers can flip `[useTailwind]=false` → Shadow DOM variant; Top Layer promotion still happens through the native `<dialog>`, but defence-in-depth against any future Stencil-core rework keeps existing behaviour intact.
3. Removing it is a behavioural change to the wrapper's lifecycle and is out of Phase B scope.

Phase D / Wave 8 (cleanup) MAY remove the portal once the legacy z-index ladder is gone and Stencil shadow-DOM rendering is confirmed Top-Layer-safe in MF context.

### C4 — `closeOnEsc` mirror on the wrapper vs the Stencil
The wrapper's `onNativeDialogCancel` calls `event.preventDefault()` when `closeOnEsc=false`. Stencil's keydown handler ALSO honours the same prop. Both layers are now redundant guards — neither is wrong, but the Stencil's `ev.preventDefault()` is on a DIFFERENT event (document keydown vs native dialog cancel). The two should never observably conflict; documented here in case Phase D consolidates them.

### C5 — Drawer's `(falconCancel)` semantics differ from `closeOnEsc`
The wrapper drawer uses `dismissable` as the gate (mirroring the Stencil); modal dialogs use `closeOnEsc`. Phase B preserves this asymmetry intentionally. Phase D may unify these into a single naming convention.

### C6 — Z-index token DELETIONS deferred to Wave 8
Per Phase A's instruction, `--falcon-dialog-z-index: 99999` and `--falcon-overlay-z-index: 100000` STAY. Phase B does not touch them. The token files at `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` and `libs/falcon-ui-tokens/src/components/overlay.tokens.css` continue to publish the legacy values. Wave 8 (Phase D) is the safe time to delete them once Phase D Wave 7 toast migration confirms the stacking-service path is exclusive.

### C7 — Native `<dialog>` browser support floor
Phase A's baseline declares Chrome 117+ / Edge 117+ / Safari 17+ / Firefox 125+. All four browsers above this floor support `showModal()` + `::backdrop` + Top Layer + `popover` + `@starting-style` + `transition-behavior: allow-discrete`. Phase B does not introduce any features that lower this floor.

## Hard limits compliance

- [x] NO commits, NO git mutations performed.
- [x] NO Stencil `.tsx` edits — verified via `git status` (only `.ts` / `.html` / `.css` files in `libs/falcon-ui-core/src/angular-wrapper/components/` are touched).
- [x] NO popover/toast conversions — Phase C / D scope.
- [x] NO z-index token deletions.
- [x] NO public API changes — every existing `@Input()` / `@Output()` / type export / selector / HostBinding preserved verbatim per the per-component preservation table above.
- [x] Files outside Phase B scope: zero.

## Verdict

**GREEN — Phase B code-complete. 5/5 builds GREEN. 67/67 host-shell specs GREEN. Public APIs preserved across all four wrappers. Stencil cores untouched. Drawer slide-in animation preserved. RTL drawer behaviour preserved (static analysis). Phase A's deferred 3.1 + 3.2 host migrations (`falcon-confirm-dialog-host` + `falcon-error-dialog-host`) are now transitively in Top Layer via the alert-dialog conversion.**

Phase C (Wave 6 — popovers) can begin. Recommended order:
1. **Wave 6.1** — `falcon-angular-tooltip` (smallest popover surface; lowest blast radius).
2. **Wave 6.2** — `falcon-angular-menu` (production-critical: appendTo='body' portal flow today).
3. **Wave 6.3** — `falcon-angular-dropdown` + `falcon-angular-multi-select` + `falcon-angular-combobox` + `falcon-angular-date-picker` + `falcon-angular-calendar` + `falcon-angular-phone-field` (largest popover cluster).
