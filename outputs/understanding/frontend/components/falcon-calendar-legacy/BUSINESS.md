# falcon-calendar (LEGACY FACADE) — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> ⚠ **LEGACY / ORPHAN component.** This dossier exists for deletion-review traceability, not as a build target.

## Business purpose
`[BRAIN-OUT]` This was the **PrimeNG-era date field** — the `<falcon-calendar>` selector that admin/management screens used before the Falcon UI Core date components existed. Its business job was a single date decision committed through an input field + popup grid, with an explicit **Set / Cancel** affordance so the operator could *preview* a date in the grid and only *commit* it on "Set".

`[BRAIN-OUT]` Per the existing dossier, Wave 3 was meant to convert it into a thin **façade** delegating to `<falcon-angular-date-picker>`, preserving the public API for latent consumers.

🟡 **Correction to the existing 6 dossier files** — see `INTEGRATION_VALIDATION.md`. The only `<falcon-calendar>` source that survives in the tree (`Falcon/deprecated-falcon-web-platform-ui/.../falcon-calendar.component.ts`) is **the original PrimeNG `<p-datepicker>` component WITH the Set/Cancel overlay still implemented** — *not* the Wave-3 façade the dossier describes. The active `falcon-web-platform-ui` repo contains **no copy at all**.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Effective-date validation for periodic pricing changes | `[CODE]` `falcon-calendar.component.ts:18,57-61` — `FalconEffectiveDateDirective` + `useEffectiveDateValidation` / `status` / `pricingType` / `renewDate` inputs | The component *carried* the inputs for this rule (`PricingType`, `renewDate`, `FalconItemStatus`) and applied `FalconEffectiveDateDirective` in its template. The existing dossier states these became **no-ops** in the Wave-3 façade. |
| `[MEMORY]` `InvalidEffectiveDateForPeriodicPricingChange` (Commerce — renew-day clamp) | `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17` | This legacy component was the original client-side guard for that backend rule, via the effective-date directive. The modern path moves this policy into the host flow's `validations.ts`. |
| `[INFERRED]` Commit-on-Set, not commit-on-select | `[CODE]` `falcon-calendar.component.ts:142-176` | Business intent of the Set/Cancel UX: a date is not a decision until the operator confirms it. The modern `<falcon-angular-date-picker>` deliberately dropped this — selecting a date *is* the commit. |

## Business constraints baked in
- `[CODE]` `falcon-calendar.component.ts:70-82,142-176` **Draft vs committed value separation** — `draftValue` is what the open grid shows; `committedValue` is the form value. The business invariant: an in-progress preview is *not* the form's value until "Set". The original PrimeNG version even intercepts `hideOverlay` (`falcon-calendar.component.ts:92-106`) so an outside-click cannot accidentally commit.
- `[CODE]` `falcon-calendar.component.ts:150-160` **Cancel / outside-click restores the snapshot** — abandoning the popup reverts to the value held when it opened. Business intent: no accidental date changes.
- 🟡 Per the existing dossier, the Wave-3 façade **dropped this Set/Cancel invariant** in favour of immediate-commit (`OVERVIEW.md` "Wave 3 accepted behavior change #1"). So the *legacy concept* and the *façade* disagree on this core business behavior.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[CODE]`/`[VAULT]` (historical) | admin-console pricing / effective-date fields | The PrimeNG-era date field with effective-date validation. |
| `[CODE]` Wave 7 consumer sweep | — | **0 consumers** in the active repo (`USAGE.md`, 2026-05-17). No live business flow uses it today. |

## Business gotchas
- `[INFERRED]` **Do not treat this as a usable component.** It is an orphan. Any new date-decision flow uses `<falcon-angular-date-picker>` (field + popover) or `<falcon-angular-calendar>` (inline grid). Picking `<falcon-calendar>` re-introduces a PrimeNG dependency that the platform is removing.
- `[INFERRED]` The five effective-date inputs (`useEffectiveDateValidation`, `visibility`, `status`, `pricingType`, `renewDate`) describe a real business rule, but in the façade form they are **silent no-ops** — a builder who wires them expecting validation gets nothing. The rule must instead be expressed in the host flow's `validations.ts`.
- `[INFERRED]` The Set/Cancel UX was a genuine business affordance (explicit confirmation of a date). If a future flow truly needs "preview then confirm", that is a feature request against `<falcon-angular-date-picker>`, not a reason to revive this component.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) — REMOVED from production RE-CONFIRMED (Glob of `falcon-calendar/` empty; 0 live consumers; in-tree barrel comment `shared-ui/index.ts:313` "Legacy FalconCalendarComponent façade deleted"). Migration targets `<falcon-angular-date-picker>`/`<falcon-angular-calendar>` live (index.ts:330/315). Historical capability rows 🟡 CODE-DERIVED / `[BRAIN-OUT]` from the deprecated-repo PrimeNG source + prior dossier; the façade-vs-original discrepancy is recorded in `INTEGRATION_VALIDATION.md` and is now moot (component removed). **Status: REMOVED.**
