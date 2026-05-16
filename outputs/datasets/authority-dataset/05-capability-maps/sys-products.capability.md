---
type: capability-map
role: sys-products
namespace: system
console: admin-console
gateway: SystemGateway
purpose: "Answers 'full inventory of sys-products — the Falcon commercial admin (services lifecycle, wallet-strategy, master-wallet, contract lifecycle, stricter than sys-ops on root-password)'. Open before any commercial-side admin work."
total-rows: 67
extracted: 2026-05-16
---

# Capability Map · `sys-products` — Products

> [!tldr]
> Falcon staff "commercial admin" persona. Lands on `admin-console` and owns the full revenue side: Add Client, account-profile edit, account-quota edit, full `sys.services.*` lifecycle (payment / price-type / price-value / visibility), full `sys.wallet-strategy.*` (view + edit), Master Wallet view, wallet transfer between any wallets, and the full contract lifecycle. **Stricter than sys-ops on root-password-security-level** (sys-ops can view it; sys-products cannot even view). Cannot edit any IPs (root or account). Cannot author contact groups (sys-* shared rule). Role-edit reach: only sys-products → sys-products (keep) on sys-* side; full reach on acc-* side.

## Identity

| Field | Value |
|---|---|
| Role key | `sys-products` |
| Display name (En / Ar) | Products / المشتريات |
| Namespace | `system` (`eUserType.Falcon` = 1) |
| Test user | `sysprod` / `sysprod@falcon.local` / `+962788090503` / `Admin@1234` |
| Role-int | `eUserRoles.Product` = 2 |

`[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:135-167`

## Master capability table

> Columns: Page · Action · PES key checked · Verdict · Source.
> Verdicts: `✅` = explicit allow rule · `❌` = explicit deny rule · `—` = no rule (silent deny in PES).

