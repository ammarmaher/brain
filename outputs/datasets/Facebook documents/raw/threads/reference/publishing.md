---
url: https://developers.facebook.com/docs/threads/reference/publishing/
title: Publishing - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Fpublishing%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Publishing](https://developers.facebook.com/docs/threads/reference/publishing/#publishing)

[POST /{threads-user-id}/threads](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-user-id--threads)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters)

[POST /{threads-user-id}/threads\_publish](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-user-id--threads-publish)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-2)

[GET /{threads-container-id}?fields=status](https://developers.facebook.com/docs/threads/reference/publishing/#get---threads-container-id--fields-status)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-3)

[POST /{threads-media-id}/repost](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-media-id--repost)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-4)

[DELETE /{threads-media-id}](https://developers.facebook.com/docs/threads/reference/publishing/#delete---threads-media-id-)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-5)

# Publishing

The Threads publishing endpoints allow you to upload and publish Threads media objects and check their status. See [Post to Threads](https://developers.facebook.com/docs/threads/posts) for more information.

## `POST /{threads-user-id}/threads`

Upload media and create media containers. See [Posts](https://developers.facebook.com/docs/threads/posts) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `media_type`<br>string | **Required.**<br>**Values:**`TEXT`, `IMAGE`, `VIDEO`, `CAROUSEL` |
| `text`<br>string | **Optional.**<br>The text associated with the post. Uses [UTF-8 encoding](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgrapheme-splitter&h=AUAgSlURXzpz-32YQll-cN7dfxJT53ERdUg37ZNikosHTvlxWcG75sVKQFM0bxrMAzJxW7PCexXTlvmhyEn5oc1Fv7iD_QrYL8_tSmfmYyn1S7SEgd9c8kwkhNvO36U--JpWchSvyDGWRg). For text-only posts, this parameter is **required**.<br>**Note:** For the post character limit, emojis are counted as the number of UTF-8 bytes. |
| `image_url`<br>string | **Optional.**<br>Required if `media_type=IMAGE`. |
| `video_url`<br>string | **Optional.**<br>Required if `media_type=VIDEO`. |
| `is_carousel_item`<br>Boolean | **Optional.**<br>**Values:**`true`, `false` (default) |
| `children`<br>array | **Optional.**<br>Required if `media_type=CAROUSEL`. |
| `reply_to_id`<br>string | **Optional.**<br>Required if replying to a post. |
| `reply_control`<br>string | **Optional.**<br>Can be used to specify who can reply to a post.<br>**Values:**`everyone`, `accounts_you_follow`, `mentioned_only`, `parent_post_author_only`, `followers_only` |
| `allowlisted_country_codes`<br>list<string> | **Optional.**<br>A string list of valid [ISO 3166-1 alpha-2 country codes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.iso.org%2Fobp%2Fui%2F%23search&h=AUAvHSk3Q4o79hM77NG3KVbGxAHDKXa8_OwRpMWsvLkqVBasKuqdPKGwGsFgR7xQvdS2Hs0tBoyBrRZiL6y103IyotZiwGBUEtChRO7hLc6FseZyiRGa72x42-ZpEsPHhlDBFNhz4UjU2w) that represents the countries where this media should be shown. If this parameter is passed in, the media will not be shown to Threads profiles in countries outside of this list. |
| `alt_text`<br>string | **Optional.**<br>The accessibility text label or description for an image or video in a Threads post.<br>**Note:** The maximum length of `alt_text` is 1,000 characters. |
| `link_attachment`<br>string | **Optional.**<br>The URL attached to a Threads post. |
| `quote_post_id`<br>string | **Optional.**<br>ID of the post that is intended to be quoted. |
| `poll_attachment`<br>object | **Optional.**<br>The options for a post with a poll attachment. |
| `auto_publish_text`<br>Boolean | **Optional.**<br>When this optional flag is passed, a Threads post is published automatically when a Threads [media container](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container) is created without needing to go through the extra [publish step](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container).<br>**Note:** This only works for text posts. |
| `topic_tag`<br>string | **Optional.**<br>The topic to add to a post.<br>**Note:** The following characters are not allowed in topic tags:<br>- Periods (.)<br>- Ampersands (&) |
| `is_spoiler_media`<br>Boolean | **Optional.**<br>Indicates if the media should be a spoiler or not.<br>**Values:**`true`, `false` |
| `text_entities`<br>object | **Optional.**<br>The spoiler settings for the post. |
| `text_attachment`<br>object | **Optional.**<br>The text attachment for the post. |
| `gif_attachment`<br>object | **Optional.**<br>The ID and GIF provider for the GIF to attach to the post.<br>**Fields:**`gif_id`, `provider` |
| `is_ghost_post`<br>Boolean | **Optional**<br>Indicates if the post is a ghost post or not.<br>**Values:**`true`, `false` |
| `enable_reply_approvals`<br>Boolean | **Optional**<br>Indicates if the post should have reply approvals enabled.<br>**Values:**`true`, `false` |
| `crossreshare_to_ig`<br>Boolean | **Optional.**<br>Cross-shares a Threads post to a linked Instagram account as a Story when set to `true`.<br>**Values:**`true`, `false` ( _default_) |
| `crossreshare_to_ig_dark_mode`<br>Boolean | **Optional.**<br>Cross-shares a Threads post to a linked Instagram account as a Story in dark mode when set to `true`.<br>**Values:**`true`, `false` ( _default_) |
| `location_id`<br>string | **Optional.**<br>The ID of the location being tagged.<br>**Note:** Use the [`GET /location_search`](https://developers.facebook.com/docs/threads/reference/location-search) endpoint to find location IDs. |

* * *

## `POST /{threads-user-id}/threads_publish`

Publish uploaded media using their media containers. See [Posts](https://developers.facebook.com/docs/threads/posts) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `creation_id`<br>string | **Required.**<br>Identifier of the Threads media container. |

* * *

## `GET /{threads-container-id}?fields=status`

Check the Threads media container publishing eligibility and status.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-container-id`<br>string | **Required.**<br>The path parameter of the Threads media container identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `status` _(default)_, `error_message` |

## `POST /{threads-media-id}/repost`

Repost a Threads post that was previously published. See [Reposts](https://developers.facebook.com/docs/threads/posts/reposts) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |

## `DELETE /{threads-media-id}`

Delete a Threads post. See [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |

On This Page

[Publishing](https://developers.facebook.com/docs/threads/reference/publishing/#publishing)

[POST /{threads-user-id}/threads](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-user-id--threads)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters)

[POST /{threads-user-id}/threads\_publish](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-user-id--threads-publish)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-2)

[GET /{threads-container-id}?fields=status](https://developers.facebook.com/docs/threads/reference/publishing/#get---threads-container-id--fields-status)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-3)

[POST /{threads-media-id}/repost](https://developers.facebook.com/docs/threads/reference/publishing/#post---threads-media-id--repost)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-4)

[DELETE /{threads-media-id}](https://developers.facebook.com/docs/threads/reference/publishing/#delete---threads-media-id-)

[Parameters](https://developers.facebook.com/docs/threads/reference/publishing/#parameters-5)