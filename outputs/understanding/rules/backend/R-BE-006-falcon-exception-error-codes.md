---
ruleId: R-BE-006
name: FalconException with FalconError codes for every domain failure
category: pattern
scope:
  apps:
    - falcon-core-commerce-svc
    - falcon-core-charging-svc
    - falcon-core-provisioning-svc
    - falcon-core-identity-svc
  paths:
    - "src/**/Domain/**/*.cs"
    - "src/**/Application/**/*.cs"
    - "src/**/Infrastructure/**/*.cs"
    - "src/**/Api/**/*.cs"
  exemptPaths:
    - "**/Tests/**"
    - "**/*.spec.cs"
    - "**/Program.cs"
    - "**/Startup.cs"
severity: must
detector:
  type: regex
  patterns:
    - 'throw\s+new\s+Exception\s*\('
    - 'throw\s+new\s+ApplicationException\s*\('
    - 'throw\s+new\s+SystemException\s*\('
    - 'throw\s+new\s+InvalidOperationException\s*\(\s*"'
    - 'throw\s+new\s+ArgumentException\s*\(\s*"[^"]{12,}"'
  exemptPatterns:
    - 'throw\s+new\s+ArgumentNullException\s*\(\s*nameof\('
    - 'throw\s+new\s+ArgumentException\s*\(\s*nameof\('
    - '//\s*infra-throw\s*:\s*ok'
  description: Regex scan that flags raw `throw new Exception(...)`, `ApplicationException`, `SystemException`, `InvalidOperationException`, and long-message `ArgumentException` calls. Domain and business-rule failures MUST be raised as `throw new FalconException(FalconError.<code>)`. Guard-clause throws with `nameof(...)` (null/empty parameter checks) are allowed.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Replace with throw new FalconException(FalconError.<SpecificCode>) and add the code to the FalconError catalog if missing.'
relatedRules:
  - R-BE-004
source:
  - file: CLAUDE.md
    location: project-root
  - file: Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md
    location: wiki
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-BE-006 — Throw FalconException(FalconError.<code>), never raw Exception ***
*** Source: Falcon Platform Standards — CLAUDE.md ***
*** Detector: regex ***

# R-BE-006 — FalconException with FalconError codes

## What it says

Every Falcon backend service MUST raise domain and business-rule failures by throwing **`FalconException`** wrapping a typed **`FalconError`** code. It is forbidden to:

- `throw new Exception("...")` — base type, no code, no metadata
- `throw new ApplicationException("...")`
- `throw new SystemException("...")`
- `throw new InvalidOperationException("free-text message")` — without a `FalconError`
- `throw new ArgumentException("long message")` — when the situation is a business-rule violation rather than a programming guard

Permitted alternatives:

- **Business / domain failure** → `throw new FalconException(FalconError.<Code>)`, optionally with context payload
- **Guard clause** for a programming bug (null/empty parameter) → `throw new ArgumentNullException(nameof(x))`, `throw new ArgumentException("...", nameof(x))`
- **Application Service** preferring graceful failure over throw → `return ServiceOperationResult<T>.Fail(FalconError.<Code>)` (see R-BE-004)
- **Truly infrastructure-level** unexpected condition (e.g., serializer corruption) — may throw a typed infrastructure exception with a trailing comment `// infra-throw: ok`

## Why it exists

The Falcon Platform Standards (CLAUDE.md, line 4 of Platform Standards) require every layer to speak the same error vocabulary: a discriminated `FalconError` code + a localizable `FalconException`. Raw `Exception` / `ApplicationException` carry no machine-readable code, no localization key, no severity, and no metadata — which means:

1. Controllers cannot map them to consistent HTTP status codes without bespoke `try/catch` per endpoint.
2. gRPC handlers cannot emit a consistent `Status.Detail`.
3. UI cannot show a localized message.
4. Logs cannot be aggregated by error type.
5. Alerts cannot be routed by severity.

`FalconException(FalconError.X)` solves all five at once. It also pairs cleanly with R-BE-004 — the Application Service's `ServiceOperationResult.Fail(FalconError.X)` and a domain throw `FalconException(FalconError.X)` collapse to the same wire-level response, so the Application layer can choose either based on whether the failure is recoverable or terminal.

## Detector strategy

Regex scan over `src/**/{Domain,Application,Infrastructure,Api}/**/*.cs`. Flag any occurrence of:

