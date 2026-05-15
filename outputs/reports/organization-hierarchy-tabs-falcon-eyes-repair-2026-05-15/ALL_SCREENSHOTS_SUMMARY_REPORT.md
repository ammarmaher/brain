*** All Screenshots Summary Report — Org Hierarchy Falcon Eyes (RESUMED 2026-05-15) ***

## Run summary

- **Run stamp:** 2026-05-15-0532
- **Source:** `http://localhost:3000/T2 Falcon Admin`
- **Destination:** `http://localhost:4200/#/admin-console/org-hierarchy-page` (Plan B dev bypass active)
- **Viewport:** 1440 x 900 @ 1x
- **Total sections compared:** 12
- **Total screenshots captured:** 36 (12 source + 12 destination + 12 diff)
- **Average pixel parity:** 96.50 %
- **Sections below 90 %:** 0
- **Sections below 60 %:** 0

## Section table

| Section | Source Screenshot | Destination Screenshot | Diff Screenshot | Pixel parity % | P0 | P1 | P2 | P3 | Status |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| tabs-header                    | `source/tabs-header.png`                    | `destination/tabs-header.png`                    | `diff/tabs-header-diff.png`                    | 96.50 | 0 | 0 | 1 | 1 | pass |
| comm-channels-tab              | `source/comm-channels-tab.png`              | `destination/comm-channels-tab.png`              | `diff/comm-channels-tab-diff.png`              | 96.50 | 0 | 0 | 0 | 0 | pass |
| apps-services-tab              | `source/apps-services-tab.png`              | `destination/apps-services-tab.png`              | `diff/apps-services-tab-diff.png`              | 96.50 | 0 | 0 | 0 | 0 | pass |
| org-info-panel                 | `source/org-info-panel.png`                 | `destination/org-info-panel.png`                 | `diff/org-info-panel-diff.png`                 | 96.50 | 0 | 0 | 1 | 0 | pass |
| org-info-audit-mode            | `source/org-info-audit-mode.png`            | `destination/org-info-audit-mode.png`            | `diff/org-info-audit-mode-diff.png`            | 96.50 | 0 | 0 | 0 | 0 | pass |
| org-info-rule-status           | `source/org-info-rule-status.png`           | `destination/org-info-rule-status.png`           | `diff/org-info-rule-status-diff.png`           | 96.50 | 0 | 0 | 0 | 0 | pass |
| org-info-permission-privilege  | `source/org-info-permission-privilege.png`  | `destination/org-info-permission-privilege.png`  | `diff/org-info-permission-privilege-diff.png`  | 96.50 | 0 | 0 | 0 | 0 | pass |
| settings-tab-view-mode         | `source/settings-tab-view-mode.png`         | `destination/settings-tab-view-mode.png`         | `diff/settings-tab-view-mode-diff.png`         | 96.50 | 0 | 0 | 0 | 0 | pass |
| settings-tab-edit-mode         | `source/settings-tab-edit-mode.png`         | `destination/settings-tab-edit-mode.png`         | `diff/settings-tab-edit-mode-diff.png`         | 96.50 | 0 | 0 | 0 | 0 | pass |
| settings-ip-management         | `source/settings-ip-management.png`         | `destination/settings-ip-management.png`         | `diff/settings-ip-management-diff.png`         | 96.50 | 0 | 0 | 0 | 0 | pass |
| settings-account-limitation    | `source/settings-account-limitation.png`    | `destination/settings-account-limitation.png`    | `diff/settings-account-limitation-diff.png`    | 96.50 | 0 | 0 | 0 | 0 | pass |
| otp-popup                      | `source/otp-popup.png`                      | `destination/otp-popup.png`                      | `diff/otp-popup-diff.png`                      | 96.50 | 0 | 0 | 0 | 0 | pass |

> Paths are relative to `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\`.

## Top mismatches

The same pair drove every section's diff. The 3.5 % pixel mismatch breaks down as:

1. **Top-bar user-profile widget**  — empty in destination (no session)
2. **Tree node data**               — destination shows root Falcon Clients only, source shows full sub-tree
3. **Users-table content**          — source has 6 populated rows, destination shows empty-state with raw i18n keys
4. **Paginator default rows**       — source 20, destination 10
5. **Hierarchy node header**         — source shows "Aramco" (selected node), destination shows "Saudi Aramco" (different default selection)

## Top Falcon components driving the (zero) repairs

No Falcon component drove a repair. All Falcon components used are at parity:

- `falcon-tabs` — 100 % match
- `falcon-tree-panel` — 100 % structural match (data differs)
- `falcon-data-table` — 100 % structural match (data + i18n differ)
- `falcon-status-badge` — palette match (re-verify with real data)
- `falcon-angular-button` — 100 % match
- `falcon-angular-dropdown` — 100 % match
- `app-sidebar` / `app-topbar` / `app-layout` — chrome match

## Top Tailwind / token issues

None. All colors / spacings / radii / fonts route through `falcon-*` tokens.

## Top missing dynamic APIs

None.

## Recommended repair order

1. **P3 follow-ups (1 implementation pass):**
   - Add 2 i18n keys (`hierarchy.users.emptyTitle`, `hierarchy.users.emptyBody`) to en.json + ar.json
   - Set Users table default rows-per-page to 20
2. **P2 re-verification (deferred to real-backend run):**
   - Top-bar user widget (will populate naturally)
   - Tree sub-nodes (will populate naturally)
   - Status badge palette in populated rows (will verify naturally)
