# falcon-search-input — GAPS AND UPGRADES

> Refreshed 2026-06-03 against live source. Prior "verify Stencil"/"verify A11y" items are now resolved against code; new findings added.

## Missing capabilities (active source verified)

### G1 — No CVA support (P2)

`[CODE]` falcon-search-input.component.ts:31-37 — no `NG_VALUE_ACCESSOR` provider. Bind via `[value]` + `(falconSearch)` only. Some consumers want `formControlName` for consistency.

**Decision:** either add CVA (the `value` getter/setter is already signal-backed — bridging to `ControlValueAccessor` is mechanical) OR document forever-event-only. Recommendation leans event-only because a search term is transient (see BUSINESS.md), but a CVA addition would be additive + non-breaking.

### G2 — No label / helper / error / state (P2, by design)

`[CODE]` falcon-search-input.tsx:114-127 forwards no `state`, and the wrapper exposes no `label`/`helperText`/`errorMessage`/`required`. For "search with validation" (e.g. SKU pattern that must match a regex) there is no error display. Deliberate — but worth documenting that validated-search is out of scope (use `<falcon-angular-input>` if a labelled error is required).

### G3 — No Angular method proxies (P2)

`[CODE]` Both Stencil tags expose `@Method async setFocus()` (falcon-search-input.tsx:77-80 / falcon-search-input-tw.tsx:63-66) but the wrapper proxies neither `setFocus()` nor `clear()`. Consumers must reach `ViewChild.nativeElement`.

**Recommended fix:** add `@ViewChild('el', { read: ElementRef })` + `async setFocus()` forwarding to the inner Stencil element. (Same pattern as the recommended falcon-input fix.)

### G4 — `clearAriaLabel` NOT passed on the Tailwind (default) render path (P1 — a11y parity)

`[CODE]` Shadow path sets `clearAriaLabel="Clear search"` on the inner `<falcon-input>` (falcon-search-input.tsx:123); the Tailwind path (`<falcon-search-input-tw>`, the **default**) omits it (falcon-search-input-tw.tsx:99-108), so the clear-X falls back to the base input's `"Clear input"` label. The default render path therefore announces a generic, non-search label.

**Recommended fix (P1):** add `clearAriaLabel="Clear search"` to the inner `<falcon-input-tw>` in the `-tw` twin so both paths announce identically. (Render-path/a11y change → HIGH-RISK-QUEUE.)

### G5 — No `aria-busy` on the host when loading (P2 — a11y)

`[CODE]` The loading spinner span has `role="status"` + `aria-label="Loading"` (falcon-search-input.tsx:128-135 / falcon-search-input-tw.tsx:110-116) but neither Stencil host nor the inner input gets `aria-busy="true"`. A screen-reader hears "Loading" once (status region) but the field is not flagged busy.

**Recommended fix:** set `aria-busy={this.loading}` on the inner input or the root, on both paths.

### G6 — Spinner colour references a non-existent palette family (P2 — token correctness)

`[CODE]` `--falcon-search-input-spinner-color: var(--color-falcon-primary-500, #3b82f6)` (search-input.tokens.css:20) + the helper's mirrored fallback (search-input-tailwind-classes.ts:15). Falcon has **no `primary` palette** → the spinner always uses the literal blue `#3b82f6`, off-brand.

**Recommended fix (safe-local):** repoint to `--color-falcon-teal-500` (brand) with a teal hex fallback. No structural change.

### G7 — No keyboard focus-shortcut (P3)

Many products focus search on `/` or `⌘K`. No `@Input() focusShortcut?: string`. Consumers add a global keydown listener themselves.

### G8 — `falconSearchClear` payload `previousValue` is an unusual shape (P3 — doc)

`[CODE]` falcon-search-input.tsx:104 emits `{ previousValue }`; the common pattern is a `void` clear event. Documented now (USAGE/API) — it carries the term that was cleared so analytics can log "user cleared 'foo'". Keep, but it is a deliberate non-standard shape.

### G9 — Spinner can overlap the clear-X (P3 — visual)

`[CODE]` Both the clear-X (inner input, trailing) and the loading spinner (`end-[…]`, trailing) sit on the trailing edge. When `loading=true` AND the value is non-empty, both occupy the same region. No collision-avoidance logic exists. Verify positioning; consider hiding the clear-X while loading.

