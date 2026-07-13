# falcon-stepper — GAPS & UPGRADES

## Resolved since prior dossier (2026-06-03 — B21)

### ✅ G1 — Real consumers migrated (was P0 "not migrated yet")
- **RESOLVED.** The prior dossier's headline gap — "wizards still on the legacy bespoke stepper" — is closed. The legacy `dynamic-stepper` was DELETED 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13) and `<falcon-angular-stepper>` is now live across **21 occurrences / 13 files**: Add Client / Add User (admin + mgmt), Templates wizard (admin + mgmt), Contracts Add (admin), Create Contact Group (mgmt). The component has carried production traffic.

### ✅ G5 — Forward-navigation validation hook shipped (was P2 "no validation hook")
- **RESOLVED.** The Stencil component + wrapper now expose `forwardLockedFrom: ReadonlyArray<string|number>` (`[CODE]` falcon-stepper.component.ts:111, falcon-stepper.tsx:83) — a consumer-driven gate that rejects forward clicks from any locked step value WITHOUT mutating `activeValue` (no flash), and emits `falcon-navigation-blocked` (reason `'forward-locked'`) re-surfaced as the wrapper `@Output() navigationBlocked` (`[CODE]` ts:124). The live wizards bind `[forwardLockedFrom]="forwardLockedFrom()"` + `(navigationBlocked)="…"`. The earlier note "only the wizard wrapper has it" is obsolete — the bare stepper now gates forward nav itself.

## Still-missing capabilities

### G2 (P1) No per-step custom indicator slot
- **Gap:** dot content is hard-coded (number / check / pulse / icon). No `ng-template` / slot for a fully custom dot (e.g. a small avatar).
- **Recommendation:** add `<slot name="dot-{value}">` in Stencil + a matching `[falconStepperDot]` directive on the Angular wrapper; query `@ContentChildren` and render the template into the slot, falling back to current logic.

### G3 (P1) No per-step custom label slot
- **Gap:** label text is `step.label` only. No slot for label + chip + tooltip.
- **Recommendation:** add `<slot name="label-{value}">` + matching Angular directive (same pattern as G2).

### G4 (P2) `step.icon` collides with number/active rendering
- **Gap:** `[CODE]` `renderDotContent()` (falcon-stepper.tsx:272-309) shows `step.icon` only when `state !== 'active'`; on the active step the icon is hidden in favour of the pulse — inconsistent semantics if a consumer expects a persistent icon.
- **Recommendation:** treat `icon` as a full replacement for the number/pulse, or add an `iconBehavior: 'always' | 'when-completed' | 'when-non-active'` prop.

### G6 (P2) `errorMessage` shows under the WHOLE stepper, but per-step error has no visual error message location
- **Gap:** `step.errorMessage` paints the dot red but the message text is invisible. Users see "this step is broken" but no hint of why.
- **Recommendation:** render `step.errorMessage` either as a tooltip on the dot OR inline next to the per-step label (`<span class="falcon-stepper-step-error">`). Add `--falcon-stepper-step-error-*` tokens.

### G7 (P2) Vertical orientation does not support `labelPosition`
- **Gap:** `labelPosition` is honored only in horizontal mode. Vertical always renders labels beside the dot (effectively `'side'`).
- **Recommendation:** support `labelPosition="top"` for vertical.

### G8 (P2) No "click on completed step jumps to it" affordance signal
- **Gap:** completed dots are clickable but there's no hover-cursor change / visual hint.
- **Recommendation:** add `cursor: pointer` + a `:hover` token state for completed dots; document that completed dots are interactive even in linear mode.

### G9 (P3) No "Pause/Resume" / in-progress semantics
- **Gap:** no way to mark a step "in progress" distinct from "active" (for long async work).
- **Recommendation:** add `step.status?: 'in-progress'` for fine-grained dot decoration.

### G10 (P3) No `currentPageReportTemplate`-style helper for "Step X of Y"
- **Gap:** consumers must build this string manually.
- **Recommendation:** expose a `stepIndicatorFormat?: string` Prop with `{current}` / `{total}` tokens, rendered above or below the stepper as opt-in.

## Missing accessibility features
- **(P1) `role="region"` panels are not always announced.** When orientation switches mid-flight, the hidden/active panel transition may not trigger an SR re-announce. Recommendation: bump a unique `aria-labelledby` per orientation change.
- **(P1) Vertical mode does not expose the `aria-orientation="vertical"` attribute on the outer `<div role="group">`.** Recommendation: add `aria-orientation={this.orientation === 'vertical' ? 'vertical' : 'horizontal'}`.
- **(P2) No `aria-describedby` linking to `helperText` when present.** Recommendation: assign an ID to the helper `<p>` and reference it via `aria-describedby` on the outer group.
- **(P2) The dot button announces `aria-current="step"` only on active; it would be richer to announce "Completed, step 2 of 5" via combined label.** Recommendation: extend `stepAriaLabel()` to include the state descriptor.

