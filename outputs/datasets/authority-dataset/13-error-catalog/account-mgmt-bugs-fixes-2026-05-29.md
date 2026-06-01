---
type: bug-fix-knowledge-doc
cluster: 13-error-catalog
title: "Account-Management admin-console bugs + fixes (2026-05-29)"
created: 2026-05-29
source-run: "C:/Falcon/qa/runs/account-mgmt-bugs-2026-05-29/ (FINAL-SUMMARY.md + WAVE-LOG.md + FINDINGS.md + BUG-INVENTORY.md)"
source-sheet: "Account Mngmnt Module - Bugs.xlsx → tab 'Admin Screens - New Design' (gid 1511826764, 16 rows / ~19 issues)"
app: "falcon-web-platform-ui/apps/admin-console (+ management-console + host-shell for shared slices)"
scope: "frontend-only fix session — NO backend edits, NO commits (working tree only). 2 items flagged for backend, 1 blocked on ADO criteria."
purpose: "Answers 'what were the Account-Management admin-console bugs, what was the root cause, what was the fix, and is it done?' One query-friendly record so a future agent does not re-investigate."
verification: "Static / build-green only (npx nx build {admin-console,host-shell,management-console} --skip-nx-cache → all exit 0). Runtime/visual NOT yet done — see VERIFICATION-STATUS.md."
related-docs:
  - "06-validation-by-feature/MATRIX.md (node-name parity + account-image cap — updated 2026-05-29)"
  - "13-error-catalog/CATALOG.md (NormalUserLimitReached 422)"
  - "14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md (V-subnode-name-maxlength-30)"
  - "18-a-to-z-traces/Add-Node.trace.md + Edit-Node.trace.md"
tags: ["#cluster/error-catalog", "#module/account-mgmt", "#module/user-mgmt", "#scope/frontend", "#status/fixed-not-runtime-verified"]
---

# Account-Management admin-console bugs + fixes (2026-05-29)

> [!tldr]
> 16 rows / ~19 issues from `Account Mngmnt Module - Bugs.xlsx` ("Admin Screens - New Design") were triaged and fixed **frontend-only**. **10 bugs fixed this session** (all build-green), **3 already fixed** on current code (videos predate the 2026-05-21/24 "Wave-F" validation hardening), **2 not FE-fixable → flagged for backend** (BUG-17 Commerce settings PUT, BUG-11 role-enum SoT), **1 blocked** on ADO story 120380 criteria (BUG-16). No commits; all edits in the working tree. Verification is **static/build-green only** — runtime/visual not yet performed.

> [!warning] Source-prefix + verification honesty
> Every `[CODE] file:line` below is transcribed verbatim from the authoritative QA run (`[BRAIN-OUT] qa/runs/account-mgmt-bugs-2026-05-29/`). The `falcon-web-platform-ui` repo is not checked out under `C:\Falcon` in this environment, so these citations were **not re-opened against live source here** — they are trusted from the run that produced them. Status of every fix is **build-green, not runtime-verified**. Do not promote any of these to "runtime-verified" without a live-stack pass (Module Federation + Docker + Zitadel login + multi-step wizards).

## Locked product decisions (carry forward)

1. **Account / profile image cap = 1 MB** — keep `BR-UM-48` (`image/png` + `image/jpeg`, **1 MiB = 1,048,576 bytes** max). `[BRAIN-OUT] prd/modules/02-user-management/BUSINESS_RULES.md:103`.
2. **BUG-12 resolution = add an FE fail-open** (System Admin must be able to edit a client-created role even when PES returns all-deny). User-approved.
3. **Account name already allows** `'` `-` space `&` (charset hardened in Wave-F 2026-05-24); 1-char rejected (`minLength:2`). Node name brought to parity in BUG-08.

---

## Summary table — all 16 rows

