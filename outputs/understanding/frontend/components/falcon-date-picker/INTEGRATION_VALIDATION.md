# falcon-date-picker — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — the component is presentational.** It owns no data and calls no endpoint. It receives an ISO date string in, emits an ISO date string out. The meaning of the date and any bound rules are owned by the host flow:
- `[MEMORY]` **Commerce** — when used as a service pricing-change effective date (apps/services tab), the date and its `min`/`disabledDates` policy are Commerce-owned.
- `[INFERRED]` Any other host flow owns its own date semantics.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | `[CODE]` `falcon-date-picker.tsx` — no HTTP. The host flow fetches whatever sets `min`/`max`/`disabledDates`, binds `[value]`, and on `(valueChange)` writes the ISO string into its own request payload. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` Out-of-bounds / excluded-date guard | the popup day cell | click a date below `min` / above `max` / in `disabledDates` | no error — the embedded `<falcon-calendar>` renders the cell `isDisabled`; the click is swallowed (`falcon-calendar.tsx:102-107`). |
| `[CODE]` Lenient typed-input parse | the text input | type a string | `parseInputValue` (`falcon-date-picker.tsx:168-179`) parses via `toDate`; un-parseable input is silently ignored (no error, value unchanged); empty input commits `null`. |
| `[CODE]` Display of error state | the field | host sets `[state]="'error'"` or `[errorMessage]` | the picker renders the error text (`role="alert"`, `falcon-date-picker.tsx:241-243`) + `aria-invalid="true"`. It does NOT compute the error — the host flow's `validations.ts` does. |
| `[INFERRED]` Required-at-submit | the bound form control | submit with `value === null` | not the picker's job — no CVA, so it cannot mark itself invalid. The host form raises "required". |
| `[MEMORY]` `InvalidEffectiveDateForPeriodicPricingChange` | effective date | backend renew-day clamp violated | server-side (Commerce). Pre-empt client-side by passing a matching `disabledDates` predicate. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` (inherited) | — | No PES key of its own. It inherits the gate of the *field* it renders: where the host flow's PES resolution denies edit, the parent binds `[disabled]="true"` or `[readonly]="true"`. |

## State / signal pattern
`[CODE]` `falcon-date-picker.component.ts`
- **No `ControlValueAccessor`** — `FalconAngularDatePickerComponent` does NOT implement CVA. `[(ngModel)]` and Reactive-Forms `formControlName` binding **do not work**. Bind `[value]` + `(valueChange)` two-way, or `(falconChange)` for the full `FalconCalendarChangeDetail`. This is `GAPS_AND_UPGRADES.md` G1 — the biggest gap. Workaround: wrap in a custom CVA directive, or `@ViewChild` the picker and bridge `valueChange` ↔ `FormControl`.
- `disabledDates` is pushed as a **JS property** via `syncProps()` (`falcon-date-picker.component.ts:88-95`) on `ngAfterViewInit` + every `ngOnChanges`. A string attribute silently fails.
- Stencil internal state: only `isOpen` and `resolvedId` are `@State()` (`falcon-date-picker.tsx:66-67`). `value` is `@Prop({ mutable:true })` — the component mutates it on select/typed-input then emits.
- Outputs: `falconChange`, `falconBlur`, `falconOpen`, `falconClose`, `valueChange` (`falcon-date-picker.component.ts:74-78`). `falconOpen`/`falconClose` carry a source/reason (`'input'|'icon'|'programmatic'` / `'select'|'blur'|'escape'|'outside-click'|'programmatic'`).
- 🟡 **Correction — `API.md` says "Methods: None proxied."** The *Stencil* component exposes `@Method()` `open()` and `close()` (`[CODE]` `falcon-date-picker.tsx:87-96`). They are missing from the **Angular wrapper** — `FalconAngularDatePickerComponent` does not surface them. So programmatic open/close exists at the Stencil layer; an app must call it on the native element ref. (`GAPS_AND_UPGRADES.md` G6 lists `openPicker`/`closePicker` as missing — accurate for the wrapper.)

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton — two variants:**
  - `<falcon-date-picker>` (Shadow DOM, `falcon-date-picker.tsx:30-34`). `[CODE]` `falcon-date-picker.tsx:3-4` header: "POSITIONING ESCAPE HATCH: popover is `position: absolute; top:100%` anchored to the wrap (CSS-only)." This variant does **not** portal — its popup is a CSS-anchored child.
  - `<falcon-date-picker-tw>` (Light DOM Tailwind variant). This is the **portal-to-body** variant — `[CODE]` `falcon-date-picker.component.ts:110-113` `handleOpen` comment: "stacking is handled by portal-to-body in the Stencil component (`<falcon-date-picker-tw>` moves its popover into the singleton `.falcon-overlay-container`)."
- **Angular wrapper** — `<falcon-angular-date-picker>` renders BOTH skeletons behind a `useTailwind` switch (default `true` → the `-tw` portal variant).
- Per `feedback_library_skeleton_app_api`: the wrapper does no data fetching.

## Integration gotchas
- `[CODE]` **The `-tw` variant uses the popover-portal mechanism.** Per `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`, `<falcon-date-picker-tw>` is one of the four `portalToOverlay` components. All five popover-portal root causes apply to it:
  - **RC#1/#2** — the popup must stay in `.falcon-overlay-container`, never under a transformed ancestor (e.g. `*falconDataTableShadowCol`'s `translateY(-50%)`), or `position:fixed` resolves against the ancestor and the calendar lands bottom-right. Fixed via `ensurePortaled`.
  - **RC#4 — focus-vs-click race.** `[CODE]` The Shadow `falcon-date-picker.tsx:125-128` `handleInputFocus` STILL calls `openInternal('input')`. Per the learnings, this exact line was the RC#4 bug and was **removed from `falcon-date-picker-tw.tsx`** (Phase 3, 2026-05-17). So: the **default `-tw` variant is fixed** (first click opens reliably); the **Shadow variant `useTailwind=false` still has the double-click bug**. Prefer `useTailwind=true` (default).
  - Debug with `window.__FALCON_DEBUG_POPOVER__ = true` — see `GAPS_AND_UPGRADES.md` "Diagnostics" section + `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`.
- `[CODE]` **`disabledDates` to the embedded calendar is bound by ref, not JSX.** `falcon-date-picker.tsx:159-166` `bindCalendarProps` — object/function props can't pass through JSX attribute syntax (they stringify), so the picker assigns `disabledDates` on the live `<falcon-calendar>` element via `ref`. Keep the predicate reference stable.
- `[CODE]` **Outside-click + Escape close** are handled internally — `@Listen('mousedown', {target:'document'})` (`falcon-date-picker.tsx:141-148`) closes on a click outside the host; `handleInputKeydown` closes on `Escape` (`falcon-date-picker.tsx:130-135`).
- `[CODE]` **Typed input is parsed leniently** — un-parseable text is silently dropped (`falcon-date-picker.tsx:174-178`). A strict-format flow must validate the emitted value.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-date-picker.tsx` + `[CODE]` `falcon-date-picker.component.ts` + `[VAULT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`. Two corrections to the original 6 dossier files documented above (Stencil `open`/`close` methods exist; Shadow variant still carries RC#4). Backend ownership is `[MEMORY]`/`[INFERRED]` — the component itself is verified presentational.
