---
ruleId: R-NOOR-006
ruleName: Component reuse — Falcon library FIRST in admin-console
severity: must
violationCount: 33
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, every interactive control (input, select, button, textarea, table, dialog, dropdown, etc.) must use the corresponding `<falcon-*>` component — raw HTML primitives need a `<!-- noor:exempt-component-reuse reason="GAP-XXX" -->` marker plus a matching GAPS_AND_UPGRADES entry, and PrimeNG selectors (`p-button`, `p-dropdown`, ...) are NEVER allowed.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Tag pattern | Hits | Files |
|---|---|---|
| `<button` | 26 | 13 |
| `<input` | partial of 7 | 5 |
| `<select`, `<textarea>`, `<table>`, `<dialog>` | partial of 7 | 5 |
| `<p-*>` (PrimeNG) | **0** | 0 |
| **Total raw primitives** | **~33** | **~14 files** |

PrimeNG: ZERO. Confirms total removal (2026-05-10) holds for admin-console.

Top 5 offender files (by combined raw-primitive count):

1. `apps/admin-console/.../user-details/user-details-page.component.html` — 6 `<button>` + multiple `<input>` (heaviest)
2. `apps/admin-console/.../falcon-chart-toolbar.component.html` — 4 `<button>`
3. `apps/admin-console/.../falcon-org-node-drawer.component.html` — 3 `<button>` + 1 input/select/etc.
4. `apps/admin-console/.../verify/otp-dialog.component.html` — 2 `<button>` + 2 input-family
5. `apps/admin-console/.../client-settings-step.component.html` — 2 `<button>` + 2 input-family

Total: 33 raw-primitive occurrences across ~14 admin-console files, ZERO carrying a `<!-- noor:exempt-component-reuse -->` marker.

Per-app: this rule is admin-console only. (Total raw primitives in admin-console = ~33 vs. total in all apps = ~260 from R-FE-005 audit; admin-console is ~13% of total raw-primitive surface.)

## 3. Why this matters (the architectural cost of leaving it)

R-NOOR-006 is the admin-console hardening of R-FE-005 with zero PrimeNG tolerance + mandatory GAP markers. The standing rule (`feedback_falcon_custom_library_mandatory` 2026-05-15) requires every UI task to consult `Brain Outputs/understanding/frontend/components/<name>/` API+USAGE+TOKENS+GAPS+DECISION dossiers BEFORE writing markup and emit a compliance table per section.

The 33 raw primitives in admin-console all live inside the org-hierarchy-page port — the canonical admin flow (per `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`). Fixing them is the most visible improvement Noor can deliver this week.

User Details is the worst offender at 6+ raw buttons. It's also the most visible page in the admin tenant browsing flow.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Read the Falcon catalogue.** Open every component dossier in `Brain Outputs/understanding/frontend/components/`. Note especially `<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-data-table>`, `<falcon-dialog>`. Build the mapping table for Step 3.

- **Step 2 — Read the standing rule.** `feedback_falcon_custom_library_mandatory.md` §6 — the compliance table is mandatory PER SECTION of each refactored file.

