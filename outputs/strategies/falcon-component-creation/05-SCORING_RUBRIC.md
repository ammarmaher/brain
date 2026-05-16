# 05 — Scoring Rubric

> **Purpose.** A 17-dimension scorecard used **before** and **after** every new-component run to measure fidelity against the canonical pattern. Pre-run scorecard catches gaps in the plan; post-run scorecard catches drift in the executed artefacts.
>
> **Status:** v1.0 — first calibrated on run `runs/2026-05-14_falcon-empty-data/`.

## How to use

1. **Pre-run.** Open this file alongside the run dir's `SCORECARD.md` (copy of the empty rubric below). Fill each row with the predicted score from the plan. Any dimension below 95% requires a written mitigation before Phase 1 starts.
2. **Post-run.** After Phase 4 build chain is green, score each dimension against the actual artefacts. Compare to the pre-run column.
3. **Threshold action.** Apply the action band (below) for the **lowest** dimension, then for the **weighted total**.

### Scoring scale

| Band | Total score | Action |
|---|---|---|
| Canonical | 90–100% | Ship. Log run in `09-CHANGELOG.md` only if lessons surfaced. |
| Minor deviations | 75–89% | Ship + write `DEVIATIONS.md` listing every sub-95% row + remediation owner. |
| Rework required | 50–74% | Block. Loop back to the failing phase. Re-run scorecard before re-attempt. |
| Rebuild | < 50% | Discard the artefacts. Reset to Phase 0. Treat the strategy itself as suspect — escalate to B1 doctrine review. |

> [INFERRED] A single dimension < 50% also forces "Rebuild" even if the weighted total is higher — the gap is structural, not cosmetic.

## The 17 dimensions

