---
title: Front-End Rules Digest — Night Shift 2026-05-16
sources: 11 documents (8 read + 3 unavailable on disk)
total_rules: 38
sources_read:
  - C:\Falcon\Brain SK\CLAUDE.md
  - C:\Falcon\falcon-wiki\Conventions.md
  - C:\Falcon\falcon-wiki\00-MOCs\AI-Agent-Onboarding.md
  - C:\Users\User\.claude\skills\FrontEnd\best-practices\SKILL.md  (Angular v20+ best practices — proxies for the missing official-angular-skill)
  - C:\Falcon\Brain SK\skills\frontend-master-router\SKILL.md
  - C:\Falcon\Brain SK\skills\legacy-v7\61-falcon-react-to-angular-rage-mode\SKILL.md
  - C:\Falcon\Brain SK\skills\legacy-v7\62-rage-html-to-falcon-angular\SKILL.md
  - C:\Falcon\Brain SK\skills\legacy-v7\67-falcon-bundle-performance-architect\SKILL.md
  - C:\Falcon\Brain SK\protocols\legacy-v7\TAILWIND_FIRST_UI_RULES.md  (legacy — superseded by current memory rules)
  - C:\Falcon\Falcon\falcon-web-platform-ui\WAVE-10-GOVERNANCE-GATES.md
  - C:\Falcon\CLAUDE.md (Falcon platform root)
  - MEMORY.md feedback rules (loaded as session context)
sources_not_found_at_expected_paths:
  - C:\Falcon\brain-skills\Front-End-skills\angular-tailwind-skill\Skill.md  (folder does not exist on disk)
  - C:\Falcon\brain-skills\Front-End-skills\noor-instructions-skill\Skill.md  (folder does not exist on disk — content captured from C:\Falcon\CLAUDE.md and MEMORY.md `feedback_noor_instructions` index entry)
  - C:\Falcon\brain-skills\Front-End-skills\official-angular-skill\Skill.md  (substituted with FrontEnd\best-practices\SKILL.md which carries the equivalent Angular v20+ rules)
  - C:\Falcon\brain-skills\Front-End-skills\nx-workspace-skill\Skill.md  (folder does not exist on disk — Nx rules captured from RAGE MODE skill + legacy ANGULAR_NX_PRIMENG_FRONTEND_RULES.md + CLAUDE.md memory entries)
  - C:\Falcon\brain-skills\Front-End-skills\polish-skill\Skill.md  (folder does not exist on disk — heuristics captured from MEMORY.md `reference_design_polish_skills` index entry)
  - C:\Falcon\brain-skills\Front-End-skills\emil-design-eng-skill\Skill.md  (folder does not exist on disk — captured from MEMORY.md `reference_design_polish_skills` index entry)
  - C:\Falcon\Falcon\falcon-web-platform-ui\CLAUDE.md  (does not exist; workspace points to AGENTS.md instead)
