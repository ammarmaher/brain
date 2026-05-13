# PES Enforcement Protocol

## Purpose

This protocol defines how the brain handles Falcon PES until the official Wiki definition is loaded.

PES must be sourced from Falcon Wiki, architecture docs, or code.

Do not invent the acronym.

Do not call it PESD.

---

## PES Decision Matrix

For each feature, define:

```txt
Feature/Area:
Actor/Role/User Type:
PES Source:
Visible:
Enabled:
Editable:
Validation Visible:
Route Accessible:
Data Scope:
Fallback:
Gap:
```

---

## Default Gap Handling

If PES source is missing:

1. Ask a targeted question if correctness depends on it.
2. Otherwise use the safest assumption.
3. Document the assumption.
4. Mark the PES rule as TBD.
5. Do not hardcode a permanent rule unless confirmed.

---

## Implementation Rule

Use existing architecture first:

```txt
Existing PES service
Existing permission service
Existing route guard
Existing menu visibility pattern
Existing directive/pipe/helper
Existing API response permission flags
Existing token/claims pattern
```

Never create a parallel PES system unless explicitly requested.
