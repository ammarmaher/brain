# Next Actions — Organization Hierarchy

> Priority-ordered work queue. Updated incrementally as items close.

**Last updated:** 2026-05-15 (post Falcon Eyes Round 1, auth-unblock complete, 96.5 % visual parity reached)

## Priority 1 — P3 follow-ups (1 implementation pass, ~5 minutes total)

| ID | Description | File | Effort |
|---|---|---|---|
| GAP-i18n-001 | Add `hierarchy.users.emptyTitle` + `hierarchy.users.emptyBody` translation keys | `apps/admin-console/src/assets/i18n/en.json` | 1 min |
| GAP-i18n-002 | Same in `ar.json` | `apps/admin-console/src/assets/i18n/ar.json` | 1 min |
| GAP-paginator-001 | Set Users table default rows-per-page to 20 to match source SoT | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 1 min |

When these land, expected pixel parity rises to ~97-98 %.

## Priority 2 — Real-data re-verification (deferred to next backend-available run)

- Top-bar user-profile widget — verify it populates with real session
- Tree sub-tree (departments / sub-departments) — verify with real backend
- Users-table data + status badge palette — verify with populated rows
- Interactive flows (tab switch, tree expand, info-panel open/close, OTP-popup) — exercise + diff

## Priority 3 — Test-list completion

Run the 30-item destination test list against real session + real data. Currently 17 / 30 pass + 1 partial + 2 P3-fail + 10 interactive deferred.

## Priority 4 — Validation + business coverage

Both deferred. Will run after Priority 2 verification completes.

## Backlog (not actionable yet)

- Verify accessibility (focus order, ARIA roles, keyboard-only flows)
- Verify RTL layout (Arabic mode)
- Verify all popup flows (Confirm dialog, OTP, Add User, Add Node)
- Verify Settings tab edit-mode (IP management, account limitation, edit/save)

## Closed in this round

- P0 auth blocker — **RESOLVED** via Plan B (dev-only localhost bypass, reverted before implementation commit)
- All 12 sections now render in the destination
- Pixel parity 96.5 % — both 90 % and 95 % targets reached
- No Falcon component repairs needed
