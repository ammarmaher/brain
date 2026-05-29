---
type: reference
library: "[[Tailwind CSS]]"
topic: folder-structure
priority: critical
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Theme Folder Structure — full audit of theme-related libraries ***
*** Angular-first; React/Vue future placeholders only ***
*** Read-only audit — no folder moves, no code changes ***

# Falcon Theme Folder Structure

> The 5-library theme architecture: where every theme-relevant file lives, who owns it, who consumes it, whether it's source-of-truth or generated. Audit completed 2026-05-20 against live source at `C:/Falcon/Falcon/falcon-web-platform-ui/`.

## The 5 theme-relevant libraries

```
libs/
├── falcon-theme/            ← SSOT (Layer 1 + 2 primitives + semantic in @theme)
├── falcon-ui-tokens/        ← Per-component contracts (Layer 3) + dark cascade + density + rtl
├── falcon-ui-core/          ← Stencil components + Angular wrappers + Tailwind class-maps
├── falcon-studio/           ← Theme Studio (token explorer + registry + presets)
└── falcon/                  ← Shared-ui legacy bespoke components (tree-panel, etc.)
                            ← Plus i18n, facades, services

apps/
├── host-shell/              ← Host MF app — owns app-level tailwind.css entry
├── admin-console/           ← Remote MF app — owns its tailwind.css
└── management-console/      ← Remote MF app — owns its tailwind.css
```

## Per-library breakdown

### `libs/falcon-theme/` — the styling SSOT

| Path | Purpose | SoT or Generated | Edited by | Consumed by |
|---|---|---|---|---|
| `src/falcon-tailwind-tokens.css` | The `@theme` block — 276 SSOT design tokens | **SoT (manually edited)** | Architect / design system team | All 3 apps (via `@import`) + tokens.ts generator |
| `src/index.css` | Barrel: re-exports SSOT + icon font (9 lines) | SoT | Manually | App `tailwind.css` if using package-style import |
| `src/styles/falcon-icons.css` | Falcon icon font (380 lines, 317 glyphs) | SoT | Icon-pipeline rebuild | Anywhere `<i class="falcon-icon-*">` is used |
| `src/tokens.ts` | TS bridge — 276 tokens with grouped exports | **AUTO-GENERATED** | ❌ Never edit by hand | React/Vue/tooling consumers (future) · Theme Studio |
| `src/assets/*.zip` | Source font files (Neue Haas, IBM Plex Arabic) | SoT (binary asset) | Font-pipeline only | Build pipeline |
| `scripts/generate-tokens-ts.mjs` | Codegen — parses @theme → emits tokens.ts | SoT | Maintainer only | `nx run falcon-theme:generate-tokens-ts` |
| `project.json` | Nx target: `build` depends on `generate-tokens-ts` | SoT | Nx configuration | Nx orchestrator |
| `package.json` | npm metadata + exports (`./tokens` → `./src/tokens.ts`) | SoT | Manually | Workspace + lib consumers |
| `INDEX.md` / `README.md` / `TOKENS.md` | Documentation | SoT | Manually | Humans + AI agents |

**Risk:** ❌ if anyone edits `tokens.ts` by hand, the next `nx run falcon-theme:generate-tokens-ts` wipes their changes silently. **Banner at top of file warns explicitly.**

### `libs/falcon-ui-tokens/` — the per-component contract layer

