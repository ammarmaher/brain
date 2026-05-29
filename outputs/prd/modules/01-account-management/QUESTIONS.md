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

---

## Resolutions (Wave 2 — 2026-05-17)

### Q-AM-11 — Classification Category + Sub-category source [PARTIAL RESOLUTION]

**Resolution: hardcoded enums in `Falcon.Commerce.Domain.Constants`.**

- [BRAIN-OUT] `backend/commerce/DTO_DICTIONARY.md` references `eClassificationCategory` (VIP / Critical / Normal) and `eClassificationSubCategory` (Bank / Gov / SemiGov / Large / Medium / SME) — both as **enum types**, not DB-backed lookups.
- **Implication:** adding a new classification requires a service redeploy.
- The PRD `latest-prd.md:37-38` doesn't mandate DB-editable behavior — it lists the values inline.
- DECISION-PROTOCOL `F-022` (conservative default): keep hardcoded enum as current state; if Operations wants DB-editable, that's a Phase 2 feature.
- **Action:** track as PRD enhancement candidate; not urgent.
- **Confidence:** High.

### Q-AM-13 — Allowed-IPs HTTP header name + scope [PARTIAL RESOLUTION]

**Inferred: header is system-config (single name across all accounts), not per-account.**

**Reasoning:**
- [PRD] `latest-prd.md:44` says: "Network Access uses an Allowed-IPs list, enforced via an agreed HTTP header parameter."
- "An agreed HTTP header" implies **a single agreed name** shared platform-wide, not "each account picks its own".
- [BRAIN-OUT] [[V-account-ip-allowlist-enforcement]] is triangulated and references gateway-level enforcement via the `Allowed-IPs` list (per-account values).
- [BRAIN-OUT] `Brain Outputs\understanding\backend\core-gateway\*` and `system-gateway\*` should contain the actual header name + middleware code.
- **Action:** read Core Gateway `Program.cs` to find the actual header name. Likely candidates: `X-Real-IP` (proxy-standard), `X-Forwarded-For` (proxy-standard), or a Falcon-custom name like `X-Falcon-Client-IP`.
- **Confidence:** Medium-low — requires gateway code read.

### Q-AM-19 — CommChannel count cap per active contract [INFERRED RESOLUTION]

**Inferred: no cap. The "Active contract + 3 visible commchannels + 4th" scenario implies no hard limit at the contract level.**

**Reasoning:**
- [PRD] `root-documents/latest-prd.md:24`: "Active contract + 3 visible commchannels; client wants to activate the 4th." — this is the entire backlog item; no further specification.
- [PRD] `latest-prd.md:91` (Step 2 Rate Card): "Rate Card Price Value applies to: Multiple-wallet accounts, OR Single-wallet accounts with EXACTLY ONE active commchannel" — this is about Rate Card applicability, not commchannel count cap.
- [BRAIN-OUT] Commerce DTOs have no `MaxCommChannelsPerContract` field anywhere.
- **Inferred:** The "Active contract + 4th commchannel" backlog item is asking what happens when a client wants to enable a fourth commchannel under an existing active contract. **The answer is: nothing special** — the contract's `RateCardEntry[]` and `ContractDetail[]` matrix just expand to cover the new commchannel. No re-activation needed.
- DECISION-PROTOCOL `F-022` conservative default: don't introduce a cap that isn't in the PRD.
- **Confidence:** Medium-high.
- **Action:** confirm with Jawad that no cap exists. If a cap is needed, treat it as a Phase 2 new business rule.

### Q-AM-20 — Single-wallet-multi-commchannel rate card selection [DEFERRED]

**Resolution: defer to PRD revision; not a runtime ambiguity tonight.**

**Reasoning:**
- The PRD `latest-prd.md:28` (BR-CC-20 via cross-link) explicitly says: "Rate Card Price Value applies to: Multiple-wallet accounts, OR Single-wallet accounts with **EXACTLY ONE active commchannel**."
- For Single-wallet-with-multiple-commchannels, the PRD itself says "applies to" excludes this case.
- This means: in Single-wallet-multi-commchannel, the SAR-to-Points conversion is undefined per current PRD.
- The backlog item Q-AM-20 says the answer requires "Changes in Doc + Screens" — i.e., **product team owns this scope decision**.
- **Action:** treat as PRD-extension request; surface to product team. Do not attempt to invent a fallback in code.
- **Confidence:** N/A — this is a deliberate product-scope question.

### Items NOT resolved (pending Drive deep-read or product input)

- Q-AM-01 (wallet topology change after balance), Q-AM-02 (deleted Normal User funds), Q-AM-03 (Account Limits edit enforcement), Q-AM-04 (Show→Hide while Active), Q-AM-05 (IP edit terminates sessions?), Q-AM-06 (Finance ID source), Q-AM-07 (transfer-limit baseline), Q-AM-08 (Account archive state), Q-AM-09 (Renewal job trigger), Q-AM-10 (full wallet UI per scenario — Drive Drawings deep-read), Q-AM-12 (System User definition), Q-AM-14 (umbrella PUT vs granular PATCH), Q-AM-15 (wallet topology edit endpoint), Q-AM-16 (PES sheet sync).
