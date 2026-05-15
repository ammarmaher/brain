---
ruleId: R-FE-001
name: Tailwind utilities only on Angular templates
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
    - "libs/falcon/src/theme/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: regex
  patterns:
    - 'from\s+["'']primeng/'
    - 'from\s+["'']primeicons'
    - 'from\s+["'']primeflex'
    - '@import\s+["''].*primeng'
    - '\bpi\s+pi-[a-z0-9-]+'
    - 'styleUrls?\s*:\s*\['
    - 'styles\s*:\s*\['
  exemptPatterns:
    - 'styles\s*:\s*\[\s*\]'
    - 'styleUrls?\s*:\s*\[\s*\]'
  description: Detects PrimeNG/PrimeIcons/PrimeFlex imports, pi-* icon classes, and any non-empty Angular styles/styleUrls arrays in app or library template/component files
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Replace PrimeNG imports with Falcon UI Core components (<falcon-*>); replace pi-* with vendored Falcon icon classes; move any remaining declarations into the canonical Tailwind @theme SSOT and use Tailwind utility classes on templates only'
relatedRules:
  - R-FE-002
  - R-FE-003
  - R-FE-004
  - R-FE-005
source:
  - file: feedback_no_inline_styles_tokens_only.md
    location: memory
  - file: project_falcon_primeng_total_removal_complete.md
    location: memory
  - file: project_brain_skills_primeng_purge.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-001 — Tailwind utilities only on Angular templates ***
*** Source: angular-tailwind-skill rewrite + total PrimeNG removal program ***
*** Detector: regex (7 patterns) ***

# R-FE-001 — Tailwind utilities only on Angular templates

## What it says

Falcon Angular code MUST style every visible element with Tailwind utility classes on the template. No PrimeNG imports, no PrimeIcons (`pi pi-*`), no PrimeFlex utilities, no `styles:` array in `@Component`, no `styleUrls:` to a SCSS or component-CSS file. The only UI kit allowed is Falcon UI Core (`<falcon-*>` components from `libs/falcon-ui-core`).

## Why it exists

PrimeNG was fully uninstalled on 2026-05-10 across all 3 apps (admin-console main.js dropped from 2,253 KB → 1,210 KB raw). 122 `pi pi-*` icons were replaced via vendored Falcon icon font. Re-introducing any of these vectors regresses the bundle, breaks theming (PrimeNG preset no longer exists), and violates the rebuild contract. Component CSS and `styles:` blocks fragment the theming layer — every visual rule must flow through the canonical `@theme` SSOT.

## Detector strategy

Regex sweep across templates + components in the configured scope:

1. `from "primeng/..."` — TypeScript imports of any PrimeNG module
2. `from "primeicons"` — PrimeIcons font package
3. `from "primeflex"` — PrimeFlex layout utility package
4. `@import "...primeng..."` — CSS-side PrimeNG theme imports
5. `\bpi pi-[a-z0-9-]+` — PrimeIcons class names on templates (e.g. `pi pi-user`)
6. `styleUrls?:` `[ ... ]` non-empty — Angular `@Component` referencing CSS files
7. `styles:` `[ ... ]` non-empty — Angular `@Component` with inline CSS strings

Empty arrays `styles: []` / `styleUrls: []` are exempt (Angular generates these on a few scaffolded components and they are no-ops).

## Examples

### ✅ Good

```ts
// apps/admin-console/.../user-row.component.ts
@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  // no styleUrls, no styles
})
export class UserRowComponent {}
```

```html
<!-- apps/admin-console/.../user-row.component.html -->
<div class="grid grid-cols-[1fr_auto] gap-3 items-center bg-falcon-slate-50 rounded-md p-3">
  <falcon-icon name="user" />
  <falcon-button variant="ghost">Edit</falcon-button>
</div>
```

### ❌ Bad

```ts
// apps/admin-console/.../user-row.component.ts
import { ButtonModule } from 'primeng/button';        // ❌ PrimeNG import
import 'primeicons/primeicons.css';                   // ❌ PrimeIcons

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.scss'],           // ❌ component-CSS file
  styles: [':host { display: block; }'],              // ❌ inline styles array
})
export class UserRowComponent {}
```

```html
<!-- apps/admin-console/.../user-row.component.html -->
<div class="p-grid">                                  <!-- ❌ PrimeFlex -->
  <i class="pi pi-user"></i>                          <!-- ❌ PrimeIcons -->
  <p-button label="Edit"></p-button>                  <!-- ❌ PrimeNG -->
</div>
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — Stencil components own their internal styling (Shadow DOM); the library is the SSOT for primitives
- `libs/falcon/src/theme/**` — the canonical `@theme` declaration file
- `*.spec.ts` — test fixtures are throwaway
- Anything listed against `R-FE-001` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. **PrimeNG import** — find the Falcon UI Core equivalent (`<p-button>` → `<falcon-button>`, `<p-dropdown>` → `<falcon-dropdown>`). If no equivalent exists, file a GAP in `70-Gaps/` and escalate.
2. **PrimeIcons class** — replace `pi pi-<name>` with the corresponding vendored Falcon icon (`<falcon-icon name="<name>" />`).
3. **PrimeFlex utility** — replace with Tailwind utility (`p-grid` → `grid grid-cols-12`).
4. **Non-empty `styles:` / `styleUrls:`** — remove the entry. Move any rules into the canonical `libs/falcon/src/theme/falcon.theme.css` `@theme` block as token-backed utilities, or express them directly as Tailwind classes on the template.
5. Re-run the detector to confirm clean.

## Related rules

- [[R-FE-002-no-scss-no-component-css]] — the structural sibling that bans the CSS file itself
- [[R-FE-003-no-inline-styles]] — the anchor for inline-style violations
- [[R-FE-004-tokens-only]] — bans hardcoded values in any layer
- [[R-FE-005-falcon-library-first]] — defines the positive choice that replaces PrimeNG

## Sources of truth

1. `memory/feedback_no_inline_styles_tokens_only.md` — hardened 2026-05-05
2. `memory/project_falcon_primeng_total_removal_complete.md` — total removal program 2026-05-10
3. `memory/project_brain_skills_primeng_purge.md` — angular-tailwind-skill rename, PrimeNG/SCSS forbidden
4. `CLAUDE.md` (project root) — "Tailwind utilities only — no SCSS, no component CSS, no PrimeNG"
