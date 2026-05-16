---
type: cross-cut-matrix
cluster: 40-Authority
axis: validation-by-feature
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\06-validation-by-feature\MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which of the 25 V-rules apply per feature + drift watch items (PRD vs backend gaps) + 3-layer validation architecture'. Open before wiring any form validator."
---

> [!tldr]
> 25 V-rules × 7 features. 16-item drift watch (PRD ↔ backend gaps) + 3-layer validation architecture + `[ThrowIf*]` pattern + FE error-handling contract.

# Validation × Feature

## Top drift items
- **Username**: PRD 30 vs backend 100 — enforce 30 on FE
- **PasswordSecurityLevel**: PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict`
- **AccountName letter-prefix**: backend regex missing
- **AccountOwner phone+email**: `[ThrowIfNotPassed]` MISSING despite required
- **E-rate-card-entry.commChannelId**: missing — blocks Add Contract Step 2

## 3-layer validation
1. Inline sync (HTML attr / Falcon directive)
2. Cross-field FormGroup validator
3. Async backend uniqueness (debounced)

## 8 Falcon directives
FalconFormValidate · StartWithLetterMax30 · LettersDigitsMax · CheckExists · UsernameFormat · IpAddress · MobileNumber · WizardStepForm

## FE error contract
HTTP status → primary signal. Display `errorMessages[0]` localized. Never parse error codes for UI branching.

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\06-validation-by-feature\MATRIX.md`

## See also
- 30-Validation/V-*.md — atomic V-rule notes
- [[Entity-Drift-by-Feature]] · [[Business-Rules-by-Feature]] · [[Falcon-vs-Client]]
