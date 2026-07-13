# falcon-popup — API

## Angular selector
`falcon-angular-popup`

## Stencil tags
**None.** Angular-only component (inline `template` + inline `styles`). Internally composes the Stencil Light-DOM `<falcon-button-tw>` for footer buttons.

## Import path
```ts
import {
  FalconAngularPopupComponent,
  type FalconPopupVariant,
} from '@falcon/ui-core/angular';
// FalconPopupVariant is exported from the component file (ts:32).
```
`[CODE]` ts:96-97 — `imports: [NgClass, FalconOverlayDirective]`, `schemas: [CUSTOM_ELEMENTS_SCHEMA]` (for `<falcon-button-tw>`). `OnPush` (ts:98).

## Inputs

`[CODE]` All inputs use Angular **signal-input** syntax (`input<T>()`).

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `input<boolean>` | `false` | Controls visibility. `[CODE]` ts:100 — wrapped in `@if (open())` so the native `<dialog>` mounts only when open. |
| `variant` | `input<FalconPopupVariant>` | `'error'` | One of `error` / `delete` / `unsaved` / `save`. |
| `name` | `input<string>` | `''` | `[CODE]` ts:63 — interpolated into the body string for the `delete` variant ONLY (other variants ignore it). |
| `iconBg` | `input<boolean \| undefined>` | **`undefined`** | `[CODE]` ts:309 — `undefined` is a **sentinel** = "use `FalconConfigurationService.popup.iconBg`". Per-instance value always wins (`resolvedIconBg` computed, ts:334). When true → icon chip background tint. |
| `iconColor` | `input<boolean \| undefined>` | **`undefined`** | `[CODE]` ts:310 — same sentinel; → `cfg.popup.iconColor`. When true → intent-coloured stroke; false → neutral. |
| `glossy` | `input<boolean \| undefined>` | **`undefined`** | `[CODE]` ts:311 — same sentinel; → `cfg.popup.glossy`. When true → backdrop-blur + saturate gloss on panel + backdrop. |
| `titleOverride` | `input<string \| null>` | `null` | `[CODE]` ts:313 — overrides the variant title. Empty/whitespace string treated as "no override" (`pick()`, ts:343-345). |
| `bodyOverride` | `input<string \| null>` | `null` | Override body string. |
| `hintOverride` | `input<string \| null>` | `null` | Override hint (small grey line below body). |
| `confirmLabelOverride` | `input<string \| null>` | `null` | Override confirm button label. |
| `cancelLabelOverride` | `input<string \| null>` | `null` | Override cancel button label. |
| `hideCancel` | `input<boolean>` | `false` | `[CODE]` ts:322 — hide the Cancel button (OK-only acknowledgement; the HTTP-error host binds this `true`). |
| `hideConfirm` | `input<boolean>` | `false` | `[CODE]` ts:323 — hide the Confirm button (dismiss-only). |

> **Prior-dossier drift:** the old API table listed `iconBg`/`iconColor`/`glossy` defaults as `true` — **wrong**. They default to `undefined` (config-service sentinel). And `hideCancel`/`hideConfirm` were **missing** from the old table.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `confirm` | `void` | `[CODE]` ts:325 `output<void>()` — fires on the confirm button click. Does NOT self-close. |
| `cancel` | `void` | `[CODE]` ts:326 `output<void>()` — fires on the Cancel button, close ×, backdrop click (`onDialogClick`, ts:400-406), AND the native `<dialog>` `cancel`/`close` (ESC) via `(falconClose)="onCancel()"` (ts:110). Does NOT self-close. |

## TypeScript types

```ts
export type FalconPopupVariant = 'error' | 'delete' | 'unsaved' | 'save';   // ts:32 — EXPORTED

// Internal — not exported:
type IconKey = 'git-pull-closed' | 'trash' | 'info-circle' | 'git-pull-create';   // ts:34
interface VariantContent {                                                        // ts:36-45
  intent: 'danger' | 'warning' | 'success' | 'primary';
  icon: IconKey;
  title: string;
  body: (name: string) => string;
  hint: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmTone: 'danger' | 'primary' | 'success';
}
```

`[CODE]` ts:47-92 — the `VARIANTS` const maps each variant to a `VariantContent`:

| Variant | Intent | Icon | Default confirm | Default cancel | Confirm tone |
|---|---|---|---|---|---|
| `error` | danger | git-pull-closed | "Try again" | "Cancel" | danger |
| `delete` | danger | trash | "Delete" | "Cancel" | danger |
| `unsaved` | warning | info-circle | "Discard & leave" | "Stay on page" | danger |
| `save` | success | git-pull-create | "Publish" | "Cancel" | primary |

