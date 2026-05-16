---
type: catalog
cluster: 11-copy-playbook
title: DTO Divergence Catalog — UI-hint fields mgmt-side adds
purpose: "Answers 'which UI-hint DTO fields (subtitle, iconClass, pricePeriod, currency, showDates) does mgmt-side add to admin DTOs + which features'. Open during Step 5 of the 12-step port recipe."
extracted: 2026-05-16
---

# Catalog · DTO Divergence (Step 5)

> [!tldr]
> Mgmt-side DTOs commonly enrich admin-side DTOs with **UI hint fields** — card subtitles, icon refs, period labels, currency strings, and show/hide flags. Per `[BRAIN-OUT] ../08-entity-drift-by-feature/MATRIX.md` Mindset 10 conventions: UI rendering decisions belong on the mgmt-side; admin-side stays lean. Don't reverse-merge — keep admin DTOs minimal.

## The divergence pattern

Mgmt-side renders **service cards** and **enriched list rows** that admin-side doesn't. The card-view extras travel on the DTO so the FE doesn't need a second lookup.

Pattern:
- Admin DTO: lean — id, accountId, name, visibility, pricingType, priceValue, dates, status, allowedActions, canHide.
- Mgmt DTO: lean fields PLUS `subtitle` / `description` / `iconClass` / `iconSvg` / `iconUrl` / `pricePeriod` / `currency` / `showDates` / `showPrice`.

Both consoles hit the same backend service; the **endpoint differs** (mgmt suffix `/visible/details` adds the hint fields). See [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md).

## Per-feature DTO additions

### `comms-hub` — `CommChannelServiceItem`

Source: `[CODE] comms-hub.compare.md:41, 153` quoting `[BRAIN-OUT] comms-hub.diff.md:35-38`.

| Field | Type | Purpose |
|---|---|---|
| `subtitle` | `string` | Channel sub-label on the card (e.g. "Voice — outbound") |
| `description` | `string` | Long-form description for tooltip / expanded card |
| `iconClass` | `string` | CSS class for icon font (e.g. `fa-sms`) |
| `iconSvg` | `string` | Inline SVG markup (preferred over `iconClass` if both supplied) |
| `iconUrl` | `string` | External icon URL (fallback) |
| `pricePeriod` | `string` | Display label for the period (e.g. "/month", "/year") — admin renders pricing-type enum string instead |
| `currency` | `string` | Currency label for the price (e.g. "SAR") |
| `showDates` | `boolean` | Toggles the date-range chip on the card |
| `showPrice` | `boolean` | Toggles the price section on the card |

Also subtle behavior divergence: unknown `pricingType` defaults to `'--'` placeholder on mgmt vs `PricingType.Monthly` (a fake value) on admin. `[CODE] comms-hub.compare.md:42`.

### `marketplace-applications` — `MarketplaceApplicationItem` (vs admin's `AppServiceItem`)

Source: `[CODE] marketplace-applications.compare.md:38, 95, 110` quoting `[BRAIN-OUT] marketplace-applications.diff.md:50-52`.

Identical extras to `comms-hub` (mirror feature):

| Field | Type | Purpose |
|---|---|---|
| `subtitle` | `string` | App sub-label |
| `description` | `string` | Long-form description |
| `iconClass` | `string` | CSS class for icon font |
| `iconSvg` | `string` | Inline SVG markup |
| `iconUrl` | `string` | External icon URL |
| `pricePeriod` | `string` | "/month", "/year", or "one-time" display label |
| `currency` | `string` | "SAR" / etc. |
| `showDates` | `boolean` | Date-range chip toggle |
| `showPrice` | `boolean` | Price section toggle |

`[CODE] marketplace-applications.compare.md:110` quotes the port step: "Extend DTO: replace lean `AppServiceItem` with `MarketplaceApplicationItem` (add `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`)."

### `contact-groups` — `ContactGroupDetailDto` + `ContactGroupContactItem` (mgmt-only)

Source: `[CODE] contact-groups.compare.md:140`.

Mgmt-only DTOs not present on admin:

| DTO | Purpose | Fields of note |
|---|---|---|
| `ContactGroupDetailDto` | Detail view (admin uses `ContactGroupListItemDto` for both list and detail) | Adds `isCreator`, full `sharePolicy`, `editableBy[]`, mgmt-only metadata |
| `ContactGroupContactItem` | One contact row inside the detail | `phone`, `email`, dynamic columns from the group's column-config |
| `InitUploadSessionRequest` / `Response` | Pre-signed S3 PUT pipeline | `UploadId`, `PreSignedUrl`, `MaxFileSizeMB`, `ExpiresInSeconds` |
| `UploadConfigResponse` | Read-only client config | `AllowedExtensions[]`, `MaxFileSizeMB` |
| `CompleteUploadResponse` | After S3 PUT confirms | `UploadSessionId` (= `UploadId` rename — drift item) |
| `UploadPreviewResponse` | Wizard Step 2 preview | Detected columns, row count, sample rows |
| `CreateContactGroupRequest` / `Response` | Finalises the group | `Name`, `UploadSessionId`, `ColumnConfig[]`, `SharePolicy` |
| `ShareGroupRequest` | Post-create share dialog | `GroupId`, `SharedWithAllUsers` OR `SharedUserIds[]` (mutex per V-contact-group-share-policy-mode-mutex) |
| `ShareableUser` / `SharedUserOption` | Identity-service join (acc-user picker) | `userId`, `displayName`, `status` |
| `ContactGroupFileDownloadDto` | Download endpoint result | Pre-signed download URL |
| `UpdateContactGroupRequest` | Edit dialog | `Name`, `SharedWith`, `ReferenceId` |
| `ContactGroupFileType` enum | `Original=0, Validated=1, ErrorReport=2` | Used by download endpoint |

