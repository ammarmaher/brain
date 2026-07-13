# falcon-insufficient-balance-dialog — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**The dialog itself owns no data** — `[CODE]` falcon-insufficient-balance-dialog.tsx performs no HTTP. Its *flow* is bound to **Charging** (the funding decision) + **Commerce** (the channel catalogue + the do-payment order), orchestrated by the host-shell `do-payment-priority-popup`:
- **Charging** — owns the wallet balances + the funding decision that returns `CommChannelPriorityOrderRequired`. (`[MEMORY]` due-payment night-shift 2026-06-02 — the funding-priority logic lives in Charging.)
- **Commerce** — owns the comm-channel catalogue (`getVisibleCommChannels`) supplying the `items` to rank, and the order whose status the popup polls.
- **realtime** — `OrderStatusRealtimeService` pushes `OrderFinalized` over SignalR (the primary terminal-status signal; GET poll is the fallback).

## Backend wiring (caller-side — the dialog is presentational)
`[CODE]` do-payment-priority-popup.component.ts:10-22 orchestrates (the *popup* makes these calls, NOT the dialog):
| Endpoint / service | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `doPayment(...)` | POST | Charging / Commerce | req `{ accountId, commChannelId, commChannelPriorityIds }` → resp `{ orderId }` | Charging / Core Gateway | First attempt sent with EMPTY priorities; on `CommChannelPriorityOrderRequired` the dialog opens. On `(falconProceed)`, resubmit with ordered priorities. |
| `OrderStatusRealtimeService.joinOrder` + `OrderFinalized` push | SignalR | realtime | `{ status, failureReason }` | (negotiate) | Primary terminal-status signal (night-shift 2026-06-02 wired Client push via `Context.TenantId`). |
| `getOrderStatus(orderId)` | GET | Commerce | resp `{ status, failureReason, … }` | Core Gateway | Catch-up GET once + bounded fallback poll (`environment.orderStatus.pollTimeoutMs`) if no push. |
| `getVisibleCommChannels(nodeId)` | GET | Commerce | resp channel list (`ChannelId`, `ChannelName`, `PriorityOrder`) | Core Gateway | Supplies the `items`; sorted by `PriorityOrder`, mapped to `{ id, label }`. |

`[CODE]` On Proceed: `orderedIds` → `commChannelPriorityIds` (`{ commChannelPriorityId: i+1, channelId }`), index 0 = top priority = `commChannelPriorityId` 1.

> `[MEMORY]` The do-payment POST sets `notShowToaster: 'true'` so the DIALOG owns its own failure presentation rather than the global top-right toast pipeline.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `CommChannelPriorityOrderRequired` (backend domain rule, not a FE `V-*`) | priority order | do-payment finalizes Failed with this reason (**ANY walletType** — the multi-wallet AND-guard was REMOVED 2026-06-02) | caller opens THIS dialog so the operator ranks channels |
| `[MEMORY]` `InsufficientFunds` | wallet balance | proceed still cannot be funded | a SEPARATE Falcon confirm popup ("Top up balance") — not this dialog |
| `[MEMORY]` `WalletNotConfigForTheNode` | wallet config | node has no wallet | a SEPARATE Falcon confirm explainer |

