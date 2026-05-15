---
ruleId: R-BE-007
name: No hardcoded secrets — use appsettings + IOptions + user-secrets / Key Vault
category: secrets
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
    - "**/appsettings.Development.json"
severity: must
detector:
  type: regex
  patterns:
    - '(password|pwd|secret|api[_-]?key|apikey|access[_-]?token|client[_-]?secret|private[_-]?key|connection[_-]?string|conn[_-]?str)\s*[:=]\s*"[^"${}<][^"]{6,}"'
    - 'mongodb(\+srv)?://[^"\s]*:[^"\s@/]{4,}@'
    - 'Server\s*=\s*[^;"]+;\s*(User\s*Id|Uid)\s*=\s*[^;"]+;\s*Password\s*=\s*[^;"]+'
    - 'Endpoint\s*=\s*sb://[^;"]+;\s*SharedAccessKey(Name)?\s*=\s*[^;"]+'
    - 'AccountKey\s*=\s*[A-Za-z0-9+/=]{40,}'
    - 'Bearer\s+[A-Za-z0-9._-]{30,}'
    - 'AKIA[0-9A-Z]{16}'
    - 'sk_(live|test)_[A-Za-z0-9]{20,}'
  exemptPatterns:
    - '"\$\{[A-Z_]+\}"'
    - '"<[^>]+>"'
    - '"REPLACE_ME"'
    - '"changeme"'
    - 'GetValue<string>\(\s*"'
    - '\.Configuration\["'
    - 'IOptions<'
    - 'IOptionsSnapshot<'
  description: Regex scan over source files + appsettings JSON. Flags string literals that look like secrets (passwords, API keys, tokens, connection strings with embedded credentials, AWS access keys, Stripe keys, Azure Service Bus / Storage keys). Placeholder tokens (`${ENV_VAR}`, `<placeholder>`, `REPLACE_ME`) and reads from `IConfiguration` / `IOptions<T>` are exempt.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Move the literal to an IOptions<T>-bound config section in appsettings.json with a placeholder value. Real value goes to user-secrets (dev) or Key Vault (prod). Never commit the real value.'
relatedRules:
  - R-BE-001
source:
  - file: CLAUDE.md
    location: project-root
  - file: Home/Software-Architecture-Design/Security-Architecture.md
    location: wiki
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-007 — No hardcoded secrets in source or committed config ***
*** Source: Falcon Platform Standards — CLAUDE.md + Security Architecture Wiki ***
*** Detector: regex ***

# R-BE-007 — No hardcoded secrets

## What it says

No source file (`.cs`) and no committed configuration file (`appsettings.json`, `appsettings.Production.json`, `appsettings.Staging.json`) inside a Falcon backend service MAY contain a literal secret value. A "secret" includes:

- Passwords, API keys, access tokens, client secrets, private keys, signing keys
- Database connection strings carrying embedded credentials (Mongo, SQL Server, PostgreSQL)
- Azure / AWS service keys (Service Bus, Storage, S3, SQS)
- Vendor SDK keys (Stripe `sk_live_*`, Twilio `AC*`, etc.)
- Bearer tokens longer than 30 characters
- Zitadel / Vault credentials

Secrets MUST be:

1. **Declared as a typed options class** bound from configuration via `IOptions<T>` / `IOptionsSnapshot<T>` / `IOptionsMonitor<T>`.
2. **Referenced in `appsettings.json`** by section name only — with the value as a placeholder (`"${ZITADEL_CLIENT_SECRET}"`, `"<set-in-key-vault>"`, or empty string).
3. **Filled at runtime** from:
   - **Local development** → `dotnet user-secrets`
   - **Staging / Production** → Azure Key Vault, AWS Secrets Manager, or HashiCorp Vault (per environment)
   - **Container / CI** → environment variables passed via the deployment manifest (never baked into the image)

The standard is locked in `CLAUDE.md` Platform Standards: "Config: Never hardcode secrets — use `appsettings.json` sections."

## Why it exists

A literal secret in a `.cs` file or a committed `appsettings.json` is leaked the moment the repo is cloned, branched, mirrored to a code-search tool, or screenshared. Falcon's security architecture (Security Architecture wiki, sections 4.1 and 4.2) is built around server-side secret stores (Vault for micro-app API keys, Key Vault for service credentials, Zitadel-managed OIDC client secrets). Letting secrets co-exist with code defeats every one of those server-side guarantees and creates an audit-trail-free path for rotation — once a key is in git history, rotation requires force-push and full-repo rewrite, which is rarely done in practice. The Azure DevOps password-leak incident on the PES SQL `sa` user (Brain SK dismissed-alerts memory) is the standing reminder that this rule exists for real reasons, not hypothetical ones.

## Detector strategy

Regex scan over `src/**/*.cs` + `src/**/appsettings*.json` (excluding `appsettings.Development.json` which is git-ignored). Eight pattern families, all case-insensitive:

1. **Named-secret key with string-literal value** — `password|pwd|secret|api_key|access_token|client_secret|private_key|connection_string` followed by `=` or `:` and a quoted value of length ≥ 6 that doesn't start with `$`, `<`, `{`.
2. **MongoDB URI with credentials** — `mongodb://user:pass@host` or `mongodb+srv://user:pass@host`.
3. **SQL Server connection string with credentials** — `Server=...;User Id=...;Password=...`.
4. **Azure Service Bus connection** — `Endpoint=sb://...;SharedAccessKey=...`.
5. **Azure Storage account key** — `AccountKey=<base64 ≥ 40 chars>`.
6. **Bearer token literal** — `Bearer <base64-ish ≥ 30 chars>`.
7. **AWS access key** — `AKIA[0-9A-Z]{16}`.
8. **Stripe key** — `sk_(live|test)_[A-Za-z0-9]{20,}`.

