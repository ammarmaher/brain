---
url: https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api
title: Automatic Encoder Configuration API - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fguides%2Fautomatic-encoder-configuration-api%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#automatic-encoder-configuration-api)

[Configure an Encoder](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#configure-an-encoder)

[Reference](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#reference)

[Input Fields](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#input-fields)

[Response Fields](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#response-fields)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#see-also)

# Automatic Encoder Configuration API

The Automatic Encoder Configuration API allows you to automatically configure encoding settings before going Live on Facebook. The API is designed to be stateless and lightweight so user authentication or tokens are not required.

## Configure an Encoder

To automatically configure encoder settings, send a `GET` request to the `video_encoder_settings` endpoint.

```code
curl -i -X GET \
    "https://graph.facebook.com/{graph-api-version}/video_encoder_settings
        ?video_type=live
        &input_video_width=1920
        &input_video_height=1080
        &input_video_framerate=30
        &input_video_bitrate=6000
        &input_audio_channels=2
        &input_audio_samplerate=48000
        &cap_streaming_protocols=rtmps
        &cap_video_codecs=h264
        &cap_audio_codecs=aac"
```

On success, your app will receive the following response:

```json
{
   "streaming_protocol":"rtmps",
   "rtmps_settings": {
       "video_codec":"h264",
       "video_codec_settings": {
           "video_bitrate":6000,
           "video_width":1920,
           "video_height":1080,
           "video_framerate":30,
           "video_h264_profile":"high",
           "video_h264_level":"4.1",
           "video_gop_size":60,
           "video_gop_type": "fixed",
           "video_gop_closed": true,
           "video_gop_num_b_frames":3,
           "video_gop_num_ref_frames":3,
           "video_scan_mode": "progressive",
           "rate_control_mode": "cbr",
           "buffer_size": 12000
       },
       "audio_codec":"aac",
       "audio_codec_settings": {
           "audio_bitrate":256,
           "audio_channels":2,
           "audio_samplerate":48000
       }
   }
}
```

## Reference

### Input Fields

The following fields are required for all `GET video_endcoder_settings` endpoint requests.

| video\_encoder\_settings Fields | Description |
| --- | --- |
| `cap_audio_codecs`<br> _array<enum{aac}>_ | A comma separated list of [audio codecs](https://developers.facebook.com/docs/live-video-api/reference#audio-settings) you are capable of sending to Facebook. |
| `cap_streaming_protocols`<br> _array<enum{rtmps, https\_dash, webrtc}>_ | A comma separated list of [streaming protocols](https://developers.facebook.com/docs/live-video-api#rtmps), in order of preference. |
| `cap_video_codecs`<br> _array<enum{h264}>_ | A comma separated list of [video codecs](https://developers.facebook.com/docs/live-video-api/reference#video-settings) you are capable of sending to Facebook. |
| `input_audio_channels`<br> _integer_ | The number of audio channels in the audio input, for example, `2`. |
| `input_audio_samplerate`<br> _integer_ | The [audio sample rate](https://developers.facebook.com/docs/live-video-api/reference#audio-settings), for example, `48000`. |
| `input_video_bitrate`<br> _integer_ | The [video bitrate](https://developers.facebook.com/docs/live-video-api/reference#video-settings), in kbps, for example, `6000`. |
| `input_video_framerate`<br> _float_ | The [video frame rate](https://developers.facebook.com/docs/live-video-api/reference#video-settings) for example, `30`, `29.97`, `59.97`. |
| `input_video_height`<br> _integer_ | The height of the video, for example, `1080`. |
| `input_video_width`<br> _integer_ | The width of your video, for example, `1920`. |
| `video_type`<br> _enum{live,vod}_ | The type of video, `live` or [`vod`](https://developers.facebook.com/docs/live-video-api/guides/streaming#end-a-broadcast). |

### Response Fields

The response returned contains recommendations for your encoder such as the streaming protocol, and audio and video codecs and settings for each.

| Response Fields | Description |
| --- | --- |
| `streaming_protocol`<br> _enum{rtmps, https\_dash, webrtc}_ | The recommended streaming protocol. |
| `{streaming-protocol}_settings` | - `audio_codec` — The recommended audio codec.<br>- [`audio_codec_settings`](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#audio-codec-recommendations) — The recommended audio codec settings.<br>- `video_codec` — The recommended video codec.<br>- [`video_codec_settings`](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#video-codec-recommendations)— The recommended video codec settings. |

#### Recommendations for Common Audio Codec Settings

A `audio_codec_settings` object contains the audio encoding settings for the recommended audio codec. Different codecs will have different values, but they share some common settings.

| Common Audio Codec Settings | Recommendation |
| --- | --- |
| `audio_bitrate`<br> _integer_ | Audio bitrate in kbps. |
| `audio_channels`<br> _integer_ | Number of audio channels. |
| `audio_samplerate`<br> _integer_ | Recommended audio sample rate, for example, `48000`. |

#### Recommendations for Common Video Codec Settings

A `video_codec_settings` object contains the video encoding settings for the recommended video codec. Different codecs will have different values, but they all share some common settings.

| Common Video Codec Setting | Description |
| --- | --- |
| `buffer_size`<br> _integer_ | The recommended size of buffer in kb, for example, `5000`. |
| `pixel_aspect_ratio`<br> _float_ | The recommended pixel aspect ratio as a decimal value, for example, `1.0` would be used for 1:1/square. |
| `rate_control_mode`<br> _enum{cbr}_ | The recommended rate control mode. |
| `video_bitrate`<br> _integer_ | The recommended video max bit rate, in kbps. |
| `video_framerate`<br> _float_ | The recommended video frame rate, in frames per second. |
| `video_gop_closed`<br> _boolean_ | The recommendation for a closed GOPs, `true`, or not, `false`. |
| `video_gop_num_b_frames`<br> _integer_ | The recommended number of B frames in a GOP, for example, `3`. |
| `video_gop_num_ref_frames`<br> _integer_ | The recommended number of reference frames in a GOP, for example, `3`. |
| `video_gop_size`<br> _integer_ | Recommended GOP size, in frames. |
| `video_gop_type`<br> _enum{fixed}_ | The recommended GOP type. |
| `video_h264_level`<br> _enum{4.1}_ | The recommended `h264` level. |
| `video_h264_profile`<br> _enum{high}_ | The recommended h264 profile. |
| `video_height`<br> _integer_ | The recommended video height, in pixels. |
| `video_scan_mode`<br> _enum{progressive}_ | The recommended scan mode. |
| `video_width`<br> _integer_ | The recommended video width, in pixels. |

## See Also

- [Live Video API Audio and Video Specifications](https://developers.facebook.com/docs/live-video-api/reference#specifications)
- [Live Video API Error Codes](https://developers.facebook.com/docs/live-video-api/reference#error-codes)

On This Page

[Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#automatic-encoder-configuration-api)

[Configure an Encoder](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#configure-an-encoder)

[Reference](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#reference)

[Input Fields](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#input-fields)

[Response Fields](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#response-fields)

[See Also](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api#see-also)