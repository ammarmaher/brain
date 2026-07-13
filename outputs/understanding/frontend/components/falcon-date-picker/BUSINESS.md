# falcon-date-picker — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The **canonical date-input control** in Falcon forms. In business terms it is how an operator commits a *single calendar-date decision* through a compact text field — birth date, expiry date, start/end date, an effective date for a pricing change. It is the **input + popover** half of Falcon's date pair; the **always-visible inline grid** half is `<falcon-angular-calendar>` (which this component embeds inside its popover — `[CODE]` `falcon-date-picker.tsx:251-263`).

`[CODE]` `falcon-date-picker.tsx:1-2` header: "Input field + popover with embedded `<falcon-calendar>`." The business decision surface is the *same* grid as `falcon-calendar`; the difference is purely the field-and-popup UX wrapped around it.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Effective-date must be a future date | `[MEMORY]` project_commchannels_apps_tabs_backend_integration_plan_2026_05_17 — `SetPriceType` requires future `effectiveDate` | The picker enforces this only when the host flow supplies `[min]`. It carries **no date rule of its own** — `min`/`max`/`disabledDates` are injected by the flow. |
| Periodic-pricing renew-day clamp | `[MEMORY]` — for Monthly/Yearly, `effectiveDate.Day == renewDate.Day-1` clamped, else `InvalidEffectiveDateForPeriodicPricingChange` | The host flow expresses this as a `disabledDates` predicate so the operator physically cannot click an illegal date — the component renders those cells with the slash overlay. |
| Required field | `[CODE]` `falcon-date-picker.tsx:52,196-197` `required` prop → renders the `*` marker + `aria-required` | The picker *displays* required-ness; whether the value is actually present at submit is the host form's `validations.ts` job (no CVA — see `INTEGRATION_VALIDATION.md`). |
| `[INFERRED]` No business invariant baked in | — | Like `falcon-calendar`, the picker is a pure decision surface. Unlike `falcon-dropdown` it locks no value; all date policy is host-injected. |

## Business constraints baked in
- `[CODE]` `falcon-date-picker.tsx:150-154` **Selecting a date in the popup commits immediately AND closes the popup** — `handleCalendarChange` writes the value, emits `falcon-change`, and `closeInternal('select')`. The business intent: a date click *is* the decision; there is no "preview then confirm" step. (This was the deliberate behavior change from the now-DELETED legacy `<falcon-calendar>` PrimeNG façade's Set/Cancel UX — `[CODE]` the façade no longer exists, `shared-ui/index.ts:312`.)
- `[CODE]` `falcon-date-picker.tsx:119-123,168-184` **The text input is also editable** — the operator can type a date string; `parseInputValue` parses it via `toDate` and commits a normalized ISO value (or `null` on empty). Business intent: keyboard-fast date entry without forcing the popup.
- `[CODE]` `falcon-date-picker.tsx:120` **`readonly` and `disabled` both block opening the popup** — `readonly` is a business statement "this date is shown but not yours to change in this context"; `disabled` is the harder "this field is not active at all".
- `[INFERRED]` **Gregorian + ISO only** — `displayValue` (`falcon-date-picker.tsx:114-117`) always renders ISO `YYYY-MM-DD`; `locale` only changes the popup grid labels. For Hijri business contexts or a `DD MMM YYYY` display the host flow must convert/format externally (`GAPS_AND_UPGRADES.md` G4/G5).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[CODE]` `contract-information-step.component.html:37,48` | admin-console → contracts-cost-management Add wizard | **Contract Start Date + Expiration Date** capture (a "from–to" pair expressed as two pickers — no native range). |
| `[CODE]` `contracts-edit-contract.component.html` | admin-console → edit contract | Editing the same contract dates. |
| `[CODE]` `service-pricing-table.component.html:235` | `libs/falcon` shared service-pricing table | Effective-date entry for a service pricing change (with a per-instance `style=` token override). |
| `[INFERRED]` Other form date fields | various wizards | Any wizard step needing a date field. |

> `[CODE]` CORRECTION (2026-06-03): the prior dossier's `applications-table`, `falcon-table-edit-row`, `playground`, and the **legacy `<falcon-calendar>` façade** flows are gone — the façade was DELETED (`shared-ui/index.ts:312`) and the table consumers migrated. The live business flows are now the contracts wizard + service-pricing-table.

## Business gotchas
- `[INFERRED]` **The picker cannot stop an illegal date by itself** — it only prevents what `min`/`max`/`disabledDates` describe. A business rule like the renew-day clamp must be passed in as a predicate; otherwise the operator can pick a date the backend will reject with `InvalidEffectiveDateForPeriodicPricingChange`.
- `[CODE]` **A typed value is parsed leniently** — `parseInputValue` (`falcon-date-picker.tsx:168-179`) accepts anything `toDate()` can parse, then re-normalizes to ISO. A business flow that needs strict format rejection must validate the emitted value, not trust the input mask.
- `[INFERRED]` **No range support** — for a business "from–to" period the flow must compose two pickers and cross-validate `start <= end` itself (`GAPS_AND_UPGRADES.md` G2/G8).
- `[INFERRED]` **No time component** — for a "scheduled at" business decision needing a time-of-day, this component covers only the date; pair it with a separate time control until G3 lands.

## Verification
🟡 CODE-DERIVED (RE-VERIFIED 2026-06-03, B07) from `[CODE]` `falcon-date-picker.tsx` (270 ln) + `falcon-date-picker-tw.tsx` (411 ln) + `falcon-date-picker.component.ts` (202 ln). Select-commits-and-closes (tsx:150-154), lenient typed-input parse (tsx:168-179), readonly/disabled-both-block-open (tsx:120,126), required-marker (tsx:196-197) all re-confirmed. Business-flow table corrected to the contracts wizard + service-pricing-table (legacy façade deleted, applications-table/edit-row/playground gone). Effective-date rules remain `[MEMORY]`; no-baked-in-invariant is `[INFERRED]`.
