# Validations — contracts-cost-management

> **No Reactive Forms used.** Every validator is a synchronous predicate inside a component getter. Two-way binding via `[(ngModel)]` + `FormsModule`. Validity is computed against the in-memory `ContractFormValue` and the stepper consults `isCurrentStepValid` to gate the Next button.

## Form validators (sync) — Add Wizard (4 steps)

File: `components/contracts-add-wizard/contracts-add-wizard.component.ts`

### Step 0 — Contract Information (`isContractInfoValid`, lines 241-252)
| Field | Rule | Source (line in wizard.ts) |
|---|---|---|
| `contractName`             | `.trim()` non-empty                                                                 | 243 |
| `startDate`                | not null (Date)                                                                      | 244 |
| `endDate`                  | not null (Date)                                                                      | 245 |
| `committedValue`           | not null AND `> 0`                                                                   | 246 |
| `startDate ↔ endDate`     | `startDate <= endDate` (same-day allowed — comment line 248-249: *"Commerce expands selected dates to Saudi local day boundaries, so a same-day contract is valid: start 00:00:00.000, end 23:59:59.999."*) | 250 |

### Step 1 — Rate Card (`areUnitConversionsValid`, lines 254-263)
| Field | Rule | Source (line) |
|---|---|---|
| `unitConversions.length` | > 0 | 255 |
| Per row `code` | `.trim()` non-empty | 257 |
| Per row `name` | `.trim()` non-empty | 258 |
| Per row `priceUnit` | `.trim()` non-empty | 259 |
| Per row `ratingUnit` | `.trim()` non-empty | 260 |
| Per row `priceValue` | not null AND `>= 0` | 261-262 |

Plus channel-locked `priceUnit`: `ContractsRateCardSectionComponent.ngOnChanges` (lines 35-48) **forces** the catalog-required `priceUnit` for known codes (WhatsApp→`ONE_KSA_TRANSACTION`, Voice→`ONE_KSA_SECOND`, AI-ChatGPT→`ONE_API_CALL`).

### Step 2 — Contract Details / Rate Matrix (`isRateMatrixValid`, lines 265-273)
| Field | Rule |
|---|---|
| `matrix.applicationId` | truthy |
| `matrix.channelId` | truthy |
| `matrix.ratingUnit` | truthy |
| Every cell `ratePerUnit` | not null AND `>= 0` |

The matrix is **completely filled** before the step is valid — every (priority × destination) cell needs a value. With 4 priorities × 11 destinations that's **44 mandatory cells** per matrix for messaging channels; voice = 3 × 11 = **33 cells**.

### Step 3 — Add-ons (`areAddonsValid`, lines 322-325)
Composite of two row validators:

`isQuotaValid(row)` (lines 275-303):
| Field | Rule |
|---|---|
| `quotaCode` | trim non-empty |
| `channelId` | truthy |
| `unit` | trim non-empty |
| `quotaCategory` | trim non-empty |
| `quotaType` | trim non-empty |
| `scope` | trim non-empty |
| `subService` | required **only when** `quotaCategory === 'SUB_SERVICE'` |
| Conditional amount | when `quotaCategory === 'USAGE'` → `includedAmount > 0` else → `includedUnits > 0` |

`isOverageRateValid(row)` (lines 305-320):
| Field | Rule |
|---|---|
| `subService` | trim non-empty |
| `channelId` | truthy |
| `unit` | trim non-empty |
| `unitPrice` | not null AND `>= 0` |
| `billingCycle` | trim non-empty |

Plus environment gates: `isCurrentStepValid` returns false while `saving === true`, `walletSettings === null`, or `loadingLookups === true` (when not on step 0).

## Form validators — Edit Contract (`isFormValid`, lines 222-263)

Same rules as the wizard's Step 0+1+2+3 combined (single composite). One quirk: edit also constrains by:
- `canSave` (line 118-120) = `!loadingLookups && !saving && isFormValid()`
- `hasRestrictedCommercialFields` (line 122-124) — commercial fields rendered read-only when status is `active | expired`, but **the values are NOT validated separately**; the disabled visual is purely CSS.

## Cross-step / cross-field business rules

| Rule | Where enforced | Notes |
|---|---|---|
| Channel-locked price unit | `ContractsRateCardSectionComponent` `ngOnChanges` + `priceUnitOptionsFor()` (lines 35-58) | Always corrects to catalog value on input change |
| Voice channel uses different priorities | `resolveRatePriorities()` (models.ts:468-478) | Auto-detects voice via channel id/label includes `'VOICE'` OR if any rate already uses HIGH/NORMAL/VERY_LOW |
| Status determines edit-ability | `canEditContractStatus(status)` (models.ts:579-581) | `pending | active | expired` all editable — backend overrides via `canEdit` flag on response |
| Status determines field freeze | `hasRestrictedContractCommercialFields(status)` (models.ts:583-585) | `active | expired` → commercial fields styled read-only |
| Wallet strategy required | container `onAddContract()` line 103-109 + template `[disabled]` line 71 | Hard gate: cannot start wizard without configured wallet |
| Same-day contract allowed | `startDate <= endDate` (NOT `<`) | Backend expands to local-day boundaries |

## Async validators
**None.** No `AsyncValidatorFn`, no debounced uniqueness checks, no remote name validation. [INFERRED] Backend likely returns a `FalconError` on duplicate contractName/farabiReferenceId — surfaced via the standard `unwrap()` → `error.message` → `errorMessage` field.

## Date format quirks
- `FalconCalendarComponent` returns a `Date` object via two-way `ngModel`.
- On submit: `toLocalContractDateValue` (api.service.ts:419-431) drops the time and serializes to `YYYY-MM-DDT00:00:00` (no timezone). Comment: *"do not use toISOString(), which shifts the day."*
- On load: backend's `startLocalDateTime` / `endLocalDateTime` overrides `startDate` / `endDate` when present (api.service.ts:258).
- Display: `Intl.DateTimeFormat(locale, {day:'2-digit', month:'short', year:'numeric'}).format(date).replace(/ /g, '-')` — produces `15-May-2026` style.

## Number-input quirks
`ContractsNumberInputComponent` (number-input.ts):
- `min` enforced at parse time (line 94-96) — values below `min` are clamped to `min`.
- Decimals: default 6 (`maximumFractionDigits`).
- Thousands separator on blur (Intl), stripped on focus.
- Returns `null` for empty / NaN inputs.
- NOT a `ControlValueAccessor` — pure `[value]`/`(valueChange)` binding.

## Output-side filters at submit
`toUpdatePayload` strips invalid/empty rows before POST/PUT:
- `rates` filtered to `ratePerUnit !== null` (api.service.ts:375)
- `quotas` filtered: `USAGE → includedAmount > 0` else `includedUnits > 0` (lines 384-387)
- `overageRates` filtered to `unitPrice !== null` (line 400)
- Empty `committedValue` defaults to `0` (line 365)
- All string fields `.trim()`ed (lines 361, 367, 380-381, 388-395, 402-405)

## Validation count (final tally)
- Step 0: **5** predicates
- Step 1: **6** predicates (per row, applied to all rows)
- Step 2: **4** predicates
- Step 3: **8 + 5** = 13 predicates (quotas + overage rates, applied to all rows)
- Environment gates: **3** (saving, wallet-strategy, loading-lookups)

Total: ~**25 validation predicates** across 4 wizard steps. None async. No `Validators.*` from `@angular/forms` are imported anywhere in the feature.
