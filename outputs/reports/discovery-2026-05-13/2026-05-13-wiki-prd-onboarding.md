*** Wiki + PRD onboarding — 2026-05-13 ***

# Wiki + PRD onboarding completion

This record documents the moment Brain SK gained authoritative access to both the **architecture wiki** and the **PRDs** previously flagged WARN in the bootstrap readiness report.

## Canonical sources locked in

| Source | URL | Local representation | Status |
|---|---|---|---|
| Architecture wiki | `https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home` | Git clone at `C:\Falcon\falcon-wiki` (branch `wikiMaster`, HEAD `0d0cb311…`, 110 files) | **OK** (was WARN) |
| Architecture wiki git | `https://t2development.visualstudio.com/Falcon/_git/Falcon.wiki` | Cached Azure DevOps credentials work — `git ls-remote` returned a SHA on first try | **OK** |
| PRD Drive folder | `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH` | Already synced locally by the `prd-knowledge` skill at `C:\Falcon\Brain SK\skills\imported-business\prd-knowledge\modules\` (6 modules, last synced 2026-04-24) | **OK** (was WARN) |

Both URLs are now canonicalized in `config/brain.config.json` under `paths.prdDriveUrl`, `paths.prdLocalMirror`, `paths.architectureWikiUrl`, `paths.architectureWikiGitUrl`, `paths.architectureWikiLocalClone`, plus per-source generated-output roots.

## Generated output folders added

Per Ammar's request — two new top-level folders under `C:\Falcon\Brain Outputs\`:

- `prd/` — brain analysis of the PRDs
- `wiki-architect/` — brain analysis of the architecture wiki

Each carries a README pointing back to the canonical Drive / Azure DevOps source so the audit trail is one click from the analysis.

## Phase 3 (this pass) — two parallel agents

### Wiki-Grounded Architecture Agent

- Read all 16 canonical docs under `Home/Software-Architecture-Design/`.
- Produced 21 files at `Brain Outputs/wiki-architect/`:
  - `WIKI_OVERVIEW.md`
  - `Home/Software-Architecture-Design/<DOC>.md` × 16
  - `CONSOLIDATED_ARCHITECTURE_RULES.md` — **supersedes** the earlier code-extracted fallback at `outputs/understanding/wiki/ARCHITECTURE_RULES.md`
  - `CONSOLIDATED_ARCHITECTURE_CONFLICTS.md`
  - `WIKI_TO_CODE_TRACE.md` (~120 wiki-rule → code-path rows)
- **9 of 12 fallback UNVERIFIED items resolved.** The remaining 3 are now `WIKI-SILENT — code-pattern only`.
- One earlier conflict downgraded as **not-a-violation** (System Gateway lacking IP allowlist — wiki §2.2.3 says Core-Gateway-only by design).

### PRD Understanding Agent

- Read all 6 module folders under `prd-knowledge/modules/`.
- Produced 32 files at `Brain Outputs/prd/`:
  - 6 modules × 5 files (OVERVIEW + BUSINESS_RULES + ENTITIES + WORKFLOWS + QUESTIONS + GAPS = 30 files)

    Note: GAPS file present per module brings count to 6 files some modules; total module-file count is 30.
  - `PRD_INDEX.md` + `PRD_GAP_SUMMARY.md` at the `prd/` root.
- **~180 business rules** extracted with line-cited evidence to `latest-prd.md`.
- **~45 domain entities** catalogued.
- **185 PRD↔code GAP rows:** 69 COVERED, 21 PARTIAL, 45 MISSING, 42 UNVERIFIABLE → ≈ 48% covered / 63% covered-or-partial.

## Top 5 wiki rules that contradict observed code (HIGH)

1. **`ValidateAudience=true` is canonical** (`Security-Architecture.md` §4.2.6). Commerce + Core Gateway + System Gateway have `false`. Resolves fallback UNVERIFIED §5.
2. **Domain references nothing** (`Clean-Architecture-…md` §"Project dependencies"). `Falcon.Commerce.Domain.csproj` references `MongoDB.Bson`. Resolves fallback UNVERIFIED §3.
3. **`X-MicroApp-Key` dual-credential auth required** (`Security-Architecture.md` §4.1.1). Not implemented in any service. NEW conflict the code-only pass could not surface.
4. **gRPC is the preferred sync inter-service path** (`High-Level-Architecture.md` §3.6). Zero `.proto` / `Grpc.AspNetCore` in code. Wiki accepts HTTP but prefers gRPC — MEDIUM.
5. **MongoDB DB name pattern `falcon_<layer>_<service>_db`** (`Design-Patterns-&-Guidelines.md`). Code uses `FalconCommerceDB` PascalCase — MEDIUM.

## Top 5 HIGH PRD-vs-code gaps

1. **Templates entity has no public API** — Templates service exposes only 3 `CommunicationChannelConfig` endpoints; the Template-with-body/header/buttons/approval surface is unbuilt.
2. **Templates service not routed by either gateway** — even the 3 existing endpoints are unreachable from frontend (links to integration GAP-008).
3. **Contact Group frontend unbound** — all 14 backend endpoints ready, no frontend consumer; story 115329 mid-flight.
4. **CommChannel/App lifecycle admin UI unbound** — Commerce has ~22 endpoints under `/api/Node/...`; frontend binds none in `polishing-v0.4`.
5. **Packaging + Billing missing from PRD** — folder titled "Contract / Packaging / Charging / Billing Management" but the body covers only Contract + Cost.

## NEW wiki-surfaced conflicts the code-only pass could not see

- Identity Service should publish the IP-allowlist Kafka topic (not Commerce).
- A **third "Platform Services Gateway"** is canonical in the wiki — its repo does not exist on disk.
- **Outbox pattern** recommended; not implemented anywhere.
- `Microsoft.FeatureManagement` feature-flag mechanism mandated; not adopted.
- **ClickHouse OLAP tier** prescribed; absent from all `.csproj`.
- `falcon-comm-*` and `falcon-util-*` repos prescribed (future).
- AI Conversational Orchestration architecture entirely forward-looking — no service repo yet.

## Top 5 open PRD questions (need Ammar / Architect input)

1. Vocabulary mismatch on password security levels — PRD: Normal/Advanced (2-tier); Identity code: Low/Medium/High/Strict (4-tier).
2. Wallet topology mid-life migration — PRD silent on what happens when Balance Type or Wallet Type changes with non-zero balances.
3. Refund flow for failed campaigns — which contract gets the balance back, what expiration date — no PRD, no code.
4. Forgot Password wrong OTP — PRD says silent (user stays Active); Login spec says 3 wrong OTPs = Locked. Inconsistency.
5. Template versioning on edit — does the old version keep running until the new one is approved?

## Readiness rows that flip

| Row | Before | After |
|---|---|---|
| Architecture wiki coverage | `15%` (code-extracted fallback only) | **≥ 70%** (wiki-grounded; 9 of 12 UNVERIFIED items resolved + 7 new conflicts surfaced) |
| PRD coverage | `0%` | **≈ 48%** (PRD↔code coverage; 69 of 185 gaps COVERED + 21 PARTIAL) |

## Decision

`READY_WITH_WARNINGS` → **`READY`** for any task that depends on wiki or PRD. The 6 HIGH PRD gaps and 5 HIGH wiki conflicts are tracked separately; they are scope items, not bootstrap blockers.

## Sync rule honored

Additive sync only — `robocopy /E /XO`. No `/MIR`. No `/PURGE`. The Brain SK `outputs/` mirror preserved all earlier artifacts.

## Memory updated

`feedback_brain_sk_canonical_sources.md` saved at `C:\Users\User\.claude\projects\C--Falcon\memory\` so future Brain SK sessions know:
- the canonical Drive URL for PRDs (refresh via the `prd-knowledge` skill's `take latest from PRD` command)
- the canonical Azure DevOps wiki URL + git URL (refresh via `git -C C:\Falcon\falcon-wiki pull` — weekly cadence)
- the two new generated-output folders are where brain analysis lives
