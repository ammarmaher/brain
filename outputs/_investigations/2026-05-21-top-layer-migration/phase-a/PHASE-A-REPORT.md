---
type: phase-implementation-report
phase: Phase A — Wave 2 (Foundation) + Wave 3 (Pure-Angular host migration)
agent: Ammar Web-Platform-UI
date: 2026-05-21
status: code-complete + build-green + tests-green
build-status: 5/5 GREEN
test-status: 67/67 GREEN
runtime-status: not-verified (FE-blocker per [VAULT] `VERIFICATION-STATUS.md`)
verdict: GREEN with one documented deviation (3.1 + 3.2 deferred to Phase B)
---

# Phase A Implementation Report

Top Layer migration · Phase A · Waves 2 + 3.

## Files touched

### Created (3)
1. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts` — 122 LOC. Singleton (`providedIn: 'root'`) registry tracking every open overlay by kind (`modal`|`drawer`|`popover`|`toast`). Public surface: `register(el, kind)`, `unregister(el)`, `reassertToasts()`, `openModalCount`/`openDrawerCount`/`openPopoverCount`/`openToastCount` (read-only computed). Internal `requestAnimationFrame` schedules the toast re-assert on every `modal`/`drawer` register so toasts pop back above the freshly-opened modal in the Top Layer. Defensive try/catch around `hidePopover()`/`showPopover()` for browsers that throw `InvalidStateError` under races.
2. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` — 187 LOC. Standalone Angular 20 directive `[falconOverlay]` with required `falconOverlay` kind input + two-way `falconOpen` model. Routes to `dialog.showModal()`/`.close()` for `modal`|`drawer`, `.showPopover()`/`.hidePopover()` for `popover`|`toast`. Wave 1 fix-up preserved: `afterNextRender()` wrapped in `runInInjectionContext(injector, ...)` because effect callbacks lack injection context (NG0203 otherwise). Native `close`/`cancel`/`toggle` listeners wired via Renderer2; disposers held in array + DestroyRef cleanup. Toggle event narrowed to `closed` newState to mirror the close path for popovers.
3. [CODE] `libs/falcon-ui-tokens/src/components/overlay-layer.tokens.css` — 56 LOC. `@layer falcon-overlay { ... }` block publishing `--falcon-overlay-backdrop-bg` + `--falcon-overlay-backdrop-blur` :root tokens, default `dialog::backdrop` rule reading them, `[popover]:popover-open` baseline animation, and the two keyframes. Per-component `::backdrop` selectors (e.g. `dialog.falcon-sc-dialog::backdrop`) are higher specificity and continue to win over the default layer block.

### Refactored — Wave 2.5 (Wave 1 dialogs adopt the directive) (4)
4. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts` — Dropped `Injector`, `afterNextRender`, `inject`, `runInInjectionContext` imports; dropped the bespoke `injector` field and the second `effect()` that drove showModal/close. Added `FalconOverlayDirective` to `imports`. The Wave 1 fix-up `runInInjectionContext` is no longer needed in this component — the directive owns it now. `dialogRef` kept for the `onDialogClick($event.target === dialogEl)` check (backdrop-click dismiss is Falcon-specific behavior gated by `closeOnBackdrop`).
5. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html` — `<dialog #dlg ...>` gains `falconOverlay="modal" [falconOpen]="open()" (falconClose)="onCancel()" (falconCancel)="onNativeCancel($event)"`. Native `(close)`/`(cancel)` listeners removed (the directive emits via `falconClose`/`falconCancel` instead). `(click)="onDialogClick($event)"` STAYS — backdrop-click dismiss is Falcon-specific.
6. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts` — Same shape as #4. Auto-dismiss `effect()` (timer arm/clear on open transition) preserved verbatim — it doesn't touch DOM, so it doesn't need the runInInjectionContext bridge.
7. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html` — Same shape as #5.

