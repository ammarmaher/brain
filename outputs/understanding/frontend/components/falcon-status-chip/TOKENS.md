# falcon-status-chip — TOKENS

> **Single-render Angular shared-ui component — NO component token file.** Unlike the gold `falcon-input` (which has `libs/falcon-ui-tokens/src/components/input.tokens.css` with ~70 `--falcon-input-*` vars on a `:where()` scope), `falcon-status-chip` has **no `*.tokens.css` file at all**. It styles itself with Tailwind utility classes (`bg-falcon-*` / `text-falcon-*` / `py-*` / `rounded-full` …) computed in the component, which resolve to the **Falcon theme color tokens** declared in `libs/falcon-theme/`. This is the normal pattern for `libs/falcon/src/shared-ui` single-render components and is stated explicitly here per the B24 sweep brief.

## Component token file

**None.** `[CODE]` No file under `libs/falcon-ui-tokens/src/components/` for this component (Glob 2026-06-03). No `--falcon-status-chip-*` variable namespace exists. There is also **no gate-12 `:where()` scope to audit** — there is no token CSS to scope.

## Token categories

**N/A (no component tokens).** The chip's visual axes are all driven by hardcoded Tailwind utilities in `STATUS_TOKENS` + the `*Classes()` computeds:

| Visual axis | How it is expressed | Source |
|---|---|---|
| Pill background (filled) | `bg-falcon-{green-50 / amber-50 / red-100 / neutral-100}` | `[CODE]` ts:40-75 `STATUS_TOKENS[*].bg` |
| Text color | `text-falcon-{green-700 / amber-700 / red-700 / neutral-500}` | `[CODE]` `STATUS_TOKENS[*].text` |
| Dot color | `bg-falcon-{green-500 / amber-500 / red-500 / neutral-400}` | `[CODE]` `STATUS_TOKENS[*].dot` |
| Pill padding (filled) | `py-0.5 px-2.5` (sm) / `py-1 px-3` (md) | `[CODE]` ts:116 |
| Pill shape | `rounded-full` | `[CODE]` ts:118 |
| Font weight | `font-medium` (filled) / italic (text) | `[CODE]` ts:118 / ts:95 |
| Font size | `text-2xs`(sm-filled) / `text-xs`(md-filled) / `text-3xs`(sm-text) / `text-2xs`(md-text) | `[CODE]` ts:116,126 |
| Dot size | `w-1 h-1`(sm) / `w-1.5 h-1.5`(md); text-variant dot fixed `w-1.5 h-1.5` | `[CODE]` ts:131 / ts:97 |
| Layout | host `inline-flex`; filled `inline-flex items-center gap-1.5 leading-none whitespace-nowrap` | `[CODE]` ts:83,118 |

## Related Falcon theme tokens (from `falcon-theme`)

`[CODE]` The `bg-falcon-*` / `text-falcon-*` utilities resolve to these Falcon palette tokens (declared in `libs/falcon-theme/src/falcon-tailwind-tokens.css`):

