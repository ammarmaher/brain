# DTOs — contracts-cost-management

> Two layers: **form/state DTOs** (in `contracts.models.ts`, used by components) and **API-wire DTOs** (private interfaces in `contracts-api.service.ts`, used during HTTP mapping). Backend uses camelCase JSON.

---
## Section A — Form / state DTOs (`contracts.models.ts`)

### `ContractStatus`  (line 1)
```typescript
export type ContractStatus = 'active' | 'pending' | 'expired';
```
Backend sends as `string | number`. `normalizeContractStatus()` (lines 559-577) maps: `'1' | 'pending'` → pending, `'2' | 'active'` → active, `'3' | 'expired'` → expired. Unknown values fall back to **pending** (intentional — comment: *"Unknown status must not be displayed as active. Pending is the safest fallback because it prevents edits/activation-sensitive UI from lying."*).

### `ContractRow`  (lines 3-15)
```typescript
interface ContractRow {
  id: string;
  contractName: string;
  farabiReferenceId: string;
  creationDate: string;        // ISO from backend
  startDate: string;           // ISO
  expirationDate: string;
  valueSar: number | null;     // = committedValue
  remainingSar: number | null; // = availableAmount from charging
  status: ContractStatus;
  canEdit: boolean;
  currencyCode: string;
}
```
Used by: list view, view-contract base.

### `ContractsSelectOption`  (lines 17-20)
```typescript
interface ContractsSelectOption { label: string; value: string; }
```

### `WalletStrategySettings`  (lines 22-27)
```typescript
interface WalletStrategySettings {
  currency: number;          // 1 = SAR, 2 = POINTS
  currencyCode: string;      // derived via currencyCodeFromEnum
  walletBalanceType: number; // pass-through enum from backend
  walletType: number;        // pass-through enum from backend
}
```

### `ContractUnitConversionRow`  (lines 29-38) — Step 2 / rate-card row
```typescript
interface ContractUnitConversionRow {
  clientId: string;            // local row id
  unitConversionId?: string;   // backend id (present after persist)
  code: string;                // 'WHATSAPP' | 'VOICE' | 'AI_CHATGPT' (from catalog)
  name: string;
  priceUnit: string;           // 'ONE_KSA_TRANSACTION' | 'ONE_KSA_SECOND' | 'ONE_API_CALL'
  ratingUnit: string;          // 'MESSAGE' | 'SECOND' | 'API_CALL'
  priceValue: number | null;
  status?: string;
}
```

### `ContractRateRow`  (lines 40-52) — Step 3 / rate-matrix flattened
```typescript
interface ContractRateRow {
  clientId: string;
  rateId?: string;
  applicationId: string;       // e.g. WhatsApp Business
  applicationName: string;
  channelId: string;           // e.g. WhatsApp channel
  channelName: string;
  priority: string;            // 'AUTHENTICATION' | 'UTILITY' | 'ADVERTISEMENT' | 'SERVICE'  OR  'HIGH' | 'NORMAL' | 'VERY_LOW' (voice)
  destination: string;         // country code e.g. 'SAU', 'ARE', 'EGY'
  unit: string;                // copy of ratingUnit
  ratePerUnit: number | null;
  status?: string;
}
```

### `ContractRateMatrixCell` / `ContractRateMatrixRow` / `ContractRateMatrixState`  (lines 54-73)
```typescript
interface ContractRateMatrixCell {
  destination: string;        // e.g. 'SAU'
  label: string;              // e.g. 'KSA'
  ratePerUnit: number | null;
}
interface ContractRateMatrixRow {
  priority: string;
  labelKey: string;           // i18n key
  cells: ContractRateMatrixCell[];
}
interface ContractRateMatrixState {
  applicationId: string;
  applicationName: string;
  channelId: string;
  channelName: string;
  ratingUnit: string;         // copied from selected unit-conversion
  rows: ContractRateMatrixRow[];
}
```

