*** Brain SK Deep Frontend Component Knowledge Build — Shared Briefing ***
*** READ THIS FIRST. All 7 agents MUST follow these rules. ***

# Mission

Brain SK must deeply understand every active frontend/Falcon custom component, how the theme works, how Tailwind works, how Angular wrappers work, how Stencil Shadow/Light render paths work, how components are consumed in the apps, and how each component can become more reusable/dynamic.

This is the FIRST deep frontend/component investigation task. Do NOT rush. Do NOT skip details. Do NOT produce one summary file. Produce ONE folder PER COMPONENT with SIX files.

# Active source — paths

| Purpose | Path |
|---|---|
| Brain core | `C:\Falcon\Brain SK` |
| Project root | `C:\Falcon\Falcon` |
| Frontend workspace (ACTIVE SOURCE OF TRUTH) | `C:\Falcon\Falcon\falcon-web-platform-ui` |
| Generated outputs root | `C:\Falcon\Brain Outputs` |
| Git mirror (will sync at end) | `C:\Falcon\Brain SK\outputs` |
| Obsidian vault | `C:\Falcon\Brain SK\_obsidian` |

# Starting context (READ before writing)

These files already exist under `C:\Falcon\Brain Outputs\understanding\frontend\`:

- `FALCON_COMPONENT_REGISTRY.md` — first-pass component table (54+ rows)
- `FRONTEND_WORKSPACE_MAP.md` — apps + libs map
- `FRONTEND_STRUCTURE_REPORT.md` — folder conventions
- `ANGULAR_AND_TAILWIND_RULES.md` — every active rule
- `TAILWIND_TOKEN_MAP.md` — ~264 theme tokens cataloged

Treat them as starting context. Verify against active source. If they conflict with the actual code, the code wins — write `GAP/UNKNOWN` and note the conflict.

# Off-limits (DO NOT scan as active truth)

- `C:\Falcon\Falcon\deprecated-falcon-web-platform-ui\` — deprecated
- `C:\Falcon\Falcon\falcon-web-platform-ui-old\` — deprecated
- `C:\Users\...\WebstormProjects\falcon-web-platform-ui\` — duplicate, off-limits
- Anything inside `node_modules/`, `dist/`, `.angular/`, `.nx/`
- `demos/` folder (excluded from bundle calculations per standing rule; mention only if explicitly relevant)
- Inactive `libs/falcon-studio` (hidden-but-kept per Wave 2 v3.1) — note existence, do not deeply audit

# Rules every agent must enforce when describing components

1. **Active source is the truth.** Existing component source beats assumptions. Current codebase beats old memory. If unclear → mark `GAP/UNKNOWN`.
2. **Angular best practice mandatory:** standalone components, explicit imports, signals + OnPush, `@if/@for/@switch` (no `*ngIf/*ngFor`), `inject()` over constructor where idiomatic, `CUSTOM_ELEMENTS_SCHEMA` on Stencil-rendering wrappers, `ControlValueAccessor` on form controls.
3. **Tailwind-only stylistic rule:** utilities in templates ONLY. No SCSS, no per-component CSS rules. No PrimeNG (Wave PR-8 removed it). No PrimeIcons (`pi pi-*` replaced by vendored Falcon icon font). Tokens + Tailwind utilities are the styling SSOT.
4. **Tokens-first:** Stencil Shadow + per-component `<component>.tokens.css` are the SSOT. Tailwind variants mirror — never invent or hardcode. Falcon component tokens must be understood and documented per component.
5. **Angular wrapper behavior:** understand the wrapper before recommending usage. Wrappers usually expose `useTailwind` flag to toggle Shadow vs Light render path.

# Required output PER COMPONENT

For every Angular-facing Falcon/custom component you investigate, create a draft folder under your assigned agent folder:

`C:\Falcon\Brain Outputs\component-registry\parallel-agents\<your-agent-folder>\components\<component-name>\`

Each component folder must contain ALL SIX files. No skipping. If a section truly has nothing, write `_None observed in active source._` — do not omit the section.

## 1. OVERVIEW.md
- component purpose
- business/UI use case
- when to use it / when NOT to use it
- active/preferred/deprecated/legacy status
- whether it replaces PrimeNG/native/old custom impl
- Angular wrapper path
- Angular selector (`falcon-angular-X` or legacy `falcon-X`)
- Stencil Shadow DOM path + tag if available
- Stencil Light DOM (`-tw`) path + tag if available
- token file path
- Tailwind helper path if available
- type file path if available
- utility file path if available
- known consumers in admin-console, management-console, host-shell, playground/showcase (grep for usages)
- related components
- ownership/responsibility

## 2. API.md
- Angular selector
- Stencil tags (Shadow + Light)
- import/export path
- ALL @Input/props with types + defaults
- ALL @Output/events with payload types
- TypeScript interfaces/types involved
- reflected props if relevant
- mutable props if relevant
- CVA support? ngModel? Reactive Forms?
- signal compatibility notes
- slots (Stencil) / ng-template inputs (Angular)
- supported sizes / states / variants / appearances / modes
- lazy/server mode if available
- important constraints
- accessibility attributes/events visible in source (ARIA, keyboard nav, role, etc.)

## 3. USAGE.md
- 1-3 real usage examples from active codebase (cite file paths)
- recommended usage for NEW Angular pages
- reactive forms example if supported
- ngModel example if supported
- Tailwind-only usage
- token usage notes (per-instance override pattern is `class="some-component-host"` then mutate `--falcon-<component>-*` in token file)
- admin-console / management-console / host-shell example if you find one
- bad usage to avoid
- import requirements
- do / don't section

## 4. GAPS_AND_UPGRADES.md
- missing capabilities
- missing ng-template / template slots
- missing flags / options / states
- missing accessibility features
- missing tests
- missing Tailwind / token parity (Shadow vs Light divergence?)
- performance risks
- visual / interaction risks
- reusable upgrades needed
- whether the gap should be fixed in shared Falcon component or per-page
- whether a temporary workaround exists
- priority: **P0** (blocks correct usage) / **P1** (frequent need) / **P2** (improvement) / **P3** (polish)
- recommended upgrade API (exact `@Input`/`@Output` proposal)
- exact future-proof recommendation

## 5. TOKENS.md
- component token file path (e.g. `libs/falcon-ui-tokens/src/components/<name>.tokens.css`)
- related Falcon theme tokens (from `falcon-tailwind-tokens.css`)
- Tailwind utility guidance for this component
- dark mode support (per `feedback_v02_theme_adopted.md` + dark override at lines 385-451)
- density support if relevant
- RTL support if relevant
- static style risks (hardcoded px/hex still in source)
- no CSS/no SCSS guidance
- token usage for: border / radius / shadow / spacing / color / hover / focus / error / success / warning / disabled / loading

## 6. DECISION.md
Brain SK FINAL recommendation:
- use this component for which UI patterns
- avoid this component for which patterns
- preferred variant / render path (`useTailwind=true` default vs Shadow when?)
- required upgrades before wider use
- relationship to other components
- exact rule for future implementation tasks
- whether component is **READY** / **NEEDS-UPGRADE** / **DEPRECATED** / **REFERENCE-ONLY**

Then the **Dynamic capability assessment** — answer all ten questions:
1. What is static today?
2. What is already dynamic through inputs/outputs?
3. What is already dynamic through slots/ng-template?
4. What is dynamic through token/theme overrides?
5. What is dynamic through Tailwind classes?
6. What is missing to make this component reusable across pages?
7. What capability should be added to the shared component instead of a one-off page hack?
8. What flags/options/templates/slots would make it better?
9. What is the safest upgrade path?
10. What would be risky to change because other pages depend on it?

# Required output PER AGENT (in agent root)

In addition to the per-component folders, each agent must write THREE files in their agent root:

1. **`AGENT_SUMMARY.md`** — what you investigated, totals, hotspots, top 5 dynamic-capability findings, top 5 reusable-upgrade ideas.
2. **`COMPONENT_COVERAGE.md`** — table listing every component you investigated, with columns: `component | status (covered / partial / unclear / skipped) | source files read (count) | gaps found (count) | notes`.
3. **`UPGRADE_CANDIDATES.md`** — concrete reusable-upgrade backlog (cross-component). One entry per upgrade. Include: title, motivation, scope (which components), proposed API, risk, priority.

# Coordination rules (avoid stomping)

- Each parallel agent writes ONLY inside their own agent folder.
- Do not write into `C:\Falcon\Brain Outputs\component-registry\components\` — that is Agent 7's territory.
- Do not write into `frontend-understanding\` — that is Agent 7's territory.
- Do not commit anything — Agent 7 handles the merge then the orchestrator handles git.
- Use markdown only. No HTML. No emojis unless quoting source.

# Dynamic-capability examples to look for

- If a table needs custom cells: does `falcon-angular-data-table` accept `FalconDataTableCellDirective` (ng-template per column)? Document exactly how, with a code example.
- If tabs need action buttons left/right of header: do header slots/action areas exist on `falcon-angular-tabs`? If not, propose a reusable slot API.
- If dropdown needs custom option rendering: are per-option templates supported? If not, propose reusable option-template API.
- If tree needs custom node actions: are node templates / action slots supported? If not, propose reusable node-template API.
- If drawer/dialog/popup needs custom header/footer actions: check existing slots before recommending new implementation.
- If status colors are needed: map to `falcon-status-badge` / `falcon-tag` / `falcon-badge` and the matching tokens — do not hardcode classes.

# Component-to-agent ownership (no overlap)

Agent 1 owns form/input components.
Agent 2 owns data/table/status components.
Agent 3 owns layout/navigation/overlay components.
Agent 4 owns workflow/feature/organization components.
Agent 5 owns theme/Tailwind/tokens (no per-component folders — produces token guidance docs).
Agent 6 owns frontend architecture / usage patterns (no per-component folders — produces architecture docs).

If a component spans two agents' ownership (e.g. `falcon-search-input` could be Forms OR Layout), Agent 1 owns it. Agents 5+6 NEVER produce per-component folders.

# Output safety

- Use UTF-8 encoding when writing files (avoid UTF-16 BOM trap from PowerShell `Out-File`/`Set-Content`). Use the `Write` tool which writes UTF-8 by default.
- Use forward slashes or escaped backslashes in code blocks for cross-platform clarity.
- Quote any code from active source with the file path on the line above the fence.

# Done-when

You are done when:
- All assigned components have all 6 files.
- AGENT_SUMMARY.md, COMPONENT_COVERAGE.md, UPGRADE_CANDIDATES.md exist in your agent root.
- You report back a short summary table to the orchestrator.

Quality bar: a future Brain SK build agent should be able to read just your output (no need to re-scan source) to decide which Falcon component to use, how to wire it, and which upgrade to request.