1. `throw new Exception(` — no exceptions, period
2. `throw new ApplicationException(`
3. `throw new SystemException(`
4. `throw new InvalidOperationException("..."`)` where the argument is a string literal (suggests business-rule context, not API-misuse)
5. `throw new ArgumentException("...")` where the message string is longer than 12 characters AND has no `nameof(...)` second argument (suggests business message rather than guard)

Each hit is checked against exempt patterns:

- `throw new ArgumentNullException(nameof(...))` — pure null-guard
- `throw new ArgumentException(nameof(...))` / `throw new ArgumentException("..."`, nameof(...))` — typed parameter guard
- Trailing comment `// infra-throw: ok` — grep-able escape hatch

Detector implementation lives at `detectors/regex-runner.ps1` and emits CSV `{file, line, throwExpression, suggestedFalconError}`. The suggested code is looked up from a fuzzy-match against the existing `FalconError` catalog.

## Examples

### ✅ Good

```csharp
// File: src/Commerce.Domain/Orders/Order.cs
public void Submit()
{
    if (Items.Count == 0)
        throw new FalconException(FalconError.OrderHasNoItems);          // ✅

    if (Status != OrderStatus.Draft)
        throw new FalconException(FalconError.OrderInvalidStatus);       // ✅

    Status = OrderStatus.Submitted;
}
```

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrderHandler.cs
public async Task<ServiceOperationResult<Guid>> Handle(SubmitOrderCommand cmd, CancellationToken ct)
{
    if (cmd is null) throw new ArgumentNullException(nameof(cmd));       // ✅ null guard

    var order = await _repo.GetByIdAsync(cmd.OrderId, ct);
    if (order is null)
        return ServiceOperationResult<Guid>.Fail(FalconError.OrderNotFound);   // ✅ R-BE-004 pairing

    order.Submit();   // may throw FalconException; caught at composition root
    await _repo.UpdateAsync(order, ct);
    return ServiceOperationResult<Guid>.Ok(order.Id);
}
```

### ❌ Bad

```csharp
// File: src/Commerce.Domain/Orders/Order.cs
public void Submit()
{
    if (Items.Count == 0)
        throw new Exception("Order has no items");                       // ❌ violates R-BE-006

    if (Status != OrderStatus.Draft)
        throw new InvalidOperationException(                              // ❌ violates R-BE-006
            "Cannot submit an order that is not in Draft status");

    Status = OrderStatus.Submitted;
}
```

```csharp
// File: src/Commerce.Application/Orders/UseCases/SubmitOrderHandler.cs
public async Task<Guid> Handle(SubmitOrderCommand cmd, CancellationToken ct)
{
    var order = await _repo.GetByIdAsync(cmd.OrderId, ct);
    if (order is null)
        throw new ApplicationException($"Order {cmd.OrderId} not found"); // ❌ violates R-BE-006
    ...
}
```

## Known legitimate exemptions

- **Pure null/empty guards** with `nameof(...)` — `ArgumentNullException` and `ArgumentException(..., nameof(x))` are signs of a programming bug, not a domain failure.
- **Cancellation** — `OperationCanceledException` thrown by `CancellationToken.ThrowIfCancellationRequested()` is fine.
- **Infrastructure adapters** rethrowing vendor-typed errors after logging may use a trailing comment `// infra-throw: ok`.
- **Test projects** — `*/Tests/**` and `*.spec.cs`.
- Anything explicitly listed in `exemptions/EXEMPTIONS.md` against `R-BE-006` with a justification + date.

## Fix recipe

For each violation:

1. Decide whether the situation is **recoverable** (Application layer) or **terminal** (Domain invariant):
   - Recoverable → return `ServiceOperationResult<T>.Fail(FalconError.<Code>)` instead of throwing (R-BE-004).
   - Terminal → keep as a throw, but typed.
2. Pick the right `FalconError` code:
   - Search the `FalconError` catalog (`<Service>.Domain/Errors/FalconError.cs`) for an existing code.
   - If none exists, ADD a new code with a unique numeric id, an English message key, and an Arabic message key.
3. Replace the raw throw:
   ```csharp
   throw new FalconException(FalconError.OrderHasNoItems);
   ```
4. Update controllers / consumers — the global `FalconException` filter in the Api project already maps to the correct HTTP/gRPC status; no per-endpoint catch is needed.
5. Update unit tests to assert `FalconException.Error.Code == FalconError.<Code>`.
6. Re-run the detector.

Because picking the right `FalconError` code is a domain decision (and may require adding a new code), auto-fix is **disabled**.

## Related rules

- [[R-BE-004-service-operation-result-wrapper]] — `FalconError` codes are shared between the throw path and the `ServiceOperationResult.Fail(...)` path

## Sources of truth

1. `CLAUDE.md` (project root) — Platform Standards section, line "Error handling: `FalconException` with `FalconError` codes"
2. `falcon-wiki/Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md` — section "Business Rule enforcement" (`throw new InvalidOperationException` example is illustrative wiki text; Falcon Platform Standards override it with `FalconException`)
