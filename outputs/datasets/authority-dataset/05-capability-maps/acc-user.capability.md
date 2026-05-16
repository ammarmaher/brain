---
type: capability-map
role: acc-user
namespace: <tenant-id>
console: management-console
gateway: CoreGateway
purpose: "Answers 'full inventory of acc-user — the minimum-privilege role, contact-group-only, the only role with view-shared, role-edit reach: nothing'. Open before rendering anything in mgmt-console for this role."
total-rows: 60
extracted: 2026-05-16
---

# Capability Map · `acc-user` — Normal User

> [!tldr]
> Tenant's narrowest-privilege role — the **minimum-privilege role in the whole platform**. ❌ explicit deny on **every** `acc.*` resource except `acc.contact-group.*`. The page-reachable feature footprint is **contact-groups only** — org-hierarchy, account, organization, services, settings, users, account-profile, password-security, allowed-IPs, quota, contract, services-{view/payment/disable} are all explicit denies. Contact-group `edit`/`delete`/**`share`** are all expression-gated to own-only (`r.obj.createdby == r.sub.userid`) — the `share` expression is **tighter than acc-owner / acc-admin** which have un-expressioned share. ✅ allow on the unique `acc.contact-group.view-shared` — **only role with this** — drives the "Shared Groups" tab visibility. ❌ explicit deny on `app.admin-console.view`. — silent deny on every `sys.*` resource. **Role-edit reach: NOTHING** — every target row is empty; even `set-acc-user` (self-confirm) is the only self-target allow. [CODE] `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:249-290` · [CODE] `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json:64-95`.

## Identity card

| Field | Value | Source |
|---|---|---|
| Role key | `acc-user` | [CODE] `BuiltInRoleCatalog.cs:250` |
| Display En | Normal User | [CODE] `BuiltInRoleCatalog.cs:251` |
| Display Ar | مستخدم | [CODE] `BuiltInRoleCatalog.cs:252` |
| Namespace | `<tenant-id>` (templated per tenant at seed) | [CODE] `pes-account-role-rules.json:64` (`r:acc-user@{TENANT_ID}`) |
| User type | `eUserType.Client` = 2 | [BRAIN-OUT] `01-roles/acc-user.md:7` |
| Role int | `eUserRoles.NormalUser` = 6 | [BRAIN-OUT] `01-roles/acc-user.md:9` |
| App entry | `app.management-console` | [CODE] `pes-account-role-rules.json:64` |
| Console mounted | `management-console` (`:4301`) — but UI must render a **contact-groups-only view** | [BRAIN-OUT] `01-roles/acc-user.md:33, 103-108` |
| Default gateway | `Gateway.CoreGateway` (`:7038`) | [BRAIN-OUT] `01-roles/acc-user.md:34` |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` | [BRAIN-OUT] `01-roles/acc-user.md:36` + [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` |
| Role-policy subject | `r:acc-user@<tenant-id>` | [CODE] `pes-account-role-rules.json:64` |
| Test user (seeded) | `accuser` / `accuser@falcon.local` / `+962788090506` / `Admin@1234` / tenant `test-tenant-001` | [BRAIN-OUT] `01-roles/acc-user.md:13` |

## Master capability table

> Most rows are ❌ **explicit deny** (acc-user is the most explicit role in the catalog — the seed catalog ships explicit-deny rows for every non-contact-group action rather than relying on silent deny). Contact-group is the **single open feature** and even there `share` is tightened to own-only.

