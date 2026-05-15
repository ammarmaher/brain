*** Add Client — Overview ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Overview

> End-to-end summary of the **Add Client** 5-step wizard on the Organization Hierarchy page. Treat this as the orientation file — drill into a step-specific file (`02-` through `06-`) for field-level detail.
>
> Scope: this folder covers Add Client only. Sister flows — Add User, Add Node, Edit Node — live in adjacent files in the `flows/` directory and are owned by separate specialists. Do not duplicate their content here.

## Source-of-truth pointers

- PRD-01 OVERVIEW · [../../../../prd/modules/01-account-management/OVERVIEW.md](../../../../prd/modules/01-account-management/OVERVIEW.md)
- PRD-01 BUSINESS_RULES · [../../../../prd/modules/01-account-management/BUSINESS_RULES.md](../../../../prd/modules/01-account-management/BUSINESS_RULES.md)
- PRD-01 WORKFLOWS (W1 = the Add Client wizard) · [../../../../prd/modules/01-account-management/WORKFLOWS.md](../../../../prd/modules/01-account-management/WORKFLOWS.md)
- PRD-01 ENTITIES (Account · Node · AccountSettings · CommChannelConfig · AppConfig) · [../../../../prd/modules/01-account-management/ENTITIES.md](../../../../prd/modules/01-account-management/ENTITIES.md)
- PRD-01 GAPS · [../../../../prd/modules/01-account-management/GAPS.md](../../../../prd/modules/01-account-management/GAPS.md)
- PRD-01 QUESTIONS · [../../../../prd/modules/01-account-management/QUESTIONS.md](../../../../prd/modules/01-account-management/QUESTIONS.md)
- PRD-02 WORKFLOWS (Add User — kicked off by Step 5) · [../../../../prd/modules/02-user-management/WORKFLOWS.md](../../../../prd/modules/02-user-management/WORKFLOWS.md)
- PRD-02 ENTITIES (User · OtpChallenge · Session) · [../../../../prd/modules/02-user-management/ENTITIES.md](../../../../prd/modules/02-user-management/ENTITIES.md)
- Commerce SERVICE_OVERVIEW · [../../../backend/commerce/SERVICE_OVERVIEW.md](../../../backend/commerce/SERVICE_OVERVIEW.md)
- Commerce ENDPOINT_REGISTRY · [../../../backend/commerce/ENDPOINT_REGISTRY.md](../../../backend/commerce/ENDPOINT_REGISTRY.md)
- Commerce DTO_DICTIONARY (`CreateAccountRequest`) · [../../../backend/commerce/DTO_DICTIONARY.md](../../../backend/commerce/DTO_DICTIONARY.md)
- Commerce VALIDATIONS · [../../../backend/commerce/VALIDATIONS.md](../../../backend/commerce/VALIDATIONS.md)
- Commerce ERRORS · [../../../backend/commerce/ERRORS.md](../../../backend/commerce/ERRORS.md)
- Commerce FRONTEND_CONTRACT (response wrapper · base URL · casing) · [../../../backend/commerce/FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)
- NodeController drill-down · [../../../backend/commerce/controllers/NodeController/](../../../backend/commerce/controllers/NodeController/)
- Identity SERVICE_OVERVIEW (Step 5 destination) · [../../../backend/identity/SERVICE_OVERVIEW.md](../../../backend/identity/SERVICE_OVERVIEW.md)
- Charging SERVICE_OVERVIEW (Wallet creation consumer) · [../../../backend/charging/SERVICE_OVERVIEW.md](../../../backend/charging/SERVICE_OVERVIEW.md)
- Existing page note · [../PAGE_OVERVIEW.md](../PAGE_OVERVIEW.md) · [../COMPONENT_MAPPING.md](../COMPONENT_MAPPING.md) · [../VALIDATION_RULES.md](../VALIDATION_RULES.md)

## Trigger / entry point

- **Page:** Organization Hierarchy (`apps/admin-console/.../organization-hierarchy-page` — System Gateway-backed admin view).
- **Action button:** "Add Client" (right-pane primary action — visible only to Falcon System Administrator + Product roles; hidden via PES for Operation and all Client-side roles).
- **Modal / drawer shell:** the wizard opens in a [[Falcon Wizard]] dialog (modern target) or [[Falcon Stepper Legacy]] (current consumer) — see Component Mapping below.
- **Precondition:** authenticated Falcon admin · IP on tenant allowlist (per [[V-account-ip-allowlist-enforcement]]) · System Gateway routes the call.

## The 5 steps

