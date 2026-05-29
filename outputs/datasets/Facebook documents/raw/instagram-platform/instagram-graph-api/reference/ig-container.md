---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/
title: IG Container - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-container%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Instagram (IG) Container](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#instagram--ig--container)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#reading)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#response)

[Example Request](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#example-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#sample-response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#deleting)

# Instagram (IG) Container

Represents a media container for publishing an Instagram media object.

### Requirements

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User user access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_content_publish` | - `instagram_basic`<br>- `instagram_content_publish`<br>- `pages_read_engagement`<br>If the app user was granted a role via the Business Manager on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to the targeted IG User, you will also need one of:<br>- `ads_management`<br>- `ads_read` |

## Creating

This operation is not supported.

## Reading

**`GET <HOST_URL>/<IG_CONTAINER_ID>`**

Get [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#fields) and [edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#edges) on an IG Container.

### Request Syntax

```code
GET <HOST_URL>/<API_VERSION>/<IG_CONTAINER_ID>
  ?fields=<LIST_OF_FIELDS>
  &access_token=<ACCESS_TOKEN>
```

### Query String Parameters

| Parameter | Value |
| --- | --- |
| `access_token`<br>**Required**<br>_String_ | The app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `fields`<br>_Comma-separated list_ | A comma-separated list of [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#fields) and [edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#edges) you want returned. If omitted, default fields will be returned. |

### Fields

| Field Name | Description |
| --- | --- |
| `copyright_check_status` | Used to determine if an uploaded video is violating copyright. Key-values pairs return include:<br>- `matches_found`set to one of the following: <br>  <br>  <br>  - `true` – the video is violating copyright<br>  - `false` – the video is not violating copyright<br>- `status`set to one of the following:<br>  <br>  <br>  - `completed` – the detection process has finished<br>  - `error` – an error occurred during the detection process<br>  - `in_progress` – the detection process is ongoing<br>  - `not_started` – the detection process has not started |
| `id` | Instagram Container ID, represented in code examples as `<IG_CONTAINER_ID>` |
| `status` | Publishing status. If `status_code` is `ERROR`, this value will be an [error subcode](https://developers.facebook.com/docs/instagram-api/reference/error-codes). |
| `status_code` | The container's publishing status. Possible values:<br>- `EXPIRED` — The container was not published within 24 hours and has expired.<br>- `ERROR` — The container failed to complete the publishing process.<br>- `FINISHED` — The container and its media object are ready to be published.<br>- `IN_PROGRESS` — The container is still in the publishing process.<br>- `PUBLISHED` — The container's media object has been published. |

### Edges

There are no edges on this node.

### Response

A JSON-formatted object containing default and requested [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#fields).

```json
{
  "<FIELD>":"<VALUE>",
  ...
}
```

### Example Request

```curl
curl -X GET \
  'https://graph.instagram.com/17889615691921648?fields=status_code&access_token=IGQVJ...'
```

### Sample Response

```json
{
  "status_code": "FINISHED",
  "id": "17889615691921648"
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Instagram (IG) Container](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#instagram--ig--container)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#reading)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#response)

[Example Request](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#example-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#sample-response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container/#deleting)