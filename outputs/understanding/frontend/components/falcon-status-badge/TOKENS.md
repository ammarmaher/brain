# falcon-status-badge — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/status-badge.tokens.css` (**91 lines**, 5 categories — recount 2026-06-03).

`[CODE]` status-badge.tokens.css:21 — selector is `:where(falcon-status-badge, falcon-status-badge-tw, falcon-angular-status-badge, .falcon-status-badge, [data-falcon-status-badge])`. `:where()` keeps specificity 0 so per-instance overrides win. **gate-12 compliant** (scoped, not `:root`).

## Token categories (5 declared)

`[CODE]` status-badge.tokens.css:22-90:

1. **LAYOUT** — `--falcon-status-badge-{gap (6px), min-width (74px), padding-y (4px), padding-inline-start (8px), padding-inline-end (10px), border-radius (999px)}`.
2. **TYPOGRAPHY** — `--falcon-status-badge-{font-family (`--font-display`), font-size (12px), font-weight (500), line-height (1.2)}`.
3. **SURFACE** — bg + fg per status bucket: neutral default + `active` (green-200/green-700), `pending` (amber-50/amber-700), `inactive` (neutral-175/neutral-700), `danger` (red-100/red-700).
4. **DOT** — `--falcon-status-badge-dot-{size (6px), radius (999px), bg}` + per-bucket dot bgs (`active-dot-bg` green-500, `pending-dot-bg` amber-500, `inactive-dot-bg` neutral-500, `danger-dot-bg` red-500).
5. **SIZING** — `sm` (min-width 60px, padding-y 2px, font 10px, dot 5px) + `lg` (min-width 88px, padding-y 6px, font 13px, dot 8px); `md` is the default block above.

## Severity → bucket mapping (verified in token file + both render paths)

`[CODE]` status-badge.tokens.css:33-73 / falcon-status-badge.css:32-95 / status-badge-tailwind-classes.ts:43-96:

```
active / paid           → success (green-200 bg + green-700 fg + green-500 dot)
pending                 → warning (amber-50 bg + amber-700 fg + amber-500 dot)
suspended / locked /    → neutral (neutral-175 bg + neutral-700 fg + neutral-500 dot)
  inactive / disabled
deleted / expired       → danger  (red-100 bg + red-700 fg + red-500 dot)
```

## Related Falcon theme tokens

| Falcon theme token | Used by status-badge via |
|---|---|
| `--color-falcon-green-{200,500,700}` | Success bucket bg / dot / fg. |
| `--color-falcon-amber-{50,500,700}` | Warning bucket. |
| `--color-falcon-neutral-{175,500,700}` | Neutral bucket + default. |
| `--color-falcon-red-{100,500,700}` | Danger bucket. |
| `--font-display` (→ `--falcon-font-family`) | Typography family. |

## Tailwind utility guidance

`[CODE]` status-badge-tailwind-classes.ts — the `-tw` path **consumes the same `--falcon-status-badge-*` tokens** through arbitrary-value utilities (`bg-[color:var(--falcon-status-badge-active-bg)]`, `min-w-[var(--falcon-status-badge-min-width)]`, `text-[length:var(--falcon-status-badge-font-size)]`, etc.). **Token parity between Shadow and `-tw` is GOOD** — unlike `<falcon-tag>`, the status-badge `-tw` helper does NOT hardcode palette utilities. Consumers should override tokens, not hand-roll classes.

## Dark mode support

`[CODE]` No component-level dark override in `status-badge.tokens.css`. Palette tokens flip via the master `app-dark` block in `falcon-tailwind-tokens.css`. Status-badge contrast should be re-verified on a dark canvas. **P3 — add dark-mode bucket overrides if contrast fails** (not verified end-to-end here — flag for Agent 5 theme/tokens).

## Density support

Drives via the `[size]` input (sm/md/lg). No separate `density` alias — the badge is small enough that density does not matter.

## RTL support

- `[CODE]` Uses `padding-inline-start` / `padding-inline-end` (logical) — RTL-safe.
- Dot is leading via flex `gap` — flips to trailing in RTL automatically.

## Static style risks

- `[CODE]` `--falcon-status-badge-min-width: 74px` (md) — fixed pixel value, acceptable per the React V0.2 reference.
- `[CODE]` `border-radius: 999px` — pill shape, intentional.
- `[CODE]` falcon-status-badge.css verified **token-only** — every visual value reads a `--falcon-status-badge-*` var; the only literals are structural (`display: inline-flex`, `text-transform: capitalize`, `white-space: nowrap`, `flex-shrink: 0`). No raw hex.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | None (no border on the pill). |
| Radius | `--falcon-status-badge-border-radius` (999px = pill). |
| Shadow | None. |
| Spacing | `--falcon-status-badge-{gap, padding-y, padding-inline-start, padding-inline-end}` (+ sm/lg). |
| Color | per-bucket bg + fg + dot bg. |
| Hover | None — status is non-interactive. |
| Focus | None — status is non-interactive. |
| Disabled | inherited from row opacity (`--falcon-table-disabled-opacity`) if inside a disabled table row. |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 91 lines / 5 categories, `:where()` scope + 9→4 bucket map confirmed, Shadow CSS verified token-only, and `-tw` helper verified to consume tokens (good Shadow↔`-tw` parity, unlike `<falcon-tag>`).
