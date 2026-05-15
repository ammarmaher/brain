*** Architecture Rule Set — Quality Gates ***
*** SoT: Brain Outputs/understanding/frontend/architecture/QUALITY_GATES_AUDIT.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Quality Gates

> 12 gate scripts in `tools/gates/gate-NN-*.mjs`. Composite `gate:all` runs 7 of them: 01 lint, 02 typecheck, 07 token-naming, 08 hardcoded-value, 09 a11y-baseline, 10 noor-naming, 12 component-token-scope. Build gates 03-06 + bundle gate 11 run independently. Pre-finish requirement for Brain SK: `npm run gate:all`.

## Source-of-truth file
- [QUALITY_GATES_AUDIT](../../outputs/understanding/frontend/architecture/QUALITY_GATES_AUDIT.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-gate-01 | `gate-01-lint.mjs` — ESLint flat-config with `--max-warnings=0`. CI scopes to git-diff changed files; local runs `nx run-many --target=lint --all`. Live-fires Wave-PR-8 PrimeNG flat block. | high | gate-01-lint.mjs |
| AR-gate-02 | `gate-02-typecheck.mjs` — TypeScript `noEmit` typecheck across all projects. | high | gate-02-typecheck.mjs |
| AR-gate-03 | `gate-07-token-naming-lint.mjs` — FORBIDS `--falcon-color-(blue|gray)-*` (legacy directional). Noor's law: `--falcon-{family}-{shade}` only (e.g. `--falcon-teal-500`). Forward-only enforcement. | high | gate-07 + memory `feedback_noor_instructions.md` |
| AR-gate-04 | `gate-08-hardcoded-value-lint.mjs` — FORBIDS new `#hex`, standalone `px`, `rgba()` in `libs/falcon-ui-tokens/src/**/*.css` + `libs/falcon-ui-core/src/**/*.css`. Allowed inside `var(--token, #fallback)`. Forward-only. | high | gate-08 |
| AR-gate-05 | `gate-09-a11y-baseline.mjs` — Every new Stencil TSX MUST declare `role=` or `aria-*`. Wave 4 grandfathered 46 components; DEFERRED list documents exemptions. | high | gate-09 + DEFERRED set |
| AR-gate-06 | `gate-10-noor-naming-lint.mjs` — Package names MUST start `@falcon/`; Stencil `@Component({ tag: 'falcon-<kebab>' })` MUST match `^falcon-[a-z][a-z0-9-]*$`. | high | gate-10 |
| AR-gate-07 | `gate-11-bundle-size-budget.mjs` — admin-console main.js gzipped MUST be < 340 KB. Current baseline ~335 KB. | high | gate-11 |
| AR-gate-08 | `gate-12-component-token-scope.mjs` — Per-component token files MUST declare under `:where(falcon-<component>, .falcon-<component>, [data-falcon-<component>]) { ... }` — NEVER `:root`. Polluting `:root` with ~3,500 tokens freezes Chrome DevTools. | high | gate-12 |
| AR-gate-09 | `npm run gate:all` runs 01→02→07→08→09→10→12 sequentially. Build gates 03-06 + bundle gate 11 are SEPARATE — call individually. | medium | package.json |
| AR-gate-10 | `npm run build:libs` (prestart hook) runs `nx run-many --target=build --projects=falcon-ui-tokens,falcon-ui-core,falcon-studio` — effectively gate-03..06. | medium | package.json |
| AR-gate-11 | Gate 08 scope is TOKENS-ONLY — does NOT scan `apps/**/*.html`. Tailwind arbitrary `bg-[#hex]` violations in app templates are NOT caught (see [[Forbidden Patterns]]). | informational | gate-08 scope |
| AR-gate-12 | Memory rules `feedback_always_build_zero_errors.md` + `feedback_build_must_be_green.md`: no phase ships red. Run `npm run gate:all` before reporting done. | high | memory |

## Composite `gate:all`

```bash
gate-01-lint && gate-02-typecheck && gate-07-token-naming-lint && gate-08-hardcoded-value-lint && gate-09-a11y-baseline && gate-10-noor-naming-lint && gate-12-component-token-scope
```

## Forbidden patterns (caught by gates)
- New `--falcon-color-(blue|gray)-*` tokens — gate-07.
- New `#hex` / `px` / `rgba()` in token CSS — gate-08.
- New Stencil component without `role=` / `aria-*` — gate-09.
- Stencil `tag:` not matching `^falcon-[a-z][a-z0-9-]*$` — gate-10.
- admin-console main.js gzipped > 340 KB — gate-11.
- Token CSS file declared under `:root` (not `:where(falcon-X, .falcon-X, [data-falcon-X])`) — gate-12.

## Gate gaps (recommended new gates)
1. `gate-13-arbitrary-tailwind-lint.mjs` — scan `apps/**/*.html` for `bg-[#hex]`, `border-[#hex]`, `rounded-[Npx]`.
2. `gate-14-inline-style-lint.mjs` — fail on `style="..."` in `*.html`.
3. `gate-15-control-flow-lint.mjs` — fail on `*ngIf`, `*ngFor`, `*ngSwitch` regression.
4. `gate-16-zitadel-direct.mjs` — fail on `zitadel.com` substring.
5. Per-app bundle gates for host-shell + management-console (currently only admin-console covered).

## Brain SK usage protocol
1. Before reporting "done": `npm run gate:all`.
2. Touching tokens: also `npm run gate:build:falcon-ui-tokens`.
3. Touching admin-console code: build prod + `npm run gate:bundle-size-budget`.
4. New Stencil component: gates 09 + 10 + 12 + 03 cover the contract.

## Current state (per memory)
- All 12 gates GREEN.
- 10 grandfathered token-naming violations capped (gate-07 local prints, CI passes on new code only).
- 46 a11y-grandfathered components (gate-09 DEFERRED set).
- admin-console main.js: 568 → 335 KB after PrimeNG removal (gate-11 within budget).

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
