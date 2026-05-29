---
type: reference
library: "[[Tailwind CSS]]"
topic: multi-framework
docs-source: https://tailwindcss.com/docs/installation/framework-guides
priority: critical
scope: current-angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Tailwind v4 Multi-Framework Strategy — Angular-first ***
*** Current scope: Angular wrapper + Stencil web components ***
*** React/Vue: FUTURE PLACEHOLDERS only — not current delivery ***

# Tailwind Multi-Framework Strategy

> 🟢 **CURRENT SCOPE: Angular + Stencil.**
> 🟡 **FUTURE EXTENSION: React + Vue** (placeholder structure only — see [[Falcon React Wrapper Future Pattern]] / [[Falcon Vue Wrapper Future Pattern]]).
>
> The architecture is framework-neutral by design — one Falcon Tailwind Theme + one component contract → ANY framework can consume. **Today, all active implementation, audit, and enforcement work targets Angular only.** React and Vue are reserved future extensions; the theme architecture supports them, but they are NOT current delivery scope.

## Current Falcon scope (2026-05-20)

| Layer | Status | Notes |
|---|---|---|
| **Falcon Tailwind Theme (SSOT)** | ✅ ACTIVE | `libs/falcon-theme/src/falcon-tailwind-tokens.css` — the one source |
| **Falcon Component Library (Stencil)** | ✅ ACTIVE | `libs/falcon-ui-core/src/components/` — 60 components |
| **Angular Wrapper Layer** | ✅ ACTIVE — CURRENT PRIORITY | 49 wrappers; 13 with production consumers |
| **Angular Apps** | ✅ ACTIVE | host-shell + admin-console + management-console |
| React playground | 🟡 SCAFFOLDED ONLY | Not delivery scope |
| Vue playground | 🟡 SCAFFOLDED ONLY | Not delivery scope |
| React wrapper library | 🟡 FUTURE PLACEHOLDER | See [[Falcon React Wrapper Future Pattern]] |
| Vue wrapper library | 🟡 FUTURE PLACEHOLDER | See [[Falcon Vue Wrapper Future Pattern]] |

## Officially supported frameworks (Tailwind v4 — reference only)

| Framework | Plugin | Falcon uses? |
|---|---|---|
| **Vite** | `@tailwindcss/vite` | ✅ libs/playgrounds |
| **Angular** | `@tailwindcss/postcss` | ✅ 3 apps — **CURRENT PRIORITY** |
| Next.js | `@tailwindcss/postcss` | — not in scope |
| Nuxt | `@tailwindcss/vite` | — not in scope |
| SvelteKit | `@tailwindcss/vite` | — not in scope |
| SolidJS | `@tailwindcss/vite` | — not in scope |
| Astro | `@tailwindcss/vite` | — not in scope |
| Qwik | `@tailwindcss/vite` | — not in scope |
| Laravel | `@tailwindcss/vite` | — not in scope |
| Rails | `tailwindcss-rails` | — not in scope |
| Phoenix | `tailwind_elixir` | — not in scope |

**Stencil is NOT in the official list.** Falcon's Stencil components consume Tailwind via the Vite plugin during their build — utilities in `.tsx` templates get included.

## The cross-framework principle

**One CSS bundle works for every framework.** Tailwind compiles `.css` files that are consumed identically:

- React: `<div className="bg-falcon-teal-700">` (JSX)
- Vue: `<div class="bg-falcon-teal-700">` (template)
- Angular: `<div class="bg-falcon-teal-700">` (template)
- Stencil: `<div class="bg-falcon-teal-700">` (TSX template)
- Web Component: `<div class="bg-falcon-teal-700">` (HTML)

Class names are just strings. Compiled CSS rules are framework-agnostic.

## Where frameworks DIFFER

### Class-binding syntax

| Framework | Static | Dynamic |
|---|---|---|
| React | `className="bg-red-500"` | `clsx()` / `cn()` |
| Vue | `class="bg-red-500"` | `:class="{ 'bg-red-500': X }"` |
| Angular | `class="bg-red-500"` | `[class.bg-red-500]="X"` |
| Svelte | `class="bg-red-500"` | `class:bg-red-500={X}` |
| Stencil | `class="bg-red-500"` | JSX `class={{ 'bg-red-500': X }}` |
| Web Components | `class="bg-red-500"` | `element.classList.toggle(...)` |

