---
name: session-backup-waves-m2-m3-mgmt-console-contracts-client-ui
description: Re-skinned mgmt (client) contracts list to admin/SoT parity + replaced simple detail with rich 4-tab READ-ONLY detail composing @falcon/contracts-ui; surfaced tariffPlan; fixed a pre-existing M1 admin re-export defect
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-30
  status: completed
  originSessionId: 2479810e-ac31-4f30-b718-0153e3ee8d66
---

## What Was Done
WAVES M2+M3 — built the management-console (CLIENT) Contracts UI to SoT `#contracts=client` parity. Composes the shared `@falcon/contracts-ui` sections (extracted in M1). NO COMMITS. Both builds GREEN (dev config). All view-only client behavior preserved; NO create/edit/POST/PUT path added.

**M2 — list re-skin** (`apps/management-console/.../contracts-cost-management/contracts-cost-management.component.{ts,html}`):
- ADDED leading **Contract ID** column (admin + SoT both lead with it; pre-M2 mgmt list omitted it) — teal clickable button → opens detail. Now 9 cols: Contract ID · Name · Farabi Ref · Creation/Start/Expiration · Value(SAR) · Remaining · Status.
- Switched date/money cells from Angular `| date`/`| number` pipes to `Intl`-based `formatDate()` (dd-MMM-yyyy, locale-aware) + `formatCurrency(value, code)` (≤2dp + code suffix, null→N/A) — admin-list parity. Dropped `DatePipe`/`DecimalPipe` imports.
- Added `[rowStyleClass]="rowClassFor"` (arrow field; green tint pending / lilac expired) + `[actionsHeaderLabel]` + `align:'right'` on the 2 money cols + `tabular-nums`.
- Node header = avatar (buildings `falcon-icon`) + page title (left), **NO Add button** (client view-only per SoT `isFalcon && <Add>`). Kept the existing refresh ghost button (harmless, useful, not in SoT but pre-existing).
- Imported `FalconIconComponent` from `@falcon` (selector `falcon-icon` lives in @falcon shared-ui, NOT @falcon/ui-core/angular — admin uses the same).

**M3 — rich 4-tab READ-ONLY detail** (NEW `components/contracts-view-contract/contracts-view-contract.component.{ts,html}`; DELETED old `components/contract-view/`):
- New component KEEPS the `app-contract-view` selector (parent template tag unchanged) but inputs flipped: `[contractId]` (required) + `[summaryRow]` (instant header), output `(back)` ONLY — NO `(edit)` output, NO Edit button anywhere. Near-clone of admin `contracts-view-contract` but loads via mgmt `ContractsService` (Core Gateway) + consumes mgmt `ContractDetails`.
- 4 tabs via `<falcon-angular-tabs mode="navigation">`: Information (3-up status-tinted stat cards Value/Remaining/Status + 6-field meta), Rate Card (`<app-contracts-rate-card-section [rows]=unitConversions() [editable]=false>`), Contract Details (`<app-contracts-contract-details-section [rates] [matrix] [applications] [commChannels] [unitConversions] [currencyCode] [editable]=false>` — matrix rebuilt from `tariffPlan.rates` via shared `createRateMatrixForSelection`), Addons (`<app-contracts-addons-section [quotas] [overageRates] [editable]=false>`).
- Imports the 3 section components + `createRateMatrixForSelection`/`createEmptyRateMatrix` + display types DIRECTLY from `@falcon/contracts-ui` (see import block in the .ts). Used `rounded-[14px]` (NOT the phantom `rounded-surface-xl`, per prior session note) for stat/meta cards. Parent `openView()` no longer refetches (detail loads itself by id) — removed `selectedLoading`.

