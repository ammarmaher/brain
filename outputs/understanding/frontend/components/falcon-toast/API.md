# falcon-toast — API

## Selectors

- Angular toast: `falcon-angular-toast`
- Angular host: `falcon-angular-toast-host`
- Stencil Shadow: `<falcon-toast>` (tag `'falcon-toast'`, `shadow: true`) / `<falcon-toast-host>` (`'falcon-toast-host'`, `shadow: true`)
- Stencil Light: `<falcon-toast-tw>` (`'falcon-toast-tw'`, `shadow: false`) / `<falcon-toast-host-tw>` (`'falcon-toast-host-tw'`, `shadow: false`)

## Import

```ts
import {
  FalconAngularToastComponent,
  FalconAngularToastHostComponent,
} from '@falcon/ui-core/angular';
```

`[CODE]` Both wrappers declare `CUSTOM_ELEMENTS_SCHEMA` internally (`[CODE]` falcon-toast.component.ts:28 / falcon-toast-host.component.ts:20). Each calls `defineFalconTwComponent('falcon-toast')` / `('falcon-toast-host')` in `ngOnInit` to register the Stencil tags on-demand (Wave 5) (`[CODE]` falcon-toast.component.ts:33 / falcon-toast-host.component.ts:25).

## Inputs — `FalconAngularToastComponent` (`[CODE]` falcon-toast.component.ts:36-46)

| Name | Type | Default | Notes |
|---|---|---|---|
| `severity` | `FalconToastSeverity` (`'info' \| 'success' \| 'warning' \| 'error'`) | `'info'` | Drives icon glyph + icon-chip color + ARIA role/live. Reflected on the Stencil tag. |
| `title` | `string \| undefined` | `undefined` | Bold first line; node omitted when unset. |
| `message` | `string \| undefined` | `undefined` | Secondary line; node omitted when unset. Rendered as TEXT, not HTML. |
| `duration` | `number` | `5000` | Auto-dismiss delay (ms). `<= 0` disables auto-dismiss (`[CODE]` falcon-toast.tsx:79). |
| `dismissible` | `boolean` | `true` | Renders the × close button. Reflected. |
| `icon` | `string \| undefined` | `undefined` | Custom icon class replacing the built-in severity SVG (`[CODE]` falcon-toast.tsx:154). |
| `actionLabel` | `string \| undefined` | `undefined` | Renders an inline action affordance when set. |
| `actionHref` | `string \| undefined` | `undefined` | With `actionLabel` → action is `<a target="_blank" rel="noopener">`; without → `<button>` (`[CODE]` falcon-toast.tsx:160-182). |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-toast-tw>` (Light DOM). `false` → `<falcon-toast>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Extra class forwarded to the Stencil tag via `[class]` (BOTH paths) (`[CODE]` html:12/28). |

## Inputs — `FalconAngularToastHostComponent` (`[CODE]` falcon-toast-host.component.ts:28-33)

| Name | Type | Default | Notes |
|---|---|---|---|
| `position` | `FalconToastHostPosition` (6 values) | `'top-right'` | Viewport anchor. Reflected. Bottom positions stack `column-reverse`. |
| `gap` | `number \| undefined` | `undefined` | Per-instance stack gap (px) → sets `--falcon-toast-stack-gap` inline in `componentWillLoad` (`[CODE]` falcon-toast-host.tsx:20-25). |
| `maxToasts` | `number \| undefined` | `undefined` | `[CODE]` **Declared but UNUSED** — neither host `.tsx` reads it (no clamp). GAP G2. |
| `useTailwind` | `boolean` | `true` | Render-path switch (`<falcon-toast-host-tw>` vs `<falcon-toast-host>`). |
| `rootClass` | `string` | `''` | Extra class forwarded via `[class]`. |

## Outputs — `FalconAngularToastComponent` (`[CODE]` falcon-toast.component.ts:48-49)

| Name | Payload | Notes |
|---|---|---|
| `(falconDismiss)` | `FalconToastDismissDetail` (`{ reason: 'auto-dismiss' \| 'user' \| 'programmatic' }`) | Re-emitted from Stencil `falcon-dismiss`; wrapper guards `if (detail)` (`[CODE]` ts:53-56). Reasons: auto timer / × click (`'user'`) / `dismiss()` (`'programmatic'`). |
| `(falconActionClick)` | `FalconToastActionClickDetail` (`{ nativeEvent: MouseEvent }`) | Re-emitted from Stencil `falcon-action-click` (`[CODE]` falcon-toast.tsx:105-107). |

> `[CODE]` `FalconAngularToastHostComponent` has **NO outputs and NO methods** — pure container/positioner.

## Stencil events (raw tag)

