---
type: index
cluster: 19-night-shift-readiness/VISUAL-TARGETS
purpose: "Answers 'what should feature F look like + which Falcon UI Core components + which design tokens + what does empty state look like'. Open BEFORE writing any UI code for a feature."
audience: autonomous AI agents (night-shift mode)
---

# VISUAL-TARGETS — Per-feature visual fidelity references

> [!tldr]
> The dataset answers WHAT to build (authority/validation/DTO). This cluster answers HOW IT SHOULD LOOK. Without it, AI produces build-green code that's visually wrong. Each visual-target doc pins component composition, design tokens, per-state visuals, and i18n keys.

## What every visual-target doc captures

1. **Page layout structure** — header zone · filter zone · main content · footer · sidebar
2. **Primary component composition** — which Falcon UI Core components compose the page
3. **Falcon design tokens consumed** — spacing · color · typography · radius tokens
4. **Per-state visual spec** — loaded · empty · loading · error (per HTTP status) · RTL Arabic
5. **Row action menu shape** (if applicable) — trigger style · menu items · confirmations
6. **i18n key inventory** — every key the feature uses + en + ar values
7. **Density / spacing rules** — per noor-instructions-skill
8. **Things that look right vs wrong** — concrete callouts with sources

## Existing visual targets

| Feature | File | Status |
|---|---|---|
| comms-hub (mgmt) | [[comms-hub.visual]] | 🟢 Exemplar — ported this session |
| organization-hierarchy (admin + mgmt) | [[organization-hierarchy.visual]] | 🟢 Exemplar — biggest feature |

## How to ADD a target for a new feature

1. Copy one of the exemplars as a template
2. Mine the old-UI dataset (`old-ui-dataset/10-pages/<app>/<feature>/`) for the proven visual shape
3. Mine the authority dataset (`04-feature-parity-matrix/<feature>.compare.md`) for component composition
4. Mine Falcon design tokens from `libs/falcon/.../tokens/` (if accessible) or `Brain Outputs/understanding/frontend/theme/`
5. Note **where actual screenshots should be captured** — this cluster documents the visual; humans capture the images
6. Validate against the visual fidelity hierarchy below

## Visual fidelity hierarchy (conflict resolution)

If 3 sources disagree on what the visual should be:

1. **Old-UI proven implementation** wins — it shipped + worked
2. Then **PRD wireframe** (if available)
3. Then **Falcon UI Core component default** — the unstyled baseline
4. Then **AI inference** — last resort, must flag (Class E fork in DECISION-PROTOCOL)

## Visual scope vs. dataset scope

This cluster does NOT replace:
- The component dossiers at `Brain Outputs/understanding/frontend/components/` (62 of them)
- The Falcon UI Core lib source at `libs/falcon-ui-core/`
- The noor-instructions skill at `brain-skills/Front-End-skills/noor-instructions-skill/`
- The actual screenshots (humans capture; this cluster references them)

This cluster IS the **per-feature visual contract** the AI commits to before writing any HTML/CSS.

## See also

- [[../SPEC-PROTOCOL]] — Step 4 (dataset gap analysis) checks if a visual target exists
- [[../DECISION-PROTOCOL]] — Class E forks (UI/UX) consult visual targets
- [[../NIGHT-SHIFT-LOOP]] — does NOT validate visual fidelity (no automated visual check); a screenshot diff would be a future enhancement
- [[../../04-feature-parity-matrix/MATRIX]] — feature classification
- [[../../15-implementation-pitfalls/ANTI-PATTERNS]] — what NOT to use (no SCSS / no PrimeNG / etc.)
