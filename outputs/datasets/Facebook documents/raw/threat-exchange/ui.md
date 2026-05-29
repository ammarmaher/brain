---
url: https://developers.facebook.com/docs/threat-exchange/ui
title: UI Overview - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Fui%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[ThreatExchange UI Overview](https://developers.facebook.com/docs/threat-exchange/ui#threatexchange-ui-overview)

[ThreatExchange UI Use Cases](https://developers.facebook.com/docs/threat-exchange/ui#use-cases)

[Find the UI](https://developers.facebook.com/docs/threat-exchange/ui#where)

[Search or Upload data using the UI](https://developers.facebook.com/docs/threat-exchange/ui#search-data-ui)

[Publish Data Using the UI](https://developers.facebook.com/docs/threat-exchange/ui#publish-data-ui)

[Feedback](https://developers.facebook.com/docs/threat-exchange/ui#feedback)

# ThreatExchange UI Overview

This guide describes what you can do with the ThreatExchange UI. See the [ThreatExchange API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis) for a comprehensive list of the ThreatExchange APIs and the related endpoints.

## ThreatExchange UI Use Cases

- People at various organizations want to share information about **threats**: malicious URLs, harmful content hashes, malware signatures, and so on.

- A [**threat indicator**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) is the **objective part**: a file hash, a URL, and so on, with a type (MD5, SHA1, URL, and so on).

- A [**threat descriptor**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) contains an indicator and the **subjective parts**: how malicious a team thinks it is, when they first saw it, and so on.

- Meta privacy revolves around **user IDs,** ThreatExchange revolves around **app IDs**. For example, app ID 1064060413755420 is Media Hash Sharing Test. These are generally of the form _Team T at company C_.

- When people share threat data, they can specify who they want to see each datum. This is referred to as a **visibility** or **privacy type**.



  - _Visible/public_ means all ThreatExchange members can see it.

  - Or, for each datum the members can create an app-whitelist of specific teams at specific companies.

  - Or, for each datum the members can specify a privacy-group that is simply a predefined list of app IDs.


- People can [**tag**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags) their descriptors. These are tags in any other tool, except that ThreatExchange tags have their own metadata, including the subjective parts that descriptors have, and they also have their own visiblity (public/app-whitelist/privacy-group).

- There's more about threat descriptors ( [review status](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type) and [others](https://developers.facebook.com/docs/threat-exchange/reference/apis) in the API) and other types of data shareable on ThreatExchange. For the purpose of this walkthrough, we're focused on indicators, descriptors, visibility, and tags.


## Find the UI

Navigate to [https://developers.facebook.com/threat-exchange](https://developers.facebook.com/threat-exchange).

## Search or Upload data using the UI

Navigate to the Signals tab (previously known as Descriptors tab)

Each upload is individually shown by owner, which can contain duplicate signals. Search behavior changes slightly when searching aggregate or individual uploads. The aggreggated view when toggled, aggregates opinions by signal.

**Individual signals view**

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1259330989694264&version=1770844753)

**Aggregated signals view**

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1828542661164744&version=1770844818)

**Select the visible columns for the table**

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=868373966193259&version=1770844916)

**Upload new signals**

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1370049841469247&version=1770844925)

## Publish Data Using the UI

See the [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting) page for examples.

## Feedback

Contact **threatexchange@meta.com** with any and all feedback on how we can better enable your success in using ThreatExchange.

Learn more about the [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui).

On This Page

[ThreatExchange UI Overview](https://developers.facebook.com/docs/threat-exchange/ui#threatexchange-ui-overview)

[ThreatExchange UI Use Cases](https://developers.facebook.com/docs/threat-exchange/ui#use-cases)

[Find the UI](https://developers.facebook.com/docs/threat-exchange/ui#where)

[Search or Upload data using the UI](https://developers.facebook.com/docs/threat-exchange/ui#search-data-ui)

[Publish Data Using the UI](https://developers.facebook.com/docs/threat-exchange/ui#publish-data-ui)

[Feedback](https://developers.facebook.com/docs/threat-exchange/ui#feedback)