| Bug | Screen / Area | Issue (condensed) | Root cause (file:line) | Fix (file:line) | Status |
|-----|---------------|-------------------|------------------------|------------------|--------|
| **BUG-02** | Org Hierarchy → Edit node (side panel) | 1-char name → Update no-ops; error rendered behind the panel | (already fixed 2026-05-21; only a stale comment remained) | `…/falcon-org-node-drawer/validations/validations.ts` (admin + mgmt) — stale comment corrected | **already-fixed** |
| **BUG-03** | Add Client → Step 1 (image upload) | Oversize image → "nothing shown"; banner auto-cleared after 6 s | `falcon-photo-uploader.component.ts` `flagOversize()` armed a 6 s `setTimeout`; uploader had no explicit `[maxBytes]` (relied on 1 MiB default) | `client-information-step.component.html:15` + `client-account-owner-step.component.html:17` explicit `[maxBytes]="1024*1024"`; `falcon-photo-uploader.component.ts` `flagOversize()` no longer arms the 6 s timeout — `oversizeError` persists until a valid file / re-upload / × clear | **fixed-this-session** (Wave 10) |
| **BUG-04** | Add Client → Account name | (a) validation timing inconsistent (live vs on-Next); (b) accepts 1 char | (a) `required`-on-blur is by design; (b) already enforced `minLength:2` (Wave-F) | charset/min already correct (Wave-F); timing left by design (live `required` is platform-wide) | **already-fixed** (charset+min) / by-design (timing) |
| **BUG-05** | Add Client → Steps 3 & 4 | Header/value column misalignment; row dropdown top-anchored | priceType/priceValue cells wrapped controls in `grid grid-rows-[1fr_auto_1fr] h-full w-full`; `h-full` inside a `table-cell` is undefined → collapses → control top-anchored (violates table-tailwind contract: the cell already owns height + `vertical-align:middle`) | `client-applications-step.component.html` (step 4) + `client-comm-channels-step.component.html` (step 3) — outer wrapper → `flex flex-col w-full`; control kept in `flex items-center w-full`; reserved `h-3.5` error span unchanged | **fixed-this-session** (Wave 4) |
| **BUG-06** | Add Client → Step 5 / Finish | Validation inconsistent vs step 1; Finish with bad data → unclear error | Step 5 injected its rule-map but ignored it — validated via private `errMsg()`/`userError()`/hand-rolled `isFormValid` (6 direct validator calls), while step 1 uses `fieldErrorMessage()` + `allFieldsValid()` | `client-account-owner-step.component.ts` — per-field errors → `fieldErrorMessage(value,'<field>',rules,touched())`; `isFormValid` → `allFieldsValid(value,rules)`; async username-uniqueness gate kept verbatim; dead `errMsg()` removed | **fixed-this-session** (Wave 9, behavior-preserving) |
| **BUG-07** | Add Client → submit | Account name = 1 char → backend 400 (FE should have blocked) | FE already blocks 1-char (`minLength:2`, Wave-F). Backend Commerce has no min-2 mirror (defense-in-depth gap) | none needed on FE (ties to BUG-04) | **already-fixed** (FE) / BE defense-in-depth flagged |
| **BUG-08** | Add Node / Edit Node | Add/Edit-node name validation must equal create-node step-1 account-name validation | `nodeName()` used `STARTS_WITH_LETTER` + `LETTERS_ONLY` → wrongly rejected `'` `-` space `&` and forced a leading letter, unlike `accountName()` | `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` — `nodeName()` rewritten to mirror `accountName()`: `required(trim)` → `ACCOUNT_NAME_CHARSET` → `minLength(2)` → `maxLength(30)`; reuses `accountNameCharset` error key (no en/ar change) | **fixed-this-session** (Wave 1) — **resolves the long-open `V-subnode-name-maxlength-30` gap** |
| **BUG-09** | Pricing → Edit price value | Set price = 0 + save → not reflected (old value shown) | `[CODE] libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:61` `@if (row.priceValue)` is a JS truthiness test → `0` is falsy → renders "—". Submit/transport/mapping/optimistic-patch/backend all already 0-safe | line 61 → `@if (row.priceValue != null)` (`priceValue` typed `number \| null`; matches proven `comm-mkt-card.component.ts` pattern) | **fixed-this-session** (Wave 2, 1-line) |
| **BUG-10** | Loader / spinner | Loader dot rotates counter-clockwise | `apps/host-shell/falcon-facades/host-component-configuration.facade.ts:61` set `ringDirection: 'ccw'` → `animationDirection: reverse` | line 61 → `ringDirection: 'cw'` (the library default, `falcon-loader-inline-tw.tsx:70`) | **fixed-this-session** (Wave 3) |
| **BUG-11** | User roles | FE↔BE role enum / "trust" ordering not the same (recurring) | **No live drift** — all 5 enum copies agree. Real issue: no single role source-of-truth + no explicit trust-rank field | n/a (SoT consolidation, partly backend) | **backend-flagged** (see Known Gaps) |
| **BUG-12** | User roles (edit) | System Admin can't edit a client-created role; field disabled | `resolveRoleFlags` lacked the fail-open its sibling `resolvePermFlags` has → an all-deny PES result collapsed `allowedTargetRoles` to empty → `roleDropdownDisabled` froze the field | `libs/falcon/src/shared-features/user-details/signals/signals.ts` — `resolveRoleFlags` falls back to the full candidate target set (from the same `targets = Object.values(ROLE_KEY_BY_ENUM)` it queries) when the PES map is all-deny, mirroring `resolvePermFlags` → `DEFAULT_PERM_FLAGS`. BE `UpdateUserRoleHandler` + PES still gate the save | **fixed-this-session** (Wave 6, FE fail-open per user approval) |
| **BUG-13** | Add user in sub-node | "Account Owner" appears in role list; allowed in MAIN node only | `roleOptionsForNode(nodeId)` only branched on Falcon-root → returned full account roles (incl. acc-owner) for ALL other nodes incl. sub-nodes. Mgmt copy ignored `nodeId` entirely | admin + mgmt `add-user-wizard/models/models.ts` + both `add-user-wizard.component.ts` — `roleOptionsForNode` now takes the node (type/level): Falcon-root → system roles; main node (admin level1 'client' / mgmt level0 'root') → full incl. acc-owner; sub-node → acc-owner filtered; null-node → owner-less (fail-safe) | **fixed-this-session** (Wave 5) — BE defense-in-depth flagged (`CreateUserProcess` should also reject acc-owner under a sub-node) |
| **BUG-14** | User limit exceeded | Generic/unrelated error toast, unlike the correct "level limit exceeded" error | Add-User `createUserSubmit$` threw a generic `Error` → shared finalization showed static "Something went wrong"; i18n key `hierarchy.validation.normalUserLimitReached` was missing | admin + mgmt `org-hierarchy-page/services/state/add-user-state.signals.ts` throw the localized backend message (`res.errorMessages[0]`, else `i18n.translate(keyForBackendCode(code))`); `falcon-wizard-finalization.component.ts` `showSubmitErrorToast(err)` → `errorMessageFrom(err) \|\| errorToastBody()`; `en.json`+`ar.json` add `normalUserLimitReached` | **fixed-this-session** (Wave 7) — confirm Identity emits `NormalUserLimitReached` (BE) |
| **BUG-15** | New user login → OTP | OTP countdown timer not working; 120 s vs backend 60 s | Zoneless app; OTP `interval()` mutated plain fields (`remainingSeconds`/`timerDisplay`/`screenState`/`totalSeconds`) with no signal/`markForCheck` → no change-detection → number froze, ring static, Resend never auto-enabled, Expired never painted. FE fallback was 120 s vs backend TTL 60 s | `enter-otp.component.ts` + `forgot-password-flow.component.ts` — inject `ChangeDetectorRef`, `markForCheck()` in the interval tap (tick + expiry); `get-started.component.ts` + `auth-flow-state.service.ts` — fallback `?? 120` / literal 120 → 60. Login API `otpExpiresInSeconds` still wins when present | **fixed-this-session** (Wave 8) |
| **BUG-16** | Edit User V2 | Sprint-9 story (ADO 120380) not fully applied | Unknown — needs acceptance criteria | none (blocked) | **blocked** — needs ADO story 120380 criteria or approved brain-PRD inference |
| **BUG-17** | Edit Falcon node → Setting | Password security level Normal→Advance → Save → HTTP 400 | Commerce `UpdateSettingsHandler` has **no Falcon-root / null-owner PUT path** (the GET path has it). FE sends the correct payload | n/a (Commerce backend fix) | **backend-flagged** (see Known Gaps) |

