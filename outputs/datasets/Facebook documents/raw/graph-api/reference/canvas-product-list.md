---
url: https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/
title: Graph API Reference v25.0: Canvas Product List
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fcanvas-product-list%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Canvas Product List](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Updating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#error-codes-2)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#)

# Canvas Product List

**Only E-commerce and travel hotel vertical catalogs are currently supported.**

## Reading

A product list inside the canvas

Select a product catalog and then manually provide the product ID, name and color variations to promote in a collection's ad creative. Use this option if you or your advertiser does not want to set-up a product set from a catalog feed. This option makes creating of ads from product catalog simpler. **Note that we do not save selected products as a product set for later reuse.**

Use this option to select which item colors you want to show in an ad and control the order products appear. **Because this is a manual ordering, we do not dynamically rank or display products based on popularity or relevancy to each viewer.**

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bcanvas-product-list-id%7D&version=v25.0)

```
GET /v25.0/{canvas-product-list-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{canvas-product-list-id}',
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
    "/{canvas-product-list-id}",
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
    "/{canvas-product-list-id}",
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
                               initWithGraphPath:@"/{canvas-product-list-id}"\
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
| `id`<br>numeric string | The id of the element |
| `bottom_padding`<br>numeric string | The padding below the element |
| `element_group_key`<br>string | The element group key to bundle multiple elements in editing |
| `element_type`<br>enum | The type of the element<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `item_description`<br>string | A token to represent which field from the product to show in the product description |
| `item_headline`<br>string | A token to represent which field from the product to show in the product headline |
| `name`<br>string | The name of the element<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `product_id_list`<br>list<integer> | A list of product ids inside the canvas |
| `top_padding`<br>numeric string | The padding above the element |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |

## Creating

You can't perform this operation on this endpoint.

## Updating

Provide a list of products for the element. This must include more than four IDs. IDs must be from Dynamic Ads product catalog or Dynamic Ads for Travel, hotel catalog.

`
curl \
  -F 'bottom_padding=8' \
  -F 'name=Product List Name' \
  -F 'product_id_list=[product_id_1, product_id_2, product_id_3, product_id_4]' \
  -F 'item_headline=See more at {{product.url}}' \
  -F 'item_description={{product.current_price}}' \
  -F 'top_padding=24' \
  -F 'access_token=TOKEN' \
https://graph.facebook.com/VERSION/CANVAS_ELEMENT_PRODUCT_LIST_ID
`

You can update a [CanvasProductList](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/) by making a POST request to [`/{canvas_product_list_id}`](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/).

### Parameters

| Parameter | Description |
| --- | --- |
| `bottom_padding`<br>float | The padding below the product list |
| `item_description`<br>string | A token to represent which field from the product to show in the product description |
| `item_headline`<br>string | A token to represent which field from the product to show in the product headline |
| `name`<br>string | Name of the product list element |
| `product_id_list`<br>list<int64> | A list of product ids inside the canvas<br>Required |
| `top_padding`<br>float | The padding above the product list |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Canvas Product List](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Updating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#error-codes-2)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/canvas-product-list/#Deleting)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUCz6E7XzRR8azf0XLs61cjroUH92yHoxlPgPNyebiBidcfFS3QA2vCtZTEhnQvIxN-7_edceCsloWsQ5dSF8dMCpsNJeLT6feTfTSNBOXqxU4IpXChfQoo7ioQicFzPqJ18kJ4t-BWRZg) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUBFnLtNYT3raVH6D_V71csfD9kbZv0cIHncST2MzJXk0i1GaAUgzNK9uZA75xohu7AjMGMWLDQPjzyrHqdRI9wcvO8fXVpLpQ4uRg5cCbsQTYu9VheDrNYaoFPKrgr05r2X9yfoSab4MQ) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUACr3HYawFLFds6rVbfFNLq8cvQ_sSC9yebFWxxLwtappWgz9281XjRY7TL7MEUL81R0LssJ0G8UCIh_BRPdB7fZD9C2M-vhdmvu250S-bgh3PDqfBb0I79y6VfvVTLiRy_xPU-Q721Xg) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUAQ_Eqdc73k0gfQzqhJ6zs131kVsfe4hGFx3Ira4rxUsFz5FLyTE3wnq8wJgwEn_3UL0U6OJO4Pg2_ohG9mLDau5c0wDUZQHIDeWavUH5AloGN7LhZME_-uL4qjF-0fnGksrTTFXKwFc3oJGTF-za0IRXM)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDBIjf6rFaau20wC7cZECC-tDfFBYuHJglY_aDwpoIXAxpKFZX4_fA1cPI1PqVG0RraRiQPgrM68zz0Cw94hoOE33jJQN2sGfuI5sZ8zxM3lNiM4MXTo9Eas2VYThQpvkNOxf-0SzRX1w)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUA77GBYbAOGzWFyetkgIc5gAOk-GFvH8kXk3T9q-3g4l6qchZIOQO0gDOI6fiYx7qyYbbIERz5BwdJG21mAWFz8FiTM8a-1WEqo4qkYIRZWw0VrdI4Eivee6FR9eRqTowqz96eYE86gZA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCRtgL8N6xECmA-SiUDeZM8QkSrOalhDZTzodOtGBVoTiv5QueaP3YMHLtlySVj1DUbK_649Tj1djuv_p7d-wx_1jnGkrqn5dTcaESDQabaFpE01ga4UUT_MMzIpyQ0g8TSpffeODMZxg)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBgsN_ZpX2o4d0RQIZorvsA1gvVnbPCtoH6pVWVG5fquLgo_mNMBhskVS0uHfx9zI5gxGdjpcJRS90NNAD1nPo9JmNSEzaPsevBXOUdjSgV1BMuB6X9KK-SGzwMudSY5DlaZRirMJs5OQ)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUA-w13fuKWpCcIDPYxG1AqUz2tmwmNrM2SeOeehiMgUat_yOc-5JHfVo_P2Q7eD9MKStMiiZdCaRmVlXrvSA9YgCv1KdQJFyqqEHBfwwfQNy9QkJbsG6uwFZPRC6HfNq1vJx8ek5Kt9ag)

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