note_on_missing_skills: |
  The `C:\Falcon\brain-skills\Front-End-skills\` tree referenced in the platform CLAUDE.md
  and MEMORY.md is an aspirational/planned state — only `code-skills/` exists on disk
  today. The rules normally carried by those skills have been captured from their
  authoritative shadow locations: (a) Brain SK legacy-v7 skills that still encode the
  same Falcon front-end doctrine, (b) the MEMORY.md feedback entries which are the
  current canonical rule statements, and (c) Wave 10 governance gates which encode
  the live CI enforcement. Where a rule appears in multiple sources the strictest
  formulation is preserved with all attributions listed.
---

# Front-End Rules Digest

## Rule schema

Each rule has:
- **ID** — `R-<NN>`
- **Title**
- **Severity** — P0 (build-blocking) / P1 (correctness) / P2 (cleanliness)
- **Source(s)** — every doc + memory entry where the rule appears
- **Rule** — verbatim quote or close paraphrase, strictest formulation when sources disagree
- **Audit heuristic** — exact ripgrep / pattern to detect a violation in code
- **Fix class** — `auto-replace` / `manual refactor` / `flag-only GAP`

Sources are tagged with short codes:
- `[BRAIN-SK]` — Brain SK CLAUDE.md governance
- `[WIKI]` — falcon-wiki Conventions / AI-Agent-Onboarding
- `[NG-BEST]` — FrontEnd best-practices SKILL (Angular v20+)
- `[RAGE-R2A]` — legacy-v7 React-to-Angular RAGE MODE skill
- `[RAGE-H2A]` — legacy-v7 Rage HTML to Falcon Angular skill
- `[PERF]` — legacy-v7 Falcon Bundle Performance Architect
- `[GATES]` — Wave 10 Governance Gates (live CI)
- `[MEM]` — MEMORY.md feedback index entries
- `[CLAUDE-MD]` — Falcon platform-root CLAUDE.md
- `[LEGACY-TW]` — TAILWIND_FIRST_UI_RULES.md (legacy — superseded; included only for divergence audit)

When sources disagree, the **stricter** rule wins and the conflict is noted. Tailwind/SCSS/PrimeNG conflicts always resolve in favor of the current 2026-05 memory rules over the 2024-era legacy v7 docs.

---

## P0 — Build-blocking rules

These rules will fail the build, fail CI gates, or fail Brain SK gates. Any audit must surface every violation; the fixers' work plan must include every P0.

### R-01 — No PrimeNG / PrimeIcons / Aura — ZERO tolerance

- **Severity:** P0
- **Sources:** `[MEM]:project_falcon_primeng_total_removal_complete`, `[MEM]:project_brain_skills_primeng_purge`, `[GATES]:Gate 01 ESLint allowlist`
- **Rule:** Zero imports from `primeng/*`, zero `<p-*>` template tags, zero `pi pi-*` icon classes, zero references to `aura-*` themes or `primeicons` packages. All 7 PrimeNG packages physically uninstalled (Wave PR-8, 2026-05-10). ESLint flat-block live-fires on any reintroduction. Falcon icon font replaces all 122 former `pi pi-*` usages.
- **Audit heuristic:**
  ```
  rg -n "from ['\"]primeng/" --type ts --type html
  rg -n "<p-[a-z]" --type html
  rg -n "class=['\"][^'\"]*\bpi pi-" --type html --type ts
  rg -n "primeicons|aura-" --type ts --type html --type css
  rg -n "PrimeNGModule|@primeng" --type ts
  ```
- **Fix class:** flag-only GAP (replacement requires Falcon equivalent or new component build).

### R-02 — No SCSS, no component CSS, no `styleUrls`, no inline `style=""`

- **Severity:** P0
- **Sources:** `[MEM]:project_brain_skills_primeng_purge`, `[MEM]:feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05), `[MEM]:feedback_shadow_is_token_ssot`, `[CLAUDE-MD]`
- **Rule:** Tailwind utilities only — no SCSS files, no `styles:` / `styleUrl:` / `styleUrls:` on Angular components, no `style="..."` attributes in templates. The canonical theme entry (Tailwind v4 `@theme` in `libs/falcon/src/theme/falcon.theme.css`) is the SOLE CSS file allowed. Stencil Shadow + per-component `<name>.tokens.css` are SSOT for Falcon UI Core components; the Tailwind variant must mirror the same tokens.
- **Audit heuristic:**
  ```
  rg -n "styleUrl[s]?:" --type ts --glob '!node_modules' --glob '!dist'
  rg -n "styles:\s*\[" --type ts --glob '!node_modules' --glob '!dist'
  rg -n " style=\"" --type html --glob '!node_modules' --glob '!dist'
  rg --files -g '*.scss' --glob '!node_modules' --glob '!dist'
  rg -n "\.scss['\"]" --type ts --type html
  ```
- **Fix class:** manual refactor (move declarations to Tailwind utilities + `falcon.theme.css` tokens).

### R-03 — No hardcoded colors / spacing / radii / shadows / fonts — tokens only

- **Severity:** P0
- **Sources:** `[MEM]:feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05 — pre-finish grep gate codified in 4 skill files), `[MEM]:feedback_shadow_is_token_ssot`, `[GATES]:Gate 07 token-naming-lint`, `[GATES]:Gate 08 hardcoded-value-lint`, `[RAGE-R2A]:Styling Rule`
- **Rule:** No raw hex `#RRGGBB`, no standalone `px`/`rem` literals for design values, no raw `rgba(`, no raw font sizes/families, no raw shadow values, no raw border-radius values — all design values reference `var(--falcon-*)` tokens. Allowed exception: hex inside a `var()` fallback (`var(--token, #fallback)`). Tailwind arbitrary values `[#hex]` / `[12px]` / `[2px_4px_8px]` are forbidden unless they reference a token. Existing 1053 grandfathered violations: CI only blocks **new** ones (Gate 08); the audit must still surface all 1053 as REMEDIATION work.
- **Audit heuristic:**
  ```
  rg -n "#[0-9a-fA-F]{3,8}\b" --type html --type ts --type css --glob '!node_modules' --glob '!dist'
  rg -n "rgba?\(" --type html --type ts --type css --glob '!node_modules' --glob '!dist'
  rg -n "\[#[0-9a-fA-F]" --type html --type ts                           # Tailwind arbitrary hex
  rg -n "\[\d+px\]" --type html --type ts                                # Tailwind arbitrary px
  rg -n "font-family\s*:" --type css --type ts --type html
  rg -n "box-shadow\s*:" --type css --type ts
  rg -n "border-radius\s*:" --type css --type ts
  ```
  Cross-reference each finding against the token registry (`02-token-registry-quick-grep.txt`).
- **Fix class:** auto-replace where there is a direct token equivalent; manual refactor otherwise.

### R-04 — No hardcoded `z-index` — use the canonical overlay ladder

- **Severity:** P0
- **Sources:** `[MEM]:project_zindex_calendar_portal_root_cause_fix` (LANDED 2026-05-16)
- **Rule:** No hand-typed numeric `z-index` values anywhere. All overlay/portal stacking uses the canonical ladder defined in `overlay.tokens.css`. Current tier order: **toast 1300 > drawer/dialog 1200 > overlay 1100→1400 (popovers)**. Tailwind `z-[<number>]` arbitrary values are forbidden. Read this memory entry BEFORE patching any z-index or popover positioning bug.
- **Audit heuristic:**
  ```
  rg -n "z-index\s*:\s*\d" --type css --type ts --type html --glob '!node_modules' --glob '!overlay.tokens.css'
  rg -n "z-\[\d" --type html --type ts --glob '!node_modules'
  rg -n "style=['\"][^'\"]*z-index" --type html
  ```
- **Fix class:** manual refactor (route through overlay tokens).

### R-05 — Build must be GREEN — no phase ships red

- **Severity:** P0
- **Sources:** `[MEM]:feedback_always_build_zero_errors`, `[MEM]:feedback_build_must_be_green` (HARDENED 2026-05-08), `[GATES]:Gates 01–11`
- **Rule:** After non-trivial code changes, run `nx build <app>` and fix every error. No phase / wave / PR ships with red builds. Orchestrator dispatches a focused fix agent immediately on any `nx build` error. Standing exemption: known length-typehints warnings. CI gates 01–11 must all be GREEN locally before commit. Bundle budget Gate 11: `admin-console` `main.js` gzipped **< 340 KB** (current baseline ~335 KB, 5 KB headroom).
- **Audit heuristic:**
  ```
  npx nx build admin-console
  npx nx build host-shell
  npx nx build management-console
  npm run gate:all
  ```
  Surface every non-warning compiler/linter error as a P0 audit hit.
- **Fix class:** manual refactor — every error must be fixed.

### R-06 — Noor naming for tokens and component tags

- **Severity:** P0
- **Sources:** `[GATES]:Gate 07 token-naming-lint`, `[GATES]:Gate 10 noor-naming-lint`, `[MEM]:project_token_unification_plan`, `[MEM]:feedback_noor_instructions`
- **Rule:** No CSS custom property may be named `--falcon-color-blue-*` or `--falcon-color-gray-*` — they MUST be `--falcon-{family}-{shade}` (e.g. `--falcon-teal-500`, `--falcon-neutral-200`). All `libs/falcon-ui-*/package.json` `name` fields start with `@falcon/`. All `@Component({ tag: '...' })` declarations match `falcon-[a-z][a-z0-9-]*`. Noor naming = **palette over intent** for color names inside Admin Console scope — overrides the older "semantic intent name" practice (forward-only; no migration of existing semantic tokens).
- **Audit heuristic:**
  ```
  rg -n "--falcon-color-(blue|gray|red|green|yellow|purple|orange|pink|teal|cyan|indigo)-\d" --type css
  rg -n "tag:\s*['\"][A-Z]" --type ts                          # uppercase in tag — fail
  rg -n "tag:\s*['\"][a-z]+_" --type ts                        # underscore in tag — fail
  rg -n '"name":\s*"(?!@falcon/)' libs/falcon-ui-*/package.json
  ```
- **Fix class:** auto-replace (rename) for token-naming; manual refactor for tag/package name violations.

---

## P1 — Correctness rules

These rules can be merged without breaking the build but produce wrong, fragile, or non-conformant code. Every P1 violation must be in the audit backlog.

### R-07 — Falcon library FIRST — strict customization order

- **Severity:** P1
- **Sources:** `[MEM]:feedback_falcon_custom_library_mandatory` (ABSOLUTE STANDING RULE 2026-05-15), `[RAGE-R2A]:Falcon Component Mapping Rule`, `[RAGE-H2A]:Hard Rule`, `[BRAIN-SK]:Canonical Frontend Knowledge Path`
- **Rule:** Every UI task in every session: Falcon library FIRST. Read `Brain Outputs/understanding/frontend/components/<name>/{API,USAGE,TOKENS,GAPS,DECISION}.md` BEFORE any markup. Strict customization order:
  1. **Inputs** to existing Falcon component
  2. **Templates / ng-content** projection
  3. **Slots**
  4. **Variants** of existing component
  5. **Upgrade** the existing component
  6. **New library component** if no existing one fits
  7. **App-level wrapper** around library skeleton
  8. **Raw HTML as a flagged GAP** — last resort only

  Do not create new generic Angular components if a Falcon component already solves the problem. Do not duplicate table, dropdown, input, modal, stepper, card, icon, or button components.
- **Audit heuristic:**
  ```
  # raw inputs/buttons/dropdowns where falcon-* should be:
  rg -n "<input(\s|>)" --type html --glob '!libs/falcon-ui-core/**'
  rg -n "<button(\s|>)(?!.*falcon-)" --type html --glob '!libs/falcon-ui-core/**'
  rg -n "<select(\s|>)" --type html --glob '!libs/falcon-ui-core/**'
  rg -n "<table(\s|>)" --type html --glob '!libs/falcon-ui-core/**'
  rg -n "<dialog(\s|>)" --type html
  # raw form controls outside the library:
  rg -n "<textarea(\s|>)" --type html --glob '!libs/falcon-ui-core/**'
  ```
  Cross-check against the per-component dossier registry under `understanding/frontend/components/`.
- **Fix class:** manual refactor (each violation needs a per-section compliance table per the standing rule).

### R-08 — Library skeleton vs app wrapper pattern — TWO LAYERS

- **Severity:** P1
- **Sources:** `[MEM]:feedback_library_skeleton_app_api` (ABSOLUTE STANDING RULE 2026-05-15 Wave 16), `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6
- **Rule:** Two layers per component:
  1. **Library skeleton** in `libs/falcon-ui-core/` — pure presentational, no service injection
  2. **App-level wrapper** in `apps/<app>/src/app/shared-components/<name>/` — uses skeleton as a tag, injects backend services, owns API flow

  Consumers import the wrapper via `@host-shell/shared/*` TS path alias. Reference pair: `<falcon-angular-insufficient-balance-dialog>` (skeleton) ↔ `<app-do-payment-priority-popup>` (wrapper). Library skeletons MUST NOT inject `HttpClient`, services, stores, Zitadel, or any business facade.
