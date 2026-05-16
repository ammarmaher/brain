---
type: role
role-key: sys-products
role-name-en: Products
role-name-ar: المشتريات
namespace: system
user-type: Falcon
user-type-int: 1
role-int: 2
app-entry: admin-console
console: admin-console
gateway: SystemGateway
test-user: sysprod / sysprod@falcon.local / +962788090503 / Admin@1234
purpose: "Answers 'what can sys-products do (commercial: services, wallet-transfer, master-wallet) + which PES rules grant/deny it'. Open when implementing admin-console commercial features."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:135-167
---

# Role · `sys-products` — Products

> [!tldr]
> Falcon staff role for service/product/wallet management. Owns the commercial side: add accounts, edit quota, full services (payment / price / visibility), full wallet-strategy + master-wallet + wallet-transfer. Cannot touch root-password-security or IP edits.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-products` |
| Display name (En) | Products |
| Display name (Ar) | المشتريات |
| Namespace | `system` |
| User type | `eUserType.Falcon` = 1 |
| Role int | `eUserRoles.Product` = 2 |
| App entry | `app.admin-console` |
| Console mounted | `admin-console` (`:4204`) |
| Default gateway | `Gateway.SystemGateway` (`:7256`) |
| Test user (seeded) | `sysprod` / `sysprod@falcon.local` / `+962788090503` / `Admin@1234` |
| Policy subject template | `u:<ZitadelUserId>@system` |
| Role-policy subject | `r:sys-products@system` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:140-166`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.admin-console` | view | ✅ allow | |
| `sys.acc-hierarchy` | view | ✅ allow | |
| `sys.account` | add | ✅ allow | **Can create accounts** (delta vs sys-ops) |
| `sys.account-profile` | edit | ✅ allow | |
| `sys.root-password-security-level` | view | ❌ deny | **Stricter than sys-ops** (which has view) |
| `sys.root-password-security-level` | edit | ❌ deny | |
| `sys.root-allowed-ips` | edit | ❌ deny | |
| `sys.account-quota` | edit | ✅ allow | |
| `sys.services` | payment | ✅ allow | |
| `sys.services` | edit-price-type | ✅ allow | |
| `sys.services` | edit-price-value | ✅ allow | |
| `sys.services` | visibility | ✅ allow | |
| `sys.wallet-strategy` | view | ✅ allow | |
| `sys.wallet-strategy` | edit | ✅ allow | |
| `sys.master-wallet` | view | ✅ allow | |
| `sys.wallet` | transfer | ✅ allow | **Can transfer wallet balances** |
| `sys.contact-group` | view | ✅ allow | |
| `sys.contact-group` | create | ❌ deny | |
| `sys.contact-group` | edit | ❌ deny | |
| `sys.contact-group` | delete | ❌ deny | |
| `sys.contact-group` | share | ❌ deny | |
| `sys.contact-group` | download | ✅ allow | |
| `sys.contact-group` | download-original | ✅ allow | |

No rule (silent deny):
- `sys.account-password-security-level.edit`
- `sys.account-allowed-ips.edit`

## Role-edit matrix

Source: `BuiltInRoleCatalog.cs:39-47`

`sys-products` can edit only:
- `sys-products` → `sys-products` (keep own role)
- All `acc-*` (full reach within acc family)

**Cannot** edit `sys-admin` or `sys-ops`.

## What is unique to this role

- The "commercial admin" persona — full services + wallet + master-wallet + transfer.
- Can add accounts (unlike sys-ops).
- Stricter than sys-ops on password-security (denied both view AND edit).

## What sys-products canNOT do

- ❌ View OR edit root-password-security-level.
- ❌ Edit allowed-IPs (root or account).
- ❌ Promote/demote sys-admin or sys-ops.
- ❌ Create/edit/delete/share contact groups (download is OK).
- ❌ Edit account-password-security-level (silent deny — no rule).

## Cross-references

- Compare with [[sys-admin]] · [[sys-ops]]
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Test login curl → `07-cross-cutting/test-users.md`
