# Next Actions — Organization Hierarchy

> Priority-ordered work queue. Updated incrementally as items close.

**Last updated:** 2026-05-15 (Round 5 user rejection — score reset to 0 %, three new P0 defects, Round 6 pending spec sign-off)

## 🔴 P0 BLOCKERS — Comm Channels edit flow (Round 5 user rejection, 2026-05-15)

User inspected the live destination after dev-serve restart and rejected the edit-row implementation. Round 5 parity is **0 %**. See `ROUND_5_POSTMORTEM.md` for root cause analysis and `EDIT_ROW_SPEC.md` for the locked spec Round 6 must satisfy.

| ID | Severity | Description | Required behavior |
|---|---|---|---|
| **DEFECT-CCS-R5-P0-A** | P0 | Edit-row renders as fixed drawer at top of table | Must render as **inline expand-row directly below the row being edited** via Falcon Data Table row-expansion API |
| **DEFECT-CCS-R5-P0-B** | P0 | No post-save indicator on row | After Save, **chevron toggle** must appear in Actions column so user can re-expand and inspect staged change |
| **DEFECT-CCS-R5-P0-C** | P0 | Edit-row fields not column-aligned with header | Edit-row structurally mirrors header — dropdown under Price Type column, calendar under Effective Date, value under Price Value |

**Round 6 plan:** `ROUND_6_PLAN.md` (does not start until: spec signed off + test values confirmed + Wave-15 decision made).

---

## Priority 0 — Round 5 results (2026-05-15, ~14:00 local)

| ID | Description | Status |
|---|---|---|
| ROUND5-CCS-001 | Verify Round 4 STILL-BROKEN trio against fresh dev-serve bundle | **DONE** — Defect 1 (table chrome) FIXED at runtime; Defect 2 (inline edit-row) FIXED first-open; Defect 3 (IB modal) REGRESSED via Wave-15 (see DEFECT-CCS-R5-002) |
| ROUND5-CCS-002 | 57-case SoT matrix against live dest | **DONE** — 40 PASS / 2 FAIL / 3 PARTIAL / 12 NOT-VERIFIED (most NOT-VERIFIED gated by DEFECT-CCS-R5-002) |
| ROUND5-CCS-003 | Save/Cancel deep-dive per editable surface | **DONE** — see `SAVE_CANCEL_AUDIT.md`. Verdict: all 4 surfaces LOCAL-STATE-ONLY today on this page; Wave-15 introduces backend wiring capability that isn't yet activated |
| DEFECT-CCS-R5-001 | P2 — Edit-row above-table position regression on second/subsequent open. First open is correct (inline between rows). Suspect Stencil row-expansion slot redistribution losing projection target on close. | **NEW** |
| DEFECT-CCS-R5-002 | P1 — IB modal renders with 0×0 dimensions. `<falcon-dialog-tw>` host hydrated + `open=true` + backdrop element exists with `position: fixed inset-0` but `getBoundingClientRect` width/height = 0. Introduced by Wave-15 wrapper `<falcon-insufficient-balance-dialog>` adding an extra composition layer. | **NEW** |
| WAVE-15-IN-FLIGHT | Discovered mid-R5 — working tree contains a partial backend-wiring refactor (`comm-channel-payment.service.ts`, `OrderStatusService`, `SimplePollService`, `<falcon-insufficient-balance-dialog>` lib component, 240-line diff on `applications-table.component.ts`). NOT staged. Working tree builds green via `nx build admin-console`. | **REQUIRES USER DECISION** — continue/stash/revert |

Build at the end of Round 5: GREEN (hash `8d2ea4c8c3255942`, 16.4s).
Staged: 21 files (R3+R4 work) untouched. Unstaged: ~13 files (Wave-15 work) untouched.

## Priority 0 — Round 2 results (2026-05-15 evening, retained)

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
