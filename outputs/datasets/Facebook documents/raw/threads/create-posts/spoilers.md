---
url: https://developers.facebook.com/docs/threads/create-posts/spoilers
title: Spoilers - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fcreate-posts%2Fspoilers%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#spoilers)

[Text and Media Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#text-and-media-spoilers)

[Create a spoiler within a text field](https://developers.facebook.com/docs/threads/create-posts/spoilers#create-a-spoiler-within-a-text-field)

[Create a media spoiler](https://developers.facebook.com/docs/threads/create-posts/spoilers#create-a-media-spoiler)

[Single Threads Posts](https://developers.facebook.com/docs/threads/create-posts/spoilers#single-threads-posts)

[Step 1: Create a media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-1--create-a-media-container)

[Step 2: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-2--publish-the-media-container)

[Threads Carousel Posts](https://developers.facebook.com/docs/threads/create-posts/spoilers#threads-carousel-posts)

[Step 1: Create a media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-1--create-a-media-container-2)

[Step 2: Create the carousel container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-2--create-the-carousel-container)

[Step 3: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-3--publish-the-media-container)

[Learn More](https://developers.facebook.com/docs/threads/create-posts/spoilers#learn-more)

# Spoilers

You can create posts with spoilers using the Threads API. Spoilers can be added to text in a post or can be used with media types like images and videos.

This document covers:

- [Text and Media Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#text-and-media-spoilers)
- [Single Threads Posts with Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#single-threads-posts)
- [Carousel Posts with Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#threads-carousel-posts)

### Limitations

- Media spoilers only work with a `media_type` of `IMAGE`, `VIDEO` or `CAROUSEL`.
- The maximum number of text spoiler entities per post is limited to 10.

## Text and Media Spoilers

### Create a spoiler within a text field

To create a text post with a spoiler, use the `text_entities` parameter. This parameter takes in a list of `entity_type`, `offset`, and `length` values. Each entry represents part of the text post where the spoiler will be applied.

#### Parameters

| Name | Description |
| --- | --- |
| `entity_type`<br>string | Indicates the kind of `entity_type`.<br>**Values:**`SPOILER`, `spoiler` |
| `offset`<br>int | The starting position of the spoiler.<br>**Values:** Positive whole numbers (0, 1, 2, etc.) |
| `length`<br>int | The length of the spoiler text starting from the `offset` position.<br>**Values:** Positive whole numbers (1, 2, etc.) |

### Create a media spoiler

To create a post with spoilers for media objects (i.e., image, video), use the `is_spoiler_media` parameter.

#### Parameters

| Name | Description |
| --- | --- |
| `is_spoiler_media`<br>Boolean | Indicates if the media should be a spoiler or not.<br>**Values:**`true`, `false` |

## Single Threads Posts

### Step 1: Create a media container

Spoilers for single Threads posts need to be provided during the [media container creation phase](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container).

- If a spoiler needs to be added in the text field of the post, use the `text_entities` parameter.
- If a spoiler needs to be added to the media object in the post, use the `is_spoiler_media` parameter.
- If a spoiler needs to be added to the text and media objects in the post, use both the `text_entities` and `is_spoiler_media` parameters.

#### Example requests

##### Spoiler only in the text field

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=TEXT" \
  -d "text=<TEXT>" \
  -d "text_entities=[\
    {\
      "entity_type": "SPOILER",\
      "offset": 0,\
      "length": 2\
    },\
    {\
      "entity_type": "SPOILER",\
      "offset": 2,\
      "length": 7\
    }\
  ]" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Spoiler only for a media object (image/video)

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=IMAGE" \
  -d "image_url=<IMAGE_URL>" \
  -d "text=<TEXT>" \
  -d "is_spoiler_media=true" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Spoiler for both text and a media object (image/video)

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=IMAGE" \
  -d "image_url=<IMAGE_URL>" \
  -d "text=<TEXT>" \
  -d "is_spoiler_media=true" \
  -d "text_entities=[\
    {\
      "entity_type": "SPOILER",\
      "offset": 0,\
      "length": 2\
    },\
    {\
      "entity_type": "SPOILER",\
      "offset": 2,\
      "length": 7\
    }\
  ]" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Response

If the API call is successful, the Threads media container ID will be returned.

### Step 2: Publish the media container

You can now [publish](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container) using the returned Threads media container ID to create your single Threads post with spoilers.

## Threads Carousel Posts

### Step 1: Create a media container

[Create a media container](https://developers.facebook.com/docs/threads/posts#step-1--create-an-media-container) for each of the items to be included in the carousel.

### Step 2: Create the carousel container

Spoilers for Threads carousel posts need to be provided during the [carousel container creation phase](https://developers.facebook.com/docs/threads/posts#step-2--create-a-carousel-container).

- If a spoiler needs to be added in the text field of the post, use the `text_entities` parameter.
- If a spoiler needs to be added to the media object in the post, use the `is_spoiler_media` parameter.
- If a spoiler needs to be added to the text and media objects in the post, use both the `text_entities` and `is_spoiler_media` parameters.

**Note:** If `is_spoiler_media` is set to `true` all attached media (i.e., images and videos) will be marked as spoilers.

#### Example requests

##### Spoiler only in the text field

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=CAROUSEL" \
  -d "children=<MEDIA_ID_1>,<MEDIA_ID_2>,<MEDIA_ID_3>" \
  -d "text=<TEXT>" \
  -d "text_entities=[\
    {\
      "entity_type": "SPOILER",\
      "text": "spoiler",\
      "offset": 0,\
      "length": 2\
    },\
    {\
      "entity_type": "SPOILER",\
      "text": "spoiler",\
      "offset": 2,\
      "length": 7\
    }\
  ]" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Spoiler only for a media object (image/video)

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=CAROUSEL" \
  -d "children=<MEDIA_ID_1>,<MEDIA_ID_2>,<MEDIA_ID_3>" \
  -d "is_spoiler_media=true" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Spoiler for both text and a media object (image/video)

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "media_type=CAROUSEL" \
  -d "children=<MEDIA_ID_1>,<MEDIA_ID_2>,<MEDIA_ID_3>" \
  -d "text=<TEXT>" \
  -d "is_spoiler_media=true" \
  -d "text_entities=[\
    {\
      "entity_type": "SPOILER",\
      "text": "spoiler",\
      "offset": 0,\
      "length": 2\
    },\
    {\
      "entity_type": "SPOILER",\
      "text": "spoiler",\
      "offset": 2,\
      "length": 7\
    }\
  ]" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Response

If the API call is successful, the Threads media container ID will be returned.

### Step 3: Publish the media container

You can now [publish](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container) using the returned Threads media container ID to create your Threads carousel post with spoilers.

## Learn More

- [Posts](https://developers.facebook.com/docs/threads/posts)
- [Retrieve User Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts)

On This Page

[Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#spoilers)

[Text and Media Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers#text-and-media-spoilers)

[Create a spoiler within a text field](https://developers.facebook.com/docs/threads/create-posts/spoilers#create-a-spoiler-within-a-text-field)

[Create a media spoiler](https://developers.facebook.com/docs/threads/create-posts/spoilers#create-a-media-spoiler)

[Single Threads Posts](https://developers.facebook.com/docs/threads/create-posts/spoilers#single-threads-posts)

[Step 1: Create a media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-1--create-a-media-container)

[Step 2: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-2--publish-the-media-container)

[Threads Carousel Posts](https://developers.facebook.com/docs/threads/create-posts/spoilers#threads-carousel-posts)

[Step 1: Create a media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-1--create-a-media-container-2)

[Step 2: Create the carousel container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-2--create-the-carousel-container)

[Step 3: Publish the media container](https://developers.facebook.com/docs/threads/create-posts/spoilers#step-3--publish-the-media-container)

[Learn More](https://developers.facebook.com/docs/threads/create-posts/spoilers#learn-more)