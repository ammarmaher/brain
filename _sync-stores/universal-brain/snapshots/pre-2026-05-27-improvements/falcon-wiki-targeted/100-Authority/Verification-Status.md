---
type: verification-status
cluster: 100-Authority
title: Verification Status — what's verified vs what's not
projection-source: _mounts/brain-outputs/datasets/authority-dataset/VERIFICATION-STATUS.md
verified-at: 2026-05-16
audience: future Claude / Ammar / Adnan sessions
purpose: "Answers 'which dataset claims are code-verified vs runtime-verified vs unverified'. Open BEFORE trusting any dataset claim as runtime truth."
---

> [!warning]
> The dataset is **structurally complete** but **runtime-unverified**. Build-green ≠ renders-correctly ≠ PES-gate-fires-at-runtime. Read this BEFORE assuming any "the dataset says X" claim holds in production.

# Verification Status

## Verification level glossary

| Level | What it means |
|---|---|
| 🟢 Code-verified | Read directly from source code with file:line citations |
| 🟢 Build-verified | Code compiles via `nx build`; no runtime claim |
| 🟡 Structurally checked | Shape matches (file count, links resolve); behavior untested |
| 🟡 Spot-checked | Sample of cells/claims verified, not all |
| 🔴 Unverified | Agent-produced or pattern-inferred; needs runtime test |
| ✋ Runtime-verified | Actually exercised against live stack |

## What is verified

### 🟢 Code-verified
- 6 canonical roles + seed `p`-rules (`BuiltInRoleCatalog.cs:79-290`)
- 47 PES key factories (`falcon-access.registry.ts`)
- Role-edit matrix (`BuiltInRoleCatalog.cs:18-75`)
- 9 status enums (`Enums.cs` × 3 services)
- JWT subject contract (`current-subject.builder.ts:27`)
- Gateway routing per console (`app.config.ts`)

### 🟢 Build-verified
- `nx build management-console` after comms-hub port — GREEN
- Scanner end-to-end (3 passes, expected exit codes)
- Drift detection on real change

### ✋ Runtime-verified (2026-05-16) — PES backend gate **21/21 PASS**

Direct API calls to live Identity (`:7777`) + PES (`:5296`) for all 3 acc-* test users × 7 PES queries each:

| Claim | Result |
|---|---|
| Identity issues valid JWT for all 3 acc-* users | ✋ Confirmed |
| JWT.sub = Zitadel user-id (not Mongo `_id`) | ✋ Confirmed |
| PES accepts subject format `u:<JWT.sub>@<tenant-id>` | ✋ Confirmed |
| acc-owner allow on 5 mgmt resources | ✋ all `true` |
| acc-owner deny on admin-console + sys.account | ✋ all `false` |
| acc-admin allow on mgmt-console / org-hierarchy / account | ✋ all `true` |
| acc-admin **explicit-deny** on services / contract / IPs | ✋ all `false` (per `BuiltInRoleCatalog.cs:227,240`) |
| acc-user only allow on contact-group + view-shared | ✋ `true` |
| acc-user deny on everything else | ✋ all `false` |

**Full evidence**: `_runtime-verification/comms-hub-2026-05-16.md` + `pes-gate-results-2026-05-16.json`. The dataset's authority claims are validated at the PES API level.

### 🟡 Structurally checked
- 118 dataset artifacts exist on disk
- Vault wikilinks audit (zero broken)
- 19 verification-gate questions answer from cited files

### 🟡 Spot-checked
- Q11/Q14/Q15 cold-answered with citations
- 3 of ~130 error codes traced to V-rules
- Capability map dual-citations confirmed

## What is NOT verified

### 🔴 comms-hub mgmt-console port — runtime claims

| Claim | Status |
|---|---|
| Route reachable from host-shell | 🔴 |
| PES denies acc-admin at route | 🔴 |
| PES denies acc-user at route | 🔴 |
| acc-owner lands + sees rows | 🔴 |
| Backend endpoint exists in local stack | 🔴 |
| `<falcon-angular-data-table>` renders correctly | 🔴 |
| i18n keys resolve (en + ar) | 🔴 |
| RTL Arabic layout | 🔴 |

### 🔴 Agent-produced claims (trust but verify)

- Cluster 13: ~130 error codes — only 3 traced
- Cluster 14: Add Client Step-5 partial-failure trap — inferred from playbook
- Cluster 15: 25 pitfalls + 13 anti-patterns — pattern correct, examples not all traced
- Cluster 16: 45 trigger phrases — none actually invoked in a fresh session yet

## How to runtime-verify (fastest path)

```powershell
# Bring up backend
cd C:\Falcon\Falcon\falcon-essentials
docker compose up -d
cd zitadel && ./seed-test-users.sh

# Serve apps (separate terminals)
cd C:\Falcon\Falcon\falcon-web-platform-ui
nx serve host-shell                  # port 4200
nx serve management-console          # port 4301

# Test the 3 acc-* users
# - accowner → expect landing + rendered rows at /management-console/comm-mgmt
# - accadmin → expect 403/redirect
# - accuser → expect 403/redirect
```

The **Ammar QA-Web agent** automates this via `mcp__Claude_in_Chrome__*`.

## Honest one-paragraph self-assessment

> The dataset is a high-confidence map; the runtime is unverified territory the map describes. **Use the map; don't claim you've walked the path.** Build-green proves the code compiles. Runtime-verified proves the dataset's claims hold under real conditions. The latter has not been done.

## Drill into Brain Outputs

[Full verification status](../_mounts/brain-outputs/datasets/authority-dataset/VERIFICATION-STATUS.md) — comprehensive verification accounting with consume-the-dataset guidance per trust level

## Resume trigger

`runtime verify <feature>` — invokes Ammar QA-Web agent to drive Chrome through the verification flow for a named feature.

## See also

- [[_INDEX]] — master MOC
- [[Falcon-vs-Client]] — the feature matrix (cells partly inferred)
- [[Capability-acc-admin]] · [[Capability-acc-user]] — gates that should fire at runtime
- All cluster MOCs — structurally complete, runtime-unverified
