---
type: page-dataset
app: management-console
feature: account-administration
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: deep-dive-agent-p8
---

# Account Administration (Organization Hierarchy)

## TL;DR
The single feature unique to management-console. Renders a left-pane organization-hierarchy tree (using shared `<falcon-organization-hierarchy-tree>`) and a right-pane four-tab layout (Hierarchy / CommChannels & Services / Apps & Services / Settings) for the selected node. Allows client account admins to: browse their account tree, edit account/organization details, manage subscribed comm-channel and application services (visibility, price changes, payments via wallet), maintain account-level settings (password security level, allowed IPs, quotas), and pivot to the user-profile page for user CRUD. All API calls go through the Core Gateway to Commerce, Identity, and Charging upstream services.

## Manifest
- [[01-ROUTING]] — 1 route, 2 guards
- [[02-COMPONENTS]] — 8 components (1 container + 1 tabs-layout + 4 tabs + 1 information + 1 balance-transfer)
- [[03-SERVICES-APIS]] — 8 services, **35 endpoints**
- [[04-DTOS]] — 50+ interfaces across 9 model files
- [[05-PES]] — 28 distinct `FalconAccess.managementConsole.*` keys
- [[06-VALIDATIONS]] — IP v4/v6 validation, name length 32 chars, IP duplicate check, profile picture conversion, country/city cascade
- [[07-CROSS-PAGE]] — 12 inbound deps from `@falcon`, exports 1 shared service consumed by contact-groups+comms-hub+marketplace
- [[08-RULES-APPLIED]] — Standalone components, signal+rxjs hybrid, lazy children loading, PBAC-resolved flags

## Source files
| File | Role |
|---|---|
| `apps/management-console/src/app/features/account-administration/routes.ts` | Route definition with shellAccessGuard |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/organization-hierarchy.component.ts` | Container — tree + tabs orchestration |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/organization-hierarchy.component.html` | Tree + tabs + drawer template |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/tabs-layout.component.ts` | 4-tab manager component |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/hierarchy-tab.component.ts` | Users-list & account-info-edit toggle |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/information.component.ts` | Editable account-info form |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/node-settings-tab/node-settings-tab.component.ts` | Password level + Allowed IPs + Quotas |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/comm-channels-services-tab.component.ts` | Subscribed comm channels (price/visibility/payment) |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/apps-services-tab/apps-services-tab.component.ts` | Subscribed applications (price/visibility/payment) |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/services/org-hierarchy.api.service.ts` | Tree + paginated users for node |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/services/node-api.service.ts` | Create / rename sub-node |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/services/user-api.service.ts` | Identity user list + generate password |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/services/settings-api.service.ts` | Get/update security settings |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/service/information.service.ts` | Get/update account information |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | Façade — delegates to commerce-gateway.service |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | Owns the 14 commerce mutation endpoints |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/apps-services-tab/services/apps-services.service.ts` | List applications subscribed to node |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/services/comm-channels-services.service.ts` | List visible comm channels w/ details |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/models/org-hierarchy.models.ts` | OrgHierarchyNode + OrgNodeAction |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/models/node-api.models.ts` | CreateSubNode / UpdateSubNodeName |
| `apps/management-console/src/app/features/account-administration/organization-hierarchy/utils/org-hierarchy.mapper.ts` | OrgHierarchyNode → PrimeNG TreeNode |
