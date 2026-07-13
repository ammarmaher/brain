---
name: project_templates_svc_local_docker_deploy_2026_06_30
description: "How falcon-core-templates-svc (IVR/Voice branch) was added to the local Docker stack: compose override service, port 7264, Swagger URL, config keys."
metadata: 
  node_type: memory
  type: project
  originSessionId: 54cbcf44-dc1e-4d99-83ed-ff4f00764427
---

User (2026-06-30) asked to land `falcon-core-templates-svc` on branch **`feat/ivr-templete`** (exact spelling, with typo), take latest, deploy in Docker, and get a Swagger URL. The other 9 backends stay on `main`.

**Branch:** `feat/ivr-templete` @ `21ced39` (latest, 0/0 vs origin). Adds a large **IVR / Voice Template** feature on top of WhatsApp templates (Voice Records Library w/ S3 audio, Voice Templates CRUD/approve/reject/share, channel-neutral vs WhatsApp endpoint route groups, ManagedAudioProbe — pure-C# WAV/MP3 header parse, NO ffprobe/native binary). 196 files, +9199/−230. Service is CQRS/DDD + FastEndpoints, 5 projects (Api/Application/Contracts/Domain/Infrastructure).

**Deploy: it was NOT in compose** (gateways' YARP `templates-cluster` pointed at `http://templates:8080` with no container → templates routes 502'd). Added a `templates` service to **`C:\Falcon\Falcon\Falcon\docker-compose.override.yml`** (local-dev overlay, not the base compose), modeled on `contact-group`. Same bind-mount `dotnet run` model. Brought up with `docker compose -p falcon up -d --no-deps templates`.
- **Host port 7264 → container 8080.** Internal service name `templates` (matches the gateways' cluster destination).
- Config ALL via env (the repo's `appsettings.Development.json` is empty): `Zitadel__Domain=http://zitadel:8080`, `AuthorityDomain=http://localhost:8080`, `BackchannelDomain=http://zitadel:8080`, `ValidateAudience=false`, `ProjectId=373183195752955914` (current seed); `MongoDb__ConnectionString=mongodb://root:example@mongo:27017/?replicaSet=rs0&authSource=admin`, `MongoDb__DatabaseName=FalconTemplateDb`; `Kafka__BootstrapServers__0=kafka:29092`, `Kafka__SchemaRegistryUrl=http://schema-registry:8081`; `ServicesClients__Identity__BaseUrl=http://identity:7777`; S3/MinIO `S3__ServiceUrl=http://minio:9000` + minioadmin + `S3__BucketName=falcon-templates-dev` + `ForcePathStyle=true`; Cors localhost:4200/4301.
- **S3 bucket self-provisions at boot** via `S3BucketBootstrapHostedService.EnsureBucketExistsAsync` (HeadBucket-miss stack trace in logs is EXPECTED, ends "Created S3 bucket: falcon-templates-dev"). `VoiceRecordIndexInitializer` ensures 7 Mongo index models.

**VERIFIED RUNNING:** container `running`; `:7264/health/ready`→200, `/health/live`→200, `/swagger`→301→`/swagger/index.html`→200, `/openapi/v1.json`→200 (title "Falcon.Templates.Api | v1", 42 paths). **Swagger UI: http://localhost:7264/swagger** (FastEndpoints uses route prefix `api`; Swashbuckle UseSwaggerUI Dev-only, doc at `/openapi/v1.json`). Secured endpoints need a Falcon JWT (login via identity :7777). The compose override change is LOCAL/uncommitted. See [[project_backend_flip_to_main_deploy_2026_06_30]] for the deploy model + the other 9 backends on main.
