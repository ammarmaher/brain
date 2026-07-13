# falcon-calendar — DECISION

## Brain SK final recommendation

**STATUS: READY for inline presentational use. NEEDS-UPGRADE for forms integration (no CVA — G1) + range (G2). Note: ZERO standalone consumers today — the component lives via the `<falcon-angular-date-picker>` composition.**

## Use this component for

- An inline, always-visible month grid where the calendar IS the UI (no input field).
- As the composition target inside `<falcon-angular-date-picker>` (the picker embeds it — do not double-use: if you want a field, use the picker, not this).

## Avoid this component for

- Input + popover date entry → `<falcon-angular-date-picker>`.
- Reactive Forms / `[(ngModel)]` → no CVA (G1); use the picker or bridge `(valueChange)`.
- Date range / multi-select → not implemented (G2).
- Hijri / Islamic calendar → convert externally then pass ISO (G4).
- A field that scales with `size` → `size` is inert on the calendar grid (G6).

## Preferred render path

**`useTailwind=true` (default)** — Light DOM `<falcon-calendar-tw>`. Best for Studio token-runtime mutation + cross-framework parity. Behavior is identical to the Shadow path; the only differences are DOM encapsulation and the focus-query target (`host` vs `host.shadowRoot`).

## Required upgrades before wider standalone use

- **P1:** G1 (CVA), G2 (range). These block forms + range use cases.
- **P2:** G3 (view-mode — type already exists), G4 (Hijri), G5 (method proxies), G6 (`size`→cell tokens), A1/A2 (per-cell `aria-label` + `aria-live`).

The 8 documented gaps in `GAPS_AND_UPGRADES.md` are improvements; for the current usage (embedded in the date-picker) the grid is production-quality.

## Relationship to other components

- **Composed BY:** `<falcon-angular-date-picker>` (embeds `<falcon-calendar>` / `<falcon-calendar-tw>` in its popover).
- **Shares with the date-picker:** `falcon-calendar.types.ts`, `calendar.tokens.css`, `falcon-calendar.utils.ts` (jointly owned).
- **Legacy:** the old `FalconCalendarComponent` façade in `libs/falcon` was **DELETED** (`[CODE]` `shared-ui/index.ts:312`) — there is no longer a competing legacy calendar.

## Exact rule for future implementation tasks

1. **Inline always-visible calendar?** → `<falcon-angular-calendar>` with `useTailwind=true`.
2. **Field + popover?** → `<falcon-angular-date-picker>` (don't embed this grid manually).
3. **Bind `[value]` + `(valueChange)` two-way** — never `[(ngModel)]` (no CVA).
4. **Pass `[disabledDates]` as a stable JS array/predicate**, never a string attribute.
5. **Override visuals via `--falcon-calendar-*` tokens** (shared `calendar.tokens.css`); never hardcode hex/px.
6. **Do not rely on `(falconBlur)`** (declared but never emitted) or on `size` changing the cell height.

---

## Dynamic capability assessment

### 1. What is static today?
- Single-month, single-date grid (no range/multi).
- Gregorian calendar arithmetic (locale only changes `Intl` labels).
- The built-in chevron SVGs + the lucide-slash disabled overlay SVG (hardcoded paths).
- The 6×7 = 42-cell grid shape.
- `FalconCalendarViewMode` type exists but no view-mode UI uses it.
- `size` does not scale the cell height.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **15 wrapper `@Input`s** (2026-06-03 recount, falcon-calendar.component.ts:64-82): value / min / max / disabledDates / firstDayOfWeek / locale / showWeekNumbers / size / disabled / disabledIconEnabled / disabledIconColor / disabledIconWidth / disabledIconHeight / useTailwind / rootClass.
- `[CODE]` **3 `@Output`s** (ts:84-86): `(falconChange)`, `(valueChange)`, `(falconBlur)` — but `(falconBlur)` is **dead** (the `@Event` is declared on the tags but never `.emit()`-ed).
- **NO CVA** — bind `[value]` + `(valueChange)`.

### 3. What is already dynamic through slots / ng-template?
- `[CODE]` Nothing. No `<slot>` on either tag; no `ng-content`/`ng-template` on the wrapper. Custom cell content is impossible.

### 4. What is dynamic through token/theme overrides?
- `[CODE]` Every visual axis (~60 `--falcon-calendar-*` tokens in the shared `calendar.tokens.css`): container, header, nav, weekday row, all cell states, week-number column, slash overlay, focus ring, motion. Host-class + per-instance scope both win via the `:where()` chain. Dark mode flips colors automatically (token-driven).

### 5. What is dynamic through Tailwind classes?
- `[CODE]` `rootClass` lands on the Stencil element (`[class]`); the `-tw` twin reads every token via arbitrary-value utilities. Host `class=` is near-useless because `:host { display: contents }` gives the wrapper no box — use `rootClass`.

### 6. What is missing to make this component reusable across pages?
- CVA (G1) + range (G2) — the two blockers for broad standalone use.
- View-mode switching (G3 — type already declared).
- Calendar systems / Hijri (G4).
- Wrapper method proxies for `setValue`/`navigate`/`goToToday`/`focus` (G5).
- `size`→cell-height tokens (G6).
- Per-cell `aria-label` + `aria-live` month announce (A1/A2).

### 7. What capability should be added to the shared component (not a page hack)?
- All of the above — the calendar is the date-picker's embedded grid, so anything fixed here ripples into every date field. Never fork per-page.

### 8. What flags / options / templates / slots would make it better?
- `mode` (single/range/multi) + `rangeChange` output.
- `viewMode` (wire the existing `FalconCalendarViewMode` type).
- `calendar` (gregorian/islamic-umalqura).
- `showToday` quick-jump.
- `prevMonthAriaLabel`/`nextMonthAriaLabel` wrapper inputs (currently Stencil-only).
- A custom-cell `<slot>` / cell-template.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** forward `prevMonthAriaLabel`/`nextMonthAriaLabel`; add `setValue`/`navigate`/`goToToday` method proxies; add per-cell `aria-label` + `aria-live`.
2. **Phase B (additive):** implement CVA on the wrapper (keep `(valueChange)`); add `--falcon-calendar-day-height-{sm,lg}` so `size` works.
3. **Phase C:** wire `viewMode` (type exists) → month/year grids.
4. **Phase D (breaking-ish, opt-in):** `mode='range'` — changes the value shape, so gate behind the flag.
5. **Phase E:** Hijri calendar system.

All Phase A-C are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- The `value` shape (`string | null` ISO) — the date-picker composition + any future consumer depends on it; range mode must NOT silently change it.
- The `falcon-change` event detail (`{ value, date }`) — the date-picker's `handleCalendarChange` reads `ev.detail.value` (`[CODE]` falcon-date-picker.tsx:150-154); changing the detail shape breaks the picker.
- The disabled-click short-circuit (tsx:103) — the date-picker relies on illegal cells being un-clickable.
- The `useTailwind=true` default — flipping it changes Light↔Shadow DOM and the focus-query target.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07). Recommendation: READY inline / NEEDS-UPGRADE for forms+range. Counts corrected: 15 wrapper `@Input`s, 3 `@Output`s (`(falconBlur)` dead). Composition coupling to the date-picker (`falcon-change` detail shape + disabled-click) noted as the main change-risk surface.
