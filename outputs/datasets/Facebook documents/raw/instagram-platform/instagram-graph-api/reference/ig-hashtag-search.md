---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search
title: IG Hashtag Search - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-hashtag-search%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[IG Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#ig-hashtag-search)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#reading)

[Getting a Hashtag ID](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#getting-a-hashtag-id)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#deleting)

# IG Hashtag Search

This root edge allows you to get [IG Hashtag](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag) IDs.

Available for the Instagram API with Facebook Login.

## Creating

This operation is not supported.

## Reading

### Getting a Hashtag ID

`GET /ig_hashtag_search?user_id=<USER_ID>&q=<QUERY_STRING>`

Returns the ID of an [IG Hashtag](https://developers.facebook.com/docs/instagram-api/reference/ig-hashtag). IDs are both static and global (i.e, the ID for `#bluebottle` will always be `17843857450040591` for all apps and all app users).

#### Query String Parameters

- `<USER_ID>` (required) — The ID of the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) performing the request.
- `<QUERY_STRING>` (required) — The hashtag name to query.

#### Limitations

- You can query a maximum of 30 unique hashtags [within a 7 day period](https://developers.facebook.com/docs/instagram-api/reference/ig-user/recently_searched_hashtags).
- The API will return a generic error for any queries that include hashtags that we have deemed sensitive or offensive.

**Requirements**

| Type | Description |
| --- | --- |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | [`Instagram Public Content Access`](https://developers.facebook.com/docs/apps/review/feature#reference-INSTAGRAM_PUBLIC_CONTENT_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | [`instagram_basic`](https://developers.facebook.com/docs/facebook-login/permissions#reference-instagram_basic)<br>If the token is from a User whose Page role was granted via the Business Manager, one of the following permissions is also required: `ads_management`, `business_management`, or `pages_read_engagement`. |
| [Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | A User access token of a Facebook User who has been [approved for tasks on the connected Facebook Page](https://developers.facebook.com/docs/instagram-api/overview#access-tokens). |

#### Sample Request

```curl
curl -X GET \
 "https://graph.facebook.com/v25.0/ig_hashtag_search?user_id=17841405309211844&q=bluebottle&access_token={access-token}"
```

#### Sample Response

```code
{
    "data": [\
        {\
            "id": "17843857450040591"\
        }\
    ]
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[IG Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#ig-hashtag-search)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#reading)

[Getting a Hashtag ID](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#getting-a-hashtag-id)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search#deleting)