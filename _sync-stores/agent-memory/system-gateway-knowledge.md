---
name: System Gateway Knowledge
description: Architecture details, integration patterns, and troubleshooting notes for falcon-int-system-gateway-svc
type: project
---

# System Gateway Knowledge

## Identity Integration (added 2026-03-19)

### Root Cause: 404 on `/identity/users`
The System Gateway had a YARP reverse proxy route catching `/identity/{**remainder}` but it forwarded incorrectly to the Identity service. A proper Minimal API endpoint was needed to replace it.

### What Was Added
- `GET /identity/users` Minimal API endpoint in System Gateway
- Calls Identity service at `GET /api/user` (singular — FastEndpoints group prefix)
- Identity HTTP client was already registered as `identity-cluster` in `Bootstrap.cs`
- Identity cluster address fixed from port 7777 to **8080** in `appsettings.json`

### Key Files
| File | Purpose |
|------|---------|
| `MinimalAPIs/UserAPIs.cs` | The `/identity/users` endpoint implementation |
| `Contracts/Services/Responses/Identity/IdentityUserResponse.cs` | Single user DTO |
| `Contracts/Services/Responses/Identity/IdentityUserListResponse.cs` | User list DTO |
| `Bootstrap.cs` | HTTP client registrations (identity-cluster) |
| `appsettings.json` | Cluster addresses (Identity = port 8080) |
| `Program.cs` | `MapMinimalAPIs()` before `MapReverseProxy()` — Minimal APIs win over YARP |

### Pattern Notes
- YARP proxy routes exist alongside Minimal APIs in this gateway
- Minimal APIs take precedence because `app.MapMinimalAPIs()` is called before `app.MapReverseProxy()` in `Program.cs`
- All gateway endpoints are protected by the `FalconOnly` authorization policy
- Identity service FastEndpoints use SINGULAR route prefixes (e.g., `/api/user` not `/api/users`)
- The Identity HTTP client name is `FalconKeys.Clusters.Identity` = `"identity-cluster"`
