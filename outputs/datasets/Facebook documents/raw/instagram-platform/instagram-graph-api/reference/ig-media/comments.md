---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments
title: Comments - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-media%2Fcomments%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


    - [Children](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children)
    - [Collaborators](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators)
    - [Comments](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments)
    - [Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights)
    - [Product Tags](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/product_tags)

  - [IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user)
  - [/me](https://developers.facebook.com/docs/instagram-platform/reference/me)
  - [Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize)
  - [Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page)
  - [Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)

- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Comments](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#comments)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#creating)

[Creating a Comment on a Media Object](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#creating-a-comment-on-a-media-object)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#reading)

[Getting Comments on a Media Object](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#comments-2)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#deleting)

# Comments

Represents a collection of [IG Comments](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object.

### Non-Organic Comments

Comments on Ads containing IG Media (i.e. non-organic comments) are of a different type and are not supported. To get non-organic comments, use the [Marketing API](https://developers.facebook.com/docs/marketing-api/) and request the Ad's `effective_instagram_media_id`. You can then query the returned ID's `/comments` edge to get a collection of non-organic [Instagram Comments](https://developers.facebook.com/docs/graph-api/reference/instagram-comment/). Refer to the Marketing API's [Post Moderation](https://developers.facebook.com/docs/instagram/ads-api/guides/post-moderation) guide for more information.

### Requirements

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_read_engagement`<br>If the app user was granted a role via the Business Manager on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to the targeted IG User, you will also need one of:<br>- `ads_management`<br>- `ads_read` |

## Creating

### Creating a Comment on a Media Object

`POST /<IG_MEDIA_ID>/comments?message=<MESSAGE_CONTENT>`

Creates an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object.

#### Limitations

Comments on live video IG Media are not supported.

#### Query String Parameters

Query string parameters are optional unless indicated as required.

- `<MESSAGE_CONTENT>` (required) — The text to be included in the comment.

#### Example Request

```code
POST graph.facebook.com
  /17895695668004550/comments?message=This%20is%20awesome!
```

#### Example Response

```code
{
  "id": "17870913679156914"
}
```

## Reading

### Getting Comments on a Media Object

`GET /<IG_MEDIA_ID>/comments`

Returns a list of [IG Comments](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object.

#### Limitations

- Requests made using API version 3.1 or older will have results returned in chronological order. Requests made using version 3.2+ will have results returned in reverse chronological order.
- Returns only top-level comments. Replies to comments are not included unless you use field expansion to request the `replies` field.
- Returns a maximum of 50 comments per query.
- Comments cannot be filtered by timestamp.

#### Permissions

An [access token](https://developers.facebook.com/docs/instagram-api/overview#authentication) from a User who created the [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object, with the following permissions:

- `instagram_basic`
- `instagram_manage_comments`

If the token is from a User whose **Page role was granted via the Business Manager**, one of the following permissions is also required:

- `ads_management`
- `ads_read`

#### Sample Request

```code
GET graph.facebook.com
  /17895695668004550/comments
```

#### Sample Response

```code
{
  "data": [\
    {\
      "timestamp": "2017-08-31T19:16:02+0000",\
      "text": "This is awesome!",\
      "id": "17870913679156914"\
    },\
    {\
      "timestamp": "2017-08-31T18:10:30+0000",\
      "text": "*Sniff*",\
      "id": "17873440459141021"\
    }\
  ]
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Comments](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#comments)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#creating)

[Creating a Comment on a Media Object](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#creating-a-comment-on-a-media-object)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#reading)

[Getting Comments on a Media Object](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#comments-2)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments#deleting)