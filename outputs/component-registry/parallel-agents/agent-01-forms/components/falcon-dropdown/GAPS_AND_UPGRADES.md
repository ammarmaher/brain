# falcon-dropdown — GAPS AND UPGRADES

## Missing capabilities

### G1 — No per-option template / projection slot through Angular wrapper (P1)

Stencil exposes `slot="options"` for full-panel custom rendering BUT:
- Angular wrapper does not project `<ng-content select="[slot=options]">`.
- No per-option `ng-template` input exists for typical "render this row" customization.
- `iconUrl` (Wave 4) was added specifically as a workaround for the language-picker flag case — but it covers only the icon-left-of-label case.

**Need:** a per-option template pattern such as `<ng-template let-option falconDropdownOption>` so consumers can render structured rows (icon + label + sub-label + status pill, etc.).

**Recommended fix (P1):** add `@ContentChild` directive `FalconDropdownOptionTemplateDirective` + projection. Mirror the `FalconDataTableCellDirective` pattern used by `<falcon-angular-data-table>`.

### G2 — `errorText` input vs `errorMessage` Stencil prop — API inconsistency (P2)

Wrapper exposes `errorText` (line 76 of falcon-dropdown.component.ts). The Stencil tag and `<falcon-angular-input>` both use `errorMessage`. Inconsistent naming will trip consumers building both inputs and dropdowns in the same form.

**Recommended fix:** alias `errorMessage` on the wrapper, deprecate `errorText` via JSDoc, update consumers. Maintain back-compat for one milestone.

### G3 — No multi-select mode (P1)

Single-select only. For multi, today's path is `<falcon-angular-multi-select>` — a separate component with its own chip mode and overflow pill. There's no obvious way to share the panel implementation between the two.

**Recommended fix (P2 → architectural):** explore unifying as `<falcon-angular-select>` with a `mode: 'single' | 'multi'` input that swaps internals. Risk: large blast radius — defer to a milestone-level refactor.

### G4 — No async / lazy options loading (P1)

Options must be present in memory. Large catalogues (10K+ items) require all options eagerly. There's no `loadOptions(query)` hook.

**Recommended fix:** add `@Input() loadOptions?: (query: string) => Observable<FalconDropdownOption[]>` + internal debounce + loading state token.

### G5 — No grouping / sectioned options (P2)

`FalconDropdownOption` has no `group` field. Consumers needing sectioned dropdowns (e.g. recent vs all) cannot model it.

**Recommended fix:** add optional `group?: string` to `FalconDropdownOption` + render group headers when any option has it.

### G6 — Angular wrapper does not expose Stencil methods (P1)

`openPanel()`, `closePanel()`, `setFocus()`, `clear()` exist on Stencil but not on the Angular wrapper. Same gap as `<falcon-angular-input>`.

### G7 — `falcon-search` event not re-emitted to Angular (P2)

Stencil emits `falcon-search` with query string. Wrapper does not expose `(falconSearch)` `@Output`. Consumers wanting to wire searchable dropdowns to server-side filtering cannot.

**Recommended fix:** add `@Output() searched = new EventEmitter<string>()`.

### G8 — `panelClass` / `optionClass` / `triggerClass` only flow on Tailwind path (P2)

Same parity break as `<falcon-input>` — Shadow path consumers can't extend with extra class names.

### G9 — Type-ahead buffer is fixed at 600ms (P3)

Hardcoded `setTimeout(...600)` for type-ahead drain. No `typeAheadDelay` input.

### G10 — No virtual scrolling for long option lists (P2)

Rendering 5K+ options as DOM nodes will jank. Add optional `virtualScroll` mode using e.g. `<cdk-virtual-scroll-viewport>` equivalent at the Stencil level, or document the 200-option soft-cap.

## Missing accessibility

- **A1:** Live region for "search results: N matches" not implemented — screen readers won't announce result count changes when typing.
- **A2:** Active descendant attribute (`aria-activedescendant` on trigger) not seen in the source — keyboard nav highlights via CSS class only.

## Missing tests

- No `.spec.ts` for the Angular wrapper located. Adding tests for: option pushing race, CVA write/read cycle, type-ahead, search, keyboard nav, outside-click close.

## Missing Tailwind / token parity

- Tailwind path may not render the `slot="options"` (mirror of G1 for Tailwind).
- `falcon-dropdown-tw.tsx` shadows the same prop list — verify.

## Performance risks

- The `pushOptions()` race-guard runs on every `ngOnChanges` cycle and every option setter. For very large `options` arrays mutated frequently, this is O(N) per push. Recommend memoization or `trackBy`-like identity check.
- Type-ahead buffer never resets on Tab/Escape — minor edge case.

## Visual / interaction risks

- Outside-click handler uses `composedPath` — fragile when shadow boundaries differ between modes. Verify on Light-DOM tag.
- Search input auto-focuses via `requestAnimationFrame` — could focus prematurely if open is interrupted.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Per-option `ng-template` / directive | P1 |
| G3 | Multi-mode unification with multi-select | P2 (arch) |
| G4 | Async option loading | P1 |
| G6 | Expose Stencil methods on wrapper | P1 |
| G2 | `errorMessage` alias / deprecate `errorText` | P2 |
| G7 | `searched` `@Output` | P2 |
| G5 | Grouped options | P2 |
| G10 | Virtual scrolling | P2 |
| G8 | Class-passthroughs on Shadow path | P2 |
| G9 | `typeAheadDelay` input | P3 |

## Concrete upgrade API

```ts
// Angular wrapper additions
@ContentChild(FalconDropdownOptionTemplateDirective) optionTemplate?: FalconDropdownOptionTemplateDirective;
@Input() loadOptions?: (query: string) => Observable<FalconDropdownOption[]>;
@Input() errorMessage?: string; // alias of errorText
@Output() searched = new EventEmitter<string>();
@Input() typeAheadDelay = 600;
@Input() virtualScroll = false;
async openPanel(): Promise<void>;
async closePanel(): Promise<void>;
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

```ts
// FalconDropdownOption additions
export interface FalconDropdownOption {
  // ... existing
  group?: string;
  meta?: Record<string, unknown>; // for custom templates
}
```

## Shared vs per-page

All gaps belong in the shared component. Per-page workarounds (like the ad-hoc language picker iconUrl) lead to duplicate code.

## Workarounds today

- For G1: use the raw `<falcon-dropdown>` tag with `slot="options"` (bypass Angular wrapper, more boilerplate).
- For G3: use `<falcon-angular-multi-select>` — separate component.
- For G4: keep dropdowns < 200 items, paginate manually.
- For G6: reach into `ViewChild.nativeElement.querySelector('falcon-dropdown')` and call methods directly.
