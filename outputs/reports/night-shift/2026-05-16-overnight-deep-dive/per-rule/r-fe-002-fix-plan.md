---
ruleId: R-FE-002
ruleName: No SCSS, no component CSS, no styles array
severity: must
violationCount: 21
estimatedEffort: large
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

`apps/**` and `libs/**` must contain zero `.scss/.sass/.less` files (outside `libs/falcon-ui-core/**` and `libs/falcon/src/theme/**`) and zero non-empty `styleUrls:` / `styles:` arrays — all styling flows through the canonical Tailwind v4 `@theme` SSOT and utility classes on templates.

## 2. What we found (counts + top 5 offender files)

Structural sweep on `C:\Falcon\Falcon\falcon-web-platform-ui` (exemptions applied):

| Location | SCSS/SASS/LESS files |
|---|---|
| `apps/admin-console/` | 1 (`src/styles.scss`) |
| `apps/host-shell/` | 11 |
| `apps/management-console/` | 1 (`src/styles.scss`) |
| `libs/` (excluding `falcon-ui-core` + `falcon/src/theme`) | 8 |
| **TOTAL** | **21** |

Top 5 offender files (by impact and size — these are also the R-FE-001 styleUrls hits):

1. `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.scss` — central tree primitive consumed by `<app-organization-hierarchy-tree>` wrapper
2. `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.scss` — consumed by Add Client / Add User wizard steps
3. `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.scss` — used across wizard forms
4. `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` — auth chrome
5. `apps/host-shell/src/app/layout/layout.component.scss` — app shell

The two `apps/*/src/styles.scss` files are app-level entries — they typically `@import` Tailwind + `@import "@falcon/theme"`; if they ONLY do that, rename to `styles.css`. If they declare additional rules, those rules must move into the canonical theme.

Per-app distribution:
- admin-console: 1 SCSS file (clean except entry)
- host-shell: 11 SCSS files (auth flows + layout chrome — the bulk of work)
- management-console: 1 SCSS file (clean except entry)
- libs/falcon/src/shared-ui: 8 SCSS files (Angular wrappers around Stencil — high-traffic primitives)

## 3. Why this matters (the architectural cost of leaving it)

The V0.2 theme (adopted 2026-05-07 per `feedback_v02_theme_adopted`) made the Tailwind v4 `@theme` block at `libs/falcon/src/theme/falcon.theme.css` the SINGLE source of truth for every design value. Each SCSS file is a parallel theming surface: a rule that says `padding: 12px` in `falcon-tree-panel.component.scss` will NOT update when the Theme Studio (active build) shifts the spacing scale.

The 8 lib SCSS files are especially damaging because they fragment the Falcon UI Core promise: "Shadow + Tailwind variant + tokens.css per component". A wrapper component that imports a SCSS sidecar bypasses both Shadow and tokens.css, leaving the Tailwind path unable to mirror it. This is the exact trap documented in `feedback_shadow_is_token_ssot`.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Categorize the 21 files.** Run:
  ```
  Get-ChildItem -Recurse -Include *.scss,*.sass,*.less -File C:\Falcon\Falcon\falcon-web-platform-ui\apps,C:\Falcon\Falcon\falcon-web-platform-ui\libs |
    Where-Object { $_.FullName -notmatch '(node_modules|dist|falcon-ui-core|falcon\\src\\theme)' } |
    ForEach-Object { "$($_.FullName)|$((Get-Content $_.FullName).Count) lines" }
  ```
  Sort by line count — the small ones (<20 lines, mostly `:host { display: block }`) get the trivial Tailwind-class swap; the large ones (>80 lines, auth flows) need section-by-section translation.

- **Step 2 — Handle the two `styles.scss` entries first.**
  Open `apps/admin-console/src/styles.scss` and `apps/management-console/src/styles.scss`. If they contain only `@import` directives → rename to `styles.css`, update `angular.json` / `project.json` `styles[]` entry. If they contain additional rules → move every rule into `libs/falcon/src/theme/falcon.theme.css` `@theme` block (token names per Noor convention), then rename to `.css`.

