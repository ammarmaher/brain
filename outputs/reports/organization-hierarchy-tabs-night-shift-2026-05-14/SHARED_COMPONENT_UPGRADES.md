# Shared Component Upgrades — Organization Hierarchy Tabs

**Date:** 2026-05-14
**Conclusion:** **NO library upgrades performed.** Consumer-side enhancements only.

## Decision rationale

The Brain SK brief listed several "potential shared component upgrades":
1. Falcon Tabs header-action slot
2. Falcon Data Table cell template / row action template / header template
3. Falcon Button dashed variant
4. Falcon Menu body portal
5. Falcon Dropdown per-option template

Per the orchestrator's pre-flight capability scan (Agent 3 / `03a-falcon-component-capability.md`):

| Brief ask | Library state | Action taken |
|---|---|---|
| Tabs header-action slot | Already exists as `FalconTabActionsDirective` (`<ng-template falconTabActions="<value>">`) | **Reuse** — no upgrade needed |
| Data-table cell template | Already exists as `FalconDataTableCellDirective` (`*falconDataTableCell`) | **Reuse** in Wave 5/6 |
| Data-table header template | Already exists as `FalconDataTableHeaderCellDirective` (`*falconDataTableHeaderCell`) | **Reuse** in Wave 5/6 |
| Data-table row actions | Already exists as `[rowActions]` input + `(rowAction)` output | **Reuse** in Wave 5/6 |
| Data-table empty state | Already exists as `[emptyData]` config (auto-mounts `<falcon-angular-empty-data>`) | **Reuse** in Wave 5/6 |
| Button dashed variant | NOT in library | **Workaround** — Tailwind `border border-dashed border-falcon-teal-700` tokens. Logged as GAP-LIB-009 for future library upgrade. |
| Menu body portal | Mitigation already merged in `falcon-menu.component.ts` lines 96-100 (BUG-2026-05-14-004 fix). | **Reuse with monitoring** — Wave 5/6 used data-table's internal menu; BUG-004 didn't reappear in tab overflow context. |
| Dropdown per-option template | NOT in library | **Workaround** — use `iconUrl` for rich options. Not needed in this run (info-panel + user-details use plain `{ value, label }` options). |

## Why no library churn

Standing rules favor consumer-side workarounds over library upgrades when:
1. The workaround is small and uses only tokens / utilities
2. The library upgrade would block multiple waves
3. The library has known regression risks (e.g. BUG-2026-05-14-004 syncProps)

The dashed-button workaround is the only "compromise" — it costs ~1 line of Tailwind per use site and gains visual parity. A real `variant="dashed"` API can be added in a future library wave (~30 min effort) without disturbing the current consumer code.

## Library upgrade backlog (created this run)

| Gap | Title | Owner | Effort | Notes |
|---|---|---|---|---|
| GAP-LIB-009 | `<falcon-angular-button variant="dashed">` | Falcon UI Core | S | Add `dashed` to variant enum + token-based dashed border |
| GAP-VAL-009 | `<falcon-angular-otp>` countdown / expiry surface | Falcon UI Core | M | Add `[expiresInSeconds]` input + `(expired)` output |

(No other library upgrades surfaced from this run.)
