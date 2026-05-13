# falcon-accordion — DECISION

## Brain SK final recommendation

### Use this component for
- FAQ-style sections (long answers behind clickable questions).
- Multi-section forms with collapsible groups.
- Progressive disclosure for power-user settings.
- Anywhere you need keyboard-navigable collapsible content.

### Avoid this component for
- Navigation between section views (use tabs).
- Tree-structured content (use tree).
- Single disclosure (use native `<details>`).
- Tabbed-like always-1-visible UX (use tabs OR wait for `single-locked` mode).

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1:**
1. Per-item header slot (`slot="header-<value>"`).
2. `mode="single-locked"` for always-1-open.
3. CVA support for Reactive Forms binding.

**Tier 2:**
4. `<falcon-angular-icon>` composition for item icons.
5. Per-item `loading` state.
6. `canToggle` predicate.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-tabs` | Alternative for switching between section views (tabs don't keep multi-section visible). |
| `falcon-angular-tree` | Alternative for tree-structured collapse. |
| `falcon-angular-card` | Alternative for non-collapsible section containers. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-accordion>` for FAQ-style content, settings groups, or any multi-section disclosure. Choose `mode="single"` when only one section needs to be visible at a time (acknowledge it can collapse to zero). Choose `mode="multiple"` for independent expand/collapse. Provide `value` + `label` per `FalconAccordionItem` and optional `icon` / `description` / `disabled`. Project panel content via `<div slot="content-<value>">`. Currently no per-item header slot — rich header content requires the Tier-1 upgrade.

### Status
**READY but UNDER-LEVERAGED.** Production-grade primitive, zero production consumers. Tier-1 upgrades would unblock common patterns.

---

## Dynamic capability assessment

### 1. What is static today?
- Item header is built from props only — no header slot.
- Chevron SVG is hardcoded.
- Expand/collapse animation is `hidden` toggle — no smooth height transition.
- No "always 1 open" mode.
- No CVA.

### 2. What is already dynamic through inputs/outputs?
- `items` (array of `FalconAccordionItem`).
- `mode`, `size`, `disabled`, `showChevron`, `ariaLabel`, `helperText`, `errorMessage`.
- `expandedValues` (two-way).
- Outputs: `valueChange`, `expand`, `collapse`.
- Per-item props: `value`, `label`, `description`, `icon`, `disabled`.

### 3. What is already dynamic through slots / ng-template?
- `slot="content-<value>"` — per-item panel body.

### 4. What is dynamic through token / theme overrides?
- Container bg / border / radius.
- Item bg per state (default / hover / expanded / disabled).
- Header padding per size.
- Chevron size / rotation / transition.
- Description font.
- Panel body padding.
- Motion duration / easing.

### 5. What is dynamic through Tailwind classes?
- Inside panel content — full freedom.
- Not on item / header / chevron.

### 6. What is missing to make this component reusable across pages?
- Per-item header slot.
- Always-1-open mode.
- CVA / Reactive Forms support.
- Per-item icon via component (not CSS class).
- Per-item loading state.
- `canToggle` predicate.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `<slot name="header-<value>">`.
- `mode="single-locked"`.
- CVA implementation.
- `iconName` per item (using falcon-angular-icon).
- `[loadingValues]` array (highlight items as loading).
- `[canToggle]` callback.

### 9. What is the safest upgrade path?
1. Add header slot (additive).
2. Add `single-locked` mode (additive).
3. Add `iconName` per item (additive, alongside `icon`).
4. Implement CVA (additive — non-CVA consumers unaffected).
5. Add `loadingValues` + `canToggle` (additive).

### 10. What would be risky to change because other pages depend on it?
- **No production consumers** — risk is low. Land changes now.
- BUT: the `slot="content-<value>"` naming pattern is used by tabs (`panel-<value>`) — keep consistent.
- The `mode="single"` default — flipping to `multiple` would change render behavior.
- The keyboard handler chain (ArrowUp/Down, Home, End) — removing keys would break keyboard users.
