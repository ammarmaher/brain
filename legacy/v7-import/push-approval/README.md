# push-approval — Phase J of the Falcon Brain pipeline

Voice-gated push checkpoint. The orchestrator stops at `ready_to_push` and asks the boss out loud: "Boss, I want to push the code, comrade. Confirm?" On `yes` it stages a polished commit message for the user to copy. It NEVER calls `git commit` and NEVER calls `git push`.

## Index

| Artifact | Path | Purpose |
|---|---|---|
| Protocol | [PUSH-APPROVAL-PROTOCOL.md](./PUSH-APPROVAL-PROTOCOL.md) | When and how the orchestrator invokes the script; inputs, outputs, boundaries |
| Script | `C:\falcon\Brain\scripts\push-approval.ps1` | The PS 5.1 script that plays the prompt + writes the commit message |
| Template | [commit-message-template.md](./commit-message-template.md) | Conventional Commits format with Claude/ChatGPT/Gemini test-comment block |

## Cached voice prompt

Single mp3 cached at `C:\falcon\Brain\settings\sound\voice-samples\global\boss-i-want-to-push.mp3`. Rendered once via Kokoro (`bm_v0george`, speed 0.78, volume 4.0). To re-render, delete the file — the script re-creates it on next run.

## Example flow

```text
[orchestrator]   task 115329 transitions: qa_passed -> ready_to_push
[orchestrator]   invokes: scripts\push-approval.ps1 -TaskId 115329
                                |
                                v
[push-approval]  reads Brain\state\115329\task-state.json
[push-approval]  plays boss-i-want-to-push.mp3
[push-approval]  beeps 880Hz x 1500ms
[push-approval]  prompt: Push approved? (yes/no)
                                |
        +-----------------------+-----------------------+
        |                                               |
       yes                                            other
        |                                               |
        v                                               v
[push-approval]  writes                       [push-approval]  appends
  Brain\state\115329\                            Brain\state\115329\
    proposed-commit-message.txt                    push-rejections.log
[push-approval]  prints copy/run hint:
  git commit -F "Brain\state\115329\proposed-commit-message.txt"

(user runs git commit themselves, only with explicit "push" do they push)
```

## Non-goals (explicitly out of scope)

- Auto-running `git`. Standing rule: never.
- Editing voices, settings.json, or other scripts.
- Modifying the orchestrator state machine. The orchestrator owns `push_approve` / `push_deny` transitions.
- Touching anything outside `Brain\push-approval\`, `Brain\scripts\push-approval.ps1`, and the single mp3 cache file.
