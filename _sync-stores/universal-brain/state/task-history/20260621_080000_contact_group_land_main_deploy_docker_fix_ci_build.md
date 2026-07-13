# Contact-group — land on main, deploy in Docker, fix CI restore build failure (PR 42656)

**Date:** 2026-06-21 · **Agent:** claude · **Result:** ✅ COMPLETED

## Request
1. Land `falcon-core-contact-group-svc` on `main`, deploy in Docker for local testing, with **zero build issues**.
2. (Follow-up) The CI pipeline cannot build `main` (screenshot: Azure `Falcon-QA-Contact-Group` run 20260621.2 — "Packages failed to restore", dotnet exit 1). Fix it and open a PR.

## What was done
- Repo moved to `main`, fast-forwarded to `origin/main` `de2c1a3` (incl. merged PR 42589). Prior user WIP `stash@{0}` preserved, untouched.
- Diagnosed build failure: `Directory.Build.props` `TreatWarningsAsErrors=true` + `NuGetAudit` (mode `all`) promotes audit findings to errors. `MongoDB.Driver 3.7.0` pulls transitive `Snappier 1.0.0` (GHSA-pggp-6c3x-2xmx, HIGH, NU1903) and `SharpCompress 0.30.1` (GHSA-6c8g-7p36-r338 / CVE-2026-44788, moderate, NU1902). Confirmed parents via `project.assets.json`.
- **Docker deploy (test, on pristine main):** added local-only `-p:NuGetAuditMode=direct` to the `contact-group` service `command:` in `C:\falcon\Falcon\Falcon\docker-compose.yml` (~L617). Container `falcon-contact-group-1` UP on host `:7300`, `dotnet run` built clean inside container, `swagger -> HTTP 200`, 15 endpoints, Hangfire + Kafka consumer running. Runtime byte-identical to main. (Benign: MinIO doesn't support PutBucketCors → one caught startup WRN; bucket accessible.)
- **Proper CI fix (PR 42656):** branch `fix/contact-group-restore-vuln-pin-snappier-suppress-sharpcompress` off main, commit `001d666`:
  - `Directory.Packages.props`: `CentralPackageTransitivePinningEnabled=true` + `PackageVersion Snappier 1.3.1` (real patch; resolved at 1.3.1).
  - `Directory.Build.props`: `NuGetAuditSuppress` GHSA-6c8g-7p36-r338 (no patch exists; zip-slip `WriteToDirectory` path unreachable via MongoDB.Driver).
  - +16 lines / 0 deletions, 2 build-config files only.
- **Verified:** full-audit (`NuGetAuditMode=all`) `dotnet build Falcon.ContactGroup.sln` = **0 warn / 0 err** (API+Tests); `dotnet test` = **151/151 pass**.
- Pushed; **PR 42656 active** → main. Working tree returned to pristine `main` (fix lives on the pushed branch); container left running for the user's test.

## Open items for user
1. Review + merge **PR 42656**: https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-contact-group-svc/pullrequest/42656
2. After merge: revert the local `docker-compose.yml` `-p:NuGetAuditMode=direct` override (meta-repo branch `polishing-v0.4-signalr-realtime`, uncommitted) — main then builds under full audit everywhere.
3. `appsettings.Development.json` shows modified after `docker compose up` (zitadel-config re-seed rewrites Zitadel IDs) — dev-env artifact, not committed.

Memory: `project_contact_group_nuget_audit_restore_build_fix_2026_06_21.md`.
