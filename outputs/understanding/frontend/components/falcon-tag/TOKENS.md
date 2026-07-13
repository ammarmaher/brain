# falcon-tag — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/tag.tokens.css` (**51 lines** — recount 2026-06-03; Wave 9.F).

`[CODE]` tag.tokens.css:15 — selector `:where(falcon-tag, falcon-tag-tw, falcon-angular-tag, .falcon-tag, [data-falcon-tag])`. `:where()` keeps specificity 0. **gate-12 compliant** (scoped, not `:root`).

## Token categories (3 declared — NOT 5)

`[CODE]` tag.tokens.css:16-50 — the file declares only:

1. **LAYOUT** — `--falcon-tag-{gap (6px), padding-y (2px), padding-x (10px), radius (999px), radius-square (4px), border-width (0px), border-color (transparent)}` + sm/lg padding & height (`--falcon-tag-{padding-y,padding-x,height}-{sm,lg}`).
2. **TYPOGRAPHY** — `--falcon-tag-{font-family (`--font-sans`), font-size (11px / sm 10px / lg 13px), font-weight (500)}`.
3. **SURFACE (default only)** — `--falcon-tag-bg` (`neutral-175`) + `--falcon-tag-fg` (`neutral-700`) — the **`secondary`/neutral default ONLY**.

> **CORRECTION (2026-06-03):** the prior dossier claimed a "SURFACE — bg + fg per severity" + "DISMISS" category and said per-severity tokens "follow the same pattern as `<falcon-badge>`". **That is wrong.** The token file declares **no per-severity bg/fg tokens** and **no dismiss-button tokens**. Per-severity colors live elsewhere (see below).

## Where the per-severity colors actually live

`[CODE]` Two divergent sources — a real cross-path parity gap:

- **Shadow path** — `falcon-tag.css:50-70` hardcodes severity colors by *setting* `--falcon-tag-bg` / `--falcon-tag-fg` inside `:host([severity='success'])` etc. (e.g. `--falcon-tag-bg: var(--color-falcon-green-50)`). It reads the token file's layout/typography vars but overrides surface per-severity in CSS.
- **`-tw` / wrapper path (DEFAULT)** — `tag-tailwind-classes.ts:36-46` (and the wrapper's dead `_severityClasses()`) return **hardcoded Tailwind palette utilities** (`bg-falcon-green-50 text-falcon-green-700`, `bg-falcon-neutral-175 text-falcon-neutral-700`, …). These do **NOT** reference `--falcon-tag-*` at all.

**Consequence:** for the default (Tailwind) render path, the `tag.tokens.css` per-instance overrides have **no effect on color** — only on the layout/typography vars the `-tw` helper happens to consume (it actually consumes none — the `-tw` classes are all literal). A `--falcon-tag-bg` override only bites on the Shadow path (`useTailwind=false`). **This is a token-parity gap — see GAPS_AND_UPGRADES FT-07.**

## Severity → color mapping (per source, both paths agree on the colors)

```
secondary (default) → neutral-175 bg / neutral-700 fg
success             → green-50 bg / green-700 fg
info                → blue-50 bg / blue-700 fg
warning / warn      → amber-50 bg / amber-700 fg
danger              → red-100 bg / red-700 fg
contrast            → neutral-900 bg / neutral-50 fg (dark inverse)
```

## Related Falcon theme tokens

- Palette: `--color-falcon-{green,blue,amber,red,neutral}-*` families.
- `--font-sans`.
- No motion tokens (chips are static; the dismiss-hover transition is hardcoded in CSS / a literal `-tw` utility).

## Tailwind utility guidance

Per-instance utility via host classes on `<falcon-angular-tag>`. For color overrides on the default path you must override via the host class with palette utilities (or switch to `useTailwind=false` to use `--falcon-tag-*` tokens).

## Dark mode support

No component-level override; inherits the master `app-dark` palette flips. The `contrast` severity is itself a dark inverse.

## Density support

No density alias; `[size]` covers sm/md/lg.

## RTL support

- `padding-x` symmetric; gap direction-neutral.
- Leading icon + trailing ✕ flip edges automatically in RTL via flex order.

## Static style risks

- `[CODE]` falcon-tag.css:73-93 — the dismiss button uses **literals**: `width: 14px; height: 14px; opacity: 0.6; background: rgb(0 0 0 / 0.08)` on hover. No dismiss tokens exist (FT-03 proposes adding them).
- `[CODE]` falcon-tag-tw.tsx:55 — the `-tw` dismiss button is a literal Tailwind string (`w-3.5 h-3.5 ... opacity-60 hover:opacity-100`).
- `[CODE]` falcon-tag.css:14-27 uses `var(--falcon-tag-*, <fallback>)` with hardcoded fallbacks (6px / 2px / 10px / 999px) — acceptable token-with-fallback.

## Token usage by aspect

| Aspect | Token / source |
|---|---|
| Border | `--falcon-tag-border-{width,color}` (default 0 / transparent). |
| Radius | `--falcon-tag-radius` (999px) or `--falcon-tag-radius-square` (4px). |
| Shadow | None. |
| Spacing | `--falcon-tag-{gap, padding-y, padding-x}` (+ sm/lg). |
| Color (Shadow) | `--falcon-tag-bg`/`-fg`, overridden per-severity in `:host([severity])`. |
| Color (`-tw`/default) | **hardcoded `bg-falcon-*` palette utilities — NOT tokens** (FT-07). |
| Dismiss button | **literals** (14px / opacity 0.6 / rgba hover) — no tokens (FT-03). |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 51 lines / 3 categories (NOT the prior 5). **Corrected:** the file declares no per-severity bg/fg tokens and no dismiss tokens; per-severity colors are set in Shadow CSS (`:host([severity])`) and hardcoded as palette utilities in the `-tw` helper. Token-parity gap (FT-07) and literal dismiss styling (FT-03) confirmed in source.