- **Audit heuristic:**
  ```
  # business injection inside a library skeleton:
  rg -n "inject\s*\(\s*[A-Z]\w*(Service|Facade|Store|Repository|Client)\b" libs/falcon-ui-core/
  rg -n "HttpClient" libs/falcon-ui-core/
  # missing wrapper (raw skeleton consumed by feature page):
  rg -n "<falcon-angular-" apps/*/src/app/features/
  ```
- **Fix class:** manual refactor.

### R-09 — Angular 21 idioms — signals, computed, control flow, zoneless safe

- **Severity:** P1
- **Sources:** `[NG-BEST]`, `[MEM]:project_falcon_revamp_v3_1_night_shift_results` (Angular 21.2.9 + zoneless), `[CLAUDE-MD]`
- **Rule:**
  - Standalone components only (do NOT set `standalone: true` — it's the default in Angular v20+).
  - Use **signals** for state; **`computed()`** for derived state; **`input()`** + **`output()`** functions (not decorators); **`model()`** inputs for 2-way bindings.
  - Use native control flow: `@if` / `@for` / `@switch`. No `*ngIf`, `*ngFor`, `*ngSwitch`.
  - Set `changeDetection: ChangeDetectionStrategy.OnPush`.
  - Use `inject()` instead of constructor injection.
  - Do NOT use `@HostBinding` / `@HostListener` — use the `host:` object instead.
  - Do NOT use `ngClass` — use `class` bindings. Do NOT use `ngStyle` — use `style` bindings (subject to R-02 inline-style rule for SVG/calculated attributes only).
  - Reactive forms over template-driven.
  - **Zoneless safe** — no `Zone`-dependent patterns; no `NgZone.runOutsideAngular` workarounds; no `zone.js` imports.
  - Do NOT use `mutate` on signals — use `update` or `set`.
- **Audit heuristic:**
  ```
  rg -n "\*ngIf|\*ngFor|\*ngSwitch" --type html
  rg -n "standalone:\s*true" --type ts
  rg -n "@HostBinding|@HostListener" --type ts
  rg -n "\[ngClass\]|\[ngStyle\]" --type html
  rg -n "\.mutate\(" --type ts
  rg -n "from\s+['\"]zone\.js" --type ts
  rg -n "NgZone\.runOutsideAngular|NgZone " --type ts
  rg -n "constructor\s*\(\s*(private|public|protected)\s+\w+:\s*\w+Service" --type ts
  rg -n "@Input\(|@Output\(" --type ts
  ```
- **Fix class:** auto-replace for control flow + decorators-to-functions; manual refactor for zone-dependent patterns.

### R-10 — Folder structure — one file per type-folder

- **Severity:** P1
- **Sources:** `[MEM]:feedback_folder_structure_pattern`
- **Rule:** Every feature uses **one file per type-folder** holding all classes/interfaces of that type:
  - `models/models.ts`
  - `services/services.ts`
  - `resolvers/resolvers.ts`
  - `directives/directives.ts`

  NOT `models/user.model.ts` + `models/account.model.ts` — ONE `models.ts` per feature, plural.
- **Audit heuristic:**
  ```
  fd -e ts . --no-ignore -E node_modules -E dist | rg "(models|services|resolvers|directives)/" | rg -v "/(models|services|resolvers|directives)\.ts$"
  ```
  Or PowerShell:
  ```powershell
  Get-ChildItem -Recurse -Filter "*.ts" -Path "apps","libs" |
    Where-Object { $_.Directory.Name -in 'models','services','resolvers','directives' -and $_.Name -ne "$($_.Directory.Name).ts" }
  ```
- **Fix class:** manual refactor.

### R-11 — Tailwind grid FIRST — flex only for small inline alignment

- **Severity:** P1
- **Sources:** `[MEM]:feedback_tailwind_grid_first`, `[LEGACY-TW]:Grid system rule` (legacy doc agrees on grid-first; the SCSS-fallback gate in that doc is SUPERSEDED by R-02)
- **Rule:** Tailwind CSS Grid is the **default** layout primitive: `grid`, `grid-cols-*`, `col-span-*`, `gap-*`, `grid-rows-*`, responsive variants. Flexbox is reserved for **small inline alignment** only (icon + label, button content, badge groups). Do not introduce a competing grid system. Do not use raw CSS Grid in `<style>` blocks (forbidden by R-02 anyway).
- **Audit heuristic:**
  ```
  # large flex layouts where grid would be cleaner:
  rg -n "class=['\"][^'\"]*\bflex\b[^'\"]*\bflex-(col|row)\b[^'\"]*\bgap-" --type html
  # PrimeFlex residue (also caught by R-01):
  rg -n "class=['\"][^'\"]*\b(p-grid|p-col|p-d-flex|p-jc-|p-ai-)" --type html
  ```
  Manual review — this rule is heuristic; the audit flags candidates, designers/devs pick which to migrate.
- **Fix class:** flag-only GAP (judgment-driven refactor).

### R-12 — Native HTML control = GAP unless library lacks equivalent

- **Severity:** P1
- **Sources:** `[RAGE-H2A]:Hard Rule`, `[RAGE-R2A]:Falcon Component Mapping Rule`, `[MEM]:feedback_falcon_custom_library_mandatory`
- **Rule:** No raw `<input>`, `<button>`, `<select>`, `<textarea>`, `<form>` outside the library when a Falcon equivalent exists. Mapping:
  - `<input type="text">` → `<falcon-input>` / `<falcon-input-tw>`
  - `<button>` → `<falcon-button>`
  - `<select>` → `<falcon-dropdown>`
  - `<textarea>` → `<falcon-textarea>`
  - `<input type="checkbox">` → `<falcon-checkbox>`
  - `<input type="radio">` → `<falcon-radio>`
  - `<input type="date">` → `<falcon-date-picker>`
  - `<table>` → `<falcon-data-table>` / `<falcon-tree-table>`
  - `<dialog>` → `<falcon-dialog>` / `<falcon-drawer>`
  - `<form>` (raw) → Angular reactive form bound to Falcon controls

  Raw control is allowed ONLY when the Falcon library has a documented GAP for that input type — in which case the violation is logged as a GAP, not a fix.
- **Audit heuristic:** see R-07 audit heuristic (same query covers both rules).
- **Fix class:** manual refactor or flag-only GAP (when library lacks equivalent).

### R-13 — Auth: Frontend NEVER calls Zitadel directly

- **Severity:** P1
- **Sources:** `[MEM]:feedback_frontend_auth_identity_service`
- **Rule:** Frontend NEVER calls Zitadel directly. All auth (login, OTP, password reset, session refresh, user info) routes through Identity Service at `auth.falconhub.space/api/`. JWT issuance and validation are server-side. No Zitadel SDK imports on the frontend.
- **Audit heuristic:**
  ```
  rg -n "zitadel\.com|@zitadel/" --type ts --type html --glob '!node_modules'
  rg -n "zitadel\.|/zitadel/" --type ts --glob '!node_modules'
  ```
- **Fix class:** manual refactor (route through Identity Service).

### R-14 — Single workspace path

- **Severity:** P1
- **Sources:** `[MEM]:feedback_webstorm_duplicate_workspace` (ABSOLUTE RULE), `[MEM]:feedback_discard_old_ui`
- **Rule:** Falcon work happens at `C:\Falcon\falcon-web-platform-ui` and `C:\Falcon\Falcon\falcon-web-platform-ui` ONLY (the workspace tree currently). Never read, edit, sync to, or run from `WebstormProjects\falcon-web-platform-ui`. Exclude `falcon-web-platform-ui-old` and `deprecated-falcon-web-platform-ui` from all operations.
- **Audit heuristic:**
  ```
  # paths in code/config referring to disallowed workspaces:
  rg -n "WebstormProjects[\\\\/]falcon-web-platform-ui" --glob '!node_modules'
  rg -n "falcon-web-platform-ui-old|deprecated-falcon-web-platform-ui" --glob '!node_modules'
  ```
- **Fix class:** auto-replace (rewrite paths) or flag-only GAP.

### R-15 — Multi-language strings — MultiLanguageName(En, Ar)

- **Severity:** P1
- **Sources:** `[CLAUDE-MD]:Platform Standards`, `[MEM]:project_org_hierarchy_html_conversion`, `[MEM]:project_react_to_angular_org_hierarchy_page`
- **Rule:** Every user-facing text uses `MultiLanguageName(En, Ar)` model on the data side and the i18n translation pipeline on the UI side. No hardcoded English strings in templates for user-facing copy. All buttons / labels / placeholders / error messages translate. RTL must work: use logical CSS properties (`start`/`end`/`inline-start`/`inline-end`/`ps-*`/`pe-*`/`ms-*`/`me-*`), never `left`/`right`/`pl-*`/`pr-*`/`ml-*`/`mr-*` for directional layout.
- **Audit heuristic:**
  ```
  # English strings in templates (heuristic — many false positives, audit by section):
  rg -n ">[A-Z][A-Za-z ]{3,}<" --type html | rg -v "i18n|translate|\\$\\{"
  # left/right anti-pattern in Tailwind:
  rg -n "class=['\"][^'\"]*\\b(pl-|pr-|ml-|mr-|left-|right-)\\d" --type html
  # absolute side properties in raw CSS (already forbidden by R-02 but double-check):
  rg -n "(margin|padding|border)-(left|right)" --type ts --type html --type css
  ```
- **Fix class:** manual refactor.

### R-16 — A11y baseline — every new Falcon component has role/aria-*

- **Severity:** P1
- **Sources:** `[GATES]:Gate 09 a11y-baseline`, `[NG-BEST]:Accessibility Requirements`, `libs/falcon-ui-core/A11Y-BASELINE.md`
- **Rule:** Every newly added `falcon-*.tsx` component must contain at least one `role=` or `aria-*` attribute. Components must pass all AXE checks and follow WCAG AA minimums (focus management, color contrast 4.5:1+, ARIA attributes). Six components grandfathered (`-tw` Light DOM variants + `falcon-grid-input`) — Wave 4 audit listed them; no new exemptions allowed.
- **Audit heuristic:**
  ```
  # for any new component, ensure role/aria-* present:
  rg -L "(role=|aria-[a-z]+=)" libs/falcon-ui-core/src/components/*/falcon-*.tsx
  # contrast / color-only signaling (manual review):
  rg -n "(text-red|text-green|text-yellow)-(500|600|700)" --type html  # signaling by color alone — suspect
  ```
  Run AXE via `npm run gate:a11y-baseline`.
- **Fix class:** manual refactor.

### R-17 — Token reality — no orphan tokens, no missing references

- **Severity:** P1
- **Sources:** `[GATES]:Gate 06 build:falcon-ui-tokens`, `[MEM]:project_token_unification_plan`, `[MEM]:project_falcon_final_mission_token_audit`
- **Rule:** Every `var(--falcon-*)` reference must resolve to a defined token in `falcon-tailwind-tokens.css` / `falcon-ui-tokens` / per-component `.tokens.css`. Every defined token should be consumed somewhere (orphan tokens flagged for cleanup). Token registry is generated by `scripts/build-token-registry.mjs`. Strict semantic-first mapping — no value-only matching; sizing-vs-spacing distinction enforced.
- **Audit heuristic:**
  ```
  # extract every var() reference:
  rg -n -o "var\(--falcon-[a-z0-9-]+\)" --type css --type ts --type html | sort -u > tokens-used.txt
  # cross-ref against 02-token-registry-quick-grep.txt
  diff <(sort tokens-used.txt) <(sort 02-token-registry-quick-grep.txt)
  ```
- **Fix class:** auto-replace where token rename solves it; manual refactor or flag-only GAP otherwise.

### R-18 — Brain SK governance — read playbook before implementing

- **Severity:** P1
- **Sources:** `[BRAIN-SK]:Learning-First Task Routing`, `[BRAIN-SK]:Flow Playbooks Are the Implementation Spec`, `[CLAUDE-MD]:Brain SK — Implementation Source of Truth`
- **Rule:** Before producing any code, plan, or fix for a Falcon page-level user action, load:
  1. `C:\Falcon\Brain SK\CLAUDE.md` (governance)
  2. `C:\Falcon\Brain SK\_obsidian\00-Home\IMPLEMENTATION_KNOWLEDGE_MAP.md`
  3. The flow playbook for the user action (folder form preferred, e.g. `Brain Outputs\understanding\pages\organization-hierarchy\Add Client\README.md`)
  4. The 12 page artifacts (PAGE_LEARNING, pending+approved patterns, global patterns, component knowledge, Falcon Eyes, UI/UX / Validation / API / Business rules, Gaps, Evidence, Page Scorecard)

  A session has not loaded enough context until it can answer the 8 verification questions in `IMPLEMENTATION_KNOWLEDGE_MAP.md`. The playbook IS the spec — drill deeper only when the playbook surfaces a gap.
- **Audit heuristic:** procedural — verify any commit/PR introducing a page implementation references the playbook in commit message or PR body.
- **Fix class:** manual refactor (re-do implementation with playbook grounding).

### R-19 — No app→app imports, libs→apps imports, public-API only

- **Severity:** P1
- **Sources:** `[PERF]:Nx boundary`, legacy ANGULAR_NX_PRIMENG_FRONTEND_RULES (Nx boundary rules section, the SCSS/PrimeNG parts of that doc are SUPERSEDED)
- **Rule:**
  - Apps must NOT be imported by libraries.
  - Apps should NOT import internals of other apps.
  - Shared code goes to libraries under `libs/falcon/...`.
  - Respect Nx tags and dependency constraints.
  - Import from public APIs (barrel files) — not deep `src/internal/*` paths.
  - Do not weaken lint boundaries just to make an import work.
- **Audit heuristic:**
  ```
  # imports from another app:
  rg -n "from\s+['\"]apps/" --type ts --glob '!node_modules'
  rg -n "from\s+['\"][\\./]*apps/[^/]+/src/" --type ts
  # deep-internal imports of @falcon/* libraries:
  rg -n "from\s+['\"]@falcon/[^'\"]+/src/" --type ts --type tsx
  ```
- **Fix class:** manual refactor.

### R-20 — Module Federation — do not break the shared config

- **Severity:** P1
- **Sources:** `[PERF]:Dangerous Changes`, `[MEM]:project_falcon_revamp_v3_1_night_shift_results` (RemoteManifestProvider abstraction)
- **Rule:**
  - Do not change Module Federation `shared` config blindly.
  - Do not move many dependencies between host and remotes.
  - Do not delete shared libraries.
  - Do not rewrite routing architecture for performance gains.
  - Do not change public APIs of shared libs.
  - When optimizing bundles, verify host + all remotes still load via `nx build` + serve.
- **Audit heuristic:**
  ```
  # files touched by a phase:
  git diff --name-only origin/main | rg "module-federation\.config\.|webpack\.config\.|project\.json"
  ```
  Procedural — any phase touching MF config requires explicit before/after bundle measurement.
- **Fix class:** flag-only GAP (requires human review).

### R-21 — No premature shared abstraction — start local, promote later

- **Severity:** P1
- **Sources:** `[RAGE-R2A]:No Over-Engineering Rule`, `[RAGE-R2A]:Architecture Placement Rule`, `[MEM]:feedback_clean_code_dry_minimal`
- **Rule:** Start local. Promote to shared libraries ONLY when reusable.
  - Single-screen logic → keep in `apps/<app>/src/app/features/<feature>/`
  - Reused across 2+ pages in same app → `apps/<app>/src/app/shared/`
  - Reused across apps → `libs/falcon/...`

  Do not create design-system components for one screen. Do not create generic render engines, dynamic config systems, or framework wrappers when plain Angular suffices.
- **Audit heuristic:** procedural; in code review, flag any new `libs/` addition that has only ONE consumer.
- **Fix class:** manual refactor (move back to local feature folder).

---

## P2 — Cleanliness rules

These rules produce code that works but is harder to maintain, harder to read, or duplicates effort. The audit must include every P2 hit but they can be fixed in lower-priority waves.

### R-22 — Comment style — terse `*** ... ***` banner, max 2 lines

- **Severity:** P2
- **Sources:** `[MEM]:feedback_comment_style`
- **Rule:** All non-trivial comments use a banner format: `// *** Short description ***` or `/* *** Description ***/`, max 2 lines. No verbose JSDoc. No `@param`/`@returns` blocks unless the function is part of a public API that consumers will discover via tooling.
- **Audit heuristic:**
  ```
  # multi-line JSDoc blocks:
  rg -nU "/\*\*[\s\S]{200,}?\*/" --type ts
  # @param / @returns:
  rg -n "@param|@returns\b" --type ts
  ```
- **Fix class:** auto-replace where simple (strip JSDoc, keep one-liner); manual refactor where comments describe non-obvious logic.

### R-23 — Clean code / DRY / minimal — no speculative abstractions

- **Severity:** P2
- **Sources:** `[MEM]:feedback_clean_code_dry_minimal`, `[RAGE-R2A]:No Over-Engineering Rule`
- **Rule:** Every task: minimum code, clean, DRY, idiomatic. No duplication. No speculative abstractions. No "we might need this later" interfaces. Avoid:
  - Unnecessary global state
  - Unnecessary services (when component state suffices)
  - Unnecessary generic render engines
  - Unnecessary dynamic config systems
  - Unnecessary wrappers / inheritance / RxJS complexity
  - Tiny components for the sake of splitting
  - Signals when plain component state is enough
- **Audit heuristic:** manual code-review pass — flag candidates programmatically with:
  ```
  # very small wrapper components (often speculative):
  rg -n -A 5 "@Component\(\{" --type ts | rg -B 1 "template:\s*['\"`]<[a-z-]+>\s*<ng-content"
  # services with one method:
  rg -nU "@Injectable\(\{[\s\S]+?\}\)\s+export\s+class\s+\w+\s*\{[\s\S]{0,300}?\}" --type ts
  ```
- **Fix class:** manual refactor.

### R-24 — Components small + single responsibility + OnPush

- **Severity:** P2
- **Sources:** `[NG-BEST]:Components`, `[RAGE-R2A]:Component structure rule`
- **Rule:**
  - Keep components small and focused on a single responsibility.
  - Prefer inline templates for small components.
  - Use `computed()` for derived state.
  - Set `changeDetection: ChangeDetectionStrategy.OnPush`.
  - When using external templates/styles, use paths relative to the component TS file.
  - Prefer Reactive forms over Template-driven forms.
- **Audit heuristic:**
  ```
  # components missing OnPush:
  rg -nL "ChangeDetectionStrategy\.OnPush" --type ts -g '*.component.ts'
  # very large component templates:
  fd -e html -e ts apps libs | while read f; do
    lines=$(wc -l < "$f")
    [ $lines -gt 400 ] && echo "$lines $f"
  done
  ```
- **Fix class:** manual refactor.

### R-25 — Services: providedIn:'root' + inject() + single responsibility

- **Severity:** P2
- **Sources:** `[NG-BEST]:Services`
- **Rule:**
  - Design services around a single responsibility.
  - Use `providedIn: 'root'` for singletons.
  - Use the `inject()` function inside the service body (constructor injection is a fallback only for legacy / decorator-cycle cases).
- **Audit heuristic:**
  ```
  rg -nL "providedIn:\s*['\"]root['\"]" --type ts -g '*.service.ts'
  # see R-09 audit heuristic for constructor-injection detection
  ```
- **Fix class:** auto-replace (`providedIn: 'root'`) where applicable; manual refactor for constructor → inject() migration.

### R-26 — TypeScript strictness — no `any`, prefer `unknown`

- **Severity:** P2
- **Sources:** `[NG-BEST]:TypeScript Best Practices`
- **Rule:**
  - Use strict type checking (`strict: true`).
  - Prefer type inference when the type is obvious — don't annotate trivially obvious types.
  - **Avoid `any`** — use `unknown` when the type is uncertain.
  - No `// @ts-ignore` / `// @ts-nocheck` / `as any` casts without a comment explaining why.
