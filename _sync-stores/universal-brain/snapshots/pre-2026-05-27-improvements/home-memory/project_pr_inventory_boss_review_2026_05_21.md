---
name: project-pr-inventory-boss-review-2026-05-21
description: "PR shortlist sent for boss review 2026-05-21 — 10 PRs across 6 backend apps for the v0.4 SignalR/realtime wave. Three were newly opened in this session (#41960/41961/41962)."
metadata: 
  node_type: memory
  type: project
  originSessionId: d42b64d0-25f9-429d-b2e3-c1cf187fbf78
---

## Boss-review PR set — 2026-05-21 (v0.4 SignalR/realtime wave)

10 PRs queued for boss review, all targeting `main`, all draft. **Frontend explicitly excluded** per user direction.

| App | PRs |
|---|---|
| Infra (umbrella `Falcon`) | #41882 (realtime infra: docker+k8s+seed+smoke, src `polishing-v0.4-signalr-realtime`) + #41960 (NEW — kafka docker broker config, src `polishing-v0.4-system-gateway-kafka-config`) |
| Core Gateway | #41910 (SignalR `/hubs/*` proxy, src `feature/signalr-realtime-only`) + #41961 (NEW — in-process Hub + order-finalized Kafka consumer Wave 4+4.1, src `polishing-v0.4`) |
| System Gateway | #41912 (proxy, src `feature/signalr-realtime-only`) + #41962 (NEW — Hub + consumer + env-agnostic broker Wave 4+4.1, src `polishing-v0.4`) |
| Commerce | #41883 (order-finalized event publication, src `polishing-v0.4-signalr-realtime`) + #41916 (Hotfix B — `CheckPendingOrderForServiceAsync` tenant-scope, src `hotfix/scope-pending-order-check-by-tenant`) |
| Charging | #41926 (Signal R + fix issues, src `polishing-v0.4`) |
| Comm Realtime | #41880 (initial import + F3 routing fix, src `feature/falcon-on-behalf-routing`) |

**Why**: user asked for one boss-review PR per backend app for the v0.4 wave. Three local-only branches had no PR (umbrella kafka-config + both gateways' `polishing-v0.4`) so we opened #41960/#41961/#41962 to close the gap. Commerce intentionally has 2 PRs because #41916 is an independent security hotfix on its own track.

**How to apply**: if asked about the v0.4 boss-review status, this is the canonical list as of 2026-05-21. The 3 newly-opened ones are draft, no reviewers, no auto-complete — user adds boss as reviewer themselves. The gateways having 2 PRs each is intentional but **fragile** — boss may prefer them merged. If asked to consolidate: merge `polishing-v0.4` into `feature/signalr-realtime-only` per gateway, abandon one PR.

**Excluded**: `falcon-core-provisioning-svc` (only branch `polishing-v0.4` is 0 ahead of main); identity/access/contact-group/templates (only `main`); 3 abandoned PRs #41870/#41871/#41874 (superseded by clean-from-main cuts); 2 already-completed PRs #41879/#41878 (rolled up into #41883/#41926 respectively).

**Operational gotcha**: PR creation requires forcing IPv4 — see [[infra-ado-ipv6-blocked-use-ipv4]].

ADO org: `t2development.visualstudio.com/DefaultCollection/Falcon` (project `Falcon`).
