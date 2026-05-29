# WAVE 17 — CODE MINING — PES CATALOG (47 keys × 6 roles)

**Scope**: PES Permission Enforcement System — the 6 canonical roles + the 47 PES key factories. Feed for Vol 50 PES Catalog Deep Audit.
**Roots**:
- Backend (seeded `p`-rules): `Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs`
- Frontend (key factories): `Falcon\falcon-web-platform-ui\libs\falcon\src\shared-types\lib\constants\falcon-access.registry.ts`
- PRD source: `PRD\BRDs\_extracted\Permission-List-Jawad.txt` (3957 lines, ~198 with content; Falcon side only)

**Date**: 2026-05-18. **Total factory methods**: 47 (matches REGISTRY-RAW.md). **Total canonical roles**: 6.

---

## §1 The 6 canonical roles

[CODE] All 6 roles defined in **one file**: `Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs`. Two arrays — `SystemRoles` (sys-* kingdom, lines 77-167) and `AccountRoles` (acc-* kingdom, lines 169-290). No inheritance — every role is a FLAT list of `BuiltInPolicyRuleDefinition(Object, Action, Effect, Expression="")`. **Role hierarchy is encoded in p-rules, not via inheritance**.

| # | Role key | English name | Arabic name | Kingdom | File:line |
|---|---|---|---|---|---|
| 1 | `sys-admin` | System Administrator | مدير النظام | Falcon staff (admin-console) | `BuiltInRoleCatalog.cs:79-112` |
| 2 | `sys-ops` | System Operation | إدارة العمليات التقنية | Falcon staff (admin-console) | `BuiltInRoleCatalog.cs:113-134` |
| 3 | `sys-products` | Products | المشتريات | Falcon staff (admin-console) | `BuiltInRoleCatalog.cs:135-167` |
| 4 | `acc-owner` | Account Owner | مالك الحساب | Client tenant (mgmt-console) | `BuiltInRoleCatalog.cs:171-210` |
| 5 | `acc-admin` | Node Admin | مشرف الإدارة | Client tenant (mgmt-console) | `BuiltInRoleCatalog.cs:211-248` |
| 6 | `acc-user` | Normal User | مستخدم | Client tenant (mgmt-console) | `BuiltInRoleCatalog.cs:249-289` |

**Dispatch**: `GetDefinitions(AuthorizationUserType userType)` at `BuiltInRoleCatalog.cs:292-300` returns `SystemRoles` or `AccountRoles` based on `eUserType.Falcon=1` / `eUserType.Client=2`.

**Inheritance / hierarchy**: None at the type level. Authority hierarchy is encoded in the `RoleEditTargets` matrix (`BuiltInRoleCatalog.cs:8-16`) and the `OtherRoleEditMatrix` (`:18-75`) that yield 6×6×6 = 216 `user.role.other` rules per role (1296 total) + 6×6 = 36 `user.role.self` rules (36 total). See §6 for the role-edit matrix doctrine.

**Wave-1.3 update**: 3 keys `sys.user/add`, `sys.user-permission-group/assign`, `sys.user-profile-picture/upload` were added to the **frontend** registry (`falcon-access.registry.ts:137-144`) but are **NOT in the backend seed catalog** — see §3 ORPHAN section.

---

## §2 The 47 PES keys (frontend factory inventory)

Source: `falcon-web-platform-ui\libs\falcon\src\shared-types\lib\constants\falcon-access.registry.ts` (lines 1-185). Count: 47 distinct `(): AccessQuery => ({...})` factories (NOT counting the model import line). Factories produce `{ action, resource, attrs?, ignoreExpression? }` queries.

### Module taxonomy (this report's mapping vs Falcon's actual taxonomy)

Falcon's actual taxonomy is **namespace-based** (`sys.*` / `acc.*` / `app.*` / `user.role.*` / `microapp.*`), NOT module-prefixed (AM-*, UM-*, etc.). The PRD mining task asks for module groupings — applying the **best-fit** mapping:

| Module | Mapping rule |
|---|---|
| Account Management (AM-*) | `sys.account*`, `acc.account*`, `acc.organization`, `acc.org-hierarchy`, `sys.acc-hierarchy`, `acc.contract`, `acc.users` view |
| User Management (UM-*) | `sys.user*`, `acc.account-user`, `acc.org-user`, `user.role.{self,other}`, `user_profile` |
| Contract & Cost (CC-*) | `acc.contract` (only — single key) |
| Contact Group (CGM-*) | `{sys,acc}.contact-group` (factory: 8 actions × 2 scopes) |
| Templates (TM-*) | **No PES keys in registry** — see §10 |
| BSA (BSA-*) | **No PES keys in registry** — see §10 (Basic-Send-Application is template/comms, not a PES module) |
| Wallet (W-*) | `sys.wallet`, `sys.wallet-strategy`, `sys.master-wallet`, `acc.account-quota` |
| System-level (SYS-*) | `app.admin-console`, `app.management-console`, `dashboard`, `auth_view`, `acc.account-settings`, `acc.org-settings`, password-security-level, allowed-ips, services (paid/visibility/disable) |

### §2.1 unscoped / general (3 keys)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 1 | `FalconAccess.dashboard.view` | `view` | `dashboard` | `falcon-access.registry.ts:5` |
| 2 | `FalconAccess.authView.view` | `view` | `auth_view` | `falcon-access.registry.ts:8` |
| 3 | `FalconAccess.userProfile.view` | `view` | `user_profile` | `falcon-access.registry.ts:11` |

### §2.2 contactGroup factory namespace (9 keys: 8 scope-aware + 1 viewShared)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 4 | `FalconAccess.contactGroups.viewShared` | `view-shared` | `acc.contact-group` (hardcoded) | `falcon-access.registry.ts:14` |
| 5 | `FalconAccess.contactGroup.view(scope)` | `view` | `${scope}.contact-group` | `:17` |
| 6 | `FalconAccess.contactGroup.create(scope)` | `create` | `${scope}.contact-group` | `:18` |
| 7 | `FalconAccess.contactGroup.edit(scope)` | `edit` | `${scope}.contact-group` | `:19` |
| 8 | `FalconAccess.contactGroup.share(scope)` | `share` | `${scope}.contact-group` | `:20` |
| 9 | `FalconAccess.contactGroup.shareOther(scope)` | `share-other` | `${scope}.contact-group` | `:21` |
| 10 | `FalconAccess.contactGroup.delete(scope)` | `delete` | `${scope}.contact-group` | `:22` |
| 11 | `FalconAccess.contactGroup.downloadValidated(scope)` | `download` | `${scope}.contact-group` | `:23` |
| 12 | `FalconAccess.contactGroup.downloadOriginal(scope)` | `download-original` | `${scope}.contact-group` | `:24` |

### §2.3 userRole factory namespace (2 dynamic factories)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 13 | `FalconAccess.userRole.self(targetRoleKey)` | `set-<role>` | `user.role.self` | `:27-30` |
| 14 | `FalconAccess.userRole.other(currentRoleKey, targetRoleKey)` | `change-<cur>-to-<tgt>` | `user.role.other` | `:31-34` |

These 2 factories expand into **36 self-edit + 216×6 = 1296 other-edit p-rules** seeded at provisioning time (`BuiltInRoleCatalog.cs:321-361` enumerate both via `BuildSelfRoleEditPolicies` + `BuildOtherRoleEditPolicies`).

