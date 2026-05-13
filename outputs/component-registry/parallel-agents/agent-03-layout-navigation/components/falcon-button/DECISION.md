# falcon-button — DECISION

## Brain SK final recommendation

### Use this component for
- Every form submit / cancel pair.
- Drawer / dialog / popup footer actions (next to `<falcon-angular-drawer>`, `<falcon-angular-dialog>`, `<falcon-angular-popup>`).
- Settings strip Edit / Cancel / Save patterns (admin + management consoles).
- Wizard step navigation (`Back` / `Next` / `Finish`).
- Toolbar / page-header CTAs.
- Icon-only kebab triggers paired with `<falcon-angular-menu>` (with `ariaLabel`).
- Per-tab action panels via `<ng-template falconTabActions>` inside `<falcon-angular-tabs>`.

### Avoid this component for
- Navigational links that change the URL (use `<a [routerLink]>` until `href` passthrough lands).
- Pure icon affordances inside table rows (use `<falcon-angular-menu>` row-action-trigger pattern, or `<falcon-angular-icon>` wrapped in raw `<button class="...">` if you genuinely need a stripped-down click target).
- Custom-shape buttons that don't conform to the 34/38/44 height system — extend tokens or fork.
- Submit-on-`Enter` flows that should NOT re-trigger via space — buttons honour both keys.

### Preferred render path
`useTailwind=true` (default — `<falcon-button-tw>`). Light DOM is preferred because:
1. Tailwind utilities + custom-property tokens cascade in naturally.
2. Test runners can query for inner classes for DOM-shape assertions.
3. Bundle size — Stencil Shadow shadow-styles add hydration cost; Light DOM skips that.

Drop to `useTailwind=false` (`<falcon-button>`) only when:
- The host page is rendering inside a wider Shadow DOM that pollutes Tailwind class names.
- You explicitly want Stencil's `part="root"` etc. for external styling via `::part()` selectors.

### Required upgrades before wider use
**Tier 1 (blockers for some flows):**
1. `href` / `target` passthrough — without this, every "navigate to detail" button is a code-smell (manual `router.navigate()` in click handler).
2. Dev-mode `ariaLabel` warning for `iconOnly=true` — too easy to forget, a11y regressions ship.

**Tier 2 (nice to have):**
3. Slot for spinner — for branded loading visuals.
4. `selected` toggle state — for filter-pill style usage.
5. Per-variant disabled treatment for `secondary`.

