# falcon-dialog — API

## Selectors
- Angular: `falcon-angular-dialog`
- Stencil Shadow: `<falcon-dialog>` (tag `'falcon-dialog'`, `shadow: true`)
- Stencil Light: `<falcon-dialog-tw>` (tag `'falcon-dialog-tw'`, `shadow: false`) — **default** (`useTailwind=true`)

## Import
```ts
import { FalconAngularDialogComponent } from '@falcon/ui-core/angular';
// or via barrel:
import { FalconAngularDialogComponent } from '@falcon/ui-core';
```
`[CODE]` falcon-dialog.component.ts:41 — `schemas: [CUSTOM_ELEMENTS_SCHEMA]` is set on the wrapper internally; the host component does NOT need it. The wrapper also `imports: [FalconOverlayDirective]` (`[CODE]` :37) to drive the native `<dialog>` Top Layer.

## Inputs (all on `FalconAngularDialogComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | `[CODE]` ts:54-64 — getter/setter that ALSO writes an internal `openSignal` (read by `[falconOpen]` on the native `<dialog>`). Two-way via `(openChange)`. The setter is the single sync point — both parent writes and the wrapper's own `this.open=false` flow through it. |
| `title` | `string \| undefined` | `undefined` | Plain text title (overridden by `slot="header"`). |
| `description` | `string \| undefined` | `undefined` | Optional description below title. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Panel max-width per size (sm 420 / md 560 / lg 720 / xl 880 / full `calc(100vw-32px)`). |
| `closable` | `boolean` | `true` | Show close × button. |
| `closeOnBackdrop` | `boolean` | `true` | Backdrop click closes (honoured by the Stencil's internal `handleBackdropClick`). |
| `closeOnEsc` | `boolean` | `true` | `[CODE]` ts:126-128 — ALSO mirrored onto the native `<dialog>` `cancel` event (`preventDefault()` when false) so the user agent does not synchronously close the outer dialog. |
| `dismissible` | `boolean` | `true` | Master enable for both Esc + backdrop (overrides the two above when `false`) — `[CODE]` falcon-dialog.tsx:132,123. |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger' \| undefined` | `undefined` | Tone indicator → `data-severity` on the panel; drives the top accent strip + title-color + focus-ring remap (`[CODE]` dialog.tokens.css:192-243). |
| `position` | `'center' \| 'top' \| 'side-right'` | `'center'` | Layout origin. **`side-right` is a trap** — that is the drawer's job (GAP G-SIDE). |
| `disabled` | `boolean` | `false` | Block `show()` programmatic opens (`[CODE]` falcon-dialog.tsx:88). |
| `errorMessage` | `string \| undefined` | `undefined` | **DEAD PROP** — accepted by wrapper + Stencil (`[CODE]` falcon-dialog.tsx:52) but never rendered in any markup (GAP G-ERR). |
| `ariaLabel` | `string \| undefined` | `undefined` | Fallback `aria-label` on the panel when no `title`. |
| `useTailwind` | `boolean` | `true` | Render-path switch. `true` → `<falcon-dialog-tw>` (Light DOM). `false` → `<falcon-dialog>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Caller-supplied extra class, forwarded as `[class]` on the Stencil tag. |

### Stencil-only props (NOT exposed on Angular wrapper)

| Prop | Type | Default | Available on | Notes |
|---|---|---|---|---|
| `closeAriaLabel` | `string` | `'Close'` | BOTH tags `[CODE]` falcon-dialog.tsx:54 / falcon-dialog-tw.tsx:60 | Close × `aria-label`. The wrapper does NOT surface it → the label is stuck English (GAP G-A11Y-LABEL). |

> `[CODE]` Mutable/reflected prop `open: boolean` (`@Prop({ mutable: true, reflect: true })`, `@Watch`ed) exists on both Stencil tags and drives `afterOpenSideEffects` / `afterCloseSideEffects`. The Angular wrapper drives it via the `[attr.open]` binding + the native `<dialog>` — do not bind the Stencil prop directly.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(falconOpen)` | `FalconDialogOpenDetail` (`{ source: 'programmatic' \| 'attribute' }`) | `[CODE]` ts:90-93 — re-emitted from the Stencil `falcon-open`. |
| `(falconClose)` | `FalconDialogCloseDetail` (`{ reason: 'close-button' \| 'backdrop' \| 'escape' \| 'programmatic' }`) | `[CODE]` ts:95-100 — re-emitted from Stencil `falcon-close`; ALSO sets `this.open=false` + emits `openChange`. |
| `(falconConfirm)` | `FalconDialogConfirmDetail` (`{ value?: unknown }`) | `[CODE]` ts:102-105 — re-emitted from Stencil `falcon-confirm`. **No built-in button emits it** (passthrough only — GAP G-CONFIRM). |
| `(falconCancel)` | `FalconDialogCancelDetail` (`{ reason?: string }`) | `[CODE]` ts:107-110 — re-emitted from Stencil `falcon-cancel`. **No built-in button emits it** (passthrough only). |
| `(openChange)` | `boolean` | Two-way `[(open)]` sugar — always emits `false` on close. |

> `[CODE]` ts:117-121 — `onNativeDialogClose()` and `onNativeDialogCancel()` are **internal** handlers bound to the native `<dialog>` `(falconClose)`/`(falconCancel)` directive outputs; they only keep the `open` signal in sync (they do NOT re-emit `falconClose` — the Stencil-bubbled event already does that).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.types.ts`:

```ts
type FalconDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type FalconDialogPosition = 'center' | 'top' | 'side-right';
type FalconDialogSeverity = 'info' | 'success' | 'warning' | 'danger';
interface FalconDialogOpenDetail    { readonly source: 'programmatic' | 'attribute'; }
interface FalconDialogCloseDetail   { readonly reason: 'close-button' | 'backdrop' | 'escape' | 'programmatic'; }
interface FalconDialogConfirmDetail { readonly value?: unknown; }
interface FalconDialogCancelDetail  { readonly reason?: string; }
```

## Reflected props (Stencil only)
`open`, `size`, `closable`, `severity`, `position`, `disabled` are reflected to host attributes so `:host([severity='danger'])`, `:host([size='lg'])`, etc. CSS can target them. (`closeOnBackdrop`, `closeOnEsc`, `dismissible`, `title`, `description`, `errorMessage`, `ariaLabel`, `closeAriaLabel` are NOT reflected.)

## Mutable props (Stencil)
`open` is `@Prop({ mutable: true, reflect: true })` and `@Watch`ed for parent-driven transitions.

## CVA / ngModel / Reactive Forms
**Not applicable** — dialog is a presentational container, not a form control.

## Signal compatibility
`[CODE]` ts:54-64 — wrapper uses **classic `@Input()` decorators** (not signal inputs) PLUS one internal `openSignal = signal<boolean>(false)` that the native `<dialog>`'s `[falconOpen]` reads. `OnPush` change detection (ts:40). Internal Stencil state is `@State`/`@Prop`-managed.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `show(): Promise<void>` | Programmatic open (no-op when `disabled`). | BOTH tags `[CODE]` falcon-dialog.tsx:86-90 / falcon-dialog-tw.tsx:90-94 |
| `hide(): Promise<void>` | Programmatic close (`dispatchClose('programmatic')`). | BOTH tags `[CODE]` falcon-dialog.tsx:93-96 / falcon-dialog-tw.tsx:96-99 |

> `[CODE]` The Angular wrapper does NOT proxy these methods — drive open/close via `[open]`/`[(open)]` instead (GAP G-METHOD).

## Slots / ng-content

`[CODE]` falcon-dialog.component.html:38-40 / 62-64 — the wrapper projects THREE `<ng-content>` outlets into BOTH render paths:
- **(default)** → body content (Stencil `<slot />` inside `.falcon-dialog-body`).
- `slot="header"` → rich header — overrides the prop-driven `title`/`description` (Stencil `<slot name="header">` with prop fallback).
- `slot="footer"` → footer content.

`[CODE]` **Footer-render divergence (Shadow vs `-tw`):**
- **Shadow** (`<falcon-dialog>`, falcon-dialog.tsx:246-248) — `<slot name="footer">` with an empty-comment fallback; the footer region is bare (no `<div>` wrapper, no token-driven padding) unless projected.
- **Light/`-tw`** (`<falcon-dialog-tw>`, falcon-dialog-tw.tsx:246-248) — wraps the footer slot in `<div class={falconDialogFooterClasses()}>` (token-driven gap/padding/top-border/justify-end), rendered **unconditionally**. So on the default Tailwind path a projected footer always picks up the canonical footer chrome; on the Shadow path it does not. (Minor parity divergence — DRIFT-FOOTER.)

## Supported sizes / states / positions / severities
- Sizes: `sm` (420) / `md` (560) / `lg` (720) / `xl` (880) / `full` (`calc(100vw-32px)`). Panel max-height `calc(100vh-80px)`.
- Positions: `center` (default), `top` (anchored, `padding-top: 80px`), `side-right` (right-anchored, 480 px — overlaps drawer; GAP G-SIDE).
- Severities: `info` / `success` / `warning` / `danger` — a 4 px top accent strip (`-tw` only, rendered via `falconDialogSeverityStripStyle`) + remapped title-color + focus-ring.
- States: open / closed, disabled (blocks programmatic `show()`).

## Important constraints
- **Focus trap is hand-rolled in the Stencil core** (`[CODE]` falcon-dialog.tsx:145-166 Tab/Shift+Tab cycle) AND the native `<dialog>.showModal()` adds OS-level Top-Layer focus containment + inertness. The two are layered (belt-and-suspenders).
- `dismissible=false` overrides `closeOnBackdrop` and `closeOnEsc` (master kill-switch).
- **Confirm / Cancel events are NOT auto-wired** — no built-in confirm button. Project your own footer buttons + handle their `(falconClick)`, or use `falcon-angular-confirm-dialog`.
- **`errorMessage` is a dead prop** — accepted, never rendered.
- `position="side-right"` looks like a drawer but lacks drawer edge-radius defaults — use `<falcon-angular-drawer position="right">`.

## Accessibility attributes
- `[CODE]` Panel: `role="dialog"`, `aria-modal="true"` (both paths — falcon-dialog.tsx:206-207 / falcon-dialog-tw.tsx:206-207).
- `aria-labelledby` → title id when `title` set; `aria-describedby` → description id when `description` set; `aria-label` → `ariaLabel` fallback when no title.
- Close × button: `aria-label` from `closeAriaLabel` (Stencil-level, default `'Close'` — wrapper does NOT expose, GAP G-A11Y-LABEL).
- `[CODE]` Severity accent strip is `aria-hidden="true"` (falcon-dialog-tw.tsx:214) — decorative.
- Panel `tabIndex={-1}` for focus-target fallback when no focusable children.

## Parts (Stencil Shadow only — `<falcon-dialog>`)
| Part | Element |
|---|---|
| `backdrop` | Backdrop wrap. |
| `panel` | Panel container. |
| `close` | Close × button. |
| `header` | Header section. |
| `title` | `<h2>` title. |
| `description` | `<p>` description. |
| `body` | Body container. |

> The `-tw` path renders Light-DOM `<div>`s with `data-component="…"` attrs (no `part=`) — `::part()` is unavailable on the default Tailwind path.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against falcon-dialog.component.ts/.html (129/68 ln), falcon-dialog.tsx + falcon-dialog-tw.tsx (254 ea), dialog-tailwind-classes.ts (188), falcon-dialog.types.ts. Drift corrected vs prior dossier: `open` is a signal-mirrored getter/setter feeding the native `<dialog>`; `closeOnEsc` mirrored to native `cancel`; `-tw` footer rendered unconditionally with chrome (Shadow bare); severity strip is `-tw`-only; `closeAriaLabel`/`show`/`hide` confirmed Stencil-only on BOTH tags.
