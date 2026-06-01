*** Edit Contract — Implementation checklist ***
*** 2026-05-18 ***

# Edit Contract — Implementation Checklist

## Verification gate

- [ ] 1. PRD rules? → BR-CC-50..56 (status-aware field restrictions)
- [ ] 2. Endpoint? → `PUT commerce/Contracts/{id}`
- [ ] 3. Per-status editability matrix understood? → see [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
- [ ] 4. Same DTO shape as Add? → YES (composite `UpdateContractRequest`)
- [ ] 5. Extension via same endpoint? → YES (status flips Expired→Active)
- [ ] 6. Tab navigation vs stepper? → tabs (free nav)
- [ ] 7. `canEdit` flag check? → from `currentContract.canEdit`
- [ ] 8. Frozen field implementation? → CSS only + `[disabled]` (BE enforces)

## Frontend tasks

### Setup
- [ ] Reactive Forms (not ngModel).
- [ ] Tab control: `<falcon-tabs>`.

### Tab 1
- [ ] Same inputs as Add Step 1.
- [ ] `[disabled]="hasRestrictedCommercialFields()"` on frozen fields per status matrix.
- [ ] Lock icon + tooltip on frozen fields (GAP-CC-EDIT-FREEZE-VISIBILITY).

### Tab 2-4
- [ ] Re-use `<app-contracts-rate-card-section>` / `<app-contracts-contract-details-section>` / `<app-contracts-addons-section>`.
- [ ] Pass `[editable]="!hasRestrictedCommercialFields()"`.

### Extension UX (GAP-CC-EDIT-EXTENSION-UX)
- [ ] When status=expired, show banner: "Contract has expired. Extend by setting a new end date."
- [ ] (Optional) Add a dedicated Extend dialog for one-click extension flow.

### Save
- [ ] Container header has "Save" button → @ViewChild .submit().
- [ ] On success: emit (saved) → mode='view'.

### Concurrency (GAP-CC-EDIT-CONCURRENCY)
- [ ] (Future) Send `If-Match: <etag>` header.
- [ ] (Future) On 409: show "Refresh" prompt.

### Cleanup
- [ ] No SCSS [F-017]. No `*ngIf`/`*ngFor` [F-018]. No PrimeNG [F-016]. Reactive Forms [F-022].
- [ ] Signals for state.

## Backend tasks

- [ ] Verify `PUT commerce/Contracts/{id}` enforces status-aware field locks.
- [ ] **Q-CC-EXTEND-WHO**: confirm role for extension.
- [ ] Verify status flip Expired→Active on endDate change.
- [ ] Emit `contract-updated` + (conditional) `contract-status-changed` events.

## E2E tests

- [ ] Edit pending contract: change all fields → save → values persisted.
- [ ] Edit active contract: change name/farabi → save → success.
- [ ] Edit active contract: try change committedValue via dev tools → BE returns 422.
- [ ] Edit expired contract: change endDate to future → status flips to active.
- [ ] Edit expired contract: try change rates → BE returns 422.
- [ ] Open contract in 2 tabs, edit + save in both → second save returns 409 (when concurrency added).

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
