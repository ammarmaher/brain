---
url: https://developers.facebook.com/docs/graph-api/results
title: Paginated Results - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fresults%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)


  - [Facebook SDKs](https://developers.facebook.com/docs/graph-api/guides/our-sdks)
  - [Paginated Results](https://developers.facebook.com/docs/graph-api/results)
  - [Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)
  - [Versioning](https://developers.facebook.com/docs/graph-api/guides/versioning)

- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Paginated Results](https://developers.facebook.com/docs/graph-api/results#paginated-results)

[Traversing Paged Results](https://developers.facebook.com/docs/graph-api/results#paging)

[Cursor-based Pagination](https://developers.facebook.com/docs/graph-api/results#cursors)

[Time-based Pagination](https://developers.facebook.com/docs/graph-api/results#time)

[Offset-based Pagination](https://developers.facebook.com/docs/graph-api/results#offset)

[Next Steps](https://developers.facebook.com/docs/graph-api/results#next-steps)

# Paginated Results

We cover the basics of Graph API terminology and structure in the [Graph API overview](https://developers.facebook.com/docs/graph-api/overview). This document goes into more detail about the results from your API requests.

## Traversing Paged Results

When making an API request to a node or edge, you usually don't receive all of the results of that request in a single response. This is because some responses could contain thousands of objects so most responses are paginated by default.

### Cursor-based Pagination

Cursor-based pagination is the most efficient method of paging and should always be used when possible. A cursor refers to a random string of characters which marks a specific item in a list of data. The cursor will always point to the item, however it will be invalidated if the item is deleted or removed. Therefore, your app shouldn't store cursors or assume that they will be valid in the future.

When reading an edge that supports cursor pagination, you see the following JSON response:

```js
{
  "data": [\
     ... Endpoint data is here\
  ],
  "paging": {
    "cursors": {
      "after": "MTAxNTExOTQ1MjAwNzI5NDE=",
      "before": "NDMyNzQyODI3OTQw"
    },
    "previous": "https://graph.facebook.com/{your-user-id}/albums?limit=25&before=NDMyNzQyODI3OTQw"
    "next": "https://graph.facebook.com/{your-user-id}/albums?limit=25&after=MTAxNTExOTQ1MjAwNzI5NDE="
  }
}
```

A cursor-paginated edge supports the following parameters:

- `before` : This is the cursor that points to the start of the page of data that has been returned.
- `after` : This is the cursor that points to the end of the page of data that has been returned.
- `limit` : This is the maximum number of objects that _may_ be returned. A query may return fewer than the value of `limit` due to filtering. Do not depend on the number of results being fewer than the `limit` value to indicate that your query reached the end of the list of data, use the absence of `next` instead as described below. For example, if you set `limit` to 10 and 9 results are returned, there may be more data available, but one item was removed due to privacy filtering. Some edges may also have a maximum on the `limit` value for performance reasons. In all cases, the API returns the correct pagination links.
- `next` : The Graph API endpoint that will return the next page of data. If not included, this is the last page of data. Due to how pagination works with visibility and privacy, it is possible that a page may be empty but contain a `next` paging link. Stop paging when the `next` link no longer appears.
- `previous` : The Graph API endpoint that will return the previous page of data. If not included, this is the first page of data.

Don't store cursors. Cursors can quickly become invalid if items are added or deleted.

### Time-based Pagination

Time pagination is used to navigate through results data using Unix timestamps which point to specific times in a list of data.

When using an endpoint that uses time-based pagination, you see the following JSON response:

```js
{
  "data": [\
     ... Endpoint data is here\
  ],
  "paging": {
    "previous": "https://graph.facebook.com/{your-user-id}/feed?limit=25&since=1364849754",
    "next": "https://graph.facebook.com/{your-user-id}/feed?limit=25&until=1364587774"
  }
}
```

A time-paginated edge supports the following parameters:

- `until` : A Unix timestamp or [`strtotime`](https://l.facebook.com/l.php?u=http%3A%2F%2Fphp.net%2Fmanual%2Fen%2Ffunction.strtotime.php&h=AUBi8VkIyP6fpeANXOwHQ3APLuCycExUc54_cU5Xx0vvo0raA2qWbG27LAJbb6oHYR6GIBAOzK7dM1WVedT8XhGQqo_dH_E3LoJrELfU_WoEH6g-0eIUjELu7hfNLgfUAnjaQVr6gXMiuQ) data value that points to the end of the range of time-based data.
- `since` : A Unix timestamp or [`strtotime`](https://l.facebook.com/l.php?u=http%3A%2F%2Fphp.net%2Fmanual%2Fen%2Ffunction.strtotime.php&h=AUCJlaVvPQdns55UCOOzqJHb998I1rBj5NLlxaGsbIq9GU1rEBH0AT9BdkMZcHo22-xMYcTrAMSckbCFTE8aogS0_bUyOGaiaKutZAcO4bsfsm9Gmm1rJ5bZuSg25W7EF4o17yVPshSZhg) data value that points to the start of the range of time-based data.
- `limit` : This is the maximum number of objects that _may_ be returned. A query may return fewer than the value of `limit` due to filtering. Do not depend on the number of results being fewer than the `limit` value to indicate your query reached the end of the list of data, use the absence of `next` instead as described below. For example, if you set `limit` to 10 and 9 results are returned, there may be more data available, but one item was removed due to privacy filtering. Some edges may also have a maximum on the `limit` value for performance reasons. In all cases, the API returns the correct pagination links.
- `next` : The Graph API endpoint that will return the next page of data.
- `previous` : The Graph API endpoint that will return the previous page of data.

For consistent results, specify both `since` and `until` parameters. Also, it is recommended that the time difference is a maximum of 6 months.

### Offset-based Pagination

Offset pagination can be used when you do not care about chronology and just want a specific number of objects returned. Only use this if the edge does not support cursor or time-based pagination.

An offset-paginated edge supports the following parameters:

- `offset` : This offsets the start of each page by the number specified.
- `limit` : This is the maximum number of objects that _may_ be returned. A query may return fewer than the value of `limit` due to filtering. Do not depend on the number of results being fewer than the `limit` value to indicate that your query reached the end of the list of data, use the absence of `next` instead as described below. For example, if you set `limit` to 10 and 9 results are returned, there may be more data available, but one item was removed due to privacy filtering. Some edges may also have a maximum on the `limit` value for performance reasons. In all cases, the API returns the correct pagination links.
- `next` : The Graph API endpoint that will return the next page of data. If not included, this is the last page of data. Due to how pagination works with visibility and privacy, it is possible that a page may be empty but contain a `next` paging link. Stop paging when the `next` link no longer appears.
- `previous` : The Graph API endpoint that will return the previous page of data. If not included, this is the first page of data.

Note that if new objects are added to the list of items being paged, the contents of each offset-based page will change.

Offset based pagination is not supported for all API calls. To get consistent results, we recommend you to paginate using the previous/next links we return in the response.

For objects that have many items returned, such as [comments](https://developers.facebook.com/docs/graph-api/reference/object/comments) which can number in the tens of thousands, you may encounter limits while paging. The API will return an error when your app has reached the cursor limit:

```code
{
  "error": {
    "message": "(#100) The After Cursor specified exceeds the max limit supported by this endpoint",
    "type": "OAuthException",
    "code": 100
  }
}
```

## Next Steps

Now that you are more familiar with the Graph API visit our [Graph Explorer Tool Guide](https://developers.facebook.com/docs/graph-api/explorer) to explore the Graph without writing code, [Common Uses](https://developers.facebook.com/docs/graph-api/using-graph-api/common-scenarios) to view the most common tasks performed, and [the SDKs available](https://developers.facebook.com/docs/graph-api/using-graph-api/using-with-sdks).

On This Page

[Paginated Results](https://developers.facebook.com/docs/graph-api/results#paginated-results)

[Traversing Paged Results](https://developers.facebook.com/docs/graph-api/results#paging)

[Cursor-based Pagination](https://developers.facebook.com/docs/graph-api/results#cursors)

[Time-based Pagination](https://developers.facebook.com/docs/graph-api/results#time)

[Offset-based Pagination](https://developers.facebook.com/docs/graph-api/results#offset)

[Next Steps](https://developers.facebook.com/docs/graph-api/results#next-steps)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUA08sxiR7z1-q_iswOpi927e4WX14MUFMgBOEunf-RMCnK6aUkngmxFsPfSYAFxk8K0T9E68H4SK76rUR7XDYbBq12zmLtNajiYYFc_IindxNUBzQsYcHv-D7Jqw2EP3oxk5oKE34XbeA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCn7QNJTB-Qc1_txRUbW96JwXzwljE2-MAgi1LSaowjDonQPAfJc7TQDVPYpKXw_fqKW2UllZKao5UH9cXA8A4XHzqoDnjVa_tzEOzon5R5QCO2Z2Tgq1Keqfrq4jYWRStGEdFyHyJ8wA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUA6ZgsvlLHsB9l4zQGKADKWs49pfcePfVCgwhpJTfu1ScL_1N9kNrmvrqeOXrOrVFuJRX2XxMdb_18umIBbU4onaLq-HRT-x3PDNT7LNdFTHVz9t8m-1w3jycWtm4lLuhwjm6PbUxU8Qw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUCJnHMMIuISak-111oAHe-N9nJBNHEPYkFCVpu7TlzOKN6WrrrQgKUYmM349cPmUgSmXyeOzwo7MnKysX9FoC3eXj7y8jXdwDD_rkeKGAubzYlGMHlz3QMV_L0HVk9u96h9DS3u0Y-l5Q)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDLYWhbOjZp8oGCTaQuzmwIR30R_wwogWGYCfomGAUZWUovXMG0usk396n5fUuOGSSVJp9Ym58DGGEWstrPflCGJ9ZJwjV6cVMeGsITkTG5IpKau3JbiSmKD-lea41_762eJ3YhpNt-Lw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBzxfVQRjjl-Yt4YR4-s5jeHOxmb_LvM5_zDvosHR3HfuOe8EnXtNClnFFeflQVy1EjWX5dEsstxssZiLUmzGuslamx7VsozybNmqdcIS1doI3e3UOgEDwF__4U7TyxEOwLW1v9HN6cUA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCUc2TeCFKR0ViwcvbzHdXUkAay8Q9KO_7W7SSnGSyeJGPpY2ExSbeBX53mBHQIEwk7e6eF1jkYgBPP50TQCSGKBxKWavbKn2ykm-wi6r9wivLdsRfrkDlTm-5-2MuO0OKfps5w5VYQnQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBPYyAeJSqmVlMswPY73lfEeuYJ4grel6NnNNKulaqVD4SBH3rqDZBOzSl_UBQT0rnRmdjFbTQo0czYNdOgmq-6msCSAUeBS65pGpvNl16R67GM6oh18dBF-osCEOMCsI5JSyN1nhhGWw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUC00e036JXLqVvn8LYKJ1fX-XJztbJJJC2dH3lEJ8k-EiRBQObSHPNOh3_ZsAa9fvsa1xa7IJvRllXDuxZKX38SW6_XKf84rKZopeR7d9LwOIkSZwH6_l4_Xd6vjuJ6G9CJ4ocvOA4vww)

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