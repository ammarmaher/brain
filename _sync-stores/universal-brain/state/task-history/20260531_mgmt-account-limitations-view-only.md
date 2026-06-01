# Task History — Mgmt Settings ▸ Account Limitations becomes view-only (`current / max`)

- **Date:** 2026-05-31
- **Status:** ✅ COMPLETED (build EXIT 0 + 10 new tests + 150 mgmt-suite pass; NO COMMITS)
- **Repo / branch:** `C:/Falcon/Falcon/falcon-web-platform-ui` · `polishing-v0.4`
- **Plan:** `C:/Users/User/.claude/plans/luminous-singing-lightning.md` (user-approved via ExitPlanMode)
- **Implemented via:** `ammar-web-platform-ui` specialist; code directly verified by reading diffs.

## Goal
Mgmt Settings ▸ Account Limitations: Edit mode renders identical to View mode. "Max allowed" never editable (always disabled). Each quota row shows `current / max` (e.g. `3 / 10`). Falcon tokens + Tailwind utility-first.

## Change (6 files, mgmt only + 1 shared i18n)
- `settings-tab.component.html` — 3 quota rows collapsed to one always-`[disabled]` `falcon-angular-input` showing `current / max` (caption `currentVsMax`); removed editable "Max allowed" inputs + per-row error blocks; visibility gate `@if (hasQuota() && canViewQuota)` kept.
- `settings-tab.component.ts` — added `maxNormalDisplay`/`maxSystemDisplay`/`maxNodeDisplay` computeds (from `viewModel().quota`); removed `onLimitChange`, the 3 max error computeds, and now-unused imports (`FalconAngularInputNumberComponent`, `userLimitValidator`, `maxNodeLevelsValidator`, `USER_LIMIT_MAX_DIGITS`, `SETTINGS_HARD_CAP`, `String`, `SettingsFormValue`).
- `signals/settings-tab.signals.ts` — `formValid = isSettingsFormValid(form, false)`; `save()` `includeQuota = false`.
- `libs/falcon/src/language/i18n/{en,ar}.json` — new `hierarchy.settings.currentVsMax`.
- `tests/org-hierarchy/settings-tab-quota-view-only.spec.ts` — NEW, 10 pure-function tests.

## Decision / override (flagged + approved)
Quota is now view-only in mgmt regardless of PES — overrides accowner's `acc.quota.edit = allow`. Security + Allowed IPs stay editable. Admin console unchanged. `quotaSettings: null` on Save → backend preserves existing quota (UpdateSettingsHandler conditional update).

## Verification
- `nx build management-console --configuration=development --skip-nx-cache` → EXIT 0, no new warnings on edited files.
- vitest: 10 new tests + full mgmt suite (150) pass.
- Runtime not driven (local login env-flaky; build + tests are the gate).

## Next
Awaiting user decision on whether to commit (polishing-v0.4 only; no push without explicit instruction).
