# falcon-filter-panel — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/filter-panel.tokens.css` (**70 lines** — counted 2026-06-03).

`[CODE]` Scoped under `:where(falcon-filter-panel, falcon-filter-panel-tw, falcon-angular-filter-panel, .falcon-filter-panel, [data-falcon-filter-panel])` (filter-panel.tokens.css:14) — specificity 0, gate-12 compliant.

## Token categories (7 — per the file header, ~35 vars)

1. **LAYOUT** (`[CODE]` :15-23) — `--falcon-filter-panel-width` (100%), `-gap` (12px), `-gap-compact` (8px), `-padding` (12px), `-padding-compact` (8px), `-bg` (neutral-0), `-border-radius` (`--falcon-radius-md`), `-font-family` (`var(--font-display, var(--falcon-font-family))`).
2. **LABEL** (`[CODE]` :25-28) — `-label-color` (neutral-800), `-label-font-size` (12px), `-label-font-weight` (500).
3. **SLOT** (`[CODE]` :30-32) — `-slot-min-width` (160px), `-slot-max-width` (280px).
4. **INPUT** (`[CODE]` :34-46) — `-input-height` (36px), `-input-height-compact` (32px), `-input-padding-x` (10px), `-input-bg`, `-input-color` (neutral-900), `-input-placeholder-color` (neutral-475), `-input-border-color` (neutral-200), `-input-border-color-hover` (neutral-400), `-input-border-color-focus` (teal-500), `-input-border-radius`, `-input-font-size` (13px), `-input-font-size-compact` (12px).
5. **ACTIONS** (`[CODE]` :48-49) — `-actions-gap` (8px).
6. **BUTTONS** (`[CODE]` :51-65) — `-btn-height` (36px), `-btn-padding-x` (16px), `-btn-font-size` (13px), `-btn-font-weight` (500), `-btn-radius`; apply: `-apply-bg` (teal-500), `-apply-bg-hover` (teal-600), `-apply-color` (neutral-0); clear: `-clear-color` (neutral-700), `-clear-border-color` (neutral-200), `-clear-border-color-hover` (neutral-400), `-clear-bg-hover` (neutral-50).
7. **MOTION** (`[CODE]` :67-69) — `-transition-duration` (150ms), `-transition-easing` (ease).

> `[CODE]` CORRECTION vs prior dossier: there is **no** `--falcon-size-control-{sm,md}`, no `--falcon-border-width-1`, no `--ease-falcon-out`/`--duration-falcon-base`, and **no chevron-color token** (the prior dossier invented these). The real height tokens are `--falcon-filter-panel-input-height{,-compact}`; the focus ring is a hardcoded `rgba(13,63,68,0.08) 0 0 0 3px` box-shadow (NOT a token) in both the Shadow CSS (`falcon-filter-panel.css:70`) and the Tailwind helper (`filter-panel-tailwind-classes.ts:67`).

## Related Falcon theme tokens

| Falcon theme token | Used by filter-panel via |
|---|---|
| `--color-falcon-neutral-0 / 50 / 200 / 400 / 475 / 700 / 800 / 900` | bg / clear-hover-bg / borders / placeholder / clear-text / label / input-text |
| `--color-falcon-teal-500 / 600` | input focus border, apply button bg + hover |
| `--falcon-radius-md` | container + input + button radius |
| `--font-display` / `--falcon-font-family` | panel font family |

## Tailwind utility guidance

`[CODE]` The Light DOM variant uses `filter-panel-tailwind-classes.ts` (96 ln). Most visual values read `--falcon-filter-panel-*` arbitrary-value utilities, BUT several are **hardcoded literals** in the helper: `h-9`/`h-8` (heights instead of the `-input-height{,-compact}` tokens), `text-[13px]`/`text-xs`, `gap-2`/`gap-3`/`p-2`/`p-3` (instead of the `-gap{,-compact}`/`-padding{,-compact}` tokens), `gap-1.5` on the daterange, `text-white` on apply, and the focus box-shadow. So the Light variant is **partially token-driven** — overriding `--falcon-filter-panel-input-height` will NOT move the Tailwind-path height (it's `h-9`). See GAP FFP-06 (new B12).
- Per-instance utility via `[wrapperClass]`, `[slotClass]`, `[inputClass]` on the Angular wrapper.

## Dark mode

`[INFERRED]` No component-level dark override in the token file; inherits the platform neutral inversions. NOT independently re-verified — flag for theme agent.

## Density support

`[CODE]` `density: 'compact' | 'normal'` (`[CODE]` types.ts:4). Shadow: `:host([density='compact'])` rule shrinks gap/padding (`falcon-filter-panel.css:19-22`). Light: the helper branches on `ctx.density === 'compact'` to swap `h-8`/`text-xs`/`gap-2`/`p-2`. There is no `spacious` (FFP — density parity with table).

## RTL support

`[CODE]` Container uses `gap` + the actions bar uses `margin-inline-start: auto` (Shadow) / `ms-auto` (Light) — RTL-safe (logical). Date-range fields flip naturally. `padding-inline` in the Shadow input.

## Static style risks

- `[CODE]` **Native `<select>` chevron** is browser-rendered — NOT controllable through Falcon tokens (FFP-01 visual inconsistency).
- `[CODE]` **Native `<input type="date">`** widget appearance is OS/browser-controlled too.
- `[CODE]` The focus box-shadow `rgba(13,63,68,0.08) 0 0 0 3px` is a **hardcoded literal** (not a token) in both the Shadow CSS and the Tailwind helper — minor token-coverage gap.
- `[CODE]` The Tailwind helper hardcodes several layout values (`h-9`/`text-[13px]`/`p-3`/`gap-3`/`gap-1.5`) that the Shadow path reads from tokens — Light/Shadow drift on those axes (FFP-06).
- `[CODE]` The Shadow CSS uses `var(--token, fallback)` extensively (e.g. `gap: var(--falcon-filter-panel-gap, 12px)`) — fallbacks present, acceptable; no raw hex outside fallbacks.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `-input-border-color{,-hover,-focus}`, `-clear-border-color{,-hover}` |
| Radius | `-border-radius`, `-input-border-radius`, `-btn-radius` |
| Shadow | focus box-shadow is a **hardcoded literal**, not a token |
| Spacing | `-gap{,-compact}`, `-padding{,-compact}`, `-actions-gap`, `-input-padding-x`, `-btn-padding-x` |
| Color | `-label-color`, `-input-color`, `-input-placeholder-color`, `-apply-*`, `-clear-*` |
| Hover | `-input-border-color-hover`, `-apply-bg-hover`, `-clear-bg-hover`, `-clear-border-color-hover` |
| Focus | `-input-border-color-focus` + hardcoded ring |
| Disabled | _none — inherited_ |
| Motion | `-transition-duration`, `-transition-easing` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh) — token file recounted at 70 lines; **corrected** invented token names (no `--falcon-size-control-*`/`--falcon-border-width-1`/`--ease-falcon-out`/chevron-color); confirmed real input-height/focus-ring tokens; flagged the hardcoded focus box-shadow + Tailwind-helper literal heights (FFP-06 Light/Shadow drift). Shadow CSS verified no raw hex outside `var(...,fallback)`.
