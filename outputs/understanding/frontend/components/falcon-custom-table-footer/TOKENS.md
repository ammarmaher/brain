# falcon-custom-table-footer — TOKENS

## Component token file

**NONE.** `[CODE]` There is no `libs/falcon-ui-tokens/src/components/custom-table-footer.tokens.css` (and no `falcon-table-footer.tokens.css`). The component declares no `styleUrl` and no `:where()` token block. This is expected for an Angular-only composite — it inherits the table + theme contracts rather than minting its own.

## What it actually consumes

`[CODE]` falcon-custom-table-footer.component.html — the footer styles itself with a mix of ONE table token + Tailwind theme utilities:

| Source | Used for |
|---|---|
| `--falcon-table-row-height` (`[CODE]` table.tokens.css:109 = `52px`) | Band height: `h-[var(--falcon-table-row-height)]` (html:9). Reusing the table row-height keeps the footer band the same height as a table row. |
| `bg-falcon-neutral-30` | Footer band background (theme utility, html:9). |
| `text-falcon-neutral-600` | Footer text + label color (html:9/34). |
| `text-[12px]` | Footer + select font size (literal — see Static style risks). |
| `border-falcon-neutral-200` | Rows-per-page `<select>` border (html:36). |
| `bg-falcon-neutral-0` | `<select>` background (html:36). |
| `text-falcon-neutral-800` | `<select>` text (html:36). |
| `focus:border-falcon-teal-700` | `<select>` focus border (html:36). |
| `opacity-60` | Disabled-state dim (html:11). |
| `disabled:opacity-50` | `<select>` disabled dim (html:36). |
| host `class: 'block w-full'` | `[CODE]` component.ts:22 — block-level full-width host. |

> The center nav cluster (`<falcon-angular-paginator>`) is styled by the **paginator** token contract (`--falcon-paginator-*`) — see the falcon-paginator TOKENS dossier. This footer adds no paginator overrides.

## Related Falcon theme tokens

The Tailwind utilities above resolve to: `--color-falcon-neutral-30 / 0 / 200 / 600 / 800` and `--color-falcon-teal-700`. All inherited from the master theme (`falcon-tailwind-tokens.css`); the footer mints none.

## Tailwind utility guidance for this component

`[CODE]` The footer IS hand-written Tailwind utilities in its template (it is an app-layer composite, not a Stencil component with a class-builder helper). The 3-section layout uses `grid grid-cols-3 items-center` with `justify-self-{start,center,end}` per region (html:8/15/20/33). Consumers should NOT add bespoke colour utilities — the band reuses theme neutrals.

## Dark mode support

`[INFERRED]` Inherits the theme dark-mode neutral/teal flips through the `bg-falcon-neutral-*` / `text-falcon-neutral-*` utilities (no per-footer override exists). **NOT verified end-to-end — flag for theme agent.** `bg-falcon-neutral-30` is a very light surface that must flip to a dark surface under `.app-dark`; verify the `neutral-30` shade has a dark-mode value.

## Density support

`[CODE]` Indirect — because the band height reads `--falcon-table-row-height`, a table density that swaps to `--falcon-table-row-height-compact` (40px, table.tokens.css:110) would NOT automatically apply here (the footer hardcodes the non-compact token). `safe-local` (minor density gap).

## RTL support

`[CODE]` The 3-section grid uses logical `justify-self-{start,end}` so the "Showing" block and the "Rows per page" block swap sides in RTL automatically. The `<select>` padding `pr-6` is a PHYSICAL property (`[CODE]` html:36) — in RTL the caret-clearance padding lands on the wrong side. **GAP** — should be `pe-6`. `safe-local`.

## Static style risks

- `[CODE]` html:9/36 — **two literal `text-[12px]`** font-size utilities instead of a token (`--text-xs` / a `--falcon-font-size-*`). Minor token-discipline miss. `safe-local`.
- `[CODE]` html:36 — the `<select>` uses literal `h-7`, `px-2`, `pr-6`, `rounded-sm` Tailwind scale utilities (not paginator/table tokens). Because it is a native `<select>` (not a Falcon atom), it is hand-styled. `safe-local`.
- `[CODE]` html:36 — `pr-6` is physical (RTL risk, above).
- No hex/rgb literals; no inline `style=`.

## No CSS / no SCSS guidance

- No `.component.css`/`.scss` exists (and none should be added — Tailwind-only).
- Band sizing via `--falcon-table-row-height`; colours via theme neutral utilities.
- Replace the two literal `text-[12px]` with a font-size token when the native `<select>` is migrated to `<falcon-angular-dropdown>` (which carries its own tokens).

## Token usage by region

| Region | Styling source |
|---|---|
| Band container | `--falcon-table-row-height` + `bg-falcon-neutral-30` + `text-falcon-neutral-600` + `text-[12px]` (literal) |
| LEFT "Showing X - Y from Z" | inherits band text utilities |
| CENTER nav cluster | `<falcon-angular-paginator size="sm">` → `--falcon-paginator-*` tokens |
| RIGHT rows-per-page | `<label>` (`text-falcon-neutral-600`) + native `<select>` (literal `h-7`/`px-2`/`pr-6`/`rounded-sm` + `border-falcon-neutral-200`/`bg-falcon-neutral-0`/`text-falcon-neutral-800`/`focus:border-falcon-teal-700`/`disabled:opacity-50`) |
| Disabled state | `pointer-events-none opacity-60` (band) + `[disabled]` (paginator + select) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED) against falcon-custom-table-footer.component.html + table.tokens.css:109. Confirmed: NO own token file, reuses `--falcon-table-row-height` + theme neutral utilities. Flagged `safe-local`: two literal `text-[12px]`, native-`<select>` literal scale utilities, `pr-6` RTL physical-padding, and the non-compact band-height density gap. Dark-mode 🟡 inferred (flag for theme agent).
