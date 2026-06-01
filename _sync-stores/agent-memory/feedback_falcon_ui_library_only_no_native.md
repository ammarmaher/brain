---
name: Falcon UI Library Only — No Native HTML
description: Standing rule — every UI element must come from libs/falcon-ui-core/src/angular-wrapper. No native button/input/table/div abuse, no outside-library imports. Missing = GAP, never hand-roll.
type: feedback
originSessionId: 69909f5f-b332-46c3-ba05-7e1655dd149d
---
# 🔴 STANDING RULE (2026-05-16) — Falcon UI Library Only — Zero Native HTML

**Authoritative path (the ONLY allowed UI source):**

```
C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper
```

Anything outside this path is **not recommended, not supported, and not allowed** in production UI code.

## What this means

| Element type | Allowed | NOT allowed |
|---|---|---|
| Button | `<falcon-angular-button>` (or library equivalent) | `<button>`, `<a class="btn">`, hand-rolled `[role="button"]` |
| Input | `<falcon-angular-input>`, `<falcon-angular-input-number>`, etc. | `<input>`, native `<textarea>` |
| Table | `<falcon-angular-table>` | `<table>`, `<tr>`, `<td>` hand-rolled grids |
| List | Falcon library list / data-table | hand-rolled `<ul>`/`<li>` for data display |
| Dropdown | `<falcon-angular-dropdown>` / `<falcon-angular-select>` | `<select>`, hand-rolled menus |
| Checkbox / Radio / Toggle / Switch | Falcon variants | `<input type="checkbox">`, etc. |
| Dialog / Modal / Drawer | `<falcon-angular-dialog>`, `<falcon-angular-drawer>` | `<dialog>`, hand-rolled overlays |
| Stepper | `<falcon-angular-stepper>` (the canonical from this lib) | legacy local `<falcon-stepper>`, `<p-steps>`, hand-rolled progress bars |
| Menu / Popup | `<falcon-angular-menu>`, `<falcon-angular-tooltip>` | hand-rolled menus, `<details>`, raw popovers |
| Card / Panel | Falcon variants | hand-rolled `<div class="card">` constructs |
| Icon | Falcon icon font + Falcon icon component | PrimeIcons, FontAwesome, raw SVG (unless explicit asset) |
| Form / Field wrapper | Falcon form-row / field components | hand-rolled labels + error spans |

## Allowed exceptions (very narrow)

- `<div>` strictly for **Tailwind layout containers** (grid / flex / spacing wrappers) — never for content elements
- `<span>` strictly for **inline text fragments inside Falcon component slots / templates**
- `<ng-container>`, `<ng-template>`, `*structural` directives, `@if`, `@for`, `@switch` — Angular control flow primitives
- Anything explicitly approved by the user in writing for a one-off

## What to do when the library lacks a component

**Do NOT hand-roll.** Flag it as a `[VAULT] 70-Gaps/GAP-LIB-<name>.md` note with:
- What's needed
- Where it should live in `libs/falcon-ui-core/src/angular-wrapper/`
- Closest existing skeleton to extend
- Whether to scaffold a new skeleton component now (with user approval) or wait

Per `feedback_library_skeleton_app_api`: library = skeleton (presentational), app = wrapper (API). New library components live in this path; app-level wrappers live in `apps/host-shell/src/app/shared-components/<name>/` (or app-specific shared).

## Pre-finish grep gate (add to every UI task closure)

Run these greps over touched files before declaring done:

```
# Native interactive elements (should be ~0 outside library code)
<button[^>]   → expect 0 (except inside libs/falcon-ui-core/)
<input[^>]    → expect 0 (except inside libs/falcon-ui-core/)
<select[^>]   → expect 0 (except inside libs/falcon-ui-core/)
<textarea     → expect 0 (except inside libs/falcon-ui-core/)
<table[^>]    → expect 0 (except inside libs/falcon-ui-core/)
<dialog[^>]   → expect 0 (except inside libs/falcon-ui-core/)

# Outside-library UI imports (should be ~0 in apps/)
from '@primeng/   → expect 0 in apps/
from 'primeng     → expect 0 in apps/
from '@angular/material → expect 0 (Falcon doesn't ship Material)
```

## User-observed drift pattern

User has explicitly noted (2026-05-16): "I see you sometimes you are creating tags and HTML native div without using this library." This rule exists to lock that drift down.

## Cross-references

- `[MEMORY] feedback_falcon_custom_library_mandatory` — original rule (this hardens and specifies the path)
- `[MEMORY] feedback_library_skeleton_app_api` — skeleton-vs-wrapper boundary
- `[MEMORY] feedback_no_inline_styles_tokens_only` — tokens-only complementary rule
- `[BRAIN-OUT] reports/night-shift-2026-05-16/01-rules-digest.md` — R-07 (Falcon library first) in the 38-rule digest

## Applies to

Every UI edit in every Angular component in every app under `apps/`, every wrapper under `libs/host-shell/` or app `shared-components/`. Inside `libs/falcon-ui-core/` itself the rule is inverted — that IS where native primitives live (Stencil-side or wrapper-side).

## Verification on intake

Before touching any UI file, the dispatched agent must:
1. List the contents of `libs/falcon-ui-core/src/angular-wrapper/components/` to know what's available
2. Map every UI element they plan to use to a library tag
3. Halt-and-flag if no mapping exists (don't reach for native)
