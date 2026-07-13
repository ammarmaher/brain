# falcon-toast — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/toast.tokens.css` (**~145 lines** — recount 2026-06-03).

`[CODE]` Scoped under `:where(falcon-toast, falcon-toast-tw, falcon-angular-toast, .falcon-toast, [data-falcon-toast])` (`[CODE]` toast.tokens.css:25). `:where()` keeps specificity 0 so per-instance overrides win. **gate-12 compliant** (scoped, not `:root`). Covers BOTH the toast and the host token namespaces (`--falcon-toast-*` AND `--falcon-toast-host-*` are declared in this one block).

## Token categories (14 declared, per the file header)

1. CONTAINER (host position) — `--falcon-toast-host-position-{top,bottom,start,end}` (16px each), `--falcon-toast-host-padding` (8px), `--falcon-toast-host-pointer-events` (none).
2. STACK — `--falcon-toast-stack-gap` (10px).
3. TOAST CONTAINER — `bg`, `color`, `border-width/color/radius` (10px), `shadow`, `padding-{y,x}`, `gap`, `pointer-events` (auto).
4. SEVERITY ICON COLORS — `info` / `success` / `warning` / `error` × `{bg, color}`. **info is hardcoded hex** (see Static style risks).
5. TITLE / MESSAGE FONT — family / size (13px / 12px) / weight (600 / 400) / line-height / color / message-margin-top.
6. DISMISS BUTTON — size (20px), color, color-hover, bg-hover, radius (4px).
7. ACTION BUTTON — color (teal-500), color-hover (teal-700), font-size/weight, padding, radius, margin-top.
8. MOTION — `transition-duration` (220ms), `transition-easing` (cubic-bezier), `slide-distance` (12px).
9. FOCUS RING — `focus-ring-width` (3px), `focus-ring-color` (teal-alpha-12).
10. SIZING — `width` (320px), `max-width` (400px), `min-height` (48px).
11. Z-INDEX — `--falcon-toast-host-z-index: 100001` (see Z-index note).
12. STATE — `enter-opacity` (0), `enter-scale` (0.98), `leave-opacity` (0).
13. ICON SIZE — `icon-size` (28px chip), `icon-svg-size` (16px glyph), `icon-radius` (6px).
14. TYPOGRAPHY ALIASES — `letter-spacing` (normal).

## Z-index — `--falcon-toast-host-z-index: 100001` (DEAD at runtime for the live stack)

`[CODE]` toast.tokens.css:104-131 carries a long `@deprecated` note: Wave 7/8 migrated the notification stack to the native Popover API (Top Layer), so this token is **irrelevant at runtime for the Wave-7 migrated stack** (Top Layer paints above all z-index). It stays alive ONLY because the Stencil Shadow-DOM host paths still read it (`falcon-toast-host.css:9`, `toast-host-tailwind-classes.ts:45`, app `tailwind.css` refs) and as a defence-in-depth fallback for browsers without Popover support. `[MEMORY]` the live tier value `100001` is hard-coded in `falcon-notification-stack.component.ts` (and mirrored by `falcon-toast-adapter`). Deletion is staged for Wave 9+ once the Stencil toast-host core is removed. See `Brain Outputs/understanding/frontend/overlay-architecture/DEAD-TOKENS.md`.

## Related Falcon theme tokens

| Toast token | References |
|---|---|
| `--falcon-toast-bg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-toast-color` / `-title-color` / `-message-color` | `var(--color-falcon-neutral-900 / -700)` |
| `--falcon-toast-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-toast-icon-success-{bg,color}` | `var(--color-falcon-green-100 / -500)` |
| `--falcon-toast-icon-warning-{bg,color}` | `var(--color-falcon-amber-50 / -500)` |
| `--falcon-toast-icon-error-{bg,color}` | `var(--color-falcon-red-100 / -500)` |
| `--falcon-toast-action-color` / `-hover` | `var(--color-falcon-teal-500 / -700)` |
| `--falcon-toast-focus-ring-color` | `var(--color-falcon-teal-alpha-12)` |
| `--falcon-toast-title/message-font-family` | `var(--falcon-font-family)` |

## Tailwind utility guidance

