---
type: rules
cluster: components
layer: composition
component: tree-details
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Tree and Details Composition Rules ***
*** Angular-first — deep rules for tree-panel + master-detail split ***
*** Read before building any hierarchical navigation view ***

# Falcon Tree and Details Composition Rules

> **Purpose:** Deep rules for composing the tree-panel navigation with a right-side detail panel — including node selection, tabs, action buttons, nested tables, inline forms, add/edit drawers, and visual consistency.
>
> **Reference implementation:** Admin Console → Organization Hierarchy page
> **Matrix entry:** [[Falcon Component Combination Matrix]] → C02
> **Visual standard:** [[Falcon Organization Hierarchy Visual Standard]] ★ — this is the canonical reference; match it exactly
> **Guardrail:** [[Falcon Light Mode Visual Baseline]] — tree column 320 px, tree row height ~40 px, right panel white bg

---

## 1 · Split Layout Contract

```html
<!-- Canonical master-detail shell -->
<div class="flex h-full min-h-0 bg-falcon-neutral-75">

  <!-- LEFT: Tree panel — fixed width, scrollable -->
  <div class="w-[320px] shrink-0 flex flex-col border-r border-falcon-neutral-200 bg-falcon-neutral-0 overflow-y-auto">
    <app-organization-hierarchy-tree
      [selectedNode]="selectedNode()"
      [refreshPath]="refreshPath()"
      (nodeSelect)="onNodeSelect($event)" />
  </div>

  <!-- RIGHT: Detail panel — fills remaining space -->
  <div class="flex-1 flex flex-col min-h-0 overflow-hidden bg-falcon-neutral-0">
    @if (selectedNode()) {
      <app-node-detail [node]="selectedNode()!" />
    } @else {
      <falcon-angular-empty-state
        icon="hierarchy"
        message="Select a node to view details" />
    }
  </div>

</div>
```

**Rules:**
- Tree column is exactly `w-[320px]` — do NOT use `w-64` (256 px) or `w-80` (320 px relative; prefer the explicit token)
- `shrink-0` on the tree prevents it from collapsing when the right panel has a lot of content
- `border-r border-falcon-neutral-200` is the divider between tree and detail — single 1 px line, neutral-200
- Right panel uses `overflow-hidden` — scrolling is managed by the inner content, not the panel shell
- Both columns have `bg-falcon-neutral-0` (white) — outer shell is `bg-falcon-neutral-75` (light grey page bg)

---

## 2 · Tree Component Rules

**Wrapper:** `<app-organization-hierarchy-tree>` — Angular wrapper around `<falcon-organization-hierarchy-tree-tw>`

```html
<app-organization-hierarchy-tree
  [selectedNode]="selectedNode()"
  [refreshPath]="refreshPath()"
  [rootSelectable]="false"
  [nodesSelectable]="true"
  (nodeSelect)="onNodeSelect($event)"
  (addNode)="onAddNode($event)"
  (editNode)="onEditNode($event)" />
```

**`[refreshPath]` contract** (2026-05-20):
```typescript
// After add/edit: refresh to the new/updated node
this.refreshPath.set(updatedNode.path);
// This triggers sequential loadNodeChildren walk, opens toggles, selects leaf, emits (nodeSelect)
// ONE loader opened, ONE dismissed via finalize()
```

**Rules:**
- `[selectedNode]` is a signal passed from the parent — tree does NOT own selection state
- `(nodeSelect)` always updates the parent's `selectedNode` signal — both click and `refreshPath` emit this event
- `[rootSelectable]="false"` — in Organization Hierarchy the root node is not selectable (client mode label auto-hide)
- Tree node uniqueness: sibling names must be unique under the same parent — validated in Add/Edit Node
- Tree action column (kebab) is HOVER-GATED — only visible when the row is hovered (fixed 2026-05-18)

---

## 3 · Selected Node — Detail Panel Composition

The right panel has three layers, rendered top-to-bottom:

```
┌─────────────────────────────────────────────────┐
│  Node Header (name + avatar + status badge)     │
├─────────────────────────────────────────────────┤
│  Tab Bar + Header CTAs                          │
├─────────────────────────────────────────────────┤
│  Tab Content (Information / Users / Apps / etc) │
└─────────────────────────────────────────────────┘
```

**Node header:**
```html
<div class="flex items-center gap-3 px-4 py-3 border-b border-falcon-neutral-200 flex-shrink-0">
  <app-org-node-avatar [node]="selectedNode()!" />
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold text-falcon-neutral-900 truncate">{{ selectedNode()!.name }}</p>
    <p class="text-xs text-falcon-neutral-500">{{ selectedNode()!.type }}</p>
  </div>
  <falcon-angular-status-badge [status]="selectedNode()!.status" />
</div>
```

