# InformationController — Frontend Contract

## Public URLs

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/Information?NodeId=<id>` | Commerce `/api/Information?NodeId=<id>` | Any JWT |
| `PUT /commerce/Information` | Commerce `/api/Information` | Any JWT (handler branches) |

## Headers

- `Authorization: Bearer <jwt>` — required
- `Content-Type: application/json` — for PUT body
- `Accept: application/json`

## Request shapes

### `GET /commerce/Information?NodeId=<id>`

No body. Single query param `NodeId` (required for meaningful response).

### `PUT /commerce/Information`

```json
{
  "nodeId": "node-acct-987",
  "accountName": "ACME Corp",
  "accountId": "ACME-001",
  "financeId": "FIN-9001",
  "classificationCategory": 1,
  "classificationSubCategory": 2,
  "entityName": "ACME LLC",
  "authorityLetterType": 3,
  "sector": "telecom",
  "budgetNo": "BUD-77",
  "country": "SA",
  "city": "Riyadh",
  "district": "Olaya",
  "street": "King Fahd Rd",
  "buildingNumber": "1234",
  "postalCode": "11564",
  "additionalAddress": "Floor 5, Suite 502",
  "anotherId": "OTHER-99",
  "vatRegistrationNumber": "300xxxxxxxxxx03",
  "profilePicture": {
    "fileName": "logo.png",
    "mimeType": "image/png",
    "base64": "iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

- All fields camelCase on wire
- `profilePicture` is the only nested object; `null` to clear

## Response shapes

### `GET /commerce/Information` (Success)

```json
{
  "isSuccessful": true,
  "result": {
    "accountName": "ACME Corp",
    "accountId": "ACME-001",
    "financeId": "FIN-9001",
    "classificationCategory": 1,
    "classificationSubCategory": 2,
    "entityName": "ACME LLC",
    "authorityLetterType": 3,
    "sector": "telecom",
    "budgetNo": "BUD-77",
    "country": "SA",
    "city": "Riyadh",
    "district": "Olaya",
    "street": "King Fahd Rd",
    "buildingNumber": "1234",
    "postalCode": "11564",
    "additionalAddress": "Floor 5, Suite 502",
    "anotherId": "OTHER-99",
    "vatRegistrationNumber": "300xxxxxxxxxx03",
    "profilePicture": "data:image/png;base64,iVBORw0KG..."
  },
  "errorMessages": []
}
```

- Any field may be `null` — read shape is fully nullable

### `GET /commerce/Information` (NodeId missing or invalid)

```json
{
  "isSuccessful": true,
  "result": {
    "accountName": null,
    "accountId": null,
    /* all fields null */
    "profilePicture": null
  },
  "errorMessages": []
}
```

HTTP 200 — **not 404**. FE must detect null fields to render the "not found" UX.

### `PUT /commerce/Information` (Success)

Same shape as GET, but **non-nullable strings** — the write-echo response asserts all fields are present (in C# DTO terms). Wire-level can still be null when Mongo update wrote empty strings.

### `PUT /commerce/Information` (DuplicateTenantName for Falcon)

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Account name is already in use."]
}
```

HTTP 409.

## Pagination

Not applicable.

## Multi-Step Flows

### Edit Account Info from the org-hierarchy page

1. User selects an account row → page opens drawer / tab
2. `GET /commerce/Information?NodeId=<id>` — populates read-only view
3. User clicks "Edit" → form transitions to edit mode (Falcon sees all fields enabled, Client sees AccountName + FinanceId disabled)
4. Save → `PUT /commerce/Information`
5. Toast on success; refetch GET

## Casing & Path Conventions

- Route: `/api/Information` (PascalCase, singular)
- Query param: `NodeId` (PascalCase — note inconsistent with other endpoints' camelCase params)
- JSON wire: camelCase

## Cross-References

- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-001-add-client-account-name.md` — account name rules
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-002-address-cross-field.md` — Address validation rules
- [CODE] `apps/admin-console/.../org-hierarchy-page/tab-components/account-info-tab/` (inferred — verify)

## Frontend Use Cases

1. **Org-hierarchy account-info tab** (Main node selected)
2. **Falcon Admin Edit Account flow** — full edit with AccountName + FinanceId
3. **Client AO Edit Own Account flow** — fields restricted; UI must disable disallowed inputs
