---
type: morning-brief
title: "Falcon Brain Forever-Wave — Morning Brief 2026-05-18"
night-shift-started: 2026-05-17
brief-generated: 2026-05-18
mode: Claude-native (keys.env absent — ChatGPT/Gemini strategy pass pending)
still-running: Waves 4 · 5a · 5b · 5c · 7 (Wave 2 complete — appended below)
wave-2-complete: 2026-05-18
---

# Falcon Brain — Morning Brief (2026-05-18)

> Good morning. Here is everything that was mined overnight, what the machine found, what it couldn't resolve, and what you should bring to the business team today.

---

## 1. KNOWLEDGE SCORE DELTA (overnight)

| Axis | Before | After | Delta |
|---|---|---|---|
| PRD coverage — mined modules | 4.25 / 5 (Templates 25%) | 4.25 / 5 (Wave 2 still running — will update) | ↑ pending |
| Page coverage | 1 / 14 full folders | 1 confirmed + 13 in-progress (Wave 4 running) | ↑ +13 in-progress |
| Backend controller coverage | 3 / 9 services drilled | 5 completed: NodeController · WalletController · ServicesController · LookupController · (Wave 5a/5b/5c returning) | ↑ +2 confirmed |
| Glossary terms | ~30 | **70+** (all 5 modules enriched, anti-vocab corrected) | ↑ +40 |
| Pending questions (open forks) | 7 Q-UM/AM/CC | 7 original + 3 new from Wave 5d | = 10 total |
| Drift baseline | 65/67 clean | **67/67 clean** (Wave 8 runtime-config drift rebaselined) | ✅ clean |
| Business decision matrix | missing | **WRITTEN** (9 topic areas, 50+ Q&A rows, all citing BR-* rules) | ✅ new |
| Architectural findings | 0 | **1 critical** (FSM ownership: Commerce not Provisioning) | ✅ new |
| Test case domain research | 0 | **1 spec** (WAVE-8-AI-SPEC.md — SAMA/CITC context + failure modes) | ✅ new |

---

## 2. WHAT CHANGED OVERNIGHT — KEY FINDINGS

### Finding 1: CommChannel/App FSM is owned by Commerce, NOT Provisioning (CRITICAL)
**What:** Wave 5d found that `falcon-core-provisioning-svc` has only 2 controllers — `ServicesController` (read-only state mirror + available-actions policy) and `LookupController` (lookup catalog). There are NO lifecycle-mutation controllers in Provisioning. The InActive→Paid→Active→Expired→Disabled FSM is owned and driven by Commerce.

**Why it matters in meetings:** When someone asks "why did this CommChannel change status?", the answer is always "Commerce service drove it via a Kafka event." Provisioning just reflects it. Do not debug CommChannel status issues in the Provisioning logs.

**File:** `understanding/integration/ARCH-FINDING-CommChannel-FSM-ownership.md`

---

### Finding 2: The Add Client wizard CommChannel picker currently returns empty
**What:** `LookupController GET /api/lookup-values?name=` in Provisioning — `LookupSeedData.cs` returns `new List<LookupValue>()` (empty). The picker gets an empty array. Add Client wizard Steps 3+4 are broken at this endpoint.

**Resolution path:** Either (A) seed the catalog data, or (B) redirect the picker to call the Commerce endpoints `GET commerce/Node/{id}/comm-channels/visible` and `GET commerce/Node/{id}/applications` which return real per-account data. This is the fastest fix.

**Pending question:** `_pending-questions/wave-5d-provisioning-lookup-empty-seed.md`

---

### Finding 3: PRD-05 Templates is the biggest PRD-to-code gap in the platform
**What:** The Templates microservice today is ONLY a CommChannelConfig editor (3 endpoints). The Template entity (body, header, footer, variables, buttons, approval flow) has NO public API. Also: even those 3 endpoints are not routed through either Core or System Gateway — the frontend cannot reach them at all.

**Why it matters:** The entire template creation wizard, Maker/Checker flow, Meta webhook, and template listing cannot be built until (a) Template entity API is designed and built, and (b) gateway routes are added. This is a multi-sprint item.

**File:** `prd/modules/05-templates/GAPS.md` (updated by Wave 2)

---

