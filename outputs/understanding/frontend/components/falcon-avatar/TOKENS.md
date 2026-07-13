# falcon-avatar — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/avatar.tokens.css` (**57 lines** — recount 2026-06-03).

`[CODE]` Full selector: `:where(falcon-avatar, falcon-avatar-tw, falcon-angular-avatar, .falcon-avatar, [data-falcon-avatar])`. `:where()` keeps specificity 0 so per-instance overrides win. **gate-12 compliant** (scoped, not `:root`). There is **no dark-mode override block** in this file — dark mode is handled entirely by the `--color-falcon-*` primitives flipping under `.app-dark` (the teal bg + white fg/ring stay legible, so no per-avatar dark re-point is needed).

## Token categories (5 declared)

1. **SIZING** — `--falcon-avatar-size` (40px default) + per-size `--falcon-avatar-size-{xs,sm,lg,xl}` (24/32/48/64). (Note: there is no `-size-md` token — the base `--falcon-avatar-size` IS md.)
2. **TYPOGRAPHY (initials)** — `--falcon-avatar-font-family` (`var(--font-sans, …)`), `-font-weight` (600), `-font-size` (16px md) + per-size `-font-size-{xs,sm,lg,xl}` (10/12/20/26).
3. **SHAPE** — `--falcon-avatar-radius` (999px circle) · `--falcon-avatar-square-radius` (8px).
4. **SURFACE** — `--falcon-avatar-bg` (`var(--color-falcon-teal-500, #124c52)`) · `--falcon-avatar-fg` (`var(--color-falcon-neutral-50, #ffffff)`).
5. **STATUS DOT** — `--falcon-avatar-status-size` (10px) · `-status-ring-width` (2px) · `-status-ring-color` (neutral-50) · per-state `-status-{online,offline,busy,away}` (green-500 / neutral-400 / red-500 / amber-500).

## Related Falcon theme tokens

| Falcon theme token | Used by avatar via |
|---|---|
| `--color-falcon-teal-500` | `--falcon-avatar-bg` (disc fill). |
| `--color-falcon-neutral-50` | `--falcon-avatar-fg` + status-dot ring color. |
| `--color-falcon-green-500` | `online` dot. |
| `--color-falcon-neutral-400` | `offline` dot. |
| `--color-falcon-red-500` | `busy` dot. |
| `--color-falcon-amber-500` | `away` dot. |
| `--font-sans` | initials font family. |

## Tailwind utility guidance for this component

`[CODE]` The Tailwind helper `libs/falcon-ui-core/src/tailwind/avatar-tailwind-classes.ts` (`falconAvatarRootClasses()` + `falconAvatarStatusClasses()`) returns **arbitrary-value utilities that consume the SAME `--falcon-avatar-*` tokens** — e.g. `bg-[color:var(--falcon-avatar-bg)]`, `w-[var(--falcon-avatar-size)]`, `text-[length:var(--falcon-avatar-font-size)]`, `shadow-[0_0_0_var(--falcon-avatar-status-ring-width)_var(--falcon-avatar-status-ring-color)]`. So the `-tw` default path is **token-driven, not literal** (contrast: `falcon-tag`'s `-tw` hardcodes palette utilities — FT-07). Consumers should NOT hand-roll Tailwind classes that override colors / radii / sizes — override tokens instead.

For host-side layout utilities:

```html
<falcon-angular-avatar class="shrink-0 mr-3" ... />
```

## Dark mode support

- No per-avatar dark override block. The disc `bg` (teal-500) stays unchanged; `fg` + status-ring (neutral-50 = white) and the per-state dot colors flip/hold automatically via the `--color-falcon-*` SSOT cascade under `.app-dark`.
- Geometry (size / radius / dot size / ring) is identical in both themes.

## Density support

Heights are fixed per `size` (no `--falcon-density-*` alias — avatar is NOT wired to the density system, unlike `falcon-input`). To opt one avatar into a custom size:

```css
.compact-avatar { --falcon-avatar-size: var(--falcon-avatar-size-sm); }
```

## RTL support

`[CODE]` falcon-avatar.css:66 — the status dot uses **`inset-inline-end: 0`** (logical, RTL-aware) in the Shadow CSS, so the dot mirrors to bottom-left under `[dir='rtl']`. The `-tw` twin uses Tailwind `end-0` (`[CODE]` avatar-tailwind-classes.ts:70) — also logical. **RTL-correct on both paths.** (Prior dossier said "physical right" — corrected: it is logical `inset-inline-end`.)

## Static style risks

- `[CODE]` `falcon-avatar.css` (110 ln) is **token-only** — every visual value reads a `--falcon-avatar-*` var; the only literals are structural (`position`, `display`, `object-fit: cover`, `border-radius: 999px` on the status dot pill, `box-shadow` ring composed from tokens). The status-dot `border-radius: 999px` (line 64) is a structural literal (always a circle), acceptable.
- `[CODE]` `falcon-avatar.css:8-15` re-declares the `.falcon-icon` font-family chain inside the Shadow root (class CSS does not pierce the boundary) — necessary, not a risk.
- `[CODE]` The `-tw` twin writes NO inline `style` (contrast: `falcon-input-tw` writes one) — clean.
- No `.component.css` on the Angular wrapper → no consumer-side static risk.

## No CSS / no SCSS guidance

- Tailwind utilities only on the host (`@source` paths catch them).
- Per-instance overrides MUST mutate `--falcon-avatar-*` tokens via a host class + the consumer's CSS file. Never hardcode hex / px inline.
- Do not write component CSS rules in the consumer's `.component.css` to restyle the avatar.

## Token usage by state

| State / aspect | Token(s) consumed |
|---|---|
| Size (default + per-size) | `--falcon-avatar-size`, `--falcon-avatar-size-{xs,sm,lg,xl}` |
| Initials type | `--falcon-avatar-font-family`, `--falcon-avatar-font-weight`, `--falcon-avatar-font-size`, `--falcon-avatar-font-size-{xs,sm,lg,xl}` |
| Shape | `--falcon-avatar-radius` (circle), `--falcon-avatar-square-radius` (square) |
| Surface | `--falcon-avatar-bg`, `--falcon-avatar-fg` |
| Status dot | `--falcon-avatar-status-size`, `--falcon-avatar-status-ring-width`, `--falcon-avatar-status-ring-color`, `--falcon-avatar-status-{online,offline,busy,away}` |
| Hover / focus / active | _None — avatar has no interactive state (no clickable mode; GAP G5)._ |
| Border ring | _None — no `--falcon-avatar-border-*` token (a "verified ring" is GAP G8)._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 57 lines (5 categories), `:where()` scope confirmed (gate-12 OK), Shadow CSS verified token-only. RTL corrected: status dot uses logical `inset-inline-end` / `end-0` (NOT physical right). `-tw` default path confirmed token-driven (not literal).
