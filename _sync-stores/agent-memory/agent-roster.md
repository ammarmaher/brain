---
name: Agent Roster
description: Complete list of all Falcon Platform agents, their roles, subagent types, and project paths
type: reference
---

# Falcon Platform Agent Roster

## Orchestrator
| Agent | Subagent Type | Role |
|-------|---------------|------|
| **Adnan** | `adnan` | Master orchestrator — routes tasks, coordinates cross-project work |

## Specialist Agents (Ammar)
| Agent | Subagent Type | Project Path | Port |
|-------|---------------|-------------|------|
| **Ammar Core-Commerce** | `ammar-core-commerce` | `C:\falcon\falcon-core-commerce-svc` | 7045 |
| **Ammar Core-Charging** | `ammar-core-charging` | `C:\falcon\falcon-core-charging-svc` | 7224 |
| **Ammar Core-Provisioning** | `ammar-core-provisioning` | `C:\falcon\falcon-core-provisioning-svc` | 7163 |
| **Ammar Auth** | `ammar-auth` | `C:\falcon\falcon-core-identity-svc` | 8080 |
| **Ammar Core-Gateway** | `ammar-core-gateway` | `C:\falcon\falcon-int-core-gateway-svc` | 7038 |
| **Ammar System-Gateway** | `ammar-system-gateway` | `C:\falcon\falcon-int-system-gateway-svc` | 7256 |
| **Ammar Web-Platform-UI** | `ammar-web-platform-ui` | `C:\falcon\falcon-web-platform-ui` | 4200 |
| **Ammar Essentials** | `ammar-essentials` | `C:\falcon\falcon-essentials` | - |

## How to Invoke
```
Agent tool → subagent_type: "ammar-core-commerce"  (or any from table above)
```

## Agent Definitions
- Skills: `C:\Users\Pc5\.claude\skills\{agent-name}\SKILL.md`
- Full Agent: `C:\Users\Pc5\.claude\agents\{agent-name}\{agent-name}.md`
