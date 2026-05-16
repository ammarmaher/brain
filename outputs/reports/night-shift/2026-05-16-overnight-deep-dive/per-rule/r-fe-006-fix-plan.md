---
ruleId: R-FE-006
ruleName: Customization order — GAP marker required for raw HTML
severity: must
violationCount: 260
estimatedEffort: large
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

When the Falcon component library doesn't exactly meet a page's needs, work the strict 8-step customization order (inputs → templates → slots → variants → upgrade lib → new lib component → app wrapper → raw HTML with documented GAP) — every raw HTML primitive in app templates must declare an `<!-- GAP: R-FE-006 reason -->` marker plus a matching note in `Brain Outputs/70-Gaps/`.

## 2. What we found (counts + top 5 offender files)

This rule is the semantic-LLM hardening of R-FE-005. Its scope is exactly the same raw-primitive surface (260 hits across 35 files) PLUS a separate concern: `class="..."` overrides on `<falcon-*>` tags and `::ng-deep` overrides.

Regex pre-pass results:

| Detector pattern | Hits |
|---|---|
| Raw primitives without preceding `<!-- GAP: R-FE-006 ... -->` marker | ~260 (same surface as R-FE-005, zero have GAP markers today) |
| `::ng-deep` usages | (deferred to LLM verdict — not in mechanical sweep) |
| `class="..."` attributes on `<falcon-*>` tags with layout/spacing utilities | (LLM-verdict territory; not enumerable by pure regex) |

