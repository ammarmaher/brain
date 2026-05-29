---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators
title: /threat_indicators - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-indicators%2Fv25.0%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators/v25.0#threat_indicators)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators/v25.0#parameters)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators/v25.0#)

# /threat\_indicators

NOTE: Queries using this call are not guaranteed to be comprehensive and may only return partial results. See how to do bulk download in [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices).

This API call enables searching for samples of indicators of compromise stored in ThreatExchange. With this call you can search for indicators by free text, type, or all in a specific time window. Combinations of these query types are also allowed.

## Parameters

The following query parameters are available (bold parameters are required):

- **`access_token`** \- The key for authenticating to the API. It is a concatenation of &lt;your-app-id&gt;\|&lt;your-app-secret&gt;. For example, if our app ID was 555 and our app secret aSdF123GhK, our access\_token would be "555\|aSdF123GhK".

- `limit` \- Defines the maximum size of a page of results. The maximum is 1,000.

- `text` \- Freeform text field with a value to search for. This can be a file hash or a string found in other fields of the objects.

- `sort_order` \- A given [SortOrderType](https://developers.facebook.com/docs/threat-exchange/reference/apis/sort-order-type)

- `sort_by` \- Sort results by RELEVANCE or by CREATE\_TIME. When sorting by RELEVANCE, your query will return results sorted by similarity against your text query.

- `strict_text` \- When set to 'true', the API will not do approximate matching on the value in text

- `threat_type` \- The broad threat type the indicator is associated with (see [ThreatTypes](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-type/))

- `type` \- The type of indicators to search for (see [IndicatorTypes](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type/))

- `since` \- Returns indicators collected after a timestamp

- `until` \- Returns indicators collected before a timestamp

- `fields` \- A list of fields to return in the response


Example query for all malicious IP addresses that are proxies:

```code
# You can swap the version used by replacing v25.0 with a different version.
curl -G \
  -d 'access_token=<ACCESS_TOKEN>' \
  -d type=IP_ADDRESS \
  -d text=proxy \
  "https://graph.facebook.com/v25.0/threat_indicators"

Open In Graph API Explorer
```

```code
{
  "data": [\
    {\
      "indicator": "77.2.132.202",\
      "type": "IP_ADDRESS",\
      "id": "675010235935327"\
    },\
    ...\
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MjQZD"
    },
    "next": "https://graph.facebook.com/v25.0/threat_indicators[...]"
  },
}
```

On This Page

[/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators/v25.0#threat_indicators)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators/v25.0#parameters)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAMIDNs4wGPoAGP_T_pxBA_vvNc_Uy6otmgARQNSkyMqKRSH-2rjdT26GKznkvGmEHW-kS4T9co70EQbzRry5-u7Mw3bKLCdcyFyzgSCTExPTg4Py-ynz3IJhA4H75MP_w_SxTz9kLEdg) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUAt9UrrPt7-MXOX_YrwEKyzHMRBmPItVQ_ZlaEFsNAWor_nmmq_l8eRBuPaHJm1TN8ROEU3gl47xQ1LE0bA1BliZwM2whL_TmoPagBZvN0I6uc-GLoM45C_GF_WrHonp3ihnWEMl2wZ-Q) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUBB4gQkRQDWZ3l_SMxU-JvxZ3XN7Ws10-SqC65dhS-_F8PMLSjT9ipedy8aoIasLaPL8y5cvLvrjPvOqGNPqSBwl5i3R1u8uwu3P4FOMCyy9fypdcZE6Ruj2iKExYXar3RLjz_jfUEYog) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBhxIJ4mwnm23f2znvJ8t4xJYMNAXyRYWN1B-yX-CcU1MGrzwfbTnzmAoWopoD17eD_AxhXvM20PVnOhUQBA8sCY5F2guceCj9yD0OFvoLtHRTjsXFStF89L1Lc-K8mRm5f6q9aj1lndVOWhr5e_FJ8Xrg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUCiscd3UfG3TMqPh8qRIV7SJgDOKxePf8CZDcvvHq_qH6P2dxuHEvboEY2eprI1ocz67pzmnfpZDzYSeJPW7vRWJ46mNCyoGl4IsCpfkdvi3O4JCIemGiNCHiYhSu4J79cfYCERhTy2gA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUCPRelulBJqGYHA-Jlwm0YcB-Mh9BZLF-o1oPyVXhh8pS4GJwqPUsltvnP7rTMAGPwpEFK2m-CJGCsorr8X9RCeXjmpZbtogmEKYp4MoAcZgzc5zSIejXrRqUt2jZ_Do4VSKD-DsDA3aQ)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCMs5P68SidCD6koElJSCTOXrtcLF-AY-VdtA4WCCmPvhoDQGcgzsVF_HufNxVeiWzSWFvIaQqSOKBK0RC2FVTm0l85KMYIs0MoeRswjS1tQ-DDkKP-bZu49ohhch4fE2zRNQcMq6meLg)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUDwwjeJwpmB_zjPtSQdkcKO3at7gm6ez7q4tRqy-IobvrEnlefTckEVNbBGNBVjsSQHkxsYHEe82Xbqb096Dh7pSLLt4YYd2XzT632BRMC__qwH9hQppk-umjQsIMTTL8WXpgtZO_ffcg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUDBlhZLn74Gm1jaHo3EiaycEFKFIzzvK_taMAynOOVcijFZOKySC3gVAVbP0RdQSLtcJ55esFhSLt65j8UKUARHVzNFa2KeHb023Sl3NxSFSDZ-86fHnqGmlG5YhHQvbJl3l206gsm6BA)

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