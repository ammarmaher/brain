---
url: https://developers.facebook.com/docs/live-video-api/backup_stream
title: Create a Backup Stream - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fbackup_stream%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Backup Streams](https://developers.facebook.com/docs/live-video-api/backup_stream#backup-streams)

[Enable Backup Streaming Upon LiveVideo Creation](https://developers.facebook.com/docs/live-video-api/backup_stream#enable-backup-streaming-upon-livevideo-creation)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response)

[Enable Backup Streaming On Existing LiveVideo](https://developers.facebook.com/docs/live-video-api/backup_stream#enable-backup-streaming-on-existing-livevideo)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-2)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response-2)

[Manually Switch Streams](https://developers.facebook.com/docs/live-video-api/backup_stream#manually-switch-streams)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-3)

[Get Primary and Backup Stream URLs](https://developers.facebook.com/docs/live-video-api/backup_stream#get-primary-and-backup-stream-urls)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-4)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response-3)

# Backup Streams

You can simultaneously stream backup live video data to a live video broadcast. If your primary stream fails, we will automatically switch to your backup stream so your live video broadcast can continue uninterrupted. Your broadcast will continue using the backup stream unless you [manually switch back to the primary stream](https://developers.facebook.com/docs/live-video-api/guides/backup_stream#manually-switch-streams), or your primary stream has resumed and your backup stream fails.

In order to use a backup stream with a live video broadcast, you must enable backup streaming when you [create the broadcast's LiveVideo object](https://developers.facebook.com/docs/live-video-api/guides/streaming), or [enable it on the LiveVideo object](https://developers.facebook.com/docs/live-video-api/guides/backup_stream#enable-backup-streaming-on-existing-livevideo) before it receives streaming data.

## Enable Backup Streaming Upon LiveVideo Creation

To enable backup streaming when you [create your broadcast's LiveVideo object](https://developers.facebook.com/docs/live-video-api/guides/streaming), include the `enable_backup_ingest=true` query string parameter in your query.

For example, to create a [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) with backup streaming enabled on a [User](https://developers.facebook.com/docs/graph-api/reference/user):

```http
POST /{user-id}/live_videos
  ?status=LIVE_NOW
  &enable_backup_ingest=true
  &access_token={access-token}
```

This will return two URLs, one for your primary stream, and one for you backup (secondary):

```json
{
  "id": "{live-video-id}",
  "stream_url": "{stream-url}",
  "secure_stream_url": "{secure-stream-url}",
  "stream_secondary_urls": [\
    "{stream-secondary-urls}"\
  ],
  "secure_stream_secondary_urls": [\
    "{secure-stream-secondary-urls}"\
  ]
}
```

Use `secure_stream_url` for your primary ingest stream and `secure_stream_secondary_urls` for your backup ingest stream. You can stream backup data to your LiveVideo object at any time during the broadcast.

### Sample cURL Request

```curl
curl -i -X POST \
  "https://graph.facebook.com/362629830945302/live_videos
    ?enable_backup_ingest=true
    &access_token=EAAI4b..."
```

### Sample Response

```json
{
  "id": "10215840463339953",
  "stream_url": "rtmps://rtmp.facebook.com/rtmp/10215840463339953?s_bl=1&s_l=1&s_sml=3&s_sw=0&s_vt=api&a=AbxMhT-cq73GTdpuPLo",
  "secure_stream_url": "rtmps://rtmp.facebook.com/rtmp/10215840463339953?s_bl=1&s_l=1&s_sml=3&s_sw=0&s_vt=api&a=AbxMhT-cq73GTdpuPLo",
  "stream_secondary_urls": [\
    "rtmp://rtmps.facebook.com/rtmp/10215840463339953?s_bl=1&s_l=1&s_sml=3&s_sw=1&s_vt=api&a=AbzhD2fKJw1Uw7JQjFc"\
  ],
  "secure_stream_secondary_urls": [\
    "rtmps://rtmps.facebook.com/rtmp/10215840463339953?s_bl=1&s_l=1&s_sml=3&s_sw=1&s_vt=api&a=AbzhD2fKJw1Uw7JQF80"\
  ]
}
```

## Enable Backup Streaming On Existing LiveVideo

You can enable backup streaming on an existing [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) object as long as it has not received any live video streaming data by sending a `POST` request to the LiveVideo’s `/input_streams` edge. For example:

```http
POST /{live-video-id}/input_streams
  &access_token={access-token}
```

This will return the LiveVideo’s ID:

```json
{
  "id": "{live-video-id}"
}
```

Once enabled, you can \[get the primary and backup stream URLs\] from the LiveVideo object.

### Sample cURL Request

```curl
curl -i -X POST \
  "https://graph.facebook.com/10215840463339953/input_streams
    &access_token=EAAI4b..."
```

### Sample Response

```json
{
  "id": "10215840463339953"
}
```

## Manually Switch Streams

You can manually switch between a [LiveVideo’s](https://developers.facebook.com/docs/graph-api/reference/live-video) primary and backup stream by sending a request to:

```http
POST /{live-video-id}
  ?master_ingest_stream_id={master-ingest-stream-id}
  &access_token={access-token}
```

The `{master-ingest-stream-id}` value is a boolean; `0` represents the primary ingest stream, and `1` represents the backup ingest stream.

### Sample cURL Request

```curl
curl -i -X POST \
  "https://graph.facebook.com/10215840463339953
    ?master_ingest_stream_id=1
    &access_token=EAAI4b..."
```

## Get Primary and Backup Stream URLs

You can read a [LiveVideo’s](https://developers.facebook.com/docs/graph-api/reference/live-video)`ingest_streams` field to get its primary and backup stream URLs:

```http
GET /{live-video-id}
  ?fields=ingest_streams
  &acess_token={access-token}
```

This will return the ingest stream health and stream URLs for the primary and backup streams (if any) on the LiveVideo:

```json
{
  "ingest_streams": [\
    {\
      "stream_id": "{stream-id}",\
      "stream_url": "{stream-url}",\
      "secure_stream_url": "{secure-stream-url}",\
      "is_master": {is-master},\
      "stream_health": {stream-health},\
      "id": "{id}"\
    },\
    {\
      "stream_id": "{stream-id}",\
      "stream_url": "{stream-url}",\
      "secure_stream_url": "{secure-stream-url}",\
      "is_master": {is-master},\
      "stream_health": {stream-health},\
      "id": "{id}"\
    }\
  ],
  "id": "10215840874550233"
}
```

### Sample cURL Request

```curl
curl -i -X GET \
 "https://graph.facebook.com/10215840463339953
   ?fields=ingest_streams
   &access_token=EAAI4b..."
```

### Sample Response

```json
{
  "ingest_streams": [\
    {\
      "stream_id": "0",\
      "stream_url": "rtmps://live-api.facebook.com/rtmp/10215840874550233?s_bl=1&s_l=1&s_sml=3&s_sw=0&s_vt=api&a=AbyvsHKGRrur_sZOeuo",\
      "secure_stream_url": "rtmps://live-api.facebook.com/rtmp/10215840874550233?s_bl=1&s_l=1&s_sml=3&s_sw=0&s_vt=api&a=AbyvsHKGRrur_sZOF08",\
      "is_master": true,\
      "stream_health": {\
        "video_bitrate": 2304481.75,\
        "video_framerate": 27.586206436157,\
        "video_gop_size": 2000,\
        "video_height": 700,\
        "video_width": 1120,\
        "audio_bitrate": 118149.8828125\
      },\
      "id": "10215840874630235"\
    },\
    {\
      "stream_id": "1",\
      "stream_url": "rtmps://live-api.facebook.com/rtmp/10215840874550233?s_bl=1&s_l=1&s_sml=3&s_sw=1&s_vt=api_dev&a=AbySai39Wr08FKpUYw0",\
      "secure_stream_url": "rtmps://live-api.facebook.com/rtmp/10215840874550233?s_bl=1&s_l=1&s_sml=3&s_sw=1&s_vt=api_dev&a=AbySai39Wr08FKpUv3M",\
      "is_master": false,\
      "stream_health": {\
        "video_bitrate": 1866942.625,\
        "video_framerate": 22.338048934937,\
        "video_gop_size": 2000,\
        "video_height": 700,\
        "video_width": 1120,\
        "audio_bitrate": 95675.3515625\
      },\
      "id": "10215840874670236"\
    }\
  ],
  "id": "10215840874550233"
}
```

On This Page

[Backup Streams](https://developers.facebook.com/docs/live-video-api/backup_stream#backup-streams)

[Enable Backup Streaming Upon LiveVideo Creation](https://developers.facebook.com/docs/live-video-api/backup_stream#enable-backup-streaming-upon-livevideo-creation)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response)

[Enable Backup Streaming On Existing LiveVideo](https://developers.facebook.com/docs/live-video-api/backup_stream#enable-backup-streaming-on-existing-livevideo)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-2)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response-2)

[Manually Switch Streams](https://developers.facebook.com/docs/live-video-api/backup_stream#manually-switch-streams)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-3)

[Get Primary and Backup Stream URLs](https://developers.facebook.com/docs/live-video-api/backup_stream#get-primary-and-backup-stream-urls)

[Sample cURL Request](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-curl-request-4)

[Sample Response](https://developers.facebook.com/docs/live-video-api/backup_stream#sample-response-3)