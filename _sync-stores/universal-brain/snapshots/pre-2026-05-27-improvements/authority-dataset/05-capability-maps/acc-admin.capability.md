---
type: capability-map
role: acc-admin
namespace: <tenant-id>
console: management-console
gateway: CoreGateway
purpose: "Answers 'full page×action×verdict inventory of what acc-admin can/cannot do + which explicit denies vs silent denies apply'. Open when auditing or building any mgmt-console feature for the Node-Admin role."
total-rows: 60
extracted: 2026-05-16
---

# Capability Map · `acc-admin` — Node Admin

> [!tldr]
> Tenant's middle-tier role. ✅ allow on org-hierarchy / account / organization / org-user-add / account-settings / org-settings / users / contact-group (own-only edit/delete, full share). ❌ **explicit deny** (per `BuiltInRoleCatalog.cs:227-240`) on every premium account-administration action: `acc.services.*` (view / payment / disable), `acc.account-profile.edit`, `acc.account-password-security-level.*`, `acc.account-allowed-ips.*`, `acc.account-quota.*`, `acc.contract.view`. — silent deny on `acc.account-user.add` (no rule — delta vs acc-owner) and `acc.contact-group.view-shared` (no rule — only acc-user has it). Sees the org tree but **cannot** see/pay/disable services, edit account profile, view password-security / allowed-IPs / quota / contracts. ❌ explicit deny on `app.admin-console.view`. — silent deny on every `sys.*` resource. Role-edit reach: `acc-admin` and `acc-user` rows only → `{acc-admin, acc-user}`; cannot touch `acc-owner`. [CODE] `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:211-248` · [CODE] `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json:34-62`.

## Identity card

| Field | Value | Source |
|---|---|---|
| Role key | `acc-admin` | [CODE] `BuiltInRoleCatalog.cs:212` |
| Display En | Node Admin | [CODE] `BuiltInRoleCatalog.cs:213` |
| Display Ar | مشرف الإدارة | [CODE] `BuiltInRoleCatalog.cs:214` |
| Namespace | `<tenant-id>` (templated per tenant at seed) | [CODE] `pes-account-role-rules.json:34` (`r:acc-admin@{TENANT_ID}`) |
| User type | `eUserType.Client` = 2 | [BRAIN-OUT] `01-roles/acc-admin.md:7` |
| Role int | `eUserRoles.NodeAdmin` = 5 | [BRAIN-OUT] `01-roles/acc-admin.md:9` |
| App entry | `app.management-console` | [CODE] `pes-account-role-rules.json:34` |
| Console mounted | `management-console` (`:4301`) | [BRAIN-OUT] `01-roles/acc-admin.md:33` |
| Default gateway | `Gateway.CoreGateway` (`:7038`) | [BRAIN-OUT] `01-roles/acc-admin.md:34` |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` | [BRAIN-OUT] `01-roles/acc-admin.md:36` + [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` |
| Role-policy subject | `r:acc-admin@<tenant-id>` | [CODE] `pes-account-role-rules.json:34` |
| Test user (seeded) | `accadmin` / `accadmin@falcon.local` / `+962788090505` / `Admin@1234` / tenant `test-tenant-001` | [BRAIN-OUT] `01-roles/acc-admin.md:13` |

## Master capability table

> The distinguishing feature of acc-admin is **explicit deny rules** rather than missing rules: the catalog ships `effect: deny` rows for services, profile-edit, password-security, IPs, quota, and contract. Each is cited below.

