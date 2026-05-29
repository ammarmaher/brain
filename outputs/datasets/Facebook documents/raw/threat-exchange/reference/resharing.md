---
url: https://developers.facebook.com/docs/threat-exchange/reference/resharing
title: Reshare Controls - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fresharing%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[ThreatExchange Resharing Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing#threatexchange-resharing-controls)

[Resharing Options via share\_level](https://developers.facebook.com/docs/threat-exchange/reference/resharing#share-level-field)

[Set Resharing (Examples)](https://developers.facebook.com/docs/threat-exchange/reference/resharing#resharing-examples)

# ThreatExchange Resharing Controls

All submissions to the ThreatExchange API allow for defining how the data can be reshared by its recipients. The level of resharing is applied via the `share_level` attribute.

You can specify the desired reshare setting on an object at the time of a create or edit submission to the API. While you can retroactively change resharing settings, those changes are not pushed as updates to members who have already accessed the data.

## Resharing Options via `share_level`

The resharing definitions adopted by ThreatExchange are derived from those definied in the [US-CERT's Traffic Light Protocol](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.us-cert.gov%2Ftlp&h=AUBw_A5i1Het_fGNREKnMQ8P0SCP_ZqJIUux8ukDQog0kxtEcwl2uGOBzFT47dhFBbuWm9kl7wK6brBdRmRgw89Xpp4EHQazRGDo5eR-zUsSsjsGDTmVY6Sz9tKp_kaqbZKoDP1bn4lYrQ). They have been adapted to accomodate the realities of re-sharing within large corporations with complex subsidiary relationships.

The exact definitions of the permitted values in the `share_level` attribute are defined in the [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type/).

## Set Resharing (Examples)

The following examples are submissions of a new malicious domain to ThreatExchange. In each example, we define which resharing level is permitted.

#### Specify Resharing Using the UI

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=527112358022967&version=1747747262)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=546698312732416&version=1747747262)

On This Page

[ThreatExchange Resharing Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing#threatexchange-resharing-controls)

[Resharing Options via share\_level](https://developers.facebook.com/docs/threat-exchange/reference/resharing#share-level-field)

[Set Resharing (Examples)](https://developers.facebook.com/docs/threat-exchange/reference/resharing#resharing-examples)