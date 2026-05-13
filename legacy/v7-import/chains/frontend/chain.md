<!-- *** Skill chain: frontend "let's go" *** -->
<!-- *** Phase G of full-pipeline-redesign — single trigger that loads the FE rule stack *** -->

# Chain: Frontend "let's go"

## Purpose

A single composition that, when activated, makes Adnan apply the Tailwind + Angular-latest + Nx + Module-Federation + Falcon project-standards rule stack together, with strict component layout enforced. Phase G of `Brain\jobs\full-pipeline-redesign.md`.

This chain does **not** generate code on its own. It loads rules. The downstream task (e.g. "create a contact-group-list component") then runs under those rules.

## Trigger phrases

When the user says any of the following, Adnan activates this chain:

- `let's go on frontend`
- `let's go on <feature>` — when `<feature>` is recognized as a frontend feature (Angular app, component, page, library, layout, theme, i18n)
- `frontend chain`
- `run frontend chain`

If `<feature>` ambiguity exists between FE and BE, Adnan asks once which side; on FE, this chain runs.

## Pre-read (mandatory before chain activates)

Adnan reads `architecture-prereads.md` (sibling file) and loads the listed wiki docs into context **before** loading any sub-skill. This ensures placement decisions (which app, which lib, which permission boundary) are made against the architecture source of truth.

## Sub-skill load order

Adnan reads each `Skill.md` below in this order. Order matters: the last skill in the list overrides the earlier ones on conflict (Falcon project standards win).

1. `C:\falcon\brain-skills\Front-End-skills\official-angular-skill\Skill.md`
2. `C:\falcon\brain-skills\Front-End-skills\angular-tailwind-primeng-skill\Skill.md`
3. `C:\falcon\brain-skills\Front-End-skills\nx-workspace-skill\Skill.md`
4. `C:\falcon\brain-skills\Front-End-skills\nx-module-federation-skill\Skill.md`
5. `C:\falcon\brain-skills\code-skills\falcon-project-standards-skill\Skill.md`

After the five `Skill.md` reads, Adnan reads `component-layout.md` (sibling file) — this is the last word on file/folder structure for any component or service the chain produces.

## Hard layout rules (chain-level overrides — non-negotiable)

These rules come from standing user-feedback memory under `C:\Users\User\.claude\projects\C--falcon\memory\`. They override anything the sub-skills say.

1. **Tailwind CSS Grid is the default layout primitive.** Flexbox is allowed only for small inline alignment (toolbar buttons, icon-with-label pairs, single-line form rows). Page-level and section-level layouts use `grid` utilities.
   - Source: `feedback_tailwind_grid_first.md`.

2. **Frontend NEVER calls Zitadel directly.** All authentication flows go through Identity Service at `auth.falconhub.space/api/`. No Zitadel client SDKs in the browser. No direct token exchange against Zitadel issuer endpoints.
   - Source: `feedback_frontend_auth_identity_service.md`.

3. **Nx apps and libs follow Wiki kebab-case + `@falcon/*` scope rules.** Libraries live under `libs/core`, `libs/theme`, `libs/i18n`, `libs/ui`, `libs/utils`, `libs/layout`, `libs/shared`, `libs/host-bridge`, `libs/federation`, `libs/sdk`. App names use kebab-case. Import paths use the `@falcon/*` alias only — never relative paths into another lib.
   - Source: `feedback_wiki_naming_conventions.md`.

4. **Discard old UI folders.** `falcon-web-platform-ui-old` and `deprecated-falcon-web-platform-ui` are excluded from every operation — read, write, grep, refactor, reference. They do not exist for the purposes of this chain.
   - Source: `feedback_discard_old_ui.md`.

5. **No dev-serve / preview / browser test during implementation.** The chain produces code only. Running `nx serve`, opening a browser, taking screenshots, or invoking any preview tool is forbidden inside this chain. UI verification is a separate phase the user initiates.
   - Source: `feedback_no_ui_testing_during_implementation.md`.

## Standing rules also enforced (carried from CLAUDE.md)

- No commit without explicit user permission (`feedback_never_commit_without_explicit_permission.md`).
- No push without explicit user permission (`feedback_never_push_without_explicit_permission.md`).
- Strict task scope — do not touch infra, config, or tooling outside the task (`feedback_strict_task_scope.md`).
- Clean DRY minimal code, no speculative abstractions (`feedback_clean_code_dry_minimal.md`).
- Banner-format comments only (`feedback_comment_style.md`).
- Folder pattern: `models/models.ts`, `services/services.ts`, etc. (`feedback_folder_structure_pattern.md`) — see `component-layout.md`.

## Activation flow (what Adnan does on trigger)

1. Match trigger phrase.
2. Read `architecture-prereads.md`, then load the listed wiki docs.
3. Read the five `Skill.md` files in the order above.
4. Read `component-layout.md`.
5. Apply hard layout rules + standing rules over whatever the sub-skills said.
6. Hand off the now-loaded ruleset to the actual task agent (Ammar Web-Platform-UI).
7. Refuse any sub-step that violates a hard rule and report the violation.

## De-activation

The chain stays in effect for the duration of the current frontend task. A new unrelated trigger (e.g. backend chain) replaces it.

## Done definition for this chain

- All five sub-skill `Skill.md` files are loadable from the listed paths.
- All six wiki pre-reads in `architecture-prereads.md` resolve.
- `component-layout.md` is read before any component file is generated.
- Every produced component conforms to `component-layout.md`.
- No Zitadel direct call, no flex-first layout, no work in old UI folders, no dev-serve invocation.
