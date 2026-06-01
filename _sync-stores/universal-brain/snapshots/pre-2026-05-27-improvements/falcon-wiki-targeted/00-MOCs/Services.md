---
type: moc
role: cluster-index
cluster: services
updated: 2026-05-14
---

> [!tldr]
> One file per backend service. Each service declares its port, repo path, owned endpoints, and Kafka topics. Pages reference services via `service:` frontmatter; endpoints reference services via `service:` declaration.

# Services

## All services

```dataview
TABLE WITHOUT ID
  file.link as "Service",
  kind as "Kind",
  repo as "Repo",
  port as "Port"
FROM "50-Services"
WHERE type = "service"
SORT file.name ASC
```

## Endpoints per service

```dataviewjs
const services = dv.pages('"50-Services"').where(p => p.type === "service");
const endpoints = dv.pages('"60-Endpoints"').where(p => p.type === "endpoint");
const rows = services.map(s => {
  const linked = endpoints.where(e => e.service && e.service.path === s.file.path);
  return [s.file.link, linked.length];
}).array().sort((a, b) => b[1] - a[1]);
dv.table(["Service", "# endpoints"], rows);
```

## Pages per service

```dataviewjs
const services = dv.pages('"50-Services"').where(p => p.type === "service");
const pages = dv.pages('"20-Pages"').where(p => p.type === "page");
const rows = services.map(s => {
  const linked = pages.where(p => p.service && p.service.path === s.file.path).map(p => p.file.link).array();
  return [s.file.link, linked.length === 0 ? "—" : linked.join(", ")];
}).array();
dv.table(["Service", "Used by pages"], rows);
```