---

## Per-bug detail

### BUG-02 — Edit-node validation error rendered behind the side panel — ALREADY FIXED
- **Issue:** Setting a node name to 1 char did nothing on Update; the validation error rendered BEHIND the side panel instead of inline.
- **Root cause / status:** Already fixed 2026-05-21 — edit-node error now renders inline + blocks Update. Only a **stale comment** remained in the drawer validations.
- **Fix:** `apps/admin-console/.../falcon-org-node-drawer/validations/validations.ts` + `apps/management-console/.../falcon-org-node-drawer/validations/validations.ts` — stale comment corrected (BUG-02 residual, done in Wave 1).
- **Why it read as a bug:** the QA video predates the 2026-05-21 hardening.

### BUG-03 — Oversize account/profile image: "nothing shown" — FIXED (Wave 10)
- **Issue:** Uploading an image over the limit showed "nothing" / no size validation.
- **Root cause:** the Step-1 uploader had no explicit `[maxBytes]` (relied on the 1 MiB default) **and** `falcon-photo-uploader.component.ts` `flagOversize()` armed a **6 s `setTimeout`** that auto-cleared the oversize banner → testers perceived "no validation."
- **Fix:** `client-information-step.component.html:15` + `client-account-owner-step.component.html:17` add explicit `[maxBytes]="1024 * 1024"` (1 MB, intentional + drift-proof — same value as the prior default, so no behavior change); `falcon-photo-uploader.component.ts` `flagOversize()` no longer arms the timeout — `oversizeError` persists until a valid (<1 MB) file is chosen (`consume()` → `clearOversize()`), Upload Photo, or × clear.
- **Decision:** cap stays **1 MB** (BR-UM-48). **Blast radius:** the shared uploader also serves step-5, Add-User, and the Org-Info panel edit → persistent oversize feedback is a uniform improvement everywhere.
- **Brain impact:** BR-UM-48 still documents the **old** "auto-clears after 6 s" behavior — that auto-clear was removed for these surfaces this session. See the validation MATRIX update (account-image rule, 2026-05-29).

