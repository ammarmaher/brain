# Boss-approval report — userId → identityUserId consolidation

**Date:** 2026-07-08 · **Status:** delivered (document only, no code changes)
**Artifact:** `C:\Falcon\reports\userid-consolidation\userid-consolidation-approval-report.html`

Self-contained HTML (no external resources, light+dark+print CSS). Contents:
1. Executive summary + KPI cards — recommendation: **Plan 2 shadow+dual-write, risk 25–30%, ≈70–75% clean-delivery probability, 10–14 wks, zero downtime**.
2. Two-ID explainer (Mongo `userId` 24-hex driver-minted vs Zitadel `identityUserId` 18-digit = JWT sub).
3. Audit evidence map (what's Mongo-keyed vs already-Zitadel; ~1/3 of platform pre-migrated incl. PES g-rules, gateways, provisioning).
4. Target end state: users._id = Zitadel id, identityUserId field deleted, wallets/commerce/PES/FE all on Zitadel id, id_map archived read-only.
5. Three plans + CSS risk bar chart: P1 big-bang 65–70%, P2 27% (recommended), P3 tenant-by-tenant 35–40%.
6. Plan 2 full implementation: Stage 0 hygiene → 1 shadow+dual-write → 2 read migration → 3 downstream re-key (wallet balance reconciliation) → 4 soak → 5 cutover+drop; 14-week CSS Gantt; exit gates per stage; §6.5 drop gate needs separate sign-off.
7. Verification & rollback table.
8. Appendix A schema sheet: before/during/after user+wallet+commerce docs for EACH plan (color-coded deleted/transition/mixed/final).
9. Appendix B file-level change inventory (identity, downstream, FE — file:line from the 2026-07-07 audit).
10. Appendix C risk register (8 items w/ mitigations). Appendix D open verifications (commerce user-id claim runtime check, topic consumer inventory, Zitadel rate limits, prod data quality).
11. Sign-off block.

Fixed before delivery: Gantt CSS grid auto-placement bug (filler divs pushed labels into wrong rows) — replaced with explicit grid-row placement.

Dataviz skill palette used (validated): emphasis blue #2a78d6 + gray, ordinal blue ramp for Gantt, fixed status palette for badges.

**Next:** boss approval → user instructs "start Stage 0" (reconciliation job + unique index on identityUserId + orphan sweep + FE fixes). No source code touched yet.