| Resource | Action | Effect | Verdict | Source |
|---|---|---|---|---|
| `app.management-console` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:219` · [CODE] `pes-account-role-rules.json:34` |
| `app.admin-console` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:220` · [CODE] `pes-account-role-rules.json:35` |
| `acc.org-hierarchy` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:221` · [CODE] `pes-account-role-rules.json:36` |
| `acc.account` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:222` · [CODE] `pes-account-role-rules.json:37` |
| `acc.account` | edit | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:226` · [CODE] `pes-account-role-rules.json:41` |
| `acc.organization` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:223` · [CODE] `pes-account-role-rules.json:38` |
| `acc.organization` | add | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:224` · [CODE] `pes-account-role-rules.json:39` |
| `acc.account-user` | add | (no rule) | — silent deny (**delta vs acc-owner** — acc-admin cannot add account-level users) | [BRAIN-OUT] `01-roles/acc-admin.md:53` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:95` |
| `acc.org-user` | add | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:225` · [CODE] `pes-account-role-rules.json:40` |
| `acc.services` | view | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:227` · [CODE] `pes-account-role-rules.json:42` |
| `acc.services` | payment | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:228` · [CODE] `pes-account-role-rules.json:43` |
| `acc.services` | disable | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:229` · [CODE] `pes-account-role-rules.json:44` |
| `acc.account-settings` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:230` · [CODE] `pes-account-role-rules.json:45` |
| `acc.org-settings` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:231` · [CODE] `pes-account-role-rules.json:46` |
| `acc.users` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:232` · [CODE] `pes-account-role-rules.json:47` |
| `acc.account-profile` | view | (no rule) | — silent deny | [BRAIN-OUT] `01-roles/acc-admin.md:60` |
| `acc.account-profile` | edit | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:233` · [CODE] `pes-account-role-rules.json:48` |
| `acc.account-password-security-level` | view | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:234` · [CODE] `pes-account-role-rules.json:49` |
| `acc.account-password-security-level` | edit | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:235` · [CODE] `pes-account-role-rules.json:50` |
| `acc.account-allowed-ips` | view | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:236` · [CODE] `pes-account-role-rules.json:51` |
| `acc.account-allowed-ips` | edit | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:237` · [CODE] `pes-account-role-rules.json:52` |
| `acc.account-quota` | view | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:238` · [CODE] `pes-account-role-rules.json:53` |
| `acc.account-quota` | edit | **deny** | ❌ **explicit deny** | [CODE] `BuiltInRoleCatalog.cs:239` · [CODE] `pes-account-role-rules.json:54` |
| `acc.contract` | view | **deny** | ❌ **explicit deny** (strongest authority asymmetry in dataset) | [CODE] `BuiltInRoleCatalog.cs:240` · [CODE] `pes-account-role-rules.json:55` · [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:55, 62-63` |
| `acc.contact-group` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:241` · [CODE] `pes-account-role-rules.json:56` |
| `acc.contact-group` | create | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:242` · [CODE] `pes-account-role-rules.json:57` |
| `acc.contact-group` | edit | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:243` · [CODE] `pes-account-role-rules.json:58` |
| `acc.contact-group` | delete | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:244` · [CODE] `pes-account-role-rules.json:59` |
| `acc.contact-group` | share | allow | ✅ allow (un-expressioned — wider than acc-user) | [CODE] `BuiltInRoleCatalog.cs:245` · [CODE] `pes-account-role-rules.json:60` |
| `acc.contact-group` | download | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:246` · [CODE] `pes-account-role-rules.json:61` |
| `acc.contact-group` | download-original | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:247` · [CODE] `pes-account-role-rules.json:62` |
| `acc.contact-group` | view-shared | (no rule) | — silent deny (only acc-user has this rule) | [BRAIN-OUT] `01-roles/acc-user.md:76` |
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
| `user.role.self` | set-acc-admin | allow (self-confirm) | ✅ allow self-confirm only | [CODE] `BuiltInRoleCatalog.cs:57-65` (acc-admin row; `BuildSelfRoleEditPolicies` adds self-target) |
| `user.role.other` | change-acc-admin-to-{acc-admin, acc-user} | allow | ✅ allow (target side-grades or demotes) | [CODE] `BuiltInRoleCatalog.cs:63` |
| `user.role.other` | change-acc-user-to-{acc-admin, acc-user} | allow | ✅ allow (target promote to admin or hold) | [CODE] `BuiltInRoleCatalog.cs:64` |
| `user.role.other` | change-acc-owner-to-anything | (empty) | — silent deny (cannot edit acc-owner) | [CODE] `BuiltInRoleCatalog.cs:62` |
| `user.role.other` | change-sys-\*-to-anything | (empty) | — silent deny (cross-namespace impossible) | [CODE] `BuiltInRoleCatalog.cs:59-61` |
| `user.role.other` | change-acc-{admin,user}-to-acc-owner | not in allowed target list | — silent deny (cannot promote to acc-owner) | [CODE] `BuiltInRoleCatalog.cs:63-64` (targets = `{acc-admin, acc-user}`, no `acc-owner`) |

## Action highlights

> Per-feature verdicts citing where the PES key drives the UI.

### organization-hierarchy (route `/organization-hierarchy`)
- ✅ **Land on page** — `acc.org-hierarchy.view` allow. [CODE] `pes-account-role-rules.json:36` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:95`.
- ❌ **Add Client wizard** — not present in mgmt feature (Falcon-only).
- ✅ **Add Node** — `acc.organization.add` allow → `canAddOrganization = true`. [CODE] `pes-account-role-rules.json:39`.
- ⚠ **Add User — org-user path ONLY** — `acc.org-user.add` allow (✅), but `acc.account-user.add` has **no rule** (— silent deny). Tree's `canAddUserForNode(nodeId)` returns `isRootSelection ? canAddAccountUser : canAddOrgUser` → root selection hides Add User; sub-node selection shows it. [CODE] `pes-account-role-rules.json:40` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:95`.
- ❌ **Edit account profile** — `acc.account-profile.edit` **explicit deny**. Edit button hidden on Hierarchy tab info view. [CODE] `pes-account-role-rules.json:48`.
- ✅ **View Settings tab (account + org)** — `acc.account-settings.view` + `acc.org-settings.view`. [CODE] `pes-account-role-rules.json:45-46`.
- ❌ **View OR edit pwd / IPs / quota** — all 6 keys are **explicit deny**. NodeSettingsTab `ensureAccess` resolves every flag to false. [CODE] `pes-account-role-rules.json:49-54`.
- ❌ **CommChannels & Services + Apps & Services tabs** — `acc.services.view` **explicit deny** → `canViewServices = false` → both tabs disabled regardless of node selection. [CODE] `pes-account-role-rules.json:42`.

