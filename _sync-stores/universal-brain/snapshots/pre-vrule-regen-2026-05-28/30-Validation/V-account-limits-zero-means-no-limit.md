---
type: validation-rule
id: V-account-limits-zero-means-no-limit
prd: PRD-01
service: commerce
severity: high
status: triangulated
drift: false
created: 2026-05-15
module: account-mgmt
feature: account-limits
verification: spot-checked
last-verified: 2026-05-15
tags: ["#status/triangulated", "#module/account-mgmt", "#verification/spot-checked", "#layer/be"]
up: "[[V-rules-MOC]]"
parent: "[[V-rules-MOC]]"
supersedes: []
superseded-by: []
evidence-link: project_validation_input_caps_wave_g_2026_05_24.md
---
*** Validation V-account-limits-zero-means-no-limit — Account Limits accept 0 as "no limit"; empty disallowed ***
*** Origin: PRD-01 Account Management · Backend: Commerce · 2026-05-15 ***

# V-account-limits-zero-means-no-limit — Max Normal User / System User / Node Levels / Balance Transfer % cap each accept 0 = no limit; empty not allowed; default 0

> The four account-level caps are mandatory at create time (Step 2). PRD reserves `0` as the special "no limit" value — so empty input is rejected but explicit zero is treated as uncapped. The Balance Transfer Limit % later exempts Master Wallet as source (BR-AM-34).

## Origin (PRD)

- **PRD:** [[01 Account Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- **Rule id:** `BR-AM-11` (+ BR-AM-12 separating Normal vs System counts; BR-AM-34 Balance Transfer % semantics)
- **PRD line reference:** "Account Limits include: Max Normal User Limit, Max System User Limit, Max Node Levels, Balance Transfer Limit (%). All accept `0` meaning 'no limit'; empty is not allowed; default is 0." (`latest-prd.md:45`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 2 — Account Settings (mandatory). ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) §W1 step 2)
- **Open follow-up:** `BR-AM-39` — enforcement mode when an edit shrinks the limit below current usage is silent in PRD (reject vs grandfather).

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTOs:**
  - `CreateAccountRequest.Settings` (`SettingsInfo`) — fields: `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevel`, `BalanceTransferLimit`
  - `UpdateSettingsRequest` — same shape at edit time
- **Attribute / mechanism:** The four limit fields **lack documented `[ThrowIf*]` attributes** in [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — the rule is enforced inside handlers, which throw `InvalidAccountLimits` (422) on a violation. `[ThrowIfNotPassed]` on `Settings` itself catches the "empty step" case; per-field empty / negative checks are handler-level.
- **Error codes:**
  - `FalconKeys.Error.InvalidAccountLimits` (422) — violation at handler
  - `FalconKeys.Error.MaxNodeLevelReached` (422) — runtime breach when creating a sub-node would exceed `MaxNodeLevel`
  - `FalconKeys.Error.NormalUserLimitReached` (422) — runtime breach when adding/activating a Normal User would exceed `MaxNormalUserLimit` (shared with Identity)
  - `FalconKeys.Error.RequiredFieldMissing` (400) — generic empty path
- **Source files:**
  - [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — `CreateAccountRequest` (note attribute-gap on the four limit fields)
  - [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — 422 section
  - [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `SettingsInfo` nested type

**SoT note (honest call):** the canonical Commerce VALIDATIONS doc does not list per-field `[ThrowIf*]` attributes for the four limit numbers — so handler-level enforcement is the only documented gate. The PRD's "default 0" + "empty not allowed" semantics are likely surfaced via UI default-value seeding rather than DTO validation; surface as a candidate gap in [[GAPS_INDEX]].

## Frontend implementation hint

- **Form / page section:**
  - Add Client wizard — Step 2 (Account Settings) — `account-limits` field group
  - [[Organization Hierarchy]] `settings-account-limitation` section (also editable in admin Settings tab)
- **Suggested validator wiring:**
  - All four numeric inputs: `Validators.required` with explicit default value `0` pre-populated (so the user has to actively change it; empty submission rejected)
  - `Validators.min(0)` — disallow negatives
  - `Validators.pattern(/^\d+$/)` — integer-only for the three count caps; allow decimal `%` for `BalanceTransferLimit` if PRD/PES allows fractional %
  - Translation rule for display: `if value === 0 → render "No limit" pill / placeholder` — this is a UI-only behavior, server still stores `0`
  - Cross-field: when target limit drops below the current user/node count, surface a confirmation modal (PRD silent — see BR-AM-39)
  - **Input layer (Wave G 2026-05-24):** Max Normal / Max System / Max Node use `<falcon-angular-input type="text" inputMode="numeric" [maxlength]="USER_LIMIT_MAX_DIGITS">` where `USER_LIMIT_MAX_DIGITS = 3` is exported from `@falcon` (mirrors the 0..999 numeric bound enforced by `userLimitValidator` + `maxNodeLevelsValidator`). Browser blocks the 4th keystroke at the DOM layer. Prior `<falcon-angular-input-number max=999>` silently auto-snapped the value to 999 on overflow, which Ammar flagged as confusing UX. Setter strips non-digits + truncates to 3 chars + clamps to [0, 999] as paste-defence. Applied to Add Client Step 2 + Settings tab in BOTH consoles. `xlsx Validations.xlsx 2026-05-24` confirms "Max 3 digits" for these fields.
- **Page note:** [[Organization Hierarchy]] — `settings-account-limitation` section already listed

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — "Edit Account Limitations" is Falcon-only with Operation = Not Allow (per W7 workflow text)
- **Business rule cluster:**
  - [[01 Account Management]] BR-AM-11 ↔ BR-AM-12 ↔ BR-AM-13 (Step 2 caps) ↔ BR-AM-34 (Balance Transfer % semantics)
  - [[02 User Management]] BR-UM-09 + BR-UM-17 + BR-UM-38 (the Normal-User limit half of this rule is read every time a user transitions to Active or a role changes to Normal User — `UserQuotaPolicy` in Identity)
- **Related learning events:** none yet
- **Open question:** `BR-AM-39` — shrinking the limit below current usage

## Tags

#type/v-rule #status/triangulated #prd/01 #prd/02 #service/commerce #severity/medium #gap

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
