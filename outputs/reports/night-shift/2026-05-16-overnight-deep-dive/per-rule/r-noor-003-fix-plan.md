---
ruleId: R-NOOR-003
ruleName: Typography scale — only documented type tokens allowed
severity: must
violationCount: 84
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, every text utility must be a documented Noor composite type token (`text-noor-display`, `text-noor-title`, `text-noor-heading`, `text-noor-body`, `text-noor-caption`, `text-noor-micro`, `text-noor-label`, `text-noor-table-cell`) — bare Tailwind type sizes (`text-xs`...`text-9xl`), `leading-*`, `tracking-*`, arbitrary `text-[Npx]`, and inline `font-size:` styles are forbidden.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| Bare Tailwind type sizes (`text-xs`...`text-9xl`) | 70 (12 files) |
| Arbitrary `text-[Npx]` values | 71 (18 files) — overlaps with bare in some files |
| Bare `leading-*` utilities | 12 (5 files) |
| Bare `tracking-*` utilities | 2 (2 files) |
| Total (deduped) | **~84 unique violations across ~19 files** |

The 71 arbitrary `text-[Npx]` hits and the 70 bare-size hits overlap heavily (same files); reported as ~84 unique to avoid double-counting.

Top 5 offender files (by combined type-utility hit count):

1. `apps/admin-console/.../user-details/user-details-page.component.html` — 31 bare type + 9 arbitrary type = 40 hits
2. `apps/admin-console/.../tab-components/applications-table/applications-table.component.html` — 8 bare type
3. `apps/admin-console/.../falcon-org-node-drawer.component.html` — 7 bare type + 2 arbitrary
4. `apps/admin-console/.../falcon-chart-card.component.html` — 0 bare + 7 arbitrary type + 5 leading hits
5. `apps/admin-console/.../client-settings-step/client-settings-step.component.html` — 5 bare type + 19 arbitrary type (the densest single file across all rules)

Per-app: admin-console only by rule scope. The 84 hits are concentrated in the org-hierarchy-page port (post-React-conversion residue).

**Note on `apps/admin-console/src/tailwind.css`:** Contains 91 `font-[...]` hits but these are Noor token DECLARATIONS, not consumer-side violations. Exempt by virtue of being in the canonical theme entry.

## 3. Why this matters (the architectural cost of leaving it)

Admin Console renders multi-thousand-row tables, dense form grids, and status overlays where optical typography matters most. Designers iterate by moving sections up/down the Noor scale, not by changing pixel values. Bare Tailwind type utilities expose 12 sizes × independent line-height + tracking knobs — hundreds of valid combinations, no parity. The Noor composite tokens collapse the design surface to ~8 named sizes with locked metrics.

The 40 hits in `user-details-page.component.html` are particularly damaging because user details is a high-traffic admin flow — drift here is visible on every tenant.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Verify Noor type tokens exist.** Open `libs/falcon/src/theme/falcon.theme.css` and confirm each composite is declared:
  - `--text-noor-display`
  - `--text-noor-title`
  - `--text-noor-heading`
  - `--text-noor-body`
  - `--text-noor-caption`
  - `--text-noor-micro`
  - `--text-noor-label`
  - `--text-noor-table-cell`
  
  If any are missing → file as theme-promotion ticket per R-NOOR-002 BEFORE attempting consumer migration.

- **Step 2 — Build the violation inventory.**
  ```
  rg -n -g '*.html' '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b' apps/admin-console > audit/r-noor-003-bare-sizes.txt
  rg -n -g '*.html' '\btext-\[\d+(\.\d+)?(px|rem|em|pt)\]' apps/admin-console > audit/r-noor-003-arbitrary.txt
  rg -n -g '*.html' '\b(leading|tracking)-(none|tight|snug|normal|relaxed|loose|tighter|wide|wider|widest|\d+)\b' apps/admin-console > audit/r-noor-003-modifiers.txt
  ```

- **Step 3 — Apply the conservative mapping table** (from the rule):
  - `text-xs` / `text-[10-11px]` → `text-noor-micro`
  - `text-sm` / `text-[12-13px]` → `text-noor-caption`
  - `text-base` / `text-[14-15px]` → `text-noor-body`
  - `text-lg` / `text-[16-18px]` → `text-noor-heading`
  - `text-xl` / `text-[20-22px]` → `text-noor-title`
  - `text-2xl+` → `text-noor-display`
  - Form labels → `text-noor-label`
  - Table body cells → `text-noor-table-cell`

- **Step 4 — Delete companion `leading-*` and `tracking-*` utilities** at every replaced site. The Noor tokens pre-bake those metrics; leaving them causes double-application.

- **Step 5 — Tackle `user-details-page.component.html` first.** 40 hits. Most likely a heading + body + table-cell pattern. Read top-to-bottom, apply the map.

- **Step 6 — Tackle `client-settings-step.component.html` second.** Wizard step with 24 hits. Form-shaped — most are `text-base` body + `text-sm` captions on labels.

- **Step 7 — Sweep remaining 17 files.**

- **Step 8 — Run Falcon Eyes visual diff** against Admin Console baseline. If a Noor token doesn't map cleanly to the original value, propose a new token via R-NOOR-002 promotion flow — do NOT invent inline.

- **Step 9 — Theme curator sign-off** if any new tokens promoted.

- **Step 10 — Build verification.**

## 5. Estimated effort + complexity rationale

**medium** — 84 hits is concentrated in ~19 files. The mapping is mostly mechanical (size → Noor token); the trickier part is removing companion modifiers without breaking visual intent. Realistic: 6–8 hours including visual diff.

If a substantial number of hits don't map cleanly (e.g. `text-[13px]` between caption and body), expect 1–2 new Noor tokens to be promoted, adding curator-review time. Best-case: 6 hours. Worst-case: 10 hours.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-file: `git checkout HEAD -- <file>.html` restores bare utilities. If a Noor token doesn't render correctly (e.g. line-height is too tight), edit `falcon.theme.css` to adjust the token — the change propagates to every consumer without further template edits.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  rg -n -g '*.html' '\btext-\[\d+(\.\d+)?(px|rem|em|pt)\]' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  rg -n -g '*.html' '\b(leading|tracking)-(none|tight|snug|normal|relaxed|loose|tighter|wide|wider|widest)\b' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - All three counts: `0`
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Removing `leading-*` modifiers can change vertical rhythm** if the Noor token's baked line-height differs from what the page assumed. Falcon Eyes diff is the gate.
- **Form labels vs body text are easy to confuse** — `text-noor-label` and `text-noor-body` may both render at ~14px but have different tracking/weight. Use the role-based mapping (labels → `text-noor-label`, paragraphs → `text-noor-body`).
- **Tailwind v4 token resolution** — if a Noor token is missing from the theme, Tailwind silently emits no rule. Result: text renders with browser default. Verify tokens exist BEFORE migrating.
- **The `tailwind.css` 91 `font-[...]` hits are theme declarations** — DO NOT touch them in this pass. R-NOOR-004 covers font ownership; this rule is consumer-side typography.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-004** — arbitrary `text-[Npx]` is also tokens-only violation; this rule supersedes inside admin-console
- **R-NOOR-002** — new Noor type tokens go through theme promotion
- **R-NOOR-004** — companion rule on the font-family side (this rule is on the size + metrics side)
- **R-FE-003** — inline `font-size:` violations also trigger this rule
