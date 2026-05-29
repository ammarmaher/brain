---
url: https://developers.facebook.com/docs/instagram-platform/reference/me
title: /me - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Freference%2Fme%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Me](https://developers.facebook.com/docs/instagram-platform/reference/me#me)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/me#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/me#reading)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/me#request-syntax)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/me#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/me#deleting)

# Me

This is a special endpoint that examines the Instagram User Access Token included in the request, determines the ID of the Instagram user who granted the token, and uses the ID to query the User endpoint.

## Creating

This operation is not supported.

## Reading

**`GET /me`**

Get fields and edges on the User whose Instagram User Access Token is being used in the query. This endpoint translates to `GET /{user-id}`, based on the User ID identified by the access token used in the query.

### Request Syntax

```code
GET https://graph.instagram.com/v25.0/me
  ?fields={fields}
  &access_token={access-token}
```

Refer to the User node reference for requirements and usage details.

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Me](https://developers.facebook.com/docs/instagram-platform/reference/me#me)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/me#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/me#reading)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/me#request-syntax)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/me#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/me#deleting)