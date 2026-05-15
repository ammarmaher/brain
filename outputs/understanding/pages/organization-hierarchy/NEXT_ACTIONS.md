# Next Actions — Organization Hierarchy

> Priority-ordered work queue. Updated incrementally as items close.

**Last updated:** 2026-05-15 (Round 2 night shift — comm-channels-tab title + Action header fixed; row-expansion slot projection regression logged as DEFECT-CCS-R2-001 HIGH)

## Priority 0 — Round 2 results (2026-05-15 evening)

| ID | Description | Status |
|---|---|---|
| ROUND2-CCS-001 | comm-channels-tab title `Comm Channels` → `CommChannels & Services` (en + ar) | **DONE** (`libs/falcon/src/language/i18n/en.json:1228`, `ar.json:1226`) |
| ROUND2-CCS-002 | Action header copy `Actions` → `Action` (singular per SoT) | **DONE** (`apps/admin-console/.../org-hierarchy-page-menu.component.ts:244`) |
| ROUND2-CCS-003 | Footer bg parity verified | **NO-OP** (Wave 19 already applied; DOM-computed = `rgb(250, 250, 250)`) |
| ROUND2-CCS-004 | Edit affordance verified | **NO-OP** (Wave 14 row-expansion already correct in code; see DEFECT-CCS-R2-001 for runtime regression) |
| DEFECT-CCS-R2-001 | HIGH — `falcon-table-tw` row-expansion slot projection regression: slotted child stays as direct host child instead of moving into expansion cell. Edit panel renders ABOVE the table, not inline. Needs Stencil-side fix. | **NEW — deferred to next round** |
| DEFECT-CCS-R2-002 | LOW — `styles.js` `import.meta` SyntaxError pre-existing on tab load | **NEW — deferred to next round** |

Build is GREEN after Round 2 (hash `e72a7cdfc86272d1`).



## Priority 1 — P3 follow-ups (CLOSED)

| ID | Description | File | Status |
|---|---|---|---|
| GAP-i18n-001 | Add `hierarchy.users.emptyTitle` + `hierarchy.users.emptyBody` translation keys | `libs/falcon/src/language/i18n/en.json` (canonical source; was incorrectly attributed to `apps/admin-console/src/assets/i18n/en.json` which is the build output) | **DONE** |
| GAP-i18n-002 | Same in `ar.json` | `libs/falcon/src/language/i18n/ar.json` | **DONE** |
| GAP-paginator-001 | Set Users table default rows-per-page to 20 to match source SoT | `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` (signal default lives in state service, not HTML) | **DONE** |
| GAP-status-badge-001 | Status-badge token re-verify | `libs/falcon-ui-tokens/src/components/status-badge.tokens.css` | **VERIFIED** — bucket mapping matches source SoT; no change required |

Build is GREEN after the P3 pass (hash `439d98a8dd333f51`).
Falcon Eyes re-capture of the affected sections is **pending real-auth session** — see Priority 2.

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
