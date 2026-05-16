---
type: cross-cut-matrix
axis-a: V-rules (25)
axis-b: features (7)
purpose: "Answers 'which of the 25 V-rules apply when implementing feature F + which validators/severities/drift items to surface'. Open before wiring form validators or planning a feature."
extracted: 2026-05-16
source: Brain SK/_obsidian/30-Validation/V-*.md + feature compares
---

# Validation × Feature — Cross-Cut Matrix

> [!tldr]
> 25 V-rules from PRD-01..05 mapped onto the 7 Falcon features in [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md). Use this matrix as the **first** lookup when planning any feature implementation — it tells you which validators to wire, which severities to surface, which drift items to mitigate at the FE, and which features have **zero** PRD-grounded validators (i.e. require new V-rules before implementation).
>
> Discrepancy note: the brief named 26 V-rules; the vault disk has 25 (`Brain SK/_obsidian/30-Validation/V-*.md`). All 25 are listed in §1, mapped in §2, and drilled-down in §3. [INFERRED] the 26th is a future addition (e.g. `V-subnode-name-maxlength-30` is referenced from sister rules but has not been seeded yet — see §4 drift watch).

## 1. The 25 V-rules — index, severity, drift status

> Severity, drift, and status read from each V-rule's YAML front-matter. The "1-line summary" is distilled from the rule's headline `>` block.

