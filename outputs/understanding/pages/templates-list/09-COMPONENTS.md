*** Templates List — Components ***
*** 2026-05-18 ***

# Templates List — Components

## Component tree (NEW UI proposed)

```
TemplatesListContainer
├── <falcon-page-header> (title + "+ Create Template")
├── Filters bar
│   ├── <falcon-input> search
│   ├── <falcon-select> status
│   ├── <falcon-select> channel
│   ├── <falcon-select> category
│   ├── <falcon-select> language
│   └── <falcon-button> clear filters
├── <falcon-angular-data-table> list
│   ├── columns per [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md)
│   ├── per-row: <falcon-tag> status
│   └── per-row: <falcon-menu> kebab
└── <falcon-dialog> channel picker (on "+ Create" click)
    └── <falcon-button> × 4 (per channel)
```

## Anti-patterns to AVOID

(Standard list — no SCSS, no PrimeNG, no NgForm, etc.)

## See also

- [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md) · [03-SECTION_FILTERS](03-SECTION_FILTERS.md)
