# falcon-drawer — API

## Selectors
- Angular: `falcon-angular-drawer`
- Stencil Shadow: `<falcon-drawer>` (tag `'falcon-drawer'`, `shadow: true`)
- Stencil Light: `<falcon-drawer-tw>` (tag `'falcon-drawer-tw'`, `shadow: false`) — **default** (`useTailwind=true`)

## Import
```ts
import { FalconAngularDrawerComponent } from '@falcon/ui-core/angular';
// or via barrel:
import { FalconAngularDrawerComponent } from '@falcon/ui-core';
```
`[CODE]` falcon-drawer.component.ts:38 — `schemas: [CUSTOM_ELEMENTS_SCHEMA]` set on the wrapper internally; host does NOT need it. Wrapper `imports: [FalconOverlayDirective]` (`[CODE]` :34) to drive the native `<dialog>` Top Layer.

## Inputs (all on `FalconAngularDrawerComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | `[CODE]` ts:48-57 — getter/setter that ALSO writes an internal `openSignal` (read by `[falconOpen]` on the native `<dialog>`). Two-way via `(openChange)`. |
| `position` | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` | Side anchor. Right/left → width; top/bottom → height. **Physical, not logical** (does NOT auto-swap under RTL — but the Stencil overlay's `justify-content` flips with `dir` — see TOKENS RTL). |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Width (right/left) or height (top/bottom). Token-driven — sides: sm 320 / md 480 / lg 640 / xl 800 px; edges: sm 240 / md 360 / lg 480 / xl 640 px. |
| `closable` | `boolean` | `true` | Renders the close × button in the header. |
| `dismissable` | `boolean` | `true` | Allow Esc / backdrop dismissal. **a-spelling** — the dialog's equivalent is `dismissible` (i-spelling). Cross-component trap (GAP G-SPELL). `[CODE]` ts:100-102 — ALSO mirrored onto the native `<dialog>` `cancel` event (`preventDefault()` when false). |
| `modal` | `boolean` | `true` | Backdrop blocks underlying clicks (`true`) or click-through (`false`). `[CODE]` falcon-drawer.tsx:107-109 — `modal=false` ALSO does not dismiss on outside click (no "show-backdrop-but-click-through" mode — GAP G-BACKDROP-MODE). |
| `header` | `string \| undefined` | `undefined` | Plain text header. Overridden by `slot="header"`. |
| `ariaLabel` | `string \| undefined` | `undefined` | `aria-label` on the panel when no `header`. |
| `useTailwind` | `boolean` | `true` | Render-path switch. `true` → `<falcon-drawer-tw>` (Light). `false` → `<falcon-drawer>` (Shadow). |
| `rootClass` | `string` | `''` | Caller-supplied extra class, forwarded as `[class]` on the Stencil tag. |

### Stencil-only props (NOT exposed on Angular wrapper)

| Prop | Type | Default | Available on | Notes |
|---|---|---|---|---|
| `closeAriaLabel` | `string` | `'Close'` | BOTH tags `[CODE]` falcon-drawer.tsx:44 / falcon-drawer-tw.tsx:49 | Close × `aria-label`. Wrapper does NOT surface it → stuck English (GAP G-A11Y-LABEL). |

> `[CODE]` Reflected/mutable `open: boolean` (`@Prop({ mutable: true, reflect: true })`, `@Watch`ed) drives `afterOpenSideEffects`/`afterCloseSideEffects`. The Angular wrapper drives it via `[attr.open]` + the native `<dialog>` — do not bind the Stencil prop directly.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(drawerShow)` | `FalconDrawerShowDetail` (`{ source: 'programmatic' \| 'attribute' }`) | `[CODE]` ts:76-79 — re-emitted from Stencil `falconDrawerShow`. |
| `(drawerHide)` | `FalconDrawerHideDetail` (`{ reason: 'close-button' \| 'backdrop' \| 'escape' \| 'programmatic' }`) | `[CODE]` ts:81-86 — re-emitted from Stencil `falconDrawerHide`; ALSO sets `this.open=false` + emits `openChange`. |
| `(openChange)` | `boolean` | Two-way `[(open)]` sugar — always emits `false` on hide. |

