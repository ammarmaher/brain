---
ruleId: R-BE-005
name: MultiLanguageName(En, Ar) for every user-facing text field
category: i18n
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/Domain/**/*.cs"
    - "src/**/Application/**/*.cs"
    - "src/**/Contracts/**/*.cs"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
    - "**/Migrations/**"
    - "**/Logging/**"
severity: must
detector:
  type: regex
  patterns:
    - 'public\s+string\s+(Name|DisplayName|Title|Label|Description|Caption)\s*\{'
    - 'public\s+string\s+(Name|DisplayName|Title|Label|Description|Caption)\s*\('
    - 'public\s+record\s+\w+\([^)]*\bstring\s+(Name|DisplayName|Title|Label|Description|Caption)\b'
    - 'public\s+\w+\s*\(\s*string\s+(name|displayName|title|label|description|caption)\s*[,)]'
  exemptPatterns:
    - 'MultiLanguageName\s+(Name|DisplayName|Title|Label|Description|Caption)'
    - 'string\s+(Name|DisplayName|Title|Label|Description|Caption)\s*\{.*\bInternal\b'
    - '//\s*system-name\s*:\s*ok'
  description: Regex scan over Domain/Application/Contracts code that flags properties, ctor parameters, and record positional parameters named Name/DisplayName/Title/Label/Description/Caption typed as bare `string`. User-facing text must use the `MultiLanguageName(En, Ar)` value object. Internal system identifiers (slug, key, code) and explicitly marked internal names are exempt.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Replace `string Name` with `MultiLanguageName Name`. Update all constructors, serialization contracts, and any consumers reading `.Name` to read `.Name.En` / `.Name.Ar`.'
relatedRules:
  - R-BE-004
source:
  - file: CLAUDE.md
    location: project-root
  - file: Home/Software-Architecture-Design/High-Level-Architecture.md
    location: wiki
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-005 — User-facing text uses MultiLanguageName(En, Ar), never bare string ***
*** Source: Falcon Platform Standards — CLAUDE.md ***
*** Detector: regex ***

# R-BE-005 — MultiLanguageName(En, Ar) for every user-facing text field

## What it says

Every property, constructor parameter, or record member that holds **text rendered to an end user** — whether a tenant admin, a Falcon admin, or an external partner — MUST be typed as `MultiLanguageName` (the canonical Falcon value object carrying both `En` and `Ar` strings), NOT as a bare `string`.

The rule applies to fields named `Name`, `DisplayName`, `Title`, `Label`, `Description`, `Caption` (case-insensitive) on:

- Domain entities and value objects
- Application DTOs (commands, queries, results)
- Contracts DTOs (public REST/gRPC schemas)

The rule does NOT apply to:

- Internal system identifiers: `Code`, `Slug`, `Key`, `SystemName`, `MachineName`, `Identifier`, `Sku` — these are not user-facing
- Configuration keys, log messages, internal metric labels, header names
- Anything explicitly marked with comment `// system-name: ok` (escape hatch with grep-able tag)

## Why it exists

Falcon is a bilingual platform (English + Arabic) from day one. Every account name, channel label, template title, error description, and menu caption shown in the Management Console / Admin Console must render in the user's chosen language. The Falcon UI never makes a separate API call to fetch a translation — the backend MUST return both languages in the same payload. Encoding this discipline as a typed value object (`MultiLanguageName { string En; string Ar; }`) means:

1. Every developer is forced to think about Arabic at the moment they create the field, not after a missed-translation bug ships.
2. Serialization is uniform — every endpoint that exposes user-facing text emits the same JSON shape `{ "en": "...", "ar": "..." }`.
3. Migrations and projections are uniform — every Mongo document, ClickHouse row, and Kafka event speaks the same shape.
4. The Brain Outputs frontend playbooks can confidently bind to `{{name.en}}` / `{{name.ar}}` without per-endpoint guesswork.

This is stated as a hard standard in `CLAUDE.md` (Platform Standards section, line "Multi-language: `MultiLanguageName(En, Ar)` for all user-facing text").

## Detector strategy

Regex scan over `src/**/Domain/**/*.cs`, `src/**/Application/**/*.cs`, `src/**/Contracts/**/*.cs`. Three pattern families:

