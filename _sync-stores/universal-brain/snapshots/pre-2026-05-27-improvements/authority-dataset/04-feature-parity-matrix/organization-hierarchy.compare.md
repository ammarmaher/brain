---
type: feature-compare
feature: organization-hierarchy
purpose: "Answers 'how organization-hierarchy shares the tree component but admin adds the 5-step Add Client wizard + Falcon synthetic root'. Open before modifying tree, Add Client, or Add Node/User flows."
admin-side-app: admin-console
admin-side-route: /organization-hierarchy
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /organization-hierarchy
mgmt-side-gateway: CoreGateway
falcon-only: false
client-only: false
shared: true
pes-keys-admin:
  - adminConsole.enter
  - adminConsole.accountHierarchy.view
  - adminConsole.account.add
  - adminConsole.accountProfile.edit
  - adminConsole.rootPasswordSecurityLevel.view
  - adminConsole.rootPasswordSecurityLevel.edit
  - adminConsole.accountPasswordSecurityLevel.edit
  - adminConsole.rootAllowedIps.edit
  - adminConsole.accountAllowedIps.edit
  - adminConsole.accountQuota.edit
  - adminConsole.services.payment
  - adminConsole.services.editPriceType
  - adminConsole.services.editPriceValue
  - adminConsole.services.visibility
pes-keys-mgmt:
  - managementConsole.enter
  - managementConsole.accountHierarchy.view
  - managementConsole.account.view
  - managementConsole.account.edit
  - managementConsole.organization.view
  - managementConsole.organization.add
  - managementConsole.accountUser.add
  - managementConsole.orgUser.add
  - managementConsole.services.view
  - managementConsole.services.payment
  - managementConsole.services.disable
  - managementConsole.accountSettings.view
  - managementConsole.orgSettings.view
  - managementConsole.users.view
  - managementConsole.accountProfile.view
  - managementConsole.accountProfile.edit
  - managementConsole.accountPasswordSecurityLevel.view
  - managementConsole.accountPasswordSecurityLevel.edit
  - managementConsole.accountAllowedIps.view
  - managementConsole.accountAllowedIps.edit
  - managementConsole.accountQuota.view
  - managementConsole.accountQuota.edit
flows:
  - Add Client
  - Add Node
  - Add User
  - Edit Node
extracted: 2026-05-16
---

# Feature compare · `organization-hierarchy`

