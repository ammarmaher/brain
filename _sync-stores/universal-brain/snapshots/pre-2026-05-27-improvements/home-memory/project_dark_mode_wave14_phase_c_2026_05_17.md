---
name: Dark Mode Wave 14 (Phase C) — Close Documented Dark Token Gaps
description: Added 6 dark counterparts (popover-dark, orgchart-line, lilac-25/100, success-20/50) to SSOT dark block; no Stencil component overrides needed.
type: project
agent: ammar-web-platform-ui
date: 2026-05-17
status: completed
originSessionId: e4d28e9d-28d9-43e1-ac0f-c412532e588d
---
# Dark Mode — Wave 14 (Phase C)

## Outcome

🟢 LANDED 2026-05-17. **6 new dark counterparts** added to the SSOT dark block in `falcon-tailwind-tokens.css`. **Zero** Stencil component overrides needed — all consumers already chain through `var(--color-falcon-*)`. All 4 builds GREEN.

## Builds

| App | Hash | Duration |
|---|---|---|
| `falcon-ui-tokens` | n/a (lib task) | GREEN |
| `admin-console` | `1f5b37b0a92fa701` | 16758ms |
| `host-shell` | `940d5572db9fdd14` | 19277ms |
| `management-console` | `b408b2ccc96db650` | 16387ms |

## What was done

Added inside the existing `:where(.app-dark, .app-dark *), :where(.dark, .dark *) { ... }` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` under new comment header `/* --- Wave 14 (Phase C): Lilac + popover-dark + orgchart-line + success tints --- */`:

| Token | Light value (UNCHANGED) | Dark value (NEW) | Rationale |
|---|---|---|---|
| `--color-falcon-popover-dark` | `#3b4752` | `#5a6470` | Lift one rank for layering on darker canvas |
| `--color-falcon-orgchart-line` | `rgba(124, 130, 169, 0.5)` | `rgba(168, 174, 213, 0.55)` | Lift hue + alpha for hierarchy connector visibility |
| `--color-falcon-lilac-25` | `#f8f8fc` | `#1f1f2e` | Invert like neutral ramp (lilac surfaces flip) |
| `--color-falcon-lilac-100` | `#e8e8f0` | `#2a2a40` | Same — one tier above lilac-25 |
| `--color-falcon-success-20` | `#E6EFE9` | `rgba(22, 163, 74, 0.15)` | Light hex invisible on dark; green-600 alpha overlay |
| `--color-falcon-success-50` | `#ecfdf5` | `rgba(22, 163, 74, 0.10)` | Same, softer alpha — preserves rank w/ success-20 |

## Stencil consumer audit (zero new overrides)

Grep across `libs/falcon-ui-tokens/src/components/*.css` for hardcoded values matching the 6 affected tokens returned only:

- `data-table.tokens.css:216` — `--falcon-data-table-shadow-row-bg: var(--color-falcon-success-20, #E6EFE9);` — the `#E6EFE9` is a `var()` **fallback only**, not a hardcoded literal. SSOT cascade overrides the resolved value in dark mode correctly. **No re-tokenization needed.**

No tokens in `tree-table.tokens.css`, `organization-hierarchy.tokens.css`, or `tooltip.tokens.css` hardcode the affected light values — all consumers already chain through `var(--color-falcon-*)`. The cleaner architecture per the phase plan was achievable as-is.

## Tokens intentionally NOT flipped in dark (verified per phase plan)

- `--color-falcon-cyan` (`#2dd4d9`) — already a mid-tone accent
- `--color-falcon-lilac-450` (`#7c82a9`) / `lilac-500` (`#8b8fc8`) — already mid-tones
- `--color-falcon-mint-100` / `mint-200` — handled per `dark.css:160-161` via `--falcon-tree-indicator-bg` chain
- All `--color-falcon-brand-*` (aramco, bmw, rajhi, snb, bupa) — brand customer logos invariant across themes

## Coverage after Wave 14

~96% (was 94% pre-Wave-14). Remaining 4% is the 4 documented structural gaps from Wave 9 Section 4 (dialog severity focus rings, error-red 4% alpha on uploaders, image-tile black overlays, `@media` query CSS custom property limitation).

## Doctrine

- **SSOT cascade beats per-component override** — adding tokens to the SSOT dark block at `falcon-tailwind-tokens.css:417-...` propagates to every consumer that uses `var(--color-falcon-*)` automatically. Only fall to `themes/dark.css` per-component overrides when the consumer hardcodes a literal or uses rgba() that can't be expressed as a re-mapped scalar.
- **`var(..., fallback)` is correct tokenization** — the fallback is only used if the SSOT var is unresolved. As long as the consumer uses `var()` form, the dark cascade still wins.
- **Light values stay unchanged** — operators have signed off on light palette; Phase C only adds dark counterparts, never edits the light side.
- **Brand colors are invariant** — aramco/bmw/rajhi/snb/bupa hex must NEVER be remapped in dark mode (they are customer-logo colors, not theme tokens).

## Files modified

| File | Change |
|---|---|
| `libs/falcon-theme/src/falcon-tailwind-tokens.css` | +6 dark counterpart declarations under new `/* --- Wave 14 (Phase C): … --- */` comment header inside existing dark block (around line 483) |
| `libs/falcon-ui-tokens/WAVE-9-DARK-MODE.md` | Wave 14 (Phase C) Additions section appended with full table, audit findings, build hashes |

## Trigger phrases

- `dark mode token gap` / `phase c dark counterparts` / `popover-dark dark value` / `lilac dark mode` / `success-20 invisible on dark canvas` / `Wave 14 dark mode`

## Source-prefixed references

- [CODE] `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-theme\src\falcon-tailwind-tokens.css:417-505` — SSOT dark override block (now Wave 14 extended)
- [CODE] `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\themes\dark.css:1-178` — Stencil component layer overrides (unchanged in Wave 14)
- [CODE] `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\components\data-table.tokens.css:216` — only consumer that references `--color-falcon-success-20` (correctly tokenized as `var()` with fallback)
- [BRAIN-OUT] `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\WAVE-9-DARK-MODE.md` — Wave 9 baseline + Wave 14 (Phase C) Additions section
