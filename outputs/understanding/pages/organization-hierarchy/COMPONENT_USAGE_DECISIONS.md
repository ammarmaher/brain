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
| comm-channels-tab | _undecided_ | — | open | — |
| apps-services-tab | _undecided_ | — | open | — |
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
