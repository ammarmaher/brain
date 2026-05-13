*** Job: context-aware-alerts ***
*** Make voice alerts state-truthful â€” never claim "tests passed" when no tests ran ***
*** Triggered by: "fix all things night mode" / "fixing night" / "night fix" / "run night job: alerts" ***

# Job: Context-Aware Voice Alert Routing

## Status

DONE (2026-05-01) â€” to be executed at user's next "night mode" trigger.

## Goal

When the Brain skill (or any agent) plays a voice alert, the chosen phrase MUST match what actually happened. No phrase that claims "validation reported", "tests passed", or "review complete" may play unless that state is currently true.

## Trigger phrases (any of these from the user activates this job)

- `fix all things night mode`
- `night mode`
- `fixing night`
- `night fix`
- `run night job: alerts`
- `tonight, do the alerts job`

When the user says any of the above, Adnan loads this file and runs the steps in order. No further confirmation needed â€” user has pre-approved the design below.

## Pre-approved design

### Layer 1 â€” phrase claims sidecar

Create `C:\falcon\Brain\assets\voice-alerts-claims.json`:

```jsonc
{
  "chatgpt": {
    "finished": {
      "01": { "claims": [] },
      "02": { "claims": [] },
      "03": { "claims": ["validated"] },
      // ... one entry per phrase, claims = subset of:
      //   "tested" | "reviewed" | "deployed" | "validated" | "tests_authored" | "approved"
    },
    "deployment": { /* same shape */ },
    /* ... 8 categories x 3 mindsets ... */
  }
}
```

Audit pass: open `voice-alerts.json`, read each of the 240 phrases, tag with the claims it asserts.

### Layer 2 â€” state-aware picker

`C:\falcon\Brain\scripts\play-alert-context.ps1`:

```powershell
param(
    [Parameter(Mandatory)] [ValidateSet('chatgpt','claude','gemini')] [string]$Mindset,
    [Parameter(Mandatory)] [ValidateSet('taskReceived','deepAnalysis','processing','deployment','testing','finished','blocked','waitingForInput')] [string]$Category,
    [bool]$Tested,
    [bool]$Reviewed,
    [bool]$Deployed,
    [bool]$Validated,
    [bool]$TestsAuthored,
    [bool]$Approved,
    [string]$AlertsRoot = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [string]$ClaimsJson = 'C:\falcon\Brain\assets\voice-alerts-claims.json'
)
# *** Pick phrase whose claims are ALL currently true; fall back to claim-free phrases ***
# *** Then play the matching mp3 from $AlertsRoot/$Mindset/$Category/NN.mp3 ***
```

Behavior:
- For each of the 10 phrases in `<mindset>/<category>`, look up its claims.
- A phrase is **eligible** if EVERY claim in its `claims` array is currently true (per the flags passed).
- Phrases with empty `claims` are always eligible.
- Pick a random eligible phrase; play the corresponding mp3.
- If no phrase is eligible for the given state, fall back to the claim-free subset.

### Layer 3 â€” script-to-trigger wiring

| Action / script | Call at start | Call at end (success) |
|---|---|---|
| `ask-chatgpt.ps1` | `-Mindset chatgpt -Category taskReceived` | `-Mindset chatgpt -Category finished -Reviewed:$false -Deployed:$false -Tested:$false` |
| `ask-gemini.ps1` | `-Mindset gemini -Category taskReceived` | `-Mindset gemini -Category finished -Reviewed:$true` (Gemini IS the verification layer) |
| Bug fix (Claude, no tests) | `-Mindset claude -Category processing` | `-Mindset claude -Category deployment -Tested:$false -Reviewed:$false` |
| Bug fix + tests passed | `-Mindset claude -Category processing` | `-Mindset claude -Category finished -Tested:$true` |
| `render-all-sequential.ps1` | `-Mindset claude -Category processing` | `-Mindset claude -Category deployment -Tested:$false` |
| Kokoro down / API failure | â€” | `-Mindset <current> -Category blocked` |
| User input required | â€” | `-Mindset <current> -Category waitingForInput` |

Wire these directly into the existing scripts â€” add a small block at the top/end that invokes `play-alert-context.ps1` with the matching flags. Keep wiring optional via a `-Quiet` switch so scripts can run silently when desired.

### Layer 4 â€” Skill.md update

Append the trigger map + claims taxonomy to `C:\falcon\Brain\Skill.md` so any agent reading the skill knows the routing rules.

## Execution checklist (the night job runs these in order)

1. **Audit & tag** â€” read `voice-alerts.json`, write `voice-alerts-claims.json` with claims per phrase. Be conservative: tag a phrase only if it explicitly states the claim. (~30 min, may be parallelized via 3 agents â€” one per mindset.)
2. **Build picker** â€” write `play-alert-context.ps1` per the spec above. (~10 min)
3. **Wire scripts** â€” add alert calls to:
   - `Brain\scripts\ask-chatgpt.ps1`
   - `Brain\scripts\ask-gemini.ps1`
   - `Brain\scripts\render-all-sequential.ps1`
   - `Brain\scripts\render-mindset.ps1`
   - `Brain\scripts\render-mindset-half.ps1`
   - `Brain\scripts\test-keys.ps1`
4. **Update Skill.md** â€” append the trigger table + claims taxonomy.
5. **Smoke test** â€” call `play-alert-context.ps1 -Mindset claude -Category finished -Tested:$false` 5 times, confirm no test-claiming phrase ever fires. Call again with `-Tested:$true` to confirm the full pool is eligible.
6. **Commit message** â€” local commit only (per user's `feedback_never_commit_without_explicit_permission.md`): `feat(brain): context-aware voice alerts â€” phrases filtered by actual state`. DO NOT push.

## Out of scope for this job

- Re-rendering any mp3 (the existing 240 stay; we just route them smarter).
- Changing voice/speed/volume.
- Adding new categories or phrases.
- Touching any service outside `Brain/` and `Brain/settings/sound/`.

## Done definition

- `play-alert-context.ps1` exists and works.
- `voice-alerts-claims.json` covers all 240 phrases.
- All 6 listed scripts call the picker at the right moments.
- Smoke test passes.
- Skill.md updated.
- Local commit landed.
- One random `claude/finished` alert with `-Tested:$false` plays at the end as confirmation â€” and it must NOT be one of the test-claiming phrases.