### App entry

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| admin-console | Land on app | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:140` |
| management-console | Land on app | `app.management-console / view` | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-products on `acc.*` namespace | `[BRAIN-OUT] sys-products.md:69-71` |

### organization-hierarchy (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| organization-hierarchy | Land on page | `sys.acc-hierarchy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:141` |
| organization-hierarchy | View tree (Falcon Clients root + all tenants) | `sys.acc-hierarchy / view` | ✅ | `[BRAIN-OUT] organization-hierarchy.compare.md:93` |
| organization-hierarchy | View Hierarchy tab (users list) | `sys.acc-hierarchy / view` | ✅ | always-on when page loads |
| organization-hierarchy | View CommChannels & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Apps & Services tab | (node-shape: `!isFalcon && isMain`) | ✅ | `[CODE] organization-hierarchy.component.ts:571-602` |
| organization-hierarchy | View Settings tab | (always enabled — sub-gating inside) | ✅ | `[CODE] node-settings-tab.component.ts:332-345` |
| organization-hierarchy | Add Client (5-step wizard, Falcon-only flow) | `sys.account / add` | ✅ | `[CODE] BuiltInRoleCatalog.cs:142` |
| organization-hierarchy | Add Node | (no separate PES — always in `allowedTreeActions`) | ✅ | `[CODE] organization-hierarchy.component.ts:603-608` |
| organization-hierarchy | Add User (routes to `/profile?mode=add-wizard`) | (no separate PES; backed by `user.role.*` matrix at submit) | ✅ but limited by role-edit reach (cannot create sys-admin / sys-ops) | `[BRAIN-OUT] organization-hierarchy.compare.md:93` |
| organization-hierarchy | Edit Node (rename) | `sys.account-profile / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:143` |
| organization-hierarchy | Edit account profile (Hierarchy tab info view) | `sys.account-profile / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:143` |
| organization-hierarchy | View root-password-security-level | `sys.root-password-security-level / view` | ❌ explicit deny — **stricter than sys-ops** | `[CODE] BuiltInRoleCatalog.cs:144` |
| organization-hierarchy | Edit root-password-security-level | `sys.root-password-security-level / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:145` |
| organization-hierarchy | Edit account-password-security-level | `sys.account-password-security-level / edit` | — silent deny — no rule in BuiltInRoleCatalog.cs:135-167 | `[BRAIN-OUT] sys-products.md:70` |
| organization-hierarchy | Edit root-allowed-IPs | `sys.root-allowed-ips / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:146` |
| organization-hierarchy | Edit account-allowed-IPs | `sys.account-allowed-ips / edit` | — silent deny — no rule (sys-ops has this; sys-products doesn't) | `[BRAIN-OUT] sys-products.md:71` |
| organization-hierarchy | Edit account-quota | `sys.account-quota / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:147` |

### marketplace-applications (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| marketplace-applications | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ | `[BRAIN-OUT] marketplace-applications.compare.md:49` |
| marketplace-applications | Pay service (Activate / Renew) | `sys.services / payment` | ✅ | `[CODE] BuiltInRoleCatalog.cs:148` |
| marketplace-applications | Edit price-type | `sys.services / edit-price-type` | ✅ | `[CODE] BuiltInRoleCatalog.cs:149` |
| marketplace-applications | Edit price-value | `sys.services / edit-price-value` | ✅ | `[CODE] BuiltInRoleCatalog.cs:150` |
| marketplace-applications | Change visibility | `sys.services / visibility` | ✅ | `[CODE] BuiltInRoleCatalog.cs:151` |
| marketplace-applications | Disable row (via visibility action) | `sys.services / visibility` | ✅ | `[BRAIN-OUT] marketplace-applications.compare.md:49` |

### comms-hub / comm-mgmt (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| comms-hub | Land on page | `app.admin-console / view` (no in-component route gate) | ✅ | `[BRAIN-OUT] comms-hub.compare.md:50` |
| comms-hub | Pay service | `sys.services / payment` | ✅ | `[CODE] BuiltInRoleCatalog.cs:148` |
| comms-hub | Edit price-type | `sys.services / edit-price-type` | ✅ | `[CODE] BuiltInRoleCatalog.cs:149` |
| comms-hub | Edit price-value | `sys.services / edit-price-value` | ✅ | `[CODE] BuiltInRoleCatalog.cs:150` |
| comms-hub | Change visibility | `sys.services / visibility` | ✅ | `[CODE] BuiltInRoleCatalog.cs:151` |
| comms-hub | Disable row | `sys.services / visibility` | ✅ | `[BRAIN-OUT] comms-hub.compare.md:50` |

### wallet-balance-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| wallet-balance-management | Land on page | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:140` |
| wallet-balance-management | View Master Wallet card | `sys.master-wallet / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:154` |
| wallet-balance-management | View wallet-strategy (Settings card) | `sys.wallet-strategy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:152` |
| wallet-balance-management | Edit wallet-strategy (currency / distribution / structure) | `sys.wallet-strategy / edit` | ✅ | `[CODE] BuiltInRoleCatalog.cs:153` |
| wallet-balance-management | Transfer between wallets (Master ↔ CommChannel ↔ Node/User) | `sys.wallet / transfer` | ✅ | `[CODE] BuiltInRoleCatalog.cs:155` |
| wallet-balance-management | Cross-account scope (tree picker) | `sys.acc-hierarchy / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:141` |

### contracts-cost-management (admin-console)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contracts-cost-management | Land on page | `app.admin-console / view` (no feature-scoped PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53` |
| contracts-cost-management | List contracts | (no feature PES — feature has zero PBAC) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53` |
| contracts-cost-management | View contract detail | (no feature PES) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53` |
| contracts-cost-management | Create contract (4-step wizard) | (no PES; UI gates on `walletStrategy != null` — sys-products owns wallet-strategy edit, so eligible) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53, 60` |
| contracts-cost-management | Edit contract | (no PES; UI gates on `currentContract.canEdit && canEditContractStatus(status)`) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53` |
| contracts-cost-management | Pay contract | (no PES — runs through wallet/charging) | ✅ | `[BRAIN-OUT] contracts-cost-management.compare.md:53` |

