*** PRD Understanding - Account Management - BUSINESS_RULES ***

# 01-account-management - Business Rules

> Citations point at `Brain SK\skills\imported-business\prd-knowledge\modules\01-account-management\latest-prd.md` unless otherwise noted.
> `[CONFIRMED]` = explicit in PRD. `[INFERRED]` = derived from multiple PRD statements. `[OPEN]` = silent or ambiguous (also surfaced in QUESTIONS.md).

## Hierarchy & Creation

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-01 | Falcon hierarchy is three-level: Root (Falcon) -> Main node (Client / Account) -> Sub-node (multi-level, internal). | latest-prd.md:26-29 | [CONFIRMED] |
| BR-AM-02 | Only Falcon usertypes (System Administrator, Product) can create accounts. Operation cannot. | latest-prd.md:31; understanding.md:42 | [CONFIRMED] |
| BR-AM-03 | Account Name must be unique across Falcon, <=30 chars, must start with a letter, mandatory. | latest-prd.md:34 | [CONFIRMED] |
| BR-AM-04 | Account ID is auto-generated and mandatory. | latest-prd.md:35 | [CONFIRMED] |
| BR-AM-05 | Finance ID is sourced from the Finance team and is mandatory at create time. | latest-prd.md:36 | [CONFIRMED] |
| BR-AM-06 | Classification Category is optional, from a dropdown: VIP / Critical / Normal. | latest-prd.md:37 | [CONFIRMED] |
| BR-AM-07 | Classification Sub-category is optional: Bank / Gov / SemiGov / Large / Medium / SME. | latest-prd.md:38 | [CONFIRMED] |
| BR-AM-08 | Authority Letter Type is one of Government / Commercial / Charity; each value has two linked fields (Sector + ID). | latest-prd.md:40 | [CONFIRMED] |

## Settings

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-09 | Password Security Level is one of {Normal, Advanced}. | latest-prd.md:43 | [CONFIRMED] |
| BR-AM-10 | Network Access uses an Allowed-IPs list, enforced via an agreed HTTP header parameter. Requests missing the header, missing the value, or with an IP not on the list are rejected. | latest-prd.md:44 | [CONFIRMED] |
| BR-AM-11 | Account Limits include: Max Normal User Limit, Max System User Limit, Max Node Levels, Balance Transfer Limit (%). All accept `0` meaning "no limit"; empty is not allowed; default is 0. | latest-prd.md:45 | [CONFIRMED] |
| BR-AM-12 | System User count and Normal User count are independent (separate limits). | latest-prd.md:45; understanding.md:47 | [CONFIRMED] |
| BR-AM-13 | Account Limits are configured at create-time as part of Step 2 (mandatory step). | latest-prd.md:42 | [CONFIRMED] |

## CommChannel & Application Configuration

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-14 | CommChannel/Application Visibility default is `Hide`. | latest-prd.md:48 | [CONFIRMED] |
| BR-AM-15 | If Visibility = `Show`, Pricing Type AND Price Value become mandatory. | latest-prd.md:48 | [CONFIRMED] |
| BR-AM-16 | Pricing Type is one of {Monthly, Yearly, One Time Payment}. | latest-prd.md:48 | [CONFIRMED] |
| BR-AM-17 | Price Value must be >=0 in SAR. | latest-prd.md:48 | [CONFIRMED] |
| BR-AM-18 | Steps 3 (CommChannels) and 4 (Applications) of the Add Client wizard are OPTIONAL during account creation. | latest-prd.md:47, 50 | [CONFIRMED] |
| BR-AM-19 | Step 5 of the wizard creates the Account Owner user (mandatory). | latest-prd.md:53 | [CONFIRMED] |