Top 5 offender files (same as R-FE-005's top 5, by raw-primitive density). Repeated here for context:

1. `apps/host-shell/src/app/playground/playground.page.html` — 50 raw primitives, ZERO GAP markers
2. `apps/admin-console/.../add-client-wizard/client-settings-step.component.html` — 33 raw primitives, ZERO GAP markers
3. `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` — 22 raw primitives, ZERO GAP markers
4. `apps/admin-console/.../user-details/user-details-page.component.html` — 15 raw primitives, ZERO GAP markers
5. `apps/admin-console/.../org-hierarchy-page-menu.component.html` — 8 raw primitives, ZERO GAP markers

Crucial finding: **across all 260 raw-primitive occurrences in apps, ZERO carry a `<!-- GAP: R-FE-006 -->` marker or `<!-- GAP: R-FE-005 -->` marker**. Every single one is an unjustified bypass of the customization order.

Per app: identical distribution to R-FE-005.

## 3. Why this matters (the architectural cost of leaving it)

R-FE-005 says "use Falcon components". R-FE-006 says "if you can't, prove you tried steps 1–7 first, AND document the GAP so it can be retired later." Without R-FE-006 enforcement, every raw primitive is an undocumented escape hatch — the team has no roadmap of what to fix in the library, no inventory of where the design system actually fails, and no audit trail showing the customization order was even consulted.

The `feedback_orchestrator_failure_modes_org_hierarchy` standing rule (5 rounds → 0% delivered on the org-hierarchy comm-channels task) was caused precisely by skipping this order — agents kept reaching for raw HTML when a Falcon input would have worked. Re-running with R-FE-006 enforcement is the single biggest lever to prevent that failure mode from recurring.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Pair this fix with R-FE-005.** The two are inseparable. The R-FE-005 plan converts raw primitives to Falcon equivalents; the R-FE-006 plan adds GAP markers where conversion isn't viable AND audits whether the customization order was applied.

- **Step 2 — For each R-FE-005 conversion in progress, emit the compliance table** (mandated by `feedback_falcon_custom_library_mandatory.md` §6):

  | UI element | Source need | Falcon component used | Reused / customized / upgraded / created | Dynamic API used | CSS/SCSS used? | Token compliance |
  |---|---|---|---|---|---|---|

  If the table row is "raw HTML / created / page-local" → that's where the GAP marker plus 70-Gaps note must appear.

- **Step 3 — Audit `class="..."` overrides on Falcon tags.** Run:
  ```
  rg -n -g '*.html' '<falcon-[a-z-]+[^>]*\bclass="[^"]*\b(m[ltrbxy]?|p[ltrbxy]?|gap|flex|grid|w|h|absolute|fixed|sticky)' apps
  ```
  Every hit is a candidate violation. For each:
  - Could an existing input/variant/slot satisfy this? If yes → use it, remove the class override.
  - Is this a true layout-from-parent placement (the parent grid telling the child its column span)? If yes → it's fine. Class belongs in the parent, not on the child component as a default.
  - Is this fighting the component's intrinsic style? If yes → upgrade the component (R-FE-006 step 5).

- **Step 4 — Audit `::ng-deep` usage.** Run:
  ```
  rg -n --type ts --type scss --type css '::ng-deep' apps libs
  ```
  Every hit is an automatic violation (component-internal styling reach-in). Remove + replace with proper input/slot/variant, or upgrade the library.

- **Step 5 — File one GAP note per truly-blocked raw primitive.** Path: `Brain Outputs/70-Gaps/<component-or-feature>.md`. Include:
  - Why a Falcon equivalent doesn't work (specific limitation)
  - Suggested fix (upgrade lib? new component?)
  - Estimated effort
  - Owner (which agent will pick it up)

- **Step 6 — Backlog the upgrade items.** Each GAP note becomes a planning item. Tier-rank by frequency: a gap touching 30 raw primitives across 8 files is Tier 1; a gap touching one playground experiment is Tier 3.

- **Step 7 — Re-run detector + compliance check.**

## 5. Estimated effort + complexity rationale

**large** — Inherits R-FE-005's 2–3 day surface. R-FE-006 adds:
- The semantic-LLM verdict pass per raw primitive (~5–10 min per file × 35 files)
- The compliance table per UI section (~30 min per major flow × ~12 flows)
- The `::ng-deep` + class-override audit (~2 hours one-time)
- GAP note authoring (~15 min per genuinely-blocked case × ~10–15 cases)

Net add over R-FE-005: ~1 day. Combined R-FE-005+R-FE-006 budget: 3–4 days.

## 6. Rollback hint (how to undo if the fix is wrong)

GAP markers and 70-Gaps notes are pure additions — they don't change runtime behaviour. Rolling back is trivial: `git rm` the 70-Gaps file, `git diff` the templates to spot the markers, remove them. The customization-order audit produces decisions about whether to upgrade a library component — those land as separate PRs and have their own rollback paths per R-FE-007.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Raw primitives must each be preceded by a GAP marker OR converted
  rg -n -g '*.html' -B 1 '<(button|input(?![^>]*type="hidden")|select|textarea|table|dialog|progress)\b(?![^>]*\bfalcon-)' apps | rg -v 'GAP: R-FE-00[56]'
  
  # No ::ng-deep anywhere outside library
  rg -n '::ng-deep' apps libs
  
  # Verify GAP notes exist for declared gaps
  Get-ChildItem -Recurse "C:\Falcon\Brain Outputs\70-Gaps\" -File
  ```
- expected output:
  - First `rg`: empty (every raw primitive either has a GAP marker or has been converted)
  - Second `rg`: zero hits in apps; `libs/falcon-ui-core` may legitimately have some
  - GAP notes count: one per blocked primitive (or one note per group of related primitives)

## 8. Risk flags (anything that could break)

- **The `feedback_falcon_custom_library_mandatory` compliance table is verbose**. Tempting to skip; don't. The table IS the documentation of the customization-order audit.
- **`::ng-deep` removal can break visual polish silently** — the component currently relies on the reach-in. Remove + test + upgrade the library API if needed.
- **GAP note proliferation** — if you end up with 50 GAP notes after this pass, the design system has a real gap problem. Surface as a roadmap item, not an embarrassment.
- **Customization order is a tree, not a list** — for some primitives, step 5 (upgrade lib) is the right answer even if it costs more upfront, because the same gap will recur in 5 other places. Triage by frequency.
- **The wizard's 31 raw buttons are likely all action-chips** — the right answer may be a new component (`<falcon-action-chip>`) rather than 31 individual `<falcon-button>` wrappings. Make that call deliberately.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-005** — twin rule, inseparable; this is R-FE-005's enforcement teeth
- **R-FE-007** — step 7 of the order; defines the wrapper layer architecture
- **R-FE-001** — Falcon library-is-only-UI-kit; this rule audits *how* you used it
- **R-NOOR-006** — admin-console hardening with GAP-marker mandate + zero PrimeNG tolerance
- **R-FE-012** — every conversion closes with build exit 0
