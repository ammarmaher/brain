*** Contact Groups List — Implementation checklist ***
*** 2026-05-18 ***

# Contact Groups List — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → PRD-04
- [ ] 2. Backend endpoints? → 9 (8 contact-group + 1 identity) — all EXIST
- [ ] 3. Two-tab structure? → Own + Shared
- [ ] 4. PES queries identified? → 9
- [ ] 5. softDelete visibility per role? → Falcon=all, clients=non-deleted
- [ ] 6. API casing inconsistency? → GAP-CGL-CASING flagged
- [ ] 7. User-picker filter? → Status[2,3,4] + Role[NormalUser]
- [ ] 8. Pre-signed download URL? → must re-fetch on click

## Frontend tasks

- [ ] List page with `<falcon-organization-hierarchy-tree>` + `<falcon-tabs>` + `<falcon-angular-data-table>`.
- [ ] Detail page deep-linkable.
- [ ] Edit panel for name/refId.
- [ ] Share panel for SharedUsers[].
- [ ] User-picker multiselect with debounced async search.
- [ ] Download buttons (Original + Validated).
- [ ] Soft-delete badge for Falcon.
- [ ] **GAP-CGL-MISSING-FILTERS:** add search + filters.
- [ ] **GAP-CGL-CLIENT-PAGINATION:** server-side pagination.
- [ ] **GAP-CGL-DOWNLOAD-EXPIRY:** re-fetch URL on each click.

## Backend tasks

- [ ] **GAP-CGL-CASING:** harmonize query param casing across list endpoints.
- [ ] Verify all 9 PES keys exist in registry.

## E2E tests

- [ ] AO views own groups → list correct.
- [ ] AO views shared groups → list correct.
- [ ] Falcon admin views soft-deleted groups → badge visible, edit hidden.
- [ ] Creator edits name → succeeds.
- [ ] Non-creator tries to edit → blocked.
- [ ] Download Original → file downloaded.
- [ ] Download Validated → file downloaded.

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
