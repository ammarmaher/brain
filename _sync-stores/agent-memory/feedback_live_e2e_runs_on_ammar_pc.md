---
name: live-e2e-runs-on-ammar-pc
description: "Standing authorization — run all Falcon live/end-to-end runtime tests directly on Ammar's PC (this local C:\\Falcon Windows machine). Don't ask permission; just run them and report honestly."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f591004b-f96c-44dc-9e29-9e5602445527
---

# Live E2E tests always run on Ammar's PC — don't ask, go ahead

All Falcon live / end-to-end runtime verification runs on **Ammar's PC** = this local Windows machine (working dir `C:\Falcon`), which hosts the Docker stack (≈18 containers), the Zitadel/Mongo seeds, and the `C:/falcon/qa/runs/` evidence bundles.

**Why:** User explicitly designated this machine as the E2E runner and granted standing authorization on 2026-05-29 ("Make sure you are always testing in Ammar PC … it should run on Ammar's PC always. Don't ask me. You can go ahead."). It is the only place wired to bring the full stack up and exercise real JWTs through the real gateway/PES.

**How to apply:**
- When a task needs runtime/E2E evidence (the kind I'd otherwise flag as "build+unit only, not runtime"), bring up / use the local Docker stack here and run the test directly — fresh upload, seed, replay script, browser drive, etc.
- Do NOT ask the user for permission to run live tests — proceed. (This is the one place the "ask before risky shared-system actions" default is pre-authorized, because it's a local dev stack.)
- Still report results honestly with the real verification level (per the no-false-QA-claims rule). Local-stack bring-up may mount source — rebuild/restart the relevant service container so it picks up uncommitted code before trusting a result.
- Commit/push rules are unchanged — running live tests is authorized; committing still needs an explicit "commit".

Related: [[project_docker_health_login_verify_2026_05_21]] · [[project_backend_stack_bring_up_2026_05_21]] · [[project_contact_group_contact_field_alias_collapse_fix_2026_05_29]].
