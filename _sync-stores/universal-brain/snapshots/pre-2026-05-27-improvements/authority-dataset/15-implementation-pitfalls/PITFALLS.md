---
type: pitfall-catalog
cluster: 15-implementation-pitfalls
total-pitfalls: 25
purpose: "Answers 'which 25 cross-cutting pitfalls + 10 mindsets catch real bugs before code review (deny-by-omission, scope-arg factory, app.*.view, etc.)'. Open before implementing or porting any feature."
extracted: 2026-05-16
---

# Implementation Pitfalls — Catalog

> [!tldr]
> Pitfalls are mental models that catch real bugs *before* code review. This catalog distills 25 cross-cutting traps observed in the authority dataset, each with severity, symptom, root cause, mitigation, and a real-world citation. Read §1 (the 10 mindsets) and §6 (the cheat sheet) first; drill into §3 when you hit a specific symptom.

## 1. The 10 mindsets

> [BRAIN-OUT] [[../KNOWLEDGE-DUMP#part-6—ten-cross-cutting-mindsets|KNOWLEDGE-DUMP Part 6]] (lines ~278-360). These are the patterns that emerge once you read all 41 dataset files — internalize them once, predict behavior without re-reading code.

| # | Mindset | 1-line description | Implication |
|---|---|---|---|
| 1 | Deny by omission is the dominant pattern | PES has 2 ways to say no: **explicit deny** + **no rule (silent deny)**. Most denies are silent. | When adding a PES key, decide which roles get explicit allow + explicit deny (to document intent). Leave the rest as no-rule. |
| 2 | Expression-gated permissions encode row-level ownership | The expression `r.obj.createdby == r.sub.userid` is row-level filtering at the policy layer. | Features needing "I can do X to my own things but not others" use expression-gated allows + a separate `*-other` action for the broader case. |
| 3 | The scope-arg factory is the canonical "shared resource" pattern | `FalconAccess.contactGroup.create(scope: 'sys' \| 'acc')` is the only key family that takes an argument. | Future shared features should use this same pattern — do NOT duplicate the resource under both `sys.*` and `acc.*` namespaces. |
| 4 | Asymmetry direction is "different power domains", not "Falcon > Client" | Naively, Falcon staff > Client users. But contact-group authorship is **Client-only**. | Never write code that assumes "if Falcon can do it, Client can too" or vice-versa. Always check the cell in the matrix. |
| 5 | The hidden authority lever is `app.*.view` | Two PES keys (`app.admin-console.view` + `app.management-console.view`) gate every page in the respective console. | When debugging "user can log in but sees no pages", check these two keys FIRST. They are the gate before the gate. |
| 6 | View vs Edit is all-or-nothing on Client side | On Falcon side, view-only-without-edit happens (sys-ops `root-password-security-level.view` + deny on edit). On Client side, never — either both or neither. | Don't render "view-only" badges for account settings on mgmt-side — if a Client role can see it, they can edit it. |
| 7 | The acc-* deny ladder has a huge gap | acc-owner has 30 allow rules. acc-admin has 28 mostly-deny. acc-user has 31 mostly-deny + 1 weird allow (`view-shared`). Owner→admin gap >> admin→user gap. | Don't design a UI assuming a smooth power ladder. There's owner, and there's not-owner-with-fewer-rights. |
| 8 | Falcon roles are specialists, not a ladder | sys-admin = platform admin · sys-ops = IP/firewall ops · sys-products = commercial admin. sys-ops has `root-password-security-level.view` allow, sys-products has explicit deny. | Don't write "user has sys-* role" as a check. Always check the specific PES key. |
| 9 | Wave 1.3.0 keys exist in registry but not in catalog | 3 Add-User wizard keys (`sys.user.add`, `sys.user-permission-group.assign`, `sys.user-profile-picture.upload`) are in the FE registry but not in `BuiltInRoleCatalog.cs`. **They currently return deny for everyone.** | Don't assume "key exists in registry ⇒ someone can pass it". Verify in the catalog. |
| 10 | Mgmt-side DTOs always have more UI hints than admin-side | Admin DTOs = lean, raw, management-oriented. Mgmt DTOs = enriched with `icon`, `subtitle`, `pricePeriod`, `currency`, `showDates`, `showPrice`, `iconUrl`. | When porting admin → mgmt, expect to ADD UI-hint fields to the DTO. Don't just copy the admin DTO verbatim. |

## 2. Pitfall categories

| Category | Theme | Pitfall count | Headline pitfalls |
|---|---|---|---|
| **A. Permission pitfalls** | PES vs role-level vs row-level vs server-driven row | 7 | Deny-by-omission · Scope-arg factory · `app.*.view` gate · Expression-gated rules · Wave 1.3.0 ghost keys |
| **B. Validation pitfalls** | 3-layer architecture + drift | 6 | FE-tighter-than-backend drift · `[ThrowIf*]` attribute order · 3-layer split confusion · Async uniqueness debounce · HTTP status routing |
| **C. Data pitfalls** | Entity drift + DTO shape divergence + dual ID universes | 5 | Mongo ID vs Zitadel ID universe · DTO enrichment asymmetry · Type-flip drift · Status enum int divergence · Mixed casing |
| **D. View-hide pitfalls** | PES is one of 6 gate types | 4 | Composite gate semantics · Server-driven row gate · Node-type gate · Tab-visibility reversal on port |
| **E. Cross-service pitfalls** | Status enum int-value divergence + duplication | 3 | Currency enum drift · Status enum int-value vs name · Validation duplicated across services |

## 3. Per-pitfall detail

### A. Permission pitfalls

---

#### P-01 · Deny-by-omission ([CATEGORY A] · 🟡 functional bug)

- **Symptom:** PES check returns `deny` for a role, but you can't find an explicit deny rule. UI hides the action silently.
- **Root cause:** The PES engine has TWO ways to say no — explicit `BuiltInPolicyRuleDefinition(..., "deny")` AND "no rule" (silent deny). Most denies are silent.
- **Mitigation:** Inspect [BRAIN-OUT] `01-roles/<role>.md` to see the full role's rule set. If the resource isn't listed, the role has NO rule → silent deny. Use explicit `deny` only when documenting intent that "this LOOKS like it should work but is intentionally blocked".
- **Real-world example:** [BRAIN-OUT] `KNOWLEDGE-DUMP.md:286-290` — `acc-admin` has **explicit deny** on `acc.services.view` (intentional signal: "we know acc-admin can see most account stuff, services are deliberately not their concern"). Most other roles get silent deny on the same key.

---

#### P-02 · Scope-arg factory misuse ([CATEGORY A] · 🟡 functional bug)

- **Symptom:** You add a new shared feature (used by both consoles) and create `sys.X.*` AND `acc.X.*` keys, but they drift out of sync over time.
- **Root cause:** Falcon already has a canonical pattern for shared resources — `FalconAccess.<feature>.<action>(scope: 'sys' | 'acc')`. The factory generates the right resource prefix at the call site. Only `contact-group` uses this pattern today.
- **Mitigation:** Use the scope-arg factory for ANY new shared feature (notifications, audit logs, etc.). Don't duplicate the same resource under both namespaces.
- **Real-world example:** [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:13-25, 162-171` — `FalconAccess.contactGroup.<action>(scope)` produces `{ action, resource: "${scope}.contact-group" }`. See [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:74-80`.

---

#### P-03 · The hidden `app.*.view` gate ([CATEGORY A] · 🔴 security/data corruption)

- **Symptom:** User logs in, JWT is valid, but every page redirects to `/unauthorized` or `/not-found`. No error in the console.
- **Root cause:** Both consoles have a root-level guard checking `app.admin-console.view` (or `app.management-console.view`). If this key isn't seeded for the role, **every page in the console becomes invisible** — no error, just a redirect.
- **Mitigation:** When debugging "user can log in but sees no pages", check `app.*.view` FIRST. It is the gate before the gate. [BRAIN-OUT] `KNOWLEDGE-DUMP.md:312-316` (Mindset 5).
- **Real-world example:** [CODE] `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27` reads `FalconAccess.adminConsole.enter()` (= `app.admin-console / view`). Without that allow rule, even `sys-admin` would be locked out.

---

#### P-04 · Expression-gated rule misread as universal allow ([CATEGORY A] · 🔴 security/data corruption)

- **Symptom:** PES check returns `allow` for the role on `contact-group.edit`, but the user gets 403 from the backend when they try to edit someone else's group.
- **Root cause:** The catalog rule has an inline expression `r.obj.createdby == r.sub.userid`. PES grants the verdict universally to the role, then evaluates the expression on each object. The FE flag reflects the role-level allow; row-level ownership is a separate overlay.
- **Mitigation:** When PES allows but action might be row-bound, also overlay session ownership via `rowFlags(row, session, flags)`. NEVER compare with `session.subjectId` (Zitadel id space) — use `session.identityUserId`. [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:70` + [MEMORY] `feedback_pes_g_link_uses_zitadel_id`.
- **Real-world example:** [CODE] `apps/admin-console/.../contact-groups/models/models.ts:42-45` has the explicit banner: *"NEVER compare with `session.subjectId` (Zitadel id space)"*. The contact-group edit/delete PES rules use the expression-gated form.

---

#### P-05 · Wave 1.3.0 ghost keys ([CATEGORY A] · 🟡 functional bug)

- **Symptom:** FE calls `FalconAccess.adminConsole.user.add()` for the Add User wizard, but PES returns deny for everyone — including `sys-admin`.
- **Root cause:** Three Add-User wizard PES keys (`sys.user.add`, `sys.user-permission-group.assign`, `sys.user-profile-picture.upload`) are in `falcon-access.registry.ts` but have NO rules in `BuiltInRoleCatalog.cs`. They were registered FE-side but not seeded — a phased rollout.
- **Mitigation:** Don't assume "key exists in registry ⇒ someone can pass it". Verify in `BuiltInRoleCatalog.cs` + `pes-account-role-rules.json` before shipping the FE wiring. [BRAIN-OUT] `KNOWLEDGE-DUMP.md:344-352` (Mindset 9).
- **Real-world example:** [BRAIN-OUT] `KNOWLEDGE-DUMP.md:344-350` calls out the three keys explicitly. They will be seeded when the Add User wizard ships.

---

#### P-06 · Server-driven row gate ignored ([CATEGORY A] · 🟡 functional bug)

- **Symptom:** PES says `services.payment` is allow, the user clicks the row's "Pay" action, but nothing happens — or worse, the action menu doesn't appear at all.
- **Root cause:** Per-row PES is layered on TOP of server-driven row gates. Backend stamps each row with `allowedActions: FalconRowAction[]`. UI's row-action `visible` predicate honors this. **Default-deny** if missing.
- **Mitigation:** When implementing a row-menu, ALWAYS gate visibility on `row.allowedActions.includes(actionEnum)` in addition to the PES flag. [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md:64-78`.
- **Real-world example:** [CODE] `marketplace-applications.component.ts:1032-1043` — `visible: (row) => row.allowedActions?.map(a => a as FalconRowAction).includes(actionEnum) ?? false`. This is the canonical "double-gate" pattern.

---

#### P-07 · `app.*.view` allowed but feature-key denied ([CATEGORY A] · 🟡 functional bug)

- **Symptom:** Client user (e.g. `acc-admin`) lands on `/management-console/comm-mgmt` successfully but the page shows an empty list.
- **Root cause:** `app.management-console.view` is allow (so route guard passes), but the feature's PES key (e.g. `acc.services.view`) is explicit deny for that role. Page renders, but no data flows.
- **Mitigation:** Add a `shellAccessGuard` reading the feature's PES key on the route's `canActivate`, OR render a friendly "no access" empty state inside the page when the data fetch returns 403/empty.
- **Real-world example:** [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:52-56` — `acc-admin` has `app.management-console.view = allow` but `acc.services.view = explicit deny`, so clicking the menu hits `/401` (when the route uses the feature-key guard) or shows an empty list (when it doesn't).

---

### B. Validation pitfalls

---

#### P-08 · FE-tighter-than-backend drift ([CATEGORY B] · 🟡 functional bug)

- **Symptom:** PRD says username max 30 chars. User enters 50 chars, FE blocks. User uses the API directly, backend accepts. Tenant data ends up with 50-char usernames.
- **Root cause:** Backend `CreateUserRequestValidator` has `MaximumLength(100)`. PRD-02 BR-UM-12 says `<=30`. The two drifted. FE must enforce the PRD value; backend won't reject longer values today.
- **Mitigation:** FE enforces PRD `Validators.maxLength(30)` regardless of backend's looser cap. Flag a GAP for backend to tighten. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:201` (drift #1).
- **Real-world example:** [BRAIN-OUT] V-username-format-uniqueness-immutable — 12 active drift items documented including this one. See `06-validation-by-feature/MATRIX.md:197-216` for the full drift list.

---

#### P-09 · Missing `[ThrowIf*]` on required field ([CATEGORY B] · 🟡 functional bug)

- **Symptom:** Field is required per PRD, but backend doesn't reject empty submission with a structural 400 — instead a confusing 422 surfaces from the handler.
- **Root cause:** Commerce DTOs use the `[ThrowIfNotPassed]` attribute family to enforce required/format/enum BEFORE the handler runs. If the attribute is missing, validation falls through to handler-level checks which produce less precise error codes.
- **Mitigation:** FE enforces `Validators.required` so empty submission fails client-side. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:204` (drift #4) — AccountOwner.PhoneNumber + EmailAddress lack `[ThrowIfNotPassed]`.
- **Real-world example:** [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md` — backend DTO surface lacks `[ThrowIfNotPassed]` on these two required fields despite the PRD requiring both. FE-enforced `Validators.required`.

---

#### P-10 · 3-layer validation collapsed into one ([CATEGORY B] · 🟢 nuisance)

- **Symptom:** Single mega-form with all validation in `onSubmit()` — no inline errors, no field-level red highlights, no async uniqueness check.
- **Root cause:** Falcon validation runs in THREE layers: Layer 1 = HTML/directive (sync render-time) · Layer 2 = cross-field FormGroup validators · Layer 3 = async backend uniqueness (debounced 300ms).
- **Mitigation:** Wire each rule into its proper layer. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:218-245`. Global rule registry is `FALCON_VALIDATIONS` at `libs/falcon/src/shared-utils/lib/validations/`; per-component rules via DI token + provider.
- **Real-world example:** Add Client wizard Step 1 — AccountName uses Layer 1 (`required + maxlength(30)`) + Layer 3 (`GET /api/Node/ValidateAccountName?AccountName=` returns `bool` → `accountNameTaken` validator error).

---

#### P-11 · Async uniqueness without debounce ([CATEGORY B] · 🟢 nuisance)

- **Symptom:** Every keystroke fires a backend uniqueness call. Server log floods, FE shows flickering "name taken" errors.
- **Root cause:** Async validator is wired directly to `valueChanges` without `debounceTime(300)` + `distinctUntilChanged()` + `switchMap` cancel-on-input.
- **Mitigation:** Use the canonical debounced async pattern: `debounceTime(300) → distinctUntilChanged() → switchMap(value => service.check(value))`. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:240-245`.
- **Real-world example:** Add Client wizard `account-name` async = `GET /api/Node/ValidateAccountName?AccountName=` → returns `bool`. Username async = Identity `POST /api/user/exist` → `ExistResponse { bool Exists }`. Both must be debounced.

---

#### P-12 · Switching UI copy on `FalconKeys.Error.*` code ([CATEGORY B] · 🟢 nuisance)

- **Symptom:** Localization team adds new translations but the UI still shows English fallback strings on backend errors.
- **Root cause:** FE was branching on `FalconKeys.Error.<code>` for user-facing copy. The Frontend Contract says: **use HTTP status for flow control + display localized `errorMessages[0]` already provided by backend**.
- **Mitigation:** NEVER switch on error codes for copy. Switch on HTTP status for FLOW (e.g. 401 → relogin · 423 → locked screen · 429 → start OTP timer). Display `errorMessages[0]` verbatim. Codes are for instrumentation/telemetry only. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:289-301`.
- **Real-world example:** [BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` — repeated in every V-rule's "Frontend implementation hint": *"Use HTTP status code as the primary routing signal. Display localized `errorMessages[0]` to the user (already localized; do not parse codes)."*

---

#### P-13 · OTP TTL absolute-vs-relative confusion ([CATEGORY B] · 🟡 functional bug)

- **Symptom:** OTP countdown timer either starts at the wrong value or expires immediately. User sees "OTP expired" 5 seconds into a 60-second flow.
- **Root cause:** Backend returns `OtpExpiresInSeconds` (int? — RELATIVE seconds from response). FE treats it as an absolute timestamp.
- **Mitigation:** FE must compute `expiresAt = now + OtpExpiresInSeconds`. Same trap applies to reservation TTL — `ReservationTtlSeconds=300` is relative; track expiry locally. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:212-213` (drift #12 + #13).
- **Real-world example:** [BRAIN-OUT] E-otp-challenge — backend returns relative seconds. FE on the OTP popup component must compute the absolute expiry.

---

### C. Data pitfalls

---

#### P-14 · Mongo ID vs Zitadel ID universe mixup ([CATEGORY C] · 🔴 security/data corruption)

- **Symptom:** PES check denies everything silently for a freshly-seeded test user. Ownership comparisons fail even on rows the user created.
- **Root cause:** Two ID universes coexist — Mongo `ObjectId` (Identity's primary key, called `identityUserId`) and Zitadel `sub` claim (`session.subjectId`). PES `g`-rule `obj` MUST be `u:<ZitadelUserId>@<ns>`, NEVER `u:<MongoObjectId>@<ns>`. Frontend `CurrentSubjectBuilder` derives subject from `JWT.sub` (= Zitadel id).
- **Mitigation:** ALWAYS compare with `session.identityUserId` for ownership. Use `session.subjectId` only to identify the Zitadel principal. Seed scripts must link via Zitadel id. [MEMORY] `feedback_pes_g_link_uses_zitadel_id`.
- **Real-world example:** [CODE] `apps/admin-console/.../contact-groups/models/models.ts:42-45` — explicit banner: *"NEVER compare with `session.subjectId` (Zitadel id space)"*. [BRAIN-OUT] `04-feature-parity-matrix/contact-groups.compare.md:70` references this banner.

---

#### P-15 · DTO enrichment asymmetry on port ([CATEGORY C] · 🟡 functional bug)

- **Symptom:** Mgmt-side UI shows raw codes / numbers / empty fields where admin-side shows icons / formatted prices / readable badges.
- **Root cause:** Mindset 10 — Admin-side DTOs are lean and raw; mgmt-side DTOs are enriched with `icon`, `subtitle`, `pricePeriod`, `currency`, `showDates`, `showPrice`, `iconUrl`. Porting admin → mgmt without adding these fields produces visually broken cards.
- **Mitigation:** When implementing the mgmt-side DTO, intentionally enrich. Reference the existing `AccountCommunicationChannelResponse` (admin) vs `AccountCommunicationChannelResponse` (mgmt with enrichment). [BRAIN-OUT] `KNOWLEDGE-DUMP.md:354-362` (Mindset 10).
- **Real-world example:** [BRAIN-OUT] `04-feature-parity-matrix/comms-hub.compare.md:41` — admin `CommChannelServiceItem` is lean. Mgmt adds `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`.

---

#### P-16 · Type-flip drift (`string` sent as `number`) ([CATEGORY C] · 🟢 nuisance)

- **Symptom:** Field round-trips between FE and BE but ends up corrupted — sometimes a number, sometimes a string, sometimes both.
- **Root cause:** Half-migrated types. Model declares `field: string`, mapper sends `Number(field)`, response handler reads either shape.
- **Mitigation:** Pick ONE type throughout the layer. Type-flip drift in the dataset includes `classificationCategory` (typed `string`, sent as `number`) and `country/countryId` (both `any`, assigned same value).
- **Real-world example:** [CODE] `apps/admin-console/.../organization-hierarchy/info/information.service.ts:58-61` — `AccountInformationModel.classificationCategory` typed `string`, sent as `number`. [BRAIN-OUT] `old-ui-dataset/.../organization-hierarchy/08-RULES-APPLIED.md:60`.

---

#### P-17 · Status enum int-value divergence ([CATEGORY C] · 🔴 security/data corruption)

- **Symptom:** Status badge shows the wrong color. A `Suspended` user looks `Active`, or worse, an `Expired` contract row gets shown as "Pending".
- **Root cause:** 9 status enums exist across services. Each enum has int values keyed to C# names. If the FE TS enum drifts (renumbers, renames), the mapping breaks silently — no compile error, just wrong colors.
- **Mitigation:** TS enums must mirror C# explicit ints. Use `= 1, = 2, …` mapping documented against C# names. Status normalization helpers (`toFalconItemStatus`) should defend against backend payload drift — accept both numeric and string forms.
- **Real-world example:** [CODE] `apps/admin-console/.../wallet-balance-management/wallet-balance.models.ts:14-50` — `Currency`, `WalletBalanceType`, `WalletType`, `NodeType` all use `= 1, = 2, …` explicit mapping. [BRAIN-OUT] `old-ui-dataset/.../wallet-balance-management/08-RULES-APPLIED.md:16`.

---

#### P-18 · Mixed casing in HTTP params ([CATEGORY C] · 🟢 nuisance)

- **Symptom:** One endpoint accepts `page` / `pageSize`, the next accepts `Page` / `PageSize`, a third accepts `PageNumber` / `PageSize`. Bugs show up as silent server-side ignored params (default sort/page applied).
- **Root cause:** Each backend service chose its own casing convention. FE mirrors. No platform-side normalization.
- **Mitigation:** Document the casing per endpoint in the per-feature `03-SERVICES-APIS.md`. Eventually normalize at the platform level. Until then, copy-paste from the working caller; don't guess.
- **Real-world example:** [CODE] `apps/admin-console/.../contact-groups/...` — `list()` sends `page`/`pageSize`; `getSharedGroups()` sends `Page`/`PageSize`; `getShareableUsers()` sends `PageNumber`/`PageSize`. [BRAIN-OUT] `old-ui-dataset/.../contact-groups/08-RULES-APPLIED.md:37`.

---

### D. View-hide pitfalls

---

#### P-19 · Composite gate semantics misunderstood ([CATEGORY D] · 🟡 functional bug)

- **Symptom:** Settings tab "Edit" button shows on the Falcon synthetic root or on a 3rd-level sub-node — wrong scope.
- **Root cause:** PES says `canEditAccountQuota = allow`, but the business rule is "Edit only on root OR Main node, not Sub-node-or-deeper". This is a composite gate: PES × node-type × business-rule.
- **Mitigation:** Recognize composite gates as a distinct category. `canEditSelectedSettings = canEditAccountQuota && (isRootSelection || isMainNodeSelection)`. [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md:80-93`.
- **Real-world example:** [CODE] `node-settings-tab.component.ts:129-134` — `canEditSelectedSettings` AND-combines PES + node-type + business rule. [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md:92-93` quotes: *"this prevents editing settings on a 2nd-level-or-deeper sub-node. **This is a business rule embedded as a PES dependency.**"*

---

#### P-20 · Tab-visibility reversal on port ([CATEGORY D] · 🟡 functional bug)

- **Symptom:** Mgmt-side comm-channels tab disappears entirely on the tenant's own root node — the most common landing for `acc-owner`.
- **Root cause:** Admin tab-visibility predicate is `!isFalcon && isMain` (= "not the synthetic Falcon root AND is a Main node"). On mgmt side, there IS no synthetic Falcon root — the tenant lands on their account root which itself is `isFalconNode === false && isFirstLevelChild === false`. The predicate fails for the wrong reason.
- **Mitigation:** Re-evaluate every node-type gate on port. Mgmt-side gate becomes `isRootSelection && canViewServices`. [BRAIN-OUT] `04-feature-parity-matrix/organization-hierarchy.compare.md:79-80`.
- **Real-world example:** [CODE] admin `tabs-layout.component.ts:91-125` — `{ id: 'comm-channels', enabled: !isFalcon && isMain }`. [CODE] mgmt `organization-hierarchy.component.ts:571-602` — `isRootSelection && canViewServices`. Different shape, same intent.

---

#### P-21 · Default-deny vs missing `allowedActions` ([CATEGORY D] · 🟡 functional bug)

- **Symptom:** A new row type ships and ALL row-menu actions are missing — even for `sys-admin` with every PES flag green.
- **Root cause:** The server-driven row gate uses `row.allowedActions.includes(actionEnum)`. If the backend forgot to compute `allowedActions` for the new row type, the array is `undefined` → default-deny → no menu entries. PES doesn't help.
- **Mitigation:** When adding a new row shape on the server, ensure the FSM rule that computes `allowedActions` is updated to include the new shape. FE side, log when `allowedActions === undefined` — it's almost always a backend bug.
- **Real-world example:** [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md:64-79` — quote: *"If the backend omits `allowedActions` for a row, that row gets **no menu entries**."* [CODE] `marketplace-applications.component.ts:1032-1043`.

---

#### P-22 · Six gate types collapsed into one mental model ([CATEGORY D] · 🟡 functional bug)

- **Symptom:** Implementer says "I'll just check PES" and ships UI that's broken on 4 of the 6 gate axes.
- **Root cause:** PES is ONE of SIX gate types. Every "is this UI element visible/clickable" decision can layer up to six gates: PES · session-type · node-type · mode · tab-visibility · server-driven row · composite.
- **Mitigation:** Before implementing a visibility decision, walk the 6-axis checklist. [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md` (entire file).
- **Real-world example:** `organization-hierarchy` uses ALL 6 gate types — the most gate-rich feature in the workspace. [BRAIN-OUT] `10-non-pes-gates-by-feature/MATRIX.md:108-114`.

---

### E. Cross-service pitfalls

---

#### P-23 · Currency enum drift across services ([CATEGORY E] · 🔴 security/data corruption)

- **Symptom:** Contract created with currency "SAR" works in Commerce. Wallet transfer with currency "SAR" works in Charging. But a contract → wallet flow occasionally produces a transfer with `currency: 0` (default enum value) which charging silently accepts.
- **Root cause:** Commerce binds `[EnumDataType(typeof(eCurrency))]` on the Currency field. Charging same field has NO enum attribute. Charging accepts arbitrary ints — Commerce-rejected currencies leak through if the call originates client-side without Commerce's pre-flight.
- **Mitigation:** FE wires the enum on BOTH directions (display + transfer DTOs) for consistency. Don't rely on Charging to validate. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:208` (drift #8).
- **Real-world example:** [BRAIN-OUT] V-contract-currency-enum — Commerce enforces, Charging does not. The cross-service drift is documented in the V-rule's `drift: cross-service drift` flag.

---

#### P-24 · Validation duplicated across services with different verdicts ([CATEGORY E] · 🟡 functional bug)

- **Symptom:** FE submits a valid value, Commerce accepts, but downstream Identity rejects with a different code.
- **Root cause:** Some validations are mirrored across services (e.g. `MaxNormalUserLimit` lives in Commerce but is enforced in Identity via `UserQuotaPolicy`). If the two implementations drift (different cap, different rounding), the FE sees inconsistent results depending on which service it hit first.
- **Mitigation:** Treat backend as the SoT only when validation is owned by one service. For cross-service rules (PRD-01 + PRD-02 combos), the FE must pre-flight against the OWNING service. [BRAIN-OUT] `06-validation-by-feature/MATRIX.md:78` (V-normal-user-limit-enforcement: "identity reads commerce").
- **Real-world example:** [BRAIN-OUT] V-normal-user-limit-enforcement — Add User wizard inside OH. Cap is read from `MaxNormalUserLimit` in account settings (Commerce); runtime check is server-side via `UserQuotaPolicy` (Identity). FE optionally pre-flights `/api/user/count?role=NormalUser` for the badge.

---

#### P-25 · Status enum int-value divergence between FE TS and BE C# ([CATEGORY E] · 🔴 security/data corruption)

- **Symptom:** Contract status `Expired` displays as "Active" on the FE. Or wallet status flips when the backend renumbers an enum.
- **Root cause:** TS enum and C# enum drift. FE TS enum has `Expired = 3`, BE C# enum has `Expired = 4` (because BE inserted a new status at position 3). Wire format carries integers; FE deserializes against the wrong name.
- **Mitigation:** Enum sources must be regenerated when BE adds a value. Status normalization should accept both name (string) and value (int) and lock to a canonical view-model. [BRAIN-OUT] `KNOWLEDGE-DUMP.md:399` — "Any of the 9 status enums: New value or renumber → Re-mine `02-statuses/<entity>-status.md`".
- **Real-world example:** [BRAIN-OUT] `02-statuses/contract-status.md` — full enum table with the int values. The dataset's `08-entity-drift-by-feature/MATRIX.md` calls out E-contract with 19 drift items, several enum-related.

---

## 4. The "if I see X, check Y" cheat sheet

| Symptom (what you see) | First place to look | Why |
|---|---|---|
| User logs in but every page redirects to `/unauthorized` | `app.admin-console.view` / `app.management-console.view` for this role | Mindset 5 — these are the gate before the gate |
| PES check returns deny but I can't find a deny rule | `01-roles/<role>.md` — is the resource missing? | Mindset 1 — deny-by-omission is the default |
| Role-level allow but edit fails with 403 from backend | `r.obj.createdby == r.sub.userid` expression on the rule | P-04 — expression-gated rule |
| Ownership comparison fails on a row the user created | Compare with `session.identityUserId`, NOT `session.subjectId` | P-14 — Mongo ID vs Zitadel ID universe |
| Row menu missing entirely for a new row shape | Backend `allowedActions` array for this row type | P-21 — default-deny when `allowedActions` undefined |
| Page renders empty for `acc-admin` | Feature-key (`acc.services.view` etc.) — likely explicit deny | P-07 — `app.*.view` passes but feature key denies |
| Backend accepts 50-char username, FE blocks at 30 | PRD vs backend validator drift | P-08 — `06-validation-by-feature/MATRIX.md` drift list |
| OTP timer expires immediately on a 60-second flow | `OtpExpiresInSeconds` treated as absolute instead of relative | P-13 — relative-seconds drift |
| Mgmt-side card shows raw codes where admin shows icons | DTO enrichment missing on mgmt-side | P-15 — Mindset 10 |
| Status badge shows wrong color after BE deploy | TS enum drift vs C# enum renumber | P-17 / P-25 — re-mine `02-statuses/<entity>-status.md` |

## 5. Pitfall × feature cross-reference

Which features have which pitfalls in their compare notes? (✓ = pitfall is observed in this feature's compare note)

| Pitfall | OH | CH | MA | CG | WB | CC | TC |
|---|---|---|---|---|---|---|---|
| P-01 deny-by-omission | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| P-02 scope-arg factory | — | — | — | ✓ | — | — | — |
| P-03 `app.*.view` hidden gate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| P-04 expression-gated rules | — | — | — | ✓ | — | — | — |
| P-05 wave 1.3.0 ghost keys | ✓ | — | — | — | — | — | — |
| P-06 server-driven row gate | ✓ | ✓ | ✓ | ✓ | — | — | — |
| P-07 `app.*.view` passes but feature key denies | — | ✓ | ✓ | — | — | ✓ | — |
| P-08 FE-tighter-than-backend drift | ✓ | — | — | ✓ | — | ✓ | — |
| P-14 Mongo ID vs Zitadel ID | — | — | — | ✓ | — | — | — |
| P-15 DTO enrichment asymmetry | ✓ | ✓ | ✓ | — | — | — | — |
| P-17 status enum int divergence | — | ✓ | ✓ | — | ✓ | ✓ | — |
| P-19 composite gate semantics | ✓ | — | — | ✓ | ✓ | ✓ | — |
| P-20 tab-visibility reversal | ✓ | — | — | — | — | — | — |
| P-22 six gate types | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| P-23 currency enum drift | — | — | — | — | ✓ | ✓ | — |

## 6. Cross-references

- [[../KNOWLEDGE-DUMP]] — Part 6 has the 10 mindsets in canonical form
- [[../04-feature-parity-matrix/MATRIX]] — the 7-feature grid; pick a feature, read its compare note
- [[../06-validation-by-feature/MATRIX]] — drift watch + 3-layer architecture (§5)
- [[../07-cross-cutting/permission-sheet-gaps]] — Q-UM-07 + Q-AM-16 caveats on Tab 2
- [[../08-entity-drift-by-feature/MATRIX]] — 179 entity drift items
- [[../10-non-pes-gates-by-feature/MATRIX]] — the 6 non-PES gate types
- [[ANTI-PATTERNS]] — what NOT to port from the old UI
- [BRAIN-OUT] `datasets/old-ui-dataset/10-pages/admin-console/<feature>/08-RULES-APPLIED.md` — the raw per-feature anti-pattern inputs
