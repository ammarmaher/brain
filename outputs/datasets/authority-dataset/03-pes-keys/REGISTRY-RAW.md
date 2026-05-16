---
type: registry
title: PES Key Registry (full universe)
purpose: "Answers 'what is the full universe of PES keys the FE can produce + which role passes each'. Open when adding a new gated feature, auditing PES coverage, or verifying a key exists before using it."
source-file: Falcon/falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts
extracted: 2026-05-16
total-factory-methods: 47
---

# PES Key Registry — full universe

> [!tldr]
> Every PES key the frontend can produce. 47 factory methods over 7 top-level namespaces. Resource taxonomy: `sys.*` (Falcon-only), `acc.*` (Client-only), `app.*` (app-entry gates), `user.role.{self|other}` (role-edit matrix), `microapp.*` (dynamic), plus 3 unscoped general keys (`dashboard`, `auth_view`, `user_profile`).

## Top-level namespaces

| Namespace | Resource prefix | Owner | Count |
|---|---|---|---|
| `dashboard` | `dashboard` | Shared | 1 |
| `authView` | `auth_view` | Shared | 1 |
| `userProfile` | `user_profile` | Shared | 1 |
| `contactGroups` | `acc.contact-group` | Shared (view-shared only) | 1 |
| `contactGroup` | `${scope}.contact-group` | Shared with scope arg | 8 methods × 2 scopes = 16 keys |
| `userRole` | `user.role.{self,other}` | Shared (role-edit matrix) | 2 (dynamic) |
| `managementConsole` | `acc.*` + `app.management-console` | Client | 21 |
| `adminConsole` | `sys.*` + `app.admin-console` | Falcon | 20 (incl. Wave 1.3.0 Add-User additions) |
| `microApps` | `microapp.<name>` | Shared (dynamic) | 1 (factory) |

## adminConsole namespace (Falcon)

Source: `falcon-access.registry.ts:89-145`

| Path | Action | Resource | Who can pass |
|---|---|---|---|
| `adminConsole.enter` | view | `app.admin-console` | sys-admin · sys-ops · sys-products |
| `adminConsole.accountHierarchy.view` | view | `sys.acc-hierarchy` | sys-admin · sys-ops · sys-products |
| `adminConsole.account.add` | add | `sys.account` | sys-admin · sys-products |
| `adminConsole.accountProfile.edit` | edit | `sys.account-profile` | sys-admin · sys-products |
| `adminConsole.rootPasswordSecurityLevel.view` | view | `sys.root-password-security-level` | sys-admin · sys-ops |
| `adminConsole.rootPasswordSecurityLevel.edit` | edit | `sys.root-password-security-level` | **only sys-admin** |
| `adminConsole.accountPasswordSecurityLevel.edit` | edit | `sys.account-password-security-level` | **only sys-admin** |
| `adminConsole.rootAllowedIps.edit` | edit | `sys.root-allowed-ips` | **only sys-admin** |
| `adminConsole.accountAllowedIps.edit` | edit | `sys.account-allowed-ips` | sys-admin · sys-ops |
| `adminConsole.accountQuota.edit` | edit | `sys.account-quota` | sys-admin · sys-products |
| `adminConsole.services.payment` | payment | `sys.services` | sys-admin · sys-products |
| `adminConsole.services.editPriceType` | edit-price-type | `sys.services` | sys-admin · sys-products |
| `adminConsole.services.editPriceValue` | edit-price-value | `sys.services` | sys-admin · sys-products |
| `adminConsole.services.visibility` | visibility | `sys.services` | sys-admin · sys-products |
| `adminConsole.walletStrategy.view` | view | `sys.wallet-strategy` | sys-admin · sys-products |
| `adminConsole.walletStrategy.edit` | edit | `sys.wallet-strategy` | sys-admin · sys-products |
| `adminConsole.masterWallet.view` | view | `sys.master-wallet` | sys-admin · sys-products |
| `adminConsole.wallet.transfer` | transfer | `sys.wallet` | sys-admin · sys-products |
| `adminConsole.user.add` | add | `sys.user` | (Wave 1.3.0 — not in seed catalog yet) |
| `adminConsole.userPermissionGroup.assign` | assign | `sys.user-permission-group` | (Wave 1.3.0) |
| `adminConsole.userProfilePicture.upload` | upload | `sys.user-profile-picture` | (Wave 1.3.0) |

