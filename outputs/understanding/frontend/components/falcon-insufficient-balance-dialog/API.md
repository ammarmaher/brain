# falcon-insufficient-balance-dialog — API

## Selectors
- Angular: `falcon-angular-insufficient-balance-dialog` (default → `-tw` variant)
- Stencil Shadow: `<falcon-insufficient-balance-dialog>` (`shadow: true`)
- Stencil Light: `<falcon-insufficient-balance-dialog-tw>` (`shadow: false`, Tailwind v4)

## Import

```ts
import {
  FalconAngularInsufficientBalanceDialogComponent,
  type FalconInsufficientBalanceDialogProceedDetail,
  type FalconInsufficientBalanceDialogCancelDetail,
  type IbDialogItem,
} from '@falcon/ui-core/angular';
```

`CUSTOM_ELEMENTS_SCHEMA` is set internally on the wrapper (`[CODE]` falcon-insufficient-balance-dialog.component.ts:59). The wrapper ALSO imports `FalconOverlayDirective` (:55) for the native `<dialog>` Top-Layer promotion (see below).

## Inputs (all on `FalconAngularInsufficientBalanceDialogComponent`)

### Visibility + data
| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` (get/set → internal signal) | `false` | `[CODE]` :65-74 — two-way-ish: the setter mirrors into `openSignal` so the `falconOpen` directive model + the `@Input` stay in lockstep. Re-seeds the working order on every false→true (Stencil). |
| `items` | `IbDialogItem[]` (`{ id, label }`) | `[]` | `[CODE]` :76. Bound as a **property** (`[items]`), NOT an attr — it's an object array. |
| `loading` | `boolean` | `false` | `[CODE]` :77. Skeleton rows in the body. |
| `busy` | `boolean` | `false` | `[CODE]` :78. Disables reorder controls + footer buttons; suppresses Esc/backdrop dismissal. |
| `errorMessage` | `string \| undefined` | `undefined` | `[CODE]` :79. Inline error banner (`role="alert"`), pre-translated. |

### Visual configuration (Wave 15)
| Name | Type | Default | Notes |
|---|---|---|---|
| `showGlossy` | `boolean` | `true` | `[CODE]` :82. Also toggles the wrapper's native `::backdrop` glossy blur (`[class.is-glossy]`). |
| `showIconColor` | `boolean` | `true` | `[CODE]` :83. |
| `showIconBackground` | `boolean` | `true` | `[CODE]` :84. Renders the warning-icon chip background. |

### Header + button labels (pre-translated — caller pipes `| translate`)
| Name | Type | Default |
|---|---|---|
| `headingText` | `string?` | `undefined` |
| `subtitle` | `string?` | `undefined` |
| `confirmLabel` | `string` | `'Proceed Payment'` |
| `cancelLabel` | `string` | `'Cancel'` |
| `dragLabel` | `string` | `'Drag To Change Priority:'` |
| `firstAutoLabel` | `string` | `'The first channel will be used automatically.'` |
| `moveUpLabel` / `moveDownLabel` / `moveToTopLabel` / `moveToBottomLabel` | `string` | `'Move up'` / `'Move down'` / `'Move to top'` / `'Move to bottom'` |

### Dismiss + behaviour toggles
| Name | Type | Default | Notes |
|---|---|---|---|
| `closeOnBackdrop` | `boolean` | `true` | `[CODE]` :99. |
| `closeOnEsc` | `boolean` | `true` | `[CODE]` :100. Honoured against BOTH the Stencil keydown listener AND the native `<dialog>` cancel (`onNativeDialogCancel` preventDefault — :199-201). |
| `allowDragDrop` | `boolean` | `true` | `[CODE]` :103 (Wave 16.1) — `false` inerts the drag handle; the 4 arrow buttons stay active. |
| `fit` | `'normal' \| 'full'` | `'normal'` | `[CODE]` :106 (Wave 16.2) — `normal` = centered + max-width; `full` = panel stretches edge-to-edge. |
| `useTailwind` | `boolean` | `true` | `[CODE]` :109 — render-path switch. |
| `appendTo` | `'body' \| 'host'` | `'body'` | `[CODE]` :114 — portal target. `'body'` relocates the host element to `<body>` in `ngOnInit` (escapes stacking-context ancestors); detached in `ngOnDestroy`. Same idiom as `<falcon-angular-menu [appendTo]>`. |

> `[CODE]` **Phase B / Wave 4.2 (2026-05-21):** the wrapper wraps the Stencil tag in a native `<dialog falconOverlay="modal" [falconOpen]="openSignal()">` (component.html:6-13) that calls `showModal()` → the panel enters the browser **Top Layer**, so stacking-context ancestors no longer demote it. The `<body>` portal is RETAINED as defence-in-depth (component.ts:144-167 banner) but is architecturally redundant for the Top-Layer path.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(falconProceed)` | `{ orderedIds: string[] }` | `[CODE]` :117 — Confirm button. `orderedIds` index 0 = top priority. ALWAYS emits the full ordered list (even if unchanged). |
| `(falconCancel)` | `{ reason: 'cancel' \| 'backdrop' \| 'esc' }` | `[CODE]` :118 — Dismiss. `onCancel` also sets `open=false` + emits `openChange(false)` (:174-179). |
| `(openChange)` | `boolean` | `[CODE]` :119 — open-state change (from Stencil `falcon-open-change`, native `<dialog>` close, and cancel). |

