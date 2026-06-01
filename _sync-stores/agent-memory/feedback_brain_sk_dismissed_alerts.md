---
name: Brain SK — dismissed security alerts
description: Two specific 2026-05-13 discovery HIGH-gap alerts that Ammar acknowledged and explicitly told me to stop re-surfacing. Do not raise these again without a fresh prompt from him.
type: feedback
originSessionId: 5d9b5937-e933-4387-b32c-6db67d52ecad
---
# Brain SK — dismissed security alerts (2026-05-13)

Ammar acknowledged and explicitly dismissed these two HIGH-severity findings from the Brain SK v0.1 full-parallel discovery on 2026-05-13:

1. **SQL `sa` credentials in `falcon-core-access-svc/src/T2.PES.API/config/appsettings.qc.json:13` and `…/appsettings.qcfromlocal.json:13`.**
   - Filed as `GAP-001 / GAP-002`, action `ACT-001`.
   - Lives in the Falcon org's Azure DevOps repo (`t2development.visualstudio.com/Falcon/_git/falcon-core-access-svc`), not on public GitHub.
   - Ammar reviewed and chose not to pursue rotation. Treat as an accepted risk.

2. **Anthropic API key on local disk** at `C:\Falcon\Brain SK\Obsidian Vault\Brain SK\.obsidian\plugins\copilot\data.json`.
   - Filed as `GAP-003`, action `ACT-002`.
   - Was blocked by GitHub push protection on the first Brain SK bootstrap push; never reached `origin`. Local dangling commit (post `git update-ref -d HEAD`) is unreachable and will be garbage-collected.
   - Ammar reviewed and chose not to pursue rotation.

## Why this memory exists

**Why:** Ammar explicitly said "discard this alert. I don't want to see it again." on 2026-05-13 after I surfaced both as the top-of-queue action items in the discovery summary.

**How to apply:**
- Do NOT bring these two specific alerts up again in any session.
- Do NOT auto-include them in "top HIGH gaps" or "next moves" rollups.
- They remain documented in the underlying brain artifacts (`outputs/understanding/integration/GAP_LIST.md`, `_scan-state/scan-state.json`) for audit trail — Ammar may or may not have annotated those in-place.
- If a NEW security alert that genuinely looks different (different file, different secret type, or evidence of actual exploitation) shows up, surface it. The dismissal is scoped to these two specific findings, not to security alerts in general.
- If Ammar himself asks about either of them in a future session, answer; just don't volunteer them.
