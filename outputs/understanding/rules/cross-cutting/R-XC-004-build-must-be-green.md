---
ruleId: R-XC-004
name: Build must be green — no phase ships red
category: operational
scope:
  apps:
    - "*"
  paths:
    - "**"
  exemptPaths: []
severity: must
detector:
  type: manual
  patterns: []
  description: |
    Post-hoc audit. Detector runs after each phase commit window: replays `nx build <app>` for every frontend app + `dotnet build` for every backend service touched in the window. Any non-zero exit code that produces an actual ERROR (not a known/exempt warning) → violation row in the morning briefing. Surface B = git reflog inspection — phases that ended with `phase complete` voice context while CI / local build was red are flagged. Known warning exemptions (typehints, length, etc.) are filtered before reporting.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Dispatch a focused fix-agent against the build error output. Do not advance to the next phase until green.'
relatedRules:
  - R-XC-003
  - R-XC-008
  - R-XC-009
source:
  - file: feedback_always_build_zero_errors.md
    location: memory
  - file: feedback_build_must_be_green.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-004 — Build must be green; no phase ships red ***
*** Source: feedback_build_must_be_green.md (HARDENED 2026-05-08) ***
*** Detector: manual (post-hoc build replay + git reflog) ***

# R-XC-004 — Build must be green

## What it says

No phase, wave, round, or task ships with a red build across **any** stack. After every non-trivial code change, the responsible agent runs the appropriate build command — `nx build <app>` for frontend apps + libs, `dotnet build` for .NET 10 backend services — and resolves every actual ERROR before reporting `done`. If a build error remains, the orchestrator dispatches a **focused fix-agent** immediately; the phase does not close and the next phase does not start. Known-warning categories (typehints, length warnings, etc.) are exempt and do not block — only actual errors do. Dev-serve / preview / browser testing remains gated by [[R-FE-no-ui-testing-during-implementation]], but build verification is always authorised.

## Why it exists

Hardened on 2026-05-08 after multiple phases shipped with `phase complete` voice context while one of the three frontend apps or one of the four backend services had a red `nx build` / `dotnet build`. Red builds compound — a downstream phase that depends on a red upstream cannot be trusted, and rolling back becomes harder the more commits land on top. The "always build / zero errors" feedback (2026-04-30) made build verification mandatory; this rule (2026-05-08) made the orchestrator-side dispatch of a fix-agent mandatory on first failure.

## Detector strategy

**Manual / scripted** post-hoc audit:

1. **Phase boundary** — at every checkpoint where the orchestrator emits `phase complete` (or equivalent), record the commit SHA range for that phase.
2. **Replay** — for every app/lib touched in the range:
   - Frontend: `nx build <app> --skip-nx-cache`
   - Backend: `dotnet build <service>.sln -c Release`
3. **Classify output**:
   - Exit code `0` → ✅ green.
   - Exit code `≠ 0` with at least one line matching `error ` (case-insensitive) outside the warning exemption list → **violation**.
   - Exit code `≠ 0` solely due to exempt warnings escalated by `-Werror` → soft warning, not a violation.
4. **Surface in morning briefing** with the failing app + the error excerpt + the phase that closed despite the error.
5. **Cross-check** the night-shift fix-agent dispatch log: if a build failed during the phase and **no fix-agent was dispatched**, double-tag the violation.

## Examples

### ✅ Good — orchestrator behavior

> Agent finishes Wave 14 of the org-hierarchy port. Runs `nx build admin-console` → fails with 2 errors in `tree-panel.component.ts`. Orchestrator dispatches a focused fix-agent immediately. Wave 14 is not closed until `nx build admin-console && nx build host-shell && nx build management-console` all exit 0. Voice context = `testing` (not `phase complete`) until green.

### ❌ Bad — orchestrator behavior

> Agent finishes Wave 14. `nx build admin-console` fails with 2 errors. Orchestrator marks Wave 14 closed (`phase complete` voice), moves to Wave 15. Three waves later, Wave 17 build fails because it depends on Wave 14 changes — and the original errors are now buried under three more commits' worth of churn.
>
> Violation — Wave 14 should never have closed red. The fix-agent should have been dispatched in real-time.

## Known legitimate exemptions

- **Known-warning categories** that are explicitly exempt:
  - .NET CS-typehint warnings already tracked as known noise (length, nullable-typehints) — only the specific codes whitelisted in the build CI config.
  - Angular template warnings about deprecated API the team is mid-migration on (must be tracked in a GAP note with a deadline).
- **In-flight migrations** with an explicit "amber phase" tag from the orchestrator (e.g., a multi-day Angular major upgrade). Build red is tolerated within the migration's branch only — never on `main`. The phase tag is the user-approved exemption.
- Anything listed in `exemptions/EXEMPTIONS.md` against this ruleId with a dated justification.

## Fix recipe

When a red-build violation is detected mid-phase:

1. Capture the full build error output (stderr + stdout) and the failing files.
2. Dispatch a **focused fix-agent** with brief: "Fix only these errors in these files. Do not touch unrelated code. Strict scope per R-XC-003. Build must be green before you report done."
3. Block phase closure until the fix-agent reports green.
4. If the fix-agent fails twice in a row → escalate to the user with a long beep per [[R-XC-beep-when-input-needed]] (currently captured as feedback) and ask whether to revert the phase or hold for manual intervention.
5. Log the incident in the phase's progress log so the morning briefing surfaces the recovery path.

When detected post-hoc (night-shift):

1. Identify the first phase that shipped red.
2. Identify the dependent phases that built on top.
3. Decide: revert to the last green commit, or forward-fix.
4. Document the policy violation in `outputs/reports/operational-incidents/`.

## Related rules

- [[R-XC-003-strict-task-scope]] — fix-agents are scope-limited; cannot drive-by edit infra
- [[R-XC-008-trunk-based-development]] — `main` must always be deployable; red builds on `main` are the worst case
- [[R-XC-009-orchestrator-failure-mode-discipline]] — orchestrator dispatch of fix-agents is part of its locked playbook

## Sources of truth

1. `memory/feedback_always_build_zero_errors.md` — 2026-04-30 original feedback
2. `memory/feedback_build_must_be_green.md` — HARDENED 2026-05-08; orchestrator dispatches fix-agent on first failure
3. `C:\Falcon\CLAUDE.md` — agent governance section
