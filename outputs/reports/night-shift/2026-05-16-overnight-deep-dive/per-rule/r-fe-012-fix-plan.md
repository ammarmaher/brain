---
ruleId: R-FE-012
ruleName: Build must be green — nx build exit 0 required
severity: must
violationCount: unknown_pending_build
estimatedEffort: small
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Every phase, wave, and reported "done" must end with `nx build <app> --configuration=development` exit 0 for every touched app PLUS `falcon-ui-core` — warnings on the standing exemption list are acceptable, but `error TS####`, `Cannot find module`, `Errors while compiling`, and any non-zero exit code are blockers.

## 2. What we found (counts + top 5 offender files)

This rule is operational: it does not run regex on source. The detector IS `nx build` itself. No build was executed during this audit pass (the audit is READ-ONLY on the codebase). 

**Status from memory:**
- `project_falcon_revamp_v3_1_night_shift_results` (2026-05-10): all 3 apps + `falcon-ui-core` last reported GREEN at build hash `fcbef6de9dbc5d9f`
- `project_org_hierarchy_html_conversion` (2026-05-13 active): same build hash; conversion in progress
- `project_react_to_angular_org_hierarchy_page` (2026-05-13 active): "All 3 builds GREEN" (Wave 16)
- `project_falcon_ui_core_layout_traps` (2026-05-15): "all 3 builds GREEN" after the four layout-trap fixes

Last green confirmation is recent (within last 3 days of 2026-05-16). However, **all other R-FE-* and R-NOOR-* fix plans in this run propose substantive changes** that MUST verify green-build closure before commit. So the operational rule is implicitly violated for every fix plan until verified.

Top 5 likely-affected build targets (in execution order):

1. `falcon-ui-core` — every Stencil component change cascades to all 3 apps; build first
2. `host-shell` — biggest surface (auth + layout + shared-components)
3. `admin-console` — biggest active workstream (org-hierarchy-page port)
4. `management-console` — smaller; should remain green throughout
5. `playground` (host-shell sub-route, no separate target) — passes if `host-shell` does

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_build_must_be_green` and `feedback_always_build_zero_errors`: the user runtime-tests every component after a phase lands. A red build means the dev server serves stale bundles (proven by Wave 1's textarea HMR-stuck issue) or fails to recompile entirely. Prior turns have shipped "applied" / "wired" reports with hidden TypeScript errors — forcing the user to copy-paste compiler output back. Verification at the source catches them before user time is spent.

This rule has zero direct violations to fix; its job is to **gate every other fix plan in this audit**. Every R-FE-* and R-NOOR-* plan above lists `nx build` as the final verification step. R-FE-012 is the meta-rule those steps invoke.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Establish baseline.** Before touching anything, run the full matrix:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  $env:UV_THREADPOOL_SIZE=128
  npx nx build falcon-ui-core
  npx nx build host-shell --configuration=development
  npx nx build admin-console --configuration=development
  npx nx build management-console --configuration=development
  ```
  All four must exit 0. If any are red BEFORE morning work begins → that's the first task: triage the existing red build.

- **Step 2 — After each fix-plan execution, re-run the touched targets.**
  - R-FE-001 / R-FE-002 → all 4 targets (theme-layer change)
  - R-FE-003 / R-FE-004 → touched apps + `falcon-ui-core` if libs touched
  - R-FE-005 / R-FE-006 → touched apps (mostly admin-console + host-shell)
  - R-FE-007 → `falcon-ui-core` + any apps consuming refactored wrappers
  - R-FE-008 / R-FE-009 → touched apps
  - R-FE-010 / R-FE-011 → run host-shell + admin-console for sanity (comments don't affect build but the refactors might)
  - R-NOOR-* → admin-console primarily, plus `falcon-ui-core` if Noor tokens were promoted

- **Step 3 — On a red build, follow the canonical fix recipe** from the rule:
  1. Read build output bottom-up — first error is usually the cause.
  2. Do NOT bundle the fix with new feature work — fix-only commit.
  3. Common errors:
     - `error TS2305` / `TS2307` → missing barrel export or wrong import path
     - `error TS2322` / `TS2345` → type mismatch; update or coerce
     - `error NG8001` → unknown element; missing component import
     - `Duplicate identifier` → import collision; alias or remove duplicate
  4. Re-run `nx build`. Iterate until 0.

- **Step 4 — Honor the standing warning exemptions.** Do NOT chase:
  - `length:` typehint advisories (Tailwind v4)
  - `google-libphonenumber` CommonJS notice
  - `change-password.models.ts` unused-include (renamed under R-FE-009 plan — re-verify after rename)
  - Stencil `@Prop title is reserved` advisory

- **Step 5 — Use `UV_THREADPOOL_SIZE=128`** to avoid the Windows EMFILE workaround failure. The env var is the Wave 1 documented workaround; without it, `nx build` randomly fails on Windows.

- **Step 6 — Cache results between phases.** Nx's caching means repeated `nx build` calls in the same morning are fast. Don't pre-emptively `nx reset` unless suspecting stale cache.

## 5. Estimated effort + complexity rationale

**small** — Pure operational discipline. Each `nx build` takes 30s–2min depending on cache state. The cost is in running it consistently after every fix plan execution. Realistic per-rule overhead: 5–15 minutes of build time across the morning.

The only scenario where R-FE-012 itself becomes large is if a red build is discovered at Step 1 baseline — then the agent must triage and fix before any other R-FE-* work. Memory says builds were green at last checkpoint, so this is unlikely.

## 6. Rollback hint (how to undo if the fix is wrong)

If a fix-plan execution turns the build red and rollback isn't trivial:
```
git stash
UV_THREADPOOL_SIZE=128 npx nx build <target> --configuration=development
# Confirms baseline is green
git stash pop
# Surgical: re-apply changes one file at a time, building between each
```
Or `git reset --hard HEAD~N` for N commits back to the last known green.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  $env:UV_THREADPOOL_SIZE=128
  npx nx run-many --target=build --projects=host-shell,admin-console,management-console,falcon-ui-core --configuration=development
  echo "Exit: $LASTEXITCODE"
  ```
- expected output:
  - `NX Successfully ran target build for X projects` 
  - Exit: `0`
  - No `error TS####`, no `Cannot find module`, no `Errors while compiling` in output
  - Standing warning exemption list items may appear (acceptable)

## 8. Risk flags (anything that could break)

- **`UV_THREADPOOL_SIZE=128` is mandatory on Windows.** Without it, builds fail randomly with EMFILE errors. Always set.
- **Nx cache can mask broken builds.** If a build mysteriously goes green right after going red, run `npx nx reset && nx build <target>` to confirm without cache.
- **Module Federation builds have separate webpack configs** (`webpack.config.ts`, `webpack.prod.config.ts`). If a Module Federation remote breaks, the host might still build but fail at runtime. Plan: also smoke-test the federated app boot.
- **Zoneless adoption** (v3.1) means some 3rd-party code that assumed Zone.js will misbehave at runtime even though build is green. R-FE-012's mandate is build-time only; runtime smoke per `project_falcon_revamp_next_steps_plan` Tier 1 is a separate concern.
- **Don't bundle build fixes with feature work.** Per the rule: fix-only commit. Mixing makes rollback brittle.

## 9. Related rules (other rules that might overlap with this fix)

This rule has no direct overlap — it's operational and stands alone. It gates the "done" status of every other rule's fix plan. The morning agent must invoke it as the final step of EACH of R-FE-001 through R-FE-011 and R-NOOR-001 through R-NOOR-008 — not just once at the end of the day.
