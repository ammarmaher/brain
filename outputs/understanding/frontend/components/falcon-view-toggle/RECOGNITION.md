# falcon-view-toggle — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-view-toggle>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A small **segmented-pill control**: a tinted (light-neutral) rounded container with a 1px border and tight inner padding, holding 2-4 side-by-side buttons. The **selected** button is a raised white pill (dark-teal in dark mode) with brand-teal text and a subtle drop shadow; the **unselected** buttons are flat/transparent with muted neutral text that darkens on hover. Each button shows a small **12px icon** (List-bars or org-chart tree) followed by a short label. It usually lives in a toolbar / tab-bar corner and flips the *layout* of the content below (List ⇄ Tree, Grid ⇄ List). It is NOT a full tab bar with underline — it is the compact "view switcher" chip.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<ToggleButtonGroup exclusive>` of `<ToggleButton>` | Closest match — exclusive selection, icon+label buttons. Falcon bakes the active-pill look + i18n. |
| Ant Design | `<Segmented>` | Near 1:1 — Ant's `Segmented` IS the segmented-pill view switcher. Falcon adds per-option icon + translated label. |
| PrimeNG | `<p-selectButton>` (single) | Equivalent exclusive segmented control. Falcon replaced Prime usage with this pure-Angular component. |
| Bootstrap | `.btn-group` with radio buttons (`.btn-check`) | Same idea via radio inputs; Falcon is purpose-built + tokenized. |
| Radix / shadcn | `<ToggleGroup type="single">` / `<Tabs>` (pill style) | shadcn ToggleGroup single = this; or Tabs styled as pills. |
| plain HTML | a `<div role="tablist">` of `<button role="tab">` | Exactly the markup this component emits — replace with `<falcon-view-toggle>`. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a compact 2-4 option **view-mode switcher** (List/Tree, Grid/List) | `<falcon-view-toggle>` | — |
| a tab bar with sliding underline + content panels per tab | `<falcon-angular-tabs>` (mode `navigation`) | view-toggle |
| icon/title/description **radio cards** to pick one | `<falcon-angular-tabs>` (mode `radio-cards`) or `<falcon-angular-radio>` | view-toggle |
| a **form** single-choice value to submit | `<falcon-angular-radio>` (has CVA) | view-toggle (no CVA) |
| a boolean on/off | `<falcon-angular-switch>` | view-toggle |
| >4 options or overflowing options | a dropdown/select | view-toggle (no overflow) |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.

1. **Inputs** — provide `[options]` (array of `{ key, labelKey, icon?|iconSvg? }`) and bind `[(value)]` (or one-way `[value]`+`(valueChange)` for a vetoable switch). That is the entire surface.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — none (no `<ng-content>`). Per-option icon/label is fully data-driven.
4. **Variants** — none today (no `size`/`appearance`). If the design needs a larger size, that is GAP G2 — raise it, don't hand-roll.
5. **Token override** — none available (no token file — GAP G6). For a different active color you'd have to upstream a token contract.
6. **Upgrade** — need `disabled`, a `size`, or a non-teal active color? Those are GAPs G2/G3/G6 — raise them rather than forking.
7. **Wrapper** — don't wrap; consume directly. The only legitimate composition is feeding it a typed `options` const.

## Anti-patterns

- Passing literal display strings as `labelKey` — they are piped through `translate`; pass i18n keys (and add to `en.json` + `ar.json`).
- Using `[(value)]` when the change must be vetoable — two-way commits immediately; use one-way `[value]`+`(valueChange)` (the org-hierarchy pattern).
- Expecting it to work as a `formControlName` — no CVA; use `<falcon-angular-radio>` for form selection.
- Hand-rolling `<svg>` icons in the consumer — extend the component's icon support instead.
- Adding consumer `.component.css` rules to target the inner pills — breaks the shared-style + no-SCSS rules; there is no token-override path.
- Inline `<svg>` with raw `rgba()` shadows in the consumer — the component already (regrettably) hardcodes one; don't add more (and don't copy that pattern — see GAP G7).
- Feeding 6+ options or long labels — no overflow handling; the pills will wrap awkwardly.
- Renaming the state `key`s to match the labels — keys are intentionally decoupled (`tree`/`chart` vs List/Tree).

## Verification
🟡 CODE-DERIVED from `falcon-view-toggle.component.ts` + `.html` + the live `STRUCTURE_OPTIONS` usage. Sibling routing table cross-checked against `OVERVIEW.md` "When NOT to use it" + the shared-ui barrel. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge (MUI ToggleButtonGroup / Ant Segmented / Prime SelectButton).