> `[CODE]` Note the Stencil event names are **camelCase** (`falconDrawerShow`/`falconDrawerHide`), unlike the dialog's dash-separated `falcon-open`/`falcon-close`. The wrapper template binds `(falconDrawerShow)`/`(falconDrawerHide)` accordingly (falcon-drawer.component.html:32-33).
> `[CODE]` ts:91-95 — `onNativeDialogClose()` and `onNativeDialogCancel()` are **internal** handlers bound to the native `<dialog>` `(falconClose)`/`(falconCancel)` directive outputs; they only sync the `open` signal.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.types.ts`:
```ts
type FalconDrawerPosition = 'right' | 'left' | 'top' | 'bottom';
type FalconDrawerSize = 'sm' | 'md' | 'lg' | 'xl';
interface FalconDrawerShowDetail { readonly source: 'programmatic' | 'attribute'; }
interface FalconDrawerHideDetail { readonly reason: 'close-button' | 'backdrop' | 'escape' | 'programmatic'; }
```

## Reflected props (Stencil only)
`open`, `position`, `size`, `closable`, `modal` are reflected to host attributes (`:host([position='right'])`, `:host([size='lg'])`, etc.). (`dismissable`, `header`, `ariaLabel`, `closeAriaLabel` are NOT reflected.)

## Mutable props (Stencil)
`open` is `@Prop({ mutable: true, reflect: true })` and `@Watch`ed.

## CVA / ngModel / Reactive Forms
**Not applicable** — drawer is a presentational container.

## Signal compatibility
`[CODE]` ts:48-57 — wrapper uses **classic `@Input()` decorators** PLUS one internal `openSignal` feeding the native `<dialog>`'s `[falconOpen]`. `OnPush` (ts:37).

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `show(): Promise<void>` | Programmatic open. | BOTH tags `[CODE]` falcon-drawer.tsx:71-74 / falcon-drawer-tw.tsx:75-78 |
| `hide(): Promise<void>` | Programmatic close (`dispatchHide('programmatic')`). | BOTH tags `[CODE]` falcon-drawer.tsx:77-80 / falcon-drawer-tw.tsx:80-83 |

> `[CODE]` The Angular wrapper does NOT proxy these — drive via `[open]`/`[(open)]` (GAP G-METHOD).

## Slots / ng-content
`[CODE]` falcon-drawer.component.html:34-36 / 51-53 — the wrapper projects THREE `<ng-content>` outlets into BOTH render paths:
- **(default)** → drawer body (Stencil `<slot />` inside the body region).
- `slot="header"` → rich header — overrides the prop-driven `header` text.
- `slot="footer"` → footer content (action button row typically).

`[CODE]` **Footer render:** BOTH cores render a bare `<slot name="footer" />` directly inside the panel — Shadow (falcon-drawer.tsx:222-224, with empty-comment fallback) and `-tw` (falcon-drawer-tw.tsx:222) — **with NO footer-chrome wrapper** on either path. (Unlike the dialog's `-tw` path, the drawer does not auto-wrap the footer in token chrome — consumers add their own `flex justify-end gap-2 px-6 py-4 border-t` per the canonical pattern.) So the prior dossier's "renders only when slotted" is accurate, but note the footer carries **no built-in padding/border** on either path.

## Supported sizes / positions / states
- Positions: `right` (default) / `left` / `top` / `bottom`.
- Sizes: `sm`/`md`/`lg`/`xl` → 320/480/640/800 px (sides), 240/360/480/640 px (edges).
- Modal: `true` (backdrop blocks) / `false` (transparent, click-through AND no outside-click dismiss).
- States: open / closed (no intermediate; no exit transition — the panel is removed from the DOM on close).

## Important constraints
- **Focus trap is mandatory while open** — Tab cycles within the panel (Stencil `handleTabTrap`, falcon-drawer.tsx:128-149); the native `<dialog>.showModal()` ALSO adds OS-level Top-Layer focus containment.
- **Focus restore on close** — previously focused element regains focus (`afterCloseSideEffects`).
- **Esc / backdrop close only when `dismissable=true`** (a-spelling).
- **Backdrop click closes only when the target IS the overlay itself** (`ev.target === ev.currentTarget`) AND `dismissable=true` AND (for `modal`) the overlay is hit.
- **Body slot has internal padding from tokens** (`--falcon-drawer-body-padding-block/-inline` = 20/24px).

## Accessibility attributes
- `[CODE]` Panel: `role="dialog"`, `aria-modal="true"` (both paths — falcon-drawer.tsx:188-189 / falcon-drawer-tw.tsx:189-190).
- `aria-labelledby` → header `<h2>` id when `header` set; `aria-label` → `ariaLabel` fallback.
- Close × button: `aria-label` from `closeAriaLabel` (Stencil-level, default `'Close'`; wrapper does NOT expose — GAP G-A11Y-LABEL).
- Panel `tabIndex={-1}` for focus-target fallback when no focusable children.

## Parts (Stencil Shadow only — `<falcon-drawer>`)
| Part | Element |
|---|---|
| `overlay` | Backdrop / outer wrap. |
| `panel` | Slide-in panel container. |
| `header` | Header section. |
| `title` | `<h2>` inside header. |
| `close` | Close × button. |
| `body` | Body container. |

> The `-tw` path renders Light-DOM `<div>`s with `data-component="…"` (no `part=`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against falcon-drawer.component.ts/.html (103/56 ln), falcon-drawer.tsx (231) + falcon-drawer-tw.tsx (229), falcon-drawer.types.ts. Drift corrected: `open` is a signal-mirrored setter feeding the native `<dialog>`; `dismissable` mirrored to native `cancel`; Stencil events are camelCase (`falconDrawerShow`/`-Hide`); footer is bare (no chrome) on BOTH paths; `closeAriaLabel`/`show`/`hide` confirmed Stencil-only on BOTH tags.
