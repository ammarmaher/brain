# falcon-calendar (LEGACY FACADE — REMOVED) — GAPS & UPGRADES

## RECONCILE 2026-06-03 (B22) — DELETION FLAG

`[CODE]` **The legacy `<falcon-calendar>` Angular component is DELETED from the production tree** (re-confirmed this pass). It was a Wave-3 ORPHAN with **0 consumers**, and the deletion is documented in source:
- `Glob libs/falcon/src/shared-ui/lib/components/falcon-calendar/**` → No files found.
- `shared-ui/index.ts:313` → comment "(Legacy FalconCalendarComponent façade deleted — see canonical-pattern §2.3: one Angular wrapper per Stencil component.)"
- `Grep "<falcon-calendar[\s>]"` (non-`dist`) → 0 legacy consumers (only the unrelated modern-Stencil docs + historical plans).

**Wave flag: DELETION CONFIRMED (already executed). No promotion. No HIGH-RISK-QUEUE item — 0 consumers blocked it.**

### Residual safe-local orphan (NOT this component, but related)
`[CODE]` `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` (selector `[falconEffectiveDate]`) survives as a **Wave-3 no-op validator** whose header comment references the deleted `<falcon-calendar>`. `validate()` always returns `null`. Grep confirms **0 consumers**. This is a `safe-local` dead-orphan candidate for cleanup (NOT touched this pass — READ-ONLY sweep). Logged in `FINDINGS/B22.md`.

---

## Historical gaps (all resolved by removal)

### 1. (was P0) `useEffectiveDateValidation` + friends were no-op
- 5 silent no-op inputs (`useEffectiveDateValidation`, `visibility`, `status`, `pricingType`, `renewDate`). **Resolved** — gone with the component. Re-express the rule via `disabledDates` on `<falcon-angular-date-picker>` or a `validations.ts` cross-field rule. (The standalone `FalconEffectiveDateDirective` no-op orphan above is the leftover.)

### 2. (was P0) Set/Cancel overlay UX dropped
- Accepted behavior change in the planned façade. **Resolved/moot** — if "preview-then-confirm" is genuinely needed, raise a footer action-bar feature on `<falcon-angular-date-picker>`; do NOT revive PrimeNG.

### 3. (was P1) `dateFormat` ignored
- Falcon date-picker owns display format. **Resolved** — configure the date-picker directly.

### 4. (was P1) `appendTo` ignored
- Modern popover auto-positions. **Resolved.**

### 5. (was P2) `placeholder` empty-state mismatch
- **Resolved/moot.**

## Rubric audit (§5) at removal
- **A — Angular 21:** legacy decorator `@Input`/`@Output`, plain fields (no signals), CVA present but pre-modern; monkey-patched PrimeNG `hideOverlay` (`(ref as any)`) — off-pattern. (Component gone; informational.)
- **B — Stencil dual-render:** N/A (single-render Angular over PrimeNG; no Shadow/`-tw` twin).
- **C — Falcon house rules:** imported `primeng/datepicker` + `primeng/api` — banned in new code (PrimeNG removal). Resolved by removal.
- **D — Accessibility:** delegated to PrimeNG / the modern date-picker.
- **E — Cross-framework parity:** none (no React/Vue twin). N/A.
- **F — Completeness/drift:** prior dossier already corrected (façade-vs-PrimeNG-original discrepancy, 2026-05-18); B22 re-verified. The shared `FalconEffectiveDateDirective` orphan is the only live residue.

## Missing tests
- None relevant — component removed.

## Recommended action
- **None for the component** (deleted). **Optional safe-local cleanup:** delete the orphaned `falcon-effective-date.directive.ts` (0 consumers) in a future cleanup wave, or re-implement its rule on the date-picker if effective-date validation returns. Keep this dossier as a historical migration map.

## Wave 7 Findings (2026-05-17)
**STATUS: ORPHAN.** No source files, no consumers, no module-federation references. Recommendation at the time: DELETE in Wave 8 cleanup. Successor: `falcon-calendar` (modern Stencil) / `falcon-date-picker`.

## Deep-Dive Sweep Findings (2026-06-03 — B22)
**Consumer count: 0** ([CODE] grep legacy `<falcon-calendar>` non-`dist` → 0 live). **DELETION CONFIRMED** — folder gone, barrel comment documents it. One related `safe-local` dead-orphan: `FalconEffectiveDateDirective` (0 consumers). All findings `safe-local` (dead-orphan/doc). See `FINDINGS/B22.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) — DELETION re-confirmed (Glob + grep + barrel comment). Historical gaps preserved as resolved-by-removal; the `FalconEffectiveDateDirective` orphan flagged `safe-local`. No HIGH-RISK-QUEUE.
