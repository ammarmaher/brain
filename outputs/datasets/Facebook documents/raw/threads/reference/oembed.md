---
url: https://developers.facebook.com/docs/threads/reference/oembed
title: oEmbed  - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Foembed%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[oEmbed](https://developers.facebook.com/docs/threads/reference/oembed#oembed)

[GET /oembed?url=...](https://developers.facebook.com/docs/threads/reference/oembed#get--oembed-url----)

[Parameters](https://developers.facebook.com/docs/threads/reference/oembed#parameters)

[Fields](https://developers.facebook.com/docs/threads/reference/oembed#fields)

# oEmbed

You can retrieve the embed HTML code and associated metadata of public Threads posts.

## `GET /oembed?url=...`

Retrieve the embed HTML of a public Threads post. See [Embed a Threads Post](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `url`<br>string | **Required.**<br>Permanent link to the post on Threads.<br>**Accepted formats:**<br>- `https://www.threads.com/@{username}/post/{media-shortcode}`<br>- `https://www.threads.com/t/{media-shortcode}`<br>**Examples:**<br>- https://www.threads.com/@meta/post/DDzbnVKx57R<br>- https://www.threads.com/t/DDzbnVKx57R |
| `maxwidth`<br>int64 | **Optional.**<br>Maximum width of returned media. Must be between 320 and 658. **Note:** The `maxheight` parameter is not supported because the embed code is responsive and its height varies depending on its width. |

### Fields

| Name | Description |
| --- | --- |
| `html`<br>string | The HTML used to display the post. |
| `provider_name`<br>string | Name of the provider (Threads). |
| `provider_url`<br>string | URL of the provider ( [https://www.threads.com/](https://www.threads.com/)). |
| `type`<br>string | The oEmbed resource type. See [https://oembed.com/](https://l.facebook.com/l.php?u=https%3A%2F%2Foembed.com%2F&h=AUBJKjiVJLhm4eMl9NBWd8rpgcXRwElcQqAEgJXBL2qZiX1BcvCqvP4ZaQQEkk4SgWSxV8fQRnrwDwJzAuB5jUCdDFLXAzgqgptNi0kmyzc7g5jjmffH_EyYBXLmVc80v4rw44PXoVF2tA). |
| `version`<br>string | Always 1.0. See [https://oembed.com/](https://l.facebook.com/l.php?u=https%3A%2F%2Foembed.com%2F&h=AUBvEmTDU_A01F2s7geMR4E6zRTEpfHSyJEgSMyJlHaZXkG_nSkcNZtRpmOjbAbV9zBXm2rIJTOqfojOkm9chG4BU-HplUnxAp54M3OvdXcfHv8WdzmDvO07UFeSNMTms9QybWPznwz5_8jBo_Nqg_D_gL0). |
| `width`<br>int32 | The width in pixels required to display the HTML. |

On This Page

[oEmbed](https://developers.facebook.com/docs/threads/reference/oembed#oembed)

[GET /oembed?url=...](https://developers.facebook.com/docs/threads/reference/oembed#get--oembed-url----)

[Parameters](https://developers.facebook.com/docs/threads/reference/oembed#parameters)

[Fields](https://developers.facebook.com/docs/threads/reference/oembed#fields)