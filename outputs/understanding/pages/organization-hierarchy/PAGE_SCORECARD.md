# Page Scorecard — Organization Hierarchy

**Last updated:** 2026-05-14 (post Wave 17.5)
**Score basis:** Baseline + ingestion of 5 prior reports + Wave 17.5 visual parity sweep (12 sections)
**Approval state:** PENDING — baseline approved 2026-05-14; Wave 17.5 update pending Ammar approval

---

## Headline

| Metric | Score | Trend |
|---|---|---|
| **Aggregated Page Understanding %** | **23%** | ↑ +7 (vs baseline 16%) |

> Formula: `(UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)`

---

## Dimension breakdown (weighted)

| Dimension | Score | Trend | Weight | Weighted contribution | NEEDS-ATTENTION? |
|---|---|---|---|---|---|
| UI / UX | **40%** | ↑ +15 | 0.35 | 14.00 | YES (< 60%) |
| Business | **10%** | — | 0.25 | 2.50 | YES (< 60%) |
| Validation | **5%** | — | 0.20 | 1.00 | YES (< 60%) |
| Gaps Resolved | **25%** | ↑ +5 | 0.20 | 5.00 | YES (< 60%) |
| **Total** | | | | **22.50%** | **page = NEEDS ATTENTION** |

Per skill rule: **any dimension below 60% triggers NEEDS-ATTENTION flag regardless of total**.

## Auxiliary scores (informational, do not roll into headline)

| Metric | Score | Trend | Notes |
|---|---|---|---|
| Source understanding % | **80%** | ↑ +10 | Live HTML vs Angular comparison adds verification confidence (Wave 17.5) |
| Destination implementation % | **55%** | — | Unchanged — sweep was measurement only |
| Visual parity % | **52%** | ↑ +17 | 12 sections measured in Wave 17.5 |
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
