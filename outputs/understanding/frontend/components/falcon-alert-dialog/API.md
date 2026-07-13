# falcon-alert-dialog — API

## Selectors

- Angular: `falcon-angular-alert-dialog`
- Stencil Shadow: `<falcon-alert-dialog>` (tag `'falcon-alert-dialog'`, `shadow: true`)
- Stencil Light: `<falcon-alert-dialog-tw>` (tag `'falcon-alert-dialog-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularAlertDialogComponent } from '@falcon/ui-core/angular';
// (the wrapper sets CUSTOM_ELEMENTS_SCHEMA internally; the host does NOT need it)
```

Add `FalconAngularAlertDialogComponent` to the consuming standalone component's `imports: []`.

## Inputs (on `FalconAngularAlertDialogComponent`)

`[CODE]` falcon-alert-dialog.component.ts:61-85.

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | `[CODE]` :61-69 — setter mirrors into an internal `openSignal` so the native-`<dialog>` `falconOpen` model and the `@Input` stay in lockstep. Two-way via `openChange`. |
| `title` | `string \| undefined` | `undefined` | Centered title under the icon. **Maps to the Stencil `heading-text` attr** (the Stencil prop is `headingText`, renamed from `title` to dodge the `HTMLElement.title` clash — `[CODE]` falcon-alert-dialog.tsx:32-34, html:16). |
| `subtitle` | `string \| undefined` | `undefined` | Centered subtitle (max 460px). |
| `severity` | `'danger' \| 'warning' \| 'info' \| 'success'` | `'warning'` | Drives icon glyph + Confirm-button color + `role`. |
| `icon` | `string \| undefined` | `undefined` | Override icon glyph (CSS class via `<i>`). When unset, the severity-default **SVG** renders (`[CODE]` tsx:104-131). |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label. |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label. |
| `hideConfirm` | `boolean` | `false` | Hide Confirm (single-CTA — Cancel-only acknowledgement). |
| `hideCancel` | `boolean` | `false` | Hide Cancel (single-CTA — Confirm-only acknowledgement). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog panel size. |
| `position` | `'center' \| 'top' \| 'bottom'` | `'center'` | Dialog position. |
| `closable` | `boolean` | `false` | Show the close X. **Default `false`** (unlike confirm-dialog's `true`). |
| `closeOnBackdrop` | `boolean` | `true` | Dismiss on backdrop click. |
| `closeOnEsc` | `boolean` | `true` | Dismiss on Escape. Also honored against the native `<dialog>` cancel (`[CODE]` :126-129). |
| `useTailwind` | `boolean` | `true` | Render-path switch: `true` → `<falcon-alert-dialog-tw>` (Light DOM); `false` → `<falcon-alert-dialog>` (Shadow). |

> `[CODE]` There is **no `clearable`/`name`/CVA** surface — alert-dialog is a modal, not a form control. The Stencil tags expose the same props (1:1 Shadow↔`-tw` — `[CODE]` tsx:29-70 / tw.tsx:27-41) plus none beyond them (no Stencil-only `@Method`).

## Outputs (on `FalconAngularAlertDialogComponent`)

`[CODE]` falcon-alert-dialog.component.ts:87-89.

| Name | Payload | Notes |
|---|---|---|
| `(falconConfirm)` | `FalconAlertDialogConfirmDetail` = `{ severity }` | `[CODE]` :99-102 — re-emitted from the Stencil `falcon-alert-confirm`. |
| `(falconCancel)` | `FalconAlertDialogCancelDetail` = `{ severity, reason }` | `[CODE]` :104-109 — re-emitted from `falcon-alert-cancel`; ALSO sets `open=false` + emits `openChange`. `reason` ∈ `'cancel' \| 'backdrop' \| 'esc' \| 'close'`. |
| `(openChange)` | `boolean` | `[CODE]` :111-115 — from `falcon-alert-open-change` + the native-dialog close/cancel bridges (`onNativeDialogClose`/`onNativeDialogCancel`). |

## Stencil events (both tags)

`[CODE]` falcon-alert-dialog.tsx:72-82 / falcon-alert-dialog-tw.tsx:43-48 — all `bubbles: true, composed: true`.

| Event | Payload | Fires when |
|---|---|---|
| `falcon-alert-confirm` | `{ severity }` | Confirm clicked (`handleConfirm`). |
| `falcon-alert-cancel` | `{ severity, reason }` | Cancel (`reason:'cancel'`) / backdrop / esc / close-X (`reason:'close'` via `handleDialogClose`). `[CODE]` tsx:95-101. |
| `falcon-alert-open-change` | `boolean` | `open` changes (`@Watch`) + every confirm/cancel (emits `false`). |

> `[CODE]` **Confirm does NOT auto-set a dismiss reason** — confirm emits `{severity}` only; cancel carries the dismiss `reason`. The Shadow + `-tw` `handleCancel` defaults `reason` to `'cancel'` and `handleDialogClose` passes `'close'` (`[CODE]` tsx:95-101, tw.tsx:61-67).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.types.ts`:

```ts
type FalconAlertDialogSeverity = 'danger' | 'warning' | 'info' | 'success';
type FalconAlertDialogSize = 'sm' | 'md' | 'lg';
type FalconAlertDialogPosition = 'center' | 'top' | 'bottom';

interface FalconAlertDialogConfirmDetail { severity: FalconAlertDialogSeverity; }
interface FalconAlertDialogCancelDetail  { severity: FalconAlertDialogSeverity; reason: 'cancel' | 'backdrop' | 'esc' | 'close'; }
```

The wrapper re-exports all five (`[CODE]` falcon-alert-dialog.component.ts:42-48).

## Reflected props (Stencil)

`open`, `severity`, `size`, `position` are reflected to host attributes (`[CODE]` tsx:30/40/58/61) so the severity `:host([severity=…])` CSS rules can target them.

## Mutable props (Stencil)

`open` is `@Prop({ mutable: true, reflect: true })` and `@Watch`ed (`[CODE]` tsx:30, 84-87).

## CVA / ngModel / Reactive Forms

**N/A** — a modal, not a form control. `open` is two-way via the explicit `[(open)]` `@Input`/`openChange` pair (NOT `ngModel`).

## Methods

**None** — neither the Stencil tags nor the Angular wrapper expose `@Method()`/imperative methods. Open/close is driven by the `open` prop + the host events.

## Slots / template inputs

`[CODE]` Both Stencil tags + the wrapper:
- **default (unnamed) slot** → body content (priority list, info pill, summary) — `[CODE]` tsx:156-158, tw.tsx:142-144, wrapper html:32/53 (`<ng-content>`).
- **`header` / `footer` are NOT consumer slots** — the component composes its own header (icon+title+subtitle) into `<falcon-dialog slot="header">` and its own footer (Cancel/Confirm) into `<falcon-dialog slot="footer">` (`[CODE]` tsx:148/160, tw.tsx:126/146). For a custom header/footer drop to `<falcon-angular-dialog>`.
- No `ng-template` inputs.

## Sizes / states / variants

- Sizes: `sm`, `md` (default), `lg`.
- Severity: `danger`, `warning` (default), `info`, `success` — each maps to an icon glyph + Confirm/icon color (see TOKENS).
- Position: `center` (default), `top`, `bottom`.
- Button modes: two-button (default) / Cancel-only (`hideConfirm`) / Confirm-only (`hideCancel`).

## Constraints

- `[CODE]` `title` (Angular) ≠ `heading-text` (Stencil attr) — the wrapper binds `[attr.heading-text]="title ?? null"` (`[CODE]` html:16/38). Binding `[heading]`/`[title]` directly on the Stencil tag would not work the same way.
- `[CODE]` Internal Cancel/Confirm buttons are raw `<button>` (Shadow: `.falcon-alert-dialog__btn`; `-tw`: inlined Tailwind), NOT `<falcon-angular-button>` (`[CODE]` tsx:162-178, tw.tsx:147-164) — no `loading`/`disabled` state (GAP).
- `[CODE]` `icon` is a CSS-class string via `<i>`; the SVG fallback is built-in per severity. Passing an `<svg>` does not work.
- `[CODE]` The wrapper wraps everything in a native `<dialog falconOverlay="modal">` for Top-Layer promotion (`[CODE]` html:6-12) — so the modal escapes ancestor `overflow`/`z-index` stacking contexts.

## Accessibility

- `[CODE]` `role` is `'alertdialog'` for `danger`/`warning`, `'dialog'` for `info`/`success` (`[CODE]` tsx:134, tw.tsx:112).
- `[CODE]` `aria-label` mirrors `headingText` (`[CODE]` tsx:144, tw.tsx:122).
- `[CODE]` Icon is decorative — SVGs are `aria-hidden="true"` (`[CODE]` tsx:108/117/125), override-`<i>` is `aria-hidden="true"` (`[CODE]` tsx:150).
- `[CODE]` Button `:focus-visible` outline = `2px solid currentColor` + offset (Shadow, `[CODE]` css:114-117); `-tw` uses `focus-visible:outline-2 focus-visible:outline-offset-2`.
- `[CODE]` Focus-trap / focus-restore / Esc inherited from the composed `<falcon-dialog>`; the wrapper's native `<dialog>` adds Top-Layer + native focus management (`showModal()`).
- `[INFERRED]` No explicit `aria-describedby` from subtitle/body → the dialog (relies on `aria-label`=title). Minor a11y gap (see GAPS).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15) against falcon-alert-dialog.component.ts (131 ln), .html (57 ln), falcon-alert-dialog.tsx (184 ln), falcon-alert-dialog-tw.tsx (170 ln), falcon-alert-dialog.types.ts. Corrected vs prior dossier: `title`↔`heading-text` rename surfaced; `closable` default is `false`; the wrapper wraps in native `<dialog falconOverlay>`; no `@Method`; `role` mapping verified.
