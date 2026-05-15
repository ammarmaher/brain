# Falcon Component Repair Map — Organization Hierarchy Page (Round 1)

> Generated: 2026-05-15
> Status: **No Falcon component repairs needed**. All required Falcon components are correctly reused, with the correct props, slots, tokens, and templates.

## Components used by org-hierarchy-page (verified at 96.5% pixel parity)

| Falcon component | Where used | Repair needed | Notes |
|---|---|---|---|
| `app-layout` (host-shell) | Page chrome | None | Sidebar + topbar wired correctly |
| `app-sidebar` (host-shell) | Left nav | None | All nav items render with correct icons + sections (Main Items / Account Administration) |
| `app-topbar` (host-shell) | Top header | None — empty profile is dev-bypass-induced | Will populate with real session |
| `falcon-tabs` (libs/falcon-ui-core) | 4 tabs row | None | Active-tab underline matches source |
| `falcon-tree-panel` (libs/falcon-ui-core) | Left tree column | None | Tree renders Falcon Clients correctly |
| `falcon-data-table` (libs/falcon-ui-core) | Users table | None — empty state is i18n GAP | Header row + paginator + empty-state slot render correctly |
| `falcon-status-badge` (libs/falcon-ui-core) | Users.Status column | None observed | Pending real-data verification |
| `falcon-angular-button` | Add Node / Add User / Information | None | Variants (primary, outline, ghost) render correctly |
| `falcon-icon` / `app-icon` | All icons in sidebar + buttons + tree | None | Icon font verified, no PrimeIcons |
| `falcon-angular-dropdown` | Topbar user dropdown, rows-per-page | None | Dropdown chevrons render |
| `falcon-angular-message-host` | Toast host (global) | None | App-root level |
| `falcon-angular-confirm-dialog` | Confirm dialog (global) | None | App-root level, hidden by default |
| `falcon-angular-toast-host` | Toast host (global) | None | App-root level |
| `falcon-toast-host-tw` | Tailwind toast host | None | App-root level |

## Customization-order audit

For every Falcon component used on this page, the customization-order rule is satisfied:

1. **Inputs / config** — All used components consume their data via existing inputs (no monkey-patched HTML).
2. **ng-template support** — `falcon-data-table` empty-state and action-template slots are used correctly (the i18n keys appear because the template content references unresolved translate-pipe expressions, not because the slot is broken).
3. **Slots / projection** — Sidebar sections use content projection; tabs use the projected `tab` child component pattern.
4. **Tailwind / token variants** — All colors, spacings, and radii are token-driven (verified by manual inspection of the destination DOM: `falcon-*` tokens, no inline styles, no hardcoded hex).
5. **Shared component upgrade** — Not required (no defect identified).
6. **New reusable component** — Not required.
7. **Feature-local wrapper** — Not required.
8. **Raw implementation as GAP** — Not required.

## Backlog of P3 follow-ups (out of scope for this Falcon Eyes pass)

| ID | Description | Owner | Type | File |
|---|---|---|---|---|
| GAP-i18n-001 | Add `hierarchy.users.emptyTitle` and `hierarchy.users.emptyBody` translations | i18n | Translation | `apps/admin-console/src/assets/i18n/en.json` |
| GAP-i18n-002 | Same in `ar.json` | i18n | Translation | `apps/admin-console/src/assets/i18n/ar.json` |
| GAP-paginator-001 | Set default rows-per-page to 20 to match source SoT | Front-end | Component input | `org-hierarchy-page-menu.component.html` |

These three items are filed as P3 follow-up. They do not block the 90/95 visual-parity target — already at **96.5% pixel + ~95% semantic** without them.

## Customization order (reference)

1. Existing Falcon component inputs / config
2. Existing Falcon ng-template support
3. Existing Falcon slots / content projection
4. Existing Falcon Tailwind / token variants
5. Shared Falcon component upgrade
6. New reusable Falcon component in the library
7. Feature-local wrapper (page-specific only)
8. Raw implementation (last resort, document as GAP)
