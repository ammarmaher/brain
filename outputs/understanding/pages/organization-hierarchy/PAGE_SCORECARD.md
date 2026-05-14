# Page Scorecard — Organization Hierarchy

**Last updated:** 2026-05-14 (post Wave 17.5)
**Score basis:** Baseline + ingestion of 5 prior reports + Wave 17.5 visual parity sweep (12 sections)
**Approval state:** PENDING — baseline approved 2026-05-14; Wave 17.5 update pending Ammar approval

---

## Headline

| Metric | Score | Trend |
|---|---|---|
| **Aggregated Page Understanding %** | **47%** | ↑ +31 (vs baseline 16%) — **UI/UX 75% PASS · Gaps 58% close · Business 40% climbing** |

> Formula: `(UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)`

---

## Dimension breakdown (weighted)

| Dimension | Score | Trend | Weight | Weighted contribution | NEEDS-ATTENTION? |
|---|---|---|---|---|---|
| UI / UX | **75%** | ↑ +50 | 0.35 | 26.25 | ✓ **PASS** (≥ 60%) |
| Business | **40%** | ↑ +30 | 0.25 | 10.00 | YES (< 60%) |
| Validation | **5%** | — | 0.20 | 1.00 | YES (< 60%) |
| Gaps Resolved | **58%** | ↑ +38 | 0.20 | 11.60 | YES (< 60%) — close |
| **Total** | | | | **48.85%** | **page = NEEDS ATTENTION** (Validation 5% still blocking) |

Per skill rule: **any dimension below 60% triggers NEEDS-ATTENTION flag regardless of total**.

## Auxiliary scores (informational, do not roll into headline)

| Metric | Score | Trend | Notes |
|---|---|---|---|
| Source understanding % | **80%** | ↑ +10 | Live HTML vs Angular comparison adds verification confidence (Wave 17.5) |
| Destination implementation % | **55%** | — | Unchanged — sweep was measurement only |
| Visual parity % | **58%** | ↑ +23 | 12 sections measured in Wave 17.5; page-shell + sidebar sections now near 90%+ after Wave 18 fixes |
| Business rule coverage % | **10%** | — | Few business rules explicitly documented |
| Validation coverage % | **5%** | — | Validation analysis effectively not done |
| Gap resolution % | **25%** | ↑ +5 | 5 new parity gaps logged (GAP-PARITY-001 to 005); some baseline gaps confirmed as deferred |
| Component reuse % | **80%** | — | Already reuses 6 Falcon library components + 2 page-local components |
| Test coverage % | **0%** | — | No automated tests for this page identified |

## Score history (page-level approval events)

| Date | Event | Page % | UI/UX | Business | Validation | Gaps | Approved? |
|---|---|---|---|---|---|---|---|
| 2026-05-14 09:00 | First seed (post-ingestion of 5 reports + live regression on Users table) | **16%** | 25% | 10% | 5% | 20% | APPROVED (Ammar 2026-05-14) |
| 2026-05-14 13:30 | After Wave 17.5 visual parity sweep (12 sections, live HTML vs Angular comparison) | **23%** | **40%** | 10% | 5% | **25%** | PENDING |
| 2026-05-14 13:45 | After Wave 18 fix of GAP-PARITY-001 (page title) + GAP-PARITY-002 (sidebar cleanup) — live verified | **25%** | **45%** | 10% | 5% | **29%** | PENDING |
| 2026-05-14 14:00 | **PAGE APPROVED** by Ammar ("approve the page") — 6 components auto-promoted to 100%; menu stays at 60% (BUG-004 blocks). Page % unchanged because dimensions still earn the score, not the approval. | **25%** | 45% | 10% | 5% | 29% | **APPROVED** (component-level) |
| 2026-05-14 14:30 | **P1.3 executed** — added `(rowClick)` Output to lib data-table + wired in consumer + updated handler to accept `event.row` shape. Live verified: clicking AccOwner2 row opens UserDetailsPage drilldown. BIZ-006 + GAP-BEH-001 now APPLIED. | **30%** | 45% | **27%** | 5% | **33%** | PENDING |
| 2026-05-14 15:00 | **Wave 19 first-bug fix (Ammar-led)** — restored Actions column + per-row kebab + dropdown. Fixed BUG-LIB-004 syncProps reset (root cause). Re-introduced `<falcon-angular-menu>` to data-table template with `[anchorEl]="hostEl"` to suppress trigger leak. Stencil .tsx adds "Actions" header text (+consumer JS fallback for cached bundle). | **37%** | **55%** | 27% | 5% | **45%** | PENDING |
| 2026-05-14 15:30 | **Wave 19 second-bug fix (Ammar-led)** — status badge now uses library `<falcon-angular-status-badge>` (was consumer-side); header buttons rewritten with `<falcon-angular-button size="sm">` (variant by role); top padding `pt-5 → pt-2`; view-toggle reduced; all hardcoded arbitrary values removed in favor of Falcon Tailwind utilities. | **42%** | **65%** | 27% | 5% | **52%** | PENDING |
| 2026-05-14 16:00 | **Wave 19 third-bug fix (Ammar-led)** — NEW shared component `<app-org-node-details-section>` with `<ng-template falconNodeDetailsActions>` projection slot. Replaces `<app-org-node-header>` (deleted from imports). Used in BOTH table view AND info-panel view. 3-mode flow wired: Default → Info-view → Info-edit with Cancel/Save. Added `infoEditMode` signal + `openInfoEdit/cancelInfoEdit/saveInfoEdit` methods to state service. Wired `[editable]` to signal. Added `hierarchy.actions.cancel/save` to en+ar. **All 3 modes verified live**: 17 editable input fields render in edit mode. | **47%** | **75%** | **40%** | 5% | **58%** | PENDING |

Headline numbers in the tables above are now the post-Wave-17.5 values.

## What needs to climb for the page to leave NEEDS-ATTENTION

To clear the < 60% flag on each dimension, the minimum work:

1. **UI/UX (25% → 60%)** — formally classify every UI/UX rule from HTML §1-23 as Applied / NotApplied / Applicable / NotApplicable in [`UI_UX_RULES.md`](UI_UX_RULES.md); run a live source-vs-destination diff per section.
2. **Business (10% → 60%)** — catalog every business flow (add-client, add-user, more-details, status-action) with its rules in [`BUSINESS_RULES.md`](BUSINESS_RULES.md).
3. **Validation (5% → 60%)** — catalog every required-field, OTP rule, phone/email verify rule, disabled-state rule in [`VALIDATION_RULES.md`](VALIDATION_RULES.md).
4. **Gaps (20% → 60%)** — resolve or mark-NotApplicable the 7 library gaps + 4 open items in [`GAP_REGISTRY.md`](GAP_REGISTRY.md); resolved/not-applicable count climbs the score.

See [`NEXT_ACTIONS.md`](NEXT_ACTIONS.md) for the prioritized work queue.

## How this scorecard changes

- **Per-component change** does NOT directly bump the page score. It logs in `CHANGE_HISTORY.md`.
- **Rule status changes** (`unknown` → `applied` or `not_applied`) move the dimension score per formula:
  ```
  dimension_score = applied / (applied + not_applied + applicable)  × 100
  (not_applicable rules are excluded from denominator)
  (unknown rules count partially via partial-applied bucket — see PAGE_RULE_REGISTRY.md)
  ```
- **Page approval trigger phrase** (e.g. "page approved, no comments on `org-hierarchy`") auto-promotes the component-level scores of every component listed in `COMPONENT_MAPPING.md` to 100%, BUT does NOT auto-set the page % to 100% — that requires all 4 dimensions to be at 100%.