## Missing accessibility features (resolved from prior "verify" stubs)

- **A1 (P2):** no `aria-busy` on the host (= G5).
- **A2 (P1):** clear-X label diverges on the default Tailwind path (= G4).
- **A3 (P3):** no `role="search"` landmark on the host — the inner `type="search"` conveys the searchbox role, so this is optional, but a wrapping `role="search"` would help landmark navigation.

## Missing tests

- `[CODE]` Grep 2026-06-03 → **no `*search-input*.spec.ts` / `.e2e.ts`** for either Stencil tag or the wrapper. A spec should cover: debounce timing (one `falconSearch` per pause), clear emits BOTH events, `@Watch('value')` external-set sync, `disconnectedCallback` clears the timer (leak), and (would catch G4) the `clearAriaLabel` parity. **GAP — add specs.**

## Missing Tailwind / token parity

- `[CODE]` Shadow vs `-tw` are otherwise prop/event-parallel (same props, same `falconSearch`/`falconSearchClear` events, same debounce/clear logic). The **only** divergence is the missing `clearAriaLabel` on `-tw` (G4) → not a styling parity break but an a11y one.
- Both paths read the same spinner tokens (`:where()` selector) → token parity OK.

## Performance risks

- `[CODE]` Debounce uses a single `setTimeout` cleared on every keystroke + on `disconnectedCallback` (falcon-search-input.tsx:88-94,70-74) → no leak, no stacked timers. **No real risk.**
- `OnPush` + signal-backed value on the wrapper → efficient.

## Visual / interaction risks

- Spinner + clear-X overlap when both visible (= G9).
- Off-brand blue spinner by default (= G6).
- Two render paths could drift if a search-only feature ships to one tag only — guard via the (missing) parity spec.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G4 | `clearAriaLabel` parity on Tailwind path | P1 |
| G5 | `aria-busy` on host when loading | P2 |
| G6 | Spinner colour → brand teal (drop `primary` miss) | P2 |
| G1 | Optional CVA support | P2 |
| G3 | `setFocus()` / `clear()` Angular proxies | P2 |
| G7 | Focus shortcut | P3 |
| G9 | Spinner/clear-X collision avoidance | P3 |

## Concrete upgrade API

```ts
// Angular wrapper additions (additive, non-breaking)
@Output() falconFocus?: EventEmitter<void>;
async setFocus(): Promise<void>;   // proxy to inner Stencil setFocus()
async clear(): Promise<void>;
@Input() focusShortcut?: string;   // e.g. '/' or 'cmd+k'
// + implements ControlValueAccessor (G1, optional)
```

```tsx
// <falcon-search-input-tw> — add to inner <falcon-input-tw>:
clearAriaLabel="Clear search"      // G4
aria-busy={this.loading}           // G5
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component**, not per-page. search-input is the single chokepoint that proves the §5.12.2 composed-input rule; per-page hacks would break the cross-framework SSOT.

## Workarounds (if upgrade blocked)

- For G1: subscribe to `(falconSearch)` and `setValue()` the form control.
- For G3: `viewChild` → `nativeElement.setFocus()`.
- For G4 today: use `useTailwind=false` (Shadow) where the correct clear label is set, OR accept the generic label until the twin is patched.
- For G7: global keydown listener in the consumer.

## Wave findings (2026-06-03 sweep)

**Consumer count: 0** (`[CODE]` grep `falcon-angular-search-input` across `apps/` + `libs/falcon/`). Unchanged from Wave 7 (2026-05-17).

**Gap: zero adoption** — built, exported, showcase-ready, but no feature uses it. Either promote in an upcoming search/filter feature (recommended) or formally retire if redundant with `<falcon-angular-input variant="search">`. Priority: P2 — usability watch, not a blocker.

**New this sweep:** G4 (clearAriaLabel Tailwind-omission, HIGH-RISK-QUEUE), G5 (no aria-busy), G6 (`primary`-palette spinner miss), G9 (spinner/clear overlap). Prior TOKENS/USAGE drift (non-existent `--falcon-search-input-icon-color`/`-bg`, inflated 4-category claim) corrected this pass.
