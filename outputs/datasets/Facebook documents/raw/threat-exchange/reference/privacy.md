---
url: https://developers.facebook.com/docs/threat-exchange/reference/privacy
title: Privacy Controls - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fprivacy%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

# ThreatExchange Privacy Controls

All submissions to the ThreatExchange API allow for limiting the visibility of any [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) objects. Currently, ThreatExchange supports several levels of visibility:

- allow all members;

- allow a [ThreatPrivacyGroup](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group/); and

- allow an allowlist of specific members.


The desired privacy setting on an object is specified by the values at the time of a create or edit submission to the API. Privacy settings can also be changed retroactively for data you've already submitted.

Privacy settings are propagated as follows: Threat Exchange members can see an indicator if and only if they can see at least one associated descriptor.

## Privacy Fields

There are two fields that combine to define the privacy on an object within ThreatExchange: `privacy_type` and `privacy_members`.

The `privacy_type` field can have one of the following values:

| Name | Description |
| --- | --- |
| `HAS_PRIVACY_GROUP` | The privacy group IDs specified in `privacy_members` can see the object, while the rest of the member community cannot. |
| `HAS_WHITELIST` | The App IDs specified in `privacy_members` can see the object, while the rest of the member community cannot. |
| `HAS_PRIVACY_GROUP_AND_WHITELIST` | A union of `HAS_PRIVACY_GROUP` and `HAS_WHITELIST`. The ids in `privacy_members` can be either app ids or privacy group ids. |
| `VISIBLE` | All members of ThreatExchange can see the object. _This is the default, if no value is specified._ |

The `privacy_members` field is a comma-delimited list of App IDs of [ThreatExchangeMembers](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) or [ThreatPrivacyGroups](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group/) that are either given or not given access to the data, based on the value in `privacy_type`.

## Setting Privacy: Examples

The following is an examples are submissions of a new malicious domain to ThreatExchange. In each example, we define which members of ThreatExchange are allowed to see the data.

### Controlling visibility using the UI

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=894706244256258&version=1673359981)

### Allowing all members access using the API

```code
POST https://graph.facebook.com/v4.0/threat_descriptors?access_token=555|aSdF123GhK

indicator=evil-domain.biz
&amp;type=DOMAIN
&amp;threat_type=MALICIOUS_DOMAIN
&amp;status=MALICIOUS
&amp;description=This%20domain%20was%20hosting%20malware
&amp;privacy_type=VISIBLE
```

### Limiting privacy to a privacy group using the API

```code
POST https://graph.facebook.com/v4.0/threat_descriptors?access_token=555|aSdF123GhK

indicator=evil-domain.biz
&amp;type=DOMAIN
&amp;threat_type=MALICIOUS_DOMAIN
&amp;status=MALICIOUS
&amp;description=This%20domain%20was%20hosting%20malware
&amp;privacy_type=HAS_PRIVACY_GROUP
&amp;privacy_members=123456789
```

### Limiting privacy To select members using the API

```code
POST https://graph.facebook.com/v4.0/threat_descriptors?access_token=555|aSdF123GhK

indicator=evil-domain.biz
&amp;type=DOMAIN
&amp;threat_type=MALICIOUS_DOMAIN
&amp;status=MALICIOUS
&amp;description=This%20domain%20was%20hosting%20malware
&amp;privacy_type=HAS_WHITELIST
&amp;privacy_members=123456789,9012345678
```

### Limiting privacy to only your app using the API

```code
POST https://graph.facebook.com/v4.0/threat_descriptors?access_token=555|aSdF123GhK

indicator=evil-domain.biz
&amp;type=DOMAIN
&amp;threat_type=MALICIOUS_DOMAIN
&amp;status=MALICIOUS
&amp;description=This%20domain%20was%20hosting%20malware
&amp;privacy_type=HAS_WHITELIST
&amp;privacy_members=555
```