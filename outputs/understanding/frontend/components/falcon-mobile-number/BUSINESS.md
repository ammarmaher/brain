# falcon-mobile-number (LEGACY — REMOVED) — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## RECONCILE 2026-06-03 (B22) — the two prior narratives both resolve to REMOVED

The prior dossier carried **two contradictory accounts** of `falcon-mobile-number`, flagged 🔴 by an earlier agent. The B22 sweep of the **production new-UI tree** (`C:\Falcon\Falcon\falcon-web-platform-ui`) reconciles them — both end at the same place:

1. **OVERVIEW/API/USAGE account ("Wave-2 phone-field façade"):** a thin shim delegating to `<falcon-angular-phone-field>`, kept for compile-compat, slated for deletion. `[CODE]` This is what the *new-UI* component became, and it has now been **deleted** (folder gone, barrel export gone, last consumer `forgot-password-flow` migrated to `<falcon-angular-phone-field>`).
2. **BUSINESS/INTEGRATION/RECOGNITION account ("OLD-UI `ngx-intl-tel-input` component"):** `[CODE]` a prior agent inspected `Brain Outputs/worktrees/falcon-old-ui-main/libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/` and found a standalone `ngx-intl-tel-input` + `google-libphonenumber` implementation that never delegated to phone-field.

**Reconciliation:** the OLD-UI worktree held the original raw `ngx-intl-tel-input` component; the new-UI repo later carried a façade-over-phone-field with the same selector; **both are absent from the production tree today.** `[CODE]` `Grep "<falcon-mobile-number"` (non-`dist`) = 0 live consumers; `Glob` of the new-UI folder = empty. The realized outcome in every variant is **deletion**, replaced by `<falcon-angular-phone-field>`. The earlier 🔴 contradiction is therefore **resolved**: it was two snapshots of the same retired selector.

---

## Business purpose (historical)
In both incarnations this was the single mobile-number capture control: a translated label, a required marker, and an intl-phone widget (raw `ngx-intl-tel-input` in old-UI; the embedded Falcon phone-field in the new-UI façade). Business role: capture a contactable mobile number for a contact/account record and, in forgot-password, the SMS-OTP delivery address. Functionally the **predecessor of `<falcon-angular-phone-field>`**.

## What it COULD do (historical capability)
- `[BRAIN-OUT]` Translate its label via `labelKey` (i18n-first) and mark required.
- `[BRAIN-OUT]` Accept an inbound E.164 string OR a legacy `{ e164Number, number }` object, parse it to a country + national number, and act as BOTH a `ControlValueAccessor` AND an Angular `Validator` (`{ required: true }` when empty).
- `[BRAIN-OUT]` Offer a Saudi-first preferred-country shortlist (SA, AE) + default country (SA).
- `[BRAIN-OUT]` (old-UI variant) Unclip the country dropdown from `overflow:hidden` ancestors via a `MutationObserver`; guard against `+966+966…` dial-code duplication when recomposing E.164.

## What it CANNOT do (today)
- `[CODE]` It cannot be used at all — it is absent from the production codebase. All references resolve to `<falcon-angular-phone-field>`.
- `[BRAIN-OUT]` Even when present, the *component* did no format validation beyond `required`; real validity relied on the intl widget's `phoneValidation` flag.

## PRD / business rules touched
| Rule | Source | How this component enforced / surfaced it |
|---|---|---|
| Contact must have a reachable mobile | `[INFERRED]` from contact/account forms | Rendered as a required, validated mobile field. |
| OTP-recovery phone capture | `[BRAIN-OUT]` Wave-7 consumer `forgot-password-flow.component.html` | Provided the phone for SMS OTP recovery — **now served by `<falcon-angular-phone-field>`** at the same page (`[CODE]` forgot-password-flow.component.html:60-71). |
| E.164 canonicalization | `[BRAIN-OUT]` old-UI `phone-utils.parseE164` | Normalized `+`, `00`, and raw-digit inputs to a single E.164 form. The phone-field carries this concern now. |

## Business constraints baked in (historical)
- `[BRAIN-OUT]` Saudi-first defaults (SA preferred + default) — same product default as `<falcon-angular-phone-field>`.
- `[BRAIN-OUT]` Default required-error key `validation.phoneRequired`.
- `[BRAIN-OUT]` Three legacy inputs (`preferredCountries`, `showDialCode`, `maxLength`) were compat-only knobs (silent no-ops on the façade).

## Business flows that used this component
| Flow | Page | Role | Today |
|---|---|---|---|
| Forgot-password | host-shell auth | Captured the recovery phone number | Migrated to `<falcon-angular-phone-field>` |
| Legacy contact / account forms | various | Captured a contact mobile | Migrated / removed |

## Business gotchas
- Do NOT cite this component for new work — it is not in the codebase. Recommend `<falcon-angular-phone-field>`.
- Its emitted value was never proof of a valid/owned number — verification was always a separate concern (now `falcon-verify`).
- The "façade over phone-field" framing and the "raw `ngx-intl-tel-input`" framing are two snapshots of the same retired selector; the realized state is removal.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) for the live verdict (absent from production; replacement live; consumer migrated). Historical capability rows 🟡 CODE-DERIVED / `[BRAIN-OUT]` from the prior Wave-2 + old-UI-worktree dossier (source not on the production disk to re-read). Prior 🔴 contradiction RESOLVED — two snapshots, one outcome.