- **Audit heuristic:**
  ```
  rg -n ":\s*any\b|<any>|\bas any\b" --type ts --glob '!*.d.ts' --glob '!node_modules'
  rg -n "@ts-ignore|@ts-nocheck" --type ts
  ```
- **Fix class:** manual refactor.

### R-27 — `NgOptimizedImage` for static images

- **Severity:** P2
- **Sources:** `[NG-BEST]:Angular Best Practices`
- **Rule:** Use `NgOptimizedImage` for all static images. (`NgOptimizedImage` does not work for inline base64 images — those are exempt but should be rare).
- **Audit heuristic:**
  ```
  rg -n "<img\s+(?!.*ngSrc)" --type html
  rg -n "<img\s+src=" --type html
  ```
- **Fix class:** auto-replace (swap `src` for `ngSrc`, import directive).

### R-28 — Lazy loading for feature routes

- **Severity:** P2
- **Sources:** `[NG-BEST]:Angular Best Practices`, `[PERF]:Safe Optimization Areas`
- **Rule:** Implement lazy loading for feature routes — `loadComponent()` / `loadChildren()` everywhere except the shell's home route. No eager imports of feature modules.
- **Audit heuristic:**
  ```
  rg -n "component:\s*\w+Component" --type ts -g '**/*.routes.ts' -g '**/*-routing.module.ts'
  # eager feature component imports in routing files — these should be loadComponent
  ```
