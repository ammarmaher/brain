---
type: catalog
cluster: 11-copy-playbook
title: Endpoint Suffix Catalog — /visible/details variants per feature
purpose: "Answers 'when to append /visible vs /visible/details to mgmt list URLs + what each suffix delivers (filter, enrich) per feature'. Open during Step 6 of the 12-step port recipe."
extracted: 2026-05-16
---

# Catalog · Endpoint Suffix (Step 6)

> [!tldr]
> Mgmt-side list endpoints often append `/visible` or `/visible/details` to apply tenant-visibility filtering and payment metadata enrichment. The suffix is feature-specific — mirror what admin and mgmt actually use; don't speculatively add suffixes. Backend will not reject a missing suffix; you just get the unfiltered admin view.

## What the suffixes mean

| Suffix | Semantics |
|---|---|
| `/visible` | Filter rows by `visibility = Show` (hides anything an admin marked Hidden) |
| `/visible/details` | `/visible` + adds payment / priority / pending-change metadata on each row |
| no suffix | Full unfiltered list (what admin needs to manage) |

The mgmt-side wants only what the Client user is supposed to see; the suffix delivers that filtered + enriched view.

## Catalogued per feature

Source: feature compare notes + `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md`.

### `comms-hub` — most pronounced suffix flip

| Operation | Admin URL (System Gateway) | Mgmt URL (Core Gateway) |
|---|---|---|
| **List comm channels** | `GET commerce/Node/{nodeId}/comm-channels` (unfiltered) | `GET commerce/Node/{nodeId}/comm-channels/visible/details` (visibility-filtered + priority/payment details) |
| Mutation endpoints (12 endpoints) | identical | identical |
| Priority dialog source | `GET commerce/Node/{nodeId}/comm-channels/visible` | same |
| Order-status polling | `GET commerce/Node/order/{orderId}/status` | same |

Source: `[CODE] comms-hub.compare.md:36, 113-114` quoting `[BRAIN-OUT] comms-hub.diff.md:22-25`:

> - **Admin**: `GET commerce/Node/{nodeId}/comm-channels` (full unfiltered list for management).
> - **Mgmt**: `GET commerce/Node/{nodeId}/comm-channels/visible/details` (visibility-filtered list with priority/payment details — what Client users should see).

### `marketplace-applications` — no suffix difference

| Operation | Admin URL | Mgmt URL |
|---|---|---|
| **List applications** | `GET commerce/Node/{nodeId}/applications` | `GET commerce/Node/{nodeId}/applications` (same) |
| Mutation endpoints (14 endpoints) | identical | identical |

Source: `[CODE] marketplace-applications.compare.md:89` — "List endpoint `GET commerce/Node/{nodeId}/applications` is identical on both sides; the gateway differs (System vs Core)."

`[INFERRED]` The mgmt-side `MarketplaceApplicationItem` adds UI-hint fields (`subtitle`, `iconClass`, etc.) **without** an endpoint suffix change — backend serves the enriched DTO unconditionally on the same path. Asymmetry with `comms-hub` is unexplained — possibly historical, possibly the backend already shapes the response per session.

### `contracts-cost-management` — URL casing + `api/` prefix flip (not a suffix)

| Operation | Admin URL | Mgmt URL |
|---|---|---|
| **List contracts** | `GET commerce/Contracts?accountId={id}` (PascalCase, no `api/` prefix) | `GET api/commerce/contracts` (lowercase, `api/` prefix) |
| Get contract detail | `GET commerce/Contracts/{contractId}` | `GET api/commerce/contracts/{contractId}` |
| Balance enrichment | `GET charging/Wallet/contract-balance-summaries?accountId={id}` (admin only) | NOT called (balance read inline from contract response) |

Source: `[CODE] contracts-cost-management.compare.md:121, 146` — "admin uses `commerce/Contracts` (no `api/` prefix, capital C) while mgmt uses `api/commerce/contracts` (explicit `api/` prefix, lowercase). [BRAIN-OUT] `contracts-cost-management.diff.md:46-50` notes this is unusual and likely a leftover or alternate gateway route."

Not strictly a "suffix" — it's a prefix + casing difference. Same semantics; gateway routing artifact. Mirror exactly what mgmt-side uses.

### `wallet-balance-management` — URL paths identical (gateway split only)

| Operation | Admin URL | Mgmt URL |
|---|---|---|
| **Read wallet hierarchy** | `GET commerce/accounts/{id}/hierarchy?currency=...&balanceDistribution=...&walletStructure=...` | same |
| **Save strategy** | `POST commerce/setting/wallets` | same |
| **Transfer** | `POST charging/wallet/transfer` (default System Gateway) | `POST wallet/transfer` with `useGateway(Gateway.ChargingGateway)` |

Source: `[CODE] wallet-balance-management.compare.md:127-130`.

URL difference on transfer reflects the explicit ChargingGateway override (path is `wallet/transfer` not `charging/wallet/transfer`). Not a suffix — a gateway-path artifact.

### `contact-groups` — shared list endpoints, no suffix differences

