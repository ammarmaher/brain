*** Contact Groups List — Components ***
*** 2026-05-18 ***

# Contact Groups List — Components

## Component tree

```
ContactGroupsContainer (list page)
├── <falcon-organization-hierarchy-tree> (left tree)
├── Right pane:
│   ├── <falcon-tabs> (Own | Shared)
│   ├── <falcon-angular-data-table> list
│   │   └── per-row: <falcon-menu> kebab
│   └── <falcon-empty-state> when no data

ContactGroupDetailsContainer (detail page)
├── <falcon-page-header> with Back + Edit button
├── <falcon-info-section> metadata
├── <falcon-button> Download Original | Download Validated
├── <falcon-angular-data-table> contacts (lazy paginated)
├── Edit panel (slide-in or inline)
│   ├── <falcon-input> name + referenceId
│   ├── Share panel
│   │   └── <falcon-multiselect> shareable users
│   └── <falcon-button> Save / Cancel
└── <falcon-confirm-dialog> for delete confirmation
```

## Anti-patterns (per 08-RULES-APPLIED.md)

8 anti-patterns observed in old-UI:
- 138 LOC SCSS (list)
- 227 LOC SCSS (detail)
- Plus standard list (template-driven NgForm, *ngIf, PrimeNG, etc.)

NEW UI: all standard cleanup applies.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
