# falcon-button — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-button>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A rectangular, rounded (10 px radius) clickable control with a centered label, a consistent height (34 / 38 / 44 px for sm/md/lg) and a brand focus halo. Distinguishing parts: an optional **leading icon** (`icon-start`) and/or **trailing icon** (`icon-end`); a **loading spinner** that overlays the label (label fades to `opacity:0`, width stays stable) when `loading=true`; a **square aspect** when `iconOnly=true`; **full-width stretch** when `fullWidth=true`. **Ten variants** paint it: `primary` (teal fill), `secondary` (white + neutral border), `ghost` (transparent), `danger` (red fill), `link` (transparent text-only, no underline), `dashed` (dashed teal "add another"), `outline` (white + neutral border + muted text), `primary-dark` (teal-700 fill), `outline-primary-dark` (white + teal-700 border/text), `outline-danger` (white + red border/text).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Button variant="contained\|outlined\|text">` + `<LoadingButton>` | `contained`≈`primary`/`primary-dark`, `outlined`≈`outline`/`outline-primary-dark`/`outline-danger`, `text`≈`ghost`/`link`; `LoadingButton`≈`[loading]` |
| PrimeNG | `<p-button>` | direct 1:1 — this component replaced `<p-button>` in Wave PR-8 |
| Ant Design | `<Button type="primary\|default\|dashed\|text\|link">` | near-exact — Ant has a `dashed` type matching Falcon's `dashed` variant |
| Bootstrap | `<button class="btn btn-primary\|btn-outline-*\|btn-link">` | upgrade target — `btn-outline-*`≈`outline*` family; replace wholesale |
| shadcn / Radix | `<Button variant="default\|secondary\|outline\|ghost\|destructive\|link">` | `destructive`≈`danger`/`outline-danger`; otherwise 1:1 |
| plain HTML | `<button>` / `<input type="submit">` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a labelled action (Save / Cancel / Next / Add) | `<falcon-angular-button>` | raw `<button>` |
| a destructive action (Delete / Remove) | `<falcon-angular-button variant="danger">` | primary button |
| a secondary / dismiss action | `<falcon-angular-button variant="ghost">` | `variant="link"` |
| an "add another" affordance | `<falcon-angular-button variant="dashed">` | a styled `+` text link |
| an Approve / Reject decision toggle | `primary-dark`/`outline-primary-dark` + `danger`/`outline-danger` (selected/unselected) | a checkbox pair |
| a low-emphasis pill ("Switch perspective") | `<falcon-angular-button variant="outline">` | ghost (too flat) |
| an icon-only utility trigger (edit / kebab) | `<falcon-angular-button iconOnly="true" [ariaLabel]>` | bare `<falcon-angular-icon>` |
| a link that changes the URL | `<a [routerLink]>` styled with tokens | `variant="link"` (GAP G9 — no `href`) |
| a row-level kebab menu launcher | `<falcon-angular-button iconOnly>` paired with `<falcon-angular-menu>` | standalone button |
| a one-of-many segmented choice | `<falcon-angular-tabs>` / `<falcon-angular-radio-group>` | a row of `selected` buttons (GAP — no toggle state) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[label]`, `variant`, `size`, `type`, `[disabled]`, `[loading]`, `[fullWidth]`, `[iconOnly]`, `[ariaLabel]`, `(falconClick)`.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — `slot="icon-start"` (leading icon), `slot="icon-end"` (trailing icon), `slot="label"` (rich label — overrides the `label` prop). Project `<i class="falcon-icon falcon-icon-*">` or `<svg slot="icon-start">`.
4. **Variants** — pick `variant` (one of the 10) + `size` first. The variant carries business meaning — choose it before tokens. The 4 Wave 9.F variants (`outline` / `primary-dark` / `outline-primary-dark` / `outline-danger`) are purpose-built for the Templates decision card.
5. **Token override** — per-instance host class mutating `--falcon-button-*` (e.g. `--falcon-button-border-radius: 999px` for a pill). Never hardcode hex/px.
6. **Upgrade** — need `href`/routing, a `selected` toggle, a custom spinner, or a badge? GAP G9 / "selected state" / spinner slot — raise them, do not hand-roll a sibling `<a>` or a parallel button.
7. **Wrapper** — only build a thin local wrapper if a repeated icon+variant+handler combo recurs across many pages.

## Anti-patterns
- Raw `<button>` or PrimeNG `<p-button>` in app code — banned; PrimeNG is physically uninstalled (Wave PR-8).
- Using `variant="link"` for routing — no `href` passthrough, loses right-click "open in new tab". Use `<a [routerLink]>`.
- Binding `[value]` instead of `[valueAttr]` — clashes with Angular's native value binding.
- Toggling BOTH `[disabled]` and `[loading]` for "saving" — `loading` already disables; use `[loading]` alone.
- Omitting `ariaLabel` when `iconOnly=true` — the button has no accessible name.
- Setting `[label]` AND projecting `<span slot="label">` — the slot wins; the prop text is dropped.
- Reusing the 4 Wave 9.F variants as generic primaries — they encode Templates decision-card state.
- Adding Tailwind color/padding/border utilities to the host — they don't reach the inner button. Use token overrides.
- `pi pi-*` PrimeIcons in `slot="icon-start"` — banned; use `falcon-icon falcon-icon-*` or inline `<svg>`.
- `::ng-deep` / `::part()` mutation to restyle — forbidden; override tokens.

## Verification
🟡 CODE-DERIVED from `falcon-button.component.ts` + `falcon-button.types.ts` + `button-tailwind-classes.ts`. **10-variant union ✅ VERIFIED** (corrects the prior "5-to-6 variants"). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
