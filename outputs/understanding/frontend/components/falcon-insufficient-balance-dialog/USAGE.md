# falcon-insufficient-balance-dialog — USAGE

## Real usage in the workspace

[applications-table.component.html](../../../../../Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html) — fired from the `doPayment` row action; consumed by both `comm-channels-tab` + `apps-services-tab` (they share `ApplicationsTableComponent`).

## Minimal template

```html
<falcon-angular-insufficient-balance-dialog
  [open]="dialogOpen()"
  [items]="channels()"
  [loading]="loading()"
  [busy]="submitting()"
  [errorMessage]="error()"
  [headingText]="'falcon.dialogs.insufficientBalance.title' | translate"
  [subtitle]="'falcon.dialogs.insufficientBalance.subtitle' | translate"
  [confirmLabel]="'falcon.dialogs.insufficientBalance.proceed' | translate"
  [cancelLabel]="'falcon.dialogs.insufficientBalance.cancel' | translate"
  (falconProceed)="onProceed($event.orderedIds)"
  (falconCancel)="dialogOpen.set(false)" />
```

## Without glossy + neutral icon

```html
<falcon-angular-insufficient-balance-dialog
  [open]="open"
  [items]="items"
  [showGlossy]="false"
  [showIconColor]="false"
  [showIconBackground]="false"
  ... />
```

## Real backend wire-up (Falcon Commerce)

```ts
import {
  CommChannelPaymentService,
  OrderStatusService,
  SimplePollService,
  ProcessState,
  OrderFailureReason,
  WalletType,
} from '@falcon';

private payment     = inject(CommChannelPaymentService);
private orderStatus = inject(OrderStatusService);
private poll        = inject(SimplePollService);

onDoPayment(commChannelId: string, accountId: string, nodeId: string) {
  this.submit(commChannelId, accountId, nodeId, []);
}

onProceed(orderedIds: string[]) {
  const priorities = orderedIds.map((channelId, i) => ({ commChannelPriorityId: i + 1, channelId }));
  this.submit(this.activeChannelId!, this.accountId, this.nodeId, priorities);
}

private submit(commChannelId: string, accountId: string, nodeId: string, priorities: CommChannelPriority[]) {
  this.busy.set(true);
  this.payment.doPayment({ accountId, commChannelId, commChannelPriorityIds: priorities })
    .subscribe(({ orderId }) => this.beginPoll(orderId, commChannelId, accountId, nodeId));
}

private beginPoll(orderId, commChannelId, accountId, nodeId) {
  this.poll.watch({
    serviceMethod: () => this.orderStatus.getOrderStatus(orderId),
    intervalSeconds: 2,
    shouldStop: s => s.status !== ProcessState.Pending && s.status !== ProcessState.Running,
  }).data$.subscribe(status => {
    this.busy.set(false);
    if (status.status === ProcessState.Completed) {
      this.open.set(false);
      return;
    }
    if (status.failureReason === OrderFailureReason.CommChannelPriorityOrderRequired
     && status.walletType === WalletType.MultipleWallets) {
      this.loading.set(true);
      this.open.set(true);
      this.payment.getVisibleCommChannels(nodeId).subscribe(channels => {
        this.items.set(channels.sort((a, b) => a.PriorityOrder - b.PriorityOrder)
          .map(c => ({ id: c.ChannelId, label: c.ChannelName })));
        this.loading.set(false);
      });
    }
  });
}
```

## Generic (non-commerce) usage

```html
<falcon-angular-insufficient-balance-dialog
  [open]="open"
  [items]="recipients"
  [headingText]="'campaign.prioritizeRecipients.title' | translate"
  [subtitle]="'campaign.prioritizeRecipients.subtitle' | translate"
  [confirmLabel]="'campaign.prioritizeRecipients.send' | translate"
  (falconProceed)="dispatchInOrder($event.orderedIds)"
  (falconCancel)="open = false" />
```

## Per-instance dimension override

```html
<falcon-angular-insufficient-balance-dialog
  style="--falcon-ib-dialog-row-height: 56px; --falcon-ib-dialog-row-min-width: 320px; --falcon-ib-dialog-row-radius: 12px"
  ... />
```

## Import requirements

```ts
@Component({
  standalone: true,
  imports: [FalconAngularInsufficientBalanceDialogComponent],
})
```

The underlying `-tw` Stencil tag registers automatically via `defineFalconTwComponent('falcon-insufficient-balance-dialog')` inside the wrapper's `ngOnInit`.

## Bad usage to avoid

- **Don't toggle `[open]=false` mid-submit** — the user loses the ability to retry on server failure.
- **Don't re-sort items inside the dialog** — caller owns the seed order.
- **Don't try to read the dialog's working state externally** — it's encapsulated; subscribe to `(falconProceed)`.
- **Don't pass raw `null` to `errorMessage`** — use `undefined` (Angular wrapper input is `string | undefined`).
- **Don't use this for binary yes/no decisions** — use `<falcon-angular-popup>`.
