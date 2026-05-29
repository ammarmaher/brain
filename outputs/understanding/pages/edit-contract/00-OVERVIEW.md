*** Edit Contract — Overview ***
*** SoT for tab-based edit · 2026-05-18 ***

# Edit Contract — Overview

> Edits an existing Contract. Falcon-user-only. Differs from Add: (1) loads existing contract first, (2) renders as 4 tabs (not stepper), (3) status-aware field freeze, (4) single PUT instead of POST.

## Source-of-truth

- [PRD] BR-CC-50..56 (`Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md`) — status-aware restrictions
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- [CODE] `apps/admin-console/.../contracts-cost-management/components/contracts-edit-contract/contracts-edit-contract.component.ts:52-291`

## Trigger

- From **View mode**: click "Edit" button in header.
- Gated by: `currentContract.canEdit === true` (server-computed flag).

## The 4 tabs

| Tab | Title | Detail file |
|---|---|---|
| 1 | Contract Information | [02-TAB_1_INFO](02-TAB_1_INFO.md) |
| 2 | Rate Card | [03-TAB_2_RATE_CARD](03-TAB_2_RATE_CARD.md) |
| 3 | Contract Details | [04-TAB_3_CONTRACT_DETAILS](04-TAB_3_CONTRACT_DETAILS.md) |
| 4 | Add-ons | [05-TAB_4_ADDONS](05-TAB_4_ADDONS.md) |

[CODE] `activeTab: EditTabKey = 'contractInformation' | 'rateCard' | 'contractDetails' | 'addons'`.

## Status-aware field freeze

[CODE] `hasRestrictedCommercialFields` lines 122-124:

```typescript
hasRestrictedCommercialFields(): boolean {
  return this.contract.status === 'active' || this.contract.status === 'expired';
}
```

| Status | All fields | Commercial fields (rates, quotas, overage) | UX |
|---|---|---|---|
| `pending` | editable | editable | Full edit |
| `active` | partial (name+farabi OK; dates restricted) | **frozen** (disabled with CSS, NOT validated) | "Most fields locked while contract is active" |
| `expired` | nearly all frozen | **frozen** | "Contract expired. You may extend the end date." |

Detailed in [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md).

## Submit

```
PUT commerce/Contracts/{contractId}
Body: same composite shape as Add (CreateContractRequest with all 4 sections)
Response: ServiceOperationResult<ApiContractResponse> → ContractDetails
```

## Save call

[CODE] `submit()` lines 132-156:

```typescript
submit(): void {
  if (!this.canSave) return;
  this.saving = true;
  this.contractsApi.updateContract(this.contract.id, this.form)
    .subscribe({
      next: details => { this.saving = false; this.saved.emit(details); },
      error: err => { this.saving = false; this.errorMessage = err.message; },
    });
}
```

Called externally via `@ViewChild` from the container header.

## Sequence

```
View mode → user clicks "Edit"
              │ (guarded: currentContract.canEdit === true)
              ▼
Edit mode opens → contract pre-populates 4 tabs
              │
              ▼
User navigates between tabs (free navigation — NOT a stepper)
              │
              ▼
User clicks Save (from container header)
              │
              ▼
PUT commerce/Contracts/{id}
              │
              ▼
On success → mode = 'view' + refresh list + emit (saved)
              │
              ▼
Kafka: commerce.contract-updated.v1
```

## Extension (special case)

If contract is `expired`, the only editable field is `endDate` (push to future). Save with new endDate flips status back to `active` (server-side).

## See also

- [02-TAB_1_INFO](02-TAB_1_INFO.md) · [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)

## Hubs

[[Edit Contract Flow]] · [[Contracts List]] · [[Add Contract Flow]] · [[03 Contract Packaging Charging Billing Management]]
