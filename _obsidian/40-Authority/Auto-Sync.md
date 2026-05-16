---
type: moc
cluster: 40-Authority
title: Auto-Sync Pipeline — drift detection for 62 canonical files
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\12-auto-sync\_INDEX.md
verified-at: 2026-05-16
purpose: "Answers 'which 62 canonical files are watched for drift + how the pre-push hook blocks pushes when they change'. Open before installing the auto-sync hook or reading a drift report."
---

> [!tldr]
> PowerShell scanner + git pre-push hook watching 62 source files across all phases. Drift produces a dated report telling you which Phase to re-run.

# Auto-Sync Pipeline

## 62 watched files

| Phase | Files | Count |
|---|---|---|
| Phase 0 | BuiltInRoleCatalog.cs, falcon-access.registry.ts, pes-account-role-rules.json, seed-test-users.sh, 3 status enum files | 7 |
| Phase 1 | admin + mgmt app.routes.ts + app.config.ts | 4 |
| Phase 2 § 06 | 25 V-rule notes | 25 |
| Phase 2 § 08 | 15 E-* notes | 15 |
| Phase 2 § 09 | 4 BUSINESS_RULES.md files | 4 |
| Phase 2 § 10 | 7 old-ui-dataset 05-PES.md files | 7 |

## Usage

```powershell
# On-demand check
.\scan-authority.ps1 -CheckOnly

# Mark clean after re-running impacted phases
.\scan-authority.ps1 -MarkChecked

# Install pre-push hook
.\pre-push-authority-hook.ps1 -Install -RepoPath <path>

# Emergency bypass
$env:FALCON_AUTHORITY_DRIFT_BYPASS=1; git push
```

## Drill into scripts

- `C:\Falcon\falcon-wiki\scripts\scan-authority.ps1`
- `C:\Falcon\falcon-wiki\scripts\scan-authority.config.json`
- `C:\Falcon\falcon-wiki\scripts\pre-push-authority-hook.ps1`
- `C:\Falcon\falcon-wiki\scripts\INSTALL.md`
- `C:\Falcon\falcon-wiki\scripts\drift-report-TEMPLATE.md`

## SoT entry

`C:\Falcon\Brain Outputs\datasets\authority-dataset\12-auto-sync\_INDEX.md`

## Trigger phrases for re-running phases

| Phase | Trigger |
|---|---|
| Phase 0 | `refresh authority dataset Phase 0` |
| Phase 1 | `refresh feature parity matrix` |
| Phase 2 § 06 | `refresh validation by feature` |
| Phase 2 § 08 | `refresh entity drift by feature` |
| Phase 2 § 09 | `refresh business rules by feature` |
| Phase 2 § 10 | `refresh non-pes gates by feature` |

## See also

- [[Copy-Playbook]] — Phase 3
- [[Falcon-vs-Client]] · all Capability-* and *-by-Feature notes — re-run targets
