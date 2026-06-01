---
type: checklist
cluster: 11-copy-playbook
title: Session Binding — Account ID from session, not tree selection
purpose: "Answers 'how to source accountId from session.tenantId || session.client_id on mgmt-side vs tree-selection on admin-side'. Open during Step 7 of the 12-step port recipe."
extracted: 2026-05-16
---

# Checklist · Session Binding (Step 7)

> [!tldr]
> Mgmt-side resolves the account id from session (`session.tenantId || session.client_id`), not from a tree-picker selection. Client users have ONE tenant (their own); there is nothing to pick from a tree. Admin pattern (for contrast): tree-selection drives the id, with a synthetic `FALCON_ROOT_NODE` virtual root covering "all clients".

## The canonical mgmt pattern

```typescript
// Inside the component's init / constructor / ngOnInit:
const accountId = this.sessionProvider.session.tenantId
                ?? this.sessionProvider.session.client_id;
// Or the equivalent with || / ?? depending on the type
```

`[CODE] comms-hub.compare.md:108`:

> Both components resolve `accountId` from session as `session.tenantId || session.client_id` (line 227, 880-883).

`[CODE] marketplace-applications.compare.md:39`:

> **Mgmt-console**: tenant root from session (`session.tenantId ‖ session.client_id`)

`[CODE] wallet-balance-management.compare.md:38`:

> **Hardcoded to `session.tenantId || session.client_id`** — Client user can only configure own account.

## Why two fields?

`session.tenantId` and `session.client_id` are **both** populated for Client users (mgmt-console). They mean the same thing operationally — the tenant the JWT was issued for. Two field names exist for historical reasons.

Defensive coalescing: use `||` (or `??`) so either form works.

`[CODE] wallet-balance-management.compare.md:43`:

> Mgmt account-id resolved through `accountInfo.accountId ?? session.tenantId ?? session.client_id ?? ...` — always the **main account**, never a child node.

## The admin pattern (for contrast)

Admin picks the account from a **tree selection**:

```typescript
// Admin pattern — selected node provides the id
const nodeId = this.treeSelection?.data?.id;  // or .nodeId, .accountId
```

`[CODE] wallet-balance-management.compare.md:43`:

> Admin: Selected tree node ID

The admin tree includes a **synthetic Falcon root** (`FALCON_ROOT_NODE`) representing "all clients" — clicking the synthetic root selects every account; clicking a Main node selects one account; clicking a Sub-node selects a child.

Mgmt has **no synthetic root** — the tree (when present) starts at the tenant's own Main node.

## Common shapes of session-bound id resolution

### Shape 1 — direct in `ngOnInit` / `constructor`

Used by: `comms-hub`, `marketplace-applications`.

```typescript
private accountId!: string;

ngOnInit(): void {
  this.accountId = this.sessionProvider.session.tenantId
                || this.sessionProvider.session.client_id;
  this.loadData(this.accountId);
}
```

### Shape 2 — helper method (more defensive)

Used by: `wallet-balance-management`. `[CODE] wallet-balance-management.compare.md:155`:

```typescript
// resolveSelectedAccountId() helper at lines 710-721 of mgmt component
private resolveSelectedAccountId(): string {
  return this.accountInfo?.accountId
      ?? this.sessionProvider.session?.tenantId
      ?? this.sessionProvider.session?.client_id
      ?? '';
}
```

Use Shape 2 when:
- The page also accepts an `accountInfo` input from a parent (route data or @Input)
- The page needs to defensively short-circuit if session isn't ready yet
- Multiple actions need the id (save / load / refresh) and DRY matters

### Shape 3 — signal-based (Angular 17+)

```typescript
readonly accountId = computed(() =>
  this.sessionProvider.session.tenantId
    ?? this.sessionProvider.session.client_id
);
```

Use Shape 3 when:
- The session can change mid-component-lifetime (rare but possible after re-auth)
- The page uses other signals and should stay reactive

## Edge cases

### Features that don't take a node id (global features)

Some features (e.g. global contracts list when not scoped) read account-id from session on **both** consoles. Admin doesn't have a tree-picker in this case; the session-bound id is the only source.

`[CODE] contracts-cost-management.compare.md:36`:

> Account selection: Local `<app-contracts-accounts-panel>` flattening org tree to single-level account list

Even with a tree-equivalent picker, the underlying scope is the session's tenant context. Don't strip the session resolution.

### Features with cross-account tree picker (Falcon-only)

`wallet-balance-management` admin-side has cross-account picker; mgmt does NOT. `[CODE] wallet-balance-management.compare.md:150`:

> **Drop the tree picker.** Remove `<falcon-organization-hierarchy-tree>` from the template; remove `OrgHierarchyApiService` + `loadRoot()` + `loadChildren()` + tree state fields.

