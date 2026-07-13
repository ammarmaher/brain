# falcon-card — API

## Angular selector
`falcon-angular-card` — renders **pure-Angular `<div>` chrome** (NOT the Stencil element; see OVERVIEW Defect-A note).

## Stencil tags (React / Vue output targets only)
- Shadow DOM: `<falcon-card>` (`shadow: true`)
- Light DOM: `<falcon-card-tw>` (`scoped: true` — `[CODE]` falcon-card-tw.tsx:35-38, changed from `shadow:false` by Defect A so the slot polyfill preserves projected children)

## Import path
```ts
import { FalconAngularCardComponent } from '@falcon/ui-core';
```
`[CODE]` The wrapper does NOT set `CUSTOM_ELEMENTS_SCHEMA` (falcon-card.component.ts:24-29 — none needed, it renders plain Angular `<div>`s, not a custom element). This differs from status-badge/tag/input wrappers.

## Inputs (Angular wrapper)

`[CODE]` falcon-card.component.ts:32-58 — **7 wrapper inputs**:

| Name | Type | Default | Notes |
|---|---|---|---|
| `header` | `string \| null \| undefined` | `''` | `[CODE]` ts:32-36 — signal-backed (`_header`); coerces null → `''`. Renders an `<h3>` in the Angular `<header>`. **Also renders if you project `[slot=header]`** (both appear — footgun). |
| `subheader` | `string \| null \| undefined` | `''` | `[CODE]` ts:39-43 — signal-backed; renders a `<p>` under the header. |
| `footer` | `string \| null \| undefined` | `''` | `[CODE]` ts:46-50 — signal-backed; renders a `<span>` in the Angular `<footer>`. **Also renders if you project `[slot=footer]`.** |
| `variant` | `'default' \| 'flat' \| 'outlined'` | `'default'` | `[CODE]` ts:52 — drives `_variantClasses()`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `[CODE]` ts:53 — drives padding + radius + font-size. |
| `rootClass` | `string` | `''` | `[CODE]` ts:55 — caller-supplied extra Tailwind classes appended to the root `classes()` (the per-instance override channel — e.g. `border-falcon-error-200 bg-falcon-error-50`). |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:58 — **NO-OP**. Preserved for API compat; the wrapper always renders the Angular Tailwind chrome regardless (Defect A FIX). It does NOT switch to a Shadow path. |

## Stencil-only props (React / Vue — NOT on the Angular wrapper)

| Prop | Type | Available on |
|---|---|---|
| `ariaLabel` | `string \| undefined` | **Shadow `<falcon-card>` only** `[CODE]` falcon-card.tsx:34. When set (or `header` present) the root gets `role="region"` + `aria-label`. **The Angular wrapper does NOT replicate this `role="region"` logic** (GAP — the Angular `<div>` has no role). |

