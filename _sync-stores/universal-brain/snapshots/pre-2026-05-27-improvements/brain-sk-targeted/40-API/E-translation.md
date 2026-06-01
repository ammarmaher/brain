---
type: entity
id: E-translation
title: Translation / Localized String
status: stub
created: 2026-05-18
source: Business deep-dive mining 2026-05-18 (GAP-BIZ-X-06)
priority: medium
tags: [entity, cross-module, i18n, l10n, translation, stub]
---

# E-translation — Translation / Localized String

> [!warning] **STUB — Authoring required**
> Multi-language is a non-negotiable platform requirement (per `[CODE]` CLAUDE.md Platform Standards — `MultiLanguageName(En, Ar)`) but no entity describes the i18n surface. Closes GAP-BIZ-X-06.

## One-line shape

A Translation is a **localized string** keyed by `(key, locale)` returning the rendered text. Used for two distinct concerns:
1. **Static UI text** (button labels, page titles) — typically `.resx` files at build time
2. **DB-editable runtime messages** (confirmation prompts, warning text, notification bodies) — Q-RD-06 OPEN; cross-cutting i18n requirement from `Points to be covered later`

## Provisional fields

| Field | Type | Notes |
|---|---|---|
| `key` | string | Dotted namespace e.g. `confirm.delete-account.body` |
| `locale` | string | ISO 639-1 (e.g. `en`, `ar`) |
| `value` | string | Rendered text in the locale |
| `category` | enum {SystemUi, ValidationError, NotificationBody, AdminMessage, LegalText, Other} | Helps route maintenance |
| `editableInProduction` | bool | True for DB-stored Q-RD-06 candidates; false for compile-time `.resx` |
| `fallbackKey` | string? | Used if value missing (BR-X-I18N-FALLBACK-01) |
| `tenantId` | string? | Tenant-specific overrides (when supported) |
| `version` | int | Increment on edit; audit |
| `updatedAt`, `updatedBy` | audit | Standard |

## Fallback rules (BR-X-I18N-FALLBACK-01 proposed)

```
Resolve(key, requestedLocale, tenantId):
  1. Try (tenantId, key, requestedLocale)   if tenant override + locale
  2. Try (null,     key, requestedLocale)   global locale value
  3. Try (null,     key, OTHER_LOCALE)      EN↔AR symmetric fallback
  4. Try (null,     key, 'en')               final fallback to English
  5. Return key as literal                   never empty string
```

Q-X-NEW-14 confirms: symmetric EN↔AR fallback expected.

## Cross-module use cases

| Surface | Examples |
|---|---|
| Account names / display | `MultiLanguageName(En, Ar)` on Account.Name, Node.Name (BR-AM-03) |
| CommChannel / App names | Display + dropdown (cross-cuts BR-AM-14..22) |
| Notification bodies | OTP email subject + body; credential delivery (BR-UM-18, BR-UM-26) |
| Validation error messages | Forms across all modules |
| Confirmation prompts | Delete, suspend, transfer (Q-RD-06 OPEN — should be DB-editable) |
| System warnings | Insufficient balance, lockout, IP rejection |
| Template content | WhatsApp/Voice/AI body + variables (BR-TM-13/14/15) — separate concern but uses same i18n |
| Admin messages | Wave 13 toast notifications, Wave 14 form errors |

## Distinct from these other concepts

- **E-template** (Module 05) — commercial broadcast templates via CommChannel. Distinct surface, distinct lifecycle, often pre-translated by Maker per language.
- **E-notification** — single delivery attempt. References Translation for the body.
- **`MultiLanguageName(En, Ar)`** — value-object embedded inline on entities (Account.Name, Node.Name). Translation entity is for KEYED runtime strings, not entity-attached display names.

## Open questions

- Q-RD-06 — Confirmation/warning messages DB-stored editable-without-release? (high-priority Y/N)
- Q-X-NEW-14 — Symmetric EN↔AR fallback?
- Q-X-NEW-15 — DB-editable messages → 1st-class entity?
- Tenant-level override support — needed for white-label scenarios?
- RTL handling — separate concern (CSS), but Arabic strings imply RTL rendering

## Cross-module references

- All 5 PRD modules consume translations
- `Points to be covered later` (root-documents) explicitly flags "Confirmation / warning messages should not be hardcoded - store in DB"
- BR-X-I18N-FALLBACK-01 (proposed)

## Backend reality

**[INFERRED]** Likely a mix today:
- `MultiLanguageName(En, Ar)` value-object on entities (per CLAUDE.md Platform Standards)
- `.resx` files for static UI in Angular apps
- No DB-editable surface — that's the Q-RD-06 gap

## Bound by BR rules

- BR-X-I18N-FALLBACK-01 (proposed)
- Cross-cuts every BR rule with user-facing text

## See also

- `[[E-notification]]` — uses Translation to render body
- `[[E-template]]` — distinct concept (commercial templates)
- [BRAIN-OUT] `Brain Outputs/prd/modules/root-documents/QUESTIONS.md` Q-RD-06
- [CODE] `C:\Falcon\CLAUDE.md` § Platform Standards — `MultiLanguageName(En, Ar)` rule

## Authoring status

- 🟡 Provisional shape
- ⏳ Awaiting Q-RD-06 (DB-editable Y/N) — determines whether this entity becomes load-bearing
- ⏳ Awaiting Q-X-NEW-14 (symmetric fallback Y/N)
- ⏳ Tenant-override support — open
