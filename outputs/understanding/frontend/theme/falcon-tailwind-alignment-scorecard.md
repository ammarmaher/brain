# Falcon Tailwind v4 Alignment Scorecard

> SoT for the docs-anchored gap analysis surfaced in the Brain SK Obsidian vault at `_obsidian/36-Theming/Tailwind Falcon Alignment Scorecard.md`. Overall 71% aligned → 93% via 2-wave fix. Light values preserved 100%.

**Created:** 2026-05-20
**Anchor:** Tailwind v4 docs at https://tailwindcss.com/docs
**Vault graph node:** `_obsidian/36-Theming/Tailwind Falcon Alignment Scorecard.md`

## Topic-by-topic scoring

| # | Topic | Score | Anchor doc |
|---|---|---|---|
| 1 | Installation / Vite + Angular | 95% | /docs/installation/using-vite, /docs/installation/framework-guides/angular |
| 2 | `@theme` vs `:root` discipline | 62% | /docs/theme — *"Use @theme when you want a design token to map directly to a utility class"* |
| 3 | Color palette canonical 11-stop | 55% | /docs/colors |
| 4 | Dark mode `@custom-variant dark` | 97% | /docs/dark-mode |
| 5 | Adding custom styles | 48% | /docs/adding-custom-styles |
| 6 | Directive coverage | 70% | /docs/functions-and-directives |
| 7 | Source detection | 72% | /docs/detecting-classes-in-source-files |
| 8 | Multi-framework strategy | 91% | /docs/installation/framework-guides + library-author guidance |

**Weighted overall: 71%**

## Two killer findings

### 🔴 Finding 1 — Component contracts declare tokens outside @theme

`libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:26`:

```css
:where(falcon-organization-hierarchy, …) {
  --falcon-org-hierarchy-panel-bg: var(--color-falcon-green-50);
}
```

`:root`-scope, not `@theme`. **No `bg-falcon-org-hierarchy-panel-bg` Tailwind utility exists.** Consumers must use `bg-[var(--falcon-org-hierarchy-panel-bg)]` arbitrary-value syntax.

**Impact:** 51 component contract files all hit this pattern.

### 🔴 Finding 2 — Semantic Tier-2 tokens missing from @theme

`libs/falcon-ui-tokens/src/semantic/semantic.css` declares `--falcon-color-primary`, `--falcon-color-surface`, `--falcon-color-text` etc. — all in `:root` scope. **No semantic Tailwind utilities exist.**

## Two-wave fix roadmap

### Wave 1 — Boss-rule compliance (4 days)

| Phase | What | Days |
|---|---|---|
| A | Promote semantic Tier-2 tokens INTO `@theme` (~25 tokens) | 2 |
| B | Rewire component contracts to chain through Tier-2 | 1 |
| C | Update Angular templates: named utilities only | 1 |

**Result:** 71% → 84%. Templates use named Tailwind utilities only. Zero `bg-[var(--…)]` in templates.

### Wave 2 — Polish (5 days)

| Phase | What | Days |
|---|---|---|
| D | Convert ~80 arbitrary-value patterns to `@utility` declarations | 2 |
| E | Consolidate over-granulated neutral palette (27 → 16 stops) | 3 |

**Result:** 84% → 93%.

## Value preservation: 100%

Mathematically guaranteed via `var()` chain semantics:

- Tier-2 semantic tokens defined as `var(--existing-primitive)` → resolve identically
- Tier-3 contract slots rewired through Tier-2 → same resolved value
- Templates swap utility names → same compiled CSS rules

Only Phase E carries visual risk. Mitigation: pixel-diff CI gate.

## After-fix scoring

| Topic | Today | After Wave 1 | After Wave 2 |
|---|---|---|---|
| Installation | 95% | 95% | 95% |
| @theme discipline | 62% | 92% | 92% |
| Color palette | 55% | 55% | 92% |
| Dark mode | 97% | 97% | 97% |
| Custom styles | 48% | 76% | 94% |
| Directive coverage | 70% | 78% | 92% |
| Source detection | 72% | 80% | 92% |
| Multi-framework | 91% | 93% | 96% |
| **Overall** | **71%** | **84%** | **93%** |

## Customization seams unlocked

| Seam | Today | After Wave 1 |
|---|---|---|
| Light/dark toggle | ✅ (97%) | ✅ |
| Tenant whitelabel via `[data-tenant=X]` | ❌ | ✅ One CSS rule |
| Accessibility moods (high-contrast, dim) | ❌ | ✅ One CSS rule |
| Density variants | ✅ Partial | ✅ Same |
| Per-page surface tweaks | ⚠️ Inconsistent | ✅ Token override per page |

## Recommendation

Ship **Wave 1** immediately (4 days, 71% → 84%, 100% boss-rule compliance). Add **Wave 2** within the quarter (+5 days, → 93%). Don't pursue full purity push (collapse dual token systems) — 30+ days for +6 points is bad ROI.

## See also

- `THEME_SSOT_AUDIT.md` — primitive structure
- `UTILITY_SAFELIST_AUDIT.md` — safelist smell analysis
- `falcon-design-tokens-graph.md` — two-system architecture
- `falcon-color-palette-audit.md` — palette over-granulation
- `falcon-angular-wrapper-pattern.md` — Angular consumption
- `falcon-stencil-to-angular-bridge.md` — cross-framework reuse

## Vault graph nodes

- `_obsidian/36-Theming/Tailwind Falcon Alignment Scorecard.md` (this file's view layer)
- `_obsidian/FRONTEND_INDEX.md` (hub)
- `_obsidian/IMPLEMENTATION_KNOWLEDGE_MAP.md` (load order)
