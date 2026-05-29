---
url: https://developers.facebook.com/docs/threads/threads-mentions
title: Mentions - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fthreads-mentions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Mentions](https://developers.facebook.com/docs/threads/threads-mentions#mentions)

[Retrieve Threads Mentions](https://developers.facebook.com/docs/threads/threads-mentions#retrieve-threads-mentions)

[Fields](https://developers.facebook.com/docs/threads/threads-mentions#fields)

[Example Request](https://developers.facebook.com/docs/threads/threads-mentions#example-request)

[Example Response](https://developers.facebook.com/docs/threads/threads-mentions#example-response)

# Mentions

Returns a list of public Threads media objects in which a Threads profile has been tagged by another Threads profile.

### Permissions

The Threads Mentions API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_manage_mentions` — Required for making any calls to the mentions endpoint.

If your app has not been approved for advanced access for the `threads_manage_mentions` permission, only mentions made by a Threads tester on the app will be returned. After approval, other users' public posts will be returned.

### Limitations

- Threads media objects created by private users will not be returned.
- The `since` parameter's timestamp must be greater than or equal to `1688540400` and less than the `until` parameter, which must be less than or equal to the current timestamp and greater than the `since` parameter.

## Retrieve Threads Mentions

### Fields

Use the `fields` parameter to specify [fields](https://developers.facebook.com/docs/threads/threads-media#fields) you want included on any returned Threads media objects.

### Example Request

```code
curl -s -X GET \
  https://graph.threads.net/<THREADS_USER_ID>/mentions?fields=<LIST_OF_FIELDS>&access_token=<ACCESS_TOKEN>
```

### Example Response

A successful API call returns a JSON-formatted object containing Threads media objects.

```code
{
  "<FIELD>":"<VALUE>",
  ...
}
```

On This Page

[Mentions](https://developers.facebook.com/docs/threads/threads-mentions#mentions)

[Retrieve Threads Mentions](https://developers.facebook.com/docs/threads/threads-mentions#retrieve-threads-mentions)

[Fields](https://developers.facebook.com/docs/threads/threads-mentions#fields)

[Example Request](https://developers.facebook.com/docs/threads/threads-mentions#example-request)

[Example Response](https://developers.facebook.com/docs/threads/threads-mentions#example-response)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close