### BUG-04 — Account-name validation timing + 1-char acceptance — ALREADY FIXED (charset+min) / by-design (timing)
- **Issue:** (a) validation fired immediately on some fields, on-Next on others; (b) account name accepted 1 char (rule is 2–30).
- **Root cause / status:** (b) already enforced — account name has `minLength:2` since Wave-F (2026-05-24). (a) `required`-on-blur is **by design**; making `required` live is a platform-wide change, left as-is.
- **Charset:** account name already accepts `'` `-` space `&` (charset line per `V-account-name-format-xlsx-2026-05-24`).
- **Why it read as a bug:** the QA video predates Wave-F.

### BUG-05 — Add-Client steps 3 & 4 dropdown alignment — FIXED (Wave 4)
- **Issue:** header vs value column misalignment; the per-row price dropdown was top-anchored instead of vertically centered.
- **Root cause:** the priceType/priceValue cells wrapped their controls in `grid grid-rows-[1fr_auto_1fr] h-full w-full`. `h-full` inside a `table-cell` is undefined CSS → the grid collapses → the control anchors to the top. This violates the table-tailwind contract: **the cell already owns its height and applies `vertical-align: middle`.**
- **Fix (2 files, 4 cells):** `client-applications-step.component.html` (step 4) + `client-comm-channels-step.component.html` (step 3) — outer wrapper `grid grid-rows-[1fr_auto_1fr] h-full w-full` → `flex flex-col w-full`; the control stays in `flex items-center w-full`; the reserved `h-3.5` error span is unchanged (no layout shift).
- **Verify:** repo-wide grep for `grid-rows-[1fr_auto_1fr]` now returns 0 (was 4); no other cell uses the anti-pattern.
- **Pitfall to remember:** never use `h-full` on a control wrapper inside a Falcon table cell — the cell already centers content. Candidate for `15-implementation-pitfalls`.

