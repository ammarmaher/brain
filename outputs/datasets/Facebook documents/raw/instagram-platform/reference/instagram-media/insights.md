---
url: https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Freference%2Finstagram-media%2Finsights%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Instagram Media Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#instagram-media-insights)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#read)

[Limitations](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#requirements)

[Request syntax](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#request-syntax)

[Metrics](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics)

[Breakdowns](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns)

[Response syntax](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#response-syntax)

[Examples](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#examples)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#deleting)

# Instagram Media Insights

Represents social interaction metrics on your app user's Instagram Media object.

Instagram Insights are now available for Instagram API with Instagram Login. [Learn more.](https://developers.facebook.com/docs/instagram-platform/insights)

Introducing the `views` metric for [`FEED`, `STORY`, and `REELS` media product types](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media#fields).

The following metrics have been deprecated for v22.0 and will be deprecated for all versions on April 21, 2025:

- `plays`
- `clips_replays_count`
- `ig_reels_aggregated_all_plays_count`
- `impressions`

**Note:** API requests with the `impressions` metric will continue to return data for media created on or before July 1, 2024 for v21.0 and older. API requests made after April 21, 2025 for media created on or after July 2, 2024 will return an error.

The `video_views` metric has been deprecated.

Visit the [Instagram Platform Changelog](https://developers.facebook.com/docs/instagram-platform/changelog) for more information.

## Creating

This operation is not supported.

## Reading

**`GET /<INSTAGRAM_MEDIA_ID>/insights`**

Get insights data on an Instagram Media object.

### Limitations

- If insights data you are requesting does not exist or is currently unavailable, the API returns an empty data set instead of `0` for individual metrics.
- Data used to calculate metrics can be delayed up to 48 hours.
- Metrics data is stored for up to 2 years.
- Metrics such as `comments`, `likes`, `views`, and `total_interactions` report organic interaction metrics only; interactions on ads containing a media object are not counted. The `total_likes`, `total_comments`, and `total_views` metrics return aggregated counts that include engagement from promoted/boosted/ad media. These total metrics are available for Instagram API with Facebook Login only. Crossposted Facebook post's count may be included if that post is accessible by the session user.

#### Album metrics

- Insights data is not available for any media within an [Instagram Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) album.

#### Story media metrics

- Story media metrics are only available for 24 hours.

  - Set up [`Instagram` webhooks](https://developers.facebook.com/docs/instagram-api/guides/webhooks) and subscribe to the `story_insights` field to get story insights for a story before they expire. You may receive data after the story expires if the story is added to a highlight. This may return different results for API calls, webhook notifications, and UIs.
- Story media metrics with values less than 5 return an error code `10` with the message `(#10) Not enough viewers for the media to show insights`.
- For Stories created by users in Europe and Japan, the `replies` metric now returns a value of `0`.
- Replies made by users in Europe and Japan are not included in `replies` calculations for story media metrics.

#### Webhooks

- Insights webhook for Instagram API with Instagram Login is not supported.

### Requirements

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User access token | - [Facebook User access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_manage_insights` | - `instagram_basic`<br>- `instagram_manage_insights`<br>- `pages_read_engagement`<br>If the app user was granted a role on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to your app user's Instagram professional account via the Business Manager, your app will also need:<br>- `ads_management`<br>- `ads_read` |

### Request syntax

```html
GET "https://<HOST_URL>/<API_VERSION>/<INSTAGRAM_MEDIA_ID>/insights
  ?metric=<LIST_OF_METRICS>
  &period=<LIST_OF_TIME_PERIODS>
  &breakdown=<LIST_OF_BREAKDOWNS>
  &access_token=<ACCESS_TOKEN>"
```

#### Path parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>`<br>**The latest version is:**<br>`v25.0` | The API version your app is using. If not specified in your API calls this will be the latest version at the time you created your Meta app or, if that version is no longer available, the oldest version available. [Learn more about versioning.](https://developers.facebook.com/docs/graph-api/guides/versioning) |
| `<HOST_URL>` | The [host URL](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#requirements) your app is using to query the endpoint. |
| `<INSTAGRAM_MEDIA_ID>` | **Required.** The [Instagram Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) ID. |

#### Query string parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token` | `<ACCESS_TOKEN>` | **Required.** The app user's Facebook or Instagram User access token. |
| `breakdown` | `<LIST_OF_BREAKDOWNS>` | Designates how to [break down results into subsets](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns). |
| `metric` | `<LIST_OF_METRICS>` | **Required.** Comma-separated list of [metrics](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) you want returned. |
| `period` | `<LIST_OF_TIME_PERIODS>` | Comma-separated list of time periods you want returned. Values can be:<br>- `day`<br>- `week`<br>- `days_28`<br>- `month`<br>- `lifetime`<br>- `total_over_range` |

### Metrics

The following table shows the metrics and the media object types the are available on.

| Metric | Media Product Type |
| --- | --- |
| `clips_replays_count`<br>Deprecated for v22.0 and for all versions on April 21, 2025.<br>The number of times your reel starts to play again after an initial play of your video. This is defined as replays of 1ms or more in the same reel session. | `REELS` |
| `comments`<br>Number of comments on the media object. | `FEED` (posts)<br>`REELS` |
| `crossposted_views`<br>Total number of times the video IG Media was played, aggregated across Instagram and Facebook. Throws if the media is not shared to Facebook | `REELS` |
| `facebook_views`<br>Total number of times IG Media has been played on Facebook. Throws if the media is not shared to Facebook. For REELS, this can be either plays from crossposted or cross recommended from Instagram to Facebook | `FEED` (posts)<br>`REELS``STORY` |
| `follows`<br>The number of Instagram users following your app user's Instagram professional account. | `FEED` (posts)<br>`STORY` |
| `ig_reels_aggregated_all_plays_count`<br>Deprecated for v22.0 and for all versions on April 21, 2025.<br>The number of times your reel starts to play or replay after an impression is already counted. This is defined as plays of 1ms or more. Replays are counted after the initial play in the same reel session.<br>Note that this count may be greater than the sum of `clips_replays_count` and `plays`. This is because `clips_replays_count` and `plays` only count plays in the Instagram app, while `ig_reels_aggregated_all_plays_count` also includes plays in the Facebook app through Cross App Recommendation (XAR). | `REELS` |
| `ig_reels_avg_watch_time`<br>The average amount of time spent playing the reel. | `REELS` |
| `ig_reels_video_view_total_time`<br>The total amount of time the reel was played, including any time spent replaying the reel.<br>[Metric in development.](https://business.facebook.com/business/help/metrics-labeling) | `REELS` |
| `impressions`<br>For media created after July 2, 2024, this metric is deprecated for v22.0+ and will be deprecated for all versions on April 21, 2025.<br>For media created before July 2, 2024, this metric will still be available.<br>Total number of times your app user's Instagram Media object has been seen. | `FEED` (posts)<br>`STORY` |
| `likes`<br>Number of likes on the media object. | `FEED` (posts)<br>`REELS` |
| `navigation`<br>This is the total number of actions taken from your story. These are made up of metrics like exited, forward, back and next story.<br>**Available breakdown:**`story_navigation_action_type` | `STORY` |
| `plays`<br>Deprecated for v22.0 and for all versions on April 21, 2025.<br>Number of times the reels starts to play after an impression is already counted. This is defined as video sessions with 1 ms or more of playback and excludes replays. | `REELS` |
| `profile_activity`<br>The number of actions people take when they visit your profile after engaging with your post.<br>**Available breakdown:**`action_type` (Available for media created after October 26, 2017.) | `FEED` (posts)<br>`STORY` |
| `profile_visits`<br>The number of times your profile was visited. | `FEED` (posts)<br>`STORY` |
| `reach`<br>Number of unique Instagram users that have seen the reel at least once. Reach is different from impressions, which can include multiple views of a reel by the same account.<br>[Metric is estimated.](https://business.facebook.com/business/help/metrics-labeling) | `FEED` (posts)<br>`REELS``STORY` |
| `reels_skip_rate`<br>The percentage of views from people who skipped during the first 3 seconds of the reel. This is calculcated as the number of views that skipped the reel during the first 3 seconds divided by the number of intial views. An intial view is when the reel starts to play for the first time in a reel session.<br> [Metric is estimated and in development.](https://business.facebook.com/business/help/metrics-labeling) | `REELS` |
| `replies`<br>Total number of replies ( [IG Comments](https://developers.facebook.com/docs/instagram-api/reference/ig-comment)) on the story [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) object. Value does not include replies made by users in some regions. These regions include: Europe starting December 1, 2020 and Japan starting April 14, 2021. If the Story was created by a user in one of these regions, returns a value of `0`. | `STORY` |
| `reposts`<br>The number of reposts on the IG media minus the number of deleted reposts. | `FEED` (posts)<br>`REELS``STORY` |
| `saved`<br>Number of time your app user's Instagram media was saved by an Instagram user. | `FEED` (posts)<br>`REELS` |
| `shares`<br>Number of shares of the reel. | `FEED` (posts)<br>`REELS``STORY` |
| `total_interactions`<br>Number of likes, saves, comments, and shares on the reel, minus the number of unlikes, unsaves, and deleted comments.<br>[Metric in development.](https://business.facebook.com/business/help/metrics-labeling) | `FEED` (posts)<br>`REELS``STORY` |
| `views`<br>Total number of times IG Media has been played on Instagram.<br>[Metric in development.](https://business.facebook.com/business/help/metrics-labeling) | `FEED` (posts)<br>`REELS``STORY` |
| `total_comments`<br>Total number of comments on the media across all surfaces, including comments on associated promoted/boosted/ad media. Available for Instagram API with Facebook Login only. | `FEED` (posts)<br>`REELS` |
| `total_likes`<br>Total number of likes on the media across all surfaces, including likes on associated promoted/boosted/ad media. Available for Instagram API with Facebook Login only. | `FEED` (posts)<br>`REELS` |
| `total_views`<br>Total number of times the media has been seen across all surfaces, including views from promoted/boosted/ad media and Facebook. Available for Instagram API with Facebook Login only. | `FEED` (posts)<br>`REELS``STORY` |

### Breakdowns

You can also include the `breakdown` parameter for specific metrics to divide data into smaller sets based on the specified breakdown value. Values can be:

| `breakdown` value | Response values |
| --- | --- |
| `action_type`<br>**Only compatible with the `profile_activity` metric.**<br>Break down results by the profile component within the native app that viewers tapped or clicked after viewing the app user's profile. | - `BIO_LINK_CLICKED`<br>- `CALL`<br>- `DIRECTION`<br>- `EMAIL`<br>- `OTHER`<br>- `TEXT` |
| `story_navigation_action_type`<br>**Only compatible with the `navigation` metric.**<br>Break down results by navigation action taken by the viewer upon viewing the media within the native app. Adding all of these action types will give you the total navigation insights. | - `SWIPE_FORWARD` equals "Next Story"<br>- `TAP_BACK` equals "Back"<br>- `TAP_EXIT` equals "Exit"<br>- `TAP_FORWARD` equals "Forward" |

**NOTE:** If you request a metric that doesn't support breakdowns, the API will return an error ("`An unknown error has occurred.`"), so be careful if requesting multiple metrics in a single query.

### Response syntax

On success your app receives a JSON object containing the results of your query. Results can include the following data, based on your query specifications:

```html
{
  "data": [\
    {\
      "name": "<NAME>",\
      "period": "<PERIOD>",\
      "values": [\
        {\
          "value": <VALUE>\
        }\
      ],\
      "title": "<TITLE>",\
      "description": "<DESCRIPTION>",\
      "total_value": {\
        "value":<VALUE>,\
        "breakdowns": [\
          {\
            "dimension_keys": [\
              "<DIMENSION_KEY_1>",\
              "<DIMENSION_KEY_2>"\
              ...\
            ],\
            "results": [\
              {\
                "dimension_values": [\
                  "<DIMENSION_VALUE_1>",\
                  "<DIMENSION_VALUE_2>"\
                  ...\
                ],\
                "value": <VALUE>\
              },\
              ...\
            ]\
          }\
        ]\
      },\
      "id": "<ID>"\
    }\
  ]
}
```

#### Response contents

| Property | Value Type | Description |
| --- | --- | --- |
| `data` | Array | An array containing an object describing your request results. |
| `name` | String | [Metric](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) name. |
| `period` | String | Period requested. Period is automatically set to `lifetime` in the request and cannot be changed, so this value will always be `lifetime`. |
| `values` | Array | An array containing an object describing requested [metric](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) values. |
| `value` | Integer | For `data.values.value`, sum of requested [metric](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) values.<br>For `data.total_value.value`, sum of requested [breakdown](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) values.<br>For `data.total_value.breakdowns.results.value`, sum of [breakdown](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) set values. |
| `title` | String | [Metric](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) title. |
| `description` | String | [Metric](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics) description. |
| `id` | String | A string describing the query's path parameters. |
| `total_value` | Object | Object describing requested [breakdown](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) values (if breakdowns were requested). |
| `breakdowns` | Array | An array of objects describing the [breakdowns](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) requested and their results. |
| `dimension_keys` | Array | Array of strings describing [breakdowns](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) requested. |
| `results` | Array | An array of objects describing each [breakdown](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) set. |
| `dimension_values` | String | An array of strings describing [breakdown](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns) set values. Values can be mapped to `dimension_keys`. |
| `paging` | Object | An object containing URLs used to request the next set of results. See [Paginated Results](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/docs/graph-api/results) for more information. |
| `previous` | String | URL to retrieve the previous page of results. See [Paginated Results](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/docs/graph-api/results) for more information. |
| `next` | String | URL to retrieve the next page of results. See [Paginated Results](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/docs/graph-api/results) for more information. |

### Examples

#### Sample post metric request

The following is a request from an app that uses Facebook Login.

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/17932174733377207/insights?metric=profile_activity&breakdown=action_type&access_token=EAAOc..."
```

#### Sample post metric response

```json
{
  "data": [\
    {\
      "name": "profile_activity",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 4\
        }\
      ],\
      "title": "Profile activity",\
      "description": "[IG Insights] This header is the name of a metric that appears on an educational info sheet for a particular post, story, video or promotion. This metric is the sum of all profile actions people take when they engage with this content.",\
      "total_value": {\
        "value": 4,\
        "breakdowns": [\
          {\
            "dimension_keys": [\
              "action_type"\
            ],\
            "results": [\
              {\
                "dimension_values": [\
                  "email"\
                ],\
                "value": 1\
              },\
              {\
                "dimension_values": [\
                  "text"\
                ],\
                "value": 1\
              },\
              {\
                "dimension_values": [\
                  "direction"\
                ],\
                "value": 1\
              },\
              {\
                "dimension_values": [\
                  "bio_link_clicked"\
                ],\
                "value": 1\
              }\
            ]\
          }\
        ]\
      },\
      "id": "17932174733377207/insights/profile_activity/lifetime"\
    }\
  ]
}
```

#### Sample story metric request

The following is a request from an app that uses Instagram Login.

```curl
curl -i -X GET \
 "https://graph.instagram.com/v25.0/17969782069736348/insights?metric=navigation&breakdown=story_navigation_action_type&access_token=EAAOc..."
```

#### Sample story metric response

```json
{
  "data": [\
    {\
      "name": "navigation",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 25\
        }\
      ],\
      "title": "Navigation",\
      "description": "This is the total number of actions taken from your story. These are made up of metrics like exited, forward, back and next story.",\
      "total_value": {\
        "value": 25,\
        "breakdowns": [\
          {\
            "dimension_keys": [\
              "story_navigation_action_type"\
            ],\
            "results": [\
              {\
                "dimension_values": [\
                  "tap_forward"\
                ],\
                "value": 19\
              },\
              {\
                "dimension_values": [\
                  "tap_back"\
                ],\
                "value": 4\
              },\
              {\
                "dimension_values": [\
                  "tap_exit"\
                ],\
                "value": 1\
              },\
              {\
                "dimension_values": [\
                  "swipe_forward"\
                ],\
                "value": 1\
              }\
            ]\
          }\
        ]\
      },\
      "id": "17969782069736348/insights/navigation/lifetime"\
    }\
  ]
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Instagram Media Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#instagram-media-insights)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#create)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#read)

[Limitations](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#requirements)

[Request syntax](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#request-syntax)

[Metrics](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#metrics)

[Breakdowns](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#breakdowns)

[Response syntax](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#response-syntax)

[Examples](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#examples)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/#deleting)