| Resource | Action | Effect | Verdict | Source |
|---|---|---|---|---|
| `app.management-console` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:257` · [CODE] `pes-account-role-rules.json:64` |
| `app.admin-console` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:258` · [CODE] `pes-account-role-rules.json:65` |
| `acc.org-hierarchy` | view | **deny** | ❌ explicit deny — cannot see the tree | [CODE] `BuiltInRoleCatalog.cs:259` · [CODE] `pes-account-role-rules.json:66` |
| `acc.account` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:260` · [CODE] `pes-account-role-rules.json:67` |
| `acc.account` | edit | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:265` · [CODE] `pes-account-role-rules.json:72` |
| `acc.organization` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:261` · [CODE] `pes-account-role-rules.json:68` |
| `acc.organization` | add | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:262` · [CODE] `pes-account-role-rules.json:69` |
| `acc.account-user` | add | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:263` · [CODE] `pes-account-role-rules.json:70` |
| `acc.org-user` | add | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:264` · [CODE] `pes-account-role-rules.json:71` |
| `acc.services` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:266` · [CODE] `pes-account-role-rules.json:73` |
| `acc.services` | payment | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:278` · [CODE] `pes-account-role-rules.json:85` |
| `acc.services` | disable | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:279` · [CODE] `pes-account-role-rules.json:86` |
| `acc.account-settings` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:267` · [CODE] `pes-account-role-rules.json:74` |
| `acc.org-settings` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:268` · [CODE] `pes-account-role-rules.json:75` |
| `acc.users` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:269` · [CODE] `pes-account-role-rules.json:76` |
| `acc.account-profile` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:270` · [CODE] `pes-account-role-rules.json:77` |
| `acc.account-profile` | edit | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:271` · [CODE] `pes-account-role-rules.json:78` |
| `acc.account-password-security-level` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:272` · [CODE] `pes-account-role-rules.json:79` |
| `acc.account-password-security-level` | edit | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:273` · [CODE] `pes-account-role-rules.json:80` |
| `acc.account-allowed-ips` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:274` · [CODE] `pes-account-role-rules.json:81` |
| `acc.account-allowed-ips` | edit | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:275` · [CODE] `pes-account-role-rules.json:82` |
| `acc.account-quota` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:276` · [CODE] `pes-account-role-rules.json:83` |
| `acc.account-quota` | edit | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:277` · [CODE] `pes-account-role-rules.json:84` |
| `acc.contract` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:280` · [CODE] `pes-account-role-rules.json:87` |
| `acc.contact-group` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:281` · [CODE] `pes-account-role-rules.json:88` |
| `acc.contact-group` | create | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:282` · [CODE] `pes-account-role-rules.json:89` |
| `acc.contact-group` | edit | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:283` · [CODE] `pes-account-role-rules.json:90` |
| `acc.contact-group` | delete | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:284` · [CODE] `pes-account-role-rules.json:91` |
| `acc.contact-group` | share | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` (**tighter than acc-owner / acc-admin**) | [CODE] `BuiltInRoleCatalog.cs:285` · [CODE] `pes-account-role-rules.json:92` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:64` |
| `acc.contact-group` | download | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:286` · [CODE] `pes-account-role-rules.json:93` |
| `acc.contact-group` | download-original | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:287` · [CODE] `pes-account-role-rules.json:94` |
| `acc.contact-group` | view-shared | allow | ✅ allow — **UNIQUE to acc-user** (only role with this rule; drives "Shared Groups" tab) | [CODE] `BuiltInRoleCatalog.cs:288` · [CODE] `pes-account-role-rules.json:95` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:64` |
| `sys.acc-hierarchy` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:35, 147-150` |
| `sys.account` | add | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:36, 147-150` |
| `sys.account-profile` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:37, 147-150` |
| `sys.root-password-security-level` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:38, 147-150` |
| `sys.root-password-security-level` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:39, 147-150` |
| `sys.account-password-security-level` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:40, 147-150` |
| `sys.root-allowed-ips` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:41, 147-150` |
| `sys.account-allowed-ips` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:42, 147-150` |
| `sys.account-quota` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:43, 147-150` |
| `sys.services` | payment | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:44, 147-150` |
| `sys.services` | edit-price-type | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:45, 147-150` |
| `sys.services` | edit-price-value | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:46, 147-150` |
| `sys.services` | visibility | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:47, 147-150` |
| `sys.wallet-strategy` | view / edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:48-49, 147-150` |
| `sys.master-wallet` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:50, 147-150` |
| `sys.wallet` | transfer | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:51, 147-150` |
| `sys.user` | add (Wave 1.3.0) | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:52, 147-150` |
| `sys.user-permission-group` | assign (Wave 1.3.0) | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:53, 147-150` |
| `sys.user-profile-picture` | upload (Wave 1.3.0) | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:54, 147-150` |
| `sys.contact-group` | view / create / edit / delete / share / download / download-original | (no rule) | — silent deny | [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:59-61` |
| `dashboard` | view | (no rule) | — silent deny / shared general | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:140` |
| `auth_view` | view | (no rule) | — silent deny / shared general | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:141` |
| `user_profile` | view | (no rule) | — silent deny / shared general | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:142` |
| `user.role.self` | set-acc-user | allow (self-confirm) | ✅ allow self-confirm only | [CODE] `BuiltInRoleCatalog.cs:66-74` (`BuildSelfRoleEditPolicies` self-target) · [BRAIN-OUT] `01-roles/acc-user.md:84-86` |
| `user.role.self` | set-acc-{owner, admin} | not self-target | ❌ deny (cannot self-promote) | [BRAIN-OUT] `01-roles/acc-user.md:84-86` |
| `user.role.other` | change-any-to-any | (empty everywhere) | — silent deny — **EVERY cell empty** | [CODE] `BuiltInRoleCatalog.cs:68-73` |

## Action highlights

> Per-feature verdicts. Most rows are denied — acc-user is feature-equivalent to **contact-groups-only**.

### organization-hierarchy (route `/organization-hierarchy`)
- ❌ **Land on page** — `acc.org-hierarchy.view` **explicit deny**. Route guard rejects; menu link hidden by access-control side-bar filter. [CODE] `pes-account-role-rules.json:66` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:96`.
- ❌ Everything else cascade-denied — Add Node, Add User, View Settings, edit IPs / quota / password-security — all keys are explicit deny.

