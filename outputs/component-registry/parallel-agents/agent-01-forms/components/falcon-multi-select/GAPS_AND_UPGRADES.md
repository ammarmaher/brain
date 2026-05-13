# falcon-multi-select — GAPS AND UPGRADES

## Missing capabilities

### G1 — No per-option / per-chip ng-template (P1)

Same as dropdown — options can only show label + (no iconUrl support seen on multi-select option type — verify in Stencil). No chip customization.

**Recommended fix:** add `iconUrl` parity on the option type AND introduce `FalconMultiSelectOptionTemplateDirective` and `FalconMultiSelectChipTemplateDirective`.

### G2 — `errorText` vs `errorMessage` inconsistency (P2)

Same as dropdown. Alias and soft-deprecate.

### G3 — No async / lazy options (P1)

Same as dropdown — must be in memory.

### G4 — No virtual scrolling (P2)

Render performance degrades past ~200 options.

### G5 — No grouping (P2)

`FalconMultiSelectOption` has no `group?: string`.

### G6 — `falcon-search` event not surfaced on wrapper (P2)

No `(searched)` output. Same as dropdown.

### G7 — Methods not proxied (P1)

No `openPanel()` / `closePanel()` / `setFocus()` / `clear()` on Angular wrapper.

### G8 — No `max-selected` enforcement input (P2)

Earlier registry mentioned `maxSelected?` and `chipMode?: 'inline' | 'overflow'` props on the Stencil tag. The Angular wrapper does NOT surface them. **Recommended fix:** add `@Input() maxSelected?: number` + `@Input() chipMode: 'inline' | 'overflow' = 'overflow'` to the wrapper.

### G9 — No `iconUrl` parity with dropdown options (P2)

Dropdown Wave 4 added `iconUrl`. Multi-select option type does not have it. Adding it would enable consistent flag/avatar visuals across both.

### G10 — No chip-remove `(chipRemove)` event (P3)

Consumers might want to react when a single chip is removed via X click (vs full list change). Not exposed.

## Missing accessibility

- Live region for selection count changes ("3 of 7 selected") — verify in Stencil; if missing, add.
- Keyboard-only chip removal via Backspace from search field — verify.

## Missing tests

- No Angular wrapper spec located. Add CVA cycle, push-options race, chip-overflow, select-all tri-state, ngModel two-way.

## Missing Tailwind / token parity

- Same parity guarantees as dropdown — `:where()` selector chain ensures Shadow + Light read same tokens.
- Tailwind classes may not cover all chip states — verify.

## Performance risks

- `writeValue` triggers `pushOptions()` which re-pushes BOTH options + values. For very frequent updates, batch the two pushes.
- No virtualization for large lists.

## Visual / interaction risks

- Chip overflow rendering at narrow widths can cause layout jitter — confirm `maxChipsVisible` cap is enforced.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Per-option + per-chip templates | P1 |
| G3 | Async loading | P1 |
| G7 | Method proxies on wrapper | P1 |
| G8 | `maxSelected` + `chipMode` inputs | P2 |
| G9 | `iconUrl` parity | P2 |
| G2 | `errorMessage` alias | P2 |
| G6 | `searched` output | P2 |
| G5 | Grouped options | P2 |
| G4 | Virtual scroll | P2 |
| G10 | `chipRemove` event | P3 |

## Concrete upgrade API

```ts
// Wrapper additions
@ContentChild(FalconMultiSelectOptionTemplateDirective) optionTpl?;
@ContentChild(FalconMultiSelectChipTemplateDirective) chipTpl?;
@Input() maxSelected?: number;
@Input() chipMode: 'inline' | 'overflow' = 'overflow';
@Input() errorMessage?: string;
@Output() searched = new EventEmitter<string>();
@Output() chipRemoved = new EventEmitter<string | number>();
async openPanel(): Promise<void>;
async closePanel(): Promise<void>;
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

## Shared vs per-page

All gaps belong in the shared component.

## Workarounds today

- For G1/G9: pre-format `label` to include text-prefix glyphs (e.g. emoji) — ugly but no other route.
- For G3: cap option count or lazy-load via parent observable + re-feeding the `options` input.
- For G7: query the inner Stencil element via the `multiSelectEl` ViewChild and call methods.
- For G8: enforce maxSelected externally by capping the `valuesChange` array length before assignment.
