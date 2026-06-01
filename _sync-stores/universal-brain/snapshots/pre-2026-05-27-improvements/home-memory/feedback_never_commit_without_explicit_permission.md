---
name: Never commit without explicit user permission
description: Do not run git commit, git amend, or stage+commit unless the user literally asks to commit; treat all code work as uncommitted until told otherwise
type: feedback
originSessionId: cfc821d6-25b0-41dc-b1e6-5e359ea3a828
---
**Rule:** Never execute `git commit`, `git commit --amend`, or equivalent (including the Task Manager agent auto-committing). Always leave changes staged/unstaged and wait for the user's explicit word before committing. This applies to merge commits, squash commits, and normal commits.

**Why:** The user wants full control over when history is written. Past auto-commits created noise in PRs the user didn't want to ship. Coupled with the existing no-push rule — the user audits a diff locally, then tells Claude when to commit and when to push.

**How to apply:**
- Do all edits, merges, conflict resolution, rebases *without* concluding with a commit.
- If a merge is in progress after resolving conflicts, stop at `git status` showing "All conflicts fixed but you are still merging" and report — don't run `git commit`.
- Only the word "commit" / "stage and commit" / "finalize" from the user authorizes a commit.
- Pair this with `feedback_never_push_without_explicit_permission.md` — "push" authorizes push only, "commit" authorizes commit only.