**Rules:**
- `<app-org-node-avatar>` is the canonical node avatar — do NOT inline an icon or fallback letter yourself (node-identity-unification — 2026-05-16)
- Status badge is always rendered next to the node name in the header
- Node header is `flex-shrink-0` — it never collapses even when the panel has many tabs

---

## 4 · Tab Bar + Header CTAs

```html
<div class="flex items-center justify-between px-4 pt-3 pb-0 flex-shrink-0">
  <falcon-angular-tabs
    [tabs]="detailTabs"
    [(activeTab)]="activeDetailTab" />
  <div class="flex gap-2">
    <!-- CTAs depend on active tab -->
    @switch (activeDetailTab()) {
      @case ('users') {
        <falcon-angular-button size="sm" (click)="openAddUserWizard()">Add User</falcon-angular-button>
      }
      @case ('information') {
        @if (!isEditMode()) {
          <falcon-angular-button size="sm" variant="secondary" (click)="enterEditMode()">Edit</falcon-angular-button>
        }
      }
    }
  </div>
</div>
```

**Rules:**
- Tabs and header CTAs are in the SAME flex row — tabs left, CTAs right
- CTAs change per tab — use `@switch` on `activeDetailTab()` to render the right button
- Tab data is NOT reloaded on every tab switch — cache each tab's data in parent signals
- Tab active index is a signal: `activeDetailTab = signal<string>('information')`
- `[(activeTab)]` uses two-way binding — updates the signal AND responds to programmatic changes

---

## 5 · Information Tab — Form Rules

**States:**
- **View mode:** fields displayed as read-only text + values (not Falcon inputs)
- **Edit mode:** fields become `<falcon-angular-input>` / dropdown / phone-field etc.
- **Saving:** Edit/Save button shows spinner; form disabled during save

```typescript
// State management
isEditMode = signal(false);
infoForm = this.fb.group({ ... });

enterEditMode(): void {
  this.isEditMode.set(true);
  this.infoForm.patchValue(this.selectedNode()!);
}

onSave(): void {
  // ... save logic ... then:
  this.isEditMode.set(false);
  this.infoForm.markAsPristine();
}
```

**Rules:**
- In view mode: render a `<dl>` definition list or styled `<div>` grid — not empty inputs
- In edit mode: render the reactive form (see [[Falcon Form Composition Rules]])
- Fields use size `md` inputs (38 px) — CONFIRMED fix: Info panel edit controls → size=md (2026-05-18)
- Country + city are cascading dropdowns: `[searchable]="true"`, city re-fetched when country changes (W15b — 2026-05-18)
- Unsaved changes guard fires when switching tabs while edit mode is active

---

## 6 · Users Tab — Table Rules

```html
<!-- Users tab content -->
<div class="flex flex-col min-h-0 gap-4 p-4">
  <falcon-angular-data-table
    [columns]="userColumns"
    [rows]="tabUsers()"
    [loading]="usersLoading()"
    [emptyTemplate]="emptyUsers" />
  <falcon-angular-paginator
    [total]="userTotal()"
    [(page)]="usersPage"
    [(pageSize)]="usersPageSize"
    (pageChange)="loadUsers()" />
</div>
```

**PathPrefix rule** (2026-05-18):
```typescript
// Users list must use PathPrefix — NOT exact NodeId match
// This returns users for the selected node AND all its sub-nodes
loadUsers(): void {
  this.userService.getUsers({
    pathPrefix: this.selectedNode()!.path,
    page: this.usersPage(),
    pageSize: this.usersPageSize(),
  }).subscribe(res => {
    this.tabUsers.set(res.data);
    this.userTotal.set(res.total);
  });
}
```

**Rules:**
- `PathPrefix` is the correct filter — NOT `NodeId` — to show users in the full subtree
- Users list does NOT have a search/filter bar (removed 2026-05-16 per project decision)
- User table has: Name, Email, Role, Status columns + Actions kebab (Edit, Disable, Delete)
- Role column is read-only in the table — role change opens the Edit User drawer with proper PES gate

---

## 7 · Add / Edit Drawer Integration

