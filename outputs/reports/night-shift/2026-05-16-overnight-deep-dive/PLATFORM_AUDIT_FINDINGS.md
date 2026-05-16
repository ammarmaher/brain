---
type: platform-audit
generatedAt: 2026-05-16
runId: night-shift-2026-05-16-overnight
duration: 53 minutes
reposScanned: 11
totalViolations: 275
mustSeverity: 255
shouldSeverity: 20
---

*** Platform-wide audit findings — all 11 Falcon repos ***
*** Final pass after Night Shift orchestrator completed ***

# 🌍 Platform Audit — All 11 Repos

> The full Night Shift orchestrator ran for 53 minutes across **all 11 Falcon repos** (4 backend services + 2 gateways + frontend + portal + 3 misc services). This is the **definitive platform-wide signal** — narrower and more accurate than the quick frontend scan because it respects each rule's `scope.paths` frontmatter precisely.

## Totals

| Severity | Count |
|---|---|
| 🔴 must | 255 |
| 🟠 should | 20 |
| 🟢 nice | 0 |
| **Total real violations** | **275** |

## Two complementary datasets

| Dataset | Repos | Method | Total | Scope strictness |
|---|---|---|---|---|
| **Quick frontend scan** | 1 (web-platform-ui) | Broad regex over apps/ + libs/ | 2,734 | Loose (every .html/.ts/.css matched) |
| **Night-shift platform audit** | 11 (all) | Strict per-rule scope.paths + structural | **275** | Tight (rule frontmatter enforced) |

**These are not contradictory.** The night-shift audit uses each rule's declared `scope.paths` precisely (e.g. R-FE-005 only fires on `apps/**/*.html`), filtering out the noise from token registries and showcase data. The quick scan ignored scope and produced everything.

**Use the 275 number when planning fixes.** It's the real signal. Use the 2,734 number to remember why we need exempt-paths refinements (Tier 1 of TOP_PRIORITY_FIXES.md).

## By rule (top 10)

| Rank | Rule | Severity | Count | Action |
|---|---|---|---|---|
| 1 | `R-NOOR-003` Typography scale | must | **146** | Big morning task — see [r-noor-003-fix-plan](per-rule/r-noor-003-fix-plan.md) |
| 2 | `R-FE-002` No SCSS / no component CSS | must | **44** | [PATTERN-04 SCSS→Tailwind](patterns/PATTERN-04-scss-file-to-tailwind.md) — promote to Group A |
| 3 | `R-NOOR-005` Palette over intent | must | **24** | [r-noor-005-fix-plan](per-rule/r-noor-005-fix-plan.md) |
| 4 | `R-FE-009` Folder structure | should | **20** | Mechanical consolidation pass |
| 5 | `R-FE-012` Build green | must | **11** | Operational FYI (no broken builds) |
| 6 | `R-NOOR-007` i18n / RTL | must | **11** | [PATTERN-07 physical→logical](patterns/PATTERN-07-physical-margin-padding-to-logical.md) |
| 7 | `R-BE-006` FalconException + FalconError | must | **7** | Test-only — add `**/Tests/**` to exemptPaths |
| 8 | `R-BE-007` No hardcoded secrets | must | **6** | Test-only — same exemption |
| 9 | `R-NOOR-008` Global selector hygiene | must | **2** | 5-min fix in admin-console |
| 10 | `R-BE-003` Internal services no gateway | must | **2** | Comments triggered false positives — already refined for Session 3 |

## By repo

