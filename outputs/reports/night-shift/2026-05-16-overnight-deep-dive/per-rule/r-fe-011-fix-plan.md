---
ruleId: R-FE-011
ruleName: Clean code, DRY, minimal — no speculative abstractions
severity: should
violationCount: unknown_pending_llm_pass
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Every change must produce clean, DRY, minimal code with idiomatic Angular — no duplicated HTML, no `if/else` ladders dispatching on a discriminator, no `as any` without `// reason:`, no unused exports, no near-identical components, no speculative TODOs, no back-compat shims past their removal window.

## 2. What we found (counts + top 5 offender files)

Pure-regex pre-pass — the rule is semantic-LLM, so headline counts are surface signals only:

| Detector pattern | Hits |
|---|---|
| `as any` casts | 6 |
| `TODO:` / `FIXME:` | 5 |

Both are very low (good signal — the codebase is mostly clean on the mechanical red flags). The real surface for this rule is invisible to regex:
- Duplicated HTML blocks across 2+ templates
- `if/else` ladders with 3+ branches dispatching on a discriminator
- Near-identical components differing only by inputs
- Unused `@Input` / `@Output` / public methods
- Duplicate enums/interfaces
- Manual derived state where `computed()` would work

These are LLM-verdict territory, file-by-file.

Top 5 candidate-rich files (heuristic — files with concentrated structural patterns suggesting LLM should examine):

