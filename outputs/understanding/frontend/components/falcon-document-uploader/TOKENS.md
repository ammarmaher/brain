# falcon-document-uploader — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/file-uploader.tokens.css` — **SHARED with `<falcon-image-uploader>`** (B20). The document + image uploaders use ONE token contract; `[CODE]` only component DEFAULTS (accept, maxSizeMB, shape, icon, labels) differ, never the visual tokens (file header lines 1-8).

`[CODE]` Scoped under `:where(falcon-image-uploader, falcon-image-uploader-tw, falcon-angular-image-uploader, falcon-document-uploader, falcon-document-uploader-tw, falcon-angular-document-uploader, .falcon-file-uploader, [data-falcon-file-uploader])` (lines 36-40). `:where()` keeps specificity 0 → per-instance overrides win. **gate-12 compliant** (scoped, not `:root`). The Stencil Shadow CSS (`file-uploader.shadow.css`) is the SoT; the Tailwind `-tw` helper (`file-uploader-tailwind-classes.ts`) consumes the EXACT SAME `--falcon-file-uploader-*` names (SSOT).

> `[CODE]` Because the token block is **shared**, overriding a `--falcon-file-uploader-*` on a class that both uploaders match retints BOTH. To retint only the document variant, scope the override to `falcon-angular-document-uploader` / `falcon-document-uploader[-tw]`.

## Token categories (13 declared — file header lines 20-33)

1. **ROW CONTAINER** — bg, border (+ active), radius, gap, padding per size (sm/md/lg).
2. **PROGRESS LAYER** — water/bar fill color (+ error), wave height/speed, laser glow.
3. **CIRCLE (left icon)** — bg, border, icon color, size, per-shape, status tints.
4. **PINS** — edit/delete corner buttons.
5. **STATUS BADGE** — ✓ / ! corner overlay.
6. **LABEL** — title + sub-label + progress text.
7. **RIGHT (drag hint + btn)** — drag-hint text + upload button.
8. **STACK (multi-file)** — overlapping circles, rings, badges, overflow chip.
9. **COUNT BADGE** — total-files pill + failed sub-badge.
10. **BANNER** — success / error / info banners below the row.
11. **FILE LIST** — expandable per-file rows (thumb/meta/progress/actions).
12. **ERROR-CODE CHIP** — T2-EXT / T2-SIZE / T2-NET monospace chip.
13. **MOTION** — transitions (animations gated by `prefers-reduced-motion`).

## Related Falcon theme tokens (from the file header React → Falcon map)

