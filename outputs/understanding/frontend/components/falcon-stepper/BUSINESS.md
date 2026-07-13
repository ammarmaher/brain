# falcon-stepper — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

> **The live wizard rail (migration COMPLETE — 2026-06-03 correction).** This dossier describes `<falcon-angular-stepper>` — the Falcon-UI-core Stencil component (`falcon-stepper.tsx`) plus its Angular CVA wrapper. The prior dossier said the confirmed-working Add Client / Add User wizards still ran on a LEGACY bespoke stepper; that is now STALE. The legacy `dynamic-stepper` was DELETED 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13) and these flows now run on THIS component (21 occurrences / 13 files). Every business rule below is therefore ✅ production-carried, not 🟡 migration-pending.

## Business purpose
`[BRAIN-OUT]` The stepper is how Falcon tells an operator *where they are inside a multi-step business process and which steps they are still allowed to reach*. In business terms it is a **progress contract**: it visualizes the sequence of decisions a flow demands (Add Client → Information, Settings, Channels, Applications, Owner) and, in `linear` mode, enforces that the operator commits each decision in order. It is the visible spine of every Falcon wizard.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Wizard steps must be completed in order — a later step is not reachable until the prior steps are valid | `[BRAIN-OUT]` Add Client folder `README.md` (5-step wizard) + `[CODE]` `falcon-stepper.tsx:189-194` | `linear` mode: `resolveNavigationBlock()` rejects any click on a step beyond `activeIdx + 1` unless that step's value is already in `completedValues`. |
| Submit/advance is blocked while the current step's form is invalid | `[BRAIN-OUT]` Add Client folder `08-BACKEND_API.md` (server rejects partial payloads) + `[CODE]` `falcon-stepper.tsx:82,182-188` | `forwardLockedFrom` — a consumer-supplied array of step values from which *forward* navigation is rejected at the library level; bound to a computed of "current step invalid". |
| A completed step stays revisitable (the operator can go back and correct it) | `[CODE]` `falcon-stepper.tsx:190-191` | Even in `linear` mode, any value in `completedValues` is always navigable; back navigation is never blocked. |
| Optional steps are visually marked, not silently skippable | `[CODE]` `falcon-stepper.tsx:317-319`, `falcon-stepper.utils.ts:90` | `step.optional` renders an "Optional" tag and appends "(optional)" to the dot's aria-label. |
| A broken step must be visible as broken | `[CODE]` `falcon-stepper.utils.ts:75` (`resolveStepState` → `error`) | `step.errorMessage` flips the dot to the `error` state (red) so the operator sees which step failed validation. |

## Business constraints baked in
- `[CODE]` `falcon-stepper.tsx:189-194` **Linear gate** — in `mode="linear"` the only reachable steps are: the active step, any completed step, or the immediate next step. This is the "complete-in-order" business invariant. A builder must NOT switch a required-validation wizard to `non-linear`.
- `[CODE]` `falcon-stepper.tsx:82,180-188` **Forward-lock = "this step isn't done yet"** — `forwardLockedFrom` is the explicit business gate. When the current step's form is invalid, the consumer adds the current value to `forwardLockedFrom`; the stepper then rejects forward clicks *without mutating `activeValue`* (no visual flash) and emits `falcon-navigation-blocked` with reason `forward-locked` so the consumer can reveal field errors. ✅ This is the canonical step-gating mechanism the Add Client / Add User wizards require.
- `[CODE]` `falcon-stepper.tsx:166` **No-op on same-step click** — `applyChange` returns early if the target equals the current value; re-clicking the active dot is a deliberate no-business-event.
- `[CODE]` `falcon-stepper.tsx:108-110` **First enabled step auto-activates** — when `activeValue` is null and steps exist, `componentWillLoad` selects the first non-disabled step. A flow always starts at step 1, never at "nothing selected".
- `[INFERRED]` **`completedValues` is the submit gate's mirror** — a wizard's "can Finish" decision is "every step value is in `completedValues`". The stepper does not compute this; the consumer (or `<falcon-angular-wizard>`) does.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard (5 steps) | org-hierarchy-page (admin) | Progress spine: Information → Settings → Channels → Applications → Owner. Linear-gated. ✅ live on THIS component (`[CODE]` add-client-wizard.component.html:54). |
| Add User wizard | org-hierarchy-page (admin + mgmt) | Progress spine for the Add User flow (personal → role/status → permissions). ✅ live. |
| Templates wizard | templates-page (admin + mgmt) | Step rail for message-template authoring. ✅ live (`[CODE]` templates-wizard.component.html:93). |
| Contracts Add wizard | contracts-cost-management (admin) | Step rail for contract creation. ✅ live. |
| Create Contact Group | contact-groups (mgmt) | Step rail for contact-group creation. ✅ live. |

## Business gotchas
- A blocked forward click is a **business statement** ("you have not finished this step"), not a UI bug — it intentionally does not advance and does not flash. Builders must listen to `falcon-navigation-blocked` and surface *why* (toast / field errors), otherwise the operator sees a dead click.
- `linear` vs `non-linear` is a business decision, not a styling choice: `non-linear` means *every step is independent and order does not matter*. A flow whose later steps consume earlier-step data (Add Client Owner step needs the account from Information) MUST be `linear`.
- A red dot (`step.errorMessage`) tells the operator a step failed — but the message text itself is NOT rendered next to the label (see `GAPS_AND_UPGRADES.md` item 6). The operator must open the step to learn the reason. Do not rely on the stepper alone to explain a validation failure.
- The stepper is presentation + navigation-gating only. It does **not** save, submit, or validate forms — that is the wizard wrapper / consumer. Treating the stepper as the owner of submit logic is the most common architectural mistake.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) from `[CODE]` `falcon-stepper.tsx` + `falcon-stepper.utils.ts` (read in full) + the live consumer templates. Step-gating rules (`linear` mode, `forwardLockedFrom`, completed-step revisit) ✅ VERIFIED against source. **Drift corrected:** this component now CARRIES the Add Client / Add User / Templates / Contracts / Contact-Group production traffic (migration off the deleted legacy stepper is DONE) — the 🟡 "migration-pending" markers in the prior dossier are removed.
