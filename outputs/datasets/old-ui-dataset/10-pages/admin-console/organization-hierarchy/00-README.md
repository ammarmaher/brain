---
type: page-dataset
app: admin-console
feature: organization-hierarchy
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: deep-dive-agent-p1
---

# Organization Hierarchy (Admin Console)

## TL;DR
The Falcon system-admin face on the org-hierarchy tree: Falcon users see the synthetic `Falcon Clients` root and every client/node beneath it; client users see their own account subtree. The page coordinates a lazy-loaded PrimeNG tree (rendered via the `<falcon-organization-hierarchy-tree>` library shell) against four tabs (Hierarchy / Comm Channels & Services / Apps & Services / Settings) plus three creation flows: Add Node (right drawer, 1-input form), Edit Node (same drawer, rename), and the 5-step Create Client wizard (Information → Settings → CommChannels → Application → Account Owner → finish + credential delivery). All traffic flows through Falcon's `HttpService + useGateway()` to Core Commerce (`commerce/*` URIs) plus one Identity Gateway call for generating account-owner passwords.

## Manifest
- [[01-ROUTING]] — 1 route (`organization-hierarchy`), 1 guard chain (`adminConsoleGuard` at app root + `shellAccessGuard` per route)
- [[02-COMPONENTS]] — 14 feature components (1 container, 1 tabs-layout, 4 tab components, 1 information edit-mode panel, 1 wizard host, 5 wizard step components, 1 user/info hierarchy tab)
- [[03-SERVICES-APIS]] — 11 feature-local services (10 feature + 1 information sub-service) talking to 21 distinct HTTP endpoints
- [[04-DTOS]] — 45 distinct TS interfaces / classes (request, response, state, enums)
- [[05-PES]] — 13 permission keys consumed (1 route-level, 12 inside components)
- [[06-VALIDATIONS]] — 18 named validators / business rules (sync + async)
- [[07-CROSS-PAGE]] — 4 inbound shared services + 2 shared dialog components; 0 services exported (feature is a leaf consumer)
- [[08-RULES-APPLIED]] — 19 patterns observed (good + bad) against the night-shift rules digest

## Source files (40 .ts files; .html / .scss companions not listed)
| File | Role |
|---|---|
| `apps/admin-console/src/app/app.routes.ts` | app-root routing (admin-console remote) |
| `apps/admin-console/src/app/features/routes.ts` | `accountAdministrationRoutes` — declares `organization-hierarchy` route |
| `apps/admin-console/src/app/features/organization-hierarchy/organization-hierarchy.component.ts` | top-level page container — orchestrates tree, tabs, drawer, wizard |
| `apps/admin-console/src/app/features/organization-hierarchy/organization-hierarchy.component.html` | container template |
| `apps/admin-console/src/app/features/organization-hierarchy/organization-hierarchy.component.scss` | container styles |
| `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts` | `OrgHierarchyNode`, `OrgNodeListItem`, `OrgNodeAction`, `OrgNodeActionType` |
| `apps/admin-console/src/app/features/organization-hierarchy/models/node-api.models.ts` | `GetNodeResponse`, `CreateSubNodeRequest`, `UpdateSubNodeNameRequest`, `IResult<T>` |
| `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts` | `mapOrgNodeToTreeNode`, `mapOrgNodesToTreeNodes`, `updateTreeNodeChildren` |
| `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | `OrgHierarchyApiService` — root nodes, children, paged user list per node |
| `apps/admin-console/src/app/features/organization-hierarchy/services/node-api.service.ts` | `NodeApiService` — change/add sub-node name, create-account |
| `apps/admin-console/src/app/features/organization-hierarchy/services/user-api.service.ts` | `UserApiService` — generate-password (Identity gw), list-users-by-node |
| `apps/admin-console/src/app/features/organization-hierarchy/services/application-channel-api.service.ts` | `ApplicationApiService` — list global applications (wizard step 3) |
| `apps/admin-console/src/app/features/organization-hierarchy/services/communication-channel-api.service.ts` | `CommunicationChannelApiService` — list global comm channels (wizard step 2) |
| `apps/admin-console/src/app/features/organization-hierarchy/services/settings-api.service.ts` | `SettingsApiService` — get/update security settings for node |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/create-client-wizard.component.ts` | 5-step wizard host |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/create-client-wizard.component.html` | wizard template |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/create-client-wizard.model.ts` | `CreateClientWizardRequestDto` + 5 step DTOs |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/index.ts` | barrel |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/steps/information-client-step/...` | Step 0: client info + lookups |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/steps/client-settings-step/...` | Step 1: settings (password security + IPs + quotas) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/steps/comm-channels-step/...` | Step 2: comm-channel services table |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/steps/client-application-step/...` | Step 3: applications services table |
| `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/steps/account-owner-step/...` | Step 4: account owner form |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/tabs-layout.component.ts` | tabs container — drives signals/computed for tab-visibility |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/model/models.ts` | `TabConfig` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/hierarchy-tab.component.ts` | Tab 0: users list / information view |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/model/models.ts` | `UserListItem` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/information.component.ts` | the 17-field information panel (view + edit) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/models/models.ts` | `AccountInformationModel`, `AccessSection`, `InformationPageMode`, `ProfilePictureInfo` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/service/information.service.ts` | `InformationService` — GET/PUT `commerce/information` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/comm-channels-services-tab.component.ts` | Tab 2: comm-channel pricing table |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/services/comm-channels-services.service.ts` | `CommChannelsServicesService` — list/update for tab 2 |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/models/models.ts` | `CommChannelServiceItem`, update DTOs, `toFalconItemStatus` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/apps-services-tab/apps-services-tab.component.ts` | Tab 3: applications pricing table |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/apps-services-tab/services/apps-services.service.ts` | `AppsServicesService` — list/update for tab 3 |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/apps-services-tab/models/models.ts` | `AppServiceItem`, update DTOs, `toFalconItemStatus` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/node-settings-tab/node-settings-tab.component.ts` | Tab 1: per-node settings (password level / allowed IPs / quotas) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/node-settings-tab/models/model.ts` | `ClientSettingsModel`, `QuotaSettingsDto`, `SecuritySettings` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | `CommerceActionsService` — thin façade over commerce-gateway |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | `CommerceGatewayService` — 14 PUT/POST/DELETE endpoints on `commerce/node/*` |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/models/models.ts` | request + response DTOs shared by tabs 2 & 3 (16 interfaces, 14 response types) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/tabs-layout/components/models/models.ts` | shared apps/comm-channels request types |