- **Step 3 — Handle each lib SCSS file.** For each of the 8 in `libs/falcon/src/shared-ui/lib/components/`:
  1. Read the SCSS.
  2. For every rule, decide: token (promote to `falcon.theme.css`), layout (express as Tailwind utility on template), or one-off color (promote to per-component `<name>.tokens.css` and reference via `var(--falcon-<name>-*)`).
  3. Delete the SCSS file.
  4. Remove the `styleUrls: ['./<name>.component.scss']` entry from the Angular wrapper `.ts`.
  5. Run `nx build falcon-ui-core` + the apps that consume the component (typically host-shell + admin-console).

- **Step 4 — Handle the 11 host-shell SCSS files.** They split into:
  - Auth flow (5 files: `change-password`, `enter-otp`, `forgot-password-flow`, `get-started`, `login-layout`) — pages have rich visual chrome. Translate carefully; check against Falcon Eyes baseline if available.
  - Layout chrome (3 files: `layout`, `sidebar`, `topbar`) — shell ownership per R-NOOR-001 implications. Translate while preserving exact sticky/fixed semantics.
  - Misc (3 files: `dashboard`, `not-found`, plus whatever 11th file is). Smaller, simpler.

- **Step 5 — Handle `styles: [...]` arrays (10 hits from R-FE-001 audit).** Most are 1-line `:host { display: block }`. Replace with `class="block"` on the host or wrap; delete the `styles` entry.

- **Step 6 — Run full build matrix.**
  ```
  UV_THREADPOOL_SIZE=128 npx nx build falcon-ui-core
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build management-console --configuration=development
  ```
  All four exit 0 before any commit.

- **Step 7 — Re-run detector.** Expected: 0 SCSS files outside exemption paths, 0 non-empty `styleUrls`/`styles` arrays.

## 5. Estimated effort + complexity rationale

**large** — 21 files, half of which are non-trivial (auth flow + layout chrome). Each lib SCSS file requires understanding what tokens exist before translating, which may discover gaps in the canonical theme that need promotion (R-NOOR-002). Realistic estimate: 1–1.5 days for one focused agent, with the auth flow being the riskiest section (visual regressions are user-facing).

## 6. Rollback hint (how to undo if the fix is wrong)

For each file removed: `git checkout HEAD -- <path>.scss <path>.component.ts` restores both the SCSS and the decorator wiring. If a global visual regression appears across all 3 apps, the most likely cause is a missing token in `falcon.theme.css` — restore the SCSS file as a temporary fix and file the missing token as a R-NOOR-002 promotion ticket.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  Get-ChildItem -Recurse -Include *.scss,*.sass,*.less -File C:\Falcon\Falcon\falcon-web-platform-ui\apps,C:\Falcon\Falcon\falcon-web-platform-ui\libs |
    Where-Object { $_.FullName -notmatch '(node_modules|dist|falcon-ui-core|falcon\\src\\theme)' } |
    Measure-Object | Select-Object -ExpandProperty Count
  
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  $env:UV_THREADPOOL_SIZE=128; npx nx run-many --target=build --projects=host-shell,admin-console,management-console,falcon-ui-core --configuration=development
  ```
- expected output:
  - File count: `0`
  - `nx run-many`: all 4 projects exit 0

## 8. Risk flags (anything that could break)

- **Auth flow regression risk is real.** The login chrome has visual polish that the SCSS encodes (gradients, glass-morphism in some flows). Conservative agents should translate one auth file at a time and ask the user to validate visually before continuing.
- **Tree-panel + photo-uploader are deep in the Add Client/Add User wizards.** A regression here breaks the org-hierarchy workstream documented in `project_org_hierarchy_tree_shared_component` and `project_react_to_angular_org_hierarchy_page`.
- **`:host { display: block }` removal** without replacing with `class="block"` collapses the layout (Stencil `shadow:false` host defaults to inline — see memory `project_falcon_ui_core_layout_traps` trap #1).
- **Don't delete `styles.scss` blindly.** Check `angular.json` / `project.json` for the `styles[]` array entry and update the path to `.css` BEFORE rename or the app fails to bootstrap.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-001** — same files, same decorators; do both passes together
- **R-FE-003** — once SCSS is gone, watch for inline-style migration leaks
- **R-FE-004** — every Tailwind utility introduced during translation must use Falcon tokens
- **R-NOOR-002** — every novel value found inside SCSS must be promoted to the canonical theme first
- **R-NOOR-008** — SCSS files likely contain `body { ... }` / `:host { ... }` global selectors — those need re-routing per Noor hygiene
- **R-FE-012** — build must stay green after each deletion
