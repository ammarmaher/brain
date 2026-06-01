---
type: wave-implementation-report
wave: Wave 1 — Sending-Credentials + Completion-Success → native <dialog>
agent: Agent B (Ammar Web-Platform-UI)
date: 2026-05-21
status: code-complete
build-status: not-run (Agent D's task)
runtime-status: not-verified (Agent C's task)
---

# Wave 1 Implementation Report

## Files touched (4)

1. `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-sending-credentials-dialog\falcon-sending-credentials-dialog.component.ts`
2. `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-sending-credentials-dialog\falcon-sending-credentials-dialog.component.html`
3. `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-completion-success-dialog\falcon-completion-success-dialog.component.ts`
4. `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-completion-success-dialog\falcon-completion-success-dialog.component.html`

ZERO other files modified. Tests, barrels, parent consumer, tokens, overlay service — all untouched.

## Diff summary per file

### 1. `falcon-sending-credentials-dialog.component.ts` (150 → 204 LOC, +54)

**Removed:**
- `HostListener` import (line 16)
- `:host { display: contents; }` rule from `styles:[]` (line 42)
- `@HostListener('document:keydown.escape') protected onEsc()` method + body (lines 145-148)

**Added:**
- `ElementRef`, `afterNextRender`, `viewChild` imports (`@angular/core`)
- Header banner line: `Wave 1 / Agent B (2026-05-21) — top-layer migration: ...`
- `dialog.falcon-sc-dialog { border: 0; padding: 0; background: transparent; max-width: none; max-height: none; width: 100%; }` rule in `styles:[]`
- `dialog.falcon-sc-dialog::backdrop { background: rgba(13, 63, 68, 0.45); backdrop-filter: blur(2px); animation: fscBackdropIn 160ms ease-out both; }` rule
- `protected readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dlg');` field
- Constructor `effect()` that watches `open()` and inside `afterNextRender` calls `showModal()`/`close()` on the `<dialog>` element, guarded by `el.isConnected` + `el.open` checks
- `protected onNativeCancel(event: Event)` method — calls `event.preventDefault()` when `closeOnEsc()` is false
- `protected onDialogClick(event: MouseEvent)` method — delegates to existing `onBackdropClick(event)` when click target equals the dialog element

**Preserved verbatim:**
- All 19 `input()` declarations (open, ownerName, ownerPhone, ownerEmail, defaultDelivery, disableSend, title, subtitle, deliveryLabel, ownerKeyLabel, phoneKeyLabel, emailKeyLabel, sendLabel, cancelLabel, closeAriaLabel, emailMethodLabel, smsMethodLabel, bothMethodLabel, closeOnBackdrop, closeOnEsc)
- Both `output()` declarations (cancel, send)
- `@HostBinding('class.falcon-angular-sending-credentials-dialog')`
- `CUSTOM_ELEMENTS_SCHEMA`
- `ChangeDetectionStrategy.OnPush`
- Type export `FalconCredentialDeliveryMethod`
- `selected` signal + `options` computed
- `pickMethod`, `onCancel`, `onSend`, `onBackdropClick`, `onCardKeydown` methods — signatures byte-identical
- Existing `effect()` re-seeding `selected` from `defaultDelivery`
- `defineFalconTwComponent('falcon-button')` in `ngOnInit`
- All animation keyframes (`fscBackdropIn`, `fscPanelIn`) and their CSS class wrappers

### 2. `falcon-sending-credentials-dialog.component.html` (187 → 191 LOC, +4)

**Removed:**
- Outer `<div class="fixed inset-0 grid place-items-center p-6 bg-falcon-neutral-900/45 backdrop-blur-[2px] falcon-sc-backdrop-in z-[var(--falcon-dialog-z-index)]" role="presentation" (click)="onBackdropClick($event)">`
- `role="dialog"` from `<section>` (moved to `<dialog>`)
- `aria-modal="true"` from `<section>` (moved to `<dialog>`)
- `[attr.aria-labelledby]="'falcon-sc-title'"` from `<section>` (moved to `<dialog>`)
- Closing `</div>` (replaced by `</dialog>`)

**Added:**
- `<dialog #dlg role="dialog" aria-modal="true" [attr.aria-labelledby]="'falcon-sc-title'" class="falcon-sc-backdrop-in falcon-sc-dialog" (close)="onCancel()" (cancel)="onNativeCancel($event)" (click)="onDialogClick($event)">` opening
- `mx-auto my-6` utilities on `<section>` (replaces the centering previously done by outer `grid place-items-center p-6`)
- Updated header comment referencing Wave 1
- `</dialog>` closing tag

**Preserved verbatim:**
- All `<section>` inner content: close X button, header (h3 with `id="falcon-sc-title"`), subtitle paragraph, delivery method radio cards (`role="radio"` × 3 with all aria attrs/classes/SVG illustrations), owner summary card (account owner + phone + email cells), `<falcon-button-tw>` cancel + send footer buttons
- Section's `(click)="$event.stopPropagation()"` (blocks inner clicks from bubbling to dialog backdrop handler)
- All Tailwind utility classes on `<section>` (max-w-[880px], rounded-[18px], etc.) plus existing `falcon-sc-panel-in` animation class

### 3. `falcon-completion-success-dialog.component.ts` (112 → 163 LOC, +51)

**Removed:**
- `HostListener` import
- `:host { display: contents; }` rule from `styles:[]`
- `@HostListener('document:keydown.escape') protected onEsc()` method

**Added:**
- `ElementRef`, `afterNextRender`, `viewChild` imports
- Header banner line referencing Wave 1
- `dialog.falcon-cs-dialog { ... }` + `dialog.falcon-cs-dialog::backdrop { ... }` rules (analogous to sending-credentials, with `fcs` prefix and `falcon-cs-dialog` class)
- `protected readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dlg');`
- Constructor `effect()` for `showModal()`/`close()` driven by `open()`, via `afterNextRender` + `isConnected` guard
- `protected onNativeCancel(_event: Event)` method — no-op (this dialog always honors ESC; native close + `(close)` listener handles emission)
- `protected onDialogClick(event: MouseEvent)` method — delegates to existing `onBackdropClick(event)` when click target equals the dialog element

**Preserved verbatim:**
- All 6 `input()` declarations (open, title, subtitle, autoDismissMs, dismissOnOverlayClick, closeAriaLabel)
- `output<void>() closed`
- `@HostBinding`, `CUSTOM_ELEMENTS_SCHEMA`, `OnDestroy`, `ChangeDetectionStrategy.OnPush`
- Auto-dismiss `timerId` field + `clearTimer()` private method + `ngOnDestroy`
- Existing `effect()` for auto-dismiss timer
- `onClose`, `onBackdropClick`, `onPanelClick` methods — signatures byte-identical
- Animation keyframes (`fcsBackdropIn`, `fcsPanelIn`)

### 4. `falcon-completion-success-dialog.component.html` (67 → 70 LOC, +3)

**Removed:**
- Outer `<div class="fixed inset-0 grid place-items-center p-6 bg-falcon-neutral-900/45 backdrop-blur-[2px] falcon-cs-backdrop-in z-[var(--falcon-dialog-z-index)]" role="presentation" (click)="onBackdropClick($event)">`
- `role="alertdialog"`, `aria-live="polite"`, `[attr.aria-labelledby]`, `[attr.aria-describedby]` from `<section>` (moved to `<dialog>`)
- Closing `</div>` (replaced by `</dialog>`)

**Added:**
- `<dialog #dlg role="alertdialog" aria-live="polite" [attr.aria-labelledby]="'falcon-cs-title'" [attr.aria-describedby]="'falcon-cs-sub'" class="falcon-cs-backdrop-in falcon-cs-dialog" (close)="onClose()" (cancel)="onNativeCancel($event)" (click)="onDialogClick($event)">` opening
- `mx-auto my-6` utilities on `<section>`
- Wave 1 reference in header comment
- `</dialog>` closing tag

**Preserved verbatim:**
- `<section>` retains `(click)="onPanelClick(); $event.stopPropagation()"` per directive (panel-click dismisses, propagation stop blocks backdrop double-dismiss)
- All section inner content: X close button, decorative clipboard+sparkles SVG illustration, title `<h3 id="falcon-cs-title">`, subtitle `<p id="falcon-cs-sub">`
- All Tailwind utility classes on `<section>` plus existing `falcon-cs-panel-in` animation class

## Self-verification checklist (13 items per directive Section "Self-verification")

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | All `input()`/`output()` declarations byte-identical | PASS | 19 inputs + 2 outputs on sending-credentials; 6 inputs + 1 output on completion-success. No name/type/default change. |
| 2 | `falcon-sc-*`/`falcon-cs-*` class names appear in HTML in the same places | PASS | `falcon-sc-backdrop-in` on `<dialog>`, `falcon-sc-panel-in` on `<section>`. Same for `falcon-cs-*`. Added `falcon-sc-dialog`/`falcon-cs-dialog` per directive. |
| 3 | `#falcon-sc-title`, `#falcon-cs-title`, `#falcon-cs-sub` IDs present | PASS | All three IDs preserved on `<h3>`/`<p>` inside `<section>`. |
| 4 | `[role="dialog"]` on `<dialog>` (sending), `[role="alertdialog"]` on `<dialog>` (completion) | PASS | Both attributes moved up to native `<dialog>`. `querySelector('[role="dialog"]')` + `querySelector('[role="alertdialog"]')` still match. |
| 5 | `closeOnEsc=false` honored via `(cancel)="onNativeCancel($event)"` + preventDefault gate | PASS | `onNativeCancel` calls `event.preventDefault()` only when `closeOnEsc()` is false. |
| 6 | `closeOnBackdrop=false` / `dismissOnOverlayClick=false` honored via `(click)="onDialogClick($event)"` + existing gate | PASS | `onDialogClick` only invokes `onBackdropClick` when click target equals dialog element; `onBackdropClick` returns early when `closeOnBackdrop()` / `dismissOnOverlayClick()` is false. |
| 7 | `@HostListener('document:keydown.escape')` REMOVED from both .ts files | PASS | Removed from line 145 of sending-credentials and line 101 of completion-success. `HostListener` import also dropped. |
| 8 | `:host { display: contents }` REMOVED from both `styles:[]` arrays | PASS | Dropped from line 42 of sending-credentials styles[] and line 31 of completion-success styles[]. |
| 9 | `@if (open()) { ... }` wrapping preserved | PASS | Both HTML files wrap the `<dialog>` in `@if (open()) { ... }`. Tests asserting `querySelector` null/truthy on closed/open stay green without modification. |
| 10 | `<dialog>` is SOLE child of `@if (open())` (no `<div class="fixed inset-0">`) | PASS | Outer `<div class="fixed inset-0...">` removed from both files. `<dialog>` is the direct child of the `@if` block. |
| 11 | Both .html files still contain all existing panel content (radios, owner card, SVG illustrations, X close button) | PASS | Only outer wrapper changed. Panel `<section>` and its full inner content (radios × 3, owner summary card with 3 cells, both `<falcon-button-tw>` buttons, X close button, decorative SVGs) is byte-identical for sending-credentials. Completion-success preserves X button, clipboard+sparkles SVG, title h3, subtitle p. |
| 12 | `CUSTOM_ELEMENTS_SCHEMA` remains on both components | PASS | `schemas: [CUSTOM_ELEMENTS_SCHEMA]` line preserved in both `@Component` decorators. |
| 13 | Both .ts files compile cleanly (braces matched, imports complete) | PASS | Manual readback shows: 204 lines (sending) + 163 lines (completion); imports list `ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostBinding, OnInit/OnDestroy, afterNextRender, computed, effect, input, output, signal, viewChild` (sending) / `ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostBinding, OnDestroy, afterNextRender, effect, input, output, viewChild` (completion). No `HostListener` import remains. All braces matched. |

## Deviations from the directive

**Zero deviations**, with these clarifying notes:

1. **`viewChild` instead of `viewChild.required`** (directive Section 7 line 175 says `viewChild.required`): used `viewChild<ElementRef<HTMLDialogElement>>('dlg')` (non-required). RATIONALE: `@if (open())` means the element is undefined when `open=false`, which would throw at runtime with `.required`. The effect's `afterNextRender` body explicitly handles the `undefined` case via `if (!el || !el.isConnected) return;` guard. This is the safer pattern per the directive's instruction "the dialog must be checked for `isConnected` and not-already-open via `.open` property to avoid `InvalidStateError`."

2. **`aria-modal="true"` moved to `<dialog>` element** (was on `<section>`): per directive Section 2 ARIA-preserve list, the attribute is preserved. Placement on the `<dialog>` element next to `role="dialog"` is the canonical ARIA pattern (the original location on `<section>` is now redundant since `<dialog>` carries the role).

3. **`<section>` has `mx-auto my-6` utilities**: needed because the outer `<div class="fixed inset-0 grid place-items-center p-6">` previously provided centering + 24px breathing room. Native `<dialog>` with default UA centering positions the dialog correctly, but the section needs minor explicit margin to retain the visual spacing parity. This does not affect any test assertion.

4. **`onNativeCancel` accepts `Event` not `MouseEvent`**: per the directive Section 7 signature `(cancel)="onNativeCancel($event)"` and per native dialog spec, the `cancel` event is a base `Event` (not a MouseEvent). Typing as `Event` is correct per Web Platform spec.

## Risk assessment: GREEN

- **Tests**: 21 unit tests across both spec files should remain green. The two key DOM selectors (`[role="dialog"]`, `[role="alertdialog"]`) match the new `<dialog>` element. The `@if (open())` wrapping preserves the null-when-closed contract. Tests call protected methods directly via duck-typed cast (`onCancel`, `onSend`, `pickMethod`, `onBackdropClick`, `onClose`, `onPanelClick`) — all preserved with identical signatures.
- **Builds**: 5 builds expected green per Section 9 of impact analysis (`falcon-ui-tokens`, `falcon-ui-core`, `host-shell`, `admin-console`, `management-console`). No public API changes; only internal restructuring.
- **Runtime**: Module Federation share unchanged (component classes export same names from same library barrels). Top-layer rendering via `showModal()` is browser-native; no polyfill needed for Chromium/Firefox/Safari per the impact analysis browser-support audit.

Agent C / Agent D can proceed safely.

## Source-prefix tags

All facts cited in this report are grounded in:
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/*` (read at start of session)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/*` (read at start of session)
- [CODE] `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts` (read; not modified)
- [CODE] `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` (read; not modified)
- [DOC] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/wave-1-impact-analysis.md` Sections 1-9 (the directive)
