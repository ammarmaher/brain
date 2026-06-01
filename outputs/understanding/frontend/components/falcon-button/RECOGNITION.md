# falcon-button — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-button>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A rectangular, rounded (10px radius) clickable control with a centered label, a consistent height (34 / 38 / 44 px for sm/md/lg) and a brand focus halo. Distinguishing parts: an optional **leading icon** (`icon-start`) and/or **trailing icon** (`icon-end`); a **loading spinner** that overlays the label (label fades to `opacity:0`, width stays stable) when `loading=true`; a **square aspect** when `iconOnly=true`; **full-width stretch** when `fullWidth=true`. Five-to-six variants paint it: `primary` (teal fill / white text), `secondary` (white fill / neutral border), `ghost` (transparent / neutral text), `danger` (red fill / white text), `link` (transparent text-only), `dashed` (dashed border — present in the variant union).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Button variant="contained|outlined|text">` + `<LoadingButton>` | MUI `contained`≈`primary`, `outlined`≈`secondary`, `text`≈`ghost`/`link`; `LoadingButton`≈`[loading]` |
| PrimeNG | `<p-button>` | direct 1:1 — this component replaced `<p-button>` in Wave PR-8 |
| Ant Design | `<Button type="primary|default|dashed|text|link">` | near-exact — Ant even has a `dashed` type matching Falcon's `dashed` variant |
| Bootstrap | `<button class="btn btn-primary|btn-outline-*|btn-link">` | upgrade target — replace wholesale |
| shadcn / Radix | `<Button variant="default|secondary|outline|ghost|destructive|link">` | `destructive`≈`danger`; otherwise 1:1 |
| plain HTML | `<button>` / `<input type="submit">` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a labelled action (Save / Cancel / Next / Add) | `<falcon-angular-button>` | raw `<button>` |
| a destructive action (Delete / Remove) | `<falcon-angular-button variant="danger">` | primary button |
| a secondary / dismiss action | `<falcon-angular-button variant="ghost">` | `variant="link"` |
| an icon-only utility trigger (edit / kebab) | `<falcon-angular-button iconOnly="true" [ariaLabel]>` | bare `<falcon-angular-icon>` |
| a link that changes the URL | `<a [routerLink]>` styled with tokens | `variant="link"` (GAP P1 — no `href`) |
| a row-level kebab menu launcher | `<falcon-angular-button iconOnly>` paired with `<falcon-angular-menu>` | standalone button |
| a one-of-many segmented choice | `<falcon-angular-tabs>` / `<falcon-angular-radio-group>` | a row of `selected` buttons (GAP — no toggle state) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[label]`, `variant`, `size`, `type`, `[disabled]`, `[loading]`, `[fullWidth]`, `[iconOnly]`, `[ariaLabel]`, `(falconClick)`.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — `slot="icon-start"` (leading icon), `slot="icon-end"` (trailing icon), `slot="label"` (rich label content — overrides the `label` prop). Project a `<i class="falcon-icon falcon-icon-*">` or `<svg slot="icon-start">`.
4. **Variants** — pick `variant` (`primary` / `secondary` / `ghost` / `danger` / `link` / `dashed`) + `size` first. The variant carries the business meaning — choose it before tokens.
5. **Token override** — per-instance host class mutating `--falcon-button-*` (e.g. `--falcon-button-border-radius: 999px` for a pill, `--falcon-button-primary-bg`). Never hardcode hex/px.
6. **Upgrade** — need `href`/routing, a `selected` toggle state, a custom spinner, or a badge? GAPs P1 / "selected state" / spinner slot — raise them, do not hand-roll a sibling `<a>` or a parallel button.
7. **Wrapper** — only build a thin local wrapper if a repeated icon+variant+handler combination recurs across many pages.

## Anti-patterns
- Raw `<button>` or PrimeNG `<p-button>` in app code — banned; PrimeNG is physically uninstalled (Wave PR-8).
- Using `variant="link"` for routing — no `href` passthrough, loses right-click "open in new tab". Use `<a [routerLink]>`.
- Binding `[value]` instead of `[valueAttr]` — clashes with Angular's native value binding.
- Toggling both `[disabled]` and `[loading]` for "saving" — `loading` already disables; use `[loading]` alone.
- Omitting `ariaLabel` when `iconOnly=true` — the button has no accessible name.
- Setting `[label]` AND projecting `<span slot="label">` — the slot wins; the prop text is dropped.
- Adding Tailwind color/padding/border utilities to the host `<falcon-angular-button>` — they do not reach the inner button. Use token overrides.
- `pi pi-*` PrimeIcons in `slot="icon-start"` — banned; use `falcon-icon falcon-icon-*` or an inline `<svg>`.
- `::ng-deep` / `::part()` mutation to restyle — break-glass and forbidden; override tokens.

## Verification
🟡 CODE-DERIVED from `falcon-button.component.ts` + `[VAULT]` API/USAGE/DECISION dossiers. **`dashed` variant ✅ VERIFIED present** in the wrapper's `FalconButtonVariant` union. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