### `ContractQuotaRow`  (lines 75-89) — Step 4 / addons (quotas)
```typescript
interface ContractQuotaRow {
  clientId: string;
  quotaId?: string;
  quotaCode: string;          // 'WHATSAPP_MESSAGE' | 'WHATSAPP_TEMPLATE' | 'SMS_SENDER_NAME' | ...
  channelId: string;
  channelName: string;
  includedAmount: number | null;  // used when valueKind === 'amount' (USAGE category)
  includedUnits: number | null;   // used when valueKind === 'units' (SUB_SERVICE category)
  unit: string;                   // 'SAR' | 'TEMPLATE' | 'SENDER_NAME' | 'NUMBER' | 'SHORT_CODE'
  quotaCategory: string;          // 'USAGE' | 'SUB_SERVICE'
  quotaType: string;              // 'FREE_CREDIT' | 'CREDIT_POOL'
  scope: string;                  // 'ACCOUNT' (default)
  subService: string;             // empty for USAGE
  status?: string;
}
```

### `ContractOverageRateRow`  (lines 91-101) — Step 4 / addons (overage)
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

### `ContractTariffPlan`  (lines 103-112)
```typescript
interface ContractTariffPlan {
  tariffPlanId: string;
  name: string;
  currency: number;
  currencyCode: string;
  unitConversions: ContractUnitConversionRow[];
  rates: ContractRateRow[];
  quotas: ContractQuotaRow[];
  overageRates: ContractOverageRateRow[];
}
```

### `ContractDetails`  (lines 114-118)
```typescript
interface ContractDetails extends ContractRow {
  accountId: string;
  currency: number;
  tariffPlan: ContractTariffPlan;
}
```

### `ContractFormValue`  (lines 120-133) — wizard / edit working state
```typescript
interface ContractFormValue {
  contractName: string;
  farabiReferenceId: string;
  startDate: Date | null;
  endDate: Date | null;
  committedValue: number | null;
  currency: number;
  currencyCode: string;
  unitConversions: ContractUnitConversionRow[];
  rateMatrix: ContractRateMatrixState;
  rates: ContractRateRow[];
  quotas: ContractQuotaRow[];
  overageRates: ContractOverageRateRow[];
}
```

---
## Section B — Catalog constants (`contracts.models.ts`)

### `CONTRACT_UNIT_CONVERSION_CATALOG`  (lines 135-154)
```typescript
[
  { code: 'WHATSAPP',   name: 'WhatsApp',   priceUnit: 'ONE_KSA_TRANSACTION', ratingUnit: 'MESSAGE' },
  { code: 'VOICE',      name: 'Voice',      priceUnit: 'ONE_KSA_SECOND',      ratingUnit: 'SECOND' },
  { code: 'AI_CHATGPT', name: 'AI-ChatGPT', priceUnit: 'ONE_API_CALL',        ratingUnit: 'API_CALL' },
] as const;
```

### `CONTRACT_RATE_PRIORITIES`  (lines 156-161) — non-voice channels
```typescript
[
  { code: 'AUTHENTICATION', labelKey: '...rows.authentication' },
  { code: 'UTILITY',        labelKey: '...rows.utility' },
  { code: 'ADVERTISEMENT',  labelKey: '...rows.advertisement' },
  { code: 'SERVICE',        labelKey: '...rows.service' },
] as const;
```

### `CONTRACT_VOICE_RATE_PRIORITIES`  (lines 163-167)
```typescript
[
  { code: 'HIGH',     labelKey: '...rows.high' },
  { code: 'NORMAL',   labelKey: '...rows.normal' },
  { code: 'VERY_LOW', labelKey: '...rows.veryLow' },
] as const;
```

### `CONTRACT_RATE_DESTINATIONS`  (lines 169-181) — 11 ISO country codes
```typescript
[
  { code: 'SAU', label: 'KSA' },     { code: 'ARE', label: 'UAE' },
  { code: 'OMN', label: 'Oman' },    { code: 'QAT', label: 'Qatar' },
  { code: 'KWT', label: 'Kwt' },     { code: 'YEM', label: 'Ymn' },
  { code: 'JOR', label: 'Jordan' },  { code: 'EGY', label: 'Egypt' },
  { code: 'USA', label: 'USA' },     { code: 'GBR', label: 'UK' },
  { code: 'IND', label: 'India' },
] as const;
```