### comms-hub (route `/comm-mgmt`)
- ❌ **Land on page** — `acc.services.view` **explicit deny**. [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:53, 91`.
- ❌ All in-page actions explicit deny.

### marketplace-applications (route `/marketplace-applications`)
- ❌ **Land on page** — same `acc.services.view` explicit deny chain. [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:91`.
- ❌ All in-page actions explicit deny.

### contact-groups (route `/contact-groups`) — **the only landable feature**
- ✅ **Land on page** — `acc.contact-group.view` allow. [CODE] `pes-account-role-rules.json:88` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:64`.
- ✅ **Create (5-step wizard)** — `acc.contact-group.create` allow. [CODE] `pes-account-role-rules.json:89`.
- ✅ **Edit / Delete (own-only)** — expression-gated `r.obj.createdby == r.sub.userid`. FE overlays `session.identityUserId === row.createdByUserId` via `rowFlags()` helper. [CODE] `pes-account-role-rules.json:90-91` · [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md`.
- ✅ **Share (own-only — tighter than acc-owner / acc-admin)** — `acc.contact-group.share` allow **with expression** `r.obj.createdby == r.sub.userid`. acc-user can only share groups they themselves authored; acc-owner / acc-admin can share any group. [CODE] `pes-account-role-rules.json:92` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:64`.
- — **share-other** — no seed rule (silent deny — same as all acc-\* roles).
- ✅ **Download validated + original** — both allow. [CODE] `pes-account-role-rules.json:93-94`.
- ✅ **View Shared Groups tab** — `acc.contact-group.view-shared` allow — **UNIQUE permission for acc-user**. This is the rule that surfaces the "Shared Groups" tab in the UI showing groups other users have shared with them. [CODE] `pes-account-role-rules.json:95` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:64`.

### wallet-balance-management (route `/wallet-balance-management`)
- ✅ **Land on page** — app-level `app.management-console.view` allow (mgmt-side route has no `shellAccessGuard`). [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:56`.
- ❌ **All wallet actions** — no acc.\* wallet keys exist; menu hidden in practice. Tenant UX treats acc-user as zero-wallet-rights.

### contracts-cost-management (route `/contracts-cost-management`)
- ❌ **Land on page** — `acc.contract.view` **explicit deny**. [CODE] `pes-account-role-rules.json:87` · [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:56`.
- ❌ List / view / create / edit — all denied.

### testing-charging
- ❌ Not present on mgmt-console (Falcon-only). [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:24, 96`.

### admin-console entry
- ❌ **Land on admin-console** — `app.admin-console.view` explicit **deny** (`pes-account-role-rules.json:65`).

### Why this matters for the UI shell (mgmt-console rendering)

When `acc-user` logs in, the management-console must render a **contact-groups-only view**: [BRAIN-OUT] `01-roles/acc-user.md:101-108`.
- Org-hierarchy tree → hidden.
- Account-administration menu → hidden.
- Wallet / contracts → hidden.
- Marketplace / comms-hub → hidden.
- Contact Groups page → fully functional with own + shared visibility (the Shared Groups tab is exclusive).

## Role-edit reach

Source: [CODE] `BuiltInRoleCatalog.cs:66-74` (acc-user row of `OtherRoleEditMatrix`).

| As actor → target's current role | Targets allowed |
|---|---|
| `sys-admin` | (empty) — cross-namespace impossible |
| `sys-ops` | (empty) — cross-namespace impossible |
| `sys-products` | (empty) — cross-namespace impossible |
| `acc-owner` | (empty) — cannot edit acc-owner |
| `acc-admin` | (empty) — cannot edit acc-admin |
| `acc-user` | (empty) — cannot edit other acc-users |

**Effectively: acc-user can edit NOTHING.** Every target's allowed list is `Array.Empty<string>()`. The only role-related PES allow is `user.role.self / set-acc-user` (self-confirm of own current role) — which means acc-user can save their profile without changing their role, but the role-change dropdown is always disabled or absent.

PES actions generated (sample):
- `user.role.other / change-anything-to-anything` → — silent deny (every cell empty)
- `user.role.self / set-acc-user` → ✅ allow (self-confirm)
- `user.role.self / set-acc-{owner, admin}` → ❌ deny (cannot self-promote)
- `user.role.self / set-sys-\*` → ❌ deny (cross-namespace)

**Headline:** acc-user is the **terminal leaf** of the role-edit DAG. Nobody can be promoted by acc-user; only superiors (acc-owner, acc-admin) can promote acc-users up to acc-admin (acc-admin reach) or anywhere (acc-owner reach). The role exists for users who consume contact groups but should never administer anyone or anything.

## Cross-references

- Compare roles: [[acc-owner.capability]] · [[acc-admin.capability]] (this directory)
- Source role notes: [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- PES key universe: [[../03-pes-keys/REGISTRY-RAW]]
- Feature parity master matrix: [[../04-feature-parity-matrix/MATRIX]]
- contact-groups feature compare (acc-user is the only role with `view-shared`): [[../04-feature-parity-matrix/contact-groups.compare]]
- Tenant-scoped `p`-rule template (authoritative): `C:\Falcon\Falcon\falcon-essentials\zitadel\pes-account-role-rules.json` (lines 64-95 are the acc-user block — note line 92 is the unique own-only `share` expression and line 95 is the unique `view-shared` allow)
- Catalog source of truth: `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs:249-290` (explicit-deny rows :259-280 — most explicit role in catalog)
- Test login curl: `../07-cross-cutting/test-users.md`
- Subject-link rule: [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md`
