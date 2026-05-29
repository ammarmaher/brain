# falcon-calendar (LEGACY FACADE) — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> ⚠ **LEGACY / ORPHAN component.** Documented for deletion-review traceability.

## 🟡 Material correction to the existing 6 dossier files
The original 6 dossiers (OVERVIEW/API/USAGE/etc.) describe `<falcon-calendar>` as a **Wave-3 façade** that internally delegates to `<falcon-angular-date-picker>` with five no-op effective-date inputs and immediate-commit UX.

`[CODE]` The only `<falcon-calendar>` source that exists in the tree is `Falcon/deprecated-falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-calendar/falcon-calendar.component.ts`. That file is **the pre-façade PrimeNG component** — it imports `DatePicker` from `primeng/datepicker` (`falcon-calendar.component.ts:17`), implements the full **Set/Cancel overlay** (`falcon-calendar.component.ts:142-199`), and applies `FalconEffectiveDateDirective` for real (not as a no-op). It is NOT a façade and does not delegate to `<falcon-angular-date-picker>`.

`[CODE]` The **active** `falcon-web-platform-ui` repo contains **no `<falcon-calendar>` source at all** (Glob over `Falcon/falcon-web-platform-ui/` returns nothing; only `deprecated-falcon-web-platform-ui` has it).

**Conclusion:** either the Wave-3 façade was never committed, or it was deleted, leaving only the deprecated original. Per `USAGE.md` Wave 7 sweep — **0 consumers, 0 source files in the active repo**. The component is an **ORPHAN**. This dossier does not back-edit the old 6 files; the correction is recorded here.

## Owning backend module(s)
**None — presentational.** It owned no data. As an effective-date field it surfaced **Commerce**-owned pricing rules (via `FalconEffectiveDateDirective`), but never called an endpoint itself.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | `[CODE]` No HTTP in `falcon-calendar.component.ts`. The host form owned all wiring; this component only emitted a `Date`. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` Effective-date validation | the date field | `useEffectiveDateValidation=true` + `status`/`pricingType`/`renewDate` set | In the **original** PrimeNG component these drove `FalconEffectiveDateDirective` (`falcon-calendar.component.ts:18,30-31`). In the **dossier-described façade** they are **no-ops** — a builder gets no validation. |
| `[MEMORY]` `InvalidEffectiveDateForPeriodicPricingChange` | effective date | backend renew-day clamp violated | server-side (Commerce). The modern replacement expresses this in the host flow's `validations.ts`, not the date component. |
| `[CODE]` Commit guard | the date field | outside-click while popup open | `hideOverlay` is intercepted (`falcon-calendar.component.ts:92-106`) so an uncommitted draft cannot leak into the form value — it reverts to snapshot. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` (inherited) | — | No PES key of its own. `[disabled]` (`falcon-calendar.component.ts:53,129-131`) is bound by the host flow's PES resolution. |

## State / signal pattern
`[CODE]` `falcon-calendar.component.ts` — **pre-signals, pre-standalone-modern** pattern:
- Implements `ControlValueAccessor` (`NG_VALUE_ACCESSOR`, `falcon-calendar.component.ts:35-41`) — so it IS Reactive-Forms / `[(ngModel)]` capable, binding `Date | null`.
- Three plain fields, not signals: `draftValue` (popup display), `committedValue` (form value), `snapshotValue` (restore-on-cancel) — `falcon-calendar.component.ts:70-82`.
- `writeValue` clones the `Date` into both committed + draft (`falcon-calendar.component.ts:116-119`).
- `ngAfterViewInit` monkey-patches PrimeNG's `hideOverlay` to block auto-close (`falcon-calendar.component.ts:92-106`); `ngOnDestroy` restores it. This `(this.datepickerRef as any)` reach-in is exactly the kind of fragile PrimeNG coupling the Falcon UI Core was built to eliminate.

## Skeleton ↔ app-wrapper layering
- **No skeleton / wrapper split.** This is a single bespoke Angular component wrapping PrimeNG `<p-datepicker>` directly. There is no Stencil layer.
- The modern replacement `<falcon-angular-date-picker>` HAS the proper split: Stencil `<falcon-date-picker-tw>` skeleton + Angular wrapper. That is one reason this component is deprecated.

## Integration gotchas
- `[CODE]` **PrimeNG dependency.** It imports `primeng/datepicker` + `primeng/api` — banned in new code (`feedback_falcon_ui_library_only_no_native` / PrimeNG-removal). Reviving it re-introduces PrimeNG.
- `[CODE]` **`(this.datepickerRef as any)` monkey-patch** — `hideOverlay` is reassigned at runtime (`falcon-calendar.component.ts:98`). This breaks on any PrimeNG version bump and is untyped.
- `[CODE]` **Local-time ISO conversion.** The existing `API.md` references `toIso` / `fromIso` helpers using local time to avoid a UTC off-by-one. Those helpers are NOT in the surviving deprecated source — they belonged to the (missing) Wave-3 façade. Another sign the façade and the surviving file are different artifacts.
- `[INFERRED]` **Do not integrate.** Any wiring task that lands on `<falcon-calendar>` should be redirected to `<falcon-angular-date-picker>` (field) or `<falcon-angular-calendar>` (inline grid).

## Verification
🔴 INFERRED + 🟡 CODE-DERIVED. The surviving source (`[CODE]` deprecated PrimeNG original) does NOT match the façade described in the original 6 dossiers — discrepancy documented above, old files not edited. **Component status: ORPHAN — 0 consumers / 0 active-repo source (`USAGE.md` Wave 7). Recommend deletion.**
