# Push Approval Protocol — Phase J

> **Standing rule:** the Brain pipeline NEVER calls `git commit` and NEVER calls `git push`.
> This protocol is the final voice-gated checkpoint that asks the user for explicit approval, then prepares (but does not execute) a polished commit message for the user to copy.

## Trigger

When the Phase C orchestrator (`C:\falcon\Brain\scripts\orchestrator.ps1`) transitions a task into the state `ready_to_push`, it MUST invoke:

```powershell
C:\falcon\Brain\scripts\push-approval.ps1 -TaskId <task-id>
```

The orchestrator passes the same `TaskId` it used to manage `Brain\state\<task-id>\task-state.json`. The protocol script reads that state file to extract the data it needs.

## Script behaviour (deterministic, in order)

1. **Render or reuse the prompt mp3.**
   - Cache path: `C:\falcon\Brain\settings\sound\voice-samples\global\boss-i-want-to-push.mp3`.
   - If the file does not exist, the script POSTs to Kokoro at `http://localhost:8880/v1/audio/speech`.
   - Body: `{ "input": "Boss, I want to push the code, comrade. Confirm?", "voice": "bm_v0george", "speed": 0.78, "volume_multiplier": 4.0, "response_format": "mp3" }`.
   - If Kokoro is unreachable, the script logs the prompt phrase to chat (stdout) as a text fallback and continues with the beep + Read-Host.
2. **Play the prompt mp3** through `[System.Windows.Media.MediaPlayer]` (same pattern as `Brain\scripts\play-alert.ps1`).
3. **Play a long alert beep** — `[Console]::Beep(880, 1500)`.
4. **Read a single line from stdin** with `Read-Host "Push approved? (yes/no)"`.
5. **Branch on the answer** (case-insensitive, trimmed):
   - `yes` / `y` → render the commit message from `commit-message-template.md`, write it to `C:\falcon\Brain\state\<task-id>\proposed-commit-message.txt`, print the path + the copy/run instructions to stdout, exit 0.
   - anything else → append a one-line entry to `C:\falcon\Brain\state\<task-id>\push-rejections.log` with timestamp + raw answer, exit 0.

The script NEVER calls `git`, NEVER opens a network connection except to Kokoro, NEVER touches files outside the two whitelisted areas (`C:\falcon\Brain\push-approval\` is read-only at runtime; the only writes are inside `C:\falcon\Brain\state\<task-id>\` and the single mp3 cache file).

## Inputs the script reads from `task-state.json`

| Field path | Used for |
|---|---|
| `taskId` | Commit `<scope>` and the test-comment block |
| `title` | Commit `<subject>` line |
| `artifacts.codeChanges[]` | Body file list |
| `artifacts.scenariosPath` | Sourcing ChatGPT-authored scenarios |
| `artifacts.qaReportPath` | Sourcing Gemini-authored QA findings |
| `artifacts.planL3Path` | Optional reference for body summary line |
| `notes[]` | Free-form lines folded into the body |
| `history[]` | Detect multi-mindset participation for `Co-authored-by` lines |

If a path is empty or the file is missing the script omits the corresponding section silently — it never blocks the user on missing optional artifacts.

## Outputs

| File | When | Purpose |
|---|---|---|
| `C:\falcon\Brain\settings\sound\voice-samples\global\boss-i-want-to-push.mp3` | First run only | Cached voice prompt |
| `C:\falcon\Brain\state\<task-id>\proposed-commit-message.txt` | On `yes` | The polished commit message — user copies it |
| `C:\falcon\Brain\state\<task-id>\push-rejections.log` | On any non-yes answer | Audit trail of declined push prompts |

## What the script does NOT do (boundaries)

- Does not run `git commit`.
- Does not run `git push`.
- Does not open a PR.
- Does not modify the orchestrator state machine. The orchestrator handles state transitions (`push_approve` / `push_deny`) separately based on this script's exit + the user's follow-up in chat.
- Does not edit any other voice files, `settings.json`, or sibling scripts.

## Failure modes

| Symptom | Behaviour |
|---|---|
| Task folder missing | Throw with a clear message — orchestrator must bootstrap first |
| `task-state.json` missing | Throw with the missing path |
| Kokoro down on first render | Log fallback line to stdout, skip mp3, still beep + prompt |
| Cached mp3 corrupt | MediaPlayer will throw; user re-renders by deleting the cache file |
| User answers blank line | Treated as rejection, logged |

## Operator quick reference

```powershell
# Manual invocation (orchestrator does this automatically when entering ready_to_push):
C:\falcon\Brain\scripts\push-approval.ps1 -TaskId 115329

# After yes:
git commit -F C:\falcon\Brain\state\115329\proposed-commit-message.txt
# (push only on explicit user request)
```
