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
The Angular wrapper renders **pure-Angular `<div>` chrome** (Defect A FIX) — `useTailwind` is a **no-op**, there is no render-path choice on the Angular side. The Stencil `<falcon-card>` / `<falcon-card-tw>` are React/Vue-only.

### Required upgrades before wider use
**Tier 1:**
1. `interactive` + `selected` + `falconClick` outputs — unblock the selectable tile pattern (G-INT-1).
2. Fix the dual-render footgun: suppress the prop-driven `<header>`/`<footer>` when the matching `[slot=…]` has content (G-FOOTGUN-1).
3. Add `[ariaLabel]` + `role="region"` on the Angular root `<div>` (FC-A11Y-1 — the Angular path lacks the Shadow path's landmark).

**Tier 2:**
4. `loading` / skeleton mode (G-LOAD-1).
5. `tone` variant for accent-coloured cards (G-TONE-1).
6. `headingLevel` prop (G-HEAD-1).
7. Token-parity for the Angular chrome — migrate hardcoded palette utilities to `--falcon-card-*` arbitrary-value utilities (FC-TOKEN-1).

> **NOTE:** the prior Tier-1 item "remove the legacy `computed()` helpers" is **retracted** — those helpers are the LIVE Angular render path, not dead code.

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
**ACTIVE / ADOPTED but NEEDS-UPGRADE** — production-grade static container, now broadly used (10 app files / 42 occurrences + 1 lib / 3, 2026-06-03), but missing the most-asked dynamic patterns (interactive / selected) and the Angular-path `role="region"` a11y. Use as-is for static/section containers + error banners; defer dynamic-tile use cases.

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
2. Fix the dual-header render (visible improvement, technically a behaviour change — gate behind `[suppressDuplicateHeader]="true"` for one release, then default it).
3. Add `[ariaLabel]` + `role="region"` on the Angular root (additive; closes the FC-A11Y-1 gap vs the Shadow path).
4. Add `loading`, `tone`, `headingLevel`, `bodyPadding`, media slot, and token-parity for the Angular chrome (additive).

### 10. What would be risky to change because other pages depend on it?
- **The render architecture** — the Angular wrapper renders pure-Angular chrome (Defect A FIX). Do NOT "fix" it back to delegate to `<falcon-card-tw>` — that re-introduces the zoneless slot-destruction bug.
- **The LIVE `computed()` helpers** — they are the render; removing them (a prior-dossier "cleanup" suggestion) would break every Angular consumer.
- **The header dual-render** — flipping to "slot wins" might change a consumer's output.
- **Defaults `variant:'default'` / `size:'md'`** and the **null → `''` coercion** in the setters — silently changing any would alter render output.

The card now has **10 app + 1 lib consumers**, so upgrades are still low-risk if additive — but the render-architecture and the LIVE helpers are load-bearing and must not be "cleaned up."

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10). Recommendation: ADOPTED / NEEDS-UPGRADE. **Corrected:** preferred-render-path framing (Angular chrome, `useTailwind` no-op); the "remove legacy helpers" item retracted (helpers are LIVE); consumer count refreshed (10 app / 42 + 1 lib / 3). G-INT-1 / G-FOOTGUN-1 / FC-A11Y-1 / FC-TOKEN-1 are the live upgrade backlog.