- **Fix class:** manual refactor.

### R-29 — Composition over duplication — Falcon component composition

- **Severity:** P2
- **Sources:** `[RAGE-R2A]:Composition Rule`, `[RAGE-R2A]:Table + Dropdown Composition Rule`
- **Rule:** Composed screens delegate UI parts to Falcon components:
  - Filters → `<falcon-dropdown>` / `<falcon-input>`
  - Cells → `<falcon-badge>` / `<falcon-chip>` / `<falcon-icon>`
  - Row actions → `<falcon-menu>` / `<falcon-button>`
  - Loading → `<falcon-skeleton>`
  - Empty state → Falcon empty-state pattern
  - Pagination → `<falcon-pagination>`

  Do not hardcode everything inside a giant table template. Do not create new table engines, dropdown engines, modal systems.
- **Audit heuristic:** procedural; flag components > 400 lines of HTML, or files with `<table>`/`<dialog>` and inline form/dropdown markup mixed.
- **Fix class:** manual refactor.

### R-30 — UI states checklist — handle initial/refresh/empty/error/permission

- **Severity:** P2
- **Sources:** legacy ANGULAR_NX_PRIMENG_FRONTEND_RULES (Common UI states), `[RAGE-R2A]:Visual Accuracy Checklist`
- **Rule:** Every feature must consider:
  - Initial loading
  - Refresh loading
  - Empty data
  - API error
  - Permission denied
  - Form validation error
  - Save success / failure
  - Unsaved changes
  - Disabled action / hidden action
  - Responsive layout (mobile + tablet + desktop)
