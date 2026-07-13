# falcon-phone-field — OVERVIEW

## Component purpose

Phone-number entry combining a **searchable country chooser** (flag + chevron) + a read-only **dial-code** label + a native `<input type="tel">` + an optional **Verify button** — all inside ONE outer border, partitioned by 1px vertical dividers (NOT separate borders). Dual-render Stencil pattern (Shadow `<falcon-phone-field>` + Light `<falcon-phone-field-tw>`) behind the Angular CVA tag-switcher `<falcon-angular-phone-field>`. The country panel is a popover; **the `-tw` path body-portals it into `.falcon-overlay-container` + the native Top Layer; the Shadow path renders it inline.** Replaces `ngx-intl-tel-input` + `google-libphonenumber` (uninstalled). SSOT-2 reference = `C:\Taha\Falcone V0.3\admin\otp-verify.{jsx,css}`.

## Business / UI use case

- Editing a user's phone in the **User Details** page (admin + management) — flagship, with `verifyButton` + `verifyIcon` gated by `canEditPhone` + a status-frozen gate.
- **Forgot-password flow** — capturing the mobile number that receives the SMS recovery OTP.
- Account-owner / new-user phone in Add Client / Add User wizards.
- Wrapped by the legacy `<falcon-mobile-number>` shared-ui facade.

## When to use it / when NOT to use it

**Use it for:** any phone-number entry, always. For a US-only field, still use it with `country="US"` + a filtered `countries`.

**Do NOT use it for:**
- Non-phone numeric → `<falcon-angular-input-number>` / `<falcon-angular-input>`.
- A country picker with NO phone → `<falcon-angular-dropdown>`.
- OTP code entry → `<falcon-angular-otp>`.

## Status

**ACTIVE / PREFERRED.** Wave 2 of v3.1; `portal-popovers` (2026-05-15) + Phase C/Wave 6 Top-Layer migration (2026-05-21); `gate-12-rescope` (2026-06-02). **Validation deferred** — emits change/country-change/verify; the consumer validates.

## Replaces

- `ngx-intl-tel-input` + `google-libphonenumber` (uninstalled in Wave 2).
- Native `<input type="tel">` + a separate country `<select>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.ts` (injects `FalconStackingService`) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.css` (host + inner-tag width only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.tsx` (`shadow: true`, panel **inline**) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx` (`shadow: false`, panel **body-portaled**) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.types.ts` (7 interfaces) |
| Utils | `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.utils.ts` (`DEFAULT_PHONE_COUNTRIES` (25), `findCountryByIso`, `filterCountries`, `digitsOnly`, `composeFullNumber`, `isFieldInError`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/phone-field-tailwind-classes.ts` (cross-framework SSOT — ~22 class builders incl. panel/option/search) |
| Component token file | `libs/falcon-ui-tokens/src/components/phone-field.tokens.css` (14 categories; `:where(...)` includes `.falcon-overlay-container` for the portaled panel) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-phone-field` |
| Stencil Shadow tag | `<falcon-phone-field>` |
| Stencil Light tag | `<falcon-phone-field-tw>` |

## Known consumers (grep verified 2026-06-03)

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:453` — **flagship** (`verifyButton`+`verifyIcon`, `[readonly]` gated by `canEditPhone`+`isTargetStatusFrozen`, `[maxlength]="10"` — note: `maxlength` is NOT a wrapper input, see GAPS).
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html:60` — mobile-number capture for SMS OTP (`country="SA"`, `size="lg"`).
- `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` — account-owner phone.
- `apps/admin-console/.../add-user-wizard/user-personal-step/...` + `apps/management-console/.../add-user-wizard/user-personal-step/...` — new-user phone (both consoles).
- `apps/{admin,management}-console/.../templates-page/.../buttons/button-card.{html,ts}` + `templates-wizard/models.ts` — template builder phone field.
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` — Studio gallery default.

See `USAGE.md` Consumer Sweep for the full grep'd list (the legacy `<falcon-mobile-number>` shared-ui component wrapped it but is being phased out).

## Related components

- **Sibling family:** `<falcon-angular-email-field>` (same verify-button + single-border + 1px-divider family; phone adds the country chooser + dial code + the searchable popover panel).
- **Popover infra:** shares `popover-portal.ts` (`ensurePortaled`/`positionPopoverFixed`/`removeFromOverlay`) + `FalconStackingService` with `<falcon-dropdown>` / `<falcon-multi-select>`.
- Legacy wrapper: `<falcon-mobile-number>` (shared-ui) historically wrapped it.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Token contract in `libs/falcon-ui-tokens`. Presentational — never fetches; the country list is the static `DEFAULT_PHONE_COUNTRIES`; the flow owns any backend interaction (SMS OTP etc.).

## Verification
🟢 code-verified against `falcon-phone-field.component.ts` + `.html` + `falcon-phone-field.tsx` + `falcon-phone-field-tw.tsx` + `.types.ts` + `.utils.ts` + `phone-field.tokens.css` + `phone-field-tailwind-classes.ts` (2026-06-03). Consumer list 🟢 grep-verified 2026-06-03.
