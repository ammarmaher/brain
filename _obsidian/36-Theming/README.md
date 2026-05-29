---
type: moc
hub: theming
cluster: theming
scope: current-angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Theming Cluster — Tailwind + Falcon design tokens — Angular-first ***
*** Current scope: Angular wrapper + Stencil components ***
*** React/Vue: FUTURE PLACEHOLDERS only — not current delivery ***

# 36-Theming

> 🟢 **CURRENT DELIVERY SCOPE:** Falcon Tailwind Theme + Stencil components + Angular wrappers + Angular app integration.
> 🟡 **FUTURE EXTENSION (NOT CURRENT):** React + Vue wrappers — placeholder notes preserved so a future contributor can pick them up.
>
> The graph layer over Falcon's styling foundation. The architecture is framework-neutral by design, but **all active implementation, audit, and enforcement work focuses on Angular.** Brain Outputs `understanding/frontend/theme/` holds the audit SoT; this folder holds the navigable index.

## Library entry

- [[Tailwind CSS]] — main library node. Start here.

## Tailwind upstream notes (docs-anchored)

### Foundation
| Note | Topic |
|---|---|
| [[Tailwind Mental Model]] ★ | 3-layer token doctrine (primitive → semantic → component) |
| [[Tailwind Installation and Setup]] | npm install, Vite plugin, Angular postcss |
| [[Tailwind Theme Variables]] | `@theme` vs `:root`, namespace table |
| [[Tailwind Official Docs Map]] | Canonical URL anchors + fetch-before-implementation rule |

### Visual primitives
| Note | Topic |
|---|---|
| [[Tailwind Colors and Palette]] | 11-stop canon, OKLCH, alpha modifiers |
| [[Tailwind Spacing Radius Shadow Borders]] | The 4 visual-rhythm token families |
| [[Tailwind Sizing and Responsive]] | width/height/size + responsive + container queries |
| [[Tailwind Layout Flex Grid]] | Flex / grid / container / overflow |

### Interaction + theming
| Note | Topic |
|---|---|
| [[Tailwind Dark Mode]] | `@custom-variant dark`, three-state pattern |
| [[Tailwind States and Variants]] | 60 variants — hover/focus/group/peer/has/aria/data |

### Customization + tooling
| Note | Topic |
|---|---|
| [[Tailwind Custom Styles and Layers]] | `@utility`, `@layer`, when to extract |
| [[Tailwind Directives and Functions]] | Every v4 directive + function |
| [[Tailwind Source Detection]] | `@source`, static-string rule, safelist |
| [[Tailwind Preflight]] | Base reset, customization, disable patterns |
| [[Tailwind Utility-First Philosophy]] | Utility-first rationale, managing duplication |
| [[Tailwind Multi-Framework Strategy]] | Framework-neutral architecture (Angular active; React/Vue future) |

### Quick reference
| Note | Topic |
|---|---|
| [[Tailwind Utility Cheatsheet]] | One-page lookup for every utility family |

## Falcon-specific notes (codebase-anchored)

### Theme governance (read first)

| Note | Topic | SoT |
|---|---|---|
| [[Falcon Tailwind Theme]] ★ | THE styling source of truth + 5 governance rules | [theme/falcon-tailwind-theme](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-theme.md) |
| [[Falcon Component Theme Contract]] ★ | 9-section contract every component must satisfy | [theme/falcon-component-theme-contract](../../Brain%20Outputs/understanding/frontend/theme/falcon-component-theme-contract.md) |
| [[Tailwind Falcon Alignment Scorecard]] | 71% today → 93% via 2-wave fix | [theme/falcon-tailwind-alignment-scorecard](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-alignment-scorecard.md) |

### Tokens

| Note | Topic | SoT |
|---|---|---|
| [[Falcon Design Tokens]] | How Falcon's `@theme` works (dual-system architecture) | [theme/falcon-design-tokens-graph](../../Brain%20Outputs/understanding/frontend/theme/falcon-design-tokens-graph.md) |
| [[Falcon Color Palette Audit]] | 27 neutrals, 18 teals — over-granulation review | [theme/falcon-color-palette-audit](../../Brain%20Outputs/understanding/frontend/theme/falcon-color-palette-audit.md) |

### Wrappers — CURRENT delivery scope (Angular)

