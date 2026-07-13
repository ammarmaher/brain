# falcon-calendar (LEGACY FACADE — REMOVED) — OVERVIEW

> **RECONCILE 2026-06-03 (B22):** The legacy `<falcon-calendar>` Angular component is **DELETED from the production tree** — re-confirmed this pass. The active `falcon-web-platform-ui` repo carries no `<falcon-calendar>` source; the in-tree barrel comment states it plainly. This dossier is a **historical record + migration map**, status corrected to REMOVED.

## Live-code status (2026-06-03)
- `[CODE]` `Glob libs/falcon/src/shared-ui/lib/components/falcon-calendar/**` → **No files found.** Not among the 14 `shared-ui/lib/components/` folders.
- `[CODE]` **In-tree confirmation:** `libs/falcon/src/shared-ui/index.ts:313` carries the comment *"(Legacy FalconCalendarComponent façade deleted — see canonical-pattern §2.3: one Angular wrapper per Stencil component.)"* — the deletion is documented in source.
- `[CODE]` `Grep "<falcon-calendar[\s>]"` across the repo (excluding `dist/`) → **0 live consumers.** Hits are: `apps/host-shell/src/assets/component-docs/calendar.md` (docs for the **NEW Stencil `<falcon-calendar>`** component in `falcon-ui-core`, a DIFFERENT artifact), and `docs/_plans/.w33b-codex-review.txt` / `docs/archive/` (historical planning). None is the legacy `libs/falcon` component.
- `[CODE]` **Residual related orphan:** `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` still exists (a Wave-3 no-op validator whose header comment references the now-deleted `<falcon-calendar>`). It has 0 consumers (grep clean) — a `safe-local` dead-orphan, NOT a blocker.
- `[CODE]` **Naming caveat:** the live `falcon-ui-core` Stencil `<falcon-calendar>` (Shadow `falcon-calendar.tsx` + Light `falcon-calendar-tw.tsx` + `FalconAngularCalendarComponent`) is an UNRELATED modern component that happens to reuse the tag name. The DELETED artifact here is the bespoke **`libs/falcon` PrimeNG-era** `<falcon-calendar>` (selector `falcon-calendar`, class `FalconCalendarComponent`). Do not confuse them.

**Verdict: DEPRECATED → REMOVED. Migration targets `<falcon-angular-date-picker>` (field) + `<falcon-angular-calendar>` (inline grid) are live. Safe — 0 consumers at every sweep; removal carried zero risk. NO HIGH-RISK-QUEUE item.**

---

## Historical record (component as it last existed)

## Purpose
Per the original dossier, Wave 3 was meant to convert the legacy `<falcon-calendar>` selector into a thin **façade** delegating to `<falcon-angular-date-picker>` (Falcon UI core), preserving public inputs/outputs 1:1, with two accepted behavior changes:
- Set/Cancel overlay UX → replaced by immediate-commit on date select.
- `useEffectiveDateValidation` / `falconEffectiveDate` directive → no-op (no consumers used it).

`[BRAIN-OUT]` **However** — the only `<falcon-calendar>` source a prior agent could find was the **pre-façade PrimeNG `<p-datepicker>` original** (in a separate `deprecated-falcon-web-platform-ui` repo), WITH the Set/Cancel overlay still implemented and `FalconEffectiveDateDirective` applied for real. Either the Wave-3 façade was never committed to production or it was deleted; the production tree has **no copy of either**. Both narratives resolve to the same B22 verdict: REMOVED.

> **Single-render legacy Angular** — bespoke Angular standalone component in `libs/falcon/src/shared-ui` wrapping PrimeNG `<p-datepicker>`, **NOT a Stencil dual-render component.** NO Shadow tag, NO `-tw` twin, NO token file of its own. The B/C/E Stencil-twin rubric dimensions do not apply.

## Business / UI use case
- Latent consumers from the PrimeNG-era `<p-calendar>` API still on `<falcon-calendar>`. (Wave 7 + B22 = 0 live consumers.)

## When to use it / when NOT to use it
- DO NOT use for any code. For date fields use `<falcon-angular-date-picker>`; for an inline grid use `<falcon-angular-calendar>`.

## Status
- **REMOVED (2026-06-03).** Was a LEGACY FACADE / ORPHAN (Wave 3); deleted (barrel comment confirms).

## Replaces
- PrimeNG-era `<p-datepicker>` / `<p-calendar>` date field (PrimeNG removal program).

## Migration targets (replaced BY)
- `<falcon-angular-date-picker>` (`FalconAngularDatePickerComponent`, `shared-ui/index.ts:330`) — field + popover, CVA, min/max, disabled-dates. Primary replacement.
- `<falcon-angular-calendar>` (`FalconAngularCalendarComponent`, `shared-ui/index.ts:315`) — single-month inline grid (lower-level building block).

## Source paths (as last present — now DELETED from production)
| Layer | Path (no longer in `falcon-web-platform-ui` 2026-06-03) |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/falcon-calendar/falcon-calendar.component.ts` |
| Template | `…/falcon-calendar.component.html` |
| Barrel | `…/index.ts` |

> `[CODE]` 2026-06-03 — every path returns "No files found" in the production repo. The only surviving copy is the pre-façade PrimeNG original in the separate `deprecated-falcon-web-platform-ui` repo (out of this sweep's production scope). No `calendar.tokens.css` for the LEGACY component (the modern Stencil calendar has its own `calendar.tokens.css` — unrelated).

## Selectors / tags
| Layer | Tag / selector |
|---|---|
| Angular selector (deleted) | `falcon-calendar` (class `FalconCalendarComponent`) — collides by name with the unrelated modern Stencil `<falcon-calendar>` |
| Stencil tag | _None — the LEGACY component was single-render Angular over PrimeNG._ |

## Known consumers (grep verified 2026-06-03)
- **0** — `[CODE]` no live template binds the legacy `<falcon-calendar>`. (Wave 7 also recorded 0.)

## Related components
- `<falcon-angular-date-picker>` + `<falcon-angular-calendar>` — modern replacements (migration targets).
- `FalconEffectiveDateDirective` (`falcon-effective-date.directive.ts`) — the legacy effective-date validator that paired with this component; still present as a Wave-3 no-op orphan.

## Ownership / responsibility
- Was legacy `libs/falcon/src/shared-ui`. Wrapped a Date↔ISO yyyy-mm-dd string conversion at the CVA boundary. Ownership retired.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22 RECONCILE). Component **confirmed DELETED** from production (Glob of folder empty; 0 live consumers; barrel comment at index.ts:313 explicitly states the façade was deleted). Migration targets `<falcon-angular-date-picker>` + `<falcon-angular-calendar>` confirmed live (index.ts:330/315). Historical-record section 🟡 CODE-DERIVED / `[BRAIN-OUT]` from the prior dossier + the deprecated-repo source.