**Surfaced `tariffPlan` (wire DTO + mapper)** in `models/models.ts` keeping `canEdit:false`:
- Imported display rows + `createDefaultUnitConversions`/`currencyCodeFromEnum` from `@falcon/contracts-ui`.
- EXTENDED `ApiContractDetailWire` with `tariffPlan?: ApiContractTariffPlanWire` (+ `currencyNumber?`, `accountId?`) and added defensive wire DTOs `ApiContractTariffPlanWire`/`ApiContractUnitConversionWire`/`ApiContractRateWire`/`ApiContractQuotaWire`/`ApiContractOverageRateWire` (all optional sub-arrays).
- ADDED UI types `ContractTariffPlan` + `ContractDetails extends ContractRow`. **GOTCHA**: mgmt `ContractRow` ALREADY has `currency: string` (the string code) so `ContractDetails` CANNOT name its numeric eCurrency `currency` (TS2430 "incorrectly extends" — number not assignable to string). Named it **`currencyNumber: number`** instead (admin's `ContractRow` has no `currency` field so admin can call its numeric one `currency`). Detail pane reads `currencyCode` (string) for display; `currencyNumber` carried for parity only.
- ADDED `mapContractDetailToDetails(wire)` mapper (mirrors admin `ContractsApiService.mapDetails`): spreads the slim row, maps tariffPlan via `createDefaultUnitConversions(unitConversions.map(...))` + 1:1 rate/quota/overage row mappers, `canEdit:false`. Numeric currency prefers `currencyNumber`→`tariffPlan.currency`→`currencyNumberFromCode(row.currency)`. Local `createLocalRowId` helper. Kept slim `mapContractDetailWireToRow` (now unused but valid public helper).
- `services/contracts.service.ts`: `getContract` now returns `ServiceOperationResult<ContractDetails>` via `mapContractDetailToDetails`; `toFailedDetailSor` retyped to `ContractDetails`.

## KEY FIX — pre-existing M1 admin re-export-of-re-export defect (lib barrel flatten)
`nx build admin-console --skip-nx-cache --configuration=development` was RED with ~30 "export 'X' was not found in '../../models/models' (possible exports: ServiceOperationResult, createEmptyContractForm)" webpack errors. ROOT CAUSE: admin `models/models.ts` does `export * from '@falcon/contracts-ui'`, and the lib's alias-target barrel `libs/falcon-contracts-ui/src/index.ts` did `export * from './lib/index'` which itself did `export *` of the models — a **3-deep `export *` chain** (consumer `export *` → barrel `export *` → `./lib/index` `export *`). The Angular esbuild/webpack bundler does NOT flatten 3-deep `export *`, so admin resolved ONLY its 2 LOCAL exports. **This was a pre-existing M1 defect** (M1 reported admin green — likely a stale `.nx` cache / daemon-served output; the M1 note even warns about nx daemon/cache). mgmt was unaffected because mgmt imports the symbols DIRECTLY from `@falcon/contracts-ui` (not via a re-export-of-export*).
**FIX (1 file, lib consumption layer the brief allows touching):** flattened `libs/falcon-contracts-ui/src/index.ts` to re-export the concrete modules DIRECTLY (3 named component exports + ONE `export * from './lib/models/contracts-display.models'`) — removed the `./lib/index` hop. Admin's `export *` now flattens 2 levels (works). Matches the working precedent `apps/host-shell/.../falcon-brand-logo/index.ts` (single-hop named barrel re-exported by a consumer `export *`). The internal `src/lib/index.ts` still exists (unused by the alias now; mgmt+admin both resolve via `src/index.ts`).

## Gates (all GREEN)
- `nx build management-console --skip-nx-cache --configuration=development` EXIT 0. main.js sha256 `ca2bd9a3b17cc672`, remoteEntry.mjs `263c597035b2757a`.
- `nx build admin-console --configuration=development --skip-nx-cache` EXIT 0. main.js sha256 `54ed73f605bd18e8`, remoteEntry.mjs `c61a424b2e620916`. (dev config — production fails ONLY on the pre-existing workspace-wide 10MB bundle-budget overflow, not a compile error.)
- `nx test admin-console` = **262 passed / 262** (11 files) — lib barrel flatten introduced NO regression.
- Scoped eslint on all 6 changed TS files EXIT 0 (zero findings).

## i18n
NO new keys. All keys used are SHARED `@falcon` i18n that already exist in BOTH en.json + ar.json: `contractsCostManagement.table.columns.{contractId,contractName,farabiReferenceId,creationDate,startDate,expirationDate,valueSar,remaining,status}`, `.status.{active,pending,expired}`, `.values.notAvailable`, `.view.lockLegend`, `.view.information`, `.wizard.nav.{contractInformation,rateCard,contractDetails,addons}`, `.wizard.contractInformation.currency`, `.loadingContract`, `.pageTitle`, `button.back`, `common.{refresh,actions,error}`. (Admin view-contract uses the exact same set — verified present in ar.json lines ~416-545.)

## Files
NEW: `apps/management-console/.../components/contracts-view-contract/contracts-view-contract.component.{ts,html}`
EDITED: `apps/management-console/.../contracts-cost-management.component.{ts,html}` · `.../models/models.ts` · `.../services/contracts.service.ts` · `.../components/index.ts` · `libs/falcon-contracts-ui/src/index.ts`
DELETED: `apps/management-console/.../components/contract-view/` (2 files — the simple pre-M3 detail)
NO COMMITS. Branch polishing-v0.4.

## Deviations / needs-runtime
- Kept the refresh ghost button in the list header (SoT client has only "Switch perspective" which is a cross-MFE concept, N/A in single-tenant mgmt). Low-risk, view-only.
- `ContractDetails.currencyNumber` (not `currency`) — forced by the mgmt `ContractRow.currency:string` clash (documented above). View reads `currencyCode`.
- NOT browser-verified (build-only; no Docker/MF bring-up). Runtime to confirm: 4-tab render with real Core-Gateway tariffPlan payload (matrix reconstruction, rate-card 3-row catalog, addons), status tint, RTL, "More Details"/row-click → detail → Back. The mgmt route is acc-owner-allow / acc-admin+acc-user explicit-deny (shellAccessGuard + `managementConsole.contract.view()`) — unchanged.

## Context for next agent
mgmt contracts is now feature-complete vs SoT client perspective (list + rich read-only 4-tab detail), composing the shared lib. If a future wave adds mgmt contracts Vitest tests, mirror the admin `tests/contracts/*` pattern but the service returns `ContractDetails` from Core Gateway (no forkJoin balance enrichment — `remainingBalance` inline). The lib barrel is now single-indirection — do NOT re-introduce a `./lib/index` `export *` hop in `libs/falcon-contracts-ui/src/index.ts` or admin's `export *` breaks again at webpack bundle time.
