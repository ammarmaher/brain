---
type: hub
hub: pages
created: 2026-05-15
---
*** Falcon Page Registries Index — page-level knowledge ***
*** Created 2026-05-14 by Brain SK page-knowledge workflow ***

# Falcon Page Registries

> **Canonical source:** `C:\Falcon\Brain Outputs\understanding\pages\`
> Each page entry is a folder with 14 MD files + `_scan-state\page-scan-metadata.json`.
> Scoring formula: `(UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)`.
> NEEDS-ATTENTION rule: any dimension below 60% triggers the flag regardless of total.
> Companion notes: [[FALCON_COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[AMMAR_BRAIN_HOME]].

## Pages tracked

| Page | Status | Page % | UI/UX | Business | Validation | Gaps Resolved | Last updated |
|---|---|---|---|---|---|---|---|
| [organization-hierarchy](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md) | baseline APPROVED + Wave 17.5 PENDING — NEEDS ATTENTION | **23%** ↑ | **40%** ↑ | 10% | 5% | **25%** ↑ | 2026-05-14 (post Wave 17.5) |

## Latest baseline — `organization-hierarchy` (2026-05-14)

- [PAGE_OVERVIEW](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md)
- [SOURCE_OF_TRUTH](../../Brain%20Outputs/understanding/pages/organization-hierarchy/SOURCE_OF_TRUTH.md)
- [PAGE_RULE_REGISTRY](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_RULE_REGISTRY.md)
- [UI_UX_RULES](../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) — 32 rules
- [BUSINESS_RULES](../../Brain%20Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md) — 14 rules
- [VALIDATION_RULES](../../Brain%20Outputs/understanding/pages/organization-hierarchy/VALIDATION_RULES.md) — 9 rules
- [GAP_REGISTRY](../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md) — 14 gaps
- [SOURCE_DESTINATION_COMPARISON](../../Brain%20Outputs/understanding/pages/organization-hierarchy/SOURCE_DESTINATION_COMPARISON.md)
- [COMPONENT_MAPPING](../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_MAPPING.md)
- [VISUAL_PARITY_SCORECARD](../../Brain%20Outputs/understanding/pages/organization-hierarchy/VISUAL_PARITY_SCORECARD.md) — 35% aggregate
- [IMPLEMENTATION_SCORECARD](../../Brain%20Outputs/understanding/pages/organization-hierarchy/IMPLEMENTATION_SCORECARD.md) — 55% aggregate
- [PAGE_SCORECARD](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_SCORECARD.md)
- [CHANGE_HISTORY](../../Brain%20Outputs/understanding/pages/organization-hierarchy/CHANGE_HISTORY.md)
- [NEXT_ACTIONS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/NEXT_ACTIONS.md)
- [page-scan-metadata.json](../../Brain%20Outputs/understanding/pages/organization-hierarchy/_scan-state/page-scan-metadata.json)

### Related registries

- [FALCON_COMPONENT_REGISTRY](../registries/FALCON_COMPONENT_REGISTRY.md) — 7 components linked to org-hierarchy
- [FALCON_UI_BUGS_AND_QUIRKS](../registries/FALCON_UI_BUGS_AND_QUIRKS.md) — 9 known bugs catalogued
- [component-capability-upgrade SKILL](../skills/component-capability-upgrade/SKILL.md) — workflow definition

### Related session report

- [falcon-ui-library-learnings / 2026-05-14-org-hierarchy-data-table / index](../../Brain%20Outputs/reports/falcon-ui-library-learnings/2026-05-14-org-hierarchy-data-table/index.md)

## NEEDS-ATTENTION queue

These pages are below the 60% threshold on at least one dimension and need attention:

- **organization-hierarchy** — all 4 dimensions below 60% (this is the seed baseline; expected to climb after Wave 17 visual parity sweep)

## Workflow

Page registries are maintained by the [component-capability-upgrade](../skills/component-capability-upgrade/SKILL.md) skill (page-level layer). On every change touching a page-mapped component:
1. Read the page registry + bugs catalog first.
2. Implement + verify live.
3. Update rule status + recompute dimension scores.
4. Append to CHANGE_HISTORY.md.
5. WAIT for Ammar approval trigger phrase.
6. On approval → promote PENDING → APPROVED, mirror to `Brain SK\outputs\`, git push.

## Tags

#type/index
