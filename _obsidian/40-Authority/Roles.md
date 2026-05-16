---
type: moc
cluster: 40-Authority
title: Roles — 6 canonical roles (3 Falcon · 3 Client)
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\
code-source: Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs
verified-at: 2026-05-16
purpose: "Answers 'who are the 6 canonical roles + their En/Ar names + unique powers + namespace + console mount'. Open at session start to ground on role taxonomy."
---

> [!tldr]
> Six canonical roles seeded by `BuiltInRoleCatalog.cs`. Three Falcon staff (System namespace, admin-console) and three Client tenant (Account namespace, management-console). The role-edit matrix decides who can promote/demote whom.

# Roles

## Falcon staff (System namespace, `app.admin-console`)

| Role | En | Ar | Persona | Unique powers |
|---|---|---|---|---|
| `sys-admin` | System Administrator | مدير النظام | Top platform admin | Root password security · root allowed-IPs · cross-family role edit |
| `sys-ops` | System Operation | إدارة العمليات التقنية | Technical ops | Account-level allowed-IPs only — no account creation, no service/wallet |
| `sys-products` | Products | المشتريات | Commercial admin | Full services + wallet-strategy + master-wallet + wallet-transfer |

## Client tenant (Account namespace, `app.management-console`)

| Role | En | Ar | Persona | Unique powers |
|---|---|---|---|---|
| `acc-owner` | Account Owner | مالك الحساب | Tenant root admin | Add account-user · view+edit account-profile/password/IPs/quota · view contract · services payment/disable |
| `acc-admin` | Node Admin | مشرف الإدارة | Node-level CRUD | Add org-user · view org-settings/account-settings/users — but services/profile-edit/password/IPs/quota all deny |
| `acc-user` | Normal User | مستخدم | Contact-groups-only | Unique `acc.contact-group / view-shared` permission |

## Role-edit matrix

| Actor → Target current role | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|---|
| `sys-admin` | any sys-* | any sys-* | any sys-* | any acc-* | any acc-* | any acc-* |
| `sys-ops` | — | sys-ops only | — | any acc-* | any acc-* | any acc-* |
| `sys-products` | — | — | sys-products only | any acc-* | any acc-* | any acc-* |
| `acc-owner` | — | — | — | any acc-* | any acc-* | any acc-* |
| `acc-admin` | — | — | — | — | acc-admin/user | acc-admin/user |
| `acc-user` | — | — | — | — | — | — |

## Test users

| Username | Role | Email |
|---|---|---|
| `sysadmin` | sys-admin | sysadmin@falcon.local |
| `sysops` | sys-ops | sysops@falcon.local |
| `sysprod` | sys-products | sysprod@falcon.local |
| `accowner` | acc-owner | accowner@falcon.local |
| `accadmin` | acc-admin | accadmin@falcon.local |
| `accuser` | acc-user | accuser@falcon.local |

Password (every user): `Admin@1234`. Tenant for acc-*: `test-tenant-001`.

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\sys-admin.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\sys-ops.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\sys-products.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\acc-owner.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\acc-admin.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\acc-user.md`

## See also

- [[Falcon-vs-Client]] — which roles can see which features
- [[PES-Keys]] — registry the roles are checked against
- [[Test-Users]] — login curl + JWT decoding
