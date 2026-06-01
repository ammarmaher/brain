---
name: project-uploader-animation-fix-clippath-2026-05-30
description: "Phase 9 — fixed water-not-filling bug (percentage height on flex-content absolute children resolves to 0) by switching to clip-path inset() reveal applied INLINE in Stencil JSX (Tailwind v4 rejects arbitrary values with commas inside var() fallbacks). Added animated upload lifecycle to showcase lab (60ms ticks, uploadDuration default 2s, 1.5s floor). Verified water animates 0→100% smoothly in browser preview."
metadata: 
  node_type: memory
  type: project
  originSessionId: 64483042-b1fa-460a-84a4-d08468cd234c
---

# Uploader Animation Fix + Animated Upload Lifecycle — 2026-05-30 (Phase 9)

**Status:** ✅ DONE + browser-verified (host-shell dev preview port 4200), branch `polishing-v0.4`, NO COMMITS, working tree.

## What broke

The Phase 8 water fill never visually rendered. Two compounding bugs:

1. **CSS spec gotcha** — percentage HEIGHT on absolute children of `display:flex` content-driven rows resolves to 0 (parent's height is "indefinite" for child percentage-height calculation even when content drives a concrete pixel value). So `.fu-water { position:absolute; bottom:0; height: var(--fu-progress, 0%); }` with `--fu-progress: 27%` computed to `height: 0px`. Confirmed via browser dev-tools probe: `fuProgress: "27%" / computedHeight: "0px"`.

2. **Tailwind v4 limitation** — arbitrary-value utilities containing commas inside `var(--x, y)` fallbacks (e.g. `h-[var(--fu-progress,0%)]`, `transition-[clip-path,background-color]`, `animate-[fuLaserPulse_1.2s_ease-in-out_infinite]`) are SILENTLY DROPPED by the v4 scanner. Neither `@source inline()` nor `[property:value]` syntax helped. Confirmed via CSS rule probe.

## How fixed

**Switched water-fill from `height: var(--fu-progress)%` to `clip-path: inset(calc(100% - var(--fu-progress)) 0 0 0)` set as INLINE Stencil JSX style.**

```ts
// libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.tw-layout.tsx
const waterStyle =
  progressMode === 'water'
    ? { clipPath: 'inset(calc(100% - var(--fu-progress,0%)) 0 0 0)',
        transition: 'clip-path 450ms cubic-bezier(0.22,1,0.36,1), background-color 0.3s' }
    : progressMode === 'laser'
    ? { animation: 'fuLaserPulse 1.2s ease-in-out infinite', transformOrigin: 'bottom' }
    : undefined;
```

clip-path percentages resolve against the element's OWN border-box (always definite) so the spec issue doesn't apply. Inline style avoids Tailwind v4. Same approach mirrored in `file-uploader.shadow.css` for the Shadow path. Class chain now anchors `top-0 right-0 bottom-0 left-0` (full-bleed) and clip-path reveals bottom progress%.

## What the user asked for — animated upload lifecycle

New in the showcase lab (`apps/host-shell/src/app/features/falcon-ui-showcase/library-section/uploader-section.component.ts`):

- **`uploadDuration` signal**, default `2` (seconds). Range 1.5-12s, step 0.5s. Slider in controls panel.
- **`fireAnimatedUpload()`** — `setInterval` at 60ms ticks (matches React SoT), increments `progress` by `(100 * 60) / max(1500, uploadDuration*1000)` per tick. On reach 100% → flip status to `'success'`.
- **1.5s floor** — `Math.max(1500, uploadDuration*1000)` ensures even a "super-fast" upload spends ≥1.5s on screen so user sees the rise. Slider min also 1.5.
- **New primary Fire button** "Animated upload (Ns)" displaying live duration. Old snap-mode buttons renamed "Snap 27%" / "Snap 67%" + kept for static SoT-screenshot reproduction.
- **All Fire buttons + Reset** call `stopUploadTimer()` to prevent overlapping animations.

## Verified in browser preview

Sampled live with `mcp__Claude_Preview__preview_eval`:

| t (ms) | progress | pill | clip-path | status |
|---|---|---|---|---|
| 50 | 0 | "Uploading · 0%" | inset(100% 0px 0px) | uploading |
| 550 | 27 | "Uploading · 27%" | inset(78.28%) | uploading |
| 1050 | 51 | "Uploading · 51%" | inset(53.07%) | uploading |
| 1750 | 87 | "Uploading · 87%" | inset(17.99%) | uploading |
| 2550 | 100 | "Completed" | inset(0%) | success |

The water rises smoothly with the 450ms CSS transition smoothing each 60ms step. Pill text matches SoT `Uploading · NN%` format.

Snap-mode sweep across 6 mode × variant combinations:
| variant | mode | rectH | rectW | shadow | clip-path |
|---|---|---|---|---|---|
| IMG/DOC × water | 92px | 377px (full) | no | inset(73%) reveals bottom 27% |
| IMG/DOC × bar | 4px | 102px (27%) | no | none |
| IMG/DOC × laser | 2px | 102px | YES (14px glow) | none |

All 6 PASS.

## Residual

- **Laser pulse keyframe animation** — `@keyframes fuLaserPulse` is declared globally in tokens.css; the inline `animation: 'fuLaserPulse 1.2s ease-in-out infinite'` is in the Stencil source but the browser probe shows `animName: none`. Likely a Stencil JSX style-object rendering edge case when shorthand `animation` combines with `transformOrigin` — needs deeper investigation. Laser glow (box-shadow) still renders correctly; just the pulse is missing.
- **Reduced-motion gate for inline animation** — inline `animation` styles don't respond to `@media (prefers-reduced-motion: reduce)`. Need a JS-level check or a scoped `<style>` tag.

## Files changed (5)

- `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.tw-layout.tsx` — per-mode inline style (water clip-path + transition, laser animation + transformOrigin)
- `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.shadow.css` — `.fu-water` uses clip-path; bar/laser branches reset clip-path
- `libs/falcon-ui-core/src/tailwind/file-uploader-tailwind-classes.ts` — water branch drops `h-[var(--fu-progress,0%)]`, uses `top-0 right-0` for full-bleed
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/uploader-section.component.ts` — `uploadDuration` signal + slider + `fireAnimatedUpload()` + `stopUploadTimer()` integrated with all Fire buttons
- `apps/host-shell/src/tailwind.css` — added safelist for laser h-2px/shadow/origin-bottom (belt-and-suspenders even though inline style is the working path)

Plus `plans/uploader-document-show-port/PHASE-9-REPORT.md` (deliverable doc).

## No commits

Working tree on `polishing-v0.4`. Builds on [[project_uploader_document_show_port_2026_05_30]].
