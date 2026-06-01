*** Edit Contract — Validations ***
*** Same predicates as Add + status-aware gates · 2026-05-18 ***

# Edit Contract — Validations

> Edit reuses ALL Add-Contract predicates ([../add-contract/07-VALIDATIONS.md](../add-contract/07-VALIDATIONS.md)). The only addition is the `canSave` + status-aware gates.

## isFormValid()

[CODE] `contracts-edit-contract.component.ts:222-263`:

```typescript
isFormValid(): boolean {
  return this.isContractInfoValid() &&
         this.areUnitConversionsValid() &&
         this.isRateMatrixValid() &&
         this.areAddonsValid();
}
```

Same predicates as Add. Same ~28 validation count.

## canSave gate

```typescript
get canSave(): boolean {
  return !this.loadingLookups && !this.saving && this.isFormValid();
}
```

## Status-aware bypass

If `hasRestrictedCommercialFields === true`, the commercial fields keep their original values (locked). They still pass validation because they were valid when the contract was created.

## Async validators

**Still none.** FarabiId uniqueness collision is a non-issue because edit doesn't change FarabiId in old-UI (it's allowed per matrix above but typically same value).

## See also

- [../add-contract/07-VALIDATIONS.md](../add-contract/07-VALIDATIONS.md) · [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
