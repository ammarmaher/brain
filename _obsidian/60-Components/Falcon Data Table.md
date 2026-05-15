*** Component note — Falcon Data Table ***
*** Vault file: 60-Components/Falcon Data Table.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-angular-data-table\ ***
*** Updated 2026-05-15 ***

# Falcon Data Table

> Navigation note. Brain Outputs holds the dossier (API / USAGE / TOKENS / GAPS / DECISION). This note holds the graph.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-angular-data-table/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-angular-data-table/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-angular-data-table/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-angular-data-table/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-angular-data-table/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-angular-data-table/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — multi-section (comm-channels, apps-services, rule-status, permission-privilege, ip-management, account-limitation). PP-001 mandate pending. **Wave 20 shadow-rows feature applied** to `comm-channels-tab` + `apps-services-tab` scheduled-change edit rows.

## Learning events touching this component

- [[LE-20260515-commchannels-shadow-row-notch-alignment]] — **approved** Wave 20. Notch-alignment bug → 5 UI/UX rules (UIUX-SHADOW-001..005) + 8 follow-ups (FDT-SHADOW-FU-01..08).

## Approved + pending patterns

- **Approved (page-level, organization-hierarchy):** 5 shadow-row rules in [UI_UX_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) — `UIUX-SHADOW-001` library shadow-row API mandate · `UIUX-SHADOW-002` library-owned notch alignment · `UIUX-SHADOW-003` token surface for shadow visuals · `UIUX-SHADOW-004` library-owned default actions · `UIUX-SHADOW-005` multi-shadow per parent row support.
- Pending: **PP-001** in [PENDING_PAGE_PATTERNS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PENDING_PAGE_PATTERNS.md) — Falcon Data Table mandate with `ng-template` cells.
- Global target: [TABLE_PATTERN.md](../../outputs/understanding/frontend/patterns/TABLE_PATTERN.md) (seed; PP-001 candidate inbound).

## Wave 20 shadow-rows feature — quick reference

- Lib API: `[shadowRows]` + `[(expandedShadowRowIds)]` + `[(shadowRowModes)]` + `<ng-template falconDataTableShadow>` + `<ng-template falconDataTableShadowActions>`.
- Notch alignment is library-owned via `ShadowRow.targetColumn = '<columnField>'`. Consumers choose the target column, never the x-offset.
- Tokens (9): `--falcon-data-table-shadow-bg`, `-divider`, `-padding`, `-arrow-color`, `-arrow-size`, `-arrow-z`, `-chevron-color`, `-transition-duration`, plus paired colour variants.
- Open follow-ups: `FDT-SHADOW-FU-01..08` — see [GAPS_AND_UPGRADES.md](../../outputs/understanding/frontend/components/falcon-data-table/GAPS_AND_UPGRADES.md).

## Related gaps

- [GAP_REGISTRY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md) — `GAP-COMMCHANNELS-NOTCH-001` closed Wave 20.
- [GAPS_AND_UPGRADES.md](../../outputs/understanding/frontend/components/falcon-data-table/GAPS_AND_UPGRADES.md) — 8 open shadow-row follow-ups.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-data-table` per run.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]]
