---
ruleId: R-NOOR-007
name: i18n & RTL — strings from catalog, logical spacing only
category: i18n
scope:
  apps:
    - admin-console
  paths:
    - "apps/admin-console/**/*.html"
    - "apps/admin-console/**/*.ts"
    - "apps/admin-console/**/*.css"
  exemptPaths:
    - "apps/admin-console/**/*.spec.ts"
    - "apps/admin-console/src/assets/i18n/**"
severity: must
detector:
  type: regex
  patterns:
    - '\b(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|rounded-ss|rounded-se|rounded-es|rounded-ee)-(\d+|none|px|full)\b'
    - 'class="[^"]*\btext-(left|right)\b[^"]*"'
    - 'style="[^"]*\b(left|right|padding-left|padding-right|margin-left|margin-right|border-left|border-right)\s*:'
    - '>\s*[A-Z][A-Za-z][A-Za-z\s]{2,}[a-z]\s*<\s*/(h[1-6]|p|span|label|button|td|th|a|li|div)>'
    - '\[\s*(label|placeholder|title|aria-label|alt|tooltip)\s*\]\s*=\s*"[''`][A-Z][^''`]*[a-z][''`]"'
  exemptPatterns:
    - '\{\{\s*[''"][\w\.\-]+[''"]\s*\|\s*translate\s*\}\}'
    - 'i18n\s*='
    - 'translate'
    - '\$localize'
    - 'apps/admin-console/src/assets/i18n/'
  description: |
    Two-part regex sweep:
    (a) Physical-direction Tailwind utilities (ml-*, mr-*, pl-*, pr-*, border-l-*, border-r-*,
        rounded-l-*, rounded-r-*, text-left, text-right) and inline physical CSS (left:, right:,
        padding-left:, etc.) — must be logical (ms-*, me-*, ps-*, pe-*, border-s-*, border-e-*,
        rounded-s-*, rounded-e-*, text-start, text-end).
    (b) Hardcoded English strings inside template elements or attribute bindings — must come
        from the i18n catalog via the translate pipe, i18n attribute, or $localize.
autoFix:
  available: true
  riskLevel: medium
  patchHint: |
    Physical→logical map (lossless):
    ml-* → ms-* · mr-* → me-* · pl-* → ps-* · pr-* → pe-*
    border-l-* → border-s-* · border-r-* → border-e-*
    rounded-l-* → rounded-s-* · rounded-r-* → rounded-e-*
    rounded-tl-* → rounded-ss-* · rounded-tr-* → rounded-se-*
    rounded-bl-* → rounded-es-* · rounded-br-* → rounded-ee-*
    text-left → text-start · text-right → text-end
    Hardcoded strings require manual extraction to i18n keys — no auto-fix for that branch.
relatedRules:
  - R-FE-001
  - R-NOOR-001
  - R-NOOR-002
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
  This rule is ADMIN-CONSOLE-ONLY for the hardened "must" severity. Other Falcon apps SHOULD also
  use logical properties and i18n keys, but Noor enforces it as must because Admin Console serves
  Arabic-first tenants (Cairo + IBM Plex Sans Arabic per Noor font stack) where RTL parity is a
  shipping requirement. Forward-only — existing pages with physical utilities outside admin-console
  are not migrated by this rule.
---

*** Rule R-NOOR-007 — i18n & RTL (Admin Console) ***
*** Source: Noor Instructions, brain-skills/.../noor-instructions-skill ***
*** Detector: regex (physical-direction utilities + hardcoded strings) ***

# R-NOOR-007 — i18n / RTL: catalog strings only, logical properties only

## What it says

Inside `apps/admin-console/**`, two related constraints apply:

**Part A — Logical properties only (RTL safety).** Layout primitives MUST use Tailwind logical-property utilities:

| Forbidden (physical) | Required (logical) |
|---|---|
| `ml-*` | `ms-*` (margin-inline-start) |
| `mr-*` | `me-*` (margin-inline-end) |
| `pl-*` | `ps-*` (padding-inline-start) |
| `pr-*` | `pe-*` (padding-inline-end) |
| `border-l-*` | `border-s-*` |
| `border-r-*` | `border-e-*` |
| `rounded-l-*` | `rounded-s-*` |
| `rounded-r-*` | `rounded-e-*` |
| `rounded-tl-*` / `rounded-tr-*` | `rounded-ss-*` / `rounded-se-*` |
| `rounded-bl-*` / `rounded-br-*` | `rounded-es-*` / `rounded-ee-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| inline `padding-left`, `margin-right`, etc. | logical CSS properties or token utilities |

**Part B — Every visible string comes from the i18n catalog.** Any user-visible text in a template or component attribute (`label`, `placeholder`, `title`, `aria-label`, `alt`, `tooltip`) MUST come from the i18n catalog via the `translate` pipe, the `i18n` attribute, or `$localize`. Hardcoded English strings are forbidden.

## Why it exists

Admin Console serves Arabic-first tenants. RTL parity is a shipping requirement, not a polish item. Physical-direction utilities silently break in RTL because Tailwind does NOT auto-mirror `ml-*` → `mr-*` under `dir="rtl"` — the spacing simply flips to the wrong side. Logical-property utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`) are mirror-aware by design. The Noor font stack (Cairo + IBM Plex Sans Arabic) only earns its value when paired with a correctly-mirrored layout.