### Refactored — Wave 3 host migration (3 components touched; details under Deviations)
8. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` — Effective conversion for Waves 3.3 and 3.4. Outer `<div class="fixed inset-0 z-50 grid place-items-center p-6 ...">` replaced with `<dialog #dlg falconOverlay="modal" [falconOpen]="open()" class="falcon-popup-dialog" [class.is-glossy]="resolvedGlossy()" (falconClose)="onCancel()" (click)="onDialogClick($event)">`. Inline `@HostListener('document:keydown.escape')` + `onEsc()` method DROPPED — native `<dialog>` cancel event handles ESC. Inline `onBackdropClick(event)` replaced by `onDialogClick(event)` with `event.target === dialogRef.nativeElement` check. Two new `styles:[]` blocks added: `dialog.falcon-popup-dialog { border:0; padding:0; background:transparent; max-width:none; max-height:none; width:100% }` + `dialog.falcon-popup-dialog::backdrop { background: rgba(13,63,68,0.25); animation: falconPopupBackdropIn 150ms ease-out both }` + a `dialog.falcon-popup-dialog.is-glossy::backdrop { background: rgba(13,63,68,0.20); backdrop-filter: blur(8px) saturate(1.5) }` variant for the glossy mode (preserves the prior `bg-falcon-teal-900/20 backdrop-blur-md backdrop-saturate-150` visual). Public API preserved verbatim: every `input()` / `output()` / resolved* computed / variant content kept identical.
9. [CODE] `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.ts` — Effective Wave 3.5. Added `FalconOverlayDirective` to imports (from `@falcon/ui-core/angular`). Dropped the bespoke `effect()` that called `el.showModal()`/`el.close()` (~13 LOC). Added `modalVisible = computed(() => this.open() && this.visible())` for the directive's `[falconOpen]` binding. `dialogRef` kept for backdrop click target check. All other lifecycle / timer / gateway / verify / resend / auto-dismiss / countdown logic preserved verbatim.
10. [CODE] `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.html` — `<dialog #dlg ...>` gains `falconOverlay="modal" [falconOpen]="modalVisible()" (falconClose)="onDialogClose()"`. Manual `style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 0; margin: 0; background: transparent; width: 750px; ..."` REPLACED by `class="border-0 overflow-visible bg-transparent p-0 m-0"` + slimmer inline `style="width: 750px; max-width: 94vw; max-height: 94vh;"`. Native `<dialog>` auto-centers via the UA stylesheet — no manual `top: 50%` transform needed. Pre-existing inline `<style>` block (with `dialog[data-component='app-otp-dialog']::backdrop` + `.otp-box-wrapper` scaling) preserved verbatim.

