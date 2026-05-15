---
type: falcon-component
component: Falcon OTP
folder-name: falcon-angular-otp-send-dialog
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon OTP ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-otp/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon OTP

> N-digit one-time-passcode entry (default 6 boxes) with auto-advance, backspace-retreat, paste-fill, and keyboard nav. CVA-supported. Replaces PrimeNG `<p-inputOtp>`.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-otp/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-otp/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-otp/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-otp/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-otp/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-otp/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] (`otp-popup` section — composed inside `<falcon-angular-otp-send-dialog>`).
- Also used in user-management Login + 2FA + Forgot Password flows (no page seeded yet under `10-Pages/`).

## PRDs that use this component

- [[02 User Management]] — Login OTP / 2FA codes.
- [[01 Account Management]] — Account-owner verify step inside Add Client wizard.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-otp/GAPS_AND_UPGRADES.md) — `G1` `falconComplete` event (P1, auto-submit UX), `G3` method proxies, `G4` SMS auto-fill, `G6` mask character.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-otp`.

## Tags

#type/falcon-component #prd/01 #prd/02

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
