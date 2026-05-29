---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes/
title: Error Codes - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Ferror-codes%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Error Codes](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes)
  - [Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token)
  - [IG Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment)
  - [IG Container](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container)
  - [IG Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search)
  - [IG Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag)
  - [IG Media](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media)
  - [IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user)
  - [/me](https://developers.facebook.com/docs/instagram-platform/reference/me)
  - [Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize)
  - [Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page)
  - [Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)

- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Error Codes](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes/#error-codes)

# Error Codes

This document describes the error messages that can be returned by the Instragram API. The sample response below shows an example of code `3600` and subcode `2207004` with the subsequent error codes defined.

### Sample Response

```json
{
  "error":
    {
      "message": "The image size is too large.",
      "type": "OAuthException",
      "code": 36000,
      "error_subcode": 2207004,
      "is_transient": false,
      "error_user_title": "Image size too large",
      "error_user_msg": "The image is too large to download. It should be less than 8 MiB.",
      "fbtrace_id": "A6LJylpZRKw2xKLFsAP-cJh"
   }
 }
```

### Error Codes Defined

| HTTP Status Code | Code | Subcode | User Message | Recommended Solution |
| --- | --- | --- | --- | --- |
| `400` | `-2` | `2207003` | `It takes too long to download the media.` | A timeout occured while downloading the media. Try again. |
| `400` | `-2` | `2207020` | `The media you are trying to access has expired. Please try to upload again.` | Generate a new container ID and use it to try again. |
| `400` | `-1` | `2207001` |  | Instagram server error. Try again. |
| `400` | `-1` | `2207032` | `Create media fail, please try to re-create media` | Failed to create a media container. Try again. |
| `400` | `-1` | `2207053` | `unknown upload error` | An unknown error occured during upload. Generate a new container and use it to try again. This should only affect video uploads. |
| `400` | `1` | `2207057` | `Thumbnail offset must be greater than or equal to 0 and less than video duration, i.e.` {video-length} | The thumbnail offset you entered is out of bounds for the video duration. Add the right offset in milliseconds. |
| `400` | `4` | `2207051` | `We restrict certain activity to protect our community. Tell us if you think we made a mistake.` | The publishing action is suspected to be spam. We restrict certain activity to protect our community. Let us know if you can determine that the publishing actions is not spam. |
| `400` | `9` | `2207042` | `You reached maximum number of posts that is allowed to be published by Content Publishing API.` | The app user has reached their daily publishing limit. Advise the app's user to try again the following day. |
| `400` | `24` | `2207006` | `The media with` {media-id} `cannot be found` | Possible permission error due to missing permission or expired token. Generate a new container and use it to try again. |
| `400` | `24` | `2207008` | `The media builder with creation id =` {creation-id} `does not exist or has been expired.` | Temporary error publishing a container. Try again 1–2 times in the next 30 seconds to 2 minutes. If unsuccessful, generate a new container ID and use it to try again. |
| `400` | `25` | `2207050` | `The Instagram account is restricted.` | The app user's Instagram Professional account is inactive, checkpointed, or restricted. Advise the app user to sign in to the Instagram app and complete any actions the app requires to re-enable their account. |
| `400` | `100` | `2207023` | `The media type` {media-type} `is unknown.` | The media type entered is not one of the [expected media types](https://developers.facebook.com/docs/instagram-api/reference/ig-media#fields). Please enter the correct one. |
| `400` | `100` | `2207028` | `Your post won't work as a carousel. Carousels need at least 2 photos/videos and no more than 10 photos/videos.` | Try again using an acceptable number of photos/videos. |
| `400` | `100` | `2207035` | `Product tag positions should not be specified for video media.` | Videos do not support X/Y coordinates. Disallow X/Y coordinates with videos. |
| `400` | `100` | `2207036` | `Product tag positions are required for photo media.` | Image product tags must include X/Y coordinates. Require X/Y coordinates for images. |
| `400` | `100` | `2207037` | `We couldn't add all of your product tags. The product ID may be incorrect, the product may be deleted, or you may not have permission to tag the product.` | One or more of the products being used to tag the item is invalid (deleted, rejected, app user lacks permission, product ID is invalid, etc.). Get the app user's catalogs and eligible products again and allow the app user to only use those product IDs when tagging. |
| `400` | `100` | `2207040` | `Cannot use more than` {max-tag-count} `tags per created media.` | The app user exceeded the maximum number (20) of @ tags. Advise user to use fewer @ tags. |
| `400` | `352` | `2207026` | `The video format is not supported. Please check spec for supported` {video} `format` | Unsupported video format. Advise the app user to upload an MOV or MP4 (MPEG-4 Part 14). See [Video Specifications](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#video-specifications). |
| `400` | `9004` | `2207052` | `The media could not be fetched from this uri:` {uri} | The media could not be fetched from the supplied URI. Advise the app user to make sure the URI is valid and publicly available. |
| `400` | `9007` | `2207027` | `The media is not ready for publishing, please wait for a moment` | [Check the container status](https://developers.facebook.com/docs/instagram-api/reference/ig-container#fields) and publish when its status is `FINISHED`. |
| `400` | `36000` | `2207004` | `The image is too large to download. It should be less than` {size}`.` | Image exceeded maximum file size of 8MiB. Advise the user to try again with a smaller image. |
| `400` | `36001` | `2207005` | `The image format` {current-image-format} `is not supported. Supported formats are:` {format}`.` | Possible permission error due to missing permission or expired token. Generate a new container and use it to try again. |
| `400` | `36003` | `2207009` | `The submitted image with aspect ratio` {submitted-ratio} `cannot be published. Please submit an image with a valid aspect ratio.` | The image's aspect ratio does not fall within our acceptable range. Advise the app user to try again with an image that falls withing a 4:5 to 1.91:1 range. |
| `400` | `36004` | `2207010` | `The submitted image's caption was` {submitted-caption-length} `characters long. The maximum number of characters permitted for a caption is` {maximum-caption-length}. `Please submit media with a shorter caption.` | The user exceeded the maximum amount of characters for a caption. Advise user to use a shorter caption. Maximum 2,200 characters, 30 hashtags, and 20 @ tags. |

On This Page

[Error Codes](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes/#error-codes)