# falcon-drawer — DECISION

## Brain SK final recommendation

### Use this component for
- Right/left side detail panels (Add / Edit node, user inspector, filter panels).
- Off-canvas mobile menus.
- Form-heavy side sheets where the body needs full height.
- Side-anchored wizards or multi-step flows.

### Avoid this component for
- Centered confirmation modals (use `falcon-angular-popup` / `falcon-angular-confirm-dialog`).
- Passive notifications (use `falcon-angular-notification`).
- Tooltips, menu popovers (use the dedicated components).
- Persistent navigation (sidebar, not drawer).

### Preferred render path
`useTailwind=true` (default). Light DOM lets the consumer's body content classes cascade naturally.

### Required upgrades before wider use
**Tier 1 (recommended):**
1. Expose `closeAriaLabel` in the Angular wrapper for i18n.
2. Add `<slot name="header-actions">` for inline header buttons (separate from close ×).
3. Document the `dismissable` vs `dismissible` spelling discrepancy with dialog (or add aliasing).
4. Document that the body unmounts on close.

**Tier 2:**
5. `canClose` predicate.
6. `tone` variant.
7. Exit transition.
8. Consolidate focus-trap logic with `falcon-angular-dialog`.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-dialog` | Sibling — same focus-trap idiom, different layout (centered scale-in). |
| `falcon-angular-button` | Drawer footer canonical pattern. |
| `falcon-angular-popup` | For action-required confirms — drawer is for detail/work, popup is for decisions. |
| `falcon-angular-input` / `falcon-angular-dropdown` / form controls | Body content. |
| `falcon-angular-tabs` | Drawer can host a tabbed body for multi-section detail views. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-drawer>` for any side-anchored sliding sheet. Default to `position="right"` + `size="md"` (480 px). Provide a `slot="header"` for rich header content (title + sub-line) and `slot="footer"` for the action button row (ghost Cancel + primary Save). Bind `[(open)]` or use `[open]` + `(openChange)`. Use `[closable]="false"` and rely on the Cancel button for explicit dismissal in destructive-risk forms. Use `[modal]="true"` by default — only `false` for non-blocking inspectors.

### Status
**READY** — production-grade for current usage. Tier 1 upgrades are quality-of-life.

---

## Dynamic capability assessment

### 1. What is static today?
- Slide direction is determined by `position` — no custom angle.
- Backdrop is always blur-based (`backdrop-filter`) when `modal=true`.
- Close × button has fixed SVG markup.
- DOM is destroyed on close (no exit animation).
- Focus trap is non-configurable.

### 2. What is already dynamic through inputs/outputs?
- `open` (one-way + `openChange` two-way sugar).
- `position`, `size`, `closable`, `dismissable`, `modal`.
- `header`, `ariaLabel`.
- `useTailwind`, `rootClass`.
- Outputs: `drawerShow`, `drawerHide`, `openChange`.

### 3. What is already dynamic through slots / ng-template?
- (default) body slot.
- `slot="header"` — rich header.
- `slot="footer"` — footer actions.

### 4. What is dynamic through token / theme overrides?
- Per-position width / height per size (8 tokens).
- Per-position border-radius (4 tokens, one per side).
- Overlay bg / blur / opacity.
- Panel bg / color / shadow.
- Header padding / title font / close button styling.
- Body padding.
- Motion duration / easing.
- Z-index.

### 5. What is dynamic through Tailwind classes?
- Inside body slot — full Tailwind freedom.
- Inside header slot — full Tailwind freedom.
- Inside footer slot — full Tailwind freedom.
- NOT on the drawer host (would not penetrate).

### 6. What is missing to make this component reusable across pages?
- i18n on close × button.
- Header-actions slot (between header content and close ×).
- `canClose` predicate (gated dismissal).
- Exit transition.
- `dismissable` vs `dismissible` alias.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[canClose]` predicate.
- `[closeAriaLabel]` input.
- `[tone]` variant.
- `<slot name="header-actions">`.
- `<slot name="body-loading">` (skeleton).
- `<ng-template falconDrawerFooter>` / `falconDrawerHeader` Angular directives.

### 9. What is the safest upgrade path?
1. Add `closeAriaLabel` input to wrapper (additive).
2. Add `header-actions` slot in Stencil sources (additive).
3. Add `canClose` callback (additive, default allows close).
4. Add `dismissible` alias (deprecate `dismissable` over 1 release).
5. Exit transition is risky — would change perceived UX, gate behind opt-in flag.

### 10. What would be risky to change because other pages depend on it?
- **`position="right"` default** — flipping would relocate every drawer.
- **`closable=true` default** — flipping would hide close × everywhere.
- **`modal=true` default** — flipping would let underlying clicks through (data integrity risk).
- **The DOM-destroy-on-close behavior** — flipping to "keep mounted" would persist signal state between opens (could be a feature, but unexpected).
- **`(drawerHide)` payload `reason` field** — consumers may switch on it.
