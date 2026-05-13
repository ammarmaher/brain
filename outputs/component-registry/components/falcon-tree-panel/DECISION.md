# falcon-tree-panel (LEGACY BESPOKE) — DECISION

## Brain SK final recommendation

### Status
- **LEGACY-IN-USE / ACTIVE.** Bespoke Angular component, parallel implementation to `<falcon-angular-tree>`.
- Roadmap: converge with `<falcon-angular-tree>` (extend with row template + action slot) and delete the internal `<falcon-tree-node>`.

### Use this component for
- The standard org-hierarchy left rail (admin-console + management-console).
- Any tree-with-chrome use case requiring per-row 3-dot menus with declarative action configs.

### Avoid this component for
- Generic trees without action menus → use `<falcon-angular-tree>` directly.
- New tree variants where the chrome would be different.

### Preferred variant / render path
- N/A — pure Angular bespoke.

### Required upgrades before wider use
1. **Plan + execute convergence** with `<falcon-angular-tree>` (P0).
2. **Add `disabled(node)` to `FalconTreeAction`** (P1).
3. **Richer action variants** (`variant: 'default' | 'highlighted' | 'destructive' | 'warning'`) (P1).
4. **Document chevron-overlap auto-scroll** behavior (P1).
5. **Multi-selection support** (P2).
6. **Custom root row template slot** (P2).
7. **Delete legacy SCSS** during convergence (P0).

### Relationship to other components
- `<falcon-angular-tree>` — convergence target.
- `<falcon-angular-menu>` — already composed for the 3-dot popup.
- `<falcon-organization-hierarchy-tree-tw>` — separate Light-DOM bespoke org-hierarchy tree (Agent 2 territory).

### Exact rule for future implementation tasks
> "For org-hierarchy-like rails with chrome + per-row 3-dot menus, use `<falcon-tree-panel>` today. The declarative `FalconTreeAction[]` pattern is the canonical API for action menus — preserve it during convergence with `<falcon-angular-tree>`."

---

## Dynamic capability assessment

### 1. What is static today?
- Chrome shape (aside + root row + section label + tree body) — fixed.
- Recursive node rendering is its OWN code path (`<falcon-tree-node>`).
- Root row visual is `mode: 'falcon' | 'client'` — no custom template.
- Section label position — fixed between root row and tree body.
- 3-dot trigger keyboard activation — not supported (mouse only).
- Chevron-overlap auto-scroll — opaque to consumer.
- Single-selection only.

### 2. What is already dynamic through inputs/outputs?
- `[root]`, `[expandedIds]`, `[selectedId]`, `[trackBy]`, `[clientId]`, `[clientsLabelKey]`.
- `[rootActions]`, `[nodeActions]` declarative menu configs.
- `[mode]` (falcon / client).
- `[showArrows]`, `[showActions]` toggles.
- 4 Outputs: `toggle`, `select`, `action`, `hoverPathChange`.

### 3. What is already dynamic through slots / ng-template?
- _None._ Fully baked-in chrome.

### 4. What is dynamic through token / theme overrides?
- _Nothing._ Bespoke SCSS.

### 5. What is dynamic through Tailwind classes?
- Outer layout context (parent flex / grid / sticky positioning).

### 6. What is missing to make this component reusable across pages?
- Multi-selection (P2).
- Custom root row template (P2).
- Section label slot (P2).
- Disabled / richer action variants (P1).
- Keyboard nav for 3-dot trigger (P1).
- Convergence with `<falcon-angular-tree>` (P0).

### 7. What capability should be added to the shared component vs a one-off page hack?
- The declarative `FalconTreeAction[]` API is itself the right abstraction — KEEP IT.
- Migrate the recursive rendering and the hover-path / focus-mode / locked-spec visuals INTO `<falcon-angular-tree>`; keep the chrome + 3-dot menu dispatch as a thin shell here.

### 8. What flags / options / templates / slots would make it better?
- `selectionMode?: 'none' | 'single' | 'multi'`.
- `<ng-content select="[slot=root-row]">`.
- `<ng-content select="[slot=section-label]">`.
- `FalconTreeAction.disabled?: (node) => boolean`.
- `FalconTreeAction.variant?: 'default' | 'highlighted' | 'destructive' | 'warning'`.
- `(rootMenuOpen)` / `(rootMenuClose)` Outputs for analytics.

### 9. What is the safest upgrade path?
1. Add `disabled` to `FalconTreeAction` — purely additive.
2. Add `variant` to `FalconTreeAction` — purely additive.
3. Add `(autoScrolledIntoView)` Output — purely additive.
4. Add keyboard nav for 3-dot trigger — purely additive.
5. Add `<ng-content select="[slot=root-row]">` and `<ng-content select="[slot=section-label]">` — purely additive.
6. Plan convergence with `<falcon-angular-tree>` — BIG WAVE.

### 10. What would be risky to change because other pages depend on it?
- `[root]` shape (`FalconTreeNode<T>`).
- `(toggle)`, `(select)`, `(action)`, `(hoverPathChange)` Output types.
- Existing `FalconTreeAction.highlighted` semantics — `variant` addition must be backwards-compatible.
- The chevron-overlap auto-scroll being implicit — consumers may have come to rely on it.
- `mode` semantics — `'falcon'` ignores `root.imageUrl`; flipping behavior would surprise.
