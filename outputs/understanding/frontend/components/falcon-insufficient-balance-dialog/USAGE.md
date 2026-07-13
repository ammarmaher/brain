# falcon-insufficient-balance-dialog — USAGE

## Real usage in the workspace

`[CODE]` The ONLY production render site is `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.html:5-…` — a feature wrapper that owns the do-payment orchestration in its `.ts` and binds the dialog's inputs/outputs here. (The showcase `library-section.component.ts:945` renders a static demo.)

### Example 1 — the live do-payment popup binding

`apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.html`:

```html
<!-- The library tag is purely presentational; this wrapper owns the API orchestration in its .ts. -->
<falcon-angular-insufficient-balance-dialog
  [open]="dialogOpen()"
  [items]="dialogItems()"
  [loading]="dialogLoading()"
  [busy]="dialogBusy()"
  [errorMessage]="dialogError() ?? undefined"
  [showGlossy]="showGlossy"
  [showIconColor]="showIconColor"
  [showIconBackground]="showIconBackground"
  [allowDragDrop]="allowDragDrop"
  [fit]="fit"
  [headingText]="'falcon.dialogs.insufficientBalance.title' | translate"
  [subtitle]="'falcon.dialogs.insufficientBalance.subtitle' | translate"
  [confirmLabel]="'falcon.dialogs.insufficientBalance.proceed' | translate"
  [cancelLabel]="'falcon.dialogs.insufficientBalance.cancel' | translate"
  [dragLabel]="'falcon.dialogs.insufficientBalance.dragLabel' | translate"
  [firstAutoLabel]="'falcon.dialogs.insufficientBalance.firstAuto' | translate"
  [moveUpLabel]="'falcon.dialogs.insufficientBalance.moveUp' | translate"
  [moveDownLabel]="'falcon.dialogs.insufficientBalance.moveDown' | translate"
  (falconProceed)="onProceed($event.orderedIds)"
  (falconCancel)="onCancel($event.reason)" />
```

- All labels are bound to `| translate` keys (the dialog takes pre-translated strings). `[errorMessage]` uses `?? undefined` — never pass `null`.

### Example 2 — the LIVE do-payment orchestration shape (corrected 2026-06-03)

`apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.ts:10-22` (banner) describes the real flow:

```text
1. doPayment(emptyPriorities) → orderId
2. OrderStatusRealtimeService.joinOrder(orderId) + subscribe "OrderFinalized" push
3. catch-up getOrderStatus GET once (order may finalize before the socket opens)
4. fallback getOrderStatus GET if no push within environment.orderStatus.pollTimeoutMs
5. terminal status → handleTerminal:
   • Completed → success
   • Failed + CommChannelPriorityOrderRequired (ANY walletType — server is authoritative;
     FE no longer AND-guards on walletType) → getVisibleCommChannels(nodeId) → open THIS dialog
   • InsufficientFunds → Falcon confirm "Top up balance"
   • WalletNotConfigForTheNode → Falcon confirm explainer
6. on (falconProceed) → doPayment(orderedPriorities) → repeat
```

> **DRIFT CORRECTION:** the prior dossier's illustrative `submit()` sample AND-guarded on `status.walletType === WalletType.MultipleWallets`. The LIVE code REMOVED that guard (`[CODE]` :17-18) — `CommChannelPriorityOrderRequired` alone now opens the dialog. Also: the live flow uses a SignalR `OrderFinalized` push + a bounded GET fallback, NOT a fixed 2s `SimplePollService` loop (that was the older illustrative sample).

### Example 3 — Without glossy + neutral icon

```html
<falcon-angular-insufficient-balance-dialog
  [open]="open" [items]="items"
  [showGlossy]="false" [showIconColor]="false" [showIconBackground]="false" ... />
```

### Example 4 — Generic (non-payment) reuse

```html
<falcon-angular-insufficient-balance-dialog
  [open]="open" [items]="recipients"
  [headingText]="'campaign.prioritizeRecipients.title' | translate"
  [confirmLabel]="'campaign.prioritizeRecipients.send' | translate"
  [firstAutoLabel]="'campaign.prioritizeRecipients.firstAuto' | translate"
  (falconProceed)="dispatchInOrder($event.orderedIds)"
  (falconCancel)="open = false" />
```

