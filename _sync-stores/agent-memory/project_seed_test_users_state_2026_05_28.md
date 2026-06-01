---
name: project-seed-test-users-state-2026-05-28
description: "Live snapshot 2026-05-28 of seeded mgmt-console (Client userType=2) users: 3 canonical accowner/accadmin/accuser on test-tenant-001 + 12 brand users across 4 tenants (Mitsubishi/Honda/Mercedes/Toyota). All password Admin@1234. 5 login probes returned HTTP 200."
metadata:
  type: project
  originSessionId: shared
---

🟢 RUNTIME-VERIFIED 2026-05-28 (mongosh + curl).

User asked for mgmt-console test users. Pulled fresh ground-truth from `FalconIdentityDb.Users` and probed login.

**15 active Client users (`userType:2, status:2`)** at 2026-05-28 — superset of what [[project_seed_3_clients_2026_05_18]] recorded (Toyota brand has been added since; brand mid-tier role renamed `-user` → `-nodeadmin`).

**Canonical test-tenant-001 set** — see [VAULT] `Brain Outputs\datasets\authority-dataset\07-cross-cutting\test-users.md`:
- `accowner` (role=4 acc-owner) ✅ HTTP 200
- `accadmin` (role=5 acc-admin) ✅ HTTP 200
- `accuser` (role=6 acc-user)

**Brand tenants** — 4 brands × 3 roles:
| Tenant | Owner (role 4) | NodeAdmin (role 5) | User (role 6) |
|---|---|---|---|
| `690000000000000000c10001` Mitsubishi | `mitsubishi-owner` ✅ | `mitsubishi-nodeadmin` | `mitsubishi-user` |
| `690000000000000000c10002` Honda | `honda-owner` | `honda-nodeadmin` ✅ | `honda-user` |
| `690000000000000000c10003` Mercedes | `mercedes-owner` | `mercedes-nodeadmin` | `mercedes-user` |
| `690000000000000000c10004` Toyota | `toyota-owner` | `toyota-nodeadmin` | `toyota-user` ✅ |

✅ = login probed live this session, HTTP 200.

**Standing facts:**
- Password = `Admin@1234` for every seeded user, every env. See `seed-test-users.sh:28`.
- OTP off in local dev compose → single-step login (`stage=4` straight from `/api/auth/login`).
- Username field in `Users` collection is `username` (lowercase), NOT `userName`.
- JWT `urn:zitadel:iam:user:metadata.user-type` = `Mg` (base64 of "2") for all Client users.
- (UPDATE 2026-05-28) Account users now ALSO carry `node-id` metadata = their commerce Main node `_id` (accowner/accadmin → `000000000000000000a11001`; toyota-* → `690000000000000000c10004`). System users do NOT (commerce `SessionProvider.cs:74` throws for Falcon users with node-id). `test-tenant-001` got a NEW seeded Main node `_id=000000000000000000a11001` (string tenant can't use the `_id==ObjectId(tenantId)` convention). See [[project_seed_node_id_metadata_fix_2026_05_28]].
- Login URL for mgmt-console = `http://localhost:4200` (host-shell). admin-console + management-console are MF remotes loaded on demand — don't expect them on :4201/:4202 standalone.

**Still-open cross-tenant leaks** (carry-over from [[project_seed_3_clients_2026_05_18]]): `GetAccountApplicationsHandler` + `GetAccountCommunicationChannelsHandler` lack the `ValidateClientOwnershipAsync` check that `GetMainNodeInfoHandler` got. Multi-tenant isolation testing on those two surfaces is unreliable.

**Realtime caveat at probe time:** `falcon-comm-realtime-1` container reports `unhealthy` 2026-05-28 — do-payment SignalR push may degrade to polling. Other 16 containers Up.
