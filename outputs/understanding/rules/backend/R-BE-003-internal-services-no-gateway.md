---
ruleId: R-BE-003
name: Internal services never call each other through gateways
category: architecture
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/*.cs"
    - "src/**/appsettings*.json"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
severity: must
detector:
  type: structural
  patterns:
    - 'HttpClient BaseAddress / Uri / Url string literal containing "system-api.falconhub.space", "core-api.falconhub.space", "platform-api.falconhub.space"'
    - 'HttpClient BaseAddress / Uri / Url string literal containing ":7038", ":7256" (well-known gateway local ports)'
    - 'IConfiguration["..."] key paths matching "*Gateway*Url*", "*GatewayBaseUrl*", "*CoreGateway*", "*SystemGateway*" inside src/**/Infrastructure/**'
  description: Structural scan over Infrastructure client adapters + appsettings — flags any HttpClient/Refit/gRPC base address pointing at a Falcon gateway hostname or well-known gateway port. East-west (service-to-service) traffic MUST hit the target service directly via gRPC or Kafka, never through a gateway.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Replace gateway URL with the direct service hostname (e.g. commerce-svc.cluster.local) OR convert the call to Kafka if the use case allows eventual consistency.'
relatedRules:
  - R-BE-001
  - R-BE-002
source:
  - file: Home/Software-Architecture-Design/High-Level-Architecture.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-003 — Internal services NEVER call each other through gateways ***
*** Source: Falcon Architecture Wiki — High-Level Architecture, Internal Service Communication Rule ***
*** Detector: structural ***

# R-BE-003 — Internal services never call each other through gateways

## What it says

Inside any Falcon backend service, **service-to-service (east–west)** communication MUST go **directly** to the target service via:

1. **gRPC / HTTP** for synchronous calls, using the cluster-internal service hostname (e.g., `commerce-svc.cluster.local`, `provisioning-svc.cluster.local`).
2. **Kafka + Avro** for asynchronous / event-driven workflows.

It is **forbidden** for an internal service to dial:

- `system-api.falconhub.space` (System Gateway)
- `core-api.falconhub.space` (Core Services Gateway)
- `platform-api.falconhub.space` (Platform Services Gateway)
- Local well-known gateway ports (`:7038` Core Gateway, `:7256` System Gateway) from inside another `Falcon.<Service>.*` codebase.

Gateways are the **north–south** boundary for external clients (web platform UI, micro-apps, partner integrations). Routing service-to-service traffic through them adds latency, creates a single point of failure, defeats internal mTLS, and bypasses the direct-call rule explicitly stated in the wiki.

## Why it exists

The Falcon High-Level Architecture wiki states this rule verbatim: "Internal services must not call each other through gateways to avoid coupling, latency overhead, and gateway bottlenecks." Gateways exist to enforce platform concerns (Zitadel token validation, tenant resolution, IP allowlist, rate limits) at the **edge** for external traffic. Internal traffic already runs inside the trusted cluster boundary, already carries its own service identity via mTLS, and already has its tenant context propagated via internal headers / Kafka envelopes. Re-validating through a gateway means each internal hop pays for a full external-grade authorization round-trip, the gateway becomes the bottleneck for fan-out workflows, and a gateway outage cascades into total platform unavailability instead of the affected use-case only.

## Detector strategy

Structural scan across `src/**/Infrastructure/**` per service:

1. Parse every `.cs` file and collect:
   - String-literal arguments to `HttpClient.BaseAddress = new Uri(...)`, `client.BaseAddress = ...`, `services.AddHttpClient(..., c => c.BaseAddress = ...)`, `RestService.For<...>("...")`, gRPC `GrpcChannel.ForAddress("...")`.
   - `IConfiguration[...]` / `IOptions<...>` keys whose name contains `Gateway`, `BaseUrl`, `CoreApi`, `SystemApi`, `PlatformApi`.
2. Parse every `appsettings*.json` and collect any string value whose URL contains the banned hostnames or ports.
3. Match each collected value against the banned-target list (`detectors/gateway-hostnames.json`).
4. Emit a violation for each hit with the source file, line/JSON path, and the offending URL.