The dialog runs **no client-side `V-*` validation** — ranking a list cannot be "invalid". The `errorMessage` prop renders a pre-translated error banner the caller supplies after a failed proceed. Config robustness: the dialog re-seeds the working order from `items` on every false→true (`@Watch('open')`) and mirrors mid-flight `items` updates only while open (`@Watch('items')`).

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[MEMORY]` `adminConsole.services.payment` (do-payment) | do-payment | When denied, the row's `doPayment` action is not offered → the dialog is never reached. |
| `[INFERRED]` `availableActions[]` (FSM, per the integration plan) | per-row action gating | The backend-computed `availableActions[]` decides whether `DoPayment` is even valid on a given channel/service row. |

The dialog has **no PES key of its own** — it is gated entirely by the upstream do-payment action.

## State / signal pattern
- `[CODE]` Wrapper: classic `@Input()`/`@Output()` + ONE internal `signal` (`openSignal`) feeding the `falconOpen` directive model (falcon-insufficient-balance-dialog.component.ts:74). `OnPush`.
- `[CODE]` Stencil `@State()`: `orderedItems` (working copy), `draggingIdx`, `overIdx`, `dropSide`.
- `[CODE]` `@Watch('open')` re-seeds `orderedItems` from `items` on false→true (tsx:97-105); `@Watch('items')` mirrors mid-flight caller updates only while open (tsx:107-111).
- Caller-side: signals drive `[open]`/`[loading]`/`[busy]`/`[items]`/`[errorMessage]`; the popup's SignalR-push + bounded GET fallback flips them as the order resolves.
- **Error pipeline** — the do-payment POST carries `notShowToaster: 'true'`, so a failure does NOT raise the global toast; the popup routes failures into the dialog's `errorMessage` banner OR one of the 2 dedicated confirm popups.

## Skeleton ↔ app-wrapper layering
Three library artefacts + an app-level orchestrator + (Phase B) a native-`<dialog>` Top-Layer wrapper:
1. **Stencil Shadow skeleton** — `<falcon-insufficient-balance-dialog>` (`shadow:true`). Self-contained presentational dialog; owns backdrop/panel/drag-drop/reorder buttons.
2. **Stencil Light/TW twin** — `<falcon-insufficient-balance-dialog-tw>` (Light DOM, Tailwind v4). Full Prop/Event parity (same kebab `eventName`s, same `@Prop` set incl. `allowDragDrop`/`fit`, `role="alertdialog"`).
3. **Angular wrapper** — `<falcon-angular-insufficient-balance-dialog>`. Bridges inputs/outputs; registers the `-tw` tag via `defineFalconTwComponent`; portals its host to `<body>` (`appendTo='body'`); wraps everything in `<dialog falconOverlay="modal" [falconOpen]>` for Top-Layer promotion (Phase B / Wave 4.2).
4. **App-level orchestrator** — `do-payment-priority-popup.component.ts` in host-shell injects the payment/order-status/realtime services, runs the terminal-status logic, and drives the dialog's signals. **This is the skeleton↔app-wrapper layering**: the library dialog is pure UI; the popup is the App=API layer that owns the Charging/Commerce wiring (`feedback_library_skeleton_app_api`).

### Overlay / z-index tier (CORRECTED 2026-06-03)
`[CODE]` insufficient-balance-dialog.tokens.css:21-55 — `--falcon-ib-dialog-backdrop-z: **99999**` (the canonical Falcon rev-3 ladder, 2026-05-20): sticky-headers 1-60 · menu/tooltip 1100 · **drawer + popup-dialog 99999 ← THIS DIALOG** · body-portaled popovers 100000 · toast 100001 · loader-overlay 2000. **DRIFT CORRECTED:** the prior dossier said `z: 1000` — the live value is `99999` (matches `--falcon-dialog-z-index`; was 1200 before the 2026-05-20 ladder rewrite). NOTE: with the Phase B native `<dialog>` `showModal()`, the panel renders in the browser **Top Layer** when open — z-index becomes moot for stacking (the Top Layer is above all normal-flow z-indices); the token stays alive for the Shadow-only / non-modal fallback path. `fit` (`normal`/`full`, Wave 16.2) is a layout mode within the tier, not a new tier.

## Integration gotchas
- `[CODE]` **walletType AND-guard REMOVED (2026-06-02)** — the dialog now opens on `CommChannelPriorityOrderRequired` alone (do-payment-priority-popup.component.ts:17-18). Do not re-add a `WalletType.MultipleWallets` check.
- `[CODE]` **Stencil events are kebab + `bubbles+composed`** (`falcon-proceed`/`falcon-cancel`/`falcon-open-change`) on BOTH tags — clean wrapper mapping (no loader-overlay-style mismatch).
- `[CODE]` **Native-`<dialog>` Top-Layer wrapper** (Phase B) gives a real focus trap + focus-restore for free; the `<body>` portal is retained as defence-in-depth but is architecturally redundant for the modal path.
- `[CODE]` **Pass `undefined` (not `null`) to `errorMessage`.**
- `[CODE]` **`@Watch('items')` only mirrors while open** — updating `items` before opening is fine (the open-watch re-seeds); updating while closed has no immediate effect.
- `[CODE]` **HTML5 native drag-drop is NOT keyboard accessible** — the 4 arrow buttons are the keyboard path; do not remove them. (GAP G3 — a WAI-ARIA grab/move/drop mode is a future upgrade.)
- `[CODE]` **The `-tw` twin reads raw `var(--color-falcon-*)` palette refs, NOT `--falcon-ib-dialog-*` tokens, for several visuals** (error banner bg, drag-over border) — a per-instance `--falcon-ib-dialog-*` override may retint the Shadow path only (GAP G-TOK, same family as B15 alert-dialog).
- `[CODE]` **Footer buttons are raw `<button>`, not `<falcon-angular-button>`** (tsx:413-429) — Falcon-component-over-native gap (GAP G-BTN).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B17) — re-seed/items watches (tsx:97-111), the kebab `bubbles+composed` events, the native-`<dialog>` Top-Layer wrapper (component.html:6-13 + component.ts:144-167), and the `notShowToaster` error routing re-confirmed. **z-index DRIFT corrected: `1000` → `99999`** (insufficient-balance-dialog.tokens.css:55). **walletType-guard removal** confirmed (do-payment-priority-popup.component.ts:17-18 + `[MEMORY]` 2026-06-02). Backend flow re-derived from the LIVE popup (SignalR push + GET fallback), not the older illustrative poll sample. raw-`<button>` (G-BTN) + `-tw` token-parity (G-TOK) recorded.
