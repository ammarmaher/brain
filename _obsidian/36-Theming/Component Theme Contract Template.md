---
type: template
library: "[[Tailwind CSS]]"
topic: component-contract-template
created: 2026-05-20
---
*** Component Theme Contract Template — markdown stub for new components ***
*** Copy this file, rename to "<Component Name> Theme Contract.md", fill the sections ***
*** Drives compliance with [[Falcon Component Theme Contract]] ***

# `<Component Name>` Theme Contract

> Copy this template when introducing or auditing a new Falcon component. Each section maps to one of the 9 contract sections from [[Falcon Component Theme Contract]]. Filled-in instances live next to the component's Brain Outputs dossier or in `60-Components/Falcon <Name>.md`.

## 1. Component

| Field | Value |
|---|---|
| Name | (e.g., Falcon Button) |
| Stencil selector | (e.g., `falcon-button-tw`) |
| Angular wrapper selector | (e.g., `falcon-angular-button`) |
| Source path | (e.g., `libs/falcon-ui-core/src/components/falcon-button-tw/`) |
| Token contract file | (e.g., `libs/falcon-ui-tokens/components/button.tokens.css`) |
| Brain Outputs dossier | `understanding/frontend/components/<name>/` |

## 2. Default visual behavior

What is the out-of-the-box appearance? Default variant, default size, default state. One paragraph.

## 3. Tokens used

| Token slot | Default value | Required? | Notes |
|---|---|---:|---|
| `--falcon-X-bg` | `var(--color-falcon-surface-primary)` | ✅ | Default background |
| `--falcon-X-color` | `var(--color-falcon-text-on-primary)` | ✅ | Text color |
| `--falcon-X-border-color` | `var(--color-falcon-border-subtle)` | optional | Border color (where applicable) |
| `--falcon-X-padding-y` | `--spacing(2)` | ✅ | Vertical padding |
| `--falcon-X-padding-x` | `--spacing(4)` | ✅ | Horizontal padding |
| `--falcon-X-radius` | `var(--radius-falcon-md)` | ✅ | Corner radius |
| `--falcon-X-shadow` | `var(--shadow-falcon-sm)` | optional | Elevation (only where elevation is meaningful) |

Continue for every token slot the component reads.

## 4. States

| State | Current behavior | Tokenized? | Gap |
|---|---|---:|---|
| default | … | ✅ / ❌ | … |
| hover | … | ✅ / ❌ | … |
| focus-visible | … | ✅ / ❌ | … |
| active (pressed) | … | ✅ / ❌ | … |
| disabled | … | ✅ / ❌ | … |
| loading | … | ✅ / ❌ | N/A if doesn't apply |
| error / invalid | … | ✅ / ❌ | N/A if doesn't apply |
| selected / expanded | … | ✅ / ❌ | N/A if doesn't apply |
| dark mode | … | ✅ / ❌ | Automatic via cascade if all tokens? |

## 5. Sizing / resizing

| Behavior | Supported? | Notes |
|---|---:|---|
| `w-full` | ✅ / ❌ | |
| `min-w-0` safe (inside flex) | ✅ / ❌ | |
| `min-h-0` safe (inside flex) | ✅ / ❌ | |
| Compact / sm variant | ✅ / ❌ | |
| Default / md variant | ✅ / ❌ | |
| Large / lg variant | ✅ / ❌ | |
| Overflow / truncate | ✅ / ❌ | |
| Container-query responsive | ✅ / ❌ | |
| Narrow side panel (320px) | ✅ / ❌ | |
| Sm / md / lg / xl breakpoints | ✅ / ❌ | |

## 6. Angular wrapper

| Input | Type | Required | Notes |
|---|---|:---:|---|
| `variant` | union string | optional | (e.g., 'primary' \| 'secondary' \| 'danger') |
| `size` | union string | optional | (e.g., 'sm' \| 'md' \| 'lg') |
| `disabled` | boolean | optional | |
| `loading` | boolean | optional | |

| Output | Payload | Notes |
|---|---|---|
| `falconClick` | MouseEvent | Maps to Stencil event |

| Slot / projection | Selector | Notes |
|---|---|---|
| label | `[slot=label]` | |
| icon-start | `[slot=icon-start]` | |
| icon-end | `[slot=icon-end]` | |

| Forms integration | Yes / No | Notes |
|---|:---:|---|
| ControlValueAccessor | ✅ / ❌ | Only for form-input components |
| `disabledChange` propagation | ✅ / ❌ | |

| Accessibility | Yes / No | Notes |
|---|:---:|---|
| `role` / ARIA defaults set | ✅ / ❌ | |
| Keyboard focus order | ✅ / ❌ | |
| `aria-disabled` / `aria-busy` | ✅ / ❌ | |

## 7. Cross-framework placeholder

🟡 **Future scope only** — see [[Falcon React Wrapper Future Pattern]] / [[Falcon Vue Wrapper Future Pattern]]. The component contract works across frameworks; React/Vue wrappers are not current delivery scope.

## 8. Theme overrides

How can consumers safely override?

| Override surface | Pattern | Example |
|---|---|---|
| Per-tenant whitelabel | `[data-tenant=X] { --falcon-X-bg: … }` | |
| Per-page tweak | `.page-context { --falcon-X-bg: … }` | |
| Per-instance | `[style.--falcon-X-bg]="…"` | Angular wrapper instance |
| Variant prop | `<falcon-angular-X variant="…">` | Preferred consumer path |

## 9. Token gaps

| Gap | Proposed token | Severity | Status |
|---|---|---|---|
| Example: focus-ring color differs in error state | `--falcon-X-focus-ring-error` | 🟡 MED | open / proposed / accepted |

## Compliance scorecard (auto-computed from sections above)

| Dimension | Score |
|---|---|
| Theme score (no inline / hardcoded) | __ / 100 |
| Token score (tokenized values) | __ / 100 |
| State score (all 9 states defined or N/A) | __ / 100 |
| Dark score (cascade-correct) | __ / 100 |
| Resize score (resizing checklist) | __ / 100 |
| Angular wrapper score | __ / 100 |
| **Overall component readiness** | __ / 100 |

Score band:
- 90-100: production-ready
- 75-89: good, minor gaps
- 60-74: usable, needs cleanup
- 40-59: risky
- 0-39: not ready

## See also

- [[Falcon Component Theme Contract]] (the 9-section contract definition)
- [[Falcon Component Audit Scorecard]] (compliance audit framework)
- [[Tailwind Implementation Review Checklist]] (pre-merge review)
- [[Tailwind Sizing and Responsive]] (resizing checklist source)
- [[Tailwind States and Variants]] (state-variant vocabulary)

## Tags

#type/template #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FALCON_COMPONENT_INDEX]]
