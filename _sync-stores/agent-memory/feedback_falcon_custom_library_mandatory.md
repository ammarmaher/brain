---
name: Falcon Custom Library Mandatory Rule
description: ABSOLUTE STANDING RULE for every Falcon UI task in every session — Falcon component library first, no raw HTML replacements, customize in defined order, Tailwind + tokens only, log compliance table per section
type: feedback
originSessionId: ee0aa796-a5df-487b-8654-5f4917335eba
---
# Falcon Custom Library Mandatory Rule (ALL SESSIONS, ALWAYS)

**Why:** User issued this as a permanent "get shit done" standing rule on 2026-05-15. Falcon has a custom component library (`libs/falcon-ui-core`, `libs/falcon-ui-tokens`, plus the Angular wrappers + Stencil Shadow components) that exists specifically so UI work stays consistent, theme-able, RTL-safe, and bundle-lean. Raw HTML, inline styles, SCSS, or PrimeNG sneak-ins break theming, regress bundle size (PrimeNG was fully purged 2026-05-10), and create page-only divergence the team has spent months removing. This rule MUST fire before any UI edit, not after.

**How to apply:** Before touching ANY UI element in ANY session (Adnan, every Ammar, every sub-agent):

## 1. Falcon-First Lookup (MANDATORY pre-read)
Before writing markup, read:
- `C:\Falcon\Brain Outputs\understanding\frontend\` (component knowledge root)
- `C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\` — `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`

Also cross-check `libs/falcon-ui-core/` source + barrel export in the Nx workspace.

## 2. Required Falcon Components (no raw HTML replacements)
| Element | Falcon component |
|---|---|
| Button | Falcon Button |
| Table | Falcon Data Table / Falcon Table |
| Input | Falcon Input |
| Dropdown / Multi-select / Combobox | Falcon Dropdown / Multi Select / Combobox |
| Tabs | Falcon Tabs |
| Dialog / Popup / Confirm | Falcon Dialog / Popup / Confirm Dialog |
| Uploader | Falcon Uploader |
| Toggle / Switch | Falcon Toggle / Switch |
| Checkbox / Group | Falcon Checkbox / Checkbox Group |
| Status / Badge / Tag | Falcon Status Badge / Badge / Tag |
| Cards, empty states, pagination, menus, tooltips, drawers, layout helpers | Falcon equivalents when available |

## 3. Customization Order (strict)
1. Existing Falcon component **inputs / config**
2. Existing Falcon **ng-template** support
3. Existing Falcon **slots / content projection**
4. Existing Falcon **Tailwind / token variants**
5. **Shared Falcon component upgrade**
6. **New reusable Falcon component** inside the library
7. Feature-local **wrapper** (only if truly page-specific)
8. **Raw page implementation** — last resort, MUST be documented as a GAP

## 4. New Falcon Component Creation Rule
If the need is reusable and no component exists:
- Check registry + capability matrix first
- Confirm cross-page reusability
- Define API: inputs / outputs / templates / slots / states / variants / tokens
- Implement with Tailwind + Falcon tokens
- Add `API.md` / `USAGE.md` / `TOKENS.md` / `GAPS_AND_UPGRADES.md` / `DECISION.md`
- Run regression against existing consumers if upgrading
- **Never** create a page-only "custom" component when it belongs in the shared library

## 5. Tailwind + Token Rule (FORBIDDEN list)
- ❌ Custom CSS / SCSS for new styling
- ❌ Inline styles
- ❌ Hardcoded colors / spacing / border-radius / shadows
- ❌ Static pixel values (unless no token exists AND documented)

Missing token → use closest existing → if reusable, add to the correct Falcon token file → document in `TOKENS.md` and task report.

## 6. Reporting Requirement (every UI section)
Emit this table for every section implemented or repaired:

| UI element | Source need | Falcon component used | Reused / customized / upgraded / created | Dynamic API used | CSS/SCSS used? | Token compliance |
|---|---|---|---|---|---|---|

Any element NOT using a Falcon component → explain why and mark as **GAP** unless truly page-specific.

## Enforcement
- This rule runs **before** any UI edit, not after
- Applies to: Adnan, all Ammar agents, all sub-agents, every session, forever
- Overrides any task brief that contradicts it — escalate to user if there's a conflict
- Skill files that already encode this (`noor-instructions`, `angular-tailwind`, `polish`, etc.) remain authoritative for their scope; this rule is the **always-on baseline** even when no skill is loaded
