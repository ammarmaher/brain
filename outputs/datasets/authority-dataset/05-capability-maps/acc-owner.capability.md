---
type: capability-map
role: acc-owner
namespace: <tenant-id>
console: management-console
gateway: CoreGateway
purpose: "Answers 'full page×action×verdict inventory of acc-owner including own-only contact-group expression gates + role-edit reach'. Open when implementing any top-tenant-role feature."
total-rows: 62
extracted: 2026-05-16
---

# Capability Map · `acc-owner` — Account Owner

> [!tldr]
> Tenant's top role and the **only acc-\* role with full management-console reach**. ✅ allow on every `acc.*` resource (org-hierarchy / account / organization / services / settings / users / account-profile / password-security / allowed-IPs / quota / contract / contact-group). The contact-group `edit`/`delete` are expression-gated to **own-only** (`r.obj.createdby == r.sub.userid`); `share` is open (un-expressioned). ❌ explicit deny on `app.admin-console.view` — cannot land on Falcon admin. — silent deny on every `sys.*` resource (no rule exists). Sole acc-\* role with `acc.account-user.add` (delta vs acc-admin) and the entire `acc.services.*` triad (view / payment / disable). Role-edit reach: all acc-\* → all acc-\*; cannot touch sys-\*. [CODE] `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:171-210` · [CODE] `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json:1-32`.

## Identity card