## Commchannel / App Status Lifecycle

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-20 | Statuses are: InActive (First time), Paid, Active, Expired, InActive (Grace Period Ends), Disabled. | latest-prd.md:56-63 | [CONFIRMED] |
| BR-AM-21 | Grace period when expiration is reached without payment: 7 days for Monthly pricing, 30 days for Yearly or One Time Payment. | latest-prd.md:61 | [CONFIRMED] |
| BR-AM-22 | Activation of a commchannel/app deducts price from Master Wallet on payment and tags the resulting record with the originating contract ID. | latest-prd.md:62; understanding.md:48 | [INFERRED] (text describes payment + nearest-expiring rule; explicit tag derived from BR-AM-26) |
| BR-AM-23 | Renewal: on Renew Date, system attempts deduction from Master Wallet -> success keeps status Active; failure -> Expired + grace period; grace ends without payment -> InActive (Grace Period Ends). | understanding.md:73-74 | [INFERRED from PRD status definitions] |
| BR-AM-24 | Disabled is a manually-triggered state (separate from automatic Expired / InActive transitions). | latest-prd.md:63 | [CONFIRMED] |

## Wallet & Balance

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-25 | Balance Type (User-based / Node-based) and Wallet Type (Single / Multiple) are Falcon-usertype-only configurations. | latest-prd.md:67-73 | [CONFIRMED] |
| BR-AM-26 | The Wallet matrix has four configurations: User+Single, User+Multiple, Node+Single, Node+Multiple. | latest-prd.md:75-79 | [CONFIRMED] |
| BR-AM-27 | In Node-based balance, only Normal Users can consume in transactions; Node Admins hold but do not consume. | latest-prd.md:69 | [CONFIRMED] |
| BR-AM-28 | Master Wallet is an abstract aggregate equal to the lump sum of Active contracts' wallet records (accessible by Falcon usertype, and AO in some cases). | latest-prd.md:82-83; understanding.md:45 | [CONFIRMED] |
| BR-AM-29 | Comm Wallet is a per-commchannel wallet that exists only in Multiple-wallet mode; populated by Falcon-usertype-only transfers from Master. | latest-prd.md:83 | [CONFIRMED] |
| BR-AM-30 | Transfer Master <-> Comm Wallet is Falcon-usertype-only. | latest-prd.md:87 | [CONFIRMED] |
| BR-AM-31 | Transfer Comm Wallet <-> User/Node commchnl wallet is allowed for Falcon usertype + Account Owner. | latest-prd.md:88 | [CONFIRMED] |
| BR-AM-32 | Transfer User/Node wallet <-> User/Node wallet is allowed for Falcon usertype + Account Owner + Node Admin. | latest-prd.md:89 | [CONFIRMED] |
| BR-AM-33 | In Single-wallet mode, Master <-> User/Node transfer is allowed for Falcon + AO. | latest-prd.md:90 | [CONFIRMED] |
| BR-AM-34 | Balance Transfer Limit (%) caps every non-Master-source transfer; Master Wallet as source is exempt; 0% = no limit. | latest-prd.md:91; understanding.md:46 | [CONFIRMED] |

## Contract Interplay

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-35 | Contract value flows into Master Wallet on activation. | latest-prd.md:95 | [CONFIRMED] |
| BR-AM-36 | Every balance-affecting action (Deduction, Purchase, Transfer) is tagged with the originating contract ID. | latest-prd.md:96 | [CONFIRMED] |
| BR-AM-37 | Deductions traverse Active contracts nearest-expiring first. | latest-prd.md:97 | [CONFIRMED] |
| BR-AM-38 | On contract expiration, wallet records are retained but subtracted from all wallet lump-sum values. | latest-prd.md:98 | [CONFIRMED] |

## Open / Unstated

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-AM-39 | Account Limits edits applied while users already exceed the new limit — enforcement mode (reject vs grandfather) is silent in PRD. | understanding.md:81; latest-prd.md:115 | [OPEN] |
| BR-AM-40 | Behavior of a commchannel when Visibility flips Show -> Hide while Status is Active is silent in PRD. | understanding.md:82 | [OPEN] |
| BR-AM-41 | Migration when Balance Type / Wallet Type is changed mid-life is silent in PRD. | understanding.md:83; latest-prd.md:114-122 | [OPEN] |
| BR-AM-42 | Fate of balance held by a Normal User being deleted is silent in PRD. | understanding.md:83 | [OPEN] |

> More wallet-transfer per-scenario rules exist in the Drive Drawings + Wallet doc but were not text-extractable in this sync. See `latest-prd.md:108-122` (extensive Open Questions list).
