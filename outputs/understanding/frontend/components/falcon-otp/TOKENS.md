# falcon-otp — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/otp.tokens.css` (~156 lines — the richest of the three B03 units).

Selector is the gate-12-compliant `:where(falcon-otp, falcon-otp-tw, falcon-angular-otp, .falcon-otp, [data-falcon-otp])` (`[CODE]` otp.tokens.css:24) — Shadow + Light + Angular host + utility-class consumers share the same `--falcon-otp-*` vars; mutating one updates BOTH render paths in lock-step. **Not on `:root`** → passes gate-12.

## Token categories (14 declared — corrects prior "10" list + the `-box-` infix error)

The file declares these 14 categories (`[CODE]` otp.tokens.css:7-22 + bodies):

1. **CONTAINER** — `--falcon-otp-gap` (single, `--falcon-spacing-2`), `--falcon-otp-max-width`, `--falcon-otp-padding-x`, `--falcon-otp-padding-y`.
2. **LABEL** — `--falcon-otp-label-color`, `-color-error`, `-font-family`, `-font-size`, `-font-weight`, `-line-height`, `-margin-bottom`.
3. **BOX** — `--falcon-otp-box-size-sm/md/lg` (36/44/52px, square). *(These are the only tokens with a `box` segment.)*
4. **TYPOGRAPHY** — `--falcon-otp-font-size-sm/md/lg`, `-font-weight`, `-line-height`, `-letter-spacing`, `-text-align`.
5. **BACKGROUND** — `--falcon-otp-bg`, `-bg-hover`, `-bg-focus`, `-bg-error`, `-bg-disabled`, `-bg-filled`.
6. **TEXT COLOR** — `--falcon-otp-text-color`, `-text-color-disabled`, `-text-color-error`, `-placeholder-color`.
7. **BORDER** — `--falcon-otp-border-width`, `-border-style`, `-border-radius`, `-border-color`, `-border-color-hover`, `-border-color-focus`, `-border-color-error`, `-border-color-disabled`, `-border-color-filled`.
8. **SHADOW / FOCUS RING** — `--falcon-otp-shadow`, `-shadow-hover`, `-shadow-focus` (3-stop teal halo), `-shadow-error`, `-ring-width`, `-ring-color-focus`, `-ring-color-error`.
9. **SEPARATOR** — `--falcon-otp-separator-display` (default `none`), `-separator-width`, `-separator-height`, `-separator-color`, `-separator-margin-x` (optional dash between groups).
10. **HELPER TEXT** — `--falcon-otp-helper-color`, `-helper-font-size`, `-helper-font-weight`, `-helper-margin-top`.
11. **ERROR TEXT** — `--falcon-otp-error-color`, `-error-font-size`, `-error-font-weight`, `-error-line-height`, `-error-margin-top`.
12. **MASK CHAR** — `--falcon-otp-mask-text-security` (`disc`), `--falcon-otp-mask-character` (`"●"`).
13. **CARET** — `--falcon-otp-caret-color` (teal), `--falcon-otp-caret-width`.
14. **MOTION** — `--falcon-otp-transition-duration` (150ms), `--falcon-otp-transition-easing` (ease).

> **Correction (drift):** the prior dossier (a) listed only 10 categories and (b) used a `-box-` infix for state tokens (`--falcon-otp-box-bg`, `--falcon-otp-box-border-color`, `--falcon-otp-box-bg-filled`, `--falcon-otp-box-ring-color-focus`) and a per-size gap (`--falcon-otp-gap-{sm,md,lg}`). **None of those infixed names exist.** The real names are `--falcon-otp-bg`, `--falcon-otp-border-color`, `--falcon-otp-bg-filled`, `--falcon-otp-ring-color-focus`, and a single `--falcon-otp-gap`. Only the **box SIZE** tokens carry a `box` segment (`--falcon-otp-box-size-{sm,md,lg}`). The SEPARATOR, MASK CHAR, and CARET categories were missing entirely.

> **Quality note (no palette miss):** unlike search-input/grid-input (which point at a non-existent `--color-falcon-primary-*`), every otp colour aliases a REAL Falcon family with a hex fallback — teal (`--color-falcon-teal-500` focus/caret), neutral (`0/50/200/400/475/500/800/900`), red (`50/100/500/700` error). No off-brand fallback fires. This is a well-built token contract.

## Related Falcon theme tokens

