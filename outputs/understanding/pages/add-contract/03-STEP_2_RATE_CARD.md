*** Add Contract — Step 2: Rate Card ***
*** SoT for unit-conversion rows · 2026-05-18 ***

# Add Contract — Step 2: Rate Card

> One row per channel. Each row maps a `priceUnit` (billable unit) to a `ratingUnit` (consumption unit) at a per-unit `priceValue` (SAR). Channels lookup-driven from `GET commerce/Node/{accountId}/comm-channels/visible`.

## Component

[CODE] `apps/admin-console/.../contracts-rate-card-section/contracts-rate-card-section.component.ts:14-71`:

- Selector: `app-contracts-rate-card-section`
- Standalone, OnPush
- Inputs: `[rows]: ContractUnitConversionRow[]` required · `[editable]=true`

## Channel-locked priceUnit

[CODE] `priceUnitOptionsFor(row)` + `ngOnChanges` lines 35-58:

| Channel code | Required `priceUnit` | Required `ratingUnit` |
|---|---|---|
| `WHATSAPP` | `ONE_KSA_TRANSACTION` | `MESSAGE` |
| `VOICE` | `ONE_KSA_SECOND` | `SECOND` |
| `AI_CHATGPT` | `ONE_API_CALL` | `API_CALL` |
| `SMS` (TBD) | TBD | TBD — verify in catalog |

**The component auto-corrects** `row.priceUnit` to the catalog-required value on every input change ([CODE] comment: *"Unit conversion is channel-specific: WhatsApp cannot be priced by seconds or API calls, Voice cannot be priced by transactions"*).

## ContractUnitConversionRow shape

```typescript
interface ContractUnitConversionRow {
  clientId: string;            // local row id (uuid for stable @for tracking)
  unitConversionId?: string;   // backend id (present after persist; empty in add)
  code: string;                // 'WHATSAPP' | 'VOICE' | 'AI_CHATGPT'
  name: string;
  priceUnit: string;           // 'ONE_KSA_TRANSACTION' | 'ONE_KSA_SECOND' | 'ONE_API_CALL'
  ratingUnit: string;          // 'MESSAGE' | 'SECOND' | 'API_CALL'
  priceValue: number | null;
  status?: string;
}
```

## Predicates ([CODE] `contracts-add-wizard.component.ts:254-263`)

```typescript
areUnitConversionsValid(): boolean {
  const rows = this.form.unitConversions;
  if (rows.length === 0) return false;
  for (const row of rows) {
    if (!row.code?.trim()) return false;
    if (!row.name?.trim()) return false;
    if (!row.priceUnit?.trim()) return false;
    if (!row.ratingUnit?.trim()) return false;
    if (row.priceValue == null || row.priceValue < 0) return false;
  }
  return true;
}
```

## Auto-populate on channel load

[CODE] `contracts-add-wizard.component.ts:141-171`:

```typescript
forkJoin({applications, channels}).subscribe(({applications, channels}) => {
  this.applicationOptions = mapToOptions(applications);
  this.channelOptions = mapToOptions(channels);
  this.form.unitConversions = createUnitConversionsForChannels(
    channels,
    this.form.unitConversions,   // preserve user input if re-entering step
  );
});
```

`createUnitConversionsForChannels` ([CODE] `contracts.models.ts`):
- For each visible channel, generates a row with catalog-required `priceUnit` + `ratingUnit`.
- If user has already entered a `priceValue` for that channel, preserves it.

## UI shape

```
+--------------------------------------------------------+
| Step 2 of 4 — Rate Card                                |
+--------------------------------------------------------+
|                                                        |
| | Channel    | Price Unit          | Rating Unit | Price Value (SAR) |
| | WhatsApp   | ONE_KSA_TRANSACTION | MESSAGE     | [______]          |
| | Voice      | ONE_KSA_SECOND      | SECOND      | [______]          |
| | AI ChatGPT | ONE_API_CALL        | API_CALL    | [______]          |
|                                                        |
|                     [← Previous]  [Next →]            |
+--------------------------------------------------------+
```

## Falcon components

| Element | Falcon component | Customization |
|---|---|---|
| Table | plain `<table>` + `@for` per [MEMORY] | (no need for `<falcon-angular-data-table>` for edit-in-place) |
| Channel cell | `<falcon-select>` | options from channelOptions |
| Price Unit cell | `<falcon-select>` | options limited per channel (catalog-locked) |
| Rating Unit cell | `<falcon-input>` | display-only · `[disabled]` |
| Price Value cell | `<app-contracts-number-input>` | thousand-sep, decimals=6 |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
