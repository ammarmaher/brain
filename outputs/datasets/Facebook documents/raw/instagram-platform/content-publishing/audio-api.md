---
url: https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api
title: Audio API - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fcontent-publishing%2Faudio-api%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)


  - [Audio API](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api)
  - [Resumable Uploads](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads)

- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Instagram Audio API](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#instagram-audio-api)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#before-you-start)

[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#limitations)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#endpoints)

[Search audio assets](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#search-audio-assets)

[Get audio metadata](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#get-audio-metadata)

[Sample response](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#sample-response)

[Response fields](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#response-fields)

[Publish a Reel with audio](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#publish-a-reel-with-audio)

# Instagram Audio API

The Instagram Audio API allows you to retrieve and search for audio — both original sounds from Instagram Reels and music — and attach them to Reels at creation time. This API is available on the Instagram Platform with Facebook Login.

## Before You Start

You need the following:

- An Instagram Business or Instagram Creator account
- A Facebook Page connected to that account
- A registered Facebook App with the following permissions granted via Facebook Login:

  - `instagram_basic`
  - `instagram_content_publish`
- A valid User access token

### Limitations

- Music availability: This API returns audio that has been authorized for third party use. Note that the available selection may vary from what appears in the native app.
- Platform support: This API is only available on the Instagram API with Facebook Login. It is not supported on the Instagram API with Instagram Login.
- Reel previews: Previewing a Reel with attached audio is not supported. The Reel will be published as configured.
- Filter constraints: When retrieving audio, if no search query is provided, trending audio is returned.

## Endpoints

### Search audio assets

Search for audio assets to use in Reels. You can search for original sounds from existing Reels or music. If a search query is omitted, trending original sounds or music are returned by default.

#### Request syntax

```curl
GET /ig_audio?audio_type={audio-type}&user_id={user-id}&access_token={access-token}
```

#### Query string parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `audio_type` | Enum | Required. The type of audio to search for. Values: `original_sound` (user-generated sound from existing Reels), `music` (royalty-free music from Meta's Sound Collection). |
| `user_id` | String | Required. The ID of the Instagram User performing the query. |
| `search_query` | String | Optional. A search string to filter results by keyword. |
| `access_token` | String | Required. A valid User access token. |

#### Sample request

```curl
curl -X GET "https://graph.facebook.com/v22.0/ig_audio?audio_type=music&user_id={user-id}&access_token={access-token}"
```

#### Sample response

```json
{
  "audio": [\
    {\
      "audio_id": "587784541076604",\
      "cover_artwork_thumbnail_uri": "https://scontent-...",\
      "display_artist": "Shuba",\
      "duration_in_ms": 153760,\
      "audio_type": "music",\
      "title": "Birthday Wish",\
      "download_url": "https://scontent-lga3..."\
    }\
  ]
}
```

#### Response fields

| Field | Type | Description |
| --- | --- | --- |
| `audio_id` | String | The unique identifier for the audio asset. |
| `cover_artwork_thumbnail_uri` | String | URL of the cover artwork thumbnail. Returned for music type only. May be null when no URL is available. |
| `display_artist` | String | The display name of the artist. Returned for music type only. |
| `duration_in_ms` | Integer | Duration of the audio asset in milliseconds. |
| `audio_type` | Integer | Type of the audio asset. |
| `title` | String | Title of the audio asset. |
| `download_url` | String | A temporary URL to preview the audio file. This URL expires after approximately 1.5 days. May be null when no preview URL is available. |
| `ig_username` | String | The Instagram username of the creator. Returned for `original_sound` type only. |
| `profile_picture_url` | String | URL of the creator's profile picture. Returned for `original_sound` type only. |

### Get audio metadata

Retrieve metadata for a specific audio asset by its ID.

#### Request syntax

```curl
GET /{ig-audio-id}?user_id={user-id}&access_token={access-token}
```

#### Path parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `{ig-audio-id}` | String | Required. The unique identifier (FBID) of the audio asset. |

#### Response fields

| Field | Type | Description |
| --- | --- | --- |
| `audio_id` | String | The unique identifier for the audio asset. |
| `cover_artwork_thumbnail_url` | String | URL of the cover artwork thumbnail. Returned for music type only. May be null when no URL is available. |
| `display_artist` | String | The display name of the artist. Returned for music type only. |
| `duration_in_ms` | Integer | Duration of the audio track in milliseconds. |
| `audio_type` | String | The type of audio: music or original\_sound. |
| `title` | String | The title of the audio track. |
| `download_url` | String | A temporary URL to preview the audio file. This URL expires after approximately 1.5 days. May be null when no preview URL is available. |
| `ig_username` | String | The Instagram username of the original audio creator. Returned for original\_sound type only. |
| `profile_picture_url` | String | URL of the creator's profile picture. Returned for original\_sound type only. |

#### Query string parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `user_id` | String | Required. The ID of the Instagram User performing the query. |
| `access_token` | String | Required. A valid User access token. |

#### Sample request

```curl
curl -X GET "https://graph.facebook.com/v22.0/587784541076604?user_id={user-id}&access_token={access-token}"
```

### Sample response

```json
{
  "audio_id": "587784541076604",
  "cover_artwork_thumbnail_url": "https://scontent-lga3-...",
  "display_artist": "Shuba",
  "duration_in_ms": 153760,
  "audio_type": "music",
  "title": "Birthday Wish",
  "download_url": "https://scontent-lga3..."
}
```

### Response fields

| Field | Type | Description |
| --- | --- | --- |
| `audio_id` | String | The unique identifier for the audio asset. |
| `cover_artwork_thumbnail_url` | String | URL of the cover artwork thumbnail. Returned for music type only. May be null when no URL is available. |
| `display_artist` | String | The display name of the artist. Returned for music type only. |
| `duration_in_ms` | Integer | Duration of the audio track in milliseconds. |
| `audio_type` | String | The type of audio: music or original\_sound. |
| `title` | String | The title of the audio track. |
| `download_url` | String | A temporary URL to preview the audio file. This URL expires after approximately 1.5 days. May be null when no preview URL is available. |
| `ig_username` | String | The Instagram username of the original audio creator. Returned for `original_sound` type only. |
| `profile_picture_url` | String | URL of the creator's profile picture. Returned for `original_sound` type only. |

### Publish a Reel with audio

Attach an audio asset to a Reel during content creation. This uses the existing Content Publishing flow with an additional `audio_configuration` parameter.

#### Step 1: Create a media container

#### Request syntax

```curl
POST /{ig-user-id}/media
```

Include the new `audio_configuration` object alongside your existing Reel parameters (`video_url`, `media_type=REELS`, etc.).

**Note:** New parameter: `audio_configuration`

| Field | Type | Description |
| --- | --- | --- |
| `audio_id` | String | Required. The unique identifier of the audio asset to attach, obtained from the Search Audio or Get Audio Metadata endpoints. |
| `audio_volume` | Integer | Optional. Volume level for the audio asset, from 0 (muted) to 100 (full volume). Defaults to 100. |
| `video_volume` | Integer | Optional. Volume level for the video's original audio, from 0 (muted) to 100 (full volume). Defaults to 100. |

#### Sample request

```curl
curl -X POST "https://graph.facebook.com/v22.0/{ig-user-id}/media" \
  -d "media_type=REELS" \
  -d "video_url={video-url}" \
  -d 'audio_configuration={"audio_id":"587784541076604","audio_volume":80,"video_volume":50}' \
  -d "access_token={access-token}"
```

#### Step 2: Publish the media container

Once the container is created, publish it using the standard publishing endpoint:

```curl
POST /{ig-user-id}/media_publish?creation_id={creation-id}access_token={access-token}
```

Refer to the Content Publishing documentation for full details on the two-step publishing flow.

Example workflow

Here is a complete example showing how to search for trending music and attach it to a Reel:

1. Search for trending music:

```curl
curl -X GET "https://graph.facebook.com/v22.0/ig_audio?audio_type=musicuser_id={user-id}access_token={access-token}"
```

1. (Optional) Get metadata for a specific audio asset:

```curl
curl -X GET "https://graph.facebook.com/v22.0/{audio-id}?user_id={user-id}access_token={access-token}"
```

1. Create a Reel container with the audio attached:

```curl
curl -X POST "https://graph.facebook.com/v22.0/{ig-user-id}/media" \
  -d "media_type=REELS" \
  -d "video_url={video-url}" \
  -d 'audio_configuration={"audio_id":"{audio-id}","audio_volume":100,"video_volume":60,"should_loop_audio":false}' \
  -d "access_token={access-token}"
```

1. Publish the Reel:

```curl
curl -X POST "https://graph.facebook.com/v22.0/{ig-user-id}/media_publish?creation_id={creation-id}access_token={access-token}"
```

On This Page

[Instagram Audio API](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#instagram-audio-api)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#before-you-start)

[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#limitations)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#endpoints)

[Search audio assets](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#search-audio-assets)

[Get audio metadata](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#get-audio-metadata)

[Sample response](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#sample-response)

[Response fields](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#response-fields)

[Publish a Reel with audio](https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api#publish-a-reel-with-audio)