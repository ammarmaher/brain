---
type: library
kind: design-system-foundation
package: tailwindcss
version: 4.x
status: active
homepage: https://tailwindcss.com/docs
created: 2026-05-20
---
*** Tailwind CSS v4 — utility-first CSS engine for Falcon ***
*** Library entry — indexes upstream knowledge + Falcon scorecard ***
*** SoT: Tailwind docs (linked) + Brain Outputs/understanding/frontend/theme/ ***

# Tailwind CSS

> Tailwind v4 is the CSS engine that powers every Falcon surface — Angular templates, Stencil web components, React/Vue playgrounds. Single `@theme { … }` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` generates ~250 utility classes that all frameworks consume identically.

## At a glance

- **Version**: v4.x (CSS-first config, no `tailwind.config.js`)
- **Falcon SSOT**: `libs/falcon-theme/src/falcon-tailwind-tokens.css`
- **Apps**: 3 (host-shell · admin-console · management-console) via `@tailwindcss/postcss`
- **Libs**: 9 — `falcon-ui-core` (Stencil), `falcon-theme`, `falcon-ui-tokens`, … via `@tailwindcss/vite`
- **Dark mode**: `@custom-variant dark (&:where(.app-dark, .app-dark *));`
- **Browser floor**: Chrome 111+, Safari 16.4+, Firefox 128+

## Falcon alignment with Tailwind v4 docs

| Topic | Score | Note |
|---|---|---|
| Installation (Vite + Angular) | 95% | [[Tailwind Installation and Setup]] |
| `@theme` discipline | 62% | [[Tailwind Theme Variables]] |
| Color palette | 55% | [[Tailwind Colors and Palette]] |
| Dark mode | 97% | [[Tailwind Dark Mode]] |
| Custom styles | 48% | [[Tailwind Custom Styles and Layers]] |
| Directive coverage | 70% | [[Tailwind Directives and Functions]] |
| Source detection | 72% | [[Tailwind Source Detection]] |
| **Overall** | **71%** | See [[Tailwind Falcon Alignment Scorecard]] |

## Note index

### Upstream Tailwind knowledge (docs-anchored)

**Foundation:**
- [[Tailwind Mental Model]] ★ — 3-layer token doctrine
- [[Tailwind Installation and Setup]] — npm install, Vite plugin, Angular postcss
- [[Tailwind Theme Variables]] — `@theme` vs `:root`, namespace table
- [[Tailwind Official Docs Map]] — canonical URL anchors + fetch-before-implementation rule

**Visual primitives:**
- [[Tailwind Colors and Palette]] — 11-stop canon, OKLCH, alpha modifiers
- [[Tailwind Spacing Radius Shadow Borders]] — 4 visual-rhythm token families
- [[Tailwind Sizing and Responsive]] — width/height/size + responsive + container queries
- [[Tailwind Layout Flex Grid]] — flex / grid / container / overflow

**Interaction + theming:**
- [[Tailwind Dark Mode]] — `@custom-variant dark`, three-state pattern
- [[Tailwind States and Variants]] — 60 variants (hover/focus/group/peer/has/aria/data)

**Customization + tooling:**
- [[Tailwind Custom Styles and Layers]] — `@utility`, `@layer`, when to extract
- [[Tailwind Directives and Functions]] — every v4 directive + function reference
- [[Tailwind Source Detection]] — `@source`, static-string rule, safelist
- [[Tailwind Preflight]] — base reset, customization, disable patterns
- [[Tailwind Utility-First Philosophy]] — utility-first rationale, managing duplication
- [[Tailwind Multi-Framework Strategy]] — framework-neutral architecture

**Quick reference:**
- [[Tailwind Utility Cheatsheet]] — one-page lookup for every utility family

### Falcon-specific (codebase-anchored)

**Theme governance (read first):**
- [[Falcon Tailwind Theme]] ★ — THE styling source of truth + 5 governance rules
- [[Falcon Component Theme Contract]] ★ — 9-section contract every component must satisfy
- [[Tailwind Falcon Alignment Scorecard]] — gap analysis + 2-wave fix path (71% → 93%)

**Tokens:**
- [[Falcon Design Tokens]] — how `@theme` is structured (dual-system architecture)
- [[Falcon Color Palette Audit]] — 27 neutrals, 18 teals, over-granulation review

**Cross-framework wrappers:**
- [[Falcon Angular Wrapper Pattern]] — 🟢 CURRENT (49 wrappers, 13 with consumers)
- [[Falcon Stencil-to-Angular Bridge]] — 🟢 CURRENT (cross-framework reuse mechanics)
- [[Falcon React Wrapper Future Pattern]] — 🟡 FUTURE PLACEHOLDER
- [[Falcon Vue Wrapper Future Pattern]] — 🟡 FUTURE PLACEHOLDER

**Audit + governance tooling:**
- [[Falcon Component Audit Scorecard]] ★ — per-component 6-dimension audit framework
- [[Component Theme Contract Template]] — markdown stub to copy per new component
- [[Tailwind Implementation Review Checklist]] — pre-merge PR review checklist
- [[Falcon Component Tailwind Audit 2026-05-20]] — first run, 77% overall + 124-item backlog

**Folder structure + token generation (new 2026-05-20):**
- [[Falcon Theme Folder Structure]] ★ — full audit of 5 theme libraries
- [[Falcon Token Generation Flow]] ★ — 8-stage pipeline (@theme → tokens.ts → contracts → templates)
- [[Falcon Generated Files Rules]] — DO-NOT-EDIT contract enumeration
- [[Falcon Component Library Structure]] — Stencil + wrapper + class-maps anatomy
- [[Falcon Studio Token Registry Flow]] — Studio consumption pattern
- [[Falcon Wave 1A Readiness]] ★ — pre-Wave-1 readiness gate (75%)

**Light Mode Visual Baseline (new 2026-05-20):**
- [[Falcon Light Mode Visual Baseline]] ★ — overall visual identity (surfaces, colors, borders, shadows, radius, spacing)
- [[Falcon Current Color Usage Map]] — every color token with hex + where used
- [[Falcon Current Spacing Radius Shadow Map]] — dimensional vocabulary
- [[Falcon Current Hover Focus State Map]] — per-component interactive-state behavior
- [[Falcon Organization Hierarchy Visual Standard]] ★ — canonical reference page
- [[Falcon Page Visual Consistency Rules]] — 12 rules for new pages
- [[Falcon Do Not Change Visual Rules]] — 20 strict guardrails

## Top-level documentation links

| Tailwind docs | URL |
|---|---|
| Installation (Vite) | https://tailwindcss.com/docs/installation/using-vite |
| Theme variables | https://tailwindcss.com/docs/theme |
| Colors | https://tailwindcss.com/docs/colors |
| Dark mode | https://tailwindcss.com/docs/dark-mode |
| Hover/focus/states | https://tailwindcss.com/docs/hover-focus-and-other-states |
| Adding custom styles | https://tailwindcss.com/docs/adding-custom-styles |
| Functions & directives | https://tailwindcss.com/docs/functions-and-directives |
| Source detection | https://tailwindcss.com/docs/detecting-classes-in-source-files |
| Preflight | https://tailwindcss.com/docs/preflight |
| Responsive design | https://tailwindcss.com/docs/responsive-design |
| Framework guides | https://tailwindcss.com/docs/installation/framework-guides |

## Tags

#type/library #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
