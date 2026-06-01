---
name: Falcon UI cross-framework library — current state + architecture lock-in
description: Live architecture for the Falcon UI library inside the Nx workspace. Read on session start when working on Falcon UI components (input, dropdown, multi-select, checkbox, etc.).
type: project
originSessionId: a5633b96-ddd8-4f9a-a863-589d7c3a3955
---
# Falcon UI library — state at end of 2026-05-07 session

## Where everything lives (inside the Nx workspace `C:/falcon/falcon-web-platform-ui`)

```
libs/
├── falcon-ui-tokens/                    @falcon/ui-tokens — CSS variables, single source of truth
│   └── src/
│       ├── index.css
│       ├── primitives/  (colors, spacing, radius, shadow, typography, motion — aliased to workspace SSOT)
│       ├── semantic/    (semantic.css)
│       ├── themes/      (light.css, dark.css)
│       ├── density/     (comfortable.css, compact.css)
│       ├── rtl/         (rtl.css)
│       └── components/
│           └── input.tokens.css   (14-category contract — pattern for ALL future components)
│
├── falcon-ui-core/                      @falcon/ui-core — Stencil core + Tailwind helpers + Angular wrapper
│   └── src/
│       ├── components/
│       │   ├── falcon-input/            (Shadow DOM web component)
│       │   └── falcon-input-tw/         (Light DOM web component — uses Tailwind utilities)
│       ├── tailwind/
│       │   └── tailwind-classes.ts      (cross-framework class-string helpers)
│       ├── angular-wrapper/             (lives INSIDE the cross-framework lib)
│       │   ├── components/
│       │   │   └── falcon-input/        (Angular CVA wrapper — tag switcher)
│       │   ├── utilities/
│       │   ├── index.ts
│       │   └── README.md / PATTERN.md
│       ├── styles/  utils/  types/
│       ├── define-custom-elements.ts    (registers BOTH <falcon-input> AND <falcon-input-tw>)
│       └── index.ts
│
└── falcon/                              Existing big lib (unchanged externally)
    └── src/shared-ui/index.ts           Re-exports FalconAngularInputComponent from '@falcon/ui-core/angular'
                                          (so consumers can keep using `import { ... } from '@falcon';`)
```

## Path aliases (in `tsconfig.base.json`)

```json
"@falcon"                  → libs/falcon/src/index.ts
"@falcon/sdk"              → libs/sdk/src/index.ts
"@falcon/ui-core"          → libs/falcon-ui-core/src/index.ts
"@falcon/ui-core/loader"   → libs/falcon-ui-core/src/define-custom-elements.ts
"@falcon/ui-core/tailwind" → libs/falcon-ui-core/src/tailwind/tailwind-classes.ts
"@falcon/ui-core/angular"  → libs/falcon-ui-core/src/angular-wrapper/index.ts
"@falcon/ui-tokens/*"      → libs/falcon-ui-tokens/src/*
```

## The DUAL-RENDER pattern (locked in — every new component follows this)

Every Falcon UI primitive ships TWO Stencil web components + one thin Angular wrapper:

```
<falcon-X>      Shadow DOM, tokens-driven    (consumer wants encapsulation)
<falcon-X-tw>   Light DOM,  Tailwind utility (consumer wants Tailwind)

<falcon-angular-X>  Angular wrapper that renders ONE OF the two web components based on [useTailwind]
                   • CVA (writeValue / registerOnChange / registerOnTouched / setDisabledState)
                   • Methods (NOT computed signals) for class strings — methods re-run on OnPush CD
                   • Forward all events bubbled+composed from the Stencil tag

React (Wave 5) and Vue (Wave 6) wrappers will mirror this pattern exactly when they ship.
PATTERN.md at libs/falcon-ui-core/src/angular-wrapper/PATTERN.md explains it.
```

## Single source of truth

Both Stencil and Tailwind modes read tokens via the same chain:

```
Component CSS (Stencil)  OR  Tailwind helper (string class)
            ↓                            ↓
            var(--falcon-input-bg)       text-[color:var(--falcon-input-bg)] / bg-falcon-neutral-0
                                                      │
                                            either resolves through
                                                      ↓
            libs/falcon-ui-tokens/src/components/input.tokens.css
                                                      ↓
            var(--color-falcon-neutral-0, fallback)  →  workspace SSOT
                                                      ↓
            libs/falcon/src/theme/falcon-tailwind-tokens.css  (@theme block)
```

Mutating ANY `--color-falcon-*` token at runtime updates Stencil + Tailwind in every framework. Studio-ready.

## Tailwind v4 gotchas to remember

| Issue | Fix |
|---|---|
| `var()` requires `--` prefix on the var name | `var(--falcon-input-error-padding-x)` not `var(falcon-…)` |
| `text-[var(--x)]` is interpreted as COLOR (not size) | Use `text-[length:var(--x)]` for font-size, `text-[color:var(--x)]` for color |
| `bg-[var(--x)]` defaults to color (correct), but `bg-[length:…]` for size | Use type hints when ambiguous |
| `font-[var(--x)]` → use `font-[number:var(--x)]` for weight | Type hint required |
| Class strings inside TS template literals across `?:` branches may be missed by Tailwind's static scanner | **Always add `@source inline("…")`** to admin-console's + host-shell's `tailwind.css` |
| Workspace's `tailwind.config.js` has `important: true` | Every Tailwind utility is emitted as `!important` automatically |
| `dependsOn: ['^build']` race during `--skip-nx-cache` first run | Re-run; Stencil dist must exist before Angular import resolves. `npx nx build falcon-ui-core` first if needed |

