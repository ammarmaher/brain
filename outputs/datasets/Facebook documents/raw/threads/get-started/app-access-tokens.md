---
url: https://developers.facebook.com/docs/threads/get-started/app-access-tokens
title: App Access Tokens - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fget-started%2Fapp-access-tokens%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[App Access Tokens](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#app-access-tokens)

[Generating an app access token](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#generating-an-app-access-token)

[Example request](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-request)

[Example response](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-response)

[Alternate method](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#alternate-method)

[Example request](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-request-2)

# App Access Tokens

App access tokens are used to make requests to the Threads API on behalf of an app rather than a user. Certain APIs require app access tokens instead of user access tokens, such as the [oEmbed API](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post).

## Generating an app access token

To generate an app access token, you need:

- Your Threads app ID
- Your Threads app secret

### Example request

```html
curl -X GET https://graph.threads.net/oauth/access_token
  ?client_id=<APP_ID>
  &client_secret=<APP_SECRET>
  &grant_type=client_credentials
```

### Example response

```html
{
  "access_token": "TH|<APP_ID>|<ACCESS_TOKEN>",
  "token_type": "bearer"
}
```

This call will return an app access token that can be used in place of a user access token to make API calls as noted above.

**Note:** Because this request uses your app secret, it must never be made in client-side code or in an app binary that could be decompiled. It is important that your app secret is never shared with anyone. Therefore, this API call should only be made using server-side code.

## Alternate method

There is another method to make calls to the Threads API on behalf of an app which doesn't require using a generated app access token. You can just pass your app ID and app secret as the `access_token` parameter when you make a call.

### Example request

```html
curl -X GET https://graph.threads.net/<API_ENDPOINT>
  ?access_tokens=TH|<APP_ID>|<APP_SECRET>&...
```

The choice to use a generated access token or this method depends on where you hide your app secret.

On This Page

[App Access Tokens](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#app-access-tokens)

[Generating an app access token](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#generating-an-app-access-token)

[Example request](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-request)

[Example response](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-response)

[Alternate method](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#alternate-method)

[Example request](https://developers.facebook.com/docs/threads/get-started/app-access-tokens#example-request-2)