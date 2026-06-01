---
type: moc
cluster: 100-Authority
title: PES Keys — full registry (47 factories)
projection-source: _mounts/brain-outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md
code-source: Falcon/falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts
verified-at: 2026-05-16
purpose: "Answers 'what are the 47 PES key factories + 7 namespaces + resource prefix taxonomy (sys.*, acc.*, app.*, etc.)'. Open before adding/using any PES key."
---

> [!tldr]
> 47 PES key factory methods over 7 namespaces. Resource taxonomy: `sys.*` (Falcon-only), `acc.*` (Client-only), `app.*` (app-entry gates), `user.role.{self,other}` (role-edit matrix), `microapp.*` (dynamic), plus 3 unscoped general keys.

# PES Keys

## Namespaces

| Namespace | Resource prefix | Owner | Count |
|---|---|---|---|
| `dashboard` | `dashboard` | Shared | 1 |
| `authView` | `auth_view` | Shared | 1 |
| `userProfile` | `user_profile` | Shared | 1 |
| `contactGroups` | `acc.contact-group` | Shared (`view-shared` only) | 1 |
| `contactGroup` | `${scope}.contact-group` | Shared with scope arg (`sys` \| `acc`) | 8 actions × 2 scopes |
| `userRole` | `user.role.{self,other}` | Shared (role-edit matrix) | 2 (dynamic) |
| `managementConsole` | `acc.*` + `app.management-console` | Client | 21 |
| `adminConsole` | `sys.*` + `app.admin-console` | Falcon | 20 |
| `microApps` | `microapp.<name>` | Shared (dynamic factory) | 1 |

## adminConsole keys (Falcon-only)

| Resource | Action(s) | Restricted to |
|---|---|---|
| `app.admin-console` | view | sys-* |
| `sys.acc-hierarchy` | view | sys-* |
| `sys.account` | add | sys-admin, sys-products |
| `sys.account-profile` | edit | sys-admin, sys-products |
| `sys.root-password-security-level` | view / edit | view: sys-admin+sys-ops · edit: **only sys-admin** |
| `sys.account-password-security-level` | edit | **only sys-admin** |
| `sys.root-allowed-ips` | edit | **only sys-admin** |
| `sys.account-allowed-ips` | edit | sys-admin, sys-ops |
| `sys.account-quota` | edit | sys-admin, sys-products |
| `sys.services` | payment / edit-price-type / edit-price-value / visibility | sys-admin, sys-products |
| `sys.wallet-strategy` | view / edit | sys-admin, sys-products |
| `sys.master-wallet` | view | sys-admin, sys-products |
| `sys.wallet` | transfer | sys-admin, sys-products |
| `sys.user` (Wave 1.3.0) | add | (no seed catalog yet) |
| `sys.user-permission-group` (Wave 1.3.0) | assign | (no seed catalog yet) |
| `sys.user-profile-picture` (Wave 1.3.0) | upload | (no seed catalog yet) |

## managementConsole keys (Client-only)

| Resource | Action(s) | Restricted to |
|---|---|---|
| `app.management-console` | view | acc-* |
| `acc.org-hierarchy` | view | acc-owner, acc-admin |
| `acc.account` | view / edit | acc-owner, acc-admin |
| `acc.organization` | view / add | acc-owner, acc-admin |
| `acc.account-user` | add | **only acc-owner** |
| `acc.org-user` | add | acc-owner, acc-admin |
| `acc.services` | view / payment / disable | **only acc-owner** (acc-admin/user explicitly **deny**) |
| `acc.account-settings` | view | acc-owner, acc-admin |
| `acc.org-settings` | view | acc-owner, acc-admin |
| `acc.users` | view | acc-owner, acc-admin |
| `acc.account-profile` | view / edit | **only acc-owner** |
| `acc.account-password-security-level` | view / edit | **only acc-owner** |
| `acc.account-allowed-ips` | view / edit | **only acc-owner** |
| `acc.account-quota` | view / edit | **only acc-owner** |
| `acc.contract` | view | **only acc-owner** |

## Contact group (scope-aware shared)

| Action | sys callers | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|
| view | ✅ | ✅ | ✅ | ✅ |
| create | ❌ all sys-* | ✅ | ✅ | ✅ |
| edit | ❌ | ✅ own | ✅ own | ✅ own |
| share | ❌ | ✅ | ✅ | ✅ own |
| delete | ❌ | ✅ own | ✅ own | ✅ own |
| download | ✅ | ✅ | ✅ | ✅ |
| download-original | ✅ | ✅ | ✅ | ✅ |
| view-shared | — | — | — | ✅ |

## How FE consumes a PES key

```typescript
// Bulk-resolve many queries to a flag map (canonical pattern)
const flags = await accessControlFacade.resolveFlags({
  canAddAccount: FalconAccess.adminConsole.account.add(),
  canEditAccountProfile: FalconAccess.adminConsole.accountProfile.edit(),
});
// flags.canAddAccount === true iff JWT.sub has a g-rule → role with allow on sys.account/add
```

## Full registry

Drill into [Brain Outputs / REGISTRY-RAW.md](../_mounts/brain-outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md) for the comprehensive table with action × resource × allowed-roles per key.

## See also

- [[Roles]] — who passes which key
- [[Falcon-vs-Client]] — which feature uses which keys
- [[Session-Shape]] — how the policy subject is built
- [[PES-Subject-Contract]] — non-negotiable subject rule
