---
ruleId: R-NOOR-008
ruleName: Global selector hygiene — no naked body/*/:root overrides
severity: must
violationCount: 1
estimatedEffort: trivial
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, no CSS/SCSS file and no inline `<style>` block may declare a naked global selector (`body { }`, `html { }`, `* { }`, `:root { }`, `:host { }`, bare element selectors `h1 {...}`, bare pseudo-elements `::before {...}`) — token sources live ONLY in `libs/falcon/src/theme/falcon.theme.css` and `libs/falcon-ui-tokens/**`.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| `body { ` / `html { ` (naked) | 1 (`apps/admin-console/src/tailwind.css:2299` — `html, body { font-family: var(--font-display); }`) |
| `:root { ` (naked) | 0 |
| `* { ` (universal selector) | 0 |
| `:host { ` (Angular shadow host) | 0 |
| Naked element selectors (`h1 {`, `button {`, `input {`, etc.) | 0 |
| Naked pseudo-element selectors (`::before {`, `::placeholder {`, etc.) | 0 |

Total: **1 violation in 1 file.**

The single hit is at `apps/admin-console/src/tailwind.css` line 2299: `html, body { font-family: var(--font-display); }`.

**Verdict: this file is debatable.** Per the rule scope:
- `apps/admin-console/**/*.css` IS in scope (rule path config)
- BUT `apps/admin-console/src/tailwind.css` is the Tailwind theme entry, which imports `libs/falcon-theme/src/falcon-tailwind-tokens.css` AND scans templates — it's the canonical Tailwind theme entry for admin-console
- The rule's exempt paths are `libs/falcon/src/theme/**` and `libs/falcon-ui-tokens/**` — `apps/admin-console/src/tailwind.css` is NOT explicitly listed

**Recommended classification: borderline-exempt.** The file serves the same role as the canonical theme for admin-console. Either:
- (a) Move the `html, body { font-family: ... }` rule INTO `libs/falcon-theme/src/falcon-tailwind-tokens.css` (the imported file) — and add it to the exempt path
- (b) Add `apps/admin-console/src/tailwind.css` to `exemptions/EXEMPTIONS.md` under `R-NOOR-008` (with a comment that it's the app-level theme entry)

Per app: admin-console only by rule scope.

## 3. Why this matters (the architectural cost of leaving it)

Global selectors are the most destructive parity-break vector in a multi-module app. One `body { font-family: 'Poppins' }` silently overrides the canonical Noor font stack everywhere; one `* { box-sizing: border-box }` reset re-applied on top of Tailwind's preflight introduces metric drift; one `:root { --color-noor-surface: #eee }` desyncs the theme studio from the live render.

The single hit is actually a legitimate "promote the canonical font to all pages" rule, but it lives at the wrong layer (app-level Tailwind entry vs. canonical theme library). Moving it preserves the intent while restoring rule hygiene.

If left as-is: every future "global override" gets a tempting precedent ("there's already a `body { ... }` rule in `tailwind.css`, mine can go there too"). The rule's purpose is to ensure the answer is always "no, promote to the canonical theme library first."

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Open `apps/admin-console/src/tailwind.css`** and read lines 2295–2310 for full context around line 2299.

- **Step 2 — Open the imported canonical token file** `libs/falcon-theme/src/falcon-tailwind-tokens.css` (the one `tailwind.css` imports at line 4).

- **Step 3 — Choose path (a) or (b):**

  **Path (a) — Move the rule (RECOMMENDED).**
  1. Cut `html, body { font-family: var(--font-display); }` from `apps/admin-console/src/tailwind.css`.
  2. Paste into `libs/falcon-theme/src/falcon-tailwind-tokens.css` near the `@theme` block (or in a clearly-labeled "global type defaults" section).
  3. Verify the import chain still resolves and the rule still applies at runtime.

  **Path (b) — Exempt the app-theme entry.**
  1. Add to `exemptions/EXEMPTIONS.md` (or create the file if missing) under `R-NOOR-008`:
     ```
     - path: apps/admin-console/src/tailwind.css
       rule: R-NOOR-008
       reason: App-level Tailwind theme entry; collaborates with libs/falcon-theme/src/falcon-tailwind-tokens.css as the canonical theme chain. Global body/html font assignment is intentional and belongs here.
     ```
  2. Update the detector exempt-path config to include the file.

  Path (a) is more aligned with rule intent (single canonical home); path (b) is faster + reflects current architecture more accurately.

- **Step 4 — Re-run detector.** Expected: 0 hits (after Path (a)) or 1 documented-exempt hit (after Path (b)).

- **Step 5 — Test font rendering.** Open admin-console in browser; verify `font-display` resolves and pages render with the Noor stack.

- **Step 6 — Build verification.**

## 5. Estimated effort + complexity rationale

**trivial** — 1 violation, 1 file. The fix is a 5-line move (Path a) or a 4-line `EXEMPTIONS.md` add (Path b). Either way < 30 minutes including verification.

## 6. Rollback hint (how to undo if the fix is wrong)

Path (a): `git checkout HEAD -- apps/admin-console/src/tailwind.css libs/falcon-theme/src/falcon-tailwind-tokens.css` restores both files.

Path (b): `git checkout HEAD -- exemptions/EXEMPTIONS.md` removes the exemption.

If the font fails to load after the move (Path a), check that `--font-display` is still bound in the canonical theme — if not, the cut likely orphaned the variable.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Should be 0 (after Path a) or 1-documented-exempt (after Path b)
  rg -n -g '*.css' -g '*.scss' '(^|\})\s*(body|html|\*|:root|:host)\s*\{' apps/admin-console
  rg -n -g '*.css' -g '*.scss' '(^|\})\s*(h[1-6]|p|a|button|input|select|textarea|table|td|th|tr|ul|ol|li|nav|header|footer|main|section|article|aside|form|label|img|svg)\s*\{' apps/admin-console
  rg -n -g '*.css' -g '*.scss' '(^|\})\s*::?(before|after|placeholder|selection|first-letter|first-line|backdrop)\s*\{' apps/admin-console
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - First `rg`: zero (or only documented-exempt path)
  - Second + third `rg`: zero
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Moving the `body` rule into a library file** that's imported by multiple apps changes the rule from "admin-console default" to "platform default". Verify host-shell + management-console don't object — they likely already inherit it via the same import chain.
- **`--font-display` variable scope** — if it's declared in `falcon-tailwind-tokens.css` but consumed in `apps/admin-console/src/tailwind.css`, moving the consumer next to the declaration shouldn't break — but verify the cascade.
- **Future global resets**: Tailwind v4's preflight is already loaded; almost all "I need a reset" instincts are wrong. The rule's design intent is "your reset is probably unnecessary; ask first".
- **The R-FE-002 SCSS purge** may surface additional `body { ... }` declarations inside the 21 SCSS files being deleted. Those need re-routing per this rule's flow (promote to theme, then delete).

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-002** — closes the SCSS escape hatch; this rule closes the app-level CSS hatch
- **R-FE-003** — closes the inline-style hatch
- **R-FE-004** — closes the arbitrary-value hatch (tokens-only)
- **R-NOOR-002** — theme promotion is the canonical path for any global token-shaped declaration
- **R-NOOR-004** — font ownership; the single `html, body { font-family: ... }` hit lives at the intersection of this rule and R-NOOR-004
