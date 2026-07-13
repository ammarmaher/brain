# falcon-angular-tree — DECISION

## Brain SK final recommendation

### Status
- **NEEDS-UPGRADE** for full org-hierarchy parity. The Tier-7 locked-spec rendering is correct and visually matches React reference; missing pieces are per-row template / actions slot and the parallel-implementation drift risk with `<falcon-tree-panel>`.

### Use this component for
- Recursive selection trees (category, file explorer, simple org hierarchy without 3-dot menus).
- Use the bare `<falcon-angular-tree>` when assembling a custom panel chrome.

### Avoid this component for
- Org-hierarchy with per-row 3-dot menus → use `<falcon-tree-panel>` today; long term, both should converge.
- Tabular data with hierarchy → use `<falcon-angular-tree-table>`.
- Very large trees (1000+ nodes) → not virtualized yet.

### Preferred variant / render path
- **`useTailwind=true` (default)** — Light DOM.

### Required upgrades before wider use
1. **Per-row template / action slot** (P0).
2. **Virtualization** (P1) for large trees.
3. **Lazy children loader** (P1).
4. **Drag-and-drop** (P1).
5. **Multi-mode cascading select** (P1).
6. **Migrate `<falcon-tree-panel>` to compose `<falcon-angular-tree>`** — eliminate parallel implementation.

### Relationship to other components
- `<falcon-tree-panel>` — bespoke chrome around its own internal tree (NOT around this component). Convergence is the target.
- `<falcon-angular-tree-table>` — tabular cousin (columns + recursive rows).
- `<falcon-organization-hierarchy-tree-tw>` — bespoke Light-DOM org-hierarchy tree (Agent 2 territory).

### Exact rule for future implementation tasks
> "For new recursive selection trees without per-row 3-dot menus, use `<falcon-angular-tree>`. For full org-hierarchy panel with chrome + 3-dot menus, use `<falcon-tree-panel>` (legacy bespoke) until convergence. When adding new features (DnD, virtualization, lazy load), invest in `<falcon-angular-tree>` first."

---

## Dynamic capability assessment

### 1. What is static today?
- `[CODE]` Row structure (rails + chevron + multi-check + initials chip + icon + label + badge) — fixed.
- `[CODE]` Initials chip ALWAYS present; renders alongside `node.icon` when both set (G8).
- `[CODE]` Chevron `aria-label` (`Collapse`/`Expand`) + the `"No matches"` empty text are hardcoded English (no i18n).
- No virtualization, no lazy children loader, no DnD, no row template / action slot.
- `[CODE]` Search is case-insensitive single-field substring only — CONFIRMED (no custom predicate).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **15 wrapper `@Input`s** (incl. the `selectedValue` setter): `nodes`, `selectedValue` (CVA, single mode), `selectedValues`, `expandedIds`, `density`, `selectionMode`, `disabled`, `helperText`, `errorMessage`, `groupLabel`, `ariaLabel`, `searchQuery`, `defaultExpandLevel`, `useTailwind`, `rootClass`.
- `[CODE]` **5 `@Output`s:** `valueChange`, `valuesChange`, `expandChange`, `hoverChange`, `focusChange` (each bridged from a `falcon-*` Stencil event). `falcon-blur` is bound to CVA `onTouched` but NOT re-emitted as a `(blur)` Output.
- `[CODE]` **5 programmatic methods** delegating to Stencil `@Method`s: `selectAndScrollTo`, `expandTo`, `expandAll`, `collapseAll`, `focusNode`.

### 3. What is already dynamic through slots / ng-template?
- _None observed in active source._

### 4. What is dynamic through token / theme overrides?
- 14 categories of tokens (`tree.tokens.css`). Rich.
- Per-instance override via `class="…"` + `:where(.…) { --falcon-tree-…: …; }`.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper class for layout context.

### 6. What is missing to make this component reusable across pages?
- Per-row template / action slot (P0).
- Virtualization (P1).
- Lazy children loader (P1).
- DnD (P1).
- Multi-mode cascading (P1).
- Custom search predicate (P2).
- `*` keyboard chord for expand-all (P3).

### 7. What capability should be added to the shared component vs a one-off page hack?
- All items belong in shared. Especially the row template — it's the gap that forced `<falcon-tree-panel>` to exist as a parallel implementation.

### 8. What flags / options / templates / slots would make it better?
- `*falconTreeNode` Angular directive with TemplateRef + ContentChildren.
- `<slot name="row-{id}">` and `<slot name="actions-{id}">`.
- `loadChildren?: (parentId) => Promise<FalconTreeNode[]>` Input.
- `enableDragDrop?: boolean` Input + `(falcon-drop)` Output.
- `selectMode?: 'self-only' | 'cascading'` Input (multi mode).
- `virtualScroll?: boolean` Input.
- `searchPredicate?: (node, query) => boolean` Input.
- `showInitials?: boolean` Input.

### 9. What is the safest upgrade path?
1. Add per-row template + action slot — purely additive.
2. Add `loadChildren` Input — opt-in.
3. Add `enableDragDrop` — opt-in.
4. Add `virtualScroll` — opt-in.
5. Migrate `<falcon-tree-panel>` to compose `<falcon-angular-tree>` — BIG WAVE.
6. Migrate consumers from `<falcon-tree-panel>` to `<falcon-angular-tree>` + new action slot directly.

### 10. What would be risky to change because other pages depend on it?
- Removing single-mode CVA semantics.
- Changing the `FalconTreeNode` shape (the wrapper barrel already re-aliases it to `FalconTreeRowNode` to avoid the tree-table clash — renaming would break that alias).
- Changing the 7 locked-spec visual points — non-negotiable contracts with the React V0.2 reference.
- Renaming the `falcon-*` Stencil event names (the wrapper template binds them by exact string).
- Changing the default `density` / `selectionMode` / `useTailwind` defaults.
- NOTE: with **0 current render consumers**, the immediate blast radius of an API change is small — but the convergence target (G1: fold `<falcon-tree-panel>` onto this component) means future-proofing the API now is worthwhile.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09). Recommendation unchanged (NEEDS-UPGRADE for org-hierarchy parity; READY for plain selection trees). Counts confirmed: 15 wrapper `@Input`s, 5 `@Output`s, 5 delegated `@Method`s. Consumer count 0 (render). G2/G3 per-row template/action slot remain the keystone gap behind the `<falcon-tree-panel>` parallel implementation.
