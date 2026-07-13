---
type: roadmap
slug: basic-app-waves-f4-f9
prd-implements: [PRD-06]
status: code-complete
created: 2026-07-12
---
*** Roadmap note — remaining Basic App waves (tracker SoT: Brain Outputs module 06 ORCHESTRATION_STATE.md) ***

# Feature — Waves Roadmap (F4–F9)

| Wave | Feature | Notes |
|---|---|---|
| F4 | Scheduled lifecycle | Edit/Delete scheduled sends; grid state transitions |
| F5 | Voice compose | IVR send flow; E5 IVR canvas promotion decision at wave time |
| F6 | Voice details | [[Basic Send Voice Details]] |
| F7 | WA conversation | N6/N9/N10 feature-local compositions |
| F8 | Voice conversation | |
| F9 | Marketplace surface | Tile/entry polish in Marketplace & Applications .Mng |
| W-PES | PES gating | Backend seeds required — flagged, not FE-only |
| W-DARK | Dark mode pass | SoT has no dark design; token-driven |

All waves build under **`apps/basic-app`** per [[Architecture Ruling 2026-07-12]]; one builder agent
at a time; every wave gates on builds + specs + lint + zero-native-HTML greps; live verification
against the user-run watch (:4200).

Links: [[00 Basic App MOC]]

## Outcome (2026-07-12)
All build waves DONE under the B1 basic-only ruling — F4 lifecycle · F5 voice compose (basic, via B1) ·
F6 voice details (channel-aware extension) · F7+F8 conversation (one component) · F9 marketplace card
(generic comm-mkt `open`/`canOpen` flag — the sanctioned generic-flag pattern, flagged for review).
Evidence: 1038 admin-console tests · basic-app lint 0 · zero-native-HTML greps. Live verification of
F3+ pends the user's watch restart. Still flagged: W-PES (backend seeds) · W-DARK · L-track ·
optional generic `showTime` date-picker flag.
