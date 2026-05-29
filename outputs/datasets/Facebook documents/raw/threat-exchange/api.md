---
url: https://developers.facebook.com/docs/threat-exchange/api
title: API Overview - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Fapi%2Fv25.0%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[ThreatExchange API Overview](https://developers.facebook.com/docs/threat-exchange/api/v25.0#overview)

[Authenticate via an Access Token](https://developers.facebook.com/docs/threat-exchange/api/v25.0#access_token)

[Searching Data Using the API](https://developers.facebook.com/docs/threat-exchange/api/v25.0#getdata)

[Publishing Data Using the API](https://developers.facebook.com/docs/threat-exchange/api/v25.0#sharedata)

[More API Examples](https://developers.facebook.com/docs/threat-exchange/api/v25.0#moreexamples)

[Python/Ruby/Java/Curl wrappers](https://developers.facebook.com/docs/threat-exchange/api/v25.0#language_bindings)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/api/v25.0#)

# ThreatExchange API Overview

## Authenticate via an Access Token

The ThreatExchange APIs perform authentication via access tokens. After Facebook notifies you that your App can access ThreatExchange, use the [access token tool](https://developers.facebook.com/tools/accesstoken) to get an **App Token**. _Please note, app tokens give access to sensitive details to your app and should be treated like a password._

With the access token, test your access to ThreatExchange by retrieving the list of members in the exchange:

```code
https://graph.facebook.com/threat_exchange_members?access_token=<access_token>
```

If this request does not return an error, you are now ready to begin exploring the ThreatExchange API!

## Searching Data Using the API

With your newly activated access token, perform a search for malicious URLs added in the last week:

```code
https://graph.facebook.com/threat_descriptors?type=URI&amp;status=MALICIOUS&amp;since=a week ago&amp;access_token=<access_token>
```

Please note that not all fields are returned by default. Consult the reference documentation and specify the fields you are looking to read by appending the fields parameter. See the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#reading) for more details.

## Publishing Data Using the API

**Test publish** a domain, `my-test-example.com`, ensuring only you are able to see the data:

```code
https://graph.facebook.com/threat_descriptors

POST DATA

type=DOMAIN
indicator=my-test-example.com
privacy_type=HAS_WHITELIST
status=UNKNOWN
description=Test data publishing
share_level=RED
privacy_members=<your_app_id>
access_token=555|1235
```

The return value will be a JSON map with a success or failure code and, if the call is successful, the unique ThreatExchange ID for the descriptor you published!

**Publish** a descriptor for your own domain, `my-company-domain.com`, and share it with Facebook's app ID, `820763734618599`:

```code
https://graph.facebook.com/threat_descriptors

POST DATA

type=DOMAIN
indicator=my-company-domain.com
privacy_type=HAS_WHITELIST
status=NON_MALICIOUS
description=The domain owned by <your_app_id>
share_level=WHITE
privacy_members=820763734618599
access_token=555|1235
```

## More API Examples

**Search** for all compromised credentials found on the Internet within the last day:


```code
https://graph.facebook.com/v25.0/threat_indicators?type=COMPROMISED_CREDENTIAL&since=yesterday&access_token=555|1235]

```

**Find** the unique ThreatExchange ID for a specific indicator, such as `facebook.com`:

```code
https://graph.facebook.com/v25.0/threat_indicators?text=facebook.com&access_token=555|1235

```

**Explore** related indicators for a specific indicator with ThreatExchange ID `898557073557972`:

```code
https://graph.facebook.com/898557073557972/descriptors?access_token=555|1235
```

**Explore** all of the descriptors for a specific indicator with ThreatExchange ID `898557073557972`:

```code
https://graph.facebook.com/898557073557972/descriptors?access_token=555|1235
```

See more examples on our [Github](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange&h=AUCJMbL1IdHA-cNh4pLQY_rGf5uCD049c3q6KoSPj1HoQKyZ4KavJ9D6rex2QVRXFHLTu34hTPqnvOqOCYD_mMh0aOspNwxkbIwxYr3ZT6O_gTfCOtFsyLraajZVwFK-Vse3jdYzi0Wo3miK-WL6-mBZ7Yk), or on the endpoint pages for [threat indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators), [threat descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors).

## Python/Ruby/Java/Curl wrappers

The above snippets showed you some examples of the bare REST API. For an easier path to integration please see [our Python wrapper](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Fblob%2Fmaster%2Fpython-threatexchange%2FREADME.md&h=AUD14aFRRqxT5eNYUaaD5MXInn4Fgvrb_4sCwDQrLRvpCxUah3C4qeVBu5HkCwLeQXI8e_lw0LtAqtcN4lOnFTLTxnAaf6gkBaiQf_wRdNNHbsUacei1dr4fn7sCHcbe1u20XtyvPPPO9w).



Please also see our descriptor-focused reference designs in [Ruby](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fruby%2Fte-tag-query%2FREADME.md&h=AUCgp3M16k77O4239inSoZ56PUPHCCbVjcsdynWMiEJyppoes1GLgNqeO1IlUVEun29xWNswrGTaxp0A6N2dvEXxPDHyPu4wGCaY4hAQD8fkYC5QyvDhizo-nTjjhgqthNEnoy3L7jx_8w), [Java](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fjava%2Fte-tag-query%2FREADME.md&h=AUByms9tBCl5MVVtVaPBmD7WQIU8fTQEhMLptHYoOx-AmmSygvj9Yhsybc6ZFFHDhFiwh50Z6io9CgTyhFJDL0sgeF_CaHKn7-YTqcAeZPQU5Zvt4WTUYSO2LDeV2hU1Gf7JrS1Dp-U3NA), and
[bare-curl](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fcurl%2Fte-tag-query%2FREADME.md&h=AUAI2UFlIYA099zOBXVIc1eBEMbdq_WZc3jpoKOPFBYL-mrRLnwENKHThHAMwmVT7otFQh6i1G-yfNOP4nlJvzh5ptDEL6Zr7JS9ZQwTJb-1pbFbQoDFwtzy5FYg-eRGhjrGZ3w5ytZ1vZTXG9dfH0nvlAE).



On This Page

[ThreatExchange API Overview](https://developers.facebook.com/docs/threat-exchange/api/v25.0#overview)

[Authenticate via an Access Token](https://developers.facebook.com/docs/threat-exchange/api/v25.0#access_token)

[Searching Data Using the API](https://developers.facebook.com/docs/threat-exchange/api/v25.0#getdata)

[Publishing Data Using the API](https://developers.facebook.com/docs/threat-exchange/api/v25.0#sharedata)

[More API Examples](https://developers.facebook.com/docs/threat-exchange/api/v25.0#moreexamples)

[Python/Ruby/Java/Curl wrappers](https://developers.facebook.com/docs/threat-exchange/api/v25.0#language_bindings)