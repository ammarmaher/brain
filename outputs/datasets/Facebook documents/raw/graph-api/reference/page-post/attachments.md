---
url: https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/
title: Graph API Reference v25.0: Page Post Attachments
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpage-post%2Fattachments%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page Post Attachments](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#new-page-experience)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#example)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#limitations)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#)

# Page Post Attachments

## Reading

PagePostAttachments

### New Page Experience

This endpoint is supported for [New Page Experience](https://developers.facebook.com/docs/pages/new-pages-experience/).

### Feature Permissions

| Name | Description |
| --- | --- |
| Page Public Content Access | This [feature permission](https://developers.facebook.com/docs/apps/review/feature/) may be required. |

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bpage-post-id%7D%2Fattachments&version=v25.0)

```
GET /v25.0/{page-post-id}/attachments HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{page-post-id}/attachments',
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
    "/{page-post-id}/attachments",
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
    "/{page-post-id}/attachments",
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
                               initWithGraphPath:@"/{page-post-id}/attachments"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Limitations

- By default only 12 attachments are returned. To include more attachments in the results, specify the number you would like returned.


#### Example

The following request will return 18 attachments.



`curl -i -X GET https://graph.facebook.com/{page-post-id}?fields=attachments{subattachments.limit(18)}&access_token={accesss-token}`

### Parameters

This endpoint doesn't have any parameters.

### Fields

Reading from this edge will return a JSON formatted result:

```
{
    "data": [],
    "paging": {}
}
```

#### `data`

A list of [StoryAttachment](https://developers.facebook.com/docs/graph-api/reference/story-attachment/) nodes.

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 190 | Invalid OAuth 2.0 Access Token |
| 104 | Incorrect signature |
| 80001 | There have been too many calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Page Post Attachments](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#new-page-experience)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#example)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#limitations)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page-post/attachments/#Deleting)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUDW1F74r58vqsbhZw1DtfUQArKN2P12e0ZvdjhajWqGEFk0hnMD7bF_wt1AigJD6MBDtuiOr3LYywbSeZ1cLnoCj46ymv1E4-4k694wpyc8ivjlBop4oisdr65E1ZNFjgFcso4XWfHTrw) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUA8lvo_iItNsQ1TGTomOOdWGB_mYow3O2EPBMB4uclzn6LJgwcD10KkY6JIdnE6OjwxHMnyn8KLosZPR3-pkXlPVdCn0tlUZe-9Ztj7x6CKlmmJ-aLC0riS660SDrETlXdfqwzRAJv5hg) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUDCO9K_Zk1r-9DWO4M7tyg-MFZH-up2ki5R2_cCZwO4nbaiw9a2dirirqZ6UrNjClx9_pIxyuvftb6PUk8wuWZMzrhnL47w9B4NjWzrqttaN3F80qezqmT-pu15ZJgq2r0bp7hc8LYxQw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBuzfOO-nH4nCxbWupuJfnxlgJaWLj3PelaElK6O6qBgtSCWUOBXc-L_215CETJmTYxgEmNwG5vKrCTjXjPJSGZnZ8OcgSvk0laW9pzEbCI0z24YU2DVRTRZkNWIMgOD1TFXh97EdatIQ)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUAJCUwrIt5ShNNXcsuq9qR0ya27NXXWIJCNikYO2OTOIbwWzL4KXZR7LTcgYbF7JM5eH71JfjusaTM8m7y4dTOa21XkjDTa9PpiPZrfwUEDIxaYbV0Fj7YAIUPcx2Q1dZm5uXakKDsiRA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDkH6FDqkff5gKCfbX0XnSar8DaxJx9L0rozEjUW47nnt6-ZdD9EyuNb2GjDGoVUnypyQoff9FQEV6X5IlrO6Ct9C9QF3j9XP8ZmeTJywglaR2cI8XZ9_pxwFbCPxG_VJEkhBkCTRBS4KxSnr7uoBEFf-I)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAYqRWarTNZUUJe6RN-rW1j2qjnEgdC2gDglu7ZP6U6LFOCyVcWbCbJGrIE84aQh2Ypf4IBywBufoEOVLZl-K9EdY8ewFm99yg92y4USjnO1g_lROyThIXYxDjIXsKAA6HUgG5x1LkUKA)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUCmBD0Yf1LVbFEpfqqL2jOZgWfu6Yty8GlHV-Z9pAlkVOsRZikMKuutPaLlI6UiiqFJtVoVcuwgkL9-36HgBbrPRIKjEBzPcr6PWRiiHstT_P7zqLUXEeV9vr8zJA02Jk7ZaAsvwc_oEw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBvgdXDvFXwFOoiXhD4FI3ynVuajfDT1lK41wkHo2zae8CzJOQO1FT2amcjIv1JQGQamNtsjUpPRBERgxIinAc_--jrBrrertZWhHZl0-7KPK0Irpu2ErgRHGedepJ9A1wNmeidec4mQQ)

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