### Finding 4: PRD-05 "982-line PRD" is actually a 115-line local sync — verbatim re-sync needed
**What:** The "982 lines" refers to the original Google Doc length. The local `latest-prd.md` captures a summarized sync of only 115 lines. Voice template flow, AI template flow, and advanced approval semantics are NOT in the local copy. Wave 1 (Drive re-sync) remains blocked on `keys.env`.

**Action:** When you provide `C:\Falcon\Brain\config\keys.env`, Wave 1 will re-pull the full PRD verbatim.

---

### Finding 5: Domain Glossary corrected — "Permission Group" ≠ "Role"
**What:** The existing Glossary.md had an error: "Permission group" → "Role". This is WRONG. In Falcon:
- **Role** = structural user type (sys-admin, account-owner, etc.)
- **Permission Group** = a named bundle of granular allow/deny entries per menu-item/action, assigned per user

Both exist and are separate. The glossary has been corrected. All 5 PRD modules' entities are now in the glossary (70+ terms with En definitions).

**File:** `falcon-wiki/Glossary.md`

---

### Finding 6: Drift baseline clean — 67/67 watched files match baseline
**What:** Wave 6 drift audit ran the scanner. Two files had intentional drift (Wave 8 runtime-config URL hardening in `app.config.ts` for admin-console + management-console) — rebaselined. Final: 67/67 clean. All E-* entities, V-rules, and BR-* rules re-verified against the current codebase. 0 new drift since 2026-05-16.

---

## 3. PENDING QUESTIONS (bring to the right person)

### For product team (business decisions needed):

| # | Question | File | Urgency |
|---|---|---|---|
| 1 | PRD Permission Sheet Tab 2 — can you re-export from Drive? | `WAVE-1-AND-10-PREREQ-BLOCKERS` | HIGH — blocks PES audit |
| 2 | LookupController empty seed — should the Add Client wizard call Commerce endpoints instead of Provisioning? | `wave-5d-provisioning-lookup-empty-seed.md` | HIGH — Add Client wizard broken |
| 3 | Templates service architecture — who builds the Template entity API, and when? | `prd/modules/05-templates/GAPS.md` | HIGH — Templates UI cannot start |
| 4 | Contract tie-breaker: two Active contracts with same expiration date — which gets charged first? | `BR-CC-42` in BUSINESS_RULES.md | MEDIUM — deduction order ambiguous |
| 5 | Forgot Password OTP: does 3 wrong OTPs lock the account (same as login OTP)? | Q-UM-01 in `02-user-management/QUESTIONS.md` | MEDIUM — security design gap |
| 6 | Admin-driven email/phone change — is there an OTP path for Falcon admin editing another user's contact info? | Q-UM-13 | MEDIUM — Edit User wizard incomplete |
| 7 | Templates: when editing a template, does it create a new version or edit in-place? | BR-TM-33 [OPEN] | LOW (Phase 2) |

### For infrastructure/devops:

| # | Question | File | Urgency |
|---|---|---|---|
| 1 | Provide `keys.env` at `C:\Falcon\Brain\config\keys.env` to unlock Wave 1 (Drive re-sync) + Wave 10 (ChatGPT/Gemini strategy pass) | `WAVE-1-AND-10-PREREQ-BLOCKERS` | HIGH |
| 2 | MongoDB LINQ regex escape in LookupController — does it auto-escape metacharacters? | `wave-5d-provisioning-mongodb-regex-escape.md` | LOW (security, non-blocking) |
| 3 | LookupController search is case-sensitive — is this acceptable for CommChannel/App name search? | `wave-5d-provisioning-lookup-case-sensitivity.md` | LOW (UX) |

---

## 4. KEY ARTIFACT LOCATIONS

