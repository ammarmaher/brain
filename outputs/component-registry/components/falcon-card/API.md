# falcon-card — API

## Angular selector
`falcon-angular-card`

## Stencil tags
- Shadow DOM: `<falcon-card>`
- Light DOM: `<falcon-card-tw>`

## Import path
```ts
import { FalconAngularCardComponent } from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `header` | `string \| null \| undefined` | `''` | Plain text header. Overridden by content projected into `slot="header"`. |
| `subheader` | `string \| null \| undefined` | `''` | Plain text subheader below the header. |
| `footer` | `string \| null \| undefined` | `''` | Plain text footer. Overridden by `slot="footer"` content. |
| `variant` | `'default' \| 'flat' \| 'outlined'` | `'default'` | `default` = bg + border + shadow. `flat` = bg only. `outlined` = bg + border, no shadow. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Drives padding + radius + font-size tokens. |
| `rootClass` | `string` | `''` | Caller-supplied extra class on the inner root. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |

## Outputs
**None.** The card is a passive container — no click events, no selection events. (The registry incorrectly lists `falcon-click`; the actual source has no such emitter.)

## TypeScript types
```ts
export type FalconCardVariant = 'default' | 'flat' | 'outlined';
export type FalconCardSize = 'sm' | 'md' | 'lg';
```

(Both Angular wrapper + Stencil source re-export these.)

## Reflected props (Stencil)
`variant` and `size` are reflected.

## Stencil methods
None.

## Slots

| Slot name | Purpose |
|---|---|
| (default) | Body content. |
| `header` | Rich header content (icons + title + action buttons in one row, etc.) — overrides the plain text `header` / `subheader` props. |
| `footer` | Rich footer content — overrides the plain text `footer` prop. |

**Important — header slot precedence:**
The Stencil source renders BOTH the prop-driven header AND a `<slot name="header">` simultaneously (lines 49-63 of `falcon-card.tsx`). If you project a `slot="header"` element AND also pass a `header` prop, BOTH render. To use only a slot, leave `header` empty.

## CVA support
Not applicable.

## Signal compatibility
The wrapper uses internal `signal<string>()` for `header`, `subheader`, `footer` (lines 31-49) and `computed()` helpers for legacy class strings (`classes`, `bodyClasses`, `headerClasses`, `footerClasses`). These are emitted as ng-class-friendly strings when the LEGACY rendering mode was used; today the dual-render Stencil path takes over.

Notable: `_header`, `_subheader`, `_footer` setters coerce null/undefined to empty string — safe for `[header]="someNullable | translate"`.

## Supported variants
- `default` — `bg-white border border-falcon-neutral-150 shadow-sm` (Tailwind path); shadow `0 1px 3px rgba(0,0,0,0.07)` (token).
- `flat` — `bg-white border-0` — no border, no shadow.
- `outlined` — `bg-white border border-falcon-neutral-200` — heavier border, no shadow.

## Supported sizes
- `sm` — radius 6px, body padding 12px, font-size 13px.
- `md` — radius 8px, body padding 16px, font-size 14px (default).
- `lg` — radius 14px, body padding 24px, font-size 15px.

## Accessibility attributes
- When `ariaLabel` OR `header` is provided, the root `<div>` gets `role="region"` + `aria-label` (lines 36-37 of `falcon-card.tsx`).
- Otherwise the card is decoratively unannounced — appropriate when it's "just a box."
- The `<h3>` inside is the structural header; no `id`-based aria linkage (the prop-only `aria-label` covers it).

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `root` | Outer container `<div>`. |
| `header` | Header section. |
| `header-title` | `<h3>` inside header. |
| `header-subheader` | `<p>` inside header. |
| `body` | Body container. |
| `footer` | Footer section. |
| `footer-text` | `<span>` inside footer. |
