# falcon-checkbox-group — GAPS AND UPGRADES

## Missing capabilities

### G1 — No per-option template / description (P1)

Only `label` text renders. No per-option description, icon, helper.

**Recommended fix:** add `description?: string` on `FalconCheckboxGroupOption` + render below label as muted. Add `FalconCheckboxGroupItemTemplateDirective` for full custom rendering.

### G2 — No "Select all" tri-state toggle (P2)

Multi-select has it; group doesn't. Adding `@Input() showSelectAll = false` + `selectAllLabel` matches the multi-select pattern.

### G3 — No grouping / sections (P3)

Same as dropdown — no `group?: string`.

### G4 — `errorText` vs `errorMessage` inconsistency (P2)

### G5 — No min / max selection enforcement (P2)

`@Input() minSelected?: number` + `@Input() maxSelected?: number` would standardize what consumers currently enforce externally via Validators.

### G6 — No required indicator on group label (P2)

`@Input() required = false` would surface a `*` on the `groupLabel`.

### G7 — `orientation: 'grid'` not supported (P3)

Vertical or horizontal only. Some forms want a 2-column grid layout. Either add `'grid'` orientation + `columns` input or document Tailwind override pattern.

### G8 — No keyboard nav between checkboxes (P3)

Per-checkbox focus is native. There's no arrow-key roving focus across the group — consider adding for a tighter UX.

### G9 — Wrapper registers a Stencil tag it never renders (P3) — NEW, verified 2026-06-03
`[CODE]` falcon-checkbox-group.component.ts:117-119 — `ngOnInit` calls `defineFalconTwComponent('falcon-checkbox-group')`, but the template (html) renders Angular `<falcon-angular-checkbox>` children, never `<falcon-checkbox-group(-tw)>`. The define call is dead for this component (harmless, but misleading + a tiny startup cost).
**Fix:** drop the `defineFalconTwComponent` call from the group wrapper. `safe-local`.

### G10 — Stencil↔Angular option-type drift: `value: string` vs `string | number` (P3) — NEW, verified 2026-06-03
`[CODE]` falcon-checkbox-group.types.ts:5-9 (`value: string`) vs falcon-checkbox-group.component.ts:20-24 (`value: string | number`). The Stencil twin and Angular wrapper disagree on the option key type; the Stencil twin also coerces every value via `String()` and parses JSON `selectedValues`. A `number`-keyed option works in Angular but would stringify in the Stencil twin (React/Vue).
**Fix:** unify the option type (widen Stencil to `string | number` or narrow the wrapper + document). `safe-local`.

### G11 — Token values are raw px/number literals (P2) — NEW, verified 2026-06-03
`[CODE]` checkbox-group.tokens.css:8-13 — `--falcon-checkbox-group-gap: 8px`, `-label-font-size: 13px`, `-option-gap-horizontal: 16px`, `-label-font-weight: 500` are hardcoded rather than aliasing `--falcon-spacing-*` / `--falcon-font-size-*` / `--font-weight-medium`. The group's spacing/type does not follow the platform scale. The `-tw` Stencil group additionally inlines `text-[13px]` / `accent-[…#124c52]` literals (falcon-checkbox-group-tw.tsx:97,114).
**Fix:** alias to platform tokens; keep px fallbacks. `safe-local`.

### G12 — Angular-path layout classes are unstyled in Light DOM (P2) — NEW, verified 2026-06-03
`[CODE]` The `.falcon-checkbox-group-*` layout rules (`-root`/`-label`/`-options`/`-options.is-horizontal`/`-helper`/`-error`) live ONLY in `falcon-checkbox-group.css` — the Stencil Shadow component's stylesheet (scoped to that Shadow via `:host`). The **Angular wrapper** reuses those class names in Light DOM but no global stylesheet defines them; notably `.is-vertical` is targeted nowhere (only `.is-horizontal` has a rule, unreachable from Light DOM). So the Angular group's vertical gap/label/helper styling does not apply — it falls back to each child's `inline-block`. This is why a real grouped layout today is hand-rolled.
**Fix:** ship a Light-DOM stylesheet (or Tailwind classes) for the Angular wrapper's group layout, OR have the wrapper read `--falcon-checkbox-group-*` via arbitrary utilities. `safe-local` (visually real).

## Missing accessibility

- `[CODE]` html:14-19 — `role="group"` + `aria-label` confirmed present (resolves the prior verify flag). Refinement: use `aria-labelledby` referencing the rendered label span instead of duplicating text in `aria-label`.
- Error message uses `role="alert"` (html:37-39) — announced; helper is silent (fine).

## Missing tests

- `[CODE]` grep 2026-06-03 → **0** `*checkbox-group*.spec.ts` for the wrapper or either Stencil tag. **GAP G13 — add a wrapper spec (CVA cycle, toggle add/remove/no-op, disabled-OR propagation, `[(selectedValues)]` two-way).** `safe-local`.

## Missing Tailwind / token parity

- The Stencil pair exists for React/Vue/Studio but the Angular wrapper composes Angular children — **the Angular path and the Stencil twin are two different implementations** (Angular = `<falcon-angular-checkbox>` items; Stencil = raw `<input>` + JSON `selectedValues`). Parity is therefore NOT meaningful at the markup level — they share only the `--falcon-checkbox-group-*` tokens. Documented (this is the Angular-first nature).

## Performance risks

- `selected().includes(value)` is O(N) per render — fine for ≤ 50 options, watch beyond.

## Visual / interaction risks

- Horizontal orientation with long labels can wrap awkwardly — confirm gap/wrap tokens.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Per-option description / template | P1 |
| G2 | Select-all toggle | P2 |
| G4 | `errorMessage` alias | P2 |
| G5 | `minSelected` / `maxSelected` | P2 |
| G6 | Required indicator | P2 |
| G7 | `'grid'` orientation | P3 |
| G3 | Grouping | P3 |
| G8 | Roving focus | P3 |

## Concrete upgrade API

```ts
export interface FalconCheckboxGroupOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

@Input() showSelectAll = false;
@Input() selectAllLabel = 'Select all';
@Input() required = false;
@Input() minSelected?: number;
@Input() maxSelected?: number;
@Input() errorMessage?: string; // alias
@ContentChild(FalconCheckboxGroupItemTemplateDirective) itemTpl?;
```

## Shared vs per-page

All in shared.

## Workarounds today

- For G1: pre-format `label` with HTML — won't render unless template is overhauled.
- For G2: manage select-all externally with two-way binding.
- For G5: enforce via Reactive Forms validators (`minLength(2)`).

## Wave findings (2026-06-03 deep-dive sweep, batch B05)

**Consumer count: 0** (`[CODE]` grep `<falcon-angular-checkbox-group` across `apps/` + `libs/falcon/`) — showcase-only (`gallery-defaults.ts`); the permission/settings/filter uses are design intent, not yet wired. Corrected from the stale Wave-7 "1 (playground)".

New verified gaps: **G9** (dead `defineFalconTwComponent` call), **G10** (Stencil↔Angular option-type drift), **G11** (raw-px token literals), **G12** (Angular-path layout classes unstyled in Light DOM), **G13** (zero specs). Resolved the prior a11y "verify role=group" flag (confirmed present). No deletion/promotion flag — the wrapper is a valid (if currently unused) Angular-first composition; the bigger structural story is the **two-implementation divergence** (Angular composes children; Stencil twin is self-contained) documented in OVERVIEW/INTEGRATION.
