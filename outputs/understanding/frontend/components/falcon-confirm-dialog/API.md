# falcon-confirm-dialog — API

> ⚠️ The Angular wrapper is **commented out / dormant** (`[CODE]` falcon-confirm-dialog.component.ts:1-79). The Angular `@Input`/`@Output` rows below describe the wrapper **as written inside the comment block** — they are NOT live API (the class is not exported; `index.ts` ships `export {}`, `[CODE]` index.ts:6-7). The Stencil `<falcon-confirm-dialog>` / `<falcon-confirm-dialog-tw>` props ARE live (the tags compile + register) but have **zero consumers**.

## Selectors

- Angular: `falcon-angular-confirm-dialog` — **dormant** (only inside the commented component).
- Stencil Shadow: `<falcon-confirm-dialog>` (tag `'falcon-confirm-dialog'`, `shadow: true`).
- Stencil Light: `<falcon-confirm-dialog-tw>` (tag `'falcon-confirm-dialog-tw'`, `shadow: false`).

## Import

```ts
// LIVE — does NOT compile to a usable symbol today:
// import { FalconAngularConfirmDialogComponent } from '@falcon/ui-core'; // ✗ index.ts exports `export {}`
```

To get a confirm prompt today, inject the service (the live path):

```ts
import { FalconConfirmService } from '@falcon/ui-core/angular';
this.confirm.confirm({ title, body }).subscribe(accepted => { /* true = OK, false = cancel/dismiss */ });
```

## Stencil props (live on BOTH `<falcon-confirm-dialog>` + `<falcon-confirm-dialog-tw>`)

`[CODE]` falcon-confirm-dialog.tsx:26-60 / falcon-confirm-dialog-tw.tsx:23-34 — the two tags are 1:1 in prop surface (full parity).

