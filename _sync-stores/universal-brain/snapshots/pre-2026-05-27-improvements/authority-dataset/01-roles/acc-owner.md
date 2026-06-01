---
type: role
role-key: acc-owner
role-name-en: Account Owner
role-name-ar: مالك الحساب
namespace: <tenant-id>
user-type: Client
user-type-int: 2
role-int: 4
app-entry: management-console
console: management-console
gateway: CoreGateway
test-user: accowner / accowner@falcon.local / +962788090504 / Admin@1234 / test-tenant-001
purpose: "Answers 'what can acc-owner do + which PES rules grant it'. Open when implementing or auditing any management-console feature gated by the tenant Account-Owner role."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:171-210
---

# Role · `acc-owner` — Account Owner

> [!tldr]
> Tenant's top role. Full management-console access: org-hierarchy CRUD (add organization + add users), account/profile/IP/quota/contract view & edit, services payment & disable, contact-group full CRUD + share, role-edit reach across all acc-*. Cannot see admin-console.

## Identity

| Field | Value |
|---|---|
| Role key | `acc-owner` |
| Display name (En) | Account Owner |
| Display name (Ar) | مالك الحساب |
| Namespace | the tenant id (e.g. `test-tenant-001`) |
| User type | `eUserType.Client` = 2 |
| Role int | `eUserRoles.AccountOwner` = 4 |
| App entry | `app.management-console` |
| Console mounted | `management-console` (`:4301`) |
| Default gateway | `Gateway.CoreGateway` (`:7038`) |
| Test user (seeded) | `accowner` / `accowner@falcon.local` / `+962788090504` / `Admin@1234` / tenant `test-tenant-001` |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` |
| Role-policy subject | `r:acc-owner@<tenant-id>` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:177-210`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.management-console` | view | ✅ allow | Lands on mgmt-console |
| `app.admin-console` | view | ❌ deny | **Cannot see Falcon admin** |
| `acc.org-hierarchy` | view | ✅ allow | Tenant org tree |
| `acc.account` | view | ✅ allow | |
| `acc.account` | edit | ✅ allow | |
| `acc.organization` | view | ✅ allow | |
| `acc.organization` | add | ✅ allow | **Add sub-organization (node)** |
| `acc.account-user` | add | ✅ allow | **Add Account-level user** (delta vs acc-admin) |
| `acc.org-user` | add | ✅ allow | Add Organization-level user |
| `acc.services` | view | ✅ allow | |
| `acc.services` | payment | ✅ allow | |
| `acc.services` | disable | ✅ allow | |
| `acc.account-settings` | view | ✅ allow | |
| `acc.org-settings` | view | ✅ allow | |
| `acc.users` | view | ✅ allow | |
| `acc.account-profile` | view | ✅ allow | |
| `acc.account-profile` | edit | ✅ allow | |
| `acc.account-password-security-level` | view | ✅ allow | |
| `acc.account-password-security-level` | edit | ✅ allow | |
| `acc.account-allowed-ips` | view | ✅ allow | |
| `acc.account-allowed-ips` | edit | ✅ allow | |
| `acc.account-quota` | view | ✅ allow | |
| `acc.account-quota` | edit | ✅ allow | |
| `acc.contract` | view | ✅ allow | |
| `acc.contact-group` | view | ✅ allow | |
| `acc.contact-group` | create | ✅ allow | |
| `acc.contact-group` | edit | ✅ allow (expr) | `"r.obj.createdby" == "r.sub.userid"` — only own |
| `acc.contact-group` | delete | ✅ allow (expr) | only own |
| `acc.contact-group` | share | ✅ allow | |
| `acc.contact-group` | download | ✅ allow | |
| `acc.contact-group` | download-original | ✅ allow | |

## Role-edit matrix

Source: `BuiltInRoleCatalog.cs:48-56`

`acc-owner` can edit:
- All `acc-*` roles (full reach: acc-owner / acc-admin / acc-user — any current → any target)
- **Cannot** edit any `sys-*` (cross-namespace promotion is impossible)

## What is unique to this role (vs other acc-*)

- ✅ `acc.account-user.add` — only role with this permission.
- ✅ `acc.services.*` (view / payment / disable) — only acc-owner gets it.
- ✅ `acc.account-profile.edit` — only acc-owner.
- ✅ `acc.account-password-security-level.*` (view + edit) — only acc-owner.
- ✅ `acc.account-allowed-ips.*` (view + edit) — only acc-owner.
- ✅ `acc.account-quota.*` (view + edit) — only acc-owner.
- ✅ `acc.contract.view` — only acc-owner.
- Full role-edit reach across acc-*.

## What acc-owner canNOT do

- ❌ Land on admin-console (`app.admin-console.view` = deny).
- ❌ See any `sys.*` resource (no rule).
- ❌ Edit `sys-*` user roles.
- ❌ Edit contact groups created by others (expression-gated).

## Cross-references

- Compare with [[acc-admin]] · [[acc-user]]
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Tenant `p`-rule template → `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json`
- Test login curl → `07-cross-cutting/test-users.md`