Same for `marketplace-applications` and `comms-hub`. `[CODE] marketplace-applications.compare.md:109`:

> Replace tree-panel node source: drop `OrgHierarchyApiService.getRootNodes()` / `getChildren()` + `FALCON_ROOT_NODE` virtual root; substitute single-tenant root from `SessionProvider.session.tenantId ‖ session.client_id`.

### Features where the mgmt-side keeps a tree (organization-hierarchy)

Mgmt-side `organization-hierarchy` DOES keep the tree — but rooted at the tenant's Main node, not a synthetic root. The tree shows the Main node + its Sub-nodes; clicking a node updates the URL with `?nodeId=...` and the page scopes to that node.

In this case, account-id is still session-bound (`session.tenantId`); the **node-id** is from the tree click. Two ids — don't conflate.

### `contact-groups` parent route with tree-panel

`contact-groups` mgmt-side parent route owns the tree-panel that persists across child navigation. `[CODE] contact-groups.compare.md:120`:

> Parent `ContactGroupsComponent` (tree + outlet shell) with **3 nested children**: `''` (list), `'create'` (5-step wizard), `':groupId'` (detail). The parent route owns the `<falcon-organization-hierarchy-tree>` so it persists across child navigation.

Same dual-id pattern: account-id is session-bound; node-id comes from the tree click.

## Node-id sourcing

Most features also need a `nodeId` for the per-node sub-resource. The pattern:

| Context | Source |
|---|---|
| Mgmt with a tree (e.g. `contact-groups`, `comms-hub` mgmt-side IF the tree exists) | `treeSelection.data.id` — node clicked in the tree |
| Mgmt without a tree (e.g. `wallet-balance-management` mgmt-side) | `nodeId === accountId === session.tenantId` (Main node = the account itself) |
| Admin with cross-account tree | `treeSelection.data.id` — node clicked in the tree (can be any account anywhere) |

`[INFERRED]` On mgmt-side without a tree, the Client tenant's Main node = the account = the tenant. Same id everywhere. On admin-side, the node picked can be ANY node anywhere in the platform.

## Verification

After porting, confirm:

```bash
# Mgmt should NOT have FALCON_ROOT_NODE references (synthetic Falcon root is admin-only)
grep -rn "FALCON_ROOT_NODE" apps/management-console/

# Mgmt should NOT have OrgHierarchyApiService.getRootNodes() — that's the cross-account fetcher
grep -rn "getRootNodes\|loadRootNodes" apps/management-console/

# Mgmt SHOULD have session.tenantId / session.client_id resolutions
grep -rn "session.tenantId\|session\.client_id" apps/management-console/
```

Test by logging in as `acc-owner` and confirming the feature scopes to the owner's tenant automatically (no tree to click).

## Common mistakes

1. **Leaving the cross-account tree-panel in place** — `<falcon-organization-hierarchy-tree>` calling `OrgHierarchyApiService.getRootNodes()` shows the synthetic Falcon root + a tree of all clients to a Client user. Drop entirely on mgmt port.
2. **Reading `accountId` from a route `:id` param when it should come from session** — `acc-*` users don't navigate to account-scoped URLs; the account is implicit in their JWT. Use session.
3. **Forgetting the `??` fallback** — `session.tenantId` may be null in some session shapes (e.g. immediately after refresh). Coalesce to `client_id` to avoid undefined behavior.
4. **Resolving account-id on save but a different id on load** — `[CODE] wallet-balance-management.compare.md:155` flags this: "Fix the account-ID resolution for save. The mgmt-side `saveChanges` must use the **main account ID** not whichever child node was viewed." Always use the same resolver.
5. **Re-introducing a `FALCON_ROOT_NODE` constant on mgmt** — there is no synthetic root in mgmt. The tree (if any) starts at the tenant's real Main node. Don't create a virtual root.

## Cross-references

- [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) — full 12-step recipe (this is Step 7)
- [`../07-cross-cutting/`](../07-cross-cutting/) — session shape + tree node shape
- `[CODE] comms-hub.compare.md:108` — `session.tenantId || session.client_id` pattern
- `[CODE] marketplace-applications.compare.md:39, 109` — same + how to remove admin tree-picker
- `[CODE] wallet-balance-management.compare.md:38, 43, 150, 155` — `resolveSelectedAccountId()` helper
- `[CODE] contact-groups.compare.md:120` — parent route owns tree on mgmt-side
- memory `feedback_pes_g_link_uses_zitadel_id.md` — frontend resolves user-id from `JWT.sub`, NOT session.identityUserId or session.subjectId for PES checks (related but distinct from account-id)
