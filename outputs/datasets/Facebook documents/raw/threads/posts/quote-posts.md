---
url: https://developers.facebook.com/docs/threads/posts/quote-posts
title: Quote Posts - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fposts%2Fquote-posts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts#quote-posts)

[Publishing](https://developers.facebook.com/docs/threads/posts/quote-posts#publishing)

[Example Request](https://developers.facebook.com/docs/threads/posts/quote-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/quote-posts#example-response)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/quote-posts#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/quote-posts#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/posts/quote-posts#example-response-2)

# Quote Posts

You can use the Threads API to quote another post.

## Publishing

You can quote another post when making a request to the `POST /threads` endpoint to [create a media object](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container). Make sure to include the following parameter with your API request:

- `quote_post_id` — ID of another post that you want to quote.

### Example Request

```code
curl -i -X POST \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads?media_type=IMAGE&image_url=https://www.example.com/images/bronz-fonz.jpg&text=BronzFonz&access_token=<ACCESS_TOKEN>"
  -d quote_post_id="1234567"
```

### Example Response

```code
{
  "id": "1234567" // Threads Media Container ID
}
```

The request above creates a Threads post container that, once [published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will have a quote reference to the specified post.

## Media Retrieval

All quote posts will be labeled accordingly when retrieved. Make a request to the `GET /threads` or `GET /{threads_media_id}` endpoint to [retrieve media object(s)](https://developers.facebook.com/docs/threads/threads-media). Make sure to include the following fields with your API request:

- `is_quote_post` — A boolean field indicating whether a post is a quote post or not.
- `quoted_post` — Media ID of the post that was quoted.

### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>?fields=id,is_quote_post,quoted_post&access_token=<ACCESS_TOKEN>"
```

### Example Response

```code
{
   "id": "12312312312123",
   "is_quote_post": true,
   "quoted_post": {
     "id": "22312312312123"
   }
}
```

On This Page

[Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts#quote-posts)

[Publishing](https://developers.facebook.com/docs/threads/posts/quote-posts#publishing)

[Example Request](https://developers.facebook.com/docs/threads/posts/quote-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/quote-posts#example-response)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/quote-posts#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/quote-posts#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/posts/quote-posts#example-response-2)