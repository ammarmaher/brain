# falcon-button — DECISION

## Brain SK final recommendation

**STATUS: READY (flagship reference). Use for every clickable commit/cancel/trigger surface in new Angular code.** Wave PR-8 + Wave 9.F + Wave 13b + Wave 19. The single most-used UI primitive in the workspace (**~260 occurrences across 74 files** — 249/71 in `apps/` + 11/3 in `libs/falcon`, W1-c re-grep 2026-06-03). Production-grade as-is; the gaps in `GAPS_AND_UPGRADES.md` are improvements, not blockers.

## Use this component for
- Every form submit / cancel pair.
- Drawer / dialog / popup footer actions.
- Settings strip Edit / Cancel / Save patterns (BOTH consoles).
- Wizard step navigation (`Back` / `Next` / `Finish`).
- Toolbar / page-header CTAs; Templates create / switch-perspective.
- Templates Approve/Reject decision toggles (the Wave 9.F variant family).
- Icon-only kebab triggers paired with `<falcon-angular-menu>` (with `ariaLabel`).
- do-payment / wallet-transfer Proceed / Cancel commits.

## Avoid this component for
- Navigational links that change the URL (use `<a [routerLink]>` until `href` passthrough lands — GAP G9).
- Pure icon affordances inside table rows (use the `<falcon-angular-menu>` row-action pattern).
- Custom-shape buttons that don't conform to the 34/38/44 height system — extend tokens.

## Preferred render path
**`useTailwind=true` (default — `<falcon-button-tw>`).** Light DOM is preferred because:
1. Tailwind utilities + `--falcon-button-*` tokens cascade in naturally.
2. Test runners can query inner classes for DOM-shape assertions.
3. No Shadow hydration cost.

Drop to `useTailwind=false` (`<falcon-button>`) only when:
- The host renders inside a wider Shadow DOM that pollutes Tailwind class names.
- You explicitly want Stencil `part="root|spinner|content|…"` for external `::part()` styling.
- Note: `rootClass` is dropped on the Shadow path (GAP G1) and `link` hover underlines on Shadow but not on `-tw` (GAP G8).

