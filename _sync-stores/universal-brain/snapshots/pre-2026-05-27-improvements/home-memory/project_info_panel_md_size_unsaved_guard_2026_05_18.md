---
name: Info panel MD size + reusable unsaved-changes abstraction
description: Org-hierarchy Info panel edit controls at size=md; global FalconUnsavedChangesService backed by falcon-angular-popup with true-blocking leave gates
type: project
originSessionId: 56ed1468-5df2-415e-b870-10ed64af1968
---
🟢 2026-05-18. Admin-console org-hierarchy page (`falcon-org-info-panel` + Settings tab).

**Sizing:** All 17 edit-mode `<falcon-angular-input>`/`<falcon-angular-dropdown>` controls in the Info panel → `size="md"`. Photo uploader excluded.

**Reusable unsaved-changes abstraction (re-implemented — first pass used FalconConfirmService, user rejected it):**
- `FalconUnsavedChangesService` (`providedIn:'root'`, `libs/falcon-ui-core/src/angular-wrapper/components/falcon-unsaved-changes-host/`) — `confirm(options?): Observable<boolean>` (true=discard&leave). Renders the EXISTING `<falcon-angular-popup variant="unsaved">` (same component Add Client uses). Body/title/labels overridable per call.
- Host `<falcon-unsaved-changes-host>` mounted once in host-shell `app.ts` next to the confirm-dialog host — covers all MF remotes.
- Central gate `HierarchyPageStateService.confirmDiscardIfDirty()` + `pageHasUnsavedEdits` computed; covers BOTH Info panel and Settings tab dirty state. All leave paths call it.
- TRUE BLOCKING: `<falcon-tabs>` Stencil selects optimistically — fixed by new public `syncSelection(next?)` on `FalconAngularTabsComponent`; `onTabChange` snaps the visual back to the authoritative tab before running the gate. Tree highlight pinned via new controlled `selectedIdInput` on `OrganizationHierarchyTreeComponent` (skips optimistic highlight when controlled).
- Leave paths wired: tab switch, tree node-select (`onTreeSelect`), in-page kebab/+ menus (`onActionInvoke`), sidebar nav + URL via `orgHierarchyPageCanDeactivate` guard.
- Settings tab unified onto the same gate; its old inline popup + `requestNavigateTo`/`confirmDiscard`/`dismissDiscard`/`pendingNodeId`/`showDiscardPrompt` removed.
- i18n: `hierarchy.unsavedChanges.{title,infoBody,settingsBody,hint,discard,stay}` (en+ar).

**Why:** User wants ONE reliable, globally-available unsaved-changes popup that truly blocks every leave action until Stay/Discard is picked — no optimistic visual jump.
**How to apply:** For ANY unsaved-changes confirmation across the platform, inject `FalconUnsavedChangesService` — do not mount popups inline, do not use `FalconConfirmService` for this. On the org-hierarchy page reuse `confirmDiscardIfDirty()`. When guarding a control that selects optimistically, snap its visual back before the async gate.

Note: repo lives at `C:\Falcon\Falcon\falcon-web-platform-ui` (doubled "Falcon"). Pre-existing flag (untouched): `app.routes.ts:9` redirects `''` → `organization-hierarchy` but child path is `org-hierarchy-page`.