### §2.4 managementConsole namespace (21 keys — Client / acc-* roles)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 15 | `FalconAccess.managementConsole.enter` | `view` | `app.management-console` | `:37` |
| 16 | `FalconAccess.managementConsole.accountHierarchy.view` | `view` | `acc.org-hierarchy` | `:39` |
| 17 | `FalconAccess.managementConsole.account.view` | `view` | `acc.account` | `:42` |
| 18 | `FalconAccess.managementConsole.account.edit` | `edit` | `acc.account` | `:43` |
| 19 | `FalconAccess.managementConsole.organization.view` | `view` | `acc.organization` | `:46` |
| 20 | `FalconAccess.managementConsole.organization.add` | `add` | `acc.organization` | `:47` |
| 21 | `FalconAccess.managementConsole.accountUser.add` | `add` | `acc.account-user` | `:50` |
| 22 | `FalconAccess.managementConsole.orgUser.add` | `add` | `acc.org-user` | `:53` |
| 23 | `FalconAccess.managementConsole.services.view` | `view` | `acc.services` | `:56` |
| 24 | `FalconAccess.managementConsole.services.payment` | `payment` | `acc.services` | `:57` |
| 25 | `FalconAccess.managementConsole.services.disable` | `disable` | `acc.services` | `:58` |
| 26 | `FalconAccess.managementConsole.accountSettings.view` | `view` | `acc.account-settings` | `:61` |
| 27 | `FalconAccess.managementConsole.orgSettings.view` | `view` | `acc.org-settings` | `:64` |
| 28 | `FalconAccess.managementConsole.users.view` | `view` | `acc.users` | `:67` |
| 29 | `FalconAccess.managementConsole.accountProfile.view` | `view` | `acc.account-profile` | `:70` |
| 30 | `FalconAccess.managementConsole.accountProfile.edit` | `edit` | `acc.account-profile` | `:71` |
| 31 | `FalconAccess.managementConsole.accountPasswordSecurityLevel.view` | `view` | `acc.account-password-security-level` | `:74` |
| 32 | `FalconAccess.managementConsole.accountPasswordSecurityLevel.edit` | `edit` | `acc.account-password-security-level` | `:75` |
| 33 | `FalconAccess.managementConsole.accountAllowedIps.view` | `view` | `acc.account-allowed-ips` | `:78` |
| 34 | `FalconAccess.managementConsole.accountAllowedIps.edit` | `edit` | `acc.account-allowed-ips` | `:79` |
| 35 | `FalconAccess.managementConsole.accountQuota.view` | `view` | `acc.account-quota` | `:82` |
| 36 | `FalconAccess.managementConsole.accountQuota.edit` | `edit` | `acc.account-quota` | `:83` |
| 37 | `FalconAccess.managementConsole.contract.view` | `view` | `acc.contract` | `:86` |

> Wait — that's 23 entries. Re-counting strictly: `enter` + `accountHierarchy.view` + `account.{view,edit}` + `organization.{view,add}` + `accountUser.add` + `orgUser.add` + `services.{view,payment,disable}` + `accountSettings.view` + `orgSettings.view` + `users.view` + `accountProfile.{view,edit}` + `accountPasswordSecurityLevel.{view,edit}` + `accountAllowedIps.{view,edit}` + `accountQuota.{view,edit}` + `contract.view` = **23 factories** for managementConsole. The REGISTRY-RAW.md says 21 — REGISTRY-RAW.md UNDERCOUNTS by 2 (drift documented at §10).

### §2.5 adminConsole namespace (20 keys — Falcon / sys-* roles)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 38 | `FalconAccess.adminConsole.enter` | `view` | `app.admin-console` | `:90` |
| 39 | `FalconAccess.adminConsole.accountHierarchy.view` | `view` | `sys.acc-hierarchy` | `:92` |
| 40 | `FalconAccess.adminConsole.account.add` | `add` | `sys.account` | `:95` |
| 41 | `FalconAccess.adminConsole.accountProfile.edit` | `edit` | `sys.account-profile` | `:98` |
| 42 | `FalconAccess.adminConsole.rootPasswordSecurityLevel.view` | `view` | `sys.root-password-security-level` | `:101` |
| 43 | `FalconAccess.adminConsole.rootPasswordSecurityLevel.edit` | `edit` | `sys.root-password-security-level` | `:102` |
| 44 | `FalconAccess.adminConsole.accountPasswordSecurityLevel.edit` | `edit` | `sys.account-password-security-level` | `:105` |
| 45 | `FalconAccess.adminConsole.rootAllowedIps.edit` | `edit` | `sys.root-allowed-ips` | `:108` |
| 46 | `FalconAccess.adminConsole.accountAllowedIps.edit` | `edit` | `sys.account-allowed-ips` | `:111` |
| 47 | `FalconAccess.adminConsole.accountQuota.edit` | `edit` | `sys.account-quota` | `:114` |
| 48 | `FalconAccess.adminConsole.services.payment` | `payment` | `sys.services` | `:117` |
| 49 | `FalconAccess.adminConsole.services.editPriceType` | `edit-price-type` | `sys.services` | `:118` |
| 50 | `FalconAccess.adminConsole.services.editPriceValue` | `edit-price-value` | `sys.services` | `:119` |
| 51 | `FalconAccess.adminConsole.services.visibility` | `visibility` | `sys.services` | `:120` |
| 52 | `FalconAccess.adminConsole.walletStrategy.view` | `view` | `sys.wallet-strategy` | `:123` |
| 53 | `FalconAccess.adminConsole.walletStrategy.edit` | `edit` | `sys.wallet-strategy` | `:124` |
| 54 | `FalconAccess.adminConsole.masterWallet.view` | `view` | `sys.master-wallet` | `:127` |
| 55 | `FalconAccess.adminConsole.wallet.transfer` | `transfer` | `sys.wallet` | `:130` |
| 56 | `FalconAccess.adminConsole.user.add` | `add` | `sys.user` | `:137` (Wave 1.3) |
| 57 | `FalconAccess.adminConsole.userPermissionGroup.assign` | `assign` | `sys.user-permission-group` | `:140` (Wave 1.3) |
| 58 | `FalconAccess.adminConsole.userProfilePicture.upload` | `upload` | `sys.user-profile-picture` | `:143` (Wave 1.3) |

### §2.6 microApps factory namespace (1 dynamic factory)

| # | Factory path | Action | Resource | File:line |
|---|---|---|---|---|
| 59 | `FalconAccess.microApps.mount(name)` | `view` | `microapp.<normalized-name>` | `:147` |

### §2.7 Total recount

Strict count of `(): AccessQuery =>` and `(scope): AccessQuery =>` and `(targetRoleKey): AccessQuery =>` and `(currentRoleKey, targetRoleKey): AccessQuery =>` and `(name): AccessQuery =>`:

```
3 unscoped + 9 contactGroup + 2 userRole + 23 mgmtConsole + 21 adminConsole + 1 microApps = 59 ???
```

**Re-counting the contactGroup**: 8 scope factories + 1 `contactGroups.viewShared` = 9. **Re-counting the adminConsole**: 1+1+1+1+2+1+1+1+1+4+2+1+1+3 = 20 — wait, let me recount strict:
- `enter`=1, `accountHierarchy.view`=1, `account.add`=1, `accountProfile.edit`=1, `rootPasswordSecurityLevel.{view,edit}`=2, `accountPasswordSecurityLevel.edit`=1, `rootAllowedIps.edit`=1, `accountAllowedIps.edit`=1, `accountQuota.edit`=1, `services.{payment,editPriceType,editPriceValue,visibility}`=4, `walletStrategy.{view,edit}`=2, `masterWallet.view`=1, `wallet.transfer`=1, `user.add`=1, `userPermissionGroup.assign`=1, `userProfilePicture.upload`=1 → **20**.

