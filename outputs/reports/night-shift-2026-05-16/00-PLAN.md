---
title: Night Shift — Full Front-End Audit
date: 2026-05-16
orchestrator: Adnan / Jakco
mode: autonomous (auto-pilot)
status: in_progress
---

# Night Shift — Full Front-End Audit (2026-05-16)

## Goal

Apply every documented Falcon front-end rule to every in-scope Angular surface, verify every token referenced actually exists, remove every hardcoded z-index hack, surface every cleanliness/DRY violation, fix what is safely fixable, and write per-folder knowledge notes back to the Obsidian vault.

## Scope

### IN
- `libs/falcon-ui-core/` — Stencil skeletons + Angular wrapper variants (`*-tw.*`)
- `libs/falcon/` — `@falcon` barrel aggregator (Angular consumption surface)
- `libs/falcon-theme/` — canonical Tailwind v4 theme entry
- `libs/falcon-ui-tokens/` — primitive + semantic + per-component tokens
- `apps/admin-console/`
- `apps/host-shell/`
- `apps/management-console/`

### OUT
- `libs/falcon-ui-react/` (React wrappers — Angular-only mandate per memory `feedback_angular_only_scope`)
- `libs/falcon-ui-vue/` (Vue wrappers — same)
- `libs/falcon-ui-showcase-data/` (orphaned scaffolding per memory)
- `libs/falcon-studio/` (design tool — different concern)
- `libs/sdk/` (non-UI)
- `apps/*/` `__tests__`, `e2e`, generated `dist/`
- `WebstormProjects\falcon-web-platform-ui` (forbidden duplicate per memory)

## Rule sources (digest in `01-rules-digest.md`)

1. `C:\Falcon\Brain SK\CLAUDE.md`
2. `C:\Falcon\brain-skills\Front-End-skills\angular-tailwind-skill\Skill.md`
3. `C:\Falcon\brain-skills\Front-End-skills\noor-instructions-skill\Skill.md`
4. `C:\Falcon\brain-skills\Front-End-skills\official-angular-skill\Skill.md`
5. `C:\Falcon\brain-skills\Front-End-skills\nx-workspace-skill\Skill.md`
6. `C:\Falcon\brain-skills\Front-End-skills\polish-skill\Skill.md`
7. `C:\Falcon\falcon-wiki\Conventions.md`
8. Memory feedbacks (consolidated)

## Check matrix (per scope, per file where applicable)

| # | Check | Severity | Fix-class |
|---|---|---|---|
| C1 | Token reality (`var(--falcon-*)`, `bg-falcon-*`, `text-falcon-*`, `border-falcon-*` resolve to defined token) | P0 | safe-replace or flag |
| C2 | No inline `style=` attribute | P1 | replace with class + token |
| C3 | No hardcoded z-index (`z-index: <number>`, `z-[<number>]`, `style="z-index"`) | P1 | remove (rely on canonical ladder) |
| C4 | No PrimeNG imports, no `p-*` components, no `pi pi-*` icons | P0 | replace with Falcon component / icon |
| C5 | No `.scss` files, no component CSS, no `styleUrls` arrays | P0 | move to Tailwind utilities |
| C6 | Falcon-library-first: duplicate markup that re-implements a Falcon component | P1 | refactor to `<falcon-*>` or flag GAP |
| C7 | Library skeleton vs app wrapper: services only in wrappers, presentational in lib | P1 | refactor |
| C8 | Clean code: DRY, minimal, idiomatic Angular 21 zoneless, signals over RxJS where applicable | P2 | refactor |
| C9 | Folder structure: `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` (one file per type-folder per memory) | P2 | flag |
| C10 | i18n keys exist + bidi-safe (no left/right physical, use start/end) | P1 | flag |
| C11 | Comments style: terse `*** ***` banner only, no verbose JSDoc | P2 | flag |
| C12 | No commits, no pushes (standing rule) | enforce | n/a |

## Phases

1. **Wave 1** — Token Registry + Rules Digest (parallel, read-only)
2. **Wave 2** — Senior-Architect audits per scope (parallel, read-only)
3. **Wave 3** — Aggregate findings, classify by severity, plan fix batches
4. **Wave 4** — Apply fixes (serial per file, parallel across non-overlapping scopes)
5. **Wave 5** — Build verify per app + lib
6. **Wave 6** — Obsidian write-back (per-folder notes, new gaps/questions)
7. **Wave 7** — Final report

## Standing rules

- No commits without explicit `commit` in current message
- No pushes without explicit `push` in current message
- Build must be green per app at the end
- Tokens-only; no hardcoded values
- Falcon library first
- No PrimeNG / PrimeIcons / SCSS
- Tailwind utilities only

## Output

- This folder: `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\`
- Obsidian vault write-backs: `C:\Falcon\falcon-wiki\` (new notes via templates)
