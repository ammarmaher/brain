*** Add Contract — Overview ***
*** SoT for 4-step wizard · 2026-05-18 ***

# Add Contract — Overview

> 4-step wizard for authoring a commercial **Contract** against an Account node. Falcon-user-only (admin-console). Composite POST to Commerce — all 4 steps submitted as one `CreateContractRequest` payload.

## Source-of-truth pointers

- [PRD] PRD-03 BUSINESS_RULES · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md` (BR-CC-01..20 creation rules)
- [PRD] PRD-03 ENTITIES · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md`
- [PRD] PRD-03 WORKFLOWS · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md`
- [BRAIN-OUT] Commerce ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- [BRAIN-OUT] Commerce DTO_DICTIONARY · `Brain Outputs/understanding/backend/commerce/DTO_DICTIONARY.md`
- [CODE] Old-UI wizard · `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contracts-add-wizard.component.ts:54-326`

## Trigger / entry point

- **Container:** Contracts & Cost Management (`apps/admin-console/.../contracts-cost-management/`)
- **Action:** "+ Add Contract" button in node header (List mode).
- **Precondition:**
  - Account node selected (left tree).
  - Wallet strategy configured (`GET commerce/Setting/wallets/{accountId}` returns non-null).
  - Authenticated Falcon user with adminConsole permission.

## The 4 steps

| Step | Title | Detail file | Content |
|---|---|---|---|
| 1 | Contract Information | [02-STEP_1_INFO](02-STEP_1_INFO.md) | Name · Farabi Ref · Start/End dates · Committed Value |
| 2 | Rate Card | [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) | Per-channel unit conversion (e.g. WhatsApp `ONE_KSA_TRANSACTION → MESSAGE`) |
| 3 | Contract Details | [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) | Rate matrix per (application × channel × priority × destination) |
| 4 | Add-ons | [05-STEP_4_ADDONS](05-STEP_4_ADDONS.md) | Channel quotas + overage rates |

**Wizard navigation:** Next · Previous · Cancel. NO Save Draft. `allowNavigation: false` (must complete step before next). `disableBackButtonOnFirstStep: true`. Single POST happens on **Finish** at Step 4.

## Submit — single composite POST

```
POST commerce/Contracts
Body: CreateContractRequest {
  accountId: "<account-id>",
  contractName: "...",
  farabiReferenceId: "...",
  startDate: "2026-02-01T00:00:00",   // YYYY-MM-DDT00:00:00 — local Asia/Riyadh
  endDate: "2026-12-31T00:00:00",
  committedValue: 1000000,
  currency: 1,                          // 1=SAR
  unitConversions: [...],               // Step 2 array
  rates: [...],                         // Step 3 array (flattened from matrix)
  quotas: [...],                        // Step 4 array
  overageRates: [...]                   // Step 4 array
}

Response: ServiceOperationResult<ApiContractResponse> → ContractDetails
```

## Sequence diagram

```
Admin in Contracts List
   │
   ▼
Click "+ Add Contract"
   │
   ▼
ContractsAddWizardComponent opens (mode='add')
   │
   ▼
[OnInit / ngOnChanges] forkJoin({
   applications: GET commerce/Node/{accId}/applications,
   channels: GET commerce/Node/{accId}/comm-channels/visible
})
   │
   ▼
Step 1 — Contract Info form
   │ (Next)
   ▼
Step 2 — Rate Card (auto-populated from channels)
   │ (Next)
   ▼
Step 3 — Contract Details (rate matrix per app × channel)
   │ (Next)
   ▼
Step 4 — Add-ons (quotas + overage rates)
   │ (Finish)
   ▼
POST commerce/Contracts (composite request)
   │
   ▼
On success: emit (saved) → container sets mode='view' + loads detail
                       → triggers Kafka: commerce.contract-created.v1
                       → Charging consumes → updates ContractBalance projection
```

## Cross-flow dependencies

- **Prerequisite:** [[Wallets and Balance Management]] — wallet strategy must be configured first.
- **Sister flow [[Edit Contract Flow]]** — re-uses 3 of 4 step components (RateCardSection, ContractDetailsSection, AddonsSection — all `[editable]=true`).
- **Sister flow [[Contracts View]]** — re-uses same section components with `[editable]=false`.
- **Downstream effect on [[Wallets and Balance Management]]:** newly-created contract creates a contract-scoped wallet balance with `available = committedValue` after backend funding.

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-STEP_1_INFO](02-STEP_1_INFO.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [README](README.md)

## Hubs

[[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[Contracts List]]
