---
url: https://developers.facebook.com/docs/threads/reference/insights/
title: Insights - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Finsights%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Insights](https://developers.facebook.com/docs/threads/reference/insights/#insights)

[GET /{threads-media-id}/insights](https://developers.facebook.com/docs/threads/reference/insights/#get---threads-media-id--insights)

[Parameters](https://developers.facebook.com/docs/threads/reference/insights/#parameters)

[GET /{threads-user-id}/threads\_insights](https://developers.facebook.com/docs/threads/reference/insights/#get---threads-user-id--threads-insights)

[Parameters](https://developers.facebook.com/docs/threads/reference/insights/#parameters-2)

# Insights

The Threads insights endpoints allow you to retrieve insights for Threads media objects and users. See [Threads Insights API](https://developers.facebook.com/docs/threads/insights) for more information.

## `GET /{threads-media-id}/insights`

Retrieve insights for a Threads media object. See [Media Insights](https://developers.facebook.com/docs/threads/insights#media-insights) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |
| `metric`<br>string | **Required.**<br>A comma-separated list of the metrics to be returned. Must be at least one of the metric values.<br>**Values:**`views`, `likes`, `replies`, `reposts`, `quotes`, `shares` |

* * *

## `GET /{threads-user-id}/threads_insights`

Retrieve insights for a Threads user object. See [User Insights](https://developers.facebook.com/docs/threads/insights#user-insights) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `since` | **Optional.**<br>Used in conjunction with the `until` parameter to define a range. If you omit `since` and `until`, it defaults to a 2-day range: yesterday through today.<br>**Format:** Unix Timestamp |
| `until` | **Optional.**<br>Used in conjunction with the `since` parameter to define a range. If you omit `since` and `until`, it defaults to a 2-day range: yesterday through today.<br>**Format:** Unix Timestamp |
| `metric`<br>string | **Required.**<br>A comma-separated list of the metrics to be returned. Must be at least one of the metric values.<br>**Values:**`views`, `likes`, `replies`, `reposts`, `quotes`, `clicks`, `followers_count`, `follower_demographics`<br>**Note:**`follower_demographics` is not compatible with the `since` and `until` parameters. |

On This Page

[Insights](https://developers.facebook.com/docs/threads/reference/insights/#insights)

[GET /{threads-media-id}/insights](https://developers.facebook.com/docs/threads/reference/insights/#get---threads-media-id--insights)

[Parameters](https://developers.facebook.com/docs/threads/reference/insights/#parameters)

[GET /{threads-user-id}/threads\_insights](https://developers.facebook.com/docs/threads/reference/insights/#get---threads-user-id--threads-insights)

[Parameters](https://developers.facebook.com/docs/threads/reference/insights/#parameters-2)