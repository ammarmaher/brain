---
url: https://developers.facebook.com/docs/threads/get-started/
title: Get Started - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fget-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)


  - [Create an app](https://developers.facebook.com/docs/threads/get-started/create-an-app)
  - [Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions)
  - [Long-Lived Access Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens)
  - [App Access Tokens](https://developers.facebook.com/docs/threads/get-started/app-access-tokens)

- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Get Started](https://developers.facebook.com/docs/threads/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/threads/get-started/#before-you-start)

[Meta App](https://developers.facebook.com/docs/threads/get-started/#meta-app)

[Public Server](https://developers.facebook.com/docs/threads/get-started/#public-server)

[Authorization](https://developers.facebook.com/docs/threads/get-started/#authorization)

[Threads User Access Tokens](https://developers.facebook.com/docs/threads/get-started/#threads-user-access-tokens)

[Authorization Window](https://developers.facebook.com/docs/threads/get-started/#authorization-window)

[Authorization Codes](https://developers.facebook.com/docs/threads/get-started/#authorization-codes)

[Threads Testers](https://developers.facebook.com/docs/threads/get-started/#threads-testers)

[Sample App](https://developers.facebook.com/docs/threads/get-started/#sample-app)

[Next Steps](https://developers.facebook.com/docs/threads/get-started/#next-steps)

# Get Started

To access the Threads API, create an app and pick the [Threads Use Case](https://developers.facebook.com/docs/development/create-an-app/threads-use-case).

This guide provides information on what you need to get started using the Threads API.

## Before You Start

You need the following:

### Meta App

A [Meta app](https://developers.facebook.com/apps) created with the [Threads use case](https://developers.facebook.com/docs/development/create-an-app/threads-use-case).

**Note:** When creating your app there will be 2 app IDs and app secrets. For Threads API implementation purposes, use the Threads app ID and its corresponding app secret.

### Public Server

We download media used in publishing attempts so the media must be hosted on a publicly accessible server at the time of the attempt.

### Authorization

Data access authorization is controlled by your app users through the use of the permissions listed below. Users must grant your app these permissions through the [Authorization Window](https://developers.facebook.com/docs/threads/get-started/#authorization-window) before your app can access their data. For more details, refer to our [Permissions guide](https://developers.facebook.com/docs/permissions#t).

- `threads_basic` — Required for all Threads endpoints.
- `threads_content_publish` — Required for Threads publishing endpoints only.
- `threads_manage_replies` — Required for making `POST` calls to reply endpoints.
- `threads_read_replies` — Required for making `GET` calls to reply endpoints.
- `threads_manage_insights` — Required for making `GET` calls to insights endpoints.

[Threads testers](https://developers.facebook.com/docs/threads/get-started/#threads-testers) can grant your app these permissions at any time. In order for app users without a role on your app to be able to grant your app these permissions, each permission must first be approved through the [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review) process, and your app must be published.

Permission grants made by app users with public profiles are valid for 90 days. [Refreshing](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#refresh-a-long-lived-token) an app user's long-lived access token will extend the permission grant for another 90 days if the app user who granted the token has a public profile. If the app user's profile is [private](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F225222310104065&h=AUCmTdUDnpIJAsPpvbn03r0TKCd-hGEIO3Mg38ubKMbcAjaotvGXoW1a86yQLE9k2QCS0SyV5zuf16W-bUn-d4psdoIIDV7VAcUviyv5GGpcNo_GXwVBwobSIRJltXY5ziMwkZhUusyl-g), however, the permission grant cannot be extended and the app user must grant the expired permission to your app again.

### Threads User Access Tokens

API authentication is handled by Threads user access tokens that conform to the OAuth 2.0 protocol. Access tokens are app-scoped (unique to the app and user pair) and can be short-lived or long-lived. API requests that query Threads users or publish Threads media must include a Threads user access token. Use the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to debug your Threads User Access Token.

#### Short-Lived Access Tokens

Short-lived access tokens are valid for 1 hour, but can be exchanged for [long-lived tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens). To get a short-lived access token, implement the [Authorization Window](https://developers.facebook.com/docs/threads/get-started/#authorization-window) into your app. After the app user authenticates their identity through the window, we will redirect the user back to your app and include an [authorization code](https://developers.facebook.com/docs/threads/get-started/#authorization-codes), which you can then [exchange for a short-lived access token](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions).

#### Long-Lived Access Tokens

Short-lived tokens that have not expired can be [exchanged for long-lived access tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens), which are valid for 60 days. Long-lived tokens can be [refreshed](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#refresh-a-long-lived-token) before they expire by querying the `GET /refresh_access_token` endpoint.

### Authorization Window

The Authorization Window allows your app to get [authorization codes](https://developers.facebook.com/docs/threads/get-started/#authorization-codes) and [permissions](https://developers.facebook.com/docs/permissions#t) from app users. Authorization codes can be exchanged for [Threads user access tokens](https://developers.facebook.com/docs/threads/get-started/#threads-user-access-tokens), which must be included when fetching an app user's profile, retrieving Threads media, publishing posts, reading replies, managing replies, or viewing insights.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1192671261765235&version=1776674548)

To implement the Authorization Window, refer to the [Getting Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions) guide.

### Authorization Codes

Authorization codes can be exchanged for short-lived [Threads user access tokens](https://developers.facebook.com/docs/threads/get-started/#threads-user-access-tokens). To get an authorization code, implement the [Authorization Window](https://developers.facebook.com/docs/threads/get-started/#authorization-window) into your app. After an app user authenticates their identity through the window and grants your app any permissions it needs, we will redirect the user to your app and include an authorization code. You can then use the API to exchange the code for the app user's short-lived Threads user access token.

**Note:** Authorization codes are short-lived and are only valid for 1 hour.

### Threads Testers

In order to test your app with a Threads user, you must first send an invitation to the Threads user's profile and accept the invitation. Invitations can be sent by clicking on the **Add People** button and selecting **Threads Tester** in the **App Dashboard** \> **App roles** \> **Roles** tab.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=497641556053806&version=1776674548)

Invitations can be accepted by the Threads user in the **Website permissions** section under [**Account Settings**](https://www.threads.net/settings/account) of the Threads website or mobile app after signing into their account.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=856199969685140&version=1776674548)

## Sample App

Our open-source [Threads API sample app](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Fthreads_api&h=AUB4DbnN9g0NPZwrylHB4rJQp2aea7kBbgIehw9A4rtqwhBC5PGQTtqOKG67BJzolXhWucO_6SGkssZtxiRQ7rg3ECAkICR5GxSKyQFB8PjEFIcZYwmDR3iJGUZob1xjHTZyeq5n06cPcA) serves as a practical guide, enabling you to better understand the API and troubleshoot any issues by referencing a working implementation. This can simplify the integration process, accelerate development time, and ensure a smoother implementation experience.

## Next Steps

- Make [Single Thread Posts](https://developers.facebook.com/docs/threads/posts#single-thread-posts)
- Make [Carousel Posts](https://developers.facebook.com/docs/threads/posts#carousel-posts)
- [Retrieve Threads Media](https://developers.facebook.com/docs/threads/threads-media)

On This Page

[Get Started](https://developers.facebook.com/docs/threads/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/threads/get-started/#before-you-start)

[Meta App](https://developers.facebook.com/docs/threads/get-started/#meta-app)

[Public Server](https://developers.facebook.com/docs/threads/get-started/#public-server)

[Authorization](https://developers.facebook.com/docs/threads/get-started/#authorization)

[Threads User Access Tokens](https://developers.facebook.com/docs/threads/get-started/#threads-user-access-tokens)

[Authorization Window](https://developers.facebook.com/docs/threads/get-started/#authorization-window)

[Authorization Codes](https://developers.facebook.com/docs/threads/get-started/#authorization-codes)

[Threads Testers](https://developers.facebook.com/docs/threads/get-started/#threads-testers)

[Sample App](https://developers.facebook.com/docs/threads/get-started/#sample-app)

[Next Steps](https://developers.facebook.com/docs/threads/get-started/#next-steps)