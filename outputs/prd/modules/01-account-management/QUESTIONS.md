*** PRD Understanding - Account Management - QUESTIONS ***

# 01-account-management - Open Questions

> Carried forward from `understanding.md:142-152` (existing questions) plus new ones found during cross-reference and the `root-documents` backlog.

## Inherited from existing understanding.md (preserved verbatim)

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-AM-01 | Can Wallet Type or Balance Type be changed after the account has real balances? If yes, what is the migration flow? | Changes the live wallet topology; migration of existing WalletRecords across new wallets could lose / scramble linkage. | Wallet doc `Acc - Wallet & Balance Mng VB4`; ask Ammar / Dina (PRD silent). |
| Q-AM-02 | What happens to the wallet balance of a Normal User being deleted? (BR-AM-42) | Funds could otherwise become stranded. | Wallet doc; ask Dina (PRD silent). |
| Q-AM-03 | What is the enforcement mode for Account Limits edits — reject subsequent actions, grandfather existing? (BR-AM-39) | Edit-time UX (alert? silent?) and runtime gating depend on this. | `latest-prd.md:42-45`; ask Jawad / Dina. |
| Q-AM-04 | Visibility flipped Show -> Hide while status is Active — is the commchannel still consumable by existing users? (BR-AM-40) | Determines whether Hide is a soft-disable or only a list-filter. | Drive Drawing `Figure Acc.5..17`; ask Jawad. |
| Q-AM-05 | When Allowed IPs is edited to exclude an active user's current IP, are active sessions terminated? | Cross-cuts 02-user-management's session model + Gateway IP enforcement. | `latest-prd.md:44`; check Identity / Gateway behavior in `Brain Outputs\understanding\backend\identity\` + `core-gateway\`. |
| Q-AM-06 | Who creates the Finance ID — entered by Falcon operator, or pulled from Finance system automatically? | Determines whether to integrate or treat as opaque string. | Ask Finance team; PRD ambiguous (`latest-prd.md:36`). |
| Q-AM-07 | Balance transfer limit % computed vs what baseline — source-wallet balance at transfer time, per day, per action? | Different baselines lead to different runtime checks. | PRD `latest-prd.md:91`; ask Jawad. |
| Q-AM-08 | Is there an Account archive state, or only Active / Deleted? | Affects soft-delete vs hard-delete semantics. | PRD silent. |
| Q-AM-09 | What triggers the Renewal job — cron, on-demand, or first usage after Renew Date? | Cron implementation differs from event-driven implementation. | Drive `Figure Acc.6` + ask Mahmood. |
| Q-AM-10 | Full text of wallet transfer UI flows per scenario cell — 4 cells x many actions. Deep sync needed on Drive Drawings + Wallet doc. | Implementation is gated on this; current understanding is structural only. | Drive `Wallet 1..8 ...` drawings; `Acc - Wallet & Balance Mng VB4` deep read. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-AM-11 | What is the source-of-truth for Classification Category and Sub-category lists? Hardcoded enum, DB-backed lookup, or DB-editable without deployment? | Affects whether Falcon Ops can add new classifications without a release. | PRD `latest-prd.md:37-38`; Commerce `eClassificationCategory`, `eClassificationSubCategory` enums in `Falcon.Commerce.Domain.Constants` (currently hardcoded). |
| Q-AM-12 | Is `System User` a distinct entity type, or a Normal User flagged as system? PRD references Max System User Limit but never defines the type. | Limit-counting and creation flow are gated on this. | `latest-prd.md:45`; ask Jawad. |
| Q-AM-13 | The Allowed IPs enforcement uses an HTTP header; what header name, and is it system-config or per-account? | Configuration shape and gateway code depend on this. | Gateway code at `Brain Outputs\understanding\backend\core-gateway\`; check `Cors:` and IP allowlist sections. |
| Q-AM-14 | Does Commerce currently support PATCH on AccountSettings as a separate endpoint, or only the umbrella `PUT /api/Setting`? Inconsistent endpoint shapes between PRD-implied granular endpoints (`POST /commchannels/{id}/enable|disable|visibility|pricing|payment`) and actual `Falcon.Commerce.Api/NodeController` (per-action POST/PUT/DELETE pattern). | Affects gap mapping in GAPS.md. | Commerce `ENDPOINT_REGISTRY.md`. |
| Q-AM-15 | Wallet topology is configured by `POST /api/Setting/wallets` (`ConfigureWalletSettingsRequest`) — is changing the config a fresh POST or a separate PATCH? PRD silent on "edit-mode" of wallet config. | Determines whether Q-AM-01's migration applies to the same endpoint or a different one. | Commerce `SettingController` source. |
| Q-AM-16 | The Permission matrix (`Permission list - Jawad`) is the authoritative gate for every action; is the sheet kept in sync with the PES policy rules in `falcon-core-access-svc`? | Drift between sheet and PES rules causes runtime allow/deny surprises. | Access service `falcon-core-access-svc/` policy rule data store. |

## Cross-cutting backlog items (from root-documents/latest-prd.md) that touch Account Management

| # | Topic | Action |
|---|---|---|
| Q-AM-17 | "% of allowed transfer amount, setting per account." (root-documents/latest-prd.md:20) | Already covered by BR-AM-34; confirm UI gives a clean numeric input with 0=no limit. |
| Q-AM-18 | "Moving node from level to level." (root-documents/latest-prd.md:21) | Hierarchy restructuring — PRD silent on whether Falcon can re-parent a sub-node. |
| Q-AM-19 | "Active contract + 3 visible commchannels; client wants to activate the 4th." (root-documents/latest-prd.md:24) | Open. PRD does not state whether there is a visible-commchannel count cap per active contract. |
| Q-AM-20 | "Convert to points in case of single wallet with multiple commchannels — which rate card, how. Changes in Doc + Screens." (root-documents/latest-prd.md:29) | Currently the rate card is applicable when one active commchannel exists in Single-wallet (PRD Step 2 of contract). The multi-commchannel-single-wallet case is **explicitly flagged as TBD**. |

## Banned synonyms / glossary discipline

- The PRD uses both **Account** and **Client** interchangeably. Per the Falcon domain glossary, **Client** is the canonical business term and **Account** is the technical model. Code consistently uses `Account` (e.g. `CreateAccountRequest`); flag for any UI / business-facing copy that mixes the two and standardize on Client.
- The PRD uses **Master Wallet** consistently; do NOT alias as "main wallet" or "primary wallet".
- The PRD uses **Falcon usertype** to mean the admin-side user (vs Client usertype = client-side). Both are precise; avoid "internal user" / "external user" aliases.
- The PRD uses **CommChannel** (one word). Code mixes `CommunicationChannel` (DTOs) and `CommChannel` (some helpers); the glossary should pick one. Flagged.
