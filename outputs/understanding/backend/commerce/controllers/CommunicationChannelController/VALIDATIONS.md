# CommunicationChannelController — Validations

## DTO-Level Validation

**None.** Endpoint takes no parameters.

## Authorization Validation

- `[Authorize]` at class level
- No `FalconOnly` override → any JWT passes

## Handler-Level Validation

[CODE] `ListCommunicationChannelHandler.cs:20-39` — no validation. The handler issues `GetListAsync(_ => true)` and projects with translation.

## Cross-Field Validation

**None.**

## Order of Validations

1. `[Authorize]` JWT check → 401 if missing/invalid
2. Controller action → handler → Mongo → translation → AutoMapper

## Findings

- Identical validation surface to `ApplicationController` — both are pure global-catalog reads
- **No filtering, no search, no paging** — full catalog every call
- Translation is locale-bound — cache keys must include locale
