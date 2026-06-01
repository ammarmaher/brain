---
type: gate
dataset: authority-dataset
purpose: 10 falsifiable questions the dataset must answer with code citations
---

# Verification Gate — 10 questions

> [!tldr]
> A fresh Claude/agent session must answer all 10 below with `[CODE]` or `[BRAIN-OUT]` citations and zero `[INFERRED]`. If any question fails, the dataset is incomplete.

## The 10 questions

### Q1 — List every Falcon (System) role and its primary use case.

Expected answer (cited from `BuiltInRoleCatalog.cs:77-167`):
- **sys-admin** — System Administrator (Arabic: مدير النظام). Full platform control: view hierarchy, create accounts, edit profile/IP/quota/services, transfer wallet, view all contact groups (no create/edit/delete).
- **sys-ops** — System Operation (إدارة العمليات التقنية). Restricted: hierarchy/admin-console view, password security view, edit allowed-IPs on accounts (NOT root). No account creation, no service edit, no wallet ops.
- **sys-products** — Products (المشتريات). Service-tier admin: full services/wallet-strategy/master-wallet/wallet/transfer + account add + quota edit. NO root-password-security (view or edit), NO IP edits.

### Q2 — List every Client (Account) role and its primary use case.

Expected (cited from `BuiltInRoleCatalog.cs:169-290`):
- **acc-owner** — Account Owner (مالك الحساب). Tenant root admin: full org-hierarchy + account/profile/IP/quota/contract view & edit + services payment/disable + contact-group CRUD + add users (account-user + org-user).
- **acc-admin** — Node Admin (مشرف الإدارة). Sub-node admin: hierarchy & org view, account/edit + add org-user, account-settings/org-settings view, contact-group view/create/share. **DENIED**: services, profile-edit, password/IP/quota, contract, account-user add.
- **acc-user** — Normal User (مستخدم). Contact-group only. Everything else denied. Has unique `view-shared` permission.

### Q3 — Can `acc-owner` add a sub-account? Cite the PES rule.

✅ Yes. `BuiltInRoleCatalog.cs:184` → `("acc.organization", "add", "allow")` + line `185` → `("acc.account-user", "add", "allow")` + line `186` → `("acc.org-user", "add", "allow")`.

### Q4 — Which pages does `sys-admin` see that `acc-owner` does not?

From the seed `p`-rule sets:
- `app.admin-console` view: sys-admin = allow (line 91), acc-owner = **deny** (line 180).
- All `sys.*` resources (account-hierarchy, account, services, wallet-strategy, master-wallet, root-password-security-level, root-allowed-ips, accountQuota, accountAllowedIps) — only granted to `sys-*` roles.
- Conversely, all `acc.*` resources (org-hierarchy, account, organization, services, account-settings, org-settings, users, account-profile, contract, contact-group) — only granted to `acc-*` roles.
- See `04-feature-parity-matrix/MATRIX.md` for the full feature-level diff.

### Q5 — What status transitions can a Node go through?

Two enums apply:
- **`eAccountCreationStatus`** (`Falcon.Commerce.Domain/Constants/Enums.cs:43`): Pending(1) → InfoCompleted(2) → SettingsCompleted(3) → ServicesConfigured(4) → AppsConfigured(5) → OwnerCreated(6) → Completed(7). This is the 5-step **Add Client wizard** lifecycle.
- **`eNodeType`** (`Enums.cs:8`): Main(1) / Sub(2). Not a status — a structural classification.

A node does not have a runtime "active/suspended" enum — its operational state is derived from sub-resources (contracts, services, users).

### Q6 — What changes when copying `wallet-balance-management` from admin-console to management-console?

See `04-feature-parity-matrix/wallet-balance-management.compare.md`. Summary:
- **Namespace flip**: `FalconAccess.adminConsole.wallet.transfer` / `walletStrategy.*` / `masterWallet.*` does NOT exist on mgmt side — wallet ops are Falcon-only.
- **Gateway flip**: SystemGateway → CoreGateway.
- **Resource taxonomy**: `sys.wallet*` does not have an `acc.wallet*` mirror — mgmt does not get this feature.

### Q7 — Which PES namespace owns "create contact group"?

`contactGroup.*` — neither `adminConsole` nor `managementConsole`. The factory is `FalconAccess.contactGroup.create(scope)` where `scope: 'sys' | 'acc'` (see `falcon-access.registry.ts:13-25, 175-184`). Resource is `${scope}.contact-group`. Falcon callers pass `'sys'` (and get `deny` per the catalog — sys-* cannot create), Client callers pass `'acc'` (and acc-owner/acc-admin/acc-user all get `allow`).

### Q8 — Which feature exists only in admin-console and has no mgmt counterpart?

