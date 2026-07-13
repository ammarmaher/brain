---
name: project-qa-frontend-pipeline-consolidation-2026-06-04
description: "The 3 Falcon-QA-*-UI deploy pipelines are CLASSIC (not repo YAML); consolidated to one Docker-build YAML + restored missing :prod scripts (commit 81dccc86, local-only)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12266b3e-4df8-4263-9aac-1d19c53a5ea9
---

The three **Falcon-QA-{Host-Shell,Admin-Console,Management-Console}-UI** deploy pipelines on `t2development.visualstudio.com` → **Falcon** project are **CLASSIC (designer) Azure DevOps definitions, NOT YAML in the repo**. Each carries its OWN deprecated **NodeTool@0** ("Node.js tool installer", shown as step "Use Node 20.19.x") + CmdLine (agent-side npm build) + Docker@2 + **ECRPushImage@1** (AWS ECR). Because each is an independent object, fixing the Node task on Host-Shell did NOT propagate → the deprecation warning persisted on Admin + Management (the user's symptom: "I fixed host shell but it's not saved for both apps"). The ONLY pipeline YAML in the repo is `.azuredevops/falcon-ui-gates.yml` (PR gates, already on UseNode@1) — a DIFFERENT pipeline. No YAML anywhere in the tree contains ECRPushImage/NodeTool@0 (confirms classic). `az` CLI not installed locally → can't edit defs programmatically from the shell.

**Durable fix (commit `81dccc86`, branch polishing-v0.4, PUSHED to origin 2026-06-04):**
- NEW `.azuredevops/azure-pipelines-frontend-qc.yml` — one source-of-truth pipeline that builds each app INSIDE the multi-stage `docker/Dockerfile.frontend` (Node runs in the Docker `node:20-alpine` stage, NOT on the agent) → **no agent Node task → NodeTool@0 deprecation can never recur on any app**. `appFilter` param (all|host-shell|admin-console|management-console); per-app Docker@2 build + ECRPushImage@1 push.
- `package.json` — restored **`build:{host-shell,admin-console,management-console}:prod` + `build:all:prod`** (`--configuration=production`, mirrors the `:dev` block; host-shell prebuild uses `mf:manifest:prod`). They were MISSING but already invoked by `docker/Dockerfile.frontend:19-24` AND the bundle-budget gate `.azuredevops/falcon-ui-gates.yml:194` (both silently broken before this). All 3 apps have a `production` build config in project.json (admin + mgmt default to it).

**OPEN follow-ups (pipeline NOT yet runnable):** (1) ECR `awsServiceConnection`/`awsRegion`/`ecrRepo{Host,Admin,Management}`/`imageTag` are PLACEHOLDERS — real values live only in the classic defs (read off the ECRPushImage task, or ⋮→Export the pipeline). (2) prod build NOT compile-verified (prod is stricter than the `:dev` builds QA ran; may surface budget/compile errors). (3) adoption = create a New ADO YAML pipeline pointing at the file, then disable the 3 classic ones. User chose "production" config + "one YAML" consolidation.

Related [[reference_falcon_ui_core_build_oom_emfile_fix_2026_06_04]] (same QA runs, OOM fix) · [[reference_static_remote_rebuild_after_app_edit_2026_06_04]].
