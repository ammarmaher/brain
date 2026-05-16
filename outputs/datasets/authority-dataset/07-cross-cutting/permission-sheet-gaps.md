---
type: gap-stub
topic: permission-sheet-capture-and-drift-audit
purpose: "Answers 'why PES catalog may drift from business intent + what's missing from the PRD permission sheet capture'. Open before trusting PES catalog as canonical or running Phase 2.5 drift audit."
gap-ids: [Q-UM-07, Q-AM-16]
status: blocked
blocks: [Phase-2.5-pes-prd-drift-audit]
created: 2026-05-16
sources:
  - Brain SK/_obsidian/12-Permissions/Falcon Roles Permission Matrix.md
  - Brain Outputs/prd/modules/02-user-management/QUESTIONS.md
---

# Gap Stub — PRD Permission Sheet Tab 2 + PES↔Sheet drift audit

> [!warning]
> Two related capture/audit gaps that prevent Phase 2.5 from running cleanly. Both blocked on the same upstream task (Drive re-export). Documented here so future agents know to verify before assuming PES catalog reflects business intent.

## Gap 1 — PRD Permission Sheet Tab 2 uncaptured (Q-UM-07)

**Source-of-truth artifact:** Jawad's Google Sheet **`Permission list - Jawad`** in Drive folder `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`.

**Sheet shape:** Two tabs. Cell vocabulary: `Allow` · `Not Allow` · `Deny` · `Can be overridden by Deny`.

**Capture status:**
| Component | Status | Notes |
|---|---|---|
| Tab 1 — prose summary | ✅ Captured | In `Brain Outputs/prd/modules/02-user-management/understanding.md` § Permission rules (lines 52-63) |
| Tab 1 — raw 180-row CSV | ⚠️ Not preserved as separate file | Only the prose distillation was kept |
| Tab 2 — anything | ❌ **NOT CAPTURED** | The 2026-04-24 PRD sync tool only returned the first tab |

**What's likely missing in Tab 2** (per references in Tab 1 PRD prose):
- Deeper Settings sub-tab permissions (beyond top-level Settings tab)
- Advanced operations (e.g. wallet-strategy edit, master-wallet view, bulk operations)
- Per-product gates (services that have product-level access controls)
- Edge-case overrides via "Can be overridden by Deny" cell value

**Remediation path:** Re-run the Brain SK `prd-knowledge` skill with **multi-tab CSV export** strategy. Preserve raw rows as `permission-list-jawad-tab1.csv` + `permission-list-jawad-tab2.csv` under `Brain Outputs/prd/modules/02-user-management/`.

**Until remediation:** Treat the Tab 1 prose as a **partial** view of role gating. For ambiguous cases (e.g. settings sub-tabs, advanced wallet ops), **read the live Drive sheet directly** rather than trusting captured prose alone.

## Gap 2 — PES catalog ↔ PRD Permission Sheet drift audit (Q-AM-16)

**The question:** does the runtime PES catalog (`BuiltInRoleCatalog.cs` + `pes-account-role-rules.json`) faithfully implement what the PRD Permission Sheet says?

**Why it matters:** the PES catalog is what actually gates the UI at runtime. The PRD sheet is what stakeholders signed off on. **If they diverge, the platform behaves inconsistently with business intent — silent allow/deny errors that don't surface until a tenant hits an unexpected gate.**

**Why this audit is currently blocked:** the audit requires Tab 2 capture (Gap 1 above). Auditing against Tab 1 alone would produce a **half-result** — every Tab-2-only rule would be missed, and any apparent "match" on Tab-1-only rules would be falsely reassuring (the rule might also exist in Tab 2 with a different verdict).

**What the audit would produce (when unblocked):**
1. **Match table** — every (role × resource × action) triple from PES catalog cross-referenced against the PRD sheet cell value.
2. **Drift list** — cells where PES `allow` vs sheet `Allow` disagree, or `deny` vs `Not Allow`/`Deny` disagree.
3. **Coverage report** — sheet rows with no PES rule equivalent (missing in catalog), and PES rules with no sheet equivalent (catalog overreach).
4. **Severity classification per drift item** — security-critical / functional / cosmetic.

**Output location (when run):** `Brain Outputs/datasets/authority-dataset/Phase-2.5/pes-prd-drift-audit.md`.

## Standing rule until both gaps close

When any agent (Claude, Ammar, anyone) hits a question of the form "is this permission decision correct?":

1. ✅ Check `01-roles/<role>.md` — see what the **PES catalog** says.
2. ✅ Check `Brain SK/_obsidian/12-Permissions/Falcon Roles Permission Matrix.md` — see what **Tab 1 prose** says.
3. ⚠️ If the answer matters AND it might be in Tab 2 territory (advanced ops / sub-tab settings / "Can be overridden by Deny" cases): **stop and ask the user to verify against the live Drive sheet**. Do not assume PES = sheet.

## Dependent decisions tagged "conditional on Tab 2"

| Decision area | Why conditional | Mitigation |
|---|---|---|
| Wallet-strategy edit gating (sys-products) | Tab 1 doesn't enumerate all wallet sub-actions | Cross-check `sys.wallet-strategy.edit` against live sheet before shipping any wallet-strategy UI |
| Master-wallet view (sys-products) | Same | Same |
| Bulk service operations | Not present in Tab 1 prose | Verify against live sheet |
| Per-product feature flags (testing-charging etc.) | Tab 1 mentions products generically | Cross-reference per-product Drive entries |
| "Can be overridden by Deny" semantics | Cell value documented but no examples in captured prose | Verify usage pattern in live sheet |

## How to unblock

```
1. User authorizes Drive access for a Brain SK session
2. Run `take latest from PRD` (Brain SK prd-knowledge skill) with multi-tab strategy
3. Save raw CSVs as `permission-list-jawad-tab1.csv` + `permission-list-jawad-tab2.csv`
4. Update Brain SK/_obsidian/12-Permissions/Falcon Roles Permission Matrix.md to reference Tab 2
5. Schedule Phase 2.5 (PES↔PRD drift audit) — ~2 hr work once data is in
```

## See also

- `Brain SK/_obsidian/12-Permissions/Falcon Roles Permission Matrix.md` — what we have so far
- `Brain SK/_obsidian/12-Permissions/Contact Group Permission Matrix.md` — fully-captured counterpart (PRD-04 single-tab, no gap)
- `Brain Outputs/prd/modules/02-user-management/QUESTIONS.md` — Q-UM-07 origin
- `Brain Outputs/prd/modules/01-account-management/QUESTIONS.md` — Q-AM-16 origin
- `01-roles/_INDEX` — what PES says
- `00-VERIFICATION-GATE.md` — none of the 15 questions currently depend on Tab 2 (intentional — Phase 2 was scoped to avoid the blocked path)
