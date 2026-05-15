*** Architecture Rule Set — Component Usage Matrix ***
*** SoT: Brain Outputs/understanding/frontend/architecture/COMPONENT_USAGE_MATRIX.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Component Usage Matrix

> ripgrep-driven inventory of every Falcon Angular wrapper's real-feature consumer count across the 3 apps. Of 49 Stencil-backed Angular wrappers, only **13** have real-feature consumers; 24 are lab-only (playground/showcase); 12 are completely unused. This is the Brain SK readiness map for the next wave of consumer migrations.

## Source-of-truth file
- [COMPONENT_USAGE_MATRIX](../../outputs/understanding/frontend/architecture/COMPONENT_USAGE_MATRIX.md)

## Key data points extracted

| Rule id | Statement (data-driven) | Severity | Source |
|---|---|---|---|
| AR-usage-01 | Of 49 Stencil-backed Angular wrappers, only 13 have real-feature consumers; 24 are lab-only; 12 are truly unused. | informational | full grep table |
| AR-usage-02 | Real-feature consumers (13): button, confirm-dialog, data-table, drawer, dropdown, input, multi-select, otp, password, radio-group, search-input, tabs, popup. | informational | feature-file grep |
| AR-usage-03 | Truly unused (13): avatar, badge, card, combobox, empty-state, filter-panel, grid-input, icon, input-number, menu, select, status-badge, tag, wizard. | informational | zero-match grep |
| AR-usage-04 | Legacy bespoke heavy-use: `<falcon-form-field>` 131 occurrences × 11 files (admin + mgmt wizards); `<falcon-stepper>` 4 wizard hosts (PrimeNG-shaped). Both candidates for migration. | high | file-count grep |
| AR-usage-05 | `<falcon-angular-toast>` and `<falcon-angular-dialog>` are explicitly DEPRECATED — prefer `<falcon-angular-notification>` and `<falcon-angular-popup>`. | high | `@deprecated` annotation in `shared-ui/index.ts` |
| AR-usage-06 | `<falcon-stepper>` (legacy) → `<falcon-angular-stepper>` is the highest-impact migration — 4 wizard hosts to convert simultaneously. | high | wizard host grep |

## Forbidden patterns
- Adding new feature code that consumes `<falcon-angular-dialog>` (deprecated — use popup).
- Adding new feature code that consumes `<falcon-angular-toast>` (deprecated — use notification).
- Hand-rolling status spans / pills when `<falcon-angular-status-badge>` or `<falcon-angular-tag>` exists.
- Hand-rolling avatar `<div>` initials when `<falcon-angular-avatar>` exists.

## Recommended migrations (priority order)
1. `<falcon-stepper>` legacy → `<falcon-angular-stepper>` (4 wizard hosts).
2. `<falcon-mobile-number>` → `<falcon-angular-phone-field>` (5 files).
3. `<falcon-photo-uploader>` → `<falcon-angular-single-uploader>` (6 wizard step files).
4. Inline SVG icons → `<falcon-angular-icon>` (topbar/sidebar across all apps).
5. Hand-rolled status pills → `<falcon-angular-status-badge>` / `<falcon-angular-tag>`.

## Cross-cutting components
- `FalconMessageService` (TS service singleton) — DI'd by interceptors + feature components; drop-in PrimeNG `MessageService` replacement.
- `FalconAccess` registry — used by `app.config.ts` factory + multiple guards.

## Related component notes
- [[Falcon Data Table]] · [[Falcon Drawer]] · [[Falcon Dropdown]] · [[Falcon Input]] · [[Falcon Button]] · [[Falcon Tabs]] · [[Falcon Search Input]] · [[Falcon Popup]] · [[Falcon Stepper]] · [[Falcon Stepper Legacy]] · [[Falcon Mobile Number]] · [[Falcon Phone Field]] · [[Falcon Toast]] · [[Falcon Dialog]] · [[Falcon Notification]] · [[Falcon Status Badge]] · [[Falcon Tag]] · [[Falcon Avatar]] · [[Falcon Icon]]

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