| Field | Value | Source |
|---|---|---|
| Role key | `acc-owner` | [CODE] `BuiltInRoleCatalog.cs:172` |
| Display En | Account Owner | [CODE] `BuiltInRoleCatalog.cs:173` |
| Display Ar | مالك الحساب | [CODE] `BuiltInRoleCatalog.cs:174` |
| Namespace | `<tenant-id>` (templated per tenant at seed) | [CODE] `pes-account-role-rules.json:2` (`r:acc-owner@{TENANT_ID}`) |
| User type | `eUserType.Client` = 2 | [BRAIN-OUT] `01-roles/acc-owner.md:7` |
| Role int | `eUserRoles.AccountOwner` = 4 | [BRAIN-OUT] `01-roles/acc-owner.md:9` |
| App entry | `app.management-console` | [CODE] `pes-account-role-rules.json:2` |
| Console mounted | `management-console` (`:4301`) | [BRAIN-OUT] `01-roles/acc-owner.md:33` |
| Default gateway | `Gateway.CoreGateway` (`:7038`) | [BRAIN-OUT] `01-roles/acc-owner.md:34` (`provideAppDefaultGateway(Gateway.CoreGateway)` in mgmt-console `app.config.ts:52`) |
| Policy subject template | `u:<ZitadelUserId>@<tenant-id>` | [BRAIN-OUT] `01-roles/acc-owner.md:36` + [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` |
| Role-policy subject | `r:acc-owner@<tenant-id>` | [CODE] `pes-account-role-rules.json:2` |
| Test user (seeded) | `accowner` / `accowner@falcon.local` / `+962788090504` / `Admin@1234` / tenant `test-tenant-001` | [BRAIN-OUT] `01-roles/acc-owner.md:13` |

## Master capability table

> Every `acc.*` and `app.*` row is direct from the tenant-scoped `p`-rule template (`pes-account-role-rules.json`) which mirrors `BuiltInRoleCatalog.cs:177-210`. The catalog is the source of truth; the JSON is templated per tenant during seed (`{TENANT_ID}` → real id). Every `sys.*` resource has **no rule** for any acc-\* role — silent deny via the PES default-deny fallback.

| Resource | Action | Effect | Verdict | Source |
|---|---|---|---|---|
| `app.management-console` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:179` · [CODE] `pes-account-role-rules.json:2` |
| `app.admin-console` | view | **deny** | ❌ explicit deny | [CODE] `BuiltInRoleCatalog.cs:180` · [CODE] `pes-account-role-rules.json:3` |
| `acc.org-hierarchy` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:181` · [CODE] `pes-account-role-rules.json:4` |
| `acc.account` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:182` · [CODE] `pes-account-role-rules.json:5` |
| `acc.account` | edit | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:187` · [CODE] `pes-account-role-rules.json:10` |
| `acc.organization` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:183` · [CODE] `pes-account-role-rules.json:6` |
| `acc.organization` | add | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:184` · [CODE] `pes-account-role-rules.json:7` |
| `acc.account-user` | add | allow | ✅ allow (**only acc-owner**) | [CODE] `BuiltInRoleCatalog.cs:185` · [CODE] `pes-account-role-rules.json:8` |
| `acc.org-user` | add | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:186` · [CODE] `pes-account-role-rules.json:9` |
| `acc.services` | view | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:188` · [CODE] `pes-account-role-rules.json:11` |
| `acc.services` | payment | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:189` · [CODE] `pes-account-role-rules.json:12` |
| `acc.services` | disable | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:190` · [CODE] `pes-account-role-rules.json:13` |
| `acc.account-settings` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:191` · [CODE] `pes-account-role-rules.json:14` |
| `acc.org-settings` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:192` · [CODE] `pes-account-role-rules.json:15` |
| `acc.users` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:193` · [CODE] `pes-account-role-rules.json:16` |
| `acc.account-profile` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:194` · [CODE] `pes-account-role-rules.json:17` |
| `acc.account-profile` | edit | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:195` · [CODE] `pes-account-role-rules.json:18` |
| `acc.account-password-security-level` | view | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:196` · [CODE] `pes-account-role-rules.json:19` |
| `acc.account-password-security-level` | edit | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:197` · [CODE] `pes-account-role-rules.json:20` |
| `acc.account-allowed-ips` | view | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:198` · [CODE] `pes-account-role-rules.json:21` |
| `acc.account-allowed-ips` | edit | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:199` · [CODE] `pes-account-role-rules.json:22` |
| `acc.account-quota` | view | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:200` · [CODE] `pes-account-role-rules.json:23` |
| `acc.account-quota` | edit | allow | ✅ allow (only acc-owner) | [CODE] `BuiltInRoleCatalog.cs:201` · [CODE] `pes-account-role-rules.json:24` |
| `acc.contract` | view | allow | ✅ allow (**only acc-owner** — strongest authority asymmetry in dataset) | [CODE] `BuiltInRoleCatalog.cs:202` · [CODE] `pes-account-role-rules.json:25` · [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:54-56` |
| `acc.contact-group` | view | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:203` · [CODE] `pes-account-role-rules.json:26` |
| `acc.contact-group` | create | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:204` · [CODE] `pes-account-role-rules.json:27` |
| `acc.contact-group` | edit | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:205` · [CODE] `pes-account-role-rules.json:28` |
| `acc.contact-group` | delete | allow (expr) | ✅ **own-only** — `r.obj.createdby == r.sub.userid` | [CODE] `BuiltInRoleCatalog.cs:206` · [CODE] `pes-account-role-rules.json:29` |
| `acc.contact-group` | share | allow | ✅ allow (un-expressioned — wider than acc-user) | [CODE] `BuiltInRoleCatalog.cs:207` · [CODE] `pes-account-role-rules.json:30` |
| `acc.contact-group` | download | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:208` · [CODE] `pes-account-role-rules.json:31` |
| `acc.contact-group` | download-original | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:209` · [CODE] `pes-account-role-rules.json:32` |
| `acc.contact-group` | view-shared | (no rule) | — silent deny (unique to acc-user only) | [BRAIN-OUT] `01-roles/acc-user.md:76` |
| `sys.acc-hierarchy` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:35, 147-150` (sys.* is Falcon-only namespace) |
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
| `sys.wallet-strategy` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:48, 147-150` |
| `sys.wallet-strategy` | edit | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:49, 147-150` |
| `sys.master-wallet` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:50, 147-150` |
| `sys.wallet` | transfer | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:51, 147-150` |
| `sys.user` | add | (no rule) | — silent deny (Wave 1.3.0 — sys-only) | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:52, 147-150` |
| `sys.user-permission-group` | assign | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:53, 147-150` |
| `sys.user-profile-picture` | upload | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:54, 147-150` |
| `sys.contact-group` | view | (no rule) | — silent deny | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:147-150` |
| `sys.contact-group` | create / edit / delete / share / download / download-original | (no rule) | — silent deny (also denied for sys-\*) | [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:59-61` |
| `dashboard` | view | (no rule) | — silent deny / shared general (no seed for acc-\*) | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:140` |
| `auth_view` | view | (no rule) | — silent deny / shared general | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:141` |
| `user_profile` | view | (no rule) | — silent deny / shared general | [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:142` |
| `user.role.self` | set-acc-owner | allow (self-confirm) | ✅ allow self-confirm only | [CODE] `BuiltInRoleCatalog.cs:48-56` (acc-owner row in matrix → `acc-owner` self-target includes acc-owner) |
| `user.role.other` | change-acc-owner-to-acc-{owner,admin,user} | allow | ✅ allow (acc-only) | [CODE] `BuiltInRoleCatalog.cs:53-55` |
| `user.role.other` | change-acc-admin-to-acc-{owner,admin,user} | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:54` |
| `user.role.other` | change-acc-user-to-acc-{owner,admin,user} | allow | ✅ allow | [CODE] `BuiltInRoleCatalog.cs:55` |
| `user.role.other` | change-sys-\*-to-anything | (no rule) | — silent deny (cross-namespace impossible) | [CODE] `BuiltInRoleCatalog.cs:50-52` (sys-\* current → empty target list) |

## Action highlights

> Per-feature verdicts citing where the PES key drives the UI.

### organization-hierarchy (route `/organization-hierarchy`)
- ✅ **Land on page** — `acc.org-hierarchy.view` allow. [CODE] `pes-account-role-rules.json:4` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:94`.
- ❌ **Add Client wizard** — not present in mgmt feature tree (Falcon-only). [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:74, 94`.
- ✅ **Add Node** — `acc.organization.add` allow → `canAddOrganization = true` → `'add-node'` in `allowedTreeActions`. [CODE] `pes-account-role-rules.json:7` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:94`.
- ✅ **Add User (both paths)** — root-node uses `acc.account-user.add` (only acc-owner has it); sub-node uses `acc.org-user.add`. Tree includes `'add-user'` if **either** flag is true. [CODE] `pes-account-role-rules.json:8-9` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:94`.
- ✅ **Edit account profile** — `acc.account-profile.edit` allow (only acc-owner). [CODE] `pes-account-role-rules.json:18`.
- ✅ **View Settings tab (root + org)** — `acc.account-settings.view` + `acc.org-settings.view`. [CODE] `pes-account-role-rules.json:14-15`.
- ✅ **Edit pwd / IPs / quota** — every `account-password-security-level` / `account-allowed-ips` / `account-quota` view+edit allow. [CODE] `pes-account-role-rules.json:19-24` · [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:94`.
- ✅ **CommChannels & Services + Apps & Services tabs** — `acc.services.view` allow → `canViewServices = true` → tabs enabled on root selection. Acc-owner is the ONLY acc-\* role to see these. [CODE] `pes-account-role-rules.json:11`.

### comms-hub (route `/comm-mgmt`)
- ✅ **Land on page** — route guard checks `acc.services.view` which is allow (only acc-owner). [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:51, 91`.
- ✅ **Activate / Renew (payment)** — `acc.services.payment` allow. [CODE] `pes-account-role-rules.json:12` · [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:51`.
- ✅ **Disable a row** — `acc.services.disable` allow. [CODE] `pes-account-role-rules.json:13`.
- ❌ **Change visibility / edit price-type / edit price-value** — no `acc.services / visibility`, `edit-price-type`, `edit-price-value` actions exist in registry (Falcon-only). [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:51`.

### marketplace-applications (route `/marketplace-applications`)
- ✅ **Land on page** — `acc.services.view` allow. [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:91`.
- ✅ **Activate / Renew** — `acc.services.payment` allow.
- ✅ **Disable** — `acc.services.disable` allow.

### contact-groups (route `/contact-groups`)
- ✅ **Land on page** — `acc.contact-group.view` allow. [CODE] `pes-account-role-rules.json:26`.
- ✅ **Create (5-step wizard)** — `acc.contact-group.create` allow. [CODE] `pes-account-role-rules.json:27` · [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:62`.
- ✅ **Edit / Delete (own-only)** — expression-gated `r.obj.createdby == r.sub.userid`. FE overlays `session.identityUserId === row.createdByUserId` via `rowFlags()` helper. [CODE] `pes-account-role-rules.json:28-29` · [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md`.
- ✅ **Share (any group)** — `acc.contact-group.share` allow un-expressioned (wider than acc-user). [CODE] `pes-account-role-rules.json:30`.
- — **share-other** — no seed rule (silent deny — same as acc-admin / acc-user). [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:97`.
- ✅ **Download validated + original** — both allow. [CODE] `pes-account-role-rules.json:31-32`.
- — **View Shared Groups tab** — no `view-shared` rule (only acc-user has it). [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:62`.

### wallet-balance-management (route `/wallet-balance-management`)
- ✅ **Land on page** — app-level `app.management-console.view` allow (no route-level PES gate on mgmt side). [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:54`.
- ❌ **View Master Wallet card** — no `sys.master-wallet` rule for acc-\* (Falcon-only resource). [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:54`.
- ❌ **View / Edit wallet strategy** — no feature-scoped acc.\* keys exist; mgmt-console relies on server-driven `canSave` only. [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:54, 94`.
- ✅ **Transfer within own account** — server-driven `canSave: true` flag (no PES). Cross-account scope hardcoded to `session.tenantId ?? session.client_id`. [BRAIN-OUT] `04-feature-parity-matrix/wallet-balance-management.compare.md:42-43`.

### contracts-cost-management (route `/contracts-cost-management`)
- ✅ **Land on page** — `acc.contract.view` allow (**only acc-owner** — acc-admin / acc-user are explicit deny). [CODE] `pes-account-role-rules.json:25` · [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:54, 87`.
- ✅ **List + view contract detail** — same `acc.contract.view` allow gates both.
- ❌ **Create contract** — mgmt feature hardcodes `canEdit: false` and does not import the wizard component. [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:54`.
- ❌ **Edit contract** — same; mgmt-side feature is **read-only by design** even for acc-owner. [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:54, 64`.

### testing-charging
- ❌ Not present on mgmt-console (Falcon-only feature — security boundary). [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md:24, 96`.

### admin-console entry
- ❌ **Land on admin-console** — `app.admin-console.view` explicit **deny**. [CODE] `pes-account-role-rules.json:3` (`pes-account-role-rules.json:3` is the canonical line — it is explicitly denied per `pes-account-role-rules.json:3`).

## Role-edit reach

Source: [CODE] `BuiltInRoleCatalog.cs:48-56` (acc-owner row of `OtherRoleEditMatrix`).

| As actor → target's current role | Targets allowed |
|---|---|
| `sys-admin` | (empty) — cross-namespace impossible |
| `sys-ops` | (empty) — cross-namespace impossible |
| `sys-products` | (empty) — cross-namespace impossible |
| `acc-owner` | `acc-owner`, `acc-admin`, `acc-user` (full reach) |
| `acc-admin` | `acc-owner`, `acc-admin`, `acc-user` (full reach) |
| `acc-user` | `acc-owner`, `acc-admin`, `acc-user` (full reach) |

PES actions generated (sample):
- `user.role.other / change-acc-admin-to-acc-owner` → ✅ allow (promote)
- `user.role.other / change-acc-user-to-acc-admin` → ✅ allow (promote)
- `user.role.other / change-acc-owner-to-acc-user` → ✅ allow (demote)
- `user.role.other / change-sys-admin-to-acc-owner` → — silent deny (cross-namespace)
- `user.role.self / set-acc-owner` → ✅ allow (self-confirm)
- `user.role.self / set-acc-admin` → ❌ deny (cannot self-demote per `BuildSelfRoleEditPolicies` pattern)

**Headline:** acc-owner is the **only acc-\* role with full role-edit reach across all acc-\***. acc-admin cannot reach acc-owner; acc-user cannot reach anyone.

## Cross-references

- Compare roles: [[acc-admin.capability]] · [[acc-user.capability]] (this directory)
- Source role notes: [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- PES key universe: [[../03-pes-keys/REGISTRY-RAW]]
- Feature parity master matrix: [[../04-feature-parity-matrix/MATRIX]]
- Tenant-scoped `p`-rule template (authoritative): `C:\Falcon\Falcon\falcon-essentials\zitadel\pes-account-role-rules.json` (lines 2-32 are the acc-owner block)
- Catalog source of truth: `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs:171-210`
- Test login curl: `../07-cross-cutting/test-users.md`
- Subject-link rule: [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` (Zitadel id, NOT Mongo ObjectId, in `g`-rule `obj` field)
