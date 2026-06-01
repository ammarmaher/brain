# falcon-calendar (LEGACY FACADE) — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify the component to use.
> ⚠ **LEGACY / ORPHAN.** The recognition answer for *any* design that looks like this component is: **do NOT use `<falcon-calendar>` — use a modern sibling.**

## Visual fingerprint
`[CODE]` `falcon-calendar.component.ts:17` + `[BRAIN-OUT]` `OVERVIEW.md` — a **PrimeNG `<p-datepicker>` field**: a text input with a trailing calendar icon; clicking opens a popup month grid. Its one distinguishing trait vs every modern Falcon date control: a **Set / Cancel button pair at the bottom of the popup** (`[CODE]` `falcon-calendar.component.ts:162-187` `onSet`/`onCancel`) — the date is *previewed* in the grid and only *committed* on "Set".

If a screenshot shows a date popup with explicit **Set / Cancel** (or **Apply / Cancel**) buttons, that is the visual signature of this legacy component.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DatePicker>` with action bar `actions={['cancel','accept']}` | the "accept/cancel" action bar mirrors Set/Cancel — but in Falcon, route to `<falcon-angular-date-picker>`. |
| PrimeNG | `<p-datepicker>` / `<p-calendar>` with footer Set/Cancel template | this component literally *is* a `<p-datepicker>` wrapper — banned in new code. |
| Ant Design | `<DatePicker>` (commits on select; no Set/Cancel by default) | Ant has no Set/Cancel — closest Falcon answer is `<falcon-angular-date-picker>`. |
| Bootstrap | `bootstrap-datepicker` / `flatpickr` with confirm button | upgrade target → `<falcon-angular-date-picker>`. |
| shadcn / Radix | `<DatePicker>` (Popover + Calendar) | shadcn commits on select; map to `<falcon-angular-date-picker>`. |
| plain HTML | `<input type="date">` | replace with `<falcon-angular-date-picker>`. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a date input + popup, **any** new screen | `<falcon-angular-date-picker>` | `<falcon-calendar>` (legacy) |
| an always-visible inline month grid | `<falcon-angular-calendar>` | `<falcon-calendar>` (legacy) |
| a date popup with **Set / Cancel** confirm buttons | `<falcon-angular-date-picker>` — and raise a "confirm-on-Set" feature request if the confirm step is genuinely required | `<falcon-calendar>` (legacy) — do not revive PrimeNG |
| effective-date validation against a renew date | `<falcon-angular-date-picker>` + the host flow's `validations.ts` | the legacy effective-date inputs (`useEffectiveDateValidation` etc.) — no-ops |
| latent code that still imports `<falcon-calendar>` | migrate it off, then delete the component | keeping it |

## Composition recipe to reach parity
**There is no composition recipe — this component is not a build target.** The recognition outcome is a **migration**, in this order:
1. Identify what the design needs: a date *field* (→ `<falcon-angular-date-picker>`) or an inline *grid* (→ `<falcon-angular-calendar>`).
2. Replace the `<falcon-calendar>` tag with the chosen modern component; bind `[(ngModel)]` / CVA (`<falcon-angular-date-picker>` supports it; `<falcon-angular-calendar>` uses `[value]`+`(valueChange)`).
3. Drop the five legacy effective-date inputs — re-express the rule as a `disabledDates` predicate or a `validations.ts` cross-field rule on the host flow.
4. If the design's Set/Cancel confirm step is genuinely required, raise it as a feature request against `<falcon-angular-date-picker>` (a footer action-bar option) — do not re-introduce PrimeNG.
5. Once no consumers remain, delete the component folder (`GAPS_AND_UPGRADES.md` recommends this).

## Anti-patterns
- `[CODE]` Adding a new consumer of `<falcon-calendar>` — re-introduces a `primeng/datepicker` import the platform is removing.
- Wiring `useEffectiveDateValidation` / `status` / `pricingType` / `renewDate` and expecting validation — they are no-ops in the façade form.
- "Reviving" the Set/Cancel UX by extending this component — extend `<falcon-angular-date-picker>` instead.
- Treating the existing 6 dossier files as fully accurate — they describe a Wave-3 façade that does not match the only surviving source (see `INTEGRATION_VALIDATION.md`).

## Verification
🔴 INFERRED + 🟡 CODE-DERIVED from `[CODE]` `deprecated-falcon-web-platform-ui/.../falcon-calendar.component.ts` + the existing 6 dossier files. **Recognition rule: any design matching this component routes to a modern sibling — `<falcon-calendar>` legacy is an ORPHAN flagged for deletion.**
