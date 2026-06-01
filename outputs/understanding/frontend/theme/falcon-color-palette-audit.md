# Falcon Color Palette Audit

> SoT for the palette over-granulation analysis surfaced in the Brain SK Obsidian vault at `_obsidian/36-Theming/Falcon Color Palette Audit.md`. 27 neutral stops, 11 off-grid. Score: 55% per Tailwind v4 canonical 11-stop convention.

**Created:** 2026-05-20
**Vault graph node:** `_obsidian/36-Theming/Falcon Color Palette Audit.md`

## Tailwind v4 canon

11 stops per color family: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. 500 = primary semantic position.

## Falcon neutral — 27 stops

| Group | Stops |
|---|---|
| On-grid canonical (11) | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| Plus 0 / 750 / 20 / 25 (extensions of canon) | 0, 20, 25, 750 |
| Off-grid drift (11) | **30, 40, 45, 75, 150, 160, 175, 350, 450, 475, 850, 925** |

**41% off-grid.**

### Off-grid sample analysis

| Stop | Hex | Distance from canonical | Recommended replacement |
|---|---|---|---|
| neutral-30 | #fafafa | 1px lighter than 50 (#f5f7f8) | neutral-50 |
| neutral-40 | #f8f8f8 | 2px lighter than 50 | neutral-50 |
| neutral-45 | #f7f8f9 | <1px lighter than 50 | neutral-50/80 |
| neutral-75 | #f5f6f7 | 1px between 50/100 | neutral-50 |
| neutral-160 | #eff1f3 | 1px lighter than 200 | neutral-150 |
| neutral-175 | #e7eaee | 2px between 150/200 | neutral-200/85 |
| neutral-350 | #d1d5db | 5px between 300/400 | neutral-300 |
| neutral-450 | #c4c9cf | 3px between 400/500 | neutral-400/85 |
| neutral-475 | #98a0a8 | 7px between 400/500 (skewed) | neutral-500 |
| neutral-850 | #2d3748 | 8px between 800/900 | neutral-800/90 |
| neutral-925 | #111827 | 12px between 900/950 | neutral-900 |

## Falcon teal — 18 stops

Canonical 10 + named accents (`tint`, `option`, `mid`) + alpha derivatives (`alpha-04`, `06`, `08`, `12`, `18`).

**Verdict:** OK. 10 canonical is correct; named accents and alphas are semantic, not drift.

## Status palettes — sparse

| Family | Stops |
|---|---|
| green | 50, 100, 200, 500, 700 |
| red | 50, 100, 500, 700, 900 |
| amber | 50, 500, 700 |
| blue | 500 |
| success (tints) | 10, 20, 50 |

**Verdict:** Sparse is fine — only specific stops get used.

## Customer brands

`brand-aramco` (+ 3 variants), `brand-bmw`, `brand-rajhi`, `brand-snb`, `brand-bupa` (+ soft).

**Rule:** invariant across themes. Customer logo color is brand identity, never remapped in dark mode.

## Recommended cleanup (Phase E of Wave 2)

| Action | Stops removed | Risk |
|---|---|---|
| Consolidate 30/40/45/75 → 50 + alpha | -4 | MED visual diff |
| Consolidate 160/175 → 150 + alpha | -2 | LOW |
| Consolidate 350 → 300 + alpha | -1 | LOW |
| Consolidate 450/475 → 400/500 + alpha | -2 | MED |
| Consolidate 850/925 → 800/900 + alpha | -2 | LOW |
| **Net: 27 → 16 stops** | -11 | MED overall |

**Mitigation:** Percy / Chromatic pixel-diff CI gate. Snapshot 6-10 reference screens before consolidation. Reject any diff >1 hex delta.

## Risk-by-app

| App | Off-grid usage | Pages most at risk |
|---|---|---|
| host-shell | Heavy (neutral-30 = sidebar dark; neutral-50 = topbar hover) | All pages |
| admin-console | Heavy (data-table rows, tree-panel surfaces) | Organization Hierarchy, Permissions |
| management-console | Lower (smaller surface area) | Dashboards |

## See also

- `THEME_SSOT_AUDIT.md` — full primitive structure
- `TOKEN_FLOW_REPORT.md` — token flow per consumer
- `falcon-tailwind-alignment-scorecard.md` — Wave 2 Phase E plan