| Operation | Admin URL | Mgmt URL |
|---|---|---|
| **List groups** | `GET contactgroup/contact-groups?...` | same |
| **Shared groups** | `GET contactgroup/contact-groups/shared` | same |
| **Detail** | `GET contactgroup/contact-groups/{id}` | same |
| **Detail contacts** | `GET contactgroup/contact-groups/{id}/contacts` | same |
| **File download** | `GET contactgroup/contact-groups/{id}/files/{type}` | same |
| Create / Update / Share / Delete | n/a (admin can't create) | `POST/PATCH/DELETE contactgroup/contact-groups[/{id}][/share-policy]` (7 mgmt-only endpoints) |

Source: `[CODE] contact-groups.compare.md:132-135`.

Suffix differences are zero — the divergence is in **endpoint count** (mgmt has 13+ vs admin's 6). The 7 extra endpoints are upload-pipeline + create + share-policy + delete. Listed in [`dto-divergence.catalog.md`](dto-divergence.catalog.md).

### `organization-hierarchy` — same tree endpoints, partial sub-feature suffix flips

| Operation | Admin URL | Mgmt URL |
|---|---|---|
| **Tree root** | `GET commerce/Node` | same |
| **Tree children** | `GET commerce/Node?NodeId={parentId}` | same |
| **Account details** | `GET commerce/Node/{accountId}` | same |
| **Add account** | `POST commerce/account` | n/a (mgmt has no Add Client wizard) |
| **CommChannel tab list** | `GET commerce/Node/{nodeId}/comm-channels` (admin tab) | The mgmt-side has no analog — uses `comms-hub` page instead |
| **Apps tab list** | `GET commerce/Node/{nodeId}/applications` (admin tab) | Same — uses `marketplace-applications` page |

The "tab" endpoints inside `organization-hierarchy` are admin-side only; mgmt routes users to the dedicated `comms-hub` and `marketplace-applications` pages where the suffix flip applies (per the comms-hub section above).

## Pattern guidance

### When in doubt: mirror admin

If you can't find a documented suffix difference, **keep the admin URL**. Backend will return more data than the FE renders, but won't error. Then check `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md` for the actual suffix the mgmt-side uses — diff notes capture this explicitly.

### Don't speculatively add `/visible` or `/visible/details`

The suffix is **not** universal. Marketplace-applications doesn't use it despite the parallel feature shape with comms-hub. Adding suffixes blindly causes 404s.

### When the suffix exists, take both:

- `/visible` for **dialog sources** (priority pickers in payment flow)
- `/visible/details` for the **main list view**

Comms-hub uses both — see `[CODE] comms-hub.compare.md:123-127`:

```
List page: GET .../comm-channels/visible/details
Priority dialog source: GET .../comm-channels/visible
```

### Don't drop suffix on a port from mgmt → admin

If you're porting in the reverse direction (mgmt → admin, rare per `[CODE] contact-groups.compare.md:150`), the suffix is mgmt-only. Admin needs the unfiltered endpoint. Strip `/visible` / `/visible/details`.

## Verification

After porting, check:

```bash
# Should find /visible/details only in comms-hub (or wherever the compare note says)
grep -rn "/visible/details" apps/management-console/

# Should find /visible only in priority dialog code paths
grep -rn "/visible[^/]" apps/management-console/

# Should NOT find any admin-style unfiltered list URLs in the copied mgmt feature
# (e.g. `/comm-channels` without a suffix when the diff says we should have one)
grep -rn "commerce/Node/{[^}]*}/comm-channels'" apps/management-console/
```

Then smoke-test as `acc-owner` and verify the page shows only Show-status rows.

## Common mistakes

1. **Adding `/visible/details` to `marketplace-applications` thinking it parallels `comms-hub`** — `[CODE] marketplace-applications.compare.md:89` says the list URL is identical. Don't add.
2. **Forgetting to flip casing in `commerce/Contracts` → `api/commerce/contracts`** for contracts — `[CODE] contracts-cost-management.compare.md:146`. Mgmt uses lowercase + `api/` prefix.
3. **Putting `/visible` on a mutation endpoint** — only list (GET) endpoints take the suffix. Mutations identical on both sides.
4. **Forgetting that comms-hub uses BOTH suffixes** — `/visible/details` for the list, `/visible` (no details) for the priority dialog source. `[CODE] comms-hub.compare.md:114, 124-125`.

## Cross-references

- [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) — full 12-step recipe (this is Step 6)
- [`gateway-flip.checklist.md`](gateway-flip.checklist.md) — gateway-routing artifact context for URL prefix flips
- [`dto-divergence.catalog.md`](dto-divergence.catalog.md) — `/visible/details` returns the UI-hint enriched DTO
- `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md` — authoritative per-feature URL diff
- `[CODE] comms-hub.compare.md:114, 123-127` — `/visible/details` + `/visible` dual use
- `[CODE] marketplace-applications.compare.md:89` — no suffix difference (counter-example)
- `[CODE] contracts-cost-management.compare.md:121, 146` — `api/commerce/contracts` prefix flip
