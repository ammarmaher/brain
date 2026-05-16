---
ruleId: R-NOOR-004
ruleName: Font ownership — fonts load once in index.html, never per page
severity: must
violationCount: 0
estimatedEffort: trivial
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, font `<link>` tags + `@font-face` declarations may only appear in `apps/admin-console/src/index.html`, and `font-family` may only be bound to a token name inside `libs/falcon/src/theme/falcon.theme.css` — per-page font imports, inline `style="font-family:..."`, and arbitrary `font-[...]` Tailwind utilities are forbidden.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| `@font-face {` outside legal homes | 0 |
| `@import url(...fonts.googleapis.com...)` outside legal homes | 0 |
| `<link href="...fonts.googleapis.com...">` outside `index.html` | 0 |
| `<link href="*.woff|ttf|otf|eot">` outside legal homes | 0 |
| `style="font-family:..."` inline | 0 |
| `class="...font-[...]..."` arbitrary | 0 in consumer templates |

Total: **0 violations across 0 files in consumer code**.

The 2 hits the regex found in `apps/admin-console/src/index.html` itself are the LEGAL `<link>` declarations — exempt by path.

The 91 `font-[...]` hits in `apps/admin-console/src/tailwind.css` are theme token DECLARATIONS — exempt by virtue of being in the Tailwind theme entry; this file collaborates with the canonical `libs/falcon/src/theme/falcon.theme.css`.

Per-app: admin-console only by rule scope. Result: **fully compliant.**

## 3. Why this matters (the architectural cost of leaving it)

Zero violations is the IDEAL state for this rule. Per-page font loading is the single most expensive accidental-cost pattern in the platform: extra network waterfall, broken `font-display` strategy, double-loaded families, FOUT/FOIT flickers between Contracts / Pricing / Tariff / OCS modules.

The audit confirms the V0.2 theme adoption (2026-05-07) successfully centralized font ownership — Cairo + IBM Plex Sans Arabic (RTL) + Inter (LTR) load exactly once from `index.html` and bind to `--font-noor-*` tokens.

This is the BENCHMARK clean state. The fix plan exists to keep it that way, not to repair violations.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Re-verify the two legal homes have the expected content.**
  - Open `apps/admin-console/src/index.html`. Confirm 2 `<link>` tags for fonts (preconnect to googleapis + actual font CSS). Confirm `font-display: swap` is set in the font URL params.
  - Open `libs/falcon/src/theme/falcon.theme.css`. Confirm `--font-noor-sans` and `--font-noor-arabic` are bound under `@theme`.

- **Step 2 — Run continuous-watch detector.** This rule is "guard against regression" more than "fix backlog". Set up the detector as a pre-commit / pre-push hook:
  ```
  rg -n '@font-face\s*\{|@import\s+url\([^)]*fonts\.googleapis\.com|<link[^>]+href="[^"]*fonts\.googleapis\.com[^"]*"|<link[^>]+href="[^"]*\.(woff2?|ttf|otf|eot)"' apps/admin-console |
    Where-Object { $_ -notmatch '/(index\.html|falcon/src/theme/)' }
  ```
  Any hit → block commit, flag the offending file.

- **Step 3 — Audit for the inline-style + arbitrary-Tailwind variants.**
  ```
  rg -n -g '*.html' 'style="[^"]*font-family' apps/admin-console
  rg -n -g '*.html' 'class="[^"]*\bfont-\[' apps/admin-console
  ```
  Currently zero. Keep zero.

- **Step 4 — If a new font ever needs to land:** the morning agent must:
  1. Verify the design system actually requires the new family (curator approval).
  2. Add the `<link>` to `apps/admin-console/src/index.html` only.
  3. Add the family token to `libs/falcon/src/theme/falcon.theme.css` `@theme` block as `--font-noor-<role>`.
  4. Consumers use the token via `class="font-noor-<role>"`.
  5. Never inline.

- **Step 5 — Build verification (sanity).**

## 5. Estimated effort + complexity rationale

**trivial** — Zero violations. Effort is purely setting up the regression-prevention detector + verifying the two legal homes are correct. Realistic: 15 minutes.

## 6. Rollback hint (how to undo if the fix is wrong)

There is nothing to fix → nothing to roll back. If a future addition is mistakenly placed outside `index.html` or the theme file → `git checkout HEAD -- <file>` reverts.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n '@font-face\s*\{|@import\s+url\([^)]*fonts\.googleapis\.com|<link[^>]+href="[^"]*fonts\.googleapis\.com[^"]*"|<link[^>]+href="[^"]*\.(woff2?|ttf|otf|eot)"' apps/admin-console |
    rg -v '(index\.html|libs/falcon/src/theme/)'
  rg -n -g '*.html' 'style="[^"]*font-family' apps/admin-console
  rg -n -g '*.html' 'class="[^"]*\bfont-\[' apps/admin-console
  ```
- expected output:
  - All three: zero hits

## 8. Risk flags (anything that could break)

- **A future redesign request to add a new family** (e.g. "use this branded display font") will trigger the temptation to inline. Curator approval + theme promotion is the only path.
- **Theme Studio family swap experiments** may temporarily introduce alternate families. They MUST land in the theme file, never inline. Mark experimental tokens with a `--font-noor-experimental-*` prefix.
- **CDN reliability** — if `fonts.googleapis.com` is blocked or slow, fall back to system fonts via `font-display: swap` (already set). Don't add a per-page `@font-face` as a "workaround".
- **The Noor stack per `feedback_noor_instructions`** is Neue Haas Grotesk Display Pro (LTR) + Cairo (RTL primary) + IBM Plex Sans Arabic (RTL fallback). The current implementation uses Inter as LTR per V0.2 — that's the documented exception. Don't refactor without curator approval.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-003** — inline `style="font-family:..."` is also banned universally
- **R-NOOR-002** — new families flow through theme promotion
- **R-NOOR-003** — companion typography rule on the size + metrics side
