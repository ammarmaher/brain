---
name: Studio class-application gap (Wave 8 follow-up)
description: 2026-05-08 — User reported Glossify class application doesn't visibly change a specific button/dropdown. Root cause: drop zones are per-SECTION not per-COMPONENT, so applying a class on an individual element has no `data-glass-target-id` to match. Also: no UI to add custom (non-predefined) classes.
type: feedback
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Reported:** 2026-05-08 by Ammar Mk after Wave 8B-8F completion.

**User words (verbatim):**
> "I don't see anything changed. Still I can't apply the classes modules that we have on the component, in a specific component like a button dropdown. I also need to customize my customization for adding a special class customization that is not already implemented."

**Diagnosis (file:line evidence):**

1. **Drop zones are at SECTION level, not COMPONENT level.**
   `component-canvas.component.ts` puts `falconGlassDropZone` on a `<section>` wrapping the whole "Buttons" group (lines 83-89), with `targetId="canvas-buttons"` shared across all 10 button instances. Same pattern in Inputs (line 130-135) and Selectors (line 187-193). Drop or class application on any single button → effect applies to the entire section's `[data-glass-target-id="canvas-buttons"]` selector, not just that button.

2. **GlassApplicationService writes attribute-selector rules.**
   `glass-application.service.ts:262` synthesises `[data-glass-target-id="${id}"] { ...tokens + surfacePaint }`. If the user adds a class like `falcon-glass-tile-frosted-card` to a raw `<button>` that has NO `data-glass-target-id` attribute, the MutationObserver fires, scope falls to `'global'` (`glossify-observer.service.ts:74`), and the surfacePaint applies at `<html>` level — invisible at the component level.

3. **No custom-class affordance.**
   `FALCON_GLOSSIFY_CLASS_PREFIX = 'falcon-glass-tile-'` (`glossify-observer.service.ts:32`) — only classes with this exact prefix are recognised. There's no UI for the user to register a new class name and bind it to a token bundle.

**Fix options (NOT implemented yet — pending user pick):**

- **A. Per-component drop zones.** Wrap each `<falcon-angular-button>`, `<falcon-angular-input>`, `<falcon-angular-dropdown>` etc. with its own `falconGlassDropZone [targetId]="…unique" targetType="button"`. Surgical refactor across `component-canvas.component.ts` (~10-15 sections, ~50-80 instances). No new service.
- **B. Custom class composer + class-rule writer.** Add a Glass Effects panel section: text input for class name + tile/preset picker → service writes `.{className} { …tokens + surfacePaint }` rules to a runtime `<style>` tag. Observer extended to also recognise user-saved class names. Class can then be applied on any element directly (DevTools, template) and effect renders.
- **C. Both A + B** — per-component zones for the predefined tiles workflow, custom class composer for free-form experimentation. Largest change but covers both complaints.

**How to apply:** before doing more Studio work, confirm with the user which option (A / B / C). Don't unilaterally refactor `component-canvas.component.ts` — it's 700+ lines of hand-authored canvas content and a refactor needs sign-off on the per-component targetId scheme.

**Standing rule reaffirmed:** never run dev servers during implementation. User explicitly said "I want to test from my side and run from my side." Killed port 4200 (PID 49320). Background NX/node daemons left alone (not dev servers).
