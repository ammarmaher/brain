---
url: https://developers.facebook.com/docs/threads/reference/reply-management
title: Reply Management - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Freply-management%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Reply Management](https://developers.facebook.com/docs/threads/reference/reply-management#reply-management)

[GET /{threads-media-id}/replies](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--replies)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters)

[GET /{threads-media-id}/conversation](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--conversation)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters-2)

[POST /{threads-reply-id}/manage\_reply](https://developers.facebook.com/docs/threads/reference/reply-management#post---threads-reply-id--manage-reply)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters-3)

[GET /{threads-media-id}/pending\_replies](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--pending-replies)

[POST /{threads-reply-id}/manage\_pending\_reply](https://developers.facebook.com/docs/threads/reference/reply-management#post---threads-reply-id--manage-pending-reply)

# Reply Management

The Threads reply management endpoints allow you to retrieve replies and conversations and hide/unhide replies. See [Threads Reply Management API](https://developers.facebook.com/docs/threads/reply-management) for more information.

## `GET /{threads-media-id}/replies`

Retrieve a paginated list of all top-level replies for a Threads media object. See [Replies](https://developers.facebook.com/docs/threads/reply-moderation#replies) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `has_replies`, `root_post`, `replied_to`, `is_reply`, `is_reply_owned_by_me`, `hide_status`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `topic_tag`, `is_verified`, `profile_picture_url` |
| `reverse`<br>Boolean | **Optional.**<br>Whether or not replies should be sorted in reverse chronological order.<br>**Values:**`true` _(default)_, `false` |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

* * *

## `GET /{threads-media-id}/conversation`

Retrieve a paginated and flattened list of all top-level and nested replies for a Threads media object. See [Conversations](https://developers.facebook.com/docs/threads/reply-moderation#conversations) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `has_replies`, `root_post`, `replied_to`, `is_reply`, `is_reply_owned_by_me`, `hide_status`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `topic_tag`, `is_verified`, `profile_picture_url` |
| `reverse`<br>Boolean | **Optional.**<br>Whether or not replies should be sorted in reverse chronological order.<br>**Values:**`true` _(default)_, `false` |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

## `POST /{threads-reply-id}/manage_reply`

Hide or unhide a top-level reply on your Threads post. See [Hide Replies](https://developers.facebook.com/docs/threads/reply-moderation#hide-replies) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-reply-id`<br>string | **Required.**<br>The path parameter of the Threads reply media identifier. |
| `hide`<br>Boolean | **Required.**<br>Set to `true` to hide a reply and set to `false` to unhide a reply.<br>**Values:**`true`, `false` |

## `GET /{threads-media-id}/pending_replies`

Fetch a paginated list of all pending replies. See [Reply Approvals](https://developers.facebook.com/docs/threads/reply-management#reply-approvals) for more information.

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-media-id`<br>string | **Required.**<br>The path parameter of the Threads media identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `has_replies`, `root_post`, `replied_to`, `is_reply`, `is_reply_owned_by_me`, `hide_status`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `topic_tag`, `is_verified`, `profile_picture_url`, `reply_approval_status` |
| `reverse`<br>Boolean | **Optional.**<br>Whether or not replies should be sorted in reverse chronological order.<br>**Values:**`true` _(default)_, `false` |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

## `POST /{threads-reply-id}/manage_pending_reply`

Approve or ignore a pending reply on your Threads post. See [Reply Approvals](https://developers.facebook.com/docs/threads/reply-management#reply-approvals) for more information.

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-reply-id`<br>string | **Required.**<br>The path parameter of the Threads reply media identifier. |
| `approve`<br>Boolean | **Required.**<br>Set to `true` to approve a reply, and set to `false` to ignore a reply.<br>**Values:**`true`, `false` |

On This Page

[Reply Management](https://developers.facebook.com/docs/threads/reference/reply-management#reply-management)

[GET /{threads-media-id}/replies](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--replies)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters)

[GET /{threads-media-id}/conversation](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--conversation)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters-2)

[POST /{threads-reply-id}/manage\_reply](https://developers.facebook.com/docs/threads/reference/reply-management#post---threads-reply-id--manage-reply)

[Parameters](https://developers.facebook.com/docs/threads/reference/reply-management#parameters-3)

[GET /{threads-media-id}/pending\_replies](https://developers.facebook.com/docs/threads/reference/reply-management#get---threads-media-id--pending-replies)

[POST /{threads-reply-id}/manage\_pending\_reply](https://developers.facebook.com/docs/threads/reference/reply-management#post---threads-reply-id--manage-pending-reply)