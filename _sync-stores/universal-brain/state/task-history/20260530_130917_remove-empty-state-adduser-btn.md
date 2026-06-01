# Remove empty-state "Add User" button — Management Console Users list

**Date:** 2026-05-30
**Repo:** C:/Falcon/Falcon/falcon-web-platform-ui (branch `night-shift-audit/2026-05-30-0128`)
**Status:** ✅ COMPLETED — build green, NO COMMITS

## Request
In the Management Console → Hierarchy tab, the Users table's empty state ("No data found")
injected an "Add User" button. User wants that empty-state button removed (keep the
node-header "Add User" button).

## Root cause
The Users table `<falcon-angular-data-table>` auto-mounts the shared `<falcon-empty-data>`
empty-state via `[emptyData]="usersEmptyDataConfig()"`. That config set
`showAction: this.state.canAddUser()`. The Stencil component renders its CTA button **only**
when `showAction` is true (`falcon-empty-data-tw.tsx:368` → `{this.showAction && <button>}`;
default `false`). So `showAction` was the entire button.

## Fix (management-console only; no shared lib touched)
1. `org-hierarchy-page-menu.component.ts` — `usersEmptyDataConfig()` now sets
   `showAction: false`; dropped the now-dead `actionLabel` / `actionSize` / `actionBorder`
   fields; comment rewritten to explain the deliberate removal.
2. `org-hierarchy-page-menu.component.html` — removed the now-orphaned
   `(emptyDataAction)="state.onHeaderAddUser()"` output binding on the data-table.

The empty state now renders message-only (search icon + "No data found" + description).
`state.canAddUser()` is still used by the node-header "Add User" button (unchanged) and the
tree kebab action, so no dead code introduced.

## Verification
`npx nx build management-console --configuration=development --skip-nx-cache` → **EXIT 0**,
"Successfully ran target build for project management-console and 6 tasks it depends on".
Build-level evidence only — NOT browser/runtime-verified (MF stack not spun up). Rendering
chain traced end-to-end at source level.

## Notes
- Scope is management-console. If the same empty-state CTA exists in admin-console and should
  also be removed, that's a separate (not-requested) change.
- NO COMMITS made (per standing rule).