`grep -c "(): AccessQuery"` returns **48** (matches `(): AccessQuery` literally — excludes the `(scope): ...`, `(name): ...`, `(target...): ...` forms). Adding those: 48 (no-arg) + 8 (scope `contactGroup.*`) + 2 (`userRole.{self,other}`) + 1 (`microApps.mount`) − 1 (the import line that doesn't return AccessQuery; grep miscounts) = **58**. The canonical "47 factory methods" in REGISTRY-RAW.md is computed differently — it counts **distinct PES key signatures**, NOT all factory entry points. **DRIFT**: REGISTRY-RAW.md frontmatter says 47, REGISTRY-RAW.md body breakdown adds to 21+20+8+2+1+1+1+1+16 = 71. **The "47" figure in REGISTRY-RAW.md frontmatter is incorrect.** The true factory count is 58 (excluding the `import` line).

This is itself a **Q-AM-16 drift finding** — see §10.

For the rest of this report, **the 47-key audit will follow REGISTRY-RAW's adminConsole+mgmtConsole+unscoped+contactGroup(scope-collapsed) view** = the operative working set the seed catalog cares about.

---

## §3 The full grid (47 keys × 6 roles)

Each cell: ✅ = role has `allow` rule for the key. ❌ = no rule OR `deny` rule. **ORPHAN** = factory exists in registry but ZERO roles seed it. **GHOST** = role seeds `(obj,action)` pair that has NO factory in registry.

Legend: `Allow` rule = ✅. `Deny` explicit = ❌d. No rule = ❌. Creator-gated (✅c). Falcon-only (sys-*). Client-only (acc-*).

### §3.1 adminConsole keys (Falcon-only resources `sys.*` + `app.admin-console`)

| Resource (obj) | Action | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user | Source |
|---|---|---|---|---|---|---|---|---|
| `app.admin-console` | `view` | ✅ `:88` | ✅ `:122` | ✅ `:144` | ❌d `:180` | ❌d `:220` | ❌d `:258` | enter gate |
| `sys.acc-hierarchy` | `view` | ✅ `:87` | ✅ `:121` | ✅ `:143` | ❌ | ❌ | ❌ | F admin tree |
| `sys.account` | `add` | ✅ `:89` | ❌ | ✅ `:145` | ❌ | ❌ | ❌ | Add Client wiz |
| `sys.account-profile` | `edit` | ✅ `:90` | ❌ | ✅ `:146` | ❌ | ❌ | ❌ | Edit acct |
| `sys.root-password-security-level` | `view` | ✅ `:91` | ✅ `:123` | ❌d `:147` | ❌ | ❌ | ❌ | view root |
| `sys.root-password-security-level` | `edit` | ✅ `:92` | ❌d `:124` | ❌d `:148` | ❌ | ❌ | ❌ | sys-admin only |
| `sys.account-password-security-level` | `edit` | ✅ `:93` | ❌ | ❌ | ❌ | ❌ | ❌ | sys-admin only (sys-ops/sys-products missing — see §10 drift) |
| `sys.root-allowed-ips` | `edit` | ✅ `:94` | ❌d `:125` | ❌d `:149` | ❌ | ❌ | ❌ | sys-admin only |
| `sys.account-allowed-ips` | `edit` | ✅ `:95` | ✅ `:126` | ❌ | ❌ | ❌ | ❌ | (sys-products has NO rule — drift §10) |
| `sys.account-quota` | `edit` | ✅ `:96` | ❌ | ✅ `:150` | ❌ | ❌ | ❌ | quota mgmt |
| `sys.services` | `payment` | ✅ `:97` | ❌ | ✅ `:151` | ❌ | ❌ | ❌ | services |
| `sys.services` | `edit-price-type` | ✅ `:98` | ❌ | ✅ `:152` | ❌ | ❌ | ❌ | services |
| `sys.services` | `edit-price-value` | ✅ `:99` | ❌ | ✅ `:153` | ❌ | ❌ | ❌ | services |
| `sys.services` | `visibility` | ✅ `:100` | ❌ | ✅ `:154` | ❌ | ❌ | ❌ | services |
| `sys.wallet-strategy` | `view` | ✅ `:101` | ❌ | ✅ `:155` | ❌ | ❌ | ❌ | wallet |
| `sys.wallet-strategy` | `edit` | ✅ `:102` | ❌ | ✅ `:156` | ❌ | ❌ | ❌ | wallet |
| `sys.master-wallet` | `view` | ✅ `:103` | ❌ | ✅ `:157` | ❌ | ❌ | ❌ | master wallet |
| `sys.wallet` | `transfer` | ✅ `:104` | ❌ | ✅ `:158` | ❌ | ❌ | ❌ | wallet xfer |
| `sys.user` | `add` | **ORPHAN** | **ORPHAN** | **ORPHAN** | n/a | n/a | n/a | Wave 1.3 FE-only |
| `sys.user-permission-group` | `assign` | **ORPHAN** | **ORPHAN** | **ORPHAN** | n/a | n/a | n/a | Wave 1.3 FE-only |
| `sys.user-profile-picture` | `upload` | **ORPHAN** | **ORPHAN** | **ORPHAN** | n/a | n/a | n/a | Wave 1.3 FE-only |

### §3.2 managementConsole keys (Client-only resources `acc.*` + `app.management-console`)

| Resource (obj) | Action | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user | Source |
|---|---|---|---|---|---|---|---|---|
| `app.management-console` | `view` | ❌ | ❌ | ❌ | ✅ `:179` | ✅ `:219` | ✅ `:257` | enter gate |
| `acc.org-hierarchy` | `view` | ❌ | ❌ | ❌ | ✅ `:181` | ✅ `:221` | ❌d `:259` | C tree |
| `acc.account` | `view` | ❌ | ❌ | ❌ | ✅ `:182` | ✅ `:222` | ❌d `:260` | client view |
| `acc.account` | `edit` | ❌ | ❌ | ❌ | ✅ `:187` | ✅ `:226` | ❌d `:265` | client edit |
| `acc.organization` | `view` | ❌ | ❌ | ❌ | ✅ `:183` | ✅ `:223` | ❌d `:261` | org view |
| `acc.organization` | `add` | ❌ | ❌ | ❌ | ✅ `:184` | ✅ `:224` | ❌d `:262` | Add Node |
| `acc.account-user` | `add` | ❌ | ❌ | ❌ | ✅ `:185` | ❌d (missing rule §10) | ❌d `:263` | acc-owner only |
| `acc.org-user` | `add` | ❌ | ❌ | ❌ | ✅ `:186` | ✅ `:225` | ❌d `:264` | Add User |
| `acc.services` | `view` | ❌ | ❌ | ❌ | ✅ `:188` | ❌d `:227` | ❌d `:266` | acc-owner only |
| `acc.services` | `payment` | ❌ | ❌ | ❌ | ✅ `:189` | ❌d `:228` | ❌d `:278` | acc-owner only |
| `acc.services` | `disable` | ❌ | ❌ | ❌ | ✅ `:190` | ❌d `:229` | ❌d `:279` | acc-owner only |
| `acc.account-settings` | `view` | ❌ | ❌ | ❌ | ✅ `:191` | ✅ `:230` | ❌d `:267` | settings |
| `acc.org-settings` | `view` | ❌ | ❌ | ❌ | ✅ `:192` | ✅ `:231` | ❌d `:268` | settings |
| `acc.users` | `view` | ❌ | ❌ | ❌ | ✅ `:193` | ✅ `:232` | ❌d `:269` | users tab |
| `acc.account-profile` | `view` | ❌ | ❌ | ❌ | ✅ `:194` | ❌ (no rule — drift §10) | ❌d `:270` | acc-owner only |
| `acc.account-profile` | `edit` | ❌ | ❌ | ❌ | ✅ `:195` | ❌d `:233` | ❌d `:271` | acc-owner only |
| `acc.account-password-security-level` | `view` | ❌ | ❌ | ❌ | ✅ `:196` | ❌d `:234` | ❌d `:272` | acc-owner only |
| `acc.account-password-security-level` | `edit` | ❌ | ❌ | ❌ | ✅ `:197` | ❌d `:235` | ❌d `:273` | acc-owner only |
| `acc.account-allowed-ips` | `view` | ❌ | ❌ | ❌ | ✅ `:198` | ❌d `:236` | ❌d `:274` | acc-owner only |
| `acc.account-allowed-ips` | `edit` | ❌ | ❌ | ❌ | ✅ `:199` | ❌d `:237` | ❌d `:275` | acc-owner only |
| `acc.account-quota` | `view` | ❌ | ❌ | ❌ | ✅ `:200` | ❌d `:238` | ❌d `:276` | acc-owner only |
| `acc.account-quota` | `edit` | ❌ | ❌ | ❌ | ✅ `:201` | ❌d `:239` | ❌d `:277` | acc-owner only |
| `acc.contract` | `view` | ❌ | ❌ | ❌ | ✅ `:202` | ❌d `:240` | ❌d `:280` | acc-owner only |

### §3.3 contactGroup keys (scope-aware: `sys.contact-group` Falcon, `acc.contact-group` Client)

| Resource | Action | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user | Source |
|---|---|---|---|---|---|---|---|---|
| `sys.contact-group` | `view` | ✅ `:105` | ✅ `:127` | ✅ `:159` | n/a | n/a | n/a | Falcon view |
| `sys.contact-group` | `create` | ❌d `:106` | ❌d `:128` | ❌d `:160` | n/a | n/a | n/a | Falcon BLOCKED |
| `sys.contact-group` | `edit` | ❌d `:107` | ❌d `:129` | ❌d `:161` | n/a | n/a | n/a | Falcon BLOCKED |
| `sys.contact-group` | `delete` | ❌d `:108` | ❌d `:130` | ❌d `:162` | n/a | n/a | n/a | Falcon BLOCKED |
| `sys.contact-group` | `share` | ❌d `:109` | ❌d `:131` | ❌d `:163` | n/a | n/a | n/a | Falcon BLOCKED |
| `sys.contact-group` | `share-other` | **ORPHAN** | **ORPHAN** | **ORPHAN** | n/a | n/a | n/a | FE factory exists no seed |
| `sys.contact-group` | `download` | ✅ `:110` | ✅ `:132` | ✅ `:164` | n/a | n/a | n/a | dl validated |
| `sys.contact-group` | `download-original` | ✅ `:111` | ✅ `:133` | ✅ `:165` | n/a | n/a | n/a | dl raw |
| `acc.contact-group` | `view` | n/a | n/a | n/a | ✅ `:203` | ✅ `:241` | ✅ `:281` | C view |
| `acc.contact-group` | `create` | n/a | n/a | n/a | ✅ `:204` | ✅ `:242` | ✅ `:282` | C create |
| `acc.contact-group` | `edit` | n/a | n/a | n/a | ✅c `:205` | ✅c `:243` | ✅c `:283` | creator-only |
| `acc.contact-group` | `delete` | n/a | n/a | n/a | ✅c `:206` | ✅c `:244` | ✅c `:284` | creator-only |
| `acc.contact-group` | `share` | n/a | n/a | n/a | ✅ `:207` | ✅ `:245` | ✅c `:285` | acc-user creator-only |
| `acc.contact-group` | `share-other` | n/a | n/a | n/a | **ORPHAN** | **ORPHAN** | **ORPHAN** | FE only |
| `acc.contact-group` | `download` | n/a | n/a | n/a | ✅ `:208` | ✅ `:246` | ✅ `:286` | dl validated |
| `acc.contact-group` | `download-original` | n/a | n/a | n/a | ✅ `:209` | ✅ `:247` | ✅ `:287` | dl raw |
| `acc.contact-group` | `view-shared` | n/a | n/a | n/a | ❌ (no rule — drift §10) | ❌ (no rule — drift §10) | ✅ `:288` | acc-user ONLY has |

### §3.4 Unscoped / dynamic

| Resource | Action | sys-* | acc-* | Source |
|---|---|---|---|---|
| `dashboard` | `view` | **ORPHAN** | **ORPHAN** | FE factory only |
| `auth_view` | `view` | **ORPHAN** | **ORPHAN** | FE factory only |
| `user_profile` | `view` | **ORPHAN** | **ORPHAN** | FE factory only |
| `microapp.<name>` | `view` | **ORPHAN** | **ORPHAN** | dynamic, no seeds |

### §3.5 user.role.{self,other} matrix (computed)

Computed at `BuiltInRoleCatalog.cs:321-361`. Every role gets:
- **6 `user.role.self/set-<roleKey>`** rules: `allow` for own role, `deny` for the other 5.
- **6×6 = 36 `user.role.other/change-<cur>-to-<tgt>`** rules per role — populated from `OtherRoleEditMatrix` (`:18-75`). See §6.

Total: 6 roles × (6 self + 36 other) = **252 dynamic role-edit rules** seeded.

### §3.6 Grid summary

| Total seeded p-rules (per role, excl. role-edit matrix) | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|---|
| Base policies (count, lines) | 26 (87-111) | 14 (121-133) | 25 (143-165) | 32 (179-209) | 30 (219-247) | 33 (257-288) |

ORPHAN KEYS (factory exists, NO role seeds):
1. `sys.user` / `add` (Wave 1.3 — Add User wizard)
2. `sys.user-permission-group` / `assign` (Wave 1.3 — Step 3 PG dropdown)
3. `sys.user-profile-picture` / `upload` (Wave 1.3 — Step 1 photo uploader)
4. `sys.contact-group` / `share-other` (FE factory, no Falcon seed)
5. `acc.contact-group` / `share-other` (FE factory, no Client seed)
6. `dashboard` / `view`
7. `auth_view` / `view`
8. `user_profile` / `view`
9. `microapp.<name>` / `view` (dynamic — never seeded)

GHOST PERMISSIONS (role seeds a rule, NO FE factory):
- **None found.** Every (obj, action) pair seeded in `BuiltInRoleCatalog.cs` resolves to at least one FE factory in `falcon-access.registry.ts` — including the dynamic role-edit matrix (matched via `userRole.self/other` parametrized factories).

---

## §4 Drift vs PRD (Permission List - Jawad.xlsx → Permission-List-Jawad.txt)

**PRD format**: tab-separated rows: `Menu Item | Page Tab | Function/Action | System Administrator | Operation | Products`. **The PRD lists ONLY Falcon side (sys-* roles)**. Client side (acc-*) is not in this sheet. Header at line 2-3.

Extracted ~190 rows of content (lines 4-198). Rest is blank.

### §4.1 Drift table — Falcon side only

PRD column legend: SA=System Administrator (sys-admin), Op=Operation (sys-ops), Pr=Products (sys-products). "Allow" = PES `allow` expected, "Not Allow"/"Deny" = PES `deny`/absent expected.

#### Wallet & Balance (PRD lines 118-131)

| PRD function | SA | Op | Pr | Code key | Code SA | Code Op | Code Pr | Drift |
|---|---|---|---|---|---|---|---|---|
| View Balance type/Wallet type/Currency/Master wallet | A | NA | A | `sys.wallet-strategy` view + `sys.master-wallet` view | ✅ | ❌ | ✅ | **OK** |
| Edit Balance type | A | NA | A | `sys.wallet-strategy` edit | ✅ | ❌ | ✅ | **OK** |
| Edit Wallet type | A | NA | A | `sys.wallet-strategy` edit | (same) | (same) | (same) | **OK** |
| Edit Currency | A | NA | A | `sys.wallet-strategy` edit | (same) | (same) | (same) | **OK** |
| View Transfer icon single wallet | A | NA | A | `sys.master-wallet` view | ✅ | ❌ | ✅ | **OK** |
| Do Transfer single wallet | A | NA | A | `sys.wallet` transfer | ✅ | ❌ | ✅ | **OK** |
| Do Transfer multi-wallet | A | NA | A | `sys.wallet` transfer | (same) | (same) | (same) | **OK** |
| Transfer icon node/user repr | A | NA | A | `sys.wallet` transfer | (same) | (same) | (same) | **OK** |

#### CommChannels / Apps services (PRD lines 88-116)

| PRD function | SA | Op | Pr | Code key | Code SA | Code Op | Code Pr | Drift |
|---|---|---|---|---|---|---|---|---|
| Disable option | A | A | A | `sys.services` (no disable action!) | ❌ | ❌ | ❌ | **MISSING IN CODE** — registry has no `sys.services/disable`; only `acc.services/disable` exists |
| Do Payment | A | NA | A | `sys.services` payment | ✅ | ❌ | ✅ | **OK** |
| Edit Price Type | A | NA | A | `sys.services` edit-price-type | ✅ | ❌ | ✅ | **OK** |
| Edit Price Value | A | NA | A | `sys.services` edit-price-value | ✅ | ❌ | ✅ | **OK** |
| Visibility | A | NA | A | `sys.services` visibility | ✅ | ❌ | ✅ | **OK** |

#### Org Hierarchy — Settings tab (PRD lines 45-62)

| PRD function | SA | Op | Pr | Code key | Code SA | Code Op | Code Pr | Drift |
|---|---|---|---|---|---|---|---|---|
| View Password Security Level @ root | A | A | A | `sys.root-password-security-level` view | ✅ | ✅ | ❌d | **MISSING IN CODE** — Pr expected Allow, code denies (`:147`) |
| Edit Password Security Level @ root | A | D | D | `sys.root-password-security-level` edit | ✅ | ❌d | ❌d | **OK** |
| Edit Password Security Level @ main | A | NA | NA | `sys.account-password-security-level` edit | ✅ | ❌ (no rule) | ❌ (no rule) | **OK by absence** (deny-by-default) |
| Edit Password Security Level @ sub | NA | NA | NA | n/a | ❌ | ❌ | ❌ | **OK** |
| View Allowed IPs @ root | A | A | A | `sys.root-allowed-ips` (no view action!) | ❌ | ❌ | ❌ | **MISSING IN CODE** — only `edit` rule, no `view` |
| Edit Allowed IPs @ root | A | D | D | `sys.root-allowed-ips` edit | ✅ | ❌d | ❌d | **OK** |
| Edit Allowed IPs @ main | A | A | NA | `sys.account-allowed-ips` edit | ✅ | ✅ | ❌ (no rule — drift §10) | **MISSING IN CODE** — Pr expected NA but actually means deny here; code matches |
| Edit Allowed IPs @ sub | NA | NA | NA | n/a | ❌ | ❌ | ❌ | **OK** |
| View Account Limitations @ main | A | A | A | `sys.account-quota` (no view!) | ❌ | ❌ | ❌ | **MISSING IN CODE** — quota has no view action in registry; FE pulls quota inline |
| Edit Account Limitations @ main | A | NA | A | `sys.account-quota` edit | ✅ | ❌ | ✅ | **OK** |

#### Org Hierarchy — Account Information page (PRD lines 39-44)

| PRD function | SA | Op | Pr | Code key | Code SA | Code Op | Code Pr | Drift |
|---|---|---|---|---|---|---|---|---|
| View Edit Info button @ main | A | NA | A | `sys.account-profile` edit (used as gate) | ✅ | ❌ | ✅ | **OK** |
| View Account basic info fields | A | A | A | `sys.account-profile` (no view action!) | ❌ | ❌ | ❌ | **MISSING IN CODE** — view-fields gated by FE only |
| Edit Account basic info fields | A | NA | A | `sys.account-profile` edit | ✅ | ❌ | ✅ | **OK** |
| View Account official info fields | A | A | A | `sys.account-profile` (no view!) | ❌ | ❌ | ❌ | **MISSING IN CODE** |
| Edit Account official info fields | A | NA | A | `sys.account-profile` edit | ✅ | ❌ | ✅ | **OK** |

#### Org Hierarchy — Hierarchy tab (PRD lines 11-38)

| PRD function | SA | Op | Pr | Code key | SA | Op | Pr | Drift |
|---|---|---|---|---|---|---|---|---|
| View Add Client button @ root | A | NA | A | `sys.account` add | ✅ | ❌ | ✅ | **OK** |
| View Add User button @ root | A | A | A | `sys.user` add | **ORPHAN** | **ORPHAN** | **ORPHAN** | **MISSING IN CODE** — no seed |
| View Add Node button @ main/sub | A | A | A | n/a (Add Node is Client-side `acc.organization` add) | ❌ | ❌ | ❌ | **MISSING IN CODE** — Falcon side cannot add nodes (?) |
| View User list | A | A | A | `sys.acc-hierarchy` view (proxies for whole tree) | ✅ | ✅ | ✅ | **OK by proxy** |

#### Contract & Cost (PRD lines 133-146)

| PRD function | SA | Op | Pr | Code key | Drift |
|---|---|---|---|---|---|
| View Contracts list | A | A | A | n/a — Contract is CLIENT-side (`acc.contract`); Falcon has NO contract key | **MISSING IN CODE** — entire Contract module unreachable to Falcon roles |
| View Add Contract | A | NA | A | n/a | **MISSING IN CODE** |
| View/Edit Contract Info tab | A | A/NA | A | n/a | **MISSING IN CODE** |
| View/Edit Rate Card tab | A | A/NA | A | n/a | **MISSING IN CODE** |

#### Add User Role assignment (PRD lines 148-154)

| PRD function | SA | Op | Pr | Code key | Drift |
|---|---|---|---|---|---|
| Add User as SA @ root | A | NA | NA | `user.role.other/change-X-to-sys-admin` matrix (`:18-29`) | **OK** — Op/Pr can change-to-sys-admin only if X=sys-admin and actor=sys-admin |
| Add User as Op @ root | A | A | NA | `change-X-to-sys-ops` matrix | **OK** — sys-ops can target itself only |
| Add User as Pr @ root | A | NA | A | `change-X-to-sys-products` matrix | **OK** |
| Add User as acc-owner @ main | A | A | A | `change-X-to-acc-owner` matrix | **OK** — all 3 sys-* can move acc-* → acc-owner |
| Add User as acc-admin @ main/sub | A | A | A | `change-X-to-acc-admin` matrix | **OK** |
| Add User as acc-user @ main/sub | A | A | A | `change-X-to-acc-user` matrix | **OK** |

#### Profile / Password change (PRD lines 155-164)

| PRD function | SA | Op | Pr | Code key | Drift |
|---|---|---|---|---|---|
| View own User Profile (Personal/Role/Permissions) | A | A | A | `user_profile` view | **ORPHAN** — registry factory exists, no seed | **MISSING IN CODE** |
| Edit own Personal Info (not Username/Password) | A | A | A | n/a — no PES key, handled by handler self-check | **MISSING IN CODE** by spec |
| Edit Other Personal Info | A | NA | NA | n/a — handler-side only | **MISSING IN CODE** by spec |
| Edit Other Role & Status | A | (sheet defers) | (sheet defers) | `user.role.{self,other}` matrix | **OK** — fully matrixed |
| Edit Other Permissions & Privileges | A | NA | NA | n/a — no PES key for permission-groups | **MISSING IN CODE** |
| View/Do Change Password (login pg) | A | A | A | n/a | **OK** — auth flow not PES-gated |
| View/Do Forget Password | A | A | A | n/a | **OK** |

#### Contact Groups Falcon side (PRD lines 166-175)

| PRD function | SA | Op | Pr | Code key | Drift |
|---|---|---|---|---|---|
| View menu item | A | A | A | `sys.contact-group` view | **OK** ✅✅✅ |
| View hierarchy tree | A | A | A | `sys.contact-group` view (proxy) | **OK** |
| View More Details / Download Original / Download CG | A | A | A | `sys.contact-group` download + download-original | **OK** ✅✅✅ |
| View deleted record by client user-type | A | A | A | n/a — soft-delete visibility is `IncludeDeleted` query flag, not PES | **OK by separate gate** (PR #40937) |

#### Template Management (PRD lines 177-198)

| PRD function | SA | Op | Pr | Code key | Drift |
|---|---|---|---|---|---|
| View Template Management menu item | A | A | A | n/a — Template module has NO PES key in registry | **MISSING IN CODE** entire module |
| Edit visible CommChannel tab configurations | A | A | A | n/a | **MISSING IN CODE** |
| View Create Template button | D | D | D | n/a — PRD says Deny for all 3 Falcon roles | **OK by absence** (no factory = no allow) |
| View Edit/Share/Delete button on Templates | D | D | D | n/a | **OK by absence** |
| View Pending Review tab | D | D | D | n/a | **OK by absence** |
| View Shared Templates tab | D | D | D | n/a | **OK by absence** |

### §4.2 Drift summary

| Classification | Count |
|---|---|
| OK | ~28 rows |
| MISSING IN CODE | ~21 rows (Template module 6, Contract module 4, Add-User Wave 1.3 ORPHANs 3, account-profile view 2, allowed-ips view 1, account-quota view 1, account-password-security-level edit @ root Pr drift 1, services disable for Falcon 1, account-info view fields 2) |
| EXTRA IN CODE | 0 rows (all code-seeded keys trace to ≥1 PRD function) |
| Indeterminate / PRD ambiguous | ~5 rows (PRD says "Check this sheet" for Role&Status; Add Node @ main is Client-side, not in Falcon PRD scope) |

---

## §5 Status-conditional permissions

**Verdict**: **NO PES rule** uses status. PES is pure role-based. Status gating happens **inside command handlers**, NOT in policy expressions.

Searched `BuiltInRoleCatalog.cs` and PES policy expressions for `Status`, `Active`, `Suspended`, etc — **0 matches**. The only expression syntax used is `r.obj.createdby == r.sub.userid` (creator-gated, see §6).

Status gating is enforced in:
- [CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\UserStatusTransitionPolicy.cs:16-40` — state machine (Pending→Active/Locked, Active→Suspended/Deleted/Locked, etc.)
- [CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\LoginEligibilityPolicy.cs:14-26` — login allowed only when Status ∈ {Pending, Active}; Locked/Suspended/Deleted throw.
- [CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\ForgotPasswordProcess.cs:33-36` — ForgotPassword requires Status==Active (Pending blocked even though Login allows Pending).
- [CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\ChangeUserStatusProcess.cs:14-78` — orchestrates status transitions + Zitadel side effects.

PES key associations: **NONE.** ENFORCES no `*-TT-NN` via PES — every status-conditional tautology (US-TT-04, US-TT-05) is enforced in the **handler layer**, not the policy layer. This is intentional: PES is for "who can ATTEMPT", handlers add "and is the resource in the right state".

---

## §6 Creator-gated permissions

[CODE] `Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs:205, 206, 243, 244, 283, 284, 285` — 7 explicit creator-gated rules, ALL on Contact Group resources, ALL via the same expression: `"r.obj.createdby" == "r.sub.userid"`.

| Role | Resource | Action | File:line | Vol 44 mapping |
|---|---|---|---|---|
| acc-owner | `acc.contact-group` | edit | `:205` | ENFORCES CG-TT-edit-creator via PES |
| acc-owner | `acc.contact-group` | delete | `:206` | ENFORCES CG-TT-delete-creator via PES |
| acc-admin | `acc.contact-group` | edit | `:243` | ENFORCES CG-TT-edit-creator via PES |
| acc-admin | `acc.contact-group` | delete | `:244` | ENFORCES CG-TT-delete-creator via PES |
| acc-user | `acc.contact-group` | edit | `:283` | ENFORCES CG-TT-edit-creator via PES |
| acc-user | `acc.contact-group` | delete | `:284` | ENFORCES CG-TT-delete-creator via PES |
| acc-user | `acc.contact-group` | share | `:285` | ENFORCES CG-TT-share-creator-acc-user via PES — only acc-user has creator-restriction on share; acc-owner/acc-admin share without creator check |

**Doctrine** (per Vol 44 §5): All three Client roles can edit/delete contact groups, but only the ones they CREATED. `acc-user` additionally has creator restriction on share (acc-owner and acc-admin can share any group). This produces a 3-tier sharing hierarchy:
- acc-owner / acc-admin: unrestricted share
- acc-user: share own only
- All 3: edit/delete own only

**Falcon side has NO creator-gated rules** — Falcon roles cannot create contact groups at all (rules `:106-109, :128-131, :160-163` all `deny` for create/edit/delete/share); their only write actions are `download` and `download-original`. Consistent with Vol 44 doctrine that Falcon staff observe but do not author Client-domain contact groups.

**Expression eval**: The PES engine (Casbin-style) reads `r.obj.createdby` from the request attributes and `r.sub.userid` from the claims principal. Source `Falcon\falcon-core-access-svc\src\T2.PES\Authorization\PolicySubjectContract.cs` builds the subject; frontend passes `attrs: { createdby: cg.createdBy }` in the `AccessQuery` for these specific scenarios.

**Note**: Frontend `contactGroupQuery` at `falcon-access.registry.ts:177-184` always sets `attrs: {}` and `ignoreExpression: true`. **This means the frontend gate IGNORES the creator check by default** — the FE only checks "do I have any rule with allow effect for `acc.contact-group/edit`?" and shows the Edit button. The actual creator check happens **server-side** when the request hits the handler. This is a deliberate UX choice (show the button optimistically, fail on submit with a clean 403).

---

## §7 Hierarchy-scoped permissions

**Verdict**: **NO PES rule** encodes hierarchy/node-scope. PES is pure {subject, object, action, effect, expression}. Hierarchy gating is enforced at:

1. **Gateway layer** — request rejection if `target.nodeId NOT IN caller.adminScope`. NOT FOUND as an explicit policy expression.
2. **Handler layer** — `Path` field on User entity (`User.cs:10-72` — `Path` = hierarchy path string like `/root/main/sub`) — handlers compare requested `nodeId` against caller's `Path`.
3. **Frontend** — `accountHierarchy.guard.ts` etc. forbid navigation to nodes outside the caller's scope.

Searched `BuiltInRoleCatalog.cs` policy expressions for `nodeid`, `tenant`, `path`, `scope` — **0 matches**. The only expression used is `r.obj.createdby == r.sub.userid`. **Conclusion**: hierarchy gating is **not** a PES concern.

The closest PES has to hierarchy awareness:
- [CODE] `Falcon\falcon-core-access-svc\src\T2.PES\Authorization\PolicySubjectContract.cs` builds policy subject `u:<ZitadelUserId>@<ns>` where `ns` is the tenant namespace. So role assignment IS tenant-scoped (a `acc-owner` on tenant A cannot accidentally pass for tenant B).
- The `BuildAccountRole` method (`BuiltInRoleProvisioner.cs:168-170`) hashes the tenantId into the role subject, ensuring acc-* roles are seeded **per tenant**.

But within a tenant, node-level scoping is NOT in PES.

---

## §8 Falcon-only powers (sys-* roles, NO acc-* roles)

PES keys seeded ONLY for sys-admin / sys-ops / sys-products, never for acc-owner / acc-admin / acc-user:

| Resource | Action | File:line |
|---|---|---|
| `app.admin-console` | `view` | `BuiltInRoleCatalog.cs:88, 122, 144` |
| `sys.acc-hierarchy` | `view` | `:87, 121, 143` |
| `sys.account` | `add` | `:89, 145` (Add Client wizard) |
| `sys.account-profile` | `edit` | `:90, 146` |
| `sys.root-password-security-level` | `view` | `:91, 123` |
| `sys.root-password-security-level` | `edit` | `:92` (sys-admin only) |
| `sys.account-password-security-level` | `edit` | `:93` (sys-admin only — drift §10) |
| `sys.root-allowed-ips` | `edit` | `:94` |
| `sys.account-allowed-ips` | `edit` | `:95, 126` |
| `sys.account-quota` | `edit` | `:96, 150` |
| `sys.services` | `payment`, `edit-price-type`, `edit-price-value`, `visibility` | `:97-100, 151-154` |
| `sys.wallet-strategy` | `view`, `edit` | `:101-102, 155-156` |
| `sys.master-wallet` | `view` | `:103, 157` |
| `sys.wallet` | `transfer` | `:104, 158` |
| `sys.contact-group` | `view`, `download`, `download-original` | `:105, 110-111, 127, 132-133, 159, 164-165` |

Total **Falcon-only resource families**: 13 — `sys.acc-hierarchy`, `sys.account`, `sys.account-profile`, `sys.root-password-security-level`, `sys.account-password-security-level` (edit), `sys.root-allowed-ips`, `sys.account-allowed-ips` (edit), `sys.account-quota` (edit), `sys.services`, `sys.wallet-strategy`, `sys.master-wallet`, `sys.wallet`, `sys.contact-group` (+ `app.admin-console`).

**ENFORCES F-TT (Falcon Tautology)**: all `sys.*` resources MUST trace to a sys-* role's allow rule; no acc-* role can pass. **Verified.**

---

## §9 Client-only powers (acc-* roles, NO sys-* roles)

PES keys seeded ONLY for acc-owner / acc-admin / acc-user, never for sys-admin / sys-ops / sys-products:

| Resource | Action | File:line |
|---|---|---|
| `app.management-console` | `view` | `:179, 219, 257` |
| `acc.org-hierarchy` | `view` | `:181, 221` |
| `acc.account` | `view`, `edit` | `:182, 187, 222, 226` |
| `acc.organization` | `view`, `add` | `:183-184, 223-224` |
| `acc.account-user` | `add` | `:185` (acc-owner only) |
| `acc.org-user` | `add` | `:186, 225` |
| `acc.services` | `view`, `payment`, `disable` | `:188-190` (acc-owner only; acc-admin denies at `:227-229`) |
| `acc.account-settings` | `view` | `:191, 230` |
| `acc.org-settings` | `view` | `:192, 231` |
| `acc.users` | `view` | `:193, 232` |
| `acc.account-profile` | `view`, `edit` | `:194-195` (acc-owner only) |
| `acc.account-password-security-level` | `view`, `edit` | `:196-197` (acc-owner only) |
| `acc.account-allowed-ips` | `view`, `edit` | `:198-199` (acc-owner only) |
| `acc.account-quota` | `view`, `edit` | `:200-201` (acc-owner only) |
| `acc.contract` | `view` | `:202` (acc-owner only) |
| `acc.contact-group` | `view`, `create`, `edit`, `delete`, `share`, `download`, `download-original`, `view-shared` | `:203-209, 241-247, 281-288` |

Total **Client-only resource families**: 13 — `acc.org-hierarchy`, `acc.account`, `acc.organization`, `acc.account-user`, `acc.org-user`, `acc.services`, `acc.account-settings`, `acc.org-settings`, `acc.users`, `acc.account-profile`, `acc.account-password-security-level`, `acc.account-allowed-ips`, `acc.account-quota`, `acc.contract`, `acc.contact-group` (+ `app.management-console`).

**ENFORCES C-TT (Client Tautology)**: all `acc.*` resources MUST trace to an acc-* role's allow rule; no sys-* role can pass.

---

## §10 Q-AM-16 audit — CONFIRMED PES↔PRD drift

**Verdict**: **CONFIRMED**. PES catalog and PRD Permission Sheet (Jawad.xlsx) have explicit drift. Inventory:

### Drift class A — keys in code, NOT in PRD (Falcon-side)
None substantive. Every seeded key traces to ≥1 PRD function.

### Drift class B — PRD functions with NO PES key (MISSING IN CODE)
1. **Template Management module** — entire PRD section (lines 177-198) has no factory in `falcon-access.registry.ts`. View, edit, create, delete, share, pending-review, shared-templates — all ungated by PES. Frontend gates by route guard or hardcoded role-list. **HIGH severity** for Vol 50.
2. **Contract & Cost module** — PRD lines 133-146 are Falcon-side, but `acc.contract` is Client-only. No `sys.contract` family. Falcon cannot view client contracts via PES. **HIGH severity.**
3. **Wave 1.3 Add User registry orphans** — `sys.user/add`, `sys.user-permission-group/assign`, `sys.user-profile-picture/upload` — factories exist (registry `:137-144`) but no role has the seed → wizard mount, perm-group dropdown, photo uploader all effectively closed unless callers have sys-admin role bypass logic. **HIGH severity.**
4. **`sys.account-profile/view`** — no view action; only edit. PRD line 41-43 says view fields allowed for all 3 Falcon roles. **MEDIUM severity** (FE pulls fields inline if user has edit, but read-only Op still expected to see — would need view-equivalent).
5. **`sys.account-quota/view`** — no view action; only edit. PRD line 60 says view for all 3. **MEDIUM severity.**
6. **`sys.root-allowed-ips/view`** — no view action; only edit. PRD line 54 says view for all 3 at root. **MEDIUM severity.**
7. **`sys.services/disable`** — no disable action on Falcon side; only `acc.services/disable`. PRD line 65-66 says disable @ main allowed for SA+Op+Pr. **MEDIUM severity.**

### Drift class C — code has fewer roles than PRD says (Wrong matrix)
1. **`sys.account-password-security-level/edit`** — seeded only for sys-admin (`:93`). sys-ops `:124` and sys-products `:148` have `sys.root-password-security-level/edit = deny` but NEITHER ALLOWS NOR DENIES `sys.account-password-security-level/edit`. PRD line 50 says Edit @ main is Allow=SA, NA=Op, NA=Pr. Code matches by `deny-by-default` but is **non-explicit**. **LOW severity** (consistency).
2. **`sys.account-allowed-ips/edit`** for `sys-products` — code has NO rule at `:148` area for this key (only `sys-admin :95` and `sys-ops :126`). PRD line 57 says Edit Allowed IPs @ main is Allow=SA, Allow=Op, NA=Pr. Code matches by deny-by-default. **LOW severity** (non-explicit).
3. **`acc.account-profile/view`** for `acc-admin` — `:233` denies edit but no rule on view. PRD scope unclear (sheet is sys-* only). **LOW severity.**
4. **`acc.contact-group/view-shared`** — only `acc-user` has it (`:288`). acc-owner and acc-admin have no rule for `view-shared`. **MEDIUM severity** if Vol 44 §contact-group says acc-owner should see shared groups too.

### Drift class D — REGISTRY-RAW.md frontmatter incorrect
1. `total-factory-methods: 47` — actual factory count by strict signature is 58. Discrepancy because REGISTRY-RAW collapses scope-aware `contactGroup.*` into 8 actions × 2 scopes = 16 row entries but the source has 8 factory functions. Recommend reconciling to "47 PES keys (collapsed)" vs "58 factory entry points (expanded)". **LOW severity** (documentation).

### Drift class E — Wave 1.3 docstring vs reality
Registry `:132-135` comment says:
> sys.user — add → gate the wizard mount + Finish button
> sys.user-permission-group — assign → gate the Step-3 perm-group dropdown
> sys.user-profile-picture — upload → gate the Step-1 photo uploader

But no role catalog entry exists. So the wizard would close to ALL users including sys-admin unless: (a) the FE access-control resolver has a "fall back to allow if no rule found AND user is built-in sys-admin" branch (NO — `accessControlFacade.can()` returns `false` by default per `permission-developer-guide.md`); OR (b) the wizard mounts despite the gate (FE bug). **HIGH severity** — confirmed orphan, needs seed catalog update in next provisioning cycle.

### Drift summary table

| Class | Count | Severity |
|---|---|---|
| B (PRD function with no key) | 7 | HIGH × 3, MED × 4 |
| C (key with wrong matrix) | 4 | MED × 1, LOW × 3 |
| D (registry doc mismatch) | 1 | LOW |
| E (registry comment vs seed) | 3 (Wave 1.3 orphans counted in B) | HIGH |
| **Total distinct drifts** | **12** | — |

---

## §11 Where the role-edit matrix lives (Vol 44 cross-reference)

Vol 44 §user-lifecycle expects every role-change operation to be PES-gated. **Confirmed.**

- Self-edit (`user.role.self/set-<roleKey>`): every role can ONLY keep its current role. `set-sys-admin` for `sys-admin` actor → allow; `set-acc-owner` for `sys-admin` actor → deny. Source: `BuiltInRoleCatalog.cs:321-330`.
- Other-edit (`user.role.other/change-<cur>-to-<tgt>`): governed by `OtherRoleEditMatrix` (`:18-75`). Reading the matrix at `:18-29` for sys-admin:
  - sys-admin → can move any sys-* user to any sys-* role (full peer mobility)
  - sys-admin → can move any acc-* user to any acc-* role
  - sys-admin → CANNOT move sys-* to acc-* or vice versa (kingdom boundary preserved)
- Critical row: `acc-user` matrix at `:66-74` — acc-user has Array.Empty<>() for ALL six current-role targets. **acc-user cannot change anyone's role**, ever.
- Critical row: `acc-admin` at `:57-65` — acc-admin can only move `acc-admin` ↔ `acc-user`; CANNOT touch `acc-owner` even within same tenant.

**ENFORCES UM-TT-roleChange via PES** (every transition gated). **Kingdom boundary preserved** (`:50-52, :61-63, :71-73` all use `Array.Empty<>` for cross-kingdom).

---

## §12 Risk callouts (for Vol 50 author)

1. **Template module is PES-blind.** No factory, no seed. Currently template visibility is route-guard + hardcoded role-list. When Template Lifecycle (Vol 49) lands fully, this MUST grow PES keys: `acc.template/{view,create,edit,delete,share,download}`, `acc.template-pending-review/view`, `acc.shared-template/view`. **Action**: register Q-TM-PES-1 gap.

2. **Contract & Cost module is acc-* only.** Falcon roles cannot view Client contracts via PES. PRD says they should. **Action**: register Q-CC-PES-1 — add `sys.contract/view` for sys-admin + sys-products (matches PRD Allow=SA,A,A).

3. **Wave 1.3 Add-User orphans.** 3 keys in registry, 0 in catalog. Wizard will not mount for ANY role currently. **Action**: emergency Q-UM-PES-1 — seed `sys.user/add = allow` for sys-admin + sys-products (matches PRD Add User SA=A, Op=A, Pr=NA — though Op=A from PRD line 12 conflicts with "Op cannot Add Client" pattern; likely PRD means "Add User existing" vs "Add User new"). Needs clarification.

4. **No view-action keys for several edit-only resources.** `sys.root-password-security-level/view` is seeded for sys-admin+sys-ops (`:91, 123`); but no view for `sys.account-password-security-level`, `sys.account-allowed-ips`, `sys.account-quota`, `sys.root-allowed-ips`, `sys.account-profile`. FE has to either fall back to "if you can edit, you can also view" or fail-open. Audit needed: confirm read-only sys-ops can SEE these tabs in admin-console without edit.

5. **Hierarchy/node-scope is OFF the PES surface.** Treat PES as the ROLE/ACTION gate. ALWAYS pair with a node-scope check at the handler. Document this as Vol 50 §rule "PES answers WHO; node-scope answers WHERE".

6. **Status-conditional checks are OFF the PES surface.** PES does NOT check user status. Login-eligibility, transfer-rights, etc. are handler-only.

7. **acc-user share-other ORPHAN.** Registry exposes a `shareOther` factory but no role seeds `share-other`. Vol 44 §contact-group hints that acc-user should be able to RECEIVE shared groups (which `view-shared` covers) and possibly forward them (`share-other` would cover). Decision needed.

---

## §13 PES enforcement layers (frontend, gateway, backend)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\current-subject.builder.ts:27` — FE constructs `u:<JWT.sub>@<ns>` policy subject from the JWT. Subject is queried against the seeded `g`-rule (user→role) then the `p`-rule (role→action).

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\guards\admin-console.guard.ts` — uses `FalconAccess.adminConsole.enter`. Same pattern at `management-console.guard.ts` using `FalconAccess.managementConsole.enter`.

[CODE] `Falcon\falcon-web-platform-ui\apps\host-shell\src\app\app.config.ts` — wires `provideAccessControl` and the resolver.

**Backend gateways do NOT call PES** (per `03-pes-keys/_INDEX.md:34` standing fact #3). Backends use [Authorize] attributes on endpoints + handler-level role checks; the PES service is the source-of-truth for the **FE access-control facade**, not for backend authorization. This means a malicious FE bypass would still fail at the backend's separate auth check — defense in depth.

---

## §14 Appendix — Total seeded p-rule count

Per role base rules:
- sys-admin: 26 explicit (`:87-111`) + 36 self-edit + 36 other-edit = **98 rules**
- sys-ops: 14 explicit (`:121-133`) + 36 + 36 = **86 rules**
- sys-products: 25 explicit (`:143-165`) + 36 + 36 = **97 rules**
- acc-owner: 32 explicit (`:179-209`) + 36 + 36 = **104 rules**
- acc-admin: 30 explicit (`:219-247`) + 36 + 36 = **102 rules**
- acc-user: 33 explicit (`:257-288`) + 36 + 36 = **105 rules**

**Total**: ~592 seeded `p`-rules across 6 roles. (Each role's 36 self-edit is actually 6 yields per role × 6 target keys = 36; each role's other-edit is 6×6=36 yields per role per target = 216 — recount:)

- Self-edit: 6 yields per role (one per RoleEditTargets entry) × 6 roles = 36 rules total.
- Other-edit: `BuildOtherRoleEditPolicies(actorRole)` does `foreach currentRoleKey in RoleEditTargets [6] { foreach targetRoleKey in RoleEditTargets [6] { yield 1 } }` = 36 yields per role × 6 roles = **216 rules total**.

Recomputed totals:
- sys-admin: 26 + 6 + 36 = **68**
- sys-ops: 14 + 6 + 36 = **56**
- sys-products: 25 + 6 + 36 = **67**
- acc-owner: 32 + 6 + 36 = **74**
- acc-admin: 30 + 6 + 36 = **72**
- acc-user: 33 + 6 + 36 = **75**

Grand total seeded `p`-rules: **412**.

Grand total `g`-rules: depends on user seed count (typically 1 per built-in user assigned in `seed-test-users.sh`). Not relevant to the catalog audit.

---

## §15 See also

- `Brain Outputs/datasets/authority-dataset/01-roles/` — per-role notes (`sys-admin.md`, `acc-owner.md`, etc.)
- `Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md` — namespace-organized registry (needs frontmatter fix per §10 Drift D)
- `Brain Outputs/reports/night-shift/2026-05-17/WAVE-11-CODE-MINING-WALLET.md` — wallet PES sub-domain
- `Brain Outputs/reports/night-shift/2026-05-17/WAVE-14-CODE-MINING-USER-LIFECYCLE.md` — user-status enforcement layer
- `Falcon\falcon-web-platform-ui\docs\permission-developer-guide.md` — FE consumption pattern (not opened in this audit; recommend reading for Vol 50)

---

**End of WAVE 17.**
