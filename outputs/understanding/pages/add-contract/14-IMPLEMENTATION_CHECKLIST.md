*** Add Contract — Implementation checklist ***
*** Pre-code gate + tasks · 2026-05-18 ***

# Add Contract — Implementation Checklist

## Verification gate

- [ ] 1. PRD rules? → BR-CC-01..20 (creation) + BR-CC-50..56 (status)
- [ ] 2. Endpoint? → `POST commerce/Contracts` composite
- [ ] 3. Lookups? → applications + channels + walletStrategy
- [ ] 4. ~28 validations across 4 steps? → see [07-VALIDATIONS](07-VALIDATIONS.md)
- [ ] 5. Channel-locked price units? → WhatsApp=ONE_KSA_TRANSACTION, Voice=ONE_KSA_SECOND, AI=ONE_API_CALL
- [ ] 6. Voice channel priorities? → HIGH/NORMAL/VERY_LOW (vs WhatsApp's AUTH/UTIL/AD/SVC)
- [ ] 7. Date wire format? → `YYYY-MM-DDT00:00:00`
- [ ] 8. Casing? → PascalCase (Commerce)

## Frontend tasks

### Setup
- [ ] Create container/wizard component using Reactive Forms (`FormBuilder.group({...})`).
- [ ] Inject `ContractsApiService`, `FalconToastService`, `FalconConfirmService`.

### Wizard shell
- [ ] Use `<falcon-stepper>` (Stencil) — replaces legacy `<dynamic-stepper>`.
- [ ] 4 steps: Info / Rate Card / Contract Details / Add-ons.
- [ ] `allowNavigation: false`, `disableBackButtonOnFirstStep: true`.

### Step 1 — Contract Info
- [ ] `<falcon-input>` contractName · `[required]`.
- [ ] `<falcon-input>` farabiReferenceId · `[required, maxlength=50]`.
- [ ] Add **async validator** for FarabiId uniqueness (pending backend endpoint).
- [ ] `<falcon-calendar>` startDate · `[required, dateNotInPast]`.
- [ ] `<falcon-calendar>` endDate · `[required, dateGteStart]`.
- [ ] `<falcon-input-number>` committedValue · `[required, positive]`.

### Step 2 — Rate Card
- [ ] Auto-populate rows from `channelOptions` on lookup load.
- [ ] Lock `priceUnit` to catalog-required per channel.
- [ ] Show `ratingUnit` display-only.
- [ ] `<app-contracts-number-input>` for priceValue.

### Step 3 — Contract Details (matrix)
- [ ] App + channel `<falcon-select>` cascades.
- [ ] Auto-detect voice priorities vs WhatsApp.
- [ ] 11 destination cols.
- [ ] Cell editor: number-input with min=0, decimals=6.
- [ ] **GAP-CC-ADD-44CELLS**: add "Bulk fill" affordance.

### Step 4 — Add-ons
- [ ] Two tables: quotas, overageRates.
- [ ] Add/remove row buttons.
- [ ] Catalog-driven options per channel.
- [ ] Conditional fields (subService when category=SUB_SERVICE).

### Submit
- [ ] `mapFormToCreateContractRequest(form)` (PascalCase output).
- [ ] `dateToLocalContractWire(date)` (YYYY-MM-DDT00:00:00).
- [ ] POST → on success: `(saved).emit(details)` → close.
- [ ] On error: surface inline error at footer.

### UX guards
- [ ] Confirm on Cancel if form is dirty (GAP-CC-ADD-DISCARD-GUARD fix).
- [ ] (Optional) localStorage draft per accountId (GAP-CC-ADD-NOSAVEDRAFT).

### Cleanup
- [ ] No SCSS [F-017]. No `*ngIf`/`*ngFor` [F-018]. No PrimeNG [F-016]. No ngModel forms [F-022].
- [ ] Signals everywhere.
- [ ] Aria labels on all inputs.

## Backend tasks

- [ ] Verify `POST commerce/Contracts` accepts the composite shape correctly.
- [ ] Verify FluentValidation chain matches PRD BR-CC-01..20.
- [ ] **GAP-CC-ADD-NOUNIQUE**: add `GET commerce/Contracts/exists?accountId=&farabiReferenceId=` endpoint OR rely on 422 rejection.
- [ ] Verify Kafka emit on success: `commerce.contract-created.v1`.
- [ ] Verify Charging consumer creates the wallet balance row.

## E2E tests

- [ ] Author full WhatsApp + Voice contract → POST succeeds → status=pending.
- [ ] Duplicate FarabiId → 422 with inline error.
- [ ] StartDate < today → 422.
- [ ] Wallet strategy missing → Add button disabled at list (precondition).
- [ ] Cancel mid-wizard → confirm dialog → discard works.
- [ ] After create, navigate to wallets page → contract balance shows `available = committedValue`.

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
