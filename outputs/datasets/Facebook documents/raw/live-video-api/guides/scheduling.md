---
url: https://developers.facebook.com/docs/live-video-api/guides/scheduling
title: Schedule a video - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fguides%2Fscheduling%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Schedule a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#schedule-a-broadcast)

[Previewing a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#previewing-a-broadcast)

[Get Scheduled Broadcasts](https://developers.facebook.com/docs/live-video-api/guides/scheduling#get-scheduled-broadcasts)

[Reschedule a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#reschedule-a-broadcast)

[Starta Broadcast Immediately](https://developers.facebook.com/docs/live-video-api/guides/scheduling#starta-broadcast-immediately)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/scheduling#see-also)

# Schedule a Broadcast

You can use the Live Video API to create live video broadcasts that will go live at a predetermined time, up to seven days from their creation date.

On June 10th, 2024, Meta is launching new requirements that must meet before an account can go live on Facebook. The new requirements are as follows:

- The Facebook account must be at least 60 days old

- The Facebook Page or [professional mode profile](https://www.facebook.com/business/help/2680340558863560) must have at least 100 followers


Visit our
[Help Center \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEUli5f&_nc_oc=AdqYKLvYRChnnhg_l_Gs1lJSWMzd4wNKVkxAbxt_ZKWcCeVRhJ23ZCMDEKJgmzQsYDI&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=g_UHkL6DFY_6WM975N_h9w&_nc_ss=7b289&oh=00_Af6gre3GwKZvkyLhr14UdznfZTMsXEc29QaGSDP5DdCyAA&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/guides/scheduling#) to learn more about this change.



To create a live video broadcast with a future start date on a User, Page, Group, or Event, send a request to:

`POST /<ID>/live_videos?status=SCHEDULED_UNPUBLISHED&event_params=<UNIX_TIMESTAMP_FOR_START_TIME>`

Use the `event_params` parameter and a UNIX timestamp to indicate the desired start time.

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

This will create a `LiveVideo` object on the targeted node and return the live video's `secure_stream_url` and `id`. Use the secure stream URL with your encoder to stream live video data to the `LiveVideo` object at, or before, it's scheduled start time. The broadcast will appear on the node's timeline/feed at the planned start time as long as it is receiving stream data.

Scheduled broadcasts can receive streaming data at any point before their start date, for preview purposes.

### Sample Request

```code
curl -i -X POST \
      "https://graph.facebook.com/v25.0/<ID>/live_videos?status=SCHEDULED_UNPUBLISHED&event_params=1541539800"
```

#### Sample Response

```js
{
  "id": "10214937378883406",  //LiveVideo object ID
  "stream_url": "rtmp://rtmp-api.facebook...",
  "secure_stream_url": "rtmps://rtmp-api.facebook..."  //Stream URL
}

```

To get a list of scheduled broadcasts, see [Getting Scheduled Broadcasts](https://developers.facebook.com/docs/live-video-api/guides/scheduling#get-scheduled-broadcasts).

## Previewing a Broadcast

You can use the Live Video API to preview an unpublished live video broadcast; a LiveVideo object created with `status` set to `SCHEDULED_UNPUBLISHED` or `UNPUBLISHED`.

To preview an unpublished live video broadcast, send a request to:

`GET /<LIVE_VIDEO_ID?fields={fields}`

Use the `fields` parameter to get the `dash_preview_url` for the `LiveVideo` object.

#### Sample Request

```code
curl -i -X GET \
 "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?fields=dash_preview_url"
```

#### Sample Response

```json
{
  'dash_preview_url': 'https://video.xx.fbcdn.net/...',
  'id': '<LIVE_VIDEO_ID>'
}
```

This returns the live video's `dash_preview_url` and `id`. Copy and paste the URL into a [Dash Player](https://l.facebook.com/l.php?u=https%3A%2F%2Freference.dashif.org%2Fdash.js%2Fv2.6.3%2Fsamples%2Fdash-if-reference-player%2Findex.html&h=AUAKHJ6JRUI7FdnMApm4YhHBj1SvlreZNuxwYuNq9-GdMs3_IK-9gMiywubKmtB1NnBuXSGnnQBNTA4y0zQwQp00uqYO3fqL3LerX3r6g6xSqC7GB3tbVkoyvetmchr8yIZPnJfaOjmP9A) to preview the broadcast.

Although previewing your broadcast with a third-party test player is a good way to verify the content of your broadcast, we recommend that you broadcast on a test page. You must be a page admin or editor in order to broadcast the page. Additionally you can set the [privacy parameter](https://developers.facebook.com/docs/graph-api/common-scenarios#privacy-param) to create streams visible to only you.

## Get Scheduled Broadcasts

To get a list of scheduled broadcasts for a User, Page, or Event, get an appropriate access token with the `publish_video` permission and send a request to:

`GET /<ID>/live_videos?broadcast_status=["SCHEDULED_UNPUBLISHED"]`

Note that the `broadcast_status` value must be an array. Refer to the `LiveVideo` reference for a complete list of additional values.

#### Sample Broadcast List for a Page

```code
curl -i -X GET \
  "https://graph.facebook.com/v25.0/<ID>/live_videos?broadcast_status=["SCHEDULED_UNPUBLISHED"]"
```

#### Sample Response

```js
{
  "data": [\
    {\
      "status": "SCHEDULED_UNPUBLISHED",\
      "stream_url": "rtmp://rtmp-api-dev.facebook.com:80/rtmp/...",\
      "secure_stream_url": "rtmps://rtmp-api-dev.facebook.com:443/rtmp/...",\
      "embed_html": "<iframe src=\"https://www.facebook.com/plugins/video.php?...",\
      "id": "10214937378883406 "  //LiveVideo object ID\
    }\
  ]
}
```

## Reschedule a Broadcast

You can change a scheduled broadcast's start time by sending a request to:

`POST /<LIVE_VIDEO_ID>?event_params=<UNIX_TIMESTAMP_FOR_NEW_START_TIME>`

The `<UNIX_TIMESTAMP_FOR_NEW_START_TIME>` value must be a UNIX time stamp indicating the new start time. Upon success, the API will respond with the `LiveVideo` object's ID.

#### Sample Live Video for a Page

```code
curl -i -X POST \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?event_params=1541540800"
```

#### Example Response

```js
{
  "id": "10214937378883406"
}
```

## Starta Broadcast Immediately

You can start a broadcast immediately by sending a request to:

`POST /<LIVE_VIDEO_ID>?status=LIVE_NOW`

The broadcast will go live if the stream URL associated with the `LiveVideo` object, which represents the broadcast, is receiving stream data. Upon success, the API will respond with the `LiveVideo` object's ID.

#### Sample Request

```code
curl -i -X POST \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?status=LIVE_NOW"
```

#### Example JSON Response

```json
{
  "id": "10214937378883406" // <LIVE_VIDEO_ID>
}
```

## See Also

- [`LiveVideo` Reference](https://developers.facebook.com/docs/graph-api/reference/live-video)

On This Page

[Schedule a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#schedule-a-broadcast)

[Previewing a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#previewing-a-broadcast)

[Get Scheduled Broadcasts](https://developers.facebook.com/docs/live-video-api/guides/scheduling#get-scheduled-broadcasts)

[Reschedule a Broadcast](https://developers.facebook.com/docs/live-video-api/guides/scheduling#reschedule-a-broadcast)

[Starta Broadcast Immediately](https://developers.facebook.com/docs/live-video-api/guides/scheduling#starta-broadcast-immediately)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/scheduling#see-also)