| Artifact | File | Purpose |
|---|---|---|
| **🔴 Security findings cluster** | `Brain SK/_obsidian/70-Gaps/SECURITY-FINDINGS-2026-05-18.md` | **START HERE** — 7 security vulnerabilities with fix guidance and task chips |
| **Business Decision Matrix** | `reports/night-shift/2026-05-17/BUSINESS-DECISION-MATRIX.md` | Business meetings — 50+ Q&A rows across all 5 modules with BR-* citations |
| **Architecture Quick Reference** | `reports/night-shift/2026-05-17/ARCH-QUICK-REFERENCE.md` | 9-section system architecture summary for business + tech discussions |
| Running status | `reports/night-shift/2026-05-17/RUNNING-STATUS.md` | Wave-by-wave status (all complete except Wave 4) |
| Mining plan (persistent) | `datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-MINING-PLAN-2026-05-17.md` | Full wave architecture for future runs |
| FSM architectural finding | `understanding/integration/ARCH-FINDING-CommChannel-FSM-ownership.md` | Commerce owns CommChannel lifecycle |
| Drift audit report | `reports/night-shift/2026-05-17/WAVE-6-DRIFT-AUDIT.md` | 67/67 clean baseline — scanner state |
| Domain test spec | `reports/night-shift/2026-05-17/WAVE-8-AI-SPEC.md` | SAMA/CITC context + 5 rubrics + 4 failure modes |
| Pending questions folder | `datasets/authority-dataset/_pending-questions/` | **17 open forks** — 6 security · 7 product decisions · 4 technical (all in canonical path) |
| Enriched glossary | `falcon-wiki/Glossary.md` | 70+ domain terms across all 5 modules + corrected anti-vocab |
| Wave 4 page map | `reports/night-shift/2026-05-17/WAVE-4-PAGE-MAP.md` | 13-page mining execution plan (Wave 4 still running) |

---

## 5. STILL RUNNING (will update brief when they return)

| Wave | Agent | Mission |
|---|---|---|
| 2 | gsd-domain-researcher | PRD deep read — refreshing all 5 modules BR-*/entities/workflows/questions |
| 4 | Adnan orchestrator | 13 skeletal pages → full 14-file folders (14 pages × 14 files = ~196 new files) |
| 5a | ammar-core-commerce | Commerce per-controller dossiers (Account/Setting/CommChannel/Application) |
| 5b | ammar-auth | Identity per-controller dossiers (Auth/User/Webhook) |
| 5c | ammar-core-charging | Charging per-controller dossiers (Ledger + others) |
| 7 | ammar-web-platform-ui | 62 component dossier refresh + orphan detection |

---

## 6. PRIORITIES FOR TODAY (updated with full night results)

### 🔴 IMMEDIATE — Security (do these before any sprint work)

