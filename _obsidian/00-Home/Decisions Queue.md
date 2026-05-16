---
type: hub
purpose: decisions-queue
created: 2026-05-16
status: active
---

*** Falcon Decisions Queue ***
*** What needs your call — sorted by impact, ranked by urgency ***
*** Each row links to evidence + a proposed action ***

# 🎯 Decisions Queue

> The single morning view of everything the Brain wants you to decide. Each row is one outstanding question with explicit options. Click into the linked evidence; check ✅ or ❌; the brain cascades the change.

## 🟢 Open decisions — morning of 2026-05-16

### D-2026-05-16-01 — Should the `tests/**` glob fix change which rules consider test code "in scope"?

**Status:** open
**Linked:** [glob fix commit 20e6186](https://github.com/ammarmaher/brain/commit/20e6186) · [[NIGHT_SHIFT_BOUNDARIES]] · [PLATFORM_AUDIT_FINDINGS](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/PLATFORM_AUDIT_FINDINGS.md)
**Context:** The glob fix means `**/Tests/**` now correctly matches `tests/Foo.cs`. This evaporates 13 test-file false positives BUT — should some rules still apply inside tests?

| Rule | Test-applicable? | Default |
|---|---|---|
| R-BE-005 MultiLanguageName | NO — test entities don't need EN/AR | exempt ✅ |
| R-BE-006 FalconException | NO — tests simulate failures with bare throws | exempt ✅ |
| R-BE-007 No hardcoded secrets | NO — test fixtures own their own conn strings | exempt ✅ |
| R-BE-002 App-service-to-app-service | YES — integration tests still violate the principle | apply 🚫 |
| R-BE-004 ServiceOperationResult<T> | YES — tests asserting on result type need it | apply 🚫 |

**Options:**
- ☐ Accept the default split above (most rules exempt tests, architecture rules still apply)
- ☐ Make EVERY rule exempt `tests/**` (less noise, weaker enforcement)
- ☐ Make NO rule exempt `tests/**` (strongest enforcement, lots of noise)

**Recommended:** Option 1 (current state after Item 1). Document in `EXEMPTIONS.md`.

---

### D-2026-05-16-02 — R-NOOR-003 typography migration: do we go file-by-file or one big sweep?

**Status:** open
**Linked:** [r-noor-003-fix-plan](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/per-rule/r-noor-003-fix-plan.md) · 146 violations
**Context:** 146 R-NOOR-003 typography-scale violations in admin-console. Item 2 will kill 26 in one file. The other 120 are spread across 20+ files. Two strategies:

**Options:**
- ☐ **File-by-file** — open the audit's per-file report, fix the worst offender, build, commit, repeat. Slow but visible. (~6h)
- ☐ **One mega-sweep** — single agent run with regex replacements for all `text-[Npx]` → token equivalents. Risky but fast. (~1h)
- ☐ **Hybrid** — kill 5 biggest offenders manually (already started with Item 2), then mega-sweep the rest.

**Recommended:** Hybrid. Item 2 proves the migration pattern on one file; if its build is green and the page renders correctly, mega-sweep the remaining 120 with confidence.

---

### D-2026-05-16-03 — PATTERN-04 SCSS→Tailwind: how to handle load-bearing CSS (`::ng-deep`, animations, focus rings)?

**Status:** open
**Linked:** [PATTERN-04 playbook](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/patterns/PATTERN-04-scss-file-to-tailwind.md)
**Context:** Some component SCSS contains rules that don't translate to Tailwind utilities (e.g. `::ng-deep` selectors styling PrimeNG children, keyframe animations, focus-visible polyfills). The Ammar agent will document each one as a blocker in `scratch/PATTERN-04-blockers.md`.

**Options:**
- ☐ **Migrate everything possible**, document blockers, ship a partial fix (e.g. 40/44)
- ☐ **All-or-nothing** — every SCSS must go, port load-bearing rules into the canonical theme file
- ☐ **Keep the file, just normalize** — leave SCSS in place but ensure it uses tokens, not hex values

**Recommended:** Option 1. Each blocker becomes a separate Decisions Queue row tomorrow.

---

### D-2026-05-16-04 — Re-run the night-shift audit at noon to confirm burndown?

**Status:** open
**Context:** If you accept Items 1–4 and they land, the platform audit should drop from 275 → ~181. A re-run validates the math. Cost: 53 minutes of background CPU.

**Options:**
- ☐ Yes — re-run at noon
- ☐ No — wait until end-of-week to re-baseline

**Recommended:** Yes. Burndown is only real if measured.

---

### D-2026-05-16-05 — Should the AST runners be invoked on EVERY night-shift run, or only on Saturdays?

**Status:** pending Item 5 completion
**Linked:** [Session 3 detector wiring](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/SESSION_3_PLAN.md)
**Context:** AST runners are slower than regex (tsx must compile each file). On 11 repos with ~900 TS + ~600 CS files, expected runtime is 10-30 min per night.

**Options:**
- ☐ Every night — slower but always-current
- ☐ Mondays + Saturdays only — twice-weekly snapshot
- ☐ Pre-PR only — wire to `git pre-push` instead of night shift

**Recommended:** Every night. Compounds learning. If runtime balloons past 30 min, revisit.

---

## 🔵 Tier 2 Architecture findings (added 2026-05-16 afternoon)

### D-2026-05-16-11 — `auth/logout` is never called from the frontend 🔴 HIGH

**Source:** Agent E (Auth Flow Architecture). The frontend `logout()` only clears local state (`sessionStorage` + facades). The Identity Service `auth/logout` endpoint is **never invoked**, so:
- No backend audit trail of logout events
- No Zitadel session revocation
- Compromised tokens stay valid until expiry

**Options:**
- ☐ Fix — wire `AuthApiService.logout()` HTTP call BEFORE local cleanup (recommended)
- ☐ Defer — accept the gap; document as known issue
- ☐ Investigate — is the endpoint already wired but disabled? Check the AuthService

**Recommended:** Fix. ~30 min change in `LoginService` / `AuthService`.

---

### D-2026-05-16-12 — `adminConsoleGuard` is commented out 🔴 HIGH (security)

**Source:** Agent F (Routing Topology). At `apps/admin-console/src/app/app.routes.ts` the `adminConsoleGuard` import is present but the `canActivate` binding is commented out. This means direct standalone access at `http://localhost:4204/admin-console` is ungated — host-side `shellAccessMatchGuard` only protects the federation route.

**Options:**
- ☐ Restore — uncomment the canActivate binding (defense-in-depth)
- ☐ Remove the import — accept host-only gating, delete the dead import
- ☐ Keep as-is — only matters in dev (standalone mode for admin-console testing)

**Recommended:** Restore. Defense-in-depth is the doctrine; dev convenience can use the MockAuth fallback Agent E surfaced.

---

### D-2026-05-16-13 — Dead redirect targets cause wildcard-bounce loops 🔴 HIGH

**Source:** Agent F. Admin-console redirects `''` → `organization-hierarchy` (doesn't exist). Management-console redirects `''` → `dashboard` (doesn't exist). Both fall through to the wildcard `**` route, which redirects back to `''`, creating a bounce loop in the browser URL bar.

**Options:**
- ☐ Fix both — redirect to a real landing page in each app
- ☐ Add the missing routes — make `organization-hierarchy` and `dashboard` actual routes
- ☐ Investigate — are these the right landing targets but the components are renamed?

**Recommended:** Investigate first (the redirect targets may be misnamed); then fix accordingly. Likely 30 min including the audit.

---

### D-2026-05-16-14 — Refresh-token race across host + MF remotes 🟠 MEDIUM

**Source:** Agent E. Each app has its own `AuthService` with a per-app refresh mutex. When the access token expires, host-shell + admin-console + management-console can each detect it simultaneously. The first remote to call `auth/refresh-token` rotates the refresh token; a parallel call from a second app fails with `invalid_grant` and forces a logout.

**Options:**
- ☐ Centralize refresh in host-shell — remotes proxy through DI `FALCON_AUTH` for refresh
- ☐ Use a `BroadcastChannel` mutex across tabs/apps
- ☐ Accept — the race is rare in practice; document as known limitation

**Recommended:** Centralize via DI. The federation pattern already gives us `FALCON_AUTH` as a singleton — refresh should be the host's responsibility.

---

### D-2026-05-16-15 — Typography scale is non-monotonic 🟠 MEDIUM (bug)

**Source:** Agent A (Token Taxonomy). `--text-xl` = 28px but `--text-2xl` = 24px. The scale goes backwards at that step.

**Options:**
- ☐ Swap the values (likely intent: `text-xl` 24px, `text-2xl` 28px) — restores monotonicity
- ☐ Investigate — was this intentional? Check git blame
- ☐ Accept — designers wanted the bump; document with a comment

**Recommended:** Investigate + swap. Probably a typo from an earlier edit.

---

### D-2026-05-16-16 — Zombie prime-ng routes (Wave PR-8 cleanup) 🟠 MEDIUM

**Source:** Agent F. Static-MF preview routes in host-shell still reference `prime-ng/organization-hierarchy` and similar paths that were removed in the PrimeNG purge. Dead routes pointing at deleted components.

**Options:**
- ☐ Remove dead routes — clean up host-shell routes table
- ☐ Verify first — make sure no dynamic code references these route paths
- ☐ Leave as fallback for if PrimeNG re-enters

**Recommended:** Remove. PrimeNG is gone for good per memory `project_falcon_primeng_total_removal_complete`.

---

### D-2026-05-16-17 — Stale duplicate services in host-shell root 🟠 MEDIUM

**Source:** Agent D + Agent B both flagged `apps/host-shell/src/app/remote-config.ts` and `apps/host-shell/src/app/remote-route.service.ts` as duplicates of canonical versions in `apps/host-shell/src/app/core/services/`.

**Options:**
- ☐ Delete the duplicates — keep only `core/services/` versions
- ☐ Verify imports — make sure nothing imports the duplicates
- ☐ Investigate — was the split intentional for legacy?

**Recommended:** Delete after import audit (~15 min).

---

### D-2026-05-16-18 — Stray semicolon typo in tokens.css 🟢 LOW (1-min fix)

**Source:** Agent A. `libs/falcon-theme/src/falcon-tailwind-tokens.css:75` has `--color-falcon-green-50: #F3F8F5;;` (double semicolon).

**Options:**
- ☐ Fix — remove the extra semicolon
- ☐ Leave — Tailwind v4 ignores it; harmless

**Recommended:** Fix. Trivial cleanup.

---

### D-2026-05-16-19 — management-console scaffolded but features/ is empty 🟢 LOW

**Source:** Agent D. The `management-console` app exists, builds, has a Module Federation expose, has 1 route — but `src/app/features/` is empty. Is this intentional?

**Options:**
- ☐ Confirm intentional — keep as scaffold for future features
- ☐ Remove the app — if no features are planned, don't ship an empty app
- ☐ Add first feature — give it a real reason to exist

**Recommended:** Confirm with you (this is a product decision).

---

### D-2026-05-16-20 — `mf-diagnostic.service.ts` + `mf-contract.ts` unaudited 🟢 LOW

**Source:** Agent B. These two files weren't fully audited in the Module Federation deep-dive. Need a follow-up audit pass to confirm whether they're production code or dev tools.

**Options:**
- ☐ Audit follow-up — spawn a focused agent to review both files
- ☐ Defer — flag for next architectural review

**Recommended:** Defer to Tier 3 ADR work (the diagnostic service might warrant its own ADR).

---

## 🟡 Decisions awaiting closure (carry-over from last run)

(none — this is the first Decisions Queue note)

## 🔴 Halted / blocked

(none — all morning agents working)

## ⚪ Closed decisions (history)

(none yet — each closed decision adds a row here with the choice + date)

## How the brain reads this note

Each ☐ checkbox is parsed by `tools/decisions/process-queue.ps1` (Session 4 deliverable). When you check ✅:

1. The brain updates the relevant rule, exemption, or job
2. Cascades through dependent notes (`PATTERNS_INDEX`, `TOP_PRIORITY_FIXES`, `NIGHT_SHIFT_BOUNDARIES`)
3. Logs the decision to `outputs/decisions/D-<id>.md` with the choice + timestamp + cascade summary
4. Removes the row from this queue → moves to "Closed decisions"

Until the processor exists, treat this as a human checklist + log your choice manually below the row.

## Related

- [PLATFORM_AUDIT_FINDINGS](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/PLATFORM_AUDIT_FINDINGS.md)
- [TOP_PRIORITY_FIXES](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/TOP_PRIORITY_FIXES.md)
- [[NIGHT_SHIFT_BOUNDARIES]]
- [[RULES_INDEX]]
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #decisions-queue #morning-of/2026-05-16
