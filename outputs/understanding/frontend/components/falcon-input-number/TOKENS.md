# falcon-input-number — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/input-number.tokens.css` (**~18 lines** — thin; recount 2026-06-03). Scoped `:where(falcon-input-number, falcon-input-number-tw, falcon-angular-input-number, .falcon-input-number, [data-falcon-input-number])` — **gate-12 compliant**.

## Token categories (`[CODE]` exact contents)

The numeric FIELD has **no own tokens** — it inherits the full `--falcon-input-*` contract (the Stencil layer composes `<falcon-input(-tw)>`). The token file declares only:

1. SPINNER + LAYOUT — `--falcon-input-number-gap` (4px, input↔spinner), `--falcon-input-number-spinner-size` (32px), `-spinner-radius` (6px), `-spinner-bg` (neutral-100), `-spinner-fg` (neutral-700), `-spinner-border` (neutral-200), `-spinner-hover-bg` (neutral-150).
2. ICON — `--falcon-input-number-icon-color` defers to `--falcon-input-icon-color`.

> ⚠️ `[CODE]` There are NO `prefix`/`suffix`/`currency-symbol` tokens (prior dossier's "when implemented" categories were speculative — currency is Intl-rendered, no token). And NO `-spinner-color`/`-spinner-bg-hover`/`-spinner-color-disabled`/`-spinner-width` tokens (those names in the old TOKENS table do NOT exist).
> ⚠️ `[CODE]` The **Shadow** `<falcon-input-number>` CSS reads these spinner tokens; the **Tailwind** `-tw` twin **hardcodes** `bg-falcon-neutral-100 text-falcon-neutral-700 border-falcon-neutral-200 hover:bg-falcon-neutral-150` inline (tw.tsx:331/347) — bypassing the tokens. Token override only affects the Shadow spinner. (Parity GAP.)

## Related Falcon theme tokens

Field inherits ALL input theme tokens (`--color-falcon-neutral-*`, `-teal-500`, density, radius). Currency rendering is `Intl.NumberFormat` runtime, not tokens.

## Tailwind utility guidance

`rootClass`, `inputClass`. Layout via host class.

## Dark mode

Token-driven (input + button inheritance).

## Density

Inherits input density.

## RTL

Native `<input type=text>` (the wrapper renders a generic input with inputmode) respects `dir`. Intl formatting yields RTL-friendly numerals automatically when `locale` is Arabic.

## Static style risks

- `[CODE]` Currency symbol position is locale-driven via Intl, not token-controlled — correct.
- `[CODE]` ⚠️ The `-tw` spinner buttons use **hardcoded Tailwind palette utilities** (`bg-falcon-neutral-100` etc.) instead of `var(--falcon-input-number-spinner-*)`. These ARE Falcon-palette utilities (not raw hex, so not a hex-ban violation) but they break token-runtime mutation parity with the Shadow path. The standalone `falconInputNumberSpinnerClasses()` helper (input-number-tailwind-classes.ts) carries a near-identical string but is **unused** (DRY/drift). `safe-local`.
- Shadow CSS `falcon-input-number.css` uses `var(--token, palette-fallback)` for every spinner value — clean.

## No CSS / no SCSS

Per-instance via input + button token overrides.

## Token usage by state (`[CODE]` real tokens only)

| State | Tokens |
|---|---|
| Input field (all states) | inherits the full `--falcon-input-*` contract |
| Spinner button idle | `--falcon-input-number-spinner-bg`, `-spinner-fg`, `-spinner-border` |
| Spinner button hover | `--falcon-input-number-spinner-hover-bg` (Shadow only; `-tw` hardcodes `hover:bg-falcon-neutral-150`) |
| Spinner button disabled | none — `.falcon-input-number-spinner:disabled { opacity: 0.4 }` (Shadow CSS literal) / `disabled:opacity-40` (`-tw`) |
| Spinner geometry | `--falcon-input-number-spinner-size`, `-spinner-radius`, `--falcon-input-number-gap` |
| Disabled input | `--falcon-input-bg-disabled` (inherited) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01). Token file (~18 ln) read in full; speculative prefix/suffix/currency + nonexistent `-spinner-color`/`-bg-hover`/`-width` categories removed; `-tw` spinner hardcode + unused helper documented.
