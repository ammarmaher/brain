---
type: role
role-key: acc-user
role-name-en: Normal User
role-name-ar: مستخدم
namespace: <tenant-id>
user-type: Client
user-type-int: 2
role-int: 6
app-entry: management-console
console: management-console
gateway: CoreGateway
test-user: accuser / accuser@falcon.local / +962788090506 / Admin@1234 / test-tenant-001
purpose: "Answers 'what can acc-user do (only contact-group + view-shared) + which PES rules deny everything else'. Open when implementing minimum-privilege gates or contact-group view-shared logic."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:249-290
---

# Role · `acc-user` — Normal User

> [!tldr]
> Tenant's minimum-privilege role. **Contact-group feature only** — everything else denied (org-hierarchy view, account, organization, services, settings, users, contract). Has the unique `view-shared` permission. Cannot edit any role.

## Identity

| Field | Value |
|---|---|
| Role key | `acc-user` |
| Display name (En) | Normal User |
| Display name (Ar) | مستخدم |
| Namespace | the tenant id (e.g. `test-tenant-001`) |
| User type | `eUserType.Client` = 2 |
| Role int | `eUserRoles.NormalUser` = 6 |
| App entry | `app.management-console` |
| Console mounted | `management-console` (`:4301`) |
| Default gateway | `Gateway.CoreGateway` (`:7038`) |
| Test user (seeded) | `accuser` / `accuser@falcon.local` / `+962788090506` / `Admin@1234` / tenant `test-tenant-001` |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` |
| Role-policy subject | `r:acc-user@<tenant-id>` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:255-289`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.management-console` | view | ✅ allow | |
| `app.admin-console` | view | ❌ deny | |
| `acc.org-hierarchy` | view | ❌ deny | **Cannot see the tree** |
| `acc.account` | view | ❌ deny | |
| `acc.account` | edit | ❌ deny | |
| `acc.organization` | view | ❌ deny | |
| `acc.organization` | add | ❌ deny | |
| `acc.account-user` | add | ❌ deny | |
| `acc.org-user` | add | ❌ deny | |
| `acc.services` | view | ❌ deny | |
| `acc.services` | payment | ❌ deny | |
| `acc.services` | disable | ❌ deny | |
| `acc.account-settings` | view | ❌ deny | |
| `acc.org-settings` | view | ❌ deny | |
| `acc.users` | view | ❌ deny | |
| `acc.account-profile` | view | ❌ deny | |
| `acc.account-profile` | edit | ❌ deny | |
| `acc.account-password-security-level` | view | ❌ deny | |
| `acc.account-password-security-level` | edit | ❌ deny | |
| `acc.account-allowed-ips` | view | ❌ deny | |
| `acc.account-allowed-ips` | edit | ❌ deny | |
| `acc.account-quota` | view | ❌ deny | |
| `acc.account-quota` | edit | ❌ deny | |
| `acc.contract` | view | ❌ deny | |
| `acc.contact-group` | view | ✅ allow | |
| `acc.contact-group` | create | ✅ allow | |
| `acc.contact-group` | edit | ✅ allow (expr) | own-only |
| `acc.contact-group` | delete | ✅ allow (expr) | own-only |
| `acc.contact-group` | share | ✅ allow (expr) | **own-only — tighter than acc-admin / acc-owner** |
| `acc.contact-group` | download | ✅ allow | |
| `acc.contact-group` | download-original | ✅ allow | |
| `acc.contact-group` | view-shared | ✅ allow | **Unique to acc-user** — see groups shared with them |

## Role-edit matrix

Source: `BuiltInRoleCatalog.cs:66-74`

`acc-user` can edit **NOTHING**:
- Every target (`sys-*`, `acc-*`) → empty list.
- Even self-edit is denied (`set-acc-user` for `acc-user` = allow per BuildSelfRoleEditPolicies, but every other `set-*` is deny).

Effectively: acc-user can confirm their own role but cannot change anyone (including themselves) to a different role.

## What is unique to this role

- ✅ `acc.contact-group.view-shared` — **only role with this**.
- ✅ `acc.contact-group.share` has an `expression` constraint (own-only) — tighter than acc-owner/acc-admin.
- The narrowest permission footprint of all 6 roles.

## What acc-user canNOT do

- ❌ See the org-hierarchy tree.
- ❌ See accounts / organizations / services / users / contracts.
- ❌ Edit any role (including self).
- ❌ Land on admin-console.

## Why this matters for UI

When `acc-user` logs in, the management-console must render a **contact-groups-only view**:
- Org-hierarchy tree → hidden.
- Account-administration menu → hidden.
- Wallet / contracts → hidden.
- Marketplace / comms-hub / contracts-cost-management → likely hidden (no rule = deny).
- Contact Groups page → fully functional with their own + shared visibility.

## Cross-references

- Compare with [[acc-owner]] · [[acc-admin]]
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Tenant `p`-rule template → `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json`
- Test login curl → `07-cross-cutting/test-users.md`