> Override `headingText` / `confirmLabel` / `firstAutoLabel` for non-payment domains — the defaults lean payment-flavored.

### On Proceed — map ordered IDs to priorities

```ts
onProceed(orderedIds: string[]) {
  const priorities = orderedIds.map((channelId, i) => ({ commChannelPriorityId: i + 1, channelId }));
  // resubmit doPayment with `priorities`; index 0 = top priority = commChannelPriorityId 1
}
```

## Per-instance dimension / token override

```html
<falcon-angular-insufficient-balance-dialog
  style="--falcon-ib-dialog-row-height: 56px; --falcon-ib-dialog-row-min-width: 320px; --falcon-ib-dialog-row-radius: 12px"
  ... />
```

> `[CODE]` Per-instance `style="--falcon-ib-dialog-*"` tokens cascade into the SHADOW path cleanly. **CAVEAT:** the `-tw` (default) twin reads several values as raw `var(--color-falcon-*)` palette refs rather than `--falcon-ib-dialog-*` tokens (e.g. the error banner `bg-[var(--color-falcon-red-50,…)]`, the drag-over border `var(--color-falcon-teal-500,…)`), so a per-instance `--falcon-ib-dialog-*` override may retint the Shadow path only (GAP G-TOK). Geometry tokens (`row-height`/`row-gap`/etc.) DO flow to both.

## Import requirements

```ts
@Component({ standalone: true, imports: [FalconAngularInsufficientBalanceDialogComponent] })
```

The `-tw` tag registers automatically via `defineFalconTwComponent('falcon-insufficient-balance-dialog')` in the wrapper's `ngOnInit`. The wrapper also relocates its host to `<body>` in `ngOnInit` (`appendTo='body'` default) and detaches in `ngOnDestroy`.

## Do / Don't

| Do | Don't |
|---|---|
| Bind `[open]` + handle `(openChange)` / `(falconCancel)` | Use a `[(open)]` banana-box (none — it's manual get/set + `openChange`) |
| Pass `undefined` to `[errorMessage]` when no error | Pass `null` (wrapper input is `string \| undefined`) |
| Pass pre-translated label strings | Pass raw i18n keys (the dialog renders the string as-is) |
| Bind `[items]` as a property | Try to set it as an attribute |
| Subscribe to `(falconProceed)` for the committed order | Try to read the dialog's in-progress working order externally |
| Let the operator dismiss before submit | Toggle `[open]=false` mid-submit (loses the retry path; the dialog also suppresses dismissal while `busy`) |
| Override labels for non-payment reuse | Re-introduce a `walletType` AND-guard before opening (REMOVED 2026-06-02) |
| Use `<falcon-angular-popup>` for binary yes/no | Use THIS for a 2-option decision |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-insufficient-balance-dialog>` across `apps/` + `libs/falcon/` → **2 RENDER sites**:
- `apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.html:5` — the ONLY production render.
- `apps/host-shell/.../falcon-ui-showcase/library-section/library-section.component.ts:945` — static showcase demo.

[CODE] Other matches reference the TYPE/orchestration, not a render: `do-payment-priority-popup.component.ts` (the orchestrator), `new-wallet-balance` `data/transfer-request.ts` + `validations/validations.ts` + 3 `__tests__/*.spec.ts` (reuse the `IbDialogItem`/priority shape), `wallet-balance-management` `models/transfer.models.ts` + `validations/validations.ts` + `balance-transfer.component.ts`, `marketplace-applications` + `comms-hub` + `showcase-data` registry/skeletons. (`libs/falcon/` → **0 render sites**.)

> `[INFERRED]` Consumer count unchanged from the prior "3" in spirit (the dialog has exactly ONE live render site + one demo); the extra type/data references are the wallet-transfer features borrowing the priority-list shape, not new render sites.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17). Example 1 confirmed against do-payment-priority-popup.component.html:5-…; the orchestration shape (Example 2) corrected to the LIVE SignalR-push + walletType-guard-removed flow (do-payment-priority-popup.component.ts:10-22). Consumer Sweep re-run → 2 render sites (1 live + 1 demo). `-tw` token-parity caveat (G-TOK) added.
