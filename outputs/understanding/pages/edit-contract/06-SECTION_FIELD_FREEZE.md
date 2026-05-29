*** Edit Contract — Section: Field freeze ***
*** Status-aware editability per BR-CC-50..56 · 2026-05-18 ***

# Edit Contract — Field Freeze

> The key business rule that distinguishes Edit from Add. Editability is computed from the contract's current status.

## The two derived flags

[CODE] `contracts-edit-contract.component.ts:118-124`:

```typescript
get canSave(): boolean {
  return !this.loadingLookups && !this.saving && this.isFormValid();
}

get hasRestrictedCommercialFields(): boolean {
  return this.contract.status === 'active' || this.contract.status === 'expired';
}
```

Plus helpers in `contracts.models.ts:579-585`:

```typescript
function canEditContractStatus(status: ContractStatus): boolean {
  return status === 'pending' || status === 'active' || status === 'expired';
  // All editable — but with restrictions per hasRestrictedContractCommercialFields
}

function hasRestrictedContractCommercialFields(status: ContractStatus): boolean {
  return status === 'active' || status === 'expired';
}
```

## Per-status editability matrix

| Field | Pending | Active | Expired |
|---|---|---|---|
| Tab 1 — Contract Name | ✓ | ✓ | ✗ |
| Tab 1 — Farabi Ref | ✓ | ✓ | ✗ |
| Tab 1 — Start Date | ✓ | ✗ | ✗ |
| Tab 1 — End Date | ✓ | ✓ (push only) | ✓ (extension) |
| Tab 1 — Committed Value | ✓ | ✗ | ✗ |
| Tab 2 — Rate Card | ✓ | ✗ | ✗ |
| Tab 3 — Rate Matrix | ✓ | ✗ | ✗ |
| Tab 4 — Quotas | ✓ | ✗ | ✗ |
| Tab 4 — Overage Rates | ✓ | ✗ | ✗ |

## Why this design

[PRD] BR-CC-50..56:
- **Pending**: contract not yet active; full edits OK.
- **Active**: customers may have used balance; commercial fields would invalidate audit + projections.
- **Expired**: contract closed; only extension affords change.

## CSS implementation

[CODE] `commercialFieldInputClass`:

```typescript
get commercialFieldInputClass(): string {
  return this.hasRestrictedCommercialFields
    ? '!bg-falcon-neutral-100 !cursor-not-allowed'
    : '';
}
```

Applied to every commercial-field input. `!important` is intentional — overrides any cell-level styling.

## Backend enforcement

Backend re-validates in the `UpdateContractRequest` validator:
- Active contract trying to change `committedValue` → `Error.Contracts.CommittedValueLocked`
- Expired contract trying to change anything except endDate → `Error.Contracts.ExpiredFieldLocked`

## Why FE doesn't strictly validate

[CODE] line 70 of old-UI dossier comment:

> the disabled visual is purely CSS; **the values are NOT validated separately**.

→ FE relies on `[disabled]` to prevent input. BE rejects edge-case attempts (e.g. dev tools manipulation).

## NEW UI improvement

Hide locked fields entirely OR show them with a lock icon prefix + tooltip "Locked while contract is active" — more discoverable than gray bg alone.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-TAB_1_INFO](02-TAB_1_INFO.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
