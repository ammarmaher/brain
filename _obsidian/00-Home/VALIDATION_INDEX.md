---
type: hub
hub: validation
created: 2026-05-15
---
*** Validation Index — graph hub ***
*** Updated 2026-05-15 ***

# Validation Index

> Brain Outputs holds the rules. This note holds the graph.

## 🔍 Live queries (Dataview)

_If Dataview plugin is installed, the queries below return live results. Otherwise see the static lists further down._

### All HIGH-severity V-rules

```dataview
TABLE prd, service, drift FROM "30-Validation"
WHERE type = "validation-rule" AND severity = "high"
SORT prd ASC
```

### V-rules by PRD

```dataview
TABLE rows.file.link AS "Rules" FROM "30-Validation"
WHERE type = "validation-rule"
GROUP BY prd
SORT prd ASC
```

### V-rules with documented drift

```dataview
LIST FROM "30-Validation"
WHERE type = "validation-rule" AND drift = true
SORT severity ASC, file.name ASC
```

### V-rules by service

```dataview
TABLE length(rows) AS "Count" FROM "30-Validation"
WHERE type = "validation-rule"
GROUP BY service
SORT length(rows) DESC
```

## Per-page validation registries

| Page | Validation rules file | Approved count |
|---|---|---|
| organization-hierarchy | [VALIDATION_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VALIDATION_RULES.md) | 9 rules (baseline) |

## Global pattern (seed)

- [VALIDATION_PATTERN.md](../../outputs/understanding/frontend/patterns/VALIDATION_PATTERN.md) — seed; promotion requires `promote this globally`.

## PRD sources of validation rules (upstream)

Validation lives inside PRD WORKFLOWS + BUSINESS_RULES (per-step gates, field-level rules, async checks). Each PRD module note carries a "Validation surface" section.

- [[01 Account Management]] — wizard step gates · password security · IP allowlist · account-limit caps · status-aware edit gates
- [[02 User Management]] — email/phone format · password complexity tiers · OTP validity · lockout thresholds · idle-timeout
- [[03 Contract Packaging Charging Billing]] — status-aware edit gates · rate-card numeric ranges · destination-priority uniqueness · contract overlap
- [[04 Contact Group Management]] — file type · file size · column shape · share-target hierarchy bounds · soft-delete window
- [[05 Templates]] — per-CommChannel field schema · variable-token format · quality-drift thresholds · approval-trail integrity

Hub: [[PRD_INDEX]].

## Triangulated validation rules (Phase 2C — 25 notes)

Each rule is traced through 3 layers: **PRD line evidence → Backend `[ThrowIf*]`/DataAnnotation + error code → Frontend implementation hint**. Built in parallel by 3 specialist agents (PRDs 01+02 · 03 · 04+05). Folder: `_obsidian/30-Validation/`.

### PRD-01 Account Management (5)

- [[V-account-name-format-uniqueness]] — `Info.AccountName` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` + `DuplicateTenantName` (BR-AM-03)
- [[V-password-security-level-enum]] — `Settings.PasswordSecurityLevel` `[ThrowIfNotEnumValue<ePasswordSecurityLevel>]` (BR-AM-09)
- [[V-account-ip-allowlist-enforcement]] — Identity `IpAllowlistPreProcessor` · `IpNotAllowed` (403) (BR-AM-10 + BR-UM-24)
- [[V-account-limits-zero-means-no-limit]] — `InvalidAccountLimits` / `MaxNodeLevelReached` / `NormalUserLimitReached` (BR-AM-11/12)
- [[V-service-visibility-pricing-required]] — `PriceValueNotConfigured` / `HiddenProductMustNotHavePricing` (BR-AM-14..17)

### PRD-02 User Management (5)

- [[V-user-first-last-name-letters-only]] — Identity FluentValidation · `FirstNameLettersOnly` / `LastNameLettersOnly` (BR-UM-11)
- [[V-username-format-uniqueness-immutable]] — `UsernameMustStartWithLetter` / `DuplicateUsername` (BR-UM-12/19/37). **⚠ PRD says ≤30; backend says ≤100 — drift**
- [[V-normal-user-limit-enforcement]] — `UserQuotaPolicy` · `NormalUserLimitReached` (BR-UM-07/09/17/38)
- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` + `VerificationRateLimitPolicy` · `UserLocked` (423) (BR-UM-25..27/32)
- [[V-password-complexity-per-security-level]] — `PasswordPolicy` · `PasswordTooShort` / `PasswordRequiresUppercase` / `PasswordsDoNotMatch` (BR-UM-15/20/22/34/37)

