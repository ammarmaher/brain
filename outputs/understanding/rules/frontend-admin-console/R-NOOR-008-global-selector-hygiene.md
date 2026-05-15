---
ruleId: R-NOOR-008
name: Global selector hygiene — no naked body/*/:root overrides
category: global
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.css"
    - "apps/admin-console/**/*.scss"
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
    - "libs/falcon/src/theme/**"
    - "libs/falcon-ui-tokens/**"
severity: must
detector:
  type: regex
  patterns:
    - '(^|\})\s*body\s*\{'
    - '(^|\})\s*html\s*\{'
    - '(^|\})\s*\*\s*\{'
    - '(^|\})\s*\*\s*,'
    - '(^|\})\s*::?(before|after|placeholder|selection|first-letter|first-line|backdrop)\s*\{'
    - '(^|\})\s*:root\s*\{'
    - '(^|\})\s*:host\s*\{'
    - '(^|\})\s*(h[1-6]|p|a|button|input|select|textarea|table|td|th|tr|ul|ol|li|nav|header|footer|main|section|article|aside|form|label|img|svg)\s*\{'
  exemptPatterns:
    - 'libs/falcon/src/theme/'
    - 'libs/falcon-ui-tokens/'
  description: |
    Regex sweep across every CSS/SCSS/inline <style> block in admin-console scope, looking for
    naked element selectors (`body { ... }`, `* { ... }`, `:root { ... }`, `:host { ... }`,
    `h1 { ... }`, `button { ... }`, etc.) that would leak into all consumers. These global
    overrides break the canonical-theme contract: design tokens flow from
    `libs/falcon/src/theme/falcon.theme.css` exclusively. Any other source of token-shaped
    values is a violation.
autoFix:
  available: false
  riskLevel: high
  patchHint: |
    Cannot auto-fix — every global selector encodes a design intent that must either move INTO
    the canonical theme (if truly platform-wide) or be scoped to a class on the specific component
    (if local). Flag for design-curator decision in morning briefing.
relatedRules:
  - R-FE-002
  - R-FE-003
  - R-FE-004
  - R-NOOR-002
  - R-NOOR-004
source:
  - file: feedback_noor_instructions.md
    location: memory
  - file: feedback_v02_theme_adopted.md
    location: memory
  - file: brain-skills/Front-End-skills/noor-instructions-skill/Skill.md
    location: brain-skills
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
scopeNote: |
  This rule is ADMIN-CONSOLE-ONLY for the hardened "must" severity. It complements R-FE-002
  (no SCSS, no component CSS) by closing the remaining escape hatch — a single index-level CSS
  file slipping in a `body { ... }` block. Theme tokens flow from
  `libs/falcon/src/theme/falcon.theme.css` exclusively. Any token-shaped override anywhere else
  in admin-console is a violation. Library theme files and falcon-ui-tokens are the only legal
  homes for `:root { ... }` and `body { ... }` selectors.
---