The detector lives at `detectors/structural-runner.cs`. Run mode is per-repo, output is a CSV of `{file, line, key, badUrl, suggestedDirectTarget}`.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Infrastructure/Clients/Identity/IdentityServiceClient.cs
// Direct service-to-service via gRPC to the internal hostname.
public class IdentityServiceClient : IIdentityServiceClient
{
    private readonly Identity.IdentityClient _grpc;

    public IdentityServiceClient(IOptions<IdentityClientOptions> options)
    {
        // ✅ cluster-internal hostname, no gateway in the path
        var channel = GrpcChannel.ForAddress(options.Value.GrpcBaseAddress);
        _grpc = new Identity.IdentityClient(channel);
    }
}
```

```json
// File: src/Commerce.Api/config/appsettings.Production.json
{
  "IdentityClient": {
    "GrpcBaseAddress": "https://identity-svc.cluster.local:5001"
  },
  "ChargingClient": {
    "GrpcBaseAddress": "https://charging-svc.cluster.local:5001"
  }
}
```

```csharp
// ✅ Alternative: async via Kafka instead of any HTTP call
await _publisher.Publish(new OrderSubmittedV1(orderId, tenantId), ct);
```

### ❌ Bad

```csharp
// File: src/Commerce.Infrastructure/Clients/Identity/IdentityServiceClient.cs
// ❌ Commerce service calling Identity through the System Gateway.
public class IdentityServiceClient : IIdentityServiceClient
{
    public IdentityServiceClient(HttpClient http)
    {
        // ❌ Gateway hostname — violates R-BE-003
        http.BaseAddress = new Uri("https://system-api.falconhub.space/identity/");
        _http = http;
    }
}
```

```json
// File: src/Commerce.Api/config/appsettings.Production.json
{
  "IdentityClient": {
    "BaseUrl": "https://core-api.falconhub.space/identity"  // ❌ violates R-BE-003
  },
  "ChargingGatewayUrl": "https://platform-api.falconhub.space/ocs"  // ❌ violates R-BE-003
}
```

## Known legitimate exemptions

- **Public webhook callbacks** — if an internal service must receive a callback from an external partner that was registered against a gateway URL, the **inbound** path still flows through the gateway. The rule restricts outbound east–west calls only.
- **Smoke-test / health-check scripts** outside `src/` may use external gateway URLs to verify edge availability.
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-003` with a justification + date.

## Fix recipe

For each violation:

1. Identify the **target service** — which downstream service does this URL actually want to reach?
2. Decide the right transport:
   - **Synchronous + low-latency required** → gRPC. Add the proto to `<Service>.Contracts` (if cross-service) and consume via `GrpcChannel.ForAddress(...)`.
   - **Synchronous + cross-language fallback** → internal HTTP with `Service.cluster.local` hostname.
   - **Eventual consistency acceptable** → Kafka topic + consumer in the target service. Define the event in the producer's `Contracts` project, versioned (`OrderSubmittedV1`).
3. Replace the URL in code and in `appsettings*.json`.
4. Update DI registration to use the new client.
5. Update integration tests (mock the gRPC client / Kafka consumer, not the HTTP gateway).
6. Re-run the detector.

Because the right replacement transport is a design decision, auto-fix is **disabled**. Each violation becomes a row in the Decisions Queue with the suggested target (looked up from the gateway route table).

## Related rules

- [[R-BE-001-clean-architecture-layers]] — clients are infrastructure adapters; this rule narrows where they may dial
- [[R-BE-002-no-app-service-to-app-service]] — sibling rule for in-process composition

## Sources of truth

1. `falcon-wiki/Home/Software-Architecture-Design/High-Level-Architecture.md` — sections "Internal Service Communication Rule", "3.6 Internal Service Communication", "Edge Routing Strategy in Kubernetes"
2. `CLAUDE.md` (project root) — Key Architecture Rules section, rule 3 ("Internal services NEVER call each other through gateways — use gRPC/Kafka directly")
