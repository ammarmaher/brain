# Component Mapping — Organization Hierarchy

> Maps every component this page renders to its entry in `FALCON_COMPONENT_REGISTRY.md`.

## Library components used (Falcon shared) — POST TABS NIGHT SHIFT 2026-05-14

| Component | Where used on this page | Score (from registry) | Notes |
|---|---|---|---|
| `<falcon-angular-data-table>` + `<falcon-table-tw>` | Users table (Hierarchy tab) **+ applications-table (CommChannels & Apps tabs — NEW Wave 5/6)** | 80% PASS | Now drives BOTH the hierarchy users table AND the applications-table; `[rowActions]` per-status menu working without BUG-004 regression |
| `FalconDataTableCellDirective` (`*falconDataTableCell`) | applications-table (7 cell templates) | NEW usage | Drives visibility/status/action/date/price cells |
| `FalconDataTableHeaderCellDirective` (`*falconDataTableHeaderCell`) | applications-table (4 wrap-two headers) | NEW usage | First Activation / Activation Date / Renew Date / Price Value |
| `<falcon-angular-paginator>` + `<falcon-paginator-tw>` | Inside `<app-falcon-custom-table-footer>` (users table) + applications-table built-in paginator | 60% PENDING | applications-table uses data-table built-in (not custom footer) |
| `<falcon-angular-tabs>` + `<falcon-tabs-tw>` | Tab strip + view-toggle slot **+ user-details 3-tab strip (NEW usage)** | 60% PENDING | per-tab actions slot working |
| `<falcon-tree-panel>` | Left sidebar 272px tree | 60% PENDING | Auto-scroll + scroll-reveal not yet implemented |
| `<falcon-angular-input>` | Info-panel edit-mode (12 text fields, NEW `(ngModelChange)`) + user-details 5 editable Personal fields | 80% NEW | Now wired with `(ngModelChange)` everywhere |
| `<falcon-angular-dropdown>` | Info-panel 5 select fields (Wave 7) + user-details status/role/permGroup (Wave 7b) | NEW usage | 8 dropdowns total |
| `<falcon-angular-switch>` | applications-table visibility column (Wave 5/6) | NEW usage | Replaces hand-rolled `<button role="switch">` |
| `<falcon-angular-status-badge>` | applications-table status column (Wave 5/6) | NEW usage | Replaces hand-rolled `<span>` chips |
| `<falcon-angular-calendar>` (new wrapper) | applications-table inline edit row (Wave 5/6) | NEW usage | Replaced legacy `<falcon-calendar>` |
| `<falcon-angular-empty-data>` | applications-table empty state (Wave 5/6) | NEW usage | Auto-mounted via `[emptyData]` config |
| `<falcon-angular-radio>` | settings-tab password security cards (Wave 8, 2 instances) + user-details checker matrix (Wave 7b, 6 instances) | NEW usage | 8 instances total |
| `<falcon-angular-tag>` | settings-tab IP chips (Wave 8) | NEW usage | `[dismissible]` + `(falconDismiss)` → opens confirm dialog |
| `<falcon-angular-input-number>` | settings-tab account limits (Wave 8, 3 instances) | NEW usage | `min=0 max=9999 step=1 integer=true` |
| `<falcon-angular-confirm-dialog>` | settings-tab IP delete confirmation (Wave 8) | NEW usage | severity=danger |
| `<falcon-photo-uploader>` | Info-panel edit-mode client picture (Wave 7) | NEW usage | Chosen over `<falcon-angular-single-uploader>` for circle preview |
| `<falcon-angular-otp>` | Add User wizard OTP step **+ user-details via `<app-otp-dialog>` (NEW Wave 7b)** | not in registry yet | `OtpMockService` enforces all-zeros-pass per Brain SK spec |
| `<falcon-angular-stepper>` | Add Client + Add User wizards | not in registry yet | Add to registry when wizard work resumes |
| `<falcon-angular-menu>` + `<falcon-menu-tw>` | applications-table data-table built-in **(NEW Wave 5/6 — BUG-004 mitigation HELD)** + tree-panel kebabs | 75% PENDING — mitigation verified | BUG-2026-05-14-004 fix at lines 96-100 of `falcon-menu.component.ts` held in tab-overflow context |

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