| Prop | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `open` | `boolean` | `false` | ✅ (`reflect`, `mutable`) | Two-way bindable. `@Watch('open')` emits `falcon-confirm-open-change`. |
| `heading` | `string \| undefined` | `undefined` | — | Forwarded to `<falcon-dialog heading>` (header text). |
| `message` | `string \| undefined` | `undefined` | — | Body message text. Use the default slot for richer content. |
| `icon` | `string \| undefined` | `undefined` | — | Icon **CSS class** string (e.g. `falcon-icon falcon-icon-exclamation-triangle`). Rendered as `<i class="falcon-confirm-icon {icon}">` — NOT an `<svg>`. |
| `acceptLabel` | `string` | `'OK'` | — | Accept button label. |
| `rejectLabel` | `string` | `'Cancel'` | — | Reject / cancel button label. |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | ✅ | Severity tone forwarded to the dialog. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | ✅ | Dialog panel size. (NOTE: only `sm`/`md`/`lg` — narrower than `<falcon-dialog>`'s `sm…full`.) |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right'` | `'center'` | ✅ | Dialog position. |
| `closable` | `boolean` | `true` | — | Show the close X button. |
| `closeOnBackdrop` | `boolean` | `true` | — | Dismiss on backdrop click. |
| `closeOnEsc` | `boolean` | `true` | — | Dismiss on Escape key. |

> `[CODE]` Unlike `<falcon-input>`, the confirm-dialog Stencil tags expose **no `@Method()`** — focus management is entirely inherited from the composed `<falcon-dialog>`.

## Stencil events (both tags)

`[CODE]` falcon-confirm-dialog.tsx:62-72 / falcon-confirm-dialog-tw.tsx:36-41 — all three are `bubbles: true, composed: true`.

| Event name | Payload | Fires when |
|---|---|---|
| `falcon-confirm-accept` | `void` | User clicks Accept (`handleAccept`). |
| `falcon-confirm-reject` | `void` | User clicks Cancel **OR** dismisses via backdrop / Esc / close X — `handleReject` + `handleDialogClose` both emit reject. |
| `falcon-confirm-open-change` | `boolean` | `open` changes (`@Watch`) + on every accept/reject (emits `false`). |

> `[CODE]` **Dismissal-as-reject contract:** `handleDialogClose` is bound to the underlying dialog's `onFalcon-close` and emits `falcon-confirm-reject` (`[CODE]` tsx:91-95). Every dismissal path (backdrop / Esc / close X / Cancel button) resolves as *reject* — there is no distinct "dismissed/cancel/close" signal.

## Angular wrapper API (DORMANT — inside the comment block only)

`[CODE]` falcon-confirm-dialog.component.ts:33-77 (commented). Were it live, the wrapper would expose:

| Member | Kind | Default | Notes |
|---|---|---|---|
| `open` | `@Input` | `false` | (commented) Two-way via `[(open)]` + `openChange`. |
| `title` | `@Input` | `undefined` | (commented) **Maps to Stencil `heading`** — the wrapper renames it. Binding `[heading]` on the Angular tag would do nothing. |
| `message` / `icon` / `acceptLabel` / `rejectLabel` / `severity` / `size` / `position` / `closable` / `closeOnBackdrop` / `closeOnEsc` | `@Input` | as Stencil | (commented) Pass-through. |
| `useTailwind` | `@Input` | `true` | (commented) Render-path switch. |
| `rootClass` | `@Input` | `''` | (commented) Forwarded to `<falcon-angular-dialog rootClass>`. |
| `accept` / `reject` / `openChange` | `@Output` | — | (commented) `EventEmitter<void>` / `<void>` / `<boolean>`. The wrapper re-exposes the Stencil `falcon-confirm-*` events under these short Angular names. |

> `[CODE]` The commented wrapper composes `<falcon-angular-dialog>` (NOT the raw Stencil tag) and projects body + footer slots (`[CODE]` falcon-confirm-dialog.component.html:8-45, commented). It calls `defineFalconTwComponent('falcon-confirm-dialog')` in `ngOnInit` (`[CODE]` ts:57) and re-exports `FalconDialogSeverity` / `FalconDialogSize` / `FalconDialogPosition` types.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.types.ts`:

```ts
type FalconConfirmDialogSeverity = 'info' | 'success' | 'warning' | 'danger';
type FalconConfirmDialogSize = 'sm' | 'md' | 'lg';
type FalconConfirmDialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
```

## Reflected props (Stencil)

`open`, `severity`, `size`, `position` are reflected to host attributes (`[CODE]` tsx:27/45/48/51) so `:host([severity='danger'])` etc. could target them.

## Shadow parts

`[CODE]` falcon-confirm-dialog.tsx — the Shadow tag exposes CSS `::part()` hooks: `body` (:112), `message` (:117), `actions` (:123), `reject-btn` (:128), `accept-btn` (:133). The `-tw` twin sets **no** `part=` (Light DOM — style via Tailwind/tokens directly).

## CVA / ngModel / Reactive Forms

**N/A.** A dialog, not a form control — no `ControlValueAccessor`, no `NG_VALUE_ACCESSOR`. The (dormant) wrapper uses plain `@Input`/`@Output`.

## Slots / template inputs

- **Both Stencil tags:** one default `<slot>` in the body (`[CODE]` tsx:119 / tw.tsx:85) for richer content below the message. The footer (reject + accept buttons) is **built-in** (projected into `<falcon-dialog slot="footer">`) — NOT a consumer slot.
- **Angular wrapper (dormant):** `<ng-content>` mapped to the body default slot; footer locked.

## Supported sizes / states / variants

- Sizes: `sm` (default), `md`, `lg`.
- Severity: `info` (default), `success`, `warning`, `danger` — forwarded to the dialog.
- Position: `center` (default), `top`, `bottom`, `left`, `right`.
- No appearance/variant axis of its own — inherits dialog chrome.

## Constraints

- `[CODE]` Internal action buttons are raw `<button>`, NOT `<falcon-angular-button>` / `<falcon-button-tw>` (`[CODE]` tsx:124-139, tw.tsx:89-102). No `loading`/`disabled` state → async-accept flows cannot show a spinner (GAP G3).
- `[CODE]` `icon` is a CSS-class string via `<i>`, NOT `<falcon-angular-icon>` (GAP G4).
- `[CODE]` Reject button is rendered FIRST in DOM order, Accept SECOND (`[CODE]` tsx:124/132) — keyboard Tab lands on Reject first.
- `[CODE]` The Angular wrapper is dormant — there is no live Angular CVA/method/output surface.
- `[CODE]` Binding `onFalconClose` on the Stencil tag silently no-ops; the cross-component event is `onFalcon-close` (`[CODE]` tsx:109).

## Accessibility

- `[CODE]` Inherits focus-trap / focus-restore / Esc from the composed `<falcon-dialog>` — the confirm-dialog adds no focus logic of its own.
- `[CODE]` Body icon `<i>` is `aria-hidden="true"` (`[CODE]` tsx:114, tw.tsx:81) — decorative.
- `[CODE]` Accept button `:focus-visible` outline = `2px solid var(--falcon-confirm-dialog-accept-bg, #124c52)` + `outline-offset: 2px` (`[CODE]` falcon-confirm-dialog.css:63). The `-tw` twin uses `focus-visible:outline-2 focus-visible:outline-offset-2` (`[CODE]` tw.tsx:91/98).
- `[CODE]` **The confirm-dialog sets no `role`/`aria-label`/`aria-describedby` itself** — it relies entirely on `<falcon-dialog>` for dialog semantics. The message text has no `id` linked into the dialog's `aria-describedby` (GAP — see `INTEGRATION_VALIDATION.md`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15) against falcon-confirm-dialog.tsx (145 ln), falcon-confirm-dialog-tw.tsx (108 ln), falcon-confirm-dialog.types.ts, and the (commented) wrapper TS/HTML. Drift corrected vs prior dossier: every Angular `@Input`/`@Output`/import is now flagged dormant (prior dossier presented them as live); Stencil prop/event/slot/part surface re-confirmed live with zero consumers. Size axis corrected to `sm/md/lg` (prior listed `sm…full`).
