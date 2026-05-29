---
url: https://developers.facebook.com/docs/threads/retrieve-and-manage-replies
title: Retrieve and Manage Replies - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fretrieve-and-manage-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#retrieve-and-manage-replies)

[Permissions](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#permissions)

[Rate Limits](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#rate-limits)

[Next Steps](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#next-steps)

# Retrieve and Manage Replies

The Threads Reply Management API allows you to read and manage replies to users' own Threads.

## Permissions

The Threads Reply Management API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_manage_replies` — Required for making `POST` calls to reply endpoints.
- `threads_read_replies` — Required for making `GET` calls to reply endpoints.

## Rate Limits

Threads profiles are limited to 1,000 API-published replies within a 24-hour moving period. You can retrieve a profile's current Threads replies rate limit usage with the `GET /{threads-user-id}/threads_publishing_limit` endpoint.

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

## Next Steps

- [Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies)
- [Retrieve Replies and Conversations](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/replies-and-conversations)
- [Reply Management](https://developers.facebook.com/docs/threads/reply-management)

On This Page

[Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#retrieve-and-manage-replies)

[Permissions](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#permissions)

[Rate Limits](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#rate-limits)

[Next Steps](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies#next-steps)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close