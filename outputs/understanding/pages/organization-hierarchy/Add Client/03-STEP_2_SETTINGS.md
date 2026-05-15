*** Add Client — Step 2 Settings ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Step 2 — Account Settings (mandatory)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-09` → `BR-AM-13`.
- PRD: WORKFLOWS §W1 step 2 (`latest-prd.md:42-45`).
- PRD: ENTITIES `AccountSettings` row.
- Backend: `CreateAccountRequest.Settings` (nested `SettingsInfo`).
- Entity reconciliation: [[E-account-settings]] — surfaces the **PasswordSecurityLevel enum vocabulary drift** (PRD `Normal/Advanced` vs Identity backend `Low/Medium/High/Strict` — Q-UM-12 open).

**Screen / section**
- Wizard step 2 panel — 2-section layout:
  - Section A: Password & Network (Password Security Level dropdown + Allowed IPs editable list).
  - Section B: Account Limitations (4-field grid).

## Fields

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Password Security Level | dropdown ([[Falcon Dropdown]]) — Normal / Advanced (PRD) | BR-AM-09: enum 2-value, mandatory | `Settings.PasswordSecurityLevel` `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]` | [[V-password-security-level-enum]] | `Validators.required`. Enum-membership validator. **Drift handling:** PRD says `Normal/Advanced`; Identity backend `ePasswordSecurityLevel` is `Low/Medium/High/Strict`. **Recommendation:** match backend enum names in the request payload (`Low/Medium/High/Strict`) and map PRD `Normal ↔ Low or Medium`, `Advanced ↔ High or Strict` until Q-UM-12 resolves. Display PRD labels in the dropdown but submit backend codes. | ⚠ HIGH — Q-UM-12 vocabulary mismatch. |
| 2 | Allowed IPs | editable string list ([[Falcon Input]] rows with add/remove buttons) | BR-AM-10: enforced via HTTP header at Gateway; missing header / missing value / not-on-list → reject | `Settings.AllowedIPs[]` (List<string>) | [[V-account-ip-allowlist-enforcement]] | Optional list (empty allowed = unrestricted, but PRD treats empty as "no allowlist" — handler may differ). Each row: `Validators.pattern(/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/)` IPv4 + optional CIDR (IPv6 support to verify). Server returns `InvalidIpAddress` (403) on malformed value. **Note:** the empty state semantics interact with the `Enabled` toggle exposed in `GetAllIpAllowlistsResponse.Tenants[].Enabled` — PRD silent on the toggle; treat empty list as "off" until clarified. | ⚠ DRIFT — backend exposes an `Enabled` bool on read-side that PRD doesn't document (E-account-settings extra column). |
| 3 | Max Normal User Limit | numeric input ([[Falcon Input Number]]) | BR-AM-11/12: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxNormalUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] · [[V-normal-user-limit-enforcement]] | `Validators.required` with pre-populated default value `0`. `Validators.min(0)`. `Validators.pattern(/^\d+$/)`. UI display rule: `value === 0 → render "No limit" pill`. **Runtime breach** (creating Normal Users beyond cap) returns `NormalUserLimitReached` (422) — not a Step 2 error, surfaces later in Add User flow. | — |
| 4 | Max System User Limit | numeric input ([[Falcon Input Number]]) | BR-AM-11/12: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxSystemUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] | Same as Max Normal User Limit. **Open Q-AM-12:** what is a "System User"? PRD references the cap but never defines the type. Document as a frontend assumption. | ⚠ Open Q-AM-12. |
| 5 | Max Node Levels | numeric input ([[Falcon Input Number]]) | BR-AM-11: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxNodeLevel` (int — backend singular) | [[V-account-limits-zero-means-no-limit]] | Same validators. **Runtime breach** when creating sub-nodes beyond cap returns `MaxNodeLevelReached` (422). | ⚠ COSMETIC — PRD `maxNodeLevels` (plural) vs backend `MaxNodeLevel` (singular). |
| 6 | Balance Transfer Limit (%) | numeric input ([[Falcon Input Number]]) | BR-AM-11/34: int %; 0 = no limit; empty not allowed; default 0; Master Wallet as source is exempt | `Settings.BalanceTransferLimit` (decimal — backend dropped unit hint) | [[V-account-limits-zero-means-no-limit]] | Same validators. Accept decimals (PRD: percent). Display unit suffix `%` in the input. Open Q-AM-07: baseline (source balance at transfer time / per day / per action). | ⚠ NAMING — PRD `balanceTransferLimitPct` vs backend `BalanceTransferLimit` (unit hint dropped). |

## Step 2 cross-field validation contract

- `MainAccountSettingsRequired` (400) — the `Settings` block itself must be present.
- `InvalidAccountLimits` (422) — handler-level violation across the 4 limits (e.g., negative, malformed). The four limit fields **lack documented `[ThrowIf*]` attributes** in `VALIDATIONS.md` — empty/negative handler-level only.

## Backend call on Next

- None. Step 2 data buffered locally.

## Permission gate

- Same as overall flow. See [01-PERMISSIONS](01-PERMISSIONS.md).

## Open questions surfaced by this step

- **Q-UM-12 (HIGH):** Password Security Level vocabulary mismatch. Implementation must pick a side; recommend backend codes (`Low/Medium/High/Strict`) for the request payload.
- **Q-AM-07:** Balance Transfer Limit % baseline (per-action / per-day / source-balance) — PRD silent.
- **Q-AM-12:** Definition of "System User" — PRD silent.
- **Q-AM-13:** HTTP header name for IP allowlist enforcement — PRD silent (Gateway config).
- **BR-AM-39 (open):** Enforcement mode for limit edits when current usage exceeds new cap (reject vs grandfather) — not a Step 2 create-time concern, but flag for the Settings tab edit flow.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[Commerce Service]] · [[Identity Service]] · [[V-password-security-level-enum]] · [[V-account-ip-allowlist-enforcement]] · [[V-account-limits-zero-means-no-limit]] · [[V-normal-user-limit-enforcement]] · [[E-account-settings]] · [[Falcon Dropdown]] · [[Falcon Input]] · [[Falcon Input Number]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
