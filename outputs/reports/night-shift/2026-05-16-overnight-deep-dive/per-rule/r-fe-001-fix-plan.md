---
ruleId: R-FE-001
ruleName: Tailwind utilities only on Angular templates
severity: must
violationCount: 17
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Falcon Angular code must style every visible element via Tailwind utility classes on templates only — no PrimeNG/PrimeIcons/PrimeFlex imports, no non-empty `styleUrls:` or `styles:` arrays in `@Component` decorators (the Falcon UI Core `<falcon-*>` library is the sole UI kit).

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui` (excluding `node_modules/`, `.angular/`, `.nx/`, `dist/`, `*.spec.ts`):

| Detector pattern | Hits |
|---|---|
| `from "primeng/..."` imports | 0 |
| `from "primeicons"` imports | 0 |
| `from "primeflex"` imports | 0 |
| `@import "...primeng..."` | 0 |
| `pi pi-*` icon classes in templates | 0 |
| Non-empty `styleUrls: ['...']` | 17 |
| Non-empty `styles: [...]` | 10 |

PrimeNG/PrimeIcons/PrimeFlex are confirmed eradicated (consistent with `project_falcon_primeng_total_removal_complete` 2026-05-10). The remaining surface is the **27 `@Component` decorators that still bind to SCSS/CSS files or inline `styles` blocks**.

Top 5 offender files (by detector hit + size of SCSS sibling):

1. `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` — `styleUrls` → SCSS (auth flow, large)
2. `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` — `styleUrls` → SCSS (auth entry, large)
3. `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` — `styleUrls` → SCSS (auth chrome)
4. `apps/host-shell/src/app/layout/layout.component.ts` — `styleUrls` → SCSS (app shell)
5. `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` — `styleUrls` → SCSS

The `styles: [...]` family (10 hits) is mostly `<falcon-saudi-riyal-icon>`, the `error.component`, the `unauthorized.component`, and the playground/preview-page scaffolds — typically a single CSS string declaring a `:host { display: block }` or icon sizing.

Per app:
- admin-console: 0 styleUrls, 0 styles arrays in app code (clean)
- host-shell: 10 styleUrls (auth + layout), ~7 `styles:` blocks (error pages + preview shells)
- management-console: 0 styleUrls in app code
- libs: 7 styleUrls (the `libs/falcon/src/shared-ui/lib/components/*` Angular wrappers — separately addressed under R-FE-002)

## 3. Why this matters (the architectural cost of leaving it)

Every component CSS file fragments the theming layer. The Theme Studio (in active build per `project_falcon_studio_waves_plan`) lets the user mutate one Falcon token and have every consumer update in lock-step — Shadow, Tailwind, apps. SCSS siblings on `forgot-password-flow.component` short-circuit that loop: any visual rule in the SCSS never participates in token swap. Tomorrow's "make auth dark-mode aware" or "promote auth to glassmorphism" tasks die at the door.

The `styles: [':host { display: block }']` family is a tiny but compounding problem: each one is a one-line hack that should be a Tailwind utility on the template root, and each one is an excuse for the next author to keep doing the same.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Build the offender inventory.** Run:
  ```
  rg -n --type ts -g '!*.spec.ts' "styleUrls?\s*:\s*\[\s*['\`\"]" "C:\Falcon\Falcon\falcon-web-platform-ui\apps"
  rg -n --type ts -g '!*.spec.ts' "styles\s*:\s*\[\s*[\`'\"]" "C:\Falcon\Falcon\falcon-web-platform-ui"
  ```
  Save the union to `audit/r-fe-001-offenders.txt`.

- **Step 2 — Triage by class.**
  - Class A (styleUrls → SCSS file): 10 in host-shell auth + layout. Handle jointly with R-FE-002 (same SCSS files are flagged by both rules). One pass converts both rules at once.
  - Class B (inline `styles: [...]`): 10 cases. Most are `:host { display: block }` or single icon-size rules. Move to template root class binding.

- **Step 3 — Convert one Class B file as the canonical example.** Take `libs/falcon/src/shared-ui/lib/ui/falcon-icon/falcon-icon.component.ts`. Remove the `styles: [...]` entry. Find the host element in the template (or wrap in a span) and apply Tailwind classes (`class="block w-[1em] h-[1em]"` ... but expressed via Falcon spacing tokens).

- **Step 4 — Run the same recipe across all Class B files.** Use the listing from Step 1.

- **Step 5 — Handle Class A by deferring to R-FE-002.** Do NOT delete the SCSS file in this rule's pass — the R-FE-002 plan owns that step.

- **Step 6 — Re-run detector.** Expected hits: 0 `styleUrls`, 0 non-empty `styles`. If a single one remains, add the file path to `exemptions/EXEMPTIONS.md` with `ruleId: R-FE-001` and a written justification (rare — preview pages may qualify).

- **Step 7 — Build verification.** `nx build host-shell --configuration=development` AND `nx build falcon-ui-core` AND `nx build admin-console` → all exit 0.

## 5. Estimated effort + complexity rationale

**medium** — ~17 styleUrls + 10 styles to address, but most of the `styles: [...]` entries are 1-3 lines. The styleUrls entries each defer to R-FE-002 (which does the heavy SCSS-to-Tailwind translation). If R-FE-002 is done first, R-FE-001's residual is mostly a delete-the-decorator-line operation. Estimate ~3-4 hours assuming R-FE-002 is run in the same morning.

## 6. Rollback hint (how to undo if the fix is wrong)

`git diff` shows every removed `styleUrls`/`styles` block; revert one decorator at a time. If a runtime regression appears (e.g., the page suddenly loses spacing) restore that single SCSS file from `git checkout HEAD -- <file>.scss <file>.ts`. The decorator-removal is mechanically safe because Angular treats `styles: []` and absent `styles` identically.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n --type ts -g '!*.spec.ts' "styleUrls?\s*:\s*\[\s*['\`\"]"
  rg -n --type ts -g '!*.spec.ts' "styles\s*:\s*\[\s*[\`'\"]"
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  UV_THREADPOOL_SIZE=128 npx nx build falcon-ui-core
  ```
- expected output:
  - Both `rg` calls: "No matches found" (or only matches inside `libs/falcon-ui-core/**`)
  - All three `nx build`s: exit code 0

## 8. Risk flags (anything that could break)

- Auth pages use SCSS for legitimate spacing/layout — careless conversion can break the login chrome. Test login, OTP, forgot-password flows visually before declaring done.
- The `<falcon-saudi-riyal-icon>` component embeds inline SVG sizing in `styles:` — when removing, ensure the new template class preserves the `1em × 1em` sizing or the icon collapses.
- Removing `styles: [':host { display: block }']` from an Angular component changes the host element's default `display: inline`. Add `class="block"` (or component-specific class) to the host or wrap in a block element to preserve layout. This is documented in memory `project_falcon_ui_core_layout_traps.md` trap #1.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-002** — same files contain SCSS that must be deleted; pair the two passes
- **R-FE-003** — once SCSS is gone, audit `style="..."` inline that may have leaked in
- **R-FE-004** — every Tailwind utility you add must use Falcon tokens (no `bg-blue-500`)
- **R-FE-012** — every commit closes with `nx build` exit 0
- **R-NOOR-008** — global selectors inside removed SCSS (`body { ... }`, `:host { ... }`) trigger Noor's hygiene rule
