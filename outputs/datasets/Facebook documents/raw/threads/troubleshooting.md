---
url: https://developers.facebook.com/docs/threads/troubleshooting
title: Troubleshooting - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Ftroubleshooting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Debug Access Token](https://developers.facebook.com/docs/threads/troubleshooting/debug-access-token)

- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Threads API Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting#threads-api-troubleshooting)

[Publishing Does Not Return a Media ID](https://developers.facebook.com/docs/threads/troubleshooting#publishing-does-not-return-a-media-id)

[Retrieve Quota Limits](https://developers.facebook.com/docs/threads/troubleshooting#retrieve-quota-limits)

# Threads API Troubleshooting

## Publishing Does Not Return a Media ID

If you are able to create a container for a video but the `POST /{threads-user-id}/threads_publish` endpoint does not return the published media ID, then you can get the container's publishing status by querying the `GET /{threads-container-id}` endpoint. This endpoint will return one of the following:

- `EXPIRED` — The container was not published within 24 hours and has expired.
- `ERROR` — The container failed to complete the publishing process.
- `FINISHED` — The container and its media object are ready to be published.
- `IN_PROGRESS` — The container is still in the publishing process.
- `PUBLISHED` — The container's media object has been published.

In case of error the endpoint will return one of the following error messages:

- `FAILED_DOWNLOADING_VIDEO`
- `FAILED_PROCESSING_AUDIO`
- `FAILED_PROCESSING_VIDEO`
- `INVALID_ASPEC_RATIO`
- `INVALID_BIT_RATE`
- `INVALID_DURATION`
- `INVALID_FRAME_RATE`
- `INVALID_AUDIO_CHANNELS`
- `INVALID_AUDIO_CHANNEL_LAYOUT`
- `UNKNOWN`

We recommend querying a container's status once per minute, for no more than 5 minutes.

#### Example Request

```curl
curl -s -X GET \
"https://graph.threads.net/v1.0/<MEDIA_CONTAINER_ID>?fields=status,error_message&access_token=<THREADS_ACCESS_TOKEN>"
```

#### Example Response

```json
{
  "status": "FINISHED",
  "id": "17889615691921648"
}
```

#### Example Response (in case of error)

```json
{
  "status": "ERROR",
  "id": "17889615691921648",
  "error_message": "FAILED_DOWNLOADING_VIDEO"
}
```

## Retrieve Quota Limits

To validate that a user has not exhausted their API quota limits for publishing, reply publishing, deleting, and location search, they can make a call to the
`GET {threads-user-id}/threads_publishing_limit` endpoint. This will return a user's current Threads API usage total.

#### Example Request

```curl
curl -s -X GET
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publishing_limit?fields=quota_usage,config,reply_quota_usage,reply_config,delete_quota_usage,delete_config,location_search_quota_usage,location_search_config&access_token=<THREADS_ACCESS_TOKEN>"
```

#### Example Response

```json
{
  "data": [\
    {\
      "quota_usage": 0,\
      "config": {\
        "quota_total": 250,\
        "quota_duration": 86400\
      },\
      "reply_quota_usage": 0,\
      "reply_config": {\
        "quota_total": 1000,\
        "quota_duration": 86400\
      },\
      "delete_quota_usage": 0,\
      "delete_config": {\
        "quota_total": 100,\
        "quota_duration": 86400\
      },\
      "location_search_quota_usage": 0,\
      "location_search_config": {\
        "quota_total": 500,\
        "quota_duration": 86400\
      }\
    }\
  ]
}
```

On This Page

[Threads API Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting#threads-api-troubleshooting)

[Publishing Does Not Return a Media ID](https://developers.facebook.com/docs/threads/troubleshooting#publishing-does-not-return-a-media-id)

[Retrieve Quota Limits](https://developers.facebook.com/docs/threads/troubleshooting#retrieve-quota-limits)