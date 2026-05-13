<!-- *** Frontend chain: strict component layout rule *** -->
<!-- *** Phase G of full-pipeline-redesign — last word on file/folder structure for any FE component or service *** -->

# Component Layout (chain-level non-negotiable)

## Why this file

This is the structural contract every component and service produced under the frontend chain must obey. It encodes user requirement #6 from `Brain\jobs\full-pipeline-redesign.md` and the standing memory `feedback_folder_structure_pattern.md` (`C:\Users\User\.claude\projects\C--falcon\memory\`).

The five Front-End sub-skills loaded by `chain.md` may suggest other shapes. They lose. This file wins.

## The rule (verbatim contract)

1. **Every component owns a `services\` folder and a `models\` folder.** No exceptions, even when there is currently no service to put inside — the folder still exists for future services.
2. **The component's `.ts` file MUST NOT define any `interface`, `class`, `type`, `enum`, or `const`-map** that represents domain shape. Component `.ts` is allowed to declare ONLY: the `@Component` class itself, its `inject()` calls, signals, computed signals, lifecycle hooks, and event handlers.
3. **All shapes — interfaces, classes, types, enums, DI tokens, const-maps — live in `models\models.ts`** (one file inside the `models\` folder, named the plural of the folder per `feedback_folder_structure_pattern.md`).
4. **Each service inside `services\` is its own `.ts` file AND owns its own `models\` folder** (a sub-folder under that service). A service that needs domain shapes puts them in `services\<service-name>\models\models.ts`. The component-level `models\` folder is not used for service-private shapes.
5. **Public re-exports happen via the component's `index.ts` barrel.** Consumers import the component's public surface from the barrel only. They never reach into `models\models.ts` or a service file directly.
6. **Banner-format comments only** (`feedback_comment_style.md`). No JSDoc, no verbose docblocks. Two-line `***...***` banners at the top of each file describing what the file holds.

## Canonical folder tree

```
<component-name>/
├── <component-name>.component.ts            ← @Component class only — NO interface/class/type/enum/const
├── <component-name>.component.html
├── <component-name>.component.css           ← Tailwind-grid-first; flex only for inline alignment
├── models/
│   └── models.ts                            ← every interface, class, type, enum, const-map, DI token used by the component template
├── services/
│   ├── <service-a>.service.ts               ← @Injectable A — depends on its own models/
│   ├── <service-a>/
│   │   └── models/
│   │       └── models.ts                    ← service-A-private shapes
│   ├── <service-b>.service.ts               ← @Injectable B
│   └── <service-b>/
│       └── models/
│           └── models.ts                    ← service-B-private shapes
└── index.ts                                 ← barrel: re-exports component + public models only
```

Notes on the tree:

- The `services\` folder may also contain a single `services.ts` aggregating tiny services per `feedback_folder_structure_pattern.md`. The split form above is preferred when each service has non-trivial logic and its own model surface; the aggregated form is preferred when each service is a thin wrapper.
- `directives\directives.ts`, `resolvers\resolvers.ts`, and `tokens\tokens.ts` follow the same shape and are added only when the component actually needs them. Empty folders are not created.
- The component's CSS file is allowed to be empty when Tailwind utility classes cover the template — but the file still exists so future styling has a home.

## Minimal example pseudo-tree — `contact-group-list`

```
contact-group-list/
├── contact-group-list.component.ts          ← class ContactGroupListComponent only
├── contact-group-list.component.html        ← table grid, action toolbar
├── contact-group-list.component.css         ← grid utilities (no interfaces, obviously)
├── models/
│   └── models.ts                            ← ContactGroupRow interface, ContactGroupListFilters interface, CONTACT_GROUP_LIST_PAGE_SIZE const, ContactGroupSortKey enum
├── services/
│   ├── contact-group-list.service.ts        ← @Injectable — fetches/paginates rows
│   ├── contact-group-list/
│   │   └── models/
│   │       └── models.ts                    ← ContactGroupListQuery interface, ContactGroupListResponseDto interface (service-private)
│   ├── contact-group-list-export.service.ts ← @Injectable — exports current view to xlsx
│   └── contact-group-list-export/
│       └── models/
│           └── models.ts                    ← ExportFormat enum, ExportRequest interface (service-private)
└── index.ts                                 ← exports: ContactGroupListComponent, ContactGroupRow, ContactGroupListFilters, ContactGroupSortKey
```

What is intentionally NOT in `contact-group-list.component.ts`:

- No `interface ContactGroupRow { ... }` declared inline.
- No `enum ContactGroupSortKey { ... }` declared inline.
- No `type FilterState = ...` declared inline.
- No `const PAGE_SIZE = 25;` declared inline.
- No service-side DTOs declared inline.

All of those live in the appropriate `models\models.ts` file per the rule above.

## Cross-references

- Folder shape source of truth: `C:\Users\User\.claude\projects\C--falcon\memory\feedback_folder_structure_pattern.md`
- Comment style: `C:\Users\User\.claude\projects\C--falcon\memory\feedback_comment_style.md`
- Clean DRY minimal: `C:\Users\User\.claude\projects\C--falcon\memory\feedback_clean_code_dry_minimal.md`
- Tailwind grid-first (CSS file content): `C:\Users\User\.claude\projects\C--falcon\memory\feedback_tailwind_grid_first.md`
- Nx naming + `@falcon/*` import paths: `C:\Users\User\.claude\projects\C--falcon\memory\feedback_wiki_naming_conventions.md`

## Done definition for this rule

- A produced component contains zero `interface`, `class` (other than the `@Component` class), `type`, `enum`, or domain `const` declarations in its `.component.ts`.
- A `models\` folder and a `services\` folder both exist next to the component, even if `services\` is currently empty.
- Each service has its own `.ts` file and a `models\` sub-folder owned by that service when shapes exist.
- `index.ts` barrel exists and re-exports the component plus public models only.
- File comments are banner-format `***...***` (max two lines), no JSDoc.