`[CODE] contact-groups.compare.md:140` enumerates the mgmt-only set: "`InitUploadSessionRequest/Response`, `UploadConfigResponse`, `CompleteUploadResponse`, `UploadPreviewResponse`, `CreateContactGroupRequest/Response`, `ShareGroupRequest`, `ShareableUser`, `SharedUserOption`, `ContactGroupContactItem`, `ContactGroupFileDownloadDto`, `ContactGroupFileType` (Original=0, Validated=1, ErrorReport=2), `UpdateContactGroupRequest`."

### `wallet-balance-management` — DTOs are IDENTICAL

Source: `[CODE] wallet-balance-management.compare.md:136-138`.

This is the **edge case**: all wallet DTOs (`IWalletQuery`, `IWalletDataResponse`, `ISaveBalancesRequest`, transfer family) are identical in both apps. The divergence is in the **gateway** + **explicit override** + **dropping the Master Wallet UI block**, not in the DTOs themselves.

Don't add UI hint fields here — wallet rendering is identical card layouts on both sides; the hint fields don't apply.

### `contracts-cost-management` — DTOs diverge by mgmt SLIMMING admin

Source: `[CODE] contracts-cost-management.compare.md:124-127`.

Reverse of the typical pattern: admin has rich form DTOs (`ContractRow`, `ContractDetails`, `ContractRateMatrixState`, `ContractFormValue`, catalog constants) for the wizard + edit flows. Mgmt has its own **slimmer** mapping that hardcodes `canEdit: false`, `currencyCode: 'SAR'`.

Mgmt-side DTO behavior:
- Hardcodes `canEdit: false` on every row mapping. `[CODE] contracts-cost-management.compare.md:139`.
- No charging-side balance enrichment — reads `remainingBalance` straight from `ApiContractSummary`. `[CODE] contracts-cost-management.compare.md:140`.
- Drops admin-only catalog constants (`CONTRACT_UNIT_CONVERSION_CATALOG`, `CONTRACT_RATE_PRIORITIES`, `CONTRACT_ADDON_CATALOG`).

### `organization-hierarchy` — partial DTO divergence (Add Client wizard is admin-only)

The shared tree response (`AccountHierarchyNodeResponse`) is identical. The 5-step Add Client wizard request DTOs (`CreateAccountRequest` with nested `Info`, `Settings`, `Services`, `Applications`, `AccountOwner`) are admin-only. Mgmt has its own `Add User` + `Add Node` request DTOs only.

## When to add hint fields

| Situation | Verdict |
|---|---|
| Mgmt feature renders **service cards** with icons | YES — add `iconClass` / `iconSvg` / `iconUrl` / `subtitle` |
| Mgmt feature renders a **payment / pricing UI** | YES — add `pricePeriod`, `currency`, `showPrice` |
| Mgmt feature renders **date ranges in card chips** | YES — add `showDates` |
| Mgmt feature is a flat list with no card view | NO — admin DTO is sufficient |
| Admin feature should also "look prettier" | NO — admin DTOs stay lean. Hint fields belong on mgmt. |
| Backend already returns rich data for both | Negotiate with backend to add `/visible/details` endpoint variant returning mgmt-only fields |

## Anti-patterns

| Anti-pattern | Why it's wrong |
|---|---|
| Adding `iconClass` / `pricePeriod` to the admin DTO to "match" mgmt | Admin gets raw data tables (per `[BRAIN-OUT] ../08-entity-drift-by-feature/MATRIX.md` Mindset 10). Don't pollute admin DTOs with UI hints. |
| Reading hint fields from the admin endpoint | Admin endpoint doesn't return them. Use the mgmt `/visible/details` endpoint instead. |
| Hardcoding hint values in mgmt mapper when backend should supply them | UI hints are tenant-configurable in backend; don't bake them into the FE |
| Skipping the hint fields entirely when porting comms-hub / marketplace-applications | The cards won't render — `iconClass` empty = no icon. Add the fields. |
| Adding hint fields to enums (`PricingType` → adding `Display`) | Enums are wire-format. Add display logic in mapper or pipe instead. |

## Cross-references

- [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) — full 12-step recipe (this is Step 5)
- [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md) — `/visible/details` endpoint provides the hint fields
- [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md) — full entity drift catalog
- `[CODE] comms-hub.compare.md:41, 153` — DTO addition list
- `[CODE] marketplace-applications.compare.md:38, 110` — same pattern
- `[CODE] contact-groups.compare.md:140` — mgmt-only upload + share + detail DTOs
- `[CODE] wallet-balance-management.compare.md:136-138` — DTOs identical (edge case)
- `[CODE] contracts-cost-management.compare.md:124-127` — reverse pattern (admin richer than mgmt)
- `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md` — full per-feature DTO inventory
