# falcon-date-picker — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-date-picker>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-date-picker.tsx:186-268` — a **labeled text field with a trailing calendar icon**:
- Optional **label** above the field, with a `*` marker when `required` (`falcon-date-picker.tsx:194-198`).
- A **text input** showing the selected date as ISO `YYYY-MM-DD` (or a `YYYY-MM-DD` placeholder when empty) — `falcon-date-picker.tsx:205-228`.
- A **calendar glyph icon** on the trailing edge (`falcon-date-picker.tsx:229-236`) — an outlined month-grid SVG. Optional leading icon slot (`iconLeft`).
- Optional **helper text** below, or an **error message** in red (`role="alert"`) when in error state — `falcon-date-picker.tsx:238-243`.
- Clicking the field opens a **floating popover** containing the full month grid (the embedded `<falcon-calendar>`) — `falcon-date-picker.tsx:244-265`. Clicking outside or pressing Escape closes it; selecting a day commits and closes.
- The distinguishing trait vs `<falcon-angular-calendar>`: **there IS an input box**, and the grid is hidden until the field is clicked. Same field height / border / focus-ring DNA as `<falcon-angular-input>`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DatePicker>` (the field + popover one, not `<DateCalendar>`) | direct 1:1 — MUI's `<DatePicker>` is the field; `<DateCalendar>` is the inline grid. |
| PrimeNG | `<p-calendar>` / `<p-datepicker>` (default, non-inline) | direct 1:1 — this component **replaced** `<p-calendar>`. The legacy `<falcon-calendar>` facade was the PrimeNG one. |
| Ant Design | `<DatePicker>` | direct 1:1. For range, Ant `<DatePicker.RangePicker>` → not supported here (compose two). |
| Bootstrap | `<input type="date">` / `flatpickr` / `bootstrap-datepicker` (field mode) | upgrade target. |
| shadcn / Radix | `<DatePicker>` (Popover + Calendar composition) | direct 1:1 — shadcn's date-picker is exactly Popover-wrapping-Calendar; Falcon's is the same shape. |
| plain HTML | `<input type="date">` | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a text field + calendar icon that opens a popup grid | `<falcon-angular-date-picker>` | calendar |
| an always-visible inline month grid, no input box | `<falcon-angular-calendar>` | date-picker |
| a date *range* (start–end field, two-handle highlight) | not supported — compose two `<falcon-angular-date-picker>` + cross-validate; raise GAP G2 | date-picker single |
| a date **and** a time-of-day picker | not supported — pair with a separate time control; raise GAP G3 | date-picker |
| a date shown as `DD MMM YYYY` (not ISO) | not supported — format externally for display; raise GAP G4 | date-picker |
| a Hijri / Umm-al-Qura field | not supported — convert dates externally; raise GAP G5 | date-picker |
| a legacy PrimeNG `<falcon-calendar>` tag in old code | migrate it to this | keep the legacy facade |
| a generic text field (not a date) | `<falcon-angular-input>` | date-picker |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[value]` (ISO `YYYY-MM-DD`) + `(valueChange)` two-way; `[label]`, `[placeholder]`, `[helperText]`; `[min]`/`[max]` (ISO) for bounds; `[firstDayOfWeek]` (`6` for Arabic Saturday-start); `[locale]`; `[size]` (`sm`/`md`/`lg`); `[state]` (`default`/`error`/`success`/`warning`); `[disabled]`, `[readonly]`, `[required]`; `[name]`, `[inputId]`.
2. **Disabled dates** — pass `[disabledDates]` as a **JS array** or **predicate** (property binding only, stable reference). For business rules like a renew-day clamp, encode it here so illegal dates are physically un-clickable.
3. **Error display** — bind `[state]="'error'"` + `[errorMessage]` (the picker shows it; the host `validations.ts` computes it — there is no CVA).
4. **Icon slot** — `[iconLeft]="true"` + project content into the `icon-left` slot for a leading glyph; the trailing calendar icon is built in.
5. **Templates / slots** — beyond `icon-left`, none; custom popup content is not supported.
6. **Tokens** — restyle the input (shares `<falcon-input>` tokens — teal focus, neutral borders) and the popover/calendar via `calendar.tokens.css` + input-section vars (see `TOKENS.md`); never hardcode.
7. **Variants** — `useTailwind` (default `true`) picks the Light-DOM `-tw` **portal-to-body** variant; `false` picks the Shadow variant (CSS-anchored popup, and still carries the focus-vs-click double-click bug — see `INTEGRATION_VALIDATION.md`). **Keep the default `true`.**
8. **Shared upgrade** — CVA, range, time, display-format, Hijri, `openPicker`/`closePicker` proxies are all missing (`GAPS_AND_UPGRADES.md` G1–G7) — raise as library upgrades.
9. **Wrapper** — for Reactive Forms today, wrap externally in a custom `ControlValueAccessor` directive, or `@ViewChild` the picker and bridge `valueChange` ↔ `FormControl`.

## Anti-patterns
- `[CODE]` Binding `[(ngModel)]` or `formControlName` — no CVA; the binding silently does nothing.
- `[CODE]` Passing `disabledDates` as a string attribute — only assigned as a JS prop; a string no-ops.
- Setting `useTailwind="false"` to "fix" something — the Shadow variant lacks the popover-portal fixes AND has the RC#4 first-click bug; the default `-tw` is the correct path.
- Using this when the design has an **always-open grid** — that is `<falcon-angular-calendar>`.
- Hand-rolling a range by gluing two values — not supported; compose two pickers and cross-validate, or raise the GAP.
- Assuming `[locale]` switches the calendar *system* or the *display format* — it only changes the popup grid's labels; the field always shows ISO.
- Native `<input type="date">` or PrimeNG `<p-calendar>` in new app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-date-picker.tsx` rendered structure + `[CODE]` `falcon-date-picker.component.ts` inputs + `[VAULT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`. Cross-library mapping is `[INFERRED]` from each library's documented field-vs-inline date split.
