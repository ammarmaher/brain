# falcon-completion-success-dialog — API

> Pure-Angular standalone component (signals-first: `input()` / `output()` / `viewChild()`). **No Stencil twin**, so the dual-render / reflected-props / mutable-props sections are N/A and marked so.

## Selectors

- Angular: `falcon-angular-completion-success-dialog`
- Stencil: _None_

## Import

```ts
import { FalconAngularCompletionSuccessDialogComponent } from '@falcon/ui-core/angular';
```

`[CODE]` `falcon-completion-success-dialog.component.ts:31-36` — standalone, `imports: [FalconOverlayDirective]`, `changeDetection: OnPush`, `schemas: [CUSTOM_ELEMENTS_SCHEMA]`. Add `FalconAngularCompletionSuccessDialogComponent` to the consuming component's `imports: []`.

## Inputs (signal inputs)

`[CODE]` `falcon-completion-success-dialog.component.ts:85-97`:

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `InputSignal<boolean>` | `false` | Visibility. `[CODE]` :115-124 — a `false→true` transition (re)arms the auto-dismiss timer; `true→false` clears it. The `@if (open())` in the template gates the whole `<dialog>`. |
| `title` | `InputSignal<string>` | `'Completed successfully'` | **Pre-translated** string (hardcoded English default — see GAP G-I18N). Renders in `<h3 id="falcon-cs-title">`. |
| `subtitle` | `InputSignal<string>` | `'Credentials sent to the user'` | Pre-translated; renders in `<p id="falcon-cs-sub">`. |
| `autoDismissMs` | `InputSignal<number>` | `10_000` | Auto-dismiss timeout in ms. **`0` disables** auto-dismiss (dialog stays until ×/click/Esc). |
| `dismissOnOverlayClick` | `InputSignal<boolean>` | `true` | When `false`, backdrop clicks do NOT dismiss (`[CODE]` :137-138). ×, click-anywhere-on-panel, and Esc still dismiss. |
| `closeAriaLabel` | `InputSignal<string>` | `'Close'` | `aria-label` on the × button (hardcoded English default — GAP G-I18N). |

## Outputs

`[CODE]` `falcon-completion-success-dialog.component.ts:99-100`:

| Name | Payload | Notes |
|---|---|---|
| `(closed)` | `void` | `[CODE]` Fires on **auto-dismiss** (timer), **overlay/backdrop click** (when `dismissOnOverlayClick`), **× click**, **click anywhere on the panel** (`onPanelClick`, :144-147), or **Escape** (native `<dialog>` `cancel` → `(falconClose)`). Guarded by `if (!this.open()) return;` (`onClose`, :131-135) so it fires at most once per open. |

> `[CODE]` This is the SOLE output. There is no separate `confirm`/`dismiss`/`cancel` — the component is button-less, so every dismissal path collapses into `(closed)`.

## TypeScript types

No exported type aliases — the component uses primitive input types only.

## Reflected props / mutable props

**N/A** — pure-Angular component, no Stencil `@Prop`. `@HostBinding('class.falcon-angular-completion-success-dialog')` (`:102`) is the only host attribute.

## CVA / ngModel / Reactive Forms

**N/A.** Not a form control. Visibility is a one-way `[open]` input + `(closed)` output (the consumer owns the open state).

## Signal compatibility

`[CODE]` **Signals-first.** Uses `input()` for all props, `output()` for `closed`, `viewChild<ElementRef<HTMLDialogElement>>('dlg')` for the dialog ref, and an `effect()` (`:115-124`) to arm/clear the auto-dismiss timer on `open()` transitions. `OnPush`. Zoneless-safe (no zone-dependent APIs). Teardown via `OnDestroy.ngOnDestroy()` → `clearTimer()` (`:127-129`).

## Methods

Protected only (called from the template / tested via duck-typed handle in the spec):
- `onClose()` — clears timer + emits `(closed)` (guarded by `open()`).
- `onBackdropClick(event)` — dismiss if `dismissOnOverlayClick()` && `target === currentTarget`.
- `onPanelClick()` — dismiss (click-anywhere).
- `onNativeCancel(event)` — no-op; lets native `<dialog>` close proceed (the `(falconClose)` handler fires `onClose`).
- `onDialogClick(event)` — backdrop-click detection on the native `<dialog>` element (`target === dialogRef.nativeElement`).

> No public imperative `open()`/`close()` methods — drive visibility via the `[open]` input.

## Slots / ng-content

**None.** `[CODE]` The template is fully self-contained (× button + inlined illustration SVG + title `<h3>` + subtitle `<p>`). There is no `<ng-content>` / projection surface — title/subtitle are prop-driven only.

## Sizes / states / variants / appearances

**None.** A single fixed visual: `max-w-[560px]` centered panel, white surface, branded clipboard illustration. No size/state/variant axis.

## Constraints

- `[CODE]` **Button-less** — there is no confirm action; the dialog is a passive ack. Do not expect an "OK" button.
- `[CODE]` **Click-anywhere dismisses** (`onPanelClick`) — even clicking the panel body closes it (:144-147). Intentional React parity.
- `[CODE]` **Title/subtitle are pre-translated strings** — the component has no i18n hook (`@falcon/ui-core` has no `TranslateService` dep); callers MUST pass translated strings.
- `[CODE]` **Native `<dialog>` Top Layer** — the `[falconOverlay]="modal"` directive calls `showModal()`; the `::backdrop` pseudo-element supplies dim+blur. The component retains its own `viewChild` ref only for the backdrop-click target check.
- `[CODE]` **`autoDismissMs=0`** is the only way to keep it open indefinitely.

## Accessibility

`[CODE]` `falcon-completion-success-dialog.component.html:12-39`:
- `role="alertdialog"` + `aria-live="polite"` on the `<dialog>` (see GAP G-ROLE — `alertdialog` is heavy for a passive auto-dismiss ack).
- `[attr.aria-labelledby]="'falcon-cs-title'"` + `[attr.aria-describedby]="'falcon-cs-sub'"` wire the title/subtitle.
- × button has `[attr.aria-label]="closeAriaLabel()"`.
- Native `<dialog>` `showModal()` provides OS-level **focus containment + inertness** (focus trap) for free — the same Top-Layer benefit `falcon-popup` relies on.
- Illustration SVG is `aria-hidden="true"` + `pointer-events-none select-none` (decorative).
- ESC dismiss is always honored (no `closeOnEsc` input) — `cancel` event → native close → `(falconClose)` → `onClose()`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against `falcon-completion-success-dialog.component.ts` (173 ln) + `.html` (76 ln) + the spec (9 tests). All 6 inputs + the single `(closed)` output + the dismissal-path collapse + the `role="alertdialog"` + native-`<dialog>` focus-trap confirmed in source. No Stencil twin — dual-render sections marked N/A.
