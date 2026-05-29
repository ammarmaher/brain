---
type: reference
library: "[[Tailwind CSS]]"
topic: component-theme-contract
priority: critical
scope: current-angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Component Theme Contract — Angular-first enforcement ***
*** Current scope: Stencil component + Angular wrapper compliance ***
*** React/Vue: future placeholders only (architecture-neutral by design) ***

# Falcon Component Theme Contract

> 🟢 **CURRENT SCOPE: Stencil components + Angular wrappers must satisfy this contract.**
> 🟡 **FUTURE EXTENSION: React/Vue wrappers will follow the same contract** when they ship — but they are NOT current delivery scope.
>
> The contract is enforced at the design-system level — **wrappers DO NOT redesign components; they only adapt them to framework APIs.** Today the active adapter is Angular. The contract is framework-neutral by design, so future React/Vue wrappers inherit it for free — but **no current audit checks React/Vue compliance**.

## The 9-section contract (per component)

| # | Section | What it documents |
|---|---|---|
| 1 | **Default theme behavior** | The component's out-of-the-box appearance. Which tokens it reads from `@theme`. Which utilities it composes. |
| 2 | **Component tokens** | Per-component CSS-var slots (e.g., `--falcon-button-bg`, `--falcon-button-padding-y`). Listed in `libs/falcon-ui-tokens/components/<name>.tokens.css`. |
| 3 | **Interactive state rules** | All 9 states (hover, focus-visible, active, disabled, loading, error, selected, expanded, dark). Which token/utility drives each. |
| 4 | **Dark mode behavior** | How the component flips. Automatic via SSOT cascade for tokens; explicit for any hardcoded value (= bug). |
| 5 | **Wrapper usage** | How Angular wrapper exposes the component. What props / events / slots are surfaced. |
| 6 | **Theme override rules** | What consumers can override (CSS vars, props). What's locked (typography, structural spacing). |
| 7 | **Cross-framework compatibility** | Whether the same Stencil component works in Angular / React / Vue / Web Component without changes. |
| 8 | **Token gaps** | Documented missing tokens with proposed names + values. NOT hardcoded workarounds. |
| 9 | **Wrapper-readiness status** | Angular: ✅ wrapper exists / lab-only / no wrapper. React: future. Vue: future. |

## Where the contract lives

**Per-component dossier (Brain Outputs SoT):**

```
Brain Outputs/understanding/frontend/components/<component-name>/
├── OVERVIEW.md             ← What the component is
├── API.md                  ← Props / events / slots
├── USAGE.md                ← Consumer examples per framework
├── TOKENS.md               ← Section 2 of this contract
├── GAPS_AND_UPGRADES.md    ← Sections 8 + 9
└── DECISION.md             ← Architectural decisions (Stencil promotion, etc.)
```

**Per-component vault graph node:**

```
_obsidian/60-Components/Falcon <Name>.md
```

The vault note links to the dossier + adds graph wiring (pages using it, related gaps, theming connections).

## The cardinal rule for wrappers

> **Wrappers DO NOT redesign components. Wrappers ONLY adapt framework APIs.**

| Wrapper does | Wrapper does NOT |
|---|---|
| Map `@Input()` ↔ Stencil `@Prop()` | Change visual appearance |
| Map `@Output()` ↔ Stencil `@Event()` | Override token values |
| Add `ControlValueAccessor` for forms | Add new style classes that conflict |
| Project Angular `<ng-template>` to slots | Inject CSS that overrides the contract |
| Wrap with `OnPush` change-detection | Provide a "themed variant" of the component |

The visual contract is owned by the Stencil component + `<component>.tokens.css`. Period.

## Per-state token-driven rules

For every interactive component, document which token drives each state:

### Example — Falcon Button

| State | Token slot | Default value | Override via |
|---|---|---|---|
| idle bg | `--falcon-button-bg` | `var(--color-falcon-teal-700)` (variant=primary) | prop `variant` |
| hover bg | `--falcon-button-bg-hover` | `var(--color-falcon-teal-800)` | CSS var |
| focus-visible ring | `--falcon-button-shadow-focus` | `var(--shadow-falcon-focus)` | CSS var |
| active scale | `--falcon-button-scale-active` | `0.98` | CSS var |
| disabled opacity | `--falcon-button-opacity-disabled` | `0.5` | CSS var |
| loading bg | (uses idle + spinner overlay) | n/a | n/a |
| error border | n/a (button doesn't have error state) | n/a | n/a |
| selected ring | n/a | n/a | n/a |
| dark mode | `var(--color-falcon-teal-700)` is theme-stable; ring brightens via `--shadow-falcon-focus` dark cascade | automatic | automatic |

Components without a state (button has no "expanded" state) document it as **N/A** with rationale.

## Verifying contract compliance

A component is **contract-compliant** when:

- [ ] Every visual property reads from a token (no hardcoded values)
- [ ] All 9 states are documented (or marked N/A)
- [ ] Dark mode works automatically via cascade (no per-component dark override files)
- [ ] Stencil component works in Angular / React / Vue / Web Component without code changes
- [ ] Token gaps are listed in `GAPS_AND_UPGRADES.md`
- [ ] Wrapper-readiness status is current

**Gold standard:** `falcon-button-tw` — all 9 states documented, all-framework-ready, no token gaps.

**Worst offenders:** legacy components with hardcoded values in templates (see [[Falcon Color Palette Audit]] for the static-style risks).

## Connection to other contracts

The component contract intersects with:

**Current scope (Angular-first):**
- **[[Falcon Tailwind Theme]]** — provides the tokens the contract consumes
- **[[Tailwind States and Variants]]** — provides the variant vocabulary for interactive states
- **[[Falcon Angular Wrapper Pattern]]** — defines the Angular adaptation rules (CURRENT PRIORITY)
- **[[Falcon Stencil-to-Angular Bridge]]** — defines the cross-framework bridge

**Future extension (NOT current scope):**
- **[[Falcon React Wrapper Future Pattern]]** 🟡 placeholder for future React adaptation rules
- **[[Falcon Vue Wrapper Future Pattern]]** 🟡 placeholder for future Vue adaptation rules

## See also

- [[Tailwind CSS]] · [[Falcon Tailwind Theme]] · [[Falcon Design Tokens]] · [[Tailwind Multi-Framework Strategy]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-component-theme-contract](../../Brain%20Outputs/understanding/frontend/theme/falcon-component-theme-contract.md) · [FALCON_COMPONENT_REGISTRY_DEEP](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md) · [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FALCON_COMPONENT_INDEX]] · [[FRONTEND_INDEX]]
