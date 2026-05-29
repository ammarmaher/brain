---
url: https://developers.facebook.com/docs/pages-api/overview/
title: Overview - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Foverview%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Overview](https://developers.facebook.com/docs/pages-api/overview/#overview)

[Components](https://developers.facebook.com/docs/pages-api/overview/#components)

[Access Tokens](https://developers.facebook.com/docs/pages-api/overview/#access-tokens)

[Graph API](https://developers.facebook.com/docs/pages-api/overview/#graph-api)

[Facebook Login](https://developers.facebook.com/docs/pages-api/overview/#facebook-login)

[Facebook Login for Business](https://developers.facebook.com/docs/pages-api/overview/#facebook-login-for-business)

[Features](https://developers.facebook.com/docs/pages-api/overview/#features)

[Mentions](https://developers.facebook.com/docs/pages-api/overview/#mentions)

[Page-Scoped User IDs](https://developers.facebook.com/docs/pages-api/overview/#psids)

[Permissions](https://developers.facebook.com/docs/pages-api/overview/#permissions)

[Page Search](https://developers.facebook.com/docs/pages-api/overview/#page-search)

[Rate Limits](https://developers.facebook.com/docs/pages-api/overview/#rate-limits)

[Tasks](https://developers.facebook.com/docs/pages-api/overview/#tasks)

[Messenger Platform](https://developers.facebook.com/docs/pages-api/overview/#messenger-platform)

[Meta Webhooks for Pages](https://developers.facebook.com/docs/pages-api/overview/#meta-webhooks-for-pages)

[App Review](https://developers.facebook.com/docs/pages-api/overview/#app-review)

[How It Works](https://developers.facebook.com/docs/pages-api/overview/#how-it-works)

[Next Steps](https://developers.facebook.com/docs/pages-api/overview/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/overview/#see-also)

# Overview

The Pages API is a set of Facebook Graph API endpoints that apps can use to create and manage a Page's settings and content.

## Components

### Access Tokens

API authentication is handled through Access Tokens. Most endpoints require Page access tokens, which are unique to each Page, app User, and app, and have an expiration time. In order to get a token from an app User, the app User must own or be able to perform a Task on the Page.

You can get access tokens from your app Users by implementing Facebook Login for Business.

### Graph API

If you are unfamiliar with the Graph API, please read our Graph API documentation before proceeding to learn more about the Meta social graph.

### Facebook Login

Facebook Login allows app users to log into your app and for your app to ask your users for permissions to access data.

### Facebook Login for Business

Facebook Login for Business is the preferred authentication and authorization solution for Tech Providers and business app developers who need access to their business clients' assets

### Features

Some endpoints require a Feature which must be approved through the App Review process before your app can use them when your app goes live. Features allow you to access public Page data without a permission or the ability to perform a task on the Page. Refer to each endpoint's reference to determine which Page Feature it requires.

### Mentions

@mentions allows your Page to publicly reply to a specific person, who has posted on your Page or commented on your Page post, in a comment or reply.

### Page-Scoped User IDs

Users who interact with Pages are identified by Page-Scoped User IDs (PSID). PSIDs are IDs that are unique to each User-Page pair. Pages API and Messenger Platform endpoints rely on PSIDs, so you can use a PSID to identify a User's interactions with a Page, as well as the User's public Messenger conversations with that Page.

### Permissions

Most endpoints require one or more permissions which must be granted to your app by app users. Typically this can be done through Facebook Login but can also be done through the Business Manager, if your app has been claimed by a Business.

All permissions require App Review before an app user can grant them to your app after it is live. For Business apps, which do not have app modes, permissions must be approved for Advanced access before they can be granted to your app by an app user without a role on the app itself or a role in a Business that has claimed it.

### Page Search

Find information about Facebook Pages including names, locations, and find Pages to @Mention, Page locations, and tag a Page to show branded content.

### Rate Limits

All Pages endpoint requests are subject to Rate Limiting. You can see your app's current call count consumption in the **App Dashboard**.

### Tasks

Tasks allow Users to perform specific actions on a Page. When a User uses an app to interact with a Page, depending on the attempted action, we will first check if the User has been approved for a task that permits that type of action.

You can approve individual users for the following tasks:

| Task | Permitted Actions |
| --- | --- |
| `ADVERTISE` | - Create ads <br>- Create unpublished Page Posts<br>- If an Instagram account is connected to the Page, create ads |
| `ANALYZE` | - View Insights of the Page<br>- View which Page admin published a post or comment |
| `CREATE_CONTENT` | - Publish content as the Page on the Page |
| `MANAGE` | - Assign and manage Page tasks |
| `MANAGE_LEADS` | - View and manage leads |
| `MESSAGING` | - Send messages as the Page |
| `MODERATE` | - Respond to comments on Page posts as the Page<br>- Delete comments on Page posts<br>- If an Instagram account is connected to the Page, publish content to Instagram from Facebook, respond to and delete comments, send Direct messages, sync business contact info, and create ads. |
| `VIEW_MONETIZATION_INSIGHTS` | - View monetization insights |

If a person is given Admin access to a Page in the UI, that person is able to perform all tasks on that Page.

### Messenger Platform

Have Messenger conversations with your customers or people interested in your Page.

### Meta Webhooks for Pages

Get get real-time notifications when a user comments on a Page post or reacts to your Page post.

## App Review

All Page-related Permissions and Features require approval through the App Review process before your app can use them when your app goes live.

Apps in Development Mode can request any Permission from any app User who has a Role on the app.

## How It Works

This is a typical flow for accessing the Pages API:

1. Get a User Access Token from your app user through Facebook Login for Business.
2. Query the `/me/accounts` endpoint to get the ID and Page Access Token of the Page the app User has permitted your app to access.
3. Capture the returned Page ID and Page Access Token.
4. Use the ID and token to query the Page node.

Note that in some cases the app User may grant your app access to more than one Page, in which case you should capture each Page ID and its respective token, and provide a way for the app User to target each of those Pages.

## Next Steps

Follow our [Get Started guide](https://developers.facebook.com/docs/pages/getting-started) to learn how to publish a Page post using the Pages API.

## See Also

|     |     |
| --- | --- |
| #### App Development with Meta<br>- [App Roles](https://developers.facebook.com/docs/development/build-and-test/app-roles)<br>  <br>- [Developing with Meta](https://developers.facebook.com/docs/development)<br>  <br>- [Graph API](https://developers.facebook.com/docs/graph-api/)<br>  <br>- [`/me` Endpoint](https://developers.facebook.com/docs/graph-api/overview#me)<br>  <br>- [Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting#pages)<br>  <br>#### Authentication and Authorization<br>- [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens)<br>  <br>- [Advanced Access for Business apps](https://developers.facebook.com/docs/graph-api/overview/access-levels)<br>  <br>- [Facebook Login](https://developers.facebook.com/docs/facebook-login)<br>  <br>- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business)<br>  <br>- [Page-scoped User IDs](https://developers.facebook.com/docs/pages/access-tokens/psid-api) | #### Page Guides<br>- [Mentions](https://developers.facebook.com/docs/pages/mentions)<br>  <br>- [Messenger Platform Documentation](https://developers.facebook.com/docs/messenger-platform)<br>  <br>- [Pages Search](https://developers.facebook.com/docs/pages/searching)<br>  <br>#### References<br>- [Features Reference](https://developers.facebook.com/docs/features-reference)<br>  <br>- [Page Endpoint Reference](https://developers.facebook.com/docs/graph-api/reference/page)<br>  <br>- [Permissions Reference](https://developers.facebook.com/docs/permissions#p)<br>  <br>- [Permission Dependencies Reference](https://developers.facebook.com/docs/permissions#permission-dependencies)<br>  <br>- [User Accounts Endpoint Reference](https://developers.facebook.com/docs/graph-api/reference/user/accounts) |

On This Page

[Overview](https://developers.facebook.com/docs/pages-api/overview/#overview)

[Components](https://developers.facebook.com/docs/pages-api/overview/#components)

[Access Tokens](https://developers.facebook.com/docs/pages-api/overview/#access-tokens)

[Graph API](https://developers.facebook.com/docs/pages-api/overview/#graph-api)

[Facebook Login](https://developers.facebook.com/docs/pages-api/overview/#facebook-login)

[Facebook Login for Business](https://developers.facebook.com/docs/pages-api/overview/#facebook-login-for-business)

[Features](https://developers.facebook.com/docs/pages-api/overview/#features)

[Mentions](https://developers.facebook.com/docs/pages-api/overview/#mentions)

[Page-Scoped User IDs](https://developers.facebook.com/docs/pages-api/overview/#psids)

[Permissions](https://developers.facebook.com/docs/pages-api/overview/#permissions)

[Page Search](https://developers.facebook.com/docs/pages-api/overview/#page-search)

[Rate Limits](https://developers.facebook.com/docs/pages-api/overview/#rate-limits)

[Tasks](https://developers.facebook.com/docs/pages-api/overview/#tasks)

[Messenger Platform](https://developers.facebook.com/docs/pages-api/overview/#messenger-platform)

[Meta Webhooks for Pages](https://developers.facebook.com/docs/pages-api/overview/#meta-webhooks-for-pages)

[App Review](https://developers.facebook.com/docs/pages-api/overview/#app-review)

[How It Works](https://developers.facebook.com/docs/pages-api/overview/#how-it-works)

[Next Steps](https://developers.facebook.com/docs/pages-api/overview/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/overview/#see-also)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close