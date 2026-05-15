*** Add Client — Falcon component map ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Falcon component map

> Which Falcon library components compose each step. Authoritative dossier path: `C:\Falcon\Brain Outputs\understanding\frontend\components\<name>\` (per the Brain SK CLAUDE.md canonical knowledge path).

## Component table

| Component | Step(s) used | Notes |
|---|---|---|
| [[Falcon Stepper Legacy]] (current consumer) / [[Falcon Stepper]] + [[Falcon Wizard]] (modern target) | shell | 5-step horizontal stepper; error state on failed step |
| [[Falcon Dialog]] | shell | Wizard modal container (alternative: drawer) |
| [[Falcon Input]] | 1, 5 | Text inputs (Account Name, address fields, names) |
| [[Falcon Input Number]] | 2, 3, 4 | Numeric inputs (limits, price values) |
| [[Falcon Dropdown]] | 1, 2, 3, 4, 5 | Classification, authority letter, country/city/sector, password level, pricing type, role, delivery method |
| [[Falcon Toggle]] | 3, 4 | Visibility toggle per row |
| [[Falcon Checkbox]] | (potential) | If used for grouped options |
| [[Falcon Button]] | shell + 5 | Next / Previous / Submit / Save Draft / Cancel |
| [[Falcon Data Table]] | 3, 4 | CommChannels + Apps row tables |
| [[Falcon Email Field]] | 5 | Email input (built-in `Validators.email`) |
| [[Falcon Phone Field]] / [[Falcon Mobile Number]] | 5 | Phone input (E.164/Saudi format) |
| [[Falcon Password]] | (server-generated; not rendered) | Document only — no input on Step 5; AO sees password on credential-delivery message |
| [[Falcon Single Uploader]] / [[Falcon Uploader (generic)]] | 1, 5 | Profile picture uploaders |
| [[Falcon Tag]] | 3, 4 | CommChannel / App name display |
| [[Falcon Icon]] | 3, 4 | Channel / App icon in row |
| [[Falcon Status Badge]] | (post-create) | Status pills (not on Add Client wizard itself; applies to Org Hierarchy table view post-create) |
| [[Falcon Notification]] / [[Falcon Toast]] | shell | Error toasts |
| [[Falcon Form Field]] | shell | Form label wrapper (legacy) — modern path uses Tailwind grid directly per Noor Instructions |
| [[Falcon Textarea]] | 1 | Additional Address (free-text) |
| [[Falcon Radio Group]] | 5 | Alternate UI for Delivery Method (Email / SMS / Both) |

## Customization order rule

Per project standing rule (`feedback_library_skeleton_app_api.md`):

```
inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP
```

The Add Client wizard must be implemented as an **app-level wrapper** under `apps/admin-console/.../add-client/` consuming pure-presentational library skeletons. Backend service calls live in the wrapper, never in the library skeleton.

## Token surface highlights

- Tailwind utilities only (no SCSS, no component CSS, no PrimeNG) per project standing rules.
- All colors, borders, radii, shadows, spacing, fonts go through Falcon tokens — never inline, never hardcoded.
- Per-form layout: 2-column responsive Tailwind grid (page rules in [../UI_UX_RULES.md](../UI_UX_RULES.md)); labels above inputs, RTL-aware spacing.
- Multi-language: `MultiLanguage(En, Ar)` for catalog reads (CommChannel.Name, Application.Name); user-entered Account Name is single-language (intentional deviation).
- Pre-finish grep gate: no inline styles, no hardcoded color/spacing/radius values — tokens only.

## App-level wrapper pattern

- Library skeleton (`libs/falcon-ui-core/`) is pure presentational — no service injection.
- App-level wrapper (`apps/admin-console/.../add-client/`) consumes the skeleton, owns HttpClient calls, business state, navigation.
- Wrapper imports skeleton via the wrapper's TS path alias.
- Reference doctrine: `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6 (per `feedback_library_skeleton_app_api.md`).

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Falcon Stepper]] · [[Falcon Wizard]] · [[Falcon Dialog]] · [[Falcon Input]] · [[Falcon Input Number]] · [[Falcon Dropdown]] · [[Falcon Toggle]] · [[Falcon Checkbox]] · [[Falcon Button]] · [[Falcon Data Table]] · [[Falcon Email Field]] · [[Falcon Phone Field]] · [[Falcon Mobile Number]] · [[Falcon Password]] · [[Falcon Single Uploader]] · [[Falcon Uploader (generic)]] · [[Falcon Tag]] · [[Falcon Icon]] · [[Falcon Status Badge]] · [[Falcon Notification]] · [[Falcon Toast]] · [[Falcon Form Field]] · [[Falcon Textarea]] · [[Falcon Radio Group]] · [[COMPONENT_INDEX]] · [[AMMAR_BRAIN_HOME]]
