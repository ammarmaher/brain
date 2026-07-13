# falcon-image-uploader — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/file-uploader.tokens.css` (**280 lines**, recount 2026-06-03). **SHARED** by `<falcon-image-uploader>` AND `<falcon-document-uploader>` — one contract; only the two components' DEFAULTS differ (`accept`, `maxSizeMB`, `shape`, icon, labels), never the visual tokens (`[CODE]` file-uploader.tokens.css:1-8).

`[CODE]` The selector is scoped under `:where(...)` (specificity 0 → per-instance overrides win; **gate-12 compliant — verified ZERO `:root` matches 2026-06-03**):

```css
:where(
  falcon-image-uploader, falcon-image-uploader-tw, falcon-angular-image-uploader,
  falcon-document-uploader, falcon-document-uploader-tw, falcon-angular-document-uploader,
  .falcon-file-uploader, [data-falcon-file-uploader]
) { … }
```

## SoT provenance

`[CODE]` file-uploader.tokens.css:10-18 documents the React var→Falcon token map from `Source_of_truth_theme/React/Uploader/admin/uploader.css` (`--uz-*` vars). Examples: `--uz-water-color`→`--falcon-file-uploader-progress-fill` (teal); `--uz-error-color #dc2626`→`--falcon-file-uploader-progress-fill-error`; `--uz-wave-height 10px`→`--falcon-file-uploader-wave-height`; `--uz-wave-speed 4s`→`--falcon-file-uploader-wave-speed`. **The Stencil Shadow CSS is the SOURCE OF TRUTH; the Tailwind `-tw` helper consumes the EXACT SAME `--falcon-file-uploader-*` token names (SSOT rule).**

## Token categories (13 declared — `[CODE]` header :20-34)

1. **ROW CONTAINER** — `row-bg`, `row-border`, `row-border-active` (teal), `row-bg-active`, `row-border-width`, `row-radius` (12px), `row-gap`, `row-padding-{y,x}` + per-size `-sm`/`-lg`.
2. **PROGRESS LAYER** — `progress-fill` (green-100), `progress-fill-error` (red-100), `progress-opacity` (0.85), `bar-height` (4px), `wave-height` (10px), `wave-speed` (4s), `wave-speed-slow` (6.4s = SoT `* 1.6`, pre-multiplied so the `-tw` `animate-[…]` avoids a space-bearing nested `calc()`).
3. **CIRCLE (left icon well)** — `circle-size` (56px) + `-sm` (44px) / `-lg` (72px), `circle-bg`, `circle-border`, `circle-icon` (teal-500), four shape radii (`-square` 6px / `-rounded` 12px / `-pill` 999px / `-circle` 50%), success/error border + icon tints.
4. **PINS** — edit/delete corner buttons: `pin-size` (24px), `pin-icon-size` (13px), `pin-bg`, `pin-edit-bg`, `pin-color`, `pin-border`.
5. **STATUS BADGE** — ✓ / ! corner overlay tokens.
6. **LABEL** — title + sub-label + progress-text colors/sizes.
7. **RIGHT (drag hint + button)** — drag-hint text + Upload button tokens.
8. **STACK (multi-file)** — overlapping circles, rings, badges, overflow chip.
9. **COUNT BADGE** — total-files pill + failed sub-badge.
10. **BANNER** — success / error / info banners below the row.
11. **FILE LIST** — expandable per-file rows (thumb / meta / progress / actions).
12. **ERROR-CODE CHIP** — T2-EXT / T2-SIZE / T2-NET monospace chip.
13. **MOTION** — transitions; global `@keyframes` + `prefers-reduced-motion` gating (see below).

## Related Falcon theme tokens

| Falcon theme token | Used by file-uploader via |
|---|---|
| `--color-falcon-neutral-0..200` | row/circle bg + borders, pins. |
| `--color-falcon-teal-500` / `-alpha-04` | active border + active bg tint (brand). |
| `--color-falcon-green-100 / 50 / 700` | progress fill + success circle border/icon. |
| `--color-falcon-red-100 / 50 / 700` | progress-fill-error + error circle border/icon. |
| `--color-falcon-neutral-45 / 75` | row-bg / pin-edit-bg. |
| `--duration-150` (via shared base) | transitions. |

## Tailwind utility guidance for this component

`[CODE]` The Light-DOM `-tw` twin builds its class strings from `libs/falcon-ui-core/src/tailwind/file-uploader-tailwind-classes.ts` (~31 KB — `fuTwHostClasses`, `fuTwWrapClasses`, `fuTwRowClasses`, `fuTwNativeClasses`, `fuTwProgressVar`, `makeTwClassOf`). Those utilities lean on the SAME `--falcon-file-uploader-*` tokens through arbitrary-value utilities. **Consumers should NOT hand-roll Tailwind classes that override colors/radii/shadows — override tokens instead.** For host-side layout, pass `rootClass="max-w-md"` (forwarded as `[class]` on the inner Stencil element, BOTH paths).

