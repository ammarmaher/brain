---
name: "Recurring beep every 5s when user input is needed"
description: When work is blocked waiting on the user, play a long beep and REPEAT it every 5 seconds in the background until the user responds; never beep on routine actions
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
updated: 2026-04-19
---
**Rule:** When work reaches a point where the user MUST take an action (approve, decide, provide credentials, review results, unblock something), start a **recurring beep** — a long tone repeating every 5 seconds — and let it keep beeping in the background until the user responds. Never beep on routine actions.

**Why:** User stated on 2026-04-19:
1. "when you need any action form me make along beeeb and save it in your memory"
2. "save that you need to make a beeb voice not the evry action"
3. "make the beeb recargen evry 5sacnd untel i make the action save it pelase in memory"
4. "long beeeeeeeeb please" — beep duration is 4000 ms (4 seconds), not 1.5 s

The user works across multiple windows and away from the terminal; a single beep is missed. A long recurring tone until acknowledgement is the reliable signal.

## Tone spec (locked)
- **Frequency:** 880 Hz
- **Duration per beep:** 4000 ms (4 seconds) — "long beeeeeeeeb"
- **Gap between beeps:** 5 seconds
- **Continues until:** user responds / provides input / says stop

## How to apply

### When to START the recurring beep
- Agent is blocked pending a user decision (yes/no, approve/reject, pick an option)
- Waiting for explicit "push" / "merge" / "go ahead" permission
- Need a credential, secret, or access the user must provide
- Long-running run just ended and user review is required before next step
- A destructive or irreversible action is about to run and user confirmation is mandatory

### When NOT to beep
- Routine tool calls, internal reasoning, progress reports
- Background agents completing work that does NOT need user input
- Non-blocking status updates
- Quick successive operations

### How to start the recurring beep (PowerShell, Windows)

Launch this in the background, capture the process id so you can stop it later:

```powershell
# Start recurring LONG beep (runs in background until stopped)
$beepJob = Start-Job -ScriptBlock {
  while ($true) {
    [console]::beep(880, 4000)    # 880 Hz tone, 4s — long beeeeeeeeb
    Start-Sleep -Seconds 5         # gap before next beep
  }
}
# Remember the job id so you can stop it: $beepJob.Id
```

Alternative pattern via `run_in_background: true` Bash call (preferred in this harness because the shell id is visible and stoppable):

```bash
powershell -NoProfile -Command "while(\$true){ [console]::beep(880,4000); Start-Sleep -Seconds 5 }"
```
Run that with `run_in_background: true`; keep the returned shell id. **Always** stop it as soon as the user responds.

### When to STOP
- The user sends any message at all → stop immediately
- The user provides the requested input → stop immediately
- The agent resumes non-blocking work → stop immediately

Stop command:
```powershell
Stop-Job -Id <id>; Remove-Job -Id <id>
# or if launched via bash run_in_background:
# use the harness KillShell on the returned shell id
```

### Safeguards
- Only ONE recurring beeper at a time — check for and stop any prior beeper before starting a new one
- On session end, ensure the beeper is stopped so it doesn't linger
- If the user says "stop the beep" / "mute" / similar, stop immediately and do not restart this session

### Single-shot legacy fallback
If spawning a background job is not possible, fire a single `[console]::beep(880, 4000)` at the blocking point — better than silence, but the recurring long-beep pattern above is preferred.
