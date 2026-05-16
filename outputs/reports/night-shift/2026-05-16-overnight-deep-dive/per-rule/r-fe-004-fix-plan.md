---
ruleId: R-FE-004
ruleName: Tokens only — no hardcoded hex, px, or palette names
severity: must
violationCount: 146
estimatedEffort: large
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Every color, border, radius, shadow, spacing, font-size, font-weight, line-height, z-index, and breakpoint value in Falcon frontend code must come from a token declared in the canonical Tailwind v4 `@theme` SSOT — no raw hex/rgb/hsl, no Tailwind default-palette names (`bg-blue-500`), no arbitrary px/rem/em literals in `[...]` utilities.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui` (apps + libs, exemptions applied):

| Detector pattern | Hits across apps |
|---|---|
| `#[0-9a-fA-F]{6}` raw hex in templates | 52 (11 files) |
| Tailwind default palette (`bg-blue-500`, `text-emerald-600`, ...) | 0 in `.html` templates |
| Arbitrary `[Npx/rem/em]` utilities (`w-[18px]`, `text-[14px]`, `rounded-[6px]`, ...) | 94 (21 files) |
| Total in HTML templates | **~146 violations** |

Note: the Tailwind default-palette regex returned 0 in templates — this is consistent with the post-PrimeNG-purge rebuild; defaults have been swept clean. However, `apps/admin-console/src/tailwind.css` itself contains 91 `font-[...]` arbitrary-value hits (Noor scoped — handled separately under R-NOOR-003/R-NOOR-004).

Top 5 offender files (by arbitrary-value hit density):

1. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` — 31 arbitrary-value hits + 2 raw hex
2. `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` — 15 arbitrary-value hits + 6 raw hex
3. `apps/host-shell/src/app/playground/playground.page.html` — 9 arbitrary-value hits (playground content; lower priority)
4. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` — 9 arbitrary + lots of font-size hits
5. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` — 8 arbitrary + 7 font-size hits

Per app:
- admin-console: ~70 % of hits — concentrated in the org-hierarchy-page port (the React→Angular conversion documented in `project_react_to_angular_org_hierarchy_page`)
- host-shell: ~15 % — topbar + sidebar + auth flows
- management-console: very low — mostly clean per recent waves
- libs: a handful in shared-ui Angular wrappers

## 3. Why this matters (the architectural cost of leaving it)

The Theme Studio (active build per `project_falcon_studio_waves_plan`) is the entire reason these tokens exist. Every `w-[18px]` baked into a template is a value the Studio can never swap — recolor, resize, restyle promises silently die there. The 31 hits inside the Add Client wizard's `client-settings-step` are particularly damaging because Add Client is the canonical 5-step flow (per `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`); divergence here is the most visible.

Also: R-FE-004 violations are the most common precursor to R-FE-003 (inline styles) and R-NOOR-002 (theme promotion) violations. Solving R-FE-004 cleanly often forces the right theme promotion decisions and eliminates an inline-style hit at the same time. Conversely, leaving it unfixed means every new wave keeps inheriting unbacked literals.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Build a complete inventory.** Generate one CSV per app:
  ```
  rg -n -g '*.html' '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}\b' apps/admin-console > audit/r-fe-004-hex-admin.txt
  rg -n -g '*.html' '\b(w|h|p|m|gap|top|bottom|left|right|inset|rounded|text|leading|tracking|border|shadow)-\[\d+(\.\d+)?(px|rem|em)\]' apps/admin-console > audit/r-fe-004-arb-admin.txt
  ```
  Repeat for `host-shell` and `management-console`. Sort by file × hit-density.

- **Step 2 — Audit the canonical theme.** Open `libs/falcon/src/theme/falcon.theme.css`. List every token currently declared. Group by family (color, spacing, radius, shadow, typography). Hold this as the lookup map for step 3.

- **Step 3 — Walk the inventory file by file.** For each hit:
  - If a matching token exists → replace with `bg-falcon-*` / `w-falcon-*` etc.
  - If no matching token exists but the value is reusable → propose a new token via R-NOOR-002 promotion flow, add to `falcon.theme.css`, then replace.
  - If the value is genuinely one-off and out-of-scope to promote → leave as a documented GAP with `<!-- GAP: R-FE-004 reason -->` and a note in `Brain Outputs/70-Gaps/`.

- **Step 4 — Tackle the heaviest file first.** `client-settings-step.component.html` (33 hits). Likely encodes the wizard step layout that other steps copy — fixing this one decides the canonical pattern for every wizard step.

- **Step 5 — Tackle topbar second.** It's the most visible chrome; fixing it ratifies the layout token set.

- **Step 6 — Sweep all 21 arbitrary-value files in admin-console.**

- **Step 7 — Sweep host-shell.** Topbar + auth flows. Coordinate with R-FE-002 plan since auth SCSS removal lands here too.

- **Step 8 — Re-run detector.** Target zero raw-hex hits and as few arbitrary-value hits as practical (some `w-[var(--falcon-*)]` arbitrary-value-with-CSS-var usage is allowed).

- **Step 9 — Full build matrix exit 0.**

## 5. Estimated effort + complexity rationale

**large** — 146 hits across 21+ files, plus probable need for ~10–20 new tokens in the canonical theme each requiring naming + curator review. The arbitrary-value family is mechanical once the token map is built; the raw-hex family needs design judgment per color. Realistic: 1.5–2 days for a focused agent, doubled if the user wants strict zero-token-gaps.

Estimating effort would be **medium** if we accepted "promote any value that isn't already a token" without curator review, but the rule's intent (per `feedback_no_inline_styles_tokens_only` hardening) is that promotion is a design decision, not an automation.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-file: `git checkout HEAD -- <path>` restores the literal value. If a Theme Studio preview breaks because a newly promoted token shadows a previous value, edit `libs/falcon/src/theme/falcon.theme.css` to remove the offending `@theme` entry — the template references gracefully fall back to a missing-token error which is loud (not silent).

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '#[0-9a-fA-F]{3,8}' apps | rg -v '#000\b|#fff\b'
  rg -n -g '*.html' '\b(w|h|p|m|gap|rounded|text|border|shadow)-\[\d+(\.\d+)?(px|rem|em)\]' apps
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  ```
- expected output:
  - First `rg`: zero matches (or only documented GAPs)
  - Second `rg`: zero matches OR only `[var(--falcon-*)]` arbitrary-value-with-CSS-var (acceptable bridging form)
  - Builds: exit code 0

