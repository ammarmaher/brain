# Root Documents — Source Record

These two files live at the Drive root and are NOT PRDs. They're kept here as the `root-documents` module for traceability.

## 1. `Points to be covered later`

| Field | Value |
|---|---|
| Mime type | Google Doc |
| Modified | 2026-04-13 |
| Size | Small (20 lines captured, 1.9 KB) |
| Purpose | Backlog of pending product topics to address in later PRD revisions |
| Treatment | Cross-cutting open questions — cite from any module's `understanding.md` when the topic applies |

### Extracted open topics (verbatim list, with module mapping)

| Topic | Maps to module |
|---|---|
| [Jawad] Check with Haytham and Thamer the codec Opus vs G711 U. | Voice CommChannel (not yet owned by a module here) |
| % of allowed transfer amount, setting per account. | 01-account-management (Balance Transfer Limit %) |
| Moving node from level to level. | 01-account-management (hierarchy restructuring) |
| Refund (failed campaign) — to which contract does the balance return; what expiration date. | 03-contract-packaging-charging-billing-management + 01-account-management (wallets) |
| Addons purchase fallback — which contract defines the addon rate card when the searched contract has no matching addon. | 03-contract-packaging-charging-billing-management |
| Confirmation / warning messages should not be hardcoded — store in DB, editable without release. | Cross-cutting platform / i18n |
| "Active contract + 3 visible commchannels; client wants to activate the 4th." | 01-account-management (commchannel visibility limits?) |
| Falcon usertype can edit user phone number and status without validations. | 02-user-management |
| Phone Number fields — Country Code, National Destination Code, length. Settings → Country list, CC, NDC, length. Account → Destination Settings → enable per service. Contract Details → All Countries Allow/Deny should have Price. | 03-contract-packaging-charging-billing-management (destination logic) |
| Template configuration inheritance — currently per commchannel per account; maybe later on Main node inherited to sub-nodes with override. | 05-templates + 01-account-management |
| (Dina Mansour / Noor Joudeh) Convert to points in case of single wallet with multiple commchannels — which rate card, how. Changes in Doc + Screens. | 01-account-management + 03-contract-packaging-charging-billing-management |

## 2. `Copilot 4DevOps`

| Field | Value |
|---|---|
| Mime type | Google Doc |
| Modified | 2026-03-15 |
| Size | 9 KB (451 lines) |
| Purpose | Prompt library for Copilot / AI used by Falcon product team inside Azure DevOps workflows |
| Treatment | NOT a business requirement — tooling guide only |

### Content (high-level)

Collection of prompt templates for:
1. Convert BRD → Azure DevOps backlog (Epic / Features / User Stories with Gherkin acceptance criteria).
2. Improve an existing user story (clarity + testability + edge cases).
3. Split a large story into smaller stories.
4. Generate QA test scenarios (happy / negative / edge / failure).
5. Convert scenarios to detailed QA test cases (ID / preconditions / steps / expected).
6. Find missing edge cases in user stories.
(Further sections beyond captured; file continues.)

### Why it's here

Stored at Drive root alongside PRDs. Not relevant to module understanding; not used for test-case generation against business modules. Included for completeness and so it's not missed in re-syncs.
