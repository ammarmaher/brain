# Falcon Specs v1.4 — Organization Hierarchy Visual Repair

**Date:** 2026-05-15 (Round 5 night shift)
**Owner:** Adnan Orchestrator (Brain SK Night Shift Round 5)
**Scope:** Organization Hierarchy tabs → CommChannels & Services — final live-bundle verification + Save/Cancel deep-dive
**Round:** 5 of max 5
**Project:** falcon-web-platform-ui — Admin Console + falcon-ui-core library

## Round 5 Headline

- **Fresh bundle confirmed live** — Round 4 `<falcon-angular-alert-dialog>` chunk hydrated on Ammar PC Chrome.
- **57-case SoT matrix run vs live bundle**: 40 PASS · 2 FAIL · 3 PARTIAL · 12 NOT-VERIFIED.
- **Round 4 STILL-BROKEN trio resolution:**
  - Defect 1 (table chrome) → **FIXED at runtime**: header bg `rgb(245,245,245)` = #F5F5F5 (SoT match)
  - Defect 2 (inline edit-row) → **FIXED on first-edit case**: flat stripe `rgb(243,248,245)` = #F3F8F5, no bubble, no notch, inline between rows
  - Defect 3 (IB modal) → **REGRESSED**: Wave-15 in-flight refactor introduced **DEFECT-CCS-R5-002** (modal mounts 0×0, invisible)
- **Save/Cancel deep-dive** (see `audit/SAVE_CANCEL_AUDIT.md`):
  - All 4 editable surfaces on Org Hierarchy page audit as **LOCAL-STATE-ONLY** today
  - Zero network calls for Save / Cancel / Visibility toggle
  - Cancel works cleanly (no leaks)
  - Wave-15 introduces backend wiring CAPABILITY but it's not active on this page (no `nodeId+accountId` inputs passed)
- **2 NEW defects:**
  - **DEFECT-CCS-R5-001 (P2)** — edit-row above-thead position on 2nd+ open
  - **DEFECT-CCS-R5-002 (P1)** — IB modal 0×0 dimensions
- **Wave-15 in-flight refactor discovered**: separate agent modified working tree mid-R5 with partial migration of IB-modal flow to real backend services. NOT staged. Working tree builds GREEN. User must decide: continue / stash / revert.
- **Build at end of R5**: GREEN (hash `8d2ea4c8c3255942`, 16.4s on `nx build admin-console --skip-nx-cache`).
- **Files staged**: 21 total (R3+R4 work, untouched in R5). Unstaged: ~13 files (Wave-15).
- **Commit:** NONE — user will commit + push if they choose.
- **Push:** NONE.

See `ROUND_5_REPORT.md` for full track-by-track narrative.
See `audit/SAVE_CANCEL_AUDIT.md` for the per-surface wiring audit.

---

## Final compact verdict table

| Metric | Value |
|---|---|
| Fresh bundle confirmed | YES — `falcon-ui-alert-dialog-tw.js` chunk served 200 by remote on :4204; `<falcon-angular-alert-dialog>` hydrated in DOM |
| 57-case matrix verdict | 40 PASS · 2 FAIL · 3 PARTIAL · 12 NOT-VERIFIED |
| Round 4 STILL-BROKEN trio | Defect 1 FIXED · Defect 2 FIXED (1st-open) · Defect 3 REGRESSED (Wave-15) |
| Round 4 NOT-VERIFIED (19) | 7 → PASS, 12 → still NOT-VERIFIED (most gated by DEFECT-CCS-R5-002) |
| DEFECT-CCS-R2-001 status | RESIDUAL — manifests as DEFECT-CCS-R5-001 on second/subsequent edit-row open |
| Save audit S1 (2-field edit-row) | LOCAL-STATE-ONLY · no network · persistence lost on reload |
| Save audit S2 (1-field edit-row) | LOCAL-STATE-ONLY · no network · persistence lost on reload |
| Save audit S3 (visibility toggle) | LOCAL-STATE-ONLY · immediate apply |
| Save audit S4 (IB dialog) | WIRED-TO-BACKEND in Wave-15 source · MOCK fallback on this page · currently INVISIBLE due to R5-002 |
| Cancel audit S1 / S2 | CANCEL-WORKS · zero changes leaked · no network |
| Multi-lane edit | Single-lane replace by design · matches SoT |
| SoT-vs-dest Save/Cancel semantic delta | NONE on local-state level |
| Components rendered | 14 / 14 verified hydrated; only `<falcon-dialog-tw>` has 0×0 sizing defect |
| New R5 defects | DEFECT-CCS-R5-001 (P2 position regression), DEFECT-CCS-R5-002 (P1 IB-modal invisible) |
| P0/P1 fixes applied in R5 | ZERO — fixes deferred to user decision on Wave-15 |
| Build green | YES — `nx build admin-console`: hash `8d2ea4c8c3255942`, 16.4s |
| Comm-channels-tab parity (evidence-backed) | **94 %** |
| Files staged total | 21 (unchanged from R4) |
| Commit hash | NONE |
| Push status | NONE |
| Bypass markers | NONE |
| PDF version | v1.4 |
| Brain SK mirror confirmed | YES |

---

## Round 4 Addendum (retained for chronology)

- **New Falcon library component shipped:** `<falcon-alert-dialog>` + `<falcon-alert-dialog-tw>` + `<falcon-angular-alert-dialog>` — Shadow + Light DOM Stencil components + Angular wrapper + 6-file knowledge dossier.
- **Build (R4):** `nx build admin-console` GREEN — hash `12abe61de49a8543`, 16.2 s.
- **R4 dev-serve diagnostic:** stale bundle issue resolved in R5 (user restarted dev-serve before R5 ran).
- **SoT matrix harvested in R4:** 57 test cases at `matrix/sot-testcases.md`.
- **R4 matrix runtime results:** 28 PASS / 7 FAIL / 3 PARTIAL / 19 NOT VERIFIED.
- **Logged R4 defect:** DEFECT-CCS-R4-001 (P2, intentional) — footer bg deliberate divergence; retained in R5.

## Round 2 Addendum (retained)

**Date:** 2026-05-15 (Round 2 night shift)
**Scope:** comm-channels-tab title + Action header copy

## Source-of-truth + evidence locations

| Evidence | Path |
|---|---|
| R5 SoT 57-case matrix | `Brain Outputs/reports/falcon-eyes/R4-20260515/matrix/sot-testcases.md` |
| R5 audit folder | `Brain Outputs/reports/falcon-eyes/R5-20260515-1530/audit/` |
| R5 Save/Cancel audit | `Brain Outputs/reports/falcon-eyes/R5-20260515-1530/audit/SAVE_CANCEL_AUDIT.md` |
| R5 report (narrative) | `Brain Outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ROUND_5_REPORT.md` |
| Updated scorecards | `Brain Outputs/understanding/pages/organization-hierarchy/{PAGE_SCORECARD,VISUAL_PARITY_SCORECARD,NEXT_ACTIONS,IMPLEMENTATION_SCORECARD,TEST_REPORT}.md` |
| Brain SK mirror | `Brain SK/outputs/{reports,understanding}/` |
| SoT React source | `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\apps.jsx` |
| Round 3+4 staged consumer code | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/` |
| Round 4 alert-dialog library | `libs/falcon-ui-core/src/components/falcon-alert-dialog{,-tw}/`, `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/` |
| Wave-15 in-flight (UNSTAGED) | `libs/falcon/src/shared-{ui,data-access,types}/lib/...` + modified `applications-table.component.{ts,html}` |
