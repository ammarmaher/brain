*** API Index — graph hub ***
*** Updated 2026-05-15 ***

# API Index

> Brain Outputs holds approved API contract rules. This note holds the graph.
>
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). API contracts live at [`understanding/backend/<service>/ENDPOINT_REGISTRY.md`](../../../Brain%20Outputs/understanding/backend/) + [`understanding/backend/<service>/DTO_DICTIONARY.md`](../../../Brain%20Outputs/understanding/backend/). Page-level API rules live at `understanding/pages/<page>/API_RULES.md`.

## Per-page API rule registries

| Page | API rules file | Approved count |
|---|---|---|
| organization-hierarchy | [API_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/API_RULES.md) | 0 (seed) |

## Backend hub

- [[BACKEND_INDEX]] — 9 services tracked. Vault service notes: [[Commerce Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Identity Service]] · [[Templates Service]] · [[Contact Group Service]] · [[Access PES Service]] · [[Core Gateway Service]] · [[System Gateway Service]].

## Global pattern (seed)

- [API_PATTERN.md](../../outputs/understanding/frontend/patterns/API_PATTERN.md) — seed.

## PRD entities → backend contracts (upstream)

| PRD | Entities | Backend service folder |
|---|---|---|
| [[01 Account Management]] | Account · Node · AccountSettings · CommChannelConfig · AppConfig · Wallet · WalletRecord · WalletTypeConfig · TransferTx | [`commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) · [`charging/`](../../../Brain%20Outputs/understanding/backend/charging/) |
| [[02 User Management]] | User · UserStatusHistory · LoginAttempt · OtpChallenge · Session · PermissionGroup · Permission | [`identity/`](../../../Brain%20Outputs/understanding/backend/identity/) · [`access/`](../../../Brain%20Outputs/understanding/backend/access/) |
| [[03 Contract Packaging Charging Billing]] | Contract · RateCardEntry · ContractDetail · Addon · WalletRecord · PriceUnit · Destination · Priority | [`commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) · [`charging/`](../../../Brain%20Outputs/understanding/backend/charging/) · [`provisioning/`](../../../Brain%20Outputs/understanding/backend/provisioning/) |
| [[04 Contact Group Management]] | ContactGroup · ContactGroupColumn · ContactGroupRecord · SharePolicy · UploadSession | [`contact-group/`](../../../Brain%20Outputs/understanding/backend/contact-group/) |
| [[05 Templates]] | Template · TemplateHeader/Body/Footer/Button/Variable · TemplateVersion · TemplateApprovalTrail · CommChannelConfig · CheckerLevel/User | [`templates/`](../../../Brain%20Outputs/understanding/backend/templates/) — **GAP-TM-01:** no public API yet · **GAP-TM-02:** no gateway route |

Hub: [[PRD_INDEX]].

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]]
