*** Edit Contract — Tab 1: Contract Information ***
*** 2026-05-18 ***

# Edit Contract — Tab 1: Contract Information

> Same fields as Add Contract Step 1, but status-aware field freeze applies.

## Fields per status

| Field | Pending | Active | Expired |
|---|---|---|---|
| `contractName` | editable | editable | read-only |
| `farabiReferenceId` | editable | editable | read-only |
| `startDate` | editable (>= today) | **frozen** | **frozen** |
| `endDate` | editable (>= startDate) | editable (push only — must be > today) | editable (push only — turns status back to active) |
| `committedValue` | editable | **frozen** | **frozen** |

## Why startDate is frozen on active

Once the contract is active, customers may have already used balance against it. Changing startDate retroactively would mess with audit + projection.

## Why committedValue is frozen on active

[PRD] BR-CC-52: "Active contracts cannot change committedValue — would invalidate funded wallet balance."

## UI freeze implementation

[CODE] `commercialFieldInputClass` lines 126-130:

```typescript
get commercialFieldInputClass(): string {
  if (this.hasRestrictedCommercialFields) {
    return '!bg-falcon-neutral-100 !cursor-not-allowed';   // !important Tailwind utility
  }
  return '';
}
```

Plus `[disabled]="hasRestrictedCommercialFields"` on the input element.

> The disabled visual is purely CSS; **the values are NOT validated separately** (per [CODE] comment line 70 in old-UI dossier). Backend enforces.

## Extension affordance (expired only)

When contract is `expired`, only `endDate` is editable. UI shows a yellow info banner:

> "This contract has expired. Extend by setting a new end date."

Saving with new endDate > today flips backend status `expired → active`.

## See also

- [03-TAB_2_RATE_CARD](03-TAB_2_RATE_CARD.md) · [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
