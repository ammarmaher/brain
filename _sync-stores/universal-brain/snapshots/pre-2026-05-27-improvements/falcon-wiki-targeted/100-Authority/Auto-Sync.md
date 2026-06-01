---
type: moc
cluster: 100-Authority
title: Auto-Sync Pipeline — drift detection for 62 canonical files
projection-source: _mounts/brain-outputs/datasets/authority-dataset/12-auto-sync/_INDEX.md
verified-at: 2026-05-16
purpose: "Answers 'which 62 canonical files are watched for drift + how the pre-push hook blocks pushes when they change'. Open before installing the auto-sync hook or reading a drift report."
---

> [!tldr]
> A PowerShell scanner + git pre-push hook watching 62 canonical source files across all phases. On drift, blocks pushes and emits a dated drift report at `falcon-wiki/100-Authority/_drift-YYYY-MM-DD-HHmm.md` pointing at which Phase to re-run.

# Auto-Sync Pipeline

## What it watches (62 files)

| Phase | Source files watched | Count |
|---|---|---|
| Phase 0 (Foundation) | `BuiltInRoleCatalog.cs`, `falcon-access.registry.ts`, `pes-account-role-rules.json`, `seed-test-users.sh`, 3 status enum files | 7 |
| Phase 1 (Feature Parity) | admin + mgmt `app.routes.ts` + `app.config.ts` | 4 |
| Phase 2 § 06 (V-rules) | 25 V-rule notes at `Brain SK/_obsidian/30-Validation/V-*.md` | 25 |
| Phase 2 § 08 (Entity drift) | 15 E-* notes at `Brain SK/_obsidian/40-API/E-*.md` | 15 |
| Phase 2 § 09 (Business rules) | 4 `BUSINESS_RULES.md` files in `Brain Outputs/prd/modules/*/` | 4 |
| Phase 2 § 10 (Non-PES gates) | 7 old-ui-dataset `05-PES.md` files | 7 |
| **Total** | | **62** |

## How it works

1. Scanner computes SHA-256 of each watched file
2. Compares against last-known hash in `falcon-wiki/scripts/scan-authority.config.json`
3. For each changed file, identifies which Phase needs re-running (from `phaseTriggers` map)
4. Emits drift report from `drift-report-TEMPLATE.md`
5. Exit code 0 (clean) or 1 (drift detected)

## How to use

```powershell
# On-demand drift check
powershell -ExecutionPolicy Bypass -File C:\Falcon\falcon-wiki\scripts\scan-authority.ps1 -CheckOnly

# After verifying drift is intentional + re-running impacted phases
powershell -ExecutionPolicy Bypass -File C:\Falcon\falcon-wiki\scripts\scan-authority.ps1 -MarkChecked

# Install pre-push hook in a repo
powershell -ExecutionPolicy Bypass -File C:\Falcon\falcon-wiki\scripts\pre-push-authority-hook.ps1 -Install -RepoPath C:\Falcon\Falcon\falcon-web-platform-ui

# Emergency bypass
$env:FALCON_AUTHORITY_DRIFT_BYPASS=1; git push
```

## Trigger phrases

When the drift report lists Phases, use these to resume:

| Phase | Trigger |
|---|---|
| Phase 0 | `refresh authority dataset Phase 0` |
| Phase 1 | `refresh feature parity matrix` |
| Phase 2 § 06 | `refresh validation by feature` |
| Phase 2 § 08 | `refresh entity drift by feature` |
| Phase 2 § 09 | `refresh business rules by feature` |
| Phase 2 § 10 | `refresh non-pes gates by feature` |

## Drill into scripts

- `falcon-wiki/scripts/scan-authority.ps1` — the scanner
- `falcon-wiki/scripts/scan-authority.config.json` — watched files + hashes
- `falcon-wiki/scripts/pre-push-authority-hook.ps1` — git hook installer
- `falcon-wiki/scripts/INSTALL.md` — setup instructions
- `falcon-wiki/scripts/drift-report-TEMPLATE.md` — report template

## SoT entry note

[12-auto-sync/_INDEX.md](../_mounts/brain-outputs/datasets/authority-dataset/12-auto-sync/_INDEX.md) — full file index + integration notes

## See also

- [[Copy-Playbook]] — Phase 3 (what to do when drift forces a re-port)
- [[Falcon-vs-Client]] — the master feature matrix
- All Capability-<role> and *-by-Feature notes — re-run targets when drift is reported
