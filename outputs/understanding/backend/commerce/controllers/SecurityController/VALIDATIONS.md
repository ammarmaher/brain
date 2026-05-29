# SecurityController — Validations

## DTO-Level Validation

**None.** Endpoint takes no input.

## Authorization Validation

- `[AllowAnonymous]` at action level — **NO authentication required**
- Relies entirely on **network isolation** (Commerce is internal-only)

## Handler-Level Validation

[CODE] `GetAllIpAllowlistsHandler.cs:23-44` — no validation.

```csharp
public async Task<GetAllIpAllowlistsResult> ExecuteAsync(GetAllIpAllowlistsQuery query)
{
    var settings = await _settingsRepo.GetListAsync(
        s => s.SecuritySettings != null && s.SecuritySettings.AllowedIps != null,
        s => new { s.OwnerId, s.SecuritySettings!.AllowedIps });

    var result = new GetAllIpAllowlistsResult();
    foreach (var entry in settings)
    {
        if (string.IsNullOrEmpty(entry.OwnerId) || entry.AllowedIps is null)
            continue;
        result.Tenants[entry.OwnerId] = new IpAllowlistEntryResult
        {
            Enabled = entry.AllowedIps.Count > 0,
            AllowedIps = entry.AllowedIps
        };
    }
    return result;
}
```

Filters:
- `SecuritySettings != null`
- `SecuritySettings.AllowedIps != null`
- (post-filter) `OwnerId` non-empty
- (post-filter) `AllowedIps` not null

A tenant with `SecuritySettings.AllowedIps = []` (empty list) IS included with `Enabled = false`. A tenant with `AllowedIps = null` is NOT included.

## Cross-Field Validation

None.

## Order of Validations

1. (No auth check — `[AllowAnonymous]`)
2. Controller → handler → Mongo
3. Project & map

## Findings

1. **No JWT check** — security model is "trusted network only." If Commerce is ever exposed to the public internet (misconfiguration), this endpoint leaks all tenant allowlists. **F-022 candidate.**

2. **`Enabled` is derived, not stored** — see OVERVIEW.md Finding #1.

3. **Empty allowlist still emitted** — `Enabled = false` row is added if `AllowedIps != null` but empty. Gateway must handle the "disable enforcement" case from this signal.

## Cross-Reference to V-rules

V-027 — Allowed IPs format. **NOT enforced on read** (read endpoint trusts stored data). Format validation should happen on `UpdateSettingsHandler` write path — but currently the DTO `AllowedIps` is plain `List<string>?` with no format check. Drift candidate.
