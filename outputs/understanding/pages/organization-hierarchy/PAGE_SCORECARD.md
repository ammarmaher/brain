# Page Scorecard — Organization Hierarchy

**Last updated:** 2026-05-14
**Score basis:** Baseline + ingestion of 5 prior reports + live regression check today
**Approval state:** PENDING — awaits Ammar approval signal

---

## Headline

| Metric | Score | Trend |
|---|---|---|
| **Aggregated Page Understanding %** | **16%** | — (first seed) |

> Formula: `(UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)`

---

## Dimension breakdown (weighted)

| Dimension | Score | Weight | Weighted contribution | NEEDS-ATTENTION? |
|---|---|---|---|---|
| UI / UX | **25%** | 0.35 | 8.75 | YES (< 60%) |
| Business | **10%** | 0.25 | 2.50 | YES (< 60%) |
| Validation | **5%** | 0.20 | 1.00 | YES (< 60%) |
| Gaps Resolved | **20%** | 0.20 | 4.00 | YES (< 60%) |
| **Total** | | | **16.25%** | **page = NEEDS ATTENTION** |

Per skill rule: **any dimension below 60% triggers NEEDS-ATTENTION flag regardless of total**.

## Auxiliary scores (informational, do not roll into headline)

| Metric | Score | Notes |
|---|---|---|
| Source understanding % | **70%** | HTML source-of-truth deeply documented (1057-line ingest); React behavior partially mapped |
| Destination implementation % | **55%** | Many features built; live regression confirms current visual state; long tail of fidelity gaps |
| Visual parity % | **35%** | Wave 17 sweep was BLOCKED on browser; current implementation looks good per today's live check on Users table, BUT no formal sweep done across 12 sections |
| Business rule coverage % | **10%** | Few business rules explicitly documented |
| Validation coverage % | **5%** | Validation analysis effectively not done |
| Gap resolution % | **20%** | 7 library gaps queued, 4 open items, 23 lint inheritance items — handful resolved, most pending |
| Component reuse % | **80%** | Already reuses 6 Falcon library components + 2 page-local components |
| Test coverage % | **0%** | No automated tests for this page identified |

## Score history (page-level approval events)

| Date | Event | Page % | UI/UX | Business | Validation | Gaps | Approved? |
|---|---|---|---|---|---|---|---|
| 2026-05-14 | First seed (post-ingestion of 5 reports + live regression on Users table) | **16%** | 25% | 10% | 5% | 20% | PENDING |

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
