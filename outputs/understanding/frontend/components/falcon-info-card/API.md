# falcon-info-card — API

## Selectors

- Angular: `falcon-info-card` `[CODE]` falcon-info-card.component.ts:34
- Stencil: none (single-render Angular component — no Shadow tag, no `-tw` twin).

## Import

```ts
import { FalconInfoCardComponent } from '@falcon';
import type { FalconInfoCardField, FalconInfoCardColumns } from '@falcon';
```

`[CODE]` Re-exported from the shared-ui barrel (`libs/falcon/src/shared-ui/index.ts:192-196`). Add `FalconInfoCardComponent` to the consuming standalone component's `imports: []`. Uses plain Angular templating (`<div>`/`<span>` + `<ng-content>`), so **no `CUSTOM_ELEMENTS_SCHEMA` is needed**.

## Inputs (all on `FalconInfoCardComponent`)

`[CODE]` falcon-info-card.component.ts:43-49 — **three** signal inputs.

| Name | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** (`input.required`) | `[CODE]` ts:43 — the card header text. **Already translated by the consumer** (ts:42 comment) — pass the resolved string, not an i18n key (the component does NOT pipe `translate`). Rendered in the bold header bar (html:13). |
| `fields` | `readonly FalconInfoCardField[]` | `[]` | `[CODE]` ts:46 — plain label/value fields, rendered in declaration order with `@for ... track f.label` (html:17). Each = `{ label, value, fullWidth? }`. |
| `columns` | `FalconInfoCardColumns` (`2 \| 3 \| 4`) | `4` | `[CODE]` ts:49 — grid column count at the `lg` breakpoint; responsive collapse to 1 (`grid-cols-1`) on mobile and 2 (`sm:grid-cols-2`) on small screens regardless of `columns` (html via `gridClass()`). |

> `[CODE]` No `subtitle`, no `loading`, no `bordered`/`flat` variant, no `dense` toggle. Minimal surface.

## Outputs

`[CODE]` **None.** No `@Output`/`output()`. It is a passive display component — it does not emit (no row clicks, no actions). Consumers that need interactive cells project an interactive control as an `<ng-content>` cell, which carries its own events.

## TypeScript types

`[CODE]` falcon-info-card.component.ts:24-31 (exported via the barrel):

```ts
export interface FalconInfoCardField {
  readonly label: string;       // already-translated label
  readonly value: string;       // already-translated/formatted value
  readonly fullWidth?: boolean; // spans all grid columns (col-span-full)
}

export type FalconInfoCardColumns = 2 | 3 | 4;
```

## Reflected props

None — single-render Angular component (no Stencil `@Prop({reflect})`). Host carries a static `block` class only (ts:39).

## Mutable props

None. All inputs are read-only signal inputs; no `model()`/two-way binding. The component holds no mutable state beyond the derived `gridClass()` computed.

## CVA / ngModel / Reactive Forms

`[CODE]` **None.** Not a form control — no `ControlValueAccessor`. It is **display-only** (ts:11/20 "DATA-FED, READ-ONLY. … No ngModel — display only."). To edit the data, use form controls elsewhere; info-card only shows it.

## Signal compatibility

`[CODE]` **Signals-first / zoneless-safe.** Inputs are `input.required()`/`input()`; the only derived value is `gridClass = computed<string>()` (ts:54-62). `OnPush` (ts:38). No lifecycle hooks, no subscriptions → nothing to tear down. Textbook Angular 21 component.

## Methods

`[CODE]` Only the derived `protected readonly gridClass = computed<string>(...)` (ts:54-62) — builds the full grid-container class string based on `columns()`. No public methods.

## Slots / template inputs

`[CODE]` falcon-info-card.component.html:27 — **one default `<ng-content />` slot.** Projected content is appended **into the same grid** after the `[fields]`-driven cells. This is how non-text cells (status chips, multi-selects) are mixed with plain fields.

`[CODE]` ts:11-17 — the documented convention for a projected cell is to wrap each in a grid cell matching the plain-field markup:

```html
<div class="flex flex-col gap-1 [col-span-full]">
  <span class="text-2xs text-falcon-neutral-500 …">Label</span>
  <custom-cell />
</div>
```

No `ng-template` inputs.

## Supported sizes / states / variants / appearances

`[CODE]` Fixed visual contract, only the `columns` axis:
- **Columns:** `2 | 3 | 4` (`columns` input) → `lg:grid-cols-{2,3,4}` (ts:55-60). Always `grid-cols-1` (mobile) + `sm:grid-cols-2` (small) below the `lg` breakpoint.
- **Per-field span:** `field.fullWidth` → `col-span-full` on that cell (html:18).
- **States:** none (no loading/error). **Variants/appearances:** none. **Sizes:** none (fixed padding/typography).

## Constraints

- `[CODE]` **`title` and `fields[].value/label` are pre-resolved strings** (ts:19/42) — the component does NOT translate them. Pass already-`| translate`d / formatted strings (the live consumers build `infoFields(tpl)` / `reviewFields()` with translation done in the TS). Passing an i18n key shows the raw key.
- `[CODE]` **`gridClass()` is built as ONE literal string** (ts:54-62, comment ts:51-53) — *"the responsive variant class names contain a colon and must be literal so Tailwind's JIT scanner picks them up."* Do not refactor into fragment concatenation that hides `lg:grid-cols-4` etc. from the `@source` scanner, or the grid columns silently break.
- `[CODE]` **Projected cells must be wrapped to match the grid** (ts:11-17) — a bare projected element won't get the `flex flex-col gap-1` cell layout or the label styling; the consumer must wrap each projected cell itself (the live templates-details does exactly this, html:89-110).
- `[CODE]` **`@for` tracks `f.label`** (html:17) — field labels must be unique within one card, or tracking/rendering misbehaves.
- `[CODE]` `[fields]` and `<ng-content>` cells share ONE grid (html:16-28) — plain fields render first (declaration order), projected cells after. Order is fields-then-projected; you cannot interleave a projected cell between two plain fields except via `fullWidth`/layout.

## Accessibility

`[CODE]` falcon-info-card.component.html:
- The header bar is a styled `<div>` (html:10-14), NOT a heading element (`<h2>`/`<h3>`) and has no `role="heading"`/`aria-level` — so AT does not announce it as a card title/heading (A1 GAP).
- Each field is a `<div>` with a label `<span>` (`text-2xs`, muted) + a value `<span>` (html:18-25) — there is no programmatic label↔value association (no `<dl><dt><dd>`, no `aria-labelledby`). AT reads them as adjacent text (A2 GAP).
- Dark mode is handled (`dark:bg-falcon-neutral-925`, `dark:text-falcon-neutral-0`, etc., html:8/11/19/22) — good contrast in both themes.
- No interactive elements of its own → no focus/keyboard concerns (projected interactive cells carry their own a11y).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-info-card.component.ts (63 ln) + .html (29 ln). 3 inputs (`title` required + `fields` + `columns`), no outputs, one default `<ng-content>` grid slot, `gridClass()` computed, no CVA, display-only. Pre-resolved-string + literal-grid-class + wrap-projected-cell constraints confirmed; header is a non-semantic `<div>` (a11y A1) and fields lack `<dl>` association (A2).
