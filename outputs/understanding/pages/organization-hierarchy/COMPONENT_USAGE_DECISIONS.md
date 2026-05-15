*** Component Usage Decisions — organization-hierarchy ***
*** Per-section Falcon component decisions. Mirrors customization order. ***

# Component Usage Decisions

For every section, record the chosen Falcon component path and which customization step was used. Customization order:

1. Existing Falcon component as-is
2. Use existing inputs
3. Add `ng-template` / slots
4. Add new variant
5. Upgrade the Falcon library component
6. Build a new library component
7. Build an app-level wrapper
8. Raw HTML — flagged as GAP

| section | chosenComponent | customizationStep | decisionStatus | sourceLearningId |
|---|---|---|---|---|
| tables (multi-section) | `<falcon-data-table>` | 3 (`ng-template` for toggle/action/dropdown/input/status) | pending | LE-20260515-organization-hierarchy-001 |
| comm-channels-tab — scheduled-change edit row | `<falcon-angular-data-table>` shadow rows API (`[shadowRows]` + `<ng-template falconDataTableShadow>`) | 3 (`ng-template` projection) + lib upgrade Wave 20 (`falcon-data-table` shadow rows feature shipped) | applied (Wave 20, 2026-05-15) | LE-20260515-commchannels-shadow-row-notch-alignment |
| apps-services-tab — scheduled-change edit row | `<falcon-angular-data-table>` shadow rows API (same as CommChannels — single shared `applications-table` component) | 3 (`ng-template` projection) | applied (Wave 20, 2026-05-15) | LE-20260515-commchannels-shadow-row-notch-alignment |
| management-console comm-channels-tab — table | `<falcon-angular-data-table>` (apps/management-console/.../applications-table) — mirrors admin-console twin. Visibility → `<falcon-angular-switch>`, Status → `<falcon-angular-status-badge>`, Inline edit → `<app-falcon-table-edit-row>` via `slot="row-expansion"`, Empty → `[emptyData]`. Scheduled changes wired via `[shadowRows]` + `<ng-template falconDataTableShadow>`. | 3 (`ng-template` projection) + 7 (app-level `<app-falcon-table-edit-row>` wrapper duplicated into mgmt-console) | applied (Wave 22C, 2026-05-15) | FDT-SHADOW-FU-07 |
| management-console apps-services-tab — table | Same shared `<app-applications-table>` as comm-channels — single mgmt-console wrapper backs both tabs (parity with admin-console pattern). | 3 (`ng-template` projection) | applied (Wave 22C, 2026-05-15) | FDT-SHADOW-FU-07 |
| org-info-panel | _undecided_ | — | open | — |
| org-info-audit-mode | _undecided_ | — | open | — |
| org-info-rule-status | _undecided_ | — | open | — |
| org-info-permission-privilege | _undecided_ | — | open | — |
| settings-tab-view-mode | _undecided_ | — | open | — |
| settings-tab-edit-mode | _undecided_ | — | open | — |
| settings-ip-management | _undecided_ | — | open | — |
| settings-account-limitation | _undecided_ | — | open | — |
| otp-popup | _undecided_ | — | open | — |

Sections without a decision do not count toward the **Component Usage** dimension on `PAGE_SCORECARD.md`.
