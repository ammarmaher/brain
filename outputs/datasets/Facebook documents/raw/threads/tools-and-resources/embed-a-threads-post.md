---
url: https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post
title: oEmbed - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Ftools-and-resources%2Fembed-a-threads-post%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Embed a Threads Post](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#embed-a-threads-post)

[Get the Embed HTML Code](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#get-the-embed-html-code)

[Example Requests](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#example-requests)

[Example Response](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#example-response)

[URL Formats](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#url-formats)

[Embed JS](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#embed-js)

[Post Size](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#post-size)

# Embed a Threads Post

You can use the Threads oEmbed endpoint to retrieve the embed HTML code snippet and essential metadata for a public Threads post, allowing you to render and display a rich preview of the post on an external website or application. Text, image, video, and carousel posts are supported.

### Common Use Cases

- Embed a post in a blog.
- Embed a post in a website.
- Render a post in a content management system.

### Limitations

- The Threads oEmbed endpoint is only intended to be used for embedding Threads content in websites and apps. It is not to be used for any other purpose. Using metadata and post content (or their derivations) from the endpoint for any purpose other than providing a front-end view of the post is strictly prohibited. This prohibition encompasses consuming, manipulating, extracting, or persisting the metadata and content, including but not limited to, deriving information about posts from the metadata for analytics purposes.
- Posts on private, inactive, and age-restricted accounts as well as geo-gated posts are not supported.

### Rate Limits

- You can make up to 1,000 requests every hour.

## Get the Embed HTML Code

You can fetch the embed HTML code programmatically via the API or from [threads.com](https://threads.com/) by clicking on a post's share icon and selecting the **"Get embed code"** button.

To get a Threads post's embed HTML code using the API, send a request to the `/oembed` endpoint:

```code
GET /oembed?url=<URL_OF_THE_POST>
```

- `URL_OF_THE_POST` — The permalink of the Threads post that you want to query.

Upon success, the API will respond with a JSON object containing the post's embed HTML code and additional metadata. The embed HTML code will be in the returned `html` field.

Refer to the [Threads oEmbed reference](https://developers.facebook.com/docs/threads/reference/oembed) for a list of query string parameters you can include to augment the request.

### Example Requests

```code
curl -X GET \ "https://graph.threads.net/v1.0/oembed?url=<URL_OF_THE_POST>"
```

### Example Response

Default fields that are returned:

```code
{
  "type": "rich",
  "version": "1.0",
  "html": "<blockquote class=\"text-post-media\" data-text-post-permalink=...",
  "provider_name": "Threads",
  "provider_url": "https://www.threads.com/",
  "width": 658
}
```

### URL Formats

The `url` query string parameter accepts the following URL formats:

```html
  https://www.threads.com/@{username}/post/{media-shortcode}/
```

```html
  https://www.threads.com/t/{media-shortcode}/
```

### Embed JS

The embed HTML contains a reference to the Threads embed.js JavaScript library. When the library loads, it scans the page for the post HTML and generates the fully rendered post.

```javascript
<script async src="https://www.threads.com/embed.js"></script>
```

### Post Size

The embedded post is responsive and will adapt to the size of its container. This means that the height will vary depending on the container width and the length of the post content. You can set the maximum width by including the `maxwidth` query string parameter in your request.

**Note:** The `maxwidth` must be between 320 and 658 pixels.

On This Page

[Embed a Threads Post](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#embed-a-threads-post)

[Get the Embed HTML Code](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#get-the-embed-html-code)

[Example Requests](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#example-requests)

[Example Response](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#example-response)

[URL Formats](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#url-formats)

[Embed JS](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#embed-js)

[Post Size](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post#post-size)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close