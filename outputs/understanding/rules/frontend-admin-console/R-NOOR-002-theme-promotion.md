---
ruleId: R-NOOR-002
name: Theme promotion — changes go to canonical theme, never inlined
category: theme
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
    - "apps/admin-console/**/*.css"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
    - "libs/falcon/src/theme/**"
    - "libs/falcon-ui-tokens/**"
severity: must
detector:
  type: semantic-llm
  patterns:
    - 'style="[^"]*(color|background|border|font|padding|margin|gap|shadow|radius)[^"]*"'
    - 'class="[^"]*\b(text|bg|border|p|m|gap|rounded|shadow)-\[#?[0-9a-fA-F]{3,8}\][^"]*"'
    - 'class="[^"]*\b(text|bg|border|p|m|gap|rounded|shadow)-\[\d+(px|rem|em)\][^"]*"'
  exemptPatterns:
    - 'libs/falcon/src/theme/falcon.theme.css'
    - 'libs/falcon-ui-tokens/'
  description: |
    LLM-judged check: any color / typography / spacing / radius / shadow value introduced in an
    admin-console template that is NOT already a token in the canonical theme is a candidate
    violation. Arbitrary Tailwind values like `bg-[#f7f9fc]`, `p-[13px]`, or inline `style="..."`
    declarations with theme-shaped properties trigger immediate review.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Cannot auto-fix — promoting a value to a theme token is a design decision; flag in morning briefing for theme curator'
relatedRules:
  - R-FE-003
  - R-FE-004
  - R-NOOR-005
  - R-NOOR-008
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
  This rule is ADMIN-CONSOLE-ONLY. It hardens the universal tokens-only rule (R-FE-004) by adding
  promotion direction: design tokens flow FROM the canonical theme INTO pages, never the other
  way. A novel color/radius/shadow MUST be promoted to `libs/falcon/src/theme/falcon.theme.css`
  first, then consumed by name. Noor's design system reasons about tokens by where they live.
---

*** Rule R-NOOR-002 — Theme promotion (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: semantic-llm (judges whether a value should be a theme token) ***

# R-NOOR-002 — Theme promotion: changes go to the canonical theme file

## What it says

Inside `apps/admin-console/**`, every color / font / spacing / radius / shadow value MUST come from a token defined in the canonical theme file `libs/falcon/src/theme/falcon.theme.css`. A page or component MUST NOT introduce a novel raw value (inline `style="color: #f7f9fc"`, arbitrary Tailwind `bg-[#f7f9fc]`, ad-hoc `p-[13px]`, `rounded-[14px]`, etc.). If a value is missing from the theme, the workflow is **promote first, consume second** — add the token to the canonical theme, then reference it by name in the template.

## Why it exists

The V0.2 theme adopted on 2026-05-07 made the canonical Tailwind v4 `@theme` block at `libs/falcon/src/theme/falcon.theme.css` the single source of truth for every design value across the platform. Admin Console is the most token-dense surface (Contracts / Pricing / Tariff / OCS — multi-thousand cell tables, dense forms, status overlays). Inlined values shred dark-mode tuning, break theme studio glassmorphism, force per-page re-mapping when designers slide a shade, and silently introduce drift between modules. Noor mandates that any new value goes through theme promotion so the design system stays auditable and the future theming Studio can recolor the app from a single file.

## Detector strategy

Pure regex cannot cleanly distinguish "legitimate one-off layout class" from "novel theme value". An LLM pass is required. The pipeline:

1. **Regex pre-filter** — scan every `*.html`, `*.ts`, `*.css` in `apps/admin-console/**` for:
   - `style="..."` containing color / background / border / font / padding / margin / gap / shadow / radius properties
   - Arbitrary Tailwind values: `text-[#...]`, `bg-[#...]`, `p-[Npx]`, `gap-[Npx]`, `rounded-[Npx]`, `shadow-[...]`
2. **LLM verdict** — for each match, feed the LLM (1) the matched line, (2) the current theme file token list, (3) the surrounding component. Verdict template:
   ```
   { violation: true|false, suggestedTokenName: "...", suggestedTokenValue: "...", confidence: 0..1 }
   ```
3. **Morning queue** — high-confidence violations land in the morning briefing as "Theme promotion proposed: add `--noor-surface-canvas: #f7f9fc` to canonical theme; replace 3 raw usages."

## Examples

### ✅ Good

```css
/* libs/falcon/src/theme/falcon.theme.css — promote ONCE */
@theme {
  --color-noor-surface-canvas: #f7f9fc;
  --radius-noor-card: 14px;
  --spacing-noor-row: 13px;
}
```

```html
<!-- apps/admin-console/.../contracts-row.html — consume by name -->
<div class="bg-noor-surface-canvas rounded-noor-card p-noor-row">
  …
</div>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contracts-row.html — novel raw values inline -->
<div class="bg-[#f7f9fc] rounded-[14px] p-[13px]" style="border: 1px solid #e2e8f0">
  …
</div>
```

## Known legitimate exemptions

- `libs/falcon/src/theme/**` — the theme file IS where raw values live
- `libs/falcon-ui-tokens/**` — token source library
- Storybook-style story files documenting raw values for comparison (must include a `<!-- noor:exempt-theme-promotion reason="..." -->` marker)
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-002`

## Fix recipe

When a violation is found:

1. **Read the raw value** — extract the color / radius / spacing / shadow / font value from the template.
2. **Check the theme file** — is there an existing token within ±5% of the value? If yes, use it. If no, propose a new token name following the Noor naming convention (`--color-noor-<surface>-<role>`, `--radius-noor-<size>`, `--spacing-noor-<role>`).
3. **Open a theme-promotion PR** — add the new token to `libs/falcon/src/theme/falcon.theme.css` in the matching `@theme` block. Update the theme-studio preview to show the new token.
4. **Replace usages** — search the admin-console for the raw value and replace with the token reference (`bg-noor-surface-canvas`, etc.).
5. **Visual diff** — run Falcon Eyes against the baseline to confirm zero pixel regression.
6. **Theme curator approval** — Noor's design system requires a curator review (currently Ammar) before promotion lands.

Auto-fix is **NOT** safe because token naming requires design judgment. Findings land in the morning briefing as a Decisions Queue row.

## Related rules

- [[R-FE-003-no-inline-styles]] — universal ban on `style="..."` for theme-shaped properties
- [[R-FE-004-tokens-only]] — universal tokens-only rule
- [[R-NOOR-005-palette-over-intent]] — once promoted, colors use palette naming
- [[R-NOOR-008-global-selector-hygiene]] — theme tokens flow from canonical file only

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat B: theme promotion
2. `memory/feedback_v02_theme_adopted.md` — canonical theme path lock (2026-05-07)
3. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
4. Falcon CLAUDE.md (project root) — Noor Instructions section
