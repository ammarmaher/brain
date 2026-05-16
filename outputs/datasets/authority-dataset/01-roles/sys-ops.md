---
type: role
role-key: sys-ops
role-name-en: System Operation
role-name-ar: إدارة العمليات التقنية
namespace: system
user-type: Falcon
user-type-int: 1
role-int: 3
app-entry: admin-console
console: admin-console
gateway: SystemGateway
test-user: sysops / sysops@falcon.local / +962788090502 / Admin@1234
purpose: "Answers 'what can sys-ops do (restricted: hierarchy view, IP edits on non-root only) + which PES rules deny the rest'. Open when gating any admin-console technical-operations feature."
source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:113-134
---

# Role · `sys-ops` — System Operation

> [!tldr]
> Falcon staff role for technical operations. Restricted: hierarchy view, password security view (no edit), IP edits ONLY on accounts (not root). Cannot create accounts. Cannot touch services, wallets, or root-level settings. Role-edit reach limited to other sys-ops and any acc-*.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-ops` |
| Display name (En) | System Operation |
| Display name (Ar) | إدارة العمليات التقنية |
| Namespace | `system` |
| User type | `eUserType.Falcon` = 1 |
| Role int | `eUserRoles.Operation` = 3 |
| App entry | `app.admin-console` |
| Console mounted | `admin-console` (`:4204`) |
| Default gateway | `Gateway.SystemGateway` (`:7256`) |
| Test user (seeded) | `sysops` / `sysops@falcon.local` / `+962788090502` / `Admin@1234` |
| Policy subject template | `u:<ZitadelUserId>@system` |
| Role-policy subject | `r:sys-ops@system` |

## Permissions matrix (seed `p`-rules)

Source: `BuiltInRoleCatalog.cs:118-134`

| Resource | Action | Effect | Notes |
|---|---|---|---|
| `app.admin-console` | view | ✅ allow | |
| `sys.acc-hierarchy` | view | ✅ allow | |
| `sys.root-password-security-level` | view | ✅ allow | Can SEE root password policy |
| `sys.root-password-security-level` | edit | ❌ deny | Cannot CHANGE it |
| `sys.root-allowed-ips` | edit | ❌ deny | Cannot edit root IPs |
| `sys.account-allowed-ips` | edit | ✅ allow | **Only delta vs sys-admin: explicitly allowed for account-level IPs** |
| `sys.contact-group` | view | ✅ allow | |
| `sys.contact-group` | create | ❌ deny | |
| `sys.contact-group` | edit | ❌ deny | |
| `sys.contact-group` | delete | ❌ deny | |
| `sys.contact-group` | share | ❌ deny | |
| `sys.contact-group` | download | ✅ allow | |
| `sys.contact-group` | download-original | ✅ allow | |

**Important: NO rule defined** for the resources below — silent deny in PES:
- `sys.account.add` (cannot create accounts)
- `sys.account-profile.edit`
- `sys.account-password-security-level.edit`
- `sys.account-quota.edit`
- `sys.services.*` (payment / edit-price-type / edit-price-value / visibility)
- `sys.wallet-strategy.*`
- `sys.master-wallet.view`
- `sys.wallet.transfer`

## Role-edit matrix

Source: `BuiltInRoleCatalog.cs:30-38`

`sys-ops` can edit only:
- `sys-ops` → `sys-ops` (keep own role)
- All `acc-*` (full reach: any current → any target within acc-owner/acc-admin/acc-user)

**Cannot** edit `sys-admin` or `sys-products` (returns empty target list).

## What is unique to this role

- The ONLY sys-* role that has `sys.account-allowed-ips.edit` explicitly allowed but NOT `sys.root-allowed-ips.edit`.
- Effectively the "IP/firewall ops" persona.

## What sys-ops canNOT do (delta vs sys-admin)

- ❌ Add new accounts.
- ❌ Edit account profiles, quotas, or password-security at account level.
- ❌ Edit ROOT password-security-level (view OK).
- ❌ Edit ROOT allowed-ips.
- ❌ Any service action.
- ❌ Wallet-strategy, master-wallet, wallet-transfer.
- ❌ Promote/demote sys-admin or sys-products.

## Cross-references

- Compare with [[sys-admin]] · [[sys-products]]
- PES key universe → `03-pes-keys/REGISTRY-RAW.md`
- Test login curl → `07-cross-cutting/test-users.md`