- **Step 3 — Build the inventory.**
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '<(button|input(?![^>]*type="hidden")|select|textarea|table|dialog)\b(?![^>]*\bfalcon-)' apps/admin-console > audit/r-noor-006-inventory.txt
  ```

- **Step 4 — Convert by file, starting with `user-details-page.component.html`.** Per the canonical conversion recipe:
  1. Map every `<button>` to `<falcon-button variant="..." [disabled]="..." (click)="...">...</falcon-button>`
  2. Map every `<input type="text|email|number|password">` to `<falcon-input label="..." [(ngModel)]="..." ...>`
  3. Map every `<select>` to `<falcon-dropdown [options]="..." [(ngModel)]="..." label="...">`
  4. Map every `<textarea>` to `<falcon-textarea label="..." [(ngModel)]="..." rows="...">`
  5. Map every `<table>` to `<falcon-data-table>` (consult API.md for data-shape requirements)
  6. Map every `<dialog>` to `<falcon-dialog>` / `<falcon-popup>`

- **Step 5 — For each section emit the compliance table.** Per `feedback_falcon_custom_library_mandatory` §6:

  | UI element | Source need | Falcon component used | Reused / customized / upgraded / created | Dynamic API used | CSS/SCSS used? | Token compliance |
  |---|---|---|---|---|---|---|

- **Step 6 — Apply R-FE-006 customization order** for any case where a `<falcon-*>` component doesn't immediately fit (inputs → templates → slots → variants → upgrade lib → new lib component → wrapper → raw HTML with GAP).

- **Step 7 — For any genuinely-blocked primitive:**
  1. Add the marker: `<!-- noor:exempt-component-reuse reason="GAP-AC-XXX details" -->`
  2. File a matching entry in `Brain Outputs/70-Gaps/` AND in `Brain Outputs/understanding/frontend/components/<name>/GAPS_AND_UPGRADES.md`

- **Step 8 — Tackle remaining 13 files.** Wizard step files share a pattern; converting one teaches the others.

- **Step 9 — Re-run detector + verify ZERO PrimeNG selectors persist.**

- **Step 10 — Full build matrix + Falcon Eyes visual diff.**

## 5. Estimated effort + complexity rationale

**medium** — 33 hits across 14 files, lower than the universal R-FE-005 count (260). The advantage: admin-console is the test-bed for the Wave 16 skeleton+wrapper pattern (`<app-do-payment-priority-popup>` reference). Each conversion is well-understood. Realistic: 1 day for a focused agent (8 hours), including the compliance tables.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-file: `git checkout HEAD -- <file>.html` reverts to raw primitives. Per-conversion: each `<falcon-*>` swap is a localized diff; if the visual breaks, restore just that line. Most likely failure is attribute-mapping (Falcon component expects `[options]` not `options`); consult API.md and re-apply.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Should be zero or only GAP-marked
  rg -n -g '*.html' -B 1 '<(button|input(?![^>]*type="hidden")|select|textarea|table|dialog)\b(?![^>]*\bfalcon-)' apps/admin-console | rg -v 'noor:exempt-component-reuse'
  # PrimeNG MUST remain zero
  rg -n -g '*.html' '<p-(button|input|dropdown|table|dialog|calendar|menu|tabview|tree|toast|tag|chip|checkbox|radiobutton|inputtext|inputnumber|inputmask|password|multiselect|select|panelmenu|tieredmenu|menubar|breadcrumb|steps|accordion|paginator|datatable)\b' apps
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - First `rg`: empty (or only documented GAP-marked exemptions)
  - Second `rg`: zero (PrimeNG total removal preserved)
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Reactive forms binding** — `<falcon-input>` must accept `[formControlName]`. Verify before mass-conversion.
- **`<falcon-data-table>` data shape** may differ from raw `<table>` row/col structure. Plan a wrapper if needed.
- **OTP dialog** is on the critical path; any conversion regression blocks Add Client / Add User wizards. Test end-to-end.
- **Falcon catalogue gaps** — if the catalogue doesn't yet have a component the page needs (e.g. `<falcon-toolbar>` for `falcon-chart-toolbar.component.html`'s 4 buttons), follow R-FE-006 step 5/6 to upgrade or create.
- **Compliance table generation is verbose** — but mandatory. Don't skip; the table IS the audit trail.
- **`falcon-chart-toolbar`'s 4 buttons** are likely zoom/pan/center/expand controls — a `<falcon-toolbar>` component might not exist; this is an R-FE-006 step-6 (new lib component) candidate.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-005** — universal library-first rule; this is its admin-console-hardened version
- **R-FE-006** — customization order; mandatory before raw HTML
- **R-FE-007** — skeleton + wrapper architecture; informs new-component creation
- **R-NOOR-001** — Falcon components must respect layout ownership too
- **R-FE-001** — Falcon UI Core is the only UI kit
- **R-FE-012** — build green after each conversion batch
