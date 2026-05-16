# Validations — testing-charging

## Form validators (sync)

[CODE] The simulator form is **`FormsModule` template-driven**, not `ReactiveFormsModule`. There are zero `Validators.*` calls and zero `FormBuilder.group(...)` calls in the entire feature. All validation is expressed inline in the template via native HTML attributes (`min`, `max`, `required` by use, `disabled` by state).

| Form | Field | Validator | Implementation | Source |
|---|---|---|---|---|
| Simulator | `messageCount` | `min(1)`, `max(1000)` | `<input type="number" name="messageCount" [(ngModel)]="simulator.messageCount" min="1" max="1000" />` | `testing-charging.component.html:322` |
| Simulator | `quantityPerMessage` | `min(1)` | `<input type="number" name="quantityPerMessage" [(ngModel)]="simulator.quantityPerMessage" min="1" />` | `:323` |
| Simulator | `reservationTtlSeconds` | `min(1)` | `<input type="number" name="reservationTtlSeconds" [(ngModel)]="simulator.reservationTtlSeconds" min="1" />` | `:326` |
| Simulator | `parallelism` | `min(1)`, `max(100)` | `<input type="number" name="parallelism" [(ngModel)]="simulator.parallelism" min="1" max="100" />` | `:329` |
| Simulator | `successRate` | `min(0)`, `max(100)` | `<input type="number" name="successRate" [(ngModel)]="simulator.successRate" min="0" max="100" />` | `:339` |
| Simulator | `applicationId` | implicit-required (empty option `disabled`) | `<option value="" disabled>Select application</option>` | `:305` |
| Simulator | `ownerId` | implicit-required (empty option `disabled`, dropdown disabled when no owners) | `<option value="" disabled>Select owner wallet</option>` + `[disabled]="ownerOptions.length === 0"` | `:294-297` |

[INFERRED] Browser-level HTML validation only — the form does not block submission via Angular validators. The `canCreateBatch` derived guard (below) is the only Angular-level gate.

## Derived validation gates

### canCreateBatch (getter, `testing-charging.component.ts:277-284`)

```typescript
get canCreateBatch(): boolean {
  return !!this.selectedAccount &&
    !!this.simulator.ownerId &&
    !!this.simulator.applicationId &&
    !!this.simulator.priority &&
    !!this.simulator.destination &&
    !this.runningBatch;
}
```

[CODE] Bound to the Create Testing Batch button's `[disabled]="!canCreateBatch"` (`testing-charging.component.html:341`). Effectively a 6-clause cross-field validator:

| Clause | Meaning |
|---|---|
| `!!this.selectedAccount` | An account must be selected from the left list |
| `!!this.simulator.ownerId` | The owner-wallet dropdown must have a selection |
| `!!this.simulator.applicationId` | An application must be selected |
| `!!this.simulator.priority` | A priority/category must be selected (always-true default `UTILITY`) |
| `!!this.simulator.destination` | A destination must be selected (always-true default `JOR`) |
| `!this.runningBatch` | No in-flight create/trigger operation |

### Trigger Delivery buttons

[CODE] `<button [disabled]="runningBatch">Trigger Delivered/Failed/Mixed</button>` (`testing-charging.component.html:253-255`) — the three delivery-trigger buttons are gated only by `runningBatch`. They additionally early-return at runtime if `!this.selectedRun` (`testing-charging.component.ts:244`).

## Async validators

**None.** There are no `AsyncValidatorFn`, no debounced uniqueness checks, no server-side hint validation. The form submits straight to `POST /api/testing/charging/whatsapp/batches` and surfaces any backend error via the generic `error` banner.

## Business rules captured in code

### 1. Wallet-strategy eligibility filter

[CODE] `testing-charging.component.ts:133-135`:
```typescript
get walletStrategyAccounts(): TestingChargingAccount[] {
  return this.accounts.filter(account => account.walletStrategyConfigured);
}
```
Rule: only accounts where the backend has flagged `walletStrategyConfigured === true` are eligible for the testing lab. Accounts without a wallet strategy are silently hidden from the left list (no UI hint, no count).

### 2. Owner-wallet filtering for WhatsApp scope

[CODE] `testing-charging.component.ts:156-185` — the `ownerOptions` getter filters wallets to:
- ownerType in `{ NODE, USER }`
- channel is `ALL` OR `whatsappChannelId` is unresolved OR channel matches the resolved WhatsApp channel id

Rule: account-level wallets are never selectable as simulator owners; you must target a node or user wallet. WhatsApp-scoped wallets win over generic `ALL` wallets when a WhatsApp channel can be resolved.

### 3. Auto-pick the wallet with the most available balance

[CODE] `testing-charging.component.ts:291-298`:
```typescript
private applySimulatorWalletDefaults(): void {
  const runtimeWallet = this.ownerOptions
    .sort((a, b) => Number(this.hasAvailableWalletBalance(b.value)) - Number(this.hasAvailableWalletBalance(a.value)))[0];
  if (!runtimeWallet) return;
  this.selectSimulatorOwner(runtimeWallet.value);
}
```
Rule: prefer a wallet with non-zero `available` balance — the lab will not auto-target a depleted wallet (though the user can still pick one manually).

### 4. Auto-pick the first valid subscribed application

[CODE] `testing-charging.component.ts:305-311`:
```typescript
private applySimulatorApplicationDefault(account: TestingChargingAccount): void {
  const firstApplicationId = account.subscribedApplications?.find(a => !!a.applicationId)?.applicationId ?? '';
  if (!this.simulator.applicationId || !account.subscribedApplications?.some(a => a.applicationId === this.simulator.applicationId)) {
    this.simulator.applicationId = firstApplicationId;
  }
}
```
Rule: if no app is selected OR the previously-selected app is not subscribed by the new account, replace it with the first subscribed app id. The comment at `:301-303` explains this protects against stale demo values (`SurveyApp`) that may not exist in the active contract tariff.

### 5. Reservation TTL guidance

[CODE] Template hint at `:327`: *"Manual batches use at least 3600 seconds so QA has time to trigger delivery."* — this is documentation in the UI, not enforced; the only enforcement is the input's `min="1"`.

### 6. WhatsApp channel resolution

[CODE] `testing-charging.component.ts:359-374` — `resolveWhatsappChannelId()`:
- First, scan wallets for a non-`ALL` channel whose name or quota metadata contains `WHATSAPP`
- If none found, scan all buckets for one whose `quotaCode`/`subService`/`bucketId` includes `WHATSAPP` and take its `serviceScope`
- Return undefined if neither succeeds

Rule: the simulator is WhatsApp-specific, but accounts may be configured with a single `ALL` wallet — in that case the lab has to derive the activated WhatsApp channel id from bucket metadata so the OCS reserve path has the right `channelId`.

## Validators by count

- Reactive form validators: **0**
- Async validators: **0**
- Template-level HTML constraints: **7** (5 numeric `min`/`max` + 2 `disabled`-empty-option)
- Derived/cross-field gates: **1** (`canCreateBatch`)
- Business rule helpers (eligibility / defaulting / resolution): **6**
