---
url: https://developers.facebook.com/docs/threads/get-started/long-lived-tokens
title: Long-Lived Access Tokens - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fget-started%2Flong-lived-tokens%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
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

[Long-Lived Access Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#long-lived-access-tokens)

[Get a Long-Lived Token](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#get-a-long-lived-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#parameters)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-request)

[Sample Response](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-response)

[Refresh a Long-Lived Token](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#refresh-a-long-lived-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#parameters-2)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-response-2)

# Long-Lived Access Tokens

By default, Threads user access tokens are short-lived and are valid for one hour. However, short-lived tokens can be exchanged for long-lived tokens.

Long-lived tokens are valid for 60 days and can be refreshed as long as they are at least 24 hours old but have not expired, and the app user has granted your app the `threads_basic` permission. Refreshed tokens are valid for 60 days from the date at which they are refreshed. Tokens that have not been refreshed in 60 days will expire and can no longer be refreshed.

Long-lived access tokens for private Threads profiles can now be refreshed. In addition, permissions granted to apps by app users with private profiles are now valid for 90 days.

### Limitations

- Expired short-lived tokens cannot be exchanged for long-lived tokens. If the user’s token has expired, get a new one before exchanging it for a long-lived token.
- Requests for long-lived tokens include your app secret so should only be made in server-side code, never in client-side code or in an app binary that could be decompiled. Do not share your app secret with anyone, expose it in code, send it to a client, or store it in a device.

## Get a Long-Lived Token

Use the `GET /access_token` endpoint to exchange a short-lived Threads user access token for a long-lived token. Once you have a long-lived token, you can use it in server-side requests or send it to the client for use there.

Your request must be made server-side and include:

- A valid (unexpired) short-lived Threads user access token.
- Your Threads app secret ( **App Dashboard** \> **App settings** \> **Basic** \> **Threads App secret**).

### Parameters

Include the following query string parameters to augment the request.

| Name | Description |
| --- | --- |
| `client_secret`<br>string | **Required.**<br>Your Threads app's secret, displayed in the **App Dashboard** \> **App settings** \> **Basic** \> **Threads App secret** field. |
| `grant_type`<br>string | **Required.**<br>Set this to `th_exchange_token`. |
| `access_token`<br>string | **Required.**<br>The valid (unexpired) short-lived Threads user access token that you want to exchange for a long-lived token. |

### Sample Request

```code
curl -i -X GET "https://graph.threads.net/access_token
  ?grant_type=th_exchange_token
  &client_secret=<THREADS_APP_SECRET>
  &access_token=<SHORT_LIVED_ACCESS_TOKEN>"
```

### Sample Response

```code
{
  "access_token": "<LONG_LIVED_USER_ACCESS_TOKEN>",
  "token_type": "bearer",
  "expires_in": 5183944  // number of seconds until token expires
}
```

## Refresh a Long-Lived Token

Use the `GET /refresh_access_token` endpoint to refresh unexpired long-lived Threads user access tokens. Refreshing a long-lived token makes it valid for 60 days again. Long-lived tokens that have not been refreshed in 60 days will expire.

Your request must include:

- A valid (unexpired) long-lived Threads user access token.

### Parameters

| Name | Description |
| --- | --- |
| `grant_type`<br>string | **Required.**<br>Set this to `th_refresh_token`. |
| `access_token`<br>string | **Required.**<br>The valid (unexpired) long-lived Threads user access token that you want to refresh. |

### Sample Request

```code
curl -i -X GET "https://graph.threads.net/refresh_access_token
  ?grant_type=th_refresh_token
  &access_token=<LONG_LIVED_ACCESS_TOKEN>"
```

### Sample Response

```code
{
  "access_token": "<LONG_LIVED_USER_ACCESS_TOKEN>",
  "token_type": "bearer",
  "expires_in": 5183944 // number of seconds until token expires
}
```

On This Page

[Long-Lived Access Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#long-lived-access-tokens)

[Get a Long-Lived Token](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#get-a-long-lived-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#parameters)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-request)

[Sample Response](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-response)

[Refresh a Long-Lived Token](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#refresh-a-long-lived-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#parameters-2)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens#sample-response-2)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close