> `[CODE]` ts:386-390 — `confirmFalconVariant()` maps `confirmTone` to the `<falcon-button-tw>` `variant`: `danger`→`'danger'`, everything else→`'primary'` (note: the `success` confirmTone is declared in the type but no variant uses it; `save` uses `primary`).

## Variant default copy (verbatim from source — corrected 2026-06-03)

| Variant | Default title (ts) | Default hint (ts) |
|---|---|---|
| `error` | "Something went wrong" | `` (EMPTY — ts:56; the prior dossier's "Error code: T2-409 …" was fabricated) |
| `delete` | "Delete this record?" | `` (EMPTY — ts:67) |
| `unsaved` | "You have unsaved changes" | "Choose Stay to keep editing, or Leave to discard your unsaved edits." (ts:76) |
| `save` | "Publish your changes?" | "3 fields changed · 1 permission updated" (ts:90 — placeholder; pass `[hintOverride]`) |

Body strings: `error` = "We couldn't complete that action. Please check your connection and try again — if the issue persists, contact your administrator." · `delete` = `You're about to permanently delete "<name>"/this record. This action cannot be undone and any linked data will lose access immediately.` · `unsaved` = "You've edited fields on this page that haven't been saved yet. Leaving now will discard your changes." · `save` = "Your edits will be applied to the live record and visible to other admins immediately."

## Reflected props
None (Angular-only).

## Methods
None public. (Internal: `onDialogClick`, `onCancel`, `onConfirm`.)

## Slots
**None.** `[CODE]` Popup is fully prop-driven — no `<ng-content>`. Rich/custom body content is not supported (deliberate constraint — use `falcon-angular-dialog` for that).

## CVA / ngModel / Reactive Forms
Not applicable.

## Signal compatibility
`[CODE]` Fully signal-driven — inputs `input()`, outputs `output()`, all derived display values `computed()` (`resolvedGlossy`/`resolvedIconBg`/`resolvedIconColor` ts:333-335, `content` ts:337, `resolvedTitle`/`resolvedBody`/`hint`/`resolvedConfirmLabel`/`resolvedCancelLabel` ts:347-357, `iconChipClasses` ts:359-384, `confirmFalconVariant` ts:386-390). `dialogRef` is a `viewChild` (ts:395). `OnPush`.

## Supported variants / states
- 4 variants (above). 2 visual sub-modes each via `iconBg` / `iconColor` / `glossy` (sentinel `undefined` → config default).
- `hideCancel` / `hideConfirm` orthogonal footer-button toggles (OK-only / dismiss-only).

## Important constraints
- `[CODE]` ts:110 **ESC** — handled by the native `<dialog>` `cancel`→`close` event → `(falconClose)="onCancel()"`. (No `@HostListener` — the prior dossier's claim is stale.)
- `[CODE]` ts:400-406 **Backdrop click fires `cancel`** — `onDialogClick` checks `event.target === dialogRef.nativeElement` (the click landed on the `::backdrop` area); inner `<article>` clicks call `$event.stopPropagation()` (ts:116).
- `[CODE]` ts:101-112 **Modal focus containment** — `showModal()` confines focus to the dialog + makes the rest of the page inert. (The popup still has no *hand-rolled* Tab-cycle trap like dialog/drawer — it relies on the native modal; see GAPS G-FOCUS.)
- `[CODE]` ts:343-345 **Empty-string overrides treated as "no override"** — `pick()` checks `override.trim().length > 0`. Guards against a `TranslatePipe` returning the key transiently during i18n load.
- **Does NOT self-close** — `confirm`/`cancel` only emit; the owning flow toggles `[open]`.

## Accessibility attributes
- `[CODE]` ts:101-116 — the native `<dialog>` AND the inner `<article>` BOTH carry `role="dialog"` + `aria-modal="true"` + `[attr.aria-label]="resolvedTitle()"` (a double-`role` — the inner `<article>` repeats it; minor — see GAPS A2). The prior "outer backdrop role=presentation" is stale.
- `[CODE]` ts:172-175 — close × button `aria-label="Close"` (hardcoded English; GAP A3).
- `[CODE]` ts:127-131 — the icon chip `<span>` is `aria-hidden="true"` (decorative).
- No `aria-describedby` linkage between body/hint and the dialog (GAP A1).
- `aria-labelledby` is NOT used (it uses `aria-label="<resolvedTitle>"`).

## Parts
None — Angular template, not Stencil.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against falcon-popup.component.ts (416 ln). Drift corrected: `iconBg`/`iconColor`/`glossy` default `undefined` (config sentinel, NOT `true`); `hideCancel`/`hideConfirm` added; native `<dialog>` ESC (no HostListener); double-`role="dialog"`; `error`/`delete` default hints are EMPTY (prior "T2-409" fabricated); `FalconPopupVariant` is exported. Line refs re-anchored to the 416-line source.
