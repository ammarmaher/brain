---
type: verification-status
cluster: 40-Authority
title: Verification Status — what's verified vs what's not
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md
verified-at: 2026-05-16
audience: future Claude / Ammar / Adnan sessions
purpose: "Answers 'which dataset claims are code-verified vs runtime-verified vs unverified'. Open BEFORE trusting any dataset claim as runtime truth."
---

> [!warning]
> Dataset is **structurally complete** but **runtime-unverified**. Build-green ≠ renders-correctly ≠ PES-gate-fires-at-runtime. Read this BEFORE assuming any "the dataset says X" claim holds in production.

# Verification Status

## Verification level glossary

| Level | Meaning |
|---|---|
| 🟢 Code-verified | Direct from source with file:line citations |
| 🟢 Build-verified | Compiles via `nx build`; no runtime claim |
| 🟡 Structurally checked | Shape correct; behavior untested |
| 🟡 Spot-checked | Sample verified, not all cells |
| 🔴 Unverified | Agent-produced; needs runtime test |
| ✋ Runtime-verified | Actually exercised against live stack |

## Verified ✅

- **🟢 Code-verified**: 6 roles + PES rules · 47 PES key factories · role-edit matrix · 9 status enums · JWT subject contract · gateway routing
- **🟢 Build-verified**: `nx build management-console` GREEN after comms-hub port · scanner 3-pass cycle
- **✋ Runtime-verified (2026-05-16) — backend PES gate, 21/21 PASS**: Direct Identity + PES API calls for all 3 acc-* users × 7 queries each. Confirms: JWT issuance · subject format `u:<sub>@<tenant>` · acc-owner allow matrix · acc-admin explicit-deny on services/contract/IPs · acc-user only contact-group + view-shared allow · app.admin-console deny for all acc-*. Evidence: `C:\Falcon\Brain Outputs\datasets\authority-dataset\_runtime-verification\comms-hub-2026-05-16.md` + `pes-gate-results-2026-05-16.json`.
- **🟡 Structurally checked**: 118 artifacts exist · 0 broken wikilinks · 19 gate questions answer from citations
- **🟡 Spot-checked**: 3 of 19 verification questions cold-tested · 3 of 130 error codes traced · capability map dual citations confirmed

## NOT verified ❌

### Runtime gaps for comms-hub port

- 🔴 Route reachable from host-shell
- 🔴 PES denies acc-admin/acc-user at runtime
- 🔴 acc-owner sees rendered rows
- 🔴 Backend endpoint exists in local stack
- 🔴 Falcon UI Core components render correctly
- 🔴 i18n + RTL behavior

### Agent-produced claims (trust but verify)

- ~130 error codes — only 3 traced
- 25 pitfalls + 13 anti-patterns — examples not all traced
- 45 trigger phrases — none invoked yet in fresh session

## Runtime verify (45 min)

```
docker compose up -d  (in falcon-essentials)
./seed-test-users.sh
nx serve host-shell + nx serve management-console
Login as accowner/accadmin/accuser → verify gates fire
```

Ammar QA-Web agent automates this.

## Honest self-assessment

> The dataset is a high-confidence map; the runtime is unverified territory. Use the map; don't claim you've walked the path.

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md` — comprehensive verification accounting

## Resume trigger

`runtime verify <feature>` — invokes Ammar QA-Web for browser-driven verification.

## See also

- [[_INDEX]] · [[Falcon-vs-Client]] · [[Capability-acc-admin]] · [[Capability-acc-user]]
- All cluster MOCs (structurally complete, runtime-unverified)