From `04-feature-parity-matrix/MATRIX.md`:
- **`testing-charging`** — Falcon-only diagnostic page (no `acc.*` equivalent, no `managementConsole.*` PES keys).
- **`wallet-balance-management`** is **partially shared**: both apps have a page, but only Falcon has wallet-transfer/master-wallet keys.
- **`contracts-cost-management`** — backend `acc.contract.view` exists but every `acc-*` role except `acc-owner` is **denied**. Effectively Falcon-mostly.

### Q9 — What does the JWT carry for an `acc-admin` user?

From `seed-test-users.sh:93-111` (Zitadel metadata setter):
- `user-id` = Mongo `_id` of the Identity user document
- `user-type` = `2` (= `eUserType.Client`)
- `tenant-id` = the account namespace (e.g. `test-tenant-001`)
- JWT `sub` = Zitadel user-id (NOT Mongo `_id`)
- JWT `urn:zitadel:iam:user:metadata:tenant-id` = same tenant id
- Frontend `CurrentSubjectBuilder` builds policy subject `u:<JWT.sub>@<tenant-id>`.

### Q10 — If I see `FalconAccess.adminConsole.rootPasswordSecurityLevel.edit()` in code, which role(s) pass it?

Only **`sys-admin`** (`BuiltInRoleCatalog.cs:92` → `("sys.root-password-security-level", "edit", "allow")`).
- `sys-ops` → `deny` (line 124).
- `sys-products` → `deny` (line 148).
- All acc-* → no rule defined → silent deny.

### Q11 — Which V-rules apply when implementing the Add Client wizard? (Phase 2)

