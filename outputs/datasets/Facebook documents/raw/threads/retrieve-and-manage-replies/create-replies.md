---
url: https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies
title: Create Replies - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fretrieve-and-manage-replies%2Fcreate-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)


  - [Posts](https://developers.facebook.com/docs/threads/posts)
  - [Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies)
  - [Reposts](https://developers.facebook.com/docs/threads/posts/reposts)
  - [Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts)
  - [Ghost Posts](https://developers.facebook.com/docs/threads/create-posts/ghost-posts)
  - [Polls](https://developers.facebook.com/docs/threads/create-posts/polls)
  - [Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers)
  - [Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments)
  - [Share to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories)
  - [Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging)
  - [Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating)
  - [Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility)

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

[Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#create-replies)

[Respond to Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#respond-to-replies)

[Step 1: Use the reply\_to\_id parameter to reply to a specific reply under the root post.](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#step-1--use-the-reply-to-id-parameter-to-reply-to-a-specific-reply-under-the-root-post-)

[Step 2: Use the POST /{threads-user-id}/threads\_publish endpoint to publish the reply container ID returned in the previous step.](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#step-2--use-the-post---threads-user-id--threads-publish-endpoint-to-publish-the-reply-container-id-returned-in-the-previous-step-)

# Create Replies

### Permissions

To reply to a thread, you must meet one of the following permission requirements:

- You are the owner of the root thread post
- You have either the `threads_keyword_search` or the `threads_manage_mentions` permission.

## Respond to Replies

### Step 1: Use the `reply_to_id` parameter to reply to a specific reply under the root post.

#### Example Request

```code
curl -X POST \
  -F "media_type=<MEDIA_TYPE>" \
  -F "text=<TEXT>" \
  -F "reply_to_id=<THREADS_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/me/threads"
```

#### Example Response

```code
{
 "id": "1234567890"
}
```

### Step 2: Use the `POST /{threads-user-id}/threads_publish` endpoint to publish the reply container ID returned in the previous step.

It is recommended to wait on average 30 seconds before publishing a Threads media container to give our server enough time to fully process the upload. See the [media container status endpoint](https://developers.facebook.com/docs/threads/troubleshooting#publishing-does-not-return-a-media-id) for more details.

#### Parameters

- `creation_id` — Identifier of the Threads media container created from the `/threads` endpoint.

#### Example Request

```curl
curl -i -X POST \
  -F "creation_id=<MEDIA_CONTAINER_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publish"
```

#### Example Response

```json
{
  "id": "1234567" // Threads Reply Media ID
}
```

On This Page

[Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#create-replies)

[Respond to Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#respond-to-replies)

[Step 1: Use the reply\_to\_id parameter to reply to a specific reply under the root post.](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#step-1--use-the-reply-to-id-parameter-to-reply-to-a-specific-reply-under-the-root-post-)

[Step 2: Use the POST /{threads-user-id}/threads\_publish endpoint to publish the reply container ID returned in the previous step.](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies#step-2--use-the-post---threads-user-id--threads-publish-endpoint-to-publish-the-reply-container-id-returned-in-the-previous-step-)