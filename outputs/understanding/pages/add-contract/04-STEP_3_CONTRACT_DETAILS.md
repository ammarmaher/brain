*** Add Contract — Step 3: Contract Details (Rate Matrix) ***
*** SoT for application × channel × priority × destination grid · 2026-05-18 ***

# Add Contract — Step 3: Contract Details

> The biggest validation surface. A 2D matrix of `(priority, destination_country) → ratePerUnit` per selected `(application, channel)` pair. WhatsApp: 4 priorities × 11 destinations = 44 cells. Voice: 3 priorities × 11 destinations = 33 cells.

## Component

[CODE] `apps/admin-console/.../contracts-contract-details-section/contracts-contract-details-section.component.ts:23-107`:

- Selector: `app-contracts-contract-details-section`
- Standalone, OnPush
- Inputs:
  - `[matrix]: ContractRateMatrixState` required
  - `[rates]: ContractRateRow[]` (the flattened persistence shape — required)
  - `[unitConversions]: ContractUnitConversionRow[]` required
  - `[applicationOptions]: ContractsSelectOption[]`
  - `[channelOptions]: ContractsSelectOption[]`
  - `[currencyCode] = 'SAR'`
  - `[editable] = true`

## Matrix shape

[CODE] `contracts.models.ts:54-73`:

```typescript
interface ContractRateMatrixState {
  applicationId: string;
  applicationName: string;
  channelId: string;
  channelName: string;
  ratingUnit: string;     // copied from selected unit-conversion
  rows: ContractRateMatrixRow[];
}

interface ContractRateMatrixRow {
  priority: string;       // 'AUTHENTICATION' | 'UTILITY' | 'ADVERTISEMENT' | 'SERVICE' (WhatsApp)
                          // OR 'HIGH' | 'NORMAL' | 'VERY_LOW' (voice)
  labelKey: string;
  cells: ContractRateMatrixCell[];
}

interface ContractRateMatrixCell {
  destination: string;    // 'SAU' | 'ARE' | 'EGY' | 'KWT' | ...
  label: string;
  ratePerUnit: number | null;
}
```

## Predicates ([CODE] `contracts-add-wizard.component.ts:265-273`)

```typescript
isRateMatrixValid(): boolean {
  const m = this.form.matrix;
  if (!m.applicationId) return false;
  if (!m.channelId) return false;
  if (!m.ratingUnit) return false;
  for (const row of m.rows) {
    for (const cell of row.cells) {
      if (cell.ratePerUnit == null || cell.ratePerUnit < 0) return false;
    }
  }
  return true;
}
```

> **The matrix is COMPLETELY filled** before Next is enabled — every cell needs a value. **44 mandatory cells** for WhatsApp messaging, **33 for voice**.

## Voice channel priority logic

[CODE] `resolveRatePriorities()` (`contracts.models.ts:468-478`):

- Auto-detects voice via channel `id/label` includes `'VOICE'`, OR
- If any existing rate uses `HIGH | NORMAL | VERY_LOW` priorities.
- Otherwise defaults to WhatsApp priorities (`AUTHENTICATION | UTILITY | ADVERTISEMENT | SERVICE`).

## Destination countries

[CODE] `contracts.models.ts` catalog (`CONTRACT_DESTINATION_CATALOG`):

| Code | Label |
|---|---|
| SAU | KSA |
| ARE | UAE |
| EGY | Egypt |
| KWT | Kuwait |
| BHR | Bahrain |
| QAT | Qatar |
| OMN | Oman |
| JOR | Jordan |
| LBN | Lebanon |
| IRQ | Iraq |
| Other | Other |

(11 destinations total.)

## Sync to flat `rates` array

[CODE] line 96 `syncRateMatrixIntoRates(rates, matrix)`:

```typescript
function syncRateMatrixIntoRates(rates: ContractRateRow[], matrix: ContractRateMatrixState): void {
  const synced: ContractRateRow[] = [];
  for (const row of matrix.rows) {
    for (const cell of row.cells) {
      synced.push({
        clientId: uuid(),
        applicationId: matrix.applicationId,
        applicationName: matrix.applicationName,
        channelId: matrix.channelId,
        channelName: matrix.channelName,
        priority: row.priority,
        destination: cell.destination,
        unit: matrix.ratingUnit,
        ratePerUnit: cell.ratePerUnit,
      });
    }
  }
  rates.splice(0, rates.length, ...synced);  // in-place mutation
}
```

## Filter on submit

[CODE] `toUpdatePayload` line 375: `rates` filtered to `ratePerUnit !== null` before POST/PUT.

## UI shape

```
+----------------------------------------------------------+
| Step 3 of 4 — Contract Details                           |
+----------------------------------------------------------+
|  Application * [WhatsApp Business ▼]                     |
|  Channel *     [WhatsApp ▼]                              |
|  Rating Unit   [MESSAGE] (auto from rate card)          |
|                                                          |
|  | Priority      | KSA | UAE | EGY | KWT | ... | Other |
|  | AUTHENTICATION| [0] | [0] | [0] | [0] | ... | [0]   |
|  | UTILITY       | [0] | [0] | [0] | [0] | ... | [0]   |
|  | ADVERTISEMENT | [0] | [0] | [0] | [0] | ... | [0]   |
|  | SERVICE       | [0] | [0] | [0] | [0] | ... | [0]   |
|                                                          |
|                     [← Previous]  [Next →]              |
+----------------------------------------------------------+
```

## Falcon components

| Element | Falcon component | Customization |
|---|---|---|
| Application select | `<falcon-select>` | options from `applicationOptions` |
| Channel select | `<falcon-select>` | options from `channelOptions` |
| Rating Unit display | `<falcon-tag>` (read-only label) | derived |
| Matrix table | plain `<table>` + `@for` | NOT `<falcon-angular-data-table>` — too many cells, edit-in-place |
| Cell input | `<app-contracts-number-input>` | decimals=6, min=0 |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) · [05-STEP_4_ADDONS](05-STEP_4_ADDONS.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
