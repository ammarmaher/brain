---
ruleId: R-NOOR-005
ruleName: Color naming — palette over intent (Admin Console)
severity: must
violationCount: 0
estimatedEffort: trivial
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, color utilities must use palette names (`bg-slate-50`, `text-blue-500`, `border-emerald-600`) and must not use bare-intent names (`bg-primary`, `text-success`, `border-danger`, `bg-surface`, `text-on-primary`) — palette-shape names with a shade suffix (`bg-primary-500`) are exempt.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| `(bg|text|border|ring|outline|fill|stroke|shadow|...)-(primary|secondary|success|warning|danger|info|error|muted|surface|on-primary|on-surface|brand)` without shade suffix | 0 |

Total: **0 violations across 0 files.**

Per-app: admin-console only by rule scope. Result: **fully compliant.**

Cross-verification: ZERO bare-intent color names in admin-console templates. This is a clean state. The other 2 Falcon apps (host-shell, management-console) ARE allowed to use intent tokens per universal R-FE-004 — this rule does not regulate them.

## 3. Why this matters (the architectural cost of leaving it)

Admin Console (Contracts / Pricing / Tariff / OCS) is a dense, data-heavy operational surface. Per `feedback_noor_instructions`: designers iterate on color by sliding shades up/down the palette (50 → 100 → 200), not by changing semantic meaning. Intent tokens force a re-mapping whenever a shade changes, break dark-mode tuning, and conflict with palette-based design files.

The rule is Noor's signature override over the universal Falcon convention. Forward-only — existing semantic tokens elsewhere in the platform stay; admin-console doesn't import them.

Zero violations is the IDEAL benchmark state. The fix plan exists to keep it that way.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Re-verify clean state.** Run:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' -g '*.ts' -g '*.css' '\b(bg|text|border|ring|outline|fill|stroke|from|via|to|divide|placeholder|accent|caret|shadow)-(primary|secondary|success|warning|danger|info|error|muted|surface|on-primary|on-surface|brand)\b(?!-)' apps/admin-console
  ```
  Expected: zero hits.

- **Step 2 — Set up regression-prevention detector.** This rule is "guard against regression". Add a pre-commit hook or ESLint rule that fires on the detector pattern within admin-console scope.

- **Step 3 — Document the rule in onboarding.** Any new admin-console agent / author needs to know the bare-intent ban. Add to `apps/admin-console/CONTRIBUTING.md` or equivalent (if file exists; if not, add reference to CLAUDE.md → Noor Instructions section).

- **Step 4 — Audit imports/wrappers from `libs/`.** Some library components may legitimately use intent tokens internally (the rule scope excludes libs). When consumed in admin-console, the rendered output reflects the lib's color choices — that's fine. The rule only bans intent-named UTILITY classes written by admin-console authors.

- **Step 5 — If a future requirement forces an intent token** (e.g. "make the danger color theme-swappable across apps"):
  1. The right answer is NOT to introduce `bg-danger` in admin-console.
  2. The right answer is to define a palette-named token in `falcon.theme.css` (`--color-noor-rose-600`) and let the design system associate that token with a semantic role at the application layer.

- **Step 6 — Build verification (sanity).**

## 5. Estimated effort + complexity rationale

**trivial** — Zero violations to fix. Effort is purely regression prevention + onboarding documentation. Realistic: 30 minutes (mostly writing the docs/comment update).

## 6. Rollback hint (how to undo if the fix is wrong)

Nothing to roll back. If a future intent-token addition is mistakenly added → revert the consumer template; replace with palette-shade equivalent (e.g. `bg-success` → `bg-emerald-600`).

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' -g '*.ts' '\b(bg|text|border|ring|outline|fill|stroke|shadow)-(primary|secondary|success|warning|danger|info|error|muted|surface|on-primary|on-surface|brand)\b(?!-)' apps/admin-console
  ```
- expected output:
  - Zero hits

## 8. Risk flags (anything that could break)

- **Library consumption is fine.** If `<falcon-button variant="primary">` renders blue, that's the library's choice; admin-console isn't writing `bg-primary` anywhere. Don't conflate the rule with library internals.
- **Palette-shaped intent names** (`bg-primary-500` with shade suffix) ARE allowed and may exist if a Noor palette family is named `primary`. The detector regex specifically excludes shade-suffix matches.
- **Future "theme-swappable" requirements** are the most likely violation vector. Resist; route through the palette-token design instead.
- **Forward-only mandate** — do NOT migrate intent tokens in host-shell or management-console. They're allowed elsewhere.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-004** — universal tokens-only; intent tokens DO satisfy it outside admin-console
- **R-NOOR-002** — palette ladders are declared in the canonical theme
- **R-NOOR-003** — sibling Noor naming convention on the typography axis