1. **Property** — `public string (Name|DisplayName|Title|Label|Description|Caption) { ... }`
2. **Constructor parameter** — `public <Class>( ... string (name|displayName|title|label|description|caption) ... )`
3. **Record positional parameter** — `public record <Name>( ... string (Name|DisplayName|Title|Label|Description|Caption) ... )`

Each hit is checked against the exempt-pattern list:

- Type is already `MultiLanguageName` instead of `string` → ignored.
- Comment trailing the line contains `// system-name: ok` → ignored.
- Field is on a class whose name ends with `Log`, `Metric`, `Audit`, `Trace` → ignored (operational, not user-facing).

Each remaining hit is a violation row with file, line, class name, field name, observed type.

Detector implementation lives at `detectors/regex-runner.ps1` and runs across all four services in parallel.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Domain/Accounts/Account.cs
public class Account
{
    public Guid Id { get; private set; }
    public MultiLanguageName Name { get; private set; }          // ✅
    public MultiLanguageName Description { get; private set; }   // ✅
    public string Slug { get; private set; }                     // ✅ system identifier, not user-facing
}
```

```csharp
// File: src/Commerce.Contracts/Models/CreateAccountRequest.cs
public record CreateAccountRequest(
    MultiLanguageName Name,           // ✅
    MultiLanguageName Description,    // ✅
    string Slug                       // ✅ system identifier
);
```

```csharp
// File: src/Commerce.Application/Accounts/UseCases/RenameAccount/RenameAccountCommand.cs
public record RenameAccountCommand(
    Guid AccountId,
    MultiLanguageName NewName        // ✅
);
```

### ❌ Bad

```csharp
// File: src/Commerce.Domain/Accounts/Account.cs
public class Account
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }            // ❌ bare string, user-facing
    public string DisplayName { get; private set; }     // ❌ bare string
    public string Description { get; private set; }     // ❌ bare string
}
```

```csharp
// File: src/Commerce.Contracts/Models/CreateAccountRequest.cs
public record CreateAccountRequest(
    string Name,                       // ❌ violates R-BE-005
    string Description,                // ❌ violates R-BE-005
    string Slug                        // ✅ OK
);
```

```csharp
// File: src/Provisioning.Application/Channels/Commands/CreateChannelCommand.cs
public class CreateChannelCommand
{
    public string Title { get; set; }                  // ❌ violates R-BE-005
    public string Label { get; set; }                  // ❌ violates R-BE-005
    public string MachineName { get; set; }            // ✅ system identifier
}
```

## Known legitimate exemptions

- **System identifiers** — `Code`, `Slug`, `Key`, `SystemName`, `MachineName`, `Identifier`, `Sku`, `ExternalId` are not user-facing; they are stable machine references.
- **Operational text** — log messages, metric labels, header values, OpenTelemetry attributes.
- **Migrations** — schema migration scripts may keep bare-string columns until the data is converted.
- **Test projects** — `*/Tests/**` and `*.spec.cs`.
- **Explicit opt-out** — a trailing comment `// system-name: ok` on the line, used when the type genuinely is single-language (e.g., a vendor-imposed external label).
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-005` with a justification + date.

## Fix recipe

For each violation:

1. Change the type from `string` to `MultiLanguageName`.
2. Update all constructors / record positional parameters that build the type.
3. Update the JSON serialization contract: `MultiLanguageName` round-trips as `{ "en": "...", "ar": "..." }` — verify the Swagger / proto / Avro schema.
4. Update consumers reading the value:
   - UI code: `account.Name` → `account.Name.En` or `account.Name.Ar` based on current language.
   - Logs / search: pick `.En` as canonical, or both as separate indexed fields.
5. Update unit tests to construct `new MultiLanguageName("EN value", "AR value")`.
6. For an existing Mongo collection, add a migration that converts the legacy `Name: "X"` to `Name: { en: "X", ar: "X" }` (Arabic placeholder = English until translated).
7. Re-run the detector.

Because each field has its own data backfill and schema migration, auto-fix is **disabled**.

## Related rules

- [[R-BE-004-service-operation-result-wrapper]] — together they define the canonical response shape across the platform

## Sources of truth

1. `CLAUDE.md` (project root) — Platform Standards section, line "Multi-language: `MultiLanguageName(En, Ar)` for all user-facing text"
2. `falcon-wiki/Home/Software-Architecture-Design/High-Level-Architecture.md` — section "2.1 Frontend Layer" (bilingual support context)
