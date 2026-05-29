---
type: reference
library: "[[Tailwind CSS]]"
topic: falcon-color-audit
created: 2026-05-20
---
*** Falcon Color Palette Audit — 27 neutral stops, 11 off-grid ***
*** Score: 55% per Tailwind v4 canonical 11-stop convention ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-color-palette-audit.md ***

# Falcon Color Palette Audit

> Tailwind v4 canon: 11 stops per color (50, 100, …, 950). Falcon's neutral scale has 27 stops, 11 of them off-grid (160, 175, 350, 450, 475, etc.). Common cause: organic drift — designer needed "slightly between two stops" and a new stop was minted instead of using alpha modifiers.

## Brand teal — 18 stops total

| Type | Stops | Status |
|---|---|---|
| Canonical | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 | ✅ Standard |
| Named accents | `tint`, `option`, `mid` | ✅ Semantic — keep |
| Alpha derivatives | `alpha-04`, `alpha-06`, `alpha-08`, `alpha-12`, `alpha-18` | ✅ Useful — keep |

**Verdict: OK.** 10 canonical stops is correct; extras are semantic, not drift.

## Neutral — 27 stops (41% off-grid)

| On-grid (canonical 11) | Off-grid (16 stops) |
|---|---|
| 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 (12) | 20, 25, **30**, **40**, **45**, **75**, 150, **160**, **175**, **350**, **450**, **475**, 750, **850**, **925** (15) |

**Bolded** = significantly off-grid (not 100-step intervals from canonical neighbors).

### Off-grid samples and likely replacements

| Stop | Hex | Likely use | Recommended replacement |
|---|---|---|---|
| `neutral-30` | `#fafafa` | "Subtle background tone" | `neutral-50` (no visible diff) |
| `neutral-40` | `#f8f8f8` | "Between 25 and 50" | `neutral-50` |
| `neutral-45` | `#f7f8f9` | "Halftone between 50 and 25" | `neutral-50/80` (alpha) |
| `neutral-160` | `#eff1f3` | "Soft border" | `neutral-150` |
| `neutral-175` | `#e7eaee` | "Slightly stronger border" | `neutral-200/85` |
| `neutral-350` | `#d1d5db` | "Between 300 and 400" | `neutral-300` |
| `neutral-450` | `#c4c9cf` | "Faint divider" | `neutral-400/85` |
| `neutral-475` | `#98a0a8` | "Strong icon muted" | `neutral-500` |
| `neutral-850` | `#2d3748` | "Elevated dark surface" | `neutral-800/90` |
| `neutral-925` | `#111827` | "Deep dark canvas" | `neutral-900` |

## Status colors — sparse but OK

| Family | Stops |
|---|---|
| green | 50, 100, 200, 500, 700 (5) |
| red | 50, 100, 500, 700, 900 (5) |
| amber | 50, 500, 700 (3) |
| blue | 500 only (1) |
| success (tints) | 10, 20, 50 |

**Sparse is fine** — only specific stops get used.

## Accents

| Token | Purpose |
|---|---|
| `popover-dark` | Tooltip/popover dark surface |
| `orgchart-line` | Hierarchy connector rgba |
| `cyan` | Mid-tone accent |
| `lilac-25/100/450/500` | Surface tints (4 stops — over-granulated, could be 3) |
| `mint-100/200` | Sub-node initials chip |

## Customer brands (invariant)

| Token | Color | Use |
|---|---|---|
| `brand-aramco` (+ 3 variants) | Various greens | Customer logo color |
| `brand-bmw` | `#1c69d4` | Customer logo |
| `brand-rajhi` | `#1e4fa3` | Customer logo |
| `brand-snb` | `#1a6b2e` | Customer logo |
| `brand-bupa` (+ soft) | Blue | Customer logo |

**Rule:** never remap in dark mode. Customer identity is invariant.

## Recommended cleanup (Phase E of Wave 2)

| Action | Stops removed | Risk |
|---|---|---|
| Consolidate 30/40/45 → 50 + alpha | -2 | MED visual diff |
| Consolidate 160/175 → 150 + alpha | -2 | LOW |
| Consolidate 350/450/475 → canonical neighbor + alpha | -3 | MED |
| Consolidate 850/925 → 800/900 + alpha | -2 | LOW |
| **Net: 27 → 18 stops** | -9 | MED overall |

**Mitigation:** pixel-diff CI gate. Snapshot 6-10 reference screens before consolidation. Reject any diff > 1 hex delta.

## See also

- [[Tailwind CSS]] · [[Tailwind Colors and Palette]] · [[Falcon Design Tokens]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-color-palette-audit](../../Brain%20Outputs/understanding/frontend/theme/falcon-color-palette-audit.md) · [TOKEN_FLOW_REPORT](../../Brain%20Outputs/understanding/frontend/theme/TOKEN_FLOW_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design #gap

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
