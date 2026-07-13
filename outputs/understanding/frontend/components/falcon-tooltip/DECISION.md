# falcon-tooltip — DECISION

## Brain SK final recommendation

### Use this component for
- Icon-only `<falcon-angular-button>` affordance labels.
- Truncated label expansion in table rows.
- Form-field hints (info-circle icon + tooltip).
- Status indicator legends.
- Anywhere previously using `[pTooltip]` directive.

### Avoid this component for
- Action menus (use `<falcon-angular-menu>`).
- Popovers with substantial interactive content (use a custom popup).
- Decision flows (use `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>`).
- Passive notifications (use `<falcon-angular-notification>`).
- Long-form content (use a panel or drawer).

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1:**
1. Collision-aware flip placement (most-requested).
2. `disabled` Watch to auto-close.

**Tier 2:**
3. `hideDelay` input.
4. `focusableTrigger` opt-out.
5. `maxHeight` input.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-button` (`iconOnly`) | Primary use case — tooltip wraps icon-only buttons for visible labels. |
| `falcon-angular-icon` | Common trigger child. |
| `falcon-angular-menu` | DIFFERENT use case — tooltip is for hints, menu is for actions. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-tooltip>` around any icon-only `<falcon-angular-button>` to provide a visible label for sighted users. ALWAYS pass `ariaLabel` on the button as well — tooltip is sighted-only. Use `placement="top"` as default; use `placement="bottom"` for header-level icons; `right` / `left` for sidebar layouts. Set `interactive=true` when the tooltip content has a link or button. Use `[content]` for plain text; `<slot name="content">` for rich content with formatting. Today there is NO collision detection — choose placement carefully or set `maxWidth` to constrain.

### Status
**READY** for production but **ZERO-adoption** (0 feature-template consumers as of 2026-06-03 — the prior playground showcase was removed). Tier-1 upgrades (collision flip + `@Watch('disabled')`) would harden it; the real ask is ADOPTION — pair it with icon-only buttons across both consoles. Wave-6 Top-Layer promotion already makes it safe inside drawers/dialogs. No React/Vue Falcon wrapper exists (Angular-only).

---

## Dynamic capability assessment

### 1. What is static today?
- 12 fixed placement options — no `auto` mode.
- Hide delay hardcoded at 80ms.
- Show animation is non-existent — abrupt appearance.
- Trigger gets `tabIndex=0` unconditionally.
- Arrow is always rendered.

### 2. What is already dynamic through inputs/outputs?
- `content`, `placement`, `delay`, `disabled`, `interactive`, `maxWidth`.
- `useTailwind`, `rootClass`.
- Outputs: `falconShow`, `falconHide`.
- Methods: `open()`, `close()`.

### 3. What is already dynamic through slots / ng-template?
- (default) — trigger child.
- `slot="content"` — rich tooltip content.

### 4. What is dynamic through token / theme overrides?
- Panel bg, color, padding, radius, shadow, max-width.
- Font family, size, weight.
- Arrow size, color.
- Offset (trigger-to-panel gap).
- Motion duration / easing.
- Z-index.

### 5. What is dynamic through Tailwind classes?
- Trigger child — full freedom.
- Inside `slot="content"` — full freedom.

### 6. What is missing to make this component reusable across pages?
- Collision-aware placement (auto-flip).
- Disabled watch (auto-close on disable).
- Configurable hide delay.
- Focusable trigger opt-out.
- Max-height.
- Show/hide animation.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[flipPlacement]` array or `[placement]="'auto'"`.
- `[hideDelay]` input.
- `[focusableTrigger]="false"` opt-out.
- `[maxHeight]` input.
- `[showOnFocus]="false"` opt-out.
- `[arrow]="false"` to hide arrow.

### 9. What is the safest upgrade path?
1. Add `disabled` Watch (internal, no API change).
2. Add `hideDelay` (additive, default 80).
3. Add `focusableTrigger` (additive, default true).
4. Add `maxHeight` (additive).
5. Collision flip (additive, default placement only when no flip array provided).
6. Animation (token-only, no API change).

### 10. What would be risky to change because other pages depend on it?
- **The 12 placement values** — removing one would break consumers.
- **The default `placement="top"`** — flipping would relocate every tooltip.
- **The trigger `tabIndex=0`** — removing would break keyboard tooltip discovery (HIGH-RISK; must stay opt-out, not default-off).
- **The 100ms show delay default** — changing to 0 would feel instant (perceptual shift).
- **The `interactive=false` default** — flipping would let users hover panels by default (unexpected non-dismissal).
- **The Top-Layer/Popover promotion** (Wave 6) — `FalconStackingService` registration + `popover="manual"` + the UA-default-clearing inline styles; changing the panel's `data-component="falcon-tooltip-panel"` attribute would silently break the wrapper's panel probe (`acquireTopLayer` queries that exact selector).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Recommendation unchanged (READY) but status sharpened to ZERO-adoption + Top-Layer-safe. Risk list extended with the Wave-6 Popover promotion + the panel `data-component` probe dependency.
