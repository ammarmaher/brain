---
ruleId: R-FE-003
name: No inline styles, ever
category: theme
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.html"
    - "apps/**/*.ts"
    - "libs/**/*.html"
    - "libs/**/*.ts"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: regex
  patterns:
    - 'style="[^"]+"'
    - '\[style\]="[^"]+"'
    - '\[ngStyle\]="[^"]+"'
    - '\.nativeElement\.style\.'
    - 'Renderer2.*setStyle'
  exemptPatterns:
    - 'style=""'
  description: Catches any inline style attribute, [style] binding, [ngStyle] binding, or programmatic style mutation outside Renderer2 / Tailwind utilities
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Convert inline declarations to Tailwind utility classes or add a token-backed class in the canonical theme file'
relatedRules:
  - R-FE-001
  - R-FE-002
  - R-FE-004
source:
  - file: feedback_no_inline_styles_tokens_only.md
    location: memory
  - file: brain-skills/Front-End-skills/angular-tailwind-skill/Skill.md
    location: brain-skills
  - file: brain-skills/Front-End-skills/noor-instructions-skill/Skill.md
    location: brain-skills
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-003 — No inline styles, ever ***
*** Source: feedback_no_inline_styles_tokens_only.md (hardened 2026-05-05) ***
*** Detector: regex (5 patterns) ***

# R-FE-003 — No inline styles, ever

## What it says

Angular templates and component classes MUST NOT use inline `style="…"`, `[style]="…"`, `[ngStyle]="…"`, or programmatic style mutation via `element.style.*` / `Renderer2.setStyle`. All styling goes through Tailwind utility classes (templates only) or, in the rare case a class is unavoidable, through a token-backed declaration in the canonical theme file.

## Why it exists

Inline styles bypass the theming layer, defeat dark-mode + RTL + brand-token swaps, and silently override the Falcon design system. They are also the #1 source of unaudited hex/px values, which violates R-FE-004 (tokens only). Hardened on 2026-05-05 after a pre-finish grep gate was added across 4 skill files.

## Detector strategy

Pure regex sweep across all Angular templates and TypeScript files in the scope. Five patterns catch:

1. `style="…"` — HTML inline attribute
2. `[style]="…"` — Angular property binding
3. `[ngStyle]="…"` — Angular directive
4. `.nativeElement.style.` — DOM mutation
5. `Renderer2.*setStyle` — Renderer-based DOM mutation

Detector runs `Select-String -Pattern <pattern> -Path <scope>` per pattern, dedupes results, emits one violation row per match.

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../user-row.html -->
<div class="grid grid-cols-[1fr_auto] gap-3 items-center bg-falcon-slate-50 rounded-md p-3">
  <falcon-avatar [user]="user" />
  <falcon-button variant="ghost" (click)="edit()">Edit</falcon-button>
</div>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../user-row.html -->
<div style="display: grid; gap: 12px; background: #f8fafc; padding: 12px;">
  <span [style.color]="user.color">{{ user.name }}</span>
  <button [ngStyle]="{ 'margin-left': '8px' }">Edit</button>
</div>
```

```ts
// component.ts
ngAfterViewInit() {
  this.el.nativeElement.style.borderColor = '#3b82f6';   // ❌ bypasses theme
}
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — Stencil components may internally inline-style their shadow-root primitives; library is the SSOT
- `*.spec.ts` — unit tests fixture markup is throwaway
- `style=""` (empty) — Angular generates this when binding evaluates to null; ignored
- Anything in `exemptions/EXEMPTIONS.md` listed against `R-FE-003`

## Fix recipe

For each violation:

1. Identify the CSS property being inlined.
2. Find the matching Tailwind utility — `border-color: #3b82f6` → `border-blue-500` (or the token-backed class).
3. If a token-backed class is needed, declare it in `libs/falcon/src/theme/falcon.theme.css` `@theme` block, then use the utility.
4. Delete the inline binding.
5. Re-run the detector to confirm clean.

If the inline style was conditional (`[style.color]="user.color"`):

1. Add a `ngClass` map that picks one of N token-backed classes.
2. Or, if the value is truly dynamic at runtime, expose a CSS custom property and bind that instead (rare; flag as a GAP first).

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — the positive side of the same coin
- [[R-FE-002-no-scss-no-component-css]] — the structural sibling
- [[R-FE-004-tokens-only]] — the semantic sibling

## Sources of truth

1. `memory/feedback_no_inline_styles_tokens_only.md` — hardened 2026-05-05, grep gate codified in 4 skill files
2. `brain-skills/Front-End-skills/angular-tailwind-skill/Skill.md`
3. `brain-skills/Front-End-skills/noor-instructions-skill/Skill.md`
