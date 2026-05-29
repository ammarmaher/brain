---
type: reference
library: "[[Tailwind CSS]]"
topic: falcon-stencil-angular-bridge
created: 2026-05-20
---
*** Falcon Stencil-to-Angular Bridge — cross-framework component reuse ***
*** Stencil compiles to Web Components; Angular wrappers expose Angular-friendly APIs ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-stencil-to-angular-bridge.md ***

# Falcon Stencil-to-Angular Bridge

> Stencil components compile to standards-based Web Components — `<falcon-button-tw>`, `<falcon-input-tw>`, etc. Angular wrappers (`<falcon-angular-button>`, `<falcon-angular-input>`) wrap these to expose Angular-native APIs (signals, CVA, template projection). React/Vue/Stencil-consumer playgrounds use the Web Components directly.

## The bridge

```
        Stencil sources (TSX)              Build pipeline                Consumers
        ─────────────────────              ──────────────                ─────────
                                                                              
        falcon-button-tw.tsx ──── @stencil/core ───→ falcon-button-tw.js ──→ React: <falcon-button-tw>
                                                     (Web Component)         Vue:   <falcon-button-tw>
                                                                              Stencil: <falcon-button-tw>
                                                                                          │
                                                                                          ▼
                                                       ┌──────── @falcon/ui-core/angular-wrapper ────────┐
                                                       │                                                  │
                                                       │  FalconAngularButton Angular component           │
                                                       │  Wraps <falcon-button-tw> with:                  │
                                                       │  - Signal @Input() / @Output()                   │
                                                       │  - ControlValueAccessor (for forms)              │
                                                       │  - Template projection (ng-template slots)       │
                                                       │  - OnPush change detection                       │
                                                       │                                                  │
                                                       │  Consumer: <falcon-angular-button>               │
                                                       └──────────────────────────────────────────────────┘
                                                                                          │
                                                                                          ▼
                                                                              Angular: <falcon-angular-button>
                                                                              (host-shell, admin-console, etc.)
```

## Why this architecture

| Goal | Solved by |
|---|---|
| Cross-framework reuse | Web Components (standards-based) |
| Angular-specific affordances (forms, signals, templates) | Angular wrapper layer |
| Avoid framework lock-in | Stencil compiles once, runs everywhere |
| One source of truth for visual contract | Stencil component + tokens contract |

## The Stencil → Angular signal mapping

| Stencil API | Angular Wrapper API |
|---|---|
| `@Prop() variant: 'primary' \| 'secondary'` | `readonly variant = input<'primary' \| 'secondary'>('primary')` |
| `@Event() falconClick: EventEmitter` | `readonly falconClick = output<MouseEvent>()` |
| `<slot name="label">` | `<ng-content select="[slot=label]">` |
| `componentDidLoad()` | `ngAfterViewInit()` |
| `@State()` internal state | Signal in the wrapper |

## Cross-framework consumption patterns

### Angular (with wrapper)

```html
<falcon-angular-button
  variant="primary"
  size="lg"
  [disabled]="isSubmitting()"
  (falconClick)="onSave()">
  <span slot="label">Save</span>
</falcon-angular-button>
```

### React (Stencil direct)

```jsx
import { FalconButtonTw } from '@falcon/ui-core/react';

<FalconButtonTw
  variant="primary"
  size="lg"
  disabled={isSubmitting}
  onFalconClick={onSave}>
  <span slot="label">Save</span>
</FalconButtonTw>
```

### Vue (Stencil direct)

```vue
<template>
  <falcon-button-tw
    variant="primary"
    size="lg"
    :disabled="isSubmitting"
    @falconClick="onSave">
    <span slot="label">Save</span>
  </falcon-button-tw>
</template>
```

### Vanilla HTML / Web Component

```html
<falcon-button-tw variant="primary" size="lg">
  <span slot="label">Save</span>
</falcon-button-tw>

<script>
  document.querySelector('falcon-button-tw')
    .addEventListener('falconClick', onSave);
</script>
```

## Shadow DOM gotcha

Stencil components with `shadow: true` are sealed from global stylesheets. Tailwind utilities don't cascade in. **Solution:**

```typescript
@Component({
  tag: 'falcon-button-tw',
  shadow: false,    // ← cascade Tailwind utilities in
  scoped: true,     // ← still scope my own CSS via Stencil scoping
})
export class FalconButtonTw { … }
```

Legacy Stencil components (`shadow: true`) use the `<component>.tokens.css` contract exclusively — no Tailwind utilities in their templates.

## Wrapper-or-direct decision

| Consumer | Use Angular wrapper? |
|---|---|
| Angular template needs reactive forms | ✅ Yes |
| Angular template needs signals | ✅ Yes |
| Angular template projects templates | ✅ Yes |
| React app | ❌ No — use Stencil component directly |
| Vue app | ❌ No — use Stencil component directly |
| Vanilla HTML / Web Component | ❌ No — use Stencil component directly |
| Stencil playground | ❌ No — use Stencil component directly |

[CODE] `35-Architecture/Wrapper Import Decision Tree.md` has the full decision flow.

## Token contract: same everywhere

Whether the consumer is Angular wrapper, React, Vue, or vanilla HTML — they all hit the same token chain:

```
Tailwind utility class       (Tailwind SSOT @theme)
        ↓
Component tokens.css         (Stencil layer contract)
        ↓
Stencil scoped CSS           (renders the component)
```

The SSOT @theme + per-component contract = one visual definition for all consumers.

## See also

- [[Tailwind CSS]] · [[Tailwind Multi-Framework Strategy]] · [[Falcon Angular Wrapper Pattern]] · [[Falcon Design Tokens]]
- Brain Outputs SoT: [falcon-stencil-to-angular-bridge](../../Brain%20Outputs/understanding/frontend/theme/falcon-stencil-to-angular-bridge.md) · [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)
- Architecture: [[Wrapper Import Decision Tree]]

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
