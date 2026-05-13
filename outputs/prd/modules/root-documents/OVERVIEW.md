*** PRD Understanding - Root Documents - OVERVIEW ***

# root-documents - Overview

> Source: `Brain SK\skills\imported-business\prd-knowledge\modules\root-documents\latest-prd.md` (`Points to be covered later` + `Copilot 4DevOps`, both at Drive folder root, Sync 2026-04-24).

## Purpose

The Drive folder root contains TWO meta-documents that are **NOT PRDs**:

1. **`Points to be covered later`** - a living backlog of cross-cutting open topics that span multiple business modules. Each item maps to one of the 5 business modules and should be tracked as that module's open question.
2. **`Copilot 4DevOps`** - a prompt library used by Falcon's product team inside Azure DevOps to convert BRDs into backlogs, improve user stories, split stories, and generate QA scenarios. **It is tooling guidance, not requirements**. No runtime impact on any module.

This pseudo-module exists so:
- Cross-cutting backlog items are visible alongside per-module understanding.
- The Copilot prompt library is catalogued without polluting business analysis.
- Future re-syncs find both files at the expected location.

## Actors

This module has **no actors**. It is meta-documentation.

| Actor | Role | Why listed |
|---|---|---|
| Falcon Product team | Owners of the backlog | Add/remove items in `Points to be covered later` as PRDs evolve. |
| Falcon Product team | Owners of the prompt library | Update `Copilot 4DevOps` if AI workflows change. |
| All module agents (Brain) | Cross-link readers | Should propagate backlog items into the relevant module's QUESTIONS.md. |

## Main Screens

None. Meta-documents only.

## Main Actions

None. Read-only references.

## Module Dependencies

- **01-account-management** - Several `Points to be covered later` items map here (Balance Transfer Limit %, Moving Node level, Active Contract + 4th commchannel, Convert-to-points in single-wallet-multi-commchannel).
- **02-user-management** - "Falcon usertype edit phone/status without validations" item.
- **03-contract-packaging-charging-billing-management** - Refund flow, Addons rate-card fallback, Phone Number / Destination logic.
- **05-templates** - Template configuration inheritance.
- **Cross-platform / i18n** - "Confirmation / warning messages should not be hardcoded" item.
- **Voice CommChannel** - "Codec Opus vs G711 U" item (not yet owned by any module).

## Mapping Table (verbatim from `latest-prd.md:15-29`)

| Topic from `Points to be covered later` | Maps to module |
|---|---|
| [Jawad] Check with Haytham and Thamer the codec Opus vs G711 U. | Voice CommChannel (no module owns yet) |
| % of allowed transfer amount, setting per account. | 01-account-management |
| Moving node from level to level. | 01-account-management |
| Refund (failed campaign) - to which contract; what expiration date. | 03 + 01 (wallets) |
| Addons purchase fallback - which contract's addon rate card when searched has no matching addon. | 03 |
| Confirmation / warning messages should not be hardcoded - store in DB. | Cross-cutting i18n |
| Active contract + 3 visible commchannels; client wants 4th. | 01 (commchannel visibility limits?) |
| Falcon usertype can edit user phone number and status without validations. | 02 |
| Phone Number fields - Country Code, NDC, length. Destination settings + Allow/Deny by country with price. | 03 (destination logic) |
| Template configuration inheritance per Main node to sub-nodes with override. | 05 + 01 |
| Convert to points in single wallet with multiple commchannels - which rate card. | 01 + 03 |
