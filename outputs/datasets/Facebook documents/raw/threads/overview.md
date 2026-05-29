---
url: https://developers.facebook.com/docs/threads/overview/
title: Overview - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Foverview%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Overview](https://developers.facebook.com/docs/threads/overview/#overview)

[Rate Limiting](https://developers.facebook.com/docs/threads/overview/#rate-limiting)

[Posts](https://developers.facebook.com/docs/threads/overview/#posts)

[Replies](https://developers.facebook.com/docs/threads/overview/#replies)

[Deletion](https://developers.facebook.com/docs/threads/overview/#deletion)

[Location Search](https://developers.facebook.com/docs/threads/overview/#location-search)

[Limitations and Specifications](https://developers.facebook.com/docs/threads/overview/#limitations-and-specifications)

[Image Specifications](https://developers.facebook.com/docs/threads/overview/#image-specifications)

[Video Specifications](https://developers.facebook.com/docs/threads/overview/#video-specifications)

[Other Limitations](https://developers.facebook.com/docs/threads/overview/#other-limitations)

[Next Steps](https://developers.facebook.com/docs/threads/overview/#next-steps)

# Overview

You may use the Threads API to enable people to create and publish content on a person’s behalf on Threads, and to display those posts within your app solely to the person who created it.

The Threads API can be accessed by either `graph.threads.com` or `graph.threads.net`.

## Rate Limiting


Calls to the Threads API are counted against the calling app's call count. An app's call count is unique for each app and app user pair and is the number of calls the app has made in a rolling 24-hour window. It is calculated as follows:



`Calls within 24 hours = 4800 * Number of Impressions`


The Number of Impressions is the number of times any content from the app user's Threads account has entered a person's screen within the last 24 hours.

Rate limiting may also be subject to total CPU time per day:



`720000 * number_of_impressions for total_cputime

      2880000 * Number of Impressions for total_time`

**Note:** The minimum value for impressions is 10 (so if the impressions is less than 10 we default to 10).


### Posts

Threads profiles are limited to 250 API-published posts within a 24-hour moving period. Carousels count as a single post. This limit is enforced on the `POST /{threads-user-id}/threads_publish` endpoint when attempting to publish a media container. We recommend that your app also enforces the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future.

To check a profile's current Threads API rate limit usage, query the [`GET /{threads-user-id}/threads_publishing_limit` endpoint](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit).

**Note:** This endpoint requires the `threads_basic` and `threads_content_publish` permissions.

#### Fields

| Name | Description |
| --- | --- |
| `quota_usage` | Threads publishing count over the last 24 hours. |
| `config` | Threads publishing rate limit config object, which contains the `quota_total` and `quota_duration` fields. |

#### Example Request

```code
curl -s -X GET \
  "https:graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publishing_limit?fields=quota_usage,config&access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "quota_usage": 4,\
      "config": {\
        "quota_total": 250,\
        "quota_duration": 86400\
      }\
    }\
  ]
}
```

### Replies

Threads profiles are limited to 1,000 replies within a 24-hour moving period.

To check a profile's current Threads replies rate limit usage, query the [`GET /{threads-user-id}/threads_publishing_limit` endpoint](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit). See the [Reply Management](https://developers.facebook.com/docs/threads/reply-management) documentation for more information.

**Note:** This endpoint requires the `threads_basic`, `threads_content_publish`, and `threads_manage_replies` permissions.

#### Fields

| Name | Description |
| --- | --- |
| `reply_quota_usage` | Threads reply publishing count over the last 24 hours. |
| `reply_config` | Threads reply publishing rate limit config object, which contains the `quota_total` and `quota_duration` fields. |

#### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publishing_limit?fields=reply_quota_usage,reply_config&access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "reply_quota_usage": 1,\
      "reply_config": {\
        "quota_total": 1000,\
        "quota_duration": 86400\
      }\
    }\
  ]
}
```

### Deletion

Threads profiles are limited to 100 deletions within a 24-hour moving period.

To check a profile's current Threads deletion rate limit usage, query the [`GET /{threads-user-id}/threads_publishing_limit` endpoint](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit). See the [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts) documentation for more information.

**Note:** This endpoint requires the `threads_basic` and `threads_delete` permissions.

#### Fields

| Name | Description |
| --- | --- |
| `delete_quota_usage` | Threads deletion count over the last 24 hours. |
| `delete_config` | Threads deletion rate limit config object, which contains the `quota_total` and `quota_duration` fields. |

#### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publishing_limit?fields=delete_quota_usage,delete_config&access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "delete_quota_usage": 1,\
      "delete_config": {\
        "quota_total": 100,\
        "quota_duration": 86400\
      }\
    }\
  ]
}
```

### Location Search

Threads profiles are limited to 500 location searches within a 24-hour moving period.

To check a profile's current Threads location search rate limit usage, query the [`GET /{threads-user-id}/threads_publishing_limit` endpoint](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--threads-publishing-limit). See the [Location Search](https://developers.facebook.com/docs/threads/create-posts/location-tagging#search) documentation for more information.

**Note:** This endpoint requires the `threads_basic` and `threads_location_tagging` permissions.

#### Fields

| Name | Description |
| --- | --- |
| `location_search_quota_usage` | Threads location search count over the last 24 hours. |
| `location_search_config` | Threads location search rate limit config object, which contains the `quota_total` and `quota_duration` fields. |

#### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publishing_limit?fields=location_search_quota_usage,location_search_config&access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "location_search_quota_usage": 1,\
      "location_search_config": {\
        "quota_total": 500,\
        "quota_duration": 86400\
      }\
    }\
  ]
}
```

## Limitations and Specifications

### Image Specifications

- **Format:** JPEG and PNG image types are the officially supported formats for image posts.
- **File Size:** 8 MB maximum.
- **Aspect Ratio Limit:** 10:1
- **Minimum Width:** 320 (will be scaled up to the minimum if necessary)
- **Maximum Width:** 1440 (will be scaled down to the maximum if necessary)
- **Height:** Varies (depending on width and aspect ratio)
- **Color Space:** sRGB. Images using other color spaces will have their color spaces converted to sRGB.

### Video Specifications

- **Container:** MOV or MP4 (MPEG-4 Part 14), no edit lists, moov atom at the front of the file.
- **Audio Codec:** AAC, 48khz sample rate maximum, 1 or 2 channels (mono or stereo).
- **Video Codec:** HEVC or H264, progressive scan, closed GOP, 4:2:0 chroma subsampling.
- **Frame Rate:** 23-60 FPS
- **Picture Size:**
  - Maximum Columns (horizontal pixels): 1920
  - Required aspect ratio is between 0.01:1 and 10:1 but we recommend 9:16 to avoid cropping or blank space.
- **Video Bitrate:** VBR, 100 Mbps maximum.
- **Audio Bitrate:** 128 kbps.
- **Duration:** 300 seconds (5 minutes) maximum, minimum longer than 0 seconds.
- **File Size:** 1 GB maximum.

### Other Limitations

- Text posts are limited to 500 characters.
- Carousel posts must have a maximum of 20 children and a minimum of 2 children.
- For additional limitations, refer to each endpoint's reference.

## Next Steps

- [Get Started with the Threads API](https://developers.facebook.com/docs/threads/get-started)

On This Page

[Overview](https://developers.facebook.com/docs/threads/overview/#overview)

[Rate Limiting](https://developers.facebook.com/docs/threads/overview/#rate-limiting)

[Posts](https://developers.facebook.com/docs/threads/overview/#posts)

[Replies](https://developers.facebook.com/docs/threads/overview/#replies)

[Deletion](https://developers.facebook.com/docs/threads/overview/#deletion)

[Location Search](https://developers.facebook.com/docs/threads/overview/#location-search)

[Limitations and Specifications](https://developers.facebook.com/docs/threads/overview/#limitations-and-specifications)

[Image Specifications](https://developers.facebook.com/docs/threads/overview/#image-specifications)

[Video Specifications](https://developers.facebook.com/docs/threads/overview/#video-specifications)

[Other Limitations](https://developers.facebook.com/docs/threads/overview/#other-limitations)

[Next Steps](https://developers.facebook.com/docs/threads/overview/#next-steps)