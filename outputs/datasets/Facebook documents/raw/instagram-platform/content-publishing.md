---
url: https://developers.facebook.com/docs/instagram-platform/content-publishing
title: Publish Content - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fcontent-publishing%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
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

[Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/#content-publishing)

[Requirements](https://developers.facebook.com/docs/instagram-platform/content-publishing/#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/#limitations)

[Create a container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#create-a-container)

[Create a carousel container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#create-a-carousel-container)

[Resumable Upload Session](https://developers.facebook.com/docs/instagram-platform/content-publishing/#resumable-upload-session)

[Publish the container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#publish-the-container)

[Reels posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#reels-posts)

[Trial Reels posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#trial-reels-posts)

[Story posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#story-posts)

[Partnership ads label](https://developers.facebook.com/docs/instagram-platform/content-publishing/#partnership-ads-label)

[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/#limitations-2)

[Parameters](https://developers.facebook.com/docs/instagram-platform/content-publishing/#parameters)

[Example request](https://developers.facebook.com/docs/instagram-platform/content-publishing/#example-request)

[Troubleshooting](https://developers.facebook.com/docs/instagram-platform/content-publishing/#troubleshooting)

[Container publishing status](https://developers.facebook.com/docs/instagram-platform/content-publishing/#container-publishing-status)

[Partnership ads label errors](https://developers.facebook.com/docs/instagram-platform/content-publishing/#partnership-ads-label-errors)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/content-publishing/#next-steps)

# Content Publishing

This guide shows you how to publish single images, videos, reels (single media posts), or posts containing multiple images and videos (carousel posts) on Instagram professional accounts using the Instagram Platform.

On March 24, 2025, we introduced the new `alt_text` field for image posts on the `/<INSTAGRAM_PROFESSIONAL_ACCOUNT_ID>/media` endpoint. Reels and stories are not supported.

## Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

#### Media on a public server

We cURL media used in publishing attempts, so the media must be hosted on a publicly accessible server at the time of the attempt.

#### Page Publishing Authorization

An Instagram professional account connected to a [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) that requires [Page Publishing Authorization](https://www.facebook.com/business/m/one-sheeters/page-publishing-authorization) (PPA) cannot be published to until PPA has been completed.

It's possible that an app user may be able to perform [Tasks](https://developers.facebook.com/docs/instagram-api/overview#tasks) on a Page that initially does not require PPA but later requires it. In this scenario, the app user would not be able to publish content to their Instagram professional account until completing PPA. Since there's no way for you to determine if an app user's Page requires PPA, we recommend that you advise app users to preemptively complete PPA.

You will need the following:

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Levels** | - Advanced Access<br>- Standard Access | - Advanced Access<br>- Standard Access |
| **Access Tokens** | - Instagram User access token | - Facebook Page access token |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com``rupload.facebook.com` (For resumable video uploads) |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_content_publish` | - `instagram_basic`<br>- `instagram_content_publish`<br>- `pages_read_engagement`<br>If the app user was granted a role on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to your app user's Instagram professional account via the Business Manager, your app will also need:<br>- `ads_management`<br>- `ads_read` |
| **Webhooks** |  |  |

#### Endpoints

- [`/<IG_ID>/media`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#creating)— Create media container and upload the media


  - `upload_type=resumable` — Create a resumbable upload session to upload large videos from an area with frequent network interruptions or other transmission failures. Only for apps that have implemented Facebook Login for Business.
- [`/<IG_ID>/media_publish`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media_publish#creating) — publish uploaded media using their media containers.
- [`/<IG_CONTAINER_ID>?fields=status_code`](https://developers.facebook.com/docs/instagram-api/reference/ig-container#reading) — check media container publishing eligibility and status.
- [`/<IG_ID>/content_publishing_limit`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/content_publishing_limit) — check app user's current publishing rate limit usage.

- `POST https://rupload.facebook.com/ig-api-upload/<IG_MEDIA_CONTAINER_ID>` — Upload the video to Meta servers

- `GET /<IG_MEDIA_CONTAINER_ID>?fields=status_code` — Check publishing eligibility and status of the video


#### HTML URL encoding troubleshooting

- Some of the parameters are supported in list/dict format.
- Some characters need to be encoded into a format that can be transmitted over the Internet. For example: `user_tags=[{username:’ig_user_name’}]` is encoded to `user_tags=%5B%7Busername:ig_user_name%7D%5D` where `[` is encoded to `%5B` and `{` is encoded to `%7B`. For more conversions, please refer to the HTML URL Encoding standard.\
\
### Limitations\
\
- JPEG is the only image format supported. Extended JPEG formats such as MPO and JPS are not supported.\
- Shopping tags are not supported.\
- Filters are not supported.\
\
For additional limitations, see each endpoint's reference.\
\
#### Rate Limit\
\
Instagram accounts are limited to 100 API-published posts within a 24-hour moving period. Carousels count as a single post. This limit is enforced on the `POST /<IG_ID>/media_publish` endpoint when attempting to publish a media container. We recommend that your app also enforce the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future.\
\
To check an Instagram professional account's current rate limit usage, query the `GET /<IG_ID>/content_publishing_limit` endpoint.\
\
## Create a container\
\
|     |     |\
| --- | --- |\
| In order to publish a media object, it must have a container. To create the media container and upload a media file, send a `POST` request to the `/<IG_ID>/media` endpoint with the following parameters:<br>- `access_token` – Set to your app user's access token<br>- `image_url` or `video_url` – Set to the path of the image or video. We will cURL your image using the passed in URL so it must be on a public server.<br>- `media_type` — If the container will be for a video, set to `VIDEO`, `REELS`, or `STORIES`. <br>- `is_carousel_item` – If the media will be part of a carousel, set to `true`<br>- `upload_type` – Set to `resumable`, if creating a resumable upload session for a large video file<br>Visit the [Instagram User Media Endpoint Reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media#query-string-parameters) for additional optional parameters. | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/480730075_1720310908885450_3341858114925327726_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=8xJ2_pE7Z4wQ7kNvwFr9Ohk&_nc_oc=AdoR4kkkANOl-4xB6OtKRASfBS7U5GSjx29yCarRUs-KzR3zbhz6AWx5Jh756_oZCGc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9g8qiiGsmyYifforkKg94Q&_nc_ss=7b289&oh=00_Af44qJaJ5fcGuyjJAjDF5v2oHdh7RIgSiIHQ1dkofDSDPA&oe=6A256BE4) |\
\
#### Example Request\
\
_Formatted for readability._\
\
```html\
curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media"\
     -H "Content-Type: application/json"\
     -H "Authorization: Bearer <ACCESS_TOKEN>"\
     -d '{\
           "image_url":"https://www.example.com/images/bronz-fonz.jpg"\
         }'\
```\
\
On success, your app receives a JSON response with the Instagram Container ID.\
\
```json\
{\
  "id": "<IG_CONTAINER_ID>"\
}\
```\
\
### Create a carousel container\
\
|     |     |\
| --- | --- |\
| To publish up to 10 images, videos, or a combination of the two, in a single post, a carousel post, you must create a carousel container. This carousel containter will contain a list of all media containers.<br>To create the carousel container, send a `POST` request to the `/<IG_ID>/media` endpoint with the following parameters:<br>- `media_type` — Set to `CAROUSEL`. Indicates that the container is for a carousel.<br>- `children` — A comma separated list of up to 10 container IDs of each image and video that should appear in the published carousel. | ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/481244262_1166248521755437_1763081748565619554_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=g8_1UnUOuUoQ7kNvwF_Lp4Y&_nc_oc=Adqd6IsbF67dj6NP4VRh17eXHsrSm1aTgpYkmYbh8soWuSPwVRG5SWorNtmKK_N0sUA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9g8qiiGsmyYifforkKg94Q&_nc_ss=7b289&oh=00_Af7v_26iTWsCosluhHCVnyRIpEAEtclFxsy2YK2dpKQRBA&oe=6A255039) |\
\
#### Limitations\
\
- Carousels are limited to 10 images, videos, or a mix of the two.\
- Carousel images are all cropped based on the first image in the carousel, with the default being a 1:1 aspect ratio.\
- Accounts are limited to 50 published posts within a 24-hour period. Publishing a carousel counts as a single post.\
\
#### Example Request\
\
_Formatted for readability._\
\
```curl\
curl -X POST "https://graph.instagram.com/v25.0/90010177253934/media"\
     -H "Content-Type: application/json"\
     -d '{\
           "caption":"Fruit%20candies"\
           "media_type":"CAROUSEL"\
           "children":"<IG_CONTAINER_ID_1>,<IG_CONTAINER_ID_2>,<IG_CONTAINER_ID_3>"\
         }'\
```\
\
On success, your app receives a JSON response with the Instagram Carousel Container ID.\
\
```code\
{\
  "id": "<IG_CAROUSEL_CONTAINER_ID>"\
}\
```\
\
## Resumable Upload Session\
\
If you created a container for a resumable video upload in Step 1, your need to upload the video before it can be published.\
\
Most API calls use the `graph.facebook.com` host however, calls to upload videos for Reels use `rupload.facebook.com`.\
\
The following file sources are supported for uploaded video files:\
\
- A file located on your computer\
- A file hosted on a public facing server, such as a CDN\
\
To start the upload session, send a `POST` request to the `/<IG_MEDIA_CONTAINER_ID` endpoint on the `rupload.facebook.com` host with the following parameters:\
\
- `access_token`\
\
#### Sample request upload a local video file\
\
With the `ig-container-id` returned from a resumable upload session call, upload the video.\
\
- Be sure the host is `rupload.facebook.com`.\
- All `media_type` shares the same flow to upload the video.\
- `ig-container-id` is the ID returned from resumable upload session calls.\
- `access-token` is the same one used in previous steps.\
- `offset` is set to the first byte being upload, generally `0`.\
- `file_size` is set to the size of your file in bytes.\
- `Your_file_local_path` is set to the file path of your local file, for example, if uploading a file from, the **Downloads** folder on macOS, the path is **@Downloads/example.mov**.\
\
```http\
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \\
     -H "Authorization: OAuth <ACCESS_TOKEN>" \\
     -H "offset: 0" \\
     -H "file_size: Your_file_size_in_bytes" \\
     --data-binary "@my_video_file.mp4"\
```\
\
#### Sample request upload a public hosted video\
\
```http\
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \\
     -H "Authorization: OAuth <ACCESS_TOKEN>" \\
     -H "file_url: https://example_hosted_video.com"\
```\
\
#### Sample Response\
\
```http\
// Success Response Message\
{\
  "success":true,\
  "message":"Upload successful."\
}\
\
// Failure Response Message\
{\
  "debug_info":{\
    "retriable":false,\
    "type":"ProcessingFailedError",\
    "message":"{\"success\":false,\"error\":{\"message\":\"unauthorized user request\"}}"\
  }\
}\
```\
\
## Publish the container\
\
To publish the media,\
\
Send a `POST` request to the `/<IG_ID>/media_publish` endpoint with the following parameters:\
\
- `creation_id` set to the container ID, either for a single media container or a carousel container\
\
#### Example Request\
\
_Formatted for readability._\
\
```html\
\
curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media_publish"\
     -H "Content-Type: application/json"\
     -H "Authorization: Bearer <ACCESS_TOKEN>"\
     -d '{\
           "creation_id":"<IG_CONTAINER_ID>"\
         }'\
```\
\
On success, your app receives a JSON response with the Instagram Media ID.\
\
```json\
{\
  "id": "<IG_MEDIA_ID>"\
}\
```\
\
## Reels posts\
\
Reels are short-form videos that appears in the **Reels** tab of the Instagram app. To publish a reel, create a container for the video and include the `media_type=REELS` parameter along with the path to the video using the `video_url` parameter.\
\
If you publish a reel and then request its `media_type` field, the value returned is `VIDEO`. To determine if a published video has been designated as a reel, request its `media_product_type` field instead.\
\
You can use the [code sample on GitHub (insta\_reels\_publishing\_api\_sample)](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Freels_publishing_apis%2Ftree%2Fmain%2Finsta_reels_publishing_api_sample&h=AUDnIfChMRIUU-JOwJBmpDL1xbY5ezjhaWgKn0uJtD5Vab1pZ-Vrk7UMcquwAAHKy9FSoQmT1hBUhEoObE0jc00FnW86nixKrvVj89ks0gMm2PGdMl2MdowENv3D19Psugpb6wVZDfXEBQ) to learn how to publish Reels to Instagram.\
\
## Trial Reels posts\
\
Trial reels are reels that are only shared to non-followers. To publish a trial reel, create a container for the video and include a valid `trial_params` parameter along with the parameters required to create reels. `trial_params` consists of the following fields:\
\
| Field Name | Description |\
| --- | --- |\
| `graduation_strategy` | The graduation strategy specifies the conditions to graduate a reel (convert the trial reel to a reel, sharing it to followers). Possible values:<br>- `MANUAL` — The trial reel can be manually graduated in the native app.<br>- `SS_PERFORMANCE` — The trial reel will be automatically graduated if the trial reel performs well. |\
\
#### Example Request\
\
_Formatted for readability._\
\
```curl\
curl -X POST "https://graph.instagram.com/v25.0/90010177253934/media"\
     -H "Content-Type: application/json"\
     -d '{\
           "media_type":"REELS"\
           "video_url":"https://www.example.com/videos/bronz-fonz.mp4"\
           "trial_params":{\
             “graduation_strategy”: “MANUAL”\
           }\
         }'\
```\
\
## Story posts\
\
To publish a reel, create a container for the media object and include the `media_type` parameter set to `STORIES`.\
\
If you publish a story and then request its `media_type` field, the value will be returned as `IMAGE/VIDEO`. To determine if a published image/video is a story, request its `media_product_type` field instead.\
\
## Partnership ads label\
\
Add a partnership ads label to posts by including the `branded_content_sponsor_ids` and/or `is_paid_partnership` parameters when [creating a media container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#create-a-container).\
\
### Limitations\
\
- Your app user's access token must include the `instagram_branded_content_creator` or `instagram_basic` permission.\
- Sponsor accounts must be professional accounts.\
- Maximum 2 sponsor tags per post.\
- Not supported on close-friends-only posts or remixed media.\
\
### Parameters\
\
| Name | Description |\
| --- | --- |\
| `branded_content_sponsor_ids`<br>array of integers | **Optional.**<br>An array of Instagram user IDs of brands to tag as partners. Maximum 2. Use the [Business Discovery API](https://developers.facebook.com/docs/instagram-api/guides/business-discovery) to look up a brand's ID by username. |\
| `is_paid_partnership`<br>Boolean | **Optional.**<br>Enables the "Paid partnership" label. Automatically set to `true` when `branded_content_sponsor_ids` is provided. Use without `branded_content_sponsor_ids` for a label-only post. |\
\
If the brand has pre-approved the creator via the [`branded_content_tag_approval`](https://developers.facebook.com/docs/marketing-api/ad-creative/partnership-ads/post-level-permissioning#update-the-creator-approval-list) endpoint, the label shows the brand name immediately. If not, the label shows "Paid partnership" while pending, and the brand receives an approval notification.\
\
After publishing, creators can use the existing [`branded_content_partner_promote`](https://developers.facebook.com/docs/marketing-api/ad-creative/partnership-ads/post-level-permissioning#allow-brand-partnerships) endpoint to give the brand permission to promote the post as a partnership ad.\
\
### Example request\
\
```html\
curl -X POST "https://graph.facebook.com/<LATEST_API_VERSION>/<IG_USER_ID>/media" \\
     -H "Authorization: Bearer <ACCESS_TOKEN>" \\
     -d "image_url=<IMAGE_URL>" \\
     -d "caption=<CAPTION>" \\
     -d "branded_content_sponsor_ids=[<BRAND_IG_USER_ID1>, <BRAND_IG_USER_ID2>]" \\
     -d "is_paid_partnership=true"\
```\
\
## Troubleshooting\
\
### Container publishing status\
\
If you are able to create a container for a video but the `POST /<IG_ID>/media_publish` endpoint does not return the published media ID, you can get the container's publishing status by querying the `GET /<IG_CONTAINER_ID>?fields=status_code` endpoint. This endpoint will return one of the following:\
\
- `EXPIRED` — The container was not published within 24 hours and has expired.\
- `ERROR` — The container failed to complete the publishing process.\
- `FINISHED` — The container and its media object are ready to be published.\
- `IN_PROGRESS` — The container is still in the publishing process.\
- `PUBLISHED` — The container's media object has been published.\
\
We recommend querying a container's status once per minute, for no more than 5 minutes.\
\
### Partnership ads label errors\
\
| Error code | Message |\
| --- | --- |\
| `INSTAGRAM_PLATFORM_API__PERMISSION` | Creator is not eligible for branded content. Ensure branded content tools are enabled on the creator's account. |\
| `INSTAGRAM_PLATFORM_API__INVALID_PARAM` | The specified sponsor cannot be tagged. The sponsor must be a professional account and not blocked. |\
| `INSTAGRAM_PLATFORM_API__INVALID_PARAM` | Maximum number of sponsors exceeded. Limit is 2 per post. |\
| `INSTAGRAM_PLATFORM_API__INVALID_PARAM` | Cannot tag yourself as sponsor. |\
\
See the [Error Codes](https://developers.facebook.com/docs/instagram-api/reference/error-codes) reference for additional errors.\
\
## Next Steps\
\
Now that you have published to an Instagram professional account, learn how to [moderate comments on your media](https://developers.facebook.com/docs/instagram/platform/instagram-api/comment-moderation).\
\
On This Page\
\
[Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/#content-publishing)\
\
[Requirements](https://developers.facebook.com/docs/instagram-platform/content-publishing/#requirements)\
\
[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/#limitations)\
\
[Create a container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#create-a-container)\
\
[Create a carousel container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#create-a-carousel-container)\
\
[Resumable Upload Session](https://developers.facebook.com/docs/instagram-platform/content-publishing/#resumable-upload-session)\
\
[Publish the container](https://developers.facebook.com/docs/instagram-platform/content-publishing/#publish-the-container)\
\
[Reels posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#reels-posts)\
\
[Trial Reels posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#trial-reels-posts)\
\
[Story posts](https://developers.facebook.com/docs/instagram-platform/content-publishing/#story-posts)\
\
[Partnership ads label](https://developers.facebook.com/docs/instagram-platform/content-publishing/#partnership-ads-label)\
\
[Limitations](https://developers.facebook.com/docs/instagram-platform/content-publishing/#limitations-2)\
\
[Parameters](https://developers.facebook.com/docs/instagram-platform/content-publishing/#parameters)\
\
[Example request](https://developers.facebook.com/docs/instagram-platform/content-publishing/#example-request)\
\
[Troubleshooting](https://developers.facebook.com/docs/instagram-platform/content-publishing/#troubleshooting)\
\
[Container publishing status](https://developers.facebook.com/docs/instagram-platform/content-publishing/#container-publishing-status)\
\
[Partnership ads label errors](https://developers.facebook.com/docs/instagram-platform/content-publishing/#partnership-ads-label-errors)\
\
[Next Steps](https://developers.facebook.com/docs/instagram-platform/content-publishing/#next-steps)