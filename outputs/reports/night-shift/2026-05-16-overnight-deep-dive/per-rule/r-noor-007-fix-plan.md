---
ruleId: R-NOOR-007
ruleName: i18n & RTL — strings from catalog, logical spacing only
severity: must
violationCount: 45
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`: (A) layout uses logical-property utilities only (`ms-*`/`me-*`/`ps-*`/`pe-*`/`border-s-*`/`border-e-*`/`rounded-s-*`/`rounded-e-*`/`text-start`/`text-end`) — never physical (`ml-*`/`mr-*`/`pl-*`/`pr-*`/`text-left`/`text-right`/inline `padding-left`); (B) every visible string comes from the i18n catalog via `translate` pipe / `i18n` attribute / `$localize`.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| Physical-direction utilities (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`, `rounded-t[lr]-*`, `rounded-b[lr]-*`) | 5 (4 files) |
| `text-left` / `text-right` | 1 (1 file) |
| Inline `style="...left:..."` / `padding-left:` etc. | (subset of R-FE-003's 21 admin-console hits) |
| Hardcoded English strings in element content (capitalized phrases) | indeterminate by pure regex — needs LLM verdict on ~39 candidates |
| Attribute bindings `[label]="'Some text'"` literal | (subset of LLM pass) |

Pure-regex counts: ~5 physical utilities + 1 `text-left/right` = **6 confirmed Part A violations**.

The hardcoded-string surface (Part B) requires LLM verdict — the regex pre-pass produces too many false positives (variable names, debug pragmas). Realistic estimate based on file content scan: ~30–40 candidate hardcoded English strings across ~10 files. **Total estimated ~45 violations.**

Top 5 offender files (Part A — physical utilities):

1. `apps/admin-console/.../client-settings-step.component.html` — 2 physical utility hits
2. `apps/admin-console/.../client-service-row-table.component.html` — 1 physical utility
3. `apps/admin-console/.../org-hierarchy-page-menu.component.html` — 1 physical utility
4. `apps/admin-console/.../falcon-org-info-panel.component.html` — 1 physical utility
5. `apps/admin-console/.../falcon-chart-card.component.html` — 1 `text-right`

Top 5 offender files (Part B — likely hardcoded strings):
- `apps/admin-console/.../user-details-page.component.html`
- `apps/admin-console/.../org-hierarchy-page-menu.component.html`
- `apps/admin-console/.../verify/otp-dialog.component.html`
- `apps/admin-console/.../client-settings-step.component.html`
- `apps/admin-console/.../client-information-step.component.html`

Per-app: admin-console only by rule scope.

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_noor_instructions`: Admin Console serves Arabic-first tenants. RTL parity is a SHIPPING requirement (Cairo + IBM Plex Sans Arabic). Physical utilities silently break in RTL — Tailwind does NOT auto-mirror `ml-*` to `mr-*` under `dir="rtl"`. The 6 confirmed Part A hits visually flip to the wrong side in Arabic, producing broken layouts that Arabic users see every session.

Hardcoded English strings break every translation cycle: PR review misses them, staging ships English-only, then either the Arabic release blocks or a hot-patch storm follows. Catalog-only enforcement is the ONLY way to keep Arabic at parity with English on every release.

The 6 Part A hits look small but are the kind of paper-cut that breaks the OTP dialog (which is on every Add Client / Add User flow) under RTL. High visibility relative to count.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Apply auto-fix to Part A.** The physical→logical map is lossless:

  | From | To |
  |---|---|
  | `ml-*` | `ms-*` |
  | `mr-*` | `me-*` |
  | `pl-*` | `ps-*` |
  | `pr-*` | `pe-*` |
  | `border-l-*` | `border-s-*` |
  | `border-r-*` | `border-e-*` |
  | `rounded-l-*` | `rounded-s-*` |
  | `rounded-r-*` | `rounded-e-*` |
  | `rounded-tl-*` | `rounded-ss-*` |
  | `rounded-tr-*` | `rounded-se-*` |
  | `rounded-bl-*` | `rounded-es-*` |
  | `rounded-br-*` | `rounded-ee-*` |
  | `text-left` | `text-start` |
  | `text-right` | `text-end` |

  Apply mechanically to the 6 confirmed hits.

- **Step 2 — Handle inline physical CSS.** Audit R-FE-003's admin-console hits for `style="...left:..."` / `style="...right:..."` / `style="padding-left:..."` etc. Convert to logical CSS (`inset-inline-start:`) OR replace with Tailwind logical utility.

- **Step 3 — Run hardcoded-string detection (Part B).**
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '>\s*[A-Z][A-Za-z][A-Za-z\s]{2,}[a-z]\s*<\s*/(h[1-6]|p|span|label|button|td|th|a|li|div)>' apps/admin-console |
    rg -v 'translate|i18n|\$localize'
  rg -n -g '*.html' '\[\s*(label|placeholder|title|aria-label|alt|tooltip)\s*\]\s*=\s*"[''`][A-Z][^''`]*[a-z][''`]"' apps/admin-console |
    rg -v 'translate'
  ```
  Save results; LLM-verify each match isn't a false positive (e.g. variable names like `OrderStatus` won't match the regex but similar shapes might).

- **Step 4 — Extract hardcoded strings to i18n catalog.** For each true hardcoded string:
  1. Open `apps/admin-console/src/assets/i18n/en.json`.
  2. Add a key under the page + section + role path: e.g. `org-hierarchy.user-details.action.edit`.
  3. (If accessible) add the Arabic translation in `ar.json`. If not, file an i18n GAP entry.
  4. Replace the template literal:
     - Text content: `{{ 'org-hierarchy.user-details.action.edit' | translate }}`
     - Attribute binding: `[label]="'org-hierarchy.user-details.action.edit' | translate"`
  5. For ARIA labels, use a separate key (`*.aria` suffix) — never reuse the visible-label key.

- **Step 5 — Run `ng extract-i18n`** (or equivalent) to verify the new keys land in the catalog.

- **Step 6 — Test under RTL.** Toggle `dir="rtl"` on the admin-console shell and walk:
  - Add Client wizard (5 steps)
  - Add User wizard (3 steps)
  - User Details page
  - OTP dialog
  - Org hierarchy menu

  Confirm visual mirror is correct. Use Falcon Eyes RTL parity check if available.

- **Step 7 — Build verification.**

## 5. Estimated effort + complexity rationale

**medium** — Part A is trivial (~30 minutes of auto-fix + RTL smoke). Part B is the slow path: extracting ~30 hardcoded strings, naming i18n keys per page+section+role pattern, ensuring Arabic translations exist. Realistic: 6–8 hours combined, with RTL visual verification being the longest single step.

## 6. Rollback hint (how to undo if the fix is wrong)

Part A: `git checkout HEAD -- <file>` restores physical utilities (visually identical under LTR; only RTL regresses, which is the point of the rule).

Part B: i18n key changes affect `en.json` + the consuming templates. Per-key rollback: edit `en.json` to remove the new key, restore the literal in the template via `git checkout`. If the Arabic translation is wrong, fix `ar.json` and re-test — don't roll back the extraction.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Part A — should be zero
  rg -n -g '*.html' '\b(ml|mr|pl|pr|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-(\d+|none|px|full)\b' apps/admin-console
  rg -n -g '*.html' '\btext-(left|right)\b' apps/admin-console
  
  # Part B — should drop substantially (only documented exempt strings remain)
  rg -n -g '*.html' '>\s*[A-Z][A-Za-z][A-Za-z\s]{2,}[a-z]\s*</(h[1-6]|p|span|label|button|td|th)>' apps/admin-console |
    rg -v 'translate|i18n|\$localize'
  
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - First two `rg`: zero matches
  - Third `rg`: zero matches (or only debug/test pages with `<!-- noor:exempt-i18n -->` markers)
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Physical→logical migration is lossless under LTR but materially changes RTL behavior** — that's the goal, but it WILL surface latent RTL bugs in unrelated parts of the layout. Budget RTL smoke time after the migration.
- **i18n key proliferation** — be disciplined about the page+section+role naming. Avoid `org.user.edit` (too generic); prefer `org-hierarchy.user-details.action.edit` (qualified).
- **Arabic translations may not exist for new keys** — if the Arabic team isn't immediately available, the keys ship as "missing" placeholders. File the gap; don't block the rule fix waiting for translation.
- **ARIA labels need separate keys** — re-using the visible-label key for ARIA defeats screen-reader differentiation. The rule explicitly requires `*.aria` suffix.
- **OTP dialog under RTL is the highest-visibility test surface** — that single dialog touches every wizard.
- **Literal language names** (`English` / `العربية`) in language switcher are exempt with the `<!-- noor:exempt-i18n reason="literal-language-name" -->` marker.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-001** — Tailwind-only on templates (universal); this rule constrains which Tailwind utilities are RTL-safe
- **R-NOOR-001** — admin-console layout ownership; page-level grids must also be RTL-safe (grid is intrinsically symmetric)
- **R-NOOR-002** — spacing tokens use logical names; new tokens must be RTL-aware
- **R-FE-003** — inline-style hits (left/right CSS properties) overlap with Part A's inline-CSS sub-check
