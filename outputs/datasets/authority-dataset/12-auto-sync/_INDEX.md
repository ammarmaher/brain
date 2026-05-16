---
type: index
cluster: 12-auto-sync
dataset: authority-dataset
phase: 5
status: 🟢 LANDED
created: 2026-05-16
extracted-by: Jakco orchestrator (Phase 5)
source-of-truth: falcon-wiki/scripts/
projects-to: falcon-wiki/100-Authority/_drift-*.md (on demand)
purpose: "Answers 'how does the authority dataset auto-detect drift in canonical source files + which scripts/hooks deliver it'. Open when installing the pre-push hook or investigating a drift report."
---

# Phase 5 — Auto-sync Hook

> [!tldr]
> The Falcon authority dataset is code-grounded — every fact traces to a canonical source file. Phase 5 closes the feedback loop with a drift watcher: a PowerShell scanner hashes the canonical files, compares them against a sealed baseline, and emits an actionable drift report whenever a watched file changes. A git pre-push hook blocks pushes until the impacted phases are re-derived. Scripts live in [`falcon-wiki/scripts/`](../../../falcon-wiki/scripts/INSTALL.md).

## What this phase delivers

| Deliverable | Path | Role |
|---|---|---|
| Scanner | `falcon-wiki/scripts/scan-authority.ps1` | Hashes 60+ canonical files · emits drift report · exits with status code |
| Config | `falcon-wiki/scripts/scan-authority.config.json` | Watched-file registry + baseline hashes + phase-trigger map |
| Pre-push hook | `falcon-wiki/scripts/pre-push-authority-hook.ps1` | Installer + runner — blocks `git push` on drift |
| Report template | `falcon-wiki/scripts/drift-report-TEMPLATE.md` | Markdown the scanner fills in to `falcon-wiki/100-Authority/_drift-<stamp>.md` |
| Install + usage | `falcon-wiki/scripts/INSTALL.md` | Setup · troubleshooting · phase-trigger phrases |

## What the scanner watches (60 files)

Grouped by phase impact:

| Phase | Watched files | Source |
|---|---|---|
| **0** Foundation | `BuiltInRoleCatalog.cs` · `falcon-access.registry.ts` · `pes-account-role-rules.json` · `seed-test-users.sh` · 3 Enums files (Identity/Commerce/Provisioning) | `[CODE]` backend + frontend |
| **1** Feature Parity | `admin-console/app.routes.ts` + `app.config.ts` · `management-console/app.routes.ts` + `app.config.ts` | `[CODE]` frontend |
| **2-§06** V-rules | 25 `V-*.md` notes | `[BRAIN-SK] Brain SK/_obsidian/30-Validation/` |
| **2-§08** Entity drift | 15 `E-*.md` notes | `[BRAIN-SK] Brain SK/_obsidian/40-API/` |
| **2-§09** Business rules | 4 `BUSINESS_RULES.md` | `[BRAIN-OUT] Brain Outputs/prd/modules/` |
| **2-§10** Non-PES gates | 7 `05-PES.md` notes (one per old-UI admin-console feature) | `[BRAIN-OUT] Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/` |

## How it integrates with Phases 0–4

1. Phase 0–4 produce the dataset under `Brain Outputs/datasets/authority-dataset/` and project to `falcon-wiki/100-Authority/` + `Brain SK/_obsidian/40-Authority/`.
2. Phase 5 captures the canonical-file hashes used as input to those phases.
3. When any canonical file changes (e.g. a new PES key is added to `BuiltInRoleCatalog.cs`), the scanner detects it and tells you **which phase to re-run**.
4. After re-running the phase, you call the scanner with `-MarkChecked` to seal the new baseline.

The scanner does not auto-run the phases — re-derivation requires Claude / Jakco orchestration (see trigger phrases below).

## Trigger phrases

Use any of these in a session to invoke Phase 5 behaviour:

| Trigger phrase | Effect |
|---|---|
| `audit drift` / `scan authority` / `refresh authority dataset` | Run the scanner manually — produces drift report at `falcon-wiki/100-Authority/_drift-<stamp>.md` |
| `mark authority baseline` / `seal authority hashes` | Run scanner with `-MarkChecked` (only after re-derivation) |
| `install authority hook` / `wire authority pre-push` | Install the git pre-push hook into a repo |
| `bypass authority drift` | Set `FALCON_AUTHORITY_DRIFT_BYPASS=1` for the next push (emergency only) |

For re-running a specific phase after drift is detected, use the phase-specific phrases listed in `scan-authority.config.json` → `phaseTriggers` (also rendered in §3 of every drift report):

- `refresh authority dataset phase 0` — Foundation
- `refresh authority dataset phase 1` — Feature Parity Matrix
- `refresh authority dataset phase 2` — Full Phase 2 (all 4 matrices)
- `refresh authority dataset phase 2 section 06 validation-by-feature` — Only the V-rules matrix
- `refresh authority dataset phase 2 section 08 entity-drift-by-feature` — Only the entity-drift matrix
- `refresh authority dataset phase 2 section 09 business-rules-by-feature` — Only the business-rules matrix
- `refresh authority dataset phase 2 section 10 non-pes-gates-by-feature` — Only the non-PES gates matrix
- `refresh authority dataset phase 3 copy playbook` — Phase 3
- `refresh authority dataset phase 4 vault projection` — Phase 4

## Exit codes (CI-friendly)

| Code | Meaning |
|---|---|
| 0 | Clean — every watched file matches the baseline |
| 1 | Drift detected — report written, push should be blocked |
| 2 | Scanner error — config missing, template missing, etc. |

## Hard rules

- **Do not edit the drift report by hand.** The next scan overwrites it. Use the trigger phrases to fix the underlying drift instead.
- **Do not call `-MarkChecked` to silence the alarm.** Only re-baseline after the impacted phases have been re-derived. Otherwise the dataset will silently rot.
- **The pre-push hook fails open on tooling errors** — a broken scanner allows pushes rather than blocking productivity. Keep the scanner tested.
- **The scanner is read-only against canonical files** — it only writes drift reports + (on `-MarkChecked`) the config file.

## Cross-references

- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\00-INDEX.md` — dataset entry
- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\00-VERIFICATION-GATE.md` — 15-question gate
- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles/` · `02-statuses/` · `03-pes-keys/` — Phase 0 outputs
- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix/` — Phase 1 output
- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps/` · `06-validation-by-feature/` · `08-entity-drift-by-feature/` · `09-business-rules-by-feature/` · `10-non-pes-gates-by-feature/` — Phase 2 outputs
- [BRAIN-OUT] `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook/` — Phase 3 (deferred until requested)
- [VAULT] `C:\Falcon\falcon-wiki\100-Authority\_INDEX.md` — projected MOC (Phase 4)
- [CODE] `C:\Falcon\falcon-wiki\scripts\INSTALL.md` — operational guide
- [CODE] `C:\Falcon\falcon-wiki\scripts\scan-authority.ps1` — scanner source
- [CODE] `C:\Falcon\falcon-wiki\scripts\pre-push-authority-hook.ps1` — hook source