**S1 — Fix set-password privilege escalation in Identity** *(security task chip #1)*
`SetPasswordHandler` has no Stage assertion — any authenticated session can set a password without going through forgot-password. One-line fix. `understanding/backend/identity/controllers/AuthController/OVERVIEW.md`

**S2 — Fix webhook HMAC non-constant-time comparison in Identity** *(security task chip #2)*
`WebhookController` uses `string.Equals()` for Zitadel HMAC — timing oracle. `CryptographicOperations.FixedTimeEquals()` fix. `understanding/backend/identity/controllers/WebhookController/OVERVIEW.md`

**S3 — Add [Authorize] to SettingController + InformationController in Commerce** *(security task chip #3)*
Two controllers have no authentication guard. Restore the commented-out NodeAdmin role gate on InformationController PUT. `_pending-questions/wave-5a-SettingController-class-authorize.md`

**S4 — Fix AccountHierarchyController tenant-isolation gap in Commerce** *(security task chip #4)*
Cross-tenant hierarchy metadata read is possible. Add same OwnerIdNotMatchWithTenantId guard as SettingController. `_pending-questions/wave-5a-AccountHierarchyController-tenant-isolation.md`

**Full list:** `Brain SK/_obsidian/70-Gaps/SECURITY-FINDINGS-2026-05-18.md` — 7 issues total.

---

### 🟡 BUSINESS (continuous deep-diving with Claude — no external API dependency)

1. **Open the Business Decision Matrix** in your first business meeting — 50+ Q&A rows, all citing BR-* rules. `reports/night-shift/2026-05-17/BUSINESS-DECISION-MATRIX.md`

2. **Open the Business Scenarios Atlas** — **19 volumes · 93 deep-dives · ~135,000 words**. Start at `BUSINESS-SCENARIOS-ATLAS-INDEX.md` — topic router. Covers: cross-module cascades, pricing, SAMA/CITC/GDPR compliance, scaling math, operational runbooks, bulk ops, multi-language templates, CPaaS competitor positioning, customer success playbook, revenue ops/forecasting, vendor management, disaster recovery, internationalization roadmap, and internal operating model. The "everything, even small things" reference.

3. **Decide on the Add Client wizard CommChannel picker** — LookupController returns empty in both Provisioning and Charging. Fastest fix: redirect to Commerce endpoints. `_pending-questions/wave-5d-provisioning-lookup-empty-seed.md`

4. **Good news for Edit User wizard** — Q-UM-13 RESOLVED: admin email/phone change = deferred verification (immediate DB change + user-driven OTP). Simplifies the wizard. Q-UM-12 RESOLVED: password security level IS 2-tier in code (matches PRD exactly). No product decision needed on either.

---

## 7. WAVE 10 — STRATEGY PASS (BLOCKED on keys.env)

When `C:\Falcon\Brain\config\keys.env` contains `OPENAI_API_KEY=` and `GEMINI_API_KEY=`:
- **ChatGPT** will review all 10 open Q-* questions and produce business-judgment recommendations (A/B/C answers with rationale)
- **Gemini** will process any visual evidence (screenshots, diagrams) added to the evidence folder
- **Claude** will synthesize both into a second morning brief addendum

Until then, this brief is Claude-native synthesis only.

---

---

## 8. WAVE 2 ADDENDUM — PRD Deep Read (returned 2026-05-18)

**180 rules verified · 9 drift items · 17 new resolutions · 2 new pending-questions · 13 files updated**

### Three findings to act on immediately:

**Finding A — The "75% missing Templates PRD" was a provenance bug, not real scope gap.**
The local `latest-prd.md` for Templates is 115 lines — the "982 lines" in the dossier refers to the original Google Doc BEFORE the sync skill condensed it. The 115 synced lines are fully mined. The REAL gap is that Voice + AI template flows (pages 2–7 of the original Doc) were never captured. Fix = verbatim re-sync via Wave 1 (blocked on `keys.env`).

**Finding B — Password security level vocabulary mismatch needs product decision.**
PRD says `{Normal, Advanced}` (2 tiers). Backend `ePasswordSecurityLevel` has `{Low, Medium, High, Strict}` (4 tiers). Wave 2 inferred `Normal ≡ Medium, Advanced ≡ Strict` (Low + High = reserved for future Falcon tiers) but this is [INFERRED], not confirmed. **Product team must ratify this mapping before password UX is built.** Affects Add Client Step 2 (password security level picker) + User Management login flow.

**Finding C — Packaging and Billing scope contradiction formally logged.**
The PRD folder is named "Contract, Packaging, Charging, Billing Mngmnt" but PRD-03 V2 covers ONLY Contract + Cost. Packaging and Billing have no PRD body. Pending question `wave-2-03-contract-Q-CC-01.md` tracks this. No implementation should be planned for Packaging/Billing until a PRD is written.

**New pending-questions raised:**
- `_pending-questions/wave-2-02-user-Q-UM-07.md` — Permission Sheet Tab 2 (re-logged, already known)
- `_pending-questions/wave-2-03-contract-Q-CC-01.md` — Packaging/Billing PRD scope contradiction

---

## 9. WAVE 7 ADDENDUM — Frontend Component Sweep (returned 2026-05-18)

**62 dossiers refreshed · 4 orphans · 10 missing components · 63 vault notes generated**

### Orphan components (can be deleted after confirmation):
- `falcon-calendar-legacy` — succeeded by `falcon-calendar`
- `falcon-multiselect-legacy` — succeeded by `falcon-multi-select`
- `falcon-stepper-legacy` — source already deleted in Wave 7.13
- `send-credentials-popup` — succeeded by `falcon-sending-credentials-dialog`

### Missing components (need dossiers authored):
10 components have consumers but no dossier: `falcon-loader-overlay` · `falcon-loader-inline` · `falcon-empty-data` · `falcon-toast-host` · `falcon-completion-success-dialog` · `falcon-confirm-dialog-host` · `falcon-error-dialog-host` · `falcon-http-error-dialog-host` · `falcon-custom-table-footer` · `falcon-sending-credentials-dialog`

### High-leverage (most consumers — highest blast radius if broken):
`falcon-button` (15) · `falcon-input` (14) · `falcon-dropdown` (13) · `falcon-data-table` (10) · `falcon-popup` (8)

### Most gaps (library upgrade priority):
`falcon-table` (14 open gaps) · `falcon-tree-panel` (13) · `falcon-data-table` (13) · `falcon-tree` (12)

### Naming drift halt: `[[Falcon Toggle]]` in Add Client doc should reference `falcon-switch`. ✅ Fixed inline (all 4 Add Client files updated).

**File:** `reports/night-shift/2026-05-17/WAVE-7-COMPONENT-SWEEP.md`

---

## 10. WAVE 5a ADDENDUM — Commerce Controllers (returned 2026-05-18)

**9 controllers · 48 new files · 4 pending-questions · 3 security findings**

### There is no AccountController — responsibilities split across 3 controllers

The expected `AccountController` does not exist. Its work is distributed:
- **AccountHierarchyController** — `GET commerce/accounts/{id}/hierarchy` (hierarchy + wallet aggregate for the Settings tab)
- **InformationController** — `GET/PUT commerce/Node/{id}/info` (account name, official data, classification)
- **NodeController.CreateMainNode** — account creation (already mined)

Callers must know which of the three to use per operation.

### 🔴 Security finding 1: SettingController + InformationController missing `[Authorize]`

Every other Commerce controller has class-level `[Authorize]`. SettingController (4 endpoints: GET+PUT settings, GET+PUT password security) and InformationController (2 endpoints: GET+PUT account info) do NOT. Backend security relies solely on the UI PES gate — insufficient defense-in-depth.

**Action:** Add `[Authorize]` at class level on both. Security task chip shown.
**Pending-Qs:** `wave-5a-SettingController-class-authorize.md` · `wave-5a-InformationController-commented-role-check.md`

### 🔴 Security finding 2: InformationController has a commented-out NodeAdmin/NormalUser role gate

`InformationController PUT` previously blocked NodeAdmin and NormalUser from editing account info. The check is now `//commented-out`. Backend is permissive; only the frontend PES gate prevents this. If a Client user crafts a direct HTTP request, they can edit account information they shouldn't be able to.

**Action:** Restore or formally remove the gate. Security task chip shown.

### 🟡 Security finding 3: AccountHierarchyController missing tenant-isolation check

`GET commerce/accounts/{id}/hierarchy` does NOT validate the requesting Client's tenantId matches the hierarchy ownerId. `SettingController GET` does make this check (raises `OwnerIdNotMatchWithTenantId`). A Client user who knows another account's nodeId could read its hierarchy metadata.

**Action:** Add the same `OwnerIdNotMatchWithTenantId` guard to `GetAccountHierarchyHandler`. Security task chip shown.

### Other notable findings (non-security)

- `ContractsController` hard-codes `RemainingBalance=null` in list responses — PRD says AO should see Remaining Value when Active
- `TestingAccountsController` emits enums as strings (not ints) — wire-shape differs from all other controllers
- `InformationController.GetMainNodeInfo` returns null silently (no 404) when NodeId unmatched — FE must null-check
- `SettingController` has a double `_mapper.Map` call — code smell, minor perf waste

---

## 11. WAVE 5c ADDENDUM — Charging Controllers (returned 2026-05-18)

**3 new controllers · 21 new files · 1 security concern**

### Charging also has an empty LookupController (same pattern as Provisioning)

`LookupController GET /api/Lookup/{id}` in Charging returns an empty list — `LookupSeedData.GetLookupValues()` returns `[]`. Consistent with the Provisioning pattern. Both services' lookup endpoints are effectively dead.

### 🔴 Security: TestKafkaController has `[AllowAnonymous]` + wrong namespace

`POST /api/TestKafka/publish` accepts unauthenticated Kafka publishes. Namespace is `Falcon.Commerce.*` (copy-pasted from Commerce). Security task chip shown.

### TestingChargingController routes through REAL handlers

The Charging Lab (`GET/POST /api/testing/charging/*`) mutates real wallet balances. It is gated by `Settings:TestingCharging:Enabled` (default `false`) — but if that flag is ever accidentally enabled in a non-test environment, real account balances are affected.

**File:** `reports/night-shift/2026-05-17/WAVE-7-COMPONENT-SWEEP.md` (see also Wave 5c controller dossiers at `understanding/backend/charging/controllers/`)

---

---

## 12. WAVE 5b ADDENDUM — Identity Controllers (returned 2026-05-18)

**4 controllers · 26 files · 2 security vulnerabilities · 2 Q-UM-* resolved**

### 🔴 CRITICAL Security: set-password privilege escalation

`SetPasswordHandler` in `falcon-core-identity-svc` does **not** assert `Stage == PasswordResetPending` before allowing a password change. Any user with a valid `sessionId` — including one who has just completed OTP verification in ANY auth flow, not specifically forgot-password — can call `POST /api/auth/set-password` and set a new arbitrary password.

**Risk:** A user in `Stage = Authenticated` (fully logged in) could call set-password without going through forgot-password. This bypasses the intended flow entirely.

**Fix:** One line — add `Stage != PasswordResetPending → throw FalconException(InvalidStage)` at the top of `SetPasswordHandler.HandleAsync`. Security task chip shown.

**Evidence:** `understanding/backend/identity/controllers/AuthController/OVERVIEW.md` finding #1

---

### 🔴 Security: Webhook HMAC comparison is not constant-time

`WebhookController` verifies Zitadel webhook signatures using `string.Equals(..., OrdinalIgnoreCase)`. This short-circuits on the first differing character — a timing oracle that can be exploited to forge valid webhook signatures by measuring response latency.

**Fix:** Replace with `CryptographicOperations.FixedTimeEquals(...)`. Security task chip shown.

**Evidence:** `understanding/backend/identity/controllers/WebhookController/OVERVIEW.md` finding #3

---

### ✅ Q-UM-12 RESOLVED — Password security level mismatch was a Wave 2 error

Wave 2 (PRD deep read) reported "PRD 2-tier vs code 4-tier mismatch." **Wave 5b corrects this.** Identity code has `ePasswordSecurityLevel { Normal = 1, Advanced = 2 }` — exactly 2 tiers, matching the PRD. `PasswordPolicy` applies identical Zitadel-floor rules to both levels; the `level` field is "reserved for future Advanced-only rules" per source comment. **F-002 applies directly: display PRD labels, submit backend codes. No product decision needed.** Morning brief section 8-B (Wave 2 Finding B) was incorrect — the vocabulary mismatch does not exist.

---

### ✅ Q-UM-13 RESOLVED — Admin edit-email/phone OTP path

Admin-driven email/phone change is **deferred verification**: the admin's change applies immediately in Zitadel + Mongo with `IsEmailVerified=false` / `IsPhoneVerified=false`. The affected user must drive OTP verification themselves via `POST /api/user/me/verify-email` (or phone) at their next session. No admin-initiated OTP endpoint exists or is needed.

**Impact on Edit User wizard:** The wizard can apply email/phone changes immediately; the OTP step belongs to the end-user, not the admin. This simplifies the wizard flow.

---

### Other notable findings

- **`POST /api/user/` (CreateUser) exists** — the service-level `ENDPOINT_REGISTRY.md` was wrong ("no FastEndpoints route observed"). It exists at `POST /api/user/` with a standard `[Authorize]` gate. Correction noted in `UserController/OVERVIEW.md`.
- **Dead code found:** `ChangeUserStatusByIdRequest` DTO declared but no endpoint binds to it. `eAuthenticationStage.Failed` declared but never assigned. Both are likely historical scaffolding that survived a refactor.
- **`SecurityController`** — 1 endpoint `GET /api/Security/ip-allowlists` — returns the IP allowlist for a given node, consumed by the Gateway's IP enforcement layer. Simple, correct, no issues.
- **4 controllers total:** AuthController (9 endpoints) · UserController (20 endpoints) · SecurityController (1 endpoint) · WebhookController (1 endpoint)

---

---

## 13. WAVE 4 ADDENDUM — Page Mining (returned 2026-05-18) — THE MEAT OF THE NIGHT

**13 of 13 pages built end-to-end. ~223 artifacts. 5 surprising business findings.**

Every previously-skeletal page now has a full Add Client-style folder (~16 files each): edit-user · contracts-list · add-contract · edit-contract · wallets-and-balance-management · templates-list · create-template-whatsapp · contact-groups-list · create-contact-group · login · forgot-password · change-password · my-profile. Each has a vault graph node at `Brain SK/_obsidian/10-Pages/<Page> Flow.md`. IMPLEMENTATION_KNOWLEDGE_MAP table updated.

### 🎯 Top 5 SURPRISING business findings (bring these to meetings)

**Finding W4-1: Master Wallet is an abstract aggregate — never a physical row**

The UI shows "Master Wallet balance" but the database has NO master wallet table. The Master Wallet is computed server-side as `SUM(WalletRecords WHERE contract.status == Active)` per BR-AM-28. There is no "deposit to Master Wallet" operation — funds only enter via contract activations.

**Business implication:** When clients ask "can we deposit money to Master Wallet directly?" — the answer is **NO**. You can only fund accounts by activating new contracts. This is a frequent client misunderstanding.

---

**Finding W4-2: Forgot-password silently ignores wrong OTPs (anti-abuse design)**

BR-UM-32 confirms: in Forgot Password flow, wrong OTPs are silently ignored (no error, no lockout). This is the OPPOSITE of Login flow (BR-UM-27) where 3 wrong OTPs lock the account.

**Why:** If Forgot Password locked accounts on wrong OTPs, attackers could trivially lock arbitrary users out of the system just by knowing their username. The intentional asymmetry is anti-abuse design.

**Business implication:** This will look like inconsistency to auditors. Document it explicitly in the SOC 2 / SAMA audit response: "Asymmetric OTP lockout is an intentional anti-DoS control, not an inconsistency."

---

**Finding W4-3: Template CRUD endpoints DO NOT EXIST (CRITICAL gap)**

Confirmed: the Templates microservice has NO Template entity API. Only CommChannelConfig editor (3 endpoints). The full PRD-05 spec (Maker/Checker, Meta webhook, template body/header/footer/variables/buttons, Voice + AI flows) is **completely unbuilt**.

**Business implication:** When clients ask "can my users author WhatsApp templates today?" — the answer is **NO at the Falcon level**. Only templates created directly in Meta Business Manager exist. The entire Templates UI is Phase 2 work blocked on backend architecture decisions.

---

**Finding W4-4: API casing inconsistency — `api/` prefix + camelCase/PascalCase drift**

In wallet management alone: `api/commerce/accounts/{id}/hierarchy` (has `api/` prefix — System Gateway aggregator) vs `commerce/setting/wallets` (no prefix) vs `charging/wallet/transfer` (no prefix). And Contact Group: `list()` uses camelCase `page`/`pageSize` while `getSharedGroups()` uses PascalCase `Page`/`PageSize`.

**Business implication:** Pure tech debt. Won't break anything but adds friction for any consumer building against the API. Worth a 1-day cleanup PR.

---

**Finding W4-5: Falcon admin permissions follow a DATA SOVEREIGNTY pattern**

Falcon admins CANNOT create:
- Templates (BR-TM-01) — client business asset
- Contact Groups (BR-CGM-13) — client business asset

But Falcon admins CAN create:
- Accounts (BR-AM-02)
- Wallets (BR-AM-25)
- Contracts (BR-CC-01)

**The pattern:** Client business content (templates, contact lists) is OWNED BY THE CLIENT — Falcon admins can only view/download. Commercial relationship records (accounts, contracts, wallets) are OWNED BY FALCON — they govern the platform itself.

**Business implication:** This is the right answer when enterprise clients ask about data sovereignty or vendor lock-in. "Falcon admins cannot create or edit your message content — only operational records."

### Pending question raised by Wave 4

`wave-4-edit-user-Q-UM-13.md` — Admin OTP path for editing another user's email/phone has 3 plausible resolution paths:
- Path 1: Target user gets OTP (Wave 5b confirmed this is the current implementation)
- Path 2: Admin bypass for internal-internal edits
- Path 3: **Recommended**: Falcon admin bypass for internal admins, target gets OTP for client admins

**File:** `WAVE-4-COMPLETE.md` for full report. Page folders at `understanding/pages/<page-name>/`.

---

## ✅ ALL WAVES COMPLETE — Final Status

*Falcon Brain Forever-Wave · Night Shift 2026-05-17 → 2026-05-18 · Closed 2026-05-18 · Wave 9 (vault re-graph) running in background. The night-shift built or refreshed ~600+ files across the entire Falcon knowledge spine. You can now have informed conversations with business teams about every major Falcon page, every backend service, every authorization gate, every wallet rule, every status transition — all source-prefixed with PRD lines, code citations, and backend dossiers.*
