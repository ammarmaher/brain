# falcon-loader-inline — DECISION

## Brain SK final recommendation

**STATUS: READY / PREFERRED — the CURRENT default GLOBAL loader (since 2026-05-19).** For a global busy state, call `FalconLoaderService.showOverlay(reason)` (the `app.ts` mount renders this loader); for a region busy state, bind `[visible]="loader.isInlineVisible(target)()"` + `target`. Production-grade; the gaps in `GAPS_AND_UPGRADES.md` are improvements, not blockers — except the `-tw` a11y live-region gap (G1) and the `customSvg` sink (G-SVG), which are queued for human approval.

## Use this component for
- The global blocking loader (already wired in `app.ts` — call `FalconLoaderService.showOverlay()`).
- A per-region card/panel/section "loading…" state (`showInline(target)` + a bound loader).
- Skeleton placeholder rows (`config.skeletonOn`).

## Avoid this component for
- A full-screen particle/bubble splash veil → `<falcon-angular-loader-overlay>` (sibling).
- A button busy spinner → `<falcon-angular-button [loading]>`.
- Determinate progress (%) → the overlay's progress bar.
- A trivial inline spinner where the 30-group config is overkill.

## Preferred variant / render path
**`useTailwind=true` (default — `<falcon-loader-inline-tw>`, Light DOM).** Best for:
- Studio token-runtime mutation + the live config signal.
- Consumer Tailwind cascade.
- **CAVEAT:** the `-tw` host lacks `role="status"`/`aria-live`/`aria-busy` (G1) — add `role="status"` on your wrapper (as `app.ts` does) until the gap is fixed.

