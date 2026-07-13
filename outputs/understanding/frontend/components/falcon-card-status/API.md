# falcon-card-status — API

## Selectors

- Angular: `falcon-angular-card-status` (renders pure-Angular chrome — does NOT mount the Stencil element).
- Stencil (React/Vue only): `<falcon-card-status>` (tag `'falcon-card-status'`, **`scoped: true`**, no `styleUrl`).
- Stencil `-tw` twin: **none.**

## Import

```ts
import {
  FalconAngularCardStatusComponent,
  type FalconCardStatusType,
} from '@falcon/ui-core/angular';
// or via the root barrel:
import { FalconAngularCardStatusComponent } from '@falcon/ui-core';
```

`[CODE]` Add `FalconAngularCardStatusComponent` to the consuming standalone component's `imports: []`. **Note:** the Angular wrapper does NOT declare `CUSTOM_ELEMENTS_SCHEMA` (component.ts:45-50) — because it renders plain Angular `<div>`s, not a custom element, the schema is unnecessary (contrast: every tag-switcher wrapper sets it). `comm-mkt-card` imports it directly with no schema.

## Inputs (on `FalconAngularCardStatusComponent`)

`[CODE]` falcon-card-status.component.ts:52-72 — **3 inputs**; `status` and `size` are **signal-backed `@Input() set`/`get` pairs** (null/undefined coerce to the default); `rootClass` is a plain `@Input()`:

| Name | Type | Default | Notes |
|---|---|---|---|
| `status` | `'active' \| 'expired' \| 'disabled' \| 'inactive' \| null \| undefined` | `'inactive'` | **Presentation bucket** — drives ONLY the root border tone. `null`/`undefined` → `'inactive'` (the fallback bucket). Signal-backed. Bound as `[attr.data-status]` + fed into `rootClasses()`. |
| `size` | `'sm' \| 'md' \| 'lg' \| null \| undefined` | `'md'` | Padding + gap triad. `md` mirrors the SoT card (18px 20px / gap 14px). `null`/`undefined` → `'md'`. Signal-backed. Bound as `[attr.data-size]` + fed into `rootClasses()`. |
| `rootClass` | `string` | `''` | Caller-supplied extra classes (token overrides, custom paddings) **appended** to the computed root class string. |

> `[CODE]` `status` is NOT a behavioural flag — it is purely the border color. The caller maps its domain enum down to one of the 4 buckets (comm-mkt-card `cardStatus()`: `Active→active`, `Expired→expired`, `Disabled→disabled`, else `inactive`).

## Stencil props (React/Vue path — `<falcon-card-status>`)

`[CODE]` falcon-card-status.tsx:45-52 — `@Prop({ reflect: true }) status` (`'inactive'` default), `@Prop({ reflect: true }) size` (`'md'`), `@Prop() rootClass`. **Prop-parity with the Angular wrapper** (same 3 props). The Stencil component reflects `status`/`size` to host attributes; the Angular wrapper writes them as `data-*` on its inner root `<div>`.

## Outputs

