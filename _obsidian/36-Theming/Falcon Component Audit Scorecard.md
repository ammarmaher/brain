---
type: reference
library: "[[Tailwind CSS]]"
topic: component-audit
priority: critical
created: 2026-05-20
---
*** Falcon Component Audit Scorecard — per-component compliance framework ***
*** Apply to all 60 components; surfaces governance gaps ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-component-audit-scorecard.md ***

# Falcon Component Audit Scorecard

> Audit framework for measuring per-component compliance with the [[Falcon Component Theme Contract]]. Each component scored on 6 dimensions; overall score lands in a 5-band readiness rating. Use this to **prioritize the Wave 1 remediation backlog**.

## Audit checks (per component)

For each Falcon component, audit:

- ❑ No inline `style="…"` for visuals
- ❑ No hardcoded color in templates
- ❑ No hardcoded spacing / radius / shadow in templates
- ❑ Reads from Falcon Tailwind Theme (Layer 1 + 2 + 3 token chain)
- ❑ All 9 interactive states defined (or N/A with rationale)
- ❑ Supports dark mode (automatic via cascade)
- ❑ Supports resizing (sm/md/lg variants + `min-w-0` / `min-h-0` safe)
- ❑ Supports Angular forms / events (if applicable — input components)
- ❑ Stencil component works in Web Component context unchanged

## Scorecard table (audit fills row per component)

| Component | Theme score | Token score | State score | Dark score | Resize score | Angular wrapper score | Issues | Action |
|---|---:|---:|---:|---:|---:|---:|---|---|
| falcon-button | __ | __ | __ | __ | __ | __ | … | … |
| falcon-input | __ | __ | __ | __ | __ | __ | … | … |
| falcon-data-table | __ | __ | __ | __ | __ | __ | … | … |
| falcon-tree-panel | __ | __ | __ | __ | __ | __ | … | … |
| … (60 rows) | … | … | … | … | … | … | … | … |

Use the [[Component Theme Contract Template]] to fill each component's row.

## Score bands

| Band | Range | Verdict |
|---|---|---|
| 🟢 Production-ready | 90 – 100 | Ship as-is; routine maintenance only |
| 🟢 Good, minor gaps | 75 – 89 | Backlog cleanup; not blocking |
| 🟡 Usable, needs cleanup | 60 – 74 | Wave 2 target |
| 🟠 Risky | 40 – 59 | Wave 1 target |
| 🔴 Not ready | 0 – 39 | Deprecate / rebuild / urgent rewrite |

## Per-dimension definitions

### Theme score

- 100 — Zero hardcoded colors, no inline styles, all templates use tokenized utilities
- 75 — Mostly tokenized; 1-2 cosmetic hardcodes
- 50 — Mixed; some templates still hardcode colors
- 25 — Many hardcoded values
- 0 — Templates ignore the theme system

### Token score

- 100 — Every visual property reads from a Layer 2 semantic token or Layer 3 component token
- 75 — Mostly Layer 2; some Layer 1 primitive leaks
- 50 — Frequent Layer 1 leaks
- 25 — Component bypasses tokens entirely
- 0 — No token contract file exists

### State score

- 100 — All 9 states defined; default, hover, focus-visible, active, disabled, loading, error, selected/expanded, dark — or marked N/A with rationale
- 75 — 7-8 states; minor gaps
- 50 — Half the states defined
- 25 — Only default + hover
- 0 — Only default

### Dark score

- 100 — Component visually correct in dark mode without custom dark CSS
- 75 — Works in dark; minor polarity issues (e.g., hover darker than panel)
- 50 — Some elements break in dark
- 25 — Most elements break in dark
- 0 — Component unusable in dark mode

### Resize score

- 100 — Passes the 10-item resizing checklist in [[Tailwind Sizing and Responsive]]
- 75 — 7-8 items pass
- 50 — Half pass
- 25 — Component breaks at sub-default widths
- 0 — Component requires fixed pixel width to render

### Angular wrapper score

- 100 — Wrapper exists, exposes complete prop/event/slot API, maps to Stencil 1:1, CVA support if input, OnPush
- 75 — Wrapper exists with minor API gaps
- 50 — Wrapper exists but redesigns the component or misses key API
- 25 — Lab-only / partial wrapper
- 0 — No wrapper (consumer must use Stencil directly)
- N/A — Not applicable (e.g., directives, utilities)

## Overall readiness formula

```
overall = weighted_mean(
  theme_score      * 0.20,
  token_score      * 0.20,
  state_score      * 0.20,
  dark_score       * 0.15,
  resize_score     * 0.10,
  wrapper_score    * 0.15,
)
```

## Aggregate metrics (computed when scorecard is filled)

| Metric | Calculation | Current |
|---|---|---|
| Components production-ready (90+) | Count in 90-100 band | TBD — audit not yet run |
| Components risky (<60) | Count in 0-59 bands | TBD |
| Average overall score | mean(overall) | TBD |
| Worst dimension | min by dimension | TBD |
| Wave 1 backlog size | Count in 40-59 band | TBD |
| Wave 2 backlog size | Count in 60-74 band | TBD |

## When to run a full audit

| Trigger | Action |
|---|---|
| Quarterly sprint planning | Re-run scorecard; refresh Wave backlog |
| New component added | Add row + initial scoring |
| Wave 1 implementation lands | Re-score affected components |
| Theme primitive renamed | Re-score all components consuming that primitive |

## Reading order for first audit

1. [[Falcon Tailwind Theme]] — understand the theme system being audited against
2. [[Falcon Component Theme Contract]] — understand the 9-section contract
3. [[Component Theme Contract Template]] — copy template per component being audited
4. [[Tailwind Implementation Review Checklist]] — apply per-PR checks to existing components

## See also

- [[Falcon Tailwind Theme]] · [[Falcon Component Theme Contract]] · [[Component Theme Contract Template]] · [[Tailwind Implementation Review Checklist]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-component-audit-scorecard](../../Brain%20Outputs/understanding/frontend/theme/falcon-component-audit-scorecard.md)
- Existing per-component dossiers: `Brain Outputs/understanding/frontend/components/<name>/` (60 components × 6 files)

## Tags

#type/reference #layer/frontend #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FALCON_COMPONENT_INDEX]] · [[FRONTEND_INDEX]]
