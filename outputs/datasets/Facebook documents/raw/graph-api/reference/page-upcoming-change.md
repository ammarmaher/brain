---
url: https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/
title: Graph API Reference v25.0: Page Upcoming Change
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpage-upcoming-change%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page Upcoming Change](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#)

# Page Upcoming Change

## Reading

Notification of page upcoming changes.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bpage-upcoming-change-id%7D&version=v25.0)

```
GET /v25.0/{page-upcoming-change-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{page-upcoming-change-id}',
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
    "/{page-upcoming-change-id}",
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
    "/{page-upcoming-change-id}",
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
                               initWithGraphPath:@"/{page-upcoming-change-id}"\
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
| `id`<br>numeric string | The ID of the upcoming change |
| `change_type`<br>enum | The type of the upcoming change<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `effective_time`<br>datetime | The time when the upcoming change will become effective<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `page`<br>[Page](https://developers.facebook.com/docs/graph-api/reference/page/) | The associated page of this upcoming change<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `proposal`<br>[PageChangeProposal](https://developers.facebook.com/docs/graph-api/reference/page-change-proposal/) | The proposal associated with the change, only valid when change\_type is knowledge\_proposal<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `timer_status`<br>enum | The status of the timer associated with this change<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Page Upcoming Change](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change/#Deleting)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAcXMwGKWgMYLj5sM_pblTlauSP6R4PKqkQzuMbLouz4phHbDp6WVlaeABrsurObRCw_uPiCFYAls6Zjl7CrrlCM38fBYiIVpfUtsDCgbeBAvrwFNK3uvTPN5_AHBQgDR26PGJgoKKqbg) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUAT5UJ3rOsc-cNjdEL32q_f_0wYtQ17jPhGnaUtAGBeN1hRyrWRbVFVtXgOXY_B6aIkVBeh6U6x3IFvu-vv_dw4LE9Use6SDSivXCzqiHbBsd0e9EOEpTD5M-m9ydOXCj7zgrji3pFPbg) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAOY9mUDX1Ljfqqii9GLDK5iYbRGrmGKJuyJ_1_0YXZ3QBs4SZDc6GVmp6VgYL63hkAZNNIXEUDMYjAPCUya8YpA-vb8uY2QT8Q97qhq1PTG8qNeCSRZaCvIewwQnuOEXr_EHFBZXUeaw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDQ7Ru2vF4N333BG-aEgJ2KKrpHWF63u-oz8ArNAOueezQZQ6WfklRz8z7D5vj9h7bApkbMQkoOzpstfJpwdKmvPuhYneJhDQtvrBlQYSjjxNX43boTL3kgAmpEpoYNXw7c98xko82RYA)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDXFncqYFqrLmgGqYNu-_b4oa_kvrJiJUZxP16o5O2GQraZM1v4Kp8t_3y-Qo_02_GnSLcqgR-gtTYV0Lrz7FG-NQ16TE0gPmAosUmOdQhxcXY0-QVn7odQG-ZWZcLxbDgVj1EnxjIB9w)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDbYu_e-3gmRDi8I78RuQTK311tA5TO-A9OZqY4s3NbpDfkx6q6HSyxQ6pl9XSL_i2yiYwS7yWCHk_uF4lLOxUArc9Gds3kDecff6MWnlQpao5HLsC0j1r-HlMkcZ0_cJHi1ss097S2iA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBJjjdrEdkT0AF96Nl78FjEBCdv8o7EF4QOWusGdCNoSM9k90_O0BnwJSxClouRXLtaED-5yEZuFWmL4HNeWoMTZnh7vM3ZXEAzoDSdx1M0Vgrh-tSNfJYVu4Gve2jvmEGLrpRFgJQZOA)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUALcqwYOwaKGxqzi5Elo0OH2W52cDVmiZ1MJsizNZyqrIjn0Pin3LXv1UtZxbP07MDnbeZPplSpK6c0Ne0Oi67yFyI2b_8Hi1k2dw-I707WS3cGu4D93vTYe9gHabgo6M1Qx_DFnZn0rQ)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUB6uYLKGpEiYo5rIPeaLSDAnrmEqoYrNGI7C0TkuxwwNcl_Qv9WDLUU_utphDLC4AtrKtXJEA9HgCmeUFN2XlVhMxKWtOjiiKOTt_Rl9oHtJAo9ZgmcBw1h8390t001jue2C7DpoRE6Cg)

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