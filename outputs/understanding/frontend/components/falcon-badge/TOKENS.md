# falcon-badge — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/badge.tokens.css` (~84 lines).

Selector union: `:where(falcon-badge, falcon-badge-tw, falcon-angular-badge, .falcon-badge, [data-falcon-badge])` — covers Shadow + Light + Angular host + utility-class + data-attr consumers. **Gate-12 compliant** — scoped under `:where(...)`, NOT `:root` (`[CODE]` badge.tokens.css:17), so the ~30 badge vars do not pollute `:root`.

> Header comment lists 5 categories (LAYOUT / TYPOGRAPHY / SURFACE / DOT / SIZING) though SIZING is folded into LAYOUT's `*-sm`/`*-lg` overrides + TYPOGRAPHY's `*-font-size-sm/lg` (no separate block). Effectively 4 token groups (verified 2026-06-03).

## Token categories (4)

1. **LAYOUT** — gap (4px), padding-y (2px), padding-x (8px), border-radius (999px = pill), border-width (1px), border-color (transparent default) + sm/lg padding overrides
2. **TYPOGRAPHY** — font-family (`--font-sans`), font-size (11px / 10px sm / 13px lg), font-weight (500), line-height (1.2)
3. **SURFACE** — bg + fg per variant (subtle appearance default):
   - neutral: `neutral-100` bg / `neutral-700` fg
   - primary: `teal-100` bg / `teal-700` fg
   - success: `green-200` bg / `green-700` fg
   - warning: `amber-50` bg / `amber-700` fg
   - danger: `red-100` bg / `red-700` fg
   - info: `blue-100` bg / `blue-700` fg
   - solid fg always `neutral-50` (~white)
4. **DOT** — dot-size (6px) + per-variant dot bg

## Related Falcon theme tokens

- Color palette: full neutral / teal / green / amber / red / blue scale
- `--font-sans` family
- No motion / shadow tokens (badge is static visual)

## Tailwind utility guidance

Light DOM uses `badge-tailwind-classes.ts` helpers — generated from the same per-variant token scheme.

## Dark mode

No component-level override; inherits master theme palette which inverts neutrals in dark mode.

## Density

No density variants; `[size]` covers size differences (sm/md/lg).

## RTL

- Padding-x is symmetric; gap is direction-neutral.
- Icon + label flip direction in RTL naturally.

## Static style risks

- Border-radius `999px` (pill) — intentional.
- Pixel padding values — small + intentional.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `--falcon-badge-border-{width,color}` (default transparent — used by `outline` appearance) |
| Radius | `--falcon-badge-border-radius` (999px) |
| Shadow | None |
| Spacing | `--falcon-badge-{gap,padding-y,padding-x}` + sm/lg variants |
| Color | per-variant bg + fg |
| Hover | None (badges aren't interactive) |
| Focus | None |
| Disabled | inherited |

## Solid appearance reuses the dot tokens (verified 2026-06-03)

There is **no** `--falcon-badge-{variant}-solid-bg` token. The Tailwind helper paints the `solid` appearance background from the **dot** token family (`[CODE]` badge-tailwind-classes.ts:35-48 → `--falcon-badge-primary-dot-bg`, `--falcon-badge-success-dot-bg`, …), which `falconBadgeDotClasses()` ALSO consumes (`[CODE]` :114-127). So per variant, the solid-badge fill and the leading-dot colour are the SAME variable — overriding one moves the other. See GAPS FB-04 (safe-local: add aliased `*-solid-bg` tokens). The `subtle` surface uses the documented `--falcon-badge-{variant}-bg/-fg` pairs; `outline` reuses subtle's fg as `currentColor` border with a transparent bg (`[CODE]` :51-56).

## Verification
🟢 code-verified — categories, the `:where()` gate-12 scope, and the solid-uses-dot-token aliasing re-checked against `badge.tokens.css` + `badge-tailwind-classes.ts` on 2026-06-03 (REFRESH). Dark-mode/RTL claims 🟡 code-derived (inherits master palette; not re-tested in a browser).
