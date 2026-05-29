---
url: https://developers.facebook.com/docs/platforminsights/page
title: Insights - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplatforminsights%2Fpage%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)


  - [Deprecated Metrics](https://developers.facebook.com/docs/platforminsights/page/deprecated-metrics)

- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Get Page Insights](https://developers.facebook.com/docs/platforminsights/page#get-page-insights)

[Before You Start](https://developers.facebook.com/docs/platforminsights/page#before-you-start)

[Get a Single Metric](https://developers.facebook.com/docs/platforminsights/page#get-a-single-metric)

[Get Multiple Metrics](https://developers.facebook.com/docs/platforminsights/page#get-multiple-metrics)

[Get Metrics of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-metrics-of-a-page-post)

[Get Video Ad Breaks Impressions](https://developers.facebook.com/docs/platforminsights/page#get-video-ad-breaks-impressions)

[Get Daily Video Ad Break Impressions of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-daily-video-ad-break-impressions-of-a-page-post)

[Get Lifetime Video Ad Break Impressions of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-lifetime-video-ad-break-impressions-of-a-page-post)

[Common Error Codes](https://developers.facebook.com/docs/platforminsights/page#common-error-codes)

[See Also](https://developers.facebook.com/docs/platforminsights/page#see-also)

# Get Page Insights

This guide explains how to get [metrics](https://developers.facebook.com/docs/graph-api/reference/insights) for your Facebook Pages. Get the total number of people who liked your Page or the number of people who shared stories about your Page.

By June 15, 2026, a [number of the Page Insights metrics](https://developers.facebook.com/docs/platforminsights/page/deprecated-metrics) will be deprecated for all API versions. The API returns an invalid metric error when calling any of these metrics. [Read our blog to learn more.](https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25/)

#### Limitations

- Metric data of public Pages is stored by Facebook for 2 years.
- Metric data of unpublished Pages is stored for only 5 days.
- When viewing daily metrics with `since` and `until`, the first `end_time` value will be the date specified by `since` plus 1 so that it includes the `since` date data. For example, if you set `since` to January 1, 2018, the `end_time` will be January 2, 2018 at 8:00 GMT.

## Before You Start

- [`pages_read_engagement` permission](https://developers.facebook.com/docs/apps/review/login-permissions#manage-pages)
- [`read_insights` permission](https://developers.facebook.com/docs/apps/review/login-permissions#read-insights)
- A [Page Access Token](https://developers.facebook.com/docs/pages/access-tokens) \- The person requesting the token must be able to perform the [analyze](https://developers.facebook.com/docs/pages/overview#tasks) task on the Page.

## Get a Single Metric

Send a `GET` request to the `/{page-id}/insights/{metric-name}` endpoint:

```code
curl -i -X GET "https://graph.facebook.com/{page-id}/insights/page_impressions_unique
  ?access_token={page-access-token}"
```

On success your app receives the following response:

```json
{
  "data": [\
    {\
      "name": "page_impressions_unique",\
      "period": "day",\
      "values": [\
        {\
          "value": 66226,\
          "end_time": "2020-03-10T07:00:00+0000"\
        },\
        {\
          "value": 78037,\
          "end_time": "2020-03-11T07:00:00+0000"\
        }\
      ],\
      "title": "Daily Total Reach",\
      "description": "Daily: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "{page-id}/insights/page_impressions_unique/day"\
    },\
    {\
      "name": "page_impressions_unique",\
      "period": "week",\
      "values": [\
        {\
          "value": 202229,\
          "end_time": "2020-03-10T07:00:00+0000"\
        },\
        {\
          "value": 206982,\
          "end_time": "2020-03-11T07:00:00+0000"\
        }\
      ],\
      "title": "Weekly Total Reach",\
      "description": "Weekly: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "{page-id}/insights/page_impressions_unique/week"\
    },\
    {\
      "name": "page_impressions_unique",\
      "period": "days_28",\
      "values": [\
        {\
          "value": 427380,\
          "end_time": "2020-03-10T07:00:00+0000"\
        },\
        {\
          "value": 432909,\
          "end_time": "2020-03-11T07:00:00+0000"\
        }\
      ],\
      "title": "28 Days Total Reach",\
      "description": "28 Days: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "{page-id}/insights/page_impressions_unique/days_28"\
    }\
  ],
  "paging": {
    "previous": "https://graph.facebook.com/{page-id}/insights?access_token={page-access-token}&pretty=0&metric=page_impressions_unique&since=1583568000&until=1583737200",
    "next": "https://graph.facebook.com/{page-id}/insights?access_token={page-access-token}&pretty=0&metric=page_impressions_unique&since=1583910000&until=1584082800"
  }
}
```

## Get Multiple Metrics

Send a `GET` request to the `/{page-id}/insights` endpoint with the `metric` field:

```code
curl -i -X GET "https://graph.facebook.com/{page-id}/insights
  ?metric=page_impressions_unique,page_impressions_paid
  &access_token={page-access-token}"
```

On success, your app receives the following response:

```json
{
  "data": [\
    {\
      "name": "page_impressions_unique",\
      "period": "day",\
      "values": [\
        {\
          "value": 60,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 50,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "Daily Total Reach",\
      "description": "Daily: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "PAGE_ID/insights/page_impressions_unique/day"\
    },\
    {\
      "name": "page_impressions_paid",\
      "period": "day",\
      "values": [\
        {\
          "value": 8,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 10,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "Daily Paid Impressions",\
      "description": "Daily: The number of times any post or story content from your Page or about your Page entered a person's screen through paid distribution such as an ad. (Total Count)",\
      "id": "PAGE_ID/insights/page_impressions_paid/day"\
    },\
    {\
      "name": "page_impressions_unique",\
      "period": "week",\
      "values": [\
        {\
          "value": 40,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 50,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "Weekly Total Reach",\
      "description": "Weekly: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "PAGE_ID/insights/page_impressions_unique/week"\
    },\
    {\
      "name": "page_impressions_paid",\
      "period": "week",\
      "values": [\
        {\
          "value": 50,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 106,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "Weekly Paid Impressions",\
      "description": "Weekly: The number of times any post or story content from your Page or about your Page entered a person's screen through paid distribution such as an ad. (Total Count)",\
      "id": "PAGE_ID/insights/page_impressions_paid/week"\
    },\
    {\
      "name": "page_impressions_unique",\
      "period": "days_28",\
      "values": [\
        {\
          "value": 110,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 10,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "28 Days Total Reach",\
      "description": "28 Days: The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users)",\
      "id": "PAGE_ID/insights/page_impressions_unique/days_28"\
    },\
    {\
      "name": "page_impressions_paid",\
      "period": "days_28",\
      "values": [\
        {\
          "value": 120,\
          "end_time": "2024-03-11T07:00:00+0000"\
        },\
        {\
          "value": 20,\
          "end_time": "2024-03-12T07:00:00+0000"\
        }\
      ],\
      "title": "28 Days Paid Impressions",\
      "description": "28 days: The number of times any post or story content from your Page or about your Page entered a person's screen through paid distribution such as an ad. (Total Count)",\
      "id": "PAGE_ID/insights/page_impressions_paid/days_28"\
    }\
  ],
...
```

## Get Metrics of a Page Post

Send a `GET` request to the `/{page-post-id}/insights` endpoint with the `metric` fields:

```code
curl -i -X GET "https://graph.facebook.com{page-post-id}/insights
  ?metric=post_reactions_like_total,post_reactions_love_total,post_reactions_wow_total
  &access_token={page-access-token}"
```

On success, your app receives the following response:

```code
{
  "data": [\
    {\
      "name": "post_reactions_like_total",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 226\
        }\
      ],\
      "title": "Lifetime Total Like Reactions of a post.",\
      "description": "Lifetime: Total like reactions of a post.",\
      "id": "{page-post-id}/insights/post_reactions_like_total/lifetime"\
    },\
    {\
      "name": "post_reactions_love_total",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 17\
        }\
      ],\
      "title": "Lifetime Total Love Reactions of a post.",\
      "description": "Lifetime: Total love reactions of a post.",\
      "id": "{page-post-id}/insights/post_reactions_love_total/lifetime"\
    },\
    {\
      "name": "post_reactions_wow_total",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 1\
        }\
      ],\
      "title": "Lifetime Total wow Reactions of a post.",\
      "description": "Lifetime: Total wow Reactions of a post.",\
      "id": "{page-post-id}/insights/post_reactions_wow_total/lifetime"\
    }\
  ],
  "paging": {
    "previous": "https://graph.facebook.com/{page-post-id}/insights?access_token={page-access-token}b&pretty=0&metric=post_reactions_like_total%2Cpost_reactions_love_total%2Cpost_reactions_wow_total&since=1583568000&until=1583737200",
    "next": "https://graph.facebook.com/{page-post-id}/insights?access_token={page-access-token}&pretty=0&metric=post_reactions_like_total%2Cpost_reactions_love_total%2Cpost_reactions_wow_total&since=1583910000&until=1584082800"
  }
}
```

## Get Video Ad Breaks Impressions

#### Additional Requirements

- The person requesting the Page access token must be able to [access the monetization insights](https://developers.facebook.com/business/help/442345745885606?id=180505742745347).

Send a `GET` request to the `/{page-id}` endpoint to get daily Video Ad Breaks impressions for a Page:

```code
curl -i -X GET \
  "https://graph.facebook.com/{page-id}/insights
    ?metric=page_daily_video_ad_break_ad_impressions_by_crosspost_status
    &period=day
    &since=2017-12-10
    &until=2017-12-14"
```

On success, your app receives the following response:

```code
{
  "data": [\
    {\
      "name": "page_daily_video_ad_breaks_ad_impressions_by_crosspost_status",\
      "period": "day",\
      "values": [\
        {\
          "value": {\
          "crossposted": 27584,\
          "owned": 692730\
          },\
          "end_time": "2017-12-11T08:00:00+0000"\
          },\
          {\
            "value": {\
              "owned": 757456,\
              "crossposted": 20593\
            },\
            "end_time": "2017-12-12T08:00:00+0000"\
          },\
          {\
            "value": {\
              "owned": 690092,\
              "crossposted": 15372\
            },\
            "end_time": "2017-12-13T08:00:00+0000"\
          }\
        ],\
        "title": "Daily page level videos ad impression",\
        "description": "Number of times an ad was shown during ad breaks in your Page's videos, by distribution type (page_owned and crossposted).",\
        "id": "{page-id}/insights/page_daily_video_ad_break_ad_impressions_by_crosspost_status/day"\
      }\
...\
```\
\
## Get Daily Video Ad Break Impressions of a Page Post\
\
Send a `GET` request to the `/{page-post-id}/insights` endpoint with the `metric` field:\
\
```code\
curl -i -X GET "https://graph.facebook.com/{page-post-id}/insights\
  ?metric=post_video_ad_break_ad_impressions\
  &period=day\
  &since=2017-12-10\
  &until=2017-12-14\
  &access_token={page-access-token}"\
```\
\
On success, your app will receive the following response:\
\
```code\
{\
  "data": [\
    {\
      "name": "total_video_ad_break_ad_impressions",\
      "period": "day",\
      "values": [\
        {\
          "value": 2612,\
          "end_time": "2017-12-11T08:00:00+0000"\
        },\
        {\
          "value": 1038,\
          "end_time": "2017-12-12T08:00:00+0000"\
        },\
        {\
          "value": 818,\
          "end_time": "2017-12-13T08:00:00+0000"\
        },\
        {\
          "value": 553,\
          "end_time": "2017-12-14T08:00:00+0000"\
        }\
      ],\
      "title": "Daily Video Ad Break Ad Impressions",\
      "description": "Number of times an ad was shown during your video ad breaks.",\
      "id": "{video-id}/video_insights/total_video_ad_break_ad_impressions/day"\
    }\
...\
```\
\
## Get Lifetime Video Ad Break Impressions of a Page Post\
\
```code\
curl -i -X GET "https://graph.facebook.com/{page-post-id}/insights\
  ?metric=post_video_ad_break_ad_impressions\
  &period=lifetime\
  &access_token={page-access-token}"\
```\
\
On success, your app will receive the following response:\
\
```code\
{\
  "data": [\
    {\
      "name": "total_video_ad_break_ad_impressions",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 55468\
        }\
      ],\
      "title": "Lifetime Video Ad Break Ad Impressions",\
      "description": "Number of times an ad was shown during your video ad breaks.",\
      "id": "{video-id}/video_insights/total_video_ad_break_ad_impressions/lifetime"\
    }\
...\
```\
\
## Common Error Codes\
\
| Error Code | Error Message | Description |\
| --- | --- | --- |\
| None | An empty dataset is returned. | You need the `read_insights` permission in order to access this endpoint. |\
| `100` | "(#100) The value must be a valid insights metric" | The may be a spelling or syntax issue. |\
| `3001` with `"error_subcode": 1504028` | "No metric was specified to be fetched. Please specify one or more metrics to be fetched and try again." | When using the `metric` parameter, at least one metric must be included in the query. |\
\
## See Also\
\
- [Insights Dashboard](https://www.facebook.com/insights)\
- [Insights Reference Guide](https://developers.facebook.com/docs/graph-api/reference/insights)\
- [Page Video Ad Breaks Metrics Reference Guide](https://developers.facebook.com/docs/graph-api/reference/insights#video-ad-breaks)\
- [Video Insights Reference Guide](https://developers.facebook.com/docs/graph-api/reference/video/video_insights/)\
\
On This Page\
\
[Get Page Insights](https://developers.facebook.com/docs/platforminsights/page#get-page-insights)\
\
[Before You Start](https://developers.facebook.com/docs/platforminsights/page#before-you-start)\
\
[Get a Single Metric](https://developers.facebook.com/docs/platforminsights/page#get-a-single-metric)\
\
[Get Multiple Metrics](https://developers.facebook.com/docs/platforminsights/page#get-multiple-metrics)\
\
[Get Metrics of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-metrics-of-a-page-post)\
\
[Get Video Ad Breaks Impressions](https://developers.facebook.com/docs/platforminsights/page#get-video-ad-breaks-impressions)\
\
[Get Daily Video Ad Break Impressions of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-daily-video-ad-break-impressions-of-a-page-post)\
\
[Get Lifetime Video Ad Break Impressions of a Page Post](https://developers.facebook.com/docs/platforminsights/page#get-lifetime-video-ad-break-impressions-of-a-page-post)\
\
[Common Error Codes](https://developers.facebook.com/docs/platforminsights/page#common-error-codes)\
\
[See Also](https://developers.facebook.com/docs/platforminsights/page#see-also)