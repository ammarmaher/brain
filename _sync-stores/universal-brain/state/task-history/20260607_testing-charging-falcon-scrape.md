# Task History — Testing Charging scrape into two admin versions (Falcon)

- **Task ID:** testing-charging-falcon-scrape-2026-06-07
- **Date:** 2026-06-07 (night shift, autopilot)
- **Mode:** ultracode workflows + dynamic agents
- **Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui · feature/contracts-consumed-offered-falcon-tables
- **Status:** COMPLETED · build GREEN (ground-truth nx build admin-console EXIT 0) · NO COMMITS

## Goal
Scrape the origin/main admin-console `testing-charging` OCS QA lab into TWO admin-console versions: (1) `old-test-charging` = exact native replica; (2) `testing-charging` = rebuilt with Falcon custom components (ZERO native HTML div) + full backend DTO/API coverage. Wire both into routes + left sidebar. Admin console only.

## What shipped
- **old-test-charging/** (5 files) — faithful native replica, mechanical rename, scss kept, backend URL preserved, H1 "Old Test Charging Lab · Legacy". Untracked new folder.
- **testing-charging/** — rebuilt: component.ts(949)+.html(734), scss deleted. ZERO native div/button/input/select/table (grep gate 0). falcon-angular-tabs(8)+@switch, falcon-angular-data-table×9 (unique dataKey), falcon-angular-card panels, search/button/dropdown/input-number/status-badge/empty-state/icon/riyal. OnPush+signals+inject+host class. Projection-race fix. FULL DTO coverage (Buckets 21, Balances/Runs/Messages/Reservations/Overview/Account complete). models+api.service untouched (1:1 w/ backend). Shows as M vs HEAD (HEAD==origin/main) = clean native→Falcon diff.
- **Wiring** — app.routes.ts (2 lazy routes, 1 each, no dup; feature was orphaned/unrouted before) + host-shell layout.component.ts (2 NavItems, Account Administration, ungated dev tool, FALCON_ICONS.WALLET).

## Process / verification
- Wave0: 4 parallel read-only dynamic agents (component vocab / backend DTO cross-check / wiring map / reference pattern).
- Build: ultracode workflow plans/testing-charging-scrape/build-workflow.js (runId wf_bcb53925-a05) — WaveA parallel old+new (disjoint folders, git-show source) → WaveB wire → WaveC gate (GREEN iter 1).
- Self-verified: re-ran nx build (EXIT 0) + grep(0 native) + wiring + git footprint + branch==origin/main + no duplicate routes.

## Backend (verified, not assumed)
System-Gateway pass-through; /accounts=Commerce, rest=Charging. FE models = verified 1:1 mirror of backend DTOs → nothing missing. Enable flag must be true in gateway+charging+commerce.

## Caveats / follow-ups
- Live pixel/click verify pending (credential policy; MF remote restart + hard refresh).
- i18n hardcoded English (original un-translated).
- [&>div] arbitrary-variant card-body layout (token-clean, builds green, slightly unusual).
- status→severity mapping heuristic.

## Memory
project_testing_charging_falcon_scrape_two_versions_2026_06_07.md
