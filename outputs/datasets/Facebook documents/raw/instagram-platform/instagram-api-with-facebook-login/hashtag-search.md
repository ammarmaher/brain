---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search
title: Hashtag Search - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fhashtag-search%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)


  - [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
  - [Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram)
  - [Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery)
  - [Creator Marketplace API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/creator-marketplace)
  - [Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection)
  - [Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions)
  - [Product Tagging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging)
  - [Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events)
  - [Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration)

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
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#hashtag-search)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#requirements)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#endpoints)

[Common Uses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#common-uses)

[Getting Media Tagged With A Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#getting-media-tagged-with-a-hashtag)

# Hashtag Search

Find public IG Media that has been tagged with specific hashtags.

## Limitations

- You can query a maximum of 30 unique hashtags on behalf of an Instagram Business or Creator Account within a rolling, 7 day period. Once you query a hashtag, it will [count against this limit](https://developers.facebook.com/docs/instagram-api/reference/ig-user/recently_searched_hashtags) for 7 days. Subsequent queries on the same hashtag within this time frame will not count against your limit, and will not reset its initial query 7 day timer.
- You cannot comment on hashtagged media objects discovered through the API.
- Hashtags on Stories are not supported.
- Emojis in hashtag queries are not supported.
- The API will return a generic error for any requests that include hashtags that we have deemed sensitive or offensive.

## Requirements

In order to use this API, you must undergo [App Review](https://developers.facebook.com/docs/apps/review) and request approval for:

- the [`Instagram Public Content Access`](https://developers.facebook.com/docs/apps/review/feature#reference-INSTAGRAM_PUBLIC_CONTENT_ACCESS) feature
- the [`instagram_basic`](https://developers.facebook.com/docs/facebook-login/permissions#reference-instagram_basic) permission

## Endpoints

The Hashtag Search API consists of the following nodes and edges:

- [`GET /ig_hashtag_search`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag-search#reading) — to get a specific hashtag's node ID
- [`GET /{ig-hashtag-id}`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag#reading) — to get data about a hashtag
- [`GET /{ig-hashtag-id}/top_media`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag/top-media#reading) — to get the most popular photos and videos that have a specific hashtag
- [`GET /{ig-hashtag-id}/recent_media`](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag/recent-media#reading) — to get the most recently published photos and videos that have a specific hashtag
- [`GET /{ig-user-id}/recently_searched_hashtags`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/recently_searched_hashtags) — to determine the unique hashtags an Instagram Business or Creator Account has searched for in the current week

Refer to each endpoint's reference documentation for supported fields, parameters, and usage requirements.

## Common Uses

### Getting Media Tagged With A Hashtag

To get all of the photos and videos that have a specific hashtag, first use the `/ig_hashtag_search` endpoint and include the hashtag and ID of the Instagram Business or Creator Account making the query. For example, if the query is being made on behalf of the Instagram Business Account with the ID `17841405309211844`, you could get the ID for the "#coke" hashtag by performing the following query:

```code
GET graph.facebook.com/ig_hashtag_search
  ?user_id=17841405309211844
  &q=coke
```

This will return the ID for the “#Coke” hashtag node:

```code
{
  "id" : "17873440459141021"
}
```

Now that you have the hashtag ID (`17873440459141021`), you can query its `/top_media` or `/recent_media` edge and include the Business Account ID to get a collection of media objects that have the “#coke” hashtag. For example:

```code
GET graph.facebook.com/17873440459141021/recent_media
  ?user_id=17841405309211844
```

This would return a response that looks like this:

```code
{
  "data": [\
    {\
      "id": "17880997618081620"\
    },\
    {\
      "id": "17871527143187462"\
    },\
    {\
      "id": "17896450804038745"\
    }\
  ]
}
```

On This Page

[Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#hashtag-search)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#requirements)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#endpoints)

[Common Uses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#common-uses)

[Getting Media Tagged With A Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search#getting-media-tagged-with-a-hashtag)