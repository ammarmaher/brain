*** Edit Contract — Playbook ***
*** Single-doc synthesis · 2026-05-18 ***

# Edit Contract — Playbook

## TL;DR

Edit Contract is the 4-tab editor for an existing Contract. Reuses 3 of 4 section components from Add Contract (RateCard, ContractDetails, Addons) with `[editable]` driven by `hasRestrictedCommercialFields`. Status-aware field freeze: **Pending=full edit, Active=name+farabi only, Expired=read-only (with endDate extension affording status flip back to Active)**. Single `PUT commerce/Contracts/{id}` save. Container holds Save button via @ViewChild.

## Sections

1. **Permissions** — same as Add. Server-computed `canEdit` flag gates entry. **Q-CC-EXTEND-WHO** open for extension role.
2. **Tab 1 (Info)** — name/farabi/dates/value. Pending=all editable. Active=name/farabi/endDate only. Expired=endDate only (extension).
3. **Tabs 2-4** — re-uses Add section components with `[editable]="!frozen"`.
4. **Field Freeze** — derived flags `canSave` + `hasRestrictedCommercialFields`. CSS-only visual (`!bg-falcon-neutral-100 !cursor-not-allowed`). Backend enforces.
5. **Validations** — same ~28 predicates as Add + `canSave` gate. Locked fields keep original values.
6. **Backend API** — `PUT commerce/Contracts/{id}` with composite shape. BE re-validates status-aware locks.
7. **Components** — `<falcon-tabs>` (new) + 3 reused section components. Save button in container header via @ViewChild.
8. **Kafka** — emits `contract-updated` always. Emits `contract-status-changed` on extension flip.
9. **State** — only manual transition is `expired → active` via extension. (Cron handles others.)
10. **Errors** — Add errors + Edit-specific `CommercialFieldLockedOnActive` / `ExpiredFieldLocked` / `ExtensionBackwards`.
11. **Gaps** — FREEZE-VISIBILITY (no lock icon), EXTENSION-UX (no dedicated flow), CONCURRENCY (no ETag), FARABI-EDITABLE-ON-ACTIVE.
12. **Checklist** — 8-question gate + FE/BE/E2E lists.

## Per-status editability matrix (the critical table)

| Field | Pending | Active | Expired |
|---|---|---|---|
| Contract Name | ✓ | ✓ | ✗ |
| Farabi Ref | ✓ | ✓ (review GAP) | ✗ |
| Start Date | ✓ | ✗ | ✗ |
| End Date | ✓ | ✓ (push) | ✓ (extension) |
| Committed Value | ✓ | ✗ | ✗ |
| Rate Card | ✓ | ✗ | ✗ |
| Rate Matrix | ✓ | ✗ | ✗ |
| Quotas | ✓ | ✗ | ✗ |
| Overage Rates | ✓ | ✗ | ✗ |

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md` (BR-CC-50..56)
- [CODE] `apps/admin-console/.../contracts-cost-management/components/contracts-edit-contract/contracts-edit-contract.component.ts:52-291`
- [CODE] `contracts.models.ts:579-585` (helper functions)

## Hubs

[[Edit Contract Flow]] · [[Contracts List]] · [[Add Contract Flow]] · [[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[AMMAR_BRAIN_HOME]]
