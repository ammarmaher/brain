---
name: No commit / no push — strict (long-term)
description: User issued a hard, long-term order on 2026-05-02 — never commit or push without their explicit instruction in the current message. Reaffirms the existing two memories with a stricter tone.
type: feedback
originSessionId: 3fb49428-748f-48ec-b97e-1ae4f0097fa7
---
**Rule.** Never `git commit`, never `git push`, never open a PR unless the user explicitly says "commit" or "push" *in the current request*. "Do it all" or any prior session approval does NOT carry over.

**Why.** User issued this as an explicit long-term order on 2026-05-02 after the orchestrator interpreted "do it all" as commit-permission. The user wants every commit and every push to be a deliberate, in-the-moment authorisation — not inferred from any prior turn or any standing scope.

**How to apply.**
- Default state for any local repo work: leave changes staged or unstaged. Do NOT commit.
- Even if the user said "commit" earlier in the same session, do not commit again unless they say "commit" again.
- "Do it all" / "do everything" / "go ahead" / "proceed" never includes commit or push.
- This rule supersedes any previous session-level authorisation. The two existing memories (`feedback_never_commit_without_explicit_permission.md`, `feedback_never_push_without_explicit_permission.md`) are reaffirmed and intensified by this entry.
- If a task plan lists "commit" as a step, the orchestrator must STOP and ask "should I commit?" before executing it — every time.
- Applies project-wide. Every Ammar / Adnan agent must obey.
