---
ruleId: R-XC-008
name: Trunk-Based Development — short-lived branches, release by tag, feature flags
category: operational
scope:
  apps:
    - "*"
  paths:
    - "**/.git/**"
  exemptPaths: []
severity: must
detector:
  type: structural
  patterns:
    - 'release/.*'
    - 'hotfix/.*'
  exemptPatterns:
    - 'main'
    - 'feat/.*'
    - 'fix/.*'
    - 'chore/.*'
  description: |
    Structural git audit. For each Falcon repo: (1) enumerate non-main branches with `git for-each-ref --format='%(refname:short) %(committerdate:unix)'`, (2) classify by name prefix, (3) compute age = now − committerdate, (4) flag any non-main branch whose age exceeds 2 days OR whose name matches `release/*` / `hotfix/*` (long-lived branch shapes that TBD forbids). Surface B: production deploys not originating from a tag on main → flag.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Merge the long-lived branch back to main behind a feature flag, or delete it. Manual review required.'
relatedRules:
  - R-XC-001
  - R-XC-004
  - R-XC-005
  - R-XC-006
source:
  - file: Home/Software-Architecture-Design/Development-&-Deployment-Strategy.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-008 — Trunk-Based Development; short-lived branches, release by tag ***
*** Source: Development-&-Deployment-Strategy.md (Trunk-Based Development with Tag-Based Releases) ***
*** Detector: structural (git branch-age + name-pattern audit) ***

# R-XC-008 — Trunk-Based Development

## What it says

Every Falcon repository follows **Trunk-Based Development**:

1. **`main` is the only long-lived branch.** All code flows through `main`.
2. **Feature branches are small and short-lived** — target lifespan hours to 1–2 days, never longer.
3. **No `release/*` or `hotfix/*` long-lived branches.** Branch names follow `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
4. **`main` is always releasable** — every commit on `main` must build green (see [[R-XC-004-build-must-be-green]]) and be in a deployable state.
5. **Releases are created from tags on `main`** — not from branches. Production deploys originate from `v<major>.<minor>.<patch>` tags pointing at `main` commits.
6. **Feature flags for incomplete work** — incomplete features merge to `main` behind a flag rather than living on a long-lived branch. Code may exist in production but stay disabled until ready.

## Why it exists

Per `falcon-wiki/Home/Software-Architecture-Design/Development-&-Deployment-Strategy.md`, the Falcon platform's deployment model is Trunk-Based Development with Tag-Based Releases. Long-lived feature branches diverge from `main`, accumulate merge debt, and break the "always releasable" guarantee. The strategy explicitly states: "Incomplete features must NOT block merging into `main`. Instead of delaying integration, we merge early and control exposure using feature flags." This rule encodes that strategy as a per-repo audit so the morning briefing can flag any drift.

## Detector strategy

**Structural** git audit per repo:

1. **Branch inventory** — `git for-each-ref refs/heads --format='%(refname:short)|%(committerdate:unix)'`.
2. **Classify by name prefix**:
   - `main` → exempt (only long-lived branch allowed).
   - `feat/*`, `fix/*`, `chore/*` → short-lived candidates; check age.
   - `release/*`, `hotfix/*`, `develop`, `staging`, `qa` → **violation** (TBD forbids these long-lived shapes).
   - Anything else → soft warning, flag for naming-convention review.
3. **Age check** — for each short-lived branch, compute `now − committerdate` in days. If `> 2 days` → soft warning (Wiki target: hours to 1–2 days). If `> 7 days` → violation (clearly long-lived now).
4. **Tag-based release check** — for each `v<major>.<minor>.<patch>` tag in the last 30 days, verify `git merge-base --is-ancestor <tag> main` returns 0 (the tag points at a commit on `main`'s ancestry). Any release tag NOT on `main`'s line → violation.
5. **Feature-flag check** (semantic, supplementary) — if a long-lived branch is detected and the branch description references "WIP feature", flag with the suggestion "merge to main behind a flag instead".

## Examples

### ✅ Good — repository state

```
$ git for-each-ref refs/heads --format='%(refname:short) %(committerdate:relative)'
main                          1 minute ago
feat/edit-user-email-field    3 hours ago
feat/wallet-balance-export    1 day ago
fix/tariff-rounding-bug       6 hours ago

$ git tag --sort=-creatordate | head -3
v2.14.3
v2.14.2
v2.14.1

$ git merge-base --is-ancestor v2.14.3 main && echo "tag on main"
tag on main
```

Every non-main branch is < 2 days old, named by TBD convention, and releases are tags on `main`. ✅

### ❌ Bad — repository state

```
$ git for-each-ref refs/heads --format='%(refname:short) %(committerdate:relative)'
main                          5 minutes ago
release/2026-Q2               45 days ago     ← long-lived release branch
develop                       180 days ago    ← long-lived integration branch
feat/big-rewrite              60 days ago     ← clearly long-lived
hotfix/urgent-thing           21 days ago     ← long-lived hotfix branch
```

Violation on four counts: `release/*` and `hotfix/*` are forbidden shapes, `develop` is a forbidden long-lived integration branch, and `feat/big-rewrite` exceeds the 7-day hard threshold. The fix: feature-flag the big rewrite and merge it to `main` incrementally; delete `develop`; release from `main` tags only; convert any `hotfix/*` to a fast `fix/*` short-lived branch off `main`.

## Known legitimate exemptions

- **One-shot Angular major upgrade branches** (e.g., `chore/angular-21-upgrade`) — these legitimately take longer than 2 days. They must be (a) explicitly approved by Ammar, (b) documented in `outputs/reports/operational-exemptions/`, and (c) closed within 7 days with the carryover work feature-flagged.
- **Emergency hotfix paths** during production incident — a `fix/<incident-id>` branch off the production tag rather than `main` is permitted for the duration of the incident. Must collapse back to `main` within 24 hours.
- Anything in `exemptions/EXEMPTIONS.md` with a dated justification.

## Fix recipe

When a long-lived branch is detected:

1. Identify the branch + its age + its current divergence from `main` (`git rev-list --count main..<branch>`).
2. Decide:
   - **Mergeable now** — rebase on `main`, run [[R-XC-004]] build check, merge to `main` behind a feature flag if incomplete.
   - **Diverged too far** — pair-program with Ammar to bring it back; or extract the completed slices behind flags and ship them; or abandon.
3. Delete the long-lived branch after merge.
4. If the violation is `release/*` or `hotfix/*` — convert the workflow to tag-based releases:
   - Tag the last green `main` commit as `v<X>.<Y>.<Z>`.
   - Delete the `release/*` branch.
   - Update CI / deploy pipelines to deploy from tags, not branches.
5. Log in `outputs/reports/operational-incidents/`.

## Related rules

- [[R-XC-004-build-must-be-green]] — `main` always-deployable requires green builds
- [[R-XC-005-never-commit-without-permission]] — small short-lived branches make commit discipline easier
- [[R-XC-006-never-push-without-permission]] — applies regardless of branch lifetime
- [[R-XC-001-identity-owns-user-lifecycle]] — architecture migrations land as feature-flagged trunk commits

## Sources of truth

1. `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Development-&-Deployment-Strategy.md` — full TBD spec
2. `C:\Falcon\CLAUDE.md` — "Key Architecture Rules" rule #5: *"Trunk-Based Development — short-lived branches, feature flags, release by tag"*
