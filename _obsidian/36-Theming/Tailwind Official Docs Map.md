---
type: reference
library: "[[Tailwind CSS]]"
topic: docs-map
created: 2026-05-20
---
*** Tailwind v4 Official Docs Map — canonical URL anchors ***
*** Fetch-before-implementation rule: always re-check latest docs before code changes ***
*** Upstream SoT: tailwindcss.com/docs ***

# Tailwind Official Docs Map

> Canonical URL anchors for every Tailwind v4 topic the Falcon design system cares about. **Treat these URLs as the latest source of truth.** Local vault notes hold Falcon-specific interpretation; upstream syntax always wins for ambiguity.

## Core docs

| Area | Official URL | Local note |
|---|---|---|
| Theme variables | https://tailwindcss.com/docs/theme | [[Tailwind Theme Variables]] |
| Responsive design | https://tailwindcss.com/docs/responsive-design | [[Tailwind Sizing and Responsive]] |
| Hover/focus/other states | https://tailwindcss.com/docs/hover-focus-and-other-states | [[Tailwind States and Variants]] |
| Dark mode | https://tailwindcss.com/docs/dark-mode | [[Tailwind Dark Mode]] |
| Colors | https://tailwindcss.com/docs/colors | [[Tailwind Colors and Palette]] |
| Adding custom styles | https://tailwindcss.com/docs/adding-custom-styles | [[Tailwind Custom Styles and Layers]] |
| Detecting classes in source files | https://tailwindcss.com/docs/detecting-classes-in-source-files | [[Tailwind Source Detection]] |
| Functions and directives | https://tailwindcss.com/docs/functions-and-directives | [[Tailwind Directives and Functions]] |
| Preflight | https://tailwindcss.com/docs/preflight | [[Tailwind Preflight]] |
| Styling with utility classes | https://tailwindcss.com/docs/styling-with-utility-classes | [[Tailwind Utility-First Philosophy]] |

## Sizing docs

| Area | Official URL | Local note |
|---|---|---|
| Width | https://tailwindcss.com/docs/width | [[Tailwind Sizing and Responsive]] |
| Height | https://tailwindcss.com/docs/height | [[Tailwind Sizing and Responsive]] |
| Min width | https://tailwindcss.com/docs/min-width | [[Tailwind Sizing and Responsive]] |
| Max width | https://tailwindcss.com/docs/max-width | [[Tailwind Sizing and Responsive]] |
| Min height | https://tailwindcss.com/docs/min-height | [[Tailwind Sizing and Responsive]] |
| Max height | https://tailwindcss.com/docs/max-height | [[Tailwind Sizing and Responsive]] |
| Aspect ratio | https://tailwindcss.com/docs/aspect-ratio | [[Tailwind Sizing and Responsive]] |
| Size | https://tailwindcss.com/docs/size | [[Tailwind Sizing and Responsive]] |

## Installation docs

| Area | Official URL | Local note |
|---|---|---|
| Using Vite | https://tailwindcss.com/docs/installation/using-vite | [[Tailwind Installation and Setup]] |
| Framework guides | https://tailwindcss.com/docs/installation/framework-guides | [[Tailwind Installation and Setup]] · [[Tailwind Multi-Framework Strategy]] |
| Angular guide | https://tailwindcss.com/docs/installation/framework-guides/angular | [[Tailwind Installation and Setup]] |
| Using PostCSS | https://tailwindcss.com/docs/installation/using-postcss | [[Tailwind Installation and Setup]] |
| Tailwind CLI | https://tailwindcss.com/docs/installation/tailwind-cli | (reference only) |
| Play CDN | https://tailwindcss.com/docs/installation/play-cdn | (not used in Falcon) |

## Migration / changelog

| Area | Official URL | Local note |
|---|---|---|
| Upgrade guide | https://tailwindcss.com/docs/upgrade-guide | (read before any v4 migration) |
| v4 release blog | https://tailwindcss.com/blog/tailwindcss-v4 | (read before any v4 migration) |
| Compatibility | https://tailwindcss.com/docs/compatibility | [[Tailwind Installation and Setup]] |
| Editor setup | https://tailwindcss.com/docs/editor-setup | (developer ergonomics) |

## Fetch-before-implementation rule

Before changing Falcon theming code:

1. **Re-open the relevant official docs** from this map.
2. **Check if Tailwind syntax changed** — v4 is evolving; minor releases add features.
3. **Apply Falcon-specific rules only after confirming upstream syntax** matches.
4. **If docs and old Obsidian notes conflict:**
   - For Tailwind syntax → **latest official docs win**
   - For Falcon architecture constraints → **vault notes win** (those are project decisions)
5. **If a local note appears stale**, update it with frontmatter `verified-at: <date>` after re-fetching.

## When to re-fetch

| Trigger | Action |
|---|---|
| Starting a Wave 1 / Wave 2 implementation | Re-fetch the affected docs |
| Tailwind ships a new minor (v4.x → v4.y) | Re-fetch upgrade guide + changed docs |
| Encountering syntax that doesn't compile | Re-fetch the docs for that utility |
| Quarterly review | Re-fetch all 7 core docs |

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
