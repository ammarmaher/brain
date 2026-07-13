# falcon-date-picker — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/calendar.tokens.css` (**237 lines** — SHARED with `<falcon-calendar>`). One file declares both `--falcon-calendar-*` (grid) and `--falcon-date-picker-*` (input + popover shell) tokens. 14 documented categories (`[CODE]` calendar.tokens.css:10-25); the date-picker owns categories **7-8 (popover + input), 9 (icon), 12 (helper/error), 13 (size variants)** plus reuses the calendar's popover/motion tokens.

`[CODE]` calendar.tokens.css:27-49 — **gate-12 portaled-popover file.** The `-tw` variant re-parents its popover into `.falcon-overlay-container`, so that container is INCLUDED in the `:where()` selector (alongside the `falcon-date-picker*` / `falcon-angular-date-picker` tags) — otherwise the portaled panel would render unstyled. `:where()` keeps specificity 0. See `falcon-calendar/TOKENS.md` for the full selector + gate-12 history.

## Token categories (date-picker subset)

`[CODE]` calendar.tokens.css:155-237.

**7. POPOVER (date-picker shell):**
- `--falcon-calendar-popover-bg`, `-border-width`, `-border-color`, `-border-radius` (10px), `-shadow` (`0 12px 32px rgba(13,63,68,0.12)`), `-padding` (12px), `-margin-top` (6px).
- `--falcon-calendar-popover-z-index` (**200** — bumped from 60 in the calendar-zindex wave so the popup floats above table shadow rows + sticky headers, below dialog 1200; `[CODE]` :163-166).
- `-max-width` (280px), `-min-width` (240px).

**8. INPUT FIELD (date-picker trigger — mirrors the `<falcon-input>` idiom):**
- `--falcon-date-picker-input-bg`, `-color`, `-placeholder-color`, `-border-width`, `-border-color`, `-border-radius` (8px), `-font-family`, `-font-size` (13px), `-font-weight`, `-padding-block` (8px), `-padding-inline-start` (12px), `-padding-inline-end` (36px — room for the trailing glyph), `-min-height` (38px), `-shadow`.
- 8b focus: `-border-color-focus` (teal-500), `-shadow-focus` (3px teal-alpha-12 halo).
- 8c error: `-border-color-error` (red-500), `-bg-error` (red-50).

**9. ICON (chevrons + the trailing calendar glyph):**
- `--falcon-date-picker-icon-color`, `-icon-size` (16px), `-icon-end-offset` (10px).
- `--falcon-date-picker-icon-left-color: var(--falcon-input-icon-color)` (`[CODE]` :236 — the leading `iconLeft` slot defers to the shared input icon token).

**12. HELPER / ERROR text:**
- `--falcon-date-picker-helper-margin-top` (4px), `-helper-padding-inline`, `-helper-font-size` (12px), `-helper-color`, `-error-color` (red-500).

**13. SIZE variants (input):**
- `--falcon-date-picker-input-min-height-{sm,md,lg}` (30 / 38 / 44 px), `-padding-block-{sm,md,lg}`, `-font-size-{sm,md,lg}`.

**14. STATE:**
- `--falcon-date-picker-readonly-bg` (neutral-50), `--falcon-calendar-disabled-opacity` (shared).

> The popup grid inside the popover uses the `--falcon-calendar-*` tokens (categories 1-6, 9-11) — see `falcon-calendar/TOKENS.md`.

> **CORRECTION (2026-06-03):** the prior dossier's `--falcon-calendar-container-shadow`, `--falcon-calendar-container-bg`, `--shadow-falcon-popover`, `--z-falcon-popover` (1070) **do not exist**. The real popover tokens are `--falcon-calendar-popover-shadow`, `--falcon-calendar-popover-bg`, `--falcon-calendar-popover-z-index` (**200**, not 1070). Corrected throughout.

## Related Falcon theme tokens

| Falcon theme token | Used by date-picker via |
|---|---|
| `--color-falcon-neutral-0 / -200 / -800 / -900` | input bg / border / label / text |
| `--color-falcon-teal-500` | focus border + the popover/calendar selected state |
| `--color-falcon-teal-alpha-12` | focus halo |
| `--color-falcon-red-500 / -50` | error border / error bg |
| `--color-falcon-neutral-50` | readonly bg |
| `--falcon-input-icon-color` | the `iconLeft` slot glyph color (shared with `<falcon-input>`) |
| `--falcon-input-icon-input-padding-start` | the start-padding prepended when `iconLeft` is set (shared) |

## Tailwind utility guidance for this component

