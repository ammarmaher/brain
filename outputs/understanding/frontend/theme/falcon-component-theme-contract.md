# Falcon Component Theme Contract — SoT

> Source of truth for the 9-section contract every Falcon component must satisfy. Vault graph node: `_obsidian/36-Theming/Falcon Component Theme Contract.md`.

**Created:** 2026-05-20
**Vault node:** `_obsidian/36-Theming/Falcon Component Theme Contract.md`

## The 9-section contract

Every Falcon component documents:

| # | Section | What it documents | Lives in |
|---|---|---|---|
| 1 | Default theme behavior | Tokens read from `@theme`; utilities composed | `OVERVIEW.md` |
| 2 | Component tokens | Per-component CSS-var slots | `TOKENS.md` |
| 3 | Interactive state rules | 9 states with token / utility per state | `OVERVIEW.md` + `TOKENS.md` |
| 4 | Dark mode behavior | Automatic via cascade; explicit overrides flagged | `TOKENS.md` |
| 5 | Wrapper usage | Angular wrapper props / events / slots | `API.md` + `USAGE.md` |
| 6 | Theme override rules | What consumers can override; what's locked | `TOKENS.md` |
| 7 | Cross-framework compatibility | Angular / React / Vue / Web Component readiness | `DECISION.md` |
| 8 | Token gaps | Missing tokens with proposals | `GAPS_AND_UPGRADES.md` |
| 9 | Wrapper-readiness status | Per-framework wrapper status | `DECISION.md` |

## The 9 interactive states

Every interactive component must define (or mark N/A with rationale):

1. **idle** (default)
2. **hover** — `hover:` variant
3. **focus-visible** — `focus-visible:[box-shadow:var(--shadow-falcon-focus)]`
4. **active** (pressed) — `active:` variant
5. **disabled** — `disabled:opacity-50 disabled:cursor-not-allowed`
6. **loading** — `aria-busy:` variant + spinner overlay
7. **error** — `aria-invalid:border-falcon-red-500`
8. **selected** — `aria-selected:` or `[class.selected]` + token
9. **expanded** — `aria-expanded:` rotation / bg

Plus **dark mode** — automatic via cascade when all values use tokens.

## The cardinal rule for wrappers

**Wrappers ONLY adapt framework APIs. They MUST NOT redesign components.**

| Allowed | Forbidden |
|---|---|
| Map `@Input()` ↔ `@Prop()` | Change visual appearance |
| Map `@Output()` ↔ `@Event()` | Override token values |
| Add CVA / v-model / refs | Add new CSS classes that conflict |
| Project `<ng-template>` to slots | Inject CSS that bypasses the contract |
| `OnPush` change detection | Provide "themed variants" |

The visual contract is owned by the Stencil component + `<component>.tokens.css`. Period.

## Per-component dossier structure

```
Brain Outputs/understanding/frontend/components/<component-name>/
├── OVERVIEW.md             ← Sections 1 + 3 (default theme + states)
├── API.md                  ← Section 5 (wrapper usage)
├── USAGE.md                ← Section 5 (consumer examples)
├── TOKENS.md               ← Sections 2 + 4 + 6 (tokens, dark, overrides)
├── GAPS_AND_UPGRADES.md    ← Sections 8 + 9 (gaps + readiness)
└── DECISION.md             ← Section 7 (cross-framework + architectural decisions)
```

**Status:** 62 component folders, 6 files each = 360 component markdown files (per `FALCON_COMPONENT_REGISTRY_DEEP.md`). Existing coverage = 91% overall (per `narrative/READINESS_SCORES.md`).

## Verification — contract compliance checklist

A component is contract-compliant when:

- [ ] Every visual property reads from a token (no hardcoded values)
- [ ] All 9 states documented (or N/A with rationale)
- [ ] Dark mode works automatically via cascade
- [ ] Stencil component works in Angular / React / Vue / Web Component unchanged
- [ ] Token gaps listed in `GAPS_AND_UPGRADES.md`
- [ ] Wrapper-readiness status current

## Gold standard / worst offenders

**Gold:** `falcon-button-tw` — all 9 states documented, all-framework-ready, no token gaps.

**Worst:** legacy components with `style="…"` inline or hardcoded `#hex` in templates. See `STATIC_STYLE_RISKS.md` for the full list.

## See also

- `falcon-tailwind-theme.md` — the theme this contract consumes
- `falcon-multi-framework-wrapper-strategy.md` — how each wrapper adapts
- `falcon-angular-wrapper-pattern.md` — Angular-specific adaptation
- `falcon-tailwind-alignment-scorecard.md` — gap analysis + fix plan
- `FALCON_COMPONENT_REGISTRY_DEEP.md` — 60-row deep registry
- `FALCON_COMPONENT_CAPABILITY_MATRIX.md` — 60 × 15 capability matrix
- `narrative/READINESS_SCORES.md` — per-dimension readiness

## Vault graph node

`_obsidian/36-Theming/Falcon Component Theme Contract.md`
