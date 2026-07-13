# Task history — lib-data-table-first-paint-syncprops-fix (task_e08e9a6d)

**Date:** 2026-07-12 · **Status:** COMPLETED · **No commits (per instruction).**

## What was fixed

`libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` never delivered `[data]`/`[columns]` bound at FIRST change detection: the lazy Stencil definition of `<falcon-table-tw>` (defineFalconTwComponent → dynamic import) had not registered when the first `syncProps` ran (ngAfterViewInit), so property writes became own data-properties that shadow the class accessors installed by the custom-element upgrade. Table stayed on "No records to display" while footer totals rendered. Async-loading consumers re-synced after upgrade → masked; sync/mock-data pages hit it 100% (BSA home, runtime-verified 2026-07-07).

## The fix (wrapper-side, BUG-LIB-first-paint)

1. `syncProps` early-returns while `customElements.get('falcon-table-tw')` is falsy — no pre-upgrade element writes at all.
2. `scheduleFirstSyncAfterUpgrade()` — one-shot `customElements.whenDefined('falcon-table-tw')` subscription; on resolve (and if not `_destroyed`), runs `restorePreUpgradeOwnProps` + a FULL `syncProps` of the latest inputs.
3. `restorePreUpgradeOwnProps(el)` — standard custom-elements pre-upgrade-property fix: for every own property whose key exists on the upgraded prototype chain, capture → delete → reassign so the value travels through the real accessor (recovers writes from any non-wrapper pre-upgrade path).
4. Warm-registry path (element already defined — every table after the first) is unchanged.

Note: the compiled Stencil runtime (dist/components chunk) DOES contain connectedCallback own-prop capture, yet the runtime repro proved first-paint props still get lost — hence the wrapper-side gate, grounded in observed behavior rather than Stencil internals.

## Regression spec

`apps/management-console/tests/falcon-data-table-first-paint.spec.ts` — 3/3 green:
1. Sync-bound data at first CD + late definition → no own-props pre-upgrade; rogue pre-upgrade write recovered; rows/columns (adapted `key` shape) reach the upgraded accessors; no shadowing own-props survive.
2. Warm registry → props land synchronously during first CD.
3. ngOnChanges update flow forwards as before (signal-backed host — plain-field mutation trips NG0100 under targeted-CD tick).

Placement rationale: falcon-ui-core's test target is `stencil test --spec` (Jest, no Angular TestBed); management-console's vitest+analogjs harness is the workspace's working Angular runner and the app is permanent (basic-app was M0-doomed and indeed deleted mid-session). vi.mock neutralises the real lazy loader so the spec controls definition timing.

## Verification evidence

- Spec: 3/3 passed (vitest, management-console config).
- Full management-console suite: 738 passed / 15 failed in 5 files — identical pre-existing failures (contact-group create wizard + wallet-transfer source-regex specs; none import the wrapper). Zero new failures.
- `nx build basic-app` GREEN (20.8s) with lib fix + ready gate removed — run while apps/basic-app still existed.
- eslint clean on all changed files.
- Live browser re-verify deferred: concurrent session executed Wave M0 mid-task (apps/basic-app deleted, host-shell/console files being rewired); demo-angular exists only in the off-limits duplicate workspace. Post-M0 follow-up flagged.

## Concurrent-session events (context for future sessions)

- Wave M0 (basic-app internalization) ran DURING this task: apps/basic-app deleted; feature migrated to `libs/falcon/src/shared-features/basic-app/`; host-shell manifests/layout + both consoles' marketplace routes + tsconfig.base.json modified by that session.
- My bsa-home gate-removal edits (applied + build-verified) died with the deleted app. The migrated `basic-app-home.component.ts:91` still carries the old `ready` gate (their snapshot predates my edit) — now-redundant with the lib fix; left untouched (their WIP), flagged for post-M0 cleanup + that cleanup doubles as the live end-to-end verification of this fix.
- My temporary `basic-app` launch.json entry reverted after the project was de-registered.

## Follow-ups flagged

1. Post-M0: remove the carried-over ready gate in libs/falcon/src/shared-features/basic-app/basic-app-home/basic-app-home.component.ts and runtime-verify first-paint rows against the real Stencil table.
2. Sweep sibling Angular wrappers (falcon-tree, falcon-tree-table, falcon-menu, falcon-wizard, …) for the same pre-upgrade object-prop hole.
3. Observation: stale compiled siblings `define-falcon-tw-component.js` / `define-falcon-component.js` / `define-custom-elements.js` sit next to their .ts sources in libs/falcon-ui-core/src — vite resolves `.js` before `.ts` for extensionless imports (webpack/Angular resolves `.ts` first), a latent divergence hazard.
