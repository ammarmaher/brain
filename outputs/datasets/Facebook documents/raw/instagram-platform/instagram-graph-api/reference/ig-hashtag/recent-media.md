---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media
title: Recent Media - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-hashtag%2Frecent-media%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[IG Hashtag Recent Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#ig-hashtag-recent-media)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#limitations)

[Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#syntax)

[Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#returnable-fields)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#deleting)

# IG Hashtag Recent Media

Represents a collection of the most recently published photo and video [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects that have been tagged with a hashtag.

Available for the Instagram API with Facebook Login.

## Creating

This operation is not supported.

## Reading

Returns a list of the most recently published photo and video [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects published with a specific hashtag.

### Requirements

| Type | Description |
| --- | --- |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | [`Instagram Public Content Access`](https://developers.facebook.com/docs/apps/review/feature#reference-INSTAGRAM_PUBLIC_CONTENT_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | [`instagram_basic`](https://developers.facebook.com/docs/facebook-login/permissions#reference-instagram_basic)<br>If the token is from a User whose Page role was granted via the Business Manager, one of the following permissions is also required: `ads_management`, `business_management`, or `read_pages_engagement`. |
| [Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens) | A User access token of a Facebook User who has been [approved for tasks on the connected Facebook Page](https://developers.facebook.com/docs/instagram-api/overview#authentication). |

### Limitations

- Only returns public photos and videos.
- Only returns media objects published within 24 hours of query execution.
- Will not return promoted/boosted/ads media.
- Responses are paginated with a maximum `limit` of 50 results per page.
- Responses will not always be in chronological order.
- You can query a maximum of 30 unique hashtags [within a 7 day period](https://developers.facebook.com/docs/instagram-api/reference/ig-user/recently_searched_hashtags).
- You cannot request the `username` field on returned media objects.
- This endpoint only returns an `after` cursor for paginated results; a `before` cursor will not be included. In addition, the `after` cursor value will always be the same for each page, but it can still be used to get the next page of results in the result set.

### Syntax

`GET /<IG_HASHTAG_ID>/recent_media?user_id=<USER_ID>&fields=<LIST_OF_FIELDS>`

### Parameters

| Parameter | Description |
| --- | --- |
| `fields` | A comma-separated list of fields on a media object

| Value | Description |
| --- | --- |
| `caption` | The caption for the media object |
| `children` | Media objects in a carousel Album [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media), if applicable |
| `comments_count` | The number of comments on the media object |
| `id` | The ID for the media object |
| `like_count` | The number of likes for the media object. Will be omitted if the media owner has hidden like counts in it |
| `media_type` | The type of media: `CAROUSEL_ALBUM`, `IMAGE`, or `VIDEO`. |
| `media_url` | The URL for the media object. Not returned for Album [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) |
| `permalink` | The permalink for the media object |
| `timestamp` | Unix timestamp for when the media object was published | |
| `user_id` | The ID for person querying the data |

#### Example Request

```code
GET graph.facebook.com/17873440459141021/recent_media
  ?user_id=17841405309211844
  &fields=id,media_type,comments_count,like_count
```

### Response

An array of [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects. Excess results will be paginated.

#### Sample Response

```code
{
  "data": [\
    {\
      "id": "17880997618081620",\
      "media_type": "IMAGE",\
      "comments_count": 84,\
      "like_count": 177\
    },\
    {\
      "id": "17871527143187462"\
      "media_type": "IMAGE",\
      "comments_count": 24,\
      "like_count": 57\
    },\
    {\
      "id": "17896450804038745"\
      "media_type": "IMAGE",\
      "comments_count": 19,\
      "like_count": 36\
    }\
  ],
  "paging":
    {
      "cursors":
        {
          "after": "NTAyYmE4..."
        },
      "next": "https://graph.facebook.com/..."
    }
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[IG Hashtag Recent Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#ig-hashtag-recent-media)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#limitations)

[Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#syntax)

[Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#returnable-fields)

[Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#response)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag/recent-media#deleting)