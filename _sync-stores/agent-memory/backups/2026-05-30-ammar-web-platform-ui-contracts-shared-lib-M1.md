---
name: session-backup-wave-m1-contracts-shared-lib-extraction
description: Extracted reusable contracts read-only UI + shared models into a new NX lib @falcon/contracts-ui; repointed admin via re-export shims; all 4 gates green
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-30
  status: completed
  originSessionId: 2479810e-ac31-4f30-b718-0153e3ee8d66
---

## What Was Done
WAVE M1 — created NEW lib `libs/falcon-contracts-ui/` (alias `@falcon/contracts-ui`, tags `["scope:shared","type:feature"]`) so mgmt console can reuse the contracts read-only UI in M2/M3 (NX forbids app->app imports). User chose SHARED-LIB option.

MOVED into lib (verbatim, only model-import path changed):
- 3 section components (+ .html): `contracts-rate-card-section`, `contracts-contract-details-section`, `contracts-addons-section` (kept `app-contracts-*` selectors + `[editable]` input + `model()` two-way). Live at `libs/falcon-contracts-ui/src/lib/components/*`.
- Shared display/matrix/catalog/status model layer → `libs/falcon-contracts-ui/src/lib/models/contracts-display.models.ts`: all *Row/*Matrix* types, `ContractsSelectOption`, `ContractStatus`+`normalizeContractStatus`+`EContractStatus`+`ECurrency`+`CONTRACT_STATUS_*`, all 5 catalogs, all matrix/form factories + sync/flatten helpers (`createRateMatrixForSelection`/`syncRateMatrixIntoRates`/`flattenRateMatrixToRates`/`createEmpty{RateMatrix,RateRow,QuotaRow,OverageRateRow}`/`createDefaultUnitConversions`/`createUnitConversionsForChannels`/`createRateMatrixFromRates`/`resolveRatingUnitForChannel`/`resolveCatalogChannelId`), helpers (`currencyCodeFromEnum`/`formatContractNumber`/`canEditContractStatus`/`hasRestrictedContractCommercialFields`/`toContractsSelectOptions`), field-freeze (`ContractFieldFreezeFlags`+`getContractFieldFreezeFlags`). Lib has ZERO `@falcon` dep (pure TS) → no circular dep. Barrel `src/index.ts`->`src/lib/index.ts` exports components + `export * from contracts-display.models`.

STAYED app-local in `apps/admin-console/.../contracts-cost-management/models/models.ts`: wire request DTOs (`CreateContractRequest`/`UpdateContractRequest`+line DTOs), wire response DTOs (`Contract*Response`/`Api*`), `ContractRow`/`ContractDetails`/`ContractTariffPlan`/`WalletStrategySettings`, `ContractFormValue`, `createEmptyContractForm` (returns app-only `ContractFormValue`; composes re-exported lib helpers), `ServiceOperationResult` re-export. ALSO untouched: service (System Gateway), routes, list, wizard, view, edit panes.

## Re-export shims (minimal churn)
- `components/index.ts`: `export { ContractsRateCardSectionComponent, ContractsContractDetailsSectionComponent, ContractsAddonsSectionComponent } from '@falcon/contracts-ui';` + kept view/edit exports local.
- `models/models.ts`: `import type {...rows} from '@falcon/contracts-ui'` (for local wire types) + `import { createDefaultUnitConversions, createEmptyRateMatrix, currencyCodeFromEnum } from '@falcon/contracts-ui'` (for createEmptyContractForm) + `export * from '@falcon/contracts-ui'` (bulk re-export) + `export { ServiceOperationResult }`.
- DELETED 6 admin files (3 .ts + 3 .html section components) + their 3 dirs. All 3 consumers (wizard/edit/view) import sections from the barrel `'../../components'` — none used deep paths, so zero repoint needed.

## Gates (all GREEN)
1. `nx typecheck falcon-contracts-ui` (ngc AOT) GREEN (renamed from `build` — see KEY DECISION).
2. `nx build admin-console --configuration=development --skip-nx-cache` GREEN, hash `5989667ad20ef933`. (Production config fails ONLY on pre-existing 10MB bundle-budget overflow @ 43.5MB — NOT a compile error; dev config = baseline workflow config.)
3. `nx test admin-console` = **262 passed / 262**, 11 files. Contracts: validations 34, models 57, view 14, edit 15, list 22, api 29, wizard 25.
4. Lint: `nx lint falcon-contracts-ui` GREEN; direct eslint on the 2 changed admin files = EXIT 0. No NEW module-boundary violations.

## KEY DECISIONS
- **Lib NOT given a `build` target** — gave it a `typecheck` target (ngc -p tsconfig.lib.json) instead. Reason: a `build` target makes Nx classify it "buildable", and `@nx/enforce-module-boundaries`'s `enforceBuildableLibDependency:true` (eslint.config.mjs) then FORBIDS it from importing the NON-buildable `@falcon`/`@falcon/ui-core/angular` source libs it legitimately needs (6 lint errors). The workspace's real Angular source libs (`falcon`, `sdk`) deliberately have NO build target for exactly this reason — matched that convention. typecheck still gives a real isolated AOT compile gate.
- Kept `app-contracts-*` selectors in the lib (the falcon lib already hosts `app-*` selectors like `app-otp-dialog`; root eslint has no component-selector prefix rule → passes; and the wizard/view/edit HTML templates reference `<app-contracts-*>` tags unchanged).
- New lib has zero `@falcon` import so admin<->lib is acyclic.

## mgmt status
management-console NOT wired to `@falcon/contracts-ui` (confirmed by grep) — deferred to M2/M3 per brief. Its own `models.ts` untouched.

## GOTCHA for next agent
`nx reset` FAILS with EBUSY (locked `.nx/workspace-data/*.db`) when the nx daemon is running. After adding/renaming project.json targets, the project graph still recomputes per-invocation, but if `nx lint <newlib>` says "Could not find project", run `npx nx daemon --stop` first, then re-run. Do NOT rely on `nx reset` clearing the lock.

## Files changed
NEW: libs/falcon-contracts-ui/{project.json, tsconfig.json, tsconfig.lib.json, src/index.ts, src/lib/index.ts, src/lib/models/contracts-display.models.ts, src/lib/components/{rate-card,contract-details,addons}-section/*.{ts,html}}
EDITED: tsconfig.base.json (added @falcon/contracts-ui alias); apps/admin-console/.../contracts-cost-management/{models/models.ts, components/index.ts}
DELETED: apps/admin-console/.../contracts-cost-management/components/{contracts-rate-card-section,contracts-contract-details-section,contracts-addons-section}/ (3 dirs, 6 files)
NO COMMITS.

## Context for Next Agent (M2/M3)
mgmt builds its OWN list + read-only detail container composing the shared sections via `import { ContractsRateCardSectionComponent, ContractsContractDetailsSectionComponent, ContractsAddonsSectionComponent, <model symbols> } from '@falcon/contracts-ui'`. Sections render read-only with `[editable]="false"`. Shared model symbols (catalogs/matrix helpers/status) all come from `@falcon/contracts-ui`. mgmt keeps its OWN wire DTOs + service (Core Gateway, not System Gateway) + payload mappers app-local, mirroring how admin kept its wire layer local.