**`useTailwind=false`** (Shadow path) — switch ONLY when you need Shadow style isolation. The Shadow tag DOES have the live-region a11y (so it's actually more accessible today — an inversion of the usual "prefer `-tw`" advice; flagged in G1).

## Required upgrades before wider use
- **HIGH-RISK-QUEUE:** sanitise `customSvg` (G-SVG); bring `-tw` host to ARIA parity (G1).
- **safe-local:** reduced-motion freeze (G3), `-tw` count clamp (G4), palette-alias defaults (G5), extract a tailwind helper (G6), add specs (G7), de-dup 3-way defaults (G8).

## Relationship to other components
- **Sibling:** `<falcon-angular-loader-overlay>` (full-screen veil) — both read `FalconLoaderService.config()` (overlay → `.overlay` slice, inline → `.inline` slice) + `overlayVisible()`. The inline loader REPLACED the overlay as the global loader on 2026-05-19; the overlay is now scoped (the do-payment popup mounts its own).
- **Controller:** `FalconLoaderService` (`falcon-studio-runtime`) — the App=API layer; the ONLY place loader logic lives.
- **Studio:** `loader-studio.component` — the visual editor + 3 mini-previews (the only live per-`target` consumers).

## Exact rule for future implementation tasks
1. **Global busy state?** Call `FalconLoaderService.showOverlay(reason)` and dispose the returned function on completion/error. Do NOT mount a loader element.
2. **Region busy state?** `const done = loader.showInline('region-id')` + bind `[visible]="loader.isInlineVisible('region-id')()"`, `target="region-id"` on a `<falcon-angular-loader-inline>` inside a `position:relative` parent. Dispose `done()` when finished.
3. **NEVER set `[attr.visible]="'false'"`** — use `[visible]="boolean"` (the cascade keys off attr presence).
4. **NEVER `*ngIf` the loader out** — the cascade already zero-costs a hidden loader.
5. **Add `role="status"` on your wrapper** when using `useTailwind` (until G1 lands).
6. **Tune visuals via `config`** (the `.inline` slice of the live config), not tokens; tune chrome/position via tokens.

---

## Dynamic capability assessment

### 1. What is static today?
- The slot-free render tree (no content projection except `customSvg`).
- The `fli-*` keyframe set (heartbeat/pulse/spin/ring-pulse/star-twinkle/ripple/dot/skel-shimmer/…) — fixed in the Stencil CSS.
- The `DEFAULT_INLINE_CFG` brand colours (raw hex, 3-way duplicated — G5/G8).
- The Falcon brand-mark path-d.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **4 wrapper `@Input`s** — `config` (the whole 30-group JSON), `visible`, `target`, `useTailwind`.
- `[CODE]` **2 typed `@Output`s** — `(falconLoaderShown)` / `(falconLoaderHidden)` `{ target }`, re-emitted from the Stencil events with clean kebab `eventName` parity on BOTH paths.

### 3. What is already dynamic through slots / ng-template?
- **None** — the loader is intentionally slot-free. `config.customSvg` is the only content injection (an innerHTML sink — G-SVG).

### 4. What is dynamic through token/theme overrides?
- Host position/inset/z-index, the soft-bgKind surface, caption/dots/skeleton chrome (~the 20 token categories). Visual colours/geometry/animation are driven by `config`, NOT tokens (config-first, token-second).

### 5. What is dynamic through Tailwind classes?
- Host layout only (the Studio previews use `class="block w-full h-full"`). The `-tw` twin inlines all internal layout (no caller-overridable utility surface — G6).

### 6. What is missing to make this component reusable across pages?
- ARIA live-region on the `-tw` path (G1) — the default path is currently AT-silent.
- A reduced-motion freeze (G3).
- A `loader-inline-tailwind-classes.ts` SSOT (G6) for React/Vue twin reuse.
- Sanitisation for `customSvg` (G-SVG) before it can safely accept non-Studio input.

### 7. What capability should be added to the shared component (not a page hack)?
- ALL of item 6 — these are framework-level concerns, not per-page. The loader is the single global busy surface.

### 8. What flags / options / templates / slots would make it better?
| Addition | Type | Surface |
|---|---|---|
| `role`/`aria-live`/`aria-busy` on `-tw` host | a11y attrs | `-tw` Stencil (G1) |
| `@media prefers-reduced-motion` freeze | CSS | both Stencil CSS + tokens (G3) |
| DOMPurify on `customSvg` | sanitisation | both Stencil tags (G-SVG) |
| `loader-inline-tailwind-classes.ts` | helper | `tailwind/` (G6) |
| Clamped seed util | shared fn | both Stencil tags (G4) |

### 9. What is the safest upgrade path?
1. **Phase A (a11y, near-zero risk):** add the ARIA attrs to the `-tw` host (G1) + a reduced-motion rule (G3).
2. **Phase B (security):** wrap `customSvg` in DOMPurify (G-SVG).
3. **Phase C (parity/DRY, additive):** clamp counts in `-tw` (G4), alias defaults to palette tokens (G5), extract the tailwind helper (G6), de-dup the 3-way defaults via codegen (G8), add specs (G7).
4. **Phase D (modernization):** migrate the wrapper to `input()` signals (G2).

All phases are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- **The `visible` attr-presence contract** (`:not([visible])` → hidden). Reflecting `visible="false"` instead of omitting it would invert every loader's visibility.
- **The overlay-counter binding of the GLOBAL mount** (`overlayVisible()`). Repointing the global card to a per-target inline counter would break every `showOverlay()` caller.
- **`FalconLoaderService` being an MF singleton** (`providedIn:'root'`, shared eager). A remote re-providing it forks the loader state across the shell.
- **The zero-cost-when-hidden pause cascade** — removing it would make the always-mounted global card animate (CPU) while idle.
- **The 3-way-duplicated defaults** — changing one copy without the others drifts the loader's out-of-box look (G8).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 — NEW). Recommendation: READY / PREFERRED (the global loader). Counts: 4 wrapper `@Input`s, 2 typed `@Output`s with clean kebab event-name parity; the `-tw` a11y gap (G1) + customSvg sink (G-SVG) are the two HIGH-RISK-QUEUE items; all else safe-local. Cross-referenced to the loader-overlay dossier (B-CAL).
