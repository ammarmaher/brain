---
name: Add Client / Add User wizards unified onto FalconUnsavedChangesService
description: All Add Client + Add User leave-confirmation popups migrated to the global unsaved-changes service with one shared message
type: project
originSessionId: 93e00256-b703-4f19-bf39-55509907ac02
---
🟢 BUILD-GREEN 2026-05-19. admin-console + management-console builds pass.

Add Client + Add User wizards no longer use inline `<falcon-angular-popup variant="unsaved">`.
All four leave paths now route through the global `FalconUnsavedChangesService.confirm()` —
the SAME generic gate the org-hierarchy Info panel edit flow uses:
- admin add-client-wizard Cancel  - admin add-user-wizard Cancel
- management-console add-user-wizard Cancel
- Add-Client-open tree-click leave path (was page-menu inline popup + slice's
  pendingTreeSelection/showAddClientDiscardPrompt — all removed).

i18n: added shared `hierarchy.unsavedChanges.wizardBody` (en+ar); reuses
`unsavedChanges.{title,hint,discard,stay}`. Deleted dead `addClient.exitConfirm` /
`addUser.exitConfirm` blocks. (`info.exitConfirm`/`settings.exitConfirm` still used by
the management-console org-hierarchy menu's inline info/settings popups — left intact.)

ROUTER / LEFT-SIDE-MENU leave path (2026-05-19): `HierarchyPageStateService.confirmDiscardIfDirty()`
(the centralized gate behind `orgHierarchyPageCanDeactivate`) now also covers Add Client wizard,
Add User wizard, and Add/Edit Node drawer. Dirty state plumbed to page scope:
- `AddClientWizardSignalsService.wizardDirty` + `AddUserStateSlice.wizardDirty` — wizard
  components mirror their `isAnyDirty()` via an effect.
- `NodeDrawerStateSlice.nodeDrawerDirty` — drawer emits new `(dirtyChange)` output (typed
  name ≠ seed) → facade `setNodeDrawerDirty()`.
On Discard the gate closes the open wizard/drawer. `pageHasUnsavedEdits` extended too.
STILL OPEN: the node drawer's own Cancel/Esc/backdrop closes WITHOUT a prompt (wizards' Cancel
buttons do prompt).

**How to apply:** Any new wizard/leave confirmation → inject `FalconUnsavedChangesService`,
call `.confirm({titleOverride, bodyOverride: wizardBody, hintOverride, confirm/cancelLabelOverride})`,
act on the `leave` boolean. Never mount an inline unsaved popup.
