# falcon-calendar — OVERVIEW

## Component purpose

Single-month inline calendar grid (Stencil dual-render web component) with date selection, `min`/`max` bounds, a disabled-dates predicate/array, a configurable first-day-of-week, an `Intl`-driven locale, optional ISO week numbers, and a per-cell disabled-slash overlay. Used standalone for inline date selection or composed inside `<falcon-angular-date-picker>` for the popover variant. `[CODE]` falcon-calendar.tsx:1-5 header: "Single-month grid mirroring React V0.2 admin/styles.css:2767-2865 1:1. No range mode, no multi-select."

## Business / UI use case

- Inline (always-visible) date selection on a detail panel or design surface.
- The decision grid embedded inside `<falcon-angular-date-picker>` — `[CODE]` falcon-date-picker.tsx:251-263 (Shadow) / falcon-date-picker-tw.tsx:392-404 (`-tw`) renders `<falcon-calendar>` / `<falcon-calendar-tw>` inside the popover.

## When to use it / when NOT to use it

**Use it for:**
- An always-visible month grid with no input field (inline date selection).
- The composition target inside a date field — but in that case you use `<falcon-angular-date-picker>`, which embeds this for you.

**Do NOT use it for:**
- Date entry with an input field + popover → `<falcon-angular-date-picker>` (composes this).
- Date range / multi-select → single-month single-date grid only (`[CODE]` falcon-calendar.tsx:1-5 — "No range mode, no multi-select"; GAP G2).
- Reactive-Forms / `[(ngModel)]` binding → the wrapper has **no CVA** (GAP G1) — use `<falcon-angular-date-picker>` for that path.

## Status

**ACTIVE** as the Stencil-paired component. The legacy **`FalconCalendarComponent` façade** (formerly `libs/falcon/src/shared-ui/lib/components/falcon-calendar/`) that the prior dossier flagged as a cross-link **has been DELETED** — `[CODE]` `libs/falcon/src/shared-ui/index.ts:312-315`: "Legacy FalconCalendarComponent façade deleted — see canonical-pattern §2.3"; `libs/falcon` now re-exports `FalconAngularCalendarComponent` from `@falcon/ui-core/angular` directly. So there is no longer a competing legacy calendar component — this is the only one.

## Replaces

- `[CODE]` `libs/falcon/src/shared-ui/index.ts:311-315` — the deleted PrimeNG-migration façade `FalconCalendarComponent`. The grid itself mirrors the React V0.2 reference `admin/styles.css:2767-2865` (`[CODE]` falcon-calendar.tsx:1-2).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.ts` (118 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.html` (41 ln — pure `@if useTailwind` tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.css` (`:host { display: contents; }` — 3 ln, layout-only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.tsx` (267 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.css` (198 ln, token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-calendar-tw/falcon-calendar-tw.tsx` (283 ln, `shadow: false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.types.ts` (35 ln — SHARED with date-picker) |
| Utils | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.utils.ts` (149 ln — pure grid/date helpers, shared by both render paths AND date-picker) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/calendar-tailwind-classes.ts` (207 ln — 11 class-builders; ALSO re-exports the date-picker helpers) |
| Component token file | `libs/falcon-ui-tokens/src/components/calendar.tokens.css` (237 ln — SHARED with date-picker; portaled-popover gate-12 file, includes `.falcon-overlay-container`) |
| Stencil unit spec | **NONE** (`[CODE]` grep 2026-06-03 — no `falcon-calendar*.spec.ts`) |
| Stencil e2e | **NONE** (`[CODE]` grep 2026-06-03 — no `falcon-calendar*.e2e.ts`) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-calendar` |
| Stencil Shadow tag | `<falcon-calendar>` |
| Stencil Light tag | `<falcon-calendar-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-calendar` across `apps/` = **0 files**; across `libs/falcon/` = **0 render sites** (the one match, `falcon-effective-date.directive.ts`, is a Wave-3 no-op stub referencing the slug only in a comment — `[CODE]` falcon-effective-date.directive.ts:1-7). The prior dossier's 2026-05-17 consumers (`applications-table.component.ts` + `playground.page.html`) are **GONE** — applications-table now uses `<falcon-angular-date-picker>`, and the playground route was removed.

The component's only live render sites are:
- **Composition** — embedded by `<falcon-date-picker>` / `<falcon-date-picker-tw>` (`[CODE]` falcon-date-picker.tsx:251 / falcon-date-picker-tw.tsx:392). This is the dominant real usage.
- **Re-export** — `libs/falcon/src/shared-ui/index.ts:315` re-exports `FalconAngularCalendarComponent` from `@falcon/ui-core/angular`.
- **Showcase / Studio gallery** — `'falcon-calendar' / 'falcon-calendar-tw'` listed as showcase variant tiles (`[CODE]` host-shell `.../gallery/showcase-variant-tile.component.ts:35,55`; `falcon-studio` gallery-defaults.ts; `falcon-ui-showcase-data/src/docs/calendar.md`). Not a business flow.

See `USAGE.md` Consumer Sweep for the enumerated list. **Net: zero direct app-feature consumers; the component lives almost entirely through the date-picker composition.**

## Related components

- **Composed by:** `<falcon-angular-date-picker>` (the input + popover variant embeds this grid).
- **Shares the type + token + util layer with:** `<falcon-angular-date-picker>` — `falcon-calendar.types.ts`, `calendar.tokens.css`, and `falcon-calendar.utils.ts` are all jointly owned.
- **Sibling date specialists:** none yet (no range / month / year picker exists — GAP G2/G3).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract lives in `libs/falcon-ui-tokens` (shared `calendar.tokens.css`). No React/Vue wrapper exists (`[CODE]` grep — Stencil-core + Angular-wrapper only; cross-framework parity GAP).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07 sweep). Source-file table re-confirmed on disk (wrapper 118 ln / Shadow 267 ln / `-tw` 283 ln / utils 149 ln / tokens 237 ln). Drift corrected vs prior dossier: legacy façade is DELETED (not "out-of-scope cross-link"); consumer count is now **0** direct (was 2); added the full source-file table (utils / tailwind-helper / wrapper-css were missing). The component is REAL but used only via the date-picker composition + showcase.