| Note | Topic | SoT |
|---|---|---|
| [[Falcon Angular Wrapper Pattern]] ★ | **CURRENT** — Angular wrapper consumes Stencil + Tailwind | [theme/falcon-angular-wrapper-pattern](../../Brain%20Outputs/understanding/frontend/theme/falcon-angular-wrapper-pattern.md) |
| [[Falcon Stencil-to-Angular Bridge]] | **CURRENT** — Stencil → Angular bridge mechanics | [theme/falcon-stencil-to-angular-bridge](../../Brain%20Outputs/understanding/frontend/theme/falcon-stencil-to-angular-bridge.md) |
| [[Tailwind Multi-Framework Strategy]] | Framework-neutral architecture overview | [theme/falcon-multi-framework-wrapper-strategy](../../Brain%20Outputs/understanding/frontend/theme/falcon-multi-framework-wrapper-strategy.md) |

### Wrappers — FUTURE EXTENSION (NOT current scope)

| Note | Status |
|---|---|
| [[Falcon React Wrapper Future Pattern]] | 🟡 PLACEHOLDER — preserve architecture for future contributors |
| [[Falcon Vue Wrapper Future Pattern]] | 🟡 PLACEHOLDER — preserve architecture for future contributors |

## Audit & governance tooling (new 2026-05-20)

| Artifact | Purpose |
|---|---|
| [[Falcon Component Audit Scorecard]] ★ | Per-component 6-dimension compliance audit framework |
| [[Component Theme Contract Template]] | Markdown stub to copy per new component |
| [[Tailwind Implementation Review Checklist]] | Pre-merge PR review checklist |
| [[Falcon Component Tailwind Audit 2026-05-20]] | First audit run — 77% overall · 124-item backlog |

## Folder structure + token generation (new 2026-05-20)

| Note | Purpose |
|---|---|
| [[Falcon Theme Folder Structure]] ★ | Full audit of 5 theme libraries — file ownership + SoT vs generated |
| [[Falcon Token Generation Flow]] ★ | The 8-stage pipeline: @theme → tokens.ts → contracts → templates → Studio |
| [[Falcon Generated Files Rules]] | What's auto-generated, what's manual, the DO-NOT-EDIT contract |
| [[Falcon Component Library Structure]] | Stencil + Angular wrapper + Tailwind class-maps anatomy |
| [[Falcon Studio Token Registry Flow]] | How Theme Studio consumes the token system |
| [[Falcon Wave 1A Readiness]] ★ | Pre-Wave-1 readiness gate (75% ready — visual-diff CI gate is critical missing piece) |

## Light Mode Visual Baseline (new 2026-05-20)

> The "before" snapshot of Falcon's current implemented visual identity. Any token / theme / page change must preserve this baseline unless Ammar approves change. Read these BEFORE editing tokens, BEFORE building a new page, BEFORE refactoring component styles.

| Note | Purpose |
|---|---|
| [[Falcon Light Mode Visual Baseline]] ★ | Overall visual identity — surfaces, colors, borders, shadows, radius, spacing |
| [[Falcon Current Color Usage Map]] | Every color token with hex + where used + tokenized status |
| [[Falcon Current Spacing Radius Shadow Map]] | Dimensional vocabulary — button 38px md, table cell 13×14px, radius 10/14px |
| [[Falcon Current Hover Focus State Map]] | Per-component hover/focus/active/disabled/selected behavior |
| [[Falcon Organization Hierarchy Visual Standard]] ★ | The canonical reference page — pattern-match new pages against it |
| [[Falcon Page Visual Consistency Rules]] | 12 rules for any agent creating or changing a page |
| [[Falcon Do Not Change Visual Rules]] | 20 strict guardrails — refusal list for visual changes |

## Component Recognition & Page Assembly (new 2026-05-20)

> Before creating any new page, HTML, Angular template, or component, the Brain MUST recognize each visible UI pattern and map it to an existing Falcon component. Notes live in [[60-Components/Falcon Component Recognition Playbook|60-Components]] — listed here for theming-cluster discoverability.

| Note | Purpose |
|---|---|
| [[Falcon Component Recognition Playbook]] ★ | UI pattern → Falcon component lookup table (table, dropdown, input, button, tabs, popup, status chip, tree, loader, empty state, icon, card, search/filter, pagination, upload, date picker) |
| [[Falcon Page Assembly Playbook]] ★ | Compose chosen components into a full page — shell, header, filter, table, details, tabs, form, drawer/wizard, empty/loading/error |
| [[Falcon Component Selection Decision Tree]] | Reuse → Extend → Create (in that order, never reversed) |
| [[Falcon Component Capability Matrix]] | 9-column quick-pick — UI Pattern · Component · Wrapper · States · Slots · Tokens · Gaps · Use When · Do Not Use When |
| [[Falcon Screenshot To Component Mapping Guide]] | 6-step process: regions → patterns → components → gaps → plan → (new component only as last resort) |
| [[Falcon Component Gap Registry]] | P0/P1/P2/P3 capability gaps with Component / Missing Capability / Needed-By / Reusable / Fix / Priority |
| [[Falcon New Page Implementation Checklist]] | 8-section pre-merge gate (Recognition · Baseline · Component usage · Gaps · States · Responsive · Code quality · Documentation) |

