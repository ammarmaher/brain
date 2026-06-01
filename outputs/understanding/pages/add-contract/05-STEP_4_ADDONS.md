*** Add Contract — Step 4: Add-ons ***
*** Quotas + overage rates · 2026-05-18 ***

# Add Contract — Step 4: Add-ons

> Two sub-sections: **Quotas** (free-credit / credit-pool addons per channel) + **Overage Rates** (extra-cost rates beyond contract limits). Catalog-driven from `CONTRACT_ADDON_CATALOG` in `contracts.models.ts`.

## Component

[CODE] `apps/admin-console/.../contracts-addons-section/contracts-addons-section.component.ts:23-162`:

- Selector: `app-contracts-addons-section`
- Standalone, OnPush
- Inputs:
  - `[quotas]: ContractQuotaRow[]` required
  - `[overageRates]: ContractOverageRateRow[]` required
  - `[channelOptions]: ContractsSelectOption[]`
  - `[editable] = true`

## ContractQuotaRow shape

[CODE] `contracts.models.ts:75-89`:

```typescript
interface ContractQuotaRow {
  clientId: string;
  quotaId?: string;
  quotaCode: string;          // 'WHATSAPP_MESSAGE' | 'WHATSAPP_TEMPLATE' | 'SMS_SENDER_NAME' | ...
  channelId: string;
  channelName: string;
  includedAmount: number | null;  // used when valueKind === 'amount' (USAGE)
  includedUnits: number | null;   // used when valueKind === 'units' (SUB_SERVICE)
  unit: string;                   // 'SAR' | 'TEMPLATE' | 'SENDER_NAME' | 'NUMBER' | 'SHORT_CODE'
  quotaCategory: string;          // 'USAGE' | 'SUB_SERVICE'
  quotaType: string;              // 'FREE_CREDIT' | 'CREDIT_POOL'
  scope: string;                  // 'ACCOUNT' (default)
  subService: string;             // empty for USAGE; non-empty for SUB_SERVICE
  status?: string;
}
```

## ContractOverageRateRow shape

```typescript
interface ContractOverageRateRow {
  clientId: string;
  overageRateId?: string;
  subService: string;          // 'WHATSAPP_TEMPLATE' | 'SMS_SENDER_NAME' | ...
  channelId: string;
  channelName: string;
  unit: string;
  unitPrice: number | null;
  billingCycle: string;        // 'PER_USE' | 'MONTHLY'
  status?: string;
}
```

## valueKind per addon

[CODE] catalog entries have `valueKind: 'amount' | 'units'`:

| quotaCategory | valueKind | Field used |
|---|---|---|
| `USAGE` | `amount` | `includedAmount` (e.g. 1000 SAR of credit) |
| `SUB_SERVICE` | `units` | `includedUnits` (e.g. 10 templates) |

## Predicates ([CODE] `contracts-add-wizard.component.ts:275-325`)

### `isQuotaValid(row)` (lines 275-303)

```typescript
isQuotaValid(row: ContractQuotaRow): boolean {
  if (!row.quotaCode?.trim()) return false;
  if (!row.channelId) return false;
  if (!row.unit?.trim()) return false;
  if (!row.quotaCategory?.trim()) return false;
  if (!row.quotaType?.trim()) return false;
  if (!row.scope?.trim()) return false;
  if (row.quotaCategory === 'SUB_SERVICE' && !row.subService?.trim()) return false;
  if (row.quotaCategory === 'USAGE') {
    if (row.includedAmount == null || row.includedAmount <= 0) return false;
  } else {
    if (row.includedUnits == null || row.includedUnits <= 0) return false;
  }
  return true;
}
```

### `isOverageRateValid(row)` (lines 305-320)

```typescript
isOverageRateValid(row: ContractOverageRateRow): boolean {
  if (!row.subService?.trim()) return false;
  if (!row.channelId) return false;
  if (!row.unit?.trim()) return false;
  if (row.unitPrice == null || row.unitPrice < 0) return false;
  if (!row.billingCycle?.trim()) return false;
  return true;
}
```

### `areAddonsValid()` (lines 322-325)

```typescript
areAddonsValid(): boolean {
  return this.form.quotas.every(q => this.isQuotaValid(q)) &&
         this.form.overageRates.every(or => this.isOverageRateValid(or));
}
```

## Add-on catalog

[CODE] `CONTRACT_ADDON_CATALOG` in `contracts.models.ts`. Filter by `isChannelAvailable(channelCode)` — only show addons applicable to selected channels.

### Example entries

| quotaCode | Channel | valueKind | unit | quotaCategory |
|---|---|---|---|---|
| `WHATSAPP_MESSAGE` | WHATSAPP | amount | SAR | USAGE |
| `WHATSAPP_TEMPLATE` | WHATSAPP | units | TEMPLATE | SUB_SERVICE |
| `SMS_SENDER_NAME` | SMS | units | SENDER_NAME | SUB_SERVICE |
| `VOICE_NUMBER` | VOICE | units | NUMBER | SUB_SERVICE |

## Filter on submit

[CODE] `toUpdatePayload` lines 384-400:

```typescript
quotas: quotas.filter(q => {
  if (q.quotaCategory === 'USAGE') return q.includedAmount > 0;
  return q.includedUnits > 0;
}),
overageRates: overageRates.filter(or => or.unitPrice !== null),
```

## UI shape

```
+----------------------------------------------------------+
| Step 4 of 4 — Add-ons                                    |
+----------------------------------------------------------+
|  Quotas                          [+ Add Quota]           |
|  ┌─────────────────────────────────────────────────┐    |
|  │ Code  │ Channel │ Category │ Type │ Amount │ ✕  │    |
|  │ WSP_MESSAGE │ WhatsApp │ USAGE │ FREE_CREDIT │ 1000 │ ✕ │    |
|  │ WSP_TEMPLATE │ WhatsApp │ SUB_SERVICE │ FREE_CREDIT │ 10 │ ✕ │    |
|  └─────────────────────────────────────────────────┘    |
|                                                          |
|  Overage Rates                   [+ Add Overage]         |
|  ┌─────────────────────────────────────────────────┐    |
|  │ Service  │ Channel │ Unit │ Price │ Cycle │ ✕  │    |
|  │ WSP_TEMPLATE │ WhatsApp │ TEMPLATE │ 5 │ PER_USE │ ✕ │    |
|  └─────────────────────────────────────────────────┘    |
|                                                          |
|              [← Previous]  [Finish ✓]                   |
+----------------------------------------------------------+
```

## Falcon components

| Element | Falcon component | Customization |
|---|---|---|
| Table | plain `<table>` + `@for` | edit-in-place pattern |
| Add row button | `<falcon-button>` | secondary variant with plus icon |
| Code select | `<falcon-select>` | catalog options filtered by channel |
| Channel select | `<falcon-select>` | from channelOptions |
| Amount/Units input | `<app-contracts-number-input>` | thousand-sep |
| Cycle select | `<falcon-select>` | `PER_USE | MONTHLY` |
| Delete row | `<falcon-icon-button>` | x icon |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
