# Attachments — Account Management

## Word files / Google Docs (supporting)

### `Acc - Wallet & Balance Mng VB4` (Google Doc) — PRIMARY SUPPORTING

- Version: VB4 (latest of VB1..VB4 series).
- Size: 1794 KB (large; embedded visuals).
- Modified: 2026-03-24.
- Purpose: Deep-dive on Wallet & Balance Management. Describes Master / Comm / User / Node wallets, Balance Type (User/Node), Wallet Type (Single/Multiple), the 2×2 configuration matrix, transfer rules, and actions that impact balance.
- Used for understanding: YES — informed `understanding.md` > `Wallet & Balance Management` section.
- Cached: `C:/Users/User/.gdrive/cache/01-account-management__support__Acc_-_Wallet_Balance_Mng_VB4.txt` (head captured).

### Older wallet docs (NOT selected; kept for history)

- `Acc - Wallet & Balance Mng VB3` — VB3, superseded.
- `Acc - Wallet & Balance Mng VB2` — VB2, superseded.
- `Acc - Wallet & Balance Mng VB1` — VB1, superseded.

### `Acc - CommChannels & Marketplace MenuItems` (Google Doc)

- Size: 5 KB.
- Modified: 2026-02-02.
- Purpose: Defines commchannel vs marketplace menu items from an information-architecture standpoint.
- Used for understanding: Referenced but not yet deeply extracted — flagged as open question for deep-sync pass.

## Excel files (Google Sheets)

### `Account Setting & Others`

- Size: 4 KB / 52 lines.
- Modified: 2026-01-13.
- Purpose: Reference table for Account Settings — Password security behavior, Allowed IPs enforcement, Account limits interpretation.
- Used for understanding: YES (secondary; top-level rules captured from PRD).

### `Account Mngmnt Module - User Stories`

- Size: 3 KB / 71 lines.
- Modified: 2025-12-23.
- Purpose: Backlog-style user stories supporting the Account PRD.
- Used for understanding: SECONDARY — useful for test-case generation.

### `Wallets & Balance Mngmnt and Flow`

- Size: 5 KB / 42 lines.
- Modified: 2026-04-16.
- Purpose: Tabular summary of wallet actions × rules.
- Used for understanding: YES — cross-referenced with wallet-management doc.

## Images / screenshots / diagrams (Drive Drawings — 57 total)

Text extraction not possible for Drive Drawings. Cataloged below by theme. Only the latest / most relevant per series is flagged as "used for understanding"; older versions are inventory only.

### Figure Acc.* reference diagrams (14 drawings)

Referenced throughout the Account PRD. Examples:
- `Figure Acc.1 Falcon Hierarchy Structure.` — the hierarchy visualization.
- `Figure Acc.2: Creating new account process` — overall create flow.
- `Figure Acc.3: Configuring Commchannels & Application (First time)` — initial config.
- `Figure Acc.4: Flow diagram for creating a new account process` — detailed create flow.
- `Figure Acc.5: Flow diagram for Editing (CommChnl & Services)`.
- `Figure Acc.6: Flow diagram CommChnl & App (Activation & Renew)`.
- `Figure Acc.7..17`: Edit CommChnl & Apps visibility / status variants (Hide, Show, Disabled, Expired, InActive, InActiveFT, Active).
- `Figure Acc.18 Renew InActiveFT`, `Figure Acc.19 Renew Disabled`, `Figure Acc.20 Renew Expired/InActive`.

All used for understanding at a high level; deeper extraction requires a follow-up.

### Balance Deduction workflow — version chain (8 drawings)

- `Balance Deduction workflow - V5` (2026-02-10) — latest.
- `Balance Deduction workflow - Multiple wallet V2` (2026-04-07) — latest of Multiple-wallet series.
- `Balance Deduction workflow - Single wallet V2` (2026-04-07) — latest of Single-wallet series.
- `Copy of Balance Deduction workflow - Multiple wallet V2` — DUPLICATE, treat as ignored.
- `Copy of Balance Deduction workflow - Single wallet V2` — DUPLICATE.
- `Balance Deduction workflow - V4`, `V3`, `V2`, `V1`, `Multiple wallet` — older versions.
- `Single wallet` (no version) — ambiguous.

Used for understanding: the `V5` / `Multiple wallet V2` / `Single wallet V2` informed the charging logic description.

### Wallet transfer flows (25+ drawings)

- `Wallet 1: Transfer from MW to CommChnl wallet-Multiple` and `Wallet 2..8` series covering transfer scenarios (MW↔CommChnl, CommChnl↔User/Node, UserCommChnl↔UserCommChnl).
- Both Single and Multiple variants.
- Example: `Wallet 7: Activate/Purchase Sub service- Multiple` (2026-02-10) — latest.
- Example: `Wallet 1:Transfer from MW to node/User wallet-single wallet` (2026-01-18).

Used for understanding: flagged the existence of 4-scenario × many-action matrix; deep extraction requires visual inspection outside this sync.

### Deleted / marked-for-deletion drawings

- `** Delete** Adding/ Editing Contract` (2026-01-07).
- `** Delete** Editing Contracts` (2025-12-11).
- `** Delete** Creating New Contract` (2025-12-11).
- `** Delete - Jawad Playing Area 2` (2025-12-01).
- `** Delete - Jawad Playing Area 4 v2 (CommChnl&App (Activation&Renew))` (2025-12-03).
- `** Delete - Jawad Playing Area 4 V1 (CommChnl&App (Activation&Renew))` (2025-12-03).

Marked by owner for deletion. Excluded from understanding.

### Other drawings

- `Activating Communication channels & Applications` — one-off flow.

## Unreadable / partially captured

- 57 Drive Drawings are not text-extractable via Drive export.
- Large Google Docs (VB4 Account PRD ≈ 57 KB text, VB4 Wallet doc ≈ 34 KB text) captured only head sections in this sync.
- Google Sheets — CSV export returns first tab only (multi-tab content possibly uncaptured).

## Aggregate notes

- This folder is the single largest module in the Drive — 69 items, multiple version chains.
- Version chains observed: Account PRD VB1..VB4, Wallet doc VB1..VB4, Balance Deduction V1..V5, Phone Analysis (lives in module 03), Wallet transfer variants.
- Items prefixed `** Delete**` or `** Delete - ` are explicitly owner-flagged for removal — skip them in any processing.
- A dedicated "deep sync" pass for this module is recommended: extract full PRD bodies, pull Sheet tab 2+, and visually interpret the latest Figure Acc.* + Wallet transfer drawings.