### BUG-06 — Step-5 validation inconsistent with step 1 — FIXED (Wave 9, behavior-preserving)
- **Issue:** the Account-Owner step (step 5) validated differently from step 1 — inconsistent timing/messages; a bad-data Finish produced an error the user couldn't understand.
- **Root cause:** step 5 injected its rule map but ignored it — it validated via a private `errMsg()` / `userError()` / hand-rolled `isFormValid` with 6 direct validator calls, while step 1 uses `fieldErrorMessage()` + `allFieldsValid()` off its map.
- **Fix:** `client-account-owner-step.component.ts` — per-field errors now use `fieldErrorMessage(value,'<field>',rules,touched())`; `isFormValid` uses `allFieldsValid(value,rules)`; the async username-uniqueness gate is kept verbatim; dead `errMsg()` removed.
- **Behavior-preserving proof:** a parity table showed the rule map binds the SAME `ValidatorFn` singletons the direct calls used → the accept/reject set is byte-for-byte unchanged; only WHEN/HOW messages render now matches step 1. (No password field in step 5 — the owner password is backend-generated.)

### BUG-07 — 1-char account name reaches backend — ALREADY FIXED (FE) / BE defense-in-depth flagged
- **Issue:** account name = 1 char produced a backend validation error; the client should have blocked it (ties to BUG-04).
- **Status:** FE already blocks 1-char (`minLength:2`, Wave-F). **BE defense-in-depth flag:** Commerce could also enforce account-name min-2 (currently only `[ThrowIfMaxLengthExceed(30)]`, no min). See drift item #3 in the validation MATRIX (AccountName backend regex/min missing).

