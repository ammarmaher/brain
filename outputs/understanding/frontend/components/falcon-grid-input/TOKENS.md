# falcon-grid-input — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/grid-input.tokens.css` (~22 lines — **2 tokens only**).

The selector is the gate-12-compliant `:where(falcon-grid-input, falcon-grid-input-tw, falcon-angular-grid-input, .falcon-grid-input, [data-falcon-grid-input])` (`[CODE]` grid-input.tokens.css:15). **Not on `:root`** → passes gate-12.

## Token categories (1 declared — corrects prior "6 categories" claim)

Only **one** category exists, and both its tokens are currently **orphan** (declared, never read):

1. **CELL FOCUS** (`[CODE]` grid-input.tokens.css:19-20):
   - `--falcon-grid-input-focus-ring-color: var(--color-falcon-primary-400, #60a5fa);`
   - `--falcon-grid-input-focus-ring-width: 2px;`

> **Finding (orphan tokens):** the Shadow CSS (`[CODE]` falcon-grid-input.css) contains only `:host { display:block }` and `.falcon-grid-input-root { display:block }` — it does **not** reference either focus-ring token. The Tailwind helper (`falconGridInputRootClasses()`) returns `'block w-full'` and reads no token. So `--falcon-grid-input-focus-ring-color`/`-width` are **dead/orphan** today — overriding them has no visual effect. The cell's actual focus ring is the inherited `--falcon-input-*` focus ring (variant `grid`). Safe-local: either wire the tokens into a rule (active-cell ring) or delete them.

> **Finding (palette):** `--falcon-grid-input-focus-ring-color` references `--color-falcon-primary-400` (`[CODE]` grid-input.tokens.css:19), but Falcon has **no `primary` palette family** → the var is undefined and the literal `#60a5fa` blue is the effective value. Same `primary` miss as search-input's spinner. Safe-local fix: repoint to `--color-falcon-teal-400` (brand) if/when the ring is actually wired.

> **Correction (drift):** the prior dossier listed 6 categories (CONTAINER / BACKGROUND / BORDER / TEXT / FOCUS RING / MOTION) and named `--falcon-grid-input-bg`, `--falcon-grid-input-border-color`, `--falcon-grid-input-text-color`, `--falcon-grid-input-bg-disabled`, `-error`, `-dirty`. **None of those tokens exist.** The background, border, text, radius, motion, disabled visuals are all the composed `<falcon-input variant="grid" size="sm">` primitive → driven by `--falcon-input-*`.

## Related Falcon theme tokens (the FIELD, inherited via composed input)

| Falcon theme token (via `--falcon-input-*`, variant=grid size=sm) | Used by grid-input via |
|---|---|
| `--falcon-input-bg`, `--falcon-input-bg-disabled` | Cell background. |
| `--falcon-input-border-color-{idle,focus,disabled}` | Cell border. |
| `--falcon-input-shadow-focus`, `--falcon-input-ring-*` | Cell focus halo. |
| `--falcon-input-height-sm`, `--falcon-input-padding-x-sm` | Compact grid sizing (size pinned `sm`). |
| `--falcon-input-text-color` | Cell text. |
| `--color-falcon-teal-400` | **Recommended** active-cell ring colour (not currently wired). |

## Tailwind utility guidance for this component

The helper `libs/falcon-ui-core/src/tailwind/grid-input-tailwind-classes.ts` exports `falconGridInputRootClasses()` returning `'block w-full'` (`[CODE]` :11-13). It is **unused even by the `-tw` twin**, which inlines `'block w-full'` directly (`[CODE]` falcon-grid-input-tw.tsx:120) — a dead export (finding). Consumers should add cell layout via `class=` on the wrapper.

## Dark mode support

Token-driven via the composed input (neutrals invert, brand teal stays). The orphan ring token's `#60a5fa` fallback would be a fixed blue in dark mode if ever wired. No per-instance dark override needed.

## Density support

Field height is pinned to `--falcon-input-height-sm` (size `sm`) — grid-input does not expose a `size` input, so it does not track table row-height density automatically. To fit a taller/shorter row, override `--falcon-input-height-sm` on a host class.

## RTL support

Field direction follows the composed `<falcon-input>` (logical-side aware). grid-input adds no directional CSS of its own (root is `display:block`). 🟡 NOT runtime-verified RTL end-to-end.

## Static style risks

- `[CODE]` `falcon-grid-input.css` (Shadow) is layout-only (`display:block`) — no hex/px colour, **no risk**.
- `[CODE]` `falcon-grid-input-tw.tsx:120` inlines `'block w-full'` — Tailwind utilities, no risk.
- The only raw hex is the `#60a5fa` fallback behind a non-existent palette var (orphan + palette-miss findings above).

## No CSS / no SCSS guidance

- Per-instance overrides MUST mutate `--falcon-input-*` (the field) via a host class — NOT a `--falcon-grid-input-*` token (those are orphan today). Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle (cell) | `--falcon-input-bg`, `--falcon-input-border-color`, `--falcon-input-text-color` (inherited). |
| Focus (cell) | `--falcon-input-border-color-focus`, `--falcon-input-shadow-focus`, `--falcon-input-ring-*` (inherited). The two `--falcon-grid-input-focus-ring-*` tokens are NOT consumed. |
| Disabled (cell) | `--falcon-input-bg-disabled`, `--falcon-input-border-color-disabled`, `--falcon-input-text-color-disabled` (inherited). |
| Error / Success / Warning / Dirty | **None** — grid-input forwards no `state`; no error/dirty visuals exist (GAP G2/G6). |

## Verification
🟢 code-verified against `grid-input.tokens.css` + `falcon-grid-input.css` + `grid-input-tailwind-classes.ts` + `falcon-grid-input-tw.tsx` (read 2026-06-03). Orphan focus-ring tokens, `primary`-palette miss, dead helper export, field-via-`--falcon-input-*` ✅ source-verified. Corrects prior TOKENS.md fictional 6-category set.