1. `apps/host-shell/src/bootstrap.ts` — 1 `as any` (verify reason comment)
2. `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` — 2 `as any`
3. `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` — 1 `as any`
4. `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts` — 2 `as any` (libs/, but in scope of this rule's `libs/**/*.ts` path)
5. *(LLM-pass-discovered files — the wizard-step family is the most likely site of duplicated HTML, given the 5 client-* + 4 user-* steps inherit a near-identical chrome)*

The `add-client-wizard/` (5 steps: `client-information-step`, `client-account-owner-step`, `client-applications-step`, `client-comm-channels-step`, `client-settings-step`) and `add-user-wizard/` (4 steps: `user-personal-step`, `user-permissions-step`, `user-role-status-step`, plus models/) are likely the largest near-identical-component clusters in the codebase. Per `feedback_clean_code_dry_minimal`'s "three near-identical components → one component + inputs" red flag, these warrant LLM review.

Per app:
- admin-console: wizard step duplication is the main suspected violation surface
- host-shell: auth flow has 4 nearly-identical components (`change-password`, `enter-otp`, `forgot-password-flow`, `get-started`) — verify whether they share enough chrome to collapse
- management-console: low — minimal feature surface

## 3. Why this matters (the architectural cost of leaving it)

Bloated code creates review fatigue, hides bugs, slows onboarding. The user explicitly cited past implementations of "4-variant banner when the parent story didn't need one" and "duplicated field-bindings across three tabs instead of a single shared template" — these are the patterns this rule prevents.

The 9 wizard steps (5 client + 4 user) are the highest-value cleanup target: if they share 70%+ of their template structure (likely), collapsing into a single `<app-wizard-step>` with input-driven content would eliminate hundreds of lines of duplicate markup and make the next wizard refactor (e.g. validation hardening per R-FE-006) a one-place fix instead of a 9-place fix.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Run mechanical red-flag sweeps.**
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # as any without // reason: comment
  rg -n --type ts '\bas\s+any\b' apps libs | rg -v '// reason:'
  
  # TODO/FIXME
  rg -n --type ts 'TODO:|FIXME:' apps libs
  
  # if/else ladders (3+ else if)
  rg -n --type ts --multiline 'else if[^{]*\{[^}]+\}\s*else if[^{]*\{[^}]+\}\s*else if' apps
  ```

- **Step 2 — LLM-assisted duplicate-template scan.** For each pair of components in the same feature folder:
  1. Read both templates.
  2. Ask: "Are these 70%+ identical in structure? If yes, what inputs would parameterize the difference?"
  3. If yes → propose a consolidation refactor.

- **Step 3 — Audit wizard step duplication first.** Open all 9 step components side-by-side. Likely outcome:
  - Each step has identical `<header>` (title + step indicator)
  - Each step has identical `<footer>` (back + next + cancel buttons)
  - Each step's `<main>` differs by content
  - Refactor: single `<app-wizard-step [step]="..." [title]="..." [next]="..." (back)="..." (next)="...">` with `<ng-content>` for the body. Saves an estimated 200–400 lines per wizard.

- **Step 4 — Audit auth flow duplication.** Compare `change-password`, `enter-otp`, `forgot-password-flow`, `get-started`. Likely share form chrome, error banner pattern, submit button. Consolidate where it makes sense — but be conservative; auth flows often have subtle differences that justify separate components.

- **Step 5 — Fix the 6 `as any` casts.** For each:
  - If the cast is justified (e.g., interop with an untyped 3rd-party library) → add `// reason: <explanation>` on the same line.
  - If a proper type fix is possible → fix the type.

- **Step 6 — Triage TODO/FIXME** as part of R-FE-010's TODO sweep.

- **Step 7 — Identify duplicate enums/interfaces.**
  ```
  rg -n --type ts '^export\s+(enum|interface|type)\s+\w+' apps libs | sort by name and detect duplicates manually
  ```

- **Step 8 — Verify unused exports.** Run `nx build` with `--strict` if available; manually audit barrel files for re-exports that no consumer imports.

- **Step 9 — Build verification.**

## 5. Estimated effort + complexity rationale

**medium** — The mechanical sweeps are quick (1–2 hours). The wizard consolidation is the major win and is estimated at 1 day for a focused refactor (read all 9 step templates, design the shared `<app-wizard-step>` wrapper, refactor each consumer, test the wizards end-to-end). Auth flow consolidation is smaller (4–6 hours).

Combined: 2 days for a thorough pass. Severity is `should` so this can be deferred.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-refactor: `git revert <consolidation-commit>` restores the duplicated components. If the consolidation breaks one specific wizard step (e.g. the new `<app-wizard-step>` doesn't accommodate the `comm-channels` step's specific table), revert just that consumer and keep the consolidation for the others.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n --type ts '\bas\s+any\b' apps libs | rg -v '// reason:'
  # Line-count delta (consolidation should reduce total)
  Get-ChildItem -Recurse -Include *.html,*.ts apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components | Measure-Object -Property Length -Sum | Select-Object Sum
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  ```
- expected output:
  - First `rg`: zero hits (all `as any` either fixed or annotated)
  - Line-count: reduced by 20–40% if wizard consolidation lands
  - Builds: exit code 0

## 8. Risk flags (anything that could break)

- **Wizard step consolidation is high-impact and high-risk.** Add Client + Add User are critical onboarding flows; bugs here directly block tenant creation. Test the full flow before declaring done.
- **Auth flow consolidation is even riskier.** A regression in login means users locked out of the platform. Don't bundle this with any other change.
- **"Three near-identical components" might be intentional.** Check if there's a roadmap reason (e.g. each will diverge in the next milestone) before collapsing. When in doubt, ask the user.
- **`as any` removal can cascade type errors** — fixing the source type may reveal that 3 other places were relying on the cast. Budget time for that cascade.
- **Severity is `should`, not `must`** — don't rabbit-hole. Pick the 1–2 highest-value consolidations and defer the rest.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-009** — folder structure that supports cohesion; consolidation may merit folder restructure too
- **R-FE-010** — self-documenting code beats narration; aligned ethos
- **R-FE-005 / R-FE-006** — wizard consolidation likely surfaces new Falcon component opportunities (`<falcon-wizard-step>`?)
- **R-FE-007** — if a consolidated wizard-step needs service injection, it goes in `apps/host-shell/src/app/shared-components/`
