# falcon-dropdown — GAPS AND UPGRADES

> Sweep-refreshed 2026-06-03 (B04). G1 corrected (the wrapper DOES forward `slot="options"` in Shadow mode — the real gap is the Tailwind-path options slot + a per-option template). New B04 audit findings appended at the end.

## Missing capabilities (active source verified 2026-06-03)

### G1 — No per-option template through the Angular wrapper; Tailwind path has no `options` slot (P1)

`[CODE]` Reality (corrected): the wrapper DOES project `<ng-content select="[slot=options]" slot="options">` in the **Shadow** branch (`falcon-dropdown.component.html:73`), and the Shadow Stencil renders `<slot name="options">` (`falcon-dropdown.tsx:526`). What is missing:
- The **Tailwind** twin `<falcon-dropdown-tw>` has **no `<slot name="options">`** (`falcon-dropdown-tw.tsx` render only emits the auto option loop) — so a custom listbox via slot is Shadow-path-only (parity break).
- There is **no per-option `ng-template`/directive** for structured rows (icon + label + sub-label + status pill). `iconUrl` (Wave 4) covers only the icon-left-of-label case.

**Recommended fix (P1):** add a `<slot name="options">` to `<falcon-dropdown-tw>` (Tailwind parity), AND add a `@ContentChild` directive `FalconDropdownOptionTemplateDirective` mirroring the `FalconDataTableCellDirective` pattern. `risk-class HIGH-RISK-QUEUE` (render-path/template-contract change).

### G2 — `errorText` wrapper input vs `errorMessage` Stencil prop — API inconsistency (P2)

`[CODE]` `falcon-dropdown.component.ts:123` exposes `errorText`; the Stencil tags + `<falcon-input>`/`<falcon-textarea>` use `errorMessage`. A form mixing inputs and dropdowns must remember the dropdown's odd name. (The template bridges `errorText` → `error-message` attr at `.html:16,52`.)

**Recommended fix (P2):** add an `errorMessage` alias `@Input` on the wrapper, soft-deprecate `errorText` via JSDoc, migrate consumers over one milestone. `risk-class safe-local` (additive alias) / the eventual rename is `HIGH-RISK-QUEUE`.

### G3 — No multi-select mode (P1)

`[CODE]` Single-select only. Multi today is the separate `<falcon-angular-multi-select>` with its own chip mode + overflow pill. No shared panel implementation.

**Recommended fix (P2 → architectural):** explore unifying as `<falcon-angular-select mode="single|multi">`. Large blast radius — defer to a milestone refactor. `risk-class HIGH-RISK-QUEUE`.

### G4 — No async / lazy options loading (P1)

`[CODE]` Options must be in memory; `[options]` is a static array. No `loadOptions(query)` hook; large catalogues (10K+) load eagerly. `falcon-search` IS emitted by Stencil but not surfaced on the wrapper (see G7), so even server-side filter wiring is awkward.

**Recommended fix:** `@Input() loadOptions?: (query: string) => Observable<FalconDropdownOption[]>` + internal debounce + loading state token. `risk-class HIGH-RISK-QUEUE` (behavior change).

### G5 — No grouping / sectioned options (P2)

`[CODE]` `FalconDropdownOption` has no `group` field (`falcon-dropdown.types.ts:9-16`). Sectioned dropdowns (recent vs all) cannot be modeled. Add optional `group?: string` + render group headers. `risk-class safe-local`.

### G6 — Angular wrapper does not proxy Stencil methods (P1)

`[CODE]` Both tags expose `@Method()` `openPanel()`/`closePanel()`/`setFocus()`/`clear()` (`falcon-dropdown.tsx:115-137`), but the wrapper proxies none. Consumers must reach into `ViewChild` → the inner element. Same gap as `<falcon-input>`. `risk-class safe-local` (additive proxies).

### G7 — `falcon-search` event not re-emitted to Angular (P2)

