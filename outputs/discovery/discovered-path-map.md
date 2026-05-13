# Discovered Path Map — Brain SK v0.1 Bootstrap

**Generated:** 2026-05-13
**Bootstrap:** Shared Bootstrap TouchBase (first-pass)
**Project root:** `C:\Falcon\Falcon`
**Brain core:** `C:\Falcon\Brain SK`
**Output root:** `C:\Falcon\Brain Outputs`
**Mirror:** `C:\Falcon\Brain SK\outputs`
**Obsidian vault:** `C:\Falcon\Brain SK\_obsidian`
**Brain repo (remote):** `https://github.com/ammarmaher/brain`

---

## 1. Workspace

| Item | Path | State |
|---|---|---|
| Falcon workspace root | `C:\Falcon` | OK |
| Active project root | `C:\Falcon\Falcon` | OK |
| Nested umbrella repo | `C:\Falcon\Falcon\Falcon` | OK · `main` · clean · `t2development/Falcon` |
| Brain SK core | `C:\Falcon\Brain SK` | OK · not yet a git repo (init pending) |
| Brain Outputs root | `C:\Falcon\Brain Outputs` | OK · created during bootstrap |
| Obsidian vault | `C:\Falcon\Brain SK\_obsidian` | OK · 7 index notes present |

## 2. Backend services (active source — main detection)

| Service | Path | Branch | Dirty | Remote |
|---|---|---|---:|---|
| Identity | `C:\Falcon\Falcon\falcon-core-identity-svc` | `main` | 0 | t2development/Falcon |
| Commerce | `C:\Falcon\Falcon\falcon-core-commerce-svc` | `main` | 0 | t2development/Falcon |
| Charging | `C:\Falcon\Falcon\falcon-core-charging-svc` | `main` | 0 | t2development/Falcon |
| Provisioning | `C:\Falcon\Falcon\falcon-core-provisioning-svc` | `main` | 0 | t2development/Falcon |
| Access | `C:\Falcon\Falcon\falcon-core-access-svc` | `main` | 0 | t2development/Falcon |
| Contact Group | `C:\Falcon\Falcon\falcon-core-contact-group-svc` | `main` | 0 | t2development/Falcon |
| Templates | `C:\Falcon\Falcon\falcon-core-templates-svc` | `main` | 0 | t2development/Falcon |

## 3. Gateways (active source)

| Gateway | Path | Branch | Dirty | Remote |
|---|---|---|---:|---|
| Core Gateway | `C:\Falcon\Falcon\falcon-int-core-gateway-svc` | `main` | 0 | t2development/Falcon |
| System Gateway | `C:\Falcon\Falcon\falcon-int-system-gateway-svc` | `main` | 0 | t2development/Falcon |

## 4. Frontend / portals (active source)

| App | Path | Branch | Dirty | Remote |
|---|---|---|---:|---|
| Web Platform UI | `C:\Falcon\Falcon\falcon-web-platform-ui` | `polishing-v0.4` | 0 | t2development/Falcon |
| Falcon Portal | `C:\Falcon\Falcon\falcon-portal` | `main` | 0 | t2development/Falcon |

> ⚠ `falcon-web-platform-ui` is on `polishing-v0.4`, not the default `main`. TouchBase records this and treats it as the working branch for this session unless overridden.

## 5. Infrastructure / orchestration

| Item | Path | Notes |
|---|---|---|
| Falcon Essentials | `C:\Falcon\Falcon\Falcon\falcon-essentials` | Docker compose, K8s |
| Compose root | `C:\Falcon\Falcon\Falcon\docker-compose.yml` | Local dev stack |

## 6. PRDs · Wiki · Optional sources

| Item | Expected | State |
|---|---|---|
| Architecture wiki | `C:\Falcon\falcon-wiki` (per global CLAUDE.md) | MISSING — WARN |
| PRD folder | `C:\Falcon\PRD` (config default) | MISSING — WARN |

These are optional for the first-pass TouchBase. Marked `missing` per protocol — no guessing. Will be requested only when a task actually needs them.

## 7. Legacy / excluded from active scan

Per `PROJECT_ROOT_DISCOVERY.md §Legacy exclusion` and user instruction #6:

```
C:\Falcon\Falcon\deprecated-falcon-core-identity-svc
C:\Falcon\Falcon\deprecated-falcon-web-platform-ui
C:\Falcon\Brain SK\legacy
C:\Falcon\Brain SK\protocols\legacy-v7
C:\Falcon\Brain SK\skills\legacy-v7  (if present)
```

All matched folders (`legacy*`, `deprecated-*`, `old`, `backup`, `generated-archive`, `previous-brain`, `node_modules`, `dist`, `bin`, `obj`, `.vs`, `.git`) are reference-only.

## 8. Tooling

| Tool | Version | State |
|---|---|---|
| Git | 2.45.1.windows.1 | OK |
| Node | v22.19.0 | OK |
| npm | 11.6.0 | OK (PowerShell exec-policy blocks `npm.ps1`; resolved via `cmd /c npm`) |
| .NET SDK | 9.0.201 | OK |