## Outputs
**None.** `[CODE]` Neither the wrapper nor the Stencil source declares any `@Output`/`@Event`. The card is a passive container — no click, no selection. (The registry's `falcon-click` does **not** exist in source.)

## TypeScript types
`[CODE]` falcon-card.types.ts:2-3 (and re-declared in the wrapper, falcon-card.component.ts:21-22):
```ts
export type FalconCardVariant = 'default' | 'flat' | 'outlined';
export type FalconCardSize = 'sm' | 'md' | 'lg';
```

## Slots / `ng-content` — PRECISE (corrected 2026-06-03)

`[CODE]` falcon-card.component.html — the Angular wrapper uses **native Angular `<ng-content>`** (NOT Stencil `<slot>`):

| Projection | Selector | Renders | Notes |
|---|---|---|---|
| Body | `<ng-content></ng-content>` (default) | `[CODE]` html:29 — inside the `<div [class]="bodyClasses()">` | The default, unselected slot. The dominant production usage (consumers put a `<div class="...p-4">` of content here). |
| Header | `<ng-content select="[slot=header]"></ng-content>` | `[CODE]` html:26 — rendered **right after** the prop-driven `<header>` block | Project an element carrying `slot="header"` for rich header content. |
| Footer | `<ng-content select="[slot=footer]"></ng-content>` | `[CODE]` html:37 — rendered after the prop-driven `<footer>` block | Project `slot="footer"` for rich footer content. |

**Header / footer double-render footgun (real, via the Angular template):** `[CODE]` html:16-26 — the prop-driven `@if (_header() || _subheader())` `<header>` AND the `<ng-content select="[slot=header]">` **both render**. If a consumer passes `[header]` AND projects `[slot=header]`, both appear. To use only a slot, leave the matching prop empty. (Same applies to `[footer]` + `[slot=footer]`, html:32-37.) This footgun also exists in the Stencil source for React/Vue (falcon-card.tsx:49-76).

> **CORRECTION:** the prior API.md described this as a Stencil-slot precedence issue ("the Stencil source renders BOTH the prop-driven header AND `<slot name=\"header\">`"). For the **Angular** path it is the *Angular template* that double-renders via `<ng-content select="[slot=header]">` — there is no Stencil slot involved in the Angular render.

## LIVE class helpers (NOT dead code)

`[CODE]` falcon-card.component.ts:63-95 — `classes()` / `bodyClasses()` / `headerClasses()` / `footerClasses()` are `computed()` signals **bound directly in the template** (html:15 `[class]="classes()"`, :17 `headerClasses()`, :28 `bodyClasses()`, :33 `footerClasses()`). They emit hardcoded Tailwind palette utilities (`bg-falcon-neutral-0 border border-falcon-neutral-150 shadow-sm`, `p-4`, `px-4 pt-4 pb-3`, `border-t border-falcon-neutral-150`). **These ARE the render** — the prior dossier's "dead code / legacy" claim is **wrong** for the Angular path. (They mirror `card-tailwind-classes.ts`, which backs the React/Vue `-tw` element.)

## Reflected props (Stencil — React/Vue)
`variant` + `size` are `@Prop({ reflect: true })` (falcon-card.tsx:15-18).

## CVA / signal compatibility
Not a form control. `[CODE]` Wrapper uses signal-backed setters for `header`/`subheader`/`footer` (null → `''`) + `OnPush`.

## Supported variants
`[CODE]` falcon-card.component.ts:97-103 / card-tailwind-classes.ts:26-36:
- `default` — `bg-falcon-neutral-0 border border-falcon-neutral-150 shadow-sm`.
- `flat` — `bg-falcon-neutral-0 border-0` — no border, no shadow.
- `outlined` — `bg-falcon-neutral-0 border border-falcon-neutral-200` — heavier border, no shadow.

## Supported sizes
`[CODE]` falcon-card.component.ts:71-95:
- `sm` — radius `rounded-md` (6px), body `p-3`, header `px-3 pt-3 pb-2`, footer `px-3 py-2`, font `text-[13px]`.
- `md` — radius `rounded-lg` (8px), body `p-4`, header `px-4 pt-4 pb-3`, footer `px-4 py-3`, font `text-sm` (default).
- `lg` — radius `rounded-[14px]`, body `p-6`, header `px-6 pt-6 pb-4`, footer `px-6 py-4`, font `text-[15px]`.

## Accessibility
- `[CODE]` Angular wrapper: the root `<div>` has **no `role`** and the header is a structural `<h3>` (html:19) — no `role="region"`/`aria-label` (unlike the Stencil Shadow source, which sets `role="region"` from `ariaLabel`/`header`). **GAP — the Angular path lacks the landmark a11y the Stencil path has.**
- `<h3>` heading level is fixed (no `headingLevel` input).

## Parts (Stencil Shadow — React/Vue only)
`root`, `header`, `header-title`, `header-subheader`, `body`, `footer`, `footer-text` (`[CODE]` falcon-card.tsx `part="…"`). **Not available on the Angular path** (no Shadow DOM, so `::part()` does not apply).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-card.component.ts (104 ln), .component.html (38 ln), falcon-card.tsx (82 ln), falcon-card-tw.tsx (83 ln), card-tailwind-classes.ts, .types.ts. **Corrected:** Angular wrapper renders pure-Angular `<div>` + `<ng-content>` (body default / `[slot=header]` / `[slot=footer]`); `computed()` helpers are LIVE (bound in template); `useTailwind` is a no-op; double-header footgun is via the Angular template; `role="region"` is Shadow-only (Angular GAP); Stencil pair + `::part()` are React/Vue-only.