| Falcon theme token | Used by otp via |
|---|---|
| `--color-falcon-teal-500` | Focus border + caret. |
| `--color-falcon-teal-alpha-12` | Focus ring color. |
| `--color-falcon-neutral-0/50/200/400/475/500/800/900` | Bg / borders / text / placeholder / disabled. |
| `--color-falcon-red-50/100/500/700` | Error bg / ring / border / text. |
| `--falcon-radius-md` | Box radius. |
| `--falcon-spacing-1/2` | Gap + margins. |
| `--font-display`, `--font-weight-medium/semibold` | Label + digit type. |
| `--falcon-font-size-xs/xxs` | Label / helper / error type. |

## Tailwind utility guidance for this component

The Tailwind helper `libs/falcon-ui-core/src/tailwind/otp-tailwind-classes.ts` exports 8 class-builders (`falconOtpBaseClasses`, `…BoxesClasses`, `…LabelClasses`, `…BoxClasses`, `…InputClasses`, `…HelperClasses`, `…ErrorClasses`, `…RequiredMarkerClasses`) consumed by `<falcon-otp-tw>` (`[CODE]` falcon-otp-tw.tsx:23-32) — these read the same `--falcon-otp-*` tokens through arbitrary-value utilities. Consumers should override tokens, not hand-roll box classes. For per-instance class extensions use `wrapperClass`/`boxClass`/`inputClass`/`labelClass` (Tailwind path only).

## Dark mode support

Token-driven (neutrals invert, brand teal stays). No per-instance dark override needed.

## Density support

Box size + digit font scale with `size` (`sm`/`md`/`lg`) via `--falcon-otp-box-size-*` + `--falcon-otp-font-size-*`. Gap is a single token (`--falcon-otp-gap`), not per-size — override it for a tighter/looser grid.

## RTL support

🟡 Boxes flow per writing direction; the row uses flex `gap` (direction-respecting). Paste-fill order fills `startIndex` forward in logical order. NOT runtime-verified RTL end-to-end (paste fill-direction under RTL specifically) — flag for theme agent.

## Static style risks

- `[CODE]` The `--falcon-otp-shadow-focus` / `-shadow-error` tokens carry raw `rgba(...)` 3-stop shadow stacks (otp.tokens.css:99-106) — these are shadow *recipes* (unavoidable multi-stop syntax), behind token names, acceptable per house rule.
- `--falcon-otp-mask-character: "●"` is a hardcoded glyph token (GAP G6 — but it IS a token, overridable per-instance).
- Wrapper `.component.css` is layout-only (`display:block`) — no risk.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; box styling via the helper + tokens.
- Per-instance overrides MUST mutate `--falcon-otp-*` via a host class (correct names above). Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle (box) | `--falcon-otp-bg`, `--falcon-otp-border-color`, `--falcon-otp-text-color` |
| Hover (box) | `--falcon-otp-bg-hover`, `--falcon-otp-border-color-hover`, `--falcon-otp-shadow-hover` |
| Filled (box) | `--falcon-otp-bg-filled`, `--falcon-otp-border-color-filled` |
| Focus (box) | `--falcon-otp-bg-focus`, `--falcon-otp-border-color-focus`, `--falcon-otp-shadow-focus`, `--falcon-otp-ring-color-focus`, `--falcon-otp-ring-width`, `--falcon-otp-caret-color` |
| Error | `--falcon-otp-bg-error`, `--falcon-otp-border-color-error`, `--falcon-otp-shadow-error`, `--falcon-otp-ring-color-error`, `--falcon-otp-text-color-error`, `--falcon-otp-error-color`, `--falcon-otp-label-color-error` |
| Disabled | `--falcon-otp-bg-disabled`, `--falcon-otp-border-color-disabled`, `--falcon-otp-text-color-disabled` |
| Masked | `--falcon-otp-mask-text-security`, `--falcon-otp-mask-character` |
| Layout | `--falcon-otp-gap`, `--falcon-otp-box-size-{sm,md,lg}`, `--falcon-otp-max-width`, `--falcon-otp-separator-*` |

## Verification
🟢 code-verified against `otp.tokens.css` (read 2026-06-03) + `otp-tailwind-classes.ts` (consumed by `falcon-otp-tw.tsx`). 14 categories, real token names (no `-box-` infix on state tokens, single `gap`), all-real palette aliasing, separator/mask/caret categories ✅ source-verified. Corrects prior TOKENS.md fictional `--falcon-otp-box-*` names + missing categories.
