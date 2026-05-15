*** Visual Repair Plan — Org Hierarchy (RESUMED 2026-05-15) ***

## Status

**NOT EXECUTED — not needed.** Round 1 alone reached 96.5 % pixel + ~95 % semantic parity. Both 90 % and 95 % targets met without any Falcon component repair.

## Why no repair rounds were run

Falcon Eyes pixel diff shows 3.5 % difference, entirely traced to content / data — not Falcon component bugs:

1. Top-bar user-profile widget empty (no real session)
2. Tree shows only root clients (no real backend serving sub-tree)
3. Users table empty-state with raw i18n keys (2 missing translations)

None of these is a Falcon component layout, token, or composition defect.

## Backlog (P3, filed for next implementation pass)

| ID | Description | File | Effort |
|---|---|---|---|
| GAP-i18n-001 | Add `hierarchy.users.emptyTitle` + `hierarchy.users.emptyBody` to en.json | `apps/admin-console/src/assets/i18n/en.json` | 1 min |
| GAP-i18n-002 | Same in ar.json | `apps/admin-console/src/assets/i18n/ar.json` | 1 min |
| GAP-paginator-001 | Set default rows-per-page to 20 on `<falcon-data-table>` for Users | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 1 min |

When these three land, expected pixel parity rises to ~97-98 %.

## Round protocol (kept for reference)

If a future run regresses below 90 %:

1. Re-run Falcon Eyes (`npx tsx capture-and-compare.ts` from `tools/falcon-eyes`)
2. Fill semantic mismatch records per defect (`semantic-mismatch-template.md`)
3. Apply Falcon-customization-order repair (inputs → templates → slots → tokens → upgrade → new component → wrapper → raw as GAP)
4. Build green (`nx build admin-console`) — must pass
5. Re-capture, regenerate diffs, update scorecards
6. Stop at ≥90 % or 5 rounds or build broken
