---
ruleId: R-FE-005
name: Falcon library FIRST — no raw HTML replacements
category: reuse
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.html"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: regex
  patterns:
    - '<button\b(?![^>]*\bfalcon-)'
    - '<input\b(?![^>]*\btype=["'']hidden)(?![^>]*\bfalcon-)'
    - '<select\b'
    - '<textarea\b(?![^>]*\bfalcon-)'
    - '<table\b(?![^>]*\bfalcon-)'
    - '<dialog\b'
    - '<progress\b'
  exemptPatterns:
    - '<!--\s*GAP:\s*R-FE-005'
    - 'data-falcon-gap'
  description: Detects raw HTML primitives (button, input, select, textarea, table, dialog, progress) in app templates without a Falcon equivalent and without a documented GAP marker
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Replace each raw primitive with its Falcon UI Core wrapper (<button> → <falcon-button>, <input> → <falcon-input>, <select> → <falcon-dropdown>, etc.). If no Falcon equivalent exists, add a <!-- GAP: R-FE-005 reason --> marker and file a gap note.'
relatedRules:
  - R-FE-001
  - R-FE-006
  - R-FE-007
source:
  - file: feedback_falcon_custom_library_mandatory.md
    location: memory
  - file: project_falcon_ui_library.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-005 — Falcon library FIRST ***
*** Source: feedback_falcon_custom_library_mandatory (2026-05-15 standing rule) ***
*** Detector: regex (7 patterns) ***

# R-FE-005 — Falcon library FIRST — no raw HTML replacements

## What it says

App templates MUST use Falcon UI Core components (`<falcon-*>`) for every primitive that has a Falcon equivalent. Raw HTML primitives — `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<dialog>`, `<progress>` — are forbidden in app templates unless they are explicitly documented as a GAP. Before writing any markup, the author MUST consult `Brain Outputs/understanding/frontend/components/<component-name>/` (API.md, USAGE.md, TOKENS.md, GAPS_AND_UPGRADES.md, DECISION.md).

## Why it exists

The Falcon component library exists specifically so UI work stays consistent, theme-able, RTL-safe, and bundle-lean. Raw HTML primitives break theming (no token chain), break RTL (no `dir`-aware variants), break i18n (no built-in translation hooks), and silently diverge from the design system. This was issued as a permanent standing rule on 2026-05-15 after repeated cycles of "raw HTML sneaks back in" required cleanup waves. Pair with R-FE-007 (skeleton + wrapper) for the architectural side.

## Detector strategy

Regex sweep across `apps/**/*.html` (libraries are exempt — they MUST own raw primitives). Pattern flags every raw primitive tag NOT prefixed with `falcon-` (e.g. `<falcon-button>` is fine, `<button>` is not). Exempt markers:

- `<!-- GAP: R-FE-005 <reason> -->` comment immediately preceding the offending tag
- `data-falcon-gap` attribute on the tag itself

Hidden inputs (`<input type="hidden">`) are exempt — Angular reactive forms use them legitimately. (Pair-rule R-FE-006 enforces the GAP-marker discipline.)

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../user-form.component.html -->
<form class="grid gap-4">
  <falcon-input label="Name" [(ngModel)]="user.name" required />
  <falcon-dropdown label="Role" [options]="roles" [(ngModel)]="user.role" />
  <falcon-textarea label="Notes" [(ngModel)]="user.notes" />
  <falcon-button variant="primary" type="submit">Save</falcon-button>
</form>
```

### ❌ Bad

```html
<!-- apps/admin-console/.../user-form.component.html -->
<form class="grid gap-4">
  <input type="text" [(ngModel)]="user.name" />        <!-- ❌ raw <input> -->
  <select [(ngModel)]="user.role">                      <!-- ❌ raw <select> -->
    <option *ngFor="let r of roles" [value]="r.id">{{ r.name }}</option>
  </select>
  <textarea [(ngModel)]="user.notes"></textarea>        <!-- ❌ raw <textarea> -->
  <button (click)="save()">Save</button>                <!-- ❌ raw <button> -->
</form>
```

### ✅ Good (legitimate GAP)

```html
<!-- GAP: R-FE-005 native file input required for drag-drop on Safari iOS; see Brain Outputs/70-Gaps/file-uploader.md -->
<input type="file" multiple (change)="onFiles($event)" />
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — Falcon library MUST contain raw primitives
- `*.spec.ts` test fixtures
- Tags inside an Angular CDK overlay/template that need a true `<dialog>` for native semantics — must carry a GAP marker
- Anything listed against `R-FE-005` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. Look up the Falcon equivalent in `Brain Outputs/understanding/frontend/components/`. Common mappings:
   - `<button>` → `<falcon-button>`
   - `<input type="text|email|number|password">` → `<falcon-input>`
   - `<select>` → `<falcon-dropdown>` or `<falcon-multi-select>`
   - `<textarea>` → `<falcon-textarea>`
   - `<table>` → `<falcon-data-table>` or `<falcon-table>`
   - `<dialog>` → `<falcon-dialog>` / `<falcon-popup>` / `<falcon-confirm-dialog>`
   - `<progress>` → `<falcon-progress>`
2. Map every attribute (`placeholder` → `placeholder`, `disabled` → `disabled`, etc.). Consult the component's `API.md`.
3. If the Falcon component is missing a needed feature, follow the customization order in [[R-FE-006-customization-order]]: inputs → templates → slots → variants → upgrade lib → new lib component → wrapper → raw HTML with GAP.
4. If genuinely no equivalent and no upgrade path fits the deadline: add a `<!-- GAP: R-FE-005 <reason> -->` marker and file a note in `Brain Outputs/70-Gaps/`.
5. Re-run the detector to confirm clean.

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — the Falcon library is the only UI kit
- [[R-FE-006-customization-order]] — the strict order before falling back to raw HTML
- [[R-FE-007-library-skeleton-app-wrapper]] — how to author new Falcon components

## Sources of truth

1. `memory/feedback_falcon_custom_library_mandatory.md` — absolute standing rule 2026-05-15
2. `memory/project_falcon_ui_library.md` — Falcon UI cross-framework library structure
3. `CLAUDE.md` — "Falcon UI Core (`<falcon-*>`) is the only UI kit"
