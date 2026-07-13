# falcon-single-uploader — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/single-uploader.tokens.css` (**199 lines** — recount 2026-06-03).

`[CODE]` Scoped under `:where(falcon-single-uploader, falcon-single-uploader-tw, falcon-angular-single-uploader, .falcon-single-uploader, [data-falcon-single-uploader])` (line 32). `:where()` keeps specificity 0 → per-instance overrides win. **gate-12 compliant** (scoped, not `:root`). The Stencil Shadow CSS is the source of truth; the Tailwind `-tw` helper consumes the **EXACT SAME** `--falcon-single-uploader-*` names (SSOT rule, stated in the file header).

## Token categories (14 declared — file header lines 15-30)

1. **CONTAINER** — `--falcon-single-uploader-max-width` (100%).
2. **LABEL** — color, font-size (12px), font-weight, line-height, margin-bottom, required-marker color.
3. **EMPTY-STATE** — padding-x/y, gap, border width/style(dashed)/radius; per-state bg + border-color + text-color for default / hover / drag-over / error / disabled / focus; focus-shadow; disabled-opacity (0.6).
4. **EMPTY-STATE ICON** — size (28px), color, drag-over color, margin-bottom.
5. **PLACEHOLDER TEXT** — primary + muted color, font-size (13px), weight, line-height; hint font-size (11px)/line-height/margin-top.
6. **PREVIEW TILE** — size sm/md/lg (96/128/176px), bg, border width/style(solid)/color + error-color, radius (12px), shadow.
7. **PREVIEW IMAGE** — object-fit (cover), opacity, transition duration/easing.
8. **FILE ICON FALLBACK** — icon size (36px), color, bg (transparent); name font-size/color/margin-top/padding-x.
9. **ACTION BUTTONS** — base size (26px), icon-size (12px), radius (999px), offset (6px), bg + bg-hover (black-alpha image overlays), color, shadow, focus-shadow, border.
10. **DELETE BUTTON** — danger override: bg (red-500), bg-hover (red-700), color (white). Top-end.
11. **EDIT BUTTON** — secondary override: bg (teal-500), bg-hover (teal-mid), color (white). Bottom-end.
12. **PROGRESS BAR** — height (4px), radius (0), track bg (black-alpha), fill bg (teal-500) + error fill (red-500), transition duration/easing.
13. **HELPER + ERROR TEXT** — color, font-size (12px), weight, line-height, margin-top.
14. **MOTION** — state transition duration (150ms)/easing; action transition duration (180ms)/easing.

## Related Falcon theme tokens (consumed via `var(--token, fallback)`)

| Falcon palette / scale token | Used by single-uploader via |
|---|---|
| `--color-falcon-neutral-0/45/50/150/200/400/500/700/800/900` | tile/empty bg, borders, text, disabled, label, icon |
| `--color-falcon-teal-500` / `--color-falcon-teal-mid` / `--color-falcon-teal-alpha-04` | edit button + hover, drag-over/hover borders + bg, focus-shadow, progress fill |
| `--color-falcon-red-500` / `--color-falcon-red-700` | delete button + hover, error tile border, error text, progress error fill |
| `--falcon-font-weight-medium` | label / placeholder / error weight |

`[CODE]` A few values are **raw rgba with no SSOT token** and are explicitly annotated in the file as accepted gaps: `--falcon-single-uploader-empty-bg-error: rgba(220,38,38,0.04)` (line 62, "no SSOT token — accepted gap"), the action/progress black-alpha overlays (`rgba(0,0,0,0.55/0.75/0.25)`, lines 144-145/173, annotated "image/progress overlay — black alpha; correct in both themes"). These are deliberate, not drift.

## Tailwind utility guidance for this component

`[CODE]` `libs/falcon-ui-core/src/tailwind/single-uploader-tailwind-classes.ts` (369 ln) returns class strings where every visual value is `…-[var(--falcon-single-uploader-*, fallback)]` (the file header: "No hardcoded hex/px/ms — token chain only"). Consumers should NOT hand-roll Tailwind classes overriding colors/radii — override the tokens instead. For layout, use `[rootClass]`.

> `[CODE]` Minor token-coverage gaps in the helper (not in the token file): the `compact` mode uses a handful of **hardcoded arbitrary values** not backed by tokens — `gap-[12px]`/`py-[10px]`/`px-[12px]` on the compact tile (line 165), `rounded-[8px]` + `text-[length:24px]` on the compact thumb/icon (lines 199/239), `text-[length:13px]`/`text-[length:11px]` compact name/size (lines 268/275). These are literals inside the Tailwind helper (see GAPS — `safe-local` token-discipline).

## Dark mode support

