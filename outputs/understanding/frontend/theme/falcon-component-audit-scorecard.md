# Falcon Component Audit Scorecard — SoT

> Source of truth for the per-component compliance audit framework. Vault graph node: `_obsidian/36-Theming/Falcon Component Audit Scorecard.md`.

**Created:** 2026-05-20
**Vault node:** `_obsidian/36-Theming/Falcon Component Audit Scorecard.md`

## Purpose

Measure each Falcon component's compliance with the Component Theme Contract. Surface governance gaps. Drive the Wave 1 / Wave 2 remediation backlog.

## 6 dimensions, each 0-100

| Dimension | Weight | What it measures |
|---|---|---|
| Theme score | 20% | No hardcoded values, no inline styles, tokenized utilities |
| Token score | 20% | Component reads from Layer 2 semantic (or Layer 3 component) tokens — not Layer 1 primitives directly |
| State score | 20% | All 9 interactive states defined (or N/A with rationale) |
| Dark score | 15% | Component visually correct in dark mode without custom dark CSS |
| Resize score | 10% | Passes the 10-item resizing checklist |
| Angular wrapper score | 15% | Wrapper exists; complete prop/event/slot API; CVA if input; OnPush |

## Score bands

| Band | Range | Verdict |
|---|---|---|
| 🟢 Production-ready | 90 – 100 | Ship as-is |
| 🟢 Good, minor gaps | 75 – 89 | Backlog cleanup |
| 🟡 Usable, needs cleanup | 60 – 74 | Wave 2 target |
| 🟠 Risky | 40 – 59 | Wave 1 target |
| 🔴 Not ready | 0 – 39 | Deprecate / rebuild |

## Audit checks (per component)

- ❑ No inline `style="…"` for visuals
- ❑ No hardcoded color in templates
- ❑ No hardcoded spacing / radius / shadow
- ❑ Reads from Falcon Tailwind Theme
- ❑ All 9 states defined or N/A
- ❑ Dark mode automatic via cascade
- ❑ Resizing checklist passed
- ❑ Angular forms / events supported if applicable
- ❑ Stencil works in Web Component context

## Scorecard table (60 components × 6 dimensions)

| Component | Theme | Token | State | Dark | Resize | Wrapper | Overall | Band | Issues | Action |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| (fill via Component Theme Contract Template per component) | | | | | | | | | | |

## Overall formula

```
overall = (theme*0.20 + token*0.20 + state*0.20 + dark*0.15 + resize*0.10 + wrapper*0.15)
```

## Aggregate metrics (computed when scorecard filled)

| Metric | Status |
|---|---|
| Production-ready count (90+) | TBD — audit not yet run |
| Risky count (<60) | TBD |
| Average overall score | TBD |
| Worst dimension | TBD |
| Wave 1 backlog size | TBD |
| Wave 2 backlog size | TBD |

## When to run

- Quarterly sprint planning
- New component added
- Wave 1 implementation lands
- Theme primitive renamed

## See also

- `falcon-component-theme-contract.md` — the 9-section contract being audited
- `falcon-tailwind-alignment-scorecard.md` — system-level gap analysis
- `falcon-tailwind-implementation-checklist.md` — per-PR checklist
- `FALCON_COMPONENT_REGISTRY_DEEP.md` — 60-row source registry
- `narrative/READINESS_SCORES.md` — existing per-dimension readiness baselines
