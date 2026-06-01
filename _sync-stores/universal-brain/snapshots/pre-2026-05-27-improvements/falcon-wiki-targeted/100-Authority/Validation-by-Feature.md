---
type: cross-cut-matrix
cluster: 100-Authority
axis: validation-by-feature
projection-source: _mounts/brain-outputs/datasets/authority-dataset/06-validation-by-feature/MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which of the 25 V-rules apply per feature + drift watch items (PRD vs backend gaps) + 3-layer validation architecture'. Open before wiring any form validator."
---

> [!tldr]
> 25 V-rules × 7 features cross-cut. Includes 16-item drift watch (PRD ↔ backend gaps that bite at implementation) + 3-layer validation architecture + `[ThrowIf*]` pattern + FE error-handling contract.

# Validation × Feature

## The 25 V-rules (drift watch top 5)

| Drift | What | Mitigation |
|---|---|---|
| Username cap | PRD says 30, backend FluentValidation caps 100 | Enforce 30 on FE (tighter wins) |
| PasswordSecurityLevel vocabulary | PRD `Normal/Advanced`, backend `Low/Medium/High/Strict` | Display PRD labels, submit backend codes |
| AccountName letter-prefix | PRD requires "starts with letter", backend regex missing | FE-only enforcement via `falconStartWithLetterMax30` |
| AccountOwner phone + email | Required per PRD, `[ThrowIfNotPassed]` MISSING on DTO | Backend gap — flag in `70-Gaps/` |
| E-rate-card-entry.commChannelId | Missing on backend DTO | Blocks Add Contract Step 2 per-CommChannel rate matrix |

## 3-layer validation

1. **Inline sync** — HTML attribute / Falcon directive
2. **Cross-field** — FormGroup validator (visibility ↔ pricing, country ⇒ city)
3. **Async backend** — debounced uniqueness check via `falconCheckExists` → `/exist`

## 8 Falcon directives
`FalconFormValidateDirective` · `FalconStartWithLetterMax30Directive` · `FalconLettersDigitsMaxDirective` · `FalconCheckExistsDirective` · `FalconUsernameFormatDirective` · `FalconIpAddressDirective` · `FalconMobileNumberComponent` · `WizardStepFormDirective`

## `[ThrowIf*]` attribute pattern (Commerce DTOs)
- `[ThrowIfNotPassed]` — required field
- `[ThrowIfMaxLengthExceed(N)]` — max length cap
- `[ThrowIfNotEnumValue<TEnum>]` — enum membership

## FE error contract
- HTTP status is the primary routing signal (400/401/409/422/423/429)
- Display localized `errorMessages[0]` from `ServiceOperationResult<T>`
- **Never parse error codes** for branching UI copy — only for logging

## Drill into Brain Outputs

[Full matrix → 06-validation-by-feature/MATRIX.md](../_mounts/brain-outputs/datasets/authority-dataset/06-validation-by-feature/MATRIX.md)

## See also

- Brain SK vault: `30-Validation/V-*.md` — 25 atomic V-rule notes
- [[Entity-Drift-by-Feature]] — companion cross-cut
- [[Business-Rules-by-Feature]] — what governs cross-field logic
- [[Falcon-vs-Client]] — feature classification
