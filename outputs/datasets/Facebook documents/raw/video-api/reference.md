---
url: https://developers.facebook.com/docs/video-api/reference
title: Reference - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Freference%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Error Codes](https://developers.facebook.com/docs/video-api/reference/error-codes)

On This Page

[Reference](https://developers.facebook.com/docs/video-api/reference#reference)

[Video Specifications](https://developers.facebook.com/docs/video-api/reference#video-specifications)

[Video Settings](https://developers.facebook.com/docs/video-api/reference#video-settings)

[Audio Settings](https://developers.facebook.com/docs/video-api/reference#audio-settings)

[Endpoints](https://developers.facebook.com/docs/video-api/reference#endpoints)

[Groups](https://developers.facebook.com/docs/video-api/reference#groups)

[Pages](https://developers.facebook.com/docs/video-api/reference#pages)

[Users](https://developers.facebook.com/docs/video-api/reference#users)

[Video](https://developers.facebook.com/docs/video-api/reference#video)

# Reference

## Video Specifications

### Video Settings

**Aspect Ratio**: 9x16, 16x9

**Formats**:
3g2, 3gp, 3gpp, asf, avi, dat, divx, dv, f4v, flv, gif, m2ts, m4v, mkv, mod, mov, mp4, mpe, mpeg, mpeg4, mpg, mts, nsv, ogm, ogv, qt, tod, ts, vob, and wmv.

### Audio Settings

**Sample Rate**: 48 kHz

**Channel Layout**: Stereo or Mono

**Codec**: AAC

**Bit Rate**: up to 256 kbps

## Endpoints

### Groups

| Endpoint | Description |
| --- | --- |
| [`GET /{group-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/group/videos#reading) | Get a list of Videos on a Group. |
| [`POST /{group-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/group/videos#creating) | Create or crosspost a Video on a Group. |

### Pages

| Endpoint | Description |
| --- | --- |
| [`GET /{page-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/page/videos#reading) | Get a list of Videos on a Page. |
| [`POST /{page-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/page/videos#creating) | Create or crosspost a Video on a Page. |

### Users

| Endpoint | Description |
| --- | --- |
| [`GET /{user-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/user/videos) | Get a list of Videos of a User. |

### Video

| Endpoint | Description |
| --- | --- |
| [`GET /{video-id}`](https://developers.facebook.com/docs/graph-api/reference/video#reading) | Get fields and edges on a published Video. |
| [`GET /{video-id}/captions`](https://developers.facebook.com/docs/graph-api/reference/video/captions) | Get VideoCaptions on a Video. |
| [`GET /{video-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/video/comments) | Get VideoComments on a Video. |
| [`GET /{video-id}/crosspost_shared_pages`](https://developers.facebook.com/docs/graph-api/reference/video/crosspost_shared_pages) | Get a list of Pages this Video is being shared to. |
| [`GET /{video-id}/likes`](https://developers.facebook.com/docs/graph-api/reference/video/likes) | Get Likes on a Video. |
| [`GET /{video-id}/poll_settings`](https://developers.facebook.com/docs/graph-api/reference/video/poll_settings) | Get VideoPollSettings on a Video. |
| [`GET /{video-id}/polls`](https://developers.facebook.com/docs/graph-api/reference/video/polls) | Get VidoePolls on a Video. |
| [`GET /{video-id}/shared_posts`](https://developers.facebook.com/docs/graph-api/reference/video/sharedposts) | Get VideoSharedPosts on a Video. |
| [`GET /{video-id}/sponsor_tags`](https://developers.facebook.com/docs/graph-api/reference/video/sponsor_tags) | Get VideoSponsorTags on a Video. |
| [`GET /{video-id}/tags`](https://developers.facebook.com/docs/graph-api/reference/video/tags) | Get VideoTags on a Video. |
| [`GET /{video-id}/thumbnails`](https://developers.facebook.com/docs/graph-api/reference/video/thumbnails) | Get VideoThumbnails on a Video. |
| [`GET /{video-id}/video_insights`](https://developers.facebook.com/docs/graph-api/reference/video/video_insights) | Get VideoInsights on a Video. |
| [`POST /{video-id}`](https://developers.facebook.com/docs/graph-api/reference/video#Creating) | Create or update fields and edges on a published Video. |
| [`POST /{video-id}/captions`](https://developers.facebook.com/docs/graph-api/reference/video/captions#Updating) | Update VideoCaptions on a Video. |
| [`POST /{video-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/video/comments#Creating) | Create VideoComments on a Video. |
| [`POST /{video-id}/polls`](https://developers.facebook.com/docs/graph-api/reference/video/polls#Creating) | Create VideoPolls on a Video. |
| [`POST /{video-id}/thumbnails`](https://developers.facebook.com/docs/graph-api/reference/video/thumbnails#Creating) | Create VideoThumbnails on a Video. |
| [`DELETE /{video-id}`](https://developers.facebook.com/docs/graph-api/reference/video#Deleting) | Delete a published Video. |
| [`DELETE /{video-id}/captions`](https://developers.facebook.com/docs/graph-api/reference/video/captions#Deleting) | Delete VideoCaptions on a Video. |

On This Page

[Reference](https://developers.facebook.com/docs/video-api/reference#reference)

[Video Specifications](https://developers.facebook.com/docs/video-api/reference#video-specifications)

[Video Settings](https://developers.facebook.com/docs/video-api/reference#video-settings)

[Audio Settings](https://developers.facebook.com/docs/video-api/reference#audio-settings)

[Endpoints](https://developers.facebook.com/docs/video-api/reference#endpoints)

[Groups](https://developers.facebook.com/docs/video-api/reference#groups)

[Pages](https://developers.facebook.com/docs/video-api/reference#pages)

[Users](https://developers.facebook.com/docs/video-api/reference#users)

[Video](https://developers.facebook.com/docs/video-api/reference#video)