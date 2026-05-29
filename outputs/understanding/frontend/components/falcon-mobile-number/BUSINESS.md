# falcon-mobile-number — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## ⚠ Source correction (live code contradicts the existing 6 dossier files)
`[CODE]` Glob across `Falcon/falcon-web-platform-ui/libs/` — **`falcon-mobile-number` does not exist in the current (new-UI) codebase.** It exists only in the OLD-UI worktree at `Brain Outputs/worktrees/falcon-old-ui-main/libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/`.

The existing `OVERVIEW.md` describes it as a *"Wave 2 façade that delegates to `<falcon-angular-phone-field>`, with `ngx-intl-tel-input` uninstalled."* `[CODE]` `falcon-mobile-number.component.ts:22-27,36-41` — the live source **still imports and renders `ngx-intl-tel-input`** and `[CODE]` `phone-utils.ts:11` **still imports `google-libphonenumber`**. There is no delegation to `<falcon-angular-phone-field>` anywhere in the file.

**Conclusion (do NOT edit the old 6 files):** `falcon-mobile-number` is a **legacy old-UI component** that has been *superseded and removed* from the new UI. `<falcon-angular-phone-field>` is its replacement. The dossier's "façade delegating to phone-field" narrative is a planned-but-not-realized design — the realized outcome was deletion.

## Business purpose
`[CODE]` `falcon-mobile-number.component.ts:32-34` — In the old UI this was the single mobile-number capture control: a translated label, a required marker, and an `ngx-intl-tel-input` widget. Business role: capture a contactable mobile number for a contact/account record. It is functionally the predecessor of `<falcon-angular-phone-field>`.

## What it CAN do (business capability — old UI only)
- `[CODE]` `:62-73` Translate its label via a `labelKey` (i18n-first) and mark required.
- `[CODE]` `:181-216,245-252` Accept an inbound E.164 string OR a legacy `{ e164Number, number }` object, parse it back to a country + national number, and act as both a `ControlValueAccessor` and an Angular `Validator` (`{ required: true }` when empty).
- `[CODE]` `:64-68` Offer a preferred-countries shortlist (SA, AE) and a default country (SA).
- `[CODE]` `:120-169` Unclip the country dropdown from `overflow:hidden` ancestors via a `MutationObserver` — a layout workaround.
- `[CODE]` `:256-266` Guard against `+966+966…` dial-code duplication when recomposing E.164.

## What it CANNOT do (business limits)
- `[INFERRED]` It cannot be used in the new UI at all — it is not present in the current `libs/`.
- `[CODE]` `:2-6` phone-utils — like `<falcon-angular-phone-field>`, the *component* does no format validation beyond `required`; real validity relied on `ngx-intl-tel-input`'s `phoneValidation` flag (`falcon-mobile-number.component.html:19`).
- `[INFERRED]` It carries the now-banned `ngx-intl-tel-input` + `google-libphonenumber` dependencies — a reason it was dropped.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Contact must have a reachable mobile | `[INFERRED]` from old-UI contact/account forms | Rendered as a required, validated mobile field. |
| OTP-recovery phone capture | `[CODE]` `USAGE.md` Wave-7 sweep — consumer `forgot-password-flow.component.html` (old UI) | Provided the phone for SMS OTP recovery in the old forgot-password screen. |
| E.164 canonicalization | `[CODE]` `phone-utils.ts:75-108` (`parseE164`) | Normalized `+`, `00`, and raw-digit inputs to a single E.164 form. |

## Business constraints baked in
- `[CODE]` `:64-68` Saudi-first defaults (SA preferred + default) — same product default as `<falcon-angular-phone-field>`.
- `[CODE]` `:73` Default required-error key `validation.phoneRequired`.
- `[INFERRED]` Three legacy inputs (`preferredCountries`, `showDialCode`, `maxLength`) — per the old dossier — were already understood as compat-only knobs.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Forgot-password (OLD UI) | host-shell auth | Captured the recovery phone number. |
| Legacy contact / account forms (OLD UI) | various | Captured a contact mobile. |
| (NEW UI) | — | None — superseded by `<falcon-angular-phone-field>`. |

## Business gotchas
- Do NOT cite this component when planning new-UI work — it is not in the new codebase. Recommend `<falcon-angular-phone-field>` instead.
- Its emitted value, like the modern phone-field, is not proof of a valid/owned number — verification was a separate concern.
- The "façade" framing in the legacy dossier is aspirational; the realized state is removal.

## Verification
🟡 CODE-DERIVED from `falcon-mobile-number.component.{ts,html}` + `phone-utils.ts` in the `falcon-old-ui-main` worktree. 🔴 Correction flagged: live source contradicts `OVERVIEW.md`/`API.md` — component is the OLD-UI `ngx-intl-tel-input` implementation, not a phone-field façade, and is absent from the new UI.
