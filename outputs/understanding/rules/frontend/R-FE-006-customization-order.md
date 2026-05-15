---
ruleId: R-FE-006
name: Customization order — GAP marker required for raw HTML
category: reuse
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.html"
    - "apps/**/*.ts"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: semantic-llm
  patterns:
    - 'raw HTML primitive without preceding GAP marker'
    - 'custom CSS class on a falcon-* component bypassing inputs/templates/slots/variants'
  exemptPatterns:
    - '<!--\s*GAP:\s*R-FE-00[56]'
  description: Hybrid detector — regex pre-pass finds raw primitives + ad-hoc CSS overrides, semantic-LLM pass verifies the customization order was followed (inputs → templates → slots → variants → lib upgrade → new lib → wrapper → raw HTML w/ GAP) and a GAP marker is present
autoFix:
  available: false
  riskLevel: high
  patchHint: 'For each finding, audit which step of the order was skipped. Either replace the raw markup with the appropriate Falcon API surface, or upgrade the lib component, or — if truly last-resort — add an explicit <!-- GAP: R-FE-006 reason --> marker AND a note in Brain Outputs/70-Gaps/.'
relatedRules:
  - R-FE-005
  - R-FE-007
source:
  - file: feedback_falcon_custom_library_mandatory.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-006 — Customization order enforcement ***
*** Source: feedback_falcon_custom_library_mandatory §3 (2026-05-15) ***
*** Detector: semantic-llm (regex pre-pass + judgment) ***

# R-FE-006 — Customization order enforcement — raw HTML in pages must declare a GAP note

## What it says

When a Falcon UI Core component does not exactly meet a page's needs, the author MUST work through the customization order in strict sequence and stop at the first step that satisfies the requirement:

1. Use the existing Falcon component's **inputs / config**
2. Use the existing Falcon component's **ng-template** support
3. Use the existing Falcon component's **slots / content projection**
4. Use the existing Falcon component's **Tailwind / token variants**
5. **Upgrade** the shared Falcon component (in `libs/falcon-ui-core`)
6. **Author a new reusable Falcon component** inside the library
7. **Feature-local wrapper** in `apps/host-shell/src/app/shared-components/` (only if truly page-specific — see R-FE-007)
8. **Raw page implementation** — LAST RESORT, MUST be documented as a GAP

Any raw HTML primitive or any ad-hoc CSS override on a `<falcon-*>` component that skips earlier steps is a violation. Raw HTML MUST carry a `<!-- GAP: R-FE-006 <reason> -->` marker and a matching note in `Brain Outputs/70-Gaps/`.

## Why it exists

The order encodes a learning loop. Steps 1–4 use existing API surfaces (zero risk, zero new code). Step 5 hardens the library for everyone. Step 6 grows the library where there's proven cross-page reuse. Step 7 contains page-specific orchestration without polluting the library. Step 8 admits a real gap so it can be tracked, fixed later, and not silently re-implemented across other pages. Skipping the order produces per-page divergence that costs months to repair (see the org-hierarchy comm-channels failure — 5 rounds, 0% delivered, documented in `feedback_orchestrator_failure_modes_org_hierarchy.md`).

## Detector strategy

Hybrid pass:

1. **Regex pre-pass** finds candidates: any raw HTML primitive in app templates (carries over from R-FE-005), plus `class="..."` declarations on `<falcon-*>` tags that include layout/spacing classes not exposed via inputs (heuristic: any class that's not a known Falcon-passthrough class). Also flags `::ng-deep` and `[ngClass]` overrides on Falcon tags.
2. **Semantic-LLM pass** for each candidate: read the file context, the matching component's `API.md` + `USAGE.md` from `Brain Outputs/understanding/frontend/components/<name>/`, and judge whether an earlier step in the order would have worked. Verdict template:
   - `OK_GAP_DOCUMENTED` — raw HTML with valid `<!-- GAP: R-FE-006 ... -->` marker AND a matching `70-Gaps/` note
   - `VIOLATION_INPUT_AVAILABLE` — an existing input/template/slot/variant would satisfy this
   - `VIOLATION_LIBRARY_UPGRADE_FITS` — step 5/6 would have been the right fix
   - `VIOLATION_NO_GAP_MARKER` — raw HTML present but undocumented

Files in `libs/falcon-ui-core/**` are exempt (the library is where steps 5+6 land).

## Examples

### ✅ Good (step 1 — input)

```html
<!-- The Falcon dropdown already supports a leading-icon input. Use it. -->
<falcon-dropdown
  label="Status"
  [options]="statusOptions"
  leadingIcon="filter"
  [(ngModel)]="status"
/>
```

### ✅ Good (step 8 — last resort, GAP marker present)

```html
<!-- GAP: R-FE-006 native datalist needed for free-text + suggestions hybrid; tracked in 70-Gaps/free-text-suggest.md -->
<input list="suggestions" [(ngModel)]="q" />
<datalist id="suggestions">
  <option *ngFor="let s of suggestions" [value]="s" />
</datalist>
```

### ❌ Bad (skipped earlier steps)

```html
<!-- The library's <falcon-dropdown> already exposes a [variant] input.
     Author wrapped it in a div + custom class to fake a variant. ❌ -->
<div class="my-custom-pill-dropdown">
  <falcon-dropdown [options]="opts" [(ngModel)]="v" />
</div>
```

```html
<!-- Raw input with no GAP marker, no investigation of <falcon-input>. ❌ -->
<input type="text" class="border rounded p-2" [(ngModel)]="q" />
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — steps 5 + 6 happen here by definition
- `*.spec.ts` test fixtures
- Anything listed against `R-FE-006` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation, work the order from the top:

1. Open `Brain Outputs/understanding/frontend/components/<name>/API.md` and check every input. Try step 1.
2. If no input fits, check `USAGE.md` for `ng-template` / slot patterns. Try steps 2 + 3.
3. Check `TOKENS.md` for a variant/style hook. Try step 4.
4. If the gap is real and reusable, propose an upgrade or new component (steps 5 + 6) — log in `GAPS_AND_UPGRADES.md`, then implement.
5. If the orchestration is page-specific (not the visual but the API flow), author a wrapper (step 7) per [[R-FE-007-library-skeleton-app-wrapper]].
6. Only after steps 1–7 fail: write the raw HTML, add the `<!-- GAP: R-FE-006 <reason> -->` marker, and create the note in `Brain Outputs/70-Gaps/`.
7. Emit the compliance table required by `feedback_falcon_custom_library_mandatory.md` §6:

| UI element | Source need | Falcon component used | Reused / customized / upgraded / created | Dynamic API used | CSS/SCSS used? | Token compliance |
|---|---|---|---|---|---|---|

## Related rules

- [[R-FE-005-falcon-library-first]] — the positive obligation to use Falcon components
- [[R-FE-007-library-skeleton-app-wrapper]] — step 7 architecture
- [[R-FE-004-tokens-only]] — every ad-hoc class is also subject to token rules

## Sources of truth

1. `memory/feedback_falcon_custom_library_mandatory.md` §3 — the eight-step order
2. `memory/feedback_falcon_custom_library_mandatory.md` §6 — the compliance reporting table
3. `memory/feedback_orchestrator_failure_modes_org_hierarchy.md` — the failure mode this rule prevents
