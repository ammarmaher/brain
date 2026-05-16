---
ruleId: R-NOOR-002
ruleName: Theme promotion — changes go to canonical theme, never inlined
severity: must
violationCount: 75
estimatedEffort: large
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, every color/font/spacing/radius/shadow value must come from a token defined in `libs/falcon/src/theme/falcon.theme.css` — novel raw values (inline `style="color: #..."`, `bg-[#f7f9fc]`, `p-[13px]`, `rounded-[14px]`) must be promoted to the canonical theme first, then consumed by name.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| `style="..."` with theme-shaped properties (color/font/padding/margin/border/shadow/gap/radius) | included in R-FE-003 — 21 admin-console hits |
| Arbitrary `[#hex]` Tailwind values | 1 (`org-hierarchy-page-menu.component.html`) |
| Arbitrary `[Npx/rem/em]` Tailwind values | 71 (18 files) |
| `text-[Npx]` arbitrary type values | 71 (subset of above) |
| Total candidate violations | **~75 hits, 20+ files** |

Top 5 offender files (by arbitrary-value density):

1. `apps/admin-console/.../add-client-wizard/client-settings-step/client-settings-step.component.html` — 19 arbitrary-value hits
2. `apps/admin-console/.../user-details/user-details-page.component.html` — 9 arbitrary-value hits + heavy font-size sub-set
3. `apps/admin-console/.../falcon-chart-card.component.html` — 7 arbitrary-value hits
4. `apps/admin-console/.../verify/otp-dialog.component.html` — 4 arbitrary + 11 inline-style hits
5. `apps/admin-console/.../client-service-row-table.component.html` — 4 arbitrary-value hits

Almost identical offender set as R-FE-003 + R-FE-004 — confirms theme-promotion is the deep cause of those rules' admin-console violations.

Per-app: admin-console only by rule scope. The roughly 75 hits represent the admin-console subset of the broader 146 R-FE-004 hits.

## 3. Why this matters (the architectural cost of leaving it)

The V0.2 theme adoption (2026-05-07) made `libs/falcon/src/theme/falcon.theme.css` the SINGLE canonical source. Admin Console is the most token-dense surface (Contracts / Pricing / Tariff / OCS — multi-thousand cell tables, dense forms, status overlays). Every inline value:

- shreds dark-mode tuning (no token to recompute against the dark palette)
- breaks Theme Studio glassmorphism (raw values can't be swapped)
- forces per-page re-mapping when designers slide a shade
- silently introduces drift between modules

The 19 hits in `client-settings-step.component.html` are the worst case because that file is the canonical wizard step AND is reused by the Settings tab — drift here multiplies across two surfaces.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Open the canonical theme.** Read `libs/falcon/src/theme/falcon.theme.css` and inventory every existing `--color-noor-*`, `--spacing-noor-*`, `--radius-noor-*`, `--shadow-noor-*`, `--font-noor-*` token. Group by family.

- **Step 2 — Build the violation inventory.** Run:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' 'style="[^"]*(color|background|border|font|padding|margin|gap|shadow|radius):' apps/admin-console > audit/r-noor-002-inline.txt
  rg -n -g '*.html' '\bclass="[^"]*\b(text|bg|border|p|m|gap|rounded|shadow)-\[(#[0-9a-fA-F]+|\d+(px|rem|em))\]' apps/admin-console > audit/r-noor-002-arbitrary.txt
  ```

- **Step 3 — Per-hit promotion decision.** For each violation:
  1. Read the matched value.
  2. Check the canonical theme for an existing token within ±5% of the value.
  3. If existing token fits → swap utility (`bg-[#f7f9fc]` → `bg-noor-surface-canvas`).
  4. If no fit → propose new token. Naming: `--color-noor-<surface>-<role>`, `--radius-noor-<size>`, `--spacing-noor-<role>`. Add to `falcon.theme.css` `@theme` block.
  5. Replace consumer usage with new token utility.

- **Step 4 — Open the morning Decisions Queue.** Per the rule: "Auto-fix is **NOT** safe because token naming requires design judgment. Findings land in the morning briefing as a Decisions Queue row." So:
  - Group the ~75 hits by suggested token name.
  - Present each group as a single "promote X tokens" decision for the user / theme curator.
  - Wait for sign-off before adding tokens to the canonical theme.

- **Step 5 — Convert `client-settings-step.component.html` first** (19 hits, highest density, dual-consumer impact).

- **Step 6 — Sweep `user-details-page.component.html` second** (9 hits + heavy font-size sub-set; pair with R-NOOR-003).

- **Step 7 — Sweep remaining 18 files.**

- **Step 8 — Run Falcon Eyes visual diff** against Admin Console baseline. Confirm zero pixel regression after each token swap.

- **Step 9 — Theme curator approval.** Per the rule: a curator review (currently Ammar) is required before promotion lands.

- **Step 10 — Build verification.**

## 5. Estimated effort + complexity rationale

**large** — 75 hits requiring per-value design judgment + curator approval + visual diff. The mechanical work (utility swap) is fast; the design work (naming, scaling, ensuring no shade drift) is slow. Realistic: 1.5–2 days.

This rule is the most disciplined of the R-NOOR-* set. Cutting corners here means the Theme Studio breaks for admin-console — which is its primary consumer.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-token: edit `falcon.theme.css` to remove the offending `@theme` entry. The template references fall back to a Tailwind warning (missing utility), which is loud not silent. Per-template revert: `git checkout HEAD -- <file>` restores the inline literal.

For a wholesale rollback: `git reset --hard HEAD~N` to the last known good state, then re-run baseline.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '*.html' '\bclass="[^"]*\b(text|bg|border|p|m|gap|rounded|shadow)-\[(#[0-9a-fA-F]+|\d+(px|rem|em))\]' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  rg -n -g '*.html' 'style="[^"]*(color|background|border|font|padding|margin|gap|shadow|radius):' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - First count: zero (or only `[var(--falcon-*)]` bridge form)
  - Second count: zero (R-FE-003 closes this too)
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Token naming is sticky.** A token name added today is referenced from every future wizard. Pick names that survive 12 months of design work; defer to curator if unsure.
- **Visual regression is real** — every swap must visually match. Falcon Eyes (if available) is the gate; without it, manual screenshot comparison is required for each major page section.
- **The Theme Studio depends on canonical theme integrity.** Adding a token with no consumer is fine; adding a consumer without the token is a build failure.
- **R-NOOR-005 (palette over intent)** restricts color token NAMES — promote with palette-shape names (`noor-slate-50`, `noor-blue-500`), NOT intent names (`noor-surface`, `noor-primary`).
- **Pair with R-FE-003 / R-FE-004** — every promotion closes 1–2 hits in those plans too.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-003** — inline-style hits often have theme-shaped properties; promotion closes both
- **R-FE-004** — universal tokens-only rule; this rule is the admin-console-hardened version with promotion direction enforced
- **R-NOOR-005** — palette-naming rule applies to every new color token
- **R-NOOR-003** — typography arbitrary-value hits fall under R-NOOR-003's scale + this rule's promotion flow
- **R-NOOR-008** — global-selector hygiene closes the remaining `:root { --color-noor-...: ... }` outside-of-theme leakage
