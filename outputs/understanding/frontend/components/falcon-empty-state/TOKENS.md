# falcon-empty-state — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/empty-state.tokens.css` (**56 lines** — counted 2026-06-03).

`[CODE]` Scoped under `:where(falcon-empty-state, falcon-empty-state-tw, falcon-angular-empty-state, .falcon-empty-state, [data-falcon-empty-state])` (empty-state.tokens.css:15) — specificity 0, gate-12 compliant. (Note: unlike `<falcon-empty-data>`, the Angular selector `falcon-angular-empty-state` IS in the `:where()` list here.)

## Token categories (4 — per the file header)

1. **LAYOUT** (`[CODE]` :16-24) — `--falcon-empty-state-gap` (12px), `-padding-y` (32px), `-padding-x` (24px), `-action-gap` (8px), `-action-margin-top` (8px), `-description-max-width` (480px).
2. **TYPOGRAPHY** (`[CODE]` :26-48) — `-font-family` (`var(--font-sans, system-ui, sans-serif)`); per-size `-icon-size` (md 56 / sm 40 / lg 80px), `-title-size` (md `--text-lg` / sm `--text-md` / lg `--text-xl`), `-title-weight` (600), `-title-line-height` (1.4), `-description-size` (md `--text-sm` / sm `--text-xs` / lg `--text-md`), `-description-weight` (400), `-description-line-height` (1.5).
3. **COLOR** (`[CODE]` :50-55) — `-icon-color` (neutral-400 `#9ca3af`), `-title-color` (neutral-800 `#1f2937`), `-description-color` (neutral-500 `#6b7280`).
4. **SIZING** — the per-size overrides are folded into TYPOGRAPHY (`-icon-size-sm/lg`, `-title-size-sm/lg`, `-description-size-sm/lg`).

> `[CODE]` There are **no** border / shadow / focus / hover / state tokens — it is a static presentational stack (no border, no surface, no interactivity).

## Related Falcon theme tokens

| Falcon theme token | Used by empty-state via |
|---|---|
| `--color-falcon-neutral-400 / 500 / 800` | icon / description / title colors |
| `--font-sans` | label/title/description font family |
| `--text-md / --text-lg / --text-xl` | title size per size variant |
| `--text-xs / --text-sm / --text-md` | description size per size variant |

> `[CODE]` CORRECTION vs prior dossier: the font is `--font-sans` (NOT `--font-display`), and there is no `--color-falcon-teal-500` default (icon color is neutral-400). The teal icon tone is achievable only by a per-instance token override.

## Tailwind utility guidance

`[CODE]` The Light DOM variant uses `empty-state-tailwind-classes.ts` (77 ln) helpers that compose `--falcon-empty-state-*` arbitrary-value utilities (e.g. `text-[length:var(--falcon-empty-state-icon-size)]`, `gap-[var(--falcon-empty-state-gap)]`). Per-instance host classes for extra layout utilities; for visual changes, override tokens.

## Dark mode

`[INFERRED]` No component-level dark override in the token file; inherits the platform neutral inversions (the three neutral colors flip with the palette). NOT independently re-verified — flag for theme agent.

## Density

`[CODE]` Driven by the `[size]` input (`sm`/`md`/`lg`) via `:host([size='…'])` rules (Shadow) / size-branch helpers (Light). No separate density token.

## RTL

`[CODE]` Root is a centred `flex-col` with `text-align:center` — direction-neutral. `padding-inline`/`gap` are logical. The action region is centred. No `dir`-specific override needed.

## Static style risks

- `[CODE]` Default text alignment is `center` (`[CODE]` falcon-empty-state.css:27) — intentional. Override via a host Tailwind utility if a left-aligned empty state is wanted.
- `[CODE]` The Shadow CSS (`falcon-empty-state.css`, 93 ln) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads a `--falcon-empty-state-*` var; the only literals are structural (`display:flex`, `line-height:1` on the icon, the `.falcon-icon` font-face re-declaration). No raw hex.
- `[CODE]` The `-tw` variant has NO CSS file — it relies entirely on the Tailwind helper classes + the token file.
- `[CODE]` No inline `style` in either variant (contrast `<falcon-empty-data>`'s `-tw`, which has a large inline-style surface).

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; consumer per-instance overrides MUST mutate `--falcon-empty-state-*` via a host class. Never hardcode hex/px.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | _None — no border_ |
| Radius | _None (inherits container if wrapped)_ |
| Shadow | _None_ |
| Spacing | `-gap`, `-padding-{x,y}`, `-action-gap`, `-action-margin-top` |
| Color | `-icon-color`, `-title-color`, `-description-color` |
| Typography | `-font-family`, `-icon-size{,-sm,-lg}`, `-title-size{,-sm,-lg}`, `-title-weight`, `-title-line-height`, `-description-size{,-sm,-lg}`, `-description-weight`, `-description-line-height`, `-description-max-width` |
| Hover / Focus / Disabled | _None — presentational_ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh) — token file recounted at 56 lines; corrected font (`--font-sans`, not `--font-display`) + icon color (neutral-400, not teal-500) + token names (`-title-size`, not `-title-font-size`); Shadow CSS verified token-only; confirmed no border/shadow/focus tokens and no inline style.