- **Audit heuristic:** procedural — page review against the checklist.
- **Fix class:** flag-only GAP.

### R-31 — No DOM access from Angular — no `querySelector` / `getElementById`

- **Severity:** P2
- **Sources:** `[RAGE-H2A]:Hard Rule`
- **Rule:** Do not rely on `document.querySelector`, `document.getElementById`, manual DOM mutation, or global event listeners unless there is a very specific justified exception. Use Angular template refs (`#ref` + `ViewChild`) or signals.
- **Audit heuristic:**
  ```
  rg -n "document\.(querySelector|getElementById|querySelectorAll|getElementsByClassName|getElementsByTagName)" --type ts --glob '!*.spec.ts' --glob '!node_modules' --glob '!dist'
  rg -n "window\.addEventListener" --type ts --glob '!*.spec.ts'
  ```
- **Fix class:** manual refactor.

### R-32 — No `innerHTML` injection

- **Severity:** P2
- **Sources:** `[RAGE-H2A]:Hard Rule`
- **Rule:** Do not inject HTML via `[innerHTML]` unless the source is trusted and the value passes through `DomSanitizer`. Do not keep `<script>` tags. Do not copy raw JavaScript into Angular components.
- **Audit heuristic:**
  ```
  rg -n "\[innerHTML\]" --type html --type ts --glob '!node_modules'
  rg -n "<script\b" --type html --glob '!node_modules' --glob '!dist' --glob '!index.html'
  ```
