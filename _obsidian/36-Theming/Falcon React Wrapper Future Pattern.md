---
type: reference
library: "[[Tailwind CSS]]"
topic: react-wrapper-future
status: future-placeholder
scope: not-current-delivery
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon React Wrapper — FUTURE PLACEHOLDER (not current scope) ***
*** Current implementation priority is ANGULAR ONLY (see [[Falcon Angular Wrapper Pattern]]) ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-multi-framework-wrapper-strategy.md ***

# Falcon React Wrapper Future Pattern

> 🟡 **FUTURE PLACEHOLDER — NOT CURRENT SCOPE.**
>
> **Active delivery focuses on Angular only** ([[Falcon Angular Wrapper Pattern]]). This note exists so a future contributor can pick up React wrapper work later without rediscovering the architecture. **No active implementation, no audit, no scoring against current delivery readiness.**
>
> Architectural principle preserved: when React wrappers eventually ship, they must follow the same cardinal rule as Angular wrappers — **adapt framework APIs, never redesign the component.** Same Falcon Tailwind Theme. Same token system. Same visual behavior. Same component contract.

## Status

| Aspect | Status |
|---|---|
| Active scope | ❌ NO — Angular-first only |
| Active audit | ❌ NO — placeholder reference only |
| Counts toward current Angular delivery readiness | ❌ NO |
| Reserved for future extension | ✅ YES |

## Current state

| Aspect | Status |
|---|---|
| React wrapper library | ❌ Not yet shipped |
| React playground | ✅ Scaffolded — `libs/falcon-ui-react` (Wave Vite demo, port 5173) |
| React-direct Stencil consumption | ✅ Works today — Stencil emits `loader/react` adapters |
| Falcon Tailwind Theme consumption | ✅ React playground already consumes the shared SSOT CSS |

React apps can **already use Falcon today** by importing the Stencil-emitted `defineCustomElements()` + writing `<falcon-button-tw>` directly. The wrapper-library is a future ergonomic improvement, not a blocker.

## Two consumption paths

### Path A (today) — Direct Stencil Web Component

```jsx
import { defineCustomElements } from '@falcon/ui-core/loader';
defineCustomElements();   // once, at app bootstrap

function App() {
  return (
    <falcon-button-tw
      variant="primary"
      size="lg"
      onfalconClick={onSave}>
      <span slot="label">Save</span>
    </falcon-button-tw>
  );
}
```

**Pros:** zero React-specific layer; works today; same component contract as every other framework.
**Cons:** kebab-case attributes, event names don't follow React conventions, no JSX type safety on props.

### Path B (future) — React wrapper layer

```jsx
import { FalconButton } from '@falcon/ui-react';

function App() {
  return (
    <FalconButton variant="primary" size="lg" onClick={onSave}>
      Save
    </FalconButton>
  );
}
```

**Pros:** PascalCase component names, camelCase props, React `onClick` instead of kebab-case `onfalconClick`, typed forwarded refs, React.lazy support.
**Cons:** maintenance layer; risk of drift if wrapper redesigns visual contract.

## Cardinal rule (mirrored from [[Falcon Angular Wrapper Pattern]])

**Wrappers ONLY adapt React APIs. They MUST NOT:**
- ❌ Change visual appearance
- ❌ Override token values
- ❌ Add new style classes that conflict with the Stencil component
- ❌ Inject CSS that bypasses `<component>.tokens.css` contract
- ❌ Provide React-only variants of the component

**Wrappers MUST:**
- ✅ Forward all props 1:1 to the Stencil component
- ✅ Map kebab-case events (`falconClick`) to PascalCase callbacks (`onFalconClick` or `onClick`)
- ✅ Forward refs to the underlying Stencil host
- ✅ Support React 18 strict mode (no side effects in render)
- ✅ Preserve the same component contract as Angular/Vue/Stencil

## Theme consumption (identical to Angular)

React consumers load the same compiled CSS bundle:

```jsx
// _app.tsx or main.tsx
import '@falcon/theme';   // SSOT @theme + utility CSS
import '@falcon/ui-tokens';   // component contracts + dark cascade

// Or via plain CSS imports:
import 'falcon-theme/src/falcon-tailwind-tokens.css';
```

The SAME `@theme` block, the SAME utility classes, the SAME dark cascade work in React.

```jsx
<div className="bg-falcon-teal-700 text-falcon-neutral-0 hover:bg-falcon-teal-600">
  React component using Falcon utilities directly
</div>
```

## State adaptation table

| Stencil | React Wrapper |
|---|---|
| `@Prop() variant` | `interface Props { variant?: 'primary' \| 'secondary' }` |
| `@Event() falconClick` | `props.onClick?: (e: MouseEvent) => void` |
| `<slot name="label">` | `props.children` or `props.label` |
| `componentDidLoad()` | `useEffect(() => { … }, [])` |
| Stencil ref | `React.forwardRef` to inner Web Component |

## Cross-framework parity matrix

| Aspect | Angular | React (future) | Vue (future) | Stencil direct |
|---|---|---|---|---|
| Falcon Tailwind Theme | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Token contracts | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Dark mode cascade | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Component visual | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| API ergonomics | ✅ Angular-native | ✅ React-native (future) | ✅ Vue-native (future) | ⚠️ Web Component DX |
| Reactive forms | ✅ CVA | ❌ N/A (use react-hook-form) | ❌ N/A (use vuelidate) | ❌ N/A |

## Roadmap

| Phase | Deliverable | When |
|---|---|---|
| Now | React playground + direct Stencil consumption | ✅ Active |
| Future Phase 1 | React wrapper library (`@falcon/ui-react`) with PascalCase components + camelCase props | Post-Wave-1 Tailwind alignment |
| Future Phase 2 | TypeScript prop types + ref forwarding | Same wave |
| Future Phase 3 | Storybook React playground per component | Post-Wave-2 |
| Future Phase 4 | React 19 concurrent-mode validation | When React 19 stable |

## What NOT to do for React

- ❌ Build a SECOND token system for React (e.g., styled-components themed)
- ❌ Re-implement Falcon components in pure React (would create drift)
- ❌ Wrap with CSS-in-JS libraries (would bypass the Tailwind utility layer)
- ❌ Add Tailwind-config-extends that React-only consumers must mirror

The CSS bundle is the universal contract. React wrappers add ergonomics, nothing else.

## See also

- [[Tailwind CSS]] · [[Tailwind Multi-Framework Strategy]] · [[Falcon Angular Wrapper Pattern]] · [[Falcon Vue Wrapper Future Pattern]] · [[Falcon Stencil-to-Angular Bridge]] · [[Falcon Component Theme Contract]] · [[Falcon Tailwind Theme]]
- Brain Outputs SoT: [falcon-multi-framework-wrapper-strategy](../../Brain%20Outputs/understanding/frontend/theme/falcon-multi-framework-wrapper-strategy.md) · [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)

## Tags

#type/reference #layer/frontend #status/draft

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
