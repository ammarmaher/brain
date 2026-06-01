*** Add Contract — Gaps & drifts ***
*** Open questions + anti-patterns · 2026-05-18 ***

# Add Contract — Gaps & Drifts

## Critical halts

None unique to Add Contract (inherits from contracts-list halts).

## High-severity gaps

### GAP-CC-ADD-PES — No PES guards on Add button

Same as `contracts-list`. New UI: `FalconAccess.contracts.add()`.

### GAP-CC-ADD-NOUNIQUE — No async FarabiId uniqueness check

[CODE] no debounced async validator. FE relies on BE 422 rejection on submit.

**Fix:** add `GET commerce/Contracts/exists?accountId={id}&farabiReferenceId={ref}` if endpoint exists, debounced 300ms. Halt-and-flag for backend endpoint creation.

### GAP-CC-ADD-NORX — Not Reactive Forms

[CODE] entire wizard uses `[(ngModel)]` + getter validators. NEW UI must migrate to Reactive Forms per [F-022].

### GAP-CC-ADD-DISCARD-GUARD — No confirm on Cancel

Cancel button immediately closes wizard, losing all entered data. NEW UI: add confirm dialog if form is dirty.

### GAP-CC-ADD-FARABI — Old-UI doesn't validate farabiReferenceId non-empty

[CODE] `isContractInfoValid()` doesn't check `farabiReferenceId`. PRD says required. NEW UI fix.

## Medium-severity gaps

### GAP-CC-ADD-AUTOCOLLAPSE — Auto-correcting priceUnit hides user intent

[CODE] `ContractsRateCardSectionComponent.ngOnChanges` silently rewrites `row.priceUnit` to the catalog value. If a user clicks the wrong channel and then back, their entered priceValue may belong to the wrong rating-unit. Consider showing a confirmation when correction happens, OR locking the priceUnit dropdown to only the valid option (preventing wrong selection).

### GAP-CC-ADD-44CELLS — 44 mandatory cells UX

The rate matrix has 44 required cells for WhatsApp. Filling 44 inputs is tedious. NEW UI: add a "Bulk fill" action (set same rate for all priorities in a destination, or all destinations for a priority).

### GAP-CC-ADD-NOSAVEDRAFT — No save draft

If the wizard is interrupted (browser close, navigation), all work is lost. NEW UI: implement localStorage-backed draft per accountId.

## Low-severity

### GAP-CC-ADD-NGMODEL-FREEZE — ngModel + getter date binding freeze risk

[CODE] `contracts-edit-contract.component.ts:76-79` comment:
> Keep derived date objects stable. Binding a calendar CVA to a getter that creates `new Date(...)` on every change-detection pass can continuously rewrite the child ngModel and freeze the page when edit mode renders.

Same risk applies to Add wizard. Mitigation already in code, but Reactive Forms migration eliminates it entirely.

### GAP-CC-ADD-FOOTER-PLACEMENT — Footer buttons inside child stepper

[CODE] `<dynamic-stepper>` owns the footer. Migrating to Stencil `<falcon-stepper>` requires re-wiring Cancel/Previous/Next/Finish into the new footer slot.

## Drift summary

| Drift | PRD | Code | Resolution |
|---|---|---|---|
| FarabiId required | YES (BR-CC-04) | NO check in Step 1 | FE: add check |
| Start date in future | YES (BR-CC-01) | NO check (only end > start) | FE: add `>= today` |
| Async FarabiId uniqueness | (silent) | NO async check | Backend endpoint + FE wiring |
| Save draft | (silent) | NO | Optional enhancement |

## See also

- [07-VALIDATIONS](07-VALIDATIONS.md) · [09-COMPONENTS](09-COMPONENTS.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