## managementConsole namespace (Client)

Source: `falcon-access.registry.ts:36-88`

| Path | Action | Resource | Who can pass |
|---|---|---|---|
| `managementConsole.enter` | view | `app.management-console` | acc-owner · acc-admin · acc-user |
| `managementConsole.accountHierarchy.view` | view | `acc.org-hierarchy` | acc-owner · acc-admin |
| `managementConsole.account.view` | view | `acc.account` | acc-owner · acc-admin |
| `managementConsole.account.edit` | edit | `acc.account` | acc-owner · acc-admin |
| `managementConsole.organization.view` | view | `acc.organization` | acc-owner · acc-admin |
| `managementConsole.organization.add` | add | `acc.organization` | acc-owner · acc-admin |
| `managementConsole.accountUser.add` | add | `acc.account-user` | **only acc-owner** |
| `managementConsole.orgUser.add` | add | `acc.org-user` | acc-owner · acc-admin |
| `managementConsole.services.view` | view | `acc.services` | **only acc-owner** |
| `managementConsole.services.payment` | payment | `acc.services` | **only acc-owner** |
| `managementConsole.services.disable` | disable | `acc.services` | **only acc-owner** |
| `managementConsole.accountSettings.view` | view | `acc.account-settings` | acc-owner · acc-admin |
| `managementConsole.orgSettings.view` | view | `acc.org-settings` | acc-owner · acc-admin |
| `managementConsole.users.view` | view | `acc.users` | acc-owner · acc-admin |
| `managementConsole.accountProfile.view` | view | `acc.account-profile` | **only acc-owner** |
| `managementConsole.accountProfile.edit` | edit | `acc.account-profile` | **only acc-owner** |
| `managementConsole.accountPasswordSecurityLevel.view` | view | `acc.account-password-security-level` | **only acc-owner** |
| `managementConsole.accountPasswordSecurityLevel.edit` | edit | `acc.account-password-security-level` | **only acc-owner** |
| `managementConsole.accountAllowedIps.view` | view | `acc.account-allowed-ips` | **only acc-owner** |
| `managementConsole.accountAllowedIps.edit` | edit | `acc.account-allowed-ips` | **only acc-owner** |
| `managementConsole.accountQuota.view` | view | `acc.account-quota` | **only acc-owner** |
| `managementConsole.accountQuota.edit` | edit | `acc.account-quota` | **only acc-owner** |
| `managementConsole.contract.view` | view | `acc.contract` | **only acc-owner** |

## contactGroup namespace (Shared via scope arg)

Source: `falcon-access.registry.ts:13-25, 175-184`

Factory: `FalconAccess.contactGroup.<action>(scope: 'sys' | 'acc')` → `{ action, resource: \`${scope}.contact-group\` }`

| Action | sys (Falcon) | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|
| `view` | ✅ all sys-* | ✅ | ✅ | ✅ |
| `create` | ❌ all sys-* | ✅ | ✅ | ✅ |
| `edit` | ❌ | ✅ own only | ✅ own only | ✅ own only |
| `share` (factory) | ❌ | ✅ | ✅ | ✅ own only |
| `share-other` (factory) | ❌ | (no seed rule) | (no seed rule) | (no seed rule) |
| `delete` | ❌ | ✅ own only | ✅ own only | ✅ own only |
| `download` (= `downloadValidated`) | ✅ | ✅ | ✅ | ✅ |
| `download-original` (= `downloadOriginal`) | ✅ | ✅ | ✅ | ✅ |
| `view-shared` (separate `contactGroups.viewShared`) | — | — | — | ✅ (only acc-user) |

