---
url: https://developers.facebook.com/docs/page-stories-api/
title: Stories - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpage-stories-api%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Video API](https://developers.facebook.com/docs/video-api)

- [Overview](https://developers.facebook.com/docs/video-api/overview)
- [Get Started](https://developers.facebook.com/docs/video-api/getting-started)
- [A/B Testing](https://developers.facebook.com/docs/video-api/ab-testing)
- [Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting)
- [Get Videos](https://developers.facebook.com/docs/video-api/guides/get-videos)
- [Get Insights](https://developers.facebook.com/docs/video-api/guides/insights)
- [Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations)
- [Upload a File or Video](https://developers.facebook.com/docs/graph-api/guides/upload)
- [Splitting](https://developers.facebook.com/docs/video-api/guides/splitting)
- [Publish a Video](https://developers.facebook.com/docs/video-api/guides/publishing)
- [Publish a Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing)
- [Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api)
- [Slideshows](https://developers.facebook.com/docs/video-api/guides/slideshows)
- [Stories](https://developers.facebook.com/docs/page-stories-api)
- [Reference](https://developers.facebook.com/docs/video-api/reference)

On This Page

[Facebook Stories API from Meta](https://developers.facebook.com/docs/page-stories-api/#facebook-stories-api-from-meta)

[Before you start](https://developers.facebook.com/docs/page-stories-api/#before-you-start)

[Media requirements](https://developers.facebook.com/docs/page-stories-api/#media-requirements)

[Limitations](https://developers.facebook.com/docs/page-stories-api/#limitations)

[Best practices](https://developers.facebook.com/docs/page-stories-api/#best-practices)

[Video stories](https://developers.facebook.com/docs/page-stories-api/#video-stories)

[Step 1: Initialize session](https://developers.facebook.com/docs/page-stories-api/#initialize)

[Step 2: Upload a video](https://developers.facebook.com/docs/page-stories-api/#step-2--upload-a-video)

[Step 3. Publish a video story](https://developers.facebook.com/docs/page-stories-api/#step-3--publish-a-video-story)

[Photo stories](https://developers.facebook.com/docs/page-stories-api/#photo-stories)

[Step 1. Upload a photo](https://developers.facebook.com/docs/page-stories-api/#step-1--upload-a-photo)

[Step 2. Publish a photo story](https://developers.facebook.com/docs/page-stories-api/#step-2--publish-a-photo-story)

[Get stories](https://developers.facebook.com/docs/page-stories-api/#get-stories)

[See also](https://developers.facebook.com/docs/page-stories-api/#see-also)

# Facebook Stories API from Meta

This document shows you how to use the Facebook Stories API to publish Stories on Facebook Pages.

To publish a story, your app will perform the following steps:

1. Upload your app user's media to the Meta servers
2. Publish the media to your app user's Page as a Story

## Before you start

This guide assumes you have read the [Pages API Overview](https://developers.facebook.com/docs/pages-api/overview) and implemented the needed components, and successfully completed the [Get Started guide](https://developers.facebook.com/docs/pages-api/getting-started).

- You will need to implement Facebook Login or Facebook Login for Business to ask your app users for permissions needed to access their Facebook Pages and to receive Page access tokens.
- Your app users will need to be able to perform the `CREATE_CONTENT` task on the Page represented in the Page access token and give your app the following permissions:


  - `pages_manage_posts`
  - `pages_read_engagement`
  - `pages_show_list`

If you are using a business system user in your API requests, the `business_management` permission is also required.

### Media requirements

You must provide a photo or video that fit the following specifications.

#### Photo specifications

| Property | Specification |
| --- | --- |
| File type | .jpeg, .bmp, .png, .gif, .tiff |
| File size | Files can not exceed 10MB. For .png files, we recommend not exceeding 1MB or the image may appear pixelated. |

#### Video specifications

| Property | Specification |
| --- | --- |
| File Type | .mp4 (recommended) |
| Aspect Ratio | 9 x 16 |
| Resolution | 1080 x 1920 pixels (recommended). Minimum is 540 x 960 pixels |
| Frame Rate | 24 to 60 frames per second |
| Duration | 3 to 90 seconds.<br>A reel published as a story on a Facebook Page can not exceed 60 seconds. |
| Video Settings | |     |     |
| --- | --- |
| - Chroma subsampling 4:2:0<br>- Closed GOP (2-5 seconds)<br>- Compression – H.264, H.265 (VP9, AV1 are also supported) | - Fixed frame rate<br>- Progressive scan | |
| Audio Settings | |     |     |
| --- | --- |
| - Audio bitrate – 128kbs+<br>- Channels – Stereo | - Codec – AAC Low Complexity<br>- Sample rate – 48kHz | |

### Limitations

- A photo or video uploaded for a story can not have been used in a previously published post

- A video story can not exceed 60 seconds

- To include archived stories in your `GET` requests to see a list of your stories, you must
[turn your Facebook story archive on \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwF3laON&_nc_oc=AdrCX4Eb25rHoNonebcnlmkQqnS4CBMMZXf2Z36PTnUntyCkJN5f6HTjfuYdkEpg6Kc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JeTU44HNsSU-KYsIxUOThA&_nc_ss=7b289&oh=00_Af5WXlOX-UuGYsSt6zYo_MLIF2tXmcHtx4ich5fwT57j_g&oe=6A2592E2)](https://www.facebook.com/help/2058997717520567)


### Best practices

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

Code examples within this document are formatted for readability. Replace _**bold, italics values**_, such as _**page\_id**_, with your values.

## Video stories

To publish a video story on a Facebook Page, you will initialize a video upload session with Meta servers, upload the video to Meta servers, then publish the video story.

### Step 1: Initialize session

To initialize an upload session, send a `POST` request to the `/page_id/video_stories` endpoint, where `page_id` is the ID for your Facebook Page, with the `upload_phase` parameter set to `start`.

#### Example request

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_id/video_stories" \
      -d '{
           "upload_phase":"start",
         }'
```

On success, your app receives a JSON response with the ID for the video and the Facebook URL where you will be uploading the video.

#### Example response

```json
{
  "video_id": "video_id",
  "upload_url": "https://rupload.facebook.com/video-upload/v25.0/video_id",
}
```

### Step 2: Upload a video

Now that you have initialized an upload session and received the upload URL, you can upload your video. You can upload either:

- a [hosted video file](https://developers.facebook.com/docs/page-stories-api/#hosted) on a public facing http/https server, such as a CDN
- a [local video file](https://developers.facebook.com/docs/page-stories-api/#local) from your device

#### Upload a hosted file

To upload a hosted file, send a `POST` request to the `upload_url` endpoint you received in the [initialization step](https://developers.facebook.com/docs/page-stories-api/#initialize) with the following parameters:

- `file_url` set to the URL for your video file

Be sure the host is **_`rupload.facebook.com`_**.

The API will now reject files hosted on sites that restrict access via robots.txt. Developers need to ensure that the hosting site allows the “facebookexternalhit/1.1 (+http://www.facebook.com/externalhit\_uatext.php)” user agent to fetch the hosted file.

Files hosted on Meta CDN (e.g.. fbcdn URLs) will get rejected. Instead, developers can use the crossposting feature to publish a video on multiple pages without uploading the video to each page. Refer to our [detailed guidance](https://developers.facebook.com/docs/video-api/guides/crossposting/) on crossposting.

##### Example request

```curl
curl -X POST "https://rupload.facebook.com/video-upload/v25.0/video_id" \
	-H "file_url: https://some.cdn.url/video.mp4"
```

#### Upload a local file

To upload a local file, send a `POST` request to the `upload_url` endpoint you received in the [initialization step](https://developers.facebook.com/docs/page-stories-api/#initialize) with the following parameters:

- `offset` set to `0`
- `file_size` set to the total size in bytes of the video being uploaded

##### Example request

```curl
curl -X POST "https://rupload.facebook.com/video-upload/v25.0/video_id" \
	-H "offset: 0" \
        -H "file_size: file_size_in_bytes" \
	--data-binary "@/path/to/file/my_video_file.mp4"
```

On upload success, your app receives a JSON response with `success` set to `true`.

##### Example upload response

```json
{
    "success": true
}
```

#### Interrupted upload

If the video upload is interrupted, you can either restart the upload or resume it.

- To restart the upload, resend the `POST` request and set `offset` to `0`.
- To resume the upload, resend the `POST` request with `offset` set to the `bytes_transfered` value from a status check.

#### Get the upload status

To check a status of your video, during upload or publishing, send a `GET` request to the **`/video_id`** endpoint with the following parameter:

- `fields` set to `status`

##### Example request

```curl
curl -X GET "https://graph.facebook.com/v25.0/video_id" \
	-d "fields=status"
```

On success, your app receives a JSON response that contains:

- A `status` object that contains:


  - `video_status` with a value of `ready`, `processing`, `expired`, or `error`
  - `uploading_phase`object with the following key-value pairs:


    - `status` set to `in_progress`, `not_started`, `complete`, or `error`
    - `bytes_transfered` set to the bytes that have been uploaded. can be used as the value for `offset` if the upload is interrupted.
  - `processing_phase`object with the following key-value pairs:


    - `status` set to `in_progress`, `not_started`, `complete`, or `error`
  - `processing_phase`object with the following key-value pairs:


    - `status` set to `in_progress`, `not_started`, `complete`, or `error`
    - `publish_status` set to `published` or `not_published`
    - `publish_time` set to a UNIX timestamp of the actual or published time

##### Example response

|     |     |
| --- | --- |
| The following response shows a file that has been successfully uploaded.<br> <br> <br>```json<br>{<br>  "status": {<br>    "video_status": "processing", <br>    "uploading_phase": {<br>      "status": "in_progress", <br>      "bytes_transfered": 50002 <br>    },<br>    "processing_phase": {<br>      "status": "not_started"<br>    }<br>    "publishing_phase": {<br>      "status": "not_started",<br>      "publish_status": "published",<br>      "publish_time": 234523452 <br>    }<br>  }<br>}<br>``` | The following response shows an error has occurred in the processing phase.<br> <br> <br>```json<br>{<br>  "status": {<br>    "video_status": "processing", <br>    "uploading_phase": {<br>      "status": "complete"<br>    },<br>    "processing_phase": {<br>      "status": "not_started",<br>      "error": {<br>        "message": "Resolution too low. Video must have a minimum resolution of 540p."<br>      }<br>    }<br>    "publishing_phase": {<br>      "status": "not_started"<br>    }<br>  }<br>}<br>``` |

### Step 3. Publish a video story

To publish your video story to your Page, you will send a `POST` to the **_`/page_id`_**`/video_stories` endpoint with the following parameters:

- `video_id` set to the ID for your uploaded video
- `upload_phase` set to `finish`

#### Example request

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_id/video_stories" \
      -d '{
           "video_id": "video_id",
           "upload_phase": "finish"
         }'
```

On success, your app receives a JSON response that contains the following key-value pairs:

- `success` set to `true`
- `post_id` set to the ID for your story post

#### Example response

```json
{
  "success": true,
  "post_id": 1234
}
```

## Photo stories

### Step 1. Upload a photo

Visit the
[Page Posts Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwF3laON&_nc_oc=AdrCX4Eb25rHoNonebcnlmkQqnS4CBMMZXf2Z36PTnUntyCkJN5f6HTjfuYdkEpg6Kc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JeTU44HNsSU-KYsIxUOThA&_nc_ss=7b289&oh=00_Af5WXlOX-UuGYsSt6zYo_MLIF2tXmcHtx4ich5fwT57j_g&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/page/photos#upload) to learn how to upload a photo to Meta servers using the `/page_id/photos` endpoint. Be sure to include the `published` parameter and set it to `false`.


### Step 2. Publish a photo story

To publish your photo story to your Page, you will send a `POST` to the **_`/page_id`_**`/photo_stories` endpoint with the following parameters:

- `photo_id` set to the ID for your uploaded photo

#### Example request

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_id/photo_stories" \
      -d '{
           "photo_id": "photo_id"
         }'
```

On success, your app receives a JSON response that contains the following key-value pairs:

- `success` set to `true`
- `post_id` set to the ID for your story post

#### Example response

```json
{
  "success": true,
  "post_id": 1234
}
```

## Get stories

To get a list of all stories for a Page and data about each story, send a `GET` request to the `/` **_`page_id`_**`/stories` endpoint where `page_id` is the ID for the Page you want to view.

#### Example request

```curl

curl -i -X GET "https://graph.facebook.com/v25.0/page_id/stories"
```

On success, your app receives a JSON response with an array of objects where each object contains information about a story published on the Page. Each object contains the following key-value pairs:

- The `post_id` set to the ID for the published story post
- The `status` set to `PUBLISHED`, `ARCHIVED`
- The `creation_time` set to UNIX timestamp when the story was published
- The `media_type` set to either `video` or `photo`
- The `media_id` set to the ID for the video or photo in the story post
- The `url` set to the Facebook URL for the story post, such as `https://facebook.com/stories/8283482737484972`

#### Example Response

```json
{
  "data": [\
    {\
      "post_id": "post_id",\
      "status": "PUBLISHED",\
      "creation_time": "123456",\
      "media_type": "video",\
      "media_id": "video_id",\
      "url": "https://facebook.com/stories…"\
    },\
    {\
      "post_id": "post_id",\
      "status": "PUBLISHED",\
      "creation_time": "123456",\
      "media_type": "photo",\
      "media_id": "photo_id",\
      "url": "https://facebook.com/stories…"\
    },\
    {\
      "post_id": "post_id",\
      "status": "ARCHIVED",\
      "creation_time": "123456",\
      "media_type": "photo",\
      "media_id": "photo_id",\
      "url": "https://facebook.com/stories…"\
    },\
    ...\
  ],
}
```

You can filter stories by status, published or archived, and date, using the `since` and `until` parameters.

## See also

Learn more about the endpoints and concepts discussed in this guide.

#### Relevant guides

- [Business system user](https://developers.facebook.com/docs/marketing-api/system-users)

- [Facebook Login](https://developers.facebook.com/docs/facebook-login)

- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business)

- [Graph API – Paginated Results with since and until](https://developers.facebook.com/docs/graph-api/results#time)


#### Endpoint references

- [Page Reference](https://developers.facebook.com/docs/graph-api/reference/page)

- [Page Video Stories Reference](https://developers.facebook.com/docs/graph-api/reference/page/video_stories)

- [Page Photo Stories Reference](https://developers.facebook.com/docs/graph-api/reference/page/photo_stories)

- [Video Reference](https://developers.facebook.com/docs/graph-api/reference/video)

- [Stories Insights Reference](https://developers.facebook.com/docs/graph-api/reference/stories/insights/)


On This Page

[Facebook Stories API from Meta](https://developers.facebook.com/docs/page-stories-api/#facebook-stories-api-from-meta)

[Before you start](https://developers.facebook.com/docs/page-stories-api/#before-you-start)

[Media requirements](https://developers.facebook.com/docs/page-stories-api/#media-requirements)

[Limitations](https://developers.facebook.com/docs/page-stories-api/#limitations)

[Best practices](https://developers.facebook.com/docs/page-stories-api/#best-practices)

[Video stories](https://developers.facebook.com/docs/page-stories-api/#video-stories)

[Step 1: Initialize session](https://developers.facebook.com/docs/page-stories-api/#initialize)

[Step 2: Upload a video](https://developers.facebook.com/docs/page-stories-api/#step-2--upload-a-video)

[Step 3. Publish a video story](https://developers.facebook.com/docs/page-stories-api/#step-3--publish-a-video-story)

[Photo stories](https://developers.facebook.com/docs/page-stories-api/#photo-stories)

[Step 1. Upload a photo](https://developers.facebook.com/docs/page-stories-api/#step-1--upload-a-photo)

[Step 2. Publish a photo story](https://developers.facebook.com/docs/page-stories-api/#step-2--publish-a-photo-story)

[Get stories](https://developers.facebook.com/docs/page-stories-api/#get-stories)

[See also](https://developers.facebook.com/docs/page-stories-api/#see-also)