# falcon-stepper (LEGACY) — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.
> ⚠️ **LEGACY — DELETED COMPONENT.** This dossier documents a component that **no longer exists in the codebase.**

## Status correction (read first)
`[CODE]` `ls libs/falcon/src/shared-ui/lib/components/falcon-stepper` → **No such file or directory** (verified 2026-05-18). `[CODE]` `find libs/falcon/src -name "*stepper*"` → **0 results.**

The legacy bespoke Angular stepper was **fully deleted** — confirmed by `[MEMORY]` `project_falcon_stepper_legacy_deletion_2026_05_17.md` (Wave 7.13). The existing UI-layer dossiers in this folder are **internally contradictory**: `OVERVIEW.md` / `API.md` / `USAGE.md` (early sections) describe it as "LEGACY-IN-USE" with live wizard consumers, while the Wave 7 findings at the *end* of `USAGE.md` and `GAPS_AND_UPGRADES.md` correctly state "ORPHAN — source code deletion already completed in Wave 7.13." **The live filesystem confirms the Wave 7 findings: the component is gone.** Per the task rule, the old 6 files are left unedited; this correction lives here.

## Business purpose (historical)
`[BRAIN-OUT]` The legacy `<falcon-stepper>` was the **wizard step-rail** for Falcon's multi-step creation flows — Add Client and Add User. In business terms it answered "where am I in this multi-step task, and how much is left?" It rendered a horizontal dot rail with idle/active/done states, a fill bar showing progress percentage, a per-step content panel, and a Next/Back/Cancel/Finish footer. It was the visual spine of the wizard: each dot a business sub-task, the rail the commitment journey from "start" to "saved."

## PRD / business rules touched (historical)
| Rule | Source | How the legacy component enforced / surfaced it |
|---|---|---|
| Multi-step creation is linear — you cannot skip ahead with an invalid step | `[API]` `linear` input (default `true`) + `valid` input gating Next | When `linear=true`, only `done` dots were clickable backward; an `idle` (future) dot was inert. `[valid]=false` disabled the Next button — the operator could not advance past an incomplete step. |
| The Add Client wizard is a 5-step commitment | `[BRAIN-OUT]` understanding/pages/organization-hierarchy/Add Client | The stepper rendered exactly the steps supplied via `<falcon-step>` directives; the wizard combined `step1Valid()…step5Valid()` into `isCurrentStepValid()` fed to `[valid]`. |
| Add User is a 3-step commitment | `[BRAIN-OUT]` understanding/pages/organization-hierarchy/flows/Add User | Same pattern, 3 steps (personal / role-status / permissions). |

## Business constraints baked in (historical)
- `[API]` Dot states were `idle` / `active` / `done` only — **no `error` state.** A step that failed validation looked identical to one not yet visited. The modern replacement `<falcon-angular-stepper>` adds a per-step `errorMessage` that paints the circle red (`[CODE]` falcon-stepper.types.ts:25).
- `[API]` Every label ran through `TranslatePipe` — translation was *mandatory*; the business could not show a literal label without registering an i18n key.

## Business flows that used this component (now migrated)
| Flow | Page | Role (historical) |
|---|---|---|
| Add Client wizard | organization-hierarchy (admin-console + management-console) | 5-step rail |
| Add User wizard | organization-hierarchy (admin-console + management-console) | 3-step rail |

`[MEMORY]` These flows are now built on the modern `<falcon-angular-stepper>` / `<falcon-angular-wizard>`. The Add Client / Add User wizards confirmed working by the user (2026-05-18) run on the **modern** stepper — see `INTEGRATION_VALIDATION.md`.

## Business gotchas
- **Do not plan, design, or scope any work against this component** — it does not exist. Any task mentioning "the stepper" routes to `<falcon-angular-stepper>` (the Stencil-paired component, dossier `falcon-stepper/`) or `<falcon-angular-wizard>` (which composes it).
- The business *capability* it provided (linear wizard, progress rail, validation-gated Next) is fully carried by the modern stepper, plus the `error` step state and a declarative `forwardLockedFrom` validation gate the legacy never had.

## Verification
🔴 HISTORICAL — component DELETED. Deletion ✅ VERIFIED ([CODE] filesystem check 2026-05-18: source folder absent; `find` returns 0 stepper files in `libs/falcon/src`) and ✅ corroborated by `[MEMORY]` project_falcon_stepper_legacy_deletion_2026_05_17. Historical business behavior 🟡 CODE-DERIVED from the surviving UI-layer dossiers (no live source to re-verify against).