| Falcon theme token (utility) | Used by the chip for |
|---|---|
| `--color-falcon-green-50 / 500 / 700` | `approved` bg / dot / text |
| `--color-falcon-amber-50 / 500 / 700` | `pending` + `review` bg / dot / text |
| `--color-falcon-red-100 / 500 / 700` | `rejected` + `deleted` bg / dot / text |
| `--color-falcon-neutral-100 / 400 / 500` | `none` bg / dot / text |
| `--color-falcon-neutral-900`, `--color-falcon-neutral-0` | (consumer's adjacent name text in the checker sub-line, not the chip itself) |

Because the chip reads the palette through the standard utilities, a runtime theme update to `--color-falcon-*` flows through automatically (`[CODE]` ts:5-7 header comment makes this the design intent).

## Tailwind utility guidance for this component

- The chip's own classes are computed internally — **do not hand-roll competing Tailwind classes** on the host expecting to recolor the inner pill (`bg-*` on the host `<falcon-status-chip>` element styles the host box, not the inner `<span>`).
- For layout only (alignment / margin inside a cell), the host `class=` works:

```html
<falcon-status-chip class="ms-2 align-middle" [status]="row.status" />
```

## Dark mode support

`[CODE]` **No dedicated dark-mode rules in the component.** It relies on the Falcon palette tokens; whatever `--color-falcon-{green,amber,red,neutral}-*` resolve to under `.app-dark` applies. The chip itself adds no `dark:` variants. (Note: the adjacent consumer name text DOES use `dark:text-falcon-neutral-0` — but that is consumer markup, not the chip.)

> `[INFERRED]` In dark mode the `*-50`/`*-100` tint backgrounds may need verification for contrast against a dark canvas — the chip does not flip to a dark-surface tint the way `<falcon-status-badge>`'s token file can. Flag for the theme owner (G-DARK-1). Not verified end-to-end this pass.

## Density support

**None.** Only `sm` / `md`. There is no density-token linkage (no `--falcon-density-*` aliases like `falcon-input` uses) — sizes are literal Tailwind padding/text utilities.

## RTL support

`[CODE]` **RTL-safe.** The `text` variant's dot uses the logical margin utility `me-1` (`[CODE]` ts:97); the filled variant uses `gap-1.5` flex (direction-agnostic). The host is `inline-flex`. No physical `ml-`/`mr-` left in the chip. Page direction handles the rest.

## Static style risks

- `[CODE]` **No hex / px literals, no inline `style=`** — every value is a Tailwind utility token (`text-2xs`, `bg-falcon-green-50`, `py-0.5`, `rounded-full`, `w-1.5`). Clean per the no-hex/no-px house rule.
- `[CODE]` The `text`-variant dot ignores `size` (fixed `w-1.5 h-1.5`) while the filled dot honors it — a tiny inconsistency, not a literal risk (G4).
- No SCSS, no component CSS file — fully compliant with no-SCSS.

## No CSS / no SCSS guidance

- Compliant — the component has no stylesheet; all visuals are template-inline Tailwind utilities.
- Do NOT introduce a `.scss`/`.css` file or a `--falcon-status-chip-*` token file to "tweak" it — if recoloring or a new status is needed, extend the `STATUS_TOKENS` record (the documented one-line-append path, ts:26-27).

## Token usage by state

| State (status) | Utilities consumed |
|---|---|
| `approved` | `bg-falcon-green-50`, `text-falcon-green-700`, `bg-falcon-green-500` (dot) |
| `pending` | `bg-falcon-amber-50`, `text-falcon-amber-700`, `bg-falcon-amber-500` (dot) |
| `review` | `bg-falcon-amber-50`, `text-falcon-amber-700`, `bg-falcon-amber-500` (dot) — identical to `pending`, different label |
| `rejected` | `bg-falcon-red-100`, `text-falcon-red-700`, `bg-falcon-red-500` (dot) |
| `deleted` | `bg-falcon-red-100`, `text-falcon-red-700`, `bg-falcon-red-500` (dot) — identical to `rejected`, different label |
| `none` | `bg-falcon-neutral-100`, `text-falcon-neutral-500`, `bg-falcon-neutral-400` (dot) |

> Loading / hover / focus / disabled: **none** — the chip has no interaction states (display-only).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Confirmed NO component token file (`libs/falcon-ui-tokens` Glob clean) and NO stylesheet; all visual values are Tailwind utilities sourced from `STATUS_TOKENS` + the `*Classes()` computeds in `falcon-status-chip.component.ts`. Palette-token mapping 🟡 CODE-DERIVED (utility → `--color-falcon-*` is the standard Falcon-theme contract; the theme file was not re-read line-by-line this pass). Dark-mode contrast 🔴 INFERRED — flagged G-DARK-1.
