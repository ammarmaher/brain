---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children
title: Children - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-media%2Fchildren%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Children](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#children)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#read)

[Getting Child Media Objects](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#children-2)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#delete)

# Children

Represents a collection of [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects on an album [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media).

### Requirements

|  | Instagram AP with Instagram Loging | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User user access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic` | - `instagram_basic`<br>- `pages_read_engagement`<br>If the app user was granted a role via the Business Manager on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to the targeted IG User, you will also need one of:<br>- `ads_management`<br>- `ads_read` |

## Creating

This operation is not supported.

## Reading

### Getting Child Media Objects

`GET /<IG_MEDIA_ID>/children`

Returns a list of [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects on an album [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object.

#### Limitations

- Some fields, such as `permalink`, cannot be used on photos within albums (children).

#### Sample Request

```code
GET graph.facebook.com
  /17896450804038745/children
```

#### Sample Response

```code
{
  "data": [\
    {\
      "id": "17880997618081620"\
    },\
    {\
      "id": "17871527143187462"\
    }\
  ]
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Children](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#children)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#read)

[Getting Child Media Objects](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#children-2)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children#delete)