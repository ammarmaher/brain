---
url: https://developers.facebook.com/docs/threads/posts/
title: Posts - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fposts%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Threads Posts](https://developers.facebook.com/docs/threads/posts/#threads-posts)

[Single Thread Posts](https://developers.facebook.com/docs/threads/posts/#single-thread-posts)

[Limitations](https://developers.facebook.com/docs/threads/posts/#limitations)

[Step 1: Create a Threads media container](https://developers.facebook.com/docs/threads/posts/#step-1--create-a-threads-media-container)

[Step 2: Publish the Threads media container](https://developers.facebook.com/docs/threads/posts/#step-2--publish-the-threads-media-container)

[Carousel Posts](https://developers.facebook.com/docs/threads/posts/#carousel-posts)

[Step 1: Create an media container](https://developers.facebook.com/docs/threads/posts/#step-1--create-an-media-container)

[Step 2: Create a carousel container](https://developers.facebook.com/docs/threads/posts/#step-2--create-a-carousel-container)

[Step 3: Publish the carousel container](https://developers.facebook.com/docs/threads/posts/#step-3--publish-the-carousel-container)

[Topic Tags, Links, and GIFs](https://developers.facebook.com/docs/threads/posts/#topic-tags--links--and-gifs)

[Topic Tags](https://developers.facebook.com/docs/threads/posts/#topic-tags)

[Links](https://developers.facebook.com/docs/threads/posts/#links)

[GIFs](https://developers.facebook.com/docs/threads/posts/#gifs)

[Media Specifications](https://developers.facebook.com/docs/threads/posts/#media-specifications)

[Image Specifications](https://developers.facebook.com/docs/threads/posts/#image-specifications)

[Video Specifications](https://developers.facebook.com/docs/threads/posts/#video-specifications)

[Learn More](https://developers.facebook.com/docs/threads/posts/#learn-more)

# Threads Posts

You can use the Threads API to publish image, video, text, or carousel posts.

This document covers:

- [Single Thread Posts](https://developers.facebook.com/docs/threads/posts/#single-thread-posts)
- [Carousel Posts](https://developers.facebook.com/docs/threads/posts/#carousel-posts)
- [Topic Tags, Links, and GIFs](https://developers.facebook.com/docs/threads/posts/#topic-tags--links--and-gifs)
- [Media Specifications](https://developers.facebook.com/docs/threads/posts/#media-specifications)

## Single Thread Posts

Publishing a single image, video, or text post is a two-step process:

1. Create a media container with text only or with an image or video hosted on your public server with optional text using the `POST /{threads-user-id}/threads` endpoint.
2. Publish the media container using the `POST /{threads-user-id}/threads_publish` endpoint.

### Limitations

- Text posts are limited to 500 characters.
- Emojis are counted as the [number of UTF-8 bytes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgrapheme-splitter&h=AUDj3jVhuRS1PldfUIKT5Q5AViNReCRNsz8bFiHdks3Ps7Jpjyt6f_3OPnrMtvjc8AVcGUVfgAMzR3SMtYpWjiLAHEccigf9nq9JzMocK-oU9WAEpTy30J9cBm8SnBTSjf_AYZfP55DfPg).

### Step 1: Create a Threads media container

Use the `POST /{threads-user-id}/threads` endpoint to create a Threads media container.

#### Parameters

| Name | Description |
| --- | --- |
| `is_carousel_item`<br>Boolean | **Required.**<br>Indicates that images and/or videos will appear in a carousel.<br>**Values:**`true`, `false` ( _default_ for single thread posts) |
| `media_type`<br>string | **Required.**<br>Indicates the current media type.<br>**Values:**`TEXT`, `IMAGE`, `VIDEO`<br>**Note:**`CAROUSEL` is not available for single thread posts. |
| `image_url`<br>URL | **Optional. Required for `media_type=IMAGE`.**<br>The URL path to the image.<br>**Note:** We will cURL your image using the URL provided so it must be on a public server. |
| `video_url`<br>URL | **Optional. Required for `media_type=VIDEO`.**<br>The URL path to the video.<br>**Note:** We will cURL your video using the URL provided so it must be on a public server. |
| `text`<br>string | **Optional. Required for `media_type=TEXT`.**<br>The text associated with the post. If any URLs are included, the first URL in the `text` field will be used as the link preview for the post.<br>**Note:** For the post character limit, emojis are counted as the [number of UTF-8 bytes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgrapheme-splitter&h=AUClGRKl6XLAvaHMTzJG8miG4axmO27Unj_XJ4JboGZFfhrCL7ChJQCSOFUkKqRCBiqrZ-uAOQcABnIOo80Za-psIkiP9H7wzgUvdgyb0TB4VtQzjDiDVhpp8bNMjGjWTMDYPQdix61LCg). |

Refer to the [`POST /{threads-user-id}/threads` endpoint reference](https://developers.facebook.com/docs/threads/reference/publishing#post---threads-user-id--threads) for additional supported parameters.

#### Example Request

```html
curl -i -X POST \
  -d "media_type=IMAGE" \
  -d "image_url=<IMAGE_URL>" \
  -d "text=<TEXT>" \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Example Response

```json
{
  "id": "<THREADS_MEDIA_CONTAINER_ID>"
}
```

### Step 2: Publish the Threads media container

Use the `POST /{threads-user-id}/threads_publish` endpoint to publish the media container ID returned in the previous step.

It is recommended to wait on average 30 seconds before publishing a Threads media container to give our server enough time to fully process the upload. See the [media container status endpoint](https://developers.facebook.com/docs/threads/troubleshooting#publishing-does-not-return-a-media-id) for more details.

#### Parameters

| Name | Description |
| --- | --- |
| `creation_id`<br>int | **Required.**<br>The Threads media container ID. |

#### Example Request

```html
curl -i -X POST \
  -d "creation_id=<MEDIA_CONTAINER_ID>" \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publish"
```

#### Example Response

```json
{
  "id": "<THREADS_MEDIA_ID>"
}
```

## Carousel Posts

You may publish up to 20 images, videos, or a mix of the two in a carousel post. Publishing carousels is a three-step process:

1. Create the individual media containers for each image and video that should appear in the carousel using the `POST /{threads-user-id}/threads` endpoint.
2. Create a single carousel container to contain the media containers using the `POST /{threads-user-id}/threads` endpoint.
3. Publish the carousel container using the `POST /{threads-user-id}/threads_publish` endpoint.

**Note:** Carousel posts count as a single post against a profile's [rate limit](https://developers.facebook.com/docs/threads/overview#rate-limiting).

#### Limitations

- Carousels are limited to 20 images, videos, or a mix of the two.
- Carousels require a minimum of two children.

### Step 1: Create an media container

Use the `POST /{threads-user-id}/threads` endpoint to create a media container for each of the images and/or videos that will appear in the carousel.

#### Parameters

| Name | Description |
| --- | --- |
| `is_carousel_item`<br>Boolean | **Required.**<br>Indicates that images and/or videos will appear in a carousel when set to `true`.<br>**Values:**`true`, `false` |
| `media_type`<br>string | **Required.**<br>Indicates the current media type.<br>**Values:**`IMAGE`, `VIDEO`<br>**Note:**`CAROUSEL` is not available for single thread posts. |
| `image_url`<br>URL | **Optional. Required for `media_type=IMAGE`.**<br>The URL path to the image.<br>**Note:** We will cURL your image using the URL provided so it must be on a public server. |
| `video_url`<br>URL | **Optional. Required for `media_type=VIDEO`.**<br>The URL path to the video.<br>**Note:** We will cURL your video using the URL provided so it must be on a public server. |
| `text`<br>string | **Optional.**<br>The text associated with the post. If any URLs are included, the first URL in the `text` field will be used as the link preview for the post.<br>**Note:** For the post character limit, emojis are counted as the [number of UTF-8 bytes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgrapheme-splitter&h=AUDoJf_ZUGC_heBvg0-Zc3jyx00clYXAtwxi1eOxFgAVuhs2GGGlYnVOVXbl7zP_LuVUZapbw_kAsewCuZYwSNYXly713uIn0JY9I6mZQSt4E4MkGX888o2Dy7OFzgM4p7Q1PPHXJoGNkQ). |

Refer to the [`POST /{threads-user-id}/threads` endpoint reference](https://developers.facebook.com/docs/threads/reference/publishing#post---threads-user-id--threads) for additional supported parameters.

#### Example Request

```html
curl -i -X POST \
  -d "image_url=<IMAGE_URL>" \
  -d "is_carousel_item=true" \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Example Response

```json
{
  "id": "<THREADS_MEDIA_CONTAINER_ID>"
}
```

If the operation is successful, the API will return an media container ID, which can be used when creating the carousel container.

Repeat this process for each image and/or video that will appear in the carousel.

### Step 2: Create a carousel container

Use the `POST /{threads-user-id}/threads` endpoint to create a carousel container.

#### Parameters

| Name | Description |
| --- | --- |
| `media_type`<br>string | **Required.**<br>Indicates the current media type.<br>**Value:**`CAROUSEL` |
| `children`<br>list<int> | **Required.**<br>A comma-separated list of the media container IDs of the images and/or videos that should appear in the published carousel.<br>**Note:** Carousels must have at least 2 and no more than 20 total images, videos, or a mix of the two. |
| `text`<br>string | **Optional.**<br>The text associated with the post. |

Refer to the [`POST /{threads-user-id}/threads` endpoint reference](https://developers.facebook.com/docs/threads/reference/publishing#post---threads-user-id--threads) for additional supported parameters.

#### Example Request

```html
curl -i -X POST \
  -d "media_type=CAROUSEL" \
  -d "children=<MEDIA_ID_1>,<MEDIA_ID_2>,<MEDIA_ID_3>,..." \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Example Response

```json
{
  "id": "<THREADS_CAROUSEL_CONTAINER_ID>"
}
```

### Step 3: Publish the carousel container

Use the `POST /{threads-user-id}/threads_publish` endpoint to publish a carousel post.

**Note:** Profiles are limited to 250 published posts within a 24-hour period. Publishing a carousel counts as a single post.

#### Parameters

| Name | Description |
| --- | --- |
| `creation_id`<br>int | **Required.**<br>The Threads carousel container ID. |

#### Example Request

```html
curl -i -X POST \
  -d "creation_id=<MEDIA_CONTAINER_ID>" \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publish"
```

#### Example Response

```json
{
  "id": "<THREADS_MEDIA_ID>"
}
```

If the operation is successful, the API will return the carousel album's Threads media ID.

## Topic Tags, Links, and GIFs

Topics and links appear in posts in such a way as to encourage engagement.

### Topic Tags

Topics make posts more social by allowing central topics of discussion. You can include a topic in a post either by using the `topic_tag` parameter or by including a tag within the text of a post.

#### Using the `topic_tag` parameter

**Note:** Topic tags must be at least 1 character and no more than 50 characters long. The following characters are not allowed:

- Periods (.)
- Ampersands (&)

##### Example request

```html
curl -i -X POST \
  -d "media_type=TEXT" \
  -d "text=<Text>" \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "topic_tag=<TAG>" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

#### Using an in-text topic tag

This method is not preferred but is kept for backwards compatability.

A topic can also be attached to a post by including it in-line within the text of the post. Only one topic tag is allowed per post, so the first valid tag included in a post of any type (text-only, image, video, carousel) via the API is treated as the tag for that post.

Information to keep in mind when adding a topic to a post using an in-text tag:

- Valid tags start with a hash sign (#).
- The text is also configured in the app without the hash sign.
- Topic must be at least 1 character and no more than 50 characters long.
- Whole numbers that are preceded by a hash sign (i.e., #1) will not be converted into a tag. This is because it is assumed that # is signifying a number sign in this scenario.
- The following characters are not allowed when using in-text tags with the Threads API, so any in-text tag that starts with a hash sign will end just before these characters:

  - Spaces, Tabs, New Line Characters
  - Periods (.)
  - Ampersands (&)
  - At Signs (@)
  - Exclamation Marks (!)
  - Question Marks (?)
  - Commas (,)
  - Semi-Colons (;)
  - Colons (:)

### Links

To attach a link to your post, use the `link_attachment` parameter when creating a media container.
If no `link_attachment` parameter is provided, then the first link made in a text-only post via the API is configured as the link attachment, which displays as a preview card, to make it easier to engage with and click on.

#### Limitations

- This feature is only available for text-only posts. It will not work with image, video, or carousel posts.
- The number of links is restricted to 5 or less.

Starting December 22, 2025, Threads posts containing more than 5 links will fail to post during the media creation step (`POST /{threads-user-id}/threads`) with the error code: `THREADS_API__LINK_LIMIT_EXCEEDED`.

How links are counted:

- All unique URLs found in the text field are counted as links.
- If the `link_attachment` field contains a URL that is different from all URLs in the text field, it is counted as an additional link.
- If the `link_attachment` URL is the same as any URL in the text field, it is only counted once, rather than twice.

Examples:

- If the `text` field contains only www.facebook.com, and the `link_attachment` is also www.facebook.com, this counts as 1 link.
- If the `text` field contains www.instagram.com and www.threads.com, and the `link_attachment` is www.facebook.com, this counts as 3 links.
- If the `text` field contains www.example.com, www.example.com, and www.test.com, and the `link_attachment` is www.test.com, this counts as 2 links (www.example.com and www.test.com are each counted once).

If you receive this error, reduce the number of unique links in your post to 5 or less.

#### Publishing

Links can be attached when making an API call to the `POST /{threads-user-id}/threads` endpoint to [create a media container](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container).

| Name | Description |
| --- | --- |
| `link_attachment`<br>URL | **Optional.**<br>The URL that should be attached to a Threads post and displayed as a link preview. This must be a valid, publicly accessible URL.<br>**Note:** Can only be used for `media_type=TEXT` posts. |

##### Example Request

```html
curl -i -X POST \
  -d "media_type=TEXT" \
  -d "text=<TEXT>" \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "link_attachment=<URL> \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Example Response

```json
{
  "id": "<THREADS_MEDIA_CONTAINER_ID>"
}
```

The request above creates a Threads media container that, once [published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will attach a link preview to your media.

#### Media Retrieval

The value for the `link_attachment` URL can be retrieved by making a request to the `GET /threads` or `GET /{threads_media_id}` endpoint to [retrieve media object(s)](https://developers.facebook.com/docs/threads/threads-media).

| Name | Description |
| --- | --- |
| `link_attachment_url`<br>URL | The URL attached to a Threads post. |

##### Example Request

```html
curl -s -X GET \
"https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>?fields=id,link_attachment_url&access_token=<ACCESS_TOKEN>"
```

##### Example Response

```json
{
   "id": "<THREADS_MEDIA_ID>",
   "link_attachment_url": "<LINK_ATTACHMENT_URL>",
}
```

### GIFs

GIFs make posts more engaging by allowing users to express reactions, emotions, or ideas visually.

#### Limitations

- This feature is only available for text-only posts. It will not work on image, video, or carousel posts.
- [GIPHY](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.giphy.com%2Fdocs%2Fapi&h=AUA6GWCVkO4gRYIHHYKMM9IApohortPJGFfG6RGSv066-xe09C-V1FpB1ZB9L7hbSlxcFhbPG3YiiuyieLNUsAhk8YVI1SmVYuc52OB1gji4Y8p83egOMN3Lfi7g1hjyx23MAfueA22Plg) is currently the only available GIF provider.

#### Publishing

GIFS can be attached when making an API call to the `POST /{threads-user-id}/threads` endpoint to [create a media container](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container).

| Name | Description |
| --- | --- |
| `gif_attachment`<br>object | **Optional.**<br>The ID and GIF provider for the GIF to attach to the post.<br>**Fields:**`gif_id`, `provider` |

##### Example request

```html
curl -i -X POST \
  -d "media_type=TEXT" \
  -d "text=<Text> \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "gif_attachment={"gif_id":"<GIF_ID>","provider":"GIPHY"}" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

**Note:** The value of the `id` field you receive from the GIF provider’s API response should be used as the `<GIF_ID>` in the API call.

##### Example response

```json
{
 "id": "<THREADS_MEDIA_ID>"
}
```

The request above creates a Threads media container that, once [published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will attach a GIF to your media.

## Media Specifications

### Image Specifications

- **Format:** JPEG and PNG image types are the officially supported formats for image posts.
- **File Size:** 8 MB maximum.
- **Aspect Ratio Limit:** 10:1
- **Minimum Width:** 320 (will be scaled up to the minimum if necessary)
- **Maximum Width:** 1440 (will be scaled down to the maximum if necessary)
- **Height:** Varies (depending on width and aspect ratio)
- **Color Space:** sRGB. Images using other color spaces will have their color spaces converted to sRGB.

### Video Specifications

- **Container:** MOV or MP4 (MPEG-4 Part 14), no edit lists, moov atom at the front of the file.
- **Audio Codec:** AAC, 48khz sample rate maximum, 1 or 2 channels (mono or stereo).
- **Video Codec:** HEVC or H264, progressive scan, closed GOP, 4:2:0 chroma subsampling.
- **Frame Rate:** 23-60 FPS
- **Picture Size:**
  - Maximum Columns (horizontal pixels): 1920
  - Required aspect ratio is between 0.01:1 and 10:1 but we recommend 9:16 to avoid cropping or blank space.
- **Video Bitrate:** VBR, 100 Mbps maximum.
- **Audio Bitrate:** 128 kbps.
- **Duration:** 300 seconds (5 minutes) maximum, minimum longer than 0 seconds.
- **File Size:** 1 GB maximum.

## Learn More

- [Reposts](https://developers.facebook.com/docs/threads/posts/reposts)
- [Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts)
- [Polls](https://developers.facebook.com/docs/threads/create-posts/polls)
- [Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers)
- [Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments)

On This Page

[Threads Posts](https://developers.facebook.com/docs/threads/posts/#threads-posts)

[Single Thread Posts](https://developers.facebook.com/docs/threads/posts/#single-thread-posts)

[Limitations](https://developers.facebook.com/docs/threads/posts/#limitations)

[Step 1: Create a Threads media container](https://developers.facebook.com/docs/threads/posts/#step-1--create-a-threads-media-container)

[Step 2: Publish the Threads media container](https://developers.facebook.com/docs/threads/posts/#step-2--publish-the-threads-media-container)

[Carousel Posts](https://developers.facebook.com/docs/threads/posts/#carousel-posts)

[Step 1: Create an media container](https://developers.facebook.com/docs/threads/posts/#step-1--create-an-media-container)

[Step 2: Create a carousel container](https://developers.facebook.com/docs/threads/posts/#step-2--create-a-carousel-container)

[Step 3: Publish the carousel container](https://developers.facebook.com/docs/threads/posts/#step-3--publish-the-carousel-container)

[Topic Tags, Links, and GIFs](https://developers.facebook.com/docs/threads/posts/#topic-tags--links--and-gifs)

[Topic Tags](https://developers.facebook.com/docs/threads/posts/#topic-tags)

[Links](https://developers.facebook.com/docs/threads/posts/#links)

[GIFs](https://developers.facebook.com/docs/threads/posts/#gifs)

[Media Specifications](https://developers.facebook.com/docs/threads/posts/#media-specifications)

[Image Specifications](https://developers.facebook.com/docs/threads/posts/#image-specifications)

[Video Specifications](https://developers.facebook.com/docs/threads/posts/#video-specifications)

[Learn More](https://developers.facebook.com/docs/threads/posts/#learn-more)