### comms-hub (route `/comm-mgmt`)
- ❌ **Land on page** — route guard checks `acc.services.view` which is **explicit deny**. Hitting the menu lands on `/401`. [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:52, 91`.
- ❌ **All in-page actions** (payment / disable) — all explicit deny.

### marketplace-applications (route `/marketplace-applications`)
- ❌ **Land on page** — same `acc.services.view` explicit deny chain. [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:91`.
- ❌ **All in-page actions** — all explicit deny.

### contact-groups (route `/contact-groups`)
- ✅ **Land on page** — `acc.contact-group.view` allow. [CODE] `pes-account-role-rules.json:56`.
- ✅ **Create (5-step wizard)** — `acc.contact-group.create` allow. [CODE] `pes-account-role-rules.json:57`.
- ✅ **Edit / Delete (own-only)** — expression-gated `r.obj.createdby == r.sub.userid`. FE overlays `session.identityUserId === row.createdByUserId` via `rowFlags()` helper. [CODE] `pes-account-role-rules.json:58-59` · [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md`.
- ✅ **Share (any group)** — `acc.contact-group.share` allow un-expressioned. [CODE] `pes-account-role-rules.json:60`.
- — **share-other** — no seed rule (silent deny — same as acc-owner / acc-user).
- ✅ **Download validated + original** — both allow. [CODE] `pes-account-role-rules.json:61-62`.
- — **View Shared Groups tab** — no `view-shared` rule (only acc-user has it). [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:63`.

### wallet-balance-management (route `/wallet-balance-management`)
- ✅ **Land on page** — app-level `app.management-console.view` allow (mgmt-side route has no `shellAccessGuard`). [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:55`.
- ❌ **All wallet actions** — no feature-scoped acc.\* keys exist; server-driven `canSave` is the only gate. In practice mgmt-side menu hides the link for acc-admin via the same access-control side-bar filter (no specific acc.wallet.\* key, but tenant UX hides). [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:55`.

### contracts-cost-management (route `/contracts-cost-management`)
- ❌ **Land on page** — `acc.contract.view` is **explicit deny** (per `BuiltInRoleCatalog.cs:240`). Menu hidden; direct URL returns empty list. [CODE] `pes-account-role-rules.json:55` · [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:55, 62`.
- ❌ **List / view / create / edit** — all denied.

### testing-charging
- ❌ Not present on mgmt-console (Falcon-only). [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:24, 96`.

### admin-console entry
- ❌ **Land on admin-console** — `app.admin-console.view` explicit **deny** (`pes-account-role-rules.json:35`).

## Role-edit reach

Source: [CODE] `BuiltInRoleCatalog.cs:57-65` (acc-admin row of `OtherRoleEditMatrix`).

| As actor → target's current role | Targets allowed |
|---|---|
| `sys-admin` | (empty) — cross-namespace impossible |
| `sys-ops` | (empty) — cross-namespace impossible |
| `sys-products` | (empty) — cross-namespace impossible |
| `acc-owner` | (empty) — **cannot edit acc-owner** |
| `acc-admin` | `acc-admin`, `acc-user` |
| `acc-user` | `acc-admin`, `acc-user` |

PES actions generated (sample):
- `user.role.other / change-acc-admin-to-acc-admin` → ✅ allow (no-op confirm)
- `user.role.other / change-acc-admin-to-acc-user` → ✅ allow (demote)
- `user.role.other / change-acc-user-to-acc-admin` → ✅ allow (promote)
- `user.role.other / change-acc-user-to-acc-user` → ✅ allow (no-op confirm)
- `user.role.other / change-acc-admin-to-acc-owner` → — silent deny (target not in allowed list)
- `user.role.other / change-acc-user-to-acc-owner` → — silent deny (target not in allowed list)
- `user.role.other / change-acc-owner-to-anything` → — silent deny (actor cannot target acc-owner)
- `user.role.other / change-sys-\*-to-anything` → — silent deny (cross-namespace)
- `user.role.self / set-acc-admin` → ✅ allow (self-confirm)
- `user.role.self / set-acc-{owner,user}` → ❌ deny (cannot self-promote or self-demote)

**Headline:** acc-admin operates as the middle tier — can side-grade other acc-admins, demote them to acc-user, promote acc-users back to admin, but **never reach acc-owner** in any direction. This protects the tenant's ownership layer.

## Cross-references

- Compare roles: [[acc-owner.capability]] · [[acc-user.capability]] (this directory)
- Source role notes: [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- PES key universe: [[../03-pes-keys/REGISTRY-RAW]]
- Feature parity master matrix: [[../04-feature-parity-matrix/MATRIX]]
- Tenant-scoped `p`-rule template (authoritative): `C:\Falcon\Falcon\falcon-essentials\zitadel\pes-account-role-rules.json` (lines 34-62 are the acc-admin block)
- Catalog source of truth: `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs:211-248` (explicit deny rows are :227-240)
- Test login curl: `../07-cross-cutting/test-users.md`
- Subject-link rule: [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md`