## Dark mode support

`[INFERRED]` No file-uploader-specific `.app-dark` overrides exist inside `file-uploader.tokens.css` (grep: 0 `app-dark` matches). Dark mode flows through the referenced `--color-falcon-*` neutrals/brand which flip in the global `falcon-tailwind-tokens.css` dark layer. Not re-verified end-to-end → flag for Agent 5 (theme/tokens).

## Density support

Sizing is per-`size` (`-sm`/`-lg` token variants for row padding + circle size), not via the global density aliases. To opt one instance into compact: `.compact { --falcon-file-uploader-circle-size: var(--falcon-file-uploader-circle-size-sm); --falcon-file-uploader-row-padding-y: var(--falcon-file-uploader-row-padding-y-sm); }`.

## RTL support

`[CODE]` file-uploader.tokens.css:260-263 — the token file itself ships RTL pin-mirroring for the `-tw` twins: `[dir="rtl"] :where(falcon-image-uploader-tw, falcon-document-uploader-tw) [data-fu-action="edit"]` / `[data-fu-action="delete"]` flip the corner pins. Row layout is gap-based flex (direction-aware).

## Static style risks

- `[CODE]` The token file contains **global `@keyframes`** (`fuWave`, `fuBob`, `fuSpin`, `fuLaserPulse` — :247-258) needed by the Light-DOM `-tw` path (a non-Shadow component can't see Shadow-scoped keyframes; the Shadow path has its own copies inside `file-uploader.shadow.css` — :243). All animations are gated by `@media (prefers-reduced-motion: reduce)` (:274). This is an intentional global-scope exception for the Light-DOM render path, NOT a token-on-`:root` violation.
- `[CODE]` Both Stencil tags write ONE inline `style={progressStyleVar(...)}` / `style={fuTwProgressVar(...)}` on the row (tsx:361 / -tw:348) — a CSS custom-property carrying the per-file progress %; token-driven, acceptable.
- `[CODE]` The Angular wrapper CSS is `:host { display: block; }` only — no static risk.
- `[CODE]` The shared Shadow CSS `file-uploader.shadow.css` (~28 KB) is the SoT; per the header it is token-driven. NOT re-read line-by-line this pass for raw-hex literals → flag for a follow-up audit (medium confidence it is clean given the SSOT discipline).

## No CSS / no SCSS guidance

- Tailwind utilities only in consumer templates (`@source` paths catch them — host-shell `tailwind.css` lists the uploader).
- Per-instance overrides MUST mutate `--falcon-file-uploader-*` via a host class + `rootClass`. **Never hardcode hex/px inline.**
- Do not write component CSS rules in the consumer's `*.component.css` to style the uploader.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle row | `--falcon-file-uploader-row-bg`, `-row-border`, `-row-radius`, `-row-border-width`, `-row-gap`, `-row-padding-{y,x}` |
| Hover / drag-active | `--falcon-file-uploader-row-border-active`, `-row-bg-active` |
| Circle (shape) | `--falcon-file-uploader-circle-size`(+`-sm`/`-lg`), `-circle-bg`, `-circle-border`, `-circle-icon`, `-circle-radius-{square,rounded,pill,circle}` |
| Uploading (water/bar/laser) | `--falcon-file-uploader-progress-fill`, `-progress-opacity`, `-bar-height`, `-wave-height`, `-wave-speed`(+`-slow`) |
| Success | `--falcon-file-uploader-circle-border-success`, `-circle-icon-success`, success banner/badge tokens |
| Error | `--falcon-file-uploader-progress-fill-error`, `-circle-border-error`, `-circle-icon-error`, error chip tokens |
| Pins (edit/delete) | `--falcon-file-uploader-pin-{size,icon-size,bg,edit-bg,color,border}` |
| Multi-stack | stack / count-badge / overflow-chip tokens (categories 8–9) |
| Disabled | `[INFERRED]` opacity/cursor handled in the Shadow/`-tw` class layer, not a dedicated token block. |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) — token file recounted at 280 lines; `:where()` shared image+document scope + 13 categories + global `@keyframes` + RTL pin-mirror + `prefers-reduced-motion` gating confirmed; gate-12 `:root`-free verified by grep. `file-uploader.shadow.css` token-purity 🟡 NOT re-read line-by-line (header asserts token-driven). Dark-mode 🟡 INFERRED (no component-local overrides).
