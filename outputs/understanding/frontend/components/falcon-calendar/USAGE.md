# falcon-calendar — USAGE

## Real usage examples (active codebase)

> `[CODE]` 2026-06-03 — there are **no direct `<falcon-angular-calendar>` consumers** in `apps/` or `libs/falcon/`. The component is exercised in production only through the `<falcon-angular-date-picker>` composition (which embeds `<falcon-calendar>` / `<falcon-calendar-tw>` in its popover) and as a Studio/showcase gallery tile. The examples below are the recommended patterns; the composition site is the closest thing to a live example.

### Example 1 — composition inside the date-picker (the live pattern)

`[CODE]` falcon-date-picker-tw.tsx:392-404 — the only production render of the grid:

```tsx
<falcon-calendar-tw
  value={this.value ?? undefined}
  min={this.min}
  max={this.max}
  first-day-of-week={this.firstDayOfWeek}
  locale={this.locale}
  disabled-icon-enabled={this.disabledIconEnabled ? '' : null}
  disabled-icon-color={this.disabledIconColor ?? undefined}
  ref={this.bindCalendarProps}                       // assigns disabledDates as a JS prop via ref
  onfalcon-change={(ev) => this.handleCalendarChange(ev)}
/>
```

> Note the `ref={this.bindCalendarProps}` pattern — object/function props (`disabledDates`) cannot pass through JSX attribute syntax (they would stringify), so the date-picker assigns them on the live element. The same trap is why the Angular wrapper uses `syncProps()` (below).

### Example 2 — standalone inline calendar (recommended)

```html
<falcon-angular-calendar
  [value]="selectedDate()"
  [min]="'2026-01-01'"
  [max]="'2026-12-31'"
  [firstDayOfWeek]="0"
  locale="en-US"
  (valueChange)="onDateChange($event)">
</falcon-angular-calendar>
```

### Example 3 — disabled-dates predicate (stable reference)

```ts
// Declare ONCE on the component class so the reference is stable (see Integration G7).
readonly isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;
```

```html
<falcon-angular-calendar
  [disabledDates]="isWeekend"
  [(value)]="picked">
</falcon-angular-calendar>
```

### Example 4 — disabled-dates array + slash-overlay tint

```html
<falcon-angular-calendar
  [disabledDates]="['2026-05-15', '2026-05-22']"
  [disabledIconColor]="'var(--color-falcon-red-500)'"
  (valueChange)="onPick($event)">
</falcon-angular-calendar>
```

## Recommended usage for NEW Angular pages

- Inline always-visible grid? → `<falcon-angular-calendar>`.
- Input field + popover? → `<falcon-angular-date-picker>` (don't hand-roll the grid behind an input).
- Use `[firstDayOfWeek]="6"` for Saturday-start (Arabic) locales.
- Use `[disabledDates]` as a predicate for dynamic rules, an ISO array for static lists — always a property binding, never a string attribute.
- Defaults: `useTailwind=true`, `firstDayOfWeek=0`, `locale='en-US'`, `size='md'`, `disabledIconEnabled=true`.

## Reactive Forms

Direct CVA is NOT supported (GAP G1). Bridge `(valueChange)` into a control:

```ts
// in template: (valueChange)="form.controls.date.setValue($event)"
// to push back: subscribe to form.controls.date.valueChanges and re-bind [value].
```

OR use `<falcon-angular-date-picker>` for the form-field path.

## ngModel

NOT supported (no CVA). There is no longer a legacy `<falcon-calendar>` façade to fall back to — it was deleted (`[CODE]` `libs/falcon/src/shared-ui/index.ts:312`). Use `[value]`/`(valueChange)` or the date-picker.

## Tailwind-only

```html
<falcon-angular-calendar class="inline-block" rootClass="shadow-none" ... />
```

The host `class=` lands on the wrapper element (`:host { display: contents }` so the wrapper itself has no box — class effectively decorates nothing visible; prefer `rootClass`, which lands on the Stencil element via `[class]`).

## Token usage (per-instance override pattern)

Add a host class, then mutate the `--falcon-calendar-*` tokens (shared `calendar.tokens.css`):

```css
.brand-cal {
  --falcon-calendar-day-selected-bg: var(--color-falcon-teal-500);
  --falcon-calendar-day-selected-color: var(--color-falcon-neutral-0);
  --falcon-calendar-day-bg-hover: var(--color-falcon-teal-alpha-08);
}
```

> The `:where()` selector keeps specificity 0 so a host-class override wins (`[CODE]` calendar.tokens.css:37-49). Both render paths read the same tokens.

## Bad usage to avoid

- **Do NOT** pass `disabledDates` as a string attribute — `syncProps()` only assigns the JS property (`[CODE]` ts:96-103); a string silently no-ops.
- **Do NOT** re-create the `disabledDates` predicate every change-detection pass — `syncProps()` re-assigns on every `ngOnChanges`, churning the Stencil prop (GAP G7).
- **Do NOT** reach for `[(ngModel)]` / `formControlName` — no CVA. Use the date-picker.
- **Do NOT** embed this grid manually behind an input to fake a date field — that is `<falcon-angular-date-picker>`.
- **Do NOT** assume `[locale]` switches the calendar *system* — it only changes `Intl` labels; arithmetic stays Gregorian (GAP G4).
- **Do NOT** add SCSS rules to restyle cells — use the token-override host-class pattern.
- **Do NOT** use native `<input type="date">` or PrimeNG `<p-calendar [inline]>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Do / Don't

| Do | Don't |
|---|---|
| Use for an always-visible inline grid. | Use for an input + popover (that's the date-picker). |
| Pass `disabledDates` as a stable JS array / fn. | Pass it as `[attr.*]` string or a fresh-per-render fn. |
| Bind `[value]` + `(valueChange)` two-way. | Bind `[(ngModel)]` (no CVA). |
| Set `firstDayOfWeek` per locale. | Trust the browser default for Arabic. |
| Override visuals via `--falcon-calendar-*` tokens. | Hardcode hex/px or write component CSS. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-calendar` across `apps/` → **0 files**; across `libs/falcon/` → **0 render sites** (only `falcon-effective-date.directive.ts`, a Wave-3 no-op stub that mentions the slug in a comment — `[CODE]` falcon-effective-date.directive.ts:1-7). Full live render-site list:

- `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx:392` — `<falcon-calendar-tw>` inside the popover (composition; the dominant real usage).
- `libs/falcon-ui-core/src/components/falcon-date-picker/falcon-date-picker.tsx:251` — `<falcon-calendar>` inside the Shadow popover.
- `libs/falcon/src/shared-ui/index.ts:315` — re-export of `FalconAngularCalendarComponent` (non-render).
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts:35,55` + `falcon-studio/src/lib/registry/gallery-defaults.ts` + `falcon-ui-showcase-data/src/docs/calendar.md` — Studio/showcase gallery tiles (not a business flow).

> `[CODE]` Compared to the prior 2026-05-17 sweep ("2 consumers: applications-table + playground"), both are gone — applications-table migrated to `<falcon-angular-date-picker>` and the playground route was removed. The calendar now has **zero direct app-feature consumers**.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07). Consumer Sweep re-run; the prior "2 consumers" are gone (now 0 direct, live only via the date-picker composition + showcase). The composition example is quoted from live source. JS-prop `disabledDates` trap re-confirmed against `syncProps()`.
