---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator
title: ThreatIndicator Object - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-indicator%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#threatindicator)

[Fields](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#fields)

[Sample Usage](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#sample-usage)

[Connections](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#connections)

[Sample Usage](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#sampleusage)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#)

# ThreatIndicator

ThreatExchange's data model is "things" and "opinions about things". `ThreatIndicator` is a "thing" in this model, such as a file hash, a text keyword, or an email address. ThreatExchange creates `ThreatIndicator` objects automatically to group multiple opinions from different Members about the same thing. As a user of ThreatExchange, you only need to manage your opinions (primarily [`ThreatDescriptor`](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/docs/threat-exchange/reference/apis/threat-descriptor)).

The name indicator is short for "indicator of compromise", which is a reflection of ThreatExchange's original use for cybersecurity purposes. Over time ThreatExchnage tended more towards safety and content harm sharing, where this name has made less sense.

## Fields

| Parameter | Description | Type |
| --- | --- | --- |
| `id` | Unique identifier of the threat indicator. Automatically assigned at create time, and non-editable. | `number` |
| `indicator` | The value of the indicator. Non-editable after initial creation of the indicator. | `string` |
| `type` | The type of indicator. Non-editable after initial creation of the indicator. | List of [`IndicatorType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type) |

### Sample Usage

Example query for a specific indicator: 788497497903212:

```code
https://graph.facebook.com/v25.0/788497497903212/?access_token=555|aSdF123GhK
```

Data returned:

```code
{
   "indicator": "facebook.com",
   "type": "DOMAIN",
   "id": "788497497903212"
}
```

## Connections

| Name | Description | Type |
| --- | --- | --- |
| `descriptors` | Opinions from members about this indicator. | [`ThreatDescriptor`](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) |

### Sample Usage

Example query for descriptors related to a specific indicator: 852121234856016

```code
https://graph.facebook.com/v25.0/852121234856016/descriptors/?access_token=555|aSdF123GhK
```

Data returned:

```code
 {
   "data": [\
  {\
    "id": "811927545529339",\
    "indicator": {\
      "indicator": "test1434227164.evilevillabs.com",\
      "type": "DOMAIN",\
      "id": "852121234856016"\
    },\
    "owner": {\
      "id": "588498724619612",\
      "name": "Facebook CERT ThreatExchange"\
    },\
    "type": "DOMAIN",\
    "raw_indicator": "test1434227164.evilevillabs.com",\
    "description": "This is our test domain. It's harmless",\
    "status": "NON_MALICIOUS"\
  },\
  {\
    "id": "799906626794304",\
    "indicator": {\
      "indicator": "test1434227164.evilevillabs.com",\
      "type": "DOMAIN",\
      "id": "852121234856016"\
    },\
    "owner": {\
      "id": "682796275165036",\
      "name": "Facebook Site Integrity ThreatExchange"\
    },\
    "type": "DOMAIN",\
    "raw_indicator": "test1434227164.evilevillabs.com",\
    "description": "Malware command and control",\
    "status": "MALICIOUS"\
  }\
],
"paging": {
  "cursors": {
    "before": "ODExOTI3NTQ1NTI5MzM5",
    "after": "Nzk5OTA2NjI2Nzk0MzA0"
  }
}
```

On This Page

[ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#threatindicator)

[Fields](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#fields)

[Sample Usage](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#sample-usage)

[Connections](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#connections)

[Sample Usage](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/v25.0#sampleusage)

Allow the use of cookies by Facebook on this browser?

We use cookies and similar technologies to help provide and improve content on [Meta Products](https://www.facebook.com/help/1561485474074139). We also use them to provide a safer experience by using information we receive from cookies on and off Facebook, and to provide and improve Meta Products for people who have an account.

- Essential cookies: These cookies are required to use Meta Products and are necessary for our sites to work as intended.
- Cookies from other companies: We use these cookies to show you ads off of Meta Products and to provide features like maps and videos on Meta Products. These cookies are optional.

You have control over the optional cookies we use. Learn more about cookies and how we use them, and review or change your choices at any time in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

* * *

## About cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_1.png)

What are cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_2.png)

Why do we use cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_3.png)

What are Meta Products?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_4.png)

Your cookie choices

Learn more

* * *

## Cookies from other companies

We use cookies from [other companies](https://www.facebook.com/privacy/policies/cookies/?annotations[0]=explanation%2F3_companies_list) in order to show you ads off of our Products, and provide features like maps, payment services and video.

How we use these cookies

We use cookies from other companies on our Products:

- To show you ads about our Products and features on other companies’ apps and websites.
- To provide features on our Products such as maps, payment services and video.
- For analytics.

If you allow these cookies

- Features you use on Meta Products will not be affected.
- We'll be able to better personalize ads for you off of Meta Products, and measure their performance.
- Other companies will receive information about you by using their cookies.

If you don't allow these cookies

- Some features on our products may not work.
- We won't use cookies from other companies to personalize ads for you off of Meta products, or measure their performance.

## Other ways you can control your information

Manage your ad experience in Accounts Center

You can manage your ad experience by visiting the following settings.

Ad preferences

In your ad preferences you can choose whether we show you ads and make choices about the information used to show you ads.

Ad settings

If we show you ads, we use data that advertisers and other partners provide us about your activity off Meta Company Products, including websites and apps, to show you better ads. You can control whether we use this data to show you ads in your [ad settings](https://www.facebook.com/settings/ads/).

More information about online advertising

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAXCkL8hXDM2rVVt7QoJncC2tpZpnpuYi3bK34ouxRvy3DmOFO_ZRRuyYgAcge_4AFBzyCN-cEzU4T-eCRHlT0Ic3f6tmJVAp8EcMsWTUTNVozd9XdnFL-i7igJRGyp6vvYrXyqeSFJFQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDI1hrsf9iQZEYurA7dkb1scduROdJQ8D9p8pv_JJB901KH3bWupyoCB6PZOPss-XLXi_ySLULIE5UiaO9QHGJFgUc99OiEOI26ro5LbUiLoMoJpYpcmOmhnImhZuwcUuAD60p8U3lKCQ) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAFvcWbSe_YPEo9ij1T3j7DD04zJ7kA2kh5ZgRGU09cJV4qIp3_mBwKg1hLRr2347nqCloIWJoqPyCFWjgrIbfrvr6H23Y0Uu0a3wFJINKtrVbvtCACibP5EOzZ2Bm3rOs8dx1mq8XQ0w) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUA46-4TzB_hG3wDwyP05WAmSOaG-SYuYcog99I3UHNgc5WApGzduCQRQAkYLgQiIhzJVuiqt8hia1YEbP_UinVzAiJ_2XL7R6mV_n8FD6KV6dOVSKZaYefyvIAp0mYX1-YHw0z-dg6ecA)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUA5Emuv8EVlqCKXwWwxFuapGfFpUsRu7tP9_tva218Dlqp3M8gr2-9jFN3FKUzoE5iAFv8Ih360r8sb4txlHo80kHz7S-fcETZqcFwix2CoJ3wmWV9vlJD2M-IpYU4hwbLsa05F2k8fyQ)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDAbB2dcjkxuU9kDvaRBlyhVAPnoIqvo6DcVS252v6G2_-EZ5HU1qzQ5vKcACqVHtO8rNAp1H4vw4k3XL1C5WK_eEmHISo27urmbs0gwv7ED9BuvMdqMUxGLPzUSYmI8c2T2fI5v5QCbQ)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBXeGc9Z_V91h3ZoSnKJlAtV-DXVUh3ZPvVmC4ICu_85K5KdFiqKyDs6Dx_KKzGljOUQrJOVdaJz4wpaqRJmgv5xx0yQYPvMC7Iu_RJMijkSjZ03c4-s4KA2ij8KRGTxro6w8eZU76Yvg)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBtbivQfLPAsDGw2v9a3txKf58KsImntNmoF-ut8Lw2-dKpo4YK5vANB-x8cI6W17fCRQI4_uuskKqUaS_GVzZlLFUXDih9PmYY9KPFopyuquuxKHmtD8sIL6FTWOzB5h_Hf6_zaiOZ5A)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUD2mEaAXA2L8p7DfCsSFpAdiako9f_Fsyj-m8_z7NqFWlaY9H_AygkgjhblG_8hYKAidATBK1ydx5r6pAZO6NSLDWW4cHZkF3bPH-EhrwkpcvcJFahIBH-Gcqjb-k7tk7Bw30Vwsx26Gg)

Decline optional cookiesAllow all cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_1.png)

## What are cookies?

Cookies are small pieces of text that are used to store and receive identifiers on a web browser. We use cookies and similar technologies to offer Meta Products and understand information we receive about users, like their activity on other websites and apps.

If you don't have an account, we don't use cookies to personalize ads for you, and activity we receive will be used only for the security and integrity of our Products.

Learn more about cookies and the similar technologies we use in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_2.png)

## Why do we use cookies?

Cookies help us provide, protect and improve the Meta Products, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.

While the cookies that we use may change from time to time as we improve and update the Meta Products, we use them for the following purposes:

- Authentication to keep users logged in
- To ensure security, site and product integrity
- To provide advertising, recommendations, insights and measurement, if we show you ads
- To provide site features and services
- To understand our Products' performance
- To enable analytics and research
- On third-party websites and apps to help companies that incorporate Meta technologies to share information with us about activity on their apps and websites.

Learn more about cookies and how we use them in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_3.png)

## What are Meta Products?

Meta Products include the Facebook, Instagram and Messenger apps, and any other features, apps, technologies, software or services offered by Meta under our Privacy Policy.

You can learn more about [Meta Products in our Privacy Policy](https://www.facebook.com/privacy/policy/?annotations[0]=0.ex.0-WhatProductsDoesThis&entry_point=cookie_consent_modal_what_are_meta_products).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_4.png)

## Your cookie choices

You have control over optional cookies we use:

- Our cookies on other apps and websites owned by companies that use Meta technologies, such as the Like button and Meta Pixel, can be used to personalize your ads, if we show you ads.
- We use cookies from other companies to show you ads off of Meta Products, and to provide features like maps and video on Meta Products.

You can review or change your choices at any time in your Cookies settings.