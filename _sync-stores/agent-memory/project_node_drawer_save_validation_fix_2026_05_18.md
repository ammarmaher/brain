---
name: Add/Edit Node drawer save + sibling validation fix
description: Org-hierarchy Add/Edit Node drawer Save was dead; sibling-name uniqueness validation unreliable. 4 root causes fixed 2026-05-18.
type: project
originSessionId: f5e32dc4-c7be-421b-af55-14b9572f308d
---
Add Node / Edit Node drawer (admin-console org-hierarchy) — Save never persisted and the
sibling-name uniqueness check missed duplicates. 🟢 BUILD-GREEN 2026-05-18 (`nx build admin-console`).

**Why:** Wave 20 moved org-tree ownership to the `<app-organization-hierarchy-tree>` wrapper;
`HierarchyService.treeSignal` was left as a permanently-empty `EMPTY_TREE` stub. Pre-flight
guards still validated against it.

**Root causes fixed:**
- RC1 (P0): `createSubNode`/`changeNodeName` ran `parentMustExist`/`findNode` against the dead
  EMPTY_TREE stub → always `parentNotFound` → POST/PUT never fired. Fix: methods take a
  `treeRoot` param; `NodeDrawerStateSlice.onNodeDrawerSave` passes live `TreeStateSlice.tree()`;
  guards no-op when null (backend validates).
- RC2 (P1): `siblingConflictError` was a debounced async pipe triggered only by the typed name —
  ran once against an empty sibling list, never re-checked. Fix: replaced with a synchronous
  `computed()` reading `nameValueTrimmed()` + `siblings()`; removed `nameCheckPending`.
- RC3 (P1): `openEditDrawer` skipped `loadDrawerSiblings` when `findParentOf` missed. Fix:
  fall back to `target.parentId`.
- RC4 (P2): `nodeName` validator emits `{whitespace:'edge'}`; drawer had no message key → showed
  literal "whitespace". Fix: added `hierarchy.drawer.errors.whitespace` to en/ar.json + map.

**How to apply:** management-console drawer is unaffected (its HierarchyService has no treeSignal/
guards; hierarchy tab is a placeholder). Known leftover: dead `noEdgeWhitespace` i18n key and the
mock `addNode`/`editNode` methods in services.ts — out of scope, not cleaned.

**Follow-up fix (2026-05-19, BUILD-GREEN):** the duplicate-sibling error was computed correctly
and disabled Save, but the template gated `[state]`/`[errorMessage]` behind `touched()` — so a
duplicate name silently disabled Save with NO visible red message until blur. Added a
`showNameError` computed (`nameError() && (touched() || name non-empty)`) and bound both the
input's error state + errorMessage to it. Duplicate/maxlength/pattern now show red immediately on
typing; `required` still defers to blur. i18n `hierarchy.drawer.errors.duplicateNodeName` already
existed ("A node with this name already exists at the same level").

**Conflict-chip indicator (2026-05-19, BUILD-GREEN):** the colliding "brother" node in the
context-card now gets a red dashed border + `bg-falcon-red-50` wash. `falcon-org-node-sibling-chip`
gained a `conflict` input (drops `opacity-falcon-skeleton`, swaps a permanent transparent
`border-2 border-dashed` to `!border-falcon-red-500` so there's no layout shift). `context-card`
gained `conflictChildId` computed (typed name vs `children()` case-insensitive) + `visibleChildren`
that pulls the conflicting child to slot 0 so it's never hidden past the 2-chip cap. All
computed-driven → indicator clears to idle automatically once the typed name no longer collides.
