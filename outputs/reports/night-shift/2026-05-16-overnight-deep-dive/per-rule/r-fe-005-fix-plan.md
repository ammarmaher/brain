---
ruleId: R-FE-005
ruleName: Falcon library FIRST — no raw HTML replacements
severity: must
violationCount: 260
estimatedEffort: large
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

App templates must use Falcon UI Core (`<falcon-*>`) components for every primitive that has a Falcon equivalent — raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<dialog>`, `<progress>` in app HTML are forbidden unless documented as a GAP.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps` (all 3 apps, `*.html`):

| Tag pattern | Hits | Files |
|---|---|---|
| `<button` | 148 | 27 |
| `<input` (excluding type=hidden) | 94 | 21 |
| `<select`, `<textarea>`, `<table>`, `<dialog>`, `<progress>` | 13 + 5 = 18 | 10 |
| **Total** | **~260** | **~35 unique files** |

Top 5 offender files (by combined raw-primitive count):

1. `apps/host-shell/src/app/playground/playground.page.html` — 41 `<button>` + 9 `<input>` (playground is a demo; lower priority but still in-scope)
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` — 31 `<button>` + 2 `<input>` + 2 `<select>`
3. `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` — 15 `<button>` + 7 `<input>`
4. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` — 9 `<button>` + 6 `<input>`
5. `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — 7 `<button>` + 1 `<input>`

Per-app breakdown:
- admin-console: ~140 raw primitives, almost all in the org-hierarchy-page port (wizards + tabs + chart) — direct consequence of the React→Angular conversion shortcut documented in `project_react_to_angular_org_hierarchy_page`
- host-shell: ~75 raw primitives — playground (low-priority demo) + topbar/sidebar + auth flows
- management-console: ~5 raw primitives — clean per current waves
- Note: 0 PrimeNG (`p-*`) selectors found — confirms total removal program is intact

## 3. Why this matters (the architectural cost of leaving it)

Every raw `<button>` is a place where the design system does NOT apply automatically: no variant, no disabled state styling, no RTL flip, no token chain, no a11y baseline, no theme studio coverage. The 31 raw buttons inside `client-settings-step` are the most visible — Add Client is the canonical 5-step wizard and is the showcase flow for the platform. Each raw button is also a likely R-FE-004 violation (the styling has to come from somewhere — usually ad-hoc Tailwind classes with literals).

The 148 `<button>` total is by far the largest backlog of any rule in this audit. Closing it is the most direct way to retire raw markup from the platform and is the precondition for the "compliance table per UI section" reporting mandated by `feedback_falcon_custom_library_mandatory` §6.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Read the Falcon catalogue first.** Open `Brain Outputs/understanding/frontend/components/` and list every `<falcon-*>` component with API + USAGE + GAPS. Hold the catalogue as the lookup map for step 3.

- **Step 2 — Build the inventory.** Generate per-file CSV of every raw primitive with line number:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '<(button|input(?![^>]*type="hidden")|select|textarea|table|dialog|progress)\b' apps > audit/r-fe-005-inventory.txt
  ```

- **Step 3 — Triage by component.** Group by Falcon equivalent:
  - `<button>` → `<falcon-button>` (148 cases) — likely the single biggest morning task
  - `<input type="text|email|number|password">` → `<falcon-input>` (~70 cases)
  - `<select>` → `<falcon-dropdown>` (~13)
  - `<textarea>` → `<falcon-textarea>`
  - `<table>` → `<falcon-data-table>` or `<falcon-table>`
  - `<dialog>` → `<falcon-dialog>` / `<falcon-popup>`
  - `<progress>` → `<falcon-progress>`

- **Step 4 — Convert one canonical flow first.** Pick `client-settings-step.component.html` (33 hits) — replace every raw button with `<falcon-button variant="..." [disabled]="..." (click)="...">...</falcon-button>`. Map every `type="text"` input to `<falcon-input>`. Diff visually against the React reference.

- **Step 5 — Apply the R-FE-006 customization order strictly** for any case where a `<falcon-*>` component doesn't immediately fit:
  1. Use existing component inputs/templates/slots/variants (steps 1–4)
  2. Upgrade or extend the library component (steps 5–6)
  3. Author an app-level wrapper per R-FE-007 (step 7)
  4. Raw HTML with `<!-- GAP: R-FE-005 reason -->` marker + 70-Gaps note (step 8 only)

