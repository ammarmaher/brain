---
url: https://developers.facebook.com/docs/threads/reference/debug
title: Debug - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Fdebug%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Publishing](https://developers.facebook.com/docs/threads/reference/publishing)
  - [Media Retrieval](https://developers.facebook.com/docs/threads/reference/media-retrieval)
  - [Reply Management](https://developers.facebook.com/docs/threads/reference/reply-management)
  - [User](https://developers.facebook.com/docs/threads/reference/user)
  - [Locations](https://developers.facebook.com/docs/threads/reference/locations)
  - [Location Search](https://developers.facebook.com/docs/threads/reference/location-search)
  - [Insights](https://developers.facebook.com/docs/threads/reference/insights)
  - [oEmbed](https://developers.facebook.com/docs/threads/reference/oembed)
  - [Debug](https://developers.facebook.com/docs/threads/reference/debug)

- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Debug](https://developers.facebook.com/docs/threads/reference/debug#debug)

[GET /debug\_token](https://developers.facebook.com/docs/threads/reference/debug#get--debug-token)

[Parameters](https://developers.facebook.com/docs/threads/reference/debug#parameters)

[Fields](https://developers.facebook.com/docs/threads/reference/debug#fields)

# Debug

Retrieve various data about an access token. See [Debug Access Token](https://developers.facebook.com/docs/threads/troubleshooting/debug-access-token) for more information.

## `GET /debug_token`

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token of a Threads tester. |
| `input_token`<br>string | **Required.**<br>The access token to be inspected. |

**Note:** The `access_token` and `input_token` can be associated with different users but must be associated with the same app.

### Fields

| Name | Description |
| --- | --- |
| `data`<br>object | Data wrapper around the result. |
| `type`<br>string | Whether the access token is an app access token or user access token. |
| `application`<br>string | Name of the application this access token is for. |
| `data_access_expires_at`<br>Unixtime | Timestamp when the app's access to user data expires. |
| `expires_at`<br>Unixtime | Timestamp when this access token expires. |
| `is_valid`<br>Boolean | Whether the access token is still valid or not. |
| `issued_at`<br>Unixtime | Timestamp when this access token was issued. |
| `scopes`<br>string\[\] | List of permissions that the user has granted for the app in this access token. |
| `user_id`<br>string | The ID of the user this access token is for. |

On This Page

[Debug](https://developers.facebook.com/docs/threads/reference/debug#debug)

[GET /debug\_token](https://developers.facebook.com/docs/threads/reference/debug#get--debug-token)

[Parameters](https://developers.facebook.com/docs/threads/reference/debug#parameters)

[Fields](https://developers.facebook.com/docs/threads/reference/debug#fields)