Each hit is checked against exempt patterns:

- Placeholder shape `"${VAR}"`, `"<placeholder>"`, `"REPLACE_ME"`, `"changeme"`
- The literal appears as an argument to `IConfiguration.GetValue<string>("...")`, `Configuration["..."]`, `services.Configure<T>(Configuration.GetSection("..."))` — these are key names, not values
- Line is in `appsettings.Development.json` (git-ignored, dev-only)

Detector implementation lives at `detectors/regex-runner.ps1`. Output is CSV `{file, line, secretType, redactedSample}` — the matched value is never echoed in full, only the first/last 4 characters.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Api/Program.cs
builder.Services.Configure<ZitadelOptions>(
    builder.Configuration.GetSection("Zitadel"));    // ✅ bound from config

builder.Services.Configure<MongoOptions>(
    builder.Configuration.GetSection("Mongo"));      // ✅ bound from config
```

```csharp
// File: src/Commerce.Infrastructure/Auth/ZitadelTokenClient.cs
public class ZitadelTokenClient
{
    private readonly ZitadelOptions _options;

    public ZitadelTokenClient(IOptions<ZitadelOptions> options)
    {
        _options = options.Value;                    // ✅ secret comes from IOptions
    }
}
```

```json
// File: src/Commerce.Api/config/appsettings.json
{
  "Zitadel": {
    "Authority": "https://zitadel.falconhub.space",
    "ClientId":  "commerce-svc",
    "ClientSecret": "${ZITADEL_CLIENT_SECRET}"       // ✅ placeholder; real value from Key Vault
  },
  "Mongo": {
    "ConnectionString": "${MONGO_CONNECTION_STRING}" // ✅ placeholder
  }
}
```

### ❌ Bad

```csharp
// File: src/Commerce.Infrastructure/Auth/ZitadelTokenClient.cs
public class ZitadelTokenClient
{
    private const string ClientSecret = "Zx9!kQp4mLrT2bV6";          // ❌ literal secret
    private const string ApiKey       = "<REDACTED_EXAMPLE_OF_A_LIVE_API_KEY>";  // ❌ never literal
    ...
}
```

```json
// File: src/Commerce.Api/config/appsettings.Production.json
{
  "Zitadel": {
    "ClientSecret": "Zx9!kQp4mLrT2bV6"                              // ❌ committed secret
  },
  "Mongo": {
    "ConnectionString": "mongodb://commerce:P@ssw0rd!@mongo:27017"  // ❌ embedded credentials
  },
  "AzureServiceBus": "Endpoint=sb://falcon.servicebus.windows.net/;SharedAccessKey=abc123..."  // ❌
}
```

## Known legitimate exemptions

- **`appsettings.Development.json`** — git-ignored, local-only.
- **Test fixtures** — `*/Tests/**` may carry deterministic dummy keys, but only ones explicitly tagged as test fixtures (e.g., `"test-key-do-not-use"`).
- **Placeholder strings** — `${VAR}`, `<placeholder>`, `REPLACE_ME`, `changeme`, empty string `""`.
- **Public keys** (RSA/ECDSA public halves), JWKS payloads, OAuth `client_id` (these are not secrets).
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-007` with a justification + date.

## Fix recipe

For each violation:

1. **STOP** — do not just delete the literal. Treat the secret as **already compromised** the moment it landed in git.
2. **Rotate** the credential at the source (Zitadel client secret, Mongo password, Stripe key, etc.).
3. **Add it to the secret store**:
   - Local dev: `dotnet user-secrets set "Zitadel:ClientSecret" "<new-value>"` inside the Api project.
   - Staging/Prod: add to Azure Key Vault (or the equivalent), reference from the deployment manifest.
4. **Bind it via IOptions<T>**:
   ```csharp
   public class ZitadelOptions { public string ClientSecret { get; set; } = ""; }
   services.Configure<ZitadelOptions>(Configuration.GetSection("Zitadel"));
   ```
5. **Replace the literal** in source with `_options.ClientSecret`.
6. **Replace the value** in `appsettings.json` with a placeholder (`"${ZITADEL_CLIENT_SECRET}"`).
7. **Re-write git history** if the leak is recent and the repo is private. If the repo is shared or the leak is old, accept the rotation as the mitigation and document in `exemptions/EXEMPTIONS.md`.
8. Re-run the detector.

Because step 2 (rotation) is a human-coordinated action, night-shift auto-fix is **disabled**. Each violation becomes a HIGH-severity row in the Decisions Queue with a Rotate-Then-Patch checklist.

## Related rules

- [[R-BE-001-clean-architecture-layers]] — secrets are infrastructure concerns; they flow from `appsettings.json` → `IOptions<T>` → adapters, never into Domain or Application

## Sources of truth

1. `CLAUDE.md` (project root) — Platform Standards section, line "Config: Never hardcode secrets — use `appsettings.json` sections"
2. `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` — sections 4.2.2 "Micro-App API Key Handling" and 4.5 "Security Principles Applied" (server-side secret storage doctrine)
