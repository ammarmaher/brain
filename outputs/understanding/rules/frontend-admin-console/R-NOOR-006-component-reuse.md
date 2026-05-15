---
ruleId: R-NOOR-006
name: Component reuse — Falcon library FIRST in admin-console
category: reuse
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
    - "libs/falcon-ui-core/**"
severity: must
detector:
  type: semantic-llm
  patterns:
    - '<input\b'
    - '<select\b'
    - '<textarea\b'
    - '<button\b'
    - '<table\b'
    - '<dialog\b'
    - '<form\b\s+(?![^>]*\bnoor-bypass\b)'
    - 'p-(button|input|dropdown|table|dialog|calendar|menu|tabview|tree|toast|tag|chip|checkbox|radiobutton|inputtext|inputnumber|inputmask|password|multiselect|select|panelmenu|tieredmenu|menubar|breadcrumb|steps|accordion|paginator|datatable)\b'
  exemptPatterns:
    - 'libs/falcon-ui-core/'
    - '<button[^>]+type="submit"[^>]*falcon-button-internal'
  description: |
    LLM-judged check: any raw HTML control (<input>, <select>, <button>, <textarea>, <table>,
    <dialog>, etc.) in admin-console templates is flagged for review against the Falcon UI Core
    catalogue. If a <falcon-*> equivalent exists with the needed feature set, the raw control
    is a violation. If the Falcon equivalent has a gap, the finding routes to GAPS_AND_UPGRADES
    instead. Any leftover PrimeNG selector (`p-*`) is an automatic violation since the platform
    completed total PrimeNG removal.
autoFix:
  available: false
  riskLevel: high
  patchHint: |
    Suggested swaps: <input> → <falcon-input> · <select> → <falcon-dropdown> · <button> → <falcon-button>
    <textarea> → <falcon-textarea> · <table> → <falcon-table> · <dialog> → <falcon-modal>
    Attribute mapping is component-specific — flag for review, do not auto-rewrite.
relatedRules:
  - R-FE-005
  - R-FE-006
  - R-FE-007
  - R-NOOR-001
source:
  - file: feedback_noor_instructions.md
    location: memory
  - file: feedback_falcon_custom_library_mandatory.md
    location: memory
  - file: feedback_library_skeleton_app_api.md
    location: memory
  - file: project_falcon_primeng_total_removal_complete.md
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
  This rule hardens the universal Falcon library-first rule (R-FE-005) inside admin-console with
  an explicit zero-tolerance posture: PrimeNG is fully removed platform-wide, so any `p-*` selector
  is an automatic violation. Raw HTML controls require a justified GAP entry against the Falcon
  catalogue. Component upgrades route through R-FE-006 (customization order) and R-FE-007
  (library-skeleton + app-wrapper split).
---

*** Rule R-NOOR-006 — Component reuse (Admin Console) ***
*** Source: Noor Instructions + Falcon library-first standing rules ***
*** Detector: semantic-llm (judges raw-control intent against Falcon catalogue) ***

# R-NOOR-006 — Component reuse: Falcon library FIRST inside admin-console

## What it says

Inside `apps/admin-console/**`, every interactive UI control — input, select, button, textarea, table, dialog, modal, dropdown, checkbox, radio, switch, tabs, menu, tooltip, toast, tag, chip, paginator, calendar, accordion, breadcrumb, tree, stepper — MUST use the corresponding `<falcon-*>` component from `libs/falcon-ui-core` if one exists. Raw HTML controls (`<input>`, `<select>`, `<button>`, `<textarea>`, `<table>`, `<dialog>`) are forbidden in admin-console templates unless:

1. The needed control does not exist in the Falcon catalogue, AND
2. A `GAPS_AND_UPGRADES.md` entry is filed for the missing component, AND
3. The raw markup carries an inline `<!-- noor:exempt-component-reuse reason="GAP-XXX" -->` marker.

PrimeNG selectors (`p-button`, `p-input`, `p-dropdown`, `p-table`, etc.) are **never** allowed — the platform completed total PrimeNG removal on 2026-05-10 and ESLint flat-block forbids the imports.

## Why it exists

The Falcon UI Core library is the SINGLE source of truth for component shape, behavior, accessibility, RTL behavior, and theme tokens. The standing rules:

- **R-FE-005** (universal library-first) — every app must check the catalogue before authoring markup.
- **feedback_falcon_custom_library_mandatory** (2026-05-15 absolute standing rule) — every UI task in every session must read `Brain Outputs/understanding/frontend/components/<name>/` API + USAGE + TOKENS + GAPS + DECISION dossiers BEFORE writing markup, and emit a compliance table per section.
- **feedback_library_skeleton_app_api** (Wave 16) — two-layer pattern: library skeleton (pure presentational) + app wrapper (injects services). Raw HTML breaks this split.
- **project_falcon_primeng_total_removal_complete** (2026-05-10) — zero PrimeNG / PrimeIcons across the platform. Any `p-*` selector is a regression.