1. **Step 1 — Account Information** (mandatory) — Account Name + classification + Profile Picture + Official Data (Authority Letter + address + VAT + Finance ID). Detailed in [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md).
2. **Step 2 — Account Settings** (mandatory) — Password Security Level + Allowed IPs + 4 Account Limits. Detailed in [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md).
3. **Step 3 — Configuring CommChannels & Services** (optional) — per-channel `Visibility` + `PricingType` + `PriceValue`. Detailed in [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md).
4. **Step 4 — Configuring Applications & Services** (optional) — same shape as Step 3 for Apps. Detailed in [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md).
5. **Step 5 — Creating Account Owner user** (mandatory) — Personal Info + Role + Delivery Method; triggers Identity user creation. Detailed in [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md).

**Wizard navigation:** Next · Previous · Save Draft (FE-local; PRD silent on persistence) · Submit (Step 5 only). All five steps are buffered client-side and submitted as **one composite `CreateAccountRequest`** to Commerce `POST /api/Node/create-account` at the end of Step 5.

> Critical implementation note: the wizard is NOT a per-step API submission. Steps 1-4 are local form state; the submission happens once on the Step 5 final action. This is dictated by the backend shape — `CreateAccountRequest` is a single composite DTO that bundles `Info, Settings, CommChannels?, Applications?, AccountOwner, DeliveryMethod`.

## Cross-flow dependencies

- **Triggers [[Add User Flow]] (specialist Flow-B):** Step 5 creates the Account Owner user. The Kafka chain `UserCreationRequested → Identity` lands in PRD-02's W1 Add User flow (server-side, no UI). The same `CreateUserRequest` validation surface applies — `V-user-first-last-name-letters-only`, `V-username-format-uniqueness-immutable`, `V-password-complexity-per-security-level`.
- **Prerequisite for [[Add Node Flow]] (specialist Flow-C):** sub-nodes (`CreateSubNodeRequest`) require an existing Main Node — Add Client creates the Main Node. The `Settings.MaxNodeLevel` cap from Step 2 enforces max depth at Add Node time.
- **Prerequisite for Add Contract flow (PRD-03 — not yet seeded):** contracts target an Account by id. Contract activation funds the Master Wallet (W8 Kafka event chain).
- **Settings tab edit flow:** post-create edits to `AccountSettings` (Password level, IPs, limits) go through `PUT /api/Setting`. Same `V-*` rules apply. PRD-01 BR-AM-39 open question (shrinking a limit below current usage).
- **CommChannel/App activation flow (W4):** `DoPaymentCommunicationChannelRequest` advances a `Show`-state config from `InActive (First time) → Paid → Active`. The price set in Step 3/4 of this wizard is what gets debited from the Master Wallet.

## Page sections this flow touches

- `tabs-header` — host of the "Add Client" entry button (right-side primary action).
- 5 wizard step panels — each step renders into the same dialog/drawer container.
- Post-create: on success, the new Account row appears in the Hierarchy tab of [[Organization Hierarchy]] (refresh `GET /api/accounts/hierarchy`); the new AO user appears in the Identity-side users list (post-Kafka, eventually-consistent).

## Sequence diagram (textual)

```
Admin (Falcon System Admin / Product)
    │
    ▼
[Admin Console — Add Client button] ────► [System Gateway: 7256]
                                              │
                                              ▼
                         [Commerce: POST /api/Node/create-account] ───┐
                                              │                       │ persists:
                                              │                       │  - Main Node
                                              │                       │  - Account
                                              │                       │  - AccountSettings
                                              │                       │  - CommChannelConfig × N
                                              │                       │  - AppConfig × N
                                              │                       │
                                              │                       ▼
                                              │    ┌──── Kafka: commerce.user-creation-requested.v1 ────► [Identity Service]
                                              │    │                                                          │
                                              │    │                                                          ▼
                                              │    │                                            creates Zitadel user · applies PasswordPolicy(level)
                                              │    │                                            · sends credentials per DeliveryMethod
                                              │    │
                                              │    ├──── Kafka: commerce.wallet-configured.v1 ────► [Charging Service]
                                              │    │                                                   │
                                              │    │                                                   ▼
                                              │    │                                       materializes Master Wallet (abstract)
                                              │    │                                       + sub-wallets per topology
                                              │    │
                                              │    ├──── Kafka: commerce.identity-settings-sync.v1 ────► [Identity Service]
                                              │    │
                                              │    └──── Kafka: commerce.tenant-ip-allowlist-changed.v1 ────► [Core Gateway]
                                              │                                                                  │
                                              │                                                                  ▼
                                              │                                                       refreshes Redis IP allowlist cache
                                              ▼
                              returns ServiceOperationResult<CreateAccountResponse>
                                              │
                                              ▼
[Admin Console: success toast · navigate to Org Hierarchy with new client highlighted]
```

## See also (Add Client folder)

- [README](README.md) — folder index
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[02 User Management]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Access PES Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[Falcon Roles Permission Matrix]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