| React SoT var (`--uz-*`) | Falcon token | Palette |
|---|---|---|
| `--uz-water-color` (teal) | `--falcon-file-uploader-progress-fill` | teal-500 |
| `--uz-error-color` (#dc2626) | `--falcon-file-uploader-progress-fill-error` | red-500 |
| `--uz-bg` (`--bg-hover`) | `--falcon-file-uploader-row-bg` | neutral-45 |
| `--uz-border-color` | `--falcon-file-uploader-row-border` | neutral-200 |
| hover/drag border (teal) | `--falcon-file-uploader-row-border-active` | teal-500 |
| success green (#16a34a) | `--falcon-file-uploader-success` | green-500 |
| `--uz-wave-height` 10px | `--falcon-file-uploader-wave-height` | — |
| `--uz-wave-speed` 4s | `--falcon-file-uploader-wave-speed` | — |

`[CODE]` The row palette resolves via `var(--color-falcon-*, …)` (e.g. `--falcon-file-uploader-row-bg: var(--color-falcon-neutral-45, #f7f8f9)` at line 44), so dark mode flips through the global palette overrides.

## Tailwind utility guidance for this component

`[CODE]` `libs/falcon-ui-core/src/tailwind/file-uploader-tailwind-classes.ts` (`fuTwHostClasses`/`fuTwRowClasses`/`fuTwWrapClasses`/`fuTwNativeClasses`/`fuTwProgressVar`/`makeTwClassOf`) returns class strings on the same `--falcon-file-uploader-*` chain. Consumers should NOT hand-roll color/shape utilities — use the `shape`/`borderStyle`/`progressMode` inputs + token overrides; for layout use `[rootClass]`.

## Dark mode support

`[CODE]` Token-driven via the `var(--color-falcon-*, …)` palette chain → flips under `:where(.app-dark, …)`. The shared header notes the wave/progress overlays are theme-aware via tokens. NOT verified end-to-end in dark mode — flag for Agent 5 (theme).

## Density support

`[CODE]` Row padding is per `size` (sm/md/lg) tokens (`--falcon-file-uploader-row-padding-{x,y}{,-sm,-lg}`, lines 51-56), driven by the `size` input — not the global `--falcon-density-*` aliases.

## RTL support

`[CODE]` `[INFERRED]` The avatar-row layout uses flex + logical spacing; the shared layout/tw-layout modules build the row left-icon → center → right-button. RTL flipping relies on Tailwind/flex direction. NOT verified at runtime — flag for Agent 5.

## Static style risks

- `[CODE]` **Progress geometry via inline CSS var** — `progressStyleVar(files)` / `fuTwProgressVar(files)` set an inline `style` carrying the computed progress percentage (a data-driven geometry escape hatch, parity with single-uploader's progress width). Acceptable.
- `[CODE]` **Wrapper `.component.css`** is `:host { display: block; }` only — no visual rules, no SCSS.
- `[CODE]` The Shadow CSS + the `-tw` helper are the styling surface; both are token-chained per the SSOT header. Full literal-scan of `file-uploader.shadow.css` was NOT performed line-by-line this pass (the file is large) — the header asserts SoT/token discipline; spot-check of the token file (lines 36-57) confirms `var(--color-falcon-*)` chaining. `[INFERRED]` flag for a deeper static-scan in a future pass.
- `[CODE]` **Icons:** the file-type / placeholder glyphs are the **Falcon icon font** (the shared render module), NOT PrimeIcons — consistent with the rest of the family.

## No CSS / no SCSS guidance

- No `.scss`; the Angular wrapper `.component.css` is `:host{display:block}`. Tailwind utilities + tokens carry the design.
- Per-instance overrides MUST mutate `--falcon-file-uploader-*` tokens via a host class (scope to the document tags to avoid retinting image-uploader). Never hardcode hex/px.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Row — idle | `-row-bg`, `-row-border`, `-row-radius`, `-row-gap`, `-row-padding-{x,y}` |
| Row — hover / drag-over | `-row-bg-active`, `-row-border-active` |
| Progress (water/bar/laser) | `-progress-fill`, `-progress-fill-error`, `-wave-height`, `-wave-speed` (+ laser glow) |
| Left circle/tile | `-circle-bg`, `-circle-border`, `-circle-icon-color`, `-circle-size`, per-shape + status tints |
| Pins (edit/delete) | `-pin-*` |
| Status badge | `-badge-*` (✓ / !) |
| Stack (multi) | `-stack-*`, ring, overflow chip |
| Count badge | `-count-badge-*` (+ failed sub-badge) |
| Banner (success/error/info) | `-banner-*`, `-success` (green-500) |
| File list | `-list-*` (thumb/meta/progress/actions) |
| Error-code chip | `-chip-*` (T2-EXT/SIZE/NET) |
| Label / drag-hint / button | `-label-*`, `-drag-hint-*`, button tokens |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) — token file = SHARED `file-uploader.tokens.css`, `:where()` scope across BOTH uploader families (gate-12 OK), 13 categories + React→Falcon map confirmed from the header (lines 1-57). 🟡 Full line-by-line literal scan of `file-uploader.shadow.css` deferred (large file; header asserts token discipline + token-file spot-check confirms palette chaining) — `[INFERRED]` flag. Shared-token-block caveat (retints image-uploader too) documented.