### BUG-08 — Node-name validation parity with account name — FIXED (Wave 1) — RESOLVES `V-subnode-name-maxlength-30` GAP
- **Issue:** Add/Edit Node name validation must equal create-node step-1 account-name validation, but didn't.
- **Root cause:** `nodeName()` used `STARTS_WITH_LETTER` + `LETTERS_ONLY` → it wrongly rejected apostrophe `'`, hyphen `-`, space, and `&`, and forced a leading letter — unlike `accountName()`.
- **Fix:** `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` — `nodeName()` rewritten to mirror `accountName()`: `required(trim)` → `ACCOUNT_NAME_CHARSET` → `minLength(2)` → `maxLength(30)`. Dropped starts-with-letter + letters-only. Reuses the `accountNameCharset` error key (generic i18n, no en/ar change). `accountName()` untouched; the `STARTS_WITH_LETTER` / `LETTERS_ONLY` constants are kept (used by other primitives). Stale comments in both consoles' `falcon-org-node-drawer/validations/validations.ts` corrected.
- **Behavior:** "Test Corp" / "R&D" / "O'Brien-East" → valid; "A" → min error; "" → required; 31 chars → max.
- **Knowledge-graph / SoT impact (IMPORTANT):** this is the concrete resolution of the previously **"referenced-but-never-seeded `V-subnode-name-maxlength-30`"** rule (MATRIX §4 item #16 + §10 26th-rule note). Node name no longer just `required + maxLength(30)` — it now validates **identically to account name** (charset letters+digits+space+`&`+`'`+`-`, length **2–30**). Prior brain docs (`Add-Node.trace.md`, `Edit-Node.trace.md`, `Add-Node-and-Edit-Node.integration.md`) said "letter-prefix may apply, PRD silent, cosmetic FE rule only" — that is now superseded by full account-name parity. Backend still does NOT mirror the charset/min (FE-tighter).

### BUG-09 — Edit price value = 0 not reflected (falsy-zero) — FIXED (Wave 2, 1-line)
- **Issue:** set a service's price to `0` and save → the cell still showed the old value; looked like the save didn't persist.
- **Root cause:** `[CODE] libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:61` — `@if (row.priceValue)` is a JS truthiness check; `0` is falsy → takes the `@else` → renders "—" (em-dash). On a previously non-zero service the operator reads this as "old value, save not reflected."
- **Verified 0-safe (no change needed):** FE submit (`service-pricing-table.component.ts:616-622`, `rawValue < 0` guard permits 0), transport (`commerce-gateway.service.ts:116-120` sends `"priceValue":0`), mapping/patch (`models.ts:314/370/494` use `!== undefined`; `service-pricing-state.slice.ts:107-117`), BE persist (`ChangeApplicationPriceValueHandler.cs:56` → `SetPriceValue`, non-nullable decimal, no `price>0` guard), BE response (`ChangeApplicationPriceValueResponse.cs:10` returns `0`).
- **Fix (1 line):** line 61 → `@if (row.priceValue != null)` (`priceValue` typed `number | null`; matches the proven `comm-mkt-card.component.ts:61/114` `!= null` pattern).
- **Blast radius:** the ONLY falsy-zero price guard on a price field platform-wide. The shared table mounts on 3 admin surfaces (org-hierarchy apps-services + comm-channels tabs, comm-channels-services, marketplace-applications) and is reused by management-console → all fixed at once.

### BUG-10 — Loader dot spins counter-clockwise — FIXED (Wave 3)
- **Issue:** the inline loader dot orbited counter-clockwise; should be clockwise.
- **Root cause:** `apps/host-shell/falcon-facades/host-component-configuration.facade.ts:61` set `ringDirection: 'ccw'` → `animationDirection: reverse`.
- **Fix:** line 61 → `ringDirection: 'cw'` (the library default value, `falcon-loader-inline-tw.tsx:70`). Single source for the app-wide inline loader; the fullscreen overlay loader is unaffected (always cw).

### BUG-11 — FE↔BE role enum / "trust" ordering — BACKEND-FLAGGED (no live drift)
- **Issue:** recurring perception that the FE and BE role enumerations / "trust" ordering disagree.
- **Finding:** **No live drift** — all 5 enum copies currently agree. The real issue is structural: **there is no single role source-of-truth and no explicit trust-rank field.**
- **Disposition:** SoT consolidation (larger, partly backend). Recorded as a Known Gap below.

### BUG-12 — System Admin can't edit a client-created role — FIXED (Wave 6, FE fail-open)
- **Issue:** a System Admin opening a user whose role was created client-side found the Role field disabled.
- **Root cause:** `resolveRoleFlags` lacked the fail-open that its sibling `resolvePermFlags` has → an all-deny PES result (catalog/seed gap or unresolved g-link) collapsed `allowedTargetRoles` to empty → `roleDropdownDisabled` froze the field. Authority + backend + PES all allow SA to edit these roles.
- **Fix:** `libs/falcon/src/shared-features/user-details/signals/signals.ts` — `resolveRoleFlags` only: when the PES map is all-deny, fall back to the full candidate target set (derived from the SAME `targets = Object.values(ROLE_KEY_BY_ENUM)` it queries), mirroring `resolvePermFlags` → `DEFAULT_PERM_FLAGS`. `resolvePermFlags`, `roleDropdownDisabled`, the PES query, and the backend are all untouched.
- **Security:** a real partial-allow PES result is still respected (unchanged); self-edit is not broadened; BE `UpdateUserRoleHandler` + PES still gate the actual save. Shared slice → fixes both consoles' user-details.

### BUG-13 — "Account Owner" offered in a sub-node's add-user role list — FIXED (Wave 5)
- **Issue:** adding a user under a sub-node listed "Account Owner" as a selectable role; acc-owner is a MAIN (tenant) node concept only.
- **Root cause:** `roleOptionsForNode(nodeId)` only branched on Falcon-root → returned the full account-role set (incl. acc-owner) for ALL other nodes including sub-nodes. The mgmt copy ignored `nodeId` entirely.
- **Fix (4 files):** admin + mgmt `add-user-wizard/models/models.ts` + both `add-user-wizard.component.ts`. `roleOptionsForNode` now takes the node (type/level): Falcon-root → system roles; main node (admin level1 'client' / mgmt level0 'root') → full set incl. acc-owner; sub-node → acc-owner filtered out; null-node fallback → owner-less (fail-safe). Accessor: `this.state.selectedNode()` (`ClientNode` type/level).
- **BE defense-in-depth flag:** FE hiding is bypassable — Identity `CreateUserProcess` should also reject acc-owner under a sub-node (user-create is FE-gate-only at the backend today). Recorded under BE flags.

### BUG-14 — User-limit error shows a generic toast — FIXED (Wave 7)
- **Issue:** exceeding the Normal-User limit showed a generic "Something went wrong" toast, unlike the correct, specific "level limit exceeded" error.
- **Root cause:** Add-User `createUserSubmit$` threw a generic `Error` → the shared wizard finalization showed the static fallback. Also the i18n key `hierarchy.validation.normalUserLimitReached` was **missing**. (Add-Node works because it surfaces `res.errorMessages[0]` directly.)
- **Fix (5 files):** admin + mgmt `org-hierarchy-page/services/state/add-user-state.signals.ts` throw the localized backend message (`res.errorMessages[0]`, else `i18n.translate(keyForBackendCode(code))`); `libs/falcon-ui-core/.../falcon-wizard-finalization.component.ts` `showSubmitErrorToast(err)` uses `errorMessageFrom(err) || errorToastBody()` (`errorMessageFrom` returns '' for bracket-prefixed sentinels/non-strings — ADDITIVE, title unchanged); `en.json` + `ar.json` add `normalUserLimitReached` (en + MSA Arabic).
- **Error contract:** the backend code is `NormalUserLimitReached` (422) — already in `13-error-catalog/CATALOG.md` §7. **BE flag:** confirm Identity actually emits `NormalUserLimitReached`; several other `BACKEND_ERROR_KEY` i18n keys (`InvalidStatusTransition`, `UserNotFound`, …) are also missing and now degrade gracefully via the same path.
- **New i18n key:** `hierarchy.validation.normalUserLimitReached` (en + ar) added.

### BUG-15 — OTP countdown timer not working — FIXED (Wave 8)
- **Issue:** the OTP countdown number froze, the ring didn't animate, Resend never auto-enabled, and Expired never painted; the FE fallback was 120 s while the backend TTL is 60 s.
- **Root cause:** the app is **zoneless**; the OTP `interval()` mutated plain fields (`remainingSeconds` / `timerDisplay` / `screenState` / `totalSeconds`) with no signal and no `markForCheck()` → no change-detection ran → the UI never updated. Separately, the FE fallback seconds were 120 vs the backend 60.
- **Fix (4 files):** `enter-otp.component.ts` — inject `ChangeDetectorRef`, call `markForCheck()` in the interval tap (covers tick + expiry); `otpSeconds`/`totalSeconds`/`?? 120` → 60. `forgot-password-flow.component.ts` — same OnPush timer defect → same `markForCheck` fix; `?? 120` → 60. `get-started.component.ts` — `?? 120` / literal 120 → 60 (both OTP + pwd-change branches). `auth-flow-state.service.ts` — `DEFAULT_STATE.otpConfig.seconds` 120 → 60 (the upstream seed that otherwise made `?? 60` unreachable).
- **Note:** the login API's `otpExpiresInSeconds` still wins when present — only the fallback changed. `markForCheck` was chosen over a signal conversion (which would touch ~13 read/write sites = higher risk).
- **Pitfall:** in a zoneless app, a plain-field mutation inside `interval()`/RxJS taps does NOT trigger change-detection — convert to a signal or call `markForCheck()`. (Same class of zoneless bug recorded in [MEMORY] FE-defect-hunt 2026-05-29 for change-pwd/OTP.)

### BUG-16 — Edit User V2 (ADO 120380) — BLOCKED
- **Issue:** the Sprint-9 "Edit User V2" story (ADO work-item 120380) is not fully applied.
- **Blocker:** the available ADO token lacks work-item read scope, so the acceptance criteria could not be retrieved.
- **Next step (exact input needed):** paste ADO story 120380 acceptance criteria, OR approve a brain-PRD inference of the criteria.

### BUG-17 — Edit Falcon node → Setting: password security Normal→Advance → 400 — BACKEND-FLAGGED
- **Issue:** on a Falcon node's Setting tab, changing the password security level Normal→Advance and saving returns HTTP 400.
- **Root cause:** Commerce `UpdateSettingsHandler` has **no Falcon-root / null-owner PUT path** — the GET path handles the Falcon-root/null-owner case but the PUT (save) path does not. The FE sends the correct payload.
- **Disposition:** Commerce backend fix. Recorded as a Known Gap below.

---

## Known backend / SoT gaps opened by this run

> Mirrored into the knowledge graph as `Gap` nodes via `falcon-wiki/200-Graph/graph/wave-deltas/account-mgmt-bugs-2026-05-29.json` (the sanctioned additive path — `Bug`/`Fix` are not node types in the 35-type schema; `Gap` is). The graph baseline is a derived artifact and is regenerated, never hand-edited (`BRAIN-SOURCE-OF-TRUTH-MANIFEST.md` §7).

### GAP — BUG-17 — Commerce `UpdateSettingsHandler` has no Falcon-root/null-owner PUT path
- **Service:** commerce · **Severity:** high (blocks Falcon-node settings save) · **Status:** open
- **Symptom:** Normal→Advance password-security save on a Falcon node → HTTP 400.
- **Detail:** the GET settings path handles Falcon-root / null-owner; the PUT (update) path does not, so a Falcon-node settings save with a valid payload is rejected.
- **Owner:** ammar-core-commerce. **FE mitigation:** none — FE payload is already correct; this is a backend-only gap.

### GAP — BUG-11 — Role enum duplicated across 5 copies; no single SoT, no trust-rank field
- **Service:** identity (+ FE) · **Severity:** medium · **Status:** open (no live drift today)
- **Detail:** the role enumeration is duplicated in 5 places. They currently agree, so there is **no live drift**, but there is **no single role source-of-truth** and **no explicit trust-rank field** to make "which role outranks which" data-driven. The recurring "FE↔BE enum mismatch / trust ordering" perception traces to this structural duplication.
- **Owner:** ammar-auth + ammar-web-platform-ui. **Disposition:** SoT consolidation (larger, partly backend) — pick one canonical role list + add an explicit trust-rank/precedence field, then derive the others.

### BE defense-in-depth flags (FE hiding is bypassable)
- **BUG-13** — Identity `CreateUserProcess` should also reject acc-owner under a sub-node (the FE filter is bypassable). Owner: ammar-auth.
- **BUG-07** — Commerce could enforce account-name **min-2** (today only `[ThrowIfMaxLengthExceed(30)]`, no min). Owner: ammar-core-commerce. (Same family as drift item #3 in the validation MATRIX.)
- **BUG-14** — confirm Identity actually emits `NormalUserLimitReached`; other `BACKEND_ERROR_KEY` i18n keys (`InvalidStatusTransition`, `UserNotFound`, …) are missing FE-side (now degrade gracefully).

---

## Verification status (honest)

- ✅ **Static / build:** all changed libs + the 3 apps compile green — `npx nx build {admin-console,host-shell,management-console} --skip-nx-cache` → **all exit 0**. Per-wave typecheck / consumer-walk / behavior-parity checks done; each change independently re-read in source during the fix session.
- ⏳ **Runtime / visual:** **NOT yet done.** Reaching these screens needs the live stack (Module Federation + Docker + Zitadel login + multi-step wizards). A live visual pass (BUG-05/09/10) + functional pass (the rest) was offered, not yet run.
- 🔒 **No commits.** All edits are in the working tree only.

## See also
- `[BRAIN-OUT] qa/runs/account-mgmt-bugs-2026-05-29/` — the authoritative run (FINAL-SUMMARY, WAVE-LOG, FINDINGS, BUG-INVENTORY)
- `06-validation-by-feature/MATRIX.md` — node-name parity + account-image cap (updated 2026-05-29); §4 drift watch
- `13-error-catalog/CATALOG.md` — `NormalUserLimitReached` (422), `MaxNodeLevelReached` (422), the full code catalog
- `13-error-catalog/FE-CONTRACT.md` — the "branch on HTTP status, display localized `errorMessages[0]`" contract (BUG-14 follows this)
- `14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md` + `18-a-to-z-traces/{Add-Node,Edit-Node}.trace.md` — node flows now updated by BUG-08
- `[MEMORY] project_fe_defect_hunt_2026_05_29` — sibling zoneless-subscribe-mutation finding (BUG-15 family)
