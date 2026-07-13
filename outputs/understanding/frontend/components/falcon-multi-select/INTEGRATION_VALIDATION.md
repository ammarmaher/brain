# falcon-multi-select — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None of its own** — the component is presentational. Its *option list* is business reference data owned elsewhere:
- **Commerce / Templates** — `[CODE]` templates-list/details build the `options` array client-side from `row.sharedWith` / `tpl.sharedWith` (a list of user display-names) via `namesToOptions(...)`. The share audience itself is owned by the Templates backend; the chip-list never fetches it.
- **Identity** — `[INFERRED]` permission catalogue (the design-intent permission picker); role/permission data is owned by Identity.
- `[INFERRED]` Exact endpoints are not recorded; the owning module is whichever service the consuming page already queried.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `options` (option list) | `@Input() set options` → `pushOptions()` | (consumer's module) | `[CODE]` falcon-multi-select.component.ts:98-103 — the setter pushes eagerly onto the live Stencil element. |
| selected values | CVA write of `ReadonlyArray<string \| number>` into the parent form | (the flow's owning module) | `[CODE]` ts:210-216 — `handleChange` emits the array only. |

`[CODE]` ts:168-188 — `pushOptions()` waits for `customElements.whenDefined(tag)` **and** `componentOnReady()` before assigning `el.options` / `el.values`. This guards against the Stencil `@Prop` initializer running *after* the Angular binding and resetting both arrays to `[]` — the same race documented for `falcon-dropdown`. `ngAfterViewInit` + `ngOnChanges` both re-push (ts:157-163).

> `[INFERRED]` camelCase wire — the "Shared with" names ride camelCase JSON to the Templates endpoint per the platform-wide .NET default. The input element itself never calls HTTP.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-set | the bound field | submit with empty array while `required=true` | `[CODE]` ts:107 — `required` input; error rendering is via `state='error'` + `errorText`. |
| (no min/max V-rule) | — | — | `[CODE]` GAPS_AND_UPGRADES.md G8 — no `maxSelected`; min/max count must be a parent `Validators` rule. |

`[CODE]` ts:105 + falcon-multi-select.utils.ts:33-35 (`isFieldInError`) — `state: 'default'|'error'|'success'|'warning'` + `errorText` render validation feedback **inside** the component. `[CODE]` GAPS_AND_UPGRADES.md G2 — note the `errorText` (wrapper) vs `errorMessage` (Stencil prop / other controls) naming inconsistency.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | — | The multi-select has no PES key of its own. Where it renders a PES-gated field, the parent resolves PES and binds `readonly` / disables the form control. `[CODE]` ts:106 — `readonly` freezes the committed set. |
| Falcon-view gate (Templates) | edit the share audience | `[CODE]` templates-list.component.html:314 — `[readonly]="state.isFalconView()"` makes the chip-list non-editable for Falcon admins. |

The component inherits the gate of the **field** it renders.

## State / signal pattern
`[CODE]` falcon-multi-select.component.ts:142-143 — wrapper signals: `values` (`signal<ReadonlyArray<string|number>>`) and `disabled` (`signal<boolean>`).
- CVA `writeValue` sets `values` **and** calls `pushOptions()` so the Stencil `values` prop re-syncs (ts:194-198).
- `handleChange` (ts:210-216) reads the `{ value }` array detail, sets the signal, fires `onChange` + `valuesChange`. `handleClear` (ts:218-221) is treated identically (CVA-friendly).
- **Top-Layer popover (Phase C / Wave 6, 2026-05-21):** `handleOpen` schedules a RAF then promotes the just-portaled `-tw` panel into the native Top Layer via `showPopover()` + registers it with `FalconStackingService`; `handleClose`/`ngOnDestroy` release it — `[CODE]` ts:223-238, 384-434. Additive over the body-portal fallback.
- **chip-list state machine** (ts:268-382): `chipListExpanded` / `chipListPopoverPos` signals; `openChipListPopover` saves focus, computes RTL-safe `inset-inline-end`, opens, then RAF-defers `applyViewportFlip` (flips above the trigger if it would overflow the viewport) + `focusPopover`. `document:mousedown` (outside-click) + `document:keydown.escape` close it and restore focus. `markForCheck()`/`detectChanges()` guard against detached OnPush views inside data-table cells (ts:258, 315, 337).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-multi-select>` (Shadow, `shadow:true`, **inline** panel) and `<falcon-multi-select-tw>` (Light DOM, `shadow:false`, **portaled** panel). Pure presentational; emit `falcon-change`/`add`/`remove`/`search`/`open`/`close`/`clear`/`blur`.
- **Angular wrapper** — `<falcon-angular-multi-select>`: CVA + tag-switcher + `pushOptions()` race-guard + Top-Layer manager + the chip-list display mode. `ngOnInit` calls `defineFalconTwComponent('falcon-multi-select')`.
- **Portal divergence:** only the `-tw` twin portals (`appendTo='body'` default → `.falcon-overlay-container`, with scroll/resize reposition listeners — falcon-multi-select-tw.tsx:131,201-239). The Shadow tag renders its panel inline inside the control (`{this.open && …}` — falcon-multi-select.tsx:510). DOM order in the overlay container = stack order; no per-popover z-index counters.
- Per `feedback_library_skeleton_app_api` — options are fetched by the app/state layer; the library never calls HTTP.

## Integration gotchas
- `[CODE]` ts:168-188 — the `pushOptions()` race-guard is mandatory: binding `options` via attribute instead of the property setter would let the Stencil initializer clobber the array. Always bind `[options]`.
- `[CODE]` **chip-list mode never renders the Stencil tag** — when `displayMode="chip-list"` the wrapper renders a pure-Angular chip strip + dialog (html:12-97); `multiSelectEl` is undefined and `pushOptions()` is a no-op. CVA still works (the values signal is local) but the picker behaviors (search/select-all/open) are bypassed.
- `[CODE]` **Both render paths emit `falcon-change` with an array `{ value }` detail.** `add`/`remove`/`search`/`blur` are NOT surfaced as Angular `@Output`s (GAP G6/G10).
- `[CODE]` **Slot divergence** — `<falcon-multi-select>` supports `slot="options"` (custom rows); `<falcon-multi-select-tw>` does NOT — the Tailwind/Light path always renders built-in rows (GAP G11). Both support `slot="icon-left"`.
- `[CODE]` GAPS_AND_UPGRADES.md G7 — Stencil exposes `@Method()`s (`openPanel`/`closePanel`/`setFocus`/`clear`) but the wrapper proxies **none** — imperative control requires reaching `multiSelectEl`.
- `[CODE]` ts:194-198 — `writeValue` re-pushes BOTH options and values on every CVA write; for very frequent updates this double-push should be batched (perf note).
- `[CODE]` GAPS_AND_UPGRADES.md G4 — no virtual scrolling; render cost grows past ~200 options.
- `[CODE]` ts:130 — `iconLeft` input exists (unified icon-slot API); `iconRight` is intentionally skipped (the chevron occupies it).
- `[CODE]` **Never bind both `[values]` and `[(ngModel)]`** — `[values]` is a raw Stencil-prop passthrough that races CVA.

## What it CAN do (integration)
- `[CODE]` ts:55 — Participate in Reactive Forms / `ngModel` via array-valued CVA.
- `[CODE]` ts:105,108 — Render its own validation feedback (`state` + `errorText`) and a clear-all affordance.
- `[CODE]` ts:109 + tsx:303 — Offer in-panel case-insensitive substring search over the option list.
- `[CODE]` ts:116 — Offer disabled-preserving tri-state Select all.
- `[CODE]` html:12-97 — Render a self-contained, RTL-safe, viewport-flipping chip-list dialog with full focus management.

## What it CANNOT do (integration)
- `[CODE]` ts — It cannot fetch its own data — no service injection.
- `[CODE]` GAPS_AND_UPGRADES.md G3 — It cannot lazy/async-load options.
- `[CODE]` GAPS_AND_UPGRADES.md G6/G10 — It cannot surface `search`/`add`/`remove`/single-chip-remove events to Angular consumers.
- `[CODE]` GAPS_AND_UPGRADES.md G7 — It cannot be controlled imperatively from Angular (no proxied methods).
- `[CODE]` GAPS_AND_UPGRADES.md G8 — It cannot enforce a selection count limit.

## Verification
🟢 code-verified against the wrapper + both Stencil tags + utils (read 2026-06-03), with line refs refreshed to the current file. Portal/Top-Layer + chip-list state machine + slot divergence + push-options race-guard all 🟢 confirmed. Backend endpoints 🟡 `[INFERRED]` (not recorded in dossiers); Templates "Shared with" client-side option-building 🟢 confirmed in the consumer files.
