# Project Root Discovery Protocol

## Default Falcon project root

Ammar's full Falcon project is pulled under:

```text
C:\Falcon\Falcon
```

TouchBase must treat this folder as the first discovery root unless Ammar overrides it.
Do not ask for separate frontend/backend/gateway paths before scanning this root.

## Discovery order

1. Start at `C:\Falcon\Falcon`.
2. Detect frontend workspaces by looking for `angular.json`, `nx.json`, `package.json`, `apps/`, `libs/`, `project.json`, `tailwind.config.*`, and Falcon component folders.
3. Detect backend services by looking for `.sln`, `.csproj`, `Controllers/`, `Program.cs`, `Startup.cs`, `appsettings*.json`, `Validators/`, `Dtos/`, `DTOs/`, `Services/`, and `Entities/`.
4. Detect gateway projects/configuration by looking for `ocelot.json`, `appsettings*.json` with gateway routes, `Gateway`, `ApiGateway`, `YARP`, or route configuration folders.
5. Detect PRDs by looking for `PRD`, `prd`, `requirements`, `epics`, `stories`, `business`, `analysis`, or `.md/.docx/.pdf` requirement folders.
6. Detect architecture wiki/docs by looking for `wiki`, `docs`, `architecture`, `diagrams`, `images`, `standards`, or `README` architecture references.
7. Detect existing Brain SK files/registries and scan metadata.

## Output is mandatory

TouchBase must generate a visible discovered path map at:

```text
outputs/discovery/discovered-path-map.md
outputs/discovery/discovered-path-map.json
```

Ammar must be able to open the folder and see exactly what the brain understood.

## Missing path behavior

If a required item is not found:

- Do not guess.
- Mark it as `missing` in the readiness report.
- Ask Ammar only for the missing path or missing authorization.
- Continue with available areas when possible.

## Legacy exclusion

Legacy folders are reference-only. Do not scan them as active project truth unless Ammar explicitly asks for legacy migration or comparison.

Exclude from active project discovery:

```text
legacy/
legacy-v7/
archived/
old/
backup/
generated-archive/
previous-brain/
node_modules/
dist/
bin/
obj/
.vs/
.git/
```
