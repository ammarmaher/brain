---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration
title: Collaboration - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fcollaboration%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaboration)

[Collaboration Invites](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaboration-invites)

[Fetch Collaboration Invites](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#fetch-collaboration-invites)

[Accept Or Decline Collaboration Invite](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#accept-or-decline-collaboration-invite)

[Collaborative Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media)

[Collaborative Media List](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media-list)

[Collaborative Media Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media-search)

[Supported Fields on Collaborative Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#supported-fields-on-collaborative-media)

# Collaboration

## Collaboration Invites

You can list media collaboration invites from Instagram users. You are able to accept or decline a collaboration invite.

### Fetch Collaboration Invites

Get a list of pending collaboration invites for an Instagram User. These invites are essentially Instagram Media objects (attributes) tagged for collaboration.

Each Media object (attributes) comprises Media ID, Media Owner Instagram Username, Media Caption and Media URL for an Instagram User

**`GET /<IG_USER_ID>/collaboration_invites`**

#### Limitations

- Collaborator tagging supports Feed Image, Reels and Carousel objects.
- Stories is not supported.
- Rate limit applies to 300 calls per Instagram User per day (24 hours).

#### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | [User](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) – The Instagram User must be tagged for collaboration of Instagram Media(s) by other Instagram User(s). |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic` |

#### Example Request

```html
curl -i -X GET \
"https://graph.facebook.com/v23.0/<IG_USER_ID>/collaboration_invites?access_token=<USER-ACCESS-TOKEN>"
```

#### Sample Response

```json
{
  "data": [\
    {\
      "media_id": "18078920227752107",\
      "media_owner_username": "katrina",\
      "caption": "Making memories all over the map",\
      "media_url": "<media-url-1>"\
    },\
    {\
      "media_id": "17938817952064413",\
      "media_owner_username": "john",\
      "caption": "Good vibes happen on the tides",\
      "media_url": "<media-url-2>"\
    },\
    {\
      "media_id": "17981928557731507",\
      "media_owner_username": "amanda",\
      "caption": "Less perfection, more authenticity",\
      "media_url": "<media-url-3>"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "QVFIU000NzlGS3BndGdrTzgzb0xoNy1kXzljVGRDRFhlUTNQTjJZARTZAVWWlaQW1RcHN5WUZAtUXQzTnU3dEZAENnoxWkdtOWlaNDA0LXBUcDNXOG90dzR2WXJn",
      "after": "QVFIU1lic1ZAkRllCLTktY2wyUzdfb3VaWUdiNUF3TmRacWFaY1k1d2YweWZA4LXpsLUowcjVzaGl2cXljdmlNeG91bEVwVG93RnBKU3IwSW5Xdzh6MFhzZAUFn"
    }
  }
}
```

#### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_USER_ID>`<br> _Required string_ | The ID for your app user's Instagram User. |

#### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token`<br> _Required string_ | `<USER_ACCESS_TOKEN>` | Your app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `limit`<br> _Optional int_ | `<LIMIT>` (eg. `15`) | Paging limit - Number of items returned in a paged response. Default is 10. |
| `after`<br> _Optional string_ | `<AFTER_CURSOR_STRING>` | Cursor string to iterate forwards from the current page |
| `before`<br> _Optional string_ | `<BEFORE_CURSOR_STRING>` | Cursor string to iterate backwards from the current page |

#### Response Fields

| Field Name | Description |
| --- | --- |
| `media_id` | The ID of the Instagram Media object tagged for collaboration |
| `media_owner_username` | The ID of the Instagram User who invited the app user's Instagram account for collaboration |
| `caption` | Caption of the tagged Instagram Media |
| `media_url` | Viewable CDN URL of the tagged Instagram Media |

### Accept Or Decline Collaboration Invite

Accept or Decline a pending collaboration invite for an Instagram User for an Instagram post by other Instagram User(s).

Requires API params include API Version, Instagram User ID, invited Media ID and a boolean flag to indicate accept or decline.

**`POST /<IG_USER_ID>/collaboration_invites`**

#### Limitations

- Accept/Decline collaborations supports Feed Image, Reels and Carousel objects.
- Stories is not supported.
- Rate limit applies to 50 calls per Instagram User per day (24 hours).

#### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | [User](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) – The Instagram User must be tagged for collaboration of Instagram Media(s) by other Instagram User(s). |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic` |

#### Example Request

```html
curl -i -X POST \
"https://graph.facebook.com/v23.0/<IG_USER_ID>/collaboration_invites?media_id=<IG_MEDIA_ID>&accept=true&access_token=<USER-ACCESS-TOKEN>
```

#### Sample Response

```json
{
  "success": true
}
```

#### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_USER_ID>`<br> _Required string_ | The ID for your app user's Instagram User. |

#### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token`<br> _Required string_ | `<USER_ACCESS_TOKEN>` | Your app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `media_id`<br> _Required string_ | `<IG_MEDIA_ID>` | The ID of the invited Instagram Media |
| `accept`<br> _Required boolean_ | `boolean` | Flag to accept/decline the invite.<br>- `true` to accept the invite<br>- `false` to decline the invite |

#### Response Fields

| Field Name | Description |
| --- | --- |
| `success` | Boolean flag to indicate whether the accept/decline succeeded |

## Collaborative Media

The Collaborative Media endpoints allow developers to retrieve media where an Instagram user is an accepted collaborator. This enables businesses and creators to track and measure the performance of collaborative content directly through the API.

### Collaborative Media List

Retrieve a list of all media where the Instagram user is an **accepted collaborator**. This does **not** include media that the user owns directly — only media created by other users where the user has been added and accepted as a collaborator.

**`GET /<IG_USER_ID>/collaborative_media`**

#### Limitations

- Collaborative media supports Feed Image, Reels and Carousel objects.
- Stories is not supported.
- You must be an accepted collaborator.
- If the original media owner removes you as a collaborator, you can no longer access the media.

#### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | [User](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic` — granted by one of the collaborators on the media. |

#### Example Request

```html
curl -i -X GET \
"https://graph.facebook.com/v23.0/<IG_USER_ID>/collaborative_media?fields=id,caption,media_type,timestamp,permalink,total_like_count,total_comments_count&access_token=<USER-ACCESS-TOKEN>"
```

#### Sample Response

```json
{
  "data": [\
    {\
      "id": "17895695608903510",\
      "caption": "Collab post with @Instagram",\
      "media_type": "VIDEO",\
      "timestamp": "2026-02-15T10:30:00+0000",\
      "permalink": "https://www.instagram.com/reel/ABC123/",\
      "total_like_count": 1502,\
      "total_comments_count": 234\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "...",
      "after": "..."
    },
    "next": "..."
  }
}
```

#### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_USER_ID>`<br> _Required string_ | The ID for your app user's Instagram User. |

#### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token`<br> _Required string_ | `<USER_ACCESS_TOKEN>` | Your app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `fields`<br> _Optional string_ | `<FIELD_LIST>` | Comma-separated list of fields to return. See **Supported Fields on Collaborative Media** below. |
| `limit`<br> _Optional int_ | `<LIMIT>` (eg. `15`) | Paging limit. |
| `after`<br> _Optional string_ | `<AFTER_CURSOR_STRING>` | Cursor string to iterate forwards from the current page |
| `before`<br> _Optional string_ | `<BEFORE_CURSOR_STRING>` | Cursor string to iterate backwards from the current page |

### Collaborative Media Search

Look up a specific collaborative media by ID and retrieve its details. This is useful when you already know the media ID and want to fetch its data without paginating through all collaborative media.

**`GET /<IG_USER_ID>?fields=collaborative_media_search.media_id(<IG_MEDIA_ID>)`**

#### Notes

- The specified media must **not** be owned by the requesting user. Use the standard `GET /<IG_MEDIA_ID>` endpoint for your own media.
- The requesting user must be an **accepted collaborator** on the specified media.

#### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | [User](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic` — granted by one of the collaborators on the media. |

#### Example Request

```html
curl -i -X GET \
"https://graph.facebook.com/v23.0/<IG_USER_ID>?fields=collaborative_media_search.media_id(17895695608903510){id,caption}&access_token=<USER-ACCESS-TOKEN>"
```

#### Sample Response

```json
{
  "collaborative_media_search": {
    "id": "17895695608903510",
    "caption": "Collab post with @Instagram"
  },
  "id": "<IG_USER_ID>"
}
```

#### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_USER_ID>`<br> _Required string_ | The ID for your app user's Instagram User. |

#### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token`<br> _Required string_ | `<USER_ACCESS_TOKEN>` | Your app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |
| `fields`<br> _Required string_ | `collaborative_media_search.media_id(<IG_MEDIA_ID>)` | The media ID to look up. You can append `{field1,field2,...}` to select specific fields. |

### Supported Fields on Collaborative Media

The standard IG Media fields are available when accessing collaborative media through the `GET /<IG_USER_ID>/collaborative_media` and `GET /<IG_USER_ID>?fields=collaborative_media_search.media_id(...)` endpoints. This includes the following fields:

- `id`
- `caption`
- `comments_count`
- `like_count`
- `media_product_type`
- `media_type`
- `media_url`
- `permalink`
- `thumbnail_url`
- `username`
- `timestamp`
- `total_like_count`
- `total_comments_count`
- `reposts_count`
- `saved_count`
- `shares_count`
- `total_views_count`

#### Limitations

- These fields are **not available for carousel child media**. They are only returned for top-level media objects.
- The media owner can disable showing likes, comments, views, reposts, and shares. In these cases, the corresponding fields are not returned.

On This Page

[Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaboration)

[Collaboration Invites](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaboration-invites)

[Fetch Collaboration Invites](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#fetch-collaboration-invites)

[Accept Or Decline Collaboration Invite](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#accept-or-decline-collaboration-invite)

[Collaborative Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media)

[Collaborative Media List](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media-list)

[Collaborative Media Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#collaborative-media-search)

[Supported Fields on Collaborative Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration#supported-fields-on-collaborative-media)