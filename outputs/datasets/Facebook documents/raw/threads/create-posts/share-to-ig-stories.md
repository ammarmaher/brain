---
url: https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories
title: Share to Instagram Stories - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fcreate-posts%2Fshare-to-ig-stories%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Share Posts to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#share-posts-to-instagram-stories)

[Permissions](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#permissions)

[Create a cross-shared post](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#create-a-cross-shared-post)

[Parameters](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#parameters)

[Response fields](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#response-fields)

[Example request](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#example-response)

# Share Posts to Instagram Stories

You can enable cross-sharing of a Threads post as a Story on your linked Instagram account by including the `crossreshare_to_ig` parameter when you create content using any of the Threads [publishing](https://developers.facebook.com/docs/threads/create-posts) endpoints.

### Limitations

- The user must have a linked Instagram account. If no linked account exists, the cross-share fails but the Threads post is still published.
- Cross-sharing creates an Instagram Story, which expires after 24 hours per standard Instagram Story behavior.

## Permissions

Sharing Threads posts to Instagram Stories requires an appropriate [access token](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions) and permissions. While you are testing, you can generate tokens and grant your app permissions by using the [Graph API Explorer](https://developers.facebook.com/docs/threads/get-started#graph-api-explorer).

The following permissions are required:

- `threads_basic` — Required for making calls to all Threads API endpoints.
- `threads_share_to_instagram` — Required for cross-sharing the Threads post to the user's linked Instagram account as a Story.

## Create a cross-shared post

To cross-share a Threads post to Instagram Stories, include either the `crossreshare_to_ig` or `crossreshare_to_ig_dark_mode` parameter set to `true` when creating a Threads media container. You can use these parameters with any supported media type (text, image, video, or carousel).

### Parameters

| Name | Description |
| --- | --- |
| `crossreshare_to_ig`<br>Boolean | Cross-shares a Threads post to a linked Instagram account as a Story when set to `true`.<br>**Values:**`true`, `false` ( _default_) |
| `crossreshare_to_ig_dark_mode`<br>Boolean | Cross-shares a Threads post to a linked Instagram account as a Story in dark mode when set to `true`.<br>**Values:**`true`, `false` ( _default_) |

### Response fields

When cross-sharing is enabled, the publish response includes the `crossreshare_to_ig_status` field:

| Name | Description |
| --- | --- |
| `id`<br>string | The ID of the published Threads media. |
| `crossreshare_to_ig_status`<br>string | The status of the cross-share to Instagram Stories.<br>**Values:**`SUCCESS`, `FAILED`. |

**Note:** The Threads post is published even if the cross-share to Instagram fails. Check the `crossreshare_to_ig_status` field to confirm whether the Story was created successfully.

### Example request

```html
curl -X POST \
  -d "media_type=text" \
  -d "text=<POST_TEXT>" \
  -d "crossreshare_to_ig=true" | "crossreshare_to_ig_dark_mode=true" \
  -d "access_token=<ACCESS_TOKEN>"
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

### Example response

```json
{
  "id": "<MEDIA_CONTAINER_ID>",
  "crossreshare_to_ig_status": "SUCCESS" | "FAILED"
}
```

On This Page

[Share Posts to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#share-posts-to-instagram-stories)

[Permissions](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#permissions)

[Create a cross-shared post](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#create-a-cross-shared-post)

[Parameters](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#parameters)

[Response fields](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#response-fields)

[Example request](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories#example-response)