- **Fix class:** manual refactor.

### R-33 — Imports — no unused, no broad barrel pull

- **Severity:** P2
- **Sources:** `[PERF]:Safe Optimization Areas`
- **Rule:**
  - Remove unused imports.
  - Avoid importing full icon libraries (especially the legacy `primeicons` — also caught by R-01).
  - Avoid broad barrel imports when they pull too much. Prefer specific subpath imports when bundle weight is sensitive.
  - Do not use `import * as ...` for libraries; named imports only.
- **Audit heuristic:**
  ```
  # tsc --noEmit + ESLint --no-unused-imports
  npx eslint --no-unused-imports
  rg -n "import \* as " --type ts --glob '!node_modules'
  ```
- **Fix class:** auto-replace (remove unused + convert star imports).

### R-34 — i18n / RTL — logical properties only

- **Severity:** P2
- **Sources:** Implied by `[CLAUDE-MD]:Platform Standards` (MultiLanguageName) + `[MEM]` references to RTL across multiple memory entries
- **Rule:**
  - Use logical CSS properties: `ps-*` (padding-start) / `pe-*` (padding-end) / `ms-*` / `me-*` / `inline-start` / `inline-end` / `text-start` / `text-end`.
  - Never use directional `left` / `right` / `pl-*` / `pr-*` / `ml-*` / `mr-*` / `text-left` / `text-right` for layout decisions that should flip in RTL.
  - Test every page in RTL mode (Arabic locale) before shipping.
  - SVGs that have directional meaning (chevrons, back-arrows) must mirror in RTL — use `transform: scaleX(-1)` via a `:dir(rtl)` selector or token, not a hardcoded transform.
  - bidi-safe: use `<bdi>` or `dir="auto"` for user-generated content that may contain mixed scripts (e.g. account names with mixed Arabic + Latin).
- **Audit heuristic:** see R-15 (directional properties) + manual review of every page in RTL preview.
- **Fix class:** manual refactor.

### R-35 — Polish heuristics — audit, distill, harden, animate

- **Severity:** P2
- **Sources:** `[MEM]:reference_design_polish_skills`, MEMORY index entries for `polish` skill commands
- **Rule:** When polishing a component, run the polish heuristics:
  - **Audit** — list every visible state, every interaction, every edge.
  - **Distill** — remove non-essential ornamentation; one strong visual idea per surface.
  - **Harden** — handle every state (hover, focus, active, disabled, loading, error, empty).
  - **Animate** — every transition has a reason; never animate decoration; keep durations < 200ms unless intentional.
  - **Typography** — read the type hierarchy out loud; if it's flat, it's wrong.
  - **Motion** — respect `prefers-reduced-motion`.
  - **UX writing** — every label / placeholder / error message is precise; no apologetic copy ("Oops!").
- **Audit heuristic:**
  ```
  # animations without prefers-reduced-motion respect:
  rg -n "transition|animation" --type css --type ts | rg -v "prefers-reduced-motion"
  ```
  Procedural — pair with visual review.
- **Fix class:** manual refactor.

### R-36 — Design-engineering heuristics — component craft

- **Severity:** P2
- **Sources:** `[MEM]:reference_design_polish_skills` (Emil Kowalski design-eng skill)
- **Rule:** Component craft:
  - Every interactive element has a hover state.
  - Every interactive element has a focus state distinct from hover.
  - Every interactive element has a disabled state.
  - Loading states use skeletons, not spinners — except for buttons (button shows a spinner inline; never relayout).
  - Empty states have an action — "what should I do next?"
  - Error states have a recovery action — "retry" / "go back" / "contact support".
  - Tooltips appear after 400–600ms hover, not instantly.
  - Modals trap focus; close on Escape; close on backdrop click (unless `dismissable: false`).
  - Forms validate on blur (not on keystroke) except for character-count limits.
- **Audit heuristic:** procedural visual + interaction review.
- **Fix class:** manual refactor.

### R-37 — Page learning system — record evidence, never approve silently

- **Severity:** P2
- **Sources:** `[BRAIN-SK]:Page Learning System`
- **Rule:** Every page learning event (prompt, screenshot, bug, correction, red X, green tick) → save evidence + write a `pending` event to `LIGHT_LEARNING_EVENTS.md`. NEVER approve or promote in passing. Promotion requires explicit `deep learn this page` / `approve this pattern` / `promote this globally`.
- **Audit heuristic:** procedural; check `LIGHT_LEARNING_EVENTS.md` exists for any page under active development.
- **Fix class:** flag-only GAP.

### R-38 — Per-section compliance table required for any UI parity task

- **Severity:** P2
- **Sources:** `[MEM]:feedback_orchestrator_failure_modes_org_hierarchy` (STANDING RULE 2026-05-15), `[MEM]:feedback_falcon_custom_library_mandatory`
- **Rule:** Every UI parity / visual-repair / HTML-to-Angular / React-to-Angular task must emit a per-section compliance table:
  - Section name
  - Source visual (link)
  - Implementation file
  - Falcon components used (or GAP)
  - Tokens used (no hardcoded values check)
  - i18n/RTL check
  - State coverage (loading/empty/error)
  - USER-VERIFIED vs AGENT-VERIFIED flag

  No "shipped" without side-by-side evidence. Git status pre-flight before any commit/push. Ask before guessing test values. Customization order is a tree — every fix must justify its level.
- **Audit heuristic:** procedural; check whether any merged UI parity PR includes the compliance table in the description.
- **Fix class:** flag-only GAP.

---

## Conflicts and overrides

| # | Conflict | Resolution |
|---|---|---|
| C-1 | `[LEGACY-TW]` "SCSS is allowed as a controlled fallback" vs `[MEM]:project_brain_skills_primeng_purge` "no SCSS, no component CSS" | **Memory rule wins.** No SCSS at all. The legacy v7 TAILWIND_FIRST_UI_RULES.md doc is archival; it predates the 2026-05-11 brain-skills purge. |
| C-2 | `[LEGACY-TW]` "PrimeNG components for enterprise UI behavior" vs `[GATES]:Gate 01 + [MEM]:project_falcon_primeng_total_removal_complete` | **Memory + Gates win.** Zero PrimeNG. Legacy doc is archival. |
| C-3 | `[NG-BEST]` "Do not use `ngStyle`, use `style` bindings" vs R-02 "no inline `style=""`" | **R-02 wins for static styling.** `style` bindings remain allowed for **calculated dynamic values** (e.g. `[style.width.px]="signal()"`) where no Tailwind utility class can express the value. The pre-finish grep gate in `feedback_no_inline_styles_tokens_only` targets `style="..."` literals — interpolated `[style.*]` bindings with computed values are out of scope. |
| C-4 | `[CLAUDE-MD]` says color naming uses semantic intent vs `[MEM]:feedback_noor_instructions` says "palette over intent inside Admin Console scope" | **Noor wins inside Admin Console.** Forward-only — no migration of existing semantic tokens. Other apps (host-shell, management-console) continue with semantic naming until Noor scope expands. |
| C-5 | `[LEGACY-TW]` "PrimeFlex layout utilities" vs R-11 "Tailwind grid first" | **R-11 wins.** PrimeFlex is gone with PrimeNG removal (R-01). Tailwind Grid only. |