- **Step 6 — Defer `playground.page.html`.** Playground is a demo surface that intentionally shows raw primitives for comparison. Mark every raw primitive there with `<!-- GAP: R-FE-005 reason="playground-comparison" -->` OR add the file path to `EXEMPTIONS.md` under `R-FE-005`. Do NOT convert.

- **Step 7 — Sweep host-shell topbar + auth flows.** These are user-facing on every session — high visibility, high impact.

- **Step 8 — Sweep admin-console org-hierarchy-page family.** This is the bulk of remaining work; ~10 files.

- **Step 9 — Emit the compliance table per `feedback_falcon_custom_library_mandatory` §6.** For each UI section, fill:

  | UI element | Source need | Falcon component used | Reused / customized / upgraded / created | Dynamic API used | CSS/SCSS used? | Token compliance |
  |---|---|---|---|---|---|---|

- **Step 10 — Build verification + detector re-run.**

## 5. Estimated effort + complexity rationale

**large** — 260 hits is the largest backlog in this audit. While most conversions are mechanical (`<button>` → `<falcon-button>` with attribute mapping), every cluster surfaces gaps in the Falcon catalogue that require either component upgrades (per R-FE-006 step 5) or wrapper creation (R-FE-007). Plus the compliance table mandate from `feedback_falcon_custom_library_mandatory` adds per-section reporting overhead. Realistic: 2–3 days for a focused agent.

If the user accepts that playground (50 hits) is exempt-by-charter, the active backlog drops to ~210, still ~1.5–2 days.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-file: `git checkout HEAD -- <path>.html` reverts that file's primitives. Per-conversion: each `<falcon-button>` swap is a localized diff; if the visual breaks, restore just that line. The Falcon components are designed to drop in — most regressions will be either missing CSS class on the parent grid or an attribute that didn't map cleanly (consult API.md).

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '<button\b(?![^>]*\bfalcon-)' apps
  rg -n -g '*.html' '<input\b(?![^>]*\btype="hidden")(?![^>]*\bfalcon-)' apps
  rg -n -g '*.html' '<(select|textarea|table|dialog|progress)\b(?![^>]*\bfalcon-)' apps
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  ```
- expected output:
  - First three `rg` calls: zero matches OR only matches preceded by `<!-- GAP: R-FE-005 ... -->`
  - Both builds: exit code 0

## 8. Risk flags (anything that could break)

- **Falcon catalogue gaps are real.** `<table>` → `<falcon-table>` may not exist as a 1:1 swap — `<falcon-data-table>` might require a different data shape. Audit the catalogue before promising every conversion.
- **Reactive forms + `[formControlName]`** — `<falcon-input>` must accept `[formControlName]` and `ngModel`. Verify before mass-converting; otherwise the form bindings silently break.
- **`<input type="file">` is exempt by spec.** Native file inputs are the Safari iOS escape hatch documented in R-FE-005 example. Keep them, mark with GAP.
- **`<input type="hidden">` is also exempt** — Angular reactive forms generate these and they're harmless.
- **The 31 raw buttons in `client-settings-step.component.html`** are likely all "action chips" in a service table. The right move may be a new `<falcon-action-chip>` component (R-FE-006 step 6) rather than 31 `<falcon-button>` instances.
- **Add Client flow is documented in `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`** — read `08-BACKEND_API.md` and the 6 frontend section files before refactoring; the playbook IS the implementation spec per `CLAUDE.md` Brain SK protocol.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-006** — every conversion MUST follow the customization order; this rule and R-FE-006 are inseparable
- **R-FE-007** — when a wrapper is the right answer (step 7), R-FE-007 defines the skeleton+wrapper pattern
- **R-FE-004** — raw buttons are typically styled with raw values; one fix closes both
- **R-NOOR-006** — admin-console-scoped hardening of this rule (zero PrimeNG tolerance, GAP marker required); admin-console fixes satisfy both
- **R-FE-001** — Falcon UI Core IS the only UI kit; this rule is the consumer-side check
- **R-FE-012** — build must stay green after each conversion batch