`[CODE]` Both `<falcon-toast>` + `<falcon-toast-tw>` emit `falcon-dismiss` + `falcon-action-click` (`bubbles:true, composed:true`) (`[CODE]` falcon-toast.tsx:42-45 / falcon-toast-tw.tsx:48-51). The wrapper template binds both on BOTH branches (`[CODE]` html:13-14/29-30). **Full event parity Shadow↔tw.**

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.types.ts`:

```ts
type FalconToastSeverity = 'info' | 'success' | 'warning' | 'error';
type FalconToastHostPosition =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';
interface FalconToastDismissDetail { readonly reason: 'auto-dismiss' | 'user' | 'programmatic'; }
interface FalconToastActionClickDetail { readonly nativeEvent: MouseEvent; }
```

All four are re-exported from the Angular barrel (`[CODE]` index.ts:4-9) and from `@falcon`.

## Reflected props (Stencil)

`[CODE]` `severity` + `dismissible` reflect on `<falcon-toast>`/`-tw` (`.severity-{x}` class + `:host` rules); `position` reflects on `<falcon-toast-host>`/`-tw` (`:host([position='…'])` + `data-position`). `[CODE]` falcon-toast.tsx:31/35, falcon-toast-host.tsx:16.

## CVA / ngModel / Reactive Forms

**NONE.** `[CODE]` Neither wrapper implements `ControlValueAccessor` — toast is a presentational notification, not a form control.

## Signal compatibility

`[CODE]` Both wrappers use classic `@Input()` decorators + `@HostBinding` (NOT the new `input()`/`output()` signal API) (`[CODE]` falcon-toast.component.ts:36-51). `OnPush` enforced. (Contrast `<falcon-angular-notification>`, which IS signal-input-based — see that dossier.)

## Methods (Stencil only — via element ref)

| Method | Description | Available on |
|---|---|---|
| `dismiss()` | Programmatically dismiss → emits `falcon-dismiss` `{ reason: 'programmatic' }` | BOTH toast tags (`[CODE]` falcon-toast.tsx:65-69 / falcon-toast-tw.tsx:70-74) |

> `[CODE]` The Angular wrapper does NOT proxy `dismiss()` (GAP G1). The host has no methods.

## Slots / ng-content

`[CODE]` Both toast paths project two slots: default `<slot />` (extra body content after title/message) + `<slot name="action" />` (after the built-in action) (`[CODE]` falcon-toast.tsx:159/183 / falcon-toast-tw.tsx:165/187). Wrapper forwards via `<ng-content>` + `<ng-content select="[slot=action]">` (`[CODE]` html:15-16/31-32). The host projects a single default `<slot />` into the stack (`[CODE]` falcon-toast-host.tsx:41 / falcon-toast-host-tw.tsx:36) → forwarded via `<ng-content>`. **Full slot parity Shadow↔tw.**

## Parts (Stencil Shadow only)

`[CODE]` falcon-toast.tsx — `part="root"`, `part="icon"`, `part="body"`, `part="title"`, `part="message"`, `part="action"`, `part="dismiss"`; host `part="stack"` (`[CODE]` falcon-toast-host.tsx:36). The `-tw` twins emit NO `part=` attrs (Light DOM — styled via Tailwind helper classes instead) — expected divergence, not a gap.

## Supported severities / positions

- Severities: `info` (sky-blue chip), `success` (green), `warning` (amber), `error` (red) — built-in SVG glyph + icon-chip color tokens per severity.
- Host positions: 6 (top/bottom × left/center/right). Bottom positions flip to `column-reverse` (`[CODE]` falcon-toast-host.css:32/38/44).

## Constraints

- `[CODE]` `maxToasts` declared but never enforced (GAP G2).
- `[CODE]` Auto-dismiss lives in the Stencil component (`scheduleAutoDismiss` + `remainingMs` pause/resume), NOT the wrapper. Hover + focus pause built in (`[CODE]` falcon-toast.tsx:87-98).
- `[CODE]` `actionHref` opens in a NEW tab only (`target="_blank"`); no same-tab option.
- `[CODE]` Wrappers pass props as `[attr.*]` strings; `dismissible ? '' : null` is the boolean-attr idiom (`[CODE]` html:4).

## Accessibility

- `[CODE]` Toast `<Host>` gets `role` = `'alert'` (warning/error) else `'status'`, and `aria-live` = `'assertive'` (warning/error) else `'polite'` (`[CODE]` falcon-toast.tsx:132-133, mirrored in falcon-toast-tw.tsx:142-143). **Parity.**
- `[CODE]` × button `aria-label="Dismiss"` (`[CODE]` falcon-toast.tsx:190 / falcon-toast-tw.tsx:193) — hardcoded English, no i18n bridge (GAP).
- `[CODE]` Severity icon `<span>` `aria-hidden="true"` (`[CODE]` falcon-toast.tsx:153 / falcon-toast-tw.tsx:159).
- `[CODE]` Shadow host is a landmark: `role="region" aria-label="Notifications" aria-live="polite" aria-atomic="false"` (`[CODE]` falcon-toast-host.tsx:33-40). **The `-tw` host renders a bare `<div>` with NO region role/aria** (`[CODE]` falcon-toast-host-tw.tsx:35) — a11y parity gap, GAP G3.
- `[CODE]` `prefers-reduced-motion: reduce` disables the slide-in on the Shadow toast (`[CODE]` falcon-toast.css:159-166); the `-tw` twin has no reduced-motion override.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against falcon-toast.component.ts (62 ln), falcon-toast-host.component.ts (36 ln), falcon-toast.component.html (34 ln), falcon-toast.tsx (208 ln), falcon-toast-tw.tsx (211 ln), falcon-toast-host.tsx (46 ln), falcon-toast-host-tw.tsx (41 ln), falcon-toast.types.ts. Corrected vs prior dossier: 2 `@Output`s confirmed; `maxToasts` flagged UNUSED; `-tw` host missing region-role a11y gap added; parts are Shadow-only.