`[CODE]` Token-driven via the palette `var(--color-falcon-*, …)` chain, which flips under `:where(.app-dark, …)` in `falcon-tailwind-tokens.css`. No per-component dark override block exists in `single-uploader.tokens.css`. The black-alpha action/progress overlays are theme-independent by design (annotated). NOT verified end-to-end in dark mode — flag for Agent 5 (theme).

## Density support

`[CODE]` Tile dimensions are driven by `--falcon-single-uploader-tile-size-{sm,md,lg}` via the `size` prop (NOT the global `--falcon-density-*` aliases). To shrink a single instance, override `--falcon-single-uploader-tile-size-md` on a host class.

## RTL support

`[CODE]` The action buttons use logical `end-[…]` (inline-end) positioning in the `-tw` helper (lines 329/342) and `inset-inline` semantics in the Shadow CSS, so delete (top-end) + edit (bottom-end) auto-flip in RTL. The label required-marker uses `ms-1` (margin-inline-start). NOT verified at runtime — flag for Agent 5.

## Static style risks

- `[CODE]` **Shadow CSS `falcon-single-uploader.css`** — header asserts "Zero inline styles, zero hardcoded hex/px/ms. Exception: progress-bar inline width." Spot-check (host + label + native, lines 1-40) confirms token-driven `var(--falcon-single-uploader-*, fallback)` throughout; `margin-inline-start: 4px` on the required marker (line 27) + the clip-rect visually-hidden values are structural literals. No raw color hex.
- `[CODE]` **Progress fill inline `style={{ width: '${progress}%' }}`** (.tsx:288 / -tw.tsx:296) — the documented "progress width escape hatch" (geometry from data). Acceptable.
- `[CODE]` **`-tw` compact-mode hardcoded arbitrary values** (above) — minor token-discipline gap.
- `[CODE]` **Icon font, NOT PrimeIcons** — `[CODE]` **CORRECTION vs prior dossier:** the empty/edit glyphs are `falcon-icon falcon-icon-cloud-upload` / `falcon-icon-pencil` (vendored Falcon icon font; .tsx:235/313, -tw.tsx:242/321), and `fileTypeIconClass()` returns `falcon-icon falcon-icon-*` classes (utils.ts:26-37). The prior dossier's "`pi pi-cloud-upload`/`pi pi-pencil` PrimeIcons residuals (P0 fix)" is **STALE** — there are NO `pi pi-*` classes in this component.

## No CSS / no SCSS guidance

- `[CODE]` No `.scss` anywhere; the Angular wrapper `.component.css` is `:host { display: block; }` only (no visual rules). Tailwind utilities + tokens carry the design.
- Consumer per-instance overrides MUST mutate `--falcon-single-uploader-*` tokens via a host class. Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Empty — default | `-empty-bg`, `-empty-border-color`, `-empty-color`, `-empty-icon-color` |
| Empty — hover | `-empty-bg-hover`, `-empty-border-color-hover` |
| Empty — drag-over | `-empty-bg-drag-over`, `-empty-border-color-drag-over`, `-empty-icon-color-drag-over` |
| Empty — error | `-empty-bg-error`, `-empty-border-color-error` |
| Empty — disabled | `-empty-bg-disabled`, `-empty-border-color-disabled`, `-empty-color-disabled`, `-empty-disabled-opacity` |
| Empty — focus | `-empty-border-color-focus`, `-empty-focus-shadow` |
| Tile — default | `-tile-bg`, `-tile-border-color`, `-tile-border-radius`, `-tile-shadow`, `-tile-size-{sm,md,lg}` |
| Tile — error | `-tile-border-color-error` |
| Preview image | `-image-object-fit`, `-image-opacity`, `-image-transition-duration` |
| Icon fallback | `-icon-fallback-size`, `-icon-fallback-color`, `-icon-fallback-bg`, `-icon-fallback-name-*` |
| Delete button | `-action-size`, `-action-radius`, `-action-offset`, `-delete-bg`, `-delete-bg-hover`, `-delete-color`, `-action-shadow`, `-action-focus-shadow` |
| Edit button | (action base) + `-edit-bg`, `-edit-bg-hover`, `-edit-color` |
| Progress (uploading) | `-progress-height`, `-progress-track-bg`, `-progress-fill-bg`, `-progress-fill-bg-error`, `-progress-transition-duration` |
| Label / helper / error | `-label-*`, `-required-marker-color`, `-helper-*`, `-error-*` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 199 lines, `:where()` scope (gate-12 OK) + 14 categories confirmed, SSOT header verified. Shadow CSS spot-checked token-only. **Drift corrected: icons are Falcon icon font (`falcon-icon-*`), NOT PrimeIcons (`pi pi-*`)** — prior dossier's P0 PrimeIcons gap is stale. `-tw` compact-mode arbitrary-value literals flagged as a minor token-discipline gap.
