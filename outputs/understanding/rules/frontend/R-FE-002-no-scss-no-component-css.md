---
ruleId: R-FE-002
name: No SCSS, no component CSS, no styles array
category: theme
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.scss"
    - "apps/**/*.sass"
    - "apps/**/*.less"
    - "apps/**/*.css"
    - "apps/**/*.ts"
    - "libs/**/*.scss"
    - "libs/**/*.sass"
    - "libs/**/*.less"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "libs/falcon/src/theme/**"
    - "**/*.spec.ts"
    - "**/tailwind.css"
    - "**/styles.css"
severity: must
detector:
  type: structural
  patterns:
    - 'apps/**/*.scss'
    - 'apps/**/*.sass'
    - 'apps/**/*.less'
    - 'libs/**/*.scss'
    - 'libs/**/*.sass'
    - 'libs/**/*.less'
  exemptPatterns:
    - 'libs/falcon-ui-core/**'
    - 'libs/falcon/src/theme/**'
  description: Flags the EXISTENCE of any .scss/.sass/.less file under apps or libs (outside library + canonical theme exemptions), plus any non-empty styleUrls/styles arrays in @Component decorators
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Delete the SCSS/CSS file; rewrite its rules either as Tailwind utility classes on the template or as token declarations inside libs/falcon/src/theme/falcon.theme.css'
relatedRules:
  - R-FE-001
  - R-FE-003
  - R-FE-004
source:
  - file: feedback_no_inline_styles_tokens_only.md
    location: memory
  - file: project_brain_skills_primeng_purge.md
    location: memory
  - file: feedback_v02_theme_adopted.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-002 — No SCSS, no component CSS, no styles array ***
*** Source: angular-tailwind-skill purge (2026-05-11) + V0.2 theme adoption ***
*** Detector: structural (file existence) + regex (@Component metadata) ***

# R-FE-002 — No SCSS, no component CSS, no styles array

## What it says

Falcon apps and libraries MUST NOT contain `.scss`, `.sass`, or `.less` files anywhere under `apps/` or `libs/`. Angular `@Component` decorators MUST NOT set `styleUrls: [...]` or `styles: [...]` to anything but an empty array. The only CSS file allowed is the canonical Tailwind v4 entry that imports `falcon.theme.css`. All visual styling flows through Tailwind utility classes on templates.

## Why it exists

The Falcon V0.2 theme was adopted (2026-05-05) as the single source of truth via a Tailwind v4 `@theme` declaration at `libs/falcon/src/theme/falcon.theme.css`. Per-component SCSS or CSS files fragment the theming layer, prevent token swaps from cascading, and re-introduce the kind of drift the platform spent months removing alongside the total PrimeNG purge. Component-level `styles:` arrays are CSS by another name and have the same problem.

## Detector strategy

Two-phase check:

1. **Structural sweep** — list every file matching `apps/**/*.{scss,sass,less}` and `libs/**/*.{scss,sass,less}`. Subtract files inside exempt paths (`libs/falcon-ui-core/**`, `libs/falcon/src/theme/**`). Any remaining hit is a violation.
2. **AST/regex pass** — for every `*.ts` file with an `@Component` decorator, capture `styleUrls` and `styles`. Flag any non-empty array.

The canonical Tailwind entry (`tailwind.css` / `styles.css` that only contains `@import` + `@theme`) is exempt by path.

## Examples

### ✅ Good

```
apps/admin-console/src/
├── styles.css              ← only contains @import "tailwindcss"; @import "@falcon/theme";
├── app/
│   ├── user-row/
│   │   ├── user-row.component.ts      ← no styleUrls, no styles
│   │   └── user-row.component.html    ← Tailwind utilities only
```

```ts
@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
})
export class UserRowComponent {}
```

### ❌ Bad

```
apps/admin-console/src/app/user-row/
├── user-row.component.ts
├── user-row.component.html
└── user-row.component.scss         ❌ SCSS file exists
```

```ts
@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.scss'],   // ❌ component CSS
  styles: [`
    :host { display: block; }
    .row { padding: 12px; }
  `],                                          // ❌ inline styles array
})
export class UserRowComponent {}
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — Stencil Shadow components have their own `*.css` files that ARE the SSOT
- `libs/falcon/src/theme/**` — canonical `@theme` SSOT location
- `tailwind.css` / `styles.css` per-app entry that only re-exports the theme
- `*.spec.ts` test fixtures
- Anything listed against `R-FE-002` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. **Delete the SCSS/CSS file**. Read it first.
2. For each rule inside the deleted file:
   - If it sets layout/spacing/typography → replace with Tailwind utility classes directly on the template.
   - If it sets a brand token (color, shadow, radius) → ensure that token exists in `libs/falcon/src/theme/falcon.theme.css` `@theme` block, then use the matching Tailwind utility.
   - If it sets a `:host` rule → add it to the component template's host element via `class` binding, or move to the theme as a utility.
3. Remove the `styleUrls` / `styles` entry from the `@Component` decorator (set to `[]` only if Angular requires the key — prefer dropping it entirely).
4. Re-run `nx build <app>` to confirm green.
5. Re-run the detector to confirm clean.

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — bans PrimeNG and the broader CSS surface
- [[R-FE-003-no-inline-styles]] — bans inline `style="..."` on templates
- [[R-FE-004-tokens-only]] — bans hardcoded values once you are in the theme file

## Sources of truth

1. `memory/feedback_no_inline_styles_tokens_only.md` — hardened 2026-05-05
2. `memory/project_brain_skills_primeng_purge.md` — angular-tailwind-skill rewrite forbids SCSS + component CSS
3. `memory/feedback_v02_theme_adopted.md` — Tailwind v4 `@theme` SSOT at `libs/falcon/src/theme/falcon.theme.css`
4. `CLAUDE.md` (project root) — "Tailwind utilities only — no SCSS, no component CSS, no PrimeNG"