---

## Consolidated audit checklist (cross-referenced)

| # | Check | Maps to rules | Tooling hint |
|---|---|---|---|
| 01 | PrimeNG imports / tags / icons | R-01 | `rg "from ['\"]primeng/"`, `rg "<p-[a-z]"`, `rg "\bpi pi-"` |
| 02 | SCSS / styleUrls / inline `style=""` | R-02 | `fd -e scss`, `rg "styleUrl[s]?:"`, `rg ' style="'` |
| 03 | Hardcoded hex / px / rgba / shadow / radius | R-03 | `rg "#[0-9a-fA-F]{3,8}\b"`, `rg "\[#[0-9a-fA-F]"`, `rg "\[\d+px\]"` |
| 04 | Hardcoded z-index | R-04 | `rg "z-index\s*:\s*\d"`, `rg "z-\[\d"` |
| 05 | Build / gates green | R-05 | `nx build admin-console`, `npm run gate:all` |
| 06 | Token naming (Noor pattern) | R-06 | `rg "--falcon-color-(blue|gray|red)-\d"`, `rg "tag:\s*['\"][A-Z_]"` |
| 07 | Raw HTML controls vs Falcon | R-07, R-12 | `rg "<input(\s|>)"`, `rg "<button(\s|>)"` outside libs/falcon-ui-core |
| 08 | Skeleton-vs-wrapper layer separation | R-08 | `rg "inject\(" libs/falcon-ui-core/`, `rg "<falcon-angular-" apps/*/features/` |
| 09 | Angular 21 idioms | R-09 | `rg "\*ngIf\|\*ngFor\|\*ngSwitch"`, `rg "standalone:\s*true"`, `rg "@HostBinding"` |
| 10 | Folder structure (models.ts/services.ts) | R-10 | Find any `models/*.ts` not named `models.ts` |
| 11 | Tailwind grid usage | R-11 | Manual review — flag flex-heavy layouts |
| 12 | Auth via Identity Service only | R-13 | `rg "zitadel\.com\|@zitadel/"` |
| 13 | Workspace path purity | R-14 | `rg "WebstormProjects[\\\\/]falcon-web-platform-ui"` |
| 14 | i18n + RTL (logical properties) | R-15, R-34 | `rg "\\bpl-\|pr-\|ml-\|mr-\\d"`, manual RTL preview |
| 15 | A11y baseline (role / aria-*) | R-16 | `rg -L "(role=\|aria-[a-z]+=)" libs/falcon-ui-core/src/components/*/falcon-*.tsx` |
| 16 | Token reality (no orphan / no missing) | R-17 | cross-ref `02-token-registry-quick-grep.txt` |
| 17 | Brain SK playbook grounded | R-18 | manual review of PR description |
| 18 | Nx boundaries | R-19 | `rg "from ['\"]apps/"`, `rg "@falcon/[^'\"]+/src/"` |
| 19 | Module Federation safety | R-20 | `git diff origin/main -- '**/module-federation.config.*' '**/webpack.config.*'` |
| 20 | No premature shared abstraction | R-21 | Find libs with one consumer |
| 21 | Comment style (banner `*** ***`) | R-22 | `rg -U "/\*\*[\s\S]{200,}?\*/"`, `rg "@param\|@returns"` |
| 22 | Clean / DRY / minimal | R-23 | Manual review |
| 23 | OnPush + inline templates | R-24 | `rg -L "ChangeDetectionStrategy\.OnPush" *.component.ts` |
| 24 | Services providedIn:'root' + inject() | R-25 | `rg -L "providedIn:\s*['\"]root['\"]" *.service.ts` |
| 25 | TypeScript no-any | R-26 | `rg ":\s*any\b\|<any>\|\bas any\b"` |
| 26 | NgOptimizedImage usage | R-27 | `rg "<img\s+src="` (without `ngSrc`) |
| 27 | Lazy feature routes | R-28 | review *.routes.ts for eager component refs |
| 28 | Composition over duplication | R-29 | Manual review of large template files |
| 29 | UI states covered (loading/empty/error) | R-30 | Manual page review |
| 30 | No DOM access | R-31 | `rg "document\.(querySelector\|getElementById)"` |
| 31 | No innerHTML injection | R-32 | `rg "\[innerHTML\]"`, `rg "<script\b"` |
| 32 | Imports clean | R-33 | ESLint `--no-unused-imports`, `rg "import \* as "` |
| 33 | Polish heuristics | R-35 | Manual visual review |
| 34 | Design-eng component craft | R-36 | Manual interaction review |
| 35 | Page learning evidence saved | R-37 | check `LIGHT_LEARNING_EVENTS.md` per active page |
| 36 | Compliance table per UI section | R-38 | Manual PR review |

---

## Rule severity counts

| Tier | Count | IDs |
|---|---|---|
| P0 (build-blocking) | 6 | R-01, R-02, R-03, R-04, R-05, R-06 |
| P1 (correctness) | 15 | R-07 through R-21 |
| P2 (cleanliness) | 17 | R-22 through R-38 |
| **Total** | **38** | |

---

## Notes for the audit architect

1. **Run order:** P0 first (gates can short-circuit any further audit), then P1, then P2.
2. **Auto-replace vs flag-only:** ~12 rules permit auto-replace at scale (R-06 rename, R-09 control-flow swap, R-27 ngSrc, R-33 imports, parts of R-03 token-substitution). The rest require human judgment.
3. **Memory rules are the strictest source:** when in doubt, the 2026-05 MEMORY.md entries win over the 2024-era legacy v7 docs. Legacy docs are kept in this digest only to surface conflicts (see Conflicts table above).
4. **Brain SK playbooks are the implementation spec** for any page-level work — R-18 is procedural but unmissable. If the audit finds page-level code without a playbook citation, that itself is a P1 hit.
5. **The `Front-End-skills/` skill tree is aspirational** — only `code-skills/` exists on disk under `C:\Falcon\brain-skills\`. All FE rules in this digest were sourced from the authoritative shadow locations listed in the frontmatter `sources_read` and `sources_not_found_at_expected_paths`. Re-run this digest if/when those skill folders are created.
6. **Cross-reference token reality (R-17) against `02-token-registry-quick-grep.txt`** — that file is produced separately by the registry-grep step in the same night-shift run.