## Required upgrades before wider use
**None block current shipping use.** Priority improvements:
- **Tier 1:** `href`/`target` passthrough (G9), wrapper method proxies (G3), dev-mode `ariaLabel` warning (G4).
- **Tier 2:** spinner slot, `selected` toggle state, `rootExtraClass` Shadow parity (G1), align `link` underline (G8), add specs (G6).

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-icon` | Project via `slot="icon-start"` / `slot="icon-end"`. |
| `falcon-angular-popup` | Footer composes button-shaped affordances. |
| `falcon-angular-drawer` | Drawer footer is the canonical button-pair host (`slot="footer"`). |
| `falcon-angular-dialog` / `falcon-alert-dialog` / `falcon-confirm-dialog` | Footer slot holds buttons — but several still use RAW `<button>`, NOT `<falcon-button>` (B15 + B17 Falcon-component-over-native findings). A structural inconsistency worth flagging for those dialogs. |
| `falcon-insufficient-balance-dialog` | Footer Cancel / Proceed are raw `<button>` (B17 finding G-IB) — same composition-gap. |
| `falcon-angular-menu` | Used as trigger via `slot="trigger"`, OR each menu item is a plain `<button role="menuitem">` (not `<falcon-button>`). |
| `falcon-angular-tabs` | Buttons land in the tab actions area via `<ng-template falconTabActions>`. |

## Exact rule for future implementation tasks
> Every new clickable action surface (submit / cancel / icon-only / kebab trigger / decision toggle) MUST use `<falcon-angular-button>` unless it is explicitly a router link (`<a [routerLink]>`) or a tree-node action via `<falcon-angular-menu>`. PrimeNG buttons are physically uninstalled — there is no fallback. Use `variant="ghost"` for cancel; `variant="primary"` for submit; `variant="danger"`/`outline-danger` for destructive; the 4 Wave 9.F variants ONLY for Templates decision cards. Always pass `ariaLabel` when `iconOnly=true`. Use `[loading]` (not `[disabled]`) when awaiting async work. Bind `[valueAttr]`, never `[value]`.

---

## Dynamic capability assessment

### 1. What is static today?
- The rendered element is always `<button>` — never `<a>` (no `href` — G9).
- The spinner SVG markup — fixed in both Stencil sources (no spinner slot).
- The slot names (`icon-start`, `label`, `icon-end`).
- The single border-radius (10 px applies to all variants).
- The 10 variants + 3 sizes are fixed string unions.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **13 wrapper `@Input`s** (W1-c recount — grep of `@Input` on falcon-button.component.ts = 13; the prior "12" undercounted the 13-name list it enumerated) — `variant` (10 values), `size`, `type`, `disabled`, `loading`, `fullWidth`, `iconOnly` (booleanAttribute), `label`, `ariaLabel`, `name`, `valueAttr`, `useTailwind`, `rootClass`.
- `[CODE]` **One Angular `@Output`: `(falconClick)`** (native `MouseEvent`, unwrapped from the Stencil `falcon-click` envelope). Suppressed while disabled/loading.

### 3. What is already dynamic through slots / ng-template?
- `icon-start` slot — any element (svg / `<i>` / `<falcon-angular-icon>`).
- `label` slot — overrides the plain `label` prop, allows rich content.
- `icon-end` slot — same as `icon-start`.
- No `<ng-template>` inputs — Stencil slots are the only projection mechanism.

### 4. What is dynamic through token / theme overrides?
Everything visual (~14 token categories): heights/padding/gap/font per size; bg/text/border per variant × state (10 families); shadow/focus halo (separate danger halo); radius; disabled opacity+cursor; loading label opacity + spinner stroke/track/color; motion. Override via `.host-class { --falcon-button-*: … }` → cascades into both render paths.

### 5. What is dynamic through Tailwind classes?
- Host layout (`flex items-center gap-2 justify-end` on the parent) + width clamping (`class="w-32"`).
- `rootClass` → `root-extra-class` (Tailwind path only — append-only; won't override the inner utility set; dropped on Shadow path).

### 6. What is missing to make this component reusable across pages?
- `href` / `target` passthrough (G9) — for routing buttons.
- `selected` toggle state — for filter-pill / decision-toggle patterns.
- A spinner slot — for branded loading.
- A `before` / `after` / `badge` slot for annotations.
- Wrapper method proxies (G3) — pages currently reach into the DOM.

### 7. What capability should be added to the shared component (not a page hack)?
ALL of item 6 — each is a recurring pattern. Letting individual pages re-implement button shapes leaks the design system.

### 8. What flags / options / templates / slots would make it better?
| Addition | Type | Surface |
|---|---|---|
| `href`, `target`, `rel` | Inputs | Both Shadow + Light + Wrapper (G9) |
| `selected` | Input | Both + tokens |
| `<slot name="spinner">` / `<slot name="badge">` | Slots | Both Stencil paths |
| `setFocus()` / `clickProgrammatic()` proxies | Methods | Wrapper (G3 — the Stencil methods already exist) |
| `rootExtraClass` on Shadow tag | Prop | Shadow tag (G1 parity) |
| Density-aware spinner stroke | Tokens | `button.tokens.css` |

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** wrapper method proxies (G3), dev-mode `ariaLabel` warning (G4), `rootExtraClass` on the Shadow tag (G1), align `link` underline (G8), add specs (G6).
2. **Phase B (additive):** `href`/`target`/`rel` → render `<a>` when `href` is truthy; `selected` toggle (defaults false); spinner/badge slots (fall back to current default).
3. **Phase C (risky):** polymorphic `as` (changes the rendered tag) — gate behind a major bump + migration shim.

### 10. What is risky to change because other pages depend on it?
- **Default `variant` (`primary`)** — flipping it silently changes every consumer not passing a variant.
- **Default `size` (`md`)** — changing to `sm` shrinks every button.
- **`label` overridden by slot** — reversing precedence breaks the org-hierarchy + Templates patterns.
- **`disabled || loading` both disable click** — pages rely on `loading=true` to debounce extra clicks.
- **`valueAttr` instead of `value`** — renaming back to `value` reintroduces the Angular value-binding clash.
- **Reflected props (`variant`, `size`, etc.)** — removing reflect breaks any CSS keyed on `[variant="primary"]`.
- **`useTailwind=true` default** — flipping it changes DOM structure (Light ↔ Shadow) and breaks tests.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17). Recommendation unchanged (READY / flagship). Counts corrected: **10 variants**, 1 `@Output` (`falconClick`); `href`/method-proxies/`selected`/spinner-slot remain GAPs.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — **`@Input` total corrected 12 → 13** (grep-confirmed). **NOT a form control — no CVA / `ControlValueAccessor`** (re-confirmed: the only `@Output` is `falconClick: MouseEvent`; form participation is native `type="submit"` only). 10-variant union re-confirmed against ts:18. Consumer sweep grew materially — see USAGE.
