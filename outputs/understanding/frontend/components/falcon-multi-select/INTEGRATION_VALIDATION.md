# falcon-multi-select — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None of its own** — the component is presentational. Its *option list* is business reference data owned elsewhere:
- **Identity** — `[INFERRED]` permission catalogue (the permission-picker use); role/permission data is owned by the Identity service.
- **Commerce** — `[INFERRED]` category / region options used in filter panels.
- `[INFERRED]` Exact endpoints are not recorded in the dossiers; the owning module is whichever service the consuming wizard/filter queries.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `options` (option list) | `@Input() set options` → `pushOptions()` | (consumer's module) | `[CODE] falcon-multi-select.component.ts:73-78` — the setter pushes eagerly onto the live Stencil element. |
| selected values | CVA write of `ReadonlyArray<string \| number>` into the parent form | (the flow's owning module) | `[CODE] falcon-multi-select.component.ts:166-170` — component emits the array only. |

`[CODE] falcon-multi-select.component.ts:140-160` — `pushOptions()` waits for `customElements.whenDefined` **and** `componentOnReady` before assigning `el.options` / `el.values`. This guards against the Stencil `@Prop` initializer running *after* the Angular binding and resetting both arrays to `[]` — the same race documented for `falcon-dropdown`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-set | the bound field | submit with empty array while `required=true` | `[CODE] falcon-multi-select.component.ts:83` — `required` input; actual error rendering is via `state='error'` + `errorText`. |
| (no min/max V-rule) | — | — | `[CODE] GAPS_AND_UPGRADES.md` G8 — no `maxSelected` enforcement; min/max count must be a parent `Validators` rule. |

`[CODE] falcon-multi-select.component.ts:80` — `state: 'default' | 'error' | 'success' | 'warning'` + `errorText` render validation feedback **inside** the component (unlike `falcon-combobox`, which lacks these). `[CODE] GAPS_AND_UPGRADES.md` G2 — note the `errorText` vs `errorMessage` naming inconsistency with other controls.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | — | The multi-select has no PES key of its own. Where it renders a PES-gated field, the parent resolves PES and binds `readonly` / disables the form control. `[CODE] falcon-multi-select.component.ts:81` — `readonly` freezes the committed set. |

## State / signal pattern
`[CODE] falcon-multi-select.component.ts:114-115` — wrapper signals: `values` (`signal<ReadonlyArray<string|number>>`) and `disabled` (`signal<boolean>`). CVA: `writeValue` sets `values` **and** calls `pushOptions()` so the Stencil `values` prop re-syncs (mirrors options handling). `[CODE] falcon-multi-select.component.ts:182-188` — `handleChange` reads the `{ value }` array detail, sets the signal, fires `onChange` + `valuesChange`. `handleClear` is treated identically to `handleChange` (CVA-friendly).
`[CODE] falcon-multi-select.component.ts:129-135` — `ngAfterViewInit` and `ngOnChanges` both re-`pushOptions()` so the Stencil element stays in sync across parent updates.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE] src/components/falcon-multi-select/falcon-multi-select.tsx` `<falcon-multi-select>` (Shadow) and `<falcon-multi-select-tw>` (Light DOM, Tailwind). Pure presentational.
- **Angular wrapper** — `[CODE] falcon-multi-select.component.ts` `<falcon-angular-multi-select>`: CVA + tag-switcher + `pushOptions()` race-guard. `ngOnInit` calls `defineFalconTwComponent('falcon-multi-select')`.
- `[CODE] falcon-multi-select.component.ts:196-200` — `handleOpen` notes the Wave 2026-05-15 portal-popovers change: the Light-DOM panel portals into `.falcon-overlay-container`; DOM order = stack order, so no per-popover z-index allocation.
- Per `feedback_library_skeleton_app_api` — options are fetched by the app/state layer; the library never calls HTTP.

## Integration gotchas
- `[CODE] falcon-multi-select.component.ts:181-188` — **Both Shadow and Light render paths emit `falcon-change` with an array `{ value }` detail.** The Stencil `@Event` set is `falcon-change` / `falcon-add` / `falcon-remove` / `falcon-search` / `falcon-open` / `falcon-close` / `falcon-clear` / `falcon-blur` (`[CODE] falcon-multi-select.tsx:84-98`) — `add`/`remove`/`search`/`blur` are **NOT surfaced** as Angular `@Output`s (`GAPS_AND_UPGRADES.md` G6/G10).
- `[CODE] falcon-multi-select.component.ts:140-160` — the `pushOptions()` race-guard is mandatory: binding `options` via attribute instead of the property setter would let the Stencil initializer clobber the array. Always bind `[options]`.
- `[CODE] falcon-multi-select.component.ts:166-170` — `writeValue` re-pushes BOTH options and values on every CVA write; `GAPS_AND_UPGRADES.md` performance note — for very frequent updates this double-push should be batched.
- `[CODE] GAPS_AND_UPGRADES.md` G4 — no virtual scrolling; render cost grows past ~200 options.
- `[CODE] GAPS_AND_UPGRADES.md` G7 — Stencil exposes `@Method()`s (`falcon-multi-select.tsx:132-150`) but the wrapper proxies **none** — imperative open/close/focus/clear requires reaching the inner element via the `multiSelectEl` ViewChild.
- `[CODE] falcon-multi-select.component.ts:102` — a 2026-05-17 `iconLeft` input exists (unified icon-slot API); `iconRight` is intentionally skipped (the chevron occupies it).

## What it CAN do (integration)
- `[CODE] falcon-multi-select.component.ts` — Participate in Reactive Forms / `ngModel` via array-valued CVA.
- `[CODE] falcon-multi-select.component.ts:80,84` — Render its own validation feedback (`state` + `errorText`) and a clear-all affordance.
- `[CODE] falcon-multi-select.component.ts:84` — Offer in-panel search (`searchable`) over the option list.
- `[CODE] falcon-multi-select.component.ts:91` — Offer tri-state Select all.

## What it CANNOT do (integration)
- `[CODE] falcon-multi-select.component.ts` — It cannot fetch its own data — no service injection.
- `[CODE] GAPS_AND_UPGRADES.md` G3 — It cannot lazy/async-load options — full list must be in memory.
- `[CODE] GAPS_AND_UPGRADES.md` G6/G10 — It cannot surface `search` / `add` / `remove` / single-chip-remove events to Angular consumers.
- `[CODE] GAPS_AND_UPGRADES.md` G7 — It cannot be controlled imperatively (no proxied methods).
- `[CODE] GAPS_AND_UPGRADES.md` G8 — It cannot enforce a selection count limit.

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` G3 — Async / lazy options for large catalogues.
- `[CODE] GAPS_AND_UPGRADES.md` G6/G7/G10 — Surface `searched` / `chipRemoved` outputs and proxy `openPanel`/`closePanel`/`setFocus`/`clear`.
- `[CODE] GAPS_AND_UPGRADES.md` G8 — `maxSelected` + `chipMode` inputs.
- `[CODE] GAPS_AND_UPGRADES.md` G2 — alias `errorText` → `errorMessage` for cross-control consistency.
- `[CODE] GAPS_AND_UPGRADES.md` G4 — virtual scrolling.

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts` + `[CODE] src/components/falcon-multi-select/falcon-multi-select.{tsx,types.ts}` + `[CODE] GAPS_AND_UPGRADES.md`. Stencil `@Event` / `@Method` names ✅ VERIFIED via grep of `falcon-multi-select.tsx`. Used in 3 production consumers; backend endpoints are [INFERRED] (not recorded in dossiers).
