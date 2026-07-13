---
name: session-backup-contract-addons-consumed-offered-fe
description: Implemented the consumed/offered quota feature in admin + mgmt contracts addons Card 1
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-06
  status: completed
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

## What Was Done
Implemented the FE half of the Contract Addons "consumed / offered" feature in BOTH consoles on branch polishing-v0.4. Builds both green, tests green (admin 686, mgmt 461). NO COMMITS.

Backend endpoint consumed: GET charging/Wallet/contract-quota-consumption?accountId&contractId → ServiceOperationResult<GetContractQuotaConsumptionResponse{ items: ContractQuotaConsumptionResponse[] }>. camelCase. MERGE KEY = quotaCode. USAGE→*Amount, SUB_SERVICE→*Units.

SoT = Source_of_truth_theme/.../admin/contracts-details.jsx CmAddonBlock (lines 477-543) + contracts.css. KEY SoT insight: in the JSX, `value`=CONSUMED (fixed/disabled LEFT input), `original`=OFFERED (editable RIGHT input). View = ﷼ {consumed} /{offered faint}. Our OFFERED maps to the EXISTING quotaValue/setQuotaValue (includedAmount/includedUnits); CONSUMED is the NEW consumedValue() reading consumedAmount/consumedUnits.

## Files Changed (8 source + 1 spec)
Admin:
- apps/admin-console/.../models/models.ts — added consumedAmount/consumedUnits to ContractQuotaResponse; new ContractQuotaConsumptionResponse + GetContractQuotaConsumptionResponse.
- apps/admin-console/.../models/contracts-display.models.ts — added consumed fields to ContractQuotaRow + createEmptyQuotaRow defaults null.
- apps/admin-console/.../services/contracts-api.service.ts — added getContractQuotaConsumption() (charging/Wallet/contract-quota-consumption, useGateway+HttpParams, error→failed SOR []); getContract() now switchMaps off detail and merges consumption by quotaCode (mergeQuotaConsumption); mapQuota defaults consumed to value ?? null. import switchMap.
- apps/admin-console/.../components/contracts-add-wizard/addons-step/addons-step.component.{ts,html} — added consumedValue(); Card 1 edit-mode PAIR (disabled consumed input + muted / + editable offered input), view-mode ﷼ consumed /offered(faint). Card 2 UNCHANGED.
Mgmt (parity):
- apps/management-console/.../models/models.ts — consumed fields on ApiContractQuotaWire? NO — added consumed defaults in mapQuotaWire (null); added ContractQuotaConsumptionResponse + GetContractQuotaConsumptionResponse.
- apps/management-console/.../models/contracts-display.models.ts — same ContractQuotaRow + createEmptyQuotaRow edits.
- apps/management-console/.../services/contracts.service.ts — added chargingWalletEndpoint const, getContractQuotaConsumption(), getContract() switchMap+merge (accountId from wire result.accountId ?? resolveAccountId()), toFailedConsumptionSor + mergeQuotaConsumption (MUTATES quota rows in place — ContractTariffPlan.quotas is a readonly PROPERTY, can't reassign). import HttpParams + switchMap.
- apps/management-console/.../components/contracts-addons-section/contracts-addons-section.component.{ts,html} — same as admin.
- apps/management-console/tests/contracts/contracts.service.spec.ts — UPDATED the obsolete "EXACTLY ONE GET" test (mgmt now makes a 2nd GET = the consumption call BY DESIGN) → asserts the consumption call URL+params+gateway AND still no balance/strategy/lookup; ADDED merge test + consumption-failure-is-nonfatal test.

## Key Decisions
- mgmt mergeQuotaConsumption MUTATES rows in place (readonly property); admin reassigns (admin types are mutable).
- mgmt accountId: from wire result.accountId (ApiContractDetailWire carries it) with fallback resolveAccountId() (session, single-tenant). mgmt ContractDetails does NOT surface accountId — read it off the wire in the service before mapping.
- Card 1 VIEW dropped the unit text (now consumed/offered, per SoT .cm-addon-section-value which has no unit). quotaUnit() is now UNUSED in templates but KEPT (public method, doesn't break build/lint; removing it = out of scope + parity drift risk). Card 2 still uses formatAmount/overageValue.
- Pair sizing: container `flex w-full max-w-90 items-center gap-2`, each input `w-full flex-1`, slash `shrink-0 font-medium text-falcon-neutral-500`.
- consumed input: [disabled]="true" [ngModel]="consumedValue(item)" NO valueChange; same size/decimal config + iconLeft ﷼.
- The ﷼-on-left prior fix was preserved (built on top).

## Context for Next Agent
- Build cmd: node node_modules/nx/dist/bin/nx.js build <app> --configuration=development (npx nx broken). Both exit 0.
- mgmt build emits pre-existing "unused file in tsconfig" WARNINGS (templates-page services, environment.*.ts, test fixtures) — NOT mine, NOT errors.
- LIVE pixel-check pending auth login (no dev server was running; not started per instructions). When verifying: rebuild static remotes after app edits + restart npm start (single host-shell serve).
- NO COMMITS — user will package the PR.