| Path | Purpose | SoT or Generated | Edited by | Consumed by |
|---|---|---|---|---|
| `src/index.css` | Orchestrator: layer order primitives → semantic → themes → density → rtl → components (51 imports) | SoT | Manually | App `tailwind.css` + Stencil scoped CSS |
| `src/primitives/colors.css` | Bridges Stencil-layer (`--falcon-color-*`) to Tailwind-layer (`--color-falcon-*`) | SoT | Architect | All component contracts (chain) |
| `src/primitives/spacing.css` | Spacing primitive mirror | SoT | Architect | Components |
| `src/primitives/radius.css` · `shadow.css` · `typography.css` · `motion.css` | Other primitive mirrors | SoT | Architect | Components |
| `src/semantic/semantic.css` | Tier-2 semantic intent (`--falcon-color-primary`, `-surface`, `-text`, `-border`) — **declared in `:root`, NOT @theme → no utilities generated** | SoT (gap target) | Architect | Stencil scoped CSS only |
| `src/themes/light.css` | Explicit `[data-theme='light']` opt-in (~10 lines) | SoT | Architect | When theme attribute set |
| `src/themes/dark.css` | Dark cascade overrides (178 lines, per-component bypass — P1-39 to collapse) | SoT | Architect | When `.app-dark` / `[data-theme='dark']` active |
| `src/density/comfortable.css` · `compact.css` | Density variants (72 + 71 lines) | SoT | Architect | When `[data-density]` attribute set |
| `src/rtl/rtl.css` | RTL flips (26 lines — shadow + slide + dialog side) | SoT | Architect | When `dir="rtl"` |
| `src/components/<name>.tokens.css` (**51 files**) | Per-component CSS-var contracts — scoped to `:where(<host-selectors>)`, ~10-180 tokens each | **SoT (manually edited)** | Component author | Stencil scoped CSS + Angular templates (via Tailwind utilities OR `var(--falcon-X)`) |
| `scripts/build-token-registry.mjs` | (Build script — purpose TBD) | SoT | Maintainer | Build pipeline |
| `scripts/scope-component-tokens.mjs` | Linter/scoper — enforces `:where(...)` shape on component tokens | SoT | Maintainer | Lint / pre-commit |

**Risk:** ❌ semantic Tier-2 tokens declared in `:root` (not `@theme`) → no Tailwind utilities generated → templates fall back to `bg-[var(--falcon-color-primary)]` arbitrary syntax (P1-37 fix).

### `libs/falcon-ui-core/` — Stencil components + Angular wrappers

| Path | Purpose | SoT or Generated | Edited by | Consumed by |
|---|---|---|---|---|
| `src/components/` (103 entries) | Stencil components (Shadow + Light + `-tw` Tailwind variants) | **SoT (manually edited)** | Component author | Stencil build → Web Components |
| `src/components/<name>/<name>.tsx` | Stencil TSX template | SoT | Component author | Stencil compiler |
| `src/components/<name>/<name>.css` | Stencil scoped CSS — reads `var(--falcon-<component>-*)` | SoT | Component author | Compiled into Web Component |
| `src/angular-wrapper/components/` (62 entries) | Angular wrappers around Stencil — 49 wrappers + variants | SoT | Wrapper author | Angular apps |
| `src/angular-wrapper/components/<name>/<name>.component.ts` | Angular signal-API + CVA + OnPush | SoT | Wrapper author | Angular apps |
| `src/tailwind/` (95 `*.ts` files) | Tailwind class-map helpers — e.g., `falconButtonClasses({variant, size, …})` returns class string | **SoT (manually edited)** | Component author | Stencil `-tw` mode + Angular wrappers + tests |
| `src/configurations/` | Config defaults | SoT | Component author | Components |
| `src/types/` | Shared types | SoT | Component author | Components + wrappers + apps |
| `src/utils/` | Shared utilities | SoT | Component author | Components |
| `src/styles/` | Component-internal CSS partials | SoT | Component author | Components |
| `src/components.ts` · `.js` · `.d.ts` (+ .map) | **AUTO-GENERATED** Stencil aggregator | ❌ Never edit | Stencil build | Wrappers' `defineCustomElements()` |
| `src/define-custom-elements.ts` · `.js` · `.d.ts` (+ .map) | **AUTO-GENERATED** loader for consumers | ❌ Never edit | Stencil build | React/Vue/vanilla consumers |
| `src/define-falcon-component.ts` · `.js` · `.d.ts` | **AUTO-GENERATED** per-component define helper | ❌ Never edit | Stencil build | Lazy component registration |
| `src/define-falcon-tw-component.ts` · `.js` · `.d.ts` | **AUTO-GENERATED** Tailwind-mode define helper | ❌ Never edit | Stencil build | `-tw` component loader |
| `src/index.ts` · `.js` · `.d.ts` | **AUTO-GENERATED** barrel | ❌ Never edit | Stencil build | Workspace consumers |

**Risk:** ⚠️ 95 Tailwind class-map files concatenate class strings at runtime → these literals must appear statically in `.ts` source so Tailwind's text-scanner sees them (or `@source inline(...)` safelist required). Source-detection drift is real.

### `libs/falcon-studio/` — Theme Studio + registry

