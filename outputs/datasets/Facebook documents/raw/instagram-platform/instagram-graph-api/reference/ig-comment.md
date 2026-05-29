---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment
title: IG Comment - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-comment%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


    - [Replies](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies)

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

[Instagram (IG) Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#instagram--ig--comment)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#limitations)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#request-syntax)

[Path Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#path-parameters)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#updating)

[Hiding/Unhiding a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#hiding)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#deleting)

# Instagram (IG) Comment

Represents a comment on an [Instagram media object](https://developers.facebook.com/docs/instagram-api/reference/ig-media).

If you are migrating from Marketing API Instagram Ads endpoints to Instagram Platform endpoints, be aware that some field names are different.

Introducing the following fields:

- `legacy_instagram_comment_id`

The following fields are not supported:

- `comment_type`
- `mentioned_instagram_users`

### Requirements

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_read_engagement`<br>If the app user was granted a role via the Business Manager on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to the targeted IG User, you will also need one of:<br>- `ads_management`<br>- `ads_read` |

## Creating

This operation is not supported.

## Reading

**`GET <HOST_URL>/<IG_COMMENT_ID>?fields=<LIST_OF_FIELDS>`**

Get [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#fields) and [edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#edges) on an IG Comment.

### Limitations

- Requests cannot be performed on comments discovered through the Mentions API unless the request is made by the comment owner. Instead, use the Mentioned Comment node.
- Comments on age-gated media are not returned.
- Comments created by IG Users who have been restricted by the app user will not be returned unless the IG Users are unrestricted and the Comments are approved.
- Comments on live video IG Media can only be read while the IG Media upon which the comment was created is being broadcast.

### Request Syntax

```code
GET https://<HOST_URL>/<API_VERSION>/<IG_COMMENT_ID>
  ?fields=<LIST_OF_FIELDS>
  &access_token=<ACCESS_TOKEN>
```

### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<HOST_URL>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_COMMENT_ID>` | **Required.** IG Comment ID. |

### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token` | `<ACCESS_TOKEN>` | **Required.** App user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `fields` | `<LIST_OF_FIELDS>` | Comma-separated list of IG Comment [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#fields) you want returned for each IG Comment in the result set. |

### Fields

| Field Name | Description |
| --- | --- |
| `from` | An object containing:<br>- `id` — The [Instagram-scoped ID (IGSID)](https://developers.facebook.com/docs/instagram/platform/instagram-api/overview#igsid) of the Instagram user who created the IG Comment.<br>- `username` — Username of the Instagram user who created the IG Comment. |
| `hidden` | Indicates if comment has been hidden (`true`) or not (`false`). |
| `id` | IG Comment ID. |
| `like_count` | Number of likes on the IG Comment. |
| `legacy_instagram_comment_id` | The ID for Instagram comment that was created for Marketing API endpoints for v21.0 and older. |
| `media` | An object containing:<br>- `id` — ID of the [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media/) upon which the IG Comment was made.<br>- `media_product_type` — Published surface of the [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media/) (i.e. where the IG Media appears) upon which the IG Comment was made. |
| `parent_id` | ID of the parent IG Comment if this comment was created on another IG Comment (i.e. a reply to another comment. |
| `replies` | A list of replies (IG Comments) made on the IG Comment. |
| `text` | IG Comment text. |
| `timestamp` | ISO 8601 formatted timestamp indicating when IG Comment was created.<br>Example: `2017-05-19T23:27:28+0000`. |
| `user` | ID of IG User who created the IG Comment. Only returned if the app user created the IG Comment, otherwise `username` will be returned instead. |
| `username` | Username of Instagram user who created the IG Comment.<br>Starting August 27, 2024, the `instagram_manage_comments` permission (if your app uses Facebook login) and `instagram_business_manage_comments` permission (if your app uses Instagram login) will be required to access the `username` field of an Instagram user who commented on media of an app user's Instagram professional account. |

### Edges

| Edge | Description |
| --- | --- |
| [`replies`](https://developers.facebook.com/docs/instagram-api/reference/ig-comment/replies) | Get a list of IG Comments on the IG Comment; Create an IG Comment on an IG Comment. |

### Response

A JSON-formatted object containing default and requested [fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#fields) and [edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#edges).

```json
{
  "<FIELD>":"<VALUE>",
  ...
}
```

### cURL Example

#### Request

```curl
curl -i -X GET \
 "https://graph.instagram.com/v25.0/17881770991003328?fields=hidden%2Cmedia%2Ctimestamp&access_token=EAAOc..."
```

#### Response

```json
{
  "hidden": false,
  "media": {
    "id": "17856134461174448"
  },
  "timestamp": "2017-05-19T23:27:28+0000",
  "id": "17881770991003328"
}
```

## Updating

### Hiding/Unhiding a Comment

`POST <HOST_URL>/<IG_COMMENT_ID>?hide=<BOOLEAN>`

#### Query String Parameters

- `hide` (required) — Set to `true` to hide the comment, or `false` to show the comment.

#### Limitations

- Comments made by media object owners on their own media objects will always be displayed, even if the comments have been set to `hide=true`.
- Comments on live video IG Media are not supported.

#### Access token

A user access token from the user who owns the media object that was commented on.

#### Example Request

Hiding a comment:

```code
POST graph.instagram.com
  /17873440459141021?hide=true
```

#### Example Response

```code
{
  "success": true
}
```

## Deleting

### Deleting a Comment

`DELETE <HOST_URL>/<IG_COMMENT_ID>`

#### Access token

A User access token from a User who created the comment.

#### Limitations

- A comment can only be deleted by the owner of the object upon which the comment was made, even if the user attempting to delete the comment is the comment's author.
- Comments on live video IG Media are not supported.

#### Example Request

```code
DELETE graph.instagram.com
  /17873440459141021
```

#### Example Response

```code
{
  "success": true
}
```

On This Page

[Instagram (IG) Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#instagram--ig--comment)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#limitations)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#request-syntax)

[Path Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#path-parameters)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#query-string-parameters)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#fields)

[Edges](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#edges)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#updating)

[Hiding/Unhiding a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#hiding)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment#deleting)