Expected answer (cited from `06-validation-by-feature/MATRIX.md` + `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md`):
- 9 V-rules: `V-account-name-format-uniqueness` · `V-password-security-level-enum` · `V-account-ip-allowlist-enforcement` · `V-account-limits-zero-means-no-limit` · `V-service-visibility-pricing-required` · `V-user-first-last-name-letters-only` · `V-username-format-uniqueness-immutable` · `V-password-complexity-per-security-level` · `V-normal-user-limit-enforcement`.
- Plus 5 cross-field rules: `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `OfficialDataRequired`, `HiddenProductMustNotHavePricing`.

### Q12 — Which entity drifts will I hit if I port `organization-hierarchy` to mgmt? (Phase 2)

Expected (from `08-entity-drift-by-feature/MATRIX.md`):
- **E-node** ⚠ DRIFT — `node.type` not exposed on response DTO (infer from tree position)
- **E-node** ➕ EXTRA — `ChangeNodeNameRequest.EffectiveDate?` for scheduled rename
- **E-account** + **E-account-settings** — multiple drift points (TBD by Agent 2)
- **E-user** — backend username cap 100 vs PRD cap 30 (HIGH drift)

### Q13 — What cross-field business rules govern `contact-groups` create flow? (Phase 2)

Expected (from `09-business-rules-by-feature/MATRIX.md`):
- BR-CG-* cluster (PRD-04 Contact Group Management business rules)
- Ownership overlay: `r.obj.createdby == r.sub.userid` for edit/delete/share by non-owners
- Falcon side has zero authorship rights (every sys-* role has explicit deny on create/edit/delete/share)
- `acc-user` share is own-only (tighter expression than acc-owner/acc-admin)

### Q14 — Which non-PES gates hide UI on `wallet-balance-management`? (Phase 2)

Expected (from `10-non-pes-gates-by-feature/MATRIX.md`):
- **Session-type gate**: Master Wallet card hidden when `session.userType !== FALCON_USER`
- **Node-type gate**: cross-account tree picker hidden when not at root scope
- **Server-driven row**: `row.allowedActions` filters per-row payment/transfer actions

### Q15 — For `acc-admin`, what's the full inventory of pages × actions they can perform? (Phase 2)

Expected (from `05-capability-maps/acc-admin.capability.md`):
- ~60-row table covering every page × every action × verdict
- Headline: lands on org-hierarchy + contact-groups; denied on services/wallet/marketplace/contracts; can add org-user but NOT account-user; can edit acc-user/acc-admin role but NOT acc-owner.

### Q16 — Which error code surfaces when an acc-user attempts an OTP resend after 3 failed attempts? (Clusters 13)

Expected (from `13-error-catalog/CATALOG.md`):
- HTTP 422 with `FalconKeys.Error.OtpResendLimitExceeded`
- Same lockout UI as 423 `UserLocked`
- The intermediate retry shows HTTP 429 `OtpStillValid` if attempted during the 60s OTP window
- FE contract: display localized `errorMessages[0]` — DO NOT switch-case on the code string

### Q17 — Which roles can run the Add User flow, and what role-grant matrix applies per actor path? (Cluster 14)

Expected (from `14-flow-playbook-integration/Add-User.integration.md`):
- 5 of 6 roles can run Add User: sys-admin · sys-products · sys-ops · acc-owner · acc-admin
- Three actor-path role-grant rules:
  - sys-admin · sys-products: any role (sys-* or acc-*)
  - sys-ops: own role + all acc-*
  - acc-owner: all acc-* (BR-UM-03 enforces one-AO-per-tenant on the destination side)
  - acc-admin: only acc-admin + acc-user (cannot promote to acc-owner)
- Tab 2 Role dropdown populated from `POST /pes/authorize/resources` (not static client-side enum)

### Q18 — What anti-patterns should I avoid when porting a feature from admin to mgmt? (Cluster 15)

Expected (from `15-implementation-pitfalls/ANTI-PATTERNS.md`):
- 13 catalogued anti-patterns with file:line evidence from old-ui-dataset 08-RULES-APPLIED.md files
- Top 5: SCSS files, PrimeNG components, PrimeIcons strings, `@Input`/`@Output` decorators, `*ngIf`/`*ngFor`
- 13-row "use this, not that" replacement table mapping each anti-pattern to its modern Falcon-UI-Core/Tailwind/signals replacement
- Pre-port grep checklist with 13 regex patterns ready to paste

### Q19 — Which trigger phrase loads the Implementation Pitfalls cluster? (Cluster 16)

Expected (from `16-trigger-phrases/_INDEX.md`):
- Primary trigger: `implementation pitfalls` → loads `15-implementation-pitfalls/PITFALLS.md`
- Secondary trigger: `what anti-patterns should I avoid` → loads `15-implementation-pitfalls/ANTI-PATTERNS.md`
- Cheat-sheet trigger: `if I see broken UI for X` → loads PITFALLS.md cheat-sheet section
- Pre-port grep: `pre-port grep checklist` → loads ANTI-PATTERNS.md § grep commands

## Spot-check verdict

| # | Question | Answered | Source |
|---|---|---|---|
| 1 | List Falcon roles | ✅ | `01-roles/sys-*.md` |
| 2 | List Client roles | ✅ | `01-roles/acc-*.md` |
| 3 | acc-owner add sub-account | ✅ | `01-roles/acc-owner.md` |
| 4 | sys-admin only pages | ✅ | `04-feature-parity-matrix/MATRIX.md` |
| 5 | Node status transitions | ✅ | `02-statuses/account-creation-status.md` |
| 6 | Copy wallet admin→mgmt | ✅ | `04-feature-parity-matrix/wallet-balance-management.compare.md` |
| 7 | "create contact group" namespace | ✅ | `03-pes-keys/contactGroup.md` |
| 8 | Admin-only feature | ✅ | `04-feature-parity-matrix/MATRIX.md` |
| 9 | JWT for acc-admin | ✅ | `07-cross-cutting/session-shape.md` |
| 10 | rootPasswordSecurityLevel.edit grantees | ✅ | `03-pes-keys/adminConsole.md` |
| 11 | Add Client wizard V-rules | ✅ (Phase 2) | `06-validation-by-feature/MATRIX.md` |
| 12 | org-hierarchy entity drift on mgmt port | ✅ (Phase 2) | `08-entity-drift-by-feature/MATRIX.md` |
| 13 | contact-groups create business rules | ✅ (Phase 2) | `09-business-rules-by-feature/MATRIX.md` |
| 14 | wallet-balance-management non-PES gates | ✅ (Phase 2) | `10-non-pes-gates-by-feature/MATRIX.md` |
| 15 | acc-admin full action inventory | ✅ (Phase 2) | `05-capability-maps/acc-admin.capability.md` |
| 16 | OTP resend error after 3 attempts | ✅ (Cluster 13) | `13-error-catalog/CATALOG.md` |
| 17 | Add User role-grant matrix per actor | ✅ (Cluster 14) | `14-flow-playbook-integration/Add-User.integration.md` |
| 18 | Anti-patterns to avoid when porting | ✅ (Cluster 15) | `15-implementation-pitfalls/ANTI-PATTERNS.md` |
| 19 | Trigger phrase for Implementation Pitfalls | ✅ (Cluster 16) | `16-trigger-phrases/_INDEX.md` |

> Re-run this gate after any code change to `BuiltInRoleCatalog.cs`, `falcon-access.registry.ts`, the 25 V-rule notes, the 15 E-* notes, the 4 PRD `BUSINESS_RULES.md` files, or the 4 flow playbooks. If any answer breaks, the auto-sync scanner (now watching 67 files) must have flagged the change — investigate the drift report.
