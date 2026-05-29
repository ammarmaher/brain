---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis
title: API Reference - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)


  - [ThreatExchangeMember Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member)
  - [ThreatDescriptor Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor)
  - [ThreatIndicator Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator)
  - [ThreatPrivacyGroup Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group)
  - [ThreatTag Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags)
  - [ImpactReport Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-impact-report)
  - [CaseTag Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/case-tag)
  - [ConfidenceType](https://developers.facebook.com/docs/threat-exchange/reference/apis/confidence-type)
  - [IndicatorType](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type)
  - [PrecisionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/precision-type)
  - [PrivacyType](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type)
  - [ReactionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type)
  - [ReviewStatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type)
  - [SeverityType](https://developers.facebook.com/docs/threat-exchange/reference/apis/severity-type)
  - [SignatureType](https://developers.facebook.com/docs/threat-exchange/reference/apis/signature-type)
  - [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type)
  - [StatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type)
  - [/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates)
  - [/threat\_tags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags)
  - [/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators)
  - [/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors)
  - [/threat\_exchange\_members](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-members)
  - [/threat\_privacy\_groups](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-groups)
  - [/<app-id>/threat\_privacy\_groups\_owner](https://developers.facebook.com/docs/threat-exchange/reference/apis/app-id-threat-privacy-groups-owner)
  - [/<app-id>/threat\_privacy\_groups\_member](https://developers.facebook.com/docs/threat-exchange/reference/apis/app-id-threat-privacy-groups-member)

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

[ThreatExchange API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis#threatexchange-api-reference)

[Objects](https://developers.facebook.com/docs/threat-exchange/reference/apis#objects)

[Types](https://developers.facebook.com/docs/threat-exchange/reference/apis#types)

[Search Endpoints](https://developers.facebook.com/docs/threat-exchange/reference/apis#search-endpoints)

[Miscellaneous Endpoints](https://developers.facebook.com/docs/threat-exchange/reference/apis#misc-endpoints)

# ThreatExchange API Reference

The comprehensive list of the ThreatExchange APIs and the related endpoints.

## Objects

| Parameter | Description |
| --- | --- |
| [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) | Subjective context provided by a [ThreatExchangeMember](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) for a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator). |
| [ThreatExchangeMember](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) | Participant within ThreatExchange. |
| [ThreatExchangeImpactReport](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-impact-report) | Freeform record of outcomes as a result of participating in ThreatExchange. |
| [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) | Indicator of compromise. |
| [ThreatPrivacyGroup](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group) | A mutable list of members to share data to. Can be promoted to a "Program" which provides additional API and UI features. |
| [ThreatPrivacyGroup CaseTag](https://developers.facebook.com/docs/threat-exchange/reference/apis/case-tag) | A special type of [ThreatTags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags) to denote a related set of objects that should be reviewed together in a Program. |
| [ThreatTags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags) | Label to group threat objects together. |

## Types

| Parameter | Description |
| --- | --- |
| [IndicatorType](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type) | Type of indicator being described by a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) object. |
| [PrecisionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/precision-type) | Defines how accurately the threat intelligence detects its intended target, victim or actor. |
| [PrivacyType](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type) | Defines who can access the threat intelligence. |
| [ReviewStatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type) | Description of how the threat intelligence was vetted. |
| [SeverityType](https://developers.facebook.com/docs/threat-exchange/reference/apis/severity-type) | Description of the threat dangerousness associated with a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) object. The order of the values below are ordered from least severe to most severe. |
| [SignatureType](https://developers.facebook.com/docs/threat-exchange/reference/apis/signature-type) | Type of signature format described by a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) object. |
| [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type) (aka Traffic Light Protocol or TLP) | Designation of how any object in ThreatExchange may be re-shared both within and outside of ThreatExchange, based on the [US-CERT's Traffic Light Protocol](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.us-cert.gov%2Ftlp%2F&h=AUA7JSOdnEIe4U9qZ65Y9G7XR2gtrLf7T2c5FboUKxIr9kIkLCQolWF8chmcAYQc8rp6d6EKfftv6xKe5EjM3Q9iZT-FfQSaizfscXeyGWrc65_JbnNxB5zJ0ByBk946WVCa5bWR_VrkEQ). |
| [StatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type) | Description of the maliciousness of any object within ThreatExchange. |

## Search Endpoints

| Parameter | Description |
| --- | --- |
| [/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v9.0) | Prefered way of downloading all the data for a collaboration and staying in sync with updates. Not enabled for all privacy groups. See page for details. |
| [/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors) | Enables searching for descriptors (opinions on content or indicators). |
| [/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators) | Enables searching for indicators. |
| [/threat\_tags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags) | Enables searching for threat tags. |

## Miscellaneous Endpoints

| Parameter | Description |
| --- | --- |
| [/threat\_exchange\_members](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-members) | Returns a list of current members of the ThreatExchange. |

On This Page

[ThreatExchange API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis#threatexchange-api-reference)

[Objects](https://developers.facebook.com/docs/threat-exchange/reference/apis#objects)

[Types](https://developers.facebook.com/docs/threat-exchange/reference/apis#types)

[Search Endpoints](https://developers.facebook.com/docs/threat-exchange/reference/apis#search-endpoints)

[Miscellaneous Endpoints](https://developers.facebook.com/docs/threat-exchange/reference/apis#misc-endpoints)