### `CONTRACT_ADDON_CATALOG`  (lines 183-249) — 5 addon types
```typescript
[
  // (1) WHATSAPP_MESSAGE_USAGE — channel: WHATSAPP, quotaType: FREE_CREDIT, category: USAGE, unit: SAR, valueKind: 'amount'
  // (2) WHATSAPP_TEMPLATE     — channel: WHATSAPP, quotaType: CREDIT_POOL, category: SUB_SERVICE, unit: TEMPLATE, billingCycle: PER_USE, valueKind: 'units'
  // (3) SMS_SENDER_NAME       — channel: SMS,      quotaType: CREDIT_POOL, category: SUB_SERVICE, unit: SENDER_NAME, billingCycle: MONTHLY, valueKind: 'units'
  // (4) VOICE_NUMBER          — channel: VOICE,    quotaType: CREDIT_POOL, category: SUB_SERVICE, unit: NUMBER, billingCycle: MONTHLY, valueKind: 'units'
  // (5) SHORT_CODE            — channel: SMS,      quotaType: CREDIT_POOL, category: SUB_SERVICE, unit: SHORT_CODE, billingCycle: MONTHLY, valueKind: 'units'
] as const;
```

---
## Section C — API-wire DTOs (`contracts-api.service.ts`)

### `ApiContractListResponse`  (lines 28-30)
```typescript
interface ApiContractListResponse { contracts: ApiContractSummary[]; }
```

### `ApiContractSummary`  (lines 32-45)
```typescript
interface ApiContractSummary {
  contractId: string;
  contractName: string;
  farabiReferenceId: string | null;
  createdAt: string;
  startDate: string;
  endDate: string;
  startLocalDateTime?: string | null;   // overrides startDate when present
  endLocalDateTime?: string | null;     // overrides endDate when present
  businessTimeZone?: string | null;     // e.g. 'Asia/Riyadh'
  committedValue: number | null;
  remainingBalance: number | null;
  status: string | number;
}
```

### `ApiContractResponse extends ApiContractSummary`  (lines 47-52)
```typescript
interface ApiContractResponse extends ApiContractSummary {
  accountId: string;
  currency: number;
  canEdit: boolean;
  tariffPlan: ApiContractTariffPlan;
}
```

### `ApiContractTariffPlan`  (lines 68-76)
```typescript
interface ApiContractTariffPlan {
  tariffPlanId: string;
  name: string;
  currency: number;
  unitConversions?: ApiContractUnitConversion[];
  rates: ApiContractRate[];
  quotas: ApiContractQuota[];
  overageRates: ApiContractOverageRate[];
}
```

### `ApiContractUnitConversion`  (lines 78-86)
```typescript
interface ApiContractUnitConversion {
  unitConversionId?: string;
  code: string;
  name: string;
  priceUnit: string;
  ratingUnit: string;
  priceValue: number | null;
  status?: string;
}
```

### `ApiContractRate`  (lines 88-99)
```typescript
interface ApiContractRate {
  rateId?: string;
  applicationId: string;
  applicationName: string;
  channelId: string;
  channelName: string;
  priority: string;
  destination: string;
  unit: string;
  ratePerUnit: number | null;
  status?: string;
}
```

### `ApiContractQuota`  (lines 101-114)
```typescript
interface ApiContractQuota {
  quotaId?: string;
  quotaCode: string;
  channelId: string;
  channelName: string;
  includedAmount: number | null;
  includedUnits: number | null;
  unit: string;
  quotaCategory: string;
  quotaType: string;
  scope: string;
  subService: string;
  status?: string;
}
```

### `ApiContractOverageRate`  (lines 116-125)
```typescript
interface ApiContractOverageRate {
  overageRateId?: string;
  subService: string;
  channelId: string;
  channelName: string;
  unit: string;
  unitPrice: number | null;
  billingCycle: string;
  status?: string;
}
```

