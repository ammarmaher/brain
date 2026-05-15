*** Global Pattern — FALCON_COMPONENT_CUSTOMIZATION_PATTERN ***

# FALCON_COMPONENT_CUSTOMIZATION_PATTERN

Canonical customization order when consuming a Falcon UI library component on any page.

## Order (always evaluate top-to-bottom)

1. Use existing Falcon component as-is.
2. Use existing inputs.
3. Add `ng-template` / slots.
4. Add a new variant on the existing component.
5. Upgrade the Falcon library component.
6. Build a new library component.
7. Build an app-level wrapper.
8. Raw HTML — flagged as GAP, opens a follow-up entry in the page's `GAP_REGISTRY.md`.

The chosen step is recorded in the page's `COMPONENT_USAGE_DECISIONS.md` per section.

## Status

- **Status:** seed (no additional globally-approved rules yet)

## Promoted refinements

| id | rule | originPage | originLearningId | promotedOn |
|---|---|---|---|---|

_No additional refinements yet._
