---
type: reference
library: "[[Tailwind CSS]]"
topic: falcon-angular-wrapper
created: 2026-05-20
---
*** Falcon Angular Wrapper — how Angular consumes Stencil + Tailwind ***
*** 49 wrappers: 13 with consumers · 24 lab-only · 12 unused (per FALCON_WRAPPER report) ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-angular-wrapper-pattern.md ***

# Falcon Angular Wrapper Pattern

> Falcon's Angular wrappers (`<falcon-angular-X>`) wrap Stencil web components (`<falcon-X-tw>`) and expose Angular-friendly APIs: signals, CVA, template projection, change-detection. The wrapper consumes Tailwind tokens for layout; the Stencil component consumes Falcon UI tokens for its visual contract.

## The wrapping layers

```
┌──────────────────────────────────────────────────────────────────┐
│  Angular Wrapper Component                                        │
│  e.g. <falcon-angular-button>                                     │
│  Lives in libs/falcon-ui-core/src/angular-wrapper/                │
│                                                                   │
│  - Standalone Angular component                                   │
│  - Signal-based @Input() / @Output()                              │
│  - ControlValueAccessor for form integration                      │
│  - Template projection / ng-template slots                        │
│  - Wraps the Stencil host                                         │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Stencil Web Component                                            │
│  e.g. <falcon-button-tw>                                          │
│  Lives in libs/falcon-ui-core/src/components/                     │
│                                                                   │
│  - TSX template with Tailwind utilities inline                    │
│  - useTailwind=true → shadow: false → cascade Tailwind in         │
│  - Reads CSS-var contract from <component>.tokens.css             │
│  - Cross-framework: same component renders in React/Vue/Angular   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Token Contract                                                   │
│  e.g. button.tokens.css                                           │
│  Lives in libs/falcon-ui-tokens/src/components/                   │
│                                                                   │
│  - :where(<host>) { --falcon-button-bg: var(--color-falcon-X); }  │
│  - References SSOT primitives via the bridge                      │
│  - Component reads via var(--falcon-button-bg) in scoped CSS      │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  SSOT                                                             │
│  libs/falcon-theme/src/falcon-tailwind-tokens.css                 │
│  @theme { --color-falcon-teal-700: #0d3f44 }                     │
└──────────────────────────────────────────────────────────────────┘
```

## Wrapper count (per FALCON_WRAPPER_AND_RENDER_PATH_REPORT)

- **49 Stencil-backed Angular wrappers** total
- **13** have real-feature consumers in apps
- **24** are lab-only (Theme Studio playgrounds)
- **12** are fully unused (carry-over from React parity work)

## How a consumer renders a button

```html
<!-- Angular template (host-shell, admin-console, …) -->
<falcon-angular-button variant="primary" size="lg" (falconClick)="onClick($event)">
  <span slot="label">Save</span>
</falcon-angular-button>
```

→ Renders `<falcon-button-tw>` Stencil host →
→ Stencil scoped CSS reads `var(--falcon-button-bg)` →
→ Token contract resolves `var(--color-falcon-teal-700)` →
→ SSOT @theme value `#0d3f44` is computed →
→ Dark cascade re-declares to dark counterpart automatically.

## Cross-framework reuse

Same Stencil component works in:

| Framework | Consumer pattern |
|---|---|
| Angular | `<falcon-angular-button variant="primary">` (Angular wrapper) |
| React | `<falcon-button-tw variant="primary">` (direct Stencil HTML) |
| Vue | `<falcon-button-tw variant="primary">` (direct Stencil HTML) |
| Vanilla HTML | `<falcon-button-tw variant="primary">` (Web Component) |

**One Stencil source → four framework consumers.** Tokens are SSOT — every framework sees the same colors.

## Why Angular gets a wrapper but other frameworks don't

| Reason | Detail |
|---|---|
| Reactive forms | CVA support (`ControlValueAccessor`) requires Angular-specific contracts |
| Signal-based @Input | Angular's signal API differs from Stencil's `@Prop()` |
| Template projection | Angular `<ng-template>` slot pattern is friendlier than Stencil slots |
| Change detection | Angular wrapper exposes `OnPush`-friendly events |

React/Vue can use the Stencil component directly because their reactivity models work natively with Web Component events/props.

## Wrapper-import decision tree

[CODE] `35-Architecture/Wrapper Import Decision Tree.md` documents the rules:

1. **Prefer the Angular wrapper** when:
   - Using reactive forms
   - Needing signal-based reactivity
   - Projecting Angular templates
2. **Use the Stencil component directly** when:
   - Cross-framework (React/Vue/Stencil-consumer libs)
   - Lab/playground/Studio scenarios

## Consumer rule (Tailwind docs philosophy)

> "Using component-based libraries like React or Vue, this often means exposing specific props for styling customizations instead of letting consumers add extra classes from outside of a component, since those styles will often conflict."

**Falcon wrappers expose:**
- `variant` / `size` / `severity` props (preferred)
- CSS-var slots via `style="--falcon-X-bg: red"` (when token override needed)

**Falcon wrappers do NOT accept:**
- External `class="bg-red-500"` from consumers (per Tailwind docs anti-pattern)

## See also

- [[Tailwind CSS]] · [[Tailwind Multi-Framework Strategy]] · [[Tailwind Utility-First Philosophy]] · [[Falcon Stencil-to-Angular Bridge]] · [[Falcon Design Tokens]]
- Brain Outputs SoT: [falcon-angular-wrapper-pattern](../../Brain%20Outputs/understanding/frontend/theme/falcon-angular-wrapper-pattern.md) · [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)
- Architecture: [[Wrapper Import Decision Tree]]

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
