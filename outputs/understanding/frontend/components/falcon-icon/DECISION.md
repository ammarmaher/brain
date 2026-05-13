# falcon-icon — DECISION

## Brain SK final recommendation

### Use this component for
- Every Falcon icon-font glyph (122 available).
- Inside `<falcon-angular-button>` slots (`icon-start` / `icon-end`).
- Inside menu items, accordion items, tab options (currently those use CSS class strings — migrate forward).
- Status indicators, form-field hint icons, empty-state illustrations.

### Avoid this component for
- Non-Falcon icons — use `<iconify-icon>` until the Tier-1 fallback ships.
- Brand logos, photos, avatars — use dedicated components.

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1:**
1. **Adoption mandate:** ESLint rule + codemod to migrate raw `<i class="falcon-icon falcon-icon-X">` to `<falcon-angular-icon name="X">`.
2. `spin` / `pulse` animation props for loading indicators.
3. `iconify-icon` fallback via name prefix detection — unifies the icon API.

**Tier 2:**
4. `color` shorthand prop.
5. `flip` / `rotate` props.
6. TypeScript icon-name union for compile-time validation.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-button` | Should use icon component in slots (currently uses raw `<i>` in most consumers). |
| `falcon-angular-menu` items | Should use icon component (currently CSS class string per `FalconMenuItem.icon`). |
| `falcon-angular-tabs` per-tab icons | Same. |
| `falcon-angular-accordion` items | Same. |
| `falcon-angular-empty-state` | Composes icon for the empty illustration. |
| `falcon-angular-avatar` | Falls back to icon when no src/initials (icon-name fallback chain). |

### Exact rule for future implementation tasks
> Use `<falcon-angular-icon>` for ALL Falcon icon-font glyphs in net-new code. Pass `name` (without the `falcon-icon-` prefix), pick a `size`, leave `decorative=true` for icons inside text or buttons. Use `decorative=false` + `label` only when the icon is the ONLY content (e.g. status pill). Color via parent `text-falcon-*` Tailwind utility. For non-Falcon icons, use `<iconify-icon>` as the fallback (until the Tier-1 unified API ships).

### Status
**READY** — production-grade. Tier-1 upgrade (`spin`, `pulse`, unified iconify fallback) would consolidate the platform-wide icon strategy.

---

## Dynamic capability assessment

### 1. What is static today?
- The icon font set (122 icons) — adding requires font asset update.
- No animation (no spin, pulse, etc.).
- No color shorthand.
- No flip / rotate.
- No iconify fallback in the wrapper.

### 2. What is already dynamic through inputs/outputs?
- `name`, `size`, `decorative`, `label`, `useTailwind`.
- No outputs.

### 3. What is already dynamic through slots / ng-template?
None.

### 4. What is dynamic through token / theme overrides?
- Per-size pixel values (`--falcon-icon-size-{xs,sm,md,lg,xl}`).
- Color (`--falcon-icon-color`).

### 5. What is dynamic through Tailwind classes?
- Parent text color → icon color via `currentColor` inheritance.
- Margin / padding on parent.

### 6. What is missing to make this component reusable across pages?
- Animation props (spin / pulse).
- Iconify fallback.
- Color shorthand.
- Flip / rotate.
- TypeScript icon-name validation.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[spin]`, `[pulse]`, `[flip]`, `[rotate]`.
- `[color]` shorthand (token-aware).
- Auto-detect iconify prefix in `name`.

### 9. What is the safest upgrade path?
1. Add `spin` / `pulse` / `flip` / `rotate` (additive).
2. Add `color` shorthand (additive).
3. Add iconify auto-detect (additive — only activated when `name` contains `:`).
4. Migrate consumers from raw `<i>` to wrapper (codemod-driven).

### 10. What would be risky to change because other pages depend on it?
- **The icon name pattern** (`name="pencil"` → `.falcon-icon-pencil`) — flipping the convention would break every consumer.
- **The default `decorative=true`** — changing would add `aria-label` requirements everywhere.
- **The default `size="md"`** — changing would resize every icon.
- **The `--falcon-icon-color: currentColor` inheritance** — removing would force per-icon color setting.
- **The vendored font file location** — moving the asset requires updating `@font-face` paths.