Hardcoded strings break every translation cycle: they pass through PR review unnoticed, ship to staging in English-only, and then either block the Arabic release or trigger a hot-patch storm. Catalog-only enforcement is the only way to keep Arabic at parity with English on every release.

## Detector strategy

Two regex sweeps across `apps/admin-console/**`:

**Sweep A — Physical utilities + inline physical CSS:**
- Match `\b(ml|mr|pl|pr|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-(\d+|none|px|full)\b` in `class="…"` attributes.
- Match `\btext-(left|right)\b` in `class="…"` attributes.
- Match inline `style="…left:…"`, `style="…right:…"`, `style="…padding-left:…"`, etc.

**Sweep B — Hardcoded strings:**
- Match element content `>\s*[A-Z][A-Za-z][A-Za-z\s]{2,}[a-z]\s*</(h1-6|p|span|label|button|td|th|a|li|div)>` (Capitalised English phrases).
- Match attribute bindings: `[label]="'Some text'"`, `[placeholder]="'Foo'"`, `[title]="'Bar'"`, `[aria-label]="..."`, `[alt]="..."`, `[tooltip]="..."` where the value is a literal English string.

Exempt patterns:
- `{{ 'key.path' | translate }}` — translate pipe
- `i18n="..."` attribute
- `$localize`...`` template literals
- Files under `apps/admin-console/src/assets/i18n/**` — i18n catalog itself

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../contract-row.html -->
<div class="grid grid-cols-[1fr_auto] gap-4 ps-4 pe-3 py-2 border-s-4 border-e border-slate-200 rounded-s-md text-start">
  <span class="ms-2 me-auto">{{ contract.code }}</span>

  <falcon-button
    variant="ghost"
    [label]="'contracts.row.action.edit' | translate"
    [aria-label]="'contracts.row.action.edit.aria' | translate"
    (click)="edit(contract)">
  </falcon-button>
</div>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../contract-row.html — physical utilities + hardcoded strings -->
<div class="grid grid-cols-[1fr_auto] gap-4 pl-4 pr-3 py-2 border-l-4 border-r border-slate-200 rounded-l-md text-left">
  <span class="ml-2 mr-auto">{{ contract.code }}</span>

  <falcon-button
    variant="ghost"
    [label]="'Edit'"
    [aria-label]="'Edit contract'"
    (click)="edit(contract)">
  </falcon-button>
</div>
```

## Known legitimate exemptions

- Truly directional graphics where the visual MUST point left/right regardless of locale (e.g. a "previous arrow" SVG that always points to the inline-start edge but is mirrored via CSS transform, not via `right:` positioning) — must include `<!-- noor:exempt-rtl reason="..." -->` marker.
- Locale name labels in the language switcher (`English` / `العربية`) — these are LITERAL language names and don't need translation; mark with `<!-- noor:exempt-i18n reason="literal-language-name" -->`.
- Debug-only screens behind a feature flag — `*.debug.html` files.
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-NOOR-007`.

## Fix recipe

**For Part A (physical → logical):**

1. Run the auto-fix patch table above as a `sed`-style sweep across the file. The map is lossless under `dir="ltr"` and correct under `dir="rtl"`.
2. For inline `style="left: ...; right: ..."` — convert to logical CSS (`inset-inline-start:`, `inset-inline-end:`) OR move to a Tailwind logical utility.
3. Run `nx build admin-console`. Visual-diff against the LTR baseline (should be identical) AND against the RTL baseline (should now mirror correctly).
4. Falcon Eyes RTL parity check against the Arabic baseline.

**For Part B (hardcoded → catalog):**

1. Extract every hardcoded string to a key in `apps/admin-console/src/assets/i18n/en.json` (and `ar.json` if known).
2. Choose a key path that matches the page + section + role: `<page>.<section>.<role>.<id>` (e.g. `contracts.row.action.edit`).
3. Replace the literal in the template with `{{ 'key.path' | translate }}` (for text content) or `[label]="'key.path' | translate"` (for attribute bindings).
4. For ARIA labels, add a separate `*.aria` key — never reuse the visible-label key for an ARIA label.
5. Run translation extraction tooling (`ng extract-i18n` or equivalent) and verify the new keys land in the catalog.
6. Manually sanity-check the Arabic equivalent exists; if not, file an i18n GAP entry.

Auto-fix is enabled for Part A; Part B requires manual extraction.

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — Tailwind utilities on templates (universal)
- [[R-NOOR-001-layout-ownership]] — page-level grid composition must also be RTL-safe
- [[R-NOOR-002-theme-promotion]] — spacing tokens in the canonical theme use logical names

## Sources of truth

1. `memory/feedback_noor_instructions.md` — Cat G: i18n / RTL
2. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md` (referenced by CLAUDE.md; file currently absent on disk — substitute sources used)
3. Falcon CLAUDE.md (project root) — Noor Instructions section
