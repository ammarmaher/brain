---
url: https://developers.facebook.com/docs/live-video-api/guides/streaming
title: Broadcast a video - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fguides%2Fstreaming%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Live Video API](https://developers.facebook.com/docs/live-video-api)

- [Overview](https://developers.facebook.com/docs/live-video-api/overview)
- [Get Started](https://developers.facebook.com/docs/live-video-api/getting-started)
- [Broadcast a video](https://developers.facebook.com/docs/live-video-api/guides/streaming)
- [Schedule a video](https://developers.facebook.com/docs/live-video-api/guides/scheduling)
- [Create a Backup Stream](https://developers.facebook.com/docs/live-video-api/backup_stream)
- [Crosspost a video](https://developers.facebook.com/docs/live-video-api/guides/crossposting)
- [Target an Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting)
- [Interact with viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers)
- [Poll viewers](https://developers.facebook.com/docs/live-video-api/polls)
- [Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test)
- [Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api)
- [Copyrighted Content](https://developers.facebook.com/docs/live-video-api/guides/copyrighted-content)
- [Best Practices](https://developers.facebook.com/docs/live-video-api/best-practices)
- [Support](https://developers.facebook.com/docs/live-video-api/support)
- [Reference](https://developers.facebook.com/docs/live-video-api/reference)
- [Changelog](https://developers.facebook.com/docs/live-video-api/changelog)

On This Page

[Broadcasting](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcasting)

[Broadcast on a User](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcast-on-a-user)

[Broadcast on a Page](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcast-on-a-page)

[Get Broadcast Stream Data](https://developers.facebook.com/docs/live-video-api/guides/streaming#get-broadcast-stream-data)

[End a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/streaming#end-a-broadcast)

[Delete a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/streaming#delete-a-broadcast)

[Frame-Accurate Go-Live](https://developers.facebook.com/docs/live-video-api/guides/streaming#frame-accurate-go-live)

[Go-Live RTMP Message Structure](https://developers.facebook.com/docs/live-video-api/guides/streaming#go-live-rtmp-message-structure)

[Sample Request](https://developers.facebook.com/docs/live-video-api/guides/streaming#sample-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/guides/streaming#sample-response)

[Get Error Code Data](https://developers.facebook.com/docs/live-video-api/guides/streaming#get-error-code-data)

[Common Live Video API error codes](https://developers.facebook.com/docs/live-video-api/guides/streaming#common-live-video-api-error-codes)

[Permission error codes](https://developers.facebook.com/docs/live-video-api/guides/streaming#permission-error-codes)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/streaming#see-also)

# Broadcasting

To broadcast a live video, you must first create a `LiveVideo` object. The `LiveVideo` object represents the broadcast, and you can manipulate the object's properties to control the broadcast's settings. Upon creation, the API will return the `LiveVideo` object's ID and a stream URL, which you can pass to your encoder and use to stream data to the `LiveVideo` object.

On June 10th, 2024, Meta is launching new requirements that must meet before an account can go live on Facebook. The new requirements are as follows:

- The Facebook account must be at least 60 days old

- The Facebook Page or [professional mode profile](https://www.facebook.com/business/help/2680340558863560) must have at least 100 followers


Visit our
[Help Center \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/guides/streaming#) to learn more about this change.



## Broadcast on a User

To broadcast on a `User` object, get a User access token with the `publish_video` permission and send a request to:

`POST /<USER_ID>/live_videos?status=LIVE_NOW`

Refer to the `/live_videos` edge reference to see additional query string parameters you can include to describe the broadcast, such as a title and description.

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

Upon success, the API will create a `LiveVideo` object on the User and return a `secure_stream_url` and the `LiveVideo` object's `id`. The broadcast will appear in a post on the User's profile as soon as you send data to the secure stream URL. You can query the `LiveVideo` object to monitor the broadcast's health and to end the broadcast.

#### Sample Request

```code
curl -i -X POST \
 "https://graph.facebook.com/v25.0/<USER_ID>/live_videos
   ?status=LIVE_NOW
   &title=Today%27s%20Live%20Video
   &description=This%20is%20the%20live%20video%20for%20today."
```

#### Sample Response

```js
{
  "id": "1953020644813104",      //<LIVE_VIDEO_ID>
  "stream_url": "rtmp://rtmp-api.facebook...",
  "secure_stream_url":"rtmps://rtmp-api.facebook..."
}
```

## Broadcast on a Page

To broadcast a live video on a `Page`, get a Page access token of an admin of the Page with the `pages_read_engagement` and
`pages_manage_posts` permissions, then send a request to:

`POST /<PAGE_ID>/live_videos?status=LIVE_NOW`

Refer to the `/live_videos` edge reference to see additional query string parameters you can include to describe the broadcast, such as a title and description.

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

Upon success, the API will create a `LiveVideo` object on the Page and return a `secure_stream_url` and the `LiveVideo` object's `id`. The broadcast will appear in a post on the Page as soon as you send data to the secure stream URL. You can query the `LiveVideo` object to monitor the broadcast's health and to end the broadcast.

#### Sample Request

```code
curl -i -X POST \
  "https://graph.facebook.com/v25.0/<PAGE_ID>/live_videos
    ?status=LIVE_NOW
    &title=Today%27s%20Page%20Live%20Video
    &description=This%20is%20the%20live%20video%20for%20the%20Page%20for%20today"
```

#### Sample Response

```js
{
  "id": "1953020644813108",     //<LIVE_VIDEO_ID>
  "stream_url": "rtmp://rtmp-api.facebook...",
  "secure_stream_url":"rtmps://rtmp-api.facebook..."
}
```

## Get Broadcast Stream Data

You can read a `LiveVideo` object to get the broadcast stream's preview URLs and data on streaming health, such as bitrates and framerates. Stream health data refreshes every 2 seconds, so limit queries to no more than once every 2 seconds. A stream timeout will be detected and reported after 4 seconds of no data being received.

To read a `LiveVideo` object, get an appropriate User or Page access token with the `publish_video` permission, then send a query to:

`GET /<LIVE_VIDEO_ID>?fields=<COMMA_SEPARATED_LIST_OF_FIELDS>`

Use the `{fields}` parameter to specify the LiveVideo object fields you want returned. For example, here's a request to get the `ingest_streams` on the `LiveVideo` object, which includes data about stream health:

#### Sample Request

```code
curl -i -X GET \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?fields=ingest_streams"
```

#### Sample Response

```js
{
  "ingest_streams": [\
    {\
      "stream_id": "0",\
      "stream_url": "rtmp://rtmp-api.facebook...",\
      "secure_stream_url": "rtmps://rtmp-api.facebook...",\
      "is_master": true,\
      "stream_health": {\
        "video_bitrate": 4024116,\
        "video_framerate": 60,\
        "video_gop_size": 2000,\
        "video_height": 720,\
        "video_width": 1280,\
        "audio_bitrate": 128745.4921875\
      },\
      "id": "1914910145231512"  // <INGEST_STREAM_ID>\
    }\
  ],
  "id": "<LIVE_VIDEO_ID>"
}
```

**Response Properties**

| Field Name | Description |
| --- | --- |
| `audio_bitrate` | Bits per second of the incoming audio stream. |
| `is_master` | `true` if the Live Video ID being queried is the video being delivered to an audience. |
| `secure_stream_url` | The secure RTMPS ingest URL for the Live Video ID being queried. |
| `stream_url` | The RTMP ingest URL for the Live Video ID being queried. |
| `video_bitrate` | Bits per second of the incoming video stream. |
| `video_framerate` | Frames per second of the incoming video stream. |
| `video_gop_size` | GOP (group of pictures) size in milliseconds. |
| `video_height` | Height in pixels of the incoming video frame. |
| `video_width` | Width in pixels of the incoming video frame. |

## End a Broadcast

To end a broadcast, stop streaming live video data from your encoder to the stream URL or send a request to:

`POST /<LIVE_VIDEO_ID>?end_live_video=true`

This sets the `LiveVideo` object's status to `VOD` and saves it as a video-on-demand (VOD) so it can be viewed later.

Upon success, the API will return the `LiveVideo` object's ID.

#### Sample Request

```code
curl -i -X POST \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?end_live_video=true"
```

#### Sample Response

```js
{
  "id": "10213570560993813"  //<LIVE_VIDEO_ID>
}
```

You can perform a `GET` operation on the LiveVideo ID to confirm that its status has been set to `VOD`:

`GET /<LIVE_VIDEO_ID>?fields=status`

#### Sample Response

```js
{
  "status": "VOD",  // Broadcast ended, saved as VOD
  "id": "10213570560993813"    //<LIVE_VIDEO_ID>
}
```

## Delete a Broadcast

To delete a broadcast that has ended and saved as a VOD, send a request to:

`DELETE /<LIVE_VIDEO_ID>`

#### Sample Request

```code
curl -i -X DELETE \
 "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>"
```

#### Sample Response

```js
{
  success: true
}
```

## Frame-Accurate Go-Live

There can be a slight delay before a broadcast goes live while we decode its initial streaming data and process any associated API requests. This can make it difficult for on-air talent to know exactly when a broadcast has started. To avoid this problem, LiveVideo objects can be set to accept streaming data but to not go live to audiences until a go-live RTMP message is detected within the streaming data itself. This allows anyone who is able to preview a broadcast to see it, while allowing the streaming encoder to precisely control both the time at which the broadcast goes live for an audience and the first frame that the audience sees.

To enable frame-accurate go-live, first create a LiveVideo object as you normally would and set its status to PREVIEW. Once it has been created, query the LiveVideo object and request the secure\_stream\_url field with the following nested fields:

```http
secure_stream_url.inband_go_live(require_inband_signal)
```

This will enable frame-accurate go-live on the LiveVideo object and the API will respond with a new secure stream URL which you can then stream to. You can disregard the initial secure stream url that was sent to you when you first created the LiveVideo object.

The broadcast will go live and be visible to the audience after (1) the broadcast status is set to LIVE (through a Graph API call or a user publishing from Live Producer) _and_ (2) the encoder sends the go-live RTMP message.

### Go-Live RTMP Message Structure

An AMF0 packet (type 0x12) containing:

- the string `onGoLive`
- an ECMA array (type 0x08) containing a single key-value pair:

  - Key: string (type 0x02) `timestamp`
  - Value: number (type 0x00): the timestamp of the first video frame that will be publicly visible

For more information, see the [RTMP](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.adobe.com%2Fdevnet%2Frtmp.html&h=AUC-fKFIiGk6-oQ7gtIAUdMSA6UBBsXMO7SO6ym-HAx8ho2rtt1_PaaqDwK_Nbm_XsZunq1N6oftwvz8xzrN-S3MB3lPSDfAjUxtPRPGUzD4tO10ro7EOogwOSQvXXBzXibu-83NwukUSg) and [AMF0](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.adobe.com%2Fcontent%2Fdam%2Facom%2Fen%2Fdevnet%2Fpdf%2Famf0-file-format-specification.pdf&h=AUA_J-8I3eqTYh8iQqljohogBpUS59tz9JEJ-HF3AhQO1BDOb6Ao71ofWCkjuaroMHv9ggNYc9JD20nVr1PYQH7lTDn0uH3aTRKpj6vKvQfbbYAReTck_iy5XXAeNEpIeycrlLltzqlIiA) specifications.

### Sample Request

Sample request to enable frame-accurate go-live on a LiveVideo.

```curl
curl -i -X GET \
   "https://graph.facebook.com/v25.0/LIVE_VIDEO_ID?fields=secure_stream_url.inband_go_live(require_inband_signal)&access_token=12345..."
```

### Sample Response

Secure stream URL for a LiveVideo object with frame-accurate go-live enabled.

```json
{
  "secure_stream_url": "rtmps://rtmp-pc.facebook.com:443/rtmp/LIVE_VIDEO_ID?s_bl=1&s_gl=1&...",
  "id": "LIVE_VIDEO_ID"
}
```

## Get Error Code Data

To get error code data associated with a broadcast, send a request to:

`GET /<LIVE_VIDEO_ID>?fields=errors`

The API will respond with the `error code`, `type`, `message`, and a `timestamp`.

#### Sample Response

```code
curl -i -X GET \
 "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?fields=errors"
```

#### Sample Response

```json
{
  "errors": {
    "data": [\
      {\
        "error_code": 1969004,\
        "error_type": "stream",\
        "error_message": "Video signal lost",\
        "creation_time": "2018-12-05T23:58:52+0000"\
      },\
      {\
        "error_code": 1969004,\
        "error_type": "stream",\
        "error_message": "Video signal lost",\
        "creation_time": "2018-12-05T23:58:52+0000"\
      },\
      {\
        "error_code": 0,\
        "error_type": "info",\
        "error_message": "Live Service received the video signal",\
        "creation_time": "2018-12-05T23:58:02+0000"\
      },\
      {\
        "error_code": 0,\
        "error_type": "info",\
        "error_message": "Live Service received the video signal",\
        "creation_time": "2018-12-05T23:58:02+0000"\
      }\
    ]
  },
  "id": "{your-live-video-id}"
}
```

### Common Live Video API error codes

| error\_subcode | Error Summary | Description |
| --- | --- | --- |
| `COPYRIGHT__LIVE_COPYRIGHT_VIOLATION` | Live Copyright Violation | Your live video has been stopped because it may contain audio or visual content that belongs to a different Page. |
| `VIDEO__CREATE_FAILED` | Upload Problem | There was a problem and your video was not uploaded. Please try again. |
| `LIVE_VIDEO__DELETE_FAILED` | Live Video Not Deleted | There was a problem and we were not able to delete your live video. Please try again. |
| `LIVE_VIDEO__EDIT_API_NOT_ALLOWED` | Editing Via Video API Is Not Allowed While Live | Editing a live video using the Video Edit API is not allowed. Use the live video ID. |
| `LIVE_VIDEO__LIVE_STREAM_ERROR` | Generic Stream | There was an error during the stream |
| `LIVE_VIDEO__NOT_EXIST` | Live Video Does Not Exist | The live video you are trying to access does not exist in the system any more. |
| `LIVE_VIDEO__PRIVACY_REQUIRED` | Privacy Setting Required | You need to set a privacy before going live. |

### Permission error codes

| Code | Subcode | Message | Type | Mitigation messaging |
| --- | --- | --- | --- | --- |
| 200 | 1363120 | Permissions error | OAuthException | You’re not eligible to go live <br>Your profile needs to be at least 60 days old before you can go live on Facebook. Learn more at https://www.facebook.com/business/help/167417030499767?id=1123223941353904 |
| 200 | 1363144 | Permissions error | OAuthException | You’re not eligible to go live <br>You need at least 100 followers before you can go live from your profile. Learn more at https://www.facebook.com/business/help/167417030499767?id=1123223941353904 |

## See Also

- [Access Tokens \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

- [`LiveVideo` Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/live-video)

- [`Page` Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/page)

- [`PageLiveVideos` Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/page/live_videos)

- [Permission Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/permissions)

- [`User` Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/user)

- [`UserLiveVideos` Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFNFLkF&_nc_oc=AdrgnvVb8Ve_RW1zHJYJJ4dvbo_BDXd9pdiqayR1eyltYsDplGEvzTzkx-6Y-TkgSUQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7Y1Aux5ZQxS34_YoFqJKDQ&_nc_ss=7b289&oh=00_Af6g2LvvMl8c6E3LuDk74b7rYgeJaePjFg4TqjrsbCrwBA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/reference/user/live_videos)


On This Page

[Broadcasting](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcasting)

[Broadcast on a User](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcast-on-a-user)

[Broadcast on a Page](https://developers.facebook.com/docs/live-video-api/guides/streaming#broadcast-on-a-page)

[Get Broadcast Stream Data](https://developers.facebook.com/docs/live-video-api/guides/streaming#get-broadcast-stream-data)

[End a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/streaming#end-a-broadcast)

[Delete a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/streaming#delete-a-broadcast)

[Frame-Accurate Go-Live](https://developers.facebook.com/docs/live-video-api/guides/streaming#frame-accurate-go-live)

[Go-Live RTMP Message Structure](https://developers.facebook.com/docs/live-video-api/guides/streaming#go-live-rtmp-message-structure)

[Sample Request](https://developers.facebook.com/docs/live-video-api/guides/streaming#sample-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/guides/streaming#sample-response)

[Get Error Code Data](https://developers.facebook.com/docs/live-video-api/guides/streaming#get-error-code-data)

[Common Live Video API error codes](https://developers.facebook.com/docs/live-video-api/guides/streaming#common-live-video-api-error-codes)

[Permission error codes](https://developers.facebook.com/docs/live-video-api/guides/streaming#permission-error-codes)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/streaming#see-also)