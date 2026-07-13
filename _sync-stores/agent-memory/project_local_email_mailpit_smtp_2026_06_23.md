---
name: project_local_email_mailpit_smtp_2026_06_23
description: Local Docker had NO SMTP (emails silently failed); added Mailpit catcher at localhost:8025 wired via compose override
metadata: 
  node_type: memory
  type: project
  originSessionId: 5d0d55be-f398-4198-8137-923ea09f1b9d
---

**Symptom:** "I create a user but never receive the credentials email" + sometimes a "downstream" error. NOT a code/branch bug.

**Root cause:** identity `appsettings.json:86-93` ships `Smtp.Host=""` + `FromAddress=""`, and there were NO `Smtp__*` env overrides in the container. `SmtpEmailSender.SendAsync` (`Infrastructure/Communications/SmtpEmailSender.cs:32`) calls `ConnectAsync(host="")` → MailKit throws in `ValidateArguments` → handler is **fire-and-forget** (`:44-47` logs warning, never throws) → user-create "succeeds" with no email. Logs showed `WRN SmtpEmailSender Email send failed for <addr>`. SMS = `NoOpSmsSender` (`Sms.Enabled=false`, only logs "would send"). The local stack also had **no mail container**. Credentials email is sent at user **creation** (`CreateUserProcess.cs:131` → `UserCredentialsGeneratedDomainEvent` → `UserCredentialsNotificationHandler`), DeliveryMethod Email/Sms/Both. Flows that AWAIT the send (OTP/verification/resend) surface the empty-host failure as the "downstream" error.

**Fix (user chose: local mail catcher):** added **Mailpit** to the LOCAL compose override + pointed identity SMTP at it. Edited `C:\Falcon\Falcon\Falcon\docker-compose.override.yml` (the REAL compose dir per `docker inspect` labels — note triple-nested `Falcon\Falcon\Falcon\`; project=`falcon`, network=`falcon_default` default, identity service runs `dotnet run` source-mounted `C:\Falcon\Falcon`→/workspace):
- `identity.environment`: `Smtp__Host=mailpit`, `Smtp__Port="1025"`, `Smtp__EnableSsl="false"`, `Smtp__FromAddress=no-reply@falcon.local`.
- new `mailpit` service: image **`ghcr.io/axllent/mailpit:latest`** (Docker Hub `axllent/mailpit:latest` layer sha `cdb09a32…` consistently FAILS to pull here with cloudfront EOF — ghcr works, same as zitadel), `ports: 8025:8025`.
- Applied: `docker compose -p falcon -f docker-compose.yml -f docker-compose.override.yml up -d mailpit identity` (recreated identity → recompiled).

**Verified:** mailpit healthy; identity runtime env has the 4 Smtp vars; `identity → mailpit:1025` TCP CONNECT_OK; test email via `curl smtp://mailpit:1025` from the identity container → Mailpit captured it (`total:1`), then cleared. **Web UI to read all outgoing email: http://localhost:8025.** No real inbox delivery (catcher only). Env-only change; revert by deleting the mailpit service + identity `Smtp__*` lines from the override. Related [[project_first_login_email_autoverify_2026_06_23]].
