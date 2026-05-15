---
ruleId: R-NOOR-005
name: Color naming — palette over intent (Admin Console)
category: color
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
    - "apps/admin-console/**/*.css"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
severity: must
detector:
  type: regex
  patterns:
    - '\b(bg|text|border|ring|outline|fill|stroke|from|via|to|divide|placeholder|accent|caret|shadow)-(primary|secondary|success|warning|danger|info|error|muted|surface|on-primary|on-surface|brand)\b'
  exemptPatterns:
    - 'bg-primary-500'
    - 'text-primary-500'
  description: Catches semantic color tokens (bg-primary, text-success, border-danger, etc.) inside Admin Console scope. Noor mandates palette names (slate-50, blue-500, emerald-600) instead.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Cannot auto-fix — semantic-to-palette mapping is per-component judgment; raise as a decision in morning briefing'
relatedRules:
  - R-FE-004
  - R-NOOR-002
  - R-NOOR-003
source:
  - file: feedback_noor_instructions.md
    location: memory
  - file: brain-skills/Front-End-skills/noor-instructions-skill/Skill.md
    location: brain-skills
  - file: brain-skills/Front-End-skills/noor-instructions-skill/resources/color-naming.md
    location: brain-skills
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
scopeNote: |
  This rule is ADMIN-CONSOLE-ONLY. Other Falcon apps (host-shell, management-console) may use semantic color tokens —
  R-FE-004 governs them. Noor overrides the global rule inside its scope, forward-only (no migration of existing
  semantic tokens elsewhere in the platform).
---

*** Rule R-NOOR-005 — Palette over intent (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: regex (catches semantic tokens) ***

# R-NOOR-005 — Color naming: palette over intent

## What it says

Inside `apps/admin-console/**`, color utilities MUST use **palette names** (e.g. `bg-slate-50`, `text-blue-500`, `border-emerald-600`) and MUST NOT use **intent names** (`bg-primary`, `text-success`, `border-danger`, `bg-surface`, `text-on-primary`, etc.). Noor's design system reasons about colors by where they sit on the palette ladder, not by their semantic role.

## Why it exists

Admin Console (Contracts / Pricing / Tariff / OCS) is a dense, data-heavy operational surface. Designers iterate on color by sliding shades up/down the palette (50 → 100 → 200), not by changing semantic meaning. Intent tokens force a re-mapping whenever a shade changes, breaks dark-mode tuning, and conflicts with palette-based design files. This rule is Noor's signature override over the global Falcon convention (which allows intent tokens). Forward-only — existing semantic tokens elsewhere in the platform stay.

## Detector strategy

One regex sweep inside `apps/admin-console/**`. Match any Tailwind color utility prefix (`bg|text|border|ring|outline|fill|stroke|from|via|to|divide|placeholder|accent|caret|shadow`) followed by an intent name (`primary|secondary|success|warning|danger|info|error|muted|surface|on-primary|on-surface|brand`).

Exempt patterns: palette-style usage `bg-primary-500` is NOT a violation because the `-500` shade suffix makes it palette-shaped (assuming `primary-` is a defined palette family with shades). The rule targets bare-intent tokens without a shade suffix.

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../contract-row.html -->
<div class="bg-slate-50 text-slate-900 border-slate-200 rounded-md p-3">
  <span class="text-emerald-600">Active</span>
  <span class="text-amber-600">Pending</span>
  <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded">Save</button>
</div>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contract-row.html -->
<div class="bg-surface text-on-surface border-muted rounded-md p-3">
  <span class="text-success">Active</span>
  <span class="text-warning">Pending</span>
  <button class="bg-primary hover:bg-primary-hover text-on-primary px-3 py-1.5 rounded">Save</button>
</div>
```

## Known legitimate exemptions

- Palette families that happen to be named `primary` / `secondary` with shade suffixes (`bg-primary-500`) — these are palette-shaped and exempt
- Shared library wrappers under `libs/` — governed by R-FE-004 (global rule) not R-NOOR-005
- Apps other than `apps/admin-console/` — out of scope
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-005`

## Fix recipe

This is a high-risk auto-fix because the palette mapping is design-judgment. Manual process:

1. For each violation, look up the current semantic value in the canonical theme file.
2. Decide which palette shade the design actually wants:
   - `bg-primary` → likely `bg-blue-500` or `bg-blue-600` depending on contrast spec
   - `text-success` → `text-emerald-600`
   - `text-warning` → `text-amber-600`
   - `text-danger` → `text-rose-600`
   - `text-on-primary` → `text-white` or `text-slate-50`
3. Replace in template / theme.
4. Visual-diff against Falcon Eyes baseline to confirm no regression.
5. Re-run detector.

Because this is design judgment, night-shift auto-fix is **NOT** enabled. Findings are surfaced in the morning briefing as a Decisions Queue row.

## Related rules

- [[R-FE-004-tokens-only]] — global rule that intent tokens DO satisfy outside admin-console
- [[R-NOOR-002-theme-promotion]] — palette ladders are declared in the theme file
- [[R-NOOR-003-typography-scale]] — sibling Noor naming convention

## Sources of truth

1. `memory/feedback_noor_instructions.md`
2. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md`
3. `brain-skills/Front-End-skills/noor-instructions-skill/resources/color-naming.md`
4. Falcon CLAUDE.md (project root) — Noor Instructions section
