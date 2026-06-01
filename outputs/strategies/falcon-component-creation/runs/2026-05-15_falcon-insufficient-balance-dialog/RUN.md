# Run — falcon-insufficient-balance-dialog (2026-05-15)

| Field | Value |
| --- | --- |
| Component | `falcon-insufficient-balance-dialog` |
| Wave | 15 |
| Strategy version | v1.0 |
| Started | 2026-05-15 ~10:00 UTC |
| Finished | 2026-05-15 ~11:10 UTC |
| Result | ✅ Ship |
| Predecessor | Wave 14 wrong-path Angular feature component (deleted in this run) |

## Files created

### Stencil Shadow
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.tsx`
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css`
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.types.ts`

### Stencil Light/TW
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx`

### Token contract
- `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css`

### Angular wrapper
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.component.ts`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.component.html`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-insufficient-balance-dialog/index.ts`

### Showcase doc
- `libs/falcon-ui-showcase-data/src/docs/insufficient-balance-dialog.md`

### Run artefacts (this dir)
- `RUN.md` (this file)
- `SCORECARD.md`
- `LESSONS_LEARNED.md`

## Files edited

- `libs/falcon-ui-tokens/src/index.css` — `@import` for new token file
- `libs/falcon-ui-core/src/define-falcon-tw-component.ts` — registered `falcon-insufficient-balance-dialog-tw` loader
- `libs/falcon-ui-core/src/angular-wrapper/index.ts` — barrel export for new wrapper
- `libs/falcon/src/shared-ui/index.ts` — REMOVED the wrong-path Wave 14 export
- `apps/admin-console/.../applications-table/applications-table.component.ts` — import + class name + imports array
- `apps/admin-console/.../applications-table/applications-table.component.html` — selector + event names + label inputs
- `libs/falcon-ui-showcase-data/src/registry.json` — NEW `notifications` category + entry moved + tagTw updated

## Files deleted

- `libs/falcon/src/shared-ui/lib/components/falcon-insufficient-balance-dialog/` (entire directory) — Wave 14 wrong-path Angular feature component

## Build chain results

| Build | Hash | Status | Notes |
| --- | --- | --- | --- |
| `nx build falcon-ui-core` (bootstrap) | (no hash logged) | ✅ green (41s) | First build with loader entry removed — emits dist artefact for new component. |
| `nx build falcon-ui-core` (final) | (no hash logged) | ✅ green (42s) | Second build with loader entry restored — TS resolves the new `import('../dist/components/falcon-insufficient-balance-dialog-tw')`. |
| `nx build admin-console` | `313ac9c0d70d3886` | ✅ green | New wrapper consumed via `@falcon/ui-core/angular`. |
| `nx build host-shell` | `6cf9ad63b1444470` | ✅ green | Cross-MFE consumption verified. |

## Deviations from strategy

| Strategy expectation | Actual | Justification |
| --- | --- | --- |
| Single-pass build (Phase 4 of `06-EXECUTION_PROTOCOL.md`) | Two-pass bootstrap | Loader entry can't resolve dist path on first build (chicken-and-egg). One-time cost. See `LESSONS_LEARNED.md`. |
| `04-FILE_TEMPLATES/classes.ts.template` produced for A3 | Skipped — classes inlined in Light/TW `.tsx` | Mirrors `falcon-alert-dialog-tw` which also inlines classes. |
| `readme.md` per component dir | Not authored | Stencil's `docs-readme` output target auto-generates. |
| Demo app coverage | Skipped per standing "skip demos" rule | Showcase data lib gets entry; demo apps explicitly out of scope. |

## Knowledge updates

- ✅ Brain SK dossier (6 files): `Brain Outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/` — OVERVIEW, API, USAGE, TOKENS, GAPS_AND_UPGRADES, DECISION
- ✅ Strategy run artefacts: this directory
- ❌ Falcon Wiki note (`falcon-wiki/30-Components/`) — not updated this run (vault Templater not available in this session)

## Standing rules honoured

- ✅ `feedback_no_inline_styles_tokens_only.md` — all visuals via tokens
- ✅ `feedback_brain_skills_primeng_purge.md` — zero PrimeNG, zero SCSS, Tailwind v4 utilities
- ✅ `feedback_falcon_custom_library_mandatory.md` — three-artefact Falcon component (not raw HTML)
- ✅ `feedback_never_commit_without_explicit_permission.md` — no commits
- ✅ `feedback_never_push_without_explicit_permission.md` — no pushes
- ✅ `feedback_strict_task_scope.md` — touched only files in scope (library + caller + showcase)
