---
url: https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/
title: Resumable Uploads - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fcontent-publishing%2Fresumable-uploads%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Upload Video to Meta Servers](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#upload-video-to-meta-servers)

[Create a container](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#create-a-container)

[Basic example request](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#basic-example-request)

[Sample response](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#sample-response)

[Upload the Video](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#upload-the-video)

[Step 3: (Carousel Only) Create Carousel Containers](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-3---carousel-only--create-carousel-containers)

[Step 4: Publish the Media](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-4--publish-the-media)

[Step 5: Get Media Status](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-5--get-media-status)

# Upload Video to Meta Servers

This guide shows you how to upload large video files, from local and publicly hosted content, to be published on Instagram. This is available only for apps that have implemented Facebook Login for Business.

The API allows you resume a local file upload operation after a network interruption or other transmission failure, saving time and bandwidth in the event of network failures.

### Host URLs

- `graph.facebook.com` – Create video media containers and publish and manage uploaded media
- `rupload.facebook.com` – Upload the video to Meta servers

### Endpoints

- `POST https://graph.facebook.com/<IG_USER_ID>/media?upload_type=resumable` — Initialize the upload and create a media container for the video
- `POST https://rupload.facebook.com/ig-api-upload/<IG_MEDIA_CONTAINER_ID>` — Upload the video to Meta servers
- `POST https://graph.facebook.com/<IG_USER_ID>/media_publish?creation_id=<IG_MEDIA_CONTAINER_ID>` — Publish the uploaded video
- `GET /<IG_MEDIA_CONTAINER_ID>?fields=status_code` — Check publishing eligibility and status of the video

### HTML URL encoding hints

- Some of the parameters are supported in list/dict format.
- Some characters need to be encoded into a format that can be transmitted over the Internet. For example: `user_tags=[{username:’ig_user_name’}]` is encoded to `user_tags=%5B%7Busername:ig_user_name%7D%5D` where `[` is encoded to `%5B` and `{` is encoded to `%7B`. For more conversions, please refer to the HTML URL Encoding standard.\
\
## Create a container\
\
To create a resumable upload session for the video, send a `POST` request to the `/<IG_USER_ID>/media` endpoint on the `graph.facebook.com` host with the following required parameters:\
\
- `access_token` – Set to your app user's access token\
- `upload_type` – Set to `resumable`\
- `media_type` – Set to `REELS`, `STORIES`, or `VIDEO` (for videos to be used in carousels)\
- `is_carousel_item` – Set to `true` (for videos to be used in carousels)\
\
### Basic example request\
\
_Formatted for readability._\
\
```html\
curl "https://graph.facebook.com/<API_VERSION>/<IG_USER_ID>/media"\
     -H "Content-Type: application/json"\
     -H "Authorization: Bearer <USER_ACCESS_TOKEN>"\
     -d '{\
            "media_type": "<REELS_STORIES_VIDEO>"\
            "upload_type=resumable"\
        }'\
```\
\
#### Optional parameters for Reels\
\
- `audio_name` – Set to the name of the audio\
- `caption` – Set to the caption for the reel video\
- `collaborators` – Set to a comma-separated list of up to 3 Instagram usernames of collaborators\
- `cover_url` – Set to the URL to the cover image for the Reels tab\
- `location_id` – Set to the ID of a Facebook Page associated with a location\
- `thumb_offset` – Set to frame in the video to be used as the thumbnail\
- `user_tags` – Set to an array of `username` objects for public Instagram users your app user wants to tag in the video\
\
### Sample response\
\
On success your app receives a JSON object with the ID and the Meta URI for the container. These two values will be used in Step 2.\
\
```json\
{\
   "id": "<IG_MEDIA_CONTAINER_ID>",\
   "uri": "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>"\
}\
```\
\
## Upload the Video\
\
Most Graph API calls use the `graph.facebook.com` host however, calls to upload videos for Reels use `rupload.facebook.com`.\
\
The following file sources are supported for uploaded video files:\
\
- A file located on your computer\
- A file hosted on a public facing server, such as a CDN\
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
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>" \\
     -H "Authorization: OAuth <ACCESS_TOKEN>" \\
     -H "offset: 0" \\
     -H "file_size: Your_file_size_in_bytes" \\
     --data-binary "@my_video_file.mp4"\
```\
\
#### Sample request upload a public hosted video\
\
```http\
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>" \\
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
## Step 3: (Carousel Only) Create Carousel Containers\
\
You can reuse step 1 and 2 to create multiple `ig-container-ids` with the `is_carousel_item` parameter set to `true`. Then create a Carousel Container to include all the carousel items, the carousel items can be mixed with Image and Videos.\
\
```http\
curl -X POST "https://graph.facebook.com/<API_VERSION>/<IG_USER_ID>/media" \\
    -d "media_type=CAROUSEL" \\
    -d "caption={caption}"\\
    -d "collaborators={collaborator-usernames}" \\
    -d "location_id={location-id}" \\
    -d "product_tags={product-tags}" \\
    -d "children=[<IG_MEDIA_CONTAINER_ID_1>,<IG_MEDIA_CONTAINER_ID_2>...]" \\
    -H "Authorization: OAuth <ACCESS_TOKEN>"\
```\
\
## Step 4: Publish the Media\
\
For Reels and Video Stories, the `<IG_MEDIA_CONTAINER_ID>` created in step 1 is used to publish the Video, and for Carousel Container, the `<IG_MEDIA_CONTAINER_ID>` created in step 3 is used to publish the Carousel Container.\
\
```http\
curl -X POST "https://graph.facebook.com/<API_VERSION>/<IG_USER_ID>/media_publish" \\
    -d "creation_id=<IG_MEDIA_CONTAINER_ID>" \\
    -H "Authorization: OAuth <ACCESS_TOKEN>"\
```\
\
## Step 5: Get Media Status\
\
`graph.facebook.com` provides a `GET` endpoint to read the status of the upload, the `video_status` field contains details about the local upload process.\
\
- The `uploading_phase` tells whether the file has been uploaded successfully, and how many bytes transferred.\
- The `processing_phase` contains the details about the status of video processing after the video file is uploaded.\
\
```http\
// GET status from graph.facebook.com\
curl -X GET "https://graph.facebook.com/v19.0/<IG_MEDIA_CONTAINER_ID>?fields=id,status,status_code,video_status" \\
    -H "Authorization: OAuth <ACCESS_TOKEN>"\
```\
\
#### Sample Response from the `graph.facebook.com` endpoint\
\
```http\
// A successfully created ig container\
{\
  "id": "<IG_MEDIA_CONTAINER_ID>",\
  "status": "Published: Media has been successfully published.",\
  "status_code": "PUBLISHED",\
  "video_status": {\
    "uploading_phase": {\
      "status": "complete",\
      "bytes_transferred": 37006904\
    },\
    "processing_phase": {\
      "status": "complete"\
    }\
  }\
}\
\
// An interrupted ig container creation, from here you can resume your upload in step 2 with offset=50002.\
{\
  "id": "<IG_MEDIA_CONTAINER_ID>",\
  "status": "Published: Media has been successfully published.",\
  "status_code": "PUBLISHED",\
  "video_status": {\
    "uploading_phase": {\
      "status": "in_progress",\
      "bytes_transferred": 50002\
    },\
    "processing_phase": {\
      "status": "not_started"\
    }\
  }\
}\
```\
\
On This Page\
\
[Upload Video to Meta Servers](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#upload-video-to-meta-servers)\
\
[Create a container](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#create-a-container)\
\
[Basic example request](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#basic-example-request)\
\
[Sample response](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#sample-response)\
\
[Upload the Video](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#upload-the-video)\
\
[Step 3: (Carousel Only) Create Carousel Containers](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-3---carousel-only--create-carousel-containers)\
\
[Step 4: Publish the Media](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-4--publish-the-media)\
\
[Step 5: Get Media Status](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/#step-5--get-media-status)\
\
Allow the use of cookies by Facebook on this browser?\
\
We use cookies and similar technologies to help provide and improve content on [Meta Products](https://www.facebook.com/help/1561485474074139). We also use them to provide a safer experience by using information we receive from cookies on and off Facebook, and to provide and improve Meta Products for people who have an account.\
\
- Essential cookies: These cookies are required to use Meta Products and are necessary for our sites to work as intended.\
- Cookies from other companies: We use these cookies to show you ads off of Meta Products and to provide features like maps and videos on Meta Products. These cookies are optional.\
\
You have control over the optional cookies we use. Learn more about cookies and how we use them, and review or change your choices at any time in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).\
\
* * *\
\
## About cookies\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_1.png)\
\
What are cookies?\
\
Learn more\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_2.png)\
\
Why do we use cookies?\
\
Learn more\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_3.png)\
\
What are Meta Products?\
\
Learn more\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_4.png)\
\
Your cookie choices\
\
Learn more\
\
* * *\
\
## Cookies from other companies\
\
We use cookies from [other companies](https://www.facebook.com/privacy/policies/cookies/?annotations[0]=explanation%2F3_companies_list) in order to show you ads off of our Products, and provide features like maps, payment services and video.\
\
How we use these cookies\
\
We use cookies from other companies on our Products:\
\
- To show you ads about our Products and features on other companies’ apps and websites.\
- To provide features on our Products such as maps, payment services and video.\
- For analytics.\
\
If you allow these cookies\
\
- Features you use on Meta Products will not be affected.\
- We'll be able to better personalize ads for you off of Meta Products, and measure their performance.\
- Other companies will receive information about you by using their cookies.\
\
If you don't allow these cookies\
\
- Some features on our products may not work.\
- We won't use cookies from other companies to personalize ads for you off of Meta products, or measure their performance.\
\
## Other ways you can control your information\
\
Manage your ad experience in Accounts Center\
\
You can manage your ad experience by visiting the following settings.\
\
Ad preferences\
\
In your ad preferences you can choose whether we show you ads and make choices about the information used to show you ads.\
\
Ad settings\
\
If we show you ads, we use data that advertisers and other partners provide us about your activity off Meta Company Products, including websites and apps, to show you better ads. You can control whether we use this data to show you ads in your [ad settings](https://www.facebook.com/settings/ads/).\
\
More information about online advertising\
\
You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAW2PAKa-cjZE_p2X5bwbo4VuPE-7pDO0RF8vnmVgXUTuy8RaM3YUyDazWqhQNGqJjgI0mLDTLqr331QwmgItTURdCkfGxlcyXMsYxb6RW5yxpZbaqP9TUrbz3EEZkEAABRHMh0BpRnfw) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDfRrEIcOac9khkyyK4LCcRl2fe8l0rNTuf3yTv9cxoohLaejZF3BD4n-lSb44cn1Z-6MTrjlHOUzV6lfe1KepDOlj25apzZG-Z51KUJ0f7UNe5X_6roXfVN6x-Bnz4aMZ1KnroLGP6iw) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAsDjnCIfO2kwniSjV2ar5-z5BFumsaC9A-k_IYdk3RNvxX2dw-WJHcm_tyC1tL3J_n7sYv9sHLyoF8MP9KwV0AXz0kvlqyLRdcwtpzpmJ3ejjM6f8cI32uGx1KAzYWBr-cZlAm1jFsYg) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.\
\
Controlling cookies with browser settings\
\
Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.\
\
- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUB0JsT1Bh6xE-RfZhX4nPiukWVlc_ts0LCdkZC2td6elP_Yv11lE9_7AYL6nEgZQnVvZIbrUC2mWW17YRnHQhAgXeHddzC1LWzhu_517G0KcfxIZoE462yAN6gmkVFLViMDKQ1eUhf-ZQ)\
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDVfkMrNMKpnC2__lDpsT3wcuWBSN0ODJ0BCeeeBSJ4s4di1myWIQv2UJhXt7cViAWx3CVZjjrn4WtojTTMVzC0FpVnQaLPVQhO38l4lH_25EKv3CLrblhmegscY99K-K1GqJT6X9mZ-A)\
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUChXNfHCVck1BYUqp_3Ihvu2SI3A3Ij2iEtn9Ifsj1HFPHuViGhYomfJsyjLUAQpA0cnRJe3PVQV7zsggqIz6Mt2VnldZC6wi-ouMj_on-Ohd_-FWEntUD8qm22nTnf0awhybOhndq8iQ)\
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCbZn5mHPWGxPmVw1AE5nsUvZIuVPd7HZzUVmqUvYqL50TYIjNcYUpVsPZYe_L670I9bMu5o4oPfkfWD-nJ9rK9mdT4a7pg7QMmpSOoBXNMLPEBSdN7fsSIocEu7qlJeizBtOFKspbmHg)\
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUCPVOJCOLpUHhOQQh1QzflXGTfYSQU1tBeLz86FNoYj9PkJZWPGxGAxsThOo6ikerlWJYKi0Fw9y13WWDaCAv61R4K9gbD1Kf65m_klAk8OByo5wO70g3Asfr32lpEGsAZi8j99GW8hqw)\
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUCLDvO__Tu4uhBpkniammCfdCi34rP1jc8R4HehFGcbSppyj8UdZ7e0KhUY1xbSFSZUPLQI6uzZn2zrcgqLwGpkOwbYYW2PM6pC0auBiE6L-pia3rt3-RzUflWx2Uxeq4CzS2ffJIzLbw)\
\
Decline optional cookiesAllow all cookies\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_1.png)\
\
## What are cookies?\
\
Cookies are small pieces of text that are used to store and receive identifiers on a web browser. We use cookies and similar technologies to offer Meta Products and understand information we receive about users, like their activity on other websites and apps.\
\
If you don't have an account, we don't use cookies to personalize ads for you, and activity we receive will be used only for the security and integrity of our Products.\
\
Learn more about cookies and the similar technologies we use in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_2.png)\
\
## Why do we use cookies?\
\
Cookies help us provide, protect and improve the Meta Products, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.\
\
While the cookies that we use may change from time to time as we improve and update the Meta Products, we use them for the following purposes:\
\
- Authentication to keep users logged in\
- To ensure security, site and product integrity\
- To provide advertising, recommendations, insights and measurement, if we show you ads\
- To provide site features and services\
- To understand our Products' performance\
- To enable analytics and research\
- On third-party websites and apps to help companies that incorporate Meta technologies to share information with us about activity on their apps and websites.\
\
Learn more about cookies and how we use them in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_3.png)\
\
## What are Meta Products?\
\
Meta Products include the Facebook, Instagram and Messenger apps, and any other features, apps, technologies, software or services offered by Meta under our Privacy Policy.\
\
You can learn more about [Meta Products in our Privacy Policy](https://www.facebook.com/privacy/policy/?annotations[0]=0.ex.0-WhatProductsDoesThis&entry_point=cookie_consent_modal_what_are_meta_products).\
\
![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_4.png)\
\
## Your cookie choices\
\
You have control over optional cookies we use:\
\
- Our cookies on other apps and websites owned by companies that use Meta technologies, such as the Like button and Meta Pixel, can be used to personalize your ads, if we show you ads.\
- We use cookies from other companies to show you ads off of Meta Products, and to provide features like maps and video on Meta Products.\
\
You can review or change your choices at any time in your Cookies settings.