# falcon-popup — TOKENS

## Token file
**None.** `[CODE]` Unlike every other Falcon UI overlay (dialog/drawer have dedicated `*.tokens.css`), popup has **NO dedicated token CSS file** (GAP G-TOKENS). Its inline template uses Falcon palette tokens DIRECTLY through Tailwind utility classes.

## Where the paint lives
`[CODE]` falcon-popup.component.ts — three sources:
1. **Inline-template Tailwind utilities** — `bg-falcon-neutral-0`, `text-falcon-red-700`, `ring-falcon-neutral-200`, `shadow-2xl`, etc. (the bulk of the chrome).
2. **Inline `styles: [...]` decorator block (ts:215-289)** — the `falconPopupIn` 180ms scale-in keyframe; the native `<dialog>.falcon-popup-dialog` reset + flex-centring (`display:flex; align-items:center; justify-content:center; padding:1.5rem; inset:0; width/height:100%`); and the `::backdrop` dim — `rgba(13,63,68,0.25)` default + `rgba(13,63,68,0.20)` + `backdrop-filter: blur(8px) saturate(1.5)` for `.is-glossy`. These are **literal rgba/timing values**, NOT token refs (DRIFT-BACKDROP-LITERAL — `safe-local`).
3. **Computed class strings (ts:359-384)** — `iconChipClasses()` returns per-intent palette utilities (`bg-falcon-red-50 ring-falcon-red-200 text-falcon-red-700`, etc.).

## Related Falcon theme tokens (palette families consumed)

| Palette family | Used for |
|---|---|
| `falcon-red-{50,200,700}` | Danger intent (error / delete) icon chip + stroke |
| `falcon-amber-{50,200,700}` | Warning intent (unsaved) icon chip + stroke |
| `falcon-green-{50,200,700}` | Success intent (save) icon chip + stroke |
| `falcon-teal-{50,200,700}` | Primary intent (info default) icon chip + stroke |
| `falcon-neutral-{0,50,100,200,500,700,900}` | Surface, text, borders, header/footer/close-button |

## Tailwind utility guidance
- The component is Tailwind-direct — no escape hatch for normal styling.
- For brand styling, override the palette in the global theme. There is no per-instance token knob beyond `glossy`/`iconBg`/`iconColor`.

## Dark mode support
- Neutrals invert via the global `.app-dark` map → panel surface flips dark.
- Glossy gradient `from-falcon-neutral-0/85 to-falcon-neutral-0/75` (ts:121) becomes dark when `falcon-neutral-0` flips.
- The `::backdrop` uses literal `rgba(13,63,68,…)` so it does NOT adapt to dark — it stays teal-tinted (acceptable; the dialog backdrop behaves the same).

## Density support
None. `[CODE]` ts:118 — fixed dimensions: `max-w-md` (28rem / 448px), `min-h-[18rem] max-h-[22rem]` (288–352px), fixed paddings (`px-6 py-3` header/footer, `px-6 py-5` body).

## RTL support
- Symmetric layout (icon chip + title in header, centered body, `justify-end` footer).
- Footer `justify-end` works under RTL via flex logical alignment.
- No per-direction overrides.

## Static style risks
- `[CODE]` ts:252-272 — the native `<dialog>.falcon-popup-dialog` reset + flex-centring is INLINE in `styles:`. Acceptable scope (it replaces the pre-migration `.fixed inset-0 grid place-items-center` wrapper) but it's component-scoped CSS, not a token.
- `[CODE]` ts:276-283 — the `::backdrop` dim/blur uses **literal** `rgba(13,63,68,0.25)` / `0.20` + `blur(8px) saturate(1.5)` — not token-driven (DRIFT-BACKDROP-LITERAL).
- `[CODE]` ts:217-229 — the `falconPopupIn` keyframe is inline `styles:`, not a motion token.
- `[CODE]` ALL chrome paint is hardcoded Tailwind utilities — no per-instance token customisation without source changes.
- `[CODE]` ts:60 `shadow-2xl` is a **Tailwind default**, NOT a `--shadow-falcon-*` token (the dialog/drawer use a Falcon shadow value).

## No CSS / no SCSS guidance
- No external CSS file.
- The `styles: []` decorator entry holds the keyframe + native-`<dialog>` reset + `::backdrop` — acceptable scope, but the literals are the documented gap.

## Token usage cheat-sheet (verbatim from source 2026-06-03)

| Concern | Source |
|---|---|
| Backdrop fill (default) | `dialog.falcon-popup-dialog::backdrop { background: rgba(13,63,68,0.25) }` (ts:276-279) |
| Backdrop fill (glossy) | `.is-glossy::backdrop { background: rgba(13,63,68,0.20); backdrop-filter: blur(8px) saturate(1.5) }` (ts:280-283) |
| Panel surface (glossy) | `bg-gradient-to-b from-falcon-neutral-0/85 to-falcon-neutral-0/75 backdrop-blur-xl backdrop-saturate-150` (ts:121) |
| Panel surface (flat) | `bg-falcon-neutral-0` (ts:122) |
| Panel ring | `ring-1 ring-falcon-neutral-200` (ts:118) |
| Panel shadow | `shadow-2xl` (Tailwind default — NOT a Falcon token) (ts:118) |
| Icon chip (danger) | `bg-falcon-red-50 ring-falcon-red-200 text-falcon-red-700` (ts:363,376) |
| Icon chip (warning) | `bg-falcon-amber-50 ring-falcon-amber-200 text-falcon-amber-700` |
| Icon chip (success) | `bg-falcon-green-50 ring-falcon-green-200 text-falcon-green-700` |
| Icon chip (primary) | `bg-falcon-teal-50 ring-falcon-teal-200 text-falcon-teal-700` |
| Title | `text-lg font-semibold text-falcon-neutral-900` (ts:166) |
| Body | `text-sm text-falcon-neutral-700` (ts:186) |
| Hint | `text-xs text-falcon-neutral-500` (ts:188) |
| Close × button | `border border-falcon-neutral-500 bg-falcon-neutral-0 text-falcon-neutral-500 hover:bg-falcon-neutral-100 hover:text-falcon-neutral-900` (ts:175) |
| Footer bg (glossy) | `bg-falcon-neutral-0/25` (ts:193) |
| Footer bg (flat) | `bg-falcon-neutral-50` (ts:193) |
| Footer border | `border-t border-falcon-neutral-200/60` (ts:192) |

## Per-instance override
**Not possible** today without source changes. Only `glossy` / `iconBg` / `iconColor` are knobs (each with a `FalconConfigurationService` default fallback).

## Future-token recommendation (GAP G-TOKENS)
Introduce `libs/falcon-ui-tokens/src/components/popup.tokens.css` scoped under `:where(falcon-angular-popup, .falcon-popup, [data-falcon-popup])` with per-variant accent/chip/surface + motion + backdrop tokens, then refactor the inline template to arbitrary-value token utilities (`bg-[var(--falcon-popup-panel-bg)]`). This would also let the `::backdrop` literals become token-driven + dark-mode-aware.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) — no token file confirmed (Glob clean); cheat-sheet re-anchored to the 416-line source (glossy gradient `from-…/85 to-…/75`, backdrop `rgba(13,63,68,0.25)`/`0.20`, `shadow-2xl` is Tailwind default). The native-`<dialog>` reset + `::backdrop` literals (inline `styles:`) are the documented static-style risk.
