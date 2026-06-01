---
type: moc
status: complete
date: 2026-05-16
mission: old-ui-dataset
source: origin/main @ 803ac1d1 (worktree at C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main)
features-mined: 17
endpoints-captured: ~138
dtos-captured: ~277
pes-keys-captured: ~78
tags: [moc, dataset, backend-integration, old-ui, status/complete]
---

> [!tldr]
> [BRAIN-OUT] Comprehensive dataset extracted from `origin/main` of falcon-web-platform-ui — the OLD UI's working backend integration. Per-page deep-dives capture routing, components, services, APIs, DTOs, PES gating, validations, cross-page dependencies, and rule-compliance observations. **Use this when wiring the new theme to existing APIs.**

# Old UI Dataset — Backend Integration Blueprint

## Source

- [BRAIN-OUT] Branch: `origin/main` (detached HEAD `803ac1d1` — "Merged PR 41615: trasfer issue")
- [BRAIN-OUT] Worktree (temporary): `C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\`
- [BRAIN-OUT] Live dataset folder: `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\`

## Master files

- [BRAIN-OUT] Brief template — `BRIEF-TEMPLATE.md`
- [BRAIN-OUT] Master index — `00-INDEX.md` *(planned)*
- [BRAIN-OUT] App map — `99-registries/01-APP-MAP.md` *(planned)*
- [BRAIN-OUT] API registry — `99-registries/02-API-REGISTRY.md` *(~138 endpoints, planned)*
- [BRAIN-OUT] DTO registry — `99-registries/03-DTO-REGISTRY.md` *(~277 DTOs, planned)*
- [BRAIN-OUT] PES registry — `99-registries/04-PES-REGISTRY.md` *(~78 keys, planned)*
- [BRAIN-OUT] Service registry — `99-registries/05-SERVICE-REGISTRY.md` *(planned)*

> [!note] Registry status
> [BRAIN-OUT] As of write-back the `99-registries/` folder is not yet on disk — the per-feature deep-dives carry the same data dispersed across `03-SERVICES-APIS.md` / `04-DTOS.md` / `05-PES.md`. Registry consolidation is the next mission step.

## Per-feature notes

### Admin-console (Falcon-user / System Gateway)
- [[20-Pages/old-ui-admin-console-organization-hierarchy]]
- [[20-Pages/old-ui-admin-console-wallet-balance-management]]
- [[20-Pages/old-ui-admin-console-comms-hub]]
- [[20-Pages/old-ui-admin-console-contact-groups]]
- [[20-Pages/old-ui-admin-console-contracts-cost-management]]
- [[20-Pages/old-ui-admin-console-marketplace-applications]]
- [[20-Pages/old-ui-admin-console-testing-charging]]

### Host-shell (host + auth + ambient pages)
- [[20-Pages/old-ui-host-shell]]

### Management-console (Client-user / Core Gateway)
- [[20-Pages/old-ui-management-console-account-administration]]
- [[20-Pages/old-ui-management-console-diffs]]

## Headline observations

- [BRAIN-OUT] Admin-console default gateway: `Gateway.SystemGateway` (Falcon-user surface)
- [BRAIN-OUT] Management-console default gateway: `Gateway.CoreGateway` (Client-user surface)
- [BRAIN-OUT] Permission namespaces: `adminConsole.*` / `managementConsole.*` / `contactGroup.*` (cross-app on `FalconAccess` registry)
- [BRAIN-OUT] Auth flows through Identity Gateway exclusively (host-shell pin); business calls forwarded to Core/System/Charging with JWT Bearer
- [BRAIN-OUT] Aggregator endpoint pattern (`api/commerce/accounts/{id}/hierarchy`) joins Commerce + Charging on the gateway — DO NOT bypass to the underlying services from the new UI
- [BRAIN-OUT] Inconsistent URL prefixing observed across services: `api/commerce/` vs `commerce/` vs `charging/` vs `identity/` — flagged as cleanup candidate ([[70-Gaps/GAP-OLDUI-01-Inconsistent-URL-Prefixes]])
- [BRAIN-OUT] Most isolated page: `testing-charging` (zero falcon-* / zero PrimeNG)
- [BRAIN-OUT] Most integrated page: `admin-console/organization-hierarchy` (21+ feature endpoints, 14-method shared `CommerceGatewayService`, 45 DTOs)
- [BRAIN-OUT] `admin-console/contracts-cost-management` has zero PES gating at the feature level — flagged ([[70-Gaps/GAP-OLDUI-02-Contracts-No-PES]])
- [BRAIN-OUT] `management-console/contracts-cost-management` cross-app sibling imports admin-console components via `../../../../../admin-console/...` — flagged ([[70-Gaps/GAP-OLDUI-03-Cross-App-Sibling-Imports]])
- [BRAIN-OUT] `admin-console/wallet-balance-management` cell-edit UI is half-built dead code; Save persists wallet strategy only — flagged ([[70-Gaps/GAP-OLDUI-04-Wallet-Strategy-Save-Misalignment]])

## Related notes

- [VAULT] [[Night-Shift-2026-05-16]] — parallel app-audit pass (different mission, same source snapshot)
- [VAULT] [[Organization-Hierarchy]] — pre-existing page note
- [MEMORY] `feedback_falcon_custom_library_mandatory` — strict customization order for new UI rebuild
- [MEMORY] `feedback_orchestrator_failure_modes_org_hierarchy` — orchestrator failure-mode rules

## Mission cross-references

- [BRAIN-OUT] Per-page README files at `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\<app>\<feature>\00-README.md`
- [BRAIN-OUT] Per-page deep-dive sections (01-08) live alongside each README — referenced via `[[01-ROUTING]]` etc. in the source folders, not inlined into vault notes
