# falcon-radio-group — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/radio-group.tokens.css` (**22 lines** — recount 2026-06-03).

`[CODE]` Scoped under a single `:where(...)` that — notably — covers BOTH the group selectors AND the lone-radio selectors: `:where(falcon-radio-group, falcon-radio-group-tw, falcon-angular-radio-group, .falcon-radio-group, [data-falcon-radio-group], falcon-radio, falcon-radio-tw, falcon-angular-radio, .falcon-radio)` (line 7). The radio inclusion lets a stray `--falcon-radio-accent` resolve on a lone radio. Specificity 0 — **gate-12 compliant** (NOT `:root`).

> **Important:** this token file only DECLARES variables — it ships no rule-set. The group's *visual* layout on the Angular path comes from the wrapper's plain `<div>` class names (`falcon-radio-group-options`, `is-vertical`, …), which have **no backing stylesheet on the Light path** (the Shadow CSS at `falcon-radio-group.css` only styles the orphaned Stencil element). So many `--falcon-radio-group-*` tokens are effectively consumed only by the orphaned Stencil group. See GAPS G2.

## Token categories (declared in radio-group.tokens.css)

`[CODE]` 1 `:where()` block, ~13 vars:
1. SPACING — `--falcon-radio-group-gap` (8px), `--falcon-radio-group-option-gap` (8px), `--falcon-radio-group-option-gap-horizontal` (16px).
2. GROUP LABEL — `--falcon-radio-group-label-font-family / -font-size (13px) / -font-weight (500) / -fg` (neutral-700).
3. REQUIRED — `--falcon-radio-group-required-fg` (red-500).
4. HELPER / ERROR — `--falcon-radio-group-helper-fg` (neutral-500), `--falcon-radio-group-error-fg` (red-700).
5. ACCENT — `--falcon-radio-accent` (teal-700) — used by the `-tw` Stencil group's native `accent-[var(--falcon-radio-accent,#124c52)]` (falcon-radio-group-tw.tsx:108), NOT by the Angular path.

> The richer group spacing/orientation knobs in `radio.tokens.css` category 12 (`--falcon-radio-group-gap-vertical/horizontal`, group-label color/font) are a SEPARATE set declared on the radio token file; this group token file is the Wave-9.F addition.

## Related Falcon theme tokens

| Falcon theme token | Used by group via |
|---|---|
| `--color-falcon-neutral-700` | Group label fg. |
| `--color-falcon-red-500 / 700` | Required marker / error text. |
| `--color-falcon-neutral-500` | Helper text. |
| `--color-falcon-teal-700` | `--falcon-radio-accent` (native `accent-color` on the `-tw` group). |
| `--font-sans` | Group-label family. |

Child radios use their OWN `--falcon-radio-*` tokens (see the `falcon-radio` TOKENS dossier) — those are what visibly render on the Angular path.

## Tailwind utility guidance for this component

`[CODE]` Host `class=` for layout, and — because the wrapper's option-container classes are unstyled on the Light path — consumers currently add arbitrary-variant utilities targeting `.falcon-radio-group-options` (see USAGE Example 1). The `radio-group-tailwind-classes.ts` helper (`falconRadioGroupOptionsClasses`) exists but is not wired into the Angular wrapper.

## Dark mode support

Token-driven (neutrals/red invert via the theme layer). The child radios carry their own dark behavior.

## Density support

`--falcon-radio-group-option-gap` shifts the gap between options — but only takes visible effect on the Angular path once the wrapper classes get a backing rule (G2).

## RTL support

Horizontal orientation flips option order under `[dir='rtl']` via flex `flex-row` + gap (no left/right); vertical is unaffected. The group label uses `margin-inline-start` for the required asterisk.

## Static style risks

- `[CODE]` `radio-group.tokens.css` is variable-declarations only — no rules, no literals-as-rules, no risk.
- `[CODE]` `falcon-radio-group.css` (Shadow, 52 ln) is token-only with structural literals (`gap`, `margin: 4px 0 0`); it only applies inside the orphaned Stencil group's Shadow DOM.
- `[CODE]` `falcon-radio-group-tw.tsx` uses raw Tailwind literals (`text-[13px]`, `mb-1`, `gap-2`, `text-falcon-red-500`) rather than tokens for its layout — but that twin is orphaned by the Angular layer too.

## No CSS / no SCSS guidance

- Until G2 lands, supply the group's option layout via a host `class` (arbitrary-variant utilities) rather than SCSS.
- Override child-radio visuals via `--falcon-radio-*` token overrides on a host class.

## Token usage by state

| State | Token(s) consumed (Angular path) |
|---|---|
| Group label | `--falcon-radio-group-label-fg`, `-font-size`, `-font-weight`, `-font-family` (only if the wrapper classes get a backing rule — G2) |
| Required | `--falcon-radio-group-required-fg` |
| Helper | `--falcon-radio-group-helper-fg` |
| Error | `--falcon-radio-group-error-fg` |
| Option layout | `--falcon-radio-group-option-gap` / `-option-gap-horizontal` (G2-gated) |
| Each option (visible) | the child radio's `--falcon-radio-*` tokens |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 22 lines, `:where()` scope (incl. radio selectors + `--falcon-radio-accent`) confirmed gate-12 compliant. Corrected prior dossier: documented that the file is declarations-only and that the group's own classes have no Light-DOM backing rule (so most group tokens drive only the orphaned Stencil group).
