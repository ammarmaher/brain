---
ruleId: R-NOOR-001
name: Layout ownership — shell owns chrome, page owns content
category: layout
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
    - "apps/admin-console/**/*.css"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
    - "apps/admin-console/src/app/layout/**"
severity: must
detector:
  type: structural
  patterns:
    - 'class="[^"]*\b(fixed|sticky|absolute)\b[^"]*\b(top-0|bottom-0|left-0|right-0|inset-0)\b[^"]*"'
    - 'class="[^"]*\b(h-screen|min-h-screen|w-screen|min-w-screen)\b[^"]*"'
    - 'class="[^"]*\b(m[ltrbxy]?-\d+|ms-\d+|me-\d+)\b[^"]*"'
  exemptPatterns:
    - 'apps/admin-console/src/app/layout/'
    - 'apps/admin-console/.+/host-shell-outlet'
  description: |
    Verifies that app-chrome primitives (fullscreen wrappers, fixed headers, viewport-height containers)
    only appear inside the layout folder owned by host-shell. Verifies that leaf components and page
    components do not declare their own outer margins (`m-*`, `ms-*`, `me-*`) on the host element —
    spacing between page sections is the page's responsibility, not the component's.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Cannot auto-fix — moving chrome out of a component requires re-architecting the layout owner; flag as decision in morning briefing'
relatedRules:
  - R-FE-008
  - R-NOOR-002
  - R-NOOR-006
source:
  - file: feedback_noor_instructions.md
    location: memory
  - file: CLAUDE.md
    location: project-root
  - file: brain-skills/Front-End-skills/noor-instructions-skill/Skill.md
    location: brain-skills
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
scopeNote: |
  This rule is ADMIN-CONSOLE-ONLY. The host-shell owns app chrome (top bar, side rail, viewport
  height). Pages own content layout (grid/flex composition of sections). Components own their
  internal layout but NEVER inject outer margins — the parent page decides spacing. Noor hardens
  the universal grid-first rule (R-FE-008) with explicit ownership boundaries inside admin-console.
---

*** Rule R-NOOR-001 — Layout ownership ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: structural (file location + class-pattern audit) ***

# R-NOOR-001 — Layout ownership: shell owns chrome, page owns content, components own only themselves

## What it says

Inside `apps/admin-console/**`, layout responsibility is split across three tiers and MUST NOT cross:

1. **Host-shell** owns the **app chrome** — top bar, side rail, fixed/absolute fullscreen wrappers, viewport-height containers (`h-screen`, `min-h-screen`, `w-screen`). Chrome primitives may appear ONLY in `apps/admin-console/src/app/layout/**` or a host-shell outlet.
2. **Page components** own the **content layout** — the grid/flex composition of sections inside the routed view.
3. **Leaf components** own ONLY their internal layout. They MUST NOT declare outer margins (`m-*`, `ms-*`, `me-*`, `mx-*`, `my-*`) on their host element. Spacing between siblings is the parent page's decision.

## Why it exists

Admin Console is a multi-module operational app (Contracts / Pricing / Tariff / OCS). Without strict layout ownership, every new component drags its own margin baggage into the page, page-level designers lose grid control, and parity between modules drifts. The shell + page + component split lets Noor's design system slide sections up/down a page without having to re-tune component internals, and lets us swap layouts without rewriting components. Cross-tier leakage (e.g. a leaf component setting `mt-6` "because it usually sits below a heading") is the single most common parity break we see in admin-console PRs.

## Detector strategy

Three structural checks run in `apps/admin-console/**`:

1. **Chrome primitives outside the shell** — search every `*.html` for class attributes containing fullscreen wrappers (`fixed top-0`, `absolute inset-0`) OR viewport-size primitives (`h-screen`, `min-h-screen`, `w-screen`). Files outside `apps/admin-console/src/app/layout/**` (and any explicit host-shell outlet) that match are violations.
2. **Margin on component host** — for each component, parse the template root element and the `:host` block in its (forbidden but possible) styles. Any `m-*` / `ms-*` / `me-*` / `mx-*` / `my-*` utility on the root element of a leaf component (not a page route component) is a violation.
3. **Allowed path table** — the detector ships with a small allowlist of layout-owning paths; everything else is leaf-tier by default.

## Examples

### ✅ Good

```html
<!-- apps/admin-console/src/app/layout/admin-shell.html (shell owns chrome) -->
<div class="grid grid-cols-[16rem_1fr] h-screen">
  <app-side-rail class="bg-slate-900"></app-side-rail>
  <router-outlet></router-outlet>
</div>
```

```html
<!-- apps/admin-console/.../contracts-page.html (page owns content layout + spacing) -->
<section class="grid gap-6">
  <app-contracts-header></app-contracts-header>
  <app-contracts-toolbar></app-contracts-toolbar>
  <app-contracts-table></app-contracts-table>
</section>
```

```html
<!-- apps/admin-console/.../contracts-header.html (component owns ONLY itself) -->
<header class="flex items-center justify-between">
  <h1 class="text-xl font-semibold">Contracts</h1>
  <falcon-button variant="primary">New contract</falcon-button>
</header>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contracts-header.html — leaks app chrome AND outer margin -->
<header class="fixed top-0 left-0 right-0 h-screen mb-6 mt-4 flex items-center">
  <!--                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^   chrome + margin       -->
  <h1 class="text-xl font-semibold">Contracts</h1>
</header>
```

## Known legitimate exemptions

- `apps/admin-console/src/app/layout/**` — shell directory MAY use chrome primitives
- Page route components — MAY declare grid/flex on their root element (content layout)
- Modal / dialog overlay components — MAY use `fixed inset-0` but only inside an explicit overlay slot
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-001`

## Fix recipe

When a violation is found:

1. **Chrome leak** — move the fullscreen / viewport-height wrapper to the nearest shell layout file. Replace it in the component with the layout slot's outlet contract.
2. **Margin leak** — delete the `m-*` / `ms-*` / `me-*` / `mx-*` / `my-*` utility from the component root element. If the page now collapses, add the spacing to the page-level container instead (`<section class="grid gap-6">` is the canonical pattern).
3. **Hidden margin in `:host`** — Noor forbids component CSS at all (see R-FE-002). Remove the entire styles block and reapply spacing via the parent grid.
4. Run `nx build admin-console` — Tailwind purges any orphaned utilities. Verify in Falcon Eyes against the baseline.

## Related rules

- [[R-FE-008-grid-first]] — Tailwind Grid is the default layout primitive (universal)
- [[R-NOOR-002-theme-promotion]] — spacing tokens come from canonical theme, not ad-hoc values
- [[R-NOOR-006-component-reuse]] — Falcon library wrappers also obey this ownership split
- [[R-FE-002-no-scss-no-component-css]] — closes the `:host{}` escape hatch

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Noor 8-category list (Cat A: layout ownership)
2. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
3. Falcon CLAUDE.md (project root) — Noor Instructions section
4. `Brain SK/_obsidian/00-Home/Color Legend.md` — graph/shell layering convention
