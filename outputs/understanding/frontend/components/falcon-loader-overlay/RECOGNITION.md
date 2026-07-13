# falcon-loader-overlay — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-loader-overlay>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A **fullscreen, brand-dark splash**: a deep teal→green gradient stage filling the entire viewport, with a large centered animated **Falcon mark** (the angular "T2/falcon" path), an optional **radial halo glow** behind it, a thin **orbiting/spinning ring**, a drifting field of faint **bubbles/particles**, a centered **caption** ("Welcome to Falcon") with a smaller **sub-caption** ("Preparing your workspace…") trailed by animated **dots**, and a slim **indeterminate progress bar**. Optional extras: scanlines, grid, stars, animated waves at the bottom, ripples, a moving spotlight, a drop-tint, and an animated mesh/aurora background. When `showBehind=false` a small circular **close (×)** button appears top-right. The defining tell: it occupies the **whole screen**, is **brand-coloured and animated**, and shows a **logo + caption**, not a small inline spinner.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Backdrop open>` + `<CircularProgress>` (+ custom logo) | MUI's backdrop is a dim veil; Falcon's overlay is a fully-branded animated stage (logo/ring/particles/caption) driven by JSON, far richer. |
| PrimeNG | `<p-blockUI>` full-screen + `<p-progressSpinner>` | PrimeNG blocks + spins; Falcon adds brand mark + 21 configurable visual groups. |
| Ant Design | `<Spin spinning fullscreen tip="…">` | Ant's fullscreen spin ≈ the *intent*; Falcon is a designed brand splash, not a generic spinner. |
| Bootstrap | a hand-rolled `.spinner-border` over a `position-fixed` overlay | upgrade target — replace wholesale. |
| shadcn / Radix | no built-in; usually a `<Dialog>`/portal + spinner | Falcon bakes the whole splash into one config-driven element. |
| plain HTML / React | a bespoke "FullscreenLoader" component | **this component IS the Angular/Stencil port of exactly that** (the React Loader Studio engine is its SoT). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a fullscreen branded boot / route-transition splash (logo + caption + animation) | `<falcon-angular-loader-overlay>` | inline loader |
| a small centered "loading…" card on a dim backdrop (the in-app default) | `<falcon-angular-loader-inline>` | overlay |
| a spinner scoped to one button / panel / table region | `<falcon-angular-loader-inline>` keyed by target id | overlay |
| a skeleton placeholder for a data table while it loads | the data-table skeleton (`falcon-studio-runtime` skeleton surface) | overlay |
| a blocking confirmation dialog | `<falcon-angular-confirm-dialog>` | overlay |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper. For this component the order is unusual because **almost everything is one JSON input**:
1. **Inputs** — there are only three: `[config]` (the entire visual spec as `FalconLoaderOverlayCfg` or a JSON string), `[visible]`, `[useTailwind]`. To match a design, author the `config` (in the Loader Studio editor) — set `bgMode`/colours, `logoAnim`, `ringStyle`, particle toggles, caption text, progress style, etc.
2. **Templates** — none. No `ng-template` inputs.
3. **Slots** — **none.** Logo/caption/custom SVG are config keys (`logoSource`/`customSvg`/`captionText`), not projected content. Do not reach for `<ng-content>`.
4. **Variants** — there are no discrete variant enums; the "variants" are the 21 config groups + their style unions (e.g. `ringStyle: spin|dual|dashed|pulse|orbit`). Pick them in the config.
5. **Token override** — only for **geometry/containment** (`--falcon-loader-overlay-position`/`-z-index`/`-inset`/`-stage-min-height`) when embedding the overlay in a card. Appearance comes from the JSON, not tokens.
6. **Upgrade** — need reliable show/hide events? That is GAP G1 — raise it; don't hand-roll a MutationObserver on `[visible]`. Need sanitised custom logos? That is G3.
7. **Wrapper** — the App=API wrapper already exists: `FalconLoaderService`. Drive `[config]`/`[visible]` from it; do not build a competing controller.

## Anti-patterns
- Using the fullscreen overlay as the **default in-app loader** — that is `<falcon-angular-loader-inline>` since 2026-05-19; the overlay is parked for boot/scoped use.
- Forwarding `visible="false"` — it is presence-only; the cascade reads attribute presence (`"false"` ⇒ wrongly "visible").
- Binding `(falconLoaderShown)`/`(falconLoaderHidden)` and expecting them to fire — wrapper/Stencil event-name mismatch (G1).
- Expecting `<ng-content>` / slots — there are none; supply content via `config`.
- Passing untrusted markup in `config.customSvg` — raw `innerHTML` sink (G3).
- Mounting it without overriding `position`/`z-index` when you need a region-bound overlay — it defaults to `fixed` + `z-index 100002` (covers the viewport).
- Hand-rolling a fullscreen teal splash with raw CSS — use this component (it is the brand SoT port).
- Gating critical business logic on the overlay auto-closing — it never self-closes; you flip `visible`.

## Verification
🟡 CODE-DERIVED from `falcon-loader-overlay.tsx` + `falcon-loader-overlay-tw.tsx` + the config types + the live Studio usage. Sibling routing (overlay vs inline) ✅ VERIFIED against `[CODE]` app.ts:58-65. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge. React-engine equivalence 🔴 asserted by source banner, not re-rendered.