| # | V-rule key | PRD | Service | Severity | Drift status | 1-line summary |
|---|---|---|---|---|---|---|
| 1 | [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md) | PRD-01 + PRD-02 | (gateway) — Commerce src + Identity enforcer | medium | triangulated | IP allowlist gate runs at gateway **before** credentials check; rejection is intentionally generic ([VAULT]) |
| 2 | [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) | PRD-01 | commerce | high | triangulated (handler-only) | 4 account caps (Normal/System/NodeLevel/BalanceTransfer%) accept `0` = no limit, empty disallowed, default 0 |
| 3 | [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) | PRD-01 | commerce | high | triangulated (letter-prefix gap) | AccountName ≤30, letter-prefix, unique system-wide, mandatory (BR-AM-03) |
| 4 | [`V-charging-insufficient-balance`](../../../../Brain%20SK/_obsidian/30-Validation/V-charging-insufficient-balance.md) | PRD-03 | charging | medium | triangulated | Send/DoPayment/Activate must not exceed nearest-expiring wallet balance (BR-CC-32) |
| 5 | [`V-charging-no-applicable-rate`](../../../../Brain%20SK/_obsidian/30-Validation/V-charging-no-applicable-rate.md) | PRD-03 | charging | high | triangulated | Charge must resolve a (App × Channel × Priority × Destination × Unit) matrix cell (BR-CC-22 / BR-CC-32) |
| 6 | [`V-charging-transfer-source-destination`](../../../../Brain%20SK/_obsidian/30-Validation/V-charging-transfer-source-destination.md) | PRD-01 + PRD-03 | charging | high | triangulated | Transfer wallets distinct + currency-matched + source-destination matrix obeyed (BR-CC-35 + BR-AM-34) |
| 7 | [`V-contact-group-column-name-shape`](../../../../Brain%20SK/_obsidian/30-Validation/V-contact-group-column-name-shape.md) | PRD-04 + PRD-05 | contact-group | high | triangulated (generic codes) | Column names EN-letters-only, ≤20, no duplicates, no special chars, spaces → `_` (BR-CGM-06) |
| 8 | [`V-contact-group-file-size-cap`](../../../../Brain%20SK/_obsidian/30-Validation/V-contact-group-file-size-cap.md) | PRD-04 | contact-group | high | triangulated (default value gap) | Upload file ≤ server-configured `MaxFileSizeMB` (BR-CGM-04) |
| 9 | [`V-contact-group-file-type-allowlist`](../../../../Brain%20SK/_obsidian/30-Validation/V-contact-group-file-type-allowlist.md) | PRD-04 | contact-group | high | triangulated | Upload extension must be in server-configured allowlist — CSV/XLS/XLSX (BR-CGM-04) |
| 10 | [`V-contact-group-name-required-format`](../../../../Brain%20SK/_obsidian/30-Validation/V-contact-group-name-required-format.md) | PRD-04 | contact-group | high | triangulated (regex literal gap) | Group Name mandatory, ≤50, matches `ContactGroupRules.NamePattern` (BR-CGM-02) |
| 11 | [`V-contact-group-share-policy-mode-mutex`](../../../../Brain%20SK/_obsidian/30-Validation/V-contact-group-share-policy-mode-mutex.md) | PRD-04 | contact-group | high | triangulated (silent-drop gap) | `SharedWithAllUsers=true` overrides `SharedUsers[]` — modes mutually exclusive (BR-CGM-09 / BR-CGM-10) |
| 12 | [`V-contract-committed-value-positive`](../../../../Brain%20SK/_obsidian/30-Validation/V-contract-committed-value-positive.md) | PRD-03 | commerce | high | triangulated (upper-cap gap) | Contract Value SAR strictly > 0; PRD `<= hundreds of millions` not enforced (BR-CC-08) |
| 13 | [`V-contract-currency-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-contract-currency-enum.md) | PRD-03 | commerce | high | triangulated (cross-service drift) | Currency must be an `eCurrency` member; Commerce enforces, Charging does not |
| 14 | [`V-contract-edit-status-aware-fields`](../../../../Brain%20SK/_obsidian/30-Validation/V-contract-edit-status-aware-fields.md) | PRD-03 | commerce | medium | triangulated | Pending allows full edit; Active/Expired locks Name + Value + StartDate (BR-CC-15 / BR-CC-16) |
| 15 | [`V-contract-expiration-after-start`](../../../../Brain%20SK/_obsidian/30-Validation/V-contract-expiration-after-start.md) | PRD-03 | commerce | medium | triangulated | Expiration > Start AND > now; handler-time only (BR-CC-06 / BR-CC-07) |
| 16 | [`V-contract-rate-per-unit-non-negative`](../../../../Brain%20SK/_obsidian/30-Validation/V-contract-rate-per-unit-non-negative.md) | PRD-03 | commerce | medium | triangulated | Contract-Details matrix RatePerUnit ≥ 0; same `[Range]` covers PriceValue/IncludedAmount/UnitPrice |
| 17 | [`V-login-lockout-3-wrong-attempts`](../../../../Brain%20SK/_obsidian/30-Validation/V-login-lockout-3-wrong-attempts.md) | PRD-02 | identity | medium | triangulated (forgot-pwd divergence) | ≥3 wrong passwords or ≥3 wrong/resent OTPs flips Locked; forgot-password OTP intentionally silent (BR-UM-25/27/32) |
| 18 | [`V-normal-user-limit-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-normal-user-limit-enforcement.md) | PRD-01 + PRD-02 | identity (reads commerce) | medium | triangulated | Adding/activating a Normal User must not exceed `MaxNormalUserLimit`; Deleted excluded (BR-UM-07/09/17/38) |
| 19 | [`V-password-complexity-per-security-level`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-complexity-per-security-level.md) | PRD-01 + PRD-02 | identity | high | triangulated | Password complexity tier resolved per account `PasswordSecurityLevel`; applies to every password-write path |
| 20 | [`V-password-security-level-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-security-level-enum.md) | PRD-01 | commerce + identity | high | triangulated (Q-UM-12 vocabulary drift) | Settings.PasswordSecurityLevel ∈ `ePasswordSecurityLevel`; PRD says Normal/Advanced — backend says Low/Medium/High/Strict |
| 21 | [`V-service-visibility-pricing-required`](../../../../Brain%20SK/_obsidian/30-Validation/V-service-visibility-pricing-required.md) | PRD-01 | commerce | high | **drift** | Visibility=Show requires PriceType + PriceValue; Hidden must NOT have pricing (BR-AM-14..17) |
| 22 | [`V-template-checker-level-integrity`](../../../../Brain%20SK/_obsidian/30-Validation/V-template-checker-level-integrity.md) | PRD-05 | templates | medium | triangulated (blocked by gateway gap) | Checker levels: sequential, unique, ≥1 user per level, no user at >1 level, count matches |
| 23 | [`V-template-levels-count-required-for-restricted`](../../../../Brain%20SK/_obsidian/30-Validation/V-template-levels-count-required-for-restricted.md) | PRD-05 | templates | high | triangulated (blocked by gateway gap) | BodyType=Restricted requires LevelsCount + `CheckerLevels.Count == LevelsCount` |
| 24 | [`V-user-first-last-name-letters-only`](../../../../Brain%20SK/_obsidian/30-Validation/V-user-first-last-name-letters-only.md) | PRD-02 | identity | medium | triangulated (Arabic/spaces open) | First/Last Name ≤50 letters-only; mandatory (BR-UM-11) |
| 25 | [`V-username-format-uniqueness-immutable`](../../../../Brain%20SK/_obsidian/30-Validation/V-username-format-uniqueness-immutable.md) | PRD-02 | identity | medium | **drift (HIGH)** | Username letter-prefix + ≤30 (PRD) vs ≤100 (backend) + unique + immutable after create |

## 2. Master matrix — V-rule × feature

> Cell legend:
> - `✅` — the rule applies to this feature (the feature's UI/handler MUST honour the rule)
> - `📝` — partial / indirect (the rule applies via a sister feature or via runtime impact, see footnote)
> - `—` — N/A
> - `🚫` — intentionally not applicable (e.g. testing-charging is internal diagnostic; see §4)
>
> Feature columns (in order, abbreviated): **OH** = `organization-hierarchy` · **CH** = `comms-hub` · **MA** = `marketplace-applications` · **CG** = `contact-groups` · **WB** = `wallet-balance-management` · **CC** = `contracts-cost-management` · **TC** = `testing-charging`

| V-rule | OH | CH | MA | CG | WB | CC | TC |
|---|---|---|---|---|---|---|---|
| V-account-ip-allowlist-enforcement | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] |
| V-account-limits-zero-means-no-limit | ✅ | — | — | — | 📝[^b] | — | — |
| V-account-name-format-uniqueness | ✅[^c] | — | — | — | — | — | — |
| V-charging-insufficient-balance | 📝[^d] | ✅[^e] | ✅[^e] | — | ✅ | 📝[^f] | ✅[^g] |
| V-charging-no-applicable-rate | — | ✅[^e] | ✅[^e] | — | — | 📝[^f] | ✅[^g] |
| V-charging-transfer-source-destination | — | — | — | — | ✅ | — | ✅[^g] |
| V-contact-group-column-name-shape | — | — | — | ✅ | — | — | — |
| V-contact-group-file-size-cap | — | — | — | ✅ | — | — | — |
| V-contact-group-file-type-allowlist | — | — | — | ✅ | — | — | — |
| V-contact-group-name-required-format | — | — | — | ✅ | — | — | — |
| V-contact-group-share-policy-mode-mutex | — | — | — | ✅ | — | — | — |
| V-contract-committed-value-positive | — | — | — | — | — | ✅ | — |
| V-contract-currency-enum | — | — | — | — | 📝[^h] | ✅ | — |
| V-contract-edit-status-aware-fields | — | — | — | — | — | ✅ | — |
| V-contract-expiration-after-start | — | — | — | — | — | ✅ | — |
| V-contract-rate-per-unit-non-negative | — | — | — | — | — | ✅ | — |
| V-login-lockout-3-wrong-attempts | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] | ✅[^a] |
| V-normal-user-limit-enforcement | ✅[^i] | — | — | — | — | — | — |
| V-password-complexity-per-security-level | ✅[^c] | — | — | — | — | — | — |
| V-password-security-level-enum | ✅[^c] | — | — | — | — | — | — |
| V-service-visibility-pricing-required | ✅[^j] | ✅[^k] | ✅[^k] | — | — | — | — |
| V-template-checker-level-integrity | 📝[^l] | 📝[^l] | — | 📝[^m] | — | — | — |
| V-template-levels-count-required-for-restricted | 📝[^l] | 📝[^l] | — | 📝[^m] | — | — | — |
| V-user-first-last-name-letters-only | ✅[^c] | — | — | — | — | — | — |
| V-username-format-uniqueness-immutable | ✅[^c] | — | — | — | — | — | — |

[^a]: Platform-cross-cut. Every authenticated feature inherits the IP-allowlist gate at `/auth/*` and the lockout policy on login. The feature itself doesn't wire these — they apply via [VAULT] `IpAllowlistPreProcessor` + `LoginEligibilityPolicy` ([BRAIN-OUT] `Identity/VALIDATIONS.md`).
[^b]: Wallet view consumes `BalanceTransferLimit` (`BalanceTransferLimitPct`) from `AccountSettings`; transfer-amount cap on the dialog reads `source.availableBalance × balanceTransferLimitPct / 100`. The cap itself is owned by V-account-limits-zero-means-no-limit on the OH Settings tab — wallet feature is a **read consumer** not the editor.
[^c]: Inside `organization-hierarchy` → Add Client wizard (Step 1 = account name, Step 2 = settings/password level, Step 5 = Account Owner first/last/username). The OH page itself also exposes Edit Settings (`settings-account-limitation`) and Add/Edit User flows.
[^d]: Indirect: org-hierarchy hosts the Do-Payment popup for CommChannels/Apps tabs which trigger Reserve/Commit; the actual `InsufficientBalance` 422 surfaces in the wallet/comms-hub UI but the trigger is OH tab.
[^e]: `comms-hub` and `marketplace-applications` carry the Do-Payment + Activate-Service dialogs that invoke `ReserveWalletChargeRequest`. Both 422 codes (`InsufficientBalance` + `NoApplicableRate`) surface inline. Treat HTTP status 422 + `errorMessages[0]` as the canonical FE signal per [BRAIN-OUT] FRONTEND_CONTRACT.md.
[^f]: Contract activation transitions `Pending → Active` triggering Master Wallet funding; insufficient-balance/no-rate fire downstream not at contract save. Contracts feature itself never trips these — it produces the matrix that `charging` later reads.
[^g]: `testing-charging` is the **simulator** for these three charging rules. It exercises the same handlers (`Reserve`, `DirectDebit`, `Transfer`) on real OCS state with the `Settings:TestingCharging:Enabled` flag, so `InsufficientBalance` / `NoApplicableRate` / `InvalidTransferWallets` all surface here. Internal diagnostic surface — see §4 admin-only note.
[^h]: Wallets carry currency from the Account context (`GetAccountHierarchyResponse.Currency`); wallet feature doesn't validate currency but consumes it for display + transfer-currency-match check.
[^i]: Add User wizard inside OH. Cap is read from `MaxNormalUserLimit` in account settings; runtime check is server-side via `UserQuotaPolicy`. FE optionally pre-flights `/api/user/count?role=NormalUser` to render a "12 / 50 Normal Users" badge.
[^j]: OH `comm-channels-tab` + `apps-services-tab` — per-row inline edit of Visibility / PriceType / PriceValue. Cross-field reactive wiring per the rule's "canonical wiring" block.
[^k]: comms-hub / marketplace-applications list rows surface Visibility + Pricing from `AccountCommunicationChannelResponse` / `AccountApplicationResponse`; mgmt-console reads via `/visible/details` (filters by visibility + payment status). The two V-rule error codes (`PriceValueNotConfigured` / `HiddenProductMustNotHavePricing`) fire when an admin edits, not when a client views.
[^l]: Templates rules apply to a Templates feature **not yet present** in the 7-feature parity matrix (GAP-TM-01 + GAP-TM-02 — the route isn't gateway-routed yet, so no FE surface exists). They will land under a future `comms-hub` child page (WhatsApp Business templates) — partial marker until then.
[^m]: Contact-group columns become Template variables (BR-TM-12) — the integrity rule for those template variables sits inside Templates, but a Contact-Group consumer feels the constraint when binding columns to a template body. Partial-cross-feature.

## 3. Per-feature V-rule applicability (drill-down)

### 3.1 `organization-hierarchy` — 9 direct rules + 2 platform-cross-cuts

Most validation-rich feature in the matrix. Hosts the entire Add Client wizard + Add User wizard + Edit Settings forms.

| V-rule | Form / page section (citation from V-rule note) |
|---|---|
| V-account-name-format-uniqueness | "Add Client wizard — Step 1 (Account Information) — `account-name` field" |
| V-password-security-level-enum | "Add Client wizard — Step 2 (Account Settings) — `password-security-level` dropdown. Also editable in [[Organization Hierarchy]] `settings-tab-edit-mode` section." |
| V-account-ip-allowlist-enforcement | "Admin edit surface: [[Organization Hierarchy]] `settings-ip-management` section — list/add/remove IPs in Account Settings (admin flow)" — plus platform-cross-cut at login |
| V-account-limits-zero-means-no-limit | "Add Client wizard — Step 2 (Account Settings) — `account-limits` field group" + "[[Organization Hierarchy]] `settings-account-limitation` section" |
| V-service-visibility-pricing-required | "Add Client wizard — Steps 3 (CommChannels) + 4 (Applications) — per-row visibility / price-type / price-value editor" + "[[Organization Hierarchy]] `comm-channels-tab` + `apps-services-tab` — table rows with inline edit" |
| V-user-first-last-name-letters-only | "Add User wizard — Tab 1 (Personal Information) — `first-name` + `last-name` inputs" + "Add Client wizard — Step 5 (Account Owner) — same field group (reused)" + "Edit User page (admin + self)" |
| V-username-format-uniqueness-immutable | "Add User wizard — Tab 1 (Personal Information) — `username` input (write-only at create)" + "Add Client wizard — Step 5 (Account Owner) — same input (reused)" + "Edit User + Edit Own Profile — `username` field is read-only" |
| V-password-complexity-per-security-level | "First Login force-change-password screen / Change Password screen / Forgot Password new-password screen / Add User Tab 1 — `password` is auto-generated, not user-typed" — surfaces in OH flows |
| V-normal-user-limit-enforcement | "Add User wizard — Tab 1 save action / Edit User — Role dropdown change to Normal User / User Status dropdown → Active for Normal User" |
| (platform) V-account-ip-allowlist-enforcement | gateway pre-processor — every `/auth/*` call |
| (platform) V-login-lockout-3-wrong-attempts | identity domain policy — login + OTP flows |

### 3.2 `comms-hub` — 2 direct rules + 2 partial + 2 platform-cross-cuts

Listing + activation surface. No Add-CommChannel form (channels are seeded server-side from PRD master catalog).

| V-rule | Form / page section |
|---|---|
| V-service-visibility-pricing-required | comms-hub list rows surface `AccountCommunicationChannelResponse` / `AccountCommunicationChannelResponse.visibility/priceType/priceValue` — same 422 codes apply if rows ever become inline-editable on this surface; today they're read-only in mgmt-console (admin enforces via OH) |
| V-charging-insufficient-balance | Do-Payment popup inside `comms-hub` activation row → triggers `ReserveWalletChargeRequest` → `InsufficientBalance` 422 |
| V-charging-no-applicable-rate (partial) | Same Do-Payment popup — `NoApplicableRate` 422 from `ReserveWalletChargeRequest` "Service not configured" path |
| V-template-checker-level-integrity (partial) | WhatsApp Business sub-page (mgmt-console only, currently stub) consumes `CommChannelConfig.checkerLevels` for the W2 internal-approval flow — blocked by GAP-TM-02 |
| V-template-levels-count-required-for-restricted (partial) | Same WhatsApp child page — blocked by GAP-TM-02 |
| (platform) IP allowlist + lockout | every authenticated call |

### 3.3 `marketplace-applications` — 2 direct + 1 partial + 2 platform-cross-cuts

Service-card pattern + payment dialog. Same shape as `comms-hub` per PRD ("CommChannelConfig and AppConfig same shape").

| V-rule | Form / page section |
|---|---|
| V-service-visibility-pricing-required | service cards expose visibility/pricing from `AccountApplicationResponse` — admin-side inline edit via `ChangeAccountApplicationServiceVisibilityRequest` / `ChangeApplicationPriceTypeRequest` / `ChangeApplicationPriceValueRequest`; same 422 codes |
| V-charging-insufficient-balance | Do-Payment dialog inside app activation → `ReserveWalletChargeRequest` |
| V-charging-no-applicable-rate (partial) | Same Do-Payment dialog path |
| (platform) IP allowlist + lockout | every authenticated call |

### 3.4 `contact-groups` — 5 direct rules + 2 platform-cross-cuts

The cleanest 1:1 between feature and PRD module — every V-rule in PRD-04 lands on this feature.

| V-rule | Form / page section |
|---|---|
| V-contact-group-name-required-format | "Create Contact Group wizard — Step 1 (Upload & Set Details) — `group-name` field. Also reused in the Edit dialog (W4 — creator-only edit of Name / Shared With / Reference ID)" |
| V-contact-group-file-size-cap | "Create Contact Group wizard — Step 1 (Upload & Set Details) — file input + size hint" — read `MaxFileSizeMB` from `GET /upload-config` first |
| V-contact-group-file-type-allowlist | Same wizard Step 1 — file input + `<input type=file accept="">` driven by `AllowedExtensions[]` from `GET /upload-config` |
| V-contact-group-column-name-shape | "Create Contact Group wizard — Step 2 (Preview & Configure) — column-config table (one row per detected column, editable `name` + `type` + `alias`)" |
| V-contact-group-share-policy-mode-mutex | "Create Contact Group wizard — Step 3 (Share Group) and post-create Share dialog (W3). Both surfaces share the same form fragment." |
| V-template-checker-level-integrity (partial) | Indirect — column names become template variables when group → template binding happens (cross-PRD-04↔05) |
| V-template-levels-count-required-for-restricted (partial) | Same cross-PRD reach |
| (platform) IP allowlist + lockout | every authenticated call |

### 3.5 `wallet-balance-management` — 2 direct + 2 partial + 2 platform-cross-cuts

Falcon-mostly feature; transfer is the only mutating surface clients see.

| V-rule | Form / page section |
|---|---|
| V-charging-insufficient-balance | "Wallets & Balance Mgmt page → Transfer Balance dialog ([[Falcon Dialog]])" + "Do Payment popup (canonical wrapper `<app-do-payment-priority-popup>`)" |
| V-charging-transfer-source-destination | "Wallets & Balance Mgmt page → Transfer Balance dialog" — source ≠ destination, currency match, source-destination matrix |
| V-account-limits-zero-means-no-limit (partial) | Transfer dialog reads `BalanceTransferLimit %` from tenant settings to compute the `Amount` `Validators.max(...)` cap |
| V-contract-currency-enum (partial) | Wallets consume currency from `GetAccountHierarchyResponse.Currency` for display + transfer-currency-match |
| (platform) IP allowlist + lockout | every authenticated call |

### 3.6 `contracts-cost-management` — 5 direct rules + 2 platform-cross-cuts

Strongest authority asymmetry in the parity matrix (acc-admin + acc-user denied). All 5 contract V-rules concentrate here.

| V-rule | Form / page section |
|---|---|
| V-contract-committed-value-positive | "Add Contract wizard → Step 1 — Contract Information → field `Contract Value (SAR)`" + Edit dialog (Pending status only) |
| V-contract-currency-enum | "Add Contract wizard → Step 1 — Contract Information → Currency dropdown" |
| V-contract-expiration-after-start | "Add Contract wizard → Step 1 — Contract Information → Start Date + Expiration Date pickers" + Edit Contract Pending + Active/Expired extension |
| V-contract-edit-status-aware-fields | "Edit Contract dialog (entry from Contracts & Cost Mng list row). Reuses the 4-step wizard layout, but with per-step field disabling" — read `ContractResponse.CanEdit` |
| V-contract-rate-per-unit-non-negative | "Add Contract wizard → Step 3 — Contract Details → matrix grid; one numeric cell per (App × Channel × Priority × Destination)" + Edit Contract regardless of status |
| (platform) IP allowlist + lockout | every authenticated call |

### 3.7 `testing-charging` — 0 PRD V-rules direct + 3 indirect simulator triggers + 2 platform-cross-cuts

**No V-rules in the PRD authority sense apply to this feature** — `testing-charging` is **internal diagnostic** (admin-only, `Settings:TestingCharging:Enabled`-gated, mutates real OCS state, security boundary forbids exposing to Client per [BRAIN-OUT] `04-feature-parity-matrix/MATRIX.md`). The 3 charging V-rules surface as **simulator outputs** when admins exercise the underlying handlers, not as user-facing form validators on a testing-charging form. PRD-03 does not define a testing-charging business surface — the feature exists purely to verify the OCS rate-card cascade.

| Indirect surface | Rule | Why it surfaces (not as a V-rule "owner") |
|---|---|---|
| Simulator Reserve/Commit run | V-charging-insufficient-balance | Admin runs a scenario, balance is short, handler throws `InsufficientBalance` — surfaced for diagnostic |
| Simulator Reserve run | V-charging-no-applicable-rate | Admin runs a tuple not in the matrix, handler throws `NoApplicableRate` — diagnostic |
| Simulator Transfer run | V-charging-transfer-source-destination | Admin runs malformed transfer pair, handler throws `InvalidTransferWallets` — diagnostic |
| (platform) IP allowlist + lockout | the diagnostic console is itself behind login |

**Verdict:** testing-charging row in the master matrix carries `🚫` would be visually misleading because the 3 charging rules DO fire inside it. The cells in the matrix carry `✅[^g]` flagged "internal diagnostic surface" — meaning **the rules are exercised here but the feature is not a PRD-grounded validation owner**. Any future change to a charging V-rule should re-verify against the simulator output; no FE-form validation work in this feature.

## 4. Real drift to watch out for

The 25 V-rule notes surface a concrete set of contract drifts between PRD and backend. These are the items an implementer MUST mitigate at the FE (FE tighter than backend, or FE renders to the PRD vocabulary while submitting backend-native values).

1. **Username 30 ↔ 100 char cap** — [BRAIN-OUT] V-username-format-uniqueness-immutable: PRD-02 BR-UM-12 says `<=30`; backend `CreateUserRequestValidator` says `MaximumLength(100)`. **FE enforces 30** (`Validators.maxLength(30)`) — backend will not reject a 30-char username. Surfaces in Add User Tab 1 + Add Client Step 5 + every Username display.
2. **PasswordSecurityLevel vocabulary** — [BRAIN-OUT] V-password-security-level-enum: PRD says `Normal/Advanced`; Identity `ePasswordSecurityLevel` is `Low/Medium/High/Strict`. Open question Q-UM-12. **Display PRD labels in dropdown; submit backend codes** (`Normal ↔ Low|Medium`, `Advanced ↔ High|Strict`). Settings tab + Add Client Step 2.
3. **AccountName "must start with letter" — backend regex missing** — [BRAIN-OUT] V-account-name-format-uniqueness: PRD BR-AM-03 requires letter-prefix; Commerce `CreateAccountRequest.Info.AccountName` carries `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` but **no format regex**. **FE enforces** `Validators.pattern(/^[A-Za-z]/)` — no backend mirror yet. Add Client Step 1.
4. **AccountOwner.PhoneNumber + EmailAddress `[ThrowIfNotPassed]` missing** — [BRAIN-OUT] Add Client `07-VALIDATIONS.md`: backend DTO surface lacks the `[ThrowIfNotPassed]` attribute on these two required fields despite the PRD requiring both. **FE enforces** `Validators.required` so empty submission fails client-side. Add Client Step 5.
5. **Account Limits `[ThrowIf*]` attributes missing** — [BRAIN-OUT] V-account-limits-zero-means-no-limit: the four limit fields (`MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevel`, `BalanceTransferLimit`) lack per-field `[ThrowIf*]` — enforcement is handler-only via `InvalidAccountLimits` 422. **FE enforces** `Validators.required + Validators.min(0)` per field with default `0` pre-populated; UI renders "No limit" when value === 0. Add Client Step 2 + Settings tab.
6. **PRD upper-bound `<= hundreds of millions` on contract Value** — [BRAIN-OUT] V-contract-committed-value-positive: backend `[Range]` upper bound is `decimal.MaxValue`. PRD's softer "hundreds of millions" cap is unenforced. **FE should add a soft `Validators.max(999_999_999)`** with a warning toast (not block) — flag in GAP-CC backlog.
7. **PRD `name <=50` + `farabiRefId <=50` length caps on Contract DTOs** — [BRAIN-OUT] E-contract drift: Commerce DTOs have `[Required]` but **no `[MaxLength]`** documented. **FE enforces `Validators.maxLength(50)`** per PRD-03 BR-CC-08. Add Contract Step 1.
8. **Currency enum drift between Commerce ↔ Charging** — [BRAIN-OUT] V-contract-currency-enum: Commerce binds `[EnumDataType(typeof(eCurrency))]`; Charging same field has no enum attribute. **FE wires the enum on both directions** (display + transfer DTOs) for consistency.
9. **Forgot-Password OTP silent vs the 3-wrong rule** — [BRAIN-OUT] V-login-lockout-3-wrong-attempts: PRD BR-UM-32 deliberately says forgot-password OTP is silent (no lockout). Backend matches. **FE must NOT show "attempts remaining"** on the forgot-password OTP screen, while login OTP DOES show a counter when the backend response carries one.
10. **`HiddenProductMustNotHavePricing` reverse rule** — [BRAIN-OUT] V-service-visibility-pricing-required: marked `drift: true` in YAML. When toggling Show → Hide on a service row, the FE MUST clear `priceType` + `priceValue` (or the server returns 422 — defense in depth). OH `comm-channels-tab` + `apps-services-tab`.
11. **Contact-Group share mode silent normalization** — [BRAIN-OUT] V-contact-group-share-policy-mode-mutex: backend SILENTLY drops `SharedUsers[]` when `SharedWithAllUsers=true`. **FE enforces mutex** (toggle disables + clears multiselect) so the user does not lose their selection silently. Contact-Group wizard Step 3.
12. **OTP `expiresAt` modeled as relative seconds, not absolute timestamp** — [BRAIN-OUT] E-otp-challenge: backend returns `OtpExpiresInSeconds` (int?). **FE computes** `expiresAt = now + OtpExpiresInSeconds`. OTP popup component.
13. **Reservation TTL — 300 seconds default** — [BRAIN-OUT] V-charging-insufficient-balance: Reserve auto-releases after `ReservationTtlSeconds=300`. **FE handles `ReservationNotFound` 404** as "Reservation expired — re-quote" rather than as a network error. Do-Payment popup.
14. **No-applicable-rate is a contract-config gap, not user error** — [BRAIN-OUT] V-charging-no-applicable-rate: explicit guidance in the V-rule: "Show a user-friendly 'Service not configured' message and surface it to ops." **FE renders non-actionable copy + an ops-facing breadcrumb** (no retry CTA). comms-hub + marketplace-applications Do-Payment.
15. **Template Restricted bodyType requires both `levelsCount` + `CheckerLevels[].length` to match** — [BRAIN-OUT] V-template-levels-count-required-for-restricted: 4-code structural bundle (`LevelsCountRequiredForRestricted`, `LevelsCountMismatch`, `CheckerLevelsRequired`, `CheckerLevelLimitExceeded`). Blocked by GAP-TM-02 (no gateway route).
16. **Sub-node name 30-char cap (sister rule referenced but not seeded yet)** — `V-subnode-name-maxlength-30` is referenced from V-account-name-format-uniqueness as a sister rule but has no `.md` in the vault (only 25 files on disk). [INFERRED] this is the candidate "26th rule" the brief mentioned — flag for seeding before the next dataset refresh. Falls under `organization-hierarchy` Add Node flow.

## 5. The 3-layer validation architecture (recap)

[BRAIN-OUT] every Falcon component follows the canonical `<name>/models/models.ts + services/<domain>.service.ts + validations/validations.ts` layout (memory: `project_falcon_component_validation_convention.md`). Validation runs in three layers:

### Layer 1 — HTML / directive (synchronous, render-time)

[BRAIN-OUT] 8 Falcon validation directives wire `Validators.*` onto template-driven controls. They map 1:1 to common rules surfaced across the V-rules: `required`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `email`, custom. They are declared in `libs/falcon/src/shared-utils/lib/validations/` (the global registry, mounted once via `provideFalconValidations()` in `app.config.ts`).

For reactive forms, the same rules surface via `Validators.required / .maxLength / .pattern` factories — same registry of error keys, same localized messages.

### Layer 2 — Cross-field FormGroup validators (synchronous, on value change)

[BRAIN-OUT] Cross-field rules are wired at the FormGroup level. Recurring patterns from the V-rules:

- `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided` (Add Client Step 1)
- `endBeforeStart` (V-contract-expiration-after-start)
- `sameWallet` (V-charging-transfer-source-destination)
- `passwordsMatch` (V-password-complexity-per-security-level)
- Visibility ↔ Pricing conditional validators (V-service-visibility-pricing-required) — `visibility.valueChanges.subscribe(...)` toggles validators on `priceType` + `priceValue`
- BodyType ↔ levelsCount conditional (V-template-levels-count-required-for-restricted) — `linkedSignal` driven

### Layer 3 — Async backend uniqueness checks (debounced)

[BRAIN-OUT] Async checks debounced 300ms with `cancel-on-input`:

- Account Name: `GET /api/Node/ValidateAccountName?AccountName=` → returns `bool`. Map `true` → `accountNameTaken` validator error.
- Username: Identity `POST /api/user/exist` → `ExistResponse { bool Exists }`. Map `Exists: true` → `usernameTaken` validator error.

## 6. The `[ThrowIf*]` attribute pattern (recap)

[BRAIN-OUT] Commerce DTOs use a custom attribute family that maps to `FalconException(FalconKeys.Error.*)`. The pattern is summarised in the Add Client `07-VALIDATIONS.md` table:

| Attribute | Triggers on | Maps to error code (typical) |
|---|---|---|
| `[ThrowIfNotPassed]` | null / missing scalar | `RequiredFieldMissing` / `<Field>Required` (400) |
| `[ThrowIfMaxLengthExceed(N)]` | string length > N | `MaxLengthExceeded` / `<Field>TooLong` (400) |
| `[ThrowIfNotEnumValue<TEnum>]` | value outside enum set | `InvalidValue` (422) |
| `[Required]` (DataAnnotations) | null / default | `RequiredFieldMissing` (400) |
| `[Range(decimal, min, max)]` | numeric out of range | `InvalidValue` (422) |
| `[EnumDataType(typeof(TEnum))]` | value outside enum set | `InvalidValue` (422) |

Examples from V-rules:

- `Info.AccountName` — `[ThrowIfNotPassed] [ThrowIfMaxLengthExceed(30)]`
- `Settings.PasswordSecurityLevel` — `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]`
- `Service.PriceType` — `[ThrowIfNotEnumValue<ePricingType>]`
- `AccountOwner.Role` — `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]`
- `DeliveryMethod` — `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]`
- `CommittedValue` — `[Required] [Range(typeof(decimal), "0.0000001", "79228162514264337593543950335")]`
- `Currency` — `[Required] [EnumDataType(typeof(eCurrency))]` (Commerce only — Charging same field has no `[EnumDataType]`)
- `RatePerUnit` / `PriceValue` / `IncludedAmount` / `IncludedUnits` / `UnitPrice` — `[Required] [Range(typeof(decimal), "0", "79228162514264337593543950335")]`

`[ThrowIf*]` runs BEFORE handler logic (FastEndpoints pre-processor chain) — empty/malformed values never reach the handler. Handler-level checks (e.g. `InvalidAccountLimits`, `ContractEditOnlyAllowedWhenPending`, `EffectiveDateMustBeInFuture`) run after.

## 7. Error catalog + FE contract (recap)

[BRAIN-OUT] Every Falcon backend exception flows through `FalconException(FalconKeys.Error.<key>)` → mapped to HTTP status via `[ErrorHttpStatus]` attribute on the key constant → serialised as `ServiceOperationResult<T>` with `errorMessages[0]` already localised.

### Canonical HTTP status mapping

| Status | Meaning | V-rule example |
|---|---|---|
| 400 | Validation / required-field / format | `RequiredFieldMissing`, `MaxLengthExceeded`, `AccountNameRequired`, `InvalidFileSize`, `InvalidFileType`, `CheckerLevelsRequired`, `LevelsCountMismatch`, `LevelsCountRequiredForRestricted`, `CheckerLevel1RequiredBeforeLevel2`, `DuplicateCheckerLevelNumber`, `UserAssignedToMultipleCheckerLevels`, `InvalidCheckerLevelNumber`, `CheckerLevelMustHaveAtLeastOneUser`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidUserExistQuery`, `ContactGroupNameRequired`, `ContactGroupNameInvalidFormat`, `FileSizeExceeded`, `FileEmpty`, `InvalidIpAddress`, `InvalidPriceType`, `InvalidPriceValue` |
| 401 | Credentials / unauth | `InvalidCredentials` |
| 403 | Authorization / IP allowlist | `IpNotAllowed`, `ForbiddenToShareContactGroup` |
| 404 | Not found | `WalletNotFound`, `ReservationNotFound`, `UploadSessionNotFound` |
| 409 | Uniqueness conflict | `DuplicateTenantName`, `DuplicateUsername` |
| 422 | Business / domain / cross-field | `InvalidValue`, `InvalidAccountLimits`, `MaxNodeLevelReached`, `NormalUserLimitReached`, `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `ActivationNotAllowedForHiddenProduct`, `CannotEnableNonVisibleService`, `InsufficientBalance`, `NoApplicableRate`, `InvalidTransferWallets`, `InvalidWalletIdentity`, `InvalidAmount`, `WalletVersionConflict`, `ContractEditOnlyAllowedWhenPending`, `InvalidContractConfiguration`, `EffectiveDateMustBeInFuture`, `OtpResendLimitExceeded`, `InvalidVerificationCode`, `OtpNotReady`, `ChangePasswordFailed`, `PasswordTooShort`, `PasswordRequiresUppercase`, `PasswordRequiresLowercase`, `PasswordRequiresDigit`, `PasswordRequiresSpecialChar`, `PasswordsDoNotMatch`, `InvalidPassword` |
| 423 | Locked | `UserLocked`, `UserSuspended`, `UserPending` |
| 429 | Rate-limit / OTP throttle | `OtpStillValid` |

### Frontend contract (load-bearing)

[BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` (referenced by every V-rule's "Frontend implementation hint"):

> **Use HTTP status code as the primary routing signal.** Display localized `errorMessages[0]` to the user (already localized; do not parse codes). Use error codes only for logging / instrumentation, never for branching UI copy.

Implications:

1. The FE does NOT switch on `FalconKeys.Error.*` string keys for user-facing copy.
2. The FE DOES switch on HTTP status for **flow control**: 401 → relogin · 403 IpNotAllowed → static "contact admin" screen · 422 NoApplicableRate → "Service not configured" non-actionable toast · 423 UserLocked → "account locked" screen with no retry · 429 OtpStillValid → start 60s timer · 409 DuplicateUsername → mark field invalid.
3. Error codes ARE logged (instrumentation, telemetry, debug) but never read off the wire for display.

This contract is repeated in every V-rule's "Frontend implementation hint" section and is the single most important cross-cutting rule for any feature implementing validation surfaces.

## See also

- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — the 7-feature parity grid + per-role landing table
- [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md) — sibling matrix on E-* entities
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md` — golden worked-example of how 9 V-rules map to a single 5-step wizard
- [BRAIN-OUT] `understanding/backend/<service>/VALIDATIONS.md` (one per service) — per-service validator inventory
- [BRAIN-OUT] `understanding/backend/<service>/ERRORS.md` (one per service) — per-service error catalog
- Brain SK `_obsidian/00-Home/VALIDATION_INDEX.md` — the vault graph hub