### `ApiWalletSettings`  (lines 22-26)
```typescript
interface ApiWalletSettings {
  currency: number;
  walletBalanceType: number;
  walletType: number;
}
```

### `ApiContractBalanceSummariesResponse` + `ApiContractBalanceSummary`  (lines 54-66)
```typescript
interface ApiContractBalanceSummariesResponse { summaries: ApiContractBalanceSummary[]; }
interface ApiContractBalanceSummary {
  contractId: string;
  currency: number;
  totalFundedAmount: number;
  availableAmount: number;     // used as remainingSar in UI
  reservedAmount: number;
  consumedAmount: number;
  updatedAt: string;
}
```

### `ApiApplicationOption` / `ApiChannelOption`  (lines 127-137)
```typescript
interface ApiApplicationOption { id: string; name: string; visibility?: boolean; }
interface ApiChannelOption     { channelId: string; channelName: string; priorityOrder?: number; }
```

---
## Section D — Outgoing payloads (built by `toCreatePayload` / `toUpdatePayload`)

### Update payload (POST body and PUT body — POST adds `accountId`)
File: `contracts-api.service.ts:357-409`. Verbatim shape:
```typescript
{
  contractName: string,                 // .trim()
  farabiReferenceId: string,            // .trim()
  startDate: 'YYYY-MM-DDT00:00:00' | null,
  endDate:   'YYYY-MM-DDT00:00:00' | null,
  committedValue: number,               // ?? 0
  currency: number,
  unitConversions: Array<{
    code: string, name: string, priceUnit: string, ratingUnit: string, priceValue: number  // ?? 0
  }>,
  rates: Array<{                        // filtered to ratePerUnit !== null
    applicationId: string, channelId: string,
    priority: string, destination: string, unit: string,
    ratePerUnit: number                 // ?? 0
  }>,
  quotas: Array<{                       // filtered: USAGE → includedAmount > 0, else includedUnits > 0
    quotaCode: string, channelId: string,
    includedAmount: number, includedUnits: number, unit: string,
    quotaCategory: string, quotaType: string, scope: string, subService: string
  }>,
  overageRates: Array<{                 // filtered to unitPrice !== null
    subService: string, channelId: string, unit: string,
    unitPrice: number, billingCycle: string
  }>,
}
```

### Create payload — same as above + `accountId` (line 351-355).

---
## Pricing model — narrative summary

This page expresses prices at **3 layers** that combine into per-event chargeable amounts:

1. **Unit-Conversion (Rate Card / Step 2)** — `priceValue` SAR per `priceUnit` (e.g. SAR per `ONE_KSA_TRANSACTION`). Bridges *what a unit is priced as* (SAR per X) to *how usage is rated* (`ratingUnit` like `MESSAGE` / `SECOND` / `API_CALL`). Channel-locked by the catalog.
2. **Rate Matrix (Contract Details / Step 3)** — for each (application × channel) pair, a 2D `ratePerUnit` grid keyed by `priority` (rows) and `destination` country (columns). Voice channels use a different priority list (`HIGH/NORMAL/VERY_LOW`) than messaging (`AUTHENTICATION/UTILITY/ADVERTISEMENT/SERVICE`).
3. **Add-ons / Quotas (Step 4)** — two flavors:
   - **`FREE_CREDIT` (USAGE category)** — an `includedAmount` in SAR, e.g. "1000 SAR free WhatsApp messages".
   - **`CREDIT_POOL` (SUB_SERVICE category)** — an `includedUnits` count of sub-resources (templates, sender names, voice numbers, short codes) with an **overage** rate (`unitPrice` per unit, `billingCycle: PER_USE | MONTHLY`).

**No tiered pricing** in the data shape. **No time-based pricing** beyond `startDate/endDate` contract window. All amounts are flat per-event with overrides through quotas. The contract has a `committedValue` (total cap) and a `remainingSar` (from charging) that decrements as orders are placed.
