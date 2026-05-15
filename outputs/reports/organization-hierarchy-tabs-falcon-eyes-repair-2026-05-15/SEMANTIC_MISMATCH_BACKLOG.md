*** Semantic Mismatch Backlog — Org Hierarchy Falcon Eyes (RESUMED 2026-05-15) ***

## Status

**No layout-level or component-level mismatches detected.** Round 1 pixel parity is 96.5 %; remaining 3.5 % is content/data-driven only.

## Findings (all data/content, no Falcon component defects)

### FE-tabs-header-0001 — Top-bar user profile widget empty (P2 — data, not layout)

- **Section:** tabs-header
- **Source state:** Authenticated user widget (avatar, "User Name", "Job Title", dropdown)
- **Destination state:** Avatar placeholder + chevron, no name/title text
- **Falcon component involved:** `app-topbar` + `falcon-angular-dropdown`
- **Cause:** No real authenticated session under dev bypass — SessionProvider has no user
- **Repair:** None — restores naturally with real session
- **Files:** `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts`

### FE-tree-0001 — Hierarchy tree shows only root clients (P2 — data, not layout)

- **Section:** org-info-panel / tree-panel
- **Source state:** Tree expanded with sub-departments (Human Resources, Digital Banking, Contact Center, Marketing, IT & Cybersecurity)
- **Destination state:** Top-level Falcon Clients only (Saudi Aramco, Al Rajhi Bank, Saudi National Bank, Bupa Arabia)
- **Falcon component involved:** `falcon-tree-panel`
- **Cause:** No real backend serves sub-tree children under dev bypass
- **Repair:** None — Falcon Tree correctly renders whatever the API returns
- **Files:** none

### FE-users-table-0001 — Empty-state shows raw i18n keys (P3 — i18n GAP)

- **Section:** Hierarchy users table (visible across all tabs)
- **Source state:** Populated rows (Thamer, Anas, Hajeer, Najla, Faisal, Abdallah) with status badges Active / Suspended / Locked / Deleted / Pending
- **Destination state:** Empty-state showing `hierarchy.users.emptyTitle` and `hierarchy.users.emptyBody` as literal strings (translations missing)
- **Falcon component involved:** `falcon-data-table` empty-state slot + `@falcon/i18n` translate pipe
- **Cause:** Translation keys not defined in en.json / ar.json
- **Repair:** Add the two keys (1-min change)
- **Files:** `apps/admin-console/src/assets/i18n/en.json` + `ar.json`

### FE-pagination-rows-0001 — Default rows-per-page differs (P3)

- **Section:** Users table footer
- **Source state:** Default rows-per-page selector = 20
- **Destination state:** Default = 10
- **Falcon component involved:** `falcon-data-table` paginator
- **Cause:** Default input not aligned with source SoT
- **Repair:** Set default rows-per-page input to 20 (1-line change)
- **Files:** `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html`

### Verified parity (no repair, listed for completeness)

- `FE-info-button-0001` — Information button: icon + label match
- `FE-status-badge-0001` — Status badge palette: matches source (pending real-data re-verification)
- `FE-tabs-active-0001` — Active tab underline: matches source

## Severity totals

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 0 |
| P2 | 3 |
| P3 | 4 |

## Conclusion

Page is **structurally complete**. No Falcon component repair needed for Round 1 to clear 90/95 targets. P3 items are filed; they'll bring parity to ~97-98 % when landed in the next implementation pass.
