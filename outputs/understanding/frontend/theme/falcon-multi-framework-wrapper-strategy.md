# Falcon Multi-Framework Wrapper Strategy — SoT (Angular-first)

> Source of truth for the framework-neutral wrapper architecture. **Current delivery scope: Angular + Stencil only.** React and Vue are future placeholders — architecture-ready but not implementation-active. Vault graph nodes: `_obsidian/36-Theming/Tailwind Multi-Framework Strategy.md` + `Falcon Angular Wrapper Pattern.md` + `Falcon React Wrapper Future Pattern.md` (placeholder) + `Falcon Vue Wrapper Future Pattern.md` (placeholder).

**Created:** 2026-05-20
**Updated:** 2026-05-20 — reframed Angular-first per Ammar directive
**Vault nodes:** see graph below

## Scope statement (2026-05-20)

🟢 **CURRENT DELIVERY:** Angular wrapper + Stencil component layer + Angular app integration.
🟡 **FUTURE EXTENSION:** React + Vue wrappers. Placeholders only. No active audit, no implementation, no scoring against current delivery readiness.

The architecture is framework-neutral by design — when React/Vue wrappers eventually ship, they inherit the same theme + same contract for free. But today, all active implementation, audit, and enforcement work targets Angular only.

## The strategy in one sentence

**One Stencil source → one Falcon Tailwind Theme → one component contract → today, one active framework adapter (Angular). Two reserved future adapters (React, Vue) — same architecture, not current scope.**

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│  Falcon Tailwind Theme (SSOT)                                  │
│  libs/falcon-theme/src/falcon-tailwind-tokens.css              │
│  @theme { --color-falcon-* … }                                 │
│  → ~250 Tailwind utility classes                               │
└───────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│  Stencil Component Layer                                       │
│  libs/falcon-ui-core/src/components/                           │
│  TSX templates using Tailwind utilities + token-contract vars  │
│  Compiles to standards-based Web Components                    │
└───────────────────────────────────────────────────────────────┘
                                │
   ┌────────────────────────────┼────────────────────────────┐
   ▼                            ▼                            ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Angular      │   │ React        │   │ Vue          │   │ Web          │
│ (today)      │   │ (future)     │   │ (future)     │   │ Component    │
│              │   │              │   │              │   │ direct       │
│ Wrapper      │   │ Wrapper      │   │ Wrapper      │   │ (today)      │
│ adds:        │   │ adds:        │   │ adds:        │   │              │
│ - Signals    │   │ - JSX types  │   │ - v-model    │   │ Just         │
│ - CVA forms  │   │ - Refs       │   │ - emits      │   │ <falcon-     │
│ - ng-template│   │ - PascalCase │   │ - Composition│   │  button-tw>  │
│ - OnPush CD  │   │              │   │   API        │   │              │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

## Cardinal rule (mirrored across all wrappers)

> **Wrappers ONLY adapt framework APIs. They MUST NOT redesign components.**

| Wrapper does | Wrapper does NOT |
|---|---|
| Map framework-native props ↔ Stencil props | Change visual appearance |
| Map framework-native events ↔ Stencil events | Override token values |
| Add framework-specific affordances (CVA, v-model, refs) | Add CSS classes that conflict |
| Project framework-native template constructs to slots | Provide framework-only "themed variants" |

## Per-framework adaptation table

| Stencil | Angular | React (future) | Vue (future) |
|---|---|---|---|
| `@Prop() variant` | `input<'primary' \| 'secondary'>('primary')` | `interface Props { variant?: ... }` | `defineProps<{ variant?: ... }>()` |
| `@Event() falconClick` | `output<MouseEvent>()` | `props.onClick` | `defineEmits(['click'])` |
| `<slot name="label">` | `<ng-content select="[slot=label]">` | `props.children` | `<slot name="label">` |
| `componentDidLoad()` | `ngAfterViewInit()` | `useEffect()` | `onMounted()` |
| `@State()` | Signal | `useState()` | `ref()` |
| Stencil ref | DOM ref via `ViewChild` | `React.forwardRef` | `defineExpose` |
| Form integration | `ControlValueAccessor` | `react-hook-form` | v-model |

## Theme consumption (identical across frameworks)

All frameworks load the same compiled CSS:

```typescript
import '@falcon/theme';        // SSOT @theme + utility CSS
import '@falcon/ui-tokens';    // component contracts + dark cascade
```

Then use Tailwind utility classes natively:

```tsx
// Angular template / React JSX / Vue template — IDENTICAL utility syntax
<div class="bg-falcon-teal-700 text-falcon-neutral-0 hover:bg-falcon-teal-600 focus-visible:[box-shadow:var(--shadow-falcon-focus)]">
```

## Stencil shadow-DOM gotcha

Stencil components with `shadow: true` are sealed — Tailwind utilities don't cascade in. **Falcon solution:** modern components use `shadow: false` (`<falcon-X-tw>` suffix) so global utilities reach in. Legacy components (`shadow: true`) use the `.tokens.css` contract exclusively.

## Cross-framework parity matrix

| Aspect | Angular | React (future) | Vue (future) | Stencil direct |
|---|---|---|---|---|
| Falcon Tailwind Theme | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Token contracts | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Dark mode cascade | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Visual behavior | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Forms integration | ✅ CVA | react-hook-form | v-model | ❌ N/A |
| API ergonomics | Angular-native | React-native | Vue-native | Web Component DX |

## Wrapper roadmap

| Phase | Angular | React | Vue |
|---|---|---|---|
| Now | ✅ 49 wrappers (13 with consumers) | ⚠️ Direct Stencil consumption | ⚠️ Direct Stencil consumption |
| Future P1 | Maintain + close gaps | Ship `@falcon/ui-react` wrapper library | Ship `@falcon/ui-vue` wrapper library |
| Future P2 | Stencil promotion of bespoke `falcon-tree-panel` | TypeScript prop types + ref forwarding | v-model support + TS types |
| Future P3 | — | Storybook React playground | Storybook Vue playground |

## What NOT to do

- ❌ Build a second token system per framework
- ❌ Re-implement Falcon components natively in any framework
- ❌ Wrap with framework-specific CSS-in-JS (styled-components, Vue-style, …)
- ❌ Tie components to framework-specific state libraries (Redux, Pinia, NGRX)

The CSS bundle is the universal contract. Wrappers add ergonomics.

## See also

- `falcon-tailwind-theme.md` — the SSOT theme being consumed
- `falcon-component-theme-contract.md` — per-component visual contract
- `falcon-angular-wrapper-pattern.md` — Angular-specific details
- `falcon-stencil-to-angular-bridge.md` — bridge mechanics
- `falcon-tailwind-alignment-scorecard.md` — multi-framework score: 91% today, 96% after Wave 2
- `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` — full architecture analysis

## Vault graph nodes

- `_obsidian/36-Theming/Tailwind Multi-Framework Strategy.md` — high-level strategy
- `_obsidian/36-Theming/Falcon Angular Wrapper Pattern.md` — Angular details (today)
- `_obsidian/36-Theming/Falcon React Wrapper Future Pattern.md` — React details (future)
- `_obsidian/36-Theming/Falcon Vue Wrapper Future Pattern.md` — Vue details (future)
- `_obsidian/36-Theming/Falcon Stencil-to-Angular Bridge.md` — bridge mechanics