## Missing tests
- _None observed in active source._ No `*.spec.ts` next to the wrapper or Stencil file. Wider gap: the parity audit between Shadow and Light DOM rendering is not exercised by automated tests.
- Recommendation: add Vitest tests for:
  - `resolveStepState()` matrix (upcoming/active/completed/error/disabled).
  - `computeFillPercent()` (edge cases: empty steps array, single step, all completed).
  - Keyboard navigation (Arrow keys, Home, End).
  - Linear mode `canNavigateTo()` rules.
  - Shadow/Light parity (snapshot the DOM under both modes).

## Missing Tailwind / token parity
- `[CODE]` **`labelPosition` default asymmetry** — `falcon-stepper-tw.tsx:85` defaults `'bottom-center'` (Wave 10D) while `falcon-stepper.tsx:69` (Shadow) + the wrapper (`falcon-stepper.component.ts:100`) default `'top-center'`. For the same `[steps]` with NO explicit `labelPosition`, the two render paths place labels differently. Mitigated in practice because every live consumer passes `labelPosition="bottom-center"` explicitly, AND `useTailwind=true` (the `-tw` path) is the default — so the asymmetry is latent, not active. **Recommendation:** align defaults (pick `'bottom-center'` for React parity) and document. **G5/forwardLockedFrom parity is OK** — both render paths implement `resolveNavigationBlock()` identically (`[CODE]` falcon-stepper.tsx:176-196 ≡ falcon-stepper-tw.tsx:183-203).

## Performance risks
- `_steps` setter pushes to the live element on every parent ref change. If the parent component re-creates the array on every CD cycle, this re-renders the dot row each time. Currently mitigated by `OnPush` + immutable signals in real consumers, but a `trackBy(value)` semantic is missing inside Stencil's `this.steps.map()`. The Stencil `key={String(step.value)}` is present (good), but if `step.value` changes (which it shouldn't) the dot would re-create instead of reuse.

## Visual / interaction risks
- The 18 px solid-fill dot has NO border ring — fill IS the state. This is fine for `bg-active` vs `bg-upcoming` contrast but breaks down in dark mode if `--falcon-stepper-circle-bg-upcoming` is not overridden. Dark mode override is missing in `stepper.tokens.css`.
- The pulse animation runs continuously when `showStepNumbers=false` and the dot is active. On reduced-motion preference users (prefers-reduced-motion: reduce), this should pause. _None observed in active source._

## Reusable upgrade priority — fix in shared component vs per-page
- All of G2–G10 SHOULD be implemented in the shared Falcon component, NOT per-page. Per-page workarounds (custom CSS, overlay buttons, bespoke validation gates) would fragment the visual contract.

## Workaround availability
- For validation gating: ALREADY shipped — use `[forwardLockedFrom]` + `(navigationBlocked)` on the bare stepper (G5 resolved). For the full Next/Back/Finish UX, use `<falcon-angular-wizard>` which composes this stepper.

## Recommended upgrade priority
| ID | Title | Priority |
|---|---|---|
| G2 | Per-step custom dot slot + `[falconStepperDot]` | P1 |
| G3 | Per-step custom label slot | P1 |
| G6 | Inline per-step error message text | P2 |
| (parity) | Align `labelPosition` default Shadow↔`-tw` | P2 |
| (a11y) | `aria-orientation` on outer group for vertical | P1 |
| (tokens) | Dark-mode `--falcon-stepper-*` overrides | P2 |
| G7 | `labelPosition` honored in vertical | P2 |

## Wave 7 Findings (2026-05-17)
**Consumer count: 5.** Superseded by the B21 sweep below.

## Deep-Dive Sweep Findings (2026-06-03 — B21)
**Consumer count: 21 app occurrences / 13 files** (`[CODE]` grep `<falcon-angular-stepper`).
Drift corrected vs prior dossier (component stays ACTIVE/PREFERRED):
- **G1 RESOLVED** — legacy `dynamic-stepper` deleted 2026-05-17; this component now carries all wizard traffic (Add Client/User, Templates, Contracts, Contact Group).
- **G5 RESOLVED** — `forwardLockedFrom` + `navigationBlocked` shipped (consumer-driven forward-nav gate).
- **API drift fixed** — `navigationBlocked` IS the 4th wrapper `@Output`; `showStepNumbers` default is `false` (not `true`); `playground.page.html` consumer removed.
- **No new structural gaps.** Remaining items G2/G3/G4/G6–G10 + the `labelPosition` default asymmetry are all `safe-local` (additive). See FINDINGS/B21.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) against all source layers. G1 + G5 closed (migration done; validation gate shipped). No deletion/promotion flags — component stays ACTIVE/PREFERRED.
