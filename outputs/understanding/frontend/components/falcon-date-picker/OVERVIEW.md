# falcon-date-picker — OVERVIEW

## Component purpose

A labeled text field anchored to a popover that composes `<falcon-angular-calendar>` for date selection. The input shows the selected date as an ISO `YYYY-MM-DD` string; clicking the field opens the popover with the embedded month grid; selecting a day commits and closes; clicking outside or pressing Escape closes. `[CODE]` falcon-date-picker.tsx:1-4 header: "Input field + popover with embedded `<falcon-calendar>`. Outside-click closes." Two render paths with **materially different popover mechanics** (see below).

## Business / UI use case

- Date entry in forms (start date, expiration date, effective date, birth date).
- The canonical date-input UX across the consoles — `[CODE]` it replaced PrimeNG `<p-calendar>` and the deleted `FalconCalendarComponent` façade.
- Heaviest live use: the **contracts-cost-management** wizard (Start Date / Expiration Date) in admin-console + the shared **service-pricing-table** effective-date field.

## When to use it / when NOT to use it

**Use it for:** any date entry where a compact input + popover UX is wanted (the default for forms).

**Do NOT use it for:**
- Inline always-visible calendar → `<falcon-angular-calendar>`.
- Reactive Forms with `[(ngModel)]`/`formControlName` → the wrapper has **no CVA** (GAP G1); bridge `(valueChange)` or wrap in a CVA directive.
- Date range → not supported; compose two pickers + cross-validate (GAP G2).
- Date + time → no time picker (GAP G3).
- A `DD MMM YYYY` display → the field always shows ISO (GAP G4).
- Hijri-only locales → convert externally + pass ISO (GAP G5).

## Status

**ACTIVE / PREFERRED.** Replaced PrimeNG `<p-calendar>`; the legacy `<falcon-calendar>` façade that used to delegate here has been **DELETED** (`[CODE]` `libs/falcon/src/shared-ui/index.ts:312`). Mandatory for new date fields.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-date-picker/falcon-date-picker.component.ts` (202 ln — includes Top-Layer acquire logic) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-date-picker/falcon-date-picker.component.html` (65 ln — `@if useTailwind` tag-switcher + `[slot=icon-left]` projection) |
| Angular wrapper CSS | `.../falcon-date-picker.component.css` (layout-only) |
| Angular barrel | `.../falcon-date-picker/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-date-picker/falcon-date-picker.tsx` (270 ln, `shadow: true` — CSS-anchored popover, NOT portaled) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-date-picker/falcon-date-picker.css` (143 ln, token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx` (411 ln, `shadow: false` — **portal-to-body** popover) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.css` (5 ln — `:host { display: block }` workspace trap fix) |
| Types | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.types.ts` (SHARED with calendar) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/date-picker-tailwind-classes.ts` (165 ln — 9 class-builders mirroring the Shadow CSS selector-for-selector) |
| Component token file | `libs/falcon-ui-tokens/src/components/calendar.tokens.css` (237 ln — SHARED with calendar; gate-12 portaled-popover file incl. `.falcon-overlay-container`) |
| Portal utility | `libs/falcon-ui-core/src/utils/popover-portal.ts` (`ensurePortaled` / `positionPopoverFixed` / `removeFromOverlay` / `restoreFromOverlay` — used by the `-tw` variant) |
| Stacking service | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts` (`FalconStackingService` — Top-Layer registration) |
| Stencil unit spec | **NONE** (`[CODE]` grep 2026-06-03) |
| Stencil e2e | **NONE** (`[CODE]` grep 2026-06-03) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-date-picker` |
| Stencil Shadow tag | `<falcon-date-picker>` |
| Stencil Light tag | `<falcon-date-picker-tw>` |

## Two render paths — NOT behaviorally identical

`[CODE]` This is the critical OVERVIEW fact: the two paths differ in popover mechanics, and only one is fully fixed.
- **`-tw` (default, `useTailwind=true`)** — portals the popover into the body-level `.falcon-overlay-container` (`ensurePortaled` + `positionPopoverFixed`, falcon-date-picker-tw.tsx:224-267); the focus-vs-click RC#4 bug is **fixed** (focus no longer opens — falcon-date-picker-tw.tsx:149-167); the Angular wrapper additionally promotes the portaled panel into the native **Top Layer** via `FalconStackingService` (falcon-date-picker.component.ts:154-187).
- **Shadow (`useTailwind=false`)** — popover is a CSS-anchored `position:absolute; top:100%` child (falcon-date-picker.css:124-128), does NOT portal, and **still has the RC#4 first-click bug** (`handleInputFocus` still calls `openInternal('input')`, falcon-date-picker.tsx:125-128). **Prefer the default `useTailwind=true`.** See `INTEGRATION_VALIDATION.md` + `[BRAIN-OUT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`.

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-date-picker` across `apps/` = **2 files**, `libs/falcon/` = **2 files** (one a no-op directive comment). Live render sites:
- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contract-information-step/contract-information-step.component.html` — **Start Date + Expiration Date** (`[CODE]` :37,48; the flagship live consumer).
- `apps/admin-console/.../contracts-cost-management/components/contracts-edit-contract/contracts-edit-contract.component.html`.
- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:235` — effective-date field, with a per-instance token override via `style=` (`[CODE]` :238).
- `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` — slug appears only in a Wave-3 no-op-stub comment (not a render).

> `[CODE]` CORRECTION (2026-06-03): the prior dossier's 2026-05-17 consumers (applications-table, falcon-table-edit-row, playground, the legacy `falcon-calendar` façade) are **gone/migrated**. The live consumers are now the contracts wizard + service-pricing-table. See `USAGE.md` Consumer Sweep.

## Related components

- **Composes:** `<falcon-angular-calendar>` (embeds `<falcon-calendar>` / `<falcon-calendar-tw>` in its popover).
- **Sibling form control:** `<falcon-angular-input>` — same field height / border / focus-ring DNA + the `iconLeft` slot API.
- **Shares the type + token layer with:** `<falcon-angular-calendar>`.
- **Portal sibling family:** `<falcon-dropdown-tw>`, `<falcon-multi-select-tw>`, `<falcon-phone-field-tw>` — the four `portalToOverlay` popovers (`[BRAIN-OUT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract lives in `libs/falcon-ui-tokens` (shared `calendar.tokens.css`). No React/Vue wrapper (`[CODE]` grep — Stencil-core + Angular-wrapper only).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07 sweep). Source-file table re-confirmed (wrapper 202 ln / Shadow 270 ln / `-tw` 411 ln). Added the full source-file table (portal util / stacking service / tailwind-helper / both Stencil CSS were missing). Drift corrected: consumers are now the contracts wizard + service-pricing-table (was applications-table/playground/legacy-facade); the two-render-path behavioral divergence (RC#4 fixed only on `-tw`) elevated to OVERVIEW.
