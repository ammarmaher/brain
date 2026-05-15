*** Component note — Falcon OTP Send Dialog ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-otp-send-dialog/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon OTP Send Dialog

> Two-step verify-identity dialog: step 1 channel chooser (email / sms / both) → step 2 OTP entry with Verify + Resend. Composes `<falcon-angular-dialog>` + `<falcon-angular-radio>` + `<falcon-angular-otp>` + `<falcon-angular-button>`.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] (`otp-popup` — account-owner verify inside Add Client wizard).
- Login verify step in user-management (no page seeded yet under `10-Pages/`).

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard account-owner verify.
- [[02 User Management]] — Login + 2FA setup.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-otp-send-dialog/GAPS_AND_UPGRADES.md) — `G4` resend cooldown (P1, common ask), `G5` code-expired state, `G1` method proxies, `G3` translate-key support, `G8` help link.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-otp-send-dialog`.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
