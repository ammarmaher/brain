# falcon-paginator — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-paginator>` |
| Stencil Light | `<falcon-paginator-tw>` |
| Angular wrapper | `<falcon-angular-paginator>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `currentPage` (CVA) | `number` | `1` | Two-way via `[(ngModel)]` or `[(currentPage)]` |
| `totalPages` | `number` | `1` | |
| `siblingCount` | `number` | `1` | Pages shown either side of current |
| `boundaryCount` | `number` | `1` | Pages shown at start/end |
| `showFirstLast` | `boolean` | `false` | Render first-page + last-page nav |
| `showPrevNext` | `boolean` | `true` | Render prev + next nav |
| `disabled` | `boolean` | `false` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `showPageInfo` | `boolean` | `false` | Renders the page-info label |
| `ariaLabel` | `string` | `'Pagination'` | |
| `useTailwind` | `boolean` | `true` | |
| `rootClass` | `string` | `''` | |

## Outputs

| Output | Type | When |
|---|---|---|
| `valueChange` | `EventEmitter<number>` | Page changed (two-way) |
| `falconBlur` | `EventEmitter<FalconPaginatorBlurDetail>` | Blur |

## Stencil props NOT exposed by the Angular wrapper

The Angular wrapper does NOT yet expose the PR-3 paginator inputs. These exist on the Stencil core but cannot be set through the wrapper today:

- `totalRecords` (number) — for current-page report
- `rows` (number, mutable) — page size
- `rowsPerPageOptions` (ReadonlyArray<number>) — RowsPerPage dropdown
- `currentPageReportTemplate` (string) — placeholders `{first}`, `{last}`, `{totalRecords}`, `{currentPage}`, `{totalPages}`
- `paginatorTemplate` (string) — region order
- `showCurrentPageReport` (boolean)

`<falcon-table>` sets these directly on the inner `<falcon-paginator>` via attribute bindings — see `falcon-table.tsx:667-678` and `falcon-table-tw.tsx:792-802`. So when consumed inside a table, the PR-3 surface works. When consumed standalone via the Angular wrapper, it doesn't. **GAP — see GAPS_AND_UPGRADES.md.**

## Stencil events

| Event | Detail | When |
|---|---|---|
| `falcon-change` | `FalconPaginatorChangeDetail = { page, previousPage }` | Page change |
| `falcon-blur` | `FalconPaginatorBlurDetail = { page }` | Blur |
| `falcon-rows-change` | `FalconPaginatorRowsChangeDetail = { rows, previousRows }` | RowsPerPage change |

## Methods (Stencil @Method)

| Method | Description |
|---|---|
| `goto(page)` | Programmatic page jump |
| `setFocus()` | Programmatic focus on the current page button |

## TypeScript types

```ts
type FalconPaginatorSize = 'sm' | 'md' | 'lg';

type FalconPaginatorItem =
  | { readonly kind: 'page'; readonly page: number }
  | { readonly kind: 'ellipsis'; readonly position: 'start' | 'end' };

interface FalconPaginatorChangeDetail { readonly page: number; readonly previousPage: number | null; }
interface FalconPaginatorBlurDetail { readonly page: number; }
interface FalconPaginatorRowsChangeDetail { readonly rows: number; readonly previousRows: number | null; }

type FalconPaginatorRegionToken =
  | 'CurrentPageReport' | 'FirstPageLink' | 'PrevPageLink' | 'NextPageLink'
  | 'LastPageLink' | 'PageLinks' | 'JumpToPageInput' | 'RowsPerPageDropdown';
```

## CVA support

YES — Angular wrapper implements `ControlValueAccessor`. `[(ngModel)]` binds to the current page number.

## Accessibility

- `role="navigation"` + `aria-label` on container
- `aria-current="page"` on the current page button
- `aria-label="Pagination"` default