`[CODE]` Stencil emits `falcon-search` with the query string (`falcon-dropdown.tsx:83-84`); the wrapper template binds only `falcon-change/clear/open/close/blur` (`.html:37-41,68-72`) — no `(searched)` `@Output`. Server-side-filtered dropdowns can't observe the query.

**Recommended fix:** `@Output() searched = new EventEmitter<string>()` + bind `(falcon-search)`. `risk-class safe-local`.

### G8 — `panelClass` / `optionClass` / `triggerClass` / `wrapperClass` / `labelClass` flow only on the Tailwind path (P2)

`[CODE]` Mapped to `*-extra-class` attrs only in the Tailwind branch (`.html:30-34`); the Shadow branch forwards none. Same parity break as `<falcon-input>`. `risk-class safe-local`.

### G9 — Type-ahead buffer fixed at 600ms (P3)

`[CODE]` `setTimeout(... 600)` hardcoded in both `.tsx` files (`falcon-dropdown.tsx:344`, `-tw:445`). No `typeAheadDelay` input. `risk-class safe-local`.

### G10 — No virtual scrolling for long option lists (P2)

`[CODE]` All options render as DOM nodes; panel `max-height:240px` scrolls but 5K+ options jank. No `virtualScroll` mode. Document a ~200-option soft-cap or add virtualization at the Stencil level. `risk-class HIGH-RISK-QUEUE`.

## Missing accessibility features

- **A1 (P2):** No live region announcing "N matches" when filtering — screen readers don't hear result-count changes.
- **A2 (P2):** `[CODE]` The trigger does NOT set `aria-activedescendant` — the active option is highlighted by CSS class only (`falcon-dropdown.tsx:402-421` has no `aria-activedescendant`). Contrast `<falcon-combobox>`, which DOES set it (`falcon-combobox.tsx:242`). Add `aria-activedescendant={activeOptionId}` on the trigger. `risk-class HIGH-RISK-QUEUE` (a11y semantics).

## Missing tests

- `[CODE]` No `.spec.ts` for the dropdown was located (Glob 2026-06-03 — neither `components/falcon-dropdown/*.spec.ts` nor a wrapper spec). **GAP — add coverage for: option-push race + value re-assert, CVA write/read, type-ahead, search filter, keyboard nav, outside-click close, Top-Layer acquire/release, `errorText` mapping.** `risk-class safe-local`.

## Missing Tailwind / token parity

- `[CODE]` **Slot parity break:** `<falcon-dropdown>` (Shadow) has `slot="options"`; `<falcon-dropdown-tw>` (Tailwind) does NOT (G1).
- `[CODE]` **Prop divergence:** `appendTo: 'body'|'inline'` exists ONLY on `<falcon-dropdown-tw>` (`-tw.tsx:118`), not on `<falcon-dropdown>` (Shadow is always inline). Documented, intentional, but a divergence to note.
- `[CODE]` **Variant/appearance mechanism divergence:** the Tailwind path encodes variant/appearance as Tailwind class overlays (`dropdown-tailwind-classes.ts:29-48`); the Shadow path relies on `:host([variant])`/`:host([appearance])` CSS. Both support all values — verify visual parity in the Studio.
- Both paths share `--falcon-dropdown-*` via the `:where(...)` selector (incl. `.falcon-overlay-container` for the portaled panel). **Token-level parity OK.**

## Performance risks

- `[CODE]` `pushOptions()` runs on every `ngOnChanges` AND every `[options]` setter call (`.ts:128-133,207-209`) — O(N) array assign + a value re-assert per push. For large arrays mutated frequently, consider an identity check. Minor.
- `[CODE]` The `-tw` twin adds `scroll`(capture)+`resize` window listeners while open and a per-frame rAF reposition (`-tw.tsx:209-254`) — fine for a single open panel; ensure they're torn down (they are, in `disconnectedCallback` + close branch).

## Visual / interaction risks

