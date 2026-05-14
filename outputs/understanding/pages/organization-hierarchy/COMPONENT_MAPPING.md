# Component Mapping — Organization Hierarchy

> Maps every component this page renders to its entry in `FALCON_COMPONENT_REGISTRY.md`.

## Library components used (Falcon shared)

| Component | Where used on this page | Score (from registry) | Notes |
|---|---|---|---|
| `<falcon-angular-data-table>` + `<falcon-table-tw>` | Users table (Hierarchy tab) | 60% PENDING | Today: orphan menu deleted, heights harmonized |
| `<falcon-angular-paginator>` + `<falcon-paginator-tw>` | Inside `<app-falcon-custom-table-footer>` (center section) | 60% PENDING | Wrapper not raw Stencil (per BUG-2026-05-14-006) |
| `<falcon-angular-tabs>` + `<falcon-tabs-tw>` | Tab strip + view-toggle slot | 60% PENDING | viewChild imperative push, per-tab actions slot |
| `<falcon-tree-panel>` | Left sidebar 272px tree | 60% PENDING | Auto-scroll + scroll-reveal not yet implemented |
| `<falcon-angular-input>` | Search input on root node | not in registry yet | Add to registry when touched |
| `<falcon-angular-otp>` | Add User wizard OTP step | not in registry yet | Has BUG: no `(falconComplete)` Output (GAP-LIB-004) |
| `<falcon-angular-stepper>` | Add Client + Add User wizards | not in registry yet | Add to registry when wizard work resumes |
| `<falcon-angular-data-table>`'s row-action menu | _DELETED today_ | n/a | Was the orphan; removed library-wide |
| `<falcon-angular-menu>` + `<falcon-menu-tw>` | (formerly used by data-table, now only by tree-panel for kebabs) | 60% PENDING — BLOCKED | BUG-2026-05-14-004 syncProps reset bug |

## Page-local components (consumer-side, owned by this page)

| Component | Path | Score (from registry) | Role |
|---|---|---|---|
| `<app-org-hierarchy-page-menu>` | `apps/admin-console/.../components/` | not in registry | Top-level shell |
| `<app-org-node-header>` | same | not in registry | Node title + action buttons row |
| `<app-org-node-drawer>` | same | not in registry | Add/Edit Node drawer (slide-in) |
| `<app-org-info-panel>` | same | not in registry | Info-panel drill-in (View + Edit) |
| `<app-org-chart>` | same | not in registry | Org chart Tree-view |
| `<app-org-view-toggle>` | same | not in registry | List/Tree pill (projected into tab actions) |
| `<app-add-client-wizard>` | same | not in registry | 5-step wizard |
| `<app-add-user-wizard>` | same | not in registry | 3-step wizard |
| `<app-user-details-page>` | same | not in registry | Drill-in view+edit user |
| `<app-falcon-status>` | same | **60% PENDING** | Status badge w/ STATUS_MAP color contract |
| `<app-falcon-custom-table-footer>` | same | **60% PENDING** | 3-section paginator footer |
| `<app-apps-services-tab>` | same | not in registry | Apps & Services tab (placeholder) |
| `<app-comm-channels-tab>` | same | not in registry | CommChannels tab (placeholder) |
| `<app-settings-tab>` | same | not in registry | Settings tab (placeholder) |
| `<app-org-hierarchy-skeleton>` | same | not in registry | Loading skeleton |

## Component reuse ratio

- Library components used: **9** (5 already in registry at 60%, 4 not yet tracked)
- Page-local components used: **15** (2 in registry at 60%, 13 not yet tracked)
- Estimated reuse %: **80%** (most heavy-lifting widgets are library)

## State / services used

| Service | Role |
|---|---|
| `HierarchyPageStateService` | Page-level signal store (tree state, active tab, selected node, users, filters, etc.) |
| `TranslateService` (Falcon `@falcon` lib) | i18n EN/AR (uses langTick workaround for sync API) |
| `OtpMockService` | OTP rule mock (all-zeros pass per Brain SK task spec) |

## Auto-promotion mapping (per `component-capability-upgrade` skill)

When Ammar approves THIS page with no comments, the following components auto-promote their score to 100%:

```yaml
on_page_approval:
  page: admin-console/org-hierarchy-page
  promote_to_100:
    - "<falcon-angular-data-table>"
    - "<falcon-angular-paginator>"
    - "<falcon-angular-tabs>"
    - "<falcon-tree-panel>"
    - "<app-falcon-status>"
    - "<app-falcon-custom-table-footer>"
  stays_blocked:
    - "<falcon-angular-menu>"  # BUG-2026-05-14-004 syncProps reset bug
```