## 8. Risk flags (anything that could break)

- **Token-name decisions are sticky.** A token added as `--color-falcon-wizard-bg` will be referenced from every future wizard step. Pick names that survive the next 12 months of design work; if unsure, defer the naming to the design curator instead of rushing.
- **The 91 `font-[...]` hits in `apps/admin-console/src/tailwind.css`** are NOT this rule's problem — they're declarations of Noor font tokens. They satisfy R-FE-004 *because* they live in the theme entry. Don't touch them in this pass; R-NOOR-003 covers consumer-side font tokens.
- **Arbitrary-value-with-CSS-var (`w-[var(--falcon-modal-width)]`) is acceptable as a bridge** when a Tailwind utility name doesn't exist yet for that token (Tailwind v4 generates utilities from `@theme` automatically, but only for primitive properties). Document each such bridge with a `<!-- token-bridge -->` marker so the next pass can finalize.
- **The user-details-page + org-chart hits are inside an active workstream** (org-hierarchy v3.2 port). Coordinate with whoever's actively editing those files to avoid merge conflicts.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-003** — every `style="color: #..."` is a R-FE-004 hit in disguise
- **R-FE-001** — Tailwind utilities go on templates only; this rule constrains the values inside them
- **R-NOOR-002** — every novel value in admin-console scope requires Noor theme promotion (more rigorous than the universal rule)
- **R-NOOR-003** — typography arbitrary values fall under both rules; Noor's composite tokens supersede in admin-console
- **R-NOOR-005** — admin-console color choices use palette names; this rule's `bg-blue-500` ban is admin-console-exempt