- `[CODE]` Outside-click uses `composedPath`/`isOutsideClick` and must account for the body-portaled panel (handled, `-tw.tsx:188-197`). The Shadow path's inline panel can be clipped by an `overflow:hidden` ancestor — prefer the default `-tw` path in drawers/dialogs.
- `[CODE]` Top-Layer acquire defers to rAF after `falcon-open` because `ensurePortaled` runs in `componentDidRender` (`.ts:330-347`) — a re-render race during cell remount can throw `showPopover()`, swallowed + retried on next reposition.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G1 | Tailwind `options` slot + per-option template directive | P1 | HIGH-RISK-QUEUE |
| G6 | Expose Stencil methods on wrapper | P1 | safe-local |
| G7 | `searched` `@Output` (bind `falcon-search`) | P2 | safe-local |
| G2 | `errorMessage` alias / soft-deprecate `errorText` | P2 | safe-local |
| A2 | `aria-activedescendant` on trigger | P2 | HIGH-RISK-QUEUE |
| G4 | Async option loading | P1 | HIGH-RISK-QUEUE |
| G5 | Grouped options | P2 | safe-local |
| G8 | Class-passthroughs on Shadow path | P2 | safe-local |
| G10 | Virtual scrolling | P2 | HIGH-RISK-QUEUE |
| G9 | `typeAheadDelay` input | P3 | safe-local |

## Concrete upgrade API

```ts
// Angular wrapper additions
@ContentChild(FalconDropdownOptionTemplateDirective) optionTemplate?: FalconDropdownOptionTemplateDirective;
@Input() loadOptions?: (query: string) => Observable<FalconDropdownOption[]>;
@Input() errorMessage?: string;     // alias of errorText
@Input() typeAheadDelay = 600;
@Input() virtualScroll = false;
@Output() searched = new EventEmitter<string>();
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

## Fix-shared-vs-per-page

All gaps belong in the **shared component** (`libs/falcon-ui-core`), not per-page. The wrapper is the single chokepoint that proves the dual-render pattern; per-page hacks (the ad-hoc language-picker `iconUrl` was the original such hack) re-implement the same plumbing and break the cross-framework SSOT promise.

## Workarounds (if upgrade blocked)

- For G1 today: use the raw `<falcon-dropdown>` tag (`useTailwind=false`) with `slot="options"` — works, more boilerplate, loses Tailwind override + body-portal.
- For G3 today: `<falcon-angular-multi-select>`.
- For G4 today: keep dropdowns < ~200 items; paginate manually.
- For G6 today: `ViewChild.nativeElement.querySelector('falcon-dropdown,falcon-dropdown-tw')` and call the method directly.
- For G7 today: drop to the raw tag and bind `(falcon-search)`.

---

## Wave findings — B04 deep-dive sweep (2026-06-03)

`[CODE]` Consumer count: **57** (`Grep "falcon-angular-dropdown"` across `apps/`, up from 13 at Wave 7). No deletion/promotion flag on the dropdown itself.

New/confirmed findings this pass (see `FINDINGS/B04.md` for the table rows):
1. **G1 correction** — prior dossier wrongly said the wrapper doesn't surface `slot="options"`; it does (Shadow branch). The genuine gaps are the Tailwind-path options slot + per-option template.
2. **A2 (medium, HIGH-RISK-QUEUE)** — dropdown trigger lacks `aria-activedescendant` (combobox has it). a11y semantics gap, not a quick fix.
3. **G2/errorText (low, safe-local)** — confirmed `errorText` wrapper input ≠ Stencil `errorMessage`; minor consumer-facing inconsistency.
4. **Dual definition of `FalconDropdownOption` (low, safe-local)** — declared in both `falcon-dropdown.component.ts:52-59` and `falcon-dropdown.types.ts:9-16` (identical). Drift risk if one changes.
5. **`#6b7280` literal fallback (info, safe-local)** — inline style on the `-tw` `iconLeft` span (`-tw.tsx:495`) ends in a hex literal fallback. Token-first chain so low impact.
6. **gate-12 portaled-panel scope (PASS)** — `dropdown.tokens.css` correctly includes `.falcon-overlay-container`; portaled panel inherits tokens. No regression.
7. **No wrapper/Stencil spec (low, safe-local)** — confirmed missing test coverage.
