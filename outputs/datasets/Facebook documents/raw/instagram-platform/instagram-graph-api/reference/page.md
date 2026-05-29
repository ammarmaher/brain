---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/
title: Page - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fpage%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#page)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#read)

[Getting a Page's IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#getting-a-page-s-ig-user)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#delete)

# Page

Represents a Facebook Page.

This node allows you to:

- get the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) connected to a Facebook Page.

Available via Facebook Login for Business only.

## Creating

This operation is not supported.

## Reading

### Getting a Page's IG User

`GET /<PAGE_ID>?fields=instagram_business_account`

Returns the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) connected to the Facebook Page.

#### Permissions

A Facebook User [access token](https://developers.facebook.com/docs/instagram-api/overview#authentication) with the following permissions:

- `instagram_basic`
- `pages_show_list`

If the token is from a User whose **Page role was granted via the Business Manager**, one of the following permissions is also required:

- `ads_management`
- `ads_read`

#### Sample Request

```code
GET graph.facebook.com
  /134895793791914?fields=instagram_business_account
```

#### Sample Response

```code
{
  "instagram_business_account": {
    "id": "17841405822304914"
  },
  "id": "134895793791914"
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#page)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#read)

[Getting a Page's IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#getting-a-page-s-ig-user)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#update)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page/#delete)