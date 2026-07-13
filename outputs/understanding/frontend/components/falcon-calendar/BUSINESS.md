# falcon-calendar — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The always-visible, single-month date grid. In business terms it is how an operator commits a *single calendar-date decision* when the date must be picked from a visible grid rather than typed — e.g. an effective date chosen against a visible month, an inline date on a detail panel. It is the **inline** half of Falcon's date-entry pair; the **input + popover** half is `<falcon-angular-date-picker>` (which embeds this exact grid inside its popover).

`[CODE]` `falcon-calendar.tsx:1-5` — header comment: "Single-month grid mirroring React V0.2 admin/styles.css 1:1. No range mode, no multi-select." The component is deliberately scoped to one decision: one date, one month visible.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Effective-date must be a future date (periodic pricing change) | `[MEMORY]` project_commchannels_apps_tabs_backend_integration_plan_2026_05_17 — `SetPriceType` requires future `effectiveDate` | The calendar enforces this only when the consumer supplies `[min]` (today/tomorrow). The component carries **no business rule of its own** — it surfaces whatever bounds the parent flow sets. |
| Disabled-date exclusions | `[CODE]` `falcon-calendar.tsx:48,152` `disabledDates` prop + `makeIsDisabled` | A flow that must forbid certain dates (weekends, blackout dates, renew-day clamps) passes a predicate or array; the grid renders those cells non-clickable with a slash-icon overlay. |
| `[INFERRED]` No business rule is baked into the component | — | Unlike `falcon-dropdown` (Owner-Role lock) the calendar holds no invariant. It is a pure decision surface; all date policy is injected by the host flow via `min` / `max` / `disabledDates`. |

## Business constraints baked in
- `[CODE]` `falcon-calendar.tsx:102-107` **A disabled cell is never selectable** — `handleDayClick` short-circuits when `isDisabled || this.disabled`. A "disabled date" is a business statement ("this date is not a legal choice for this decision"), enforced at the click boundary, not just visually.
- `[CODE]` `falcon-calendar.tsx:57-64,241-258` **Disabled dates carry a visible slash overlay** (`disabledIconEnabled` default `true`). The business intent: a forbidden date must *look* forbidden, not merely fail silently on click.
- `[CODE]` `falcon-calendar.tsx:45` **Single value only** — `value: string | null`. There is no "no decision yet across a range" state; the operator either has picked one date or none.
- `[INFERRED]` **Calendar system is Gregorian only** — `locale` (`falcon-calendar.tsx:50`) drives month/weekday *labels* via `Intl`, not the calendar *system*. For Hijri/Umm-al-Qura business contexts the date must be converted by the host flow before binding (see `GAPS_AND_UPGRADES.md` G4).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| **Date-picker popover** | every date field across the consoles | `[CODE]` falcon-date-picker-tw.tsx:392 — the grid embedded in `<falcon-angular-date-picker>` IS this component. All real date decisions flow through it transitively. |
| `[INFERRED]` Inline date on detail panels | organization-hierarchy detail panels | Where a date must be visible-and-picked without an input field — no such standalone consumer exists in code today (2026-06-03). |
| Studio / showcase gallery | host-shell `falcon-ui-showcase` | Component demo / design reference — not a business flow. |

> `[CODE]` CORRECTION (2026-06-03): the prior dossier's `applications-table` + `playground` standalone consumers are **gone** — applications-table migrated to `<falcon-angular-date-picker>`, the playground route was removed. There are now **zero standalone `<falcon-angular-calendar>` business flows**; the component earns its keep entirely as the date-picker's embedded grid. Most *form* date entry uses `<falcon-angular-date-picker>` (compact field) — `falcon-calendar` would only be chosen when the grid must stay visible, which no current flow needs.

## Business gotchas
- `[INFERRED]` An **empty / wrong month on open** is usually a *binding* problem, not a component fault: `componentWillLoad` (`falcon-calendar.tsx:74-78`) sets `viewDate` from `value` at load; if the parent sets `value` *after* first paint, the grid stays on the current month until the `@Watch('value')` (`falcon-calendar.tsx:80-84`) fires.
- `[INFERRED]` A **disabled calendar is not the same as disabled dates** — `[disabled]="true"` (`falcon-calendar.tsx:55`) freezes the whole grid (a business statement "no date decision is yours here"); `disabledDates` only forbids *specific* cells while the rest stay live.
- `[CODE]` `falcon-calendar.tsx:103` The whole-grid `disabled` flag and the per-cell `isDisabled` are OR-ed at click time — a builder cannot "enable one date" inside a fully-disabled calendar.

## Verification
🟡 CODE-DERIVED (RE-VERIFIED 2026-06-03, B07) from `[CODE]` `falcon-calendar.tsx` (267 ln) + `[CODE]` `falcon-calendar.component.ts` (118 ln) + `.utils.ts`. The disabled-click short-circuit (tsx:103), single-value model (tsx:45), and slash overlay (tsx:241-258) re-confirmed. Business-flow table corrected: zero standalone consumers (was 2); the component is now business-relevant only as the date-picker's embedded grid. The effective-date rule remains `[MEMORY]`-sourced; the no-baked-in-invariant claim is `[INFERRED]` from full source read.
