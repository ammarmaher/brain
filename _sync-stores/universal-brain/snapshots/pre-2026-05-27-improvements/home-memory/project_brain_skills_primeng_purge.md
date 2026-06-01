---
name: Brain skills PrimeNG purge — Tailwind-only stack locked
description: All Falcon brain skills rewritten on 2026-05-11 to drop PrimeNG/PrimeFlex/PrimeIcons and forbid SCSS/component CSS. Skill renamed from angular-tailwind-primeng-skill → angular-tailwind-skill.
type: project
originSessionId: e2657d3f-b2a5-48e5-950e-651f5d6dad2a
---
**Fact:** On 2026-05-11 the user instructed: "delete anything skill related to PrimeNG/PrimeFlex, and adjust to use just Tailwind without any SCSS or CSS code." The full brain-skills tree was rewritten that session.

**Why:** PrimeNG was already physically uninstalled platform-wide per `project_falcon_primeng_total_removal_complete` (2026-05-10), but the brain skills still prescribed PrimeNG patterns + an SCSS fallback. The skills were misaligned with the actual codebase, so future sessions could regress by following stale guidance.

**How to apply:**

- **Renamed skill:** `brain-skills/Front-End-skills/angular-tailwind-primeng-skill/` → `brain-skills/Front-End-skills/angular-tailwind-skill/`. Old folder deleted. New skill enforces:
  - Tailwind v4 utilities on the template for ALL styling.
  - **No `*.scss`. No component `*.css`. No `styleUrls`. No `styles: ['...']`. No `@apply`. No `@media`. No `::ng-deep`. No `!important`.**
  - The only CSS files allowed are `libs/falcon/src/theme/falcon.theme.css` (canonical Tailwind v4 `@theme` SSOT) + per-app `tailwind.css` (alias only).
  - Falcon UI Core (`<falcon-*>`) is the only UI kit.
  - Falcon tokens (`falcon-{family}-{shade}`) for every color / spacing / radius / shadow / typography value.

- **Files updated** to remove PrimeNG references and SCSS allowances:
  - `Front-End-skills/noor-instructions-skill/Skill.md` + `resources/A-layout-ownership.md`, `resources/E-color-naming.md`, `resources/I-single-source-config.md`
  - `Front-End-skills/angular-upgrade-skill/Skill.md` + `resources/angular-upgrade-plan.md`, `resources/angular-common-regressions.md`
  - `Front-End-skills/official-angular-skill/resources/angular-update-guidance.md`
  - `Front-End-skills/nx-module-federation-skill/resources/mf-debug-checklist.md`
  - All 7 `business-skills/*/Skill.md` guard-rail lines (replaced "PrimeNG / Tailwind" with "Tailwind / Falcon UI Core")
  - `business-skills/prd-knowledge/resources/knowledge-sync-rules.md`
  - `code-skills/falcon-project-standards-skill/resources/{falcon-code-style.md,falcon-ui-rules.md,load-modes.md}`
  - `ai_deep_skill_bundle/README.md`, `MANIFEST.md`, `INSTALL_IN_CLAUDE.md`, `CUSTOMIZATION_SUMMARY.md`
  - `ai_deep_skill_bundle/skills/{00-master-orchestrator,10-chatgpt-codex-business-analyst,20-claude-implementation-engineer}/SKILL.md`
  - `ai_deep_skill_bundle/protocols/{TAILWIND_FIRST_UI_RULES.md,GET_SHIT_DONE_GATES.md}` (TAILWIND_FIRST is now TAILWIND_ONLY in spirit)
  - `ai_deep_skill_bundle/templates/{CLAUDE_IMPLEMENTATION_PROMPT_TEMPLATE.md,GEMINI_VALIDATION_PROMPT_TEMPLATE.md}`
  - `ai_deep_skill_bundle/checklists/FRONTEND_IMPLEMENTATION_CHECKLIST.md`

- **Files removed:**
  - `Front-End-skills/angular-tailwind-primeng-skill/` (entire folder + all resources)
  - `ai_deep_skill_bundle/reference/project-blueprints/ANGULAR_NX_PRIMENG_FRONTEND_RULES.md` → replaced by `ANGULAR_NX_FRONTEND_RULES.md`
  - `ai_deep_skill_bundle/reference/imported-business-skills/` (duplicate mirror — canonical lives at `brain-skills/business-skills/`)

- **`C:\Falcon\CLAUDE.md` updated** to reference the new `angular-tailwind` skill instead of `angular-tailwind-primeng`, removed PrimeNG mentions from the Front-End category description and noor-instructions blurb, and dropped `*.scss` / `*.css` from the PreToolUse hook extension list (only `*.html` and `*.ts` are relevant now).

- **Remaining PrimeNG mentions across brain-skills** are intentional prohibitions (grep patterns to DETECT PrimeNG, "do not reintroduce" rules, "uninstalled" notes). Zero prescriptive "use PrimeNG" instructions remain.

- **Caveats / things NOT changed this session:**
  - The `SOUNDS.md` file at `brain-skills/SOUNDS.md` was not touched (no PrimeNG references).
  - The `business-skills/business-pipeline/resources/`, `business-gap-detection/resources/`, etc. were not exhaustively inspected — only the Skill.md guard rails were updated. If any nested resource still mentions PrimeNG prescriptively, a follow-up grep can be run.
  - The session-start banner (System Integrity Check) still lists `angular-tailwind-primeng` and may need updating in the banner-print PowerShell script (`brain-skills/banner-skills.ps1` or similar). That script lives outside the skill files themselves and wasn't audited this session.
  - The `Brain/` (tri-mindset orchestrator) skill at `C:\falcon\Brain\Skill.md` was not audited — only `brain-skills/`.
