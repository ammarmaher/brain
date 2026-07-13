---
name: feedback_fe_no_commit_no_branch_without_instruction_2026_06_22
description: User rule — never commit or create FE branches without explicit instruction; FE work branch is polishing-v0.4
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 05d0591d-7035-447a-be9c-8beddfb044f1
---

On the Falcon web platform (`C:\Falcon\Falcon\falcon-web-platform-ui`), the user wants ALL implementation work left as UNCOMMITTED working-tree edits on the branch they name, so they can review/test before anything is committed. The canonical FE working branch is **polishing-v0.4**.

**Why:** the user reviews changes live before they land; an unintended commit (e.g. someone's `git commit -am` sweeping up uncommitted edits) entangles the work into the wrong branch/commit and is painful to untangle. It already happened: this session's visibility-toggle work got swept into commit `7787b363` on `feat/commerce-applications-visible-details` (a commit about unrelated "sheet 51/52" work), and had to be relocated to `polishing-v0.4`. See [[project_cannot_hide_service_status_canHide_fe_gate_2026_06_22]].

**How to apply:**
- NEVER `git commit` / `git push` FE work unless the user explicitly says "commit"/"push".
- NEVER create a new FE branch unless explicitly told to.
- Default target branch for FE edits = `polishing-v0.4`; if the repo is on a different branch, confirm/relocate rather than working on the wrong one.
- Verify with builds (uncommitted is fine); leave the diff for the user to see.
