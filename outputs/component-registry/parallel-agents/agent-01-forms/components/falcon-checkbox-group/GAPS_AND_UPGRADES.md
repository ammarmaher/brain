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

## Missing accessibility

- Verify `role="group"` + `aria-labelledby` on root.
- Verify error message is announced via live region.

## Missing tests

- No spec located. Add CVA cycle + toggle + disabled propagation.

## Missing Tailwind / token parity

- The Stencil pair (`<falcon-checkbox-group>` + `-tw`) exists but the Angular wrapper composes Angular children. Verify parity is meaningful here — if not, document the Angular-first nature.

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
