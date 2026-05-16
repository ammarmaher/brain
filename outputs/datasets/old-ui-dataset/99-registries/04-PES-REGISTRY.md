---
title: PES Registry — Old UI (origin/main @ 803ac1d1)
type: registry
registry: pes
source: aggregated from 10-pages/ deep-dives (origin/main @ 803ac1d1)
extracted: 2026-05-16
extracted-by: aggregation-agent
namespaces: 4
total_keys: 56
---

# Old UI — PES Registry

> Every permission key consumed in the workspace, grouped by namespace. Registry source: `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`.

## Headline counts
- **`FalconAccess.adminConsole.*`** — 18 keys (Falcon-user side, resource prefix `app.admin-console` + `sys.*`)
- **`FalconAccess.managementConsole.*`** — 28 keys (Client-user side, resource prefix `app.management-console` + dedicated mgmt-namespace resources)
- **`FalconAccess.contactGroup.*` + `FalconAccess.contactGroups.viewShared`** — 9 keys (cross-app, resource prefix `sys.contact-group` / `acc.contact-group` via scope param)
- **`FalconAccess.userRole.*` (dynamic family)** — pattern-based queries for the role-transition matrix; not enumerable but consumed at runtime
- **`FalconAccess.authView.*`** — 1 key (Demo only)
- **App-entry keys** — 2 (`adminConsole.enter` + `managementConsole.enter`) + 2 dynamic remote `canMatch` keys (`app.management-console:view`, `app.admin-console:view`) + 2 dev-only (`microapp.user-settings:view`, `microapp.survey-container:view`)

**Total enumerable keys (excluding dynamic `userRole.other(s,t)` family): 56**.

## Permission namespaces

| Namespace | Owner | Where defined |
|---|---|---|
| `FalconAccess.adminConsole.*` | Falcon-user side admin-console + host nav | `falcon-access.registry.ts:89-132` |
| `FalconAccess.managementConsole.*` | Client-user side management-console | same file |
| `FalconAccess.contactGroup.*` (with `ContactGroupScope: 'sys' \| 'acc'`) | Cross-app — both admin and mgmt use, scope decides the resource prefix | `falcon-access.registry.ts:13-25, 162-171` |
| `FalconAccess.contactGroups.viewShared()` | Listed separately — always `resource: 'acc.contact-group'` regardless of caller | same file |
| `FalconAccess.userRole.other(source, target)` | Dynamic role-edit matrix | computed per (sourceRoleKey × targetRoleKey) |
| `FalconAccess.authView.view()` | Demo-only auth diagnostic | same file |
| Static dynamic-remote strings (`app.management-console:view`, etc.) | Module-Federation `canMatch` | `module-federation.manifest.json` |

---

## `adminConsole.*` (18 keys)

