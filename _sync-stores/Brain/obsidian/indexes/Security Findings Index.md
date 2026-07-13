---
title: Security Findings Index
type: index
tags: [gsd, index, security]
---

# Security Findings Index

Purpose: canonical, approved security rules/findings. The **Approved** section
changes ONLY in Approved Learning Mode after an explicit approval, and every
security rule must carry non-inferred cited evidence.

## Approved

_None yet._

## Proposed / Pending Approval (non-binding)

- MUC-003 — `user/edit-*` PES must distinguish self vs other (ABAC). Evidence:
  [CODE] BuiltInRoleCatalog.cs:551-558 + finding B04. Source review:
  [[gsd-2026-06-07-edit-user-v2-fe-pes]] →
  `reports/gsd-2026-06-07-edit-user-v2-fe-pes/obsidian/security-rule-candidates.md`.
  Approval required from: Ammar + cited evidence.
- (tracked under MUC-001) — PES fail-open only on a transport failure, never on a
  resolved all-deny. Evidence: B05/B15/B33/B39.

#gsd #index #security
