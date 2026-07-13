# falcon-alert-dialog — TOKENS

## Component token source

`[CODE]` **There is NO `alert-dialog.tokens.css` file.** (The prior dossier's `falcon-alert-dialog.tokens.css` path is stale — verified absent in `libs/falcon-ui-tokens/src/components/` 2026-06-03.) The alert-dialog declares its own ~21 tokens **inline on the Shadow `:host`** in `falcon-alert-dialog.css:5-30`, plus four `:host([severity=…])` overrides. The `-tw` twin references the same vars via Tailwind arbitrary-value classes. Dialog **chrome** tokens (panel bg, backdrop, shadow, radius, header/footer padding, focus-trap) flow from the composed `<falcon-dialog>` via `dialog.tokens.css`.

> **gate-12 note:** because the tokens live on `:host` (Shadow scope) rather than a `:root` block, they are already component-scoped — no `:where()` rescoping needed for the Shadow path. (The `-tw` Light-DOM twin reads them via inherited CSS vars + literals — see static-style risks.)

## Component-level tokens (declared on `:host`)

`[CODE]` falcon-alert-dialog.css:8-28:

| Token | Default | Drives |
|---|---|---|
| `--falcon-alert-dialog-icon-color` | `var(--falcon-status-danger, #E63946)` | Severity icon fill (overridden per severity below) |
| `--falcon-alert-dialog-confirm-bg` | `var(--falcon-teal-700, #124C52)` | Confirm button background |
| `--falcon-alert-dialog-confirm-color` | `var(--color-falcon-neutral-0, #FFFFFF)` | Confirm button text |
| `--falcon-alert-dialog-cancel-bg` | `var(--color-falcon-neutral-0, #FFFFFF)` | Cancel button background |
| `--falcon-alert-dialog-cancel-color` | `var(--color-falcon-neutral-700, #1A1A1A)` | Cancel button text |
| `--falcon-alert-dialog-cancel-border` | `var(--color-falcon-neutral-200, #E5E7EB)` | Cancel button border |
| `--falcon-alert-dialog-title-color` | `var(--color-falcon-neutral-900, #111827)` | Title text |
| `--falcon-alert-dialog-subtitle-color` | `var(--color-falcon-neutral-600, #4B5563)` | Subtitle text |
| `--falcon-alert-dialog-title-font-size` | `18px` | Title size |
| `--falcon-alert-dialog-title-font-weight` | `700` | Title weight |
| `--falcon-alert-dialog-subtitle-font-size` | `13px` | Subtitle size |
| `--falcon-alert-dialog-subtitle-line-height` | `1.5` | Subtitle line-height |
| `--falcon-alert-dialog-subtitle-max-width` | `460px` | Subtitle clamp width |
| `--falcon-alert-dialog-icon-size` | `56px` | Icon container size |
| `--falcon-alert-dialog-header-gap` | `12px` | Gap icon/title/subtitle |
| `--falcon-alert-dialog-footer-gap` | `10px` | Gap Cancel↔Confirm |
| `--falcon-alert-dialog-btn-padding-block` | `10px` | Button vertical padding |
| `--falcon-alert-dialog-btn-padding-inline` | `18px` | Button horizontal padding |
| `--falcon-alert-dialog-btn-radius` | `8px` | Button radius |
| `--falcon-alert-dialog-btn-font-size` | `14px` | Button font size |
| `--falcon-alert-dialog-btn-font-weight` | `600` | Button font weight |

## Severity → icon color resolution

`[CODE]` falcon-alert-dialog.css:32-46:

```
:host([severity="warning"]) → --falcon-alert-dialog-icon-color = var(--falcon-status-danger, #E63946)
:host([severity="danger"])  → var(--falcon-status-danger,  #E63946)
:host([severity="info"])    → var(--falcon-teal-700,       #124C52)
:host([severity="success"]) → var(--falcon-status-success, #16A34A)
```

> Note `warning` and `danger` share the SAME red icon (`--falcon-status-danger`) — they differ only in `role` (`alertdialog`) vs the Confirm-bg (both teal). The SVG triangle is used for both warning + danger; circle-check for success; circle-i for info (`[CODE]` tsx:104-131).

## `-tw` twin token references

`[CODE]` falcon-alert-dialog-tw.tsx uses **Tailwind arbitrary-value classes that read the underlying THEME vars directly**, NOT the `--falcon-alert-dialog-*` tokens:
- icon fill: `fill-[var(--falcon-status-success,#16A34A)]` / `fill-[var(--falcon-teal-700,#124C52)]` / `fill-[var(--falcon-status-danger,#E63946)]` (`[CODE]` tw.tsx:70-74).
- confirm bg: `bg-[var(--falcon-teal-700,#124C52)]` / `bg-[var(--falcon-status-success,#16A34A)]` (`[CODE]` tw.tsx:105-108).
- title/subtitle: `text-[var(--color-falcon-neutral-900,#111827)]` / `text-[var(--color-falcon-neutral-600,#4B5563)]` (`[CODE]` tw.tsx:131/136).
- cancel button: `bg-[var(--color-falcon-neutral-0,#fff)] text-[var(--color-falcon-neutral-700,#1A1A1A)] border-[var(--color-falcon-neutral-200,#E5E7EB)]` (`[CODE]` tw.tsx:150).

> **Parity break (GAP):** overriding `--falcon-alert-dialog-confirm-bg` retints the **Shadow** Confirm button (`[CODE]` css:126) but NOT the `-tw` Confirm button (which reads `--falcon-teal-700`). Same for icon/cancel. The two render paths track the theme vars consistently but diverge from the `--falcon-alert-dialog-*` per-instance override layer on the `-tw` path. The error-dialog-host + orchestrator both default to `useTailwind=true` (`-tw`), so per-instance `--falcon-alert-dialog-*` overrides do NOT reach the live render.

## Inherited chrome tokens (via composition with `<falcon-dialog>`)

The component composes `<falcon-dialog>` / `<falcon-dialog-tw>`, so all `--falcon-dialog-*` tokens (panel bg, backdrop, shadow, container radius, header/footer padding, motion) flow through unchanged. See `[BRAIN-OUT]` `components/falcon-dialog/TOKENS.md`.

> ⚠️ The Angular **wrapper** neutralises the nested dialog's backdrop (`--falcon-dialog-backdrop-bg: transparent`, `-blur: 0px`, `[CODE]` falcon-alert-dialog.component.css:22-24) so the OUTER native-`<dialog>` `::backdrop` owns the dim+blur. This is intentional Top-Layer plumbing, not a token bug.

## Dark mode support

`[INFERRED]` Inherits dark-mode from the `--color-falcon-*` / `--falcon-status-*` theme tokens (which flip under `.app-dark`) + the dialog chrome. The teal Confirm bg + status colors stay brand-stable; neutrals invert. **No per-alert-dialog dark override** exists. Not runtime-verified.

## Density / RTL support

- **Density:** via the inherited `size` prop on the composed dialog; the alert-dialog's own button/icon tokens are fixed px (no per-density scaling — GAP, minor).
- **RTL:** `[INFERRED]` header is centered (`text-align: center`, `[CODE]` css:51) so direction-neutral; footer uses `justify-content: flex-end` + `gap` (`[CODE]` css:89-91) so it mirrors. Subtitle `max-width` is symmetric. Inherits the dialog's RTL layer. Not runtime-verified.

## Static style risks

- `[CODE]` **Wrapper CSS contains raw literals**: `dialog…::backdrop { background: rgba(13,63,68,0.45); backdrop-filter: blur(2px); }` + `animation … 160ms ease-out` (`[CODE]` falcon-alert-dialog.component.css:42-46). These are NOT token-driven — the outer native-`<dialog>` backdrop dim (slate-teal `rgba(13,63,68,0.45)`) and blur (2px) are hardcoded. **`safe-local` token-discipline finding** (G — see GAPS): the platform `--falcon-dialog-backdrop-*` tokens exist but the wrapper's `::backdrop` doesn't use them. (Contrast wb-confirm-save-modal, which routed its scrim through `--falcon-dialog-backdrop-*` tokens.)
- `[CODE]` The Shadow CSS title `line-height: 1.3` (`[CODE]` css:71) and body `padding-block: 8px` (`[CODE]` css:84) are bare literals (not `var(--token, fb)`) — minor; not consumer-overridable.
- `[CODE]` The `-tw` twin uses bare-px Tailwind arbitrary values (`w-[56px]`, `text-[18px]`, `px-[18px] py-[10px]`, `rounded-lg`, `max-w-[460px]`) NOT tokens (`[CODE]` tw.tsx:127-150) — so the `-tw` geometry cannot be retuned via `--falcon-alert-dialog-*` tokens (parity/override break with the Shadow path).
- `[CODE]` SVG inner shapes use `fill="white"` literal (`[CODE]` tsx:110/119/127, tw.tsx:82/91/98) — fine (icon foreground is intentionally white on the severity-colored glyph).

## No CSS / no SCSS guidance

- Consumers MUST NOT add SCSS/component CSS to restyle. Override via per-instance `style="--falcon-alert-dialog-*: …"` (Shadow path) or Theme Studio. **But note the `-tw` parity break** — per-instance token overrides do NOT reach the `-tw` Confirm/icon/cancel colors (the live default path). For a `-tw` retint you'd need to override the underlying `--falcon-teal-700`/`--color-falcon-neutral-*` theme vars (broad blast radius) — flagged as GAP.

## Token usage by state

| Concern | Token(s) consumed |
|---|---|
| Icon | `--falcon-alert-dialog-icon-color` (per-severity), `--falcon-alert-dialog-icon-size` |
| Title | `--falcon-alert-dialog-title-color`, `-title-font-size`, `-title-font-weight` |
| Subtitle | `--falcon-alert-dialog-subtitle-color`, `-subtitle-font-size`, `-subtitle-line-height`, `-subtitle-max-width` |
| Confirm button | `--falcon-alert-dialog-confirm-bg`, `-confirm-color` (Shadow); `--falcon-teal-700`/`--falcon-status-success` (`-tw`) |
| Cancel button | `--falcon-alert-dialog-cancel-bg`, `-cancel-color`, `-cancel-border` (Shadow); theme vars (`-tw`) |
| Button geometry | `--falcon-alert-dialog-btn-padding-block`, `-btn-padding-inline`, `-btn-radius`, `-btn-font-size`, `-btn-font-weight` |
| Layout gaps | `--falcon-alert-dialog-header-gap`, `-footer-gap` |
| Chrome (panel/backdrop/shadow/radius) | inherited from `dialog.tokens.css` via composed `<falcon-dialog>` |
| Outer backdrop dim/blur | **raw `rgba(13,63,68,0.45)` / `blur(2px)`** in the wrapper CSS (NOT tokens) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Confirmed NO own token file (prior path stale) — 21 tokens self-declared on `:host` (css:8-28) + 4 severity overrides. Surfaced the Shadow↔`-tw` per-instance override parity break + the wrapper-CSS raw-rgba/blur backdrop literals (static-style risks). Dark/RTL/density `[INFERRED]` to theme/substrate (not runtime-verified).