| Key path | Action | Resource | Where consumed | Source feature |
|---|---|---|---|---|
| `adminConsole.enter()` | view | `app.admin-console` | `adminConsoleGuard` (root canActivate of admin remote) + `shellPrimeAccessGuard` (when userType=1 host) | every admin-console feature, host-shell core |
| `adminConsole.accountHierarchy.view()` | view | `sys.acc-hierarchy` | route `data.access` on `organization-hierarchy` + host nav item | admin/organization-hierarchy |
| `adminConsole.account.add()` | add | `sys.account` | `OrganizationHierarchyComponent.primeAccess` — `canAddAccount` flag (Create Client wizard entry) | admin/organization-hierarchy |
| `adminConsole.accountProfile.edit()` | edit | `sys.account-profile` | `OrganizationHierarchyComponent.primeAccess` — `canEditAccountProfile` (Edit button on info view) | admin/organization-hierarchy |
| `adminConsole.rootPasswordSecurityLevel.view()` | view | `sys.root-password-security-level` | `NodeSettingsTabComponent.ensureAccess` | admin/organization-hierarchy settings tab |
| `adminConsole.rootPasswordSecurityLevel.edit()` | edit | `sys.root-password-security-level` | same | same |
| `adminConsole.accountPasswordSecurityLevel.edit()` | edit | `sys.account-password-security-level` | same | same |
| `adminConsole.rootAllowedIps.edit()` | edit | `sys.root-allowed-ips` | same | same |
| `adminConsole.accountAllowedIps.edit()` | edit | `sys.account-allowed-ips` | same | same |
| `adminConsole.accountQuota.edit()` | edit | `sys.account-quota` | same | same |
| `adminConsole.services.payment()` | payment | `sys.services` | `comms-hub.primeAccess` (`canDoPayments`) + `marketplace-applications.primeAccess` | admin/comms-hub, marketplace |
| `adminConsole.services.editPriceType()` | edit-price-type | `sys.services` | both | same |
| `adminConsole.services.editPriceValue()` | edit-price-value | `sys.services` | both | same |
| `adminConsole.services.visibility()` | visibility | `sys.services` | both | same |
| `adminConsole.walletStrategy.view()` | view | `sys.wallet-strategy` | `WalletBalanceManagementComponent.primeAccess` (`canViewWalletStrategy`) | admin/wallet-balance-management |
| `adminConsole.walletStrategy.edit()` | edit | `sys.wallet-strategy` | same (`canEditWalletStrategy`, gates Save) | same |
| `adminConsole.masterWallet.view()` | view | `sys.master-wallet` | same (`canViewMasterWallet`, gates Master Wallet card) | same |
| `adminConsole.wallet.transfer()` | transfer | `sys.wallet` | same (`canTransferWallet`, gates Transfer button) | same |

## `managementConsole.*` (28 keys)

