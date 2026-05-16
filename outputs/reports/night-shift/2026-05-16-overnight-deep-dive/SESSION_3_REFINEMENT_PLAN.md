---
type: refinement-plan
generatedAt: 2026-05-16
session: 3
basedOn: 2026-05-16-overnight-deep-dive
inputViolations: 2734
projectedAfterRefinement: ~1014 (-62%)
---

*** Session 3 — Rulebook + Detector Refinement Plan ***
*** Built from real overnight findings on falcon-web-platform-ui ***
*** Apply these to cut audit noise from 2734 → ~1014 ***

# Session 3 — Refinement plan

## What overnight learned

The first real frontend audit emitted **2,734 violations** across 1,192 files of `falcon-web-platform-ui`. Investigation shows ~62% of these are **false positives** from token registries, generated files, theme SoT, and showcase data — all of which are legitimately allowed to contain hex/px/raw markup that the rules normally flag.

Once exempt paths are tightened, the real signal drops to roughly **~1,014 violations** — still serious, but now actionable.

## Concrete rule refinements (apply in Session 3)

### R-FE-004 — Tokens only (hex / px hardcoded)

**Current count:** 2,271
**After refinement:** ~143

Add to frontmatter `scope.exemptPaths`:

```yaml
exemptPaths:
  - "libs/falcon-tokens/**"           # already there
  - "libs/falcon-theme/**"            # token SoT — hex IS the data
  - "libs/falcon-studio/**"           # studio registry — hex IS the catalog
  - "**/tailwind.css"                 # already there
  - "**/*tokens.css"                  # token files generally
  - "**/*.tokens.ts"                  # generated/typed token registries
  - "apps/host-shell/src/app/features/falcon-ui-showcase/**"  # showcase data
  - "**/component-tokens.generated.*" # generated artifacts
  - "**/abstraction-map.registry.*"   # design-system mapping data
  - "**/color-palette.config.*"       # palette config data
```

Also: the pattern itself is too greedy. Currently matches any hex anywhere. **Tighten the regex** to only fire on hex inside `style=`, `[ngStyle]`, inline class declarations, or raw `color:`/`background:`/`border:` CSS property values — NOT in TypeScript object literals that look like token catalogs.

### R-NOOR-003 — Typography scale

**Current count:** 148
**After refinement:** ~30

Many violations are in the org-hierarchy-page skeleton/wizard components using `text-xl`/`text-2xl` raw Tailwind. Refinement options:

1. **Tighten scope** — apply only to user-facing pages (`*-page.component.html`), not skeleton components
2. **Document the canonical scale** in the rule body (currently inferred); the V0.2 theme record names specific tokens — adopt them
3. **Add exemption** for `**/skeleton/**` (loading states use raw scale)

### R-FE-003 — No inline styles

**Current count:** 120
**After refinement:** ~120 (real signal — keep)

Top offender: `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts`. These ARE real inline styles in skeleton components. Skeleton anti-pattern needs the patterns/PATTERN-XX plan to address.

### R-FE-005 — Falcon library FIRST

**Current count:** 111
**After refinement:** ~111 (real signal — keep)

Top offender: `apps/admin-console/.../tab-components/applications-tab/...`. Real raw HTML inputs/buttons. Pattern atlas needs `<input>` → `<falcon-input>` migration plan.

### R-FE-001 — Tailwind utilities only

**Current count:** 38
**After refinement:** ~38

Concentrated in `change-password.component.ts` and similar. Some may be SCSS file references; per-file review needed.

### R-NOOR-005 — Palette over intent (admin-console)

**Current count:** 24
**After refinement:** ~24

Real signal. All in admin-console pages using `bg-primary`/`text-success` instead of palette-based names. Refactor pattern.

### R-NOOR-007 — i18n / RTL logical properties

**Current count:** 20
**After refinement:** ~20

Real signal. Physical margin/padding utilities (`ml-*` instead of `ms-*`). Mechanical refactor.

### R-NOOR-008 — Global selector hygiene

**Current count:** 2
**After refinement:** ~2

Two violations in `add-client-wizard`. Likely a single naked `body { }` or `:root { }` override that needs to move to the canonical theme file.

## Detector engine refinements

### regex-runner.ps1 — performance issue

**Symptom:** Full repo audit on falcon-web-platform-ui never completes in the overnight window because the fallback file enumerator walks `.angular/cache/`, `.nx/cache/`, `node_modules/` (millions of files × 11 rules).

**Fix:** Add a hard-coded exclude list at file-collection time:

```powershell
$alwaysExclude = @('node_modules', '.angular', '.nx', '.git', 'dist', 'bin', 'obj', '.vitepress', '.vs')
$allFiles = $allFiles | Where-Object {
  $rel = ...
  -not ($alwaysExclude | Where-Object { $rel -match "(^|/)$_(/|$)" })
}
```

This drops scan time from "never completes" to "~10 sec for 1192 files".

`quick-frontend-scan.ps1` already implements this. The pattern needs to migrate into the main `regex-runner.ps1` for parity.

### audit-orchestrator.ps1 — engine-runtimes.md mojibake fix

The orchestrator already writes reports with `-Encoding UTF8` after Session 2 refinement. Confirmed working in this run.

### Add a new rule: R-FE-015 — Generated artifacts should not be hand-edited

Discovery: `component-tokens.generated.ts` is hit hard, suggesting a generator/template needs updating, not the file directly. Worth a new rule that bans manual edits to `*.generated.*` and `dist/**` files.

## Process refinements

### Two-tier audit strategy

- **Tier 1 — Quick scan** (runs in seconds): narrow-scoped regex against `apps/` + `libs/`. Use for hourly/on-demand checks.
- **Tier 2 — Full audit** (runs overnight): all engines including AST + semantic. Use for nightly runs.

Today's `quick-frontend-scan.ps1` is the Tier 1 prototype. Wire it into `night-shift.ps1` as the first step (gets you signal in under a minute), then run the slower full audit.

### Auto-exemption from generated artifacts

Add to `night-shift.ps1`:

```powershell
# Detect generated-file markers in file headers
$generatedMarkers = @(
  '// THIS FILE IS GENERATED',
  '/* AUTO-GENERATED',
  '// DO NOT EDIT',
  '@generated'
)
```

Files with these markers automatically inherit a "synthetic" exemption from EVERY rule. This obviates having to maintain a glob list for generators.

## Rolling forward

When Session 3 starts:

1. Open this file
2. Apply the rule frontmatter changes (10–15 minutes)
3. Apply the regex-runner exclude-list patch (5 minutes)
4. Re-run the audit on falcon-web-platform-ui
5. Confirm violations drop from 2734 → ~1014
6. Then ship Session 3.1 (AST runners), 3.2 (semantic judge), 3.3 (more jobs), 3.4 (decisions queue)

## Related artifacts in this run

- [BACKUP_AGGREGATES.md](BACKUP_AGGREGATES.md) — raw violation aggregates
- per-rule/ — per-rule fix plans
- per-file/ — top 30 offender file plans
- patterns/ — refactor patterns
- per-app/ — per-app scorecards
- MORNING_REPORT.md — synthesis of all the above (written after agents finish)
