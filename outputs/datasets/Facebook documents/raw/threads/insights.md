---
url: https://developers.facebook.com/docs/threads/insights/
title: Insights - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Finsights%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Threads Insights API](https://developers.facebook.com/docs/threads/insights/#threads-insights-api)

[Media Insights](https://developers.facebook.com/docs/threads/insights/#media-insights)

[Available Metrics](https://developers.facebook.com/docs/threads/insights/#available-metrics)

[Example Request](https://developers.facebook.com/docs/threads/insights/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/insights/#example-response)

[User Insights](https://developers.facebook.com/docs/threads/insights/#user-insights)

[Parameters](https://developers.facebook.com/docs/threads/insights/#parameters)

[User Metrics](https://developers.facebook.com/docs/threads/insights/#user-metrics)

[Example Request](https://developers.facebook.com/docs/threads/insights/#example-request-2)

[Example Time Series Metric Response](https://developers.facebook.com/docs/threads/insights/#example-time-series-metric-response)

[Example Total Value Metric Response](https://developers.facebook.com/docs/threads/insights/#example-total-value-metric-response)

[Example Link Total Value Response](https://developers.facebook.com/docs/threads/insights/#example-link-total-value-response)

# Threads Insights API

The Threads Insights API allows you to read the insights from users' own Threads.

### Permissions

The Threads Insights API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_manage_insights` — Required for making `GET` calls to insights endpoints.

### Limitations

- The user insights `since` and `until` parameters do not work for dates before April 13, 2024 (Unix timestamp `1712991600`).

## Media Insights

To retrieve the available insights metrics, send a `GET` request to the `/{threads-media-id}/insights` endpoint with the `metric` parameter containing a comma-separated list of metrics to be returned.

**Note:**

- Returned metrics do not capture nested replies' metrics.
- An empty array will be returned for `REPOST_FACADE` posts because they are posts made by other users.

### Available Metrics

| Name | Description |
| --- | --- |
| `views` | The number of times your post was played or displayed.<br>**Note:** This metric is [in development](https://www.facebook.com/business/help/metrics-labeling). |
| `likes` | The number of likes on the post. |
| `replies` | The number of replies on the post.<br>**Note:** When the requested media is a root post, this number includes total replies. If the media is itself a reply, this number includes only **direct** replies. |
| `reposts` | The number of times the post was reposted. |
| `quotes` | The number of times the post was quoted. |
| `shares` | The number of shares of your Threads posts.<br>**Note:** This metric is [in development](https://www.facebook.com/business/help/metrics-labeling). |

### Example Request

```code
curl -s -X GET \
  -F "metric=likes,replies" \
	-F "access_token=<THREADS_ACCESS_TOKEN>"
"https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>/insights"
```

### Example Response

```code
{
  "data": [\
    {\
      "name": "likes",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 100\
        }\
      ],\
      "title": "Likes",\
      "description": "The number of likes on your post.",\
      "id": "<media_id>/insights/likes/lifetime"\
    },\
    {\
      "name": "replies",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 10\
        }\
      ],\
      "title": "Replies",\
      "description": "The number of replies on your post.",\
      "id": "<media_id>/insights/replies/lifetime"\
    }\
  ]
}
```

## User Insights

To retrieve the available user insights metrics, send a `GET` request to the `/{threads-user-id}/threads_insights` endpoint with the `metric` parameter, and optionally, the `since` and `until` parameters.

User insights are not guaranteed to work before June 1, 2024.

### Parameters

| Name | Description |
| --- | --- |
| `since` | **Optional.**<br>Used in conjunction with the `until` parameter to define a range. If you omit `since` and `until`, it defaults to a 2-day range: yesterday through today.<br>**Note:** The earliest Unix timestamp that can be used is `1712991600`, any timestamp before that will be rejected.<br>**Format:** Unix Timestamp |
| `until` | **Optional.**<br>Used in conjunction with the `since` parameter to define a range. If you omit `since` and `until`, it defaults to a 2-day range: yesterday through today.<br>**Note:** The earliest Unix timestamp that can be used is `1712991600`, any timestamp before that will be rejected.<br>**Format:** Unix Timestamp |
| `metric` | **Required.**<br>A comma-separated list of the metrics to be returned. Must be at least one of the user metrics values. |

### User Metrics

| Name | Response Type | Description |
| --- | --- | --- |
| `views` | Time Series | The number of times your profile was viewed. |
| `likes` | Total Value | The number of likes on your posts. |
| `replies` | Total Value | The number of replies on your posts.<br>**Note:** This number includes only top-level replies. |
| `reposts` | Total Value | The number of times your posts were reposted. |
| `quotes` | Total Value | The number of times your posts were quoted. |
| `clicks` | Link Total Values | The number of times people clicked on URLs you shared. |
| `followers_count` | Total Value | Your total number of followers on Threads.<br>**Note:**<br>- This metric does not support the `since` and `until` parameters. |
| `follower_demographics` | Total Value | The demographic characteristics of followers, including countries, cities, and gender distribution.<br>**Note:**<br>- This metric does not support the `since` and `until` parameters. <br>- A Threads profile must have at least 100 followers to fetch this metric.<br>- Can only have one `breakdown` parameter, which must be equal to one of the following values: `country`, `city`, `age`, or `gender`. |

### Example Request

```code
curl -s -X GET \
  -F "metric=views" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_insights"
```

### Example Time Series Metric Response

```code
{
  "data": [\
    {\
      "name": "views",\
      "period": "day",\
      "values": [\
        {\
          "value": 10,\
          "end_time": "2024-07-12T08:00:00+0000"\
        },\
        {\
          "value": 20,\
          "end_time": "2024-07-15T08:00:00+0000"\
        },\
        {\
          "value": 30,\
          "end_time": "2024-07-16T08:00:00+0000"\
        }\
      ],\
      "title": "views",\
      "description": "The number of times your profile was viewed.",\
      "id": "37602215421583/insights/views/day"\
    }\
  ]
}
```

### Example Total Value Metric Response

```code
{
  "data": [\
    {\
      "name": "views",\
      "period": "day",\
      "total_value" : {\
        "value": 1\
      }\
      "title": "views",\
      "description": "The number of times your profile was viewed.",\
      "id": "37602215421583/insights/views/day"\
    }\
  ]
}
```

### Example Link Total Value Response

```code
{
  "data": [\
    {\
      "name": "clicks",\
      "period": "day",\
      "link_total_values": [\
        {\
          "value": 11,\
          "link_url": "https://ai.meta.com/blog/"\
        }\
      ],\
      "title": "clicks",\
      "description": "The number of times users clicked on a link.",\
      "id": "37602215421583/insights/clicks/day"\
    }\
  ]
}
```

On This Page

[Threads Insights API](https://developers.facebook.com/docs/threads/insights/#threads-insights-api)

[Media Insights](https://developers.facebook.com/docs/threads/insights/#media-insights)

[Available Metrics](https://developers.facebook.com/docs/threads/insights/#available-metrics)

[Example Request](https://developers.facebook.com/docs/threads/insights/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/insights/#example-response)

[User Insights](https://developers.facebook.com/docs/threads/insights/#user-insights)

[Parameters](https://developers.facebook.com/docs/threads/insights/#parameters)

[User Metrics](https://developers.facebook.com/docs/threads/insights/#user-metrics)

[Example Request](https://developers.facebook.com/docs/threads/insights/#example-request-2)

[Example Time Series Metric Response](https://developers.facebook.com/docs/threads/insights/#example-time-series-metric-response)

[Example Total Value Metric Response](https://developers.facebook.com/docs/threads/insights/#example-total-value-metric-response)

[Example Link Total Value Response](https://developers.facebook.com/docs/threads/insights/#example-link-total-value-response)