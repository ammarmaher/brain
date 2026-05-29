---
url: https://developers.facebook.com/docs/graph-api/reference/page/agencies/
title: Graph API Reference v25.0: Page Agencies
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpage%2Fagencies%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page Agencies](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#new-page-experience)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#requirements)

[Example](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#)

# Page Agencies

## Reading

Returns the Businesses and Agencies that have permissions on the page.

### New Page Experience

This endpoint is supported for [New Page Experience](https://developers.facebook.com/docs/pages/new-pages-experience/).

### Requirements

- A Page access token requested by a person who can perform the `MANAGE` task on the Page.
- The `business_management` permission for Pages owned or claimed by a business, otherwise the `pages_manage_metadata` and `page_show_list` permissions.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bpage-id%7D%2Fagencies&version=v25.0)

```
GET /v25.0/{page-id}/agencies HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{page-id}/agencies',
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
    "/{page-id}/agencies",
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
    "/{page-id}/agencies",
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
                               initWithGraphPath:@"/{page-id}/agencies"\
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

Reading from this edge will return a JSON formatted result:

```
{
    "data": [],
    "paging": {}
}
```

#### `data`

A list of [Business](https://developers.facebook.com/docs/marketing-api/reference/business/) nodes.

The following fields will be added to each node that is returned:

| Field | Description |
| --- | --- |
| `access_requested_time`<br>datetime | The creation time of the access request<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `access_status`<br>enum | The status of the access request<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `access_updated_time`<br>datetime | The update time of the access request<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `permitted_tasks`<br>list<string> | The permissions of tasks associated with the access request<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 100 | Invalid parameter |
| 190 | Invalid OAuth 2.0 Access Token |
| 80001 | There have been too many calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |

## Creating

You can make a POST request to `agencies` edge from the following paths:

- [`/{page_id}/agencies`](https://developers.facebook.com/docs/graph-api/reference/page/agencies/)

When posting to this edge, no Graph object will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `business`<br>numeric string | The business ID of the agency that you want to assign to this Page.<br>Required |
| `permitted_tasks`<br>array<enum {MANAGE, CREATE\_CONTENT, MODERATE, MESSAGING, ADVERTISE, ANALYZE, MODERATE\_COMMUNITY, MANAGE\_JOBS, PAGES\_MESSAGING, PAGES\_MESSAGING\_SUBSCRIPTIONS, READ\_PAGE\_MAILBOXES, VIEW\_MONETIZATION\_INSIGHTS, MANAGE\_LEADS, PROFILE\_PLUS\_FULL\_CONTROL, PROFILE\_PLUS\_MANAGE, PROFILE\_PLUS\_FACEBOOK\_ACCESS, PROFILE\_PLUS\_CREATE\_CONTENT, PROFILE\_PLUS\_MODERATE, PROFILE\_PLUS\_MODERATE\_DELEGATE\_COMMUNITY, PROFILE\_PLUS\_MESSAGING, PROFILE\_PLUS\_ADVERTISE, PROFILE\_PLUS\_ANALYZE, PROFILE\_PLUS\_REVENUE, PROFILE\_PLUS\_MANAGE\_LEADS, CASHIER\_ROLE, GLOBAL\_STRUCTURE\_MANAGEMENT, PROFILE\_PLUS\_GLOBAL\_STRUCTURE\_MANAGEMENT}> | Tasks that are assignable to this Page. |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 3989 | You are trying to assign a duplicated asset to this agency. |
| 100 | Invalid parameter |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 3946 | Asset already belongs to this Business Manager. |
| 80001 | There have been too many calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 190 | Invalid OAuth 2.0 Access Token |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Page Agencies](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#new-page-experience)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#requirements)

[Example](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/agencies/#Deleting)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUCyAC8JuCLI0SrCQ-8WKbMdQyiH6nV_LpaHqbgoys_T4gCMu_k-7aji5UJcnlEO6GZKTseoRhkP-S9poBfyVFstdZFB3VtJEj-Lkp4mngk_v3IAYXJpzQ4dloHb0KqOKQznI2zWA_GAwg) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUBAYcOmHJDn6B0-x2TlUvoUNlPQHNB-zqJiT6eNYDYTEtYprt3K2SVZ6MNYFVB7O6w-X8uXi5QOpUhT46qiuRml9EGiY8y81h-gZlZUWLcBDnUIPcMatpNiuH94-R0SbaSxPkLXtk4Qug) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUCze1nohq32CVOYVKZUFKDePw7Or735O7BYVhC-BSYbqcBdS6xD3XZn8PBbBoZibbSw7reoXKbS_OhoUpDIAZuQoiOt0F3JzVyiBNPya6XVO8lhIE1xY_tYioy5VdkQEJlCx-Vl7AWdrA) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUAcPzOR7A-VKuP4HfZhhT-2LGtofit0jvkTcehgiahqjSd6NJmqRsb5GkZLx2J1aV0SsPKoHEygv8A2tLhJ5rQaedl3o7EJYfNPvMRu5a6Ju19KjZTr0PE_Lk1prMyzndfMtzeX_Jx7gQ)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDO4zbDqYaqcPjRF9jhlOAWFbLk7Qa1WtdAXu1U_Kc4F85GLlzYSEENXx6FsNNCy0p60oPh_JvNkPs1eP8EB76rdSwBgrFM9YmcqrMTsJg8C6PS2oGYqVxIOEoQhPE0pCTrI16pAHWqFw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBUE4WLRr34m8cNBX4CaZ0IJcFioIQ0MXwpG_kVSWCAd0gzNYGIO12AzaU3GNMUyYKDxyKcdZrrabweMdw57pT5L_dDAHFludzgweeIfd5GHncjFnHT85w-JzPLOhxmbFddtBqSsf89KA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUB0I6s_G5rPHjzOkx56Yr-4Sq65BRGJqN2Eil_OuNr98XCvy0e-B-I3b_j104Kh-7mK_wYD3zxXSB4y0urWqYneYbsMwBEtGcZOyGD_M3I5Rt_ZjX1RWm7mpp81DkTQTpMI2qY-dpgxJg)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBslmh80dV1Mi6gaUinTvZhz3DbOX-B3zBivYLfaEa0y-VZiEknelfhIbiDo_0Zx2_9Us5ElxNDMECmKH7UQycQcrQqClgR9Ip1_dlFNcHONB0AJukoIF2A4uS4A0V6zdTh_EvTJkmjXg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBbe1RNBfMLezAdsZnjweU8plQcWC7j_Dw-YljJv-ObykgRHRfNQnY2xCiBPLWeqsXj1cHD-0DzirJbasSrcBs3jIhXRwpR2zZ6rbvNxqT5oI_OJgq9wrWSY5h2WThRm1cknrZOaHQv8w)

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