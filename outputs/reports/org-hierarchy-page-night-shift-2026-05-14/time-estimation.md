# Time Estimation — Brain SK Night Shift (Org Hierarchy Page)

**Date:** 2026-05-14

---

## Discovery phase (actual)

| Phase | Title | Estimated | Actual | Notes |
|:---:|---|---:|---:|---|
| 0 | TouchBase | 30 m | 25 m | clean — paths verified, servers confirmed |
| 1a | HTML source discovery | 60 m | 7.5 m (agent) | parallel agent |
| 1b | React source discovery | 60 m | 6.1 m (agent) | parallel agent |
| 1c | Source behavior test (synthesis) | 30 m | 10 m (orchestrator) | synthesis from 1a + 1b |
| 2 | Existing Angular structure | 60 m | 7.0 m (agent) | parallel agent — yielded 640-line dossier |
| 3 | Falcon component knowledge | 60 m | 6.3 m (agent) | parallel agent |
| 4 | Component mapping + upgrade plan | 45 m | 15 m (orchestrator) | synthesis |
| 5 | Frontend architecture plan | 45 m | 15 m (orchestrator) | synthesis |
| 6 | Backend/API discovery | 45 m | 18 m (orchestrator) | direct investigation |
| 7 | Wave plan | 45 m | 18 m (orchestrator) | synthesis |
| **Discovery total** | — | **8 h** | **~2 h** | 4 agents in parallel + orchestrator synthesis |

## Implementation phase

| Wave | Title | Estimated | Actual | Notes |
|:---:|---|---:|---:|---|
| W4 | Frontend route + page skeleton | 60 m | 20 m | 5 files + 1 edit + build green |
| W5 | Host-shell menu integration | 30 m | 10 m | 1 edit + build green |
| W6 | (Library upgrades) | — | — | skipped — no upgrades in this wave |
| W7 | Page menu shell + state service | 120 m | TBD | agent in flight |
| W8 | Hierarchy tree + node actions | 120 m | TBD | — |
| W9 | Add Client wizard | 150 m | TBD | — |
| W10 | Add User wizard | 120 m | TBD | — |
| W11 | Users table + statuses + actions | 90 m | TBD | — |
| W12 | User details drill-down | 120 m | TBD | NEW vs reference |
| W13 | Phone/email OTP | 90 m | TBD | — |
| W14 | Info-panel edit + Settings | 90 m | TBD | — |
| W15 | List / chart view modes | 150 m | TBD | — |
| W16 | Backend API finalization | 60 m | TBD | — |
| W17 | Visual parity loop | 120 m | TBD | requires user login |
| W18 | Regression / build / tests | 60 m | TBD | — |
| W19 | Final report + Git | 60 m | TBD | — |
| **Implementation total estimate** | — | **~22 h** | **~0.5 h done** | rest queued |

## Wall time analysis

- **Single-pass execution (estimate):** ~24 h (discovery 2 h + implementation 22 h)
- **Realistic with breaks + parity iterations:** 3-4 sessions
- **This session expended:** ~3 h orchestrator + ~30 m of parallel agent time

## Parallelism opportunities exploited

- Discovery agents 1a + 1b + 2 + 3 ran in parallel (saved ~3 h)
- Wave 7 agent dispatched in background while interim reports written (saving ~1 h)

## Bottlenecks anticipated

1. **W7 import cascade** — state service imports wizard internals; skeleton-port pattern mitigates but adds ~30 m
2. **W15 pan/zoom math** — pixel-accurate cursor-anchored zoom can need 1-2 fix iterations
3. **W17 visual parity** — bounded by 5-round limit; could hit ceiling if Falcon component tokens drift from React
4. **User-login gate at W17** — wall clock dependent on user availability

End of time estimation.
