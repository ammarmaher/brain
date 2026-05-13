# Agent 4 — COMPONENT_COVERAGE

| Component | Status | Source files read (count) | Gaps found (count) | Notes |
|---|---|---|---|---|
| `falcon-stepper` (Falcon UI core) | covered | 5 (Stencil Shadow `.tsx`, Light `.tsx`, types, Angular wrapper `.ts` + `.html`, tokens) | 10 (1 P0 migration, 2 P1, 5 P2, 2 P3) | First-class Stencil + dual-render + 14-category tokens. No production consumer yet (wizards use legacy). |
| `falcon-stepper` (LEGACY) | covered | 4 (component `.ts` + `.html`, step directive, footer directive) | 10 (3 P0, 4 P1, 2 P2, 1 P3) | Wave 3 PrimeNG removal. Used by 4 wizards in admin-console + management-console. Migration target. |
| `falcon-wizard` | covered | 3 (Stencil Shadow `.tsx`, types, Angular wrapper `.ts` + `.html`) | 11 (2 P0, 4 P1, 3 P2, 2 P3) | Wave 9.G + Wave 5 validation bridge. No production consumer yet. |
| `falcon-uploader` | covered | 3 (Stencil `.tsx`, types, Angular wrapper `.ts`) | 11 (2 P0, 4 P1, 3 P2, 2 P3) | PrimeIcons residual (`pi pi-cloud-upload`) at lines 319 + 361. |
| `falcon-single-uploader` | covered | 3 (Stencil `.tsx`, types, Angular wrapper `.ts`) | 10 (1 P0, 4 P1, 3 P2, 2 P3) | PrimeIcons residuals (`pi pi-cloud-upload`, `pi pi-pencil`). |
| `falcon-photo-uploader` (LEGACY) | covered | 1 (component `.ts`) | 10 (3 P0, 4 P1, 2 P2, 1 P3) | Wave 23. Used by 6+ wizard step templates. |
| `falcon-tree` (Falcon UI core) | covered | 3 (Stencil `.tsx`, types, Angular wrapper `.ts` + `.html`) | 12 (3 P0, 5 P1, 3 P2, 1 P3) | Tier-7 locked-spec component. Parallel implementation with `<falcon-tree-panel>`. |
| `falcon-tree-panel` (LEGACY BESPOKE) | covered | 4 (panel `.ts` + `.html`, directives, models) | 13 (3 P0, 5 P1, 4 P2, 1 P3) | Renders its own `<falcon-tree-node>` internally, not `<falcon-angular-tree>`. Used by 4 org-hierarchy pages. |
| `falcon-mobile-number` (LEGACY FACADE) | covered | 1 (component `.ts`) | 5 (2 P0, 2 P1, 1 P2) | Wave 2 façade delegating to `<falcon-angular-phone-field>`. Likely no active consumers. |
| `falcon-multiselect` (LEGACY STUB) | covered | 1 (component `.ts`) | 5 (4 P0, 1 P1) | Wave 3 stub. Zero consumers (Wave 3 verified). |
| `falcon-calendar` (LEGACY FACADE) | covered | 1 (component `.ts`) | 5 (1 P0, 4 P1) | Wave 3 façade delegating to `<falcon-angular-date-picker>`. |
| `falcon-form-field` (LEGACY) | covered | 1 (component `.ts`) | 7 (1 P0, 4 P1, 1 P2, 1 P3) | Used heavily in admin-console + management-console wizards. Promotion candidate. |
| `send-credentials-popup` (LEGACY) | covered | 1 (component `.ts`) | 6 (1 P0, 1 P1, 3 P2, 1 P3) | Waits for `<falcon-angular-popup variant="custom">` slot-friendly variant. |
| shared-directives/ (12 directives) | covered | 11 directive files + index | 11 (3 P0, 4 P1, 3 P2, 1 P3) | `FalconFormValidate` needs major upgrade; 11 others READY. |

## Verification notes
- All component folders contain 6 required files (OVERVIEW / API / USAGE / GAPS_AND_UPGRADES / TOKENS / DECISION).
- No file is skipped — sections marked `_None observed in active source._` where applicable.
- `falcon-organization-hierarchy-tree-tw` is Agent 2's territory — NOT covered here. See cross-link below.

## Cross-link mentions
- **`<falcon-organization-hierarchy-tree-tw>`** (Light-DOM bespoke org-hierarchy tree, used by admin-console + management-console). Owned by Agent 2. Mentioned in `falcon-tree/OVERVIEW.md` and `falcon-tree-panel/OVERVIEW.md` as a separate parallel implementation.

## Skipped / out-of-scope
- All Form/Input components (Agent 1).
- All Data/Table/Status components (Agent 2).
- All Layout/Navigation/Overlay components (Agent 3).
- Theme/Tailwind/Tokens documentation (Agent 5).
- Frontend architecture / usage patterns (Agent 6).
- Final registry merge (Agent 7).
