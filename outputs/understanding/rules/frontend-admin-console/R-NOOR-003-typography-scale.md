---
ruleId: R-NOOR-003
name: Typography scale — only documented type tokens allowed
category: typography
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
severity: must
detector:
  type: regex
  patterns:
    - '\b(text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl))\b'
    - '\bleading-(none|tight|snug|normal|relaxed|loose|\d+)\b'
    - '\btracking-(tighter|tight|normal|wide|wider|widest)\b'
    - 'style="[^"]*font-size:\s*\d+(px|rem|em|pt)[^"]*"'
    - 'class="[^"]*text-\[\d+(px|rem|em|pt)\][^"]*"'
  exemptPatterns:
    - '\btext-noor-(display|title|heading|body|caption|micro|label|table-cell)\b'
    - 'libs/falcon/src/theme/'
  description: |
    Catches every Tailwind ad-hoc typography utility (`text-xl`, `text-lg`, `leading-tight`,
    `tracking-wide`, arbitrary `text-[14px]`, inline `font-size:` styles) inside admin-console
    scope. Noor mandates the documented Noor scale (`text-noor-display`, `text-noor-heading`,
    `text-noor-body`, `text-noor-caption`, etc.) which packages size + line-height + tracking
    + font-weight into one composite token.
autoFix:
  available: false
  riskLevel: medium
  patchHint: |
    Suggested map: text-xs→text-noor-micro · text-sm→text-noor-caption · text-base→text-noor-body
    text-lg→text-noor-heading · text-xl→text-noor-title · text-2xl+→text-noor-display
    Auto-fix gated on design-curator approval per page section.
relatedRules:
  - R-FE-001
  - R-FE-004
  - R-NOOR-002
  - R-NOOR-004
source:
  - file: feedback_noor_instructions.md
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
  This rule is ADMIN-CONSOLE-ONLY. The universal R-FE-001 (Tailwind utilities only) permits the
  full Tailwind type-scale; Noor narrows it to the Noor composite tokens because Admin Console
  uses different optical sizing than the customer-facing apps (denser tables, smaller controls,
  tighter line-heights). Forward-only — existing host-shell/management-console pages keep their
  current Tailwind utilities.
---

*** Rule R-NOOR-003 — Typography scale (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: regex (catches ad-hoc Tailwind type utilities) ***

# R-NOOR-003 — Typography scale: only documented Noor tokens may be used

## What it says

Inside `apps/admin-console/**`, every text-styling utility MUST be one of the documented Noor composite type tokens (`text-noor-display`, `text-noor-title`, `text-noor-heading`, `text-noor-body`, `text-noor-caption`, `text-noor-micro`, `text-noor-label`, `text-noor-table-cell`). Bare Tailwind type utilities (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, …, `text-9xl`), ad-hoc `leading-*` and `tracking-*` modifiers, arbitrary `text-[Npx]` values, and inline `font-size:` declarations are forbidden.

Each Noor token packages **size + line-height + tracking + font-weight** into one composite utility, so consumers cannot mix-and-match arbitrary values that drift away from the documented scale.

## Why it exists

Admin Console renders multi-thousand-row tables, dense form grids, and status overlays where optical typography matters more than anywhere else in the platform. Designers iterate by moving sections up/down the Noor scale, not by changing pixel values. Bare Tailwind type utilities expose 12 sizes with independent line-height + tracking knobs — that's hundreds of valid combinations, and parity between pages collapses as developers each pick their own. The Noor composite tokens collapse the design surface to ~8 named sizes with locked metrics, which is what the design files were drawn against. This also keeps dark-mode tuning and theme-studio export tractable.

## Detector strategy

One regex sweep across `apps/admin-console/**`. Match any of:

1. Bare Tailwind type utilities — `text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|text-4xl|text-5xl|text-6xl|text-7xl|text-8xl|text-9xl`
2. Bare leading utilities — `leading-(none|tight|snug|normal|relaxed|loose|\d+)`
3. Bare tracking utilities — `tracking-(tighter|tight|normal|wide|wider|widest)`
4. Arbitrary type values — `text-\[\d+(px|rem|em|pt)\]`
5. Inline `font-size` — `style="...font-size: ..."`

Exempt patterns:

- `text-noor-(display|title|heading|body|caption|micro|label|table-cell)` — the canonical scale
- Files under `libs/falcon/src/theme/**` — the theme file IS where the scale lives

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../contracts-page.html -->
<header>
  <h1 class="text-noor-display">Contracts</h1>
  <p class="text-noor-caption text-slate-500">All active contracts across the tenant</p>
</header>

<table>
  <thead>
    <tr><th class="text-noor-label">Code</th><th class="text-noor-label">Status</th></tr>
  </thead>
  <tbody>
    <tr><td class="text-noor-table-cell">CTR-001</td><td class="text-noor-table-cell">Active</td></tr>
  </tbody>
</table>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contracts-page.html -->
<header>
  <h1 class="text-3xl leading-tight tracking-wide font-bold">Contracts</h1>
  <p class="text-sm leading-snug text-slate-500">All active contracts</p>
</header>

<table>
  <thead>
    <tr>
      <th class="text-[12px] tracking-wider uppercase">Code</th>
      <th style="font-size: 12px; letter-spacing: 0.05em">Status</th>
    </tr>
  </thead>
</table>
```

## Known legitimate exemptions

- `libs/falcon/src/theme/**` — defines the Noor scale itself
- Internal preview / theme-studio components that DISPLAY the scale by name (must include a `<!-- noor:exempt-typography-scale reason="..." -->` marker)
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-003`

## Fix recipe

When a violation is found:

1. **Identify the role** — is this body text, a caption, a table cell, a section heading, a page title?
2. **Map to the Noor token** — use this conservative default map:
   - `text-xs` / `text-[10-11px]` → `text-noor-micro`
   - `text-sm` / `text-[12-13px]` → `text-noor-caption`
   - `text-base` / `text-[14-15px]` → `text-noor-body`
   - `text-lg` / `text-[16-18px]` → `text-noor-heading`
   - `text-xl` / `text-[20-22px]` → `text-noor-title`
   - `text-2xl+` → `text-noor-display`
   - Form labels → `text-noor-label`
   - Table body cells → `text-noor-table-cell`
3. **Delete companion modifiers** — `leading-*`, `tracking-*`, `font-bold` near the replaced utility are baked into the Noor token; remove them to avoid double-application.
4. **Run Falcon Eyes** against the baseline to confirm parity.
5. **Theme curator sign-off** — if the original value doesn't map cleanly to any Noor token, propose a new token via R-NOOR-002 promotion flow; do not invent inline.

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — universal Tailwind-only rule
- [[R-FE-004-tokens-only]] — tokens replace raw values
- [[R-NOOR-002-theme-promotion]] — new type tokens go through promotion
- [[R-NOOR-004-font-ownership]] — companion rule on the font family side

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat C: typography scale
2. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
3. Falcon CLAUDE.md (project root) — Noor Instructions section
