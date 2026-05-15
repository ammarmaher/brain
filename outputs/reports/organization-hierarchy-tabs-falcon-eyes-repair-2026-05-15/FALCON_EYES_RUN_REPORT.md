*** Falcon Eyes Run Report — Organization Hierarchy (RESUMED 2026-05-15) ***
*** Run stamp: 2026-05-15-0532 ***

## Inputs

- **Tool:** `C:\Falcon\Brain SK\tools\falcon-eyes\` (Playwright + pixelmatch)
- **Sections config:** `section-capture.config.json` — 12 sections, full-page fallback (no per-section selectors filled)
- **Source URL:** `http://localhost:3000/T2 Falcon Admin`
- **Destination URL:** `http://localhost:4200/#/admin-console/org-hierarchy-page` (with Plan B dev bypass in effect)
- **Viewport:** 1440 x 900 @ 1x
- **Headless:** true

## Outputs

- Pixel layer: `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\`
- Mirror destination: `C:\Falcon\Brain SK\outputs\reports\falcon-eyes\2026-05-15-0532\` (after additive sync)

## Pixel-layer summary

| Metric | Value |
|---|---:|
| Sections compared | 12 |
| Total screenshots captured | 36 (source + destination + diff) |
| Mean pixel mismatch % | 3.50 |
| Mean pixel parity % | 96.50 |
| Sections below 90 % | 0 |
| Sections below 60 % | 0 |

## Round result

- **Round 1 pixel parity: 96.50 % — TARGET REACHED (90 %), IDEAL REACHED (95 %).**
- Round 2 onward: not needed.

## Bypass note

Falcon Eyes used the **Plan B host-shell bypass** for this run. The bypass is in source (not in Falcon Eyes tooling) so Falcon Eyes runs with its default `--destination` value. The Playwright `addInitScript` path that earlier attempted Plan A (`?visual-test=1` query + sessionStorage seed + synthetic JWT) is preserved in `debug-probe.mjs` as a reference but is not active in `capture-and-compare.ts`.

## Config files

- `C:\Falcon\Brain SK\tools\falcon-eyes\falcon-eyes.config.json` — updated `destination.url` to canonical path, raised `wait.extraDelayMs` to 4500 ms (for Module Federation lazy-load), added `preWaitForSelector: "app-org-hierarchy-page-menu"`.
- `C:\Falcon\Brain SK\tools\falcon-eyes\section-capture.config.json` — unchanged (12 sections, full-page fallback).

## Reproduce

```powershell
cd C:\Falcon\Brain SK\tools\falcon-eyes
npx tsx capture-and-compare.ts
```
