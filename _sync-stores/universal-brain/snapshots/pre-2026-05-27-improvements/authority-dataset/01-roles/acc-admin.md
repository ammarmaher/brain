---
type: role
role-key: acc-admin
role-name-en: Node Admin
role-name-ar: مشرف الإدارة
namespace: <tenant-id>
user-type: Client
user-type-int: 2
role-int: 5
app-entry: management-console
console: management-console
gateway: CoreGateway
test-user: accadmin / accadmin@falcon.local / +962788090505 / Admin@1234 / test-tenant-001
purpose: "Answers 'what can acc-admin do + which PES rules grant/deny it'. Open when implementing or auditing any management-console feature gated by the tenant Node-Admin role."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:211-248
---

# Role · `acc-admin` — Node Admin

> [!tldr]
> Tenant's middle-tier role. Org hierarchy view + add organizations + add org-users + edit account. **Explicitly DENIED**: services, account-profile-edit, password-security, IP-allowed, quota, contract. Effectively "node-level CRUD without ownership". Contact-group: create + share + own-edit. Cannot edit acc-owner role.

## Identity

| Field | Value |
|---|---|
| Role key | `acc-admin` |
| Display name (En) | Node Admin |
| Display name (Ar) | مشرف الإدارة |
| Namespace | the tenant id (e.g. `test-tenant-001`) |
| User type | `eUserType.Client` = 2 |
| Role int | `eUserRoles.NodeAdmin` = 5 |
| App entry | `app.management-console` |
| Console mounted | `management-console` (`:4301`) |
| Default gateway | `Gateway.CoreGateway` (`:7038`) |
| Test user (seeded) | `accadmin` / `accadmin@falcon.local` / `+962788090505` / `Admin@1234` / tenant `test-tenant-001` |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` |
| Role-policy subject | `r:acc-admin@<tenant-id>` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:217-248`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.management-console` | view | ✅ allow | |
| `app.admin-console` | view | ❌ deny | |
| `acc.org-hierarchy` | view | ✅ allow | |
| `acc.account` | view | ✅ allow | |
| `acc.account` | edit | ✅ allow | |
| `acc.organization` | view | ✅ allow | |
| `acc.organization` | add | ✅ allow | |
| `acc.org-user` | add | ✅ allow | Add Organization-level user |
| `acc.account-user` | add | — | **(no rule — silent deny; delta vs acc-owner)** |
| `acc.services` | view | ❌ deny | **Explicitly denied** |
| `acc.services` | payment | ❌ deny | |
| `acc.services` | disable | ❌ deny | |
| `acc.account-settings` | view | ✅ allow | |
| `acc.org-settings` | view | ✅ allow | |
| `acc.users` | view | ✅ allow | |
| `acc.account-profile` | edit | ❌ deny | **Explicitly denied** |
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
| `acc.contact-group` | share | ✅ allow | |
| `acc.contact-group` | download | ✅ allow | |
| `acc.contact-group` | download-original | ✅ allow | |

## Role-edit matrix

Source: `BuiltInRoleCatalog.cs:57-65`

`acc-admin` can edit:
- `acc-admin` → `acc-admin` or `acc-user` only
- `acc-user` → `acc-admin` or `acc-user` only
- **Cannot** edit `acc-owner` (no targets)
- **Cannot** edit any `sys-*` (cross-namespace)

This means acc-admin can demote another acc-admin to acc-user or promote acc-user up to acc-admin — but never touches acc-owner.

## What is unique to this role

- The middle tier — has `acc.users.view` and can manage org-users, but not account-users.
- The contact-group permissions are the same as acc-user/acc-owner (`create / share / own-edit-delete`).
- Has `acc.org-settings.view` and `acc.account-settings.view`.

## What acc-admin canNOT do

- ❌ See / pay / disable services.
- ❌ Edit account profile.
- ❌ View OR edit account password-security, allowed-IPs, or quota.
- ❌ View contracts.
- ❌ Add account-user (only org-user).
- ❌ Promote / demote acc-owner.
- ❌ Land on admin-console.

## Cross-references

- Compare with [[acc-owner]] · [[acc-user]]
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Test login curl → `07-cross-cutting/test-users.md`
