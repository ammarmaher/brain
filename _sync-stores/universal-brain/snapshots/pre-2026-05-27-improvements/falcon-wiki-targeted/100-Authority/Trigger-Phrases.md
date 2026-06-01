---
type: moc
cluster: 100-Authority
title: Trigger Phrases — consolidated reference card
projection-source: _mounts/brain-outputs/datasets/authority-dataset/16-trigger-phrases/_INDEX.md
verified-at: 2026-05-16
purpose: "Answers 'which ~45 phrases auto-load which dataset slices into a fresh Claude session'. Open to find or paste the right trigger phrase before starting work."
---

> [!tldr]
> ~45 trigger phrases organized in 9 categories. Paste any one into a fresh Claude session and it auto-loads the right slice of the dataset.

# Trigger Phrases

## 1 · Orient (5 phrases)

`falcon vs client` · `authority dataset` · `who can see what` · `what is the authority spec` · `show me the dataset structure`

## 2 · "Who can do X?" (9 phrases — role lookups)

`full action inventory for <role>` (6 variants) · `can a client X` · `what can falcon do that client cannot` · `what can acc-user see`

## 3 · "What about feature F?" (6 phrases)

`what V-rules apply to <feature>` · `what entity drift on <feature>` · `what business rules govern <feature>` · `what hides UI besides PES on <feature>` · `what error codes does <feature> surface` · `compare <feature> admin vs mgmt`

## 4 · "How do I implement Y?" (8 phrases — port + flow)

`copy <feature> from admin to mgmt` · `implement Add Client wizard` · `implement Add User` · `implement Add Node` · `implement Edit Node` · `who can run Add User` · `Add Client V-rules` · `namespace flip checklist` · `gateway flip checklist`

## 5 · "How do I error-handle?" (5 phrases)

`frontend error contract` · `how do I display errors` · `what status code means what` · `lockout cascade` · `payment poll timeout`

## 6 · "What should I avoid?" (5 phrases)

`implementation pitfalls` · `what anti-patterns should I avoid` · `pre-port grep checklist` · `if I see broken UI for X` · `what to NOT copy from old UI`

## 7 · "Refresh / audit" (9 phrases — Phase 5 scanner)

`audit drift` · `refresh authority dataset` · `refresh authority dataset Phase N` (8 variants) · `audit PES vs PRD sheet drift` (BLOCKED)

## 8 · "Operational" (5 phrases)

`seeded test user credentials` · `how to log in locally` · `which test users exist` · `JWT shape` · `gateway routing`

## 9 · "Continue work" (2 phrases)

`continue authority dataset` · `update authority dataset to v7.X`

## How to use

1. Open a fresh Claude session
2. Paste a phrase from one of the 9 categories
3. Claude reads the matching dataset files
4. Ask the actual question

## Drill into Brain Outputs

[Full trigger phrase index](../_mounts/brain-outputs/datasets/authority-dataset/16-trigger-phrases/_INDEX.md)

## See also

- [[_INDEX]] — the master MOC for this cluster
- All vault notes in this cluster
