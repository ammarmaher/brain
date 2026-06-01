---
type: capability-map
role: sys-ops
namespace: system
console: admin-console
gateway: SystemGateway
purpose: "Answers 'full inventory of sys-ops — only 4 mutating rules (root-password view-only, account-IP edit, contact-group view+download)'. Open before assuming any admin-console feature works for sys-ops."
total-rows: 67
extracted: 2026-05-16
---

# Capability Map · `sys-ops` — System Operation

> [!tldr]
> Falcon staff role focused on technical operations (IPs / firewall ops). Lands on `admin-console` and sees the full org tree, but the **vast majority of actions silent-deny** because `BuiltInRoleCatalog.cs:113-134` only seeds 4 mutating rules: `sys.root-password-security-level/view` (read-only), `sys.account-allowed-ips/edit`, plus the `sys.contact-group` view+download set. Sys-ops cannot create accounts, cannot edit account profiles, cannot touch services / wallets / contracts. Role-edit reach is restricted: can only keep its own role (sys-ops → sys-ops) on sys-* side; full reach on acc-* side.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-ops` |
| Display name (En / Ar) | System Operation / إدارة العمليات التقنية |
| Namespace | `system` (`eUserType.Falcon` = 1) |
| Test user | `sysops` / `sysops@falcon.local` / `+962788090502` / `Admin@1234` |
| Role-int | `eUserRoles.Operation` = 3 |

`[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:113-134`

## Master capability table

> Columns: Page · Action · PES key checked · Verdict · Source.
> Verdicts: `✅` = explicit allow rule · `❌` = explicit deny rule · `—` = no rule (silent deny in PES).

### App entry

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| admin-console | Land on app | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:118` |
| management-console | Land on app | `app.management-console / view` | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-ops on `acc.*` namespace | `[BRAIN-OUT] sys-ops.md:59-67` |

### organization-hierarchy (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| organization-hierarchy | Land on page | `sys.acc-hierarchy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:119` |
| organization-hierarchy | View tree (Falcon Clients root + all tenants) | `sys.acc-hierarchy / view` | ✅ | `[BRAIN-OUT] organization-hierarchy.compare.md:92` |
| organization-hierarchy | View Hierarchy tab (users list) | `sys.acc-hierarchy / view` | ✅ | always-on when page loads |
| organization-hierarchy | View CommChannels & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ — tab visible but row-level actions empty | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Apps & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ — tab visible but row-level actions empty | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Settings tab | (always enabled — sub-gating inside) | ✅ | `[CODE] node-settings-tab.component.ts:332-345` |
| organization-hierarchy | Add Client (5-step wizard) | `sys.account / add` | — silent deny — no rule in BuiltInRoleCatalog.cs:113-134 | `[BRAIN-OUT] sys-ops.md:60` |
| organization-hierarchy | Add Node | (no separate PES — `allowedTreeActions` always includes for admin-console) | ✅ | `[CODE] organization-hierarchy.component.ts:603-608` |
| organization-hierarchy | Add User (routes to `/profile?mode=add-wizard`) | (no separate PES; backed by `user.role.*` matrix at submit) | ✅ but limited by role-edit reach (sys-ops cannot create sys-admin / sys-products) | `[BRAIN-OUT] organization-hierarchy.compare.md:92` |
| organization-hierarchy | Edit Node (rename) | `sys.account-profile / edit` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:61` |
| organization-hierarchy | Edit account profile | `sys.account-profile / edit` | — silent deny | `[BRAIN-OUT] sys-ops.md:61` |
| organization-hierarchy | View root-password-security-level | `sys.root-password-security-level / view` | ✅ — **can see, cannot change** | `[CODE] BuiltInRoleCatalog.cs:120` |
| organization-hierarchy | Edit root-password-security-level | `sys.root-password-security-level / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:121` |
| organization-hierarchy | Edit account-password-security-level | `sys.account-password-security-level / edit` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:62` |
| organization-hierarchy | Edit root-allowed-IPs | `sys.root-allowed-ips / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:122` |
| organization-hierarchy | Edit account-allowed-IPs | `sys.account-allowed-ips / edit` | ✅ **UNIQUE delta — only sys-ops allowed for account-IPs without root-IPs** | `[CODE] BuiltInRoleCatalog.cs:123` |
| organization-hierarchy | Edit account-quota | `sys.account-quota / edit` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:63` |

### marketplace-applications (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| marketplace-applications | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ but page is functionally read-only | `[BRAIN-OUT] marketplace-applications.compare.md:48` |
| marketplace-applications | Pay service | `sys.services / payment` | — silent deny — no rule on `sys.services.*` for sys-ops | `[BRAIN-OUT] sys-ops.md:64` |
| marketplace-applications | Edit price-type | `sys.services / edit-price-type` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| marketplace-applications | Edit price-value | `sys.services / edit-price-value` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| marketplace-applications | Change visibility | `sys.services / visibility` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| marketplace-applications | Disable row | `sys.services / visibility` | — silent deny | `[BRAIN-OUT] marketplace-applications.compare.md:48` |

### comms-hub / comm-mgmt (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| comms-hub | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ functionally read-only | `[BRAIN-OUT] comms-hub.compare.md:49` |
| comms-hub | Pay service | `sys.services / payment` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| comms-hub | Edit price-type | `sys.services / edit-price-type` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| comms-hub | Edit price-value | `sys.services / edit-price-value` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| comms-hub | Change visibility | `sys.services / visibility` | — silent deny | `[BRAIN-OUT] sys-ops.md:64` |
| comms-hub | Disable row | `sys.services / visibility` | — silent deny | `[BRAIN-OUT] comms-hub.compare.md:49` |

### wallet-balance-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| wallet-balance-management | Land on page | `app.admin-console / view` | ✅ — but every wallet flag is false, so page becomes a read-only tree browser | `[BRAIN-OUT] wallet-balance-management.compare.md:52` |
| wallet-balance-management | View Master Wallet card | `sys.master-wallet / view` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:66` |
| wallet-balance-management | View wallet-strategy | `sys.wallet-strategy / view` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:65` |
| wallet-balance-management | Edit wallet-strategy | `sys.wallet-strategy / edit` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:65` |
| wallet-balance-management | Transfer between wallets | `sys.wallet / transfer` | — silent deny — no rule | `[BRAIN-OUT] sys-ops.md:67` |
| wallet-balance-management | Cross-account scope (tree picker) | `sys.acc-hierarchy / view` | ✅ — tree visible; just no actionable per-row buttons | `[CODE] BuiltInRoleCatalog.cs:119` |

### contracts-cost-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contracts-cost-management | Land on page | `app.admin-console / view` (no feature-scoped PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:52` |
| contracts-cost-management | List contracts | (no feature PES — feature has zero PBAC) | ✅ — but wallet-strategy not editable, so Add disabled | `[BRAIN-OUT] contracts-cost-management.compare.md:52` |
| contracts-cost-management | View contract detail | (no feature PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:52` |
| contracts-cost-management | Create contract | (no PES; UI gates on `walletStrategy != null`) | ✅ at PBAC layer — practically blocked because sys-ops cannot configure wallet-strategy | `[BRAIN-OUT] contracts-cost-management.compare.md:52, 60` |
| contracts-cost-management | Edit contract | (no PES; UI gates on `currentContract.canEdit && status`) | ✅ at PBAC layer | `[BRAIN-OUT] contracts-cost-management.compare.md:52` |
| contracts-cost-management | Pay contract | (no PES — runs through wallet/charging) | ✅ at PBAC; practically blocked (no wallet-transfer) | `[BRAIN-OUT] contracts-cost-management.compare.md:60` |

### contact-groups (admin-console — read-only by design, same as other sys-*)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contact-groups | Land on page | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:118` |
| contact-groups | View list | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:124` |
| contact-groups | View detail | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:124` |
| contact-groups | Create | `sys.contact-group / create` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:125` |
| contact-groups | Edit own | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:126` |
| contact-groups | Edit other | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:126` |
| contact-groups | Delete | `sys.contact-group / delete` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:127` |
| contact-groups | Share | `sys.contact-group / share` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:128` |
| contact-groups | Share-other | `sys.contact-group / share-other` | — no seed rule — silent deny | `[BRAIN-OUT] contact-groups.compare.md:62` |
| contact-groups | View shared (the "Shared Groups" tab) | `acc.contact-group / view-shared` (factory always returns `acc.*`) | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-ops on `acc.*` namespace | `[BRAIN-OUT] contact-groups.compare.md:60`, `[CODE] falcon-access.registry.ts:13-15` |
| contact-groups | Download validated | `sys.contact-group / download` | ✅ | `[CODE] BuiltInRoleCatalog.cs:129` |
| contact-groups | Download original | `sys.contact-group / download-original` | ✅ | `[CODE] BuiltInRoleCatalog.cs:130` |

### testing-charging (admin-only by design — all sys-* have identical access)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| testing-charging | See nav link (sidebar) | `requiredUserTypes: [FALCON_USER]` filter | ✅ | `[CODE] apps/host-shell/src/app/layout/layout.component.ts:397-405` |
| testing-charging | Land on page | `app.admin-console / view` (inherited only — no in-feature PES) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:42` |
| testing-charging | View accounts / overview / wallets / buckets / reservations / ledger / balances / commit-records | (no PES) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:42` |
| testing-charging | Create reservation / run WhatsApp simulator / trigger callbacks | (no PES — mutates real OCS state) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:42` |

### Role edit

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| (any page with role picker) | Edit own role to sys-ops (keep) | `user.role.self / set-sys-ops` | ✅ | `[CODE] BuiltInRoleCatalog.cs:30-38` |
| (any page with role picker) | Edit own role to sys-admin | `user.role.self / set-sys-admin` | ❌ self-edit only allows keeping current role | `[BRAIN-OUT] REGISTRY-RAW.md:118-119` |
| (any page with role picker) | Change other sys-admin to sys-ops | `user.role.other / change-sys-admin-to-sys-ops` | ❌ no rule generated — sys-ops cannot touch sys-admin | `[BRAIN-OUT] sys-ops.md:77` |
| (any page with role picker) | Change other sys-products to sys-ops | `user.role.other / change-sys-products-to-sys-ops` | ❌ no rule — sys-ops cannot touch sys-products | `[BRAIN-OUT] sys-ops.md:77` |
| (any page with role picker) | Change other sys-ops to sys-ops (no-op confirm) | `user.role.other / change-sys-ops-to-sys-ops` | ✅ | `[CODE] BuiltInRoleCatalog.cs:30-38` |
| (any page with role picker) | Change other acc-user to acc-owner | `user.role.other / change-acc-user-to-acc-owner` | ✅ — full acc-* reach | `[CODE] BuiltInRoleCatalog.cs:30-38` |
| (any page with role picker) | Change other acc-* (any → any within acc-*) | `user.role.other / change-acc-X-to-acc-Y` | ✅ | `[CODE] BuiltInRoleCatalog.cs:30-38` |
| (any page with role picker) | Cross-namespace promotion (sys → acc or acc → sys) | `user.role.other / change-sys-X-to-acc-Y` | — silent deny — no cross-namespace rule | `[BRAIN-OUT] REGISTRY-RAW.md:128` |

## Action highlights

### Unique powers (this role only across all 6 roles)

- ✅ `sys.account-allowed-ips / edit` WITHOUT `sys.root-allowed-ips / edit` — sys-ops is the **only** role with this asymmetry (sys-admin has both; sys-products has neither). The "IP / firewall ops" persona. `[CODE] BuiltInRoleCatalog.cs:122-123`, `[BRAIN-OUT] sys-ops.md:80-82`.
- ✅ `sys.root-password-security-level / view` WITHOUT `sys.root-password-security-level / edit` — read-only oversight role; sys-admin has both, sys-products has neither. `[CODE] BuiltInRoleCatalog.cs:120-121`.

### Explicit denies (rule exists with `effect: deny`)

- ❌ `sys.root-password-security-level / edit`. `[CODE] BuiltInRoleCatalog.cs:121`.
- ❌ `sys.root-allowed-ips / edit`. `[CODE] BuiltInRoleCatalog.cs:122`.
- ❌ `sys.contact-group / create`. `[CODE] BuiltInRoleCatalog.cs:125`.
- ❌ `sys.contact-group / edit`. `[CODE] BuiltInRoleCatalog.cs:126`.
- ❌ `sys.contact-group / delete`. `[CODE] BuiltInRoleCatalog.cs:127`.
- ❌ `sys.contact-group / share`. `[CODE] BuiltInRoleCatalog.cs:128`.
- ❌ Self-role-edit to any role other than `sys-ops`. `[BRAIN-OUT] REGISTRY-RAW.md:118-119`.

### No-rule denies (silent — most of sys-ops' deny surface)

Sys-ops has the **largest silent-deny surface** of any sys-* role — almost every Falcon-staff mutation is silent-denied because no rule was seeded:

- — `sys.account / add` — cannot create accounts (Add Client wizard hidden). `[BRAIN-OUT] sys-ops.md:60`.
- — `sys.account-profile / edit` — cannot edit any node profile. `[BRAIN-OUT] sys-ops.md:61`.
- — `sys.account-password-security-level / edit` — only sys-admin has this. `[BRAIN-OUT] sys-ops.md:62`.
- — `sys.account-quota / edit` — only sys-admin + sys-products. `[BRAIN-OUT] sys-ops.md:63`.
- — `sys.services / *` — all 4 actions (payment, edit-price-type, edit-price-value, visibility) silent-deny for sys-ops. `[BRAIN-OUT] sys-ops.md:64`.
- — `sys.wallet-strategy / view` AND `sys.wallet-strategy / edit` — Settings card hidden. `[BRAIN-OUT] sys-ops.md:65`.
- — `sys.master-wallet / view` — Master Wallet card hidden. `[BRAIN-OUT] sys-ops.md:66`.
- — `sys.wallet / transfer` — Transfer buttons disabled. `[BRAIN-OUT] sys-ops.md:67`.
- — `app.management-console / view` — out-of-namespace; cannot land on Client console. `[BRAIN-OUT] sys-ops.md:59-67`.
- — All `acc.*` resources (cross-namespace). `[BRAIN-OUT] REGISTRY-RAW.md:147-150`.
- — `sys.contact-group / share-other` — no seed rule for any sys-* role. `[BRAIN-OUT] contact-groups.compare.md:62`.
- — `acc.contact-group / view-shared` — Shared Groups tab silently hidden on admin side. `[BRAIN-OUT] contact-groups.compare.md:60`.
- — Role-edit on `sys-admin` and `sys-products` users. `[BRAIN-OUT] sys-ops.md:77`.
- — Wave 1.3.0 keys not yet seeded: `sys.user.add`, `sys.user-permission-group.assign`, `sys.user-profile-picture.upload`. `[BRAIN-OUT] REGISTRY-RAW.md:52-54`.

## Role-edit reach

> Who this role can promote / demote, by namespace. Cite: `[CODE] BuiltInRoleCatalog.cs:30-38` (sys-ops block of `BuiltInRoleCatalog`).

| Target user's current role | Destinations sys-ops can move them to |
|---|---|
| `sys-admin` | (none — no rule generated) |
| `sys-ops` | sys-ops only (keep current role) |
| `sys-products` | (none — no rule generated) |
| `acc-owner` | acc-owner, acc-admin, acc-user |
| `acc-admin` | acc-owner, acc-admin, acc-user |
| `acc-user` | acc-owner, acc-admin, acc-user |

**Sys-ops can edit acc-* fully but only sys-ops can keep their own role on the sys-* side.** Cannot promote / demote `sys-admin` or `sys-products`, cannot cross to `acc-*` namespace as a promotion target either. `[BRAIN-OUT] sys-ops.md:73-78`.

## Cross-references

- Role note: `[BRAIN-OUT] 01-roles/sys-ops.md`
- PES key registry: `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md`
- Feature parity matrix: `[BRAIN-OUT] 04-feature-parity-matrix/MATRIX.md`
- Feature compares: `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md`, `marketplace-applications.compare.md`, `comms-hub.compare.md`, `wallet-balance-management.compare.md`, `contracts-cost-management.compare.md`, `contact-groups.compare.md`, `testing-charging.compare.md`
- Status enums: `[BRAIN-OUT] 02-statuses/`
- Sibling roles (same namespace): `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md`, `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md`
- Seed source: `[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:113-134` (sys-ops block); `:30-38` (sys-ops role-edit matrix)
- Identity enum: `[CODE] Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs` (`eUserRoles.Operation = 3`)
- Seed script: `[CODE] Falcon/falcon-essentials/zitadel/seed-test-users.sh` (provisions `sysops`)
