# falcon-multi-select — GAPS AND UPGRADES

> This is where the AUDIT findings for this component live in prose. Severity per SWEEP-SPEC §5. Verified against live code 2026-06-03.

## Missing capabilities (active source verified)

### G1 — No per-option / per-chip ng-template (P1)
`[CODE]` The wrapper exposes no `@ContentChild` option/chip template, and the option type carries only `value`/`label`/`disabled`. Options can show label text only.
**Fix:** add `iconUrl` to the option type AND introduce `FalconMultiSelectOptionTemplateDirective` + `FalconMultiSelectChipTemplateDirective`. `safe-local` (additive).

### G2 — `errorText` vs `errorMessage` naming inconsistency (P2)
`[CODE]` ts:93 — the wrapper input is `errorText` (forwarded to Stencil as `error-message`), whereas falcon-input/falcon-dropdown wrappers use `errorMessage`. Cross-control inconsistency.
**Fix:** alias `errorMessage` → `errorText` and soft-deprecate. `safe-local`.

### G3 — No async / lazy options (P1)
`[CODE]` The full option list must be in memory; the setter pushes the whole array. A catalogue of thousands renders up-front.
**Fix:** add an async/observable options path + windowing. `safe-local` (additive) but non-trivial.

### G4 — No virtual scrolling (P2)
`[CODE]` falcon-multi-select.tsx:566-636 — the listbox `.map()`s every filtered option into the DOM. Render perf degrades past ~200 options.
**Fix:** virtual scroll in the listbox. `safe-local`.

### G5 — No grouped options (P2)
`[CODE]` falcon-multi-select.types.ts:5-9 — `FalconMultiSelectOption` has no `group?: string`. Cannot section a permission picker.
**Fix:** add `group?` + a group-header render branch. `safe-local`.

### G6 — `falcon-search` / `falcon-add` / `falcon-remove` not surfaced on the wrapper (P2)
`[CODE]` ts:128-132 vs falcon-multi-select.tsx:86-91 — the Stencil tags emit `falcon-add`/`falcon-remove`/`falcon-search` but the wrapper binds only `falcon-change`/`-clear`/`-open`/`-close`/`-blur`. No `(searched)`/`(added)`/`(removed)` Angular outputs.
**Fix:** add the missing `@Output`s + bind them. `safe-local`.

### G7 — Stencil methods not proxied on the Angular wrapper (P1)
`[CODE]` Both tags expose `@Method() openPanel/closePanel/setFocus/clear` (falcon-multi-select.tsx:131-153) but the wrapper proxies NONE. Imperative control requires reaching `multiSelectEl.nativeElement`.
**Fix:** add async proxies that await the inner element's methods. `safe-local` (additive).

### G8 — No `maxSelected` count enforcement (P2)
`[CODE]` No `maxSelected`/`chipMode` on the wrapper or Stencil tags. Quota rules ("at most N") must be enforced externally.
**Fix:** add `@Input() maxSelected?: number` (block toggles past the cap) + `@Input() chipMode: 'inline'|'overflow'`. `safe-local`.

### G9 — No `iconUrl` parity with dropdown options (P2)
`[CODE]` Dropdown options carry `iconUrl`; `FalconMultiSelectOption` does not. Blocks consistent flag/avatar visuals.
**Fix:** add `iconUrl?` + render it in the chip + option row. `safe-local`.

### G10 — No single-chip `(chipRemoved)` event (P3)
`[CODE]` `falcon-remove` fires per-chip removal but is not surfaced. Consumers cannot distinguish a single-chip remove from a full-set change.
**Fix:** surface `@Output() chipRemoved`. `safe-local`.

### G11 — Tailwind/Light path has NO `slot="options"` (P1) — NEW, verified 2026-06-03
`[CODE]` falcon-multi-select.tsx:575 declares `<slot name="options">`; `falcon-multi-select-tw.tsx` has NO equivalent — its listbox (lines 652-703) always renders built-in rows. The wrapper's Tailwind branch only projects `<ng-content select="[slot=icon-left]">` (html:133), while the Shadow branch also projects `slot="options"` (html:165). So custom option markup is **Shadow-only**, breaking dual-render parity — and the default render path (`useTailwind=true`) is the one without it.
**Fix:** add `<slot name="options">` to `<falcon-multi-select-tw>` + project it in the wrapper's Tailwind branch. `HIGH-RISK-QUEUE` (render-path/parity behavior change).

### G12 — chip-list popover hardcodes Tailwind arbitrary values, not tokens (P2) — NEW, verified 2026-06-03
`[CODE]` html:20-91 — the chip-list strip + dialog use literal arbitrary utilities (`min-w-[260px]`, `max-w-[320px]`, `rounded-[12px]`, `shadow-[0_12px_32px_rgba(0,0,0,0.14)]`, `bg-falcon-teal-700`, `max-w-[120px]`, `h-4`, dark variants) NOT driven by `--falcon-multi-select-*`. A Studio token mutation does not restyle the chip-list popover; the selection path does follow tokens.
**Fix:** mint `--falcon-multi-select-chiplist-*` tokens (popover min/max-width, radius, shadow, name-circle bg) and read them via arbitrary utilities. `safe-local`.