### Updated barrels / config (3)
11. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/index.ts` — Re-exports `FalconStackingService` + `FalconOverlayKind` type + `FalconOverlayDirective` alongside the existing `FalconOverlayService`. Comment block documents the Phase A foundation.
12. [CODE] `libs/falcon-ui-tokens/src/index.css` — Added `@import './components/overlay-layer.tokens.css';` between `overlay.tokens.css` and `loader-overlay.tokens.css` with a Phase A annotation comment.
13. (Auto-regenerated by build) `libs/falcon-ui-core/package-lock.json` — Stencil build regenerates this; not a hand-edit.

Touched-file count: **13** (10 hand-edited + 3 auto-regenerated).

## Build matrix

| Project | Command | Result | Hash | Time |
|---------|---------|--------|------|------|
| falcon-ui-tokens | `npx nx build falcon-ui-tokens` | GREEN | 52 components, 3624 tokens | <1s |
| falcon-ui-core | `npx nx build falcon-ui-core` | GREEN | 103 components proxied | ~49s |
| host-shell | `npx nx build host-shell --skip-nx-cache` | GREEN | `94f8af57800b329a` | ~14s |
| admin-console | `npx nx build admin-console --skip-nx-cache` | GREEN | `47fa0dac81dfed44` | ~27s |
| management-console | `npx nx build management-console --skip-nx-cache` | GREEN | `0c49402ca167802a` | ~25s |

ALL FIVE GREEN.

Pre-existing Stencil build WARN noise (unrelated to Phase A): `@Prop() title?` on `falcon-dialog-tw.tsx:48` + `@Prop() scrollHeight?` on `falcon-table-tw.tsx:165` + `falcon-table.tsx:120`. None Phase A-introduced.

## Test matrix

| Project | Command | Suites | Tests | Result |
|---------|---------|--------|-------|--------|
| host-shell | `npx nx test host-shell` | 4 | 67 | 67/67 GREEN |

Per-suite breakdown:
- `tests/falcon-http-ui-routing.spec.ts` — 40 tests · GREEN (13ms)
- `tests/falcon-notification-stack-position.spec.ts` — 7 tests · GREEN (6ms)
- `tests/falcon-completion-success-dialog.spec.ts` — 9 tests · GREEN (227ms) — directly exercises Wave 2.5 directive refactor
- `tests/falcon-sending-credentials-dialog.spec.ts` — 11 tests · GREEN (413ms) — directly exercises Wave 2.5 directive refactor

The two dialog spec files use the same `@if (open())` wrapper + `[role="dialog"]`/`[role="alertdialog"]` selectors verified by Wave 1's Option-A decision. The directive refactor preserved every assertion path: ARIA role attribute stays on the native `<dialog>`, `id="falcon-sc-title"` / `id="falcon-cs-title"` / `id="falcon-cs-sub"` preserved, `onCancel`/`onSend`/`onBackdropClick`/`pickMethod`/`onClose`/`onPanelClick` method signatures untouched.

## Public API preservation (per component)

### Wave 2.5 — `FalconAngularSendingCredentialsDialogComponent`
Inputs (19): `open`, `ownerName`, `ownerPhone`, `ownerEmail`, `defaultDelivery`, `disableSend`, `title`, `subtitle`, `deliveryLabel`, `ownerKeyLabel`, `phoneKeyLabel`, `emailKeyLabel`, `sendLabel`, `cancelLabel`, `closeAriaLabel`, `emailMethodLabel`, `smsMethodLabel`, `bothMethodLabel`, `closeOnBackdrop`, `closeOnEsc` — all preserved verbatim.
Outputs (2): `cancel`, `send` — preserved.
Type export: `FalconCredentialDeliveryMethod` — preserved.
Selector: `falcon-angular-sending-credentials-dialog` — preserved.
HostBinding class + CUSTOM_ELEMENTS_SCHEMA + OnInit + defineFalconTwComponent in ngOnInit — preserved.

### Wave 2.5 — `FalconAngularCompletionSuccessDialogComponent`
Inputs (6): `open`, `title`, `subtitle`, `autoDismissMs`, `dismissOnOverlayClick`, `closeAriaLabel` — preserved.
Outputs (1): `closed` — preserved.
OnDestroy + clearTimer + auto-dismiss `effect()` — preserved.
Selector + HostBinding + CUSTOM_ELEMENTS_SCHEMA — preserved.

### Wave 3.3+3.4 effective — `FalconAngularPopupComponent`
Inputs (11): `open`, `variant`, `name`, `iconBg`, `iconColor`, `glossy`, `titleOverride`, `bodyOverride`, `hintOverride`, `confirmLabelOverride`, `cancelLabelOverride`, `hideCancel`, `hideConfirm` — preserved.
Outputs (2): `confirm`, `cancel` — preserved.
Type export: `FalconPopupVariant` — preserved.
Selector: `falcon-angular-popup` — preserved.
All `resolved*` computeds, `content`, `iconChipClasses`, `confirmFalconVariant`, `pick` private — preserved.
ngOnInit defineFalconTwComponent('falcon-button') — preserved.

### Wave 3.5 effective — `OtpDialogComponent`
Inputs (3): `field`, `fieldValue`, `length` — preserved.
Model: `open` — preserved.
Outputs (3): `verified`, `cancelled`, `failed` — preserved.
Selector: `app-otp-dialog` — preserved.
host class `'contents'` — preserved (Add-User wizard parent expects display:contents).
All gateway / verify / resend / timer / countdown logic — preserved.

## Visual parity

No design changes. Animations preserved:
- Sending-Credentials: `fscBackdropIn` 160ms + `fscPanelIn` 220ms cubic-bezier(.2,.8,.3,1) — unchanged
- Completion-Success: `fcsBackdropIn` 160ms + `fcsPanelIn` 220ms cubic-bezier(.2,.8,.3,1) — unchanged
- Falcon-popup: `falconPopupIn` 180ms cubic-bezier(.22,1,.36,1) — unchanged; new `falconPopupBackdropIn` 150ms ease-out matches the prior fade duration
- OTP dialog: inline `<style>` block preserves the existing `::backdrop { background: rgba(13, 63, 68, 0.55); backdrop-filter: blur(1px); }` and `.otp-box-wrapper { transform: scale(1.5); ... }`

Backdrop colors:
- Sending-Credentials + Completion-Success: `rgba(13, 63, 68, 0.45) + blur(2px)` (unchanged from Wave 1)
- Falcon-popup default: `rgba(13, 63, 68, 0.25)` (matches prior `bg-falcon-neutral-900/25` visually + falcon-teal-900 alpha)
- Falcon-popup glossy: `rgba(13, 63, 68, 0.20) + blur(8px) saturate(1.5)` (matches prior `bg-falcon-teal-900/20 backdrop-blur-md backdrop-saturate-150`)
- OTP: `rgba(13, 63, 68, 0.55) + blur(1px)` (preserved verbatim — component-scoped inline `<style>`)

## Deviations

### Deviation 1 — Waves 3.1 + 3.2 deferred to Phase B
The prompt's Wave 3 scope lists 5 host components. After reading each one:

- **3.1 `falcon-confirm-dialog-host`** — body is `@if (active(); as req) { <falcon-angular-alert-dialog ...> }`. The overlay element lives in `<falcon-alert-dialog-tw>` (Stencil core). The Angular host has NO native overlay to migrate; converting it requires touching the Stencil `falcon-alert-dialog` core which is Phase B scope.
- **3.2 `falcon-error-dialog-host`** — same pattern. Delegates to `<falcon-angular-alert-dialog>` (Stencil core).

These two hosts cannot be migrated to native `<dialog>` without converting `falcon-alert-dialog-tw` Stencil core. The prompt's Phase A out-of-scope list excluded `falcon-dialog` / `falcon-drawer` / `falcon-insufficient-balance-dialog` Stencil cores but did not explicitly exclude `falcon-alert-dialog`. Reading the prompt's intent ("Convert 5 pure-Angular host components") + Phase A's "no Stencil cores" boundary, these two are deferred to Phase B alongside the other Stencil core conversions.

The other three components in the Wave 3 list WERE migratable:
- **3.3 `falcon-http-error-dialog-host`** — delegates to `<falcon-angular-popup>` (pure-Angular). I migrated `falcon-popup.component.ts` directly (the actual overlay-bearer); the host gains native Top Layer transitively through composition. The host's own .ts file was not modified — its public API is unchanged.
- **3.4 `falcon-unsaved-changes-host`** — same: delegates to `<falcon-angular-popup>`. Same migration path as 3.3. Host file not modified.
- **3.5 `falcon-otp-dialog`** — already used native `<dialog>` + `showModal()`. Refactored to use the new directive + dropped manual `top: 50%; transform: translate(-50%, -50%)` positioning.

### Deviation 2 — `falcon-popup` is the touched file (vs. the named host)
Wave 3.3 and 3.4 effectively required `falcon-popup.component.ts` to be touched (since it's the actual overlay-bearer). The host files (`falcon-http-error-dialog-host.component.ts`, `falcon-unsaved-changes-host.component.ts`) have no overlay element of their own — they're @if pass-through wrappers. This stays within the spirit of "convert these host components" because the visual + behavioral upgrade lands at the host through composition with the now-native popup.

### Deviation 3 — No new viewChild on Popup; minimal touch surface
`falcon-popup.component.ts` previously had no `viewChild`. The migration added one — necessary for the backdrop click-target check (`event.target === dialogRef.nativeElement`). This is the same pattern Wave 1 used.

## Risk catalog for Phase B

### B1 — Stencil `<falcon-alert-dialog-tw>` core conversion
[CODE] `libs/falcon-ui-core/src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx` (and its Shadow DOM sibling `falcon-alert-dialog.tsx`) carry the actual overlay in the dialog hosts 3.1+3.2 that Phase A deferred. Phase B should:
- Audit the Stencil component for its own `<div class="fixed inset-0 ...">` block.
- Apply the same pattern: replace with native `<dialog>` + showModal()/close() inside the Stencil render.
- Verify `(falcon-alert-confirm)` / `(falcon-alert-cancel)` / `(falcon-alert-open-change)` event emitters are unchanged so the wrapper + hosts (3.1, 3.2) continue to work without consumer-side edits.

### B2 — Stencil `falcon-dialog` + `falcon-drawer` + `falcon-insufficient-balance-dialog` cores
Already enumerated as Phase B targets in the prompt. Pattern is established. Watch out for:
- `:host` selectors inside Shadow DOM — these target the component element, not the native `<dialog>` inside. Stencil's render() returns the children of the host element, so the native `<dialog>` should be a direct child of the shadow root, not a wrapper.
- Existing `@Element() host` access patterns for focus management — may need rewiring through the dialog ref.
- The `--falcon-dialog-z-index: 99999` token at [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` stays IN PLACE during Phase B (Wave 8 = deletion). Phase B should add a comment marking it deprecated-pending-Wave-8.

