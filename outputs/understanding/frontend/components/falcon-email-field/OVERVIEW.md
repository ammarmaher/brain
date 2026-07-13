# falcon-email-field — OVERVIEW

## Component purpose

Email input that pairs a native `<input type="email">` with an optional in-field **"Verify" button** — both inside ONE shared outer border (single-element look; the verify partition is a 1px vertical divider, NOT a second border). Dual-render Stencil pattern (Shadow `<falcon-email-field>` + Light `<falcon-email-field-tw>`) behind the Angular CVA tag-switcher `<falcon-angular-email-field>`. **Validation is explicitly deferred** — the component emits a `falcon-verify` intent; the consumer owns format validation AND the actual verification challenge.

> Unlike `<falcon-password>` (whose Shadow tag composes `<falcon-input>`), email-field renders its **own native `<input type="email">`** with a dedicated `--falcon-email-field-*` token set. It does not compose `<falcon-input>`.

## Business / UI use case

- Editing a stored email in the **User Details** page (admin + management) — the flagship, with `verifyButton` + `verifyIcon` gated by a `canEditEmail` PES flag.
- Account-owner / new-user email entry in Add Client / Add User wizards.
- Any email field where the consumer wants an in-field "Verify" affordance to launch an email-ownership challenge.

## When to use it / when NOT to use it

**Use it for:**
- Email fields that need a verify-button affordance.
- Email entry where the single-element verify look is wanted.

**Do NOT use it for:**
- Plain email with no verify affordance → `<falcon-angular-input type="email">` is sufficient.
- Generic text → `<falcon-angular-input>`.
- Phone (country chooser) → `<falcon-angular-phone-field>`.
- Password → `<falcon-angular-password>`.

## Status

**ACTIVE / PREFERRED** for verify-email flows. **Validation deferred** (`[CODE]` `falcon-email-field.tsx:4-5` banner). Not deprecated.

## Replaces

- Native `<input type="email">` + an adjacent ungrouped verify button.
- Any PrimeNG `p-inputgroup` email + button hand-assembly.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-email-field/falcon-email-field.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-email-field/falcon-email-field.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-email-field/falcon-email-field.component.css` (host `display:block; width:100%` + inner-tag width only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-email-field/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.tsx` (`shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.css` (token-only, `@apply` + tokens) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-email-field-tw/falcon-email-field-tw.tsx` (`shadow: false`) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-email-field-tw/falcon-email-field-tw.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.utils.ts` (`isFieldInError`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/email-field-tailwind-classes.ts` (cross-framework SSOT — 9 class builders) |
| Component token file | `libs/falcon-ui-tokens/src/components/email-field.tokens.css` (14 categories) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-email-field` |
| Stencil Shadow tag | `<falcon-email-field>` |
| Stencil Light tag | `<falcon-email-field-tw>` |

## Known consumers (grep verified 2026-06-03)

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:474` — **flagship** (`verifyButton` + `verifyIcon` + `verifyLabel` + `verifyDisabled`, `[readonly]` gated by `canEditEmail` + `isTargetStatusFrozen`).
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` — Studio gallery default (component registry / showcase).

> The prior dossier listed `playground.page.html` as the sole consumer — stale. The real production consumer is the shared User-Details page (rendered by BOTH admin-console and management-console). See `USAGE.md` Consumer Sweep.

## Related components

- **Sibling family:** `<falcon-angular-phone-field>` (same verify-button + single-border + 1px-divider family; phone adds a country chooser, email has no chooser — `[CODE]` `email-field.tokens.css:7` "No country chooser (the only delta from `<falcon-phone-field>`)").
- **Sibling:** `<falcon-angular-input type="email">` (plain email, no verify).
- Pairs with an OTP/verification flow that the consumer owns (the component only emits `falcon-verify`).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Token contract in `libs/falcon-ui-tokens`. Presentational — never sends the verification request; the consuming feature/state slice does.

## Verification
🟢 code-verified against `falcon-email-field.component.ts` + `.html` + `falcon-email-field.tsx` + `falcon-email-field-tw.tsx` + `email-field.tokens.css` + `email-field-tailwind-classes.ts` (2026-06-03). Consumer list 🟢 grep-verified 2026-06-03.
