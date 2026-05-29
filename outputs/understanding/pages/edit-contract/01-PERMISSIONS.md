*** Edit Contract — Permissions ***
*** 2026-05-18 ***

# Edit Contract — Permissions

> Same as Add Contract: parent `adminConsoleGuard` only. No feature PES.

## Route guard

- Parent `adminConsoleGuard` enforces `FalconAccess.adminConsole.enter()`.
- No feature-level guard.

## canEdit flag

[CODE] `currentContract.canEdit` — server-computed boolean on `ApiContractResponse`. Container `onViewEdit()`:

```typescript
onViewEdit(): void {
  if (!this.currentContract?.canEdit) return;
  this.mode = 'edit';
  this.cdr.markForCheck();
}
```

## Per-role permission

Same matrix as Add Contract:

| Role | Edit Contract |
|---|---|
| Falcon System Admin | YES (per matrix) |
| Falcon Product | YES |
| Falcon Operation | TBD per Q-CC-OP-EDIT |
| Client roles | NO |

## Suggested PES additions

- `FalconAccess.contracts.edit()` — gate Edit button.
- `FalconAccess.contracts.extend()` — gate Extend on expired contracts (Falcon System Admin only?).

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
