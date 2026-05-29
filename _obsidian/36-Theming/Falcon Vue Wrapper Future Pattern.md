---
type: reference
library: "[[Tailwind CSS]]"
topic: vue-wrapper-future
status: future-placeholder
scope: not-current-delivery
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Vue Wrapper — FUTURE PLACEHOLDER (not current scope) ***
*** Current implementation priority is ANGULAR ONLY (see [[Falcon Angular Wrapper Pattern]]) ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-multi-framework-wrapper-strategy.md ***

# Falcon Vue Wrapper Future Pattern

> 🟡 **FUTURE PLACEHOLDER — NOT CURRENT SCOPE.**
>
> **Active delivery focuses on Angular only** ([[Falcon Angular Wrapper Pattern]]). This note exists so a future contributor can pick up Vue wrapper work later without rediscovering the architecture. **No active implementation, no audit, no scoring against current delivery readiness.**
>
> Architectural principle preserved: when Vue wrappers eventually ship, they must follow the same cardinal rule as Angular wrappers — **adapt framework APIs, never redesign the component.** Same Falcon Tailwind Theme. Same token system. Same visual behavior. Same component contract.

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
| Vue wrapper library | ❌ Not yet shipped |
| Vue playground | ✅ Scaffolded — `libs/falcon-ui-vue` (Wave Vite demo, port 5174) |
| Vue-direct Stencil consumption | ✅ Works today — Vue 3 + Web Components is native |
| Falcon Tailwind Theme consumption | ✅ Vue playground already consumes the shared SSOT CSS |

Vue apps can **already use Falcon today** by importing the Stencil `defineCustomElements()` + writing `<falcon-button-tw>` directly. Vue 3's template compiler handles Web Component syntax natively (no extra config beyond `compilerOptions.isCustomElement`).

## Two consumption paths

### Path A (today) — Direct Stencil Web Component

```vue
<script setup lang="ts">
import { defineCustomElements } from '@falcon/ui-core/loader';
defineCustomElements();   // once, at app bootstrap

const onSave = () => { /* … */ };
</script>

<template>
  <falcon-button-tw
    variant="primary"
    size="lg"
    @falconClick="onSave">
    <span slot="label">Save</span>
  </falcon-button-tw>
</template>
```

Vue config (`vite.config.ts` or equivalent):

```typescript
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('falcon-'),
        },
      },
    }),
  ],
});
```

**Pros:** zero Vue-specific layer; works today; same component contract everywhere.
**Cons:** kebab-case names, no Vue-native v-model on inputs, no TS prop validation.

### Path B (future) — Vue wrapper layer

```vue
<script setup lang="ts">
import { FalconButton } from '@falcon/ui-vue';
const isSubmitting = ref(false);
const onSave = () => { /* … */ };
</script>

<template>
  <FalconButton
    variant="primary"
    size="lg"
    :disabled="isSubmitting"
    @click="onSave">
    Save
  </FalconButton>
</template>
```

**Pros:** PascalCase names, v-model support on form components, TS prop types via `defineProps<…>`, slot tooling.
**Cons:** maintenance layer; risk of drift if wrapper redesigns visual contract.

## Cardinal rule (mirrored from Angular/React)

**Vue wrappers ONLY adapt Vue APIs. They MUST NOT:**
- ❌ Change visual appearance
- ❌ Override token values
- ❌ Add new style classes
- ❌ Inject CSS that bypasses `<component>.tokens.css`
- ❌ Provide Vue-only variants of the component

**Vue wrappers MUST:**
- ✅ Forward all props 1:1 to Stencil component
- ✅ Map Stencil events (`falconClick`) to Vue emits (`@click` or `@falcon-click`)
- ✅ Support v-model for form components (`update:modelValue` emit)
- ✅ Forward refs via `defineExpose`
- ✅ Work with Vue 3 Composition API + Options API
- ✅ Preserve the same component contract as Angular/React/Stencil

## Theme consumption (identical to Angular/React)

Same compiled CSS bundle:

```typescript
// main.ts
import '@falcon/theme';
import '@falcon/ui-tokens';
```

The SAME `@theme` block, the SAME utility classes, the SAME dark cascade work in Vue.

```vue
<template>
  <div class="bg-falcon-teal-700 text-falcon-neutral-0 hover:bg-falcon-teal-600">
    Vue component using Falcon utilities directly
  </div>
</template>
```

Vue-scoped `<style scoped>` blocks that use `@apply` need `@reference`:

```vue
<style scoped>
@reference "@falcon/theme/falcon-tailwind-tokens.css";
.custom { @apply bg-falcon-teal-700 text-white; }
</style>
```

## State adaptation table

| Stencil | Vue Wrapper |
|---|---|
| `@Prop() variant` | `defineProps<{ variant?: 'primary' \| 'secondary' }>()` |
| `@Event() falconClick` | `const emit = defineEmits(['click', 'falcon-click'])` |
| `<slot name="label">` | `<slot name="label">` (Vue slot — same syntax) |
| `componentDidLoad()` | `onMounted(() => { … })` |
| Stencil ref | `defineExpose({ … })` |

## v-model support (Vue-specific concern)

Vue's two-way binding for form components needs:

```vue
<!-- Consumer -->
<FalconInput v-model="email" placeholder="email@example.com" />
```

Vue wrapper implementation:

```vue
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const onInput = (e: CustomEvent) => {
  emit('update:modelValue', e.detail);
};
</script>

<template>
  <falcon-input-tw
    :value="modelValue"
    @falconInput="onInput" />
</template>
```

This is the ONLY place Vue's API diverges from Angular's ControlValueAccessor or React's controlled-input pattern.

## Cross-framework parity matrix

| Aspect | Angular | React | Vue (future) | Stencil direct |
|---|---|---|---|---|
| Falcon Tailwind Theme | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Token contracts | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Dark mode cascade | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| Visual behavior | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| API ergonomics | Angular-native (CVA) | React-native | Vue-native (v-model) | Web Component DX |

## Roadmap

| Phase | Deliverable | When |
|---|---|---|
| Now | Vue playground + direct Stencil consumption | ✅ Active |
| Future Phase 1 | Vue wrapper library (`@falcon/ui-vue`) with PascalCase components + v-model | Post-Wave-1 Tailwind alignment |
| Future Phase 2 | TypeScript prop types + `defineExpose` for ref forwarding | Same wave |
| Future Phase 3 | Storybook Vue playground per component | Post-Wave-2 |
| Future Phase 4 | Nuxt 3 integration validation | When Nuxt 3 + Tailwind v4 stable |

## What NOT to do for Vue

- ❌ Build a SECOND token system for Vue (e.g., Vuetify-style theme object)
- ❌ Re-implement Falcon components in pure Vue (would create drift)
- ❌ Wrap with Vue-specific CSS-in-JS solutions
- ❌ Tie Falcon components to Pinia / Vuex stores

The CSS bundle is the universal contract. Vue wrappers add ergonomics, nothing else.

## See also

- [[Tailwind CSS]] · [[Tailwind Multi-Framework Strategy]] · [[Falcon Angular Wrapper Pattern]] · [[Falcon React Wrapper Future Pattern]] · [[Falcon Stencil-to-Angular Bridge]] · [[Falcon Component Theme Contract]] · [[Falcon Tailwind Theme]]
- Brain Outputs SoT: [falcon-multi-framework-wrapper-strategy](../../Brain%20Outputs/understanding/frontend/theme/falcon-multi-framework-wrapper-strategy.md) · [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)

## Tags

#type/reference #layer/frontend #status/draft

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