*** Rule R-NOOR-008 — Global selector hygiene (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: regex (naked element/pseudo/root selector match) ***

# R-NOOR-008 — Global selector hygiene: no naked body/*/:root overrides

## What it says

Inside `apps/admin-console/**`, **no CSS / SCSS file and no inline `<style>` block may declare a naked global selector**. Specifically forbidden:

- `body { ... }`
- `html { ... }`
- `* { ... }` (and `*, *::before, *::after { ... }`)
- `:root { ... }`
- `:host { ... }`
- Naked element selectors — `h1 { ... }`, `h2`, …, `h6`, `p`, `a`, `button`, `input`, `select`, `textarea`, `table`, `td`, `th`, `tr`, `ul`, `ol`, `li`, `nav`, `header`, `footer`, `main`, `section`, `article`, `aside`, `form`, `label`, `img`, `svg`
- Naked pseudo-element selectors — `::before`, `::after`, `::placeholder`, `::selection`, `::first-letter`, `::first-line`, `::backdrop`

Theme tokens flow from `libs/falcon/src/theme/falcon.theme.css` ONLY. Token sources (`@theme`, `:root`) live there. Anywhere else is illegal.

## Why it exists

Global selectors are the single most destructive parity-break vector in a multi-module app: one `body { font-family: 'Poppins' }` in a routed module silently overrides the canonical Noor font stack across the entire admin-console session; one `* { box-sizing: border-box }` reset re-applied on top of Tailwind's preflight introduces subtle metric drift; one `:root { --color-noor-surface: #eee }` declared outside the theme file desyncs the theme studio from the live render.

The V0.2 theme adoption (2026-05-07) established `libs/falcon/src/theme/falcon.theme.css` as the SINGLE canonical theme entry. The universal rules already ban inline styles (R-FE-003), SCSS files (R-FE-002), and arbitrary token values (R-FE-004). Noor closes the remaining hole: an app-level CSS file slipping in a global selector. With this rule, the only place global token-shaped declarations exist is the canonical theme file, which the theme studio can read end-to-end.

## Detector strategy

Regex sweep across every `*.css`, `*.scss`, `*.html` (for inline `<style>` blocks), and `*.ts` (for `styles: [...]` / `styleUrls: [...]` referenced files) in `apps/admin-console/**`:

1. Naked top-level selectors — match `(^|\})\s*(body|html|\*|:root|:host)\s*\{`
2. Naked element selectors — match `(^|\})\s*(h[1-6]|p|a|button|input|select|textarea|table|td|th|tr|ul|ol|li|nav|header|footer|main|section|article|aside|form|label|img|svg)\s*\{`
3. Naked pseudo-element selectors — match `(^|\})\s*::?(before|after|placeholder|selection|first-letter|first-line|backdrop)\s*\{`
4. Comma-prefixed `*` lists — match `(^|\})\s*\*\s*,`

Exempt patterns:
- Files under `libs/falcon/src/theme/**` — legal home for `:root { ... }` and `body { ... }` token declarations
- Files under `libs/falcon-ui-tokens/**` — legal token source
- Any selector whose preceding line is a `/* noor:exempt-global reason="..." */` marker (still requires a `exemptions/EXEMPTIONS.md` entry against `R-NOOR-008`)

## Examples

### ✅ Good

```css
/* libs/falcon/src/theme/falcon.theme.css — THE only legal global home */
@theme {
  --color-noor-surface-canvas: #f7f9fc;
  --font-noor-sans: 'Inter', system-ui, sans-serif;
}

:root {
  color-scheme: light dark;
}

body {
  background: var(--color-noor-surface-canvas);
  font-family: var(--font-noor-sans);
}
```

```html
<!-- apps/admin-console/.../contracts-page.html — consume tokens by name, scope per-element -->
<section class="bg-noor-surface-canvas font-noor-sans">
  <h1 class="text-noor-display">Contracts</h1>
  <p class="text-noor-body text-slate-600">All active contracts</p>
</section>
```

### ❌ Bad

```css
/* apps/admin-console/src/styles.css — illegal app-level globals */
body {
  background: #f7f9fc;
  font-family: 'Poppins', sans-serif;
}

* {
  box-sizing: border-box;
}

:root {
  --color-noor-surface-canvas: #eee;  /* desyncs the canonical theme */
}

h1 {
  font-size: 2rem;
  font-weight: 700;
}

::placeholder {
  color: #94a3b8;
}
```

```html
<!-- apps/admin-console/.../contracts-page.ts — inline <style> with global selectors -->
@Component({
  styles: [`
    :host { display: block; }
    body { background: white; }
    h1 { font-size: 2rem; }
  `],
})
export class ContractsPageComponent {}
```

## Known legitimate exemptions

- `libs/falcon/src/theme/**` — the canonical theme is allowed (and required) to declare global selectors for token application
- `libs/falcon-ui-tokens/**` — token source library
- A small allowlist of intentional global resets that pre-date Noor and carry a `/* noor:exempt-global reason="legacy-reset-Y" */` marker AND a `exemptions/EXEMPTIONS.md` row referencing `R-NOOR-008`
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-008`

## Fix recipe

When a violation is found:

1. **Classify the intent** — is this rule trying to (a) override a theme token, (b) reset a browser default, or (c) style every instance of an element type?
2. **Route the fix**:
   - **(a) Token override** — move the declaration INTO `libs/falcon/src/theme/falcon.theme.css` as a proper `@theme` entry (follow R-NOOR-002 promotion flow). Delete the global selector.
   - **(b) Browser reset** — almost always already covered by Tailwind's preflight. Verify; if a genuine gap exists, propose extending preflight via the canonical theme. Delete the global selector.
   - **(c) Per-element styling** — convert to a Tailwind utility on the specific elements that need it. Delete the global selector.
3. **Run `nx build admin-console`** — Tailwind purge will catch unreferenced utilities.
4. **Visual diff** against Falcon Eyes baseline (LTR and RTL).
5. **Theme curator sign-off** for any new theme token added in step (a).

Auto-fix is **NOT** enabled — every global selector encodes a design intent that requires human judgment to route correctly.

## Related rules

- [[R-FE-002-no-scss-no-component-css]] — universal ban on SCSS/component CSS (R-NOOR-008 closes the remaining hole)
- [[R-FE-003-no-inline-styles]] — universal inline-styles ban
- [[R-FE-004-tokens-only]] — universal tokens-only rule
- [[R-NOOR-002-theme-promotion]] — promotion flow for new theme tokens
- [[R-NOOR-004-font-ownership]] — font globals only in index.html + theme file

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat H: global selector hygiene
2. `memory/feedback_v02_theme_adopted.md` — canonical theme path (V0.2, 2026-05-07)
3. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
4. Falcon CLAUDE.md (project root) — Noor Instructions section
