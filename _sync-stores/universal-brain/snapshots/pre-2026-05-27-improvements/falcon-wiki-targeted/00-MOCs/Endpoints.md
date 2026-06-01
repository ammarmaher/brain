---
type: moc
role: cluster-index
cluster: endpoints
updated: 2026-05-14
---

> [!tldr]
> One file per API endpoint. Each endpoint declares its HTTP verb, path, owning service, request/response DTO links, and which pages consume it.

# Endpoints

## All endpoints

```dataview
TABLE WITHOUT ID
  file.link as "Endpoint",
  verb as "Verb",
  path as "Path",
  service as "Service"
FROM "60-Endpoints"
WHERE type = "endpoint"
SORT path ASC
```

## Pages consuming each endpoint

```dataviewjs
const endpoints = dv.pages('"60-Endpoints"').where(p => p.type === "endpoint");
const pages = dv.pages('"20-Pages"').where(p => p.type === "page");
const rows = endpoints.map(e => {
  const linked = pages.where(p => (p.endpoints ?? []).some(x => x.path === e.file.path)).map(p => p.file.link).array();
  return [e.file.link, linked.length === 0 ? "—" : linked.join(", ")];
}).array();
dv.table(["Endpoint", "Used by pages"], rows);
```
