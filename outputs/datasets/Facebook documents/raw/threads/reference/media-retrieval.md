---
url: https://developers.facebook.com/docs/threads/reference/media-retrieval
title: Media Retrieval - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Fmedia-retrieval%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Media Retrieval](https://developers.facebook.com/docs/threads/reference/media-retrieval#media-retrieval)

[GET /{threads-media-id}](https://developers.facebook.com/docs/threads/reference/media-retrieval#get---threads-media-id-)

[Parameters](https://developers.facebook.com/docs/threads/reference/media-retrieval#parameters)

[GET /keyword\_search](https://developers.facebook.com/docs/threads/reference/media-retrieval#get--keyword-search)

[Parameters](https://developers.facebook.com/docs/threads/reference/media-retrieval#parameters-2)

# Media Retrieval

You can retrieve Threads media objects by individual ID or by searching on a keyword. See [Retrieve Threads Media Objects](https://developers.facebook.com/docs/threads/threads-media) and [Keyword Search](https://developers.facebook.com/docs/threads/keyword-search) for more information on each method.

## `GET /{threads-media-id}`

Retrieve a Threads media object. See [Retrieve a Single Threads Media Object](https://developers.facebook.com/docs/threads/threads-media#retrieve-a-single-threads-media-object) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `owner`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `alt_text`, `link_attachment_url`, `has_replies`, `is_reply`, `is_reply_owned_by_me`, `root_post`, `replied_to`, `hide_status`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `poll_attachment`, `topic_tag`, `is_spoiler_media`, `text_entities`, `text_attachment`, `location_id` |

* * *

## `GET /keyword_search`

Search for public Threads media with specific keywords or topic tags. See [Keyword Search](https://developers.facebook.com/docs/threads/keyword-search) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `q`<br>string | **Required.**<br>The keyword(s) to be queried. |
| `search_type`<br>string | **Optional.**<br>Specifies the search behavior.<br>**Values:**<br>- `TOP` ( _default_) — To get the most popular search results.<br>- `RECENT` — To get the most recent search results. |
| `search_mode`<br>string | **Optional.**<br>Specifies the search mode.<br>**Values:**<br>- `KEYWORD` ( _default_) — The query will be treated as a keyword.<br>- `TAG` — The query will be treated as a topic tag. |
| `media_type`<br>string | **Optional.**<br>Specifies the type of media to search for. Only the media type values listed below are supported.<br>**Values:**<br>- `TEXT` — The query will search for text posts.<br>- `IMAGE` — The query will search for image posts.<br>- `VIDEO` — The query will search for video posts. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `alt_text`, `link_attachment_url`, `has_replies`, `is_reply`, `root_post`, `replied_to`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `poll_attachment`, `topic_tag` |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `author_username` | **Optional.**<br>Filters search results to include only posts created by the specified username or profile. The username must be an exact match without the `@` symbol. |

On This Page

[Media Retrieval](https://developers.facebook.com/docs/threads/reference/media-retrieval#media-retrieval)

[GET /{threads-media-id}](https://developers.facebook.com/docs/threads/reference/media-retrieval#get---threads-media-id-)

[Parameters](https://developers.facebook.com/docs/threads/reference/media-retrieval#parameters)

[GET /keyword\_search](https://developers.facebook.com/docs/threads/reference/media-retrieval#get--keyword-search)

[Parameters](https://developers.facebook.com/docs/threads/reference/media-retrieval#parameters-2)