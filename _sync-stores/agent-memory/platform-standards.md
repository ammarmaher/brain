---
name: Platform Standards
description: Cross-service standards and conventions all Falcon agents must enforce consistently
type: project
---

# Falcon Platform Standards

All agents must enforce these across every project:

## API Standards
- **Response wrapper:** `ServiceOperationResult<T>` — every endpoint, every service
- **Error handling:** `FalconException` with `FalconError` codes — never raw exceptions
- **Auth:** Zitadel JWT Bearer with custom claims on all controllers
- **Multi-language:** `MultiLanguageName(En, Ar)` for all user-facing text

## Frontend Styling Standards
- **PrimeFlex-first:** Always use PrimeFlex utility classes in templates (`flex`, `gap-3`, `text-color-secondary`, `p-3`, etc.) before writing SCSS
- **Minimize SCSS:** Only use SCSS for what PrimeFlex cannot express: theme-specific vars (`--color-border`, `--sacand-tree-bg`), custom sizes (`--icon-5xl`), responsive breakpoints, RTL/dark-mode overrides
- **No inline styles:** Never use `[style]` bindings or `style="..."` in templates — use PrimeFlex classes or SCSS
- **No duplicate styling:** If PrimeFlex has the class (e.g., `flex`, `align-items-center`, `gap-3`, `text-xl`, `font-semibold`, `border-circle`, `overflow-auto`), use it instead of SCSS
- **SCSS comment:** Start SCSS files with a comment: `/* Layout-only SCSS — use PrimeFlex utility classes in templates. Only keep what PrimeFlex cannot express. */`

## Code Standards
- .NET 10 with file-scoped namespaces, implicit usings
- Primary constructors for DI
- Records for DTOs, commands, queries, events
- `IRepository<T>` for all data access — never direct MongoDB
- Config in `appsettings.json` — never hardcode secrets

## Inter-Service Communication
- Kafka + Avro for all async events between services
- Gateways forward JWT via `JwtForwardingHandler`
- Commerce → Charging: wallet/order events
- Commerce → Provisioning: service lifecycle events

## Auth Policies
- Core Gateway: `ClientOnly` policy (tenant users)
- System Gateway: `FalconOnly` policy (admin users)

## Gateway Architecture (YARP + Minimal APIs)
- Gateways use YARP reverse proxy alongside Minimal API endpoints
- Minimal APIs take precedence over YARP because `app.MapMinimalAPIs()` is called before `app.MapReverseProxy()` in Program.cs
- When YARP proxy routes forward incorrectly, create explicit Minimal API endpoints instead
- HTTP clients for backend services are registered in `Bootstrap.cs` using cluster names from `FalconKeys.Clusters.*`

## Identity Service Conventions
- Identity service (Zitadel-backed) runs on port **8080**
- FastEndpoints use **singular** route prefixes (e.g., `/api/user` not `/api/users`)
- Identity HTTP client name: `FalconKeys.Clusters.Identity` = `"identity-cluster"`