ALL work with Tailwind's text-scanner.

### Scoped vs global styles

| Framework | Default | Tailwind interaction |
|---|---|---|
| React | Global | Just write utilities |
| Vue | `<style scoped>` available | Needs `@reference` for `@apply` |
| Angular | `@Component(styles)` emulated shadow DOM | Utilities in templates global; component CSS scoped |
| Svelte | Scoped by default | Same as Vue |
| Stencil | Shadow DOM scoped (`shadow: true`) | **Blocks utilities** — Falcon uses `shadow: false` |

### Stencil shadow-DOM gotcha

`shadow: true` blocks global utilities. **Two solutions:**

1. **`shadow: false`** in `@Component()` decorator — utilities cascade in
2. **Inline Tailwind via `@apply`** with `@reference` — requires extra build step

Falcon uses solution 1 (see `<falcon-X-tw>` components).

## Component library guidance (docs)

> "Using component-based libraries like React or Vue, this often means **exposing specific props for styling customizations instead of letting consumers add extra classes from outside of a component**, since those styles will often conflict."

### Translation for Falcon UI Core

| Pattern | Verdict |
|---|---|
| `<falcon-button variant="primary" size="lg">` (props) | ✅ Recommended |
| `<falcon-button class="bg-red-500 px-8">` (external) | ❌ Specificity conflicts |
| `<falcon-button [style.--falcon-button-bg]="'red'">` (CSS var) | ✅ Token contract |

Falcon already does this right.

## Falcon's architecture

```
                ┌──────────────────────────────────────────────────────┐
                │   ONE SSOT — libs/falcon-theme/src/                   │
                │   falcon-tailwind-tokens.css                          │
                │   @theme { --color-falcon-* … }                      │
                │   → generates ~250 Tailwind utilities                 │
                └──────────────────────────────────────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │ Angular apps     │     │ Stencil          │     │ React/Vue        │
   │ host-shell       │     │ falcon-ui-core   │     │ playgrounds      │
   │ admin-console    │     │ (web components) │     │ (demos)          │
   │ management-      │     │                  │     │                  │
   │   console        │     │                  │     │                  │
   └──────────────────┘     └──────────────────┘     └──────────────────┘
   Angular templates +      TSX templates +          JSX className /
   class-builder TS         class-builder TS         Vue templates
```

## Angular-first delivery score (CURRENT scope only)

| Topic | Score | Note |
|---|---|---|
| Angular wrapper + Stencil consumption | **94%** | 49 wrappers; 13 production consumers; visual contract enforced via tokens |
| Theme architecture framework-neutrality | **95%** | Architecture supports future frameworks without changes |
| Falcon Tailwind Theme reachability from Angular | **97%** | Templates consume utilities directly; dark cascade flips automatically |
| **Angular-first delivery readiness** | **95%** | Strong — Wave 1 + Wave 2 lift to 97% |

### Score notes
- React and Vue are NOT counted in Angular-first delivery — they're future placeholders only.
- Caveat: dual token namespaces (`--color-falcon-*` vs `--falcon-color-*`) costs −3% (bridge works but doubles maintenance).
- Caveat: Stencil `shadow: true` legacy components (~10 of 60) don't see utilities, costs −2%.

## Future extension scope (NOT current delivery)

| Item | Status |
|---|---|
| React wrapper library | 🟡 Placeholder only — see [[Falcon React Wrapper Future Pattern]] |
| Vue wrapper library | 🟡 Placeholder only — see [[Falcon Vue Wrapper Future Pattern]] |
| Future-readiness score | NOT calculated — out of current scope |

## See also

- [[Tailwind CSS]] · [[Tailwind Utility-First Philosophy]] · [[Tailwind Falcon Alignment Scorecard]] · [[Falcon Angular Wrapper Pattern]] · [[Falcon Stencil-to-Angular Bridge]]
- Brain Outputs: [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)

## Tags

#type/reference #layer/frontend #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FALCON_COMPONENT_INDEX]] · [[FRONTEND_INDEX]]