### PRD-03 Contract / Packaging / Charging / Billing (8)

- [[V-contract-committed-value-positive]] — `[Range(decimal, "0.0000001", max)]` (BR-CC-08)
- [[V-contract-rate-per-unit-non-negative]] — `[Range(decimal, "0", max)]` (BR-CC-22)
- [[V-contract-currency-enum]] — `[EnumDataType(typeof(eCurrency))]`. **⚠ Charging service does NOT enforce currency enum — drift**
- [[V-contract-expiration-after-start]] — handler-time check · `EffectiveDateMustBeInFuture` (BR-CC-07)
- [[V-contract-edit-status-aware-fields]] — handler-time gate · `ContractEditOnlyAllowedWhenPending` (BR-CC-15/16). `ContractResponse.CanEdit` bool exposed for FE
- [[V-charging-insufficient-balance]] — `InsufficientBalance` (handler-side, no DTO attribute) (BR-CC-32)
- [[V-charging-transfer-source-destination]] — `InvalidTransferWallets` / `InvalidWalletIdentity` (BR-CC-35)
- [[V-charging-no-applicable-rate]] — `NoApplicableRate` (422) (BR-CC-22/32)

### PRD-04 Contact Group Management (5)

- [[V-contact-group-file-type-allowlist]] — handler · `InvalidFileType`
- [[V-contact-group-file-size-cap]] — validator + handler · `InvalidFileSize` / `FileSizeExceeded`
- [[V-contact-group-name-required-format]] — `ContactGroupNameRequired` / `ContactGroupNameInvalidFormat`
- [[V-contact-group-column-name-shape]] — generic codes (BR-CGM-06 — **⚠ no dedicated error code, surfaced as gap**)
- [[V-contact-group-share-policy-mode-mutex]] — silent drop (BR-CGM-XX — **⚠ no error code at all, surfaced as gap: needs `InvalidShareMode`**)

### PRD-05 Templates (2 — limited by GAP-TM-01/02)

- [[V-template-checker-level-integrity]] — 8 bundled error codes for sequential 1..N levels
- [[V-template-levels-count-required-for-restricted]] — `BodyType=Restricted` requires non-null `LevelsCount`

## Honest drift / gaps surfaced

- **Username length** — PRD says `≤ 30`; Identity FluentValidation says `MaximumLength(100)`
- **Account Name letter-prefix** — PRD requires "must start with a letter"; no regex attribute on Commerce DTO
- **Account Limits per-field validators** — `MaxNormalUserLimit` etc. have no `[ThrowIf*]`; only handler-level `InvalidAccountLimits` (422)
- **Charging currency enum** — Commerce binds `eCurrency` with `[EnumDataType]`; Charging same field has no enum binding
- **`CommittedValue` upper bound** — PRD says "hundreds of millions"; backend max is `decimal.MaxValue`
- **Priority enums per CommChannel** — PRD names taxonomies (`BR-CC-23/24/25`); backend `Priority` is a free string. Triangulation broken — moved to gaps.
- **Destination list** — PRD says use `International Phone# Destination List` sheet; backend `Destination` is free string. Gap.
- **PRD-05 backend coverage** — only 2 rules out of ~25 candidate rules have triangulatable backend enforcement today, because Templates entity has no public API (GAP-TM-01) and no gateway route (GAP-TM-02). The remaining ~23 PRD-05 rules are effectively blocked at the architecture level.
- **Contact Group share policy** — silent drop instead of explicit `InvalidShareMode` error code
- **Contact Group column name shape** — generic codes only; no `ContactGroupColumnInvalidFormat` for FE to surface specific UX

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]]

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #drift #gap #blocked #security