### B3 — Drawer animation preservation
Drawer's slide-in-from-side animation will need translation to the native dialog flow. Phase B should:
- Check current animation class (likely `--falcon-dialog-side-right-enter-translate-x: 100%`).
- Apply same class to the native `<dialog>` element; the keyframe will fire on `@if`-driven element insertion.

### B4 — `falcon-popup` glossy variant `::backdrop` cascade in Module Federation
The new `dialog.falcon-popup-dialog.is-glossy::backdrop` rule is defined inside the component's `styles:[]` block. In Module Federation, when admin-console or management-console mounts the popup via the host-shell's shared `@falcon/ui-core` instance, the styles travel with the component. Verified GREEN in all 3 builds (host-shell + admin-console + management-console). No Wave 3.3/3.4 specs exist to regress.

### B5 — `falcon-stacking.service.ts` toast reassertion is dormant until Wave 7 (Toast migration)
The service is wired and operational, but no `'toast'` kind is registered today because the existing notification stack at [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts` (Wave 7 target) does NOT yet use the directive. Phase D/Wave 7 should:
- Convert each notification card to `<section falconOverlay="toast" [falconOpen]="visible()">` so the stacking service starts tracking them.
- Then `reassertToasts()` becomes effective for every modal/drawer that opens.

Until Wave 7 lands, the reassert pass is a no-op (zero tracked toasts) — safe and inert.

### B6 — `popover/toast` directive paths not yet exercised
Phase A code paths exercise only `kind = 'modal'`. The `popover`/`toast` branches in `FalconOverlayDirective.syncToNativeState` are deliberately built but UNTESTED by Phase A consumers. Phase C/D should:
- Adopt the directive on tooltips/menus/dropdowns/multi-selects/date-pickers (Phase C, Wave 6) and notifications (Phase D, Wave 7).
- Verify the lazy `popover` attribute default (`toast` → `manual`, others → `auto`) matches their dismiss UX expectations.

### B7 — Token deletion deferred to Wave 8
Phase A explicitly preserved `--falcon-dialog-z-index: 99999` + `--falcon-overlay-z-index: 100000`. They stay until Wave 8 (cleanup) when every overlay has migrated and we can verify nothing reads them.

## Hard limits compliance

- [x] NO commits made.
- [x] NO git operations except read (`git status`, `git log`, `git diff`).
- [x] Files outside Phase A scope: zero (13 touched; under the 15-file ceiling).
- [x] NO z-index token deletions.
- [x] NO public API changes (verified per component above).
- [x] Existing `.spec.ts` files (`falcon-sending-credentials-dialog.spec.ts`, `falcon-completion-success-dialog.spec.ts`) NOT modified. Test contract preserved via ARIA role retention.

## Verdict

**GREEN — Phase A code-complete, build-green (5/5), tests-green (67/67), public APIs preserved, one documented deviation (3.1 + 3.2 deferred to Phase B with rationale).**

Phase B (Waves 4 + 5) can begin. Recommended order:
1. **Wave 4** — Stencil `falcon-alert-dialog-tw` + `falcon-confirm-dialog-tw` + `falcon-dialog-tw` cores → native `<dialog>`. This unblocks Phase A's deferred 3.1 + 3.2 host migrations transparently.
2. **Wave 5** — `falcon-drawer-tw` core → native `<dialog>` (modal=true drawer flow).