> `[CODE]` **Stencil event-name parity is CLEAN on BOTH tags** — both `<falcon-insufficient-balance-dialog>` and `-tw` declare explicit `eventName: 'falcon-proceed'` / `'falcon-cancel'` / `'falcon-open-change'` (kebab) with `bubbles+composed` (falcon-insufficient-balance-dialog.tsx:80-87 + the `-tw` `eventName`s at :59-65). The wrapper's `(falcon-proceed)` etc. bindings match on both paths. (No loader-overlay-style mismatch.)
> `[CODE]` The wrapper ALSO binds native-`<dialog>` events: `(falconClose)="onNativeDialogClose()"` + `(falconCancel)="onNativeDialogCancel($event)"` (component.html:12-13) to keep the `open` flag in sync with the browser's Top-Layer close — NOT re-emitted to consumers (the Stencil `falcon-cancel` already routes through `onCancel`).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.types.ts` (the SSOT imported by Shadow + `-tw` + wrapper):

```ts
interface IbDialogItem { id: string; label: string; }
interface FalconInsufficientBalanceDialogProceedDetail { orderedIds: string[]; }   // index 0 = top priority
interface FalconInsufficientBalanceDialogCancelDetail { reason: 'cancel' | 'backdrop' | 'esc'; }
```

Plus the wrapper-local `FalconAngularInsufficientBalanceDialogAppendTo = 'body' | 'host'` (component.ts:51).

## Reflected props (Stencil only)

`open`, `showGlossy`, `showIconColor`, `showIconBackground`, `allowDragDrop`, `fit` are `@Prop({ reflect: true })` on BOTH tags (`[CODE]` falcon-insufficient-balance-dialog.tsx:30,45-47,66,70) so consumer CSS can target `:where(falcon-insufficient-balance-dialog[show-glossy="true"])` etc. `open` is also `mutable: true` (Stencil can self-close).

## Mutable props (Stencil)

`open` is `@Prop({ mutable: true, reflect: true })` — the Stencil core flips it to `false` on dismiss + emits `falcon-open-change`. The wrapper's `onOpenChange` mirrors it back into `open`.

## CVA / ngModel / Reactive Forms

**N/A — not a form-value control.** No `ControlValueAccessor`. `open` is a visibility flag, not a form value. Use `[open]` + `(openChange)` for two-way-ish binding (no `[(open)]` banana-box sugar — it's a manual get/set + `openChange`).

## Signal compatibility

`[CODE]` The wrapper mixes classic `@Input()`/`@Output()` with ONE internal `signal` (`openSignal`, :74) that feeds the `falconOpen` directive model. `OnPush` (:58). Stencil internal state is `@State()` (`orderedItems`, `draggingIdx`, `overIdx`, `dropSide`).

## Methods

None public. Stencil internals (`move(i, delta)`, drag handlers, `dismiss`) are `private`. The wrapper's `portalToBody`/`onProceed`/`onCancel`/`onOpenChange`/`onNativeDialog*` are `protected`.

## Slots / template inputs

**None.** The body is fully controlled — the dialog renders its own warning icon, title, subtitle, priority list (with 6-dot drag grip + 4 reorder buttons per row), info pill, error banner, and footer (Cancel + Proceed). All content arrives via the `items` array + the label inputs.

## Supported states / modes

- **States:** closed (`<Host hidden>`), open, loading (skeleton rows), busy (controls + buttons disabled, dismissal suppressed), error (inline `role="alert"` banner).
- **Modes:** `fit` (`normal`/`full`), `allowDragDrop` (`true`/`false`), the 3 visual toggles.
- **Reorder:** drag the grip (HTML5 native drag with a custom drag-image ghost + drop-side insertion line — `[CODE]` falcon-insufficient-balance-dialog.tsx:158-217) OR the 4 per-row buttons (move-to-top / up / down / move-to-bottom).

## Constraints

- `[CODE]` Bind `[items]` as a property (object array), NOT an attr.
- `[CODE]` Reorder mutations target a local working copy (`orderedItems`), never `items` — a cancelled dialog leaves the caller's seed untouched.
- `[CODE]` `Proceed` is a no-op while `busy || loading`; Esc/backdrop dismissal is suppressed while `busy` — no abandoning a submitting payment.
- `[CODE]` `Proceed` ALWAYS emits the full ordered list (even if unchanged) — treat it as "commit this order", not "I made changes".
- `[CODE]` `appendTo='body'` relocates the host to `<body>`; if you place it inside a component that itself unmounts mid-flow, the `ngOnDestroy` detach guards against orphan `<body>` hosts (:131-142).

## Accessibility

- `[CODE]` `role="alertdialog"` + `aria-modal="true"` + `aria-label={headingText}` on the panel (falcon-insufficient-balance-dialog.tsx:375-377). `role="alertdialog"` correctly signals a high-importance interruption.
- `[CODE]` Native `<dialog>` `showModal()` gives a **real focus trap + focus restore to the opener for free** (Phase B Top-Layer) — a genuine a11y upgrade over the Stencil-only path.
- `[CODE]` Each reorder button carries `aria-label` from the `move*Label` inputs; the grip wrap is `aria-hidden="true"`.
- `[CODE]` `<ul role="list">` for the priority list; error banner `role="alert"`; skeleton `aria-busy="true"`.
- Drag-drop and the 4 buttons produce the SAME reorder result → keyboard parity (no mouse required).
- `[CODE]` **GAP:** no `aria-describedby` linking the panel to the subtitle/body (only `aria-label`=heading) — same a11y gap as B15 alert-dialog (GAP G-A11Y).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-insufficient-balance-dialog.component.ts (202 ln), .component.html (71 ln), .component.css (61 ln), .tsx (436 ln), -tw.tsx (407 ln), .types.ts. Added the prior-dossier-MISSING inputs `allowDragDrop`/`fit`/`appendTo` + the Phase B native-`<dialog>` Top-Layer wrapper + 3 native-dialog bridge handlers + `openSignal`. Event-name parity confirmed clean on both tags. `aria-describedby` gap recorded.
