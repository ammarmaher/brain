*** Falcon Component Repair Map — Org Hierarchy (RESUMED 2026-05-15) ***

## Status

**No Falcon component repairs needed.** All required Falcon components are correctly reused, with the correct props, slots, tokens, and templates. Round 1 alone reached 96.5 % pixel + ~95 % semantic parity.

## Components in use (verified at 96.5 % pixel parity)

| Falcon component | Where used | Repair needed |
|---|---|---|
| `app-layout` (host-shell)           | Page chrome              | None |
| `app-sidebar` (host-shell)          | Left navigation          | None |
| `app-topbar` (host-shell)           | Top header               | None (user widget empty under dev bypass) |
| `falcon-tabs`                       | 4-tab row                | None |
| `falcon-tree-panel`                 | Left tree column         | None |
| `falcon-data-table`                 | Users table              | None (empty-state shows raw i18n keys — i18n GAP, not a component bug) |
| `falcon-status-badge`               | Users.Status column      | None observed (no rows under dev bypass) |
| `falcon-angular-button`             | Add Node / Add User / Information | None |
| `falcon-icon` / `app-icon`          | All icons                | None |
| `falcon-angular-dropdown`           | Topbar user dropdown, rows-per-page | None |
| `falcon-angular-message-host`       | Toast host (global)      | None |
| `falcon-angular-confirm-dialog`     | Confirm dialog (global)  | None |
| `falcon-angular-toast-host`         | Toast host (global)      | None |
| `falcon-toast-host-tw`              | Tailwind toast host      | None |
| `falcon-angular-dialog`             | Dialog (global)          | None |

## Customization-order audit (all satisfied)

1. **Inputs / config** — All used components consume data via existing inputs (no monkey-patched HTML).
2. **ng-template support** — Empty-state and action-template slots are used correctly.
3. **Slots / projection** — Sidebar sections + tab projection pattern used correctly.
4. **Tailwind / token variants** — All colors / spacings / radii / fonts route through `falcon-*` tokens.
5. **Shared component upgrade** — Not required.
6. **New reusable component** — Not required.
7. **Feature-local wrapper** — Not required.
8. **Raw implementation as GAP** — Not required.

## Backlog (P3 follow-ups — not Falcon Eyes scope)

| ID | Description | File | Effort |
|---|---|---|---|
| GAP-i18n-001 | Add `hierarchy.users.emptyTitle` + `hierarchy.users.emptyBody` translations to en.json | `apps/admin-console/src/assets/i18n/en.json` | 1 min |
| GAP-i18n-002 | Same in ar.json | `apps/admin-console/src/assets/i18n/ar.json` | 1 min |
| GAP-paginator-001 | Default rows-per-page → 20 on users `<falcon-data-table>` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 1 min |

## Customization order (reference)

1. Existing Falcon component inputs / config
2. Existing Falcon ng-template support
3. Existing Falcon slots / content projection
4. Existing Falcon Tailwind / token variants
5. Shared Falcon component upgrade
6. New reusable Falcon component in the library
7. Feature-local wrapper (page-specific only)
8. Raw implementation (last resort, document as GAP)