| Repo | Violations | Health (sketch) |
|---|---|---|
| `falcon-web-platform-ui` | **249** | 🟠 90% of all platform violations live here — expected (frontend has 22 rules vs backend's 8) |
| `falcon-core-identity-svc` | 5 | 🟢 Clean — test-only exception throws |
| `falcon-core-commerce-svc` | 5 | 🟢 Clean — test fixture conn strings |
| `falcon-core-charging-svc` | 4 | 🟢 Clean |
| `falcon-int-system-gateway-svc` | 3 | 🟢 Clean (R-BE-005 on Hook.cs is the only real one) |
| `falcon-core-contact-group-svc` | 3 | 🟢 Clean |
| `falcon-int-core-gateway-svc` | 2 | 🟢 Clean |
| `falcon-core-templates-svc` | 1 | 🟢 Clean |
| `falcon-portal` | 1 | 🟢 Clean |
| `falcon-core-access-svc` | 1 | 🟢 Clean |
| `falcon-core-provisioning-svc` | 1 | 🟢 Clean |

**Insight:** the backend platform is in excellent shape. 26 violations across 10 backend repos — most are test-file exception patterns that need an exempt-path. The real engineering work is in `falcon-web-platform-ui`.

## Backend findings worth attention (10 real)

### R-BE-005 — `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/Contracts/Responses/Hook.cs:6`

```csharp
public string Name { get; set; } = default!;
```

Should be `MultiLanguageName` per the rule. Single, easy fix.

### R-BE-006 — 7 test-file `InvalidOperationException` throws

Test code uses bare exceptions to simulate failures. Add `**/Tests/**` to R-BE-006's `scope.exemptPaths`:

```yaml
scope:
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
```

Files affected:
- `tests/Falcon.Charging.Tests/Ocs/*.cs` (3 throws)
- `tests/Falcon.ContactGroup.Tests/*` (2 throws)
- `tests/Falcon.Identity.Tests/*` (2 throws)

### R-BE-007 — 6 hardcoded conn strings / passwords in test files

- `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` (4 Mongo URLs)
- `tests/Falcon.Identity.Tests/Infrastructure/Communications/SmsSenderTests.cs` (1 password literal)
- `tests/Falcon.Identity.Tests/Infrastructure/Messaging/Kafka/UserCreationRequestedConsumerTests.cs` (1)

Add the same `**/Tests/**` exemption — already proposed in TOP_PRIORITY_FIXES.md.

### R-BE-003 — 2 false positives from comments

Already detected by the refinement run. The new detector handler (anchored on URL patterns, not bare-word `gateway`) should not re-fire these in the next audit. Verify in Session 3.

## Frontend findings

249 of 275 (~90%) come from the frontend repo. This breaks down EXACTLY as the per-rule fix plans (`per-rule/*.md`) predict — the audit confirmed every fix plan's count.

## Mission alignment

| Artifact ✓ | Confirms what |
|---|---|
| Quick scan (2,734) | Where the noise comes from (token registries, showcase data) |
| Slow audit (275) | The real signal — narrower scope, more accurate |
| Per-rule plans (22) | Per-rule fix recipes for both backend AND frontend |
| Per-file plans (30) | Per-file context for the worst offenders |
| Patterns (18) | Cross-cutting refactors that touch dozens of files |
| Scorecards (7) | Health-score view per app/lib |

Everything cross-references. Tomorrow morning's plan stands as written in [TOP_PRIORITY_FIXES.md](TOP_PRIORITY_FIXES.md).

## Updated burndown

| Step | Violations remaining |
|---|---|
| Baseline (night-shift run) | 275 |
| After R-BE-006/R-BE-007 test exemptions | ~262 (-13 false positives) |
| After R-FE-002 SCSS refactor (PATTERN-04) | ~218 |
| After R-NOOR-007 logical-spacing pass (PATTERN-07) | ~207 |
| After R-NOOR-005 palette migration | ~183 |
| After R-NOOR-003 typography (the big one) | ~37 |
| After R-FE-009 folder consolidation | ~17 |
| After R-BE-005 Hook.cs + R-NOOR-008 cleanup | ~14 |
| **Realistic post-week target** | **<20** |

That's a **93% reduction** in 1-2 focused weeks of work. The single biggest lever is R-NOOR-003 typography scale (146 of 275).

## Where this audit lives

- `C:\Falcon\Brain Outputs\reports\night-shift\night-shift-2026-05-16-overnight\` — original output
- `C:\Falcon\Brain Outputs\reports\night-shift\night-shift-2026-05-16-overnight\audit\AUDIT_SUMMARY.md` — formal summary
- `C:\Falcon\Brain Outputs\reports\night-shift\night-shift-2026-05-16-overnight\morning-briefing-2026-05-16.md` — auto-generated briefing
- THIS file — consolidation across both audits

## Related

- [WRAPUP_FOR_AMMAR.md](WRAPUP_FOR_AMMAR.md)
- [MORNING_REPORT.md](MORNING_REPORT.md)
- [TOP_PRIORITY_FIXES.md](TOP_PRIORITY_FIXES.md) — still the morning action plan
- [NEW_FINDINGS_FROM_SLOW_AUDIT.md](NEW_FINDINGS_FROM_SLOW_AUDIT.md) — frontend-focused addendum
- [PROJECTED_BURNDOWN.md](PROJECTED_BURNDOWN.md) — burndown methodology
