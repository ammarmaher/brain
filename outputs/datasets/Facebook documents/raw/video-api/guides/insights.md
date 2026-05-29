---
url: https://developers.facebook.com/docs/video-api/guides/insights
title: Get Insights - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fguides%2Finsights%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Video API](https://developers.facebook.com/docs/video-api)

- [Overview](https://developers.facebook.com/docs/video-api/overview)
- [Get Started](https://developers.facebook.com/docs/video-api/getting-started)
- [A/B Testing](https://developers.facebook.com/docs/video-api/ab-testing)
- [Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting)
- [Get Videos](https://developers.facebook.com/docs/video-api/guides/get-videos)
- [Get Insights](https://developers.facebook.com/docs/video-api/guides/insights)
- [Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations)
- [Upload a File or Video](https://developers.facebook.com/docs/graph-api/guides/upload)
- [Splitting](https://developers.facebook.com/docs/video-api/guides/splitting)
- [Publish a Video](https://developers.facebook.com/docs/video-api/guides/publishing)
- [Publish a Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing)
- [Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api)
- [Slideshows](https://developers.facebook.com/docs/video-api/guides/slideshows)
- [Stories](https://developers.facebook.com/docs/page-stories-api)
- [Reference](https://developers.facebook.com/docs/video-api/reference)

On This Page

[Get Insights using the Facebook Video API from Meta](https://developers.facebook.com/docs/video-api/guides/insights#get-insights-using-the-facebook-video-api-from-meta)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/insights#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/guides/insights#limitations)

[Get Total Insights](https://developers.facebook.com/docs/video-api/guides/insights#get-total-insights)

[Get Specific Insight Metrics](https://developers.facebook.com/docs/video-api/guides/insights#get-specific-insight-metrics)

[Learn More](https://developers.facebook.com/docs/video-api/guides/insights#learn-more)

# Get Insights using the Facebook Video API from Meta

This guide shows you how to get insights for a video that has been published on a Facebook Page.

[Learn more about Reels Insights](https://developers.facebook.com/docs/graph-api/reference/video/video_insights#reels-metrics)

## Before You Start

You will need:

- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permissions/reference/pages_read_engagement)
- A Page access token requested from a person who can perform the [`ANALYZE` task](https://developers.facebook.com/docs/pages/overview#tasks) on the Page

### Limitations

- Insights for Videos published on Facebook groups or users are not available.
- A crossposted Video will have its own unique `<VIDEO_ID>` for each Page it was posted to.

## Get Total Insights

Send a `GET` request to the `/<VIDEO_ID>/video_insights` endpoint to get total insights from all video posts associated with this video.

```http
GET <API_VERSION>/<VIDEO_ID>/video_insights?access_token=<PAGE_ACCESS_TOKEN>"
```

#### EXample Request

```curl
curl -X GET \
 "https://graph.facebook.com/v20.0/323790578640877/video_insights?access_token=EAABkW..."
```

#### Sample Response

```json
{
  "data": [\
    {\
      "name": "total_video_views",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 89\
        }\
      ],\
      "title": "Lifetime Total Video Views",\
      "description": "Lifetime: Total number of times your video was viewed for 3 seconds or viewed to the end, whichever came first. (Total Count)",\
      "id": "323790578640877/video_insights/total_video_views/lifetime"\
    },\
    {\
      "name": "total_video_views_unique",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 56\
        }\
      ],\
      "title": "Lifetime Unique Video Views",\
      "description": "Lifetime: Number of unique people who viewed your video for 3 seconds or viewed to the end, whichever came first. (Unique Users)",\
      "id": "323790578640877/video_insights/total_video_views_unique/lifetime"\
    },\
    {\
      "name": "total_video_views_autoplayed",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 23\
        }\
      ],\
      "title": "Lifetime Auto-Played Video Views",\
      "description": "Lifetime: Number of times your video started automatically playing and people viewed it for 3 seconds or viewed it to the end, whichever came first. (Total Count)",\
      "id": "323790578640877/video_insights/total_video_views_autoplayed/lifetime"\
    },\
    {\
      "name": "total_video_views_clicked_to_play",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 12\
        }\
      ],\
    }\
    ...\
  ]
}
```

## Get Specific Insight Metrics

Send a `GET` request to the [VideoVideoInsights](https://developers.facebook.com/docs/graph-api/reference/video/video_insights/) endpoint with the `metric` parameter and [specific metrics](https://developers.facebook.com/docs/graph-api/reference/video/video_insights#metrics) you wish to receive.

```http
GET /&lt;API_VERSION>/&lt;VIDEO_ID>/video_insights
  ?metric=total_video_views,total_video_views_unique
  &access_token=&lt;PAGE_ACCESS_TOKEN>"
```

#### Sample Request

```curl
curl -X GET \
  "https://graph.facebook.com/v20.0/323790578640877/video_insights?metric=total_video_views,total_video_views_unique&access_token=EAABkW..."
```

#### Sample Response

```json
{
  "data": [\
    {\
      "name": "total_video_views",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 2206\
        }\
      ],\
      "title": "Lifetime Total Video Views",\
      "description": "Lifetime: Total number of times your video was viewed for 3 seconds or viewed to the end, whichever came first. (Total Count)",\
      "id": "323790578640877/video_insights/total_video_views/lifetime"\
    },\
    {\
      "name": "total_video_views_unique",\
      "period": "lifetime",\
      "values": [\
        {\
          "value": 6\
        }\
      ],\
      "title": "Lifetime Unique Video Views",\
      "description": "Lifetime: Number of unique people who viewed your video for 3 seconds or viewed to the end, whichever came first. (Unique Users)",\
      "id": "323790578640877/video_insights/total_video_views_unique/lifetime"\
    }\
  ]
}
```

## Learn More

- [Video Insights Reference guide](https://developers.facebook.com/docs/graph-api/reference/video/video_insights/)
- Get Video insights using the [Pages API](https://developers.facebook.com/docs/pages/insights)
- [Page Platform Insights guide](https://developers.facebook.com/docs/platforminsights/page)
- [Pages Video Reference guide](https://developers.facebook.com/docs/graph-api/reference/page/videos/)
- [Pages Insights Reference guide](https://developers.facebook.com/docs/graph-api/reference/page/insights#videoviews)
- [Insights Reference guide](https://developers.facebook.com/docs/graph-api/reference/v7.0/insights)

On This Page

[Get Insights using the Facebook Video API from Meta](https://developers.facebook.com/docs/video-api/guides/insights#get-insights-using-the-facebook-video-api-from-meta)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/insights#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/guides/insights#limitations)

[Get Total Insights](https://developers.facebook.com/docs/video-api/guides/insights#get-total-insights)

[Get Specific Insight Metrics](https://developers.facebook.com/docs/video-api/guides/insights#get-specific-insight-metrics)

[Learn More](https://developers.facebook.com/docs/video-api/guides/insights#learn-more)