> [!tldr]
> The org-hierarchy tree page exists on **both** the Falcon admin-console and the Client management-console — same selector, same shared `<falcon-organization-hierarchy-tree>`, same 4-tab right-pane (Hierarchy / CommChannels & Services / Apps & Services / Settings). The two sides differ in (a) PES namespace (`adminConsole.*` vs `managementConsole.*`), (b) gateway (SystemGateway vs CoreGateway), (c) what the tree shows at the top (synthetic `Falcon Clients` root on Falcon side; the tenant's own account subtree on Client side), and (d) one sub-flow that only ships on the Falcon side: the 5-step **Add Client** wizard (Falcon staff onboards new client accounts; clients never create accounts).

## At a glance

| | Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|---|
| Route | `/organization-hierarchy` `[CODE] apps/admin-console/src/app/features/routes.ts:11-22` | `/organization-hierarchy` `[CODE] apps/management-console/src/app/features/account-administration/routes.ts:18-27` | Same path; mounted under each app's own routes module |
| Route loader | Lazy `loadComponent` `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/01-ROUTING.md` | Synchronous `component:` import `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/01-ROUTING.md` | Mgmt side is eager; admin side is lazy |
| Container component | `OrganizationHierarchyComponent` `[CODE] apps/admin-console/.../organization-hierarchy/organization-hierarchy.component.ts:69-881` | `OrganizationHierarchyComponent` `[CODE] apps/management-console/.../organization-hierarchy/organization-hierarchy.component.ts:44-982` | Same selector `app-organization-hierarchy`; different file paths |
| Default gateway | `Gateway.SystemGateway` (`:7256`) `[BRAIN-OUT] authority-dataset/01-roles/sys-admin.md:34` | `Gateway.CoreGateway` (`:7038`) `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:82-83` (`provideAppDefaultGateway(Gateway.CoreGateway)` in `apps/management-console/src/app/app.config.ts:52`) | App-level default; only Identity gateway is used cross-app on admin side |
| Root guard | `adminConsoleGuard` `[CODE] libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27` | `managementConsoleGuard` `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/01-ROUTING.md:33-37` | Each console has its own app-level guard checking the `app.*` PES key |
| Route guard | `shellAccessGuard` reading `FalconAccess.adminConsole.accountHierarchy.view()` `[CODE] apps/admin-console/src/app/features/routes.ts:20` | `shellAccessGuard` reading `FalconAccess.managementConsole.accountHierarchy.view()` `[CODE] apps/management-console/.../routes.ts:25` | Same guard, different PES key |
| Add Client (5-step wizard) | ✅ Falcon-only — visible only when `FalconAccess.adminConsole.account.add()` resolves `true` `[CODE] organization-hierarchy.component.ts:599, 503-508` | ❌ Not present — no Add Client wizard component in mgmt feature tree `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/02-COMPONENTS.md:4-28` | Clients cannot create client accounts; only Falcon staff onboards new clients |
| Add Node (drawer) | ✅ Available via tree `'add-node'` action `[CODE] organization-hierarchy.component.ts:599-608` | ✅ Available; gated by `canAddOrganization` (= `FalconAccess.managementConsole.organization.add()`) `[CODE] organization-hierarchy.component.ts:548, 558-561` | Same `<app-drawer>` body on both sides |
| Add User | ✅ Available via tree `'add-user'` action and tab toolbar; routes to `/profile?mode=add-wizard` | ✅ Available via tree `'add-user'` action and tab toolbar; routes to `/profile?mode=add-wizard` `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/01-ROUTING.md:61-75` | Same `/profile` cross-app destination from both sides |
| Edit Node (rename) | ✅ Same `<app-drawer>` with `isEditNode=true` `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/02-COMPONENTS.md:33-34` | ✅ Same drawer pattern `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/02-COMPONENTS.md:27` | Identical surface |
| Hierarchy tab (users list) | ✅ Always enabled `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/05-PES.md:115-117` | ✅ Always enabled `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/05-PES.md:81-82` | Same `<falcon-table>` |
| Comm-Channels & Services tab | ✅ enabled `!isFalcon && isMain` (skipped on synthetic Falcon root) `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/05-PES.md:115-117` | ✅ enabled `isRootSelection && canViewServices` (= `services.view` PES key — acc-owner only) `[CODE] organization-hierarchy.component.ts:571-602` | Mgmt-side enable is acc-owner-only; admin-side is node-shape-based |
| Apps & Services tab | ✅ enabled `!isFalcon && isMain` | ✅ enabled `isRootSelection && canViewServices` (acc-owner only) | Same as comm-channels |
| Settings tab | ✅ Always enabled (sub-gating inside) `[CODE] node-settings-tab.component.ts:332-345` | ✅ enabled `isRootSelection ? canViewAccountSettings : canViewOrgSettings` `[CODE] organization-hierarchy.component.ts:571-602` | Mgmt has Org-vs-Account distinction; admin has Root-vs-Account distinction |
| Visible tree depth | Synthetic `Falcon Clients` root → every client account → main → sub-nodes (full reach) `[CODE] organization-hierarchy.component.ts:138, 213-217` | Tenant's own root (no `Falcon Clients` parent) → main → sub-nodes `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/02-COMPONENTS.md:43` | Falcon side prepends a synthetic root that Clients never see |
| Roles allowed at the route | sys-admin · sys-ops · sys-products `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:35` | acc-owner · acc-admin (acc-user explicitly denied `acc.org-hierarchy.view`) `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:63` and `[BRAIN-OUT] authority-dataset/01-roles/acc-user.md:47` |

## Per-role capability

> Each cell cites the PES key that decides it AND the catalog line that delivers the verdict.

| Role | Land on page | Add client | Add node | Add user | Edit profile | View settings | Edit pwd/IPs/quota |
|---|---|---|---|---|---|---|---|
| **sys-admin** | ✅ `sys.acc-hierarchy.view` `[BRAIN-OUT] sys-admin.md:46` | ✅ `sys.account.add` (`adminConsole.account.add`) `[BRAIN-OUT] sys-admin.md:47` | ✅ via tree `'add-node'` action — no separate PES key (`allowedTreeActions` always includes `'add-node'` for admin) `[CODE] organization-hierarchy.component.ts:603-608` | ✅ via tree `'add-user'` action — backed by Identity `user.role.*` matrix at submit time `[BRAIN-OUT] sys-admin.md:75-78` | ✅ `sys.account-profile.edit` (`adminConsole.accountProfile.edit`) `[BRAIN-OUT] sys-admin.md:48` | ✅ `sys.root-password-security-level.view` + sub-checks `[BRAIN-OUT] sys-admin.md:49` | ✅ All: `sys.root-password-security-level.edit` (only sys-admin) + `sys.root-allowed-ips.edit` (only sys-admin) + `sys.account-allowed-ips.edit` + `sys.account-quota.edit` `[BRAIN-OUT] sys-admin.md:50-54` |
| **sys-ops** | ✅ `sys.acc-hierarchy.view` `[BRAIN-OUT] sys-ops.md:46` | ❌ no `sys.account.add` rule (silent deny) `[BRAIN-OUT] sys-ops.md:60` | ✅ same as sys-admin (no separate PES) | ✅ same | ❌ no `sys.account-profile.edit` rule `[BRAIN-OUT] sys-ops.md:61` | ✅ `sys.root-password-security-level.view` (read-only) `[BRAIN-OUT] sys-ops.md:47` | ⚠ Partial: ❌ root-password-security-level.edit `[BRAIN-OUT] sys-ops.md:48`; ❌ root-allowed-ips.edit `[BRAIN-OUT] sys-ops.md:49`; ✅ account-allowed-ips.edit `[BRAIN-OUT] sys-ops.md:50`; ❌ account-quota.edit `[BRAIN-OUT] sys-ops.md:63` |
| **sys-products** | ✅ `sys.acc-hierarchy.view` `[BRAIN-OUT] sys-products.md:46` | ✅ `sys.account.add` `[BRAIN-OUT] sys-products.md:47` | ✅ same as sys-admin | ✅ same | ✅ `sys.account-profile.edit` `[BRAIN-OUT] sys-products.md:48` | ❌ root-password-security-level.view = deny (stricter than sys-ops) `[BRAIN-OUT] sys-products.md:49` | ✅ `sys.account-quota.edit` `[BRAIN-OUT] sys-products.md:52`; ❌ root-allowed-ips.edit `[BRAIN-OUT] sys-products.md:51`; ❌ account-allowed-ips.edit (no rule) `[BRAIN-OUT] sys-products.md:71` |
| **acc-owner** | ✅ `acc.org-hierarchy.view` `[BRAIN-OUT] acc-owner.md:47` | ❌ N/A — Add Client wizard not in mgmt feature `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/02-COMPONENTS.md:4-28` | ✅ `acc.organization.add` (`managementConsole.organization.add`) `[BRAIN-OUT] acc-owner.md:51`; tree gates via `canAddOrganization` `[CODE] organization-hierarchy.component.ts:548, 558-561` | ✅ Both account-level (`acc.account-user.add` — only acc-owner) AND org-level (`acc.org-user.add`) `[BRAIN-OUT] acc-owner.md:52-53`; tree includes `'add-user'` if either flag is true `[CODE] organization-hierarchy.component.ts:558-561` | ✅ `acc.account-profile.edit` (only acc-owner) `[BRAIN-OUT] acc-owner.md:61` | ✅ `acc.account-settings.view` + `acc.org-settings.view` `[BRAIN-OUT] acc-owner.md:57-58` | ✅ All: `acc.account-password-security-level.edit` + `acc.account-allowed-ips.edit` + `acc.account-quota.edit` `[BRAIN-OUT] acc-owner.md:63-67` |
| **acc-admin** | ✅ `acc.org-hierarchy.view` `[BRAIN-OUT] acc-admin.md:47` | ❌ N/A | ✅ `acc.organization.add` `[BRAIN-OUT] acc-admin.md:51` | ⚠ Only org-user (`acc.org-user.add` allow `[BRAIN-OUT] acc-admin.md:52`); ❌ NO `acc.account-user.add` `[BRAIN-OUT] acc-admin.md:53` | ❌ `acc.account-profile.edit` explicitly denied `[BRAIN-OUT] acc-admin.md:60` | ✅ `acc.account-settings.view` + `acc.org-settings.view` `[BRAIN-OUT] acc-admin.md:57-58` | ❌ All explicit denies: password-security-level, allowed-ips, quota `[BRAIN-OUT] acc-admin.md:61-66` |
| **acc-user** | ❌ `acc.org-hierarchy.view` denied `[BRAIN-OUT] acc-user.md:47` | ❌ N/A | ❌ `acc.organization.add` denied `[BRAIN-OUT] acc-user.md:51` | ❌ Both `acc.account-user.add` AND `acc.org-user.add` denied `[BRAIN-OUT] acc-user.md:52-53` | ❌ `acc.account-profile.edit` denied `[BRAIN-OUT] acc-user.md:61` | ❌ `acc.account-settings.view` denied `[BRAIN-OUT] acc-user.md:57` | ❌ All denied `[BRAIN-OUT] acc-user.md:62-67` |

Reading the matrix: a single `❌` does not stop the user landing on the page if `view` is allowed (they will see the tree but the affected action button / tab will be hidden by `canX` flag — `[CODE] organization-hierarchy.component.ts:558-602`).

## PES keys consumed by this feature

### Admin-console side (`FalconAccess.adminConsole.*`)

| Key | Where checked | Source |
|---|---|---|
| `adminConsole.enter()` | Root canActivate via `adminConsoleGuard` | `[CODE] libs/falcon/src/core/lib/guards/admin-console.guard.ts:17` |
| `adminConsole.accountHierarchy.view()` | Route data.access via `shellAccessGuard` | `[CODE] apps/admin-console/src/app/features/routes.ts:20` |
| `adminConsole.account.add()` | Container `primeAccess` → drives `canAddAccount` + `'add-client'` in `allowedTreeActions` + `addClient()` button enable | `[CODE] organization-hierarchy.component.ts:599, 503-508, 603-608` |
| `adminConsole.accountProfile.edit()` | Container `primeAccess` → drives `canEditAccountProfile` (passed to hierarchy-tab to enable Edit button on info view) | `[CODE] organization-hierarchy.component.ts:600` |
| `adminConsole.rootPasswordSecurityLevel.view()` | NodeSettingsTab `ensureAccess` → `canViewRootPasswordSecurityLevel` | `[CODE] node-settings-tab.component.ts:334` |
| `adminConsole.rootPasswordSecurityLevel.edit()` | NodeSettingsTab `ensureAccess` → `canEditRootPasswordSecurityLevel` | `[CODE] node-settings-tab.component.ts:335` |
| `adminConsole.accountPasswordSecurityLevel.edit()` | NodeSettingsTab `ensureAccess` → `canEditAccountPasswordSecurityLevel` | `[CODE] node-settings-tab.component.ts:336` |
| `adminConsole.rootAllowedIps.edit()` | NodeSettingsTab `ensureAccess` → `canEditRootAllowedIps` | `[CODE] node-settings-tab.component.ts:337` |
| `adminConsole.accountAllowedIps.edit()` | NodeSettingsTab `ensureAccess` → `canEditAccountAllowedIps` | `[CODE] node-settings-tab.component.ts:338` |
| `adminConsole.accountQuota.edit()` | NodeSettingsTab `ensureAccess` → `canEditAccountQuota` | `[CODE] node-settings-tab.component.ts:339` |
| `adminConsole.services.payment` / `editPriceType` / `editPriceValue` / `visibility` | NOT directly queried in TS — backend stamps `row.allowedActions: FalconRowAction[]` per row and the tab filters the row menu against that array | `[CODE] apps-services-tab.component.ts:724-737`; `[CODE] comm-channels-services-tab.component.ts:733-748`; `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/05-PES.md:19-21` |

### Management-console side (`FalconAccess.managementConsole.*`)

| Key | Where checked | Source |
|---|---|---|
| `managementConsole.enter()` | App-level via `managementConsoleGuard` | `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/05-PES.md:100-103` |
| `managementConsole.accountHierarchy.view()` | Route data.access via `shellAccessGuard` | `[CODE] apps/management-console/.../routes.ts:25` |
| `managementConsole.account.view()` | Container `primeAccess` → `canViewAccount` | `[CODE] organization-hierarchy.component.ts:546` |
| `managementConsole.account.edit()` | Container `primeAccess` → `canEditAccount` | `[CODE] organization-hierarchy.component.ts:551` |
| `managementConsole.organization.view()` | Container `primeAccess` → `canViewOrganization` | `[CODE] organization-hierarchy.component.ts:547` |
| `managementConsole.organization.add()` | Container `primeAccess` → `canAddOrganization` (drives `'add-node'` in `allowedTreeActions`) | `[CODE] organization-hierarchy.component.ts:548, 558-561` |
| `managementConsole.accountUser.add()` | Container `primeAccess` → `canAddAccountUser` (acc-owner only; used by root-node Add User path) | `[CODE] organization-hierarchy.component.ts:549, 729-737` |
| `managementConsole.orgUser.add()` | Container `primeAccess` → `canAddOrgUser` (used by sub-node Add User path) | `[CODE] organization-hierarchy.component.ts:550, 729-737` |
| `managementConsole.services.view()` | Container `primeAccess` → `canViewServices` (drives CommChannels + Apps tab enabled state) | `[CODE] organization-hierarchy.component.ts:552, 571-602` |
| `managementConsole.services.payment()` | CommChannels + Apps tabs `primeAccess` → `canDoPayments` | `[CODE] comm-channels-services-tab.component.ts:886`; `[CODE] apps-services-tab.component.ts:1030` |
| `managementConsole.services.disable()` | CommChannels + Apps tabs `primeAccess` → `canManageServices` (Enable/Disable/Visibility) | `[CODE] comm-channels-services-tab.component.ts:887`; `[CODE] apps-services-tab.component.ts:1031` |
| `managementConsole.accountSettings.view()` | Container + NodeSettingsTab — drives Settings tab enabled on root selection | `[CODE] organization-hierarchy.component.ts:553`; `[CODE] node-settings-tab.component.ts:369` |
| `managementConsole.orgSettings.view()` | Container + NodeSettingsTab — drives Settings tab enabled on sub-node selection | `[CODE] organization-hierarchy.component.ts:554`; `[CODE] node-settings-tab.component.ts:370` |
| `managementConsole.users.view()` | Container `primeAccess` → `canViewUsers` (drives users-list visibility on Hierarchy tab) | `[CODE] organization-hierarchy.component.ts:555` |
| `managementConsole.accountProfile.view()` / `accountProfile.edit()` | InformationComponent (Hierarchy tab info view) | `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/05-PES.md` |
| `managementConsole.accountPasswordSecurityLevel.view()` / `.edit()` | NodeSettingsTab `ensureAccess` → `canView/EditAccountPasswordSecurityLevel` | `[CODE] node-settings-tab.component.ts:371-372` |
| `managementConsole.accountAllowedIps.view()` / `.edit()` | NodeSettingsTab `ensureAccess` → `canView/EditAccountAllowedIps` | `[CODE] node-settings-tab.component.ts:373-374` |
| `managementConsole.accountQuota.view()` / `.edit()` | NodeSettingsTab `ensureAccess` → `canView/EditAccountQuota` | `[CODE] node-settings-tab.component.ts:375-376` |

## Differences

### Routing
- **Path is identical**: both apps use `/organization-hierarchy`. Each app's router resolves it against its own remote's `app.routes.ts` (Module Federation isolates the namespace).
- **Loader differs**: admin uses lazy `loadComponent` `[CODE] apps/admin-console/src/app/features/routes.ts:11-22`; mgmt uses synchronous `component:` import `[CODE] apps/management-console/.../routes.ts:18-27`. New code should prefer lazy on both — known drift.
- **Guard chain is symmetric**: each side has its own app-level guard (`adminConsoleGuard` / `managementConsoleGuard`) plus `shellAccessGuard`. The only thing that changes is the `data.access` PES key.

### Component shape
- **Containers are forks** of the same design — same selector `app-organization-hierarchy`, same imports of `<falcon-organization-hierarchy-tree>` + `<app-drawer>` + `<p-contextMenu>` + `TabsLayoutComponent`. Admin container is ~881 lines `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/02-COMPONENTS.md:50`; mgmt container is ~982 lines `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/02-COMPONENTS.md:33`. Mgmt container is larger because it carries more flag-driven branches (10 `canX` flags vs 2 on admin) and the per-node user-add resolver `canAddUserForNode()`.
- **Add Client wizard** lives ONLY on admin (`CreateClientWizardComponent` with 5 step components) `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/02-COMPONENTS.md:35-44`. Mgmt has no equivalent.
- **TabsLayout + 4 tab components** are forked but functionally identical. Tab enabled-logic differs (see "Sub-features" row in `At a glance`).
- **NodeSettingsTab** has the Root vs Account vs Sub-node distinction on admin (3-tier) `[CODE] node-settings-tab.component.ts:103-134`; on mgmt it's a Root (account) vs Sub-node (org) distinction (2-tier) `[CODE] organization-hierarchy.component.ts:571-602`.

### Service / API endpoints
- **Same Commerce surface** for both: `commerce/Node`, `commerce/Setting`, `commerce/information`, `commerce/Node/{id}/applications`, `commerce/Node/{id}/comm-channels`, and the 14 `commerce/node/*` mutations under `CommerceGatewayService`. `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/03-SERVICES-APIS.md:24-54`; `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:21-72`.
- **Identity surface differs in transport**: admin calls `user?…` + `user/generate-password` via `Gateway.IdentityGateway` `[CODE] user-api.service.ts:45`; mgmt calls `identity/user?…` + `identity/user/generate-password` via the default `Gateway.CoreGateway` `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:23-24, 85-86`. Same backend — Identity service — different gateway.
- **Add Client endpoint** is admin-only: `POST commerce/Node/create-account` with `CreateClientWizardRequestDto` `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/03-SERVICES-APIS.md:28`. No mgmt equivalent.
- **Wizard-only lookups** (admin-only): `GET commerce/application` + `GET commerce/communicationChannel` (drive wizard steps 2-3) `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/03-SERVICES-APIS.md:31-32`.

### DTOs
- **Shared DTOs (both sides)**: `OrgHierarchyNode`, `OrgNodeAction`, `OrgNodeActionType`, `CreateSubNodeRequest`, `UpdateSubNodeNameRequest`, `ClientSettingsModel`, `AccountInformationModel`, `AppServiceItem`, `CommChannelServiceItem`, plus the full Change/Disable/Enable/DoPayment/Delete request+response set in `CommerceGatewayService`. Files are forked per app but contents are byte-identical or near-identical. `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/04-DTOS.md`; `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/04-DTOS.md`.
- **Admin-only DTOs**: `CreateClientWizardRequestDto` + the 5 step DTOs (`InformationClientStepDto`, `ClientSettingsStepDto`, `CommChannelsStepDto`, `ClientApplicationStepDto`, `AccountOwnerStepDto`) `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/00-README.md:44-50`.
- **`OrgNodeActionType` literal union differs**: admin includes `'add-client'` `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/04-DTOS.md:40`. Mgmt union (per source code grep — not in the cross-page summary verbatim) omits `'add-client'` since the wizard does not exist there.

### PES namespace
- **Admin uses `sys.*` resource family**: `sys.acc-hierarchy`, `sys.account`, `sys.account-profile`, `sys.root-password-security-level`, `sys.root-allowed-ips`, `sys.account-allowed-ips`, `sys.account-quota`, `sys.services`. `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:33-54`.
- **Mgmt uses `acc.*` resource family**: `acc.org-hierarchy`, `acc.account`, `acc.organization`, `acc.account-user`, `acc.org-user`, `acc.services`, `acc.account-settings`, `acc.org-settings`, `acc.users`, `acc.account-profile`, `acc.account-password-security-level`, `acc.account-allowed-ips`, `acc.account-quota`. `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:62-84`.
- **No PES key is shared**: every key in the feature is in either the `sys.*` namespace (Falcon-only — only sys-* roles get rules) or the `acc.*` namespace (Client-only — only acc-* roles get rules). `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:147-150`.

### Gateway
- **Admin default**: `Gateway.SystemGateway` (port 7256). `[BRAIN-OUT] authority-dataset/01-roles/sys-admin.md:34`.
- **Mgmt default**: `Gateway.CoreGateway` (port 7038), set in `apps/management-console/src/app/app.config.ts:52` via `provideAppDefaultGateway(Gateway.CoreGateway)`. `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:82-83`.
- **Cross-gateway calls**: admin-side Identity calls route through `Gateway.IdentityGateway` explicitly (the only place this feature talks to non-default gateway on admin) `[CODE] user-api.service.ts:45`; mgmt side keeps everything on CoreGateway and uses the `identity/*` URL prefix `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:85-86`.

## Sub-flows

| Flow | One-liner | Playbook |
|---|---|---|
| **Add Client** | 5-step wizard (Information → Settings → CommChannels → Applications → Account Owner) — Falcon-side only — `POST commerce/Node/create-account`. Only sys-admin and sys-products can run it (sys-ops `Not Allow`). | [[Add Client/README]] (folder form — 18 files) at `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md` `[BRAIN-OUT]` |
| **Add Node** | Single dialog/drawer → `POST commerce/Node/create-SubNode { parentId, name }`. Available to all sys-* and acc-owner/acc-admin (scoped to own subtree on Client side). | [[flows/Add Node]] at `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md` `[BRAIN-OUT]` |
| **Add User** | 3-tab wizard (Personal Info → Role & Permissions → Notification & Credentials). Available to all sys-* and acc-owner/acc-admin. Routes from this page via `/profile?mode=add-wizard`. Result: Identity creates user in `Pending` and dispatches OTP via DeliveryMethod. | [[flows/Add User]] at `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md` `[BRAIN-OUT]` |
| **Edit Node** | Rename or scheduled rename via drawer → `PUT commerce/Node/changeNodeName { id, name, effectiveDate? }`. Move-node and Archive/Delete are MISSING (Q-AM-18 / GAP-AM-29 — do NOT expose in UI). Edit Settings on Main routes to the Settings tab (separate sub-flow). | [[flows/Edit Node]] at `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md` `[BRAIN-OUT]` |

## What changes when copying admin → mgmt

A concrete checklist for porting the admin-console organization-hierarchy feature shape onto the management-console (or harmonizing the two as one shared lib).

1. **Flip the route guard's `data.access`**
   - From: `FalconAccess.adminConsole.accountHierarchy.view()` → To: `FalconAccess.managementConsole.accountHierarchy.view()`.
   - `[CODE] apps/admin-console/.../routes.ts:20` → `[CODE] apps/management-console/.../routes.ts:25`.
2. **Flip the app-level guard**
   - From: `adminConsoleGuard` → To: `managementConsoleGuard`.
   - `[CODE] libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27` (admin) → equivalent mgmt guard reading `FalconAccess.managementConsole.enter()`.
3. **Flip the default gateway**
   - From: `Gateway.SystemGateway` (`:7256`) → To: `Gateway.CoreGateway` (`:7038`).
   - Set via `provideAppDefaultGateway(...)` in each app's `app.config.ts`. `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:82-83`.
4. **Rewrite all PES keys: `adminConsole.*` → `managementConsole.*`**
   - Container `primeAccess`: replace the 2-flag block (`canAddAccount`, `canEditAccountProfile`) with the 10-flag block (`canViewAccount`, `canViewOrganization`, `canAddOrganization`, `canAddAccountUser`, `canAddOrgUser`, `canEditAccount`, `canViewServices`, `canViewAccountSettings`, `canViewOrgSettings`, `canViewUsers`). `[CODE] organization-hierarchy.component.ts:544-557`.
   - `NodeSettingsTab.ensureAccess`: replace `adminConsole.{root,account}PasswordSecurityLevel`, `{root,account}AllowedIps`, `accountQuota` with `managementConsole.account{PasswordSecurityLevel,AllowedIps,Quota}` view+edit pairs. `[CODE] node-settings-tab.component.ts:332-345` vs `[CODE] node-settings-tab.component.ts:369-376`.
   - Tab `primeAccess` (CommChannels + Apps): add `managementConsole.services.{payment,disable}` checks driving `canDoPayments` + `canManageServices`. Admin side does NOT do client-side gating for services — it relies on backend `row.allowedActions`. New UI may copy admin's backend-driven model OR mgmt's client-side gating; do NOT mix.
5. **Remove the Add Client wizard surface**
   - Container: drop `showCreateClient`, `addClient()`, `canAddAccount` flag, `'add-client'` from `allowedTreeActions`.
   - Imports: drop `CreateClientWizardComponent` + 5 step components + `commerce/application` + `commerce/communicationChannel` services + `CreateClientWizardRequestDto`.
   - DTO: drop `'add-client'` from `OrgNodeActionType` union. `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/04-DTOS.md:40`.
6. **Replace synthetic Falcon root with tenant root**
   - Container: drop the `FALCON_ROOT_NODE` shortcut path (`isFalcon = userType === FALCON_USER`) and always call `getRootNodes()` against the user's own tenant. `[CODE] organization-hierarchy.component.ts:138, 213-217`.
   - Tree input: `[showRootFalcon]="false"`.
7. **Add the per-node user-add resolver**
   - Mgmt's `canAddUserForNode(nodeId)` returns `isRootSelection ? canAddAccountUser : canAddOrgUser`. `[CODE] organization-hierarchy.component.ts:729-737`. Admin has no such split (only `'add-user'` always).
8. **Settings tab gating**
   - Admin gates by node-shape (root vs main vs sub) AND PES per row. Mgmt gates by PES alone: `isRootSelection ? canViewAccountSettings : canViewOrgSettings`. `[CODE] organization-hierarchy.component.ts:571-602`.
9. **Identity transport**
   - Admin: `useGateway(Gateway.IdentityGateway)` with relative URLs `user/*`. `[CODE] user-api.service.ts:45`.
   - Mgmt: default gateway + URL prefix `identity/*`. `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:23-24`.
10. **CommChannels/Apps payload differences**
    - Mgmt list endpoint is `commerce/Node/{nodeId}/comm-channels/visible/details` `[BRAIN-OUT] old-ui-dataset/.../management-console/account-administration/03-SERVICES-APIS.md:50` (note: `/visible/details` suffix). Admin uses `commerce/Node/{nodeId}/comm-channels` `[BRAIN-OUT] old-ui-dataset/.../admin-console/organization-hierarchy/03-SERVICES-APIS.md:38`. Verify backend exposes both paths or unify in new UI.

## Cross-references

- Role notes: [[../01-roles/sys-admin]] · [[../01-roles/sys-ops]] · [[../01-roles/sys-products]] · [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- Status notes: [[../02-statuses/account-status]] · [[../02-statuses/service-status]] · [[../02-statuses/order-status]] · [[../02-statuses/user-status]]
- PES registry: [[../03-pes-keys/REGISTRY-RAW]]
- Cross-cutting: [[../07-cross-cutting/gateway-routing-map]] · [[../07-cross-cutting/test-users]]
- Flow playbooks:
  - Add Client folder — `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md`
  - Add Node — `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`
  - Add User — `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`
  - Edit Node — `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`
- Old-UI dataset deep dives:
  - Admin side: `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/` (00-README + 8 files)
  - Mgmt side: `Brain Outputs/datasets/old-ui-dataset/10-pages/management-console/account-administration/` (00-README + 8 files)