### contact-groups (admin-console — read-only by design, same as other sys-*)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| contact-groups | Land on page | `app.admin-console / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:140` |
| contact-groups | View list | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:156` |
| contact-groups | View detail | `sys.contact-group / view` | ✅ | `[CODE] BuiltInRoleCatalog.cs:156` |
| contact-groups | Create | `sys.contact-group / create` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:157` |
| contact-groups | Edit own | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:158` |
| contact-groups | Edit other | `sys.contact-group / edit` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:158` |
| contact-groups | Delete | `sys.contact-group / delete` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:159` |
| contact-groups | Share | `sys.contact-group / share` | ❌ explicit deny | `[CODE] BuiltInRoleCatalog.cs:160` |
| contact-groups | Share-other | `sys.contact-group / share-other` | — no seed rule — silent deny | `[BRAIN-OUT] contact-groups.compare.md:62` |
| contact-groups | View shared (the "Shared Groups" tab) | `acc.contact-group / view-shared` (factory always returns `acc.*`) | — silent deny — no rule in BuiltInRoleCatalog.cs for sys-products on `acc.*` namespace | `[BRAIN-OUT] contact-groups.compare.md:61`, `[CODE] falcon-access.registry.ts:13-15` |
| contact-groups | Download validated | `sys.contact-group / download` | ✅ | `[CODE] BuiltInRoleCatalog.cs:161` |
| contact-groups | Download original | `sys.contact-group / download-original` | ✅ | `[CODE] BuiltInRoleCatalog.cs:162` |

### testing-charging (admin-only by design — all sys-* have identical access)

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| testing-charging | See nav link (sidebar) | `requiredUserTypes: [FALCON_USER]` filter | ✅ | `[CODE] apps/host-shell/src/app/layout/layout.component.ts:397-405` |
| testing-charging | Land on page | `app.admin-console / view` (inherited only — no in-feature PES) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:43` |
| testing-charging | View accounts / overview / wallets / buckets / reservations / ledger / balances / commit-records | (no PES) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:43` |
| testing-charging | Create reservation / run WhatsApp simulator / trigger callbacks | (no PES — mutates real OCS state) | ✅ | `[BRAIN-OUT] testing-charging.compare.md:43` |

### Role edit

| Page | Action | PES key | Verdict | Source |
|---|---|---|---|---|
| (any page with role picker) | Edit own role to sys-products (keep) | `user.role.self / set-sys-products` | ✅ | `[CODE] BuiltInRoleCatalog.cs:39-47` |
| (any page with role picker) | Edit own role to sys-admin | `user.role.self / set-sys-admin` | ❌ self-edit only allows keeping current role | `[BRAIN-OUT] REGISTRY-RAW.md:118-119` |
| (any page with role picker) | Change other sys-admin to sys-products | `user.role.other / change-sys-admin-to-sys-products` | ❌ no rule — sys-products cannot touch sys-admin | `[BRAIN-OUT] sys-products.md:81` |
| (any page with role picker) | Change other sys-ops to sys-products | `user.role.other / change-sys-ops-to-sys-products` | ❌ no rule — sys-products cannot touch sys-ops | `[BRAIN-OUT] sys-products.md:81` |
| (any page with role picker) | Change other sys-products to sys-products (no-op confirm) | `user.role.other / change-sys-products-to-sys-products` | ✅ | `[CODE] BuiltInRoleCatalog.cs:39-47` |
| (any page with role picker) | Change other acc-user to acc-owner | `user.role.other / change-acc-user-to-acc-owner` | ✅ — full acc-* reach | `[CODE] BuiltInRoleCatalog.cs:39-47` |
| (any page with role picker) | Change other acc-* (any → any within acc-*) | `user.role.other / change-acc-X-to-acc-Y` | ✅ | `[CODE] BuiltInRoleCatalog.cs:39-47` |
| (any page with role picker) | Cross-namespace promotion (sys → acc or acc → sys) | `user.role.other / change-sys-X-to-acc-Y` | — silent deny — no cross-namespace rule | `[BRAIN-OUT] REGISTRY-RAW.md:129` |

## Action highlights

### Unique powers (sole / shared-with-one across all 6 roles)

- ✅ Full `sys.wallet.transfer` + `sys.master-wallet.view` + `sys.wallet-strategy.{view, edit}` cluster — **shared only with sys-admin**; sys-ops has zero wallet powers; all acc-* roles use a different (Charging-gateway-backed) transfer flow with no PBAC key. `[CODE] BuiltInRoleCatalog.cs:152-155`, `[BRAIN-OUT] wallet-balance-management.compare.md:51, 53`.
- ✅ Full `sys.services.*` cluster (payment + edit-price-type + edit-price-value + visibility) — **shared only with sys-admin**; sys-ops cannot do any service mutation. `[CODE] BuiltInRoleCatalog.cs:148-151`.
- ✅ Combination of `sys.account.add` (Add Client) + `sys.wallet-strategy.edit` — sys-products can onboard a new client AND configure their wallet-strategy, effectively running the commercial onboarding pipeline end-to-end without sys-admin involvement. `[CODE] BuiltInRoleCatalog.cs:142, 153`.

### Explicit denies (rule exists with `effect: deny`)

- ❌ `sys.root-password-security-level / view` — **stricter than sys-ops** (which has view). sys-products is the only sys-* role denied view. `[CODE] BuiltInRoleCatalog.cs:144`.
- ❌ `sys.root-password-security-level / edit`. `[CODE] BuiltInRoleCatalog.cs:145`.
- ❌ `sys.root-allowed-ips / edit`. `[CODE] BuiltInRoleCatalog.cs:146`.
- ❌ `sys.contact-group / create`. `[CODE] BuiltInRoleCatalog.cs:157`.
- ❌ `sys.contact-group / edit`. `[CODE] BuiltInRoleCatalog.cs:158`.
- ❌ `sys.contact-group / delete`. `[CODE] BuiltInRoleCatalog.cs:159`.
- ❌ `sys.contact-group / share`. `[CODE] BuiltInRoleCatalog.cs:160`.
- ❌ Self-role-edit to any role other than `sys-products`. `[BRAIN-OUT] REGISTRY-RAW.md:118-119`.

### No-rule denies (silent)

- — `sys.account-allowed-ips / edit` — sys-ops has this; sys-products doesn't. `[BRAIN-OUT] sys-products.md:71`.
- — `sys.account-password-security-level / edit` — only sys-admin has this. `[BRAIN-OUT] sys-products.md:70`.
- — `app.management-console / view` — out-of-namespace; cannot land on Client console. `[BRAIN-OUT] sys-products.md:69-71`.
- — All `acc.*` resources (cross-namespace). `[BRAIN-OUT] REGISTRY-RAW.md:147-150`.
- — `sys.contact-group / share-other` — no seed rule for any sys-* role. `[BRAIN-OUT] contact-groups.compare.md:62`.
- — `acc.contact-group / view-shared` — Shared Groups tab silently hidden on admin side. `[BRAIN-OUT] contact-groups.compare.md:61`.
- — Role-edit on `sys-admin` and `sys-ops` users. `[BRAIN-OUT] sys-products.md:81`.
- — Wave 1.3.0 keys not yet seeded: `sys.user.add`, `sys.user-permission-group.assign`, `sys.user-profile-picture.upload`. `[BRAIN-OUT] REGISTRY-RAW.md:52-54`.

## Role-edit reach

> Who this role can promote / demote, by namespace. Cite: `[CODE] BuiltInRoleCatalog.cs:39-47` (sys-products block of `BuiltInRoleCatalog`).

| Target user's current role | Destinations sys-products can move them to |
|---|---|
| `sys-admin` | (none — no rule generated) |
| `sys-ops` | (none — no rule generated) |
| `sys-products` | sys-products only (keep current role) |
| `acc-owner` | acc-owner, acc-admin, acc-user |
| `acc-admin` | acc-owner, acc-admin, acc-user |
| `acc-user` | acc-owner, acc-admin, acc-user |

**Sys-products can edit acc-* fully but cannot promote / demote sibling sys-* roles.** Mirror of sys-ops' reach pattern on the sys-* side — each sys-* role (other than sys-admin) is locked to itself. `[BRAIN-OUT] sys-products.md:77-81`.

## Cross-references

- Role note: `[BRAIN-OUT] 01-roles/sys-products.md`
- PES key registry: `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md`
- Feature parity matrix: `[BRAIN-OUT] 04-feature-parity-matrix/MATRIX.md`
- Feature compares: `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md`, `marketplace-applications.compare.md`, `comms-hub.compare.md`, `wallet-balance-management.compare.md`, `contracts-cost-management.compare.md`, `contact-groups.compare.md`, `testing-charging.compare.md`
- Status enums: `[BRAIN-OUT] 02-statuses/`
- Sibling roles (same namespace): `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md`, `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md`
- Seed source: `[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:135-167` (sys-products block); `:39-47` (sys-products role-edit matrix)
- Identity enum: `[CODE] Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs` (`eUserRoles.Product = 2`)
- Seed script: `[CODE] Falcon/falcon-essentials/zitadel/seed-test-users.sh` (provisions `sysprod`)
