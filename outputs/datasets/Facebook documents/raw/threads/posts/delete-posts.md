---
url: https://developers.facebook.com/docs/threads/posts/delete-posts
title: Delete Posts - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fposts%2Fdelete-posts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts#delete-posts)

[Deleting](https://developers.facebook.com/docs/threads/posts/delete-posts#deleting)

[Permissions](https://developers.facebook.com/docs/threads/posts/delete-posts#permissions)

[Limitations](https://developers.facebook.com/docs/threads/posts/delete-posts#limitations)

[Example Request](https://developers.facebook.com/docs/threads/posts/delete-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/delete-posts#example-response)

# Delete Posts

You can use the Threads API to delete your own posts.

## Deleting

You can delete a Threads post that was created by the authenticated user by making a request to the `DELETE /{threads-media-id}` endpoint with the post's media object ID. Make sure to include the `access_token` parameter with your API request.

### Permissions

The Threads Delete API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_delete` — Required for making any delete calls.

### Limitations

- The Delete endpoint has a rate limit of 100 deletes per day per account.

### Example Request

```html
curl -i -X DELETE \
  "https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>?access_token=<ACCESS_TOKEN>"
```

### Example Response

```html
{
  "success": true,
  "deleted_id": "1234567",
}
```

The request above deletes a Threads post and returns a response indicating whether the action was successful or not, along with the deleted post's ID.

On This Page

[Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts#delete-posts)

[Deleting](https://developers.facebook.com/docs/threads/posts/delete-posts#deleting)

[Permissions](https://developers.facebook.com/docs/threads/posts/delete-posts#permissions)

[Limitations](https://developers.facebook.com/docs/threads/posts/delete-posts#limitations)

[Example Request](https://developers.facebook.com/docs/threads/posts/delete-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/delete-posts#example-response)