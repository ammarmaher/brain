---
url: https://developers.facebook.com/docs/video-api/guides/reels-publishing/
title: Publish a Reel - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fguides%2Freels-publishing%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#reels-publishing-api)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#before-you-start)

[Video Specifications](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#requirements)

[Step 1: Initialize an Upload Session](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#step-1--initialize-an-upload-session)

[Step 2: Upload the Video](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload)

[Upload a Local File](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload-a-local-file)

[Upload a Hosted File](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload-a-hosted-file)

[Example Upload Response](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#example-upload-response)

[Get the Upload Status](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-the-upload-status)

[Resume an Interrupted Upload](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#resume-an-interrupted-upload)

[Step 3: Publish the Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#step-3--publish-the-reel)

[Get a List of Reels](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-a-list-of-reels)

[Invite a collaborator](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#invite-a-collaborator)

[Send an Invitation](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#send-an-invitation)

[Get Invitation Status](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-invitation-status)

[Tag a location](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#tag-a-location)

[Retrieve Copyright Information](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#retrieve-copyright-information)

[Limitations](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#limitations)

[Example](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#example)

[Error Codes](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#error-codes)

[Learn how to customize a reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#learn-how-to-customize-a-reel)

[See also](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#see-also)

# Reels Publishing API

This document explains how to publish a reel on a Facebook Page. To publish a reel on a Facebook Page, you will:

1. Initialize an upload session to upload your reel to the Meta servers
2. Upload your reel
3. Publish the reel to your Facebook Page

- Optionally, you can invite a collaborator to publish the reel on their Facebook Page.

#### Sharing Disclosure

|     |     |
| --- | --- |
| When uploading a reel using your app, the app user should be presented with disclosure of and options for control over how their Reels are used on Facebook.<br>#### Privacy / Who can see this?<br>An app user should be able to select the audience for their reel. This selection corresponds to the privacy parameter in the publishing step. Publishing to a Page has implicit public scope, and only the 'Public' option should be available.<br>#### Limitations<br>- You can only publish Reels to Facebook Pages<br>- You can only crosspost Reels to Facebook Pages<br>#### Rate Limit<br>Reels API is limited to 30 API-published posts within a 24-hour moving period. This limit is enforced on the `POST /{page_id}/video_reels` endpoint when attempting to publish a reel. Meta recommends that your app also enforces the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future. | _Sharing Disclosure Mockup_<br>![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/299692207_789876818817443_2233519248934922026_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=6cDTI3ZlEo0Q7kNvwEqXXAC&_nc_oc=AdpHJf0OfG6XIcoBw9lyi4qhKcSFFn_VLN-h9XzmYpZ3MCLb28LN2TwuT1l-AMwyQBI&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=XhMGx0hQRBOHwT7aYEs9Kw&_nc_ss=7b289&oh=00_Af7xkVbBJWElJ3KZwEc3Ny9qvtiCKVjPnmjkjOcSS5apSQ&oe=6A247478) |

## Before You Start

You will need:

- A Page access token requested from your app user who can perform the `CREATE_CONTENT` task on the Page
- The your app user must grant your app the following permissions using Facebook Login:

  - `pages_show_list`
  - `pages_read_engagement`
  - `pages_manage_posts`
- A video file that contains your reel

### Video Specifications

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

## Step 1: Initialize an Upload Session

Before you can publish a video to a Facebook Page, you must first upload it to the Meta social graph. You will need to initialize a video upload session to start the upload process. To start a session, send a `POST` request to the `/page-id/video_reels` endpoint, where **_page-id_** is the ID for your Facebook Page, with the `upload_phase` parameter set to `start`.

Be sure the host is **_`graph.facebook.com`_**.

#### Example Request

_Formatted for readability. Replace **_bold_**, **_italics values_**, such as **_page\_access\_token_**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/Your_page_id/video_reels" \
     -H "Content-Type: application/json" \
     -d '{
           "upload_phase":"start",
           "access_token":"Your_page_access_token"
         }'
```

On success, your app will receive a video ID and a URL to the video. This video ID will be used in subsequent steps.

```json
{
  "video_id": "video-id",
  "upload_url": "https://rupload.facebook.com/video-upload/video-id",
}
```

## Step 2: Upload the Video

Most Graph API calls use the graph.facebook.com host however, calls to upload videos for reels use **_`rupload.facebook.com`_**.

The following file sources are supported for uploaded video files:

- A file located on your computer
- A file hosted on a public facing server, such as a CDN

### Upload a Local File

To initiate the upload of the video asset, send a `POST` request using application/octet-stream as content type to the `/video-upload/` **_`video-id`_** endpoint where **_video-id_** is the ID from Step 1, `offset` is set to the first byte being upload, generally `0`, and `file_size` set to the size of your file, in bytes.

Be sure the host is **_`rupload.facebook.com`_**.

[**Video Reel Upload Quick Reference**](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#)

#### Example Request

_Formatted for readability. Replace **_bold_**, **_italics values_**, such as **_page\_access\_token_**, with your values._

```curl
curl -X POST "https://rupload.facebook.com/video-upload/v25.0/video-id" \
     -H "Authorization: OAuth Your_page_access_token" \
     -H "offset: 0" \
     -H "file_size: Your_file_size_in_bytes" \
     --data-binary "@my_video_file.mp4"
```

### Upload a Hosted File

To upload a hosted file, send a `POST` request to the `/video-upload/` **_`video-id`_** endpoint where **_video-id_** is the ID returned in Step 1 and `file_url` is set to the URL for your hosted file.

Be sure the host is **_`rupload.facebook.com`_**.

The API will now reject files hosted on sites that restrict access via robots.txt. Developers need to ensure that the hosting site allows the “facebookexternalhit/1.1 (+http://www.facebook.com/externalhit\_uatext.php)” user agent to fetch the hosted file.

Files hosted on Meta CDN (e.g.. fbcdn URLs) will get rejected. Instead, developers can use the crossposting feature to publish a video on multiple pages without uploading the video to each page. Refer to our [detailed guidance](https://developers.facebook.com/docs/video-api/guides/crossposting/) on crossposting.

#### Example Request

_Formatted for readability. Replace **_bold_**, **_italics values_**, such as **_page\_access\_token_**, with your values._

```curl
curl -X POST "https://rupload.facebook.com/video-upload/v25.0/video_id" \
     -H "Authorization: OAuth Your_page_access_token" \
     -H "file_url: https://some.cdn.url/video.mp4"
```

### Example Upload Response

If you upload was successful, your app will receive a JSON object with `success` set to `true`.

```json
{"success": true}
```

### Get the Upload Status

To get the status of a video, send a `GET` request to the `/``video-id` endpoint where the `video-id` is the ID from initialization step, and with `fields` set to `status`.

Be sure the host is `graph.facebook.com`.

#### Sample Request

```curl
curl -X GET "https://graph.facebook.com/v25.0/video-id
    ?fields=status
    &access_token=Your_page_access_token"
```

On success your app will receive a JSON object with status information that includes the processing, uploading, and publishing phases, and the video status.

[**Video Status Quick Reference**](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#)

If re-uploading doesn’t work, try again from Step 1.

##### Example Response with a Processing Error

```json
{
  "status": {
    "video_status": "processing",
    "uploading_phase": {
      "status": "complete",
    },
    "processing_phase": {
      "status": "not_started",
      "error": {
        "message": "Resolution too low. Video must have a minimum resolution of 540p."
      }
    }
    "publishing_phase": {
      "status": "not_started",
    }
  }
}
```

##### Example Response for an Interrupted Upload

```json
{
  "status": {
    "video_status": "processing",
    "uploading_phase": {
      "status": "in_progress",
      "bytes_transfered": 50002
    }
    "processing_phase": {
      "status": "not_started"
    }
    "publishing_phase": {
      "status": "not_started",
    }
  }
}
```

| Error Type | Error Message | Recommended Solution |
| --- | --- | --- |
| OffsetInvalidError | Request starting offset is invalid | Set the ‘offset’ parameter to the `bytes_transfered` value returned in the Video endpoint `status` field |
| PartialRequestError | Partial request (did not match length of file) | Check the file size and try the upload again. |
| ProcessingFailedError | Request processing failed | Please try uploading again. Make sure the video meets all of the requirements. If the upload does not work, initialize a new upload session. |

### Resume an Interrupted Upload

If the video upload is interrupted, it can be resumed.

To resume an upload, send another POST request to the `/video-upload/video-id` endpoint and use the value for `upload_phase.bytes_transfered` as the value for `offset`.

## Step 3: Publish the Reel

To end the upload session and publish your video, send a `POST`request to the `/` **_`page-id`_**`/video_reels` endpoint. You can also include any of the additional fields, like `description`, which can include hashtags, and `title`.

Be sure the host is **_`graph.facebook.com`_**.

[**POST Page Video Reels Quick Reference**](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#)

#### Example Request

_Formatted for readability. Replace **_bold_**, **_italics values_**, such as **_page\_access\_token_**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/page-id/video_reels
    ?access_token=Your_page_access_token
    &video_id=video-id
    &upload_phase=finish
    &video_state=PUBLISHED
    &description=What a beautiful day! #sunnyand72"
```

On success your app will receive a JSON object with `success` set to `true`.

```json
{"success": true}
```

### Get a List of Reels

To get a list of all reels published on your Facebook Page, send a `GET` request to `/` **_`page-id`_**`/video_reels` endpoint.

Be sure the host is **_`graph.facebook.com`_** for this API call.

**Note:** When using `since` and `until` in your `GET` request, the date for `until` must be a date after the date for `since`. For example, if `since` is `2023-01-31`, `until` must be after `2023-01-31`. You can use both parameters, or one or the other. Date formats can be any of the following:

- `today`, `yesterday`
- Epoch timestamps (1676057525)
- `yyyy-mm-dd` (2023-1-31)

```curl
curl -X GET "https://graph.facebook.com/v25.0/page-id/video_reels?access_token=Your_page_access_token"
```

On success your app will receive a JSON object with information about your published reels such as video ID and published time.

```json
{
  "data": [\
    {\
      "updated_time": "unix_timestamp",\
      "id": "video-1-id"\
    },\
    {\
      "description": "sample_description",\
      "updated_time": "unix_timestamp",\
      "id": "video-2-id"\
    },\
    ...\
  ]
}
```

## Invite a collaborator

Invite a person, a **collaborator**, to publish your reel on their Facebook Page.

To publish a reel on a collaborator's Facebook Page you will invite the collaborator to publish your reel on their Facebook Page. When they accept the invitation, the reel will immediately be published on their Facebook Page if the reel has been published, or the reel will be published on their Page when you publish the reel on your Page.

You will need:

- The ID for the collaborator's Facebook Page (for New Page Experience, use the delegate Page ID)
- The ID for the Video you want to share with a collaborator

#### Limitations

- You can only send 10 collaborator invitation per Page per 24 hours
- You can only publish Reels to other Facebook Pages

### Send an Invitation

To invite a collaborator to publish your reel on their Facebook Page, send a `POST` request to the `/` **_`video-id`_**`/collaborators` endpoint with the `target_id` parameter set to the ID for the collaborator's Facebook Page.

_Formatted for readability._

```curl
curl -X POST "https://graph.facebook.com/v25.0/video-id/collaborators
  ?target_id=collaborators-page-id
  &access_token=your-page-access-token"
```

On success your app will receive a JSON response with the link to the invitation and your collaborator will receive an invite notification.

#### Example Response

```json
{
  "success": true,
  “collaborator_id”: “collaborators-page-id”
  “invitation_link”: “facebook-url-for-invitation”
}
```

### Get Invitation Status

To get the status for an invitation you sent, send a `GET` request to the `/` **_`video-id`_**`/collaborators` endpoint.

#### Example Request

_Formatted for readability._

```curl
curl -X POST "https://graph.facebook.com/v25.0/video-id/collaborators
  ?access_token=your-page-or-user--access-token"
```

On success your app will receive a JSON response with the invitation status of `Accepted`, `Declined`, or `Pending`.

```json
{
  “id”: “video-id”
  “name”: “collaborators-page-name”
  “invite_status”: “Accepted”
  “invitation_link”: “facebook-url-for-invitation”
}
```

## Tag a location

To find a place to tag, you can use the [Pages Search API](https://developers.facebook.com/docs/pages-api/search-pages). When searching for a place, only pages with valid locations can be used. When searching be sure to include the `location` field to verify this.

To tag the location in your reel, include the parameter `place` and the `id` returned from the Pages Search API in the publish call.

**Example Request**

```curl
curl -X POST "https://graph.facebook.com/v18.0/page-id/video_reels
    ?access_token=Your_page_access_token
    &video_id=video-id
    &upload_phase=finish
    &video_state=PUBLISHED
    &place=123456"
```

## Retrieve Copyright Information

At upload, a copyright check is run to see if your upload contains licensed content and lets you act appropriately before publishing. Videos in violation may have restricted access or be subject to monetization impacts. To retrieve the copyright check information on the Reel, you must have `pages_read_engagement` permission on the Page. You will need the ID of the Video and the Page access token. Please note that it may take a couple of minutes for the copyright check to be completed and return information.

### Limitations

- Works for Reels API uploads

- Only the owner can view the matches information


### Example

**Example Request**

```curl
curl -i -X GET "https://graph.facebook.com/v18.0/VIDEO_ID?fields=copyright_check_information&access_token=ACCESS_TOKEN"
```

**Example Responses**

_In progress:_

```json
{
  "copyright_check_information": {
        "status": {
            "status": "in_progress",
        },
    }
}
```

_Without any matches:_

```json
{
  "copyright_check_information": {
        "status": {
            "status": "complete",
            "matches_found": false
        },
    }
}
```

_With matches:_

```json
"copyright_check_information": {
        "status": {
            "status": "complete",
            "matches_found": true
        },
        "copyright_matches": [\
            {\
                "content_title": "Title 1",\
                "owner_copyright_policy": {\
                    "name": "Owner name 1",\
                    "actions": [\
                        {\
                            "action": "TRACK",\
                            "territories": "3",\
                            "geos": [\
                                "United Arab Emirates",\
                                "Afghanistan",\
                                "Antigua and Barbuda",\
                            ]\
                        }\
                    ]\
                },\
                "matched_segments": [\
                    {\
                        "start_time_in_seconds": 90.5,\
                        "duration_in_seconds": 35,\
                        "segment_type": "AUDIO"\
                    }\
                ]\
            },\
            {\
                "content_title": "Title 2",\
                "owner_copyright_policy": {\
                    "name": "Owner name 2",\
                    "actions": [\
                        {\
                            "action": "BLOCK",\
                            "territories": "1",\
                            "geos": [\
                                "Italy"\
                            ]\
                        }\
                    ]\
                },\
                "matched_segments": [\
                    {\
                        "start_time_in_seconds": 90.5,\
                        "duration_in_seconds": 35,\
                        "segment_type": "AUDIO"\
                    }\
                ]\
            }\
        ]
    },
```

## Error Codes

Common error codes and possible mitigations.

| Error Code | Error Message | Possible Mitigation |
| --- | --- | --- |
| `100` | "error": {<br>"message": "(#100) Missing parameter: {a list of missing parameters}",<br>"type": "OAuthException",<br>"code": 100,<br>"fbtrace\_id": "----"<br>}<br>} | A required parameter, such as `upload_phase`, is missing from your API call. Visit the endpoint reference to ensure all required parameters are included and be sure to check for typos. |
| `1363040` | The video you tried to upload has an aspect ratio that isn't supported on Facebook. Aspect ratios for videos need to be between 16x9 and 9x16. Please try uploading a video in a supported aspect ratio. | Aspect ratios for videos need to be between 16x9 and 9x16. |
| `1363127` | The video you tried to upload has resolution that isn't supported on Facebook for this product. Please try uploading a video with a supported resolution | Minimum resolution is 540 x 960 pixels. Recommended resolution is 1080 x 1920 pixels. |
| `1363128` | The video you tried to upload has a duration that isn't supported on Facebook for this product. Please try uploading a video with a supported duration. | Reels duration must be between 3 and 90 seconds. |
| `1363129` | The video you tried to upload has an average frame rate that isn't supported on Facebook for this product. Please try uploading a video with a supported frame rate | Reels frame rate must be between 24 and 60 frames per second. |

## Learn how to customize a reel

Customize your reel to create a richer reels experience for your viewers.

- [Add a custom cover photo for your reel](https://developers.facebook.com/docs/graph-api/reference/video/thumbnails/#Creating)
- [Add your favorite music to your reel](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-for-you)
- [Get music recommendations from Meta for new music](https://developers.facebook.com/docs/video-api/guides/music-recommendations#new-music-on-facebook)
- [Get music recommendations from Meta for popular music on Facebook](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-popular-on-facebook)

## See also

- [Get insights for your reels](https://developers.facebook.com/docs/graph-api/reference/video/video_insights#reels-metrics) to track engagement
- [Facebook Sharing to Reels From Android](https://developers.facebook.com/docs/android/sharing-to-reels-facebook)
- [Facebook Sharing to Reels From iOS](https://developers.facebook.com/docs/ios/sharing-to-reels-facebook)
- Check out the [Facebook Reels Publishing API Sample](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Freels_publishing_apis%2Ftree%2Fmain%2Ffb_reels_publishing_api_sample&h=AUAdhec3oEDdW4zgfZ8HjL_cCVMudclPRgmEMWLoqRwJAxG2a8ZtSh6PvS4qYgfObD4qD_cPo0M60OP_0hrsGRzumpNu6WEivHmWHnShi2TJzTRRiRNc5UPrSHRwrIexvl13FxE01JYTXg) available on Github.
- Check out the [Facebook Reels collection on the Postman API Platform](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.postman.com%2Fmeta%2Fworkspace%2Ffacebook%2Ffolder%2F23987686-8318a757-f788-40fa-a27b-e3dcfdc2f8d4%3Fctx%3Ddocumentation%26fbclid%3DIwAR23KQZpXD4mdQ-fFdEYU5KkigRM67AtsFPwJMJ-EdZZyuxAmuC-Zd22jV0&h=AUAdJ1k8amepEkyfERWYn0Vsv2bmh8RocZ5uZSGNffbQUHLRlffEzKBaThNlihJrPhx3sXwdOWQ669sHp4x7JragrPPT_yre1gNvTkvVmGOGmkNLEZslbP5e4-dqC57n461uWPCsB_RkYg)
- Check out the [Instagram Reels collection on the Postman API Platform](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.postman.com%2Fmeta%2Fworkspace%2Finstagram%2Ffolder%2F23987686-91b95cb4-a10c-4aad-b15d-b54f2e6900e7%3Fctx%3Ddocumentation%26fbclid%3DIwAR31DFQLv9Uew9bxy-Cx6WqINMpg3sqdV-ipqVc2fBeFMdxVE4lOzDHGp80&h=AUC4QTdeSaDec176gouMiJmBmPXxI7EI_6L3ENGK0J9IYmxywrHZrmKH4fYC21EIDoi_cLnJRRsbEO0DSF08qy9HXVFRISX8oZhR35AcZnHPd01s3Ib-umNuR-n7pGpxyShs7Xbr561l8Q)

On This Page

[Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#reels-publishing-api)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#before-you-start)

[Video Specifications](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#requirements)

[Step 1: Initialize an Upload Session](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#step-1--initialize-an-upload-session)

[Step 2: Upload the Video](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload)

[Upload a Local File](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload-a-local-file)

[Upload a Hosted File](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#upload-a-hosted-file)

[Example Upload Response](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#example-upload-response)

[Get the Upload Status](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-the-upload-status)

[Resume an Interrupted Upload](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#resume-an-interrupted-upload)

[Step 3: Publish the Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#step-3--publish-the-reel)

[Get a List of Reels](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-a-list-of-reels)

[Invite a collaborator](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#invite-a-collaborator)

[Send an Invitation](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#send-an-invitation)

[Get Invitation Status](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#get-invitation-status)

[Tag a location](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#tag-a-location)

[Retrieve Copyright Information](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#retrieve-copyright-information)

[Limitations](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#limitations)

[Example](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#example)

[Error Codes](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#error-codes)

[Learn how to customize a reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#learn-how-to-customize-a-reel)

[See also](https://developers.facebook.com/docs/video-api/guides/reels-publishing/#see-also)