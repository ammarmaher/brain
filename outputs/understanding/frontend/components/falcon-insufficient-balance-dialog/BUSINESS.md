# falcon-insufficient-balance-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-insufficient-balance-dialog` is a **charging/wallet domain overlay** built on a generic priority-reorder primitive. Its product job: when an operator triggers a paid action (a do-payment order) and the result requires the operator to **rank which communication channels (wallets) get funded first** before the payment can complete, this dialog presents the channels as a draggable/reorderable list and emits the chosen priority order. The caller then resubmits the order with that priority.

`[CODE]` falcon-insufficient-balance-dialog.tsx:1-4 — the component is **self-contained** (owns its backdrop/panel/warning-icon/title/subtitle/list/info-pill/footer) and **generic** at the API level (opaque `{ id, label }[]` → ordered IDs). The "insufficient balance" framing is naming + styling; the mechanism (rank a flat list, confirm) is reusable.

## The exact business trigger (LIVE — corrected 2026-06-03)
`[CODE]` do-payment-priority-popup.component.ts:17-22 — the dialog opens when a do-payment order finalizes as **Failed + `CommChannelPriorityOrderRequired`**, and the popup then `getVisibleCommChannels(nodeId)` → opens the drag-drop priority dialog. **IMPORTANT DRIFT CORRECTION:** the live source explicitly notes "Failed + CommChannelPriorityOrderRequired (**any walletType** — server is the authoritative source of 'reorder needed'; **FE no longer AND-guards on walletType**)". The prior dossier's "`CommChannelPriorityOrderRequired` AND `WalletType.MultipleWallets`" pairing is **STALE** — the multi-wallet AND-guard was removed; the server's failure reason alone now decides.

The do-payment popup orchestrates the full flow (`[CODE]` :10-22):
1. `doPayment(emptyPriorities)` → orderId
2. join `OrderStatusRealtime` + catch-up `getOrderStatus` GET + bounded fallback poll
3. terminal `Failed + CommChannelPriorityOrderRequired` → fetch channels → open THIS dialog
4. on `(falconProceed)` → `doPayment(orderedPriorities)` → repeat
   (sibling terminal branches: `Completed` → success; `InsufficientFunds` → Falcon confirm "Top up balance"; `WalletNotConfigForTheNode` → explainer confirm.)

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A do-payment that needs a funding priority order must let the operator rank channels | `[CODE]` do-payment-priority-popup.component.ts:17-22 (`CommChannelPriorityOrderRequired`, server-authoritative) | The popup opens this dialog so the operator ranks channels; the order is resubmitted with `orderedIds`. |
| "The first channel will be used automatically" | `[CODE]` falcon-insufficient-balance-dialog.tsx:55,406-409 (`firstAutoLabel` info pill) | The dialog states, as a fixed info pill, that **rank 1 is consumed first** — making the ranking's consequence explicit. |
| Server is the source of truth for the seed order | `[CODE]` falcon-insufficient-balance-dialog.tsx:97-105 `@Watch('open')` re-seeds `orderedItems` from `items` on every false→true | The dialog does NOT persist the operator's last order locally — every open re-seeds from the caller-supplied (server-derived) order. |
| The reorder decision must be cancellable without side-effects | `[CODE]` falcon-insufficient-balance-dialog.tsx:140-152 (mutations target a local copy) | A cancelled dialog leaves server state untouched — the operator can back out of the funding decision. |

## Business constraints baked in
- `[CODE]` **Reorder mutations target a local working copy (`orderedItems`), never `items`** (tsx:73,140-152) — the caller's seed list is immutable; the ranking commits only on Proceed. A cancelled dialog = no server change.
- `[CODE]` **Esc + backdrop dismissal are suppressed while `busy`** (tsx:115-119,135-138) — once the operator presses Proceed and the resubmit is in flight, the dialog cannot be dismissed. The operator cannot abandon a submitting payment.
- `[CODE]` **Proceed is a no-op while `busy`/`loading`** (tsx:128-131) — double-submit prevented at the component level.
- `[CODE]` **Reorder controls are disabled while `busy`/`loading`** (tsx:293-296) — and the 4 arrow buttons give full keyboard parity, so every rank is reachable without a mouse.
- `[CODE]` **`allowDragDrop=false` inerts the drag handle** (tsx:66,159, Wave 16.1) — a flow can force arrow-button-only reordering (e.g. touch/a11y contexts).
- `[CODE]` **Proceed ALWAYS emits the full ordered ID list** (tsx:128-131) — even if unchanged. The caller treats "Proceed" as "commit this order", not "I made changes".

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Do-payment requiring channel priority | host-shell `do-payment-priority-popup` (the ONLY production render site) | Fired when a do-payment order finalizes `Failed + CommChannelPriorityOrderRequired`; operator ranks channels; order resubmitted with `orderedIds`. |
| Showcase demo | host-shell `falcon-ui-showcase/library-section` | Renders it under the `notifications` showcase category (a static demo, not a flow). |
| Generic flat-list ranking (reuse path) | (any future) | The dialog is intentionally generic — campaign recipient prioritization, route preference, etc. Override `headingText`/`confirmLabel`/`firstAutoLabel` for non-payment domains. |

## Business gotchas
- `[CODE]` **The walletType AND-guard is GONE (2026-06-02)** — do NOT re-introduce a `WalletType.MultipleWallets` check before opening this dialog; the server's `CommChannelPriorityOrderRequired` reason is authoritative for ANY walletType (do-payment-priority-popup.component.ts:17-18; `[MEMORY]` due-payment night-shift 2026-06-02).
- **It does NOT compose `falcon-dialog`** — deliberately self-contained (the 3 visual toggles need direct backdrop/icon-chip control). Do not assume `falcon-dialog` behaviour carries over. (But Phase B DID add a native `<dialog>` wrapper for Top-Layer promotion — see API/INTEGRATION.)
- **Do not re-sort `items` inside the dialog** — the caller owns the seed order; the dialog ranks what it is given.
- **The working order is encapsulated** — there is no way to read the operator's in-progress ranking externally; subscribe to `(falconProceed)` for the committed order.
- `[CODE]` **The footer Cancel/Proceed are raw `<button>`, NOT `<falcon-angular-button>`** (tsx:413-429) — a Falcon-component-over-native composition gap (GAP G-BTN; same family as B15 alert/confirm dialogs). Business-invisible, but a kit-consistency debt.
- `[INFERRED]` The name says "insufficient balance" but the API is generic — the warning icon + default labels (`'Proceed Payment'`, `'The first channel will be used automatically.'`) lean payment-flavored; override for other domains.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B17) — re-seed-on-open (tsx:97-105), local-copy mutations (tsx:140-152), busy-suppresses-dismissal (tsx:115-119), and Proceed-always-emits (tsx:128-131) re-confirmed in live source. **Trigger DRIFT corrected:** the `WalletType.MultipleWallets` AND-guard was REMOVED — server `CommChannelPriorityOrderRequired` alone now opens the dialog for any walletType (`[CODE]` do-payment-priority-popup.component.ts:17-18 + `[MEMORY]` due-payment 2026-06-02). Do-payment flow ✅ user-confirmed working (`[MEMORY]` night-shift 2026-06-02).