## Component Combination Intelligence (new 2026-05-20)

> How multiple Falcon components wire together to form compositions and page regions. Notes live in `60-Components/` — listed here for theming-cluster discoverability because every composition must satisfy [[Falcon Light Mode Visual Baseline]].

| Note | Purpose |
|---|---|
| [[Falcon Component Composition Playbook]] ★ | 9 composition families (Table+Actions, Tree+Details, Form, Popup, Stepper, Filter, Cards, Loading/Empty/Error, Tabs) + anti-patterns |
| [[Falcon Page Region Patterns]] | 12 named page regions (R01–R12) — components · layout · styling rules · wrong patterns |
| [[Falcon Component Combination Matrix]] | 7 canonical UI compositions with wiring templates, required states, known gaps, example pages |
| [[Falcon Data Table Composition Rules]] | Cell templates, row actions, selection, expansion, pagination, sorting, empty state — deep rules |
| [[Falcon Form Composition Rules]] | Control-to-wrapper mapping, CVA rules, label+error, grid layout, async validators, footer, unsaved changes |
| [[Falcon Popup and Drawer Composition Rules]] | Popup vs drawer decision, portal contract, z-index ladder, focus trap, loading states, a11y |
| [[Falcon Tree and Details Composition Rules]] | Split layout, node selection, PathPrefix, tabs, info-form, users-table, PES role gate, visual rules |

## Existing Brain Outputs theme/ audits (read-only SoT)

- [THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md)
- [APP_TAILWIND_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/APP_TAILWIND_AUDIT.md)
- [DARK_MODE_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/DARK_MODE_AUDIT.md)
- [DENSITY_AND_RTL_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/DENSITY_AND_RTL_AUDIT.md)
- [TOKEN_FLOW_REPORT](../../Brain%20Outputs/understanding/frontend/theme/TOKEN_FLOW_REPORT.md)
- [UTILITY_SAFELIST_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/UTILITY_SAFELIST_AUDIT.md)
- [COMPONENT_TOKEN_FILES_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/COMPONENT_TOKEN_FILES_AUDIT.md)
- [STATIC_STYLE_RISKS](../../Brain%20Outputs/understanding/frontend/theme/STATIC_STYLE_RISKS.md)
- [STYLING_RULES_CHEAT_SHEET](../../Brain%20Outputs/understanding/frontend/theme/STYLING_RULES_CHEAT_SHEET.md)
- [TAILWIND_HELPERS_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/TAILWIND_HELPERS_AUDIT.md)
- [NO_CSS_NO_SCSS_COMPLIANCE](../../Brain%20Outputs/understanding/frontend/theme/NO_CSS_NO_SCSS_COMPLIANCE.md)

## Reading order for new sessions

1. **[[Falcon Tailwind Theme]]** ★ — the 5 governance rules (5 min)
2. **[[Falcon Component Theme Contract]]** ★ — the 9-section component contract (5 min)
3. **[[Tailwind Falcon Alignment Scorecard]]** — gap analysis + 2-wave fix path (10 min)
4. **[[Tailwind CSS]]** — library index for upstream Tailwind topics
5. **[[Tailwind Multi-Framework Strategy]]** + [[Falcon Angular Wrapper Pattern]] / [[Falcon React Wrapper Future Pattern]] / [[Falcon Vue Wrapper Future Pattern]] — for cross-framework work
6. The specific upstream Tailwind note matching your task

## The architecture in one paragraph (Angular-first)

Falcon Component Library is the source of reusable UI components. Each component loads its default style from the **Falcon Tailwind Theme** ([[Falcon Tailwind Theme]]) via the **Component Theme Contract** ([[Falcon Component Theme Contract]]). **Today, the only active wrapper is the Angular wrapper** ([[Falcon Angular Wrapper Pattern]]) — it consumes Stencil components and maps cleanly to Angular forms/events/inputs/outputs. The wrapper does NOT redesign components — it only adapts framework APIs. The Stencil layer exposes stable component contracts that work in any framework that can render Web Components. **React + Vue wrappers are future placeholders** ([[Falcon React Wrapper Future Pattern]] / [[Falcon Vue Wrapper Future Pattern]]) — architecture-ready, not implementation-active. **One theme. One token system. One visual definition. One active framework adapter today (Angular). Two reserved future adapters (React, Vue).**

## Tags

#type/moc #layer/frontend #layer/design

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[Tailwind CSS]]