`[CODE]` date-picker-tailwind-classes.ts (165 ln) — 9 class-builders (`falconDatePickerWrapperClasses` … `falconDatePickerHostDisabledClasses`) used by the `-tw` twin; each mirrors the Shadow CSS selector-for-selector and reads `--falcon-date-picker-*` / `--falcon-calendar-*` via arbitrary-value utilities. Consumers should override tokens, not hand-roll color/radius utilities. Host layout (`w-full`, responsive width) via `rootClass`.

## Dark mode support

Token-driven (neutrals/teal/red aliases flip via the theme dark overrides). Field geometry stays identical. Not re-verified end-to-end this pass.

## Density support

The INPUT height maps to `--falcon-date-picker-input-min-height-{sm,md,lg}`. The service-pricing-table consumer demonstrates a per-instance density override: `[CODE]` service-pricing-table.component.html:238 `style="--falcon-date-picker-input-padding-block: 6.5px; --falcon-date-picker-input-padding-block-sm: 6.5px"` to line the field up with a sibling dropdown.

## RTL support

`[CODE]` Both render paths use logical properties: input `padding-inline-*` (falcon-date-picker.css:55-56), the trailing icon `inset-inline-end` (.css:98), the popover `inset-inline-start: 0` (.css:127) / Tailwind `start-0` (`falconDatePickerPopoverClasses`, date-picker-tailwind-classes.ts:143). The embedded calendar flips its chevrons in RTL. For the portaled `-tw` popover, `popover-portal.ts` has an RTL physical/logical write branch (`[BRAIN-OUT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md` :184, :231). Not re-verified visually this pass.

## Static style risks

- `[CODE]` Shadow CSS `falcon-date-picker.css` (143 ln) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads a `--falcon-date-picker-*` / `--falcon-calendar-*` var; the only literals are structural (`display: flex`, `box-sizing`, `transition: border-color 120ms, box-shadow 120ms`). No raw color hex.
- `[CODE]` `date-picker-tailwind-classes.ts:49` hardcodes the label color as `text-[color:var(--color-falcon-neutral-800,#3d3d3d)]` directly (rather than a `--falcon-date-picker-label-color` token) — a minor token-indirection gap (the Shadow CSS does the same, .css:31). Both reach the theme token, so it renders correctly; there is just no per-component label-color token to override.
- `[CODE]` `falcon-date-picker-tw.tsx:335` writes one inline `style={{ color: 'var(--falcon-date-picker-icon-left-color, var(--falcon-input-icon-color, #6b7280))' }}` on the `iconLeft` span — token-with-fallback, acceptable.
- The service-pricing-table per-instance `style=` token override (:238) is the documented customization pattern — clean.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; per-instance overrides MUST mutate `--falcon-date-picker-*` / `--falcon-calendar-*` via a host class or inline `style=` token list. **Never hardcode hex/px.**
- Do not write component CSS rules in a consumer's `.component.css` to restyle the field.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Input idle | `--falcon-date-picker-input-bg`, `-color`, `-border-color`, `-border-radius`, `-min-height`, `-padding-*` |
| Input focus | `--falcon-date-picker-input-border-color-focus`, `--falcon-date-picker-input-shadow-focus` |
| Input error | `--falcon-date-picker-input-border-color-error`, `--falcon-date-picker-input-bg-error` |
| Input readonly | `--falcon-date-picker-readonly-bg` |
| Input disabled | `:host([disabled])` opacity 0.6 + `pointer-events:none` (falcon-date-picker.css:14-17) |
| Trailing glyph | `--falcon-date-picker-icon-color`, `--falcon-date-picker-icon-size`, `--falcon-date-picker-icon-end-offset` |
| Leading `iconLeft` | `--falcon-date-picker-icon-left-color` → `--falcon-input-icon-color`; padding `--falcon-input-icon-input-padding-start` |
| Label | `--color-falcon-neutral-800` (no per-component token — see Static style risks) |
| Helper / error text | `--falcon-date-picker-helper-margin-top/-padding-inline/-font-size`, `--falcon-date-picker-helper-color` / `--falcon-date-picker-error-color` |
| Popover shell | `--falcon-calendar-popover-bg`, `-border-color`, `-border-radius`, `-shadow`, `-padding`, `-margin-top`, `-z-index` (200), `-max-width`, `-min-width` |
| Popup grid | `--falcon-calendar-*` (see calendar TOKENS.md) |
| Size sm/md/lg | `--falcon-date-picker-input-min-height-{sm,md,lg}`, `-padding-block-{…}`, `-font-size-{…}` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 237 lines (SHARED with calendar), gate-12 `.falcon-overlay-container` inclusion confirmed, Shadow CSS verified token-only. Corrected the prior wrong token names (`-container-shadow`/`--z-falcon-popover 1070` → `-popover-shadow`/`-popover-z-index 200`). Flagged the label-color token-indirection gap.
