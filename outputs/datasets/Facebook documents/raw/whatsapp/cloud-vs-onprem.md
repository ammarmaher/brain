---
url: https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem
title: Cloud vs On-Prem - WhatsApp Business Platform
status: 200
---

![](https://googleads.g.doubleclick.net/pagead/viewthroughconversion/963623955/?guid=ON&script=0)

![](https://dc.ads.linkedin.com/collect/?pid=276116&fmt=gif)

![](https://analytics.twitter.com/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://t.co/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://facebook.com/security/hsts-pixel.gif)

[Meta logo](https://developers.facebook.com/?no_redirect=true)

MoreMoreMore

DocsDocsDocs

ToolsToolsTools

SupportSupportSupport

Search input

​

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fcloud-vs-onprem%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)

- [About the Platform](https://developers.facebook.com/docs/whatsapp/overview)
- [Cloud vs On-Prem](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem)
- [Messages](https://developers.facebook.com/docs/whatsapp/conversation-types)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- [Messaging Limits](https://developers.facebook.com/docs/whatsapp/messaging-limits)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/webhooks)
- [Solution Providers](https://developers.facebook.com/docs/whatsapp/solution-providers)
- [Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [Link Previews](https://developers.facebook.com/docs/whatsapp/link-previews)
- [Policy Enforcement](https://developers.facebook.com/docs/whatsapp/overview/policy-enforcement)
- [Changelog](https://developers.facebook.com/docs/whatsapp/business-platform/changelog)
- [Support](https://developers.facebook.com/docs/whatsapp/support)

On This Page

[Cloud API vs. On-Premises API](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#cloud-api-vs--on-premises-api)

[Architecture Diagram](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#architecture-diagram)

[Feature Comparison](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#feature-comparison)

⚠️ DEPRECATED DOCUMENTATION

This documentation is deprecated and should not be updated. Please do not make changes to this page.


External developers no longer can view this documentation and are being redirected to [the new documentation portal](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview) instead.



If you need to make changes, please visit the new documentation site and request updates via our [intake form](https://www.internalfb.com/butterfly/form/864995777907991).


# Cloud API vs. On-Premises API

Cloud API is our newest API, launched in April of 2022. Cloud API is the preferred solution, as it significantly simplifies the operational and infrastructure requirements to integrate with the WhatsApp Business Platform. With Cloud API, you don't have to deploy, host, and manage API containers or the resources needed to support them.

On-Premises API is our legacy API, launched in August of 2018. You must host the On-Premises API on your own, which means you also have to deploy, host, and manage containers and any resources they may require.

## Architecture Diagram

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/399645340_1473859413404740_6349758800998779513_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=_2WOXVu2lR8Q7kNvwH5YMgz&_nc_oc=AdotRsAE6CroBuZnRfaSvyl-ytwuIffNFh1eSCeydSDdpcPR5rib09kNzFUaov4eOdU&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=LuMC844I8gXzUaqw9l-l1Q&_nc_ss=7b289&oh=00_Af7Q1lMUcwdYDaF1eXgRz0In31OvvHM2tU2rm_7wk3MZRw&oe=6A257854)

## Feature Comparison

| Feature | Cloud API | On-Premises API |
| --- | --- | --- |
| **Throughput** | Up to 1,000 messages per second. See [Throughput](https://developers.facebook.com/docs/whatsapp/cloud-api/overview#throughput). | Up to 250 messages per second. |
| **Hosting** | Hosted on Meta servers and supported by Meta data centers. | You must host on your own servers and use your own data centers. |
| **Maintenance** | All maintenance, scaling, and upgrades are performed automatically by Meta. | You must set up, maintain, update, and scale services on your own. |
| **Costs** | You only pay for conversations. See [Pricing](https://developers.facebook.com/docs/whatsapp/pricing). | You must [pay for conversations](https://developers.facebook.com/docs/whatsapp/pricing) and for any costs incurred maintaining your servers. |
| **Certificate Management** | Meta manages all certificate authorities, except for your webhook server's certificate authority, which you must manage on your own. | You must manage all certificate authorities. |
| **Single-tenant vs. Multi-tenant** | Multi-tenant. | Single-tenant (single phone number per deployment). |
| **Latency** | ~5s 99th percentile goal. See [Latency](https://developers.facebook.com/docs/whatsapp/support-api-status-page#latency). | Dependent on distance between your deployment servers and our servers. |
| **Monitoring** | Meta monitors all servers and services. | You are responsible for monitoring your servers, services, and containers. |
| **Uptime** | 99.9% uptime goal. | Depends on your ability to maintain availability of your servers, services, and containers. |
| **Support** | 7x24 for critical issues. Continuous work until the issue is resolved or mitigated. | 7x24 for critical issues on a best effort basis. |
| **Webhook notifications of WhatsApp user reactions to messages** | Supported. | Not supported, with no future plans to support. |
| **Static Stickers** | Supported. | Not supported. |
| **Animated Stickers** | Supported. | Receiving animated stickers from WhatsApp users is supported, but sending animated stickers to WhatsApp users is not. |
| **Stickerpacks** | Not supported. | Supported. |
| **Block WhatsApp user phone number** | Not supported. | Supported. |
| **Carousel messages** | Supported. | Not supported. |
| **Replies to WhatsApp user messages** | Supported. | Not supported. |
| **Delivery rate affected by TOS 2021** | Yes. | No. |

On This Page

[Cloud API vs. On-Premises API](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#cloud-api-vs--on-premises-api)

[Architecture Diagram](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#architecture-diagram)

[Feature Comparison](https://developers.facebook.com/docs/whatsapp/cloud-vs-onprem#feature-comparison)