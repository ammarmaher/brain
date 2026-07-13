# falcon-loader-inline — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-loader-inline>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A **centered Falcon falcon-mark icon** sitting inside a shaped tile ("stage", default circle, soft mint background) with a **spinning orbit ring** around it, a soft **glow**, and a caption ("Loading…") with **three bouncing dots** below. Optional flourishes: a radial halo, twinkling stars, concentric ripples, a background pattern, animated/gradient background, drop-tint, noise, 3D tilt, auto-color-cycle, a trail, and skeleton placeholder rows. As the GLOBAL loader it appears as a centered card on a dim teal full-viewport backdrop. The icon "heartbeats" by default. Same brand-mark + ring + caption family as the full-screen `<falcon-loader-overlay>` (the difference: inline is region-scoped + always-alive; overlay is a full-screen particle veil).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<CircularProgress>` + `<Backdrop>` | MUI's spinner + backdrop ≈ the global inline loader card; MUI has no branded-icon-with-orbit-ring equivalent |
| PrimeNG | `<p-progressSpinner>` / `<p-blockUI>` | replaced — PrimeNG's plain spinner ≈ a stripped-down inline loader |
| Ant Design | `<Spin>` (with `tip`) + custom `indicator` | Ant `Spin tip="…"` ≈ icon + caption; the `indicator` slot ≈ the brand-mark icon |
| Bootstrap | `.spinner-border` + a backdrop | upgrade target — replace wholesale |
| shadcn / Radix | a `Loader2` lucide spinner | shadcn has no equivalent rich-loader; this is a bespoke brand component |
| plain HTML | a CSS `@keyframes spin` div | always replace — never hand-roll a spinner |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a region/card "loading…" state | `<falcon-angular-loader-inline>` (`showInline(target)`) | a bare CSS spinner |
| a global blocking busy state | `FalconLoaderService.showOverlay()` → the `app.ts` inline mount | mounting your own loader |
| a full-screen particle/bubble splash veil | `<falcon-angular-loader-overlay>` | the inline loader |
| a button busy spinner | `<falcon-angular-button [loading]>` | the inline loader (too heavy) |
| skeleton placeholder rows while a list loads | `config.skeletonOn` on the inline loader | a separate skeleton component |
| determinate progress (%) | `<falcon-angular-loader-overlay>` (has a progress bar) | the inline loader (indeterminate only) |

## Composition recipe to reach parity
Customization order: inputs → templates → slots → variants → token override → upgrade → wrapper. (The inline loader's "variants" live inside the JSON `config`, not as separate variant props.)
1. **Inputs** — `[config]` (the 30-group JSON, usually `loader.config().inline`), `[visible]` (a service Signal), `target` (per-region id), `[useTailwind]` (default true).
2. **Templates** — none.
3. **Slots** — **none** (config-driven). The only content injection is `config.customSvg` (replaces the brand mark — but it's an unsanitised innerHTML sink, see GAPS G-SVG).
4. **Variants** — there are no variant props; pick the look via the `config` axes: `shape` (circle/rounded/square/hex/shield), `ringStyle` (spin/dual/dashed/pulse/orbit), `animation` (12 anims), `bgKind` (none/soft/solid/gradient/radial), plus glow/halo/stars/ripples/pattern toggles.
5. **Token override** — per-instance host class for the CHROME (`--falcon-loader-inline-position: static` to inline-flow, caption/dots/skeleton tokens). Visual colours/geometry go through `config`, not tokens.
6. **Upgrade** — need a determinate bar? Use the overlay. Need reduced-motion? GAP G3. Need a live-region on the `-tw` path? GAP G1 — raise it.
7. **Wrapper** — almost never; the global loader is already wired in `app.ts`. For a per-region loader, just bind `isInlineVisible(target)`.

## Anti-patterns
- Mounting a second `<falcon-angular-loader-inline>` for the global state — the `app.ts` mount already covers it; call `FalconLoaderService.showOverlay()`.
- Setting `[attr.visible]="'false'"` manually — a literal "false" is PRESENT → the `:not([visible])` cascade misses → the loader stays VISIBLE. Use `[visible]="boolean"`.
- `*ngIf`-ing the loader out "for performance" — the `:not([visible])` cascade already pauses all animation + sets `display:none` at zero cost.
- Calling `hideOverlay()`/`hideInline()` to close your own slice — force-resets ALL holders. Call the disposer returned by `showOverlay()`/`showInline()`.
- Using `showInline('x')` and expecting the global card — the global card is the OVERLAY counter; `showInline` flips a per-region loader only.
- Feeding user-supplied `config.customSvg` — unsanitised innerHTML sink (G-SVG). Keep it Studio-editor-only.
- Hand-rolling a spinner / PrimeNG `<p-progressSpinner>` — banned; this is the loader primitive.

## Verification
🟡 CODE-DERIVED from falcon-loader-inline.component.ts + .tsx + .types.ts + falcon-loader.service.ts + app.ts. The "global loader since 2026-05-19" role ✅ VERIFIED at app.ts:58-78. Sibling routing (overlay vs inline vs button) cross-checked against the loader-overlay dossier (B-CAL). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
