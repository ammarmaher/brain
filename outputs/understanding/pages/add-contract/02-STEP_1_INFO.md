*** Add Contract — Step 1: Contract Information ***
*** SoT for Step 1 · 2026-05-18 ***

# Add Contract — Step 1: Contract Information

> First step. Captures the core commercial parameters: name, external reference, date range, committed value.

## Fields

| Field | Required | Validator | Backend field | Notes |
|---|---|---|---|---|
| `contractName` | YES | `.trim()` non-empty | `CreateContractRequest.contractName` | PRD silent on max length — [INFERRED] ≤200 |
| `farabiReferenceId` | YES (per PRD) | `.trim()` non-empty · ≤50 chars (PRD BR-CC-04) | `CreateContractRequest.farabiReferenceId` | External finance system reference |
| `startDate` | YES | not null Date · `>= today` (per PRD: start in future) | `CreateContractRequest.startDate` | `YYYY-MM-DDT00:00:00` wire |
| `endDate` | YES | not null Date · `>= startDate` (same-day allowed) | `CreateContractRequest.endDate` | Same wire format |
| `committedValue` | YES | not null · `> 0` | `CreateContractRequest.committedValue` | SAR (currency=1) |

## Predicates ([CODE] `contracts-add-wizard.component.ts:241-252`)

```typescript
isContractInfoValid(): boolean {
  const info = this.form;
  if (!info.contractName?.trim()) return false;
  if (!info.startDate) return false;
  if (!info.endDate) return false;
  if (info.committedValue == null || info.committedValue <= 0) return false;
  // Commerce expands selected dates to Saudi local day boundaries,
  // so a same-day contract is valid: start 00:00:00.000, end 23:59:59.999.
  if (info.startDate > info.endDate) return false;
  return true;
}
```

> Note: old-UI does NOT validate `farabiReferenceId` non-empty in Step 1 — flagged as `GAP-CC-ADD-FARABI` (might be optional in old-UI but PRD says required).

## Date semantics

[CODE] `toLocalContractDateValue` lines 419-431:

```typescript
function toLocalContractDateValue(date: Date): string {
  // Send a date-like local value; do NOT use toISOString() which shifts the day.
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}
```

**Backend behavior:** Commerce expands `startDate` to `00:00:00.000` Asia/Riyadh and `endDate` to `23:59:59.999` Asia/Riyadh. So a same-day contract spans 24 hours.

## UI shape

```
+---------------------------------------+
| Step 1 of 4 — Contract Information    |
+---------------------------------------+
|                                       |
|  Contract Name *  [_________________] |
|  Farabi Ref Id *  [_________________] |
|                                       |
|  Start Date *     [Date Picker]       |
|  Expiration *     [Date Picker]       |
|                                       |
|  Committed Value (SAR) *              |
|                   [_________________] |
|                                       |
|                       [Next →]        |
+---------------------------------------+
```

## Falcon components

| Element | Falcon component | Customization |
|---|---|---|
| Step container | `<falcon-stepper>` (Stencil-backed) — replaces legacy `<dynamic-stepper>` | per [MEMORY] `project_falcon_stepper_legacy_deletion` |
| Name | `<falcon-input>` | `[required]` |
| Farabi Ref | `<falcon-input>` | `[required]` · `[maxlength]="50"` |
| Start/End date | `<falcon-calendar>` | already exists in Falcon UI Core |
| Committed Value | `<app-contracts-number-input>` (local) OR `<falcon-input-number>` | thousands-separator, decimals=6 |

## Anti-pattern

[CODE] uses `[(ngModel)]` template-driven — [F-022] flag. NEW UI: Reactive Forms.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
