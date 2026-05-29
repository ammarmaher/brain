---
url: https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/
title: Graph API Reference v25.0: Beneficiary Payer
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fbeneficiary-payer%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Beneficiary Payer](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#)

# Beneficiary Payer

## Reading

A reported beneficiary and payer for the ad.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=...%3Ffields%3D%257Bfieldname_of_type_BeneficiaryPayer%257D&version=v25.0)

```
GET v25.0/...?fields={fieldname_of_type_BeneficiaryPayer} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '...?fields={fieldname_of_type_BeneficiaryPayer}',
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
    "...?fields={fieldname_of_type_BeneficiaryPayer}",
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
    "...?fields={fieldname_of_type_BeneficiaryPayer}",
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
                               initWithGraphPath:@"...?fields={fieldname_of_type_BeneficiaryPayer}"\
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
| `beneficiary`<br>string | The natural or legal person that benefited from the ad.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `current`<br>bool | Whether this beneficiary and payer entry was the most recent one entered for this ad.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `payer`<br>string | The natural or legal person that paid for the ad.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Beneficiary Payer](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/#Deleting)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUA79ZwJImZg0zVfJcrTYqlt4GNYJy2pZJPiaLXiWYZ4btyiIINg4h0Mvr-QpPaCjAL6hfhel_X3o-6bZMj3ZCjwZzOazbmrfzGs19PliyZM2yCWkQXIGhPFh2Ufkk2BmTCbDA7_Tz6q0A) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUA_ggnwy9Pjl6s9W52UQUzI_un2wZs8FdBLPgp-N6fCecsFeQooOWwPzSPxr4wKwTy6tNvAqnXIs4oylIty42Fnm52F7OqKn4OAFPwCOF5lYGlqUTJ9kVI8W1zi8l6amBe89RwD2CWY7Q) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUBSh12WTnpyZ1fkhmTtbDb7rR41wtEV0VF74Z_k4FhHsoVhQ-U8ysPtF4F-tly1ygkNYKwEEkJlneDRYzuICnWdRFxiZsSMs4whAFpZU1PI7YJIt1tYz6tD9E3nQyik3Y-vUktCTeBM4Q) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUArjB--Lqq4v4l-ndmgAJiMuAKVVZ4Bc6Ob7YDLpd-1oyQk92QX7j7jL-wTTi2jUozoHlBkiu9GmSMkwQM0lOsifwk38Vs1fCE7GSXhBPZz5NG5NjCmXSb1lmzGOkOuoaT2mRvai28v9Q)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUAaqPL4PRgzLnuBcH88hjlq8hnJxKOwiSJ3Q_1wV8vWm2Wkzk2wMewH9vWoSeSgL851LKIHkq5occv10Cg95QynnG8TzmhVq_ypE6PxveUUoFBlZegCCL8nYxOi9iyciEK3Si6tTXMl1Q)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUAZRxJhrQ4regbuob9WuD6L7p4wXSi_lKPe-RhzNwRK9sy8_4ILP2InIIPblsbqX18sCPNFYT-W0tJO9dm2yKF1i27KFpRmkAgHxAsmG1-JlbDcitV0wDoT_aLLBJk4Xf2cS073bYRm2Q)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAuRkfUFsfRZGDjFAMgMn6mSDEB__wDZoq-SIoH1ZHPjGmudAkTqcmubSGGA17pkZJiPYY9iahhAVyIeBKSxzGBPtOSTT-fSJkf5qDR96344zm82IVzSV1ArYK9VnAtgNXNbxHh7qzmaQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUC8YK3NtMhcjKnyUtPDrK653Bc-yzFUKqcs1VHoc9epQxRVTCzGxN4ncOqLG_JzNUJUdywKHdB0Z9xvnhS77tp-86iIF5CXeO9W7fo2cqmgrJ9zln5tvMJsmuK1bOg3rmeiUod8mnBbBg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBR_6CJF1dJdevTETlStEiwDUxXaMiVqUDa6MutYYqa4rj5jmGvNcIffqGm3rCA4odPHvCMK3_7M89KYkrV1BFgqprtHBrbMCb81wvX73HW32KFP7KDENVPFrsLgkvPLZmAh2Ekgu_pPw)

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