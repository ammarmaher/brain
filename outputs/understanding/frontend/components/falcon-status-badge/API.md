# falcon-status-badge — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-status-badge>` (tag `'falcon-status-badge'`, `shadow: true`) |
| Stencil Light | `<falcon-status-badge-tw>` (tag `'falcon-status-badge-tw'`, `shadow: false`) |
| Angular wrapper | `<falcon-angular-status-badge>` |

## Import

```ts
import { FalconAngularStatusBadgeComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-status-badge';
// or via barrel: import { FalconAngularStatusBadgeComponent } from '@falcon/ui-core';
```

`[CODE]` `CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper internally (falcon-status-badge.component.ts:41) — the host component does NOT need it.

## Inputs (Angular wrapper)

`[CODE]` falcon-status-badge.component.ts:43-70 — **5 wrapper inputs**:

| Input | Type | Default | Notes |
|---|---|---|---|
| `severity` | `FalconStatusBadgeSeverity` | `'active'` | `[CODE]` ts:45-51 — setter coerces `null`/`undefined` → `'active'`; signal-backed (`_severity`). 9 values — see types. |
| `label` | `string \| null \| undefined` | `''` | `[CODE]` ts:54-60 — setter coerces null → `''`; signal-backed (`_label`). Consumer translates the text. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `[CODE]` ts:63 — plain input. |
| `dot` | `boolean` | `true` | `[CODE]` ts:67 — plain input. Leading severity-tinted dot. |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:70 — render-path switch. `true` → `<falcon-status-badge-tw>` (Light DOM). `false` → `<falcon-status-badge>` (Shadow DOM). |

## Stencil-only props (NOT on the Angular wrapper)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `ariaLabel` | `string \| undefined` | `undefined` | **Shadow `<falcon-status-badge>` only** `[CODE]` falcon-status-badge.tsx:30 (NOT on `-tw`, NOT on the wrapper — GAP FSB-03). For dot-only badges with no visible text. |
| `rootExtraClass` | `string \| undefined` | `undefined` | **Light `<falcon-status-badge-tw>` only** `[CODE]` falcon-status-badge-tw.tsx:30. Caller class extension on the root pill (the wrapper does NOT surface it). |

> `[CODE]` Both Stencil tags reflect `severity` / `size` / `dot` (`@Prop({ reflect: true })`). The Shadow tag additionally accepts `label` + `ariaLabel`; the `-tw` tag accepts `label` + `rootExtraClass`.

## Outputs / Events

**NONE** — presentational. `[CODE]` Neither the wrapper nor either Stencil tag declares an `@Event`/`@Output`. No CVA, no events.

## TypeScript types

`[CODE]` falcon-status-badge.types.ts:6-17 (and a **duplicate** re-declaration in the wrapper, falcon-status-badge.component.ts:23-34 — GAP FSB-04):

```ts
type FalconStatusBadgeSeverity =
  | 'active'      // success bucket
  | 'paid'        // success bucket
  | 'pending'     // warning bucket
  | 'suspended'   // neutral bucket
  | 'locked'      // neutral bucket
  | 'deleted'     // danger bucket
  | 'inactive'    // neutral bucket
  | 'paid'        // (listed once)
  | 'expired'     // danger bucket
  | 'disabled';   // neutral bucket
type FalconStatusBadgeSize = 'sm' | 'md' | 'lg';
```

(The wrapper re-declares the same 9-member union + `FalconStatusBadgeSize` rather than importing from the types file — verified identical, FSB-04.)

## Severity → visual bucket map (per `status-badge.tokens.css` + `falcon-status-badge.css`)

`[CODE]` status-badge.tokens.css:33-73 + falcon-status-badge.css:32-95 (Shadow) / status-badge-tailwind-classes.ts:43-96 (`-tw`):

| Severity | Bucket | bg token | fg token | dot token |
|---|---|---|---|---|
| `active`, `paid` | **Success** (green) | `--falcon-status-badge-active-bg` (`green-200`) | `--falcon-status-badge-active-fg` (`green-700`) | `--falcon-status-badge-active-dot-bg` (`green-500`) |
| `pending` | **Warning** (amber) | `--falcon-status-badge-pending-bg` (`amber-50`) | `…-pending-fg` (`amber-700`) | `…-pending-dot-bg` (`amber-500`) |
| `suspended`, `locked`, `inactive`, `disabled` | **Neutral** (grey) | `--falcon-status-badge-inactive-bg` (`neutral-175`) | `…-inactive-fg` (`neutral-700`) | `…-inactive-dot-bg` (`neutral-500`) |
| `deleted`, `expired` | **Danger** (red) | `--falcon-status-badge-danger-bg` (`red-100`) | `…-danger-fg` (`red-700`) | `…-danger-dot-bg` (`red-500`) |

> Both render paths agree on the bucket map: the Shadow CSS targets `[data-severity='…']`; the `-tw` Tailwind helper switches on the same 9 severities into the same 4 buckets. **Parity OK.**

## Slots / `ng-content`

`[CODE]` falcon-status-badge.component.html:14 / 23 — the wrapper projects `<ng-content>` in **both** render paths. The Stencil tags render `<slot>{this.label}</slot>` (falcon-status-badge.tsx:44 / falcon-status-badge-tw.tsx:51), so **projected content overrides the `[label]` prop**. An Angular consumer CAN put markup (e.g. icon + text) inside the badge when they do not use `[label]`.

- No `ng-template` inputs on the wrapper.

## Reflected props (Stencil)

`severity`, `size`, `dot` (`@Prop({ reflect: true })`) so `[data-severity]`/`:host([size='lg'])` CSS rules target them.

## CVA

NO — not a form control.

## Supported sizes / variants

- **Size:** `sm` (10px font, 60px min-width, 5px dot), `md` (12px font, 74px min-width, 6px dot, **default**), `lg` (13px font, 88px min-width, 8px dot). `[CODE]` status-badge.tokens.css:78-90.
- **With/without dot:** `[dot]="true|false"`.

## Accessibility

- `[CODE]` falcon-status-badge.tsx:40 — Shadow tag sets `aria-label` from the `ariaLabel` prop on the root `<span>` (dot-only mode). **The `-tw` twin and the Angular wrapper do NOT expose it** (FSB-03).
- `[CODE]` falcon-status-badge.tsx:42 / falcon-status-badge-tw.tsx:49 — the dot `<span>` is `aria-hidden="true"` (decorative).
- `[CODE]` falcon-status-badge.component.ts:74 — wrapper host class `'falcon-angular-status-badge inline-flex align-middle'` for inline placement.
- Color buckets are WCAG-AA contrast-tested against the React V0.2 reference (per token-file spec source comment).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-status-badge.component.ts (80 ln), .component.html (25 ln), falcon-status-badge.tsx (50 ln), falcon-status-badge-tw.tsx (57 ln), .types.ts, status-badge-tailwind-classes.ts, status-badge.tokens.css. Confirmed: 5 wrapper inputs, NO outputs/CVA, `<ng-content>` in both paths overrides `[label]`, `ariaLabel` Shadow-only (FSB-03), severity type re-declared in wrapper (FSB-04), both render paths share the 9→4 bucket map.