### G13 — Shadow tag has no `appendTo` / never portals (P3) — NEW, verified 2026-06-03
`[CODE]` `appendTo: 'body'|'inline'` exists only on `<falcon-multi-select-tw>` (falcon-multi-select-tw.tsx:131). The Shadow tag always renders the panel inline (falcon-multi-select.tsx:510). Switching to `useTailwind=false` silently changes panel placement (inline, can be clipped by overflow parents) — a behavioral asymmetry.
**Fix:** document, or add a portal path to the Shadow tag. `safe-local` (doc) / `HIGH-RISK-QUEUE` (if behavior changed).

## Missing accessibility features
- **A1 (P2):** no live region announcing selection-count changes ("3 of 7 selected"). Add `aria-live="polite"`.
- **A2 (P3):** chips' remove buttons are `tabindex={-1}` (mouse-only). Keyboard users cannot remove a single chip from the chip row — they Backspace via the search field instead (verify). Consider an opt-in keyboard-accessible chip remove.
- **A3 (P3):** the option-row check is a decorative `<span>`, not a native control; selection state is conveyed via `role="option"` + `aria-selected` (correct), but there is no individual `aria-checkbox` semantics — acceptable for a listbox-multiselect.

## Missing tests
- `[CODE]` grep 2026-06-03 → **0** `*multi-select*.spec.ts` / `.e2e.ts` for either Stencil tag OR the Angular wrapper, despite the push-options race, tri-state select-all logic, chip-list dialog/viewport-flip, and CVA cycle. **GAP G14 — add a wrapper spec (CVA write/read, displayMode switch, chip-list open/flip/focus-restore, showMoreClick) + a Stencil spec (toggle/select-all/filter/clamp).** `safe-local`.

## Missing Tailwind / token parity
- Selection path: both tags read `--falcon-multi-select-*` via the `:where()` chain (incl. `.falcon-overlay-container` for the portaled panel) — **parity OK**.
- chip-list path: literal-driven, no token parity (G12).
- Slot parity broken (G11).

## Performance risks
- `writeValue` double-pushes options + values (ts:194-198) — batch for high-frequency updates.
- No virtualization for large lists (G4).
- chip-list adds `document:mousedown` + `document:keydown` listeners while expanded (ts:370-382) — released on close; fine.

## Visual / interaction risks
- Two selection render paths (Shadow inline vs `-tw` portaled) can drift — guard via Studio parity tests + the slot fix (G11/G13).
- chip-list viewport-flip measures `offsetHeight` post-RAF — correct, but a very tall names list inside a short viewport could still clip; `max-h-[240px]` scroll caps it (html:82).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G11 | Tailwind path `slot="options"` parity | P1 | HIGH-RISK-QUEUE |
| G7 | Method proxies on wrapper | P1 | safe-local |
| G1 | Per-option + per-chip templates | P1 | safe-local |
| G3 | Async / lazy options | P1 | safe-local |
| G6 | Surface `searched`/`added`/`removed` outputs | P2 | safe-local |
| G8 | `maxSelected` + `chipMode` | P2 | safe-local |
| G12 | chip-list token-ize | P2 | safe-local |
| G9 | `iconUrl` parity | P2 | safe-local |
| G2 | `errorMessage` alias | P2 | safe-local |
| G5 | Grouped options | P2 | safe-local |
| G4 | Virtual scroll | P2 | safe-local |
| G14 | Spec coverage | P2 | safe-local |
| G13 | Shadow portal / doc asymmetry | P3 | safe-local/HRQ |
| G10 | `chipRemoved` event | P3 | safe-local |

## Concrete upgrade API

```ts
// Wrapper additions
@ContentChild(FalconMultiSelectOptionTemplateDirective) optionTpl?;
@ContentChild(FalconMultiSelectChipTemplateDirective) chipTpl?;
@Input() maxSelected?: number;
@Input() chipMode: 'inline' | 'overflow' = 'overflow';
@Input() errorMessage?: string;       // alias of errorText
@Output() searched = new EventEmitter<string>();
@Output() added = new EventEmitter<string | number>();
@Output() removed = new EventEmitter<string | number>();
async openPanel(): Promise<void>;
async closePanel(): Promise<void>;
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

```tsx
// <falcon-multi-select-tw> additions
<slot name="options"> … </slot>   // parity with Shadow
```

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component**, not per-page. The wrapper is the chokepoint that proves the dual-render pattern; per-page hacks would break the cross-framework SSOT.

## Workarounds (if upgrade blocked)
- G11/G1/G9: pre-format `label` text (ugly) or use `useTailwind=false` + `slot="options"` for custom rows.
- G7: query `multiSelectEl.nativeElement` and call the Stencil method.
- G8: cap the `valuesChange` array length externally before assigning.
- G3: lazy-load via a parent observable that re-feeds `[options]`.

## Wave findings (2026-06-03 deep-dive sweep, batch B05)

**Consumer count: 4** (`[CODE]` grep `<falcon-angular-multi-select` across `apps/` + `libs/falcon/`) — all `displayMode="chip-list"`. Corrected from the stale Wave-7 "3" (which were the legacy component + playground; both excluded).

New verified gaps this sweep: **G11** (Tailwind path missing `slot="options"` — HIGH-RISK-QUEUE), **G12** (chip-list literal-bypass), **G13** (Shadow-no-portal asymmetry), **G14** (zero specs). No deletion/promotion flag — component is ACTIVE, selection path feature-complete but production-exercised only via chip-list.
