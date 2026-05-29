---
url: https://developers.facebook.com/docs/pages-api/
title: Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Facebook Pages API](https://developers.facebook.com/docs/pages-api/#facebook-pages-api)

[Authentication and Access Tokens](https://developers.facebook.com/docs/pages-api/#authentication-and-access-tokens)

[Generating a Page Access Token](https://developers.facebook.com/docs/pages-api/#generating-a-page-access-token)

[Permissions and Features](https://developers.facebook.com/docs/pages-api/#permissions-and-features)

[API Endpoints](https://developers.facebook.com/docs/pages-api/#api-endpoints)

[Page Information](https://developers.facebook.com/docs/pages-api/#page-information)

[Posting Content](https://developers.facebook.com/docs/pages-api/#posting-content)

[Comment Management](https://developers.facebook.com/docs/pages-api/#comment-management)

[Insights](https://developers.facebook.com/docs/pages-api/#insights)

[Mentions](https://developers.facebook.com/docs/pages-api/#mentions)

[Page Settings](https://developers.facebook.com/docs/pages-api/#page-settings)

[Webhooks](https://developers.facebook.com/docs/pages-api/#webhooks)

[Setup](https://developers.facebook.com/docs/pages-api/#setup)

[App Review and Publishing](https://developers.facebook.com/docs/pages-api/#app-review-and-publishing)

[Review Steps](https://developers.facebook.com/docs/pages-api/#review-steps)

[Example Requests](https://developers.facebook.com/docs/pages-api/#example-requests)

[Posting a Message](https://developers.facebook.com/docs/pages-api/#posting-a-message)

[Getting Post Insights](https://developers.facebook.com/docs/pages-api/#getting-post-insights)

[Moderating Comments](https://developers.facebook.com/docs/pages-api/#moderating-comments)

[Error Handling](https://developers.facebook.com/docs/pages-api/#error-handling)

[Best Practices](https://developers.facebook.com/docs/pages-api/#best-practices)

[References](https://developers.facebook.com/docs/pages-api/#references)

[Documentation Contents](https://developers.facebook.com/docs/pages-api/#documentation-contents)

# Facebook Pages API

The Facebook Pages API allows apps to manage Facebook Pages and access related features with required permissions. This API enables various page management tasks, such as posting content, reading insights, moderating comments, and receiving real-time updates.

**Key Components:**

- **Access tokens:** Authenticated tokens with the required permissions
- **Endpoints:** For performing operations (post, get, update, delete)
- **Webhooks:** For receiving real-time updates

## Authentication and Access Tokens

To interact with the Pages API, a Page access token is required. This token is obtained via user authentication and grants permissions to perform API actions as the Page.

### Generating a Page Access Token

1. The app requests the necessary permissions from the user.
2. The user authorizes the app.
3. The app exchanges the authorization code for a user access token.
4. The app uses the token to request a Page access token.

## Permissions and Features

Different endpoints require different permissions:

- `pages_show_list` – Show Pages managed by a user
- `pages_read_engagement` – Read content posted to the Page
- `pages_manage_posts` – Publish and schedule content
- `pages_manage_engagement` – Moderate comments, delete posts
- `pages_read_user_content` – Read user-generated content on the Page
- `pages_manage_metadata` – Manage settings for the Page
- `pages_manage_ads` – Create and manage ads for the Page
- `pages_manage_cta` – View and update call-to-action buttons
- `pages_messaging` – Manage and send messages on behalf of the Page
- `business_management` – Manage business assets related to the Page

## API Endpoints

### Page Information

Retrieve basic information about a Page.

**Request:**

`GET /<PAGE_ID>?fields=id,name,about,fan_count`

**Permissions:**`pages_show_list`, `pages_read_engagement`

### Posting Content

Create new posts on a Page.

**Request:**

`POST /{page-id}/feed`

**Parameters:**

- `message`
- `link`
- `picture`
- `published`

**Permissions:**`pages_manage_posts`

```

POST /{page-id}/feed
Body:
{
message: "Hello from the Pages API!"
}
```

### Comment Management

Read, create, and moderate comments on Page posts.

**Read comments:**

`GET /{object-id}/comments`

**Post a comment:**

`POST /{object-id}/comments`

**Delete a comment:**

`DELETE /<COMMENT_ID>`

**Permissions:**`pages_manage_engagement`

### Insights

Get analytics and metrics for a Page.

**Request:**

`GET /{page-id}/insights?metric=page_impressions,page_fans`

**Permissions:**`pages_read_engagement`

### Mentions

Retrieve posts or comments where the Page is mentioned.

**Request:**

`GET /{page-id}/tagged`

**Permissions:**`pages_read_user_content`

### Page Settings

Update or retrieve Page settings such as cover photo, description, or messaging preferences.

**Get settings:**

`GET /{page-id}?fields=cover,about,description`

**Update settings:**

`POST /{page-id}/settings`

**Permissions:**`pages_manage_metadata`

## Webhooks

Webhooks provide real-time updates for changes or events on the Page, such as new comments, likes, or messages.

### Setup

1. Configure a callback URL in the developer dashboard.
2. Subscribe to desired fields (e.g., `feed`, `mentions`, `messages`).
3. Your service will receive HTTP POST notifications for relevant events.

## App Review and Publishing

If your app needs extended permissions (most Page management features), a Facebook App Review is required.

### Review Steps

1. Request required permissions in the Developer dashboard.
2. Provide detailed use cases and screencast videos.
3. Submit for review and respond to feedback.

## Example Requests

### Posting a Message

### Getting Post Insights

### Moderating Comments

- Delete a comment:

## Error Handling

- Use Facebook error codes and messages to identify issues.
- Common errors: Invalid token, missing permissions, rate limits.
- Reference: [https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling/](https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling/)

## Best Practices

- Use the minimum permissions needed.
- Cache responses where possible.
- Handle paging for large result sets.
- Respect user privacy and Facebook policies.

## References

- [Facebook Pages API Documentation](https://developers.facebook.com/docs/pages/)
- [API Reference](https://developers.facebook.com/docs/graph-api/reference/page/)
- [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/)

# Facebook Pages API

The Facebook Pages API from Meta allows apps to access and update a Facebook Page's settings and content, create and get Posts, get Comments on Page owned content, get Page insights, update actions that Users are able to perform on a Page, and much more.

This document contains the guides you will use to learn abour and implement the Facebook Pages API.

## Documentation Contents

We recommend you read each guide in the following order outlined in this document.

01. [Overview](https://developers.facebook.com/docs/pages/overview) – Learn about the components of the Pages API and how it works.

02. [Create an app](https://developers.facebook.com/docs/pages/overview) – Create a Meta app with the Pages API use case.

03. [Getting Started](https://developers.facebook.com/docs/pages/getting-started) – An introductory tutorial showing you how to publish a post to your Facebook Page.


04. [Manage a Page](https://developers.facebook.com/docs/pages/managing) – Get a list of your Pages with tasks you can perform on each and Page access tokens, and update Page settings.


05. [Posts and Comments](https://developers.facebook.com/docs/pages/publishing) – Create, publish, update, and delete Page posts and comments.


06. [Page Insights](https://developers.facebook.com/docs/platforminsights/page) – Get insights into your Page posts.


07. [Pages Search](https://developers.facebook.com/docs/pages/searching) – Search for Pages.


08. [Page Tabs](https://developers.facebook.com/docs/pages/tabs) – Get list of tabs for your Page.


09. [Meta Webhooks](https://developers.facebook.com/docs/pages/webhooks) – Get real-time notifications sent to your server for events that happen on your Page.


10. [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes) – Get notifications about upcoming changes Meta will be implementing on your Page.


11. [Error Codes](https://developers.facebook.com/docs/pages/error-codes) – View error codes and their description for errors you may encounter when implementing the Pages API.

12. [Changelog](https://developers.facebook.com/docs/pages/changelog) – View the log of changes for the Pages API.



On This Page

[Facebook Pages API](https://developers.facebook.com/docs/pages-api/#facebook-pages-api)

[Authentication and Access Tokens](https://developers.facebook.com/docs/pages-api/#authentication-and-access-tokens)

[Generating a Page Access Token](https://developers.facebook.com/docs/pages-api/#generating-a-page-access-token)

[Permissions and Features](https://developers.facebook.com/docs/pages-api/#permissions-and-features)

[API Endpoints](https://developers.facebook.com/docs/pages-api/#api-endpoints)

[Page Information](https://developers.facebook.com/docs/pages-api/#page-information)

[Posting Content](https://developers.facebook.com/docs/pages-api/#posting-content)

[Comment Management](https://developers.facebook.com/docs/pages-api/#comment-management)

[Insights](https://developers.facebook.com/docs/pages-api/#insights)

[Mentions](https://developers.facebook.com/docs/pages-api/#mentions)

[Page Settings](https://developers.facebook.com/docs/pages-api/#page-settings)

[Webhooks](https://developers.facebook.com/docs/pages-api/#webhooks)

[Setup](https://developers.facebook.com/docs/pages-api/#setup)

[App Review and Publishing](https://developers.facebook.com/docs/pages-api/#app-review-and-publishing)

[Review Steps](https://developers.facebook.com/docs/pages-api/#review-steps)

[Example Requests](https://developers.facebook.com/docs/pages-api/#example-requests)

[Posting a Message](https://developers.facebook.com/docs/pages-api/#posting-a-message)

[Getting Post Insights](https://developers.facebook.com/docs/pages-api/#getting-post-insights)

[Moderating Comments](https://developers.facebook.com/docs/pages-api/#moderating-comments)

[Error Handling](https://developers.facebook.com/docs/pages-api/#error-handling)

[Best Practices](https://developers.facebook.com/docs/pages-api/#best-practices)

[References](https://developers.facebook.com/docs/pages-api/#references)

[Documentation Contents](https://developers.facebook.com/docs/pages-api/#documentation-contents)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAlUWvM5sCOHrzz3pRtUbYtx5vM7ijVFVHDmu49cpaqUaODtQZMZakVyEOPjHWMj2JNUxt3zZRXXMAJqs9zBojc61jC-HyocH_1Fv34-5EjANF6CNfUm6d3SZKrZUarJcz9tL21QuPAHQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUAmHJUyEWLwOkd7vGy4ezRPTYEBvm1so8fkqL_V_03QiaqbgDLLrSO_3Md91kqSIQnNyUoLwoJOlTrnDPv5MqNrMx8DZNPGB7DmPwqaMaRNfQ9YbP-LZoXcLooQndNPJWKE68_s0lF_ug) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAAzRDVdQKtG_IBhEdXCq6E4Vo-hbq2W7Hfd8wdeTBBGaymQVopPyayTkFpmazTgpJhVxbbYW3flApMyrSweCIo840Xu05Zc958eFU-gyrWI664wjqe-PRRKt2ccOC-5WoZz0lltyQe7A) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDhr02bwG3fLCDJdmKhophu4YYKeNuHDApiEImW2TjZ4AHZutwCFo3B37w8bzdta-UT6y-jrtEiRJAlNsXCCylMt0veGBd-cZRzmpkMW8kqoAzrNT9sUrMABi74EPNUwCx80Sy3P40Jsg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUCtrxm3jsSL-w2yW14vs0kvaFXTDYa1hWGi6Rxu5nHiFw2Wtmq3IOd8IFEpHd5E_KMZfjlM8GpLWOBlfAB7mw5BQNEJT5_F4-mEJcQZkyD-Gi7_2-majAghTTqPlfZqhyb8V93uJOOuOA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUC0qKLC3eGu0j3o3M1m4VPTY3vxlnyfC5Gyzfu1uy0YAPKtNOFFrqcpHGI6ypuel66_dPB2MysX50HrOZAy11d4CD2wk79PhO4HcTkXbu2upr_iy2eMu17FU8WXFfv-N6-HFFpSkUJMLA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBcy6ffIDsjhEfeDaTUE6cAnGVWdCV3YVTieMq8IOlJABSFNhzN_nz2qpeGJijT8eiRdyTrhByD2eYoa9_u-AtHxvIWTitlXbcZ2zgGGcXV4_cnT7fujaMdB-yfIwOStaAQoEWVWw_eSQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBU4NDabiIIUldJn58MMFS07lDpYrJorSqd0NrGYJAXXmx09S1N4C8SQuj5-LeoMx4XW12vrrLdBIsocL1EQb8eo7reErFiw5QhzXS3TqPdUokgqhcFSL4ndHgUy8XBrGKHi8v8fqA8JQ)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUDJ4v8irsCIZ9TIQVOzmsXVwqheJLtLLKVGosnotzu9oE5wlinLx4PmiT-xatG8XCsmWXD1cUs7W8NE13dHtM7b_c-q0h0H692Vf96M-YBDPZscJamrWymdk_UFc2SxMQDCdEhw9tFewA)

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