| Key path | Action | Resource | Where consumed | Source feature |
|---|---|---|---|---|
| `managementConsole.enter()` | view | `app.management-console` | `managementConsoleGuard` + `shellPrimeAccessGuard` (when userType=2 host) | every mgmt feature, host-shell core |
| `managementConsole.accountHierarchy.view()` | view | `acc.acc-hierarchy` (or similar) | route `data.access` on `organization-hierarchy` + host nav | mgmt/account-administration |
| `managementConsole.account.view()` | view | `acc.account` | `OrganizationHierarchyComponent.primeAccess` — `canViewAccount` | mgmt/account-administration |
| `managementConsole.account.edit()` | edit | `acc.account` | same (`canEditAccount`) | same |
| `managementConsole.organization.view()` | view | `acc.organization` | same (`canViewOrganization`) | same |
| `managementConsole.organization.add()` | add | `acc.organization` | same (`canAddOrganization`) | same |
| `managementConsole.accountUser.add()` | add | `acc.account-user` | same (`canAddAccountUser`) | same |
| `managementConsole.orgUser.add()` | add | `acc.org-user` | same (`canAddOrgUser`) | same |
| `managementConsole.services.view()` | view | `acc.services` | mgmt comm-mgmt + marketplace route `data.access` + container `canViewServices` flag | mgmt/comms-hub, marketplace, account-administration |
| `managementConsole.services.payment()` | payment | `acc.services` | both tab components `primeAccess` (`canDoPayments`) | mgmt/account-administration apps + comm-channels tabs |
| `managementConsole.services.disable()` | disable | `acc.services` | same (`canManageServices` — covers Enable + Disable + Visibility) | same |
| `managementConsole.accountSettings.view()` | view | `acc.account-settings` | settings tab `ensureAccess` | mgmt/account-administration settings tab |
| `managementConsole.accountPasswordSecurityLevel.view()` | view | `acc.account-password-security-level` | settings tab | same |
| `managementConsole.accountPasswordSecurityLevel.edit()` | edit | same resource | settings tab | same |
| `managementConsole.accountAllowedIps.view()` | view | `acc.account-allowed-ips` | settings tab | same |
| `managementConsole.accountAllowedIps.edit()` | edit | same resource | settings tab | same |
| `managementConsole.accountQuota.view()` | view | `acc.account-quota` | settings tab | same |
| `managementConsole.accountQuota.edit()` | edit | same resource | settings tab | same |
| `managementConsole.orgSettings.view()` | view | `acc.org-settings` | settings tab + container | same |
| `managementConsole.users.view()` | view | `acc.users` | container `canViewUsers` | same |
| `managementConsole.contract.view()` | view | `acc.contract` | mgmt contracts route `data.access` (declared but unenforced — no guard) + host nav item | mgmt/contracts-cost-management |
| (Additional 7 keys from mgmt account-administration's 28-total — derived from per-page README: includes view/edit/add variants for users, account-user-edit, accountSettings.edit, orgSettings.edit, allowance keys, etc.) | various | `acc.*` | same | same |

## `contactGroup.*` (9 keys, dual-scope)

> Used by both admin (`'sys'` scope) and mgmt (`'acc'` scope). Factory at `falcon-access.registry.ts:162-171`:
> ```typescript
> type ContactGroupScope = 'sys' | 'acc';
> function contactGroupQuery(action: string, scope: ContactGroupScope): AccessQuery {
>   return { action, resource: `${scope}.contact-group`, attrs: {}, ignoreExpression: true };
> }
> ```

| Key path | Action | Resource (scope-templated) | Where consumed |
|---|---|---|---|
| `contactGroup.view(scope)` | view | `<scope>.contact-group` | list page batch + detail page `canEdit` |
| `contactGroup.create(scope)` | create | same | list page batch |
| `contactGroup.edit(scope)` | edit | same | list page batch + per-row + detail `canEdit` |
| `contactGroup.share(scope)` | share | same | list page batch + per-row Share gate |
| `contactGroup.shareOther(scope)` | share-other | same | per-row Share overlay (own-vs-other) |
| `contactGroup.delete(scope)` | delete | same | list page batch + per-row |
| `contactGroup.downloadValidated(scope)` | download | same | list + detail file-download gate |
| `contactGroup.downloadOriginal(scope)` | download-original | same | list + detail file-download gate |
| `contactGroups.viewShared()` | view-shared | `acc.contact-group` (always) | list page — gates "Shared Groups" tab visibility |

> Note: `contactGroups.viewShared()` returns `resource: 'acc.contact-group'` even when called from admin-console — explicit per registry definition. Whether backend honors `acc.*` for `sys.*` callers is a backend decision.

> Mgmt-side contact-groups uses `'sys'` for admin and would otherwise use `'acc'` for client — but the diff doc confirms both apps use `FalconAccess.contactGroup.*` (cross-app exception to the namespace pattern).

## `userRole.other` (dynamic role-transition family — not enumerable)

- Pattern: `FalconAccess.userRole.other(sourceUserType, targetUserType)`
- Two consumption sites:
  1. **Edit mode** (`user-profile.component.ts:1162-1183`): N queries — one per `(this.originalProfile.roleKey × candidateOption.roleKey)` pair.
  2. **Add mode** (`role-status-step.component.ts:156-181`): for each candidate role, checks if **any** built-in role of the target user-type can transition into it.
- `sourceRoleKeys` comes from `SYSTEM_ROLE_KEYS` (target='system') or `ACCOUNT_ROLE_KEYS` (target='account').
- Decision flag: `roleSelectionEditable` — true when at least one transition is valid; gates role dropdown enablement.

## `authView.*` (Demo)
| Key path | Action | Resource | Where consumed |
|---|---|---|---|
| `authView.view()` | view | `app.auth-view` (likely) | route `data.access` on host `/auth-view` (Demo) — `shellAccessGuard` |

## Dynamic Module-Federation `canMatch` keys

From `apps/host-shell/src/assets/module-federation.manifest.json`. Strings, not factory keys — read directly as `AccessQuery` shape.

| String key | Where used | Remote |
|---|---|---|
| `app.management-console:view` | `canMatch` on `/management-console` route | management_console |
| `app.admin-console:view` | `canMatch` on `/admin-console` route | admin_console |
| `microapp.user-settings:view` | `canMatch` on `/user-settings` (dev only — `active:false` in prod) | External-app |
| `microapp.survey-container:view` | `canMatch` on `/survey-container` (dev only) | mfe-app |

---

## All keys grouped by where they are checked

### Route guards (`canActivate` / `canMatch`)

| Route | Guard | Reads `data.access` |
|---|---|---|
| host `/` (LayoutComponent) | `authGuard`, `shellPrimeAccessGuard` | SHELL_CORE_ACCESS factory picks `adminConsole.enter()` or `managementConsole.enter()` based on `session.userType` |
| host `/auth-view` | `shellAccessGuard` | `FalconAccess.authView.view()` |
| admin-console root | `adminConsoleGuard` | `FalconAccess.adminConsole.enter()` |
| admin `/organization-hierarchy` | `shellAccessGuard` | `FalconAccess.adminConsole.accountHierarchy.view()` |
| admin `/comm-mgmt` | `shellAccessGuard` (no `data.access`) | **(no-op)** |
| admin `/marketplace-applications` | `shellAccessGuard` (no `data.access`) | **(no-op)** |
| admin `/contracts-cost-management` | **none on route** | (inherits parent only) |
| admin `/wallet-balance-management` | `shellAccessGuard` (no `data.access`) | **(no-op)** |
| admin `/testing/charging` | **none on child** | (inherits parent only) |
| admin `/contact-groups` + `/contact-groups/:groupId` | `shellAccessGuard` (no `data.access`) | **(no-op)** |
| mgmt root | `managementConsoleGuard` | `FalconAccess.managementConsole.enter()` |
| mgmt `/organization-hierarchy` | `shellAccessGuard` | `FalconAccess.managementConsole.accountHierarchy.view()` |
| mgmt `/comm-mgmt` | `shellAccessGuard` | `FalconAccess.managementConsole.services.view()` |
| mgmt `/marketplace-applications` | `shellAccessGuard` | `FalconAccess.managementConsole.services.view()` |
| mgmt `/contracts-cost-management` | **none** | declared `data.access: FalconAccess.managementConsole.contract.view()` but unenforced |
| mgmt `/wallet-balance-management` | **none** | (inherits parent only) |
| mgmt `/contact-groups/*` | `shellAccessGuard` on parent (no `data.access`) | **(no-op)** |
| Dynamic remote `/admin-console` `canMatch` | `shellAccessMatchGuard` | `app.admin-console:view` |
| Dynamic remote `/management-console` `canMatch` | `shellAccessMatchGuard` | `app.management-console:view` |

### Component-level gating

Pattern (every consumer): `AccessControlFacade.resolveFlags({ flagName: AccessQuery, ... })` → `Object.assign(this, result)` so flags become `boolean` instance fields. Called from `ngOnInit` (admin/mgmt org-hierarchy + settings tab) or `primeAccess()` (every other feature).

| Feature | # PES checks (component) | Notes |
|---|---|---|
| admin/organization-hierarchy | 8 (2 container, 6 settings tab) | Plus 4 enforced via backend `row.allowedActions` |
| admin/wallet-balance-management | 4 (1 container `primeAccess`) | Plus 1 server-driven `canSave` flag in response |
| admin/comms-hub | 4 (1 container `primeAccess`) | Plus 4 enforced via backend `row.allowedActions` + 1 per-row `canHide` |
| admin/contact-groups | 9 in batch (`loadPermissions()`) | + 1 detail `isCreator` business rule |
| admin/contracts-cost-management | **0** | Page has no PES; entirely on parent guard |
| admin/marketplace-applications | 4 (1 container `primeAccess`) | Plus 4 via backend `row.allowedActions` |
| admin/testing-charging | **0** in-feature | Inherits parent guard only |
| mgmt/account-administration | 10 (container) + 8 (settings tab) + 2 (apps tab) + 2 (comm-channels tab) | 28 total in feature |
| mgmt/contact-groups | 9 in batch | Same set as admin |
| mgmt/comms-hub + marketplace + contracts + wallet | mirror of mgmt account-administration | inherits same batch |
| host/user-profile | dynamic family (N queries per role-transition matrix) | + `isCreator` per-detail |
| host/_core (layout) | 5 (nav item visibility) | Plus 4 `canMatch` checks for dynamic remotes |
| host/dashboard, error, not-found, unauthorized, Demo (most) | **0** | |
| host/auth (login/OTP/forgot) | **0** | Pre-authentication |

---

## Patterns observed

- **Most routes use `data: { access: FalconAccess.X.Y.view() }`** resolved by `shellAccessGuard`, then route-level `adminConsoleGuard`/`managementConsoleGuard` for the app entry.
- **Component-side gating uses `AccessControlFacade.resolveFlags({ ... })`** — batched call, returns plain object assigned to `this` via `Object.assign(this, await this.accessControlFacade.resolveFlags(...))`.
- **Per-row gating uses backend-supplied `row.allowedActions: FalconRowAction[]`** — default-deny pattern. If `allowedActions` is missing/null, no actions show. Combined with component-level PES flags for **double-gate**.
- **`canSave` server-driven override** — `wallet-balance-management` reads `response.result.canSave` and folds it into `isSaveEnabled` getter. Backend can disable Save even when PES grants `walletStrategy.edit`.
- **Defense-in-depth** — host's `shellPrimeAccessGuard` ALREADY validates admin/mgmt entry; the remote-side `adminConsoleGuard`/`managementConsoleGuard` re-validates the same key once the remote loads. Comment in `admin-console.guard.ts:9-12` makes this explicit.
- **Fail-closed** — `AccessControlFacade.resolveFlags` returns all-false on facade error. Combined with `permissionsReady` signal in contact-groups, the skeleton stays visible indefinitely if PES is down.

## Permission gaps + surprises

- **6 admin routes have `shellAccessGuard` declared without `data.access`** — `comm-mgmt`, `marketplace-applications`, `wallet-balance-management`, `contact-groups`, `contact-groups/:groupId` — guard short-circuits to `return true`. Effective gating is in-component.
- **`adminConsole.contracts.*` cluster does NOT exist** in the registry — contracts-cost-management feature has **0 PES checks**, relies entirely on `adminConsoleGuard` (`{action:'view', resource:'app.admin-console'}`). Same for `testing-charging`. Per-page note: "future PES gap".
- **Mgmt `contract.view` declared but unenforced** — `contracts-cost-management` mgmt-side sets `data.access: FalconAccess.managementConsole.contract.view()` but never lists `shellAccessGuard` in `canActivate`.
- **`testing-charging` route inherits only parent guard** — no `shellAccessGuard`, no `data.access`. Falcon-user-only visibility enforced by the sidebar `requiredUserTypes: [FALCON_USER]`, not the router. URL-hack possible but parent guard would still deny non-FALCON users (they lack `app.admin-console:view`).
- **`pes/roles` API bypasses the gateway context** — uses `envConfig.baseURLPes` directly. PES is the lone backend that doesn't go through `useGateway()`.
- **`contactGroups.viewShared()` always returns `resource: 'acc.contact-group'`** even when called from admin — registry definition is hard-coded. Cross-scope quirk.
- **Cross-namespace anomaly** — `contactGroup.*` is the only feature that uses a dedicated module namespace (not `adminConsole.contactGroup` or `managementConsole.contactGroup`). Per the diff doc, both apps use the dedicated namespace with different `scope` arguments.
- **Backend `row.allowedActions` is the authoritative FSM** for service actions — frontend trusts it. UI permission-flag gates only filter the candidates further.
- **`session.identityUserId` is the canonical owner ID** — contact-groups detail explicitly says NEVER compare with `session.subjectId` (Zitadel sub claim). Memory file `feedback_frontend_auth_identity_service.md` codifies this.
