---
type: reference
library: "[[Tailwind CSS]]"
topic: studio-registry
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Studio Token Registry Flow ***
*** How Theme Studio consumes the token system + presents it for live editing ***
*** Read-only audit — no Studio changes ***

# Falcon Studio Token Registry Flow

> Theme Studio (`libs/falcon-studio/`) is the live token-editor UI. It consumes the same SSOT @theme + per-component contracts the rest of the system uses, but exposes them through a curated registry that drives Studio's UI (token explorer, palette picker, animation presets, gallery, etc.). This note maps the Studio registry layer end-to-end.

## What Studio IS and ISN'T

| ✅ Studio IS | ❌ Studio is NOT |
|---|---|
| A live token-edit UI | A separate token system |
| A registry of curated knobs over the existing tokens | A bypass for the SSOT |
| A gallery of component examples per token | A way to ship app-level styling |
| A read-write surface for designers | A consumer-of-record (apps consume the SSOT directly) |
| A way to demo per-tenant / per-theme variations | A standalone library that ships outside the workspace |

**Studio's job:** make tokens discoverable and tweakable. It's a TOOL that REFLECTS the SSOT, not a SECOND token system.

## Registry files (audited 2026-05-20)

`libs/falcon-studio/src/lib/registry/`:

| File | Purpose | SoT or Generated | Edited by |
|---|---|---|---|
| `component-tokens.generated.ts` | **AUTO-GENERATED** mirror of every component's tokens for Studio's token-explorer | ❌ Never edit | Studio codegen |
| `component-tokens.helpers.ts` | Manual helpers — grouping, search, validation, fallback resolution | SoT (manually edited) | Studio author |
| `abstraction-map.registry.ts` | Maps semantic intents → consumer-facing knobs (e.g., "Brand color" → `--color-falcon-teal-700` + dark counterpart) | SoT | Studio author |
| `tokens.registry.ts` | Token catalog metadata — categories, descriptions, ranges, validation rules | SoT | Studio author |
| `component-examples.registry.ts` + `.types.ts` | Per-component live demo registry — which examples to show, which knobs to wire | SoT | Studio author |
| `color-palette.config.ts` | Palette explorer config — which color families show in palette picker | SoT | Studio author |
| `animation-presets.config.ts` | Animation registry — duration/easing presets | SoT | Studio author |
| `alignment-icons.ts` | Icon → alignment-property mapping for UI | SoT | Studio author |
| `common-actions.config.ts` | Reusable Studio actions (reset, randomize, export) | SoT | Studio author |
| `gallery-defaults.ts` | Default state for the gallery views | SoT | Studio author |
| `popup-control-matrix.ts` | Per-popup-variant control matrix | SoT | Studio author |
| `loader-studio/` (sub-folder) | Loader-specific Studio module | SoT | Studio author |
| `examples/` (sub-folder) | Example components for Studio gallery | SoT | Studio author |

## The flow

```
┌─────────────────────────────────────────────────────────────────┐
│  SSOT @theme + per-component contracts                           │
│  (the same source the apps consume)                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Codegen reads tokens
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  component-tokens.generated.ts                                   │
│  - Mirror of every component's `--falcon-<component>-*` slots    │
│  - Drives Studio token-explorer UI                               │
│  - Banner: should say AUTO-GENERATED (audit item — verify)       │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Consumed by
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Manual registry layer                                            │
│  - abstraction-map.registry.ts    (semantic → knob mapping)      │
│  - tokens.registry.ts             (token catalog metadata)       │
│  - component-tokens.helpers.ts    (grouping, search, validation) │
│  - component-examples.registry.ts (per-component examples)       │
│  - color-palette.config.ts        (palette picker config)        │
│  - animation-presets.config.ts    (motion presets)               │
│  - (8 more config files)                                          │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Consumed by
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Studio UI components                                             │
│  libs/falcon-studio/src/lib/components/                          │
│  - Token explorer                                                 │
│  - Palette picker                                                 │
│  - Animation studio                                               │
│  - Loader studio                                                  │
│  - Component gallery                                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Designer interacts → adjusts knobs
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Live preview                                                     │
│  - Studio rewrites CSS vars in-place on `<html>` or component    │
│  - Cascade applies to every Stencil component + Angular wrapper  │
│  - Designer sees live update                                     │
│  - "Export" produces a theme variant the architect can apply     │
└─────────────────────────────────────────────────────────────────┘
```

## What Studio CAN and CANNOT do today

| ✅ Can | ❌ Cannot |
|---|---|
| Preview token edits live | Persist edits back to SSOT (designer must hand them off) |
| Switch density (comfortable / compact) | Edit Tier 1 primitives directly (only via the registry layer) |
| Test light / dark mode | Edit Tailwind utility class names |
| Browse all components with example states | Add new components (separate workflow) |
| Configure loader-studio | Auto-deploy theme changes to apps |
| Display the loader-studio variants | Approve or merge proposed token changes |

## Risk surfaces

| Risk | Severity | Source |
|---|---|---|
| `component-tokens.generated.ts` codegen tool not explicitly audited — drift risk if it gets out of sync with per-component contracts | 🟡 MED | Wave 1A item |
| Studio is the ONLY consumer of `tokens.registry.ts` — no other system enforces its categories | 🟢 LOW | Acceptable scope |
| Studio's `@source` path was removed from app `tailwind.css` in Wave 2 (revamp v3.1) — Studio classes don't seed into app bundles today | 🟢 INTENTIONAL | Per [`apps/host-shell/src/tailwind.css:18-20`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/tailwind.css) — Studio is "Hide-but-Keep" (Option B) |
| Studio is not currently shipped to consumer apps — designer-only tool | 🟢 INTENTIONAL | Active design-team usage in dev env only |

## Studio's role in the Wave-1 / Wave-2 roadmap

Studio benefits from these system-wide improvements:

| Roadmap item | How Studio benefits |
|---|---|
| Promote Tier-2 semantic tokens to `@theme` (P1-37) | Studio token explorer gets first-class semantic categories |
| Collapse 178-line dark bypass (P1-39) | Studio's dark-mode preview becomes simpler |
| Per-component token-file shape lint (P1-40) | Studio's generated registry stays in sync |
| Theme Studio explicit re-enable in apps | When apps need designer-driven theme variations |

Conversely, Studio's UX validates the semantic vocabulary. **If a knob is confusing in Studio, the semantic token name is probably wrong.**

## See also

- [[Falcon Theme Folder Structure]] — where Studio lives in the workspace
- [[Falcon Token Generation Flow]] — pipeline Studio plugs into
- [[Falcon Generated Files Rules]] — Studio's generated registry file
- [[Falcon Tailwind Theme]] — the 5 governance rules Studio must obey
- [[Falcon Design Tokens]] — the dual-system architecture
- [[Tailwind Falcon Alignment Scorecard]] — Wave 1 / 2 items that benefit Studio
- Supporting evidence: [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
