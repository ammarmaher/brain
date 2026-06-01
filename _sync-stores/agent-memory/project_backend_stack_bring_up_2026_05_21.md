---
name: backend-stack-bring-up-2026-05-21
description: "2026-05-21 backend bring-up — two service crashes patched (charging missing translation, contact-group NuGet vulnerability NoWarn) — 17/17 Up + login smoke OK"
metadata: 
  node_type: memory
  type: project
  originSessionId: cf30bb9e-69ef-416b-956b-c3218df72184
---

🟢 BACKEND-UP 2026-05-21. Docker 29.4.3 + docker-compose `C:\Falcon\Falcon\Falcon\docker-compose.yml` running 17 long-running containers + 6 properly Exited (0) one-shots. Two services were crashed on first inspection — both patched against mounted source (no image rebuild needed; containers `dotnet run` against `/workspace/...` volume mount).

**Failure 1 — `falcon-charging-1` (Exit 134 / SIGABRT).** Startup throws `InvalidOperationException: Missing translations detected: [ar] WalletNotConfigForTheNode  [en] WalletNotConfigForTheNode` at `ErrorResourceCompletenessValidator.cs:61`. RCA: `FalconKeys.Error.WalletNotConfigForTheNode` static field added at [CODE] `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\Constants\FalconKeys.cs:27` but the matching `<data name="WalletNotConfigForTheNode">` entries were never added to the .resx pair. The validator reflects over ALL public static string fields on `FalconKeys.Error` and demands a translation in every supported culture (`Cultures.SupportedCultures`). Fix: 2 lines appended to each resx after `NoApplicableRate`:
- `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Api\Resources\ErrorMessages.resx` → `"Wallet is not configured for this node"`
- `Falcon\falcon-core-charging-svc\src\Falcon.Charging.Api\Resources\ErrorMessages.ar.resx` → `"المحفظة غير مُعدَّة لهذه العقدة"`

**Why:** Any new field added to `FalconKeys.Error` MUST be paired with both .resx entries before the service can boot — the completeness validator is fail-closed by design.
**How to apply:** Search `Falcon.Charging.Domain.Constants.FalconKeys.Error` whenever you see this exit-134 pattern; cross-check against both .resx files; add missing entries in `name` order to keep the diff diff-friendly.

**Failure 2 — `falcon-contact-group-1` (Exit 1).** `dotnet build` fails with `error NU1902/NU1903 Warning As Error` on `SharpCompress 0.30.1` (moderate) + `Snappier 1.0.0` (high) transitive vulnerabilities. RCA: `TreatWarningsAsErrors=true` + `NuGetAudit=true` in `Directory.Build.props` — same root cause already patched on Identity per [VAULT] `falcon-wiki/00-MOCs/Local-Backend-Bring-Up.md` § Patches §3. Fix:
- `Falcon\falcon-core-contact-group-svc\Directory.Build.props:14` → `<NoWarn>CA1873</NoWarn>` → `<NoWarn>CA1873;NU1902;NU1903</NoWarn>`

**Why:** Quick unblock — proper fix is overriding the vulnerable transitives in `Directory.Packages.props`, but every other Falcon service unblocked the same way.
**How to apply:** When a new Falcon .NET service exits 1 with `NU1902/NU1903 Warning As Error`, copy the Identity pattern into that service's root `Directory.Build.props`. List of services likely affected (all share the same `SharpCompress`/`Snappier` transitive chain via Confluent.Kafka): charging (✓ already had it via shared pattern), commerce, provisioning, system/core-gateway. Recheck if new vulnerabilities appear in future audits.

**Restart procedure used:**
```powershell
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" up -d charging contact-group
```
(No `down -v` — both services pick up source changes on container restart because they run `dotnet run` against the bind-mounted `/workspace`.)

**Verification (per MOC):**
- `docker compose ps` → 17 services Up (5 healthy infra + 12 .NET services)
- `curl http://localhost:5296/pes/health` → 200
- `curl http://localhost:8080/debug/healthz` → 200
- `POST http://localhost:7777/api/auth/login {sysadmin / Admin@1234}` → `isSuccessful: true, stage: 4` (OTP-disabled dev mode, matches MOC expected)

Related: [[local-backend-bring-up]] (MOC), [[falcon-core-charging-svc]], [[falcon-core-contact-group-svc]].
