---
url: https://developers.facebook.com/docs/threat-exchange/api-structure
title: API Structure - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Fapi-structure%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)
- [Privacy Controls](https://developers.facebook.com/docs/threat-exchange/reference/privacy)
- [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting)
- [Editing Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/editing)
- [Delete Data](https://developers.facebook.com/docs/threat-exchange/reference/deleting)
- [Reshare Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing)
- [React to Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting)
- [Submit Connections](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections)
- [Vendors](https://developers.facebook.com/docs/threat-exchange/reference/vendors)
- [FAQ](https://developers.facebook.com/docs/threat-exchange/FAQ)
- [Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog)

On This Page

[API Structure for ThreatExchange](https://developers.facebook.com/docs/threat-exchange/api-structure#structure)

# API Structure for ThreatExchange

ThreatExchange is a subset of API endpoints within the larger ecosystem of Facebook Graph APIs. It is recommended to review the [Graph API documentation](https://developers.facebook.com/docs/graph-api), as it covers key concepts: usage of access tokens for authentication, result pagination, and batching.

The ThreatExchange APIs are made up of various [objects](https://developers.facebook.com/docs/threat-exchange/reference/apis) and each object can have connections to other objects. For instance, a threat indicator is an object that can be connected to other threat indicators.

ThreatExchange also allows for multiple members to share the same threat indicator. Because there is the potential for a collision, we separate each member's submission into distinct [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) objects, which are connected to their respective [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator)

## Viewing Individual Objects

You can access a Graph object’s properties with its unique ID, e.g. for a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) object:

- [/{threat\_indicator\_id}](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator)


You can do the same for all other objects type within ThreatExchange:

- [/{threat\_descriptor\_id}](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor)


## Queries For Multiple Objects

Queries into ThreatExchange are HTTP GET requests to one of the following URLs:

- [/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors)

- [/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators)

- [/threat\_exchange\_members](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-members)

- [/threat\_privacy\_groups](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-groups)

- [/{privacy\_group\_id}/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates)


**All Graph API objects work in a similar way. After you have [authenticated](https://developers.facebook.com/docs/threat-exchange/getting-started), try some calls with the [`threat_indicator`](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) object.**

To ensure consistency, the ThreatExchange APIs and its consumers use JSON objects as their default currency. Using these APIs gives you a lot of things for free:

- Field validation

- Type checking

- Persistence to Facebook's Graph

- Everyone else can use what you share and be better protected!


All objects are formatted as maps using a predefined set of field names, with expected value types. They can be of arbitrary size and field order in the map is, generally, not important.

On This Page

[API Structure for ThreatExchange](https://developers.facebook.com/docs/threat-exchange/api-structure#structure)