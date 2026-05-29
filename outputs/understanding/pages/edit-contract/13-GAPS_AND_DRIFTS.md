*** Edit Contract — Gaps & drifts ***
*** 2026-05-18 ***

# Edit Contract — Gaps & Drifts

> Inherits all Add-Contract gaps. Below are Edit-specific.

## High-severity

### GAP-CC-EDIT-FREEZE-VISIBILITY — Frozen fields look like disabled inputs, not "locked because of status"

[CODE] CSS-only freeze. NEW UI: show lock icon + tooltip "Locked while contract is active. Contact <role> to change."

### GAP-CC-EDIT-EXTENSION-UX — No dedicated "Extend" flow

[CODE] Expired contracts go through normal Edit flow with only endDate editable. UX would be cleaner with a dedicated "Extend Contract" mini-flow (single-field dialog with new endDate).

### GAP-CC-EDIT-NGMODEL-FREEZE — Calendar CVA + getter ngModel freeze risk

[CODE] `contracts-edit-contract.component.ts:76-79`:
> Keep derived date objects stable. Binding a calendar CVA to a getter that creates `new Date(...)` on every change-detection pass can continuously rewrite the child ngModel and freeze the page when edit mode renders.

Active mitigation in code. Reactive Forms migration removes this risk.

### GAP-CC-EDIT-CONCURRENCY — No optimistic concurrency check

Two users editing simultaneously — last-write-wins overwrites first. NEW UI: ETag/version + 409 conflict UX.

## Medium-severity

### Q-CC-EXTEND-WHO — Who can extend expired contracts?

[PRD] silent. Likely Falcon System Admin only. Flag for product clarification.

### GAP-CC-EDIT-FARABI-EDITABLE — FarabiId editable on Active

PRD says it's a unique external reference. Allowing edit on Active could break finance reconciliation. [INFERRED] Should be `editable: pending only`.

## Low-severity

### GAP-CC-EDIT-TABS-VS-STEPPER — Edit is tabs, Add is stepper (UX inconsistency)

Minor inconsistency: same data shape, different navigation paradigm. Could unify Edit to also use stepper.

### Same anti-patterns as Add Contract

- `[(ngModel)]` (no Reactive Forms)
- `*ngIf`/`*ngFor`
- Class fields not signals
- PrimeNG components

## See also

- [../add-contract/13-GAPS_AND_DRIFTS.md](../add-contract/13-GAPS_AND_DRIFTS.md) · [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
