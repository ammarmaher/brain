*** PRD Understanding - Root Documents - QUESTIONS ***

# root-documents - Open Questions

> The cross-cutting backlog list from `Points to be covered later` is reproduced here verbatim with provenance + status. Individual items are also propagated into the relevant module's QUESTIONS.md (see the table at end).

## Cross-Cutting Backlog (from `Points to be covered later`)

| # | Topic | Owner-hint | Module(s) | Citation |
|---|---|---|---|---|
| Q-RD-01 | Check with Haytham and Thamer the codec Opus vs G711 U. | [Jawad] | Voice CommChannel (no owning module yet) | latest-prd.md:19 |
| Q-RD-02 | % of allowed transfer amount, setting per account. | - | 01-account-management (Balance Transfer Limit %) | latest-prd.md:20 |
| Q-RD-03 | Moving node from level to level. | - | 01-account-management (hierarchy restructuring) | latest-prd.md:21 |
| Q-RD-04 | Refund (failed campaign) - to which contract does the balance return; what expiration date. | - | 03 + 01 (wallets) | latest-prd.md:22 |
| Q-RD-05 | Addons purchase fallback - which contract defines the addon rate card when the searched contract has no matching addon. | - | 03 (addons) | latest-prd.md:23 |
| Q-RD-06 | Confirmation / warning messages should not be hardcoded - store in DB, editable without release. | - | Cross-platform / i18n | latest-prd.md:24 |
| Q-RD-07 | "Active contract + 3 visible commchannels; client wants to activate the 4th." | - | 01 (commchannel visibility limits?) | latest-prd.md:25 |
| Q-RD-08 | Falcon usertype can edit user phone number and status without validations. | - | 02 (admin override) | latest-prd.md:26 |
| Q-RD-09 | Phone Number fields - Country Code, NDC, length. Settings: Country list, CC, NDC, length. Account: Destination Settings: enable per service. Contract Details: All Countries Allow/Deny should have Price. | - | 03 (destination logic) | latest-prd.md:27 |
| Q-RD-10 | Template configuration inheritance - currently per commchannel per account; later maybe per Main node inherited to sub-nodes with override. | - | 05 + 01 | latest-prd.md:28 |
| Q-RD-11 | Convert to points in single wallet with multiple commchannels - which rate card, how. Changes in Doc + Screens. | [Dina Mansour / Noor Joudeh] | 01 + 03 | latest-prd.md:29 |

## Propagation Status

All 11 items have been propagated to the relevant module's `QUESTIONS.md`:

| Backlog Q | Propagated to |
|---|---|
| Q-RD-01 | (no module yet — flagged as `Voice CommChannel` future) |
| Q-RD-02 | 01 -> Q-AM-17 |
| Q-RD-03 | 01 -> Q-AM-18 |
| Q-RD-04 | 03 -> Q-CC-14 (cross-link 01) |
| Q-RD-05 | 03 -> Q-CC-15 |
| Q-RD-06 | (cross-cutting platform; flagged in 05 Q-TM-22 as the closest module touchpoint) |
| Q-RD-07 | 01 -> Q-AM-19 |
| Q-RD-08 | 02 -> Q-UM-16 |
| Q-RD-09 | 03 -> Q-CC-23 (destination logic; deep-sync needed on Phone Number Analysis V6) |
| Q-RD-10 | 05 -> Q-TM-21 (cross-link 01) |
| Q-RD-11 | 01 -> Q-AM-20 (cross-link 03) |

## Banned synonyms / glossary discipline

- These are meta-documents; the glossary applies to the modules they map to, not to the docs themselves.
- The Drive folder uses **"Points to be covered later"** as the file name — preserve verbatim when referencing.
- The Drive folder uses **"Copilot 4DevOps"** (note: `4` not `for`); preserve verbatim.
