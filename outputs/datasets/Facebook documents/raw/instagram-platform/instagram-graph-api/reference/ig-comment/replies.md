---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies
title: Replies - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-comment%2Freplies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[IG Comment Replies](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#ig-comment-replies)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#create)

[Replying to a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#replying)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#read)

[Getting All Replies (Comments) on a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#replies)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#delete)

# IG Comment Replies

Represents a collection of [IG Comments](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment).

To create an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object, use the [`POST /{ig-media-id}/comments`](https://developers.facebook.com/docs/instagram-api/reference/ig-media/comments) endpoint instead.

## Creating

### Replying to a Comment

`POST /{ig-comment-id}/replies?message={message}`

Creates an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment).

#### Query String Parameters

Query string parameters are optional unless indicated as required.

- `{message}` (required) — The text to be included in the comment.

#### Limitations

- You can only reply to top-level comments; replies to a reply will be added to the top-level comment.
- You cannot reply to hidden comments.
- You cannot reply to comments on a live video; use the [Instagram Messaging API](https://developers.facebook.com/docs/messenger-platform/instagram) to send a [private reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies) instead.

#### Permissions

A User [access token](https://developers.facebook.com/docs/instagram-api/overview#authentication) from a User who created the comment, with the following permissions:

- `instagram_basic`
- `instagram_manage_comments`
- `pages_show_list`
- `page_read_engagement`

If the token is from a User whose **Page role was granted via the Business Manager**, one of the following permissions is also required:

- `ads_management`
- `ads_read`

#### Sample Request

```code
POST graph.facebook.com
  /17870913679156914/replies?message=*sniff*
```

#### Sample Response

```code
{
  "id": "17873440459141021"
}
```

## Reading

### Getting All Replies (Comments) on a Comment

`GET /{ig-comment-id}/replies`

Returns a list of [IG Comments](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) on an [IG Comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment).

#### Limitations

You cannot get replies to a comment that has been deleted.

#### Permissions

An [access token](https://developers.facebook.com/docs/facebook-login/access-tokens) from a User who created the comment, with the following permissions:

- `instagram_basic`
- `pages_show_list`
- `page_read_engagement`

If the token is from a User whose **Page role was granted via the Business Manager**, one of the following permissions is also required:

- `ads_management`
- `ads_read`

#### Sample Request

```code
GET graph.facebook.com
  /17873440459141021/replies
```

#### Sample Response

```code
{
  "data": [\
    {\
      "timestamp": "2017-08-31T16:53:49+0000",\
      "text": "This is a great comment",\
      "id": "17871618799146774"\
    },\
    {\
      "timestamp": "2017-08-30T04:24:45+0000",\
      "text": "It's me. Trust me.",\
      "id": "17887288333072596"\
    }\
  ]
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[IG Comment Replies](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#ig-comment-replies)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#create)

[Replying to a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#replying)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#read)

[Getting All Replies (Comments) on a Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#replies)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies#delete)