```typescript
// Open Add Node drawer
openAddNode(parentNode: OrgNode): void {
  this.drawerMode.set('add');
  this.drawerTargetNode.set(parentNode);
  this.nodeDrawerOpen.set(true);
}

// After save: refresh tree to the new node
onNodeSaved(savedNode: OrgNode): void {
  this.nodeDrawerOpen.set(false);
  this.refreshPath.set(savedNode.path);
  // refreshPath triggers tree walk → selects the new node → emits (nodeSelect)
}
```

**Drawer rules:**
- Add/Edit Node drawer is `480px` wide
- Add User wizard is a full-screen dialog (wizard modal), NOT a drawer
- After save: set `refreshPath` to the saved node's path — tree will walk and select it automatically
- Drawer save must validate sibling-name uniqueness client-side before submitting (fixed 2026-05-18)
- Node drawer Save was dead when guards hit empty tree stub — ensure the tree is initialized before drawer opens

---

## 8 · Role-Change PES Gate

```typescript
// Role change in the Edit User panel
onRoleChange(userId: string, newRole: string): void {
  // Gate on permission: user can only change roles within their permission scope
  if (!this.pesService.can('update', 'user:role', userId)) {
    this.toast.error('You do not have permission to change this user\'s role');
    return;
  }
  // proceed with role change
}
```

**Rules:**
- Role change is PES-gated — call `pesService.can()` before the API call
- System roles are ONLY offered when the authenticated user has system-scope PES keys — do NOT offer system roles to tenant-scoped users (role-scope fix — 2026-05-19)
- User info panel edit controls are relocated to `@falcon/user-details` shared lib (user-info-panel-relocation — 2026-05-18)

---

## 9 · Visual Consistency Rules

| Element | Rule | Source |
|---|---|---|
| Tree column width | `320px` (was 272 px, enlarged 2026-05-18) | org-hierarchy-tree-resize |
| Tree row height | ~40 px (default token) | `--falcon-table-row-height` |
| Tree bg | `bg-falcon-neutral-0` (white) | [[Falcon Organization Hierarchy Visual Standard]] |
| Detail panel bg | `bg-falcon-neutral-0` (white) | same |
| Page shell bg | `bg-falcon-neutral-75` (light grey) | same |
| Column divider | `border-r border-falcon-neutral-200` | same |
| Tab bar | `<falcon-angular-tabs>` — no custom tab styling | same |
| Input size in edit mode | `size="md"` (38 px) | info-panel-md-size-fix (2026-05-18) |
| Node avatar | `<app-org-node-avatar>` — never inline letter/icon | node-identity-unification (2026-05-16) |
| Status badge | `<falcon-angular-status-badge>` — always beside node name | same |

---

## 10 · Anti-Patterns

| Anti-Pattern | Correct |
|---|---|
| `GET /user?NodeId=X` (exact match) | `GET /user?PathPrefix=X` (subtree fetch) |
| Tree column `w-64` (256 px) | `w-[320px]` |
| Custom tab `<ul><li>` implementation | `<falcon-angular-tabs>` |
| Router navigation between tree nodes | Signal-based `selectedNode` update |
| Reloading all tab data on every tab switch | Cache in parent signals; reload on node change only |
| Role dropdown showing ALL system roles | Filter by auth-user's permission scope |
| Inline letter/icon for node avatar | `<app-org-node-avatar>` |
| Edit mode as a separate routed page | Edit mode is a state in the same detail panel component |
| Fixed height on tree column | `h-full overflow-y-auto` |
| Opening drawer INSIDE the right panel DOM | Drawer portals to `<body>` |

---

## Cross-Links

- [[Falcon Tree]] · [[Falcon Tree Panel]] · [[Falcon Organization Hierarchy Tree TW]]
- [[Falcon Tabs]] — tab bar in detail panel
- [[Falcon Data Table Composition Rules]] — Users/Apps/Services tab tables
- [[Falcon Form Composition Rules]] — Information tab edit form
- [[Falcon Popup and Drawer Composition Rules]] — Add/Edit drawers + wizards
- [[Falcon Component Combination Matrix]] → C02
- [[Falcon Component Composition Playbook]] → Composition 2
- [[Falcon Organization Hierarchy Visual Standard]] ★ — canonical visual reference
- [[Falcon Light Mode Visual Baseline]] — visual guardrail
- [[Falcon Component Gap Registry]] → P0-05 (tree virtual scroll), P1-07 (tree filter)
- [[Falcon New Page Implementation Checklist]] — pre-merge gate

## Tags

#type/rules #layer/frontend #layer/composition #component/tree #component/details #status/active

## Hubs

- [[Falcon Tree]] · [[Falcon Tabs]] · [[COMPONENT_INDEX]] · [[Falcon Component Composition Playbook]]
