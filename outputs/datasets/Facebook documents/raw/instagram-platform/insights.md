---
url: https://developers.facebook.com/docs/instagram-platform/insights
title: Insights - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finsights%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Insights](https://developers.facebook.com/docs/instagram-platform/insights#insights)

[Before you start](https://developers.facebook.com/docs/instagram-platform/insights#before-you-start)

[Requirements](https://developers.facebook.com/docs/instagram-platform/insights#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/insights#limitations)

[Examples](https://developers.facebook.com/docs/instagram-platform/insights#examples)

[Instagram account request](https://developers.facebook.com/docs/instagram-platform/insights#instagram-account-request)

[Instagram media request](https://developers.facebook.com/docs/instagram-platform/insights#instagram-media-request)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/insights#next-steps)

# Insights

This guide shows you how to get insights for your app users' Instagram media and professional accounts using the Instagram Platform.

In this guide we will be using **Instagram user** and **Instagram professional account** interchangeably. An Instagram User object represents your app user's Instagram professional account.

Instagram Insights are now available for Instagram API with Instagram Login. [Learn more.](https://developers.facebook.com/docs/instagram-platform/insights)

## Before you start

You will need the following:

### Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_manage_insights` | - `instagram_basic`<br>- `instagram_manage_insights`<br>- `pages_read_engagement`<br>If the app user was granted a role on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to your app user's Instagram professional account via the Business Manager, your app will also need:<br>- `ads_management`<br>- `ads_read` |

#### Access Level

- Advanced Access if your app serves Instagram professional accounts you don't own or manage
- Standard Access if your app serves Instagram professional accounts you own or manage and have added to your app in the App Dashboard

#### Endpoints

- [`GET /<INSTAGRAM_MEDIA_ID>/insights`](https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights) — Gets metrics on a media object
- [`GET /<INSTAGRAM_ACCOUNT_ID>/insights`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights) — Gets metrics on an Instagram Business Account or Instagram Creator account.

Refer to each endpoint's reference documentation for additional metrics, parameters, and permission requirements.

#### UTC

Timestamps in API responses use UTC with zero offset and are formatted using ISO-8601. For example: `2019-04-05T07:56:32+0000`

#### Webhook event subscriptions

- [`story_insights`![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEn2ed_&_nc_oc=AdpC2mrq-1gZRJ2mHS034vMLTtzGGJBW0K6hq4cXso2VGY02wxVF3vuje2hWCBrEYlA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=A4NR0FFc5DhjFPD5xeELpw&_nc_ss=7b289&oh=00_Af7lQDJLXfd0w9BZyJjztgb8uDFoiWW2WlWXtNj2yhb9Og&oe=6A2592E2) – **Only available for Instagram API with Facebook Login.**](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/webhooks)


### Limitations

#### Media insights

- Metrics such as `comments`, `likes`, and `views` return engagement on the target Instagram media only and don't include data from other surfaces. For example, `comments` returns the number of comments on a photo, but not comments on ads that contain that photo. Use `total_comments`, `total_likes`, and `total_views` on the Insights endpoint to get aggregated counts that include engagement from promoted/boosted/ad media. These total metrics are only available for Instagram API with Facebook Login.
- Live video Instagram Media can only be read while they are being broadcast.
- This API returns only data for media owned by Instagram professional accounts. It cannot be used to get data for media owned by personal Instagram accounts.

#### Account insights

- Some metrics are not available on Instagram accounts with fewer than 100 followers.
- User Metrics data is stored for up to 90 days.
- You can only get insights for a single user at a time.
- You cannot get insights for Facebook Pages.
- If insights data you are requesting does not exist or is currently unavailable the API will return an empty data set instead of `0` for individual metrics.

## Examples

### Instagram account request

The following Instagram API with Facebook Login example is getting the number of `impressions`, `profile_views`, and `reach` for your app user's Instagram professional account over one 24 hour period.

To get metrics for an Instagram business or creator account, query the [`GET /<INSTAGRAM_USER_ID>/insights`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights) endpoint with the `metrics` parameter set to a comma-separated list of the metrics, `impressions`, `profile_views`, and `reach`, and the `period` set to `day`.

```code
GET graph.facebook.com/17841405822304914/insights
    ?metric=impressions,reach,profile_views
    &period=day
```

#### Sample Response

On success, your app receives an array for each metric that includes, the metric description, ID of the metric, name and title, the time period over which the metric was measured, and values of the metric.

```code
{
  "data": [\
    {\
      "name": "impressions",\
      "period": "day",\
      "values": [\
        {\
          "value": 32,\
          "end_time": "2018-01-11T08:00:00+0000"\
        },\
        {\
          "value": 32,\
          "end_time": "2018-01-12T08:00:00+0000"\
        }\
      ],\
      "title": "Impressions",\
      "description": "Total number of times the Business Account's media objects have been viewed",\
      "id": "instagram_business_account_id/insights/impressions/day"\
    },\
    {\
      "name": "reach",\
      "period": "day",\
      "values": [\
        {\
          "value": 12,\
          "end_time": "2018-01-11T08:00:00+0000"\
        },\
        {\
          "value": 12,\
          "end_time": "2018-01-12T08:00:00+0000"\
        }\
      ],\
      "title": "Reach",\
      "description": "Total number of times the Business Account's media objects have been uniquely viewed",\
      "id": "instagram_business_account_id/insights/reach/day"\
    },\
    {\
      "name": "profile_views",\
      "period": "day",\
      "values": [\
        {\
          "value": 15,\
          "end_time": "2018-01-11T08:00:00+0000"\
        },\
        {\
          "value": 15,\
          "end_time": "2018-01-12T08:00:00+0000"\
        }\
      ],\
      "title": "Profile Views",\
      "description": "Total number of users who have viewed the Business Account's profile within the specified period",\
      "id": "instagram_business_account_id/insights/profile_views/day"\
    }\
  ]
}
```

### Instagram media request

The following Instagram API with Instagram Login example is getting the number of `engagement`, `impressions`, and `reach` for your app user's Instagram media over one 24 hour period.

To get metrics for an Instagram business or creator account's media, query the [`GET /<INSTAGRAM_MEDIA_ID>/insights`](https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights) endpoint with the `metrics` parameter set to a comma-separated list of the metrics, `engagement`, `impressions`, and `reach`, and the `period` set to `day`.

```code
GET graph.instagram.com/17841491440582230/insights
    ?metric=engagement,impressions,reach
```

#### Sample Response

On success, your app receives an array for each metric that includes, the metric description, ID of the metric, name and title, the time period over which the metric was measured, and values of the metric.

```code
{
  "data": [\
    {\
      "name": "engagement",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 8\
        }\
      ],\
      "title": "Engagement",\
      "description": "Total number of likes and comments on the media object",\
      "id": "media_id/insights/engagement/lifetime"\
    },\
    {\
      "name": "impressions",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 13\
        }\
      ],\
      "title": "Impressions",\
      "description": "Total number of times the media object has been seen",\
      "id": "media_id/insights/impressions/lifetime"\
    },\
    {\
      "name": "reach",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 13\
        }\
      ],\
      "title": "Reach",\
      "description": "Total number of unique accounts that have seen the media object",\
      "id": "media_id/insights/reach/lifetime"\
    }\
  ]
}
```

## Next Steps

Visit the API Reference to see all available metrics for [Instagram business and creator accounts](https://developers.facebook.com/docs/instagram-api/reference/ig-user) and their [Instagram Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects.

On This Page

[Insights](https://developers.facebook.com/docs/instagram-platform/insights#insights)

[Before you start](https://developers.facebook.com/docs/instagram-platform/insights#before-you-start)

[Requirements](https://developers.facebook.com/docs/instagram-platform/insights#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/insights#limitations)

[Examples](https://developers.facebook.com/docs/instagram-platform/insights#examples)

[Instagram account request](https://developers.facebook.com/docs/instagram-platform/insights#instagram-account-request)

[Instagram media request](https://developers.facebook.com/docs/instagram-platform/insights#instagram-media-request)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/insights#next-steps)