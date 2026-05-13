# falcon-card — DECISION

## Brain SK final recommendation

### Use this component for
- Page section containers with title + body + optional footer (Account Details, Permissions, Activity panels).
- KPI / stat tiles with header + value body.
- Wrapping content in a consistent bordered surface where dark-mode and density should follow the theme.

### Avoid this component for
- Modal overlays — use `falcon-angular-dialog` / `falcon-angular-drawer` / `falcon-angular-popup`.
- Selectable / interactive tiles — TODAY no `interactive` / `selected` mode exists; fall back to hand-rolled `<button>` until upgrade lands.
- Full-bleed hero sections (border + radius constrain).
- Inside `falcon-angular-data-table` cells (over-nesting).

### Preferred render path
`useTailwind=true` (default — `<falcon-card-tw>`).

### Required upgrades before wider use
**Tier 1 (recommended ahead of mass-adoption):**
1. `interactive` + `selected` + `falconClick` outputs — unblock selectable tile pattern.
2. Fix the dual-render bug: hide prop-driven header when `slot="header"` has content.
3. Remove the legacy `computed()` helpers in the wrapper that emit hardcoded Tailwind padding strings.

**Tier 2 (after Tier 1):**
4. `loading` / skeleton mode.
5. `tone` variant for accent-coloured cards.
6. `headingLevel` prop.
7. Subheader font-size token consumption in Light-DOM source (currently `text-xs` hardcoded).

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-button` | Common in `slot="footer"` for card-level actions. |
| `falcon-angular-status-badge` / `falcon-angular-tag` | Stacked in rich `slot="header"` content for status pills. |
| `falcon-angular-empty-state` | Use INSIDE a card's body when no data. |
| `falcon-angular-data-table` | Card can wrap a data table for a framed section. |
| `falcon-angular-dialog` | Distinct concept — never nest. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-card>` for any bordered section container. Default to `variant="default"` for first-level surfaces, `variant="outlined"` for nested or summary cards, `variant="flat"` for tightly-nested content where elevation is redundant. Use plain `[header]` / `[subheader]` / `[footer]` props for simple text. Use `slot="header"` / `slot="footer"` for rich content (icons, badges, action buttons) — but DON'T also pass the prop or both will render. Do NOT use this component for clickable tiles until `interactive` + `selected` land.

### Status
**NEEDS-UPGRADE** — production-grade primitive but missing the most-asked patterns (interactive / selected). Use the component as-is for static containers; defer dynamic-tile use cases.

---

## Dynamic capability assessment

### 1. What is static today?
- The rendered tag is always `<div>` — never `<button>`, `<a>`, `<article>`.
- The `<h3>` heading level is fixed.
- Variant set is fixed at 3.
- No hover / focus / pressed visuals.
- The Light-DOM source hardcodes `text-xs` for subheader font size.

### 2. What is already dynamic through inputs/outputs?
- `header`, `subheader`, `footer` (text props).
- `variant`, `size`, `ariaLabel`, `rootClass`, `useTailwind`.
- No outputs.

### 3. What is already dynamic through slots / ng-template?
- `slot="header"` — rich header content.
- (default) — body content.
- `slot="footer"` — rich footer content.

No `<ng-template>` directives.

### 4. What is dynamic through token / theme overrides?
- All radii, paddings, border widths, border colors, shadows, font sizes, font weights.
- Per-instance via host class.

### 5. What is dynamic through Tailwind classes?
- Host layout (width, height, margin, grid item spans).
- Nothing else penetrates the inner surface.

### 6. What is missing to make this component reusable across pages?
- Interactive / selected states.
- Click event.
- Loading / skeleton mode.
- Accent tone for info/success/warning/danger cards.
- Heading level override.
- Media / image slot.

### 7. What capability should be added to the shared component instead of a one-off page hack?
ALL of items 6 — every one is a recurring pattern. Hand-rolling per-page would multiply variants and lose token consistency.

### 8. What flags / options / templates / slots would make it better?
- `[interactive]="true"` + `[selected]="true"` + `(falconClick)` — interactive card.
- `[loading]="true"` — skeleton body.
- `[tone]="'info' | 'success' | 'warning' | 'danger'"` — accent.
- `[bodyPadding]="'none'"` — for table containers.
- `[headingLevel]="2"` — h-tag override.
- `<slot name="media">` — top cover area.
- `<ng-template falconCardHeader>` directive — Angular-idiomatic content projection.

### 9. What is the safest upgrade path?
1. Add `interactive` / `selected` / `falconClick` (additive — default false → no visual change).
2. Fix the dual-header render (visible improvement, but technically a behavior change — gate behind a `[suppressDuplicateHeader]="true"` flag for one release, then make it the default).
3. Add `loading`, `tone`, `headingLevel`, `bodyPadding`, media slot (additive).
4. Add Angular directives for header/footer template projection (additive).

### 10. What would be risky to change because other pages depend on it?
- **The header dual-render is technically observable** — flipping to "slot wins" might change one consumer's output.
- **Default `variant: 'default'`** — silently changing would affect everyone.
- **Default `size: 'md'`** — same.
- **The wrapper's `_header` / `_subheader` / `_footer` setters coerce null → empty string** — flipping to passthrough null would change render output.

Today the card has minimal active consumers in `apps/`, so the upgrade risk is LOW. This is the right time to land the changes before adoption scales.
