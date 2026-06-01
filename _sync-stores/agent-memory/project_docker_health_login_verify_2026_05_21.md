---
name: project-docker-health-login-verify-2026-05-21
description: "2026-05-21 runtime check — 17/17 backend containers Up + all 4 test users login OK (sysadmin/accowner/accadmin/accuser, password Admin@1234, OTP off, stage=4)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 66148c40-e441-43b3-b046-7f590e86d7ab
---

🟢 RUNTIME-VERIFIED 2026-05-21 (full local stack + auth path). User asked "check Docker health + try login + give creds to log in from Falcon".

**Docker (`docker ps -a`):** 17 long-running containers Up, 6 one-shot init containers Exit 0 (expected). Healthchecked containers: pes/schema-registry/kafka/zitadel/redis/postgres/minio/mongo all `healthy`. Restart counts: kafka=4, zitadel=1, all others=0 — both now healthy/stable. Stack matches [[project-backend-stack-bring-up-2026-05-21]] post-patch state — no new fixes needed.

**Login path (Path A, OTP-disabled dev compose):** `POST http://localhost:7777/api/auth/login` returned `isSuccessful=true, stage=4, requiresOtp=false, tokens.accessToken=eyJ…` for all 4 test users (sysadmin/accowner/accadmin/accuser, password `Admin@1234`). JWT decoded sub field present; `urn:zitadel:iam:user:metadata.tenant-id = dGVzdC10ZW5hbnQtMDAx` (base64 "test-tenant-001") for the 3 acc-* users, no tenant-id for sysadmin (system namespace).

**Frontend:** host-shell on `:4200` returning 200 (up). admin-console `:4201` / management-console `:4202` not running standalone — those are Module Federation remotes loaded on demand by host-shell, so this is expected/normal.

**Endpoints worth flagging:** `GET /health` on PES (5296) and Identity (7777) both return 404 — they do NOT expose a Kubernetes-style `/health`. Docker healthcheck on PES uses a different path (working — container reports `healthy`). Zitadel `/debug/healthz` returns 200. Memory entry [[project-backend-stack-bring-up-2026-05-21]]'s "PES /health 200" claim is wrong-path — actual healthcheck lives elsewhere. Login itself is the authoritative liveness signal.

**Recommended creds to log in from the Falcon host-shell UI (`http://localhost:4200`):**
| Username | Password | Role | What they see |
|---|---|---|---|
| `sysadmin` | `Admin@1234` | sys-admin | Full admin-console access |
| `accowner` | `Admin@1234` | acc-owner | Full mgmt-console for tenant `test-tenant-001` |
| `accadmin` | `Admin@1234` | acc-admin | mgmt-console with explicit-deny on services/contract/allowed-ips |
| `accuser` | `Admin@1234` | acc-user | mgmt-console limited to contact-group only |

All 6 seeded users live in [VAULT] `Brain Outputs\datasets\authority-dataset\07-cross-cutting\test-users.md` — also includes `sysops` + `sysprod`. Recipe: [VAULT] `falcon-wiki\00-MOCs\Local-Auth-Recipe.md`. Rule: future docker-health checks should treat docker healthcheck + login endpoint POST as ground truth, not `/health` GETs (which Falcon services don't expose).
