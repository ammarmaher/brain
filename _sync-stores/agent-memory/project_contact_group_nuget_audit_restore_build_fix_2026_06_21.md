---
name: project_contact_group_nuget_audit_restore_build_fix_2026_06_21
description: "falcon-core-contact-group-svc main build/CI restore fails on NuGet audit (transitive vulns via MongoDB.Driver 3.7.0); FINAL fix = upgrade MongoDB.Driver/Bson 3.7.0->3.9.0 (no workarounds), PR 42656"
metadata: 
  node_type: memory
  type: project
  originSessionId: 58f3bd32-fbc6-4ba9-a147-6c7b41c9edfe
---

**falcon-core-contact-group-svc `main` (and CI pipeline restore) FAILS TO BUILD** — root cause + fix.

`Directory.Build.props` has `TreatWarningsAsErrors=true` + `NuGetAudit=true` (`NuGetAuditMode=all`, level `low`), so any NuGet audit finding becomes a hard build/restore error. `MongoDB.Driver 3.7.0` pulled two flagged **transitive** deps (confirmed via `project.assets.json`: `MongoDB.Driver/3.7.0 -> SharpCompress 0.30.1` and `-> Snappier 1.0.0`):

- **Snappier 1.0.0** → GHSA-pggp-6c3x-2xmx (HIGH, **NU1903**). Fixed in 1.3.1.
- **SharpCompress 0.30.1** → GHSA-6c8g-7p36-r338 / CVE-2026-44788 (moderate, **NU1902**). Fixed in **0.48.x** (affected `<= 0.47.4`). ⚠️ The GitHub advisory page's "Patched versions: None" field was STALE/misleading — `SharpCompress 0.48.1` exists and the NuGet audit DB treats it as clean. Do NOT trust that field; verify by testing the upgrade.

Code unchanged — advisories newly published. Azure pipeline `Falcon-QA-Contact-Group` run 20260621.2 = "Packages failed to restore", dotnet exit 1.

**FINAL FIX (PR 42656, branch `fix/contact-group-restore-vuln-pin-snappier-suppress-sharpcompress`, commit f566547, +2/-2):** upgrade **`MongoDB.Bson` + `MongoDB.Driver` 3.7.0 → 3.9.0** in `Directory.Packages.props`. 3.9.0 brings non-vulnerable transitive deps — resolved **Snappier 1.3.1** + **SharpCompress 0.48.1**, both clean. **No `NuGetAuditSuppress`, no manual pin** — root cause gone (user explicitly preferred the real upgrade over the workaround: "I don't love workarounds"). VERIFIED in clean `dotnet/sdk:10.0` container under full audit: restore + Release build **0/0**, **151/151** tests, + **runtime smoke vs LIVE Mongo** (separate container on `falcon_default` net, port 7399) = boots, `Hangfire.Mongo 1.13.0` + driver 3.9.0 do real read/writes (`successfully announced`, `jobGraph` sweep), swagger 200, no driver/Mongo errors. Negative control: main (3.7.0) reproduces the exact NU1902/NU1903 restore failure in the same container.

**SUPERSEDED intermediate workaround (commit 001d666, force-pushed away):** had added `CentralPackageTransitivePinningEnabled` + `PackageVersion Snappier 1.3.1` + `NuGetAuditSuppress GHSA-6c8g-7p36-r338`. Kept only as a temporary unblock; replaced by the upgrade because (a) cleaner/smaller diff, (b) removes the unpatched-dep assumption that turned out false.

**Local Docker dev model:** the `contact-group` service in `C:\falcon\Falcon\Falcon\docker-compose.yml` (~L617) runs `dotnet run` against the **volume-mounted live source** (`..:/workspace`), port `7300:8080`, network `falcon_default`. **CURRENT DEPLOYED STATE (2026-06-21):** the contact-group repo working tree is checked out to the **3.9.0 PR branch** `fix/contact-group-restore-vuln-pin-snappier-suppress-sharpcompress` (commit f566547), the temporary `-p:NuGetAuditMode=direct` compose override was **REMOVED**, and the container was recreated (cleared obj/bin) — it now builds under **full audit** with NO override and serves the upgrade (container restore resolves MongoDB.Driver/Bson 3.9.0 + Snappier 1.3.1 + SharpCompress 0.48.1; swagger 200; real Mongo ops via Hangfire.Mongo OK). The compose edit (override-add then override-remove) lived on meta-repo branch `polishing-v0.4-signalr-realtime`. **NOTE: `main` itself is NOT merged yet** — PR 42656 is still open; if anyone resets the repo to `main`, the container would rebuild 3.7.0 and need the override again until merge.

Gotchas: `docker compose up` re-seeds Zitadel via `zitadel-config` init container, which rewrites `src/Falcon.ContactGroup.Api/appsettings.Development.json` (FalconProjectId / WebPlatformUiClientId) — dev-env artifact, do NOT commit. MinIO doesn't implement `PutBucketCors` → one caught benign S3 WRN at startup (`EnsureCorsAsync`), present on main too, unrelated to the driver.

Related: [[project_contact_group_share_403_pes_baseurl_fix_2026_06_20]].
