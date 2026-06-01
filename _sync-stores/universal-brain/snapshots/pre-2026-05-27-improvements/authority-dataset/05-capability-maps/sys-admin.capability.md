---
type: capability-map
role: sys-admin
namespace: system
console: admin-console
gateway: SystemGateway
purpose: "Answers 'full page×action×verdict inventory of sys-admin including its largest-in-system role-edit reach'. Open when implementing any admin-console feature for the top Falcon staff role."
total-rows: 67
extracted: 2026-05-16
---

# Capability Map · `sys-admin` — System Administrator

> [!tldr]
> Top Falcon staff role. Lands on `admin-console` only; sees the full org tree (synthetic `Falcon Clients` root) across every tenant. Owns every Falcon-only mutation: Add Client, edit root-password-security, edit root-allowed-IPs, transfer between any wallets, view master wallet, full services payment + price + visibility lifecycle, full contract lifecycle, testing-charging lab. Cannot touch contact-group authoring (read-only + download by design) and cannot land on management-console (no `acc.*` rules — namespace gate denies). Role-edit reach is the largest in the system: can change any other role within both `sys-*` and `acc-*` families.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-admin` |
| Display name (En / Ar) | System Administrator / مدير النظام |
| Namespace | `system` (`eUserType.Falcon` = 1) |
| Test user | `sysadmin` / `sysadmin@falcon.local` / `+962788090501` / `Admin@1234` |
| Role-int | `eUserRoles.SystemAdministrator` = 1 |

`[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:79-112`

## Master capability table

> Columns: Page · Action · PES key checked · Verdict · Source.
> Verdicts: `✅` = explicit allow rule · `❌` = explicit deny rule · `—` = no rule (silent deny in PES).

### App entry

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| admin-console | Land on app | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:85` |
| management-console | Land on app | `app.management-console / view` | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-admin on `acc.*` namespace | `[BRAIN-OUT] sys-admin.md:95` |

### organization-hierarchy (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| organization-hierarchy | Land on page | `sys.acc-hierarchy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:86` |
| organization-hierarchy | View tree (Falcon Clients synthetic root + all tenants) | `sys.acc-hierarchy / view` | ✅ | `[BRAIN-OUT] organization-hierarchy.compare.md:82` |
| organization-hierarchy | View Hierarchy tab (users list) | `sys.acc-hierarchy / view` (always-on when page loads) | ✅ | `[BRAIN-OUT] organization-hierarchy.compare.md:78` |
| organization-hierarchy | View CommChannels & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Apps & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Settings tab | (always enabled — sub-gating inside) | ✅ | `[CODE] node-settings-tab.component.ts:332-345` |
| organization-hierarchy | Add Client (5-step wizard, Falcon-only flow) | `sys.account / add` | ✅ | `[CODE] BuiltInRoleCatalog.cs:87` |
| organization-hierarchy | Add Node (sub-node drawer) | (no separate PES — always in `allowedTreeActions`) | ✅ | `[CODE] organization-hierarchy.component.ts:603-608` |
| organization-hierarchy | Add User (routes to `/profile?mode=add-wizard`) | (no separate PES; backed by `user.role.*` matrix at submit) | ✅ | `[BRAIN-OUT] organization-hierarchy.compare.md:91` |
| organization-hierarchy | Edit Node (rename) | `sys.account-profile / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:88` |
| organization-hierarchy | Edit account profile (Hierarchy tab info view) | `sys.account-profile / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:88` |
| organization-hierarchy | View root-password-security-level | `sys.root-password-security-level / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:89` |
| organization-hierarchy | Edit root-password-security-level | `sys.root-password-security-level / edit` | ✅ **UNIQUE to sys-admin** | `[CODE] BuiltInRoleCatalog.cs:90` |
| organization-hierarchy | Edit account-password-security-level | `sys.account-password-security-level / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:91` |
| organization-hierarchy | Edit root-allowed-IPs | `sys.root-allowed-ips / edit` | ✅ **UNIQUE to sys-admin** | `[CODE] BuiltInRoleCatalog.cs:92` |
| organization-hierarchy | Edit account-allowed-IPs | `sys.account-allowed-ips / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:93` |
| organization-hierarchy | Edit account-quota | `sys.account-quota / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:94` |

### marketplace-applications (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| marketplace-applications | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ | `[BRAIN-OUT] marketplace-applications.compare.md:36` |
| marketplace-applications | Pay service (Activate / Renew) | `sys.services / payment` | ✅ | `[CODE] BuiltInRoleCatalog.cs:95` |
| marketplace-applications | Edit price-type | `sys.services / edit-price-type` | ✅ | `[CODE] BuiltInRoleCatalog.cs:96` |
| marketplace-applications | Edit price-value | `sys.services / edit-price-value` | ✅ | `[CODE] BuiltInRoleCatalog.cs:97` |
| marketplace-applications | Change visibility | `sys.services / visibility` | ✅ | `[CODE] BuiltInRoleCatalog.cs:98` |
| marketplace-applications | Disable (via visibility action) | `sys.services / visibility` | ✅ | `[BRAIN-OUT] marketplace-applications.compare.md:47` |

### comms-hub / comm-mgmt (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| comms-hub | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ | `[BRAIN-OUT] comms-hub.compare.md:37` |
| comms-hub | Pay service | `sys.services / payment` | ✅ | shared `sys.services` from `BuiltInRoleCatalog.cs:95` |
| comms-hub | Edit price-type | `sys.services / edit-price-type` | ✅ | `[CODE] BuiltInRoleCatalog.cs:96` |
| comms-hub | Edit price-value | `sys.services / edit-price-value` | ✅ | `[CODE] BuiltInRoleCatalog.cs:97` |
| comms-hub | Change visibility | `sys.services / visibility` | ✅ | `[CODE] BuiltInRoleCatalog.cs:98` |
| comms-hub | Disable row | `sys.services / visibility` | ✅ | `[BRAIN-OUT] comms-hub.compare.md:48` |

### wallet-balance-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| wallet-balance-management | Land on page | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:85` |
| wallet-balance-management | View Master Wallet card | `sys.master-wallet / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:101` |
| wallet-balance-management | View wallet-strategy (Settings card) | `sys.wallet-strategy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:99` |
| wallet-balance-management | Edit wallet-strategy (currency / distribution / structure) | `sys.wallet-strategy / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:100` |
| wallet-balance-management | Transfer between wallets (Master ↔ CommChannel ↔ Node/User) | `sys.wallet / transfer` | ✅ | `[CODE] BuiltInRoleCatalog.cs:102` |
| wallet-balance-management | Cross-account scope (tree picker) | `sys.acc-hierarchy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:86` |

### contracts-cost-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contracts-cost-management | Land on page | `app.admin-console / view` (no feature-scoped PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |
| contracts-cost-management | List contracts | (no feature PES — backend authz only) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |
| contracts-cost-management | View contract detail | (no feature PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |
| contracts-cost-management | Create contract (4-step wizard) | (no PES; UI gates on `walletStrategy != null`) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |
| contracts-cost-management | Edit contract | (no PES; UI gates on `currentContract.canEdit && canEditContractStatus(status)`) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |
| contracts-cost-management | Pay contract | (no PES — runs through wallet/charging) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:51` |

### contact-groups (admin-console — read-only by design)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contact-groups | Land on page | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:85` |
| contact-groups | View list | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:103` |
| contact-groups | View detail | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:103` |
| contact-groups | Create | `sys.contact-group / create` | ❌ explicit deny — Falcon staff cannot author tenant-owned data | `[CODE] BuiltInRoleCatalog.cs:104` |
| contact-groups | Edit own | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:105` |
| contact-groups | Edit other (someone else's group) | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:105` |
| contact-groups | Delete | `sys.contact-group / delete` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:106` |
| contact-groups | Share | `sys.contact-group / share` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:107` |
| contact-groups | Share-other | `sys.contact-group / share-other` | — no seed rule — silent deny | `[BRAIN-OUT] contact-groups.compare.md:62` |
| contact-groups | View shared (the "Shared Groups" tab) | `acc.contact-group / view-shared` (factory always returns `acc.*` even for admin caller) | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-admin on `acc.*` namespace | `[BRAIN-OUT] contact-groups.compare.md:60`, `[CODE] falcon-access.registry.ts:13-15` |
| contact-groups | Download validated | `sys.contact-group / download` | ✅ | `[CODE] BuiltInRoleCatalog.cs:108` |
| contact-groups | Download original | `sys.contact-group / download-original` | ✅ | `[CODE] BuiltInRoleCatalog.cs:109` |

### testing-charging (admin-only by design)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| testing-charging | See nav link (sidebar) | `requiredUserTypes: [FALCON_USER]` filter | ✅ | `[CODE] apps/host-shell/src/app/layout/layout.component.ts:397-405` |
| testing-charging | Land on page | `app.admin-console / view` (inherited only — no in-feature PES) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:41` |
| testing-charging | View accounts list / overview / wallets / buckets / reservations / ledger | (no PES — feature-flagged backend `TestingCharging` flag) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:41` |
| testing-charging | Create reservation / run WhatsApp simulator / trigger Delivered-Failed callbacks | (no PES — mutates real OCS state) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:41` |

### Role edit (cross-cutting; affects the Add User / Edit User flows on every page)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| (any page with role picker) | Edit own role to sys-admin (no-op, keep) | `user.role.self / set-sys-admin` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Edit own role to sys-ops | `user.role.self / set-sys-ops` | ❌ — self-edit only allowed to keep current role | `[BRAIN-OUT] sys-admin.md:84` |
| (any page with role picker) | Change other sys-ops to sys-admin | `user.role.other / change-sys-ops-to-sys-admin` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Change other sys-products to sys-admin | `user.role.other / change-sys-products-to-sys-admin` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Change other sys-admin to sys-ops | `user.role.other / change-sys-admin-to-sys-ops` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Change other acc-user to acc-owner | `user.role.other / change-acc-user-to-acc-owner` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Change other acc-* role (any → any within acc-*) | `user.role.other / change-acc-X-to-acc-Y` | ✅ | `[CODE] BuiltInRoleCatalog.cs:21-29` |
| (any page with role picker) | Cross-namespace promotion (sys → acc or acc → sys) | `user.role.other / change-sys-X-to-acc-Y` | — silent deny — namespace boundary, no rule generated | `[BRAIN-OUT] sys-admin.md:78` |

## Action highlights

### Unique powers (only this role across all 6 roles)

- ✅ `sys.root-password-security-level / edit` — sys-admin is the **only** role that can change the root-level password policy. `[CODE] BuiltInRoleCatalog.cs:90`, `[BRAIN-OUT] REGISTRY-RAW.md:39`.
- ✅ `sys.root-allowed-ips / edit` — sys-admin is the **only** role that can change the root-level IP allowlist. `[CODE] BuiltInRoleCatalog.cs:92`, `[BRAIN-OUT] REGISTRY-RAW.md:41`.
- ✅ `sys.account-password-security-level / edit` — sys-admin is the **only** role that can change account-level password policy. `[CODE] BuiltInRoleCatalog.cs:91`, `[BRAIN-OUT] REGISTRY-RAW.md:40`.
- ✅ Role-edit reach across BOTH `sys-*` AND `acc-*` families — no other role can change a role in the other namespace. `[CODE] BuiltInRoleCatalog.cs:21-29`.
- ✅ Combination of `sys.account.add` (Add Client) AND `sys.root-*.edit` (root settings) — only sys-admin has both.

### Explicit denies (rule exists with `effect: deny`)

- ❌ `sys.contact-group / create` — Falcon staff cannot author tenant-owned contact groups by design. `[CODE] BuiltInRoleCatalog.cs:104`.
- ❌ `sys.contact-group / edit` — even on contact groups visible to sys-admin. `[CODE] BuiltInRoleCatalog.cs:105`.
- ❌ `sys.contact-group / delete`. `[CODE] BuiltInRoleCatalog.cs:106`.
- ❌ `sys.contact-group / share`. `[CODE] BuiltInRoleCatalog.cs:107`.
- ❌ Self-role-edit to anything other than `sys-admin` (e.g. `set-sys-ops`, `set-acc-owner`) — self-edit matrix only allows keeping current role. `[BRAIN-OUT] sys-admin.md:84`.

### No-rule denies (silent — resource out-of-namespace)

- — `app.management-console / view` — sys-admin has zero rules in the `acc.*` namespace and zero rule for management-console entry. Hidden from `adminConsoleGuard`'s sibling guard. `[BRAIN-OUT] sys-admin.md:95`.
- — All `acc.*` resources (`acc.org-hierarchy`, `acc.account`, `acc.organization`, `acc.account-user`, `acc.org-user`, `acc.services`, `acc.account-settings`, `acc.org-settings`, `acc.users`, `acc.account-profile`, `acc.account-password-security-level`, `acc.account-allowed-ips`, `acc.account-quota`, `acc.contract`) — no rules generated for sys-admin on any of these. `[BRAIN-OUT] REGISTRY-RAW.md:147-150`.
- — `sys.contact-group / share-other` — no seed rule (factory exists, no rule for any sys-* role). `[BRAIN-OUT] contact-groups.compare.md:62`.
- — `acc.contact-group / view-shared` — the `contactGroups.viewShared()` factory always returns `acc.contact-group / view-shared` even when called from admin-console. No sys-* role has a rule for this, so the "Shared Groups" tab is silently hidden on admin side. `[BRAIN-OUT] contact-groups.compare.md:60`, `[CODE] falcon-access.registry.ts:13-15`.
- — Wave 1.3.0 keys not yet seeded: `sys.user.add`, `sys.user-permission-group.assign`, `sys.user-profile-picture.upload`. Registry lists them but `BuiltInRoleCatalog.cs` has no rules yet. `[BRAIN-OUT] REGISTRY-RAW.md:52-54`.

## Role-edit reach

> Who this role can promote / demote, by namespace. Cite: `[CODE] BuiltInRoleCatalog.cs:21-29` (sys-admin block of `BuiltInRoleCatalog`).

| Target user's current role | Destinations sys-admin can move them to |
|---|---|
| `sys-admin` | sys-admin, sys-ops, sys-products |
| `sys-ops` | sys-admin, sys-ops, sys-products |
| `sys-products` | sys-admin, sys-ops, sys-products |
| `acc-owner` | acc-owner, acc-admin, acc-user |
| `acc-admin` | acc-owner, acc-admin, acc-user |
| `acc-user` | acc-owner, acc-admin, acc-user |

**Sys-admin can change any role to any role within the SAME namespace family.** Cannot cross from `sys-*` to `acc-*` or vice-versa (cross-namespace is structurally impossible — no rule exists in `BuiltInRoleCatalog.cs`). `[BRAIN-OUT] REGISTRY-RAW.md:127`.

## Cross-references

- Role note: `[BRAIN-OUT] 01-roles/sys-admin.md`
- PES key registry: `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md`
- Feature parity matrix: `[BRAIN-OUT] 04-feature-parity-matrix/MATRIX.md`
- Feature compares: `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md`, `marketplace-applications.compare.md`, `comms-hub.compare.md`, `wallet-balance-management.compare.md`, `contracts-cost-management.compare.md`, `contact-groups.compare.md`, `testing-charging.compare.md`
- Status enums: `[BRAIN-OUT] 02-statuses/`
- Sibling roles (same namespace): `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md`, `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md`
- Seed source: `[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:79-112` (sys-admin block); `:21-29` (sys-admin role-edit matrix)
- Identity enum: `[CODE] Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs:18` (`eUserRoles.SystemAdministrator = 1`)
- Seed script: `[CODE] Falcon/falcon-essentials/zitadel/seed-test-users.sh:265`