> Reminder: `FalconAccess.contactGroup` (singular) returns scope-aware queries via factory. `FalconAccess.contactGroups.viewShared` (plural) is hardcoded to `acc.contact-group` `view-shared`.

## userRole namespace (Role-Edit Matrix)

Source: `falcon-access.registry.ts:26-35` + `BuiltInRoleCatalog.cs:18-75`

Two factories, both dynamic:
- `FalconAccess.userRole.self(targetRoleKey)` → `{ action: 'set-<targetRoleKey>', resource: 'user.role.self' }`
- `FalconAccess.userRole.other(currentRoleKey, targetRoleKey)` → `{ action: 'change-<current>-to-<target>', resource: 'user.role.other' }`

### Self-edit (set-X)

A user can only set themselves to their own current role:
- `sys-admin` → can set self to sys-admin only.
- `sys-ops` → can set self to sys-ops only.
- … (and so on for every role)

### Other-edit matrix (change-X-to-Y)

Cited from `BuiltInRoleCatalog.cs:18-75`:

| Actor ↓ \\ Target (current → destination) | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|---|
| `sys-admin` | ✅ to any sys-* | ✅ to any sys-* | ✅ to any sys-* | ✅ to any acc-* | ✅ to any acc-* | ✅ to any acc-* |
| `sys-ops` | ❌ | ✅ to sys-ops only | ❌ | ✅ to any acc-* | ✅ to any acc-* | ✅ to any acc-* |
| `sys-products` | ❌ | ❌ | ✅ to sys-products only | ✅ to any acc-* | ✅ to any acc-* | ✅ to any acc-* |
| `acc-owner` | ❌ | ❌ | ❌ | ✅ to any acc-* | ✅ to any acc-* | ✅ to any acc-* |
| `acc-admin` | ❌ | ❌ | ❌ | ❌ | ✅ to acc-admin or acc-user | ✅ to acc-admin or acc-user |
| `acc-user` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Reading the matrix: row = actor (who is changing someone's role). Column = the target user's current role. Cell = which destinations the actor can move them to.

## Unscoped / general

| Path | Action | Resource |
|---|---|---|
| `dashboard.view` | view | `dashboard` |
| `authView.view` | view | `auth_view` |
| `userProfile.view` | view | `user_profile` |
| `microApps.mount(name)` | view | `microapp.<normalized-name>` |

## Resource taxonomy summary

| Prefix | Owner | Examples |
|---|---|---|
| `sys.*` | Falcon-only — only sys-* roles get rules | `sys.acc-hierarchy`, `sys.account`, `sys.services`, `sys.wallet`, `sys.master-wallet` |
| `acc.*` | Client-only — only acc-* roles get rules | `acc.org-hierarchy`, `acc.account`, `acc.organization`, `acc.services`, `acc.contract` |
| `app.*` | App-entry gate — both consoles | `app.admin-console`, `app.management-console` |
| `user.role.*` | Role-edit matrix — all roles | `user.role.self`, `user.role.other` |
| `microapp.*` | Dynamic micro-app — all roles | `microapp.<name>` |
| (unscoped) | Shared general | `dashboard`, `auth_view`, `user_profile` |

## How the FE consumes this

```typescript
// Example: gate "Add Client" button
const canAddAccount = await accessControlFacade.can(FalconAccess.adminConsole.account.add());
// → returns true iff a g-rule connects the JWT.sub user to a role whose p-rules
//   grant ("sys.account", "add", "allow").
```

`AccessControlFacade.resolveFlags({...})` bulk-resolves many queries at once and is the canonical pattern (see [[../01-roles/_INDEX]] for which roles answer which queries).

## See also

- [[adminConsole]] — per-feature breakdown
- [[managementConsole]] — per-feature breakdown
- [[contactGroup]] — scope-aware semantics
- [[userRole-matrix]] — actor × target × destination 3D matrix
- [[../01-roles/_INDEX]] — every role lists its permissions
