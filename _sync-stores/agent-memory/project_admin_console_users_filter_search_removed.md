---
name: Users Filter+Search removed (admin-console)
description: Removed Filter button + Search input from Users table on Organization Hierarchy page (Admin Console). State signals + i18n keys cleaned up.
type: project
originSessionId: 06e0b020-4858-499f-8031-b9338590be54
---
🟢 LANDED 2026-05-16 — removed the Filter button + Search input from the Users table header on the Organization Hierarchy page in the Admin Console.

**Touched 4 files:**
1. `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — deleted the right-side actions wrapper (lines 213–231); the `Users` `<h2>` title is the only thing left in the header row, `justify-between` dropped to plain row gap.
2. `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` — removed `readonly searchQuery = signal<string>('')` and `readonly filterOpen = signal<boolean>(false)` (no downstream effects/computeds depended on them).
3. `libs/falcon/src/language/i18n/en.json` — removed `hierarchy.actions.filter` ("Filter") + `hierarchy.actions.search` ("Search here").
4. `libs/falcon/src/language/i18n/ar.json` — removed `hierarchy.actions.filter` ("تصفية") + `hierarchy.actions.search` ("ابحث هنا").

**Safety audit before deletion:** the only references to `state.filterOpen` / `state.searchQuery` and the two i18n keys were the template lines being deleted. Host-shell `treeSearchQuery` and the tree-component-docs `searchQuery` are unrelated (different signal, different file). `WAVE-A-OLD-STRUCTURE.md` mention is in `docs/archive/` — left alone (historical).

**No runtime verification** per standing rule `feedback_no_ui_testing_during_implementation.md` — testing is a separate user-initiated phase.
