---
url: https://developers.facebook.com/docs/video-api/guides/slideshows
title: Slideshows - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fguides%2Fslideshows%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Publish a Slideshow on a Facebook Page](https://developers.facebook.com/docs/video-api/guides/slideshows#publish-a-slideshow-on-a-facebook-page)

[Create A Slideshow](https://developers.facebook.com/docs/video-api/guides/slideshows#create-a-slideshow)

[Image Formats](https://developers.facebook.com/docs/video-api/guides/slideshows#image-formats)

[Image Dimensions](https://developers.facebook.com/docs/video-api/guides/slideshows#image-dimensions)

[Requirements](https://developers.facebook.com/docs/video-api/guides/slideshows#requirements)

[Request Syntax](https://developers.facebook.com/docs/video-api/guides/slideshows#request-syntax)

[Required Parameters](https://developers.facebook.com/docs/video-api/guides/slideshows#required-parameters)

[Slideshow Object Properties](https://developers.facebook.com/docs/video-api/guides/slideshows#slideshow-object-properties)

# Publish a Slideshow on a Facebook Page

This guide shows you how to publish a slideshow of images on a Facebook Page using the Video API from Meta.

## Create A Slideshow

Send a `POST` request to the [Page Videos](https://developers.facebook.com/docs/graph-api/reference/page/videos) edge and include an object containing an array of image URLs to be used to construct the video. The images must be hosted on a publicly accessible server. The object should describes how long to display each image and the transition duration between images.

### Image Formats

JPG, JPEG, PNG, BMP, ICO

### Image Dimensions

If the images have different dimensions the API will crop and resize them to 600x600 pixels and create a square video. If all of the images are the same dimension the video will match that dimension.

### Requirements

- The request must include a minimum of 3 images and a maximum of 7.
- Each image must be 10MB or less.

### Request Syntax

```http
POST /v25.0/{page-id}/videos
  ?access_token={access-token}
  &slideshow_spec={slideshow-spec}
```

### Required Parameters

| Parameter | Description |
| --- | --- |
| `access_token` | A Page access token |
| `slideshow_spec` | An object containing an array of image URLs and properties that describe the video. See [Slideshow Object Properties](https://developers.facebook.com/docs/video-api/guides/slideshows#slideshow-object-properties) below. |

### Slideshow Object Properties

| Property | Description |
| --- | --- |
| `images_urls`<br>_Required_ | An array containing 3-7 URLs of images to be used in the video's construction. |
| `duration_ms` | An integer that indicates the duration in milliseconds that each image should be displayed in the video. Default value is `1750`. Value must be greater than `0`. |
| `transition_ms` | An integer indicating the duration in milliseconds of the crossfade transition between images. Default value is `250`. Value must be greater than `0`. |

#### Sample Request

```curl
curl -X POST \
  "https://graph-video.facebook.com/v25.0/1755847768034402/videos" \
  -F "access_token=EAADd..." \
  -F "slideshow_spec={ \
       "images_urls":[ \\
         'https://socialsizz...1.png', \\
         'https://socialsizz...2.png', \\
         'https://socialsizz...3.png' \\
       ], \
       "duration_ms": 5000, \
       "transition_ms": 200 \
   }"
```

Upon success the API will respond with the ID of the newly constructed [Video](https://developers.facebook.com/docs/graph-api/reference/video).

#### Sample JSON Response

```json
{
  "id":"277487313407856"
}
```

On This Page

[Publish a Slideshow on a Facebook Page](https://developers.facebook.com/docs/video-api/guides/slideshows#publish-a-slideshow-on-a-facebook-page)

[Create A Slideshow](https://developers.facebook.com/docs/video-api/guides/slideshows#create-a-slideshow)

[Image Formats](https://developers.facebook.com/docs/video-api/guides/slideshows#image-formats)

[Image Dimensions](https://developers.facebook.com/docs/video-api/guides/slideshows#image-dimensions)

[Requirements](https://developers.facebook.com/docs/video-api/guides/slideshows#requirements)

[Request Syntax](https://developers.facebook.com/docs/video-api/guides/slideshows#request-syntax)

[Required Parameters](https://developers.facebook.com/docs/video-api/guides/slideshows#required-parameters)

[Slideshow Object Properties](https://developers.facebook.com/docs/video-api/guides/slideshows#slideshow-object-properties)