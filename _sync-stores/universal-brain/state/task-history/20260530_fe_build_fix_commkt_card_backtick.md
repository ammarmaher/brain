# FE build fix — comm-mkt-card backtick-in-template — 2026-05-30

**Repo:** C:/Falcon/Falcon/falcon-web-platform-ui · **Branch:** night-shift-audit/2026-05-30-0128
**Status:** ✅ FIXED + build-verified green (mgmt + admin) · NO COMMITS

## Ask
"Fix the build issue we have in the frontend, best practice + following our brain skills."

## Diagnosis
Reproduced via `nx build management-console --configuration=development --skip-nx-cache` → **EXIT 1**.

Reported errors (root file):
`apps/management-console/src/app/features/comm-mkt-view/components/card/comm-mkt-card.component.ts`
- NG1002 "Incorrect number of arguments to @Component decorator"
- TS2362 "left-hand side of an arithmetic operation…"
- TS1005 "',' expected", TS2304 "Cannot find name 'start' / 'items' / 'center' / 'md'"
- TS1135 "Argument expression expected"

Cascade: `comm-mkt-view.component.ts:77` NG2012 "Component imports must be standalone…" — because `CommMktCardComponent` (imported on L77) was no longer a valid standalone component once its decorator failed to parse.

## Root cause [CODE]
The component uses an **inline template literal** (`template:` backtick, line 59). Three HTML comments inside that literal referenced CSS/Tailwind tokens wrapped in **literal backticks**:
- L62 `` `self-start` ``
- L64 `` `items-center` ``
- L78 `` `md` ``

Each backtick-pair prematurely **closed then reopened** the JS template string. So `self-start` became `self - start` (arithmetic → TS2362) and `start`/`items`/`center`/`md` became undefined identifiers. The "Cannot find name <tailwind-fragment>" signature is the tell-tale of a broken template literal. The file *looks* fine to a human skim, which is why it slipped past review — the compiler was correct.

Source: introduced by the concurrent comm-mkt-view DoPayment/SoT refactor — see [MEMORY] project_commchannels_marketplace_dopayment_signalr_2026_05_30.

## Fix (minimal, best-practice)
Replaced the decorative backticks in those 3 in-template comments with single quotes:
`'self-start'` / `'items-center'` / `'md'`. Preserves the code-token reading intent; cannot terminate the JS literal. No markup/logic change. One file, three comment-only character swaps.

## Broad-zone sweep
Wrote `scratch-detector2.mjs` — toggles through every inline `template:` literal across mgmt + admin + host and flags any backtick that isn't the legit closing delimiter. Result: **CLEAN** (zero stray backticks). This was the only occurrence.

## Verification (runtime evidence)
`nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**; both `:build:development` bundles "generation complete". Only a pre-existing benign NG8113 (unused RouterLink) warning. host-shell app source unchanged + detector-clean → not rebuilt.

## Notes / honesty
- Build-verified, NOT browser/runtime-verified.
- NO COMMITS (no user instruction to commit; branch is a night-shift scratch branch).
- Pre-existing, out-of-scope, NOT touched: NG0201 standalone-serve issue, the concurrent in-flight comm-mkt-view DoPayment work (now compiling).
