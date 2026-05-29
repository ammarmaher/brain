---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag
title: IG Hashtag - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-hashtag%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)


  - [Error Codes](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes)
  - [Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token)
  - [IG Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment)
  - [IG Container](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container)
  - [IG Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search)
  - [IG Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag)


    - [Recent Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media)
    - [Top Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/top-media)

  - [IG Media](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media)
  - [IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user)
  - [/me](https://developers.facebook.com/docs/instagram-platform/reference/me)
  - [Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize)
  - [Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page)
  - [Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)

- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Instagram (IG) Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#instagram--ig--hashtag)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#response)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#sample-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#sample-response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#deleting)

# Instagram (IG) Hashtag

Represents an Instagram hashtag.

### Limitations

- Only available for Facebook Login for Business

## Creating

This operation is not supported.

## Reading

**`GET /<IG_HASHTAG_ID>`**

Returns [Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#fields) and [Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#edges) on an IG Hashtag.

### Limitations

You can query a maximum of 30 unique hashtags [within a 7 day period](https://developers.facebook.com/docs/instagram-api/reference/ig-user/recently_searched_hashtags).

### Requirements

| Type | Description |
| --- | --- |
| [Features](https://developers.facebook.com/docs/feature-reference) | `Instagram Public Content Access` |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic`<br>If the token is from a User whose Page role was granted via the Business Manager, one of the following permissions is also required: `ads_management`, `business_management`, or `pages_read_engagement`. |
| Tokens | The app user's User access token. |

### Request Syntax

```code
GET https://graph.facebook.com/<IG_HASHTAG_ID>
  ?fields={fields}
  &access_token={access-token}
```

### Query String Parameters

Include the following query string parameters to augment the request.

| Key | Value |
| --- | --- |
| `access_token`<br>**Required**<br>_String_ | The app user's Instagram User Access Token. |
| `fields`<br>_Comma-separated list_ | A comma-separated list of [Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#fields) and [Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#edges) you want returned. If omitted, default fields will be returned. |

### Fields

You can use the `fields` query string parameter to request the following Fields on an IG Hashtag.

| Field Name | Description |
| --- | --- |
| `id` | The hashtag's ID (included by default). IDs are static and global. |
| `name` | The hashtag's name, without the leading hash symbol. |

### Edges

You can request the following edges as path parameters or by using the `fields` query string parameter.

| Edge | Description |
| --- | --- |
| [`recent_media`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag/recent-media#reading) | Get a list of the most recently published photo and video [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects published with a specific hashtag. |
| [`top_media`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag/top-media#reading) | Returns the most popular photo and video [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects that have been tagged with the hashtag. |

### Response

A JSON-formatted object containing default and requested [Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#fields).

```json
{
  "<FIELD_NAME>":"<FIELD_VALUE",
  ...
}
```

### Sample Request

```code
GET https://graph.facebook.com/17841593698074073
  ?fields=id,name
  &access_token=EAADd...
```

### Sample Response

```code
{
  "id": "17841593698074073",
  "name": "coke"
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Instagram (IG) Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#instagram--ig--hashtag)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#response)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#sample-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#sample-response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag#deleting)