*** Validation Index — graph hub ***
*** Updated 2026-05-15 ***

# Validation Index

> Brain Outputs holds the rules. This note holds the graph.

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

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]]
