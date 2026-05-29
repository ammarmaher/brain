---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery
title: Business Discovery - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fbusiness-discovery%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#business-discovery)

[Examples](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#examples)

[Get Follower & Media Count](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-follower---media-count)

[Get Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-media)

[Get Basic Metrics on Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-basic-metrics-on-media)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#sample-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#sample-response)

# Business Discovery

You can use the Instagram API with Facebook Login to get basic metadata and metrics about other Instagram professional accounts.

### Limitations

Data about age-gated Instagram professional accounts will not be returned.

### Endpoints

The API consists of the following endpoints. Refer to the endpoint's reference documentation for parameter and permission requirements.

- [`GET /<YOUR_APP_USERS_IG_USER_ID>/business_discovery`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/business_discovery)

## Examples

### Get Follower & Media Count

This sample query shows how to get the number of followers and number of published media objects on the [Blue Bottle Coffee](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fbluebottle%2F&h=AUDjjyLqEAPTLLP1GxevzamMmnxrN3fvxVpYTo6HbsARcVMq_E4TXRFtCyeC-GUDVvADRb41w-HJG0k14DtfX-gtjU0ieS4Z16quz0fTJ0lSDL3EpR_kjQjnwtOjYbSQ2wlQwFm64I7ISQ) Instagram professional account. Notice that business discovery queries are performed on the app user's Instagram professional account ID (in this case, `17841405309211844`) with the username of the Instagram professional account that your app user is attempting to get data about (`bluebottle` in this example).

#### Sample Request

_Formatted for readability._

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/17841405309211844 \
  ?fields=business_discovery.username(bluebottle){followers_count,media_count} \
  &access_token=<YOUR_APP_USERS_INSTAGRAM_USER_ACCESS_TOKEN>"
```

#### Sample Response

```json
{
  "business_discovery": {
    "followers_count": 267793,
    "media_count": 1205,
    "id": "17841401441775531" // Blue Bottle's Instagram user ID
  },
  "id": "17841405309211844"  // Your app user's Instagram user ID
}
```

### Get Media

Since you can make nested requests by specifying an edge via the `fields` parameter, you can request the targeted professional account's `media` edge to get all of its published media objects.

#### Sample Request

_Formatted for readability._

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/17841405309211844 \
  ?fields=business_discovery.username(bluebottle){followers_count,media_count,media} \
  &access_token=<YOUR_APP_USERS_INSTAGRAM_USER_ACCESS_TOKEN>"
```

#### Sample Response

```json
{
  "business_discovery": {
    "followers_count": 267793,
    "media_count": 1205,
    "media": {
      "data": [\
        {\
          "id": "17858843269216389"\
        },\
        {\
          "id": "17894036119131554"\
        },\
        {\
          "id": "17894449363137701"\
        },\
        {\
          "id": "17844278716241265"\
        },\
        ... // results truncated for brevity\
      ],
    "id": "17841401441775531"
  },
  },
  "id": "17841405309211844"
}
```

### Get Basic Metrics on Media

You can use both nested requests and field expansion to get public fields for a Business or Creator Account's media objects. Note that this does not grant you permission to access media objects directly — performing a `GET` on any returned [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) will fail due to insufficient permissions.

For example, here's how to get the number of comments and likes for each of the media objects published by Blue Bottle Coffee:

Please note that `view_count` includes both paid and organic metrics

### Sample Request

```code
GET graph.facebook.com
  /17841405309211844
    ?fields=business_discovery.username(bluebottle){media{comments_count,like_count,view_count}}
```

### Sample Response

```code
{
  "business_discovery": {
    "media": {
      "data": [\
        {\
          "comments_count": 50,\
          "like_count": 5837,\
          "view_count": 7757,\
          "id": "17858843269216389"\
        },\
        {\
          "comments_count": 11,\
          "like_count": 2997,\
          "id": "17894036119131554"\
        },\
        {\
          "comments_count": 28,\
          "like_count": 3643,\
          "id": "17894449363137701"\
        },\
        {\
          "comments_count": 43,\
          "like_count": 4943,\
          "id": "17844278716241265"\
        },\
     ],
   },
   "id": "17841401441775531"
  },
  "id": "17841405976406927"
}
```

On This Page

[Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#business-discovery)

[Examples](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#examples)

[Get Follower & Media Count](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-follower---media-count)

[Get Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-media)

[Get Basic Metrics on Media](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#get-basic-metrics-on-media)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#sample-request)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery#sample-response)