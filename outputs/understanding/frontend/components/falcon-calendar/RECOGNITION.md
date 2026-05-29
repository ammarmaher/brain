# falcon-calendar — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-calendar>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-calendar.tsx:156-263` — an **always-visible single-month grid**, no input field, no trigger:
- A **header row**: a left chevron button, a centered month-year title (e.g. "May 2026"), a right chevron button (`falcon-calendar.tsx:166-190`).
- A **weekday label row** of 7 short day names, `aria-hidden` (`falcon-calendar.tsx:191-195`).
- A **6×7 grid of day cells** rendered as `<button>`s (`falcon-calendar.tsx:202-261`) — 42 cells, leading/trailing cells dimmed (outside-month).
- Cell states visible: idle, hover, **today** (marker), **selected** (filled bg), **disabled** (dimmed + a diagonal **slash icon** overlay, `falcon-calendar.tsx:241-258`), outside-month (faint).
- Optional **week-number column** down the left edge when `showWeekNumbers` (`falcon-calendar.tsx:203-209`).
- The distinguishing trait vs `<falcon-angular-date-picker>`: **there is no input box and no popover** — the grid is the whole component, rendered inline.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DateCalendar>` (the static inline calendar, not `<DatePicker>`) | direct 1:1 — MUI splits the same way: `<DateCalendar>` inline vs `<DatePicker>` field+popover. |
| PrimeNG | `<p-calendar [inline]="true">` | PrimeNG uses one component with an `inline` flag; the inline mode maps here. The field mode maps to `<falcon-angular-date-picker>`. |
| Ant Design | `<Calendar fullscreen={false}>` / `<DatePicker open>` panel | Ant's `<Calendar>` (small mode) ≈ this; Ant `<DatePicker>` ≈ date-picker. |
| Bootstrap | no native inline calendar — `flatpickr inline:true` / `bootstrap-datepicker` inline | upgrade target. |
| shadcn / Radix | `<Calendar>` (react-day-picker, used standalone) | direct 1:1 — shadcn's `<Calendar>` is the inline grid; its `<DatePicker>` wraps it in a Popover. Same split as Falcon. |
| plain HTML | `<input type="date">` rendered open / hand-rolled grid | always replace with this for inline; with `<falcon-angular-date-picker>` for a field. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an always-visible month grid, no input box | `<falcon-angular-calendar>` | date-picker |
| a text input with a calendar icon that opens a popup grid | `<falcon-angular-date-picker>` | calendar |
| a legacy PrimeNG `p-calendar` migration needing `[(ngModel)]` | `<falcon-calendar>` legacy facade (`libs/falcon`) | this Stencil-paired one |
| a date *range* (start–end highlighted) | not supported — two `<falcon-angular-date-picker>` side by side, or raise the range GAP | calendar |
| month-only / year-only picker | not supported — raise GAP G3 | calendar |
| a Hijri / Umm-al-Qura grid | not supported — convert dates externally, raise GAP G4 | calendar |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[value]` (ISO `YYYY-MM-DD`) + `(valueChange)` two-way; `[min]` / `[max]` (ISO) for bounds; `[firstDayOfWeek]` (`0`=Sun … `6`=Sat — set per locale, `6` for Arabic); `[locale]`; `[showWeekNumbers]`; `[size]` (`sm`/`md`/`lg`); `[disabled]` to freeze the whole grid.
2. **Disabled dates** — pass `[disabledDates]` as a **JS array** (`['2026-05-15']`) or a **predicate** (`(d:Date)=>boolean`). Must be a property binding, never a string attribute. Keep the predicate reference stable.
3. **Disabled-icon overlay** — tune the slash via `[disabledIconEnabled]` / `[disabledIconColor]` / `[disabledIconWidth]` / `[disabledIconHeight]`, or via `calendar.tokens.css` vars.
4. **Templates / slots** — none exist. Custom cell content is a GAP.
5. **Tokens** — restyle every visual axis (cell states, header, selected bg, today marker, week-number column) via `calendar.tokens.css` CSS vars; never hardcode (see `TOKENS.md`).
6. **Variants** — `useTailwind` (default `true`) picks the Light-DOM Tailwind skeleton vs the Shadow skeleton; behavior is identical.
7. **Shared upgrade** — range / view-mode / Hijri / CVA are all missing (`GAPS_AND_UPGRADES.md` G1–G4) — raise as a library upgrade, do not hand-roll.
8. **Wrapper** — for Reactive Forms, wrap externally: subscribe to `(valueChange)` and `setValue` a `FormControl`, OR switch to `<falcon-angular-date-picker>` which IS CVA-capable.

## Anti-patterns
- `[CODE]` Passing `disabledDates` as a string attribute — `syncProps()` only assigns it as a JS prop; a string silently no-ops.
- Reaching for `[(ngModel)]` on `<falcon-angular-calendar>` — no CVA; use `<falcon-angular-date-picker>` or the legacy facade.
- Using this when the design clearly has an **input field** — that is `<falcon-angular-date-picker>`; embedding this grid manually behind an input re-implements the date-picker.
- Hand-rolling a range highlight on top of two values — not supported; raise the GAP.
- Assuming `[locale]` switches the calendar *system* — it only changes labels; Gregorian arithmetic is fixed.
- Native `<input type="date">` or PrimeNG `<p-calendar>` in new app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-calendar.tsx` rendered structure + `[CODE]` `falcon-calendar.component.ts` inputs. Cross-library mapping is `[INFERRED]` from each library's documented inline-calendar vs date-picker split.
