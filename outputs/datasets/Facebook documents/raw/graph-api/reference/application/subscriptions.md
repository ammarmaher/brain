---
url: https://developers.facebook.com/docs/graph-api/reference/application/subscriptions
title: Subscriptions - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fapp%2Fsubscriptions%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[/{app-id}/subscriptions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#--app-id--subscriptions)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#readfields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#creating)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#limitations)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishingfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishingresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#delete)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deleteperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deletefields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deleteresponse)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#update)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#)

# [`/{app-id}`](https://developers.facebook.com/docs/reference/api/application/)`/subscriptions`

This edge allows you to configure [webhooks](https://developers.facebook.com/docs/graph-api/webhooks/) subscriptions on an app.

## Reading

HTTPPHP SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bapp-id%7D%2Fsubscriptions&version=v25.0)

```
GET /v25.0/{app-id}/subscriptions HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{app-id}/subscriptions',
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
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{app-id}/subscriptions",
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
                               initWithGraphPath:@"/{app-id}/subscriptions"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- An app access token is required to return subscriptions for that app.


### Fields

| Name | Description | Type |
| --- | --- | --- |
| `object` | Indicates the object type that this subscription applies to. | `enum{user, page, permissions, payments}` |
| `callback_url` | The URL that will receive the `POST` request when an update is triggered. | `string` |
| `fields` | The set of [fields](https://developers.facebook.com/docs/graph-api/webhooks/) in this `object` that are subscribed to. | `string[]` |
| `active` | Indicates whether or not the subscription is active. | `bool` |

## Creating

You can create new Webhooks subscriptions using this edge:

HTTPPHP SDKAndroid SDKiOS SDK

```
POST /v25.0/{app-id}/subscriptions HTTP/1.1
Host: graph.facebook.com

object=page&callback_url=http%3A%2F%2Fexample.com%2Fcallback%2F&fields=about%2C+picture&include_values=true&verify_token=thisisaverifystring
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->post(
    '/{app-id}/subscriptions',
    array (
      'object' => 'page',
      'callback_url' => 'http://example.com/callback/',
      'fields' => 'about, picture',
      'include_values' => 'true',
      'verify_token' => 'thisisaverifystring',
    ),
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
Bundle params = new Bundle();
params.putString("object", "page");
params.putString("callback_url", "http://example.com/callback/");
params.putString("fields", "about, picture");
params.putString("include_values", "true");
params.putString("verify_token", "thisisaverifystring");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{app-id}/subscriptions",
    params,
    HttpMethod.POST,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"object": @"page",
  @"callback_url": @"http://example.com/callback/",
  @"fields": @"about, picture",
  @"include_values": @"true",
  @"verify_token": @"thisisaverifystring",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{app-id}/subscriptions"\
                                      parameters:params\
                                      HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

Making a POST request with the `callback_url`, `verify_token`, and `object` fields will reactivate the subscription.

### Limitations

- [Webhooks for Instagram](https://developers.facebook.com/docs/instagram-api/guides/webhooks) is not supported. Instagram webhooks must be configured using the App Dashboard.
- [Webhooks for WhatsApp](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp) is not supported. WhatsApp webhooks must be configured using the App Dashboard.

### Permissions

- An app access token is required to add new subscriptions for that app.

- Subscriptions for the object type `user` will only be valid for users who have installed the app.

- Subscriptions for the object type `page` will only be valid for Pages that have installed the app. You can install the app for a Page using the [/{page-id}/subscribed\_apps edge](https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps).

- The app used to subscribe should be [set up to receive Webhooks updates](https://developers.facebook.com/docs/graph-api/webhooks/).


### Fields

| Name | Description | Type |
| --- | --- | --- |
| `object` | Indicates the object type that this subscription applies to. | `enum{user, page, permissions, payments}` |
| `callback_url` | The URL that will receive the `POST` request when an update is triggered, and a `GET` request when attempting this publish operation. See our [guide to constructing a callback URL page](https://developers.facebook.com/docs/graph-api/webhooks/#setup). | `string` |
| `fields` | One or more of the [set of valid fields](https://developers.facebook.com/docs/graph-api/webhooks/) in this `object` to subscribe to. | `string[]` |
| `include_values` | Indicates if change notifications should include the new values. | `bool` |
| `verify_token` | An arbitrary string that [can be used to confirm](https://developers.facebook.com/docs/graph-api/webhooks/) to your server that the request is valid. | `string` |

### Response

If your [callback URL is valid](https://developers.facebook.com/docs/graph-api/webhooks/) and the subscription is successful:

```code
{
  "success": true
}
```

Otherwise a relevant error message will be returned.

## Deleting

You can delete all or per-object subscriptions using this operation:

HTTPPHP SDKAndroid SDKiOS SDK

```
DELETE /v25.0/{app-id}/subscriptions HTTP/1.1
Host: graph.facebook.com

object=page
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->delete(
    '/{app-id}/subscriptions',
    array (
      'object' => 'page',
    ),
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
Bundle params = new Bundle();
params.putString("object", "page");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{app-id}/subscriptions",
    params,
    HttpMethod.DELETE,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"object": @"page",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{app-id}/subscriptions"\
                                      parameters:params\
                                      HTTPMethod:@"DELETE"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

You can delete specific fields from your subscription by including a `fields` param.

### Permissions

- An app access token is required to delete subscriptions for that app.


### Fields

| Name | Description | Type |
| --- | --- | --- |
| `object` | A specific object type to remove subscriptions for. If this optional field is not included, all subscriptions for this app will be removed. | `enum{user, page, permissions, payments}` |
| `fields` | One or more of the [set of valid fields](https://developers.facebook.com/docs/graph-api/webhooks/) in this `object` to subscribe to. | `string[]` |

### Response

If successful:

```code
{
  "success": true
}
```

Otherwise a relevant error message will be returned.

## Updating

You can perform updates on this edge by performing [a publish operation](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publish) with new values. This will amend the susbcription for the given topic without overwriting existing fields.

On This Page

[/{app-id}/subscriptions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#--app-id--subscriptions)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#readfields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#creating)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#limitations)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishingfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#publishingresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#delete)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deleteperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deletefields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#deleteresponse)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/app/subscriptions#update)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUD8iK7Y4rhYve8NzukVsAYWOy3bAtXXMs9AgDhP67_6ai_NB5ZftYgjkp3F2aHW9idBT0PM2AM-rTRZ-I_h33dHbBPzbH1nD5JpQ2MK4NhlPBHGES731jgW5DSVj5jKCp1R-5E4g20B0g) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDZCJMvdkVQp2UGB7A8y-JIYzJDKBjs9efBSGNuOG8kSVoLSKo1Fg3yEU8_ldbUNA21P-LeqD5bseksywJAqwFAYz8v5d9xbSF9-Ieo6fj2DsnZ91Jg-_o96FMGXKhi0FxRPfRSTbEZkA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUBCSiJkd4uNRV4JMh9S2XFzQifo02DzJ3Zz6zmYTX1hlDv--8nHJdCJvh1DvdA4OSHBbGk8O5MA8hl_782unmg1by1cT0a3y4M8X41Il5LR-0n3fyOM3VxUKNJe_7Enq3KZJZBVmHzj6Q) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUCmCZzzPgJ6J9N8T0gFw0wfDjmugrZxWyYSZ2qbvIe1yIK9S8zuE4EBa6qtjMVlOqqNe5Mf1tv48atZOitT5p0ylURNnTqDFIWsH2pq5JYmc1PZp4UnBlbdoJZoYS21gypGfsqTNz9SSg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDeuQr7ww8cF_91ASO12Q4GM-v5rwgiPFv05ksjnjaNWXdMngKrjMu6g7SWTcAfNAwQ4O1wV9dqsX5fsG_2WH8rN4ZLBrBhMjZmRpeeirbKqOwEi-j1Wwot2m4ULhehWsHVAtDnylQ5uA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDEMGVPhf9ukIWrxFr8NrH987M9_nNZXEUA6pImEC7rFsSDSVYNhnSTQ6QxgELmD_sY3_61-RBaeWxSYuFyeWZXWfERFx9UUld5uk1pFhkKddFtjZwmFXOXjqRKQwb8YvJmKOHi0SWSkw)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBIUD0Zv29Pj9wPlu1hLdUrsovHzcOxAJsNASaTH6S5JbpD-wv5KNnch2cq7zmZ3AQJPxiwnbLiVW331r6sGQQbWI6pV-MPituv9Rl_qfx6vwCk8JnO2w4m77KbkkxOEU3a8EW_Dlzg6w)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUB2t2_uvI9dGmN31J9IAlHwyMMJmgrefGQAwccDow79p95vSkYvWCbwyZadXNkZNTbg-5LT68haLDyBZoE3GEy9PKtt9Puv6-yMtzyUCMpLHLwI6HjlOe7PRFP2pEnSN5YY-QXY-DZe0w)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUCsCsUljtaA0OWdqUVyv_jMuFsfKeYppq03aPvMTsAuGqltd0f8l5GLCRmInpbVlP5Eouc6SrB2idPOlRBvy-AGJPYe9uPszBlrRmX-JjCub_R4B1uJI4XWDKalV0wTOs2DZL7Qo6qrAg)

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