# falcon-insufficient-balance-dialog — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**The dialog itself owns no data** — `[CODE]` `falcon-insufficient-balance-dialog.tsx` performs no HTTP calls. But its *flow* is tightly bound to **Falcon Commerce** (and downstream **Charging**):
- **Commerce** — owns the comm-channel / application catalogue and the do-payment order. The `items` (channels to rank) come from a Commerce visible-channels query; the priority order is submitted back to Commerce as part of the do-payment request.
- **Charging** — owns the wallet balances whose insufficiency triggers the whole flow. The `CommChannelPriorityOrderRequired` + `WalletType.MultipleWallets` failure originates from Charging's funding decision.

## Backend wiring
`[CODE]` `USAGE.md:36-89` shows the caller-side orchestration (the dialog is presentational — the *caller* does these calls):
| Endpoint / service | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `CommChannelPaymentService.doPayment` | POST | Commerce | req `{ accountId, commChannelId, commChannelPriorityIds }` → resp `{ orderId }` | System Gateway | First attempt sent with empty priorities; on `CommChannelPriorityOrderRequired` the dialog opens. |
| `OrderStatusService.getOrderStatus` | GET | Commerce | resp `{ status, failureReason, walletType }` | System Gateway | Polled via `SimplePollService` every 2s until terminal. |
| `CommChannelPaymentService.getVisibleCommChannels` | GET | Commerce | resp channel list (`ChannelId`, `ChannelName`, `PriorityOrder`) | System Gateway | Supplies the `items` for the dialog; sorted by `PriorityOrder` before mapping to `{ id, label }`. |

`[CODE]` `USAGE.md:64-66` On Proceed, the caller maps `orderedIds` → `commChannelPriorityIds` (`{ commChannelPriorityId: i+1, channelId }`) and resubmits `doPayment`.

`[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17` — the canonical endpoint base is `commerce/Node/{nodeId}/...`; do-payment is a write requiring the System Gateway; the do-payment POST sets the `notShowToaster: 'true'` header so the *dialog* owns its own failure presentation rather than the global toast pipeline.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `CommChannelPriorityOrderRequired` (backend domain rule, not a FE `V-*`) | priority order | do-payment for a multi-wallet account with insufficient balance | order status `failureReason = CommChannelPriorityOrderRequired` — caller opens this dialog |
| `[MEMORY]` `InsufficientFunds` | wallet balance | proceed-payment still cannot be funded | failure dialog (separate) — `[MEMORY]` integration plan lists 3 failure-reason dialogs |
| `[MEMORY]` `WalletNotConfigForTheNode` | wallet config | node has no wallet configured | failure dialog (separate) |