`[CODE]` The `-tw` path's helpers (`toast-tailwind-classes.ts` + `toast-host-tailwind-classes.ts`) emit arbitrary-value utilities reading the SAME `--falcon-toast-*` tokens (e.g. `bg-[var(--falcon-toast-bg)]`, `gap-[var(--falcon-toast-gap)]`, the severity icon map at lines 18-26). Consumers should NOT hand-roll color/radius/shadow utilities — override tokens instead. The host helper folds all 6 positions into `positionMap` (`[CODE]` toast-host-tailwind-classes.ts:22-39).

## Dark mode support

`[INFERRED]` Surface inverts via the neutral palette (`--color-falcon-neutral-0/700/900`) in the global dark map. `[CODE]` info-severity colors (`#e0f2fe` / `#0284c7`) are NOT in the SSOT palette → the token file comment says a dark override lives in `dark.css`. NOT verified end-to-end this pass — flag for the theme agent.

## Density support

None — there is no `size` prop. The toast has fixed `width` (320px) / `max-width` (400px) / `min-height` (48px).

## RTL support

`[CODE]` Host positions use **logical** insets (`inset-inline-start/end`) in the Shadow CSS (`[CODE]` falcon-toast-host.css:16-37) and the `-tw` helper uses logical `start-[…]` / `end-[…]` utilities (`[CODE]` toast-host-tailwind-classes.ts:24-38) → positions mirror correctly under `dir="rtl"`. The toast body is a symmetric grid (`auto 1fr auto`). NOT verified end-to-end this pass.

## Static style risks

- `[CODE]` **info-severity hardcoded hex** — `--falcon-toast-icon-info-bg: #e0f2fe` + `--falcon-toast-icon-info-color: #0284c7` (`[CODE]` toast.tokens.css:50-51). The file comment self-flags this as "no SSOT token — accepted gap." These are the ONLY raw hex severity values; a future `--color-falcon-sky-*` should replace them. GAP G4.
- `[CODE]` Shadow toast dismiss `<svg>` uses `var(--falcon-size-icon-xs, 0.75rem)` fallback (`[CODE]` falcon-toast.css:123-124); the `-tw` dismiss `<svg>` hardcodes `w-3 h-3` (`[CODE]` falcon-toast-tw.tsx:197) — minor literal, structural, acceptable. The `-tw` severity `<svg>` reads `--falcon-toast-icon-svg-size` (`[CODE]` falcon-toast-tw.tsx:128) — token-driven.
- `[CODE]` `--falcon-toast-shadow: 0 8px 24px rgba(0,0,0,0.10)` is a raw rgba literal inside the token value — acceptable (it IS the token definition), but a `--falcon-shadow-*` alias would be cleaner.

## No CSS / no SCSS guidance

- Token file is the SSOT for both Shadow CSS + `-tw` Tailwind helpers.
- Consumer overrides MUST mutate `--falcon-toast-*` tokens via the `rootClass` host class. Never hardcode hex/px.

## Token usage by state

| Concern | Token(s) |
|---|---|
| Host position offsets | `--falcon-toast-host-position-{top,bottom,start,end}` |
| Stack gap / host padding | `--falcon-toast-stack-gap` · `--falcon-toast-host-padding` |
| Surface | `--falcon-toast-bg` · `-color` · `-border-{width,color,radius}` · `-shadow` |
| Spacing | `--falcon-toast-padding-{y,x}` · `-gap` |
| Per-severity icon | `--falcon-toast-icon-{info,success,warning,error}-{bg,color}` |
| Title / message | `--falcon-toast-{title,message}-*` |
| Dismiss | `--falcon-toast-dismiss-*` |
| Action | `--falcon-toast-action-*` |
| Focus | `--falcon-toast-focus-ring-{width,color}` |
| Motion | `--falcon-toast-transition-{duration,easing}` · `-slide-distance` |
| Z-index | `--falcon-toast-host-z-index` (DEAD at runtime — Top Layer) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) — token file recounted at ~145 lines; `:where()` scope + 14 categories confirmed; info-hex gap re-confirmed; the z-index `@deprecated`/Top-Layer note transcribed from the source comment. Dark/RTL end-to-end deferred to theme agent.
