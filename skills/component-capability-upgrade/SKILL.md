---
name: component-capability-upgrade
description: Scan Falcon components. If a reusable component lacks required inputs/templates/slots/options, upgrade the shared component instead of creating page-specific hacks.
---

# component-capability-upgrade

## Purpose

Scan Falcon components. If a reusable component lacks required inputs/templates/slots/options, upgrade the shared component instead of creating page-specific hacks.

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
