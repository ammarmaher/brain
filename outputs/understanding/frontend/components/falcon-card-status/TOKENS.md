# falcon-card-status — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/card-status.tokens.css` (**82 lines** — recount 2026-06-03; includes a dark-mode block).

`[CODE]` Selector: `:where(falcon-card-status, falcon-angular-card-status, .falcon-card-status, [data-falcon-card-status])`. **Note:** the `:where()` list does **NOT** include a `falcon-card-status-tw` tag — because there is **no `-tw` twin** (the Angular `<falcon-angular-card-status>` IS in the list, and the single Stencil `<falcon-card-status>` is scoped/light-DOM). `:where()` keeps specificity 0 → per-instance overrides win. **gate-12 compliant** (scoped, not `:root`).

The visual spec is the SoT service/app grid card (`admin/comm-mkt.css .cm-card*`): white bg, 1px border, radius 14px, padding 18px 20px, flex-col gap 14px, hover shadow; top grid `34px 1fr auto`; actions `flex` / gap 8px / `mt-auto` / `justify-end`.

## Token categories (3 declared)

1. **LAYOUT** — `--falcon-card-status-radius` (14px) · per-size `-padding`/`-gap` (md 18px 20px/14px · sm 12px 14px/10px · lg 22px 24px/16px) · `-top-cols` (`34px 1fr auto`) · `-actions-gap` (8px).
2. **SURFACE** — `--falcon-card-status-bg` (`var(--color-falcon-neutral-0, #fff)`) · `-hover-shadow` (`0 4px 14px rgba(0,0,0,0.04)`).
3. **BORDER** (the ONLY thing `status` controls) — `-active-border` (teal-600 #104C54) · `-expired-border` (red-500 #FF0C0C) · `-disabled-border` (neutral-150 #E8EAED) · `-inactive-border` (neutral-150, default/fallback).

## Related Falcon theme tokens

| Falcon theme token | Used by card-status via |
|---|---|
| `--color-falcon-neutral-0` | `--falcon-card-status-bg` (light surface). |
| `--color-falcon-neutral-900` | dark-mode `bg` re-point. |
| `--color-falcon-teal-600` / `-teal-400` | `active` border (light / dark). |
| `--color-falcon-red-500` | `expired` border (both themes). |
| `--color-falcon-neutral-150` | `disabled` + `inactive` border (auto-flips via SSOT). |

## Tailwind utility guidance for this component

`[CODE]` `card-status-tailwind-classes.ts` returns **arbitrary-value utilities that consume the `--falcon-card-status-*` tokens** — e.g. `p-[var(--falcon-card-status-padding)]`, `gap-[var(--falcon-card-status-gap)]`, `rounded-[var(--falcon-card-status-radius)]`, `border-[color:var(--falcon-card-status-active-border)]`, `hover:shadow-[var(--falcon-card-status-hover-shadow)]`, `grid-cols-[var(--falcon-card-status-top-cols)]`. So **both render paths are fully token-driven, ZERO hardcoded hex/px in the class builder** (helper header comment: "ZERO CSS files, ZERO hardcoded hex — utilities + tokens only"). This is the cleanest token-binding of the B11 trio (contrast falcon-tag FT-07 / falcon-card FC-TOKEN-1, whose Angular/`-tw` paths emit literal palette utilities).

For host placement:

```html
<falcon-angular-card-status class="col-span-1" ... />
```

## Dark mode support

`[CODE]` card-status.tokens.css:68-82 — there IS a dark-mode block: `:where([data-theme='dark'], .app-dark, .dark) :where(falcon-card-status, …)` re-points:
- `--falcon-card-status-bg` → neutral-900 (#1a1a1a),
- `-hover-shadow` → deeper `rgba(0,0,0,0.45)`,
- `-active-border` → teal-400 (#698E92) and `-expired-border` → red-500 — lightened so the brand/danger tones read on a dark canvas.

`disabled`/`inactive` neutral borders are NOT re-pointed — they flip automatically through the `--color-falcon-neutral-*` SSOT (same strategy as `card.tokens.css` / `status-badge.tokens.css`). Geometry is unchanged across themes.

## Density support

Density is via the **`size` prop** (sm/md/lg padding+gap), NOT the global `--falcon-density-*` system. To opt one card into a custom density:

```css
.tight-card { --falcon-card-status-padding: var(--falcon-card-status-padding-sm); }
```

## RTL support

`[CODE]` The chrome is flex/grid based and direction-agnostic: the top grid `34px 1fr auto` reorders naturally under `[dir='rtl']`; the actions row uses `justify-end` (logical end). No physical `left`/`right` literals in the class builder. **RTL-safe.** (Per-slot RTL is the caller's responsibility on the projected content.)

## Static style risks

- `[CODE]` **No `.css` / `styleUrl` anywhere** for this component (Stencil declares none; the Angular wrapper has no `.component.css`). All styling is token-driven Tailwind via the shared class builder. **Lowest static-style risk of the B11 trio.**
- `[CODE]` `--falcon-card-status-hover-shadow` is a composite `0 4px 14px rgba(...)` literal inside the token VALUE (not in the class builder) — acceptable (a token IS the right home for a shadow recipe), and it is dark-mode-re-pointed.
- `[CODE]` The per-status border hexes (`#104C54`, `#FF0C0C`, `#E8EAED`) are `var(--color-falcon-*, #hex)` fallbacks inside the token file — the platform palette token is the primary; the hex is only a fallback. Acceptable.

## No CSS / no SCSS guidance

- Tailwind utilities only (via the shared class builder); consumer overrides go through `--falcon-card-status-*` tokens (host class) or the `rootClass` input.
- Never hardcode hex/px in the consumer's CSS to restyle the card chrome.

## Token usage by state

| State / aspect | Token(s) consumed |
|---|---|
| Radius | `--falcon-card-status-radius` |
| Padding / gap (per size) | `--falcon-card-status-padding{,-sm,-lg}`, `--falcon-card-status-gap{,-sm,-lg}` |
| Top grid | `--falcon-card-status-top-cols` |
| Actions row | `--falcon-card-status-actions-gap` |
| Surface | `--falcon-card-status-bg` |
| Hover | `--falcon-card-status-hover-shadow` |
| Border — active | `--falcon-card-status-active-border` |
| Border — expired | `--falcon-card-status-expired-border` |
| Border — disabled | `--falcon-card-status-disabled-border` |
| Border — inactive (default) | `--falcon-card-status-inactive-border` |
| Focus / selected / loading | _None — the card has no interactive/selected state; the projected buttons own theirs._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 — NEW) — token file recounted at 82 lines (3 categories + dark block), `:where()` scope confirmed (gate-12 OK; correctly omits a non-existent `-tw` tag). Class builder verified fully token-driven (zero hardcoded hex/px) — the cleanest token binding of the B11 trio. Dark-mode + RTL handled.
