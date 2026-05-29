*** Contracts List — Gaps & drifts ***
*** Open questions + anti-patterns + PRD↔backend drift · 2026-05-18 ***

# Contracts List — Gaps & Drifts

## Critical halts

None at the LIST level. (Add / Edit have their own halts.)

## High-severity gaps

### GAP-CC-LIST-PES — No PES guards at the route or buttons

[CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contracts-cost-management/05-PES.md` — zero PES queries in the contracts feature. Relies entirely on parent `adminConsoleGuard`.

**Risk:** Falcon Operation role (view-only per Q-CC-OP-EDIT) can currently click "Add Contract" / "Edit" — backend rejects, but FE UX is wrong.

**Fix in NEW UI:** add PES queries:
- `FalconAccess.contracts.add()` → gate Add button
- `FalconAccess.contracts.edit()` → gate Edit kebab action
- `FalconAccess.contracts.view()` → gate route entry

### GAP-CC-LIST-LOCAL-TREE — Local tree component re-implementation

[CODE] `shared/components/contracts-accounts-panel/` — local implementation, NOT `<falcon-organization-hierarchy-tree>`.

**Reason given in code:** flat-accounts-only, no children to drill.

**Fix:** add a `[mode]="'flat-accounts-only'"` prop to the canonical tree, then consolidate.

### GAP-CC-LIST-NOSORT — Table has no sortable columns

[CODE] `buildColumns()` lines 261-322 — no `sortable: true` flag on any column.

PRD silent on sort requirements. **Likely requirement:** sort by creation date desc by default; allow sort on start date, expiration date, value, remaining, status.

**Flagged Q-CC-LIST-SORT-REQ.**

### GAP-CC-LIST-NOSEARCH — No search / filter

No way to filter the list by name, farabi ref, status, or date range. For large clients with many contracts, this is unusable.

**Flagged Q-CC-LIST-SEARCH-REQ.**

## Medium-severity gaps

### GAP-CC-LIST-NOPAGE — All rows fetched at once

[CODE] `listContracts` returns all contracts in one call. No pagination on the wire.

**Reason inferred:** typical account has <50 contracts. But large accounts could exceed.

**Fix:** add `pageNumber` + `pageSize` to `GET commerce/Contracts` query. Backend supports it? Verify.

### GAP-CC-LIST-CLASS-FIELDS — State as class fields, not signals

[CODE] all state fields are plain class properties + `markForCheck()`. NEW UI should use Angular signals: `selectedNodeId = signal<string|null>(null)`, `mode = signal<Mode>('list')`, etc.

### GAP-CC-LIST-PROJECTOR-WAIT — No live refresh on contract changes

If user creates a contract, then navigates away and back, the list re-fetches. But if they don't navigate, the list stays stale (e.g. after cron flips a contract's status). 

**Fix:** subscribe to SignalR / SSE notifications on contract-status-changed.

### Q-CC-OP-EDIT — Falcon Operation role's Add/Edit permission

[PRD] silent — Operation may be view-only OR full-edit. Default assumed view-only.

**Resolution:** product clarification. Backend likely returns 403 in either case, but FE should know.

## Low-severity / cosmetic

### GAP-CC-LIST-DATE-FORMAT — Date format includes dashes

[CODE] `Intl.DateTimeFormat(...).format(date).replace(/ /g, '-')` produces `15-May-2026`. PRD silent; common alternative is `15 May 2026` (with spaces) or `2026-05-15` (ISO).

### GAP-CC-LIST-ROW-COLOR — Row coloring uses tinted bg

[CODE] `bg-falcon-green-25` for pending, `bg-falcon-lilac-25` for expired. Subtle but may have accessibility issues (low contrast). Recommend: add a left border indicator instead (`border-l-4 border-falcon-green-500`).

### GAP-CC-LIST-NOMSG — No info on what "Farabi Ref Id" means

Column header is `Farabi Ref Id` — non-trivial business term. NEW UI: add tooltip or info icon explaining "External system reference for finance reconciliation."

## Pending-questions to write

I will create:
- `wave-4-contracts-list-Q-CC-OP-EDIT.md` — Falcon Operation Add/Edit permission
- `wave-4-contracts-list-Q-CC-LIST-SORT-REQ.md` — sort/filter requirements
- `wave-4-contracts-list-Q-CC-LIST-SEARCH-REQ.md` — search/filter requirements

## Drift summary

| Drift | PRD says | Code does | Resolution |
|---|---|---|---|
| (none high-severity) | — | — | — |
| Status auto-transitions | pending→active on startDate, active→expired on endDate | (cron-driven in BE, not visible to FE) | Document |
| Date format | (silent) | `15-May-2026` | Confirm with product |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [01-PERMISSIONS](01-PERMISSIONS.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