| Path | Purpose | SoT or Generated | Edited by | Consumed by |
|---|---|---|---|---|
| `src/lib/registry/component-tokens.generated.ts` | **AUTO-GENERATED** mirror of every component's tokens for Studio token-explorer UI | ❌ Never edit | Studio codegen | Theme Studio components |
| `src/lib/registry/component-tokens.helpers.ts` | Manual helpers — token grouping, search, validation | SoT | Studio author | Studio UI |
| `src/lib/registry/abstraction-map.registry.ts` | Maps semantic intents to consumer-facing knobs | SoT | Studio author | Studio UI |
| `src/lib/registry/tokens.registry.ts` | Token catalog metadata | SoT | Studio author | Studio UI |
| `src/lib/registry/component-examples.registry.ts` + `.types.ts` | Per-component live demo registry | SoT | Studio author | Studio gallery |
| `src/lib/registry/color-palette.config.ts` | Palette explorer config | SoT | Studio author | Studio palette |
| `src/lib/registry/animation-presets.config.ts` | Animation registry | SoT | Studio author | Studio motion |
| `src/lib/registry/alignment-icons.ts` · `common-actions.config.ts` · `gallery-defaults.ts` · `popup-control-matrix.ts` | UI configuration data | SoT | Studio author | Studio UI |
| `src/lib/registry/loader-studio/` · `examples/` | Sub-modules | SoT | Studio author | Studio |
| `src/lib/components/` | Studio UI components | SoT | Studio author | Studio app |
| `src/lib/directives/` · `services/` · `utils/` | Studio internals | SoT | Studio author | Studio components |

**Risk:** ⚠️ `component-tokens.generated.ts` regenerates from per-component contracts — if generation drifts behind contract edits, Studio shows stale knobs. Needs CI gate to keep them in sync.

### App-level `tailwind.css` entries

| Path | Purpose | SoT or Generated | Edited by | Consumed by |
|---|---|---|---|---|
| `apps/host-shell/src/tailwind.css` | App entry: `@import` SSOT + UI-tokens + `@source` scan paths + `@source inline()` safelist (~2400 lines incl. safelist) | SoT (long-tail safelist drift) | App owner | Vite/PostCSS build → host-shell bundle |
| `apps/admin-console/src/tailwind.css` | Same shape, drifted from host-shell (~2050 safelist lines per audit) | SoT | App owner | admin-console bundle |
| `apps/management-console/src/tailwind.css` | Same shape — 0 safelist entries per audit | SoT | App owner | management-console bundle |

**Risk:** ❌ Three apps' safelists have drifted (host-shell 2113, admin-console 2050, mgmt-console 0). [[Tailwind Falcon Alignment Scorecard]] Wave 2 Phase D + the P1-38 auto-generated safelist initiative fix this.

## File-count summary

| Library | Files | Notes |
|---|---|---|
| `falcon-theme/` | 12 (1 SSOT CSS + 1 generated TS + 1 codegen script + assets + docs) | Tiny SSOT layer |
| `falcon-ui-tokens/` | 51 component contracts + 6 primitives + 4 theme/density/rtl + 1 orchestrator + 2 scripts ≈ 64 files | Largest token contract surface |
| `falcon-ui-core/` | 103 Stencil components + 62 Angular wrappers + 95 Tailwind class-maps + indexes ≈ 350+ files | Component + wrapper surface |
| `falcon-studio/` | 14 registry files + 5 sub-folders | Studio UI + registry |
| `apps/*/src/tailwind.css` | 3 files | App-level entries |

## See also

- [[Falcon Token Generation Flow]] — the pipeline + invariants
- [[Falcon Generated Files Rules]] — what's auto-generated, what's manual
- [[Falcon Component Library Structure]] — Stencil + wrapper layout
- [[Falcon Studio Token Registry Flow]] — Studio consumption pattern
- [[Falcon Wave 1A Readiness]] — pre-Wave-1 readiness gate
- [[Falcon Tailwind Theme]] — the 5 governance rules
- [[Falcon Design Tokens]] — dual-system architecture
- [[Tailwind Falcon Alignment Scorecard]] — overall gap analysis
- Supporting evidence in Brain Outputs (linked, not authoritative): [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md) · [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)

## Tags

#type/reference #layer/frontend #priority/critical #audit

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
