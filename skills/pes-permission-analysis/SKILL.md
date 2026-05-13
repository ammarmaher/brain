---
name: pes-permission-analysis
description: Map roles/actions/pages to permissions. Do not invent PES. Use wiki/backend/code as source of truth and mark gaps.
---

# pes-permission-analysis

## Purpose

Map roles/actions/pages to permissions. Do not invent PES. Use wiki/backend/code as source of truth and mark gaps.

## Required outputs

- Update related registry/understanding files.
- Update scan metadata.
- Include results in task/API report when relevant.
- Auto-sync brain artifacts to `https://github.com/ammarmaher/brain`.

## Rules

- Follow source of truth priority.
- Follow architecture wiki governance.
- Follow Git auto-sync governance.
- Do not commit secrets or local-sensitive files.