Noor adds a zero-tolerance posture in admin-console because the Contracts / Pricing / Tariff / OCS modules are the most form-heavy, table-heavy surface — drift here multiplies fastest.

## Detector strategy

LLM-assisted pass per template:

1. **Regex pre-filter** — scan every `*.html` in `apps/admin-console/**` for:
   - Raw control tags: `<input`, `<select`, `<textarea`, `<button`, `<table`, `<dialog`, `<form` (without the `noor-bypass` marker)
   - PrimeNG selectors: any `p-(button|input|dropdown|table|dialog|calendar|menu|tabview|tree|toast|tag|chip|checkbox|radiobutton|inputtext|inputnumber|inputmask|password|multiselect|select|panelmenu|tieredmenu|menubar|breadcrumb|steps|accordion|paginator|datatable)` element
2. **LLM verdict** — for each raw control match, feed the LLM (1) the matched line, (2) the Falcon UI Core catalogue index from `Brain Outputs/understanding/frontend/components/`, (3) the component's role from surrounding context. Verdict template:
   ```
   {
     violation: true|false,
     suggestedFalconComponent: "<falcon-input>" | "<falcon-dropdown>" | "GAP",
     gapId: "GAP-AC-XXX" | null,
     confidence: 0..1
   }
   ```
3. **PrimeNG matches** — automatic violation, no LLM needed, severity escalates to BLOCKER.

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../contract-form.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <falcon-input formControlName="code" label="Contract code" required></falcon-input>
  <falcon-dropdown formControlName="status" [options]="statusOptions" label="Status"></falcon-dropdown>
  <falcon-textarea formControlName="notes" label="Notes" rows="4"></falcon-textarea>

  <div class="flex gap-3 justify-end">
    <falcon-button variant="ghost" type="button" (click)="cancel()">Cancel</falcon-button>
    <falcon-button variant="primary" type="submit" [disabled]="form.invalid">Save</falcon-button>
  </div>
</form>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contract-form.html — raw HTML + leftover PrimeNG -->
<form>
  <input type="text" formControlName="code" class="border rounded p-2" placeholder="Contract code" />
  <p-dropdown formControlName="status" [options]="statusOptions"></p-dropdown>
  <textarea formControlName="notes" rows="4" class="border rounded p-2"></textarea>

  <div class="flex gap-3 justify-end">
    <button type="button" class="px-3 py-1.5 rounded border" (click)="cancel()">Cancel</button>
    <p-button label="Save" type="submit"></p-button>
  </div>
</form>
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — the library itself MUST contain raw HTML primitives (the skeleton layer)
- Raw markup carrying `<!-- noor:exempt-component-reuse reason="GAP-XXX" -->` AND a matching open GAP entry in `Brain Outputs/understanding/frontend/components/<name>/GAPS_AND_UPGRADES.md`
- Test pages that exercise raw-control fallback (must live under `apps/admin-console/**/*.spec.ts` or a clearly-named demo folder)
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-006`

## Fix recipe

When a raw control violation is found:

1. **Look up the Falcon equivalent** — read `Brain Outputs/understanding/frontend/components/<name>/API.md` and `USAGE.md` for the matching component.
2. **Map attributes** — most are 1:1 (`placeholder` → `placeholder`, `disabled` → `disabled`, `[formControlName]` → `[formControlName]`). Where mappings diverge, follow `API.md`.
3. **Apply customization order (R-FE-006)**: inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP. Stop at the lowest level that satisfies the design.
4. **If a wrapper is needed** (component requires service injection per R-FE-007), create `apps/admin-console/.../shared-components/<name>/` with the skeleton as inner tag.
5. **If the Falcon component genuinely lacks a feature** — file a GAP entry, mark the raw markup with the noor-bypass marker referencing the GAP ID, and notify the design curator.
6. **Run `nx build admin-console` + Falcon Eyes** against baseline.

When a PrimeNG selector is found:

1. This is a regression — the platform has zero PrimeNG. Remove it immediately and replace with the Falcon equivalent.
2. Check `package.json` and ESLint config — any new `primeng` dependency is a separate violation (R-FE-013 / total-removal-program).

## Related rules

- [[R-FE-005-falcon-library-first]] — universal library-first rule
- [[R-FE-006-customization-order]] — the canonical 8-step customization order
- [[R-FE-007-library-skeleton-app-wrapper]] — skeleton + wrapper split
- [[R-NOOR-001-layout-ownership]] — Falcon components also obey layout ownership

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat F: component reuse
2. `memory/feedback_falcon_custom_library_mandatory.md` (absolute standing rule, 2026-05-15)
3. `memory/feedback_library_skeleton_app_api.md` (Wave 16 doctrine, 2026-05-15)
4. `memory/project_falcon_primeng_total_removal_complete.md` (program complete, 2026-05-10)
5. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
6. Falcon CLAUDE.md (project root) — Noor Instructions section
