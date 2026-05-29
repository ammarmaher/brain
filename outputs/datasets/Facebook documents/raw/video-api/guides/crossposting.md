---
url: https://developers.facebook.com/docs/video-api/guides/crossposting
title: Crossposting - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fguides%2Fcrossposting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Crosspost a Video](https://developers.facebook.com/docs/video-api/guides/crossposting#crosspost-a-video)

[Get Video Crossposting Eligibility](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-eligibility)

[Get Video Crossposting Status](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-status)

[Get a List of Pages Eligible for Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting#get-a-list-of-pages-eligible-for-crossposting)

[Enable Crossposting to All Your Business Manager Pages](https://developers.facebook.com/docs/video-api/guides/crossposting#enable-crossposting-to-all-your-business-manager-pages)

[Insights](https://developers.facebook.com/docs/video-api/guides/crossposting#insights)

[See Also](https://developers.facebook.com/docs/video-api/guides/crossposting#see-also)

# Crosspost a Video

This document explains how to use the Video API to publish a video on multiple Pages without uploading the video to each [Page](https://developers.facebook.com/docs/graph-api/reference/page). For example, if you have a parent Page with several child Pages, you can upload and publish a video to the parent Page then publish the [Video](https://developers.facebook.com/docs/graph-api/reference/video) to all child Pages without having to upload the video to each Page.

To crosspost a [Video](https://developers.facebook.com/docs/graph-api/reference/video), you must be able to perform to the [`CREATE` task](https://developers.facebook.com/docs/pages/overview#tasks) on the Pages and [enable the Video to be published to specific Pages](https://developers.facebook.com/docs/video-api/guides/crossposting#step-1--enable-crossposting). You will need the ID of the Video and the ID's of the Pages where you want to publish the Video as well as Page access tokens from the Page where the Video was originally published and the Pages where you want to publish.

You can use the API to determine if a Video is already [eligible for crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-eligibility) or [a crossposted video](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-status), how to [enable crossposting to all Pages managed by your Business Manager](https://developers.facebook.com/docs/video-api/guides/crossposting#enable-crossposting-to-all-your-business-manager-pages), and to [get a list of Pages you can crosspost to](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-status).

Visit our [**Reels Publishing guide**](https://developers.facebook.com/docs/video-api/guides/reels-publishing) for informtion about crossposting a reel to a collaborator's Facebook Page.

### Limitations

If a video has been crossposted to your Page but you do not have a [Role on the Page](https://developers.facebook.com/docs/pages/overview#tasks) where the video was originally published, you cannot change any Permissions of the Video.

### Step 1. Enable Crossposting

To publish a Video to multiple Pages you must enable crossposting of the Video to these Pages.

You will need:

- The ID of the Video you want to crosspost
- IDs of Pages where you want to publish the Video
- A Page access token of the Page where the Video was originally published
- The [`publish_video` Permission](https://developers.facebook.com/docs/permission/reference/publish_video)
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

Send a `POST` request to the [Video](https://developers.facebook.com/docs/graph-api/reference/video) endpoint:

```http
POST /{api-version}/{video-id}
  ?allow_crossposting_for_pages=[{page_id:{page-a-id},allow:true},{page_id:{page-b-id},allow:true}]
  &access_token={page-access-token}
```

Include the following parameters:

| Parameter Name | Value |
| --- | --- |
| `allow_crossposting_for_pages` | A JSON array of Page IDs where you want to publish the video. Set `allow` to `true` to enable publishing or `false` to disable publishing. |
| `access_token` | The Page access token of the Page where the video was originally published. |

#### Sample Request

```curl
curl -X POST \
  "https://graph.facebook.com/v7.0/2918040388250909" \
  -F "allow_crossposting_for_pages=[{page_id:104371193424796,allow:true},{page_id:115969103185286",allow:true}] \
  -F "access_token=EAABkW..."
```

#### Sample Response

```json
{
  "success": true
}
```

### Step 2. Crosspost the Video

You will need:

- The ID of the Video you want to crosspost
- The ID of the Page where you want to publish the Video
- A Page access token of the Page where you want the Video published
- The [`publish_video` Permission](https://developers.facebook.com/docs/permission/reference/publish_video)
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

Send a `POST` request to the [Page Videos](https://developers.facebook.com/docs/graph-api/reference/page/videos) endpoint:

```http
POST /{api-version}/{page-id}/videos
    ?crossposted_video_id={video-id}
    &access_token={page-access-token}
```

Include the following parameters:

| Parameter Name | Value |
| --- | --- |
| `crossposted_video_id` | The video ID of the Video you are crossposting. |
| `access_token` | The Page access token of the Page where you are publishing the video. |

#### Sample Request

```curl
curl -X POST \
  "https://graph.facebook.com/104371193424796/videos?crossposted_video_id=2918040388250909&access_token=EAABk..."
```

#### Sample JSON Response

```code
{
  "id":"577600939847873"
}
```

## Get Video Crossposting Eligibility

To determine if a Video is eligible to be crossposted, send a `GET` request to the Video endpoint with the `is_crossposting_eligible` field.

You will need:

- The ID of the Video you want to crosspost
- A Page access token of the Page where the Video was originally published
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

```http
GET /{api-version}/{video-id}
   ?fields=is_crossposting_eligible
   &access_token={page-access-token}
```

#### Sample Request

```curl
curl -X GET \
  "https://graph.facebook.com/v7.0/2918040388250909" \
  -F "is_crossposting_eligible" \
  -F "access_token=EAABkW..."
```

#### Sample Response

```json
{
  "is_crossposting_eligible": true,
  "id": "2918040388250909"
}
```

| Parameter Name | Value |
| --- | --- |
| `is_crossposting_eligible` | Displays if the Video is enabled to be crossposted. |
| `access_token` | The Page access token of the Page where the Video was originally published. |

## Get Video Crossposting Status

To determine if the Video is a crossposted Video, send a `GET` request to the Video endpoint with the `is_crosspost_video` field.

You will need:

- The ID of the Video you want to check
- A Page access token of the Page where the video was originally published
- The [`publish_video` Permission](https://developers.facebook.com/docs/permission/reference/publish_video)
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

```http
GET /{api-version}/{video-id}
  ?fields=is_crosspost_video
  &access_token={page-access-token}
```

Include the following parameters

| Parameter Name | Value |
| --- | --- |
| `is_crosspost_video` | Displays if the Video is the original or is a crossposted Video. |
| `access_token` | The Page access token of the Page where the Video was originally published. |

#### Sample Request

```curl
curl -X GET \
 "https://graph.facebook.com/v7.0/577600939847873?fields=is_crosspost_video&access_token=EAABk..."
```

#### Sample Response

```json
{
  "is_crosspost_video": true,
  "id": "577600939847873"
}
```

## Get a List of Pages Eligible for Crossposting

You will need:

- The ID of the Page where the Video was originally published
- A Page access token of the Page where the Video was originally published
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

Send a `GET` request to the [Page CrosspostWhitelistedPages endpoint](https://developers.facebook.com/docs/graph-api/reference/page/crosspost_whitelisted_pages/).

```http
GET {page-id}/crosspost_whitelisted_pages
  &access_token={page-access-token}
```

#### Sample Request

```code
curl -X GET \ "https://graph.facebook.com/v7.0/2918040388250909/crosspost_whitelisted_pages&access_token=EAABk..."
```

#### Sample Response

```code
{
  "crosspost_whitelisted_pages": {
    "data": [\
      {\
        "name": "Obsession, by Margaret",\
        "id": "115969103185286"\
      },\
      {\
        "name": "Cisco Dog",\
        "id": "422575694827569"\
      }\
    ],
    "paging": {
      "cursors": {
        "before": "QVFIUn...",
        "after": "QVFIUk4..."
      }
    }
  },
  "id": "1353269864728879"
}
```

## Enable Crossposting to All Your Business Manager Pages

To enable crossposting to all Pages managed by your Business Manager, send a `POST` request to the [Video](https://developers.facebook.com/docs/graph-api/reference/video) endpoint.

You will need:

- The ID of the Video you want to crosspost
- A Page access token of the Page where the Video was originally published
- The [`pages_manage_posts` Permission](https://developers.facebook.com/docs/permission/reference/pages_manage_posts)
- The [`pages_read_engagement` Permission](https://developers.facebook.com/docs/permission/reference/pages_read_engagement)

```http
POST /{api-version}/{video-id}
  ?allow_bm_crossposting=true
  &access_token={page-access-token}
```

Include the following parameters

| Parameter Name | Value |
| --- | --- |
| `allow_bm_crossposting` | Set `allow` to true to enable publishing or false to disable publishing. |
| `access_token` | The Page access token of the Page where the video was originally published. |

#### Sample Request

```curl
curl -X POST \
  "https://graph.facebook.com/v7.0/2918040388250909?allow_bm_crossposting=true&access_token=EAABkW..."
```

#### Sample Response

```json
{
  "success": true
}
```

## Insights

Each crossposted Video has its own unique `video_id`. You can see [video insights](https://developers.facebook.com/docs/video-api/guides/insights) from each Video and Page.

## See Also

For more information about crossposting, visit our [Help Center](https://www.facebook.com/help/publisher/1385580858214929).

On This Page

[Crosspost a Video](https://developers.facebook.com/docs/video-api/guides/crossposting#crosspost-a-video)

[Get Video Crossposting Eligibility](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-eligibility)

[Get Video Crossposting Status](https://developers.facebook.com/docs/video-api/guides/crossposting#get-video-crossposting-status)

[Get a List of Pages Eligible for Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting#get-a-list-of-pages-eligible-for-crossposting)

[Enable Crossposting to All Your Business Manager Pages](https://developers.facebook.com/docs/video-api/guides/crossposting#enable-crossposting-to-all-your-business-manager-pages)

[Insights](https://developers.facebook.com/docs/video-api/guides/crossposting#insights)

[See Also](https://developers.facebook.com/docs/video-api/guides/crossposting#see-also)