The dialog runs **no client-side `V-*` validation** itself — ranking a list cannot be "invalid". The `errorMessage` prop (`[CODE]` `falcon-insufficient-balance-dialog.tsx:42,392-397`) renders a pre-translated error banner the caller supplies after a failed proceed.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[MEMORY]` `adminConsole.services.payment` | do-payment | When denied, the row's `doPayment` action is not offered → the dialog is never reached. |
| `[INFERRED]` `availableActions[]` (FSM, per `[MEMORY]` integration plan) | per-row action gating | The backend-computed `availableActions[]` decides whether `DoPayment` is even a valid action on a given channel/service row. |

The dialog has **no PES key of its own** — it is gated entirely by the upstream do-payment action.

## State / signal pattern
- `[CODE]` `falcon-insufficient-balance-dialog.component.ts` — the Angular wrapper uses **classic `@Input()` / `@Output()` decorators** (`[BRAIN-OUT]` `API.md:110-112`), matching the surrounding wrapper components.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:73-78` Internal `@State()`: `orderedItems` (the working copy), `draggingIdx`, `overIdx`, `dropSide`.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:97-111` `@Watch('open')` re-seeds `orderedItems` from `items` on every false→true; `@Watch('items')` mirrors mid-flight caller updates **only while open**.
- `[BRAIN-OUT]` `USAGE.md:36-89` Caller-side: signals drive `[open]` / `[loading]` / `[busy]` / `[items]` / `[errorMessage]`; `SimplePollService` watches the order status and flips the signals as the poll resolves.
- **Error pipeline** — `[MEMORY]` the do-payment POST carries `notShowToaster: 'true'`, so a do-payment failure does NOT raise the global business-validation toast; instead the caller routes the failure into the dialog's `errorMessage` banner or one of the dedicated failure dialogs.

## Skeleton ↔ app-wrapper layering
Three artefacts (canonical Falcon component pattern), plus an app-level orchestrator on top:
1. **Stencil Shadow skeleton** — `[CODE]` `falcon-insufficient-balance-dialog.tsx` `<falcon-insufficient-balance-dialog>` (`shadow: true`). Self-contained presentational dialog; owns backdrop, panel, drag-drop, reorder buttons.
2. **Stencil Light/TW twin** — `<falcon-insufficient-balance-dialog-tw>` (Light DOM, Tailwind v4).
3. **Angular wrapper** — `<falcon-angular-insufficient-balance-dialog>` (`[BRAIN-OUT]` `API.md:7`). Bridges inputs/outputs, registers the `-tw` tag via `defineFalconTwComponent`.
4. **App-level orchestrator** — `[CODE]` `USAGE.md:137-138` `do-payment-priority-popup.component.ts` in host-shell is the feature wrapper that injects `CommChannelPaymentService` / `OrderStatusService` / `SimplePollService`, runs the failure-reason logic, and drives the dialog's signals. **This is the skeleton↔app-wrapper layering**: the library dialog is pure UI; the host-shell `do-payment-priority-popup` is the app layer that owns the Commerce/Charging wiring. Per `feedback_library_skeleton_app_api`, the dialog never fetches — the orchestrator does.

### Overlay / z-index tier ladder
`[CODE]` `insufficient-balance-dialog.tokens.css` (`[BRAIN-OUT]` `TOKENS.md:23`) — `--falcon-ib-dialog-backdrop-z: 1000`. The Falcon overlay tier ordering, low → high:
- `falcon-tooltip` (`--falcon-tooltip-z`) — transient hint.
- `falcon-drawer` (`--falcon-drawer-z`) — edge sheet.
- `falcon-dialog` (`--falcon-dialog-z`) — generic centered modal.
- **`falcon-insufficient-balance-dialog` (`z: 1000`)** — domain dialog, pinned to the modal tier.
- `falcon-sending-credentials-dialog` (`z: 1200`, `[CODE]` `falcon-sending-credentials-dialog.component.html:8`) — sits slightly above.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:69-70` Wave 16.2 added a `fit` prop (`'normal'` centered with max-width / `'full'` edge-to-edge) — a layout mode within the same z-tier, not a new tier.

## Integration gotchas
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:79-87` Stencil events are kebab-case (`falcon-proceed` / `falcon-cancel` / `falcon-open-change`) with `bubbles: true, composed: true` so they cross the Shadow boundary — the Angular wrapper maps them to `falconProceed` / `falconCancel` / `openChange`.
- `[BRAIN-OUT]` `USAGE.md:129` Pass `undefined` (not `null`) to `errorMessage` — the wrapper input is `string | undefined`.
- `[BRAIN-OUT]` `DECISION.md:D8` **Loader bootstrap chicken-and-egg** — registering a new `-tw` tag in `define-falcon-tw-component.ts` fails the first TS build because the `dist` artefact does not exist yet; build once to emit it, then re-add the loader entry.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:107-111` `@Watch('items')` only mirrors into the working order **while open** — a caller updating `items` before opening is fine (the open-watch will re-seed); updating while closed has no immediate effect.
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:G3` HTML5 native drag-drop is **not keyboard accessible** — the four arrow buttons are the keyboard path; do not remove them.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-insufficient-balance-dialog.tsx` + `[BRAIN-OUT]` existing dossiers + `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17`. Backend wiring ✅ VERIFIED against `[CODE]` `USAGE.md:36-89` caller sample. The dialog itself is presentational; the Commerce/Charging coupling is the *flow's*, owned by the host-shell `do-payment-priority-popup` orchestrator.