## Reactivity gotcha — DO NOT use computed() to read @Input properties

`computed()` only tracks SIGNAL deps. `@Input` regular properties are NOT signals.

```typescript
// ❌ WRONG — never recomputes when [state] @Input changes
protected readonly hasError = computed(() => this.state === 'error');

// ✅ CORRECT — methods re-run every CD cycle, OnPush triggers CD on @Input change
protected hasError(): boolean { return this.state === 'error'; }
```

This bug bit during the input work; documented so it doesn't bite again.

## CSS specificity gotcha for state styling

For error/focus/hover that should override each other:
- `.focused:not(.disabled)` is 0,3,0
- `.error` alone is 0,2,0 → loses to focus
- Fix: add `:not(.error)` to focus + hover, AND `:not(.disabled)` to .error: `0,3,0` matches focus and the LATER rule wins

## Defense-in-depth Tailwind safelist

`apps/admin-console/src/tailwind.css` and `apps/host-shell/src/tailwind.css` BOTH need to:
1. `@source "../../../libs/falcon-ui-core/src/tailwind"` — scan the helpers folder
2. `@source "../../../libs/falcon-ui-core/src/angular-wrapper"` — scan the Angular wrapper
3. `@source inline("CLASS")` for every arbitrary-value class used in TS string concatenation

Without (3), Tailwind's static scanner misses classes split across `?:` ternaries.

## Bootstrap requirement

Both `apps/admin-console/src/main.ts` AND `apps/host-shell/src/main.ts` call:
```typescript
import { defineCustomElements } from '@falcon/ui-core/loader';
defineCustomElements();   // no args — uses dist-custom-elements bundle, not lazy loader
```

Module Federation: `host-shell` runs main.ts. admin-console's main.ts only runs in standalone mode (port 4204). When loaded via host-shell (port 4200), the host's `defineCustomElements()` is what matters. The shim at `define-custom-elements.ts` is idempotent (`if (registered) return`).

## What's tested in admin-console today (proof points)

| Field | Mode | What it proves |
|---|---|---|
| **Account Name** (Add Client wizard, step 1) | Stencil mode (`useTailwind=false`) | Shadow DOM, token-driven, `.add-client-special-input` per-instance class override |
| **Finance ID** (Add Client wizard, step 1) | Tailwind mode (`useTailwind=true`) | Light DOM, Tailwind utilities, hover-green via caller `[wrapperClass]` |

## Validation work was DEFERRED

The user asked at one point about implementing validators (Phase 1-4 plan), then explicitly **discarded** it in favor of building more components first. Don't re-litigate; just track that the validation library is NOT in scope until the user revisits.

## Next session's job (per `libs/falcon-ui-core/NEXT-COMPONENTS-PLAN.md`)

Build the next form primitives following the proven pattern:
1. `falcon-dropdown` (single select, searchable)
2. `falcon-multi-select` (chips, searchable, "select all")
3. `falcon-checkbox` (with indeterminate state)
4. `falcon-checkbox-group`
5. `falcon-radio` / `falcon-radio-group`
6. `falcon-switch`
7. `falcon-textarea`

Each component follows the dual-render-path + 14-category-token + thin-Angular-wrapper pattern from `<falcon-input>`. Test each by replacing one PrimeNG `<p-select>` in `client-information-step` (Classification Category, Country, City, etc.).

Full birth-certificate checklist + token contract pattern + i18n key namespace are documented in `NEXT-COMPONENTS-PLAN.md` inside the library.

## Files to READ at start of next session (in order)

1. **`libs/falcon-ui-core/NEXT-COMPONENTS-PLAN.md`** — the implementation plan
2. **`libs/falcon-ui-core/src/angular-wrapper/PATTERN.md`** — cross-framework wrapper pattern
3. **`libs/falcon-ui-core/src/angular-wrapper/README.md`** — Angular-specific lib structure
4. **`libs/falcon-ui-tokens/src/components/input.tokens.css`** — the 14-category token contract reference
5. **`libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx`** — Stencil component reference
6. **`libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx`** — Light DOM Stencil reference
7. **`libs/falcon-ui-core/src/tailwind/tailwind-classes.ts`** — helper-function reference
8. **`libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts`** — Angular wrapper reference

## Memory rules in effect

- `feedback_no_commit_no_push_strict_2026_05_02` — never commit/push without "commit"/"push" in the current message
- `feedback_no_ui_testing_during_implementation` — no dev-serve during implementation
- `feedback_always_build_zero_errors` — `npx nx build admin-console --configuration=production` after every change
- `feedback_strict_task_scope` — don't edit infra/config outside the immediate task
- `feedback_no_inline_styles_tokens_only` — every visual value via tokens
- `feedback_clean_code_dry_minimal` — minimal code, no speculative abstractions
