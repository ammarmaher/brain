---
name: validation-rules
description: Mirror backend validations for frontend UX. Backend remains authoritative. Use existing duplicate-check/name/username APIs rather than inventing logic.
---

# validation-rules

## Purpose

Mirror backend validations for frontend UX. Backend remains authoritative. Use existing duplicate-check/name/username APIs rather than inventing logic.

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