**None of these block CURRENT shipping use.** Buttons can be used as-is for every observed pattern in the workspace.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-icon` | Project via `slot="icon-start"` or `slot="icon-end"`. |
| `falcon-angular-popup` | Composes 2 `<falcon-button-tw>` instances internally for confirm / cancel. |
| `falcon-angular-drawer` | Drawer footer is the canonical button-pair host (project via `slot="footer"`). |
| `falcon-angular-dialog` | Same pattern — footer slot holds buttons. |
| `falcon-angular-confirm-dialog` | Internal buttons are NOT `<falcon-button>` — they're raw `<button class="falcon-confirm-btn">`. This is a structural inconsistency worth flagging. |
| `falcon-angular-menu` | Used as trigger via `slot="trigger"` on the menu host, OR as inner `<button role="menuitem">` (each menu item is plain `<button>`, not `<falcon-button>`). |
| `falcon-angular-tabs` | Buttons land in the tab actions area via `<ng-template falconTabActions>`. |

### Exact rule for future implementation tasks
> Every new clickable action surface (submit / cancel / icon-only / kebab trigger) MUST use `<falcon-angular-button>` unless it is explicitly a router link (`<a [routerLink]>`) or a tree-node action that goes through `<falcon-angular-menu>`. PrimeNG buttons are physically uninstalled — there is no fallback. Use `variant="ghost"` for cancel; `variant="primary"` for submit; `variant="danger"` for destructive. Always pass `ariaLabel` when `iconOnly=true`. Use `[loading]` (not `[disabled]`) when awaiting async work.

### Status
**READY** — production-grade. Wave PR-8 + Wave 9.F. Used in 4+ production templates today.

---

## Dynamic capability assessment

### 1. What is static today?
- The 5 variants (`primary` / `secondary` / `ghost` / `danger` / `link`) — hardcoded in `FalconButtonVariant` union.
- The 3 sizes — hardcoded in `FalconButtonSize` union.
- The rendered element is always `<button>` — never `<a>`.
- The spinner SVG markup — fixed in the source.
- The slot names (`icon-start`, `label`, `icon-end`).

### 2. What is already dynamic through inputs/outputs?
- variant / size / type / disabled / loading / fullWidth / iconOnly / label / ariaLabel / name / valueAttr — all directly bindable.
- `useTailwind` toggle — switches render path at runtime.
- `rootClass` — caller can inject extra classes (Tailwind path only).
- `falconClick` emits native `MouseEvent` (modifier keys, coords available).

### 3. What is already dynamic through slots / ng-template?
- `icon-start` slot — any element (svg / `<i>` / `<falcon-angular-icon>`).
- `label` slot — overrides plain `label` prop, allows rich content (spans, icons inline, badges).
- `icon-end` slot — same as `icon-start`.

No `<ng-template>` directives. Stencil slots are the only projection mechanism.

### 4. What is dynamic through token / theme overrides?
Everything visual:
- Heights, padding, gap, font-size per size.
- Bg / text / border colors per variant × per state.
- Shadow / focus halo (with separate danger variant halo).
- Border radius (single — applies to all variants).
- Disabled opacity + cursor.
- Loading label opacity + spinner stroke / track / color.
- Motion duration + easing.

Override path: `.host-class { --falcon-button-<token>: ...; }` cascades into both Shadow + Light renderers.

### 5. What is dynamic through Tailwind classes?
Limited to:
- Host layout (`flex items-center gap-2 justify-end` on the parent).
- Width clamping (`class="w-32"` etc.).
- `class` on the host gets pushed through to `root-extra-class` (Tailwind path) — but the inner template already emits its own utility set so additions are append-only and won't override.

### 6. What is missing to make this component reusable across pages?
- `href` / `target` passthrough — for routing buttons.
- `selected` state — for toggle-button patterns.
- A spinner slot — for branded loading.
- A `before` / `after` / `badge` slot pattern for annotations.
- Polymorphic `as` to render as `<label>` (file inputs), `<a>` (navigation), `<summary>` (disclosure widgets).

### 7. What capability should be added to the shared component instead of a one-off page hack?
ALL of items 6 — every one of those is a recurring pattern in the workspace. Letting individual pages re-implement button shapes leaks the design system.

### 8. What flags / options / templates / slots would make it better?
| Addition | Type | Surface |
|---|---|---|
| `href`, `target`, `rel` | Inputs | Both Shadow + Light + Wrapper |
| `selected` | Input | Both + tokens |
| `<slot name="spinner">` | Slot | Both Stencil paths |
| `<slot name="badge">` | Slot | Both Stencil paths |
| `as: 'button' \| 'a' \| 'label'` | Input | Wrapper — polymorphic rendering |
| Density-aware spinner stroke | Tokens | `button.tokens.css` |

### 9. What is the safest upgrade path?
1. Land `href` / `target` first (additive — never breaks existing). When `href` is truthy, render `<a>` instead of `<button>`. Always type=button else types are stripped.
2. Add `selected` next (additive, defaults to `false`).
3. Spinner / badge slots are pure-additive — they fall back to the existing default rendering.
4. Polymorphic `as` is risky (changes rendered tag) — gate behind a major version bump and a migration shim.

### 10. What would be risky to change because other pages depend on it?
- **Default `variant`.** `primary` is the default; flipping it would silently change every consumer not passing a variant.
- **Default size `md`.** Changing to `sm` would shrink every existing button.
- **`label` overridden by slot.** Reversing the precedence (slot loses to label) would break the playground reference and the org-hierarchy patterns.
- **The fact that `disabled || loading` both disable click.** Some pages might be relying on loading=true to debounce additional clicks during async work.
- **`valueAttr` instead of `value`.** Renaming back to `value` would break the Angular conflict workaround.
- **Reflected props (`variant`, `size`, etc.).** Removing reflect would break any CSS selectors keyed on `[variant="primary"]` attribute, which IS the pattern used in the token file's `:where()` shape with `[data-falcon-button]` etc.
