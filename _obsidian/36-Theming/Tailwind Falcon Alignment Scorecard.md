---
type: reference
library: "[[Tailwind CSS]]"
topic: gap-analysis
priority: critical
created: 2026-05-20
---
*** Tailwind v4 docs vs Falcon — alignment scorecard ***
*** Overall: 71% today → 93% via 2-wave fix path ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-tailwind-alignment-scorecard.md ***

# Tailwind Falcon Alignment Scorecard

> Honest, docs-anchored scorecard for Falcon's theming architecture vs Tailwind v4 best practice. Overall **71% aligned**. Strongest: dark mode (97%), installation (95%). Weakest: arbitrary-value over-use (48%), `@theme` discipline (62%). Two-wave fix takes Falcon to **93% in ~9 days** without changing a single light-mode color value.

## Overall: **71%**

| # | Topic | Score | Severity |
|---|---|---|---|
| 1 | Installation / Vite + Angular | **95%** | 🟢 LOW |
| 2 | `@theme` vs `:root` discipline | **62%** | 🔴 HIGH |
| 3 | Color palette (11-stop canonical) | **55%** | 🟡 MED |
| 4 | Dark mode (`@custom-variant dark`) | **97%** | 🟢 LOW |
| 5 | Adding custom styles | **48%** | 🔴 HIGH |
| 6 | Directive coverage | **70%** | 🟡 MED |
| 7 | Source detection / safelist | **72%** | 🟡 MED |
| 8 | Multi-framework strategy | **91%** | 🟢 LOW |

## Two killer findings

### 🔴 Finding 1 — Component contracts declare tokens OUTSIDE @theme

[CODE] `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:26`:

```css
:where(falcon-organization-hierarchy, …) {
  --falcon-org-hierarchy-panel-bg: var(--color-falcon-green-50);
}
```

`:root`-scope, not `@theme`. **No `bg-falcon-org-hierarchy-panel-bg` utility exists.** Consumer templates must use `bg-[var(--falcon-org-hierarchy-panel-bg)]` — arbitrary-value syntax.

Multiplied across **51 component contract files** = 51× violation.

### 🔴 Finding 2 — Semantic Tier-2 tokens missing from @theme

`libs/falcon-ui-tokens/src/semantic/semantic.css` declares 25+ semantic tokens (`--falcon-color-primary`, `--falcon-color-surface`, `--falcon-color-text`) — all in `:root` scope.

No `bg-falcon-color-primary` utility exists.

## Two-wave fix roadmap

### Wave 1 — Boss-rule compliance (4 days)

| Phase | What | Days |
|---|---|---|
| A | Promote semantic Tier-2 tokens INTO `@theme` (~25 tokens) | 2 |
| B | Rewire component contracts to chain through Tier-2 | 1 |
| C | Update Angular templates: named utilities only | 1 |

**After Wave 1: 71% → 84%.** Templates use only named Tailwind utilities. Zero `bg-[var(--…)]`.

### Wave 2 — Polish (5 days)

| Phase | What | Days |
|---|---|---|
| D | Convert ~80 inline-safelisted arbitrary-value patterns to `@utility` | 2 |
| E | Consolidate over-granulated neutral palette (27 → 16 stops) | 3 |

**After Wave 2: 84% → 93%.**

## Value preservation: **100%**

Every fix is structural-additive. Light primitive values are **never** edited. Tier-2 semantic tokens defined as `var(--existing-primitive)` → resolve identically. Tier-3 contract slots rewired through Tier-2 → resolve identically.

Only **Phase E** carries real visual risk (palette consolidation) — needs pixel-diff CI gate.

## After-fix scoring

| Topic | Today | After Wave 1 | After Wave 2 |
|---|---|---|---|
| Installation | 95% | 95% | 95% |
| @theme discipline | 62% | **92%** | 92% |
| Color palette | 55% | 55% | **92%** |
| Dark mode | 97% | 97% | 97% |
| Custom styles | 48% | **76%** | **94%** |
| Directive coverage | 70% | 78% | **92%** |
| Source detection | 72% | 80% | **92%** |
| Multi-framework | 91% | **93%** | **96%** |
| **Overall** | **71%** | **84%** | **93%** |

## Customization seams unlocked

| Seam | Today | After Wave 1 |
|---|---|---|
| Light/dark toggle | ✅ | ✅ |
| Tenant whitelabel via `[data-tenant=X]` | ❌ | ✅ One rule |
| Accessibility moods | ❌ | ✅ One rule |
| Per-page surface tweaks | ⚠️ Inconsistent | ✅ Token override |

## Recommendation

**Ship Wave 1 immediately (4 days, 71% → 84%).** Add Wave 2 within the quarter. Don't pursue full purity push (30+ days for +6 points — bad ROI).

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Colors and Palette]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Multi-Framework Strategy]] · [[Falcon Design Tokens]] · [[Falcon Color Palette Audit]]
- Brain Outputs SoT: [falcon-tailwind-alignment-scorecard](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-alignment-scorecard.md)

## Tags

#type/reference #layer/frontend #priority/critical #gap

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