**None.** `[CODE]` The card emits nothing — it is presentation-only. Action events come from the caller-projected buttons (e.g. `comm-mkt-card`'s `<falcon-angular-button (falconClick)>`), NOT from the card.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-card-status/falcon-card-status.types.ts`:

```ts
export type FalconCardStatusType = 'active' | 'expired' | 'disabled' | 'inactive';
export type FalconCardStatusSize = 'sm' | 'md' | 'lg';
```

> `[CODE]` **Drift note:** the Angular wrapper RE-DECLARES these two unions inline (component.ts:42-43) instead of importing them from the types file — verified identical today, but a silent-drift risk (same pattern flagged for `falcon-status-badge` FSB-04 in B10). The Stencil component DOES import them from the types file (tsx:22-25).

## Reflected props

`[CODE]` Stencil path: `status`, `size` are `@Prop({ reflect: true })`. Angular path: the wrapper writes `[attr.data-status]="_status()"` + `[attr.data-size]="_size()"` on the inner root `<div>` (html:18) — data-attributes, used as a styling/testing hook (the actual visual tone comes from the computed Tailwind classes, not from a `[data-status]` CSS selector).

## Mutable props (Stencil)

**None.** No `@Prop({ mutable: true })`, no `@Watch`.

## CVA / ngModel / Reactive Forms

**Not applicable** — the card captures no value.

## Signal compatibility

`[CODE]` falcon-card-status.component.ts — the Angular wrapper is **signals-first**: `_status` / `_size` are `signal<…>()` written by `@Input() set`; `rootClasses` is a `computed<string>()` combining `falconCardStatusRootClasses({status, size})` + `rootClass`; `topClasses`/`bodyClasses`/`actionsClasses` are computed once (the latter three take no args). `OnPush` enforced (component.ts:49).

## Methods

**None.** No `@Method()` on the Stencil component; no public method on the wrapper.

## Slots / content projection

`[CODE]` **5 named/default slots**, identical on both paths (Angular `<ng-content select="[slot=…]">` mirrors the Stencil `<slot name="…">`):

| Slot | Position | Intended content |
|---|---|---|
| `media` | top-left, 34px column | leading icon / service glyph |
| `title` | top-center, stretches (1fr) | card title (+ optional subtitle) |
| `status` | top-right, align-end (`auto`) | status badge / price column |
| _(default)_ | body | description + dates band + pending band |
| `actions` | **guaranteed bottom-right** (`mt-auto justify-end`) | caller-owned action buttons |

`[CODE]` Angular template (html:18-35): root `<div [class]="rootClasses()" [attr.data-status] [attr.data-size]>` → top `<div [class]="topClasses">` with the three top slots → body `<div [class]="bodyClasses">` with the default `<ng-content>` → actions `<div [class]="actionsClasses">` with `slot="actions"`.

## Layout contract (the chrome it owns)

`[CODE]` card-status-tailwind-classes.ts:
- **Root:** `flex flex-col h-full min-h-0`, white surface (`--falcon-card-status-bg`), 1px solid border, `rounded-[--falcon-card-status-radius]` (14px), `transition-[border-color,box-shadow]`, `hover:shadow-[--falcon-card-status-hover-shadow]`, plus per-size padding+gap, plus the per-status **border color** (the only status-driven class).
- **Top:** `grid grid-cols-[--falcon-card-status-top-cols] items-center` (cols = `34px 1fr auto`).
- **Body:** `flex flex-col gap-[--falcon-card-status-gap] min-h-0`.
- **Actions:** `flex flex-wrap mt-auto justify-end gap-[--falcon-card-status-actions-gap]`.

## Supported statuses / sizes

- **Statuses (border tone only):** `active` → teal-600 (#104C54) · `expired` → red (#FF0C0C) · `disabled` → neutral-150 (#E8EAED) · `inactive` → neutral-150 (default/fallback).
- **Sizes (padding + gap):** `sm` (12px 14px / gap 10px) · `md` (18px 20px / gap 14px — default, SoT) · `lg` (22px 24px / gap 16px).

## Constraints

- `[CODE]` **Angular path ≠ Stencil path.** `<falcon-angular-card-status>` renders Angular chrome; `::part()` / Shadow styling is unavailable; there is NO `useTailwind` input. The Stencil `<falcon-card-status>` is React/Vue-only. Do NOT "fix" the wrapper to mount the Stencil element — it would re-break interactive button projection under zoneless CD.
- `[CODE]` **`status` is presentation, not behaviour** — it never gates an action; the caller owns visibility/permission on each projected button.
- `[CODE]` **The card guarantees the action AREA, not the buttons** — an empty `slot="actions"` renders an empty (but reserved) footer.
- `[CODE]` Override visuals via `--falcon-card-status-*` tokens (host class) or the `rootClass` input — never hardcode hex/px in the consumer.

## Accessibility

- `[CODE]` **No `role` / `aria-label` on the root** `<div>` (component.html:18) — the card is a presentational container; the caller's projected content (title text, badge, buttons) carries the semantics. (A named-region landmark is not provided — same gap class as falcon-card FC-A11Y-1; here it is lower-impact since the card is a grid tile, not a labelled section.)
- `[CODE]` No focus management — the card itself is not interactive; the projected buttons own their own focus/keyboard behaviour.
- The `data-status`/`data-size` attributes are styling/test hooks, not ARIA.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11) against falcon-card-status.component.ts (85 ln), .component.html (35 ln), .tsx (83 ln), .types.ts (17 ln), card-status-tailwind-classes.ts (91 ln). 3 inputs (status/size signal-backed, rootClass plain), 0 outputs, 0 methods, 5 slots. Angular path = pure-Angular chrome (no schema, no `useTailwind`, no Stencil element). Union re-declaration in wrapper noted as drift risk.
