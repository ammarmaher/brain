*** Add Contract — Validations ***
*** ~28 predicates across 4 steps · 2026-05-18 ***

# Add Contract — Validations

> Old-UI uses **NO Reactive Forms**. Every validator is a synchronous getter against in-memory `ContractFormValue`. NEW UI MUST migrate to Reactive Forms [F-022].

## V-rules

| V-rule | Step | FE check | BE attribute |
|---|---|---|---|
| `V-contract-name-required` | 1 | `.trim()` non-empty | `[Required, MaxLength(?)]` |
| `V-contract-farabi-required-le-50` | 1 | non-empty + ≤50 (PRD BR-CC-04) | `[Required, MaxLength(50)]` |
| `V-contract-start-date-future` | 1 | `>= today` (per PRD: future-dated) | `[Future]` custom |
| `V-contract-end-after-start` | 1 | `startDate <= endDate` | custom |
| `V-contract-value-positive` | 1 | `> 0` | `[Required, Positive]` |
| `V-rate-card-non-empty` | 2 | `rows.length > 0` | `[Required]` |
| `V-rate-card-row-complete` | 2 | per row: code/name/priceUnit/ratingUnit/priceValue all set | `[ValidateNested]` |
| `V-rate-card-channel-locked-unit` | 2 | catalog auto-correct | enum validator |
| `V-rate-matrix-app-channel-selected` | 3 | applicationId && channelId | `[Required]` |
| `V-rate-matrix-all-cells-filled` | 3 | every cell `ratePerUnit != null` | `[ValidateNested]` |
| `V-rate-matrix-rate-non-negative` | 3 | `>= 0` | `[Range(0, ...)]` |
| `V-quota-fields-required` | 4 | quotaCode/channelId/unit/category/type/scope | `[Required]` |
| `V-quota-sub-service-when-category-sub` | 4 | `category === 'SUB_SERVICE'` → subService non-empty | conditional |
| `V-quota-amount-positive-for-usage` | 4 | `USAGE` → `includedAmount > 0` | conditional |
| `V-quota-units-positive-for-sub` | 4 | `SUB_SERVICE` → `includedUnits > 0` | conditional |
| `V-overage-rate-fields-required` | 4 | subService/channelId/unit/billingCycle | `[Required]` |
| `V-overage-rate-price-non-negative` | 4 | `unitPrice >= 0` | `[Range(0, ...)]` |

## Environment gates

[CODE] `isCurrentStepValid` lines 118-139:

```typescript
get isCurrentStepValid(): boolean {
  if (this.saving) return false;
  if (this.walletSettings == null) return false;  // unless on step 0
  if (this.currentStep > 0 && this.loadingLookups) return false;
  switch (this.currentStep) {
    case 0: return this.isContractInfoValid();
    case 1: return this.areUnitConversionsValid();
    case 2: return this.isRateMatrixValid();
    case 3: return this.areAddonsValid();
  }
  return false;
}
```

## Cross-step business rules

| Rule | Where enforced | Source |
|---|---|---|
| Channel-locked price unit | `ContractsRateCardSectionComponent.ngOnChanges` (auto-corrects) | [CODE] lines 35-58 |
| Voice channel uses HIGH/NORMAL/VERY_LOW priorities | `resolveRatePriorities()` | `models.ts:468-478` |
| Same-day contract allowed | `startDate <= endDate` (not strict <) | [CODE] line 250 |
| Wallet strategy precondition | Container hard gate | `contracts-cost-management.component.ts:103-109` |
| FarabiId uniqueness | NO async check — BE catches duplicate | `[INFERRED]` GAP-CC-ADD-NOUNIQUE |

## Async validators

**None.** No debounced uniqueness, no remote name validation. PRD says FarabiId is "unique per account" — BE rejects on duplicate. NEW UI should add debounced `GET commerce/Contracts/exists?accountId={accId}&farabiReferenceId={ref}` if endpoint exists, OR rely on submit-time failure.

## Output-side filters at submit

`toCreatePayload` (similar to `toUpdatePayload`):

- `rates` → filter `ratePerUnit !== null`
- `quotas` → filter `(USAGE → includedAmount > 0)` else `includedUnits > 0`
- `overageRates` → filter `unitPrice !== null`
- All strings `.trim()`
- Empty `committedValue` defaults to `0` (line 365)

## Validation count

- Step 1: **5** predicates
- Step 2: **6** predicates per row (×N rows)
- Step 3: **3** predicates + every cell
- Step 4 quotas: **8** predicates per row + conditional
- Step 4 overage: **5** predicates per row
- Environment: **3** gates

Total: ~**28+** predicates. Backend enforces equivalent FluentValidation chain.

## See also

- [02-STEP_1_INFO](02-STEP_1_INFO.md) · [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) · [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) · [05-STEP_4_ADDONS](05-STEP_4_ADDONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
