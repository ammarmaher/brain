---
url: https://developers.facebook.com/docs/threads/create-posts/text-attachments
title: Text Attachments - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fcreate-posts%2Ftext-attachments%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments#text-attachments)

[Create a Post with a Text Attachment](https://developers.facebook.com/docs/threads/create-posts/text-attachments#create-a-post-with-a-text-attachment)

[Step 1: Create a Threads media container](https://developers.facebook.com/docs/threads/create-posts/text-attachments#step-1--create-a-threads-media-container)

[Step 2: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/text-attachments#step-2--publish-the-media-container)

[Retrieve Posts with Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments#retrieve-posts-with-text-attachments)

[Parameters](https://developers.facebook.com/docs/threads/create-posts/text-attachments#parameters)

[Example request](https://developers.facebook.com/docs/threads/create-posts/text-attachments#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/text-attachments#example-response)

[Learn More](https://developers.facebook.com/docs/threads/create-posts/text-attachments#learn-more)

# Text Attachments

You can create posts with text attachments using the Threads API. Text attachments allow you to share long-form writing in a post or a reply with up to 10,000 characters and a link. They can also include emojis and style formatting.

### Limitations

- Text attachments can only be attached to text-only posts.
- Text attachments cannot be attached to a post that has a poll.
- If there is already a [link attachment](https://developers.facebook.com/docs/threads/posts#links) in the main post, a link attachment cannot be added in the text attachment.
- The number of links is restricted to 5 or less.

Starting December 22, 2025, Threads posts containing more than 5 links will fail to post during the media creation step (`POST /{threads-user-id}/threads`) with the error code: `THREADS_API__LINK_LIMIT_EXCEEDED`.

How links are counted:

- All unique URLs found in the `text` field are counted as links.
- If the `link_attachment_url` field under the `text_attachment` field contains a URL that is different from all URLs in the `text` field, it is counted as an additional link.
- If the `link_attachment_url` field under the `text_attachment` field is the same as any URL in the `text` field, it is only counted once, rather than twice.

Examples:

- If the `text` field contains only www.facebook.com, and the `link_attachment_url` is also www.facebook.com, this counts as 1 link.
- If the `text` field contains www.instagram.com and www.threads.com, and the `link_attachment_url` is www.facebook.com, this counts as 3 links.
- If the `text` field contains www.example.com, www.example.com, and www.test.com, and the `link_attachment_url` is www.test.com, this counts as 2 links (www.example.com and www.test.com are each counted once).

If you receive this error, reduce the number of unique links in your post to 5 or less.

## Create a Post with a Text Attachment

### Step 1: Create a Threads media container

You can add a text attachment to a post by making a request to the `POST /{threads-user-id}/threads` endpoint to create a media container with the `text_attachment` JSON object.

#### Parameters

| Name | Description |
| --- | --- |
| `plaintext`<br>string | **Required.**<br>The text of the text attachment with a maximum of 10K characters. |
| `link_attachment_url`<br>URL | **Optional.**<br>The URL of a link to include in the text attachment. |
| `text_with_styling_info`<br>string | **Optional.**<br>The styling info be applied to the text and where it should appear.<br>**Values:**`offset`, `length`, `styling_info`<br>**Note:** The text styling info ranges within the `text_with_styling_info` field should not overlap.<br>Available text styles:<br>- Bold<br>- Italic<br>- Highlight<br>- Underline<br>- Strikethrough |

#### Example request

```html
curl -i -X POST \
  -d "media_type=TEXT" \
  -d "text=<TEXT>" \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "text_attachment=
    {
      "plaintext": "Lengthy plain text for the text attachment.",
      "link_attachment_url": "<LINK_URL>",
      "text_with_styling_info":[\
        {\
          "offset": 0,\
          "length": 7,\
          "styling_info":["bold","italic"]\
        },\
        {\
          "offset": 7,\
          "length": 10,\
          "styling_info":["highlight"]\
        }]
    }" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Example response

```json
{
  "id": "<THREADS_MEDIA_CONTAINER_ID>"
}
```

### Step 2: Publish the media container

You can [publish](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container) using the returned Threads media container ID to create your Threads post with a text attachment.

## Retrieve Posts with Text Attachments

Make a request to the `GET /{threads-user-id}/threads` or `GET /{threads-media-id}` endpoint with the `text_attachment` field to retrieve any media object(s) with text attachments.

### Parameters

| Name | Description |
| --- | --- |
| `text_attachment` | The text attachment for the post. |

### Example request

```html
curl -i -X GET \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "fields=id,text_attachment" \
"https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>
```

### Example response

```json
{
  "id": "<THREADS_MEDIA_ID>",
  "text_attachment": {
    "plaintext": "Lengthy plaintext for the text attachment.",
    "link_attachment_url": "<LINK_URL>",
    "text_with_styling_info": [\
      {\
        "offset": 0,\
        "length": 7,\
        "styling_info":["bold","italic"]\
      },\
      {\
        "offset": 7,\
        "length": 10,\
        "styling_info":["highlight"]\
      }]
  }
}
```

## Learn More

- [Posts](https://developers.facebook.com/docs/threads/posts)
- [Retrieve User Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts)

On This Page

[Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments#text-attachments)

[Create a Post with a Text Attachment](https://developers.facebook.com/docs/threads/create-posts/text-attachments#create-a-post-with-a-text-attachment)

[Step 1: Create a Threads media container](https://developers.facebook.com/docs/threads/create-posts/text-attachments#step-1--create-a-threads-media-container)

[Step 2: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/text-attachments#step-2--publish-the-media-container)

[Retrieve Posts with Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments#retrieve-posts-with-text-attachments)

[Parameters](https://developers.facebook.com/docs/threads/create-posts/text-attachments#parameters)

[Example request](https://developers.facebook.com/docs/threads/create-posts/text-attachments#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/text-attachments#example-response)

[Learn More](https://developers.facebook.com/docs/threads/create-posts/text-attachments#learn-more)