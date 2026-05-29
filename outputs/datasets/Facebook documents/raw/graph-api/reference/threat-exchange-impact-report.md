---
url: https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/
title: Graph API Reference v25.0: Threat Exchange Impact Report
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fthreat-exchange-impact-report%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Threat Exchange Impact Report](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Updating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#return-type)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Deleting)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#error-codes)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#)

# Threat Exchange Impact Report

## Reading

Represents a report of a partner of on-platform impact as a result of shared ThreatExchange data, which covers a specific time range on a single collaboration.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bthreat-exchange-impact-report-id%7D&version=v25.0)

```
GET /v25.0/{threat-exchange-impact-report-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{threat-exchange-impact-report-id}',
    '{access-token}'
  );
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
/* handle the result */
```

```
/* make the API call */
FB.api(
    "/{threat-exchange-impact-report-id}",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{threat-exchange-impact-report-id}",
    null,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{threat-exchange-impact-report-id}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | The id of the object |
| `creation_time`<br>datetime | Creation time provided by storage |
| `impact`<br>list<ThreatExchangeImpactReportItem> | The outcomes on the owner's platform as a result of signals shared in this PrivacyGroup.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `notes`<br>string | free form notes about the report |
| `num_actionable`<br>unsigned integer | how much of the reviewed content was actionable. Must be <= reviewed |
| `num_already_actioned`<br>unsigned integer | how much of the matched content was review. Must be <= matched |
| `num_downloaded`<br>unsigned integer | the number of signals downloaded for this evaluation |
| `num_matched`<br>unsigned integer | the number of content (or signals) matched. |
| `num_reviewed`<br>unsigned integer | how much of the matched content was review. Must be <= matched |
| `report_range_end`<br>datetime | the end range of the report. Defaults to report time<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `report_range_start`<br>datetime | the optional starting time range of the report<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `signal_types`<br>list<enum> | If set, indicates that only these signal types were evaluated |
| `update_time`<br>datetime | Update time provided by storage |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can update a [ThreatExchangeImpactReport](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/) by making a POST request to [`/{threat_exchange_impact_report_id}`](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/).

### Parameters

| Parameter | Description |
| --- | --- |
| `impact`<br>array<JSON object> | The outcomes on the owner's platform as a result of signals shared in this PrivacyGroup. |
| `report_end_time`<br>int64 | the end range of the report. Defaults to creation time. |
| `report_start_time`<br>int64 | the optional starting time range of the report. Defaults to 6 months before now. |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

## Deleting

You can delete a [ThreatExchangeImpactReport](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/) by making a DELETE request to [`/{threat_exchange_impact_report_id}`](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/).

### Parameters

This endpoint doesn't have any parameters.

### Return Type

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |

On This Page

[Threat Exchange Impact Report](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Updating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#return-type)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#Deleting)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/threat-exchange-impact-report/#error-codes)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUDDRpxOoKlIJ6rysLAM9FRnS0yK5dNdm-tLwffenQmATkYHzffWqn7Zoxidl4V9onAKZPFUTfo8wG4XoRmCvGO9Y4t4Uz6RAKzhdT0mjyHysUOiKVKS-Te4snSExyt9tEzydi6iEgAnDA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCCSEqOFdgT2g7sep6zDankvjDGXWcitNIjUCinFdZfDsCUuKJ_o8xW-avY7oI267D7gMEUyfo7cVLHV_6aZ0N_jQ679Gg6dS8S6KhcliTIjyUKg3oJbFpZV0xeK-Ygcc98gAGNi54c9g) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUD7pcqHxLprogL09ta38gE-DkMZqM0GapVD1ogB23YrwZZ_5Doqbtt7y42h3gYGX1gmyL9T7jnwe6N1Vy7FrRQDv5IGSgtJKeWv83HtYcmHVppjx_rtOch5vjA6XDaQzKCWYYBvjOTDVA) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDX5TuSSbNZXPSoJbHP66ZDDyoSepyyI-MK8-bkIrg5FPqUfvEisDMt2tsDHMzHYPcELb1MVMhGzGy_x0i_KD57Jjtf8kYAOY27SjxDQxbaPYGjwXOyOUUmiPE0VT6deuXkdI7wpsII5A)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUAx6Bjk-XOJxbaoOSxPtD14aeD-fYR5-R4m9mvx19dvYRo0sTFSQ7aim2PJ8g3xBJr0e0w7AnylNgixLcTo15yDVtgO5ZqvLm_ZIdfuGCp7tBoIAaKx0aoxT3kJbGkm2mFOWLH-czrWHA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUA-7aISWqB6Rfjc-2VbuZVlK1JB_Uc6AYj4fxX0Tme6YT-_eYUSCCeXWttODs9LqhWDkrLbqc-N_-vXCmdEP4lkgwW7OE_Krt2q6bbC4xbOKBwrrUyulLNSHYU2lNlxh9xwVuqqODRrUQ)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUDrBtPhPi5vp86EerxgIe7-weX_GhnwTfg9pV0wPNmmrAz5NbFW3UNie72tp-G1v6YNdFFeUlYwSs1_-uaA9LhEMuBl9ljmqE4Ai-03pi9ZqMbNKiMmGKfrDlQA8_18R7U-WTpv3yI8iw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUC9wo-fnAe4hUtuDqVPbUUB98vRqqIhSWDGbD7EuzQuqnJGEg9JdDuuCbZZ3mAJ7KjoAPqlq3P29X6FD6RbeXZJ98mBijdlZ63KPm0eaxRhXYD-F-m9kpGCZBFumzWNQI2tsBvq2rdIzQ)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUCv1bN9KOikO9haIQRgEEuqAudybqFXsF30PtWcfqABwLS1fKHkdndIFjHQ3J8gUQNWVM5FZd2pwrQZg9_-US4QB7IZVIRIVtoVdpwKGtviHMaZTHidlkVeGe39ZxlBGsJYQXEeRWMzmA)

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