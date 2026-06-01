---
name: Wizard live node binding (Add Client + Add User)
description: Tree clicks while a wizard is open now route correctly: Add User silently re-targets, Add Client shows discard dialog (root-only feature). Wizard chrome avatar+name binds live to state.selectedNode().
type: project
originSessionId: 06e0b020-4858-499f-8031-b9338590be54
---
🟢 LANDED 2026-05-16 — Add Client + Add User wizards now track + reflect the live selected node from the org-hierarchy tree.

**Behavior (Admin Console only):**
1. **Add User open + tree click on any node** → silent re-target. `state.addUserNodeId` updates → wizard's `[nodeId]` input changes → `effect()` re-fires PES + Commerce settings resolve. Header avatar+name repaints. No confirmation, no flash, no form prompt (per user decision).
2. **Add Client open + tree click on root** → no-op (already targeted there).
3. **Add Client open + tree click on a NON-root node** → state parks the node in `pendingTreeSelection` → page-level `<falcon-angular-popup>` shows the existing `exitConfirm` dialog → Confirm closes the wizard AND applies the parked selection; Dismiss clears the pending and keeps the wizard open.
4. **Wizard header strip (top-left of both wizards)** — replaced the static Falcon SVG + "Falcon" text with a live `state.selectedNode()`-bound block: 28px avatar circle (image-or-initials fallback) + node name. Updates instantly on every selection change.

**Files touched (6):**
1. `services/hierarchy-page-state.service.ts` — added `pendingTreeSelection` signal + `showAddClientDiscardPrompt` computed; forked `onTreeSelect(node)` to branch on `addUserOpen` / `addClientOpen`; added `onConfirmAddClientDiscard` / `onDismissAddClientDiscard` methods.
2. `components/org-hierarchy-page-menu.component.html` — added a page-level `<falcon-angular-popup>` driven by `state.showAddClientDiscardPrompt` at the section root (sibling of the wizard).
3. `components/org-hierarchy-page-menu.component.ts` — added `FalconAngularPopupComponent` to both the named import block + the @Component imports array.
4. `components/wizard-components/add-client-wizard/add-client-wizard.component.{ts,html}` — injected `HierarchyPageStateService` as `protected state`; replaced static brand block with live `selectedNode` avatar + name.
5. `components/wizard-components/add-user-wizard/add-user-wizard.component.{ts,html}` — same wizard chrome change as Add Client. Plus: dropped `implements OnInit`, deleted `ngOnInit`, moved the PES forkJoin into a new `resolveAccessAndSettings()` method dispatched by a constructor `effect()` keyed off `this.nodeId()` (with `onCleanup → sub.unsubscribe()` so rapid re-clicks cancel in-flight requests). Guard on empty `nodeId` was REMOVED — PES queries are session-scoped, not node-parameterized, so first-mount resolve must fire even if `nodeId` is briefly empty during initial tree load.

**Design decisions (locked via AskUserQuestion):**
- Q1: Avatar UX = **Replace static "Falcon" brand** in wizard chrome (Option A).
- Q2: PES-deny on retarget = **Re-target + show empty-state inside wizard** (Option A — leverages the existing `!canAddUser()` branch at user-wizard.html:43-52).

**Risk surfaces handled:**
- Race on rapid tree clicks → `effect()`'s `onCleanup` callback unsubscribes the previous forkJoin so only the latest resolves.
- Empty `nodeId` on mount → effect tracks but does not gate; resolve always fires.
- Add Client root re-click → guarded with `node.id === tree()?.id` early-return in `onTreeSelect`.
- The wizard's own internal `showExitConfirm` (Cancel-button path) is untouched — page-level discard dialog is a separate `<falcon-angular-popup>` driven by `pendingTreeSelection`.

**Pre-existing patterns preserved:**
- `state.initialsFor(name)` reused for the avatar fallback (already on the state service since Wave 19).
- Same i18n keys (`hierarchy.addClient.exitConfirm.{title,body,stay,discard}`) for the new page-level discard popup — no new strings.

**No runtime verification** per standing rule `feedback_no_ui_testing_during_implementation.md` — UI testing is a separate user-initiated phase.

**Trigger to re-investigate:** if PES becomes truly node-scoped (today `FalconAccess.adminConsole.user.add()` is session-level), the `accessQueries` block in `resolveAccessAndSettings()` will need to parametrize on `nodeId()`. The effect already tracks it, so only the query factory call sites need updating.