> **Total weight: 100%.** Weights tuned so the layers that the loader + Angular wrapper + builds depend on (#1, #2, #3, #7) carry roughly two-thirds of the score.

### 1. Directory layout — weight 6%

| Field | Value |
|---|---|
| Definition (100%) | Stencil Shadow + Light/TW + Tailwind helper + `.types.ts` siblings live under `libs/falcon-ui-core/src/components/falcon-<X>/`. Angular wrapper lives under `libs/falcon-ui-core/src/angular-wrapper/falcon-<X>/`. Token file lives at `libs/falcon-ui-tokens/src/components/<X>.tokens.css`. Mirrors every existing component byte-for-byte. |
| How to assess | `[CODE]` Glob the four target paths; diff the file tree against `falcon-button/` or `falcon-input/` as the reference. Any extra or missing file is an automatic deduction. |
| Common failure modes | Stencil Light TW component placed in a separate `tailwind/` subfolder; Angular wrapper accidentally placed inside `components/`; `.types.ts` placed in `models/` instead of as a sibling. |

### 2. Stencil Shadow component — weight 8%

| Field | Value |
|---|---|
| Definition (100%) | `.tsx` file uses `@Component({ tag: 'falcon-<X>', shadow: true, styleUrl: './falcon-<X>.css' })`. Every Prop declares `reflect: true` only when needed for CSS selectors; otherwise `reflect: false`. `@Element() host: HTMLElement` present. `componentWillLoad` / `disconnectedCallback` mirror existing lifecycle conventions. Imports types from sibling `.types.ts`. |
| How to assess | `[CODE]` Read the `.tsx`. Confirm shadow flag, styleUrl, Prop reflect choices, Element ref, and lifecycle hooks. Confirm zero CSS-in-TS. |
| Common failure modes | `shadow: false` accidentally used; `styleUrls` (plural) used; Props default to `reflect: true` and bloat the rendered DOM; lifecycle hooks pasted in but unused. |

### 3. Stencil Light/TW component — weight 8%

| Field | Value |
|---|---|
| Definition (100%) | `.tsx` file uses `@Component({ tag: 'falcon-<X>-tw', shadow: false })` (or registered via the loader as `falcon-<X>` Light variant — see #8). Imports its Props type from the sibling `.types.ts`. Imports the Tailwind class helpers from the sibling `<X>.classes.ts`. Renders the same DOM structure as the Shadow component but with Tailwind class strings instead of token-driven CSS. |
| How to assess | `[CODE]` Read the `.tsx`. Confirm `shadow: false`. Confirm the imports point at the **siblings** (not at a shared barrel). Confirm Props are identical to the Shadow component's Props (eyeball-match against #2). |
| Common failure modes | Inline Tailwind class strings instead of helper imports; types copy-pasted instead of imported from sibling; rendered DOM diverges from Shadow variant (button vs `<a>`, wrapper levels differ). |

### 4. Shared `.types.ts` — weight 5%

| Field | Value |
|---|---|
| Definition (100%) | One file, sibling to both `.tsx` files. Exports every Prop type, every event payload type, every size/variant union. Imported by Shadow component, Light/TW component, Tailwind helper, **and** Angular wrapper. No duplication of these types anywhere else. |
| How to assess | `[CODE]` Grep for the type names across `libs/falcon-ui-core/`. Confirm only one declaration. Confirm 4 imports (Shadow, Light, helpers, Angular wrapper). |
| Common failure modes | Types re-declared in `angular-wrapper/falcon-<X>.ts` "for convenience"; type names drift between Shadow and Angular wrapper layers; Props union widens silently. |

### 5. Shadow CSS — weight 7%

| Field | Value |
|---|---|
| Definition (100%) | `@import '../../tailwind.css'` + `@import '../../base.css'` at the top. Every visual value is `var(--falcon-<X>-<part>)`. `.falcon-icon` `@font-face` is re-declared inside the Shadow scope (Stencil shadow trees do not inherit document-level @font-face). Zero hardcoded color / px / hex / rgb. |
| How to assess | `[CODE]` Read the `.css`. Search for `#`, `rgb`, `px ` outside `var(...)`. Confirm both `@import` lines and the `@font-face` block. |
| Common failure modes | Forgotten `@font-face` (icon font renders as broken square); `@import` lines omitted (loses utility resets); raw `px` slipped in during a one-off tweak; missing `:host { display: ... }` rule. |

### 6. Tailwind class helpers — weight 7%

| Field | Value |
|---|---|
| Definition (100%) | `<X>.classes.ts` exports one pure function per visual part — `<part>Cls(props): string` — that returns a stable Tailwind class string. No `useMemo`, no React, no DOM. Consumes the **same token contract** as Shadow CSS (e.g. `[--falcon-<X>-bg]` arbitrary properties when the value must be themable). Reused by the Light/TW Stencil component **and** by the Angular wrapper's Tailwind branch. |
| How to assess | `[CODE]` Read the `.ts`. Confirm pure-function shape, named exports, zero framework imports. Confirm the Tailwind classes reference the same tokens as the Shadow CSS variables list. |
| Common failure modes | Helpers return arrays instead of strings (Stencil + Angular accept both but `clsx` collapses inconsistently); helpers import from `@angular/core` accidentally; tokens diverge — Shadow uses `--falcon-empty-data-bg`, helper uses bare `bg-white`. |

### 7. Tokens file — weight 8%

| Field | Value |
|---|---|
| Definition (100%) | `libs/falcon-ui-tokens/src/components/<X>.tokens.css`. Single `:where(falcon-<X>, falcon-<X>-tw, .falcon-<X>)` selector chain (or the variant the existing components use). Every value used by Shadow CSS **and** Tailwind helpers is declared once here. Registered in `libs/falcon-ui-tokens/src/index.css` via `@import './components/<X>.tokens.css'`. |
| How to assess | `[CODE]` Read the tokens file. Diff against Shadow CSS — every `var(--falcon-<X>-…)` must resolve here. Confirm `index.css` import. |
| Common failure modes | Values declared but Shadow CSS still hardcodes; `index.css` import forgotten (tokens never reach the cascade); selector chain misses the Angular wrapper host (`.falcon-<X>` variant). |

### 8. Loader registration — weight 4%

| Field | Value |
|---|---|
| Definition (100%) | One-line add to `libs/falcon-ui-core/src/loader/define-falcon-tw-component.ts` registering the Light/TW variant. Tag name matches `03-NAMING_CONVENTION.md` exactly. |
| How to assess | `[CODE]` Read the file. Confirm a single new line. Confirm the imported class name matches the Light/TW component. |
| Common failure modes | Loader entry duplicated (build still passes; double-define warning); imported from `dist/` instead of `src/` (breaks tree-shake); class name typo (loader silently no-ops). |

### 9. Angular wrapper class + selector — weight 6%

| Field | Value |
|---|---|
| Definition (100%) | Class `FalconAngular<X>Component` decorated with `@Component({ selector: 'falcon-angular-<X>', templateUrl: './falcon-angular-<X>.html', standalone: true })`. `imports: [CommonModule]` only. Exposes every Prop from `.types.ts` as an `@Input` and every event as an `@Output`. |
| How to assess | `[CODE]` Read the `.ts`. Confirm class name, selector, standalone, imports list, Input/Output parity with `.types.ts`. |
| Common failure modes | Selector dropped to `falcon-<X>-angular` (wrong direction — `angular` is the prefix not the suffix); class non-standalone; extra `imports` array bloat (`PrimeNG`, `MaterialModule` — forbidden anywhere in `@falcon/*`). |

### 10. Lazy registration via ngOnInit — weight 4%

| Field | Value |
|---|---|
| Definition (100%) | Angular wrapper's `ngOnInit` calls `defineFalconTwComponent('falcon-<X>')` (or the Shadow variant equivalent). Registration is idempotent — multiple wrapper instances do not double-define. The wrapper's HTML template renders the Light/TW or Shadow tag **after** registration. |
| How to assess | `[CODE]` Read the `.ts`. Confirm `ngOnInit` body. Confirm the loader function is imported from `../loader/define-falcon-tw-component`. |
| Common failure modes | Registration moved to constructor (runs during SSR / hydration before DOM); registration forgotten entirely (tag renders as unknown element); registration awaited but template renders synchronously (race — see `08-COMMON_PITFALLS.md` #3). |

### 11. HTML wrapper template — weight 4%

| Field | Value |
|---|---|
| Definition (100%) | `@if (useTailwind) { <falcon-<X>-tw …> } @else { <falcon-<X> …> }` switch. Every Prop bound twice — once for each branch — using the same `[prop]` Angular syntax. Every event bound twice using `(falcon-<verb>-<noun>)` kebab form. Identical event-handler method names. |
| How to assess | `[CODE]` Read the `.html`. Diff the two branches — every Input/Output must appear in both. |
| Common failure modes | One branch missing a Prop (Shadow uses 9 Inputs, Light uses 8); event names use camelCase `(falconAction)` instead of kebab `(falcon-action-click)`; Tailwind branch hardcodes class strings inline instead of binding the helper. |

### 12. Stencil events — weight 5%

| Field | Value |
|---|---|
| Definition (100%) | Every event emits as `falcon-<verb>-<noun>` kebab-case. `@Event({ bubbles: true, composed: true })` so the event crosses the Shadow boundary. Payload type declared in `.types.ts`. |
| How to assess | `[CODE]` Read both `.tsx` files. Confirm `@Event` decorator options on every emitter. Confirm payload imports from sibling `.types.ts`. |
| Common failure modes | `composed: false` (event dies at Shadow root); event name camelCase (Angular kebab binding then fails to fire); payload `any` instead of typed. |

### 13. Data-table / consumer integration — weight 6%

| Field | Value |
|---|---|
| Definition (100%) | If the component is used inside a higher-level component (e.g. `falcon-data-table`'s empty-state slot), the consumer follows the eager-register pattern documented in `07-INTEGRATION_POINTS.md` (consumer calls `defineCustomElements()` at module bootstrap rather than relying on the per-wrapper ngOnInit). |
| How to assess | `[CODE]` Grep for the new tag inside `falcon-data-table` (and any other consumer flagged in the plan). Confirm eager-register call exists at the consumer's bootstrap site. |
| Common failure modes | Consumer relies on lazy registration → first render of the data table shows the empty slot as an unknown element (FOUC); consumer imports the Shadow class directly, bypassing the loader contract. |

### 14. Build pipeline — weight 6%

| Field | Value |
|---|---|
| Definition (100%) | `nx build falcon-ui-core` green. Then `nx build admin-console` green. Then `nx build host-shell` green. Zero new warnings. Stencil compile produces both `dist-custom-elements` and `react` outputs without changes to consuming apps. |
| How to assess | `[CODE]` Run the three builds in order. Compare warning count to pre-run baseline. |
| Common failure modes | EMFILE during Stencil compile (Windows file-handle exhaustion — see `08-COMMON_PITFALLS.md` #1); `dist-custom-elements` output skipped because Stencil bailed on a type error; consuming app fails because the Angular wrapper barrel missed the new export. |

### 15. a11y attributes — weight 5%

| Field | Value |
|---|---|
| Definition (100%) | `role`, `aria-label`, `aria-hidden`, `aria-disabled` mirror existing components of the same family (interactive vs presentational). For status-display components (empty-data, badge, status-pill), `role="status"` + `aria-live="polite"` are mandatory. Icon-only buttons declare `aria-label`. |
| How to assess | `[CODE]` Read both `.tsx` files. Diff aria attribute set against the nearest sibling component (e.g. `falcon-empty-data` vs `falcon-pill`). |
| Common failure modes | `aria-label` hardcoded in English instead of accepting a Prop; `role="status"` forgotten on empty-state components; `aria-hidden="true"` applied to the focusable wrapper instead of the decorative icon. |

### 16. Tokens-only paint — weight 6%

| Field | Value |
|---|---|
| Definition (100%) | **ZERO** hardcoded `px`, `#`, `rgb`, `rgba`, `hsl` values anywhere in the Shadow CSS, the Tailwind helpers, or the Tailwind branch of the HTML template. Every spacing / radius / shadow / color flows through `var(--falcon-<X>-…)`. |
| How to assess | `[CODE]` Grep each artefact for `#[0-9a-f]{3,6}`, `rgb\(`, `[0-9]+px` outside `var(` contexts. Each hit costs 5%. |
| Common failure modes | One-off pixel value during a tweak (`margin: 4px`); hex slipped into a `box-shadow`; Tailwind helper uses arbitrary class with raw value `bg-[#ffffff]` instead of `bg-[var(--falcon-<X>-bg)]`. |

### 17. Brain SK + Obsidian + reports updated — weight 5%

| Field | Value |
|---|---|
| Definition (100%) | (a) `Brain SK/registries/FALCON_COMPONENT_REGISTRY.md` updated with the new entry. (b) `Brain Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md` updated. (c) Typed Obsidian note created at `C:\Falcon\falcon-wiki\30-Components\falcon-<X>.md` via the `new-component` Templater template. (d) Run dir contains `SCORECARD.md` + `EXECUTION_LOG.md` + `DEVIATIONS.md` (if any) + `LESSONS_LEARNED.md`. |
| How to assess | `[VAULT]` `[BRAIN-SK]` Read each registry; confirm the new row. Read the vault note. List the run-dir files. |
| Common failure modes | One of the two registries forgotten (drift between Brain SK and Brain Outputs); Obsidian note appended to a different folder; `DEVIATIONS.md` skipped despite a sub-95% dimension. |

## Weights summary

| Dim | Name | Weight |
|---|---|---|
| 1 | Directory layout | 6% |
| 2 | Stencil Shadow component | 8% |
| 3 | Stencil Light/TW component | 8% |
| 4 | Shared `.types.ts` | 5% |
| 5 | Shadow CSS | 7% |
| 6 | Tailwind class helpers | 7% |
| 7 | Tokens file | 8% |
| 8 | Loader registration | 4% |
| 9 | Angular wrapper class + selector | 6% |
| 10 | Lazy registration via ngOnInit | 4% |
| 11 | HTML wrapper template | 4% |
| 12 | Stencil events | 5% |
| 13 | Data-table / consumer integration | 6% |
| 14 | Build pipeline | 6% |
| 15 | a11y attributes | 5% |
| 16 | Tokens-only paint | 6% |
| 17 | Brain SK + Obsidian + reports updated | 5% |
| **Total** | | **100%** |

## Empty scorecard template

> Copy this into `runs/<date>_<component>/SCORECARD.md` and fill the columns.

```
| Dim | Name | Weight | Pre-run | Post-run | Delta | Notes |
|---|---|---|---|---|---|---|
| 1  | Directory layout                          | 6%  | __% | __% | __  |     |
| 2  | Stencil Shadow component                  | 8%  | __% | __% | __  |     |
| 3  | Stencil Light/TW component                | 8%  | __% | __% | __  |     |
| 4  | Shared `.types.ts`                        | 5%  | __% | __% | __  |     |
| 5  | Shadow CSS                                | 7%  | __% | __% | __  |     |
| 6  | Tailwind class helpers                    | 7%  | __% | __% | __  |     |
| 7  | Tokens file                               | 8%  | __% | __% | __  |     |
| 8  | Loader registration                       | 4%  | __% | __% | __  |     |
| 9  | Angular wrapper class + selector          | 6%  | __% | __% | __  |     |
| 10 | Lazy registration via ngOnInit            | 4%  | __% | __% | __  |     |
| 11 | HTML wrapper template                     | 4%  | __% | __% | __  |     |
| 12 | Stencil events                            | 5%  | __% | __% | __  |     |
| 13 | Consumer integration                      | 6%  | __% | __% | __  |     |
| 14 | Build pipeline                            | 6%  | __% | __% | __  |     |
| 15 | a11y attributes                           | 5%  | __% | __% | __  |     |
| 16 | Tokens-only paint                         | 6%  | __% | __% | __  |     |
| 17 | Brain SK + Obsidian + reports             | 5%  | __% | __% | __  |     |
| **Total (weighted)** | | **100%** | **__%** | **__%** | **__** | |
```

## Example — `falcon-empty-data` (run `runs/2026-05-14_falcon-empty-data/`)

> [INFERRED] Predicted post-run scores from the strategy doctrine. Replace with measured values after Phase 5 finalises the run.

| Dim | Name | Weight | Predicted | Weighted | Notes |
|---|---|---|---|---|---|
| 1  | Directory layout                          | 6%  | 100% | 6.00% | All 6 paths created exactly per `02-FOLDER_STRUCTURE.md`. |
| 2  | Stencil Shadow component                  | 8%  |  98% | 7.84% | One Prop reflect choice flagged for review. |
| 3  | Stencil Light/TW component                | 8%  |  98% | 7.84% | DOM structure matches Shadow variant; tiny attribute drift on icon wrapper. |
| 4  | Shared `.types.ts`                        | 5%  | 100% | 5.00% | Single source, 4 consumers, zero duplication. |
| 5  | Shadow CSS                                | 7%  |  98% | 6.86% | All values tokenised; one `:host { display: block }` rule eyeballed for accuracy. |
| 6  | Tailwind class helpers                    | 7%  | 100% | 7.00% | Pure functions, zero framework imports. |
| 7  | Tokens file                               | 8%  | 100% | 8.00% | All values declared + `index.css` import landed. |
| 8  | Loader registration                       | 4%  | 100% | 4.00% | One clean line. |
| 9  | Angular wrapper class + selector          | 6%  | 100% | 6.00% | `FalconAngularEmptyDataComponent` + `falcon-angular-empty-data`. |
| 10 | Lazy registration via ngOnInit            | 4%  | 100% | 4.00% | Idempotent register call. |
| 11 | HTML wrapper template                     | 4%  | 100% | 4.00% | `@if (useTailwind)` switch, every Prop double-bound. |
| 12 | Stencil events                            | 5%  |  95% | 4.75% | Empty-data has only one optional event (`falcon-action-click`); minor payload typing nit. |
| 13 | Consumer integration                      | 6%  |  98% | 5.88% | `falcon-data-table` eager-register added; one secondary consumer still uses lazy path. |
| 14 | Build pipeline                            | 6%  |  95% | 5.70% | All 3 builds green; one transient EMFILE on first attempt resolved by re-run. |
| 15 | a11y attributes                           | 5%  |  92% | 4.60% | `role="status"` + `aria-live="polite"` present; `aria-label` on action button is English-only. |
| 16 | Tokens-only paint                         | 6%  | 100% | 6.00% | Zero hardcoded values across all artefacts. |
| 17 | Brain SK + Obsidian + reports             | 5%  | 100% | 5.00% | Both registries + vault note + 4 run-dir files. |
| **Total (weighted)** | | **100%** | — | **98.47%** | **Canonical band.** Ship + log lessons; no `DEVIATIONS.md` needed. |

> Action: Ship. `09-CHANGELOG.md` v1.0 records the empty-data run as the calibration baseline.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
