---
title: Lessons Learned Index
type: index
tags: [gsd, index, lesson]
---

# Lessons Learned Index

Purpose: canonical, approved lessons learned across GSD runs. The **Approved**
section changes ONLY in Approved Learning Mode after an explicit approval.

## Approved

_None yet._

## Proposed / Pending Approval (non-binding)

- MUC-005 — GSD board seats must be anchored to the WORKING branch/worktree, not
  a reverted main checkout (prior B01/B03/B06 false-negatives). Source review:
  [[gsd-2026-06-07-edit-user-v2-fe-pes]] →
  `reports/gsd-2026-06-07-edit-user-v2-fe-pes/obsidian/lessons-learned.md`.
  Approval required from: Ammar.
- (same run) — vitest/esbuild type-stripping hides real TS errors; a green vitest
  run is not a green typecheck (B54).
- (same run) — read-only conversion + a payload guard test is the correct FE fix
  when no persistence path exists (B01/B03/B07/B11).

#gsd #index #lesson
