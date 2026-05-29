---
url: https://developers.facebook.com/docs/threads/reference/user
title: User - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Fuser%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[User](https://developers.facebook.com/docs/threads/reference/user#user)

[GET /{threads-user-id}/threads](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters)

[GET /{threads-user-id}?fields=id,username,...](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--fields-id-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-2)

[GET /profile\_lookup?username=...](https://developers.facebook.com/docs/threads/reference/user#get--profile-lookup-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-3)

[GET /profile\_posts?username=...](https://developers.facebook.com/docs/threads/reference/user#get--profile-posts-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-4)

[GET /{threads-user-id}/threads\_publishing\_limit](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-5)

[GET /{threads-user-id}/replies](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--replies)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-6)

[GET /{threads-user-id}/mentions](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--mentions)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-7)

[GET /{threads-user-id}/ghost\_posts](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--ghost-posts)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-8)

# User

The Threads user endpoints allow you to retrieve a Threads user's posts, publishing limit, and profile. See [Threads Profiles](https://developers.facebook.com/docs/threads/threads-profiles) for more information.

## `GET /{threads-user-id}/threads`

Retrieve a paginated list of all Threads posts created by a user. See [Retrieve a List of an App-Scoped User's Threads](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts#retrieve-a-list-of-an-app-scoped-user-s-threads) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `owner`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `alt_text`, `link_attachment_url`, `has_replies`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `is_spoiler_media`, `text_entities`, `text_attachment`, `is_verified`, `profile_picture_url` |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

* * *

## `GET /{threads-user-id}?fields=id,username,...`

Retrieve profile information about a user on Threads. See [Retrieve a Threads App-Scoped User's Profile Information](https://developers.facebook.com/docs/threads/threads-profiles#retrieve-a-threads-user-s-profile-information) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `username`, `name`, `threads_profile_picture_url`, `threads_biography`, `is_verified`, `recently_searched_keywords` |

* * *

## `GET /profile_lookup?username=...`

Look up a public profile and retrieve their basic profile information. See [Retrieve a Threads User's Public Profile Information](https://developers.facebook.com/docs/threads/threads-profiles#retrieve-a-threads-user-s-public-profile-information) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `username`<br>string | **Required.**<br>Handle or unique username on Threads. Must be an exact match. |

* * *

## `GET /profile_posts?username=...`

Look up a public profile and retrieve their posts on Threads. See [Retrieve a List of a Public Profile's Threads](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts#retrieve-a-list-of-a-public-profile-s-threads) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `username`<br>string | **Required.**<br>Handle or unique username on Threads. Must be an exact match. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `alt_text`, `link_attachment_url`, `has_replies`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `is_spoiler_media`, `text_entities` |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

* * *

## `GET /{threads-user-id}/threads_publishing_limit`

Check the app user's current publishing rate limit usage. See [Rate Limiting](https://developers.facebook.com/docs/threads/overview#rate-limiting) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`quota_usage` _(default)_, `config`, `reply_quota_usage`, `reply_config`, `delete_quota_usage`, `delete_config`, `location_search_quota_usage`, `location_search_config` |

* * *

## `GET /{threads-user-id}/replies`

Retrieve a paginated list of all Threads replies created by a user. See [Retrieve a List of All a User's Replies](https://developers.facebook.com/docs/threads/reply-management#retrieve-a-list-of-all-a-user-s-replies) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `threads-user-id`<br>string | **Required.**<br>The path parameter of the Threads user identifier. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `media_product_type`, `media_type`, `media_url`, `permalink`, `username`, `text`, `timestamp`, `shortcode`, `thumbnail_url`, `children`, `is_quote_post`, `has_replies`, `root_post`, `replied_to`, `is_reply`, `is_reply_owned_by_me`, `reply_audience`, `quoted_post`, `reposted_post`, `gif_url`, `is_verified`, `profile_picture_url` |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

* * *

## `GET /{threads-user-id}/mentions`

Retrieve a paginated list of all Threads posts where a user is mentioned. See [Mentions](https://developers.facebook.com/docs/threads/threads-mentions) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the [fields](https://developers.facebook.com/docs/threads/threads-media#fields) to be returned. If omitted, default fields will be returned. |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

## `GET /{threads-user-id}/ghost_posts`

Retrieve a paginated list of all Threads ghost posts created by a user. See [Retrieve a List of an App-Scoped User's Ghost Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts#retrieve-a-list-of-an-app-scoped-user-s-ghost-posts) for more information.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the [fields](https://developers.facebook.com/docs/threads/threads-media#fields) to be returned. If omitted, default fields will be returned. |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `before` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |
| `after` | **Optional.**<br>Query string parameter representing a cursor that can be used for pagination, both `before` and `after` parameters cannot be passed at the same time. |

On This Page

[User](https://developers.facebook.com/docs/threads/reference/user#user)

[GET /{threads-user-id}/threads](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters)

[GET /{threads-user-id}?fields=id,username,...](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--fields-id-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-2)

[GET /profile\_lookup?username=...](https://developers.facebook.com/docs/threads/reference/user#get--profile-lookup-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-3)

[GET /profile\_posts?username=...](https://developers.facebook.com/docs/threads/reference/user#get--profile-posts-username----)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-4)

[GET /{threads-user-id}/threads\_publishing\_limit](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-5)

[GET /{threads-user-id}/replies](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--replies)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-6)

[GET /{threads-user-id}/mentions](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--mentions)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-7)

[GET /{threads-user-id}/ghost\_posts](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--ghost-posts)

[Parameters](https://developers.facebook.com/docs/threads/reference/user#parameters-8)