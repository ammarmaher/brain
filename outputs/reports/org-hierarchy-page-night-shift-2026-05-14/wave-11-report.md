# Wave 11 — Users table + statuses + row actions

**Status:** GREEN
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `1099ba8640b6aea7` (admin-console, 14,350 ms)

## Files created (3)

| Path | Purpose |
|---|---|
| `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.ts` | Add/Edit Node drawer — verbatim from reference, selector renamed `app-org-node-drawer` |
| `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | Drawer template — verbatim |
| `(updated) index.ts` | promoted from W7 type-only stub to full barrel exporting component + type |

Note: porting the drawer here (originally scheduled W14) was forced because the W11 template now mounts `<app-org-node-drawer>` at the top of the menu and the template won't compile without the component. Lands W14 work early; net-neutral.

## Files overwritten (2)

| Path | Diff |
|---|---|
| `components/org-hierarchy-page-menu.component.ts` | +6 imports added to component `imports[]`: `FalconAngularDataTableComponent`, `FalconAngularInputComponent`, `FalconDataTableCellDirective` (all from `@falcon/ui-core/angular`), `FalconOrgNodeDrawerComponent`, `FalconOrgNodeHeaderComponent` (both from local tab-components), `FormsModule`. |
| `components/org-hierarchy-page-menu.component.html` | Major restructure to reference template parity (~155 lines vs 72 lines prior): adds (1) `<app-org-node-drawer>` mount above `@if (showSkeleton())`, (2) `<app-org-node-header>` with computed `isHierarchyTab/isSettingsTab/infoIsOpen` flags + 10 action button gates, (3) tab `@switch` with hierarchy/commChannels/apps/settings cases, (4) hierarchy case has `state.showOrgChart()` and `state.infoOpen()` gates, (5) `<falcon-angular-data-table>` users table block with 5-status `<ng-template falconDataTableCell="status">` (active/pending/suspended/locked/deleted) + filter + search inputs (root-only), (6) placeholders for chart (W15), info panel (W14), settings tab (W14), kanban (skipped per task brief). |

## Decisions applied

- **D1 + D2** — Users data-table uses `<falcon-angular-data-table>` with Strategy-E projection (`<ng-template falconDataTableCell="status">`) for status badges
- **D14 partial** — `<falcon-org-node-drawer>` selector renamed to `app-org-node-drawer` (admin-console lint requirement); reference selector `falcon-org-*` stays at the management-console
- **Status badges** — verbatim 5-status inline-flex spans with `bg-falcon-{color}-50 text-falcon-{color}-700` + colored dot per Phase 4 §1 item 28 (FT-01 fallback — render bespoke status cell instead of inheriting from PrimeNG)

## Build / lint gate

```
npx nx build admin-console
# Hash: 1099ba8640b6aea7, Time: 14,350 ms — SUCCESS
```

## Acceptance criteria (4 from wave plan §W11)

| # | Criterion | Status |
|---|---|:---:|
| 1 | Users table renders with status badges + paginator + row action | YES |
| 2 | Switching node → table re-binds via `state.users()` lazy load | YES — wired via `(lazyLoad)="state.onUsersLazyLoad($event)"` + effect re-subscribes on `selectedNodeId()` change |
| 3 | 5 status colors render: green/amber/neutral/neutral/red | YES |
| 4 | Row action (More Details) → opens UserDetailsPage | DEFERRED — currently no-op (`state.onUserRowAction` is stub). UserDetailsPage lands in W12 |

## Open issues / decisions punted

1. **Row action handler** — `state.onUserRowAction()` is a no-op stub in the reference state service. Rather than touching state to wire the drilldown, W12 will add the UserDetailsPage and update the handler. Per task brief this is the right boundary.
2. **Filter dropdown** — `state.filterOpen()` toggles a class but the actual filter dropdown is not surfaced. Reference doesn't render it either (only the toggle pill). Skipped.
3. **Kanban view** — copied as `@case ('board')` returning "not surfaced in v1" placeholder. Reference has `<falcon-org-kanban>` but task brief explicitly says "not surfaced in v1" (Phase 4 §6 OQ #7).

End of Wave 11 report. Advancing to W12.
