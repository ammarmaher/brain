---
name: project_falcon_lint_spec_debt_fixed_2026_06_06
description: The 4 pre-existing falcon:lint problems (empty unsubscribe + 2 non-null assertions across 3 spec files) are FIXED — nx lint falcon GREEN under --max-warnings=0; UNCOMMITTED.
metadata: 
  node_type: memory
  type: project
  originSessionId: c62e9e6e-3b0b-4dd6-8ac5-5feb50d8b251
---

The pre-existing `nx lint falcon` RED (noted as "unrelated debt" in [[project_contracts_list_column_width_ellipsis_2026_06_06]]) is RESOLVED 2026-06-06 (claude). It was **4 problems across 3 spec files** — the task brief said "all in ONE file" which was WRONG: the 2 non-null warnings live in two OTHER files (line numbers 149/197 are from those files, not access-control).

Fixes (each matches that file's established convention):
- `libs/falcon/src/core/lib/access-control/access-control.facade.spec.ts` :194 & :228 — `@typescript-eslint/no-empty-function` (2 errors) on mock `return { unsubscribe() {} }` → added inline `/* no-op */` body. Repo convention (e.g. `shell-access.guard.ts:73` `catch { /* noop */ }`); the rule treats a commented body as non-empty.
- `libs/falcon/src/core/lib/services/session-provider.service.spec.ts` :149 — `no-non-null-assertion` (warning) on `JSON.parse(localStorage.getItem(STORAGE_KEY)!)` → `... getItem(STORAGE_KEY) as string)`. File already uses `as` casts; runtime-identical, value guaranteed by the preceding `setFromToken`.
- `libs/falcon/src/shared-types/lib/models/policy-subject.models.spec.ts` :197 — `no-non-null-assertion` (warning) on `parsePolicySubject(once!.subject)` → `expect(once).not.toBeNull();` guard + `parsePolicySubject(once?.subject ?? '')`. Matches the file's existing `?.` idiom (:180); behavior-preserving — :34 proves `parsePolicySubject('u:alice@system')` returns non-null, so the added assertion provably passes.

NOTE: `libs/falcon` has NO inline `eslint-disable` for `no-non-null-assertion` (only `falcon-ui-core/eslint.config.mjs` turns it OFF for Stencil test code) → convention is to AVOID the `!`, not disable the rule.

VERIFIED: `node node_modules/nx/dist/bin/nx.js lint falcon --skip-nx-cache --max-warnings=0` → "✔ All files pass linting", EXITCODE=0 (was 2 errors + 2 warnings). NOT runtime-tested: the `falcon` project exposes ONLY a `lint` target (no `test`), has no lib-level `vite.config`, and the apps' vitest `include` globs are rooted at `apps/<app>/{src,tests}` (don't reach `libs/**`) — so the standing "`nx test falcon` is a no-op" caveat holds and there's no wired runner for these lib specs; edits are behavior-preserving by construction. NO COMMITS (branch polishing-v0.4). Clears part of FE-LINT-COMMIT in `plans/FRONTEND-GATE-FOLLOWUPS.md`; `gate:all` still BLOCKED by FE-GATE02-MODRES (gate-02 typecheck).

Related [[project_gate01_lint_debt_cleared_2026_06_03]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
