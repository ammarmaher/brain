---
ruleId: R-NOOR-004
name: Font ownership — fonts load once in index.html, never per page
category: font
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
    - "apps/admin-console/**/*.css"
  exemptPaths:
    - "apps/admin-console/src/index.html"
    - "libs/falcon/src/theme/**"
severity: must
detector:
  type: structural
  patterns:
    - '@font-face\s*\{'
    - '@import\s+url\([^)]*fonts\.googleapis\.com'
    - '@import\s+url\([^)]*\.(woff2?|ttf|otf|eot)'
    - '<link[^>]+href="[^"]*fonts\.googleapis\.com[^"]*"'
    - '<link[^>]+href="[^"]*\.(woff2?|ttf|otf|eot)"'
    - 'style="[^"]*font-family[^"]*"'
    - 'class="[^"]*font-\[[^\]]+\][^"]*"'
  exemptPatterns:
    - 'apps/admin-console/src/index.html'
    - 'libs/falcon/src/theme/'
  description: |
    Structural check: font declarations (@font-face, font @import, <link> to font CDN, font file
    references) MUST appear in exactly one location — apps/admin-console/src/index.html for HTML
    link tags, and libs/falcon/src/theme/falcon.theme.css for the @theme font-family tokens.
    Any per-page or per-component font import, inline font-family style, or arbitrary
    font-[...] Tailwind utility is a violation.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Delete the per-page font import; if a new face is needed, add the <link> to index.html and the family to the theme @theme block'
relatedRules:
  - R-FE-003
  - R-NOOR-002
  - R-NOOR-003
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
  This rule is ADMIN-CONSOLE-ONLY. It hardens R-NOOR-002 (theme promotion) on the font axis:
  font-family declarations live ONLY in the canonical theme + index.html. Noor's font stack
  per the memory note is Neue Haas Grotesk Display Pro (LTR) + Cairo (RTL primary) + IBM Plex
  Sans Arabic (RTL fallback). The V0.2 Google Fonts CDN path documented in feedback_v02_theme_adopted
  is the platform-wide convention; Noor's caveat about self-hosted fonts overrides only when the
  Noor stack is in use.
---

*** Rule R-NOOR-004 — Font ownership (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: structural (font declarations confined to two files) ***

# R-NOOR-004 — Font ownership: fonts load once in index.html, never per page

## What it says

Inside `apps/admin-console/**`, font loading and font-family assignment have exactly two legal homes:

1. **`apps/admin-console/src/index.html`** — the only place font `<link>` tags or `@font-face` declarations may appear.
2. **`libs/falcon/src/theme/falcon.theme.css`** — the only place `font-family` is bound to a token name via the `@theme` block.

Pages and components consume fonts BY NAME via the theme token (e.g. `font-noor-sans`, `font-noor-arabic`). They MUST NOT:

- declare `@font-face` in a component or page CSS
- `@import` font URLs from anywhere other than the canonical theme
- include `<link rel="stylesheet" href="…fonts…">` in any template other than the root `index.html`
- set `style="font-family: …"` inline on an element
- use arbitrary Tailwind `font-[…]` utilities to inject a new family

## Why it exists

Per-page font loading is the single most expensive accidental-cost pattern in the platform: it triggers an extra network waterfall, breaks font-display strategies, double-loads the same family across modules, and silently introduces FOUT/FOIT flickers as a user navigates between Contracts / Pricing / Tariff / OCS. Centralising font loading in `index.html` and font-family binding in the theme file:

- guarantees ONE font payload across the entire admin-console session
- lets the theme studio swap families globally
- keeps RTL fallback chains (Cairo → IBM Plex Sans Arabic → system) defined once
- enables `font-display: swap` + preconnect hints to land in the right place

The V0.2 theme adoption (2026-05-07) made this convention explicit; Noor hardens it to "must" for admin-console.

## Detector strategy

Structural sweep across `apps/admin-console/**`:

1. **Font declarations outside the two legal homes** — search every file (not just `index.html` and the theme file) for:
   - `@font-face { ... }`
   - `@import url(…fonts.googleapis.com…)` or `@import url(…woff|ttf|otf|eot)`
   - `<link rel="stylesheet" href="…fonts.googleapis.com…">` or `<link … href="…woff…">`
2. **Inline font-family** — any `style="…font-family…"` attribute in a template.
3. **Arbitrary Tailwind font utilities** — `class="… font-[…] …"` matches.

A file is a violation if it matches any of the above AND its path is NOT one of:
- `apps/admin-console/src/index.html`
- `libs/falcon/src/theme/**`

## Examples

### ✅ Good

```html
<!-- apps/admin-console/src/index.html — THE place where fonts load -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Cairo:wght@400;500;600&display=swap">
</head>
```

```css
/* libs/falcon/src/theme/falcon.theme.css — THE place where families bind to tokens */
@theme {
  --font-noor-sans: 'Inter', system-ui, sans-serif;
  --font-noor-arabic: 'Cairo', 'IBM Plex Sans Arabic', system-ui, sans-serif;
}
```

```html
<!-- apps/admin-console/.../contracts-page.html — consume by name -->
<h1 class="font-noor-sans text-noor-display">Contracts</h1>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contracts-page.html — per-page font import + inline family -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins&display=swap">

<h1 style="font-family: 'Poppins', sans-serif" class="font-['Poppins'] text-noor-display">
  Contracts
</h1>
```

## Known legitimate exemptions

- `apps/admin-console/src/index.html` — the legal `<link>` home
- `libs/falcon/src/theme/**` — the legal `@theme` / `@font-face` home
- Any file listed in `exemptions/EXEMPTIONS.md` against `R-NOOR-004` (typically theme-studio preview files that intentionally demo alternate families)

## Fix recipe

When a violation is found:

1. **If the page imports a font that ISN'T in the canonical stack** — delete the import. Replace the font-family with the nearest existing Noor token (`font-noor-sans` for LTR, `font-noor-arabic` for RTL).
2. **If the design genuinely needs a new family** — propose it via the theme-promotion flow (R-NOOR-002): add the `<link>` to `index.html`, add the family token to `@theme`, then consume it.
3. **If a component uses inline `style="font-family: …"`** — remove the inline style and apply the token utility class to the element instead.
4. **If `font-[…]` arbitrary utility is used** — replace with the theme token utility.
5. Run `nx build admin-console` and a quick visual check for layout reflow (different family = different metrics).

## Related rules

- [[R-FE-003-no-inline-styles]] — universal ban on inline styles for theme-shaped properties
- [[R-NOOR-002-theme-promotion]] — new families flow through theme promotion
- [[R-NOOR-003-typography-scale]] — companion rule on the type-scale side

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat D: font ownership + font caveat
2. `memory/feedback_v02_theme_adopted.md` — canonical theme + V0.2 Google Fonts CDN convention
3. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
4. Falcon CLAUDE.md (project root) — Noor Instructions section
