---
type: role
role-key: sys-admin
role-name-en: System Administrator
role-name-ar: مدير النظام
namespace: system
user-type: Falcon
user-type-int: 1
role-int: 1
app-entry: admin-console
console: admin-console
gateway: SystemGateway
test-user: sysadmin / sysadmin@falcon.local / +962788090501 / Admin@1234
purpose: "Answers 'what can sys-admin do + which PES rules grant it'. Open when implementing or auditing any admin-console feature gated by the top Falcon staff role."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:79-112
---

# Role · `sys-admin` — System Administrator

> [!tldr]
> Top Falcon staff role. Full platform control: view account hierarchy, create new accounts, edit profiles/IPs/quotas/services, transfer wallet, view (not modify) all contact groups. Sits at the top of the role-edit matrix — can change any other role.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-admin` |
| Display name (En) | System Administrator |
| Display name (Ar) | مدير النظام |
| Namespace | `system` |
| User type | `eUserType.Falcon` = 1 |
| Role int | `eUserRoles.SystemAdministrator` = 1 |
| App entry | `app.admin-console` |
| Console mounted | `admin-console` (`:4204`) |
| Default gateway | `Gateway.SystemGateway` (`:7256`) |
| Test user (seeded) | `sysadmin` / `sysadmin@falcon.local` / `+962788090501` / `Admin@1234` |
| Policy subject template | `u:<ZitadelUserId>@system` |
| Role-policy subject | `r:sys-admin@system` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:85-112`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.admin-console` | view | ✅ allow | Lands on admin-console root |
| `sys.acc-hierarchy` | view | ✅ allow | See the org tree |
| `sys.account` | add | ✅ allow | **Can create new client accounts (Add Client wizard)** |
| `sys.account-profile` | edit | ✅ allow | Edit any node profile |
| `sys.root-password-security-level` | view | ✅ allow | Only role with this |
| `sys.root-password-security-level` | edit | ✅ allow | **Only role with this** |
| `sys.account-password-security-level` | edit | ✅ allow | |
| `sys.root-allowed-ips` | edit | ✅ allow | **Only role with this** |
| `sys.account-allowed-ips` | edit | ✅ allow | |
| `sys.account-quota` | edit | ✅ allow | |
| `sys.services` | payment | ✅ allow | Pay for any client's service |
| `sys.services` | edit-price-type | ✅ allow | |
| `sys.services` | edit-price-value | ✅ allow | |
| `sys.services` | visibility | ✅ allow | |
| `sys.wallet-strategy` | view | ✅ allow | |
| `sys.wallet-strategy` | edit | ✅ allow | |
| `sys.master-wallet` | view | ✅ allow | |
| `sys.wallet` | transfer | ✅ allow | **Move funds between wallets** |
| `sys.contact-group` | view | ✅ allow | Read-only access |
| `sys.contact-group` | create | ❌ deny | Falcon staff cannot author contact groups |
| `sys.contact-group` | edit | ❌ deny | |
| `sys.contact-group` | delete | ❌ deny | |
| `sys.contact-group` | share | ❌ deny | |
| `sys.contact-group` | download | ✅ allow | |
| `sys.contact-group` | download-original | ✅ allow | |

## Role-edit matrix (who this role can edit)

Source: `BuiltInRoleCatalog.cs:21-29`

`sys-admin` can change ANY role to ANY role (within the same namespace family):
- For sys users currently being any of `sys-admin / sys-ops / sys-products` → can set them to any of `sys-admin / sys-ops / sys-products`.
- For acc users currently being any of `acc-owner / acc-admin / acc-user` → can set them to any of `acc-owner / acc-admin / acc-user`.
- **Cannot** promote a sys user to an acc role or vice-versa (cross-namespace promotion is impossible).

PES actions generated (sample):
- `user.role.other / change-sys-ops-to-sys-admin` → allow
- `user.role.other / change-acc-user-to-acc-owner` → allow
- `user.role.self / set-sys-admin` → allow (can keep own role)
- `user.role.self / set-sys-ops` → deny (cannot demote/promote self away from sys-admin)

## What is unique to this role (vs other sys-*)

- ✅ `sys.root-password-security-level.edit` — only sys-admin.
- ✅ `sys.root-allowed-ips.edit` — only sys-admin.
- ✅ Full role-edit reach across BOTH sys-* AND acc-* role families.

## What sys-admin canNOT do

- ❌ Create / edit / delete / share contact groups (download is OK).
- ❌ See `acc.*` resources at all (admin-console hides them — `app.management-console.view` = deny by absence).
- ❌ Promote a sys user to acc or vice-versa.

## Where this role appears in code

- **Backend (seed)**: `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:79`.
- **Identity enum**: `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs:18` (`eUserRoles.SystemAdministrator = 1`).
- **Seed script**: `Falcon/falcon-essentials/zitadel/seed-test-users.sh:265` (provisions `sysadmin`).

## Cross-references

- Status enums → `02-statuses/`
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Falcon-only features → `04-feature-parity-matrix/MATRIX.md`
- Other sys-* roles → [[sys-ops]], [[sys-products]]
- Test login curl → `